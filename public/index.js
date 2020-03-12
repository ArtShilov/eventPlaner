const User = require ('../models/usersModel') // путь к модели 
const Event = require ('../models/eventModel')// путь к модели 


router/* или app */.post('/register'/* ручка */,async function(req,res,next){
  try {
    const { name, phone } = req.body;// забирает данные с формы по name
    const user = new User({
      name,
      phone
    });
    await user.save();
    req.session.user = user; // для сессии и куки
    res.redirect("/");
    // res.json(true); // для fetch
  } catch (error) {
    // res.json(false)// для fetch
    next(error);
  }
  
});


router/* или app */.post("/admin"/* ручка */, async function(req, res, next) {
  
  try {
    const newEvent = new Event({ 
      name: req.body.name, 
      description: req.body.description,
      time:/* req.session.user._id */ //не знаю 
    });// передаю id пользователя

    await newEvent.save();
    res.redirect("/");
  } catch (error) {
    next(error);
  }

});
