
const mongoose = require("mongoose"); //подключение mongoose библиотеки

const faker = require("faker");
// Отключить автоматические переименование коллекций.
mongoose.pluralize(null);

//Подключить базу данных
const connectionAddress = "mongodb://localhost/testGOLOSOVANI2"; // имя БД
mongoose.connect(connectionAddress, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); // подключение

//Проверка на ошибки
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Ошибка соединения с MongoDB:"));

//Создать схему для коллекции (КОНСТРУКТОР)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number,  required: true }
});

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  time: Array
});

//Создание коллекций(моделей) по схемам
const userModel = new mongoose.model("user", userSchema);
const eventModel = new mongoose.model("event" /* имя коллекции */,eventSchema /* схема по которой делаем коллекцию */
);



//////////////////// логика голосования KOSTIAN
// const data = eventModel
//   .findOne()
//   .then(async event => {
//     const arrByPopularity = sortTheMostPopular(event.time);
//         for (let obj of arrByPopularity){
//           for (let index in obj.people){
//             const documentUser = await userModel.findOne(obj.people[+index]);
//             obj.people[index] = documentUser
//           }
//         }
//   })

// function sortTheMostPopular(arrAllData) {
//   const arrSeparateByStepTime = [];
//   arrAllData.forEach(arrDay => {
//     arrDay.forEach(timeObj => {

//       arrSeparateByStepTime.push(timeObj);
//     });
//   });
//   arrSeparateByStepTime.sort((a, b) => b.people.length - a.people.length);
//   return arrSeparateByStepTime;
// }
///////////////////////////////////////






// async function metodSocialNetwork() {
//   let user1 = await userModel.create({
//     name: faker.name.findName(), // создание рандом имени
//     phone: 89504414551
//   });
//   let user2 = await userModel.create({
//     name: faker.name.findName(), // создание рандом имени
//     phone: 89504414552
//   });
//   let user3 = await userModel.create({
//     name: faker.name.findName(), // создание рандом имени
//     phone: 89504414553
//   });
//   let user4 = await userModel.create({
//     name: faker.name.findName(), // создание рандом имени
//     phone: 89504414554
//   });
//   let user5 = await userModel.create({
//     name: faker.name.findName(), // создание рандом имени
//     phone: 89504414555
//   });




//   let data = [
//     // Пример массива
//     [
//       {
//         date: 1,
//         time: 1700,
//         people: [user2._id, user1._id, user3._id, user4._id]
//       },
//       {
//         date: 1,
//         time: 1730,
//         people: [user2._id, user1._id]
//       },
//       {
//         date: 1,
//         time: 1800,
//         people: [user2._id, user3._id, user4._id]
//       }
//     ],
//     [
//       {
//         date: 2,
//         time: 1400,
//         people: [user2._id, user1._id, user3._id, user4._id]
//       },
//       {
//         date: 2,
//         time: 1430,
//         people: [user2._id, user1._id]
//       },
//       {
//         date: 2,
//         time: 1500,
//         people: [user2._id, user3._id, user4._id]
//       }
//     ],
//     [
//       {
//         date: 3,
//         time: 1700,
//         people: [user2._id, user1._id, user3._id, user4._id, user5._id]
//       },
//       {
//         date: 3,
//         time: 1730,
//         people: [user2._id, user1._id]
//       },
//       {
//         date: 3,
//         time: 1800,
//         people: [user2._id, user3._id, user4._id]
//       }
//     ]
//   ];

//   let post1 = await eventModel.create({
//     name: "Event",
//     description: faker.lorem.sentence(), // создание рандом текста
//     time: data
//   });

  // mongoose.disconnect();
// }

// metodSocialNetwork() // вызов функции

module.exports = {userModel,eventModel}
