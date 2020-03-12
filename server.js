const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const methodOverride = require("method-override");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const {userModel,eventModel} = require ('./bd')


const app = express();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

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

app.get("/", function(req, res, next) {
  // if (req.session.user) {// проверка сессии админа - дописать надо
  //   res.redirect("/admin"); ///если сессия админа то админ
  // } else {
  res.redirect("/login");
});

app.get("/login", function(req, res, next) {
  res.render("login");
});

app.post("/ok", async function(req, res, next) {
  try {
    const { name, phone } = req.body; // забирает данные с формы по name
    user = new userModel({
      name,
      phone
    });
    await user.save();
    req.session.user = user; // для сессии и куки
    res.redirect("/party");
    // res.json(true); // для fetch
  } catch (error) {
    // res.json(false)// для fetch
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
app.post("/admin", function(req, res, next) {
  // тут можно всставить проверку по админу а можно не вставлять
  res.redirect("/showParties");
});

app.post("/admin/createEvent", function(req, res, next) {// здесь создают событие 
  const days = []
  const now = new Date().getTime()
  for (let d = 0; d <= 31; d++) {
      const date = new Date(now + d*24*60*60*1000)

      const daystrt = date.getDate() + '.' + (date.getMonth()+1)
      days.push({
          day: daystrt,
          hours: new Array(24).fill(null).map( (i,k) => {
            return {h:(k+1), day: daystrt}
          } )
      })
  }
  const  hour = (new Array(24).fill(null).map( (i,k) => k+1 ))
   res.render("createEvent", {days : days , hour : hour });
});

app.get("/showParties",async function(req, res, next) {// ПОКАЗЫВАЕТ ВСЕ СОБЫТИЯ

  const events = await eventModel.find()

  res.render("showParties", {events : events}); 
});


app.post("/showParties", async function(req, res, next) {
  await Event.create({
    name: req.body.name,
    description: req.body.description,
    time: []
  });
  res.redirect("/thankAdmin");
});

app.get("/admin/:id",async function(req, res, next) { // ЗДЕСЬ СТАТИСТИКА 

  const eventNowArr = await eventModel.find(req.params._id)
  const eventNow = eventNowArr[0];
  res.render("eventNow",{eventNow : eventNow} );
});

app.get("/delete/:id",async function(req, res, next) { // ЗДЕСЬ delete event 

  const eventNowArr = await eventModel.deleteOne(req.params._id)
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
