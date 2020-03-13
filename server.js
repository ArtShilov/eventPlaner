const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const methodOverride = require("method-override");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const { userModel, eventModel } = require("./bd");

const bcrypt = require("bcrypt");
const showStats = require("./routes/showStats");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());


app.use("/showStats", showStats);


app.use(
  session({
    store: new FileStore(),
    key: "user_sid",
    secret: "anything here",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: 600000,
      httpOnly: false
    }
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.use(function(req, res, next) {
  app.locals.user = req.session.user;
  next();
});
//////////////////////////// vadim
app.get("/voit/:idEvent&:idUser", async function(req, res, next) {
  const eventData = await eventModel.findOne({ _id: req.params.idEvent });
  const dates = [];
  eventData.time = eventData.time.map(element => {
    return { times: element, day: element[0].date };
  });
  res.render("chooseTimeForUser", {
    idUser: req.params.idUser,
    eventId: req.params.idEvent,
    data: eventData.time
  });
});
app.post("/voit-submit/:idEvent&:idUser", async function(req, res, next) {
  arrEvent = [];
  for (let item in req.body) {
    const arr = item.split("_");
    arrEvent.push(arr);
  }
  eventModel
    .findOne({
      _id: { $eq: req.params.idEvent }
    })
    .then(eventData => {
      for (let arrTimeData of arrEvent) {
        for (let index in eventData.time) {
          for (let secondIndex in eventData.time[+index]) {
            if (
              +eventData.time[+index][+secondIndex].time === +arrTimeData[0] &&
              +eventData.time[+index][+secondIndex].date === +arrTimeData[1]
            ) {
              eventData.time[+index][+secondIndex].people.push(
                req.params.idUser
              );
            }
          }
        }
      }
      eventData.markModified("time");
      eventData.save(err => console.log(err));
      res.render("voitThanks");
    });
});
/////////////////////////////////

app.get("/", function(req, res, next) {
  // if (req.session.user) {// проверка сессии админа - дописать надо
  //   res.redirect("/admin"); ///если сессия админа то админ
  // } else {
  res.redirect("/login");
});

app.get("/login/:idEvent", function(req, res, next) {
  res.render("login", { idEvent: req.params.idEvent });
});

app.post("/ok/:idEvent", async function(req, res, next) {
  try {
    const { name, phone } = req.body; // забирает данные с формы по name
    user = new userModel({
      name,
      phone
    });
    await user.save();
    const eventData = await eventModel.findOne({ _id: req.params.idEvent });
    const dates = [];
    eventData.time = eventData.time.map(element => {
      return { times: element, day: element[0].date };
    });
    // req.session.user = user; // для сессии и куки
    res.render("chooseTimeForUser", {
      idUser: user._id,
      eventId: req.params.idEvent,
      data: eventData.time
    });
  } catch (error) {
    next(error);
  }
});

app.get("/party", function(req, res, next) {
  newParty = { name: "Party", description: "Chayhona #1", time: [] }; // сюда всставляем описание мероприятия за которое голосуем

  res.render("party", { newParty: newParty });
});

app.post("/party", async function(req, res, next) {
  newParty.time.push(req.body.time); // Нлогика для добавления события в event
  res.render("thankyou");
});

/////////////////Админка - потом можно убрать в роутер///////////////////////////////////////

app.get("/admin", function(reg, res, next) {
  res.render("admin");
});

app.post("/admin", async function(req, res, next) {
  let data = req.body.phone;
  let name = await userModel.findOne({ name: req.body.name });

  if (name && +(/* потому что строка */ data) == name.phone) {
    req.session.user = name;
    res.redirect("/showParties");
  } else {
    res.redirect("/");
  }
});

app.use(function(req, res, next) {
  //для проверки сессии!!!
  if (!req.session.user) {
    res.redirect("/");
  } else {
    next();
  }
});

app.post("/admin/createEvent", function(req, res, next) {
  // здесь создают событие
  const days = [];
  const now = new Date().getTime();
  for (let d = 0; d <= 31; d++) {
    const date = new Date(now + d * 24 * 60 * 60 * 1000);

    const daystrt = date.getDate() + "." + (date.getMonth() + 1);
    days.push({
      day: daystrt,
      hours: new Array(24).fill(null).map((i, k) => {
        return { h: k + 1, day: daystrt };
      })
    });
  }
  const hour = new Array(24).fill(null).map((i, k) => k + 1);
  res.render("createEvent", { days: days, hour: hour });
});

app.get("/showParties", async function(req, res, next) {
  // ПОКАЗЫВАЕТ ВСЕ СОБЫТИЯ

  const events = await eventModel.find();

  res.render("showParties", { events: events });
});

app.get("/admin/:id", async function(req, res, next) {
  // ЗДЕСЬ СТАТИСТИКА

  const eventNowArr = await eventModel.find(req.params._id);
  const eventNow = eventNowArr[0];
  res.render("eventNow", { eventNow: eventNow });
});

app.get("/delete/:id", async function(req, res, next) {
  // ЗДЕСЬ delete event

  const eventNowArr = await eventModel.deleteOne(req.params._id);
  res.redirect("/showParties");
});

app.post("/createEventDB", async function(req, res, next) {
  // ЗДЕСЬ добавляет в базу event
  arrEvent = [];
  for (let item in req.body) {
    if (item.toString() == "name" || item.toString() == "description") {
      continue;
    } else {
      const arr = item.replace(/`/gi, "").split("_");
      arrEvent.push(arr);
    }
  }
  console.log(arrEvent);

  const arrEvents = [];
  for (let index in arrEvent) {
    const objEvent = {
      date: arrEvent[index][0],
      time: arrEvent[index][1],
      people: []
    };
    arrEvents.push(objEvent);
  }

  const arrOfDays = [];
  let dayCounter = 0;
  for (let objEvent of arrEvents) {
    if (arrOfDays.length === 0) {
      arrOfDays.push([objEvent]);
      continue;
    }
    if (arrOfDays[dayCounter][0].date === objEvent.date) {
      arrOfDays[dayCounter].push(objEvent);
      continue;
    }
    arrOfDays.push([objEvent]);
    dayCounter++;
  }

  const newEvent = await eventModel.create({
    name: req.body.name,
    description: req.body.description,
    time: arrOfDays
  });

  // console.log(arrEvent)

  // let name = req.body.name;
  // let description = req.body.description;
  // let arrayEvent =[];
  // console.log(name);
  // console.log(description);
  // // console.log(aaa);

  // for(key in req.body){
  //   if (key != 'name') {
  //     if (key != 'description') {
  //       // console.log(key.split('_') );
  //     }
  //   }

  // }

  res.redirect("/showParties");
});

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
