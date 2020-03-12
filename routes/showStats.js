const express = require('express');
const mongoose = require('mongoose');
const {userModel,eventModel} = require ('../bd');

const router = express.Router();

mongoose.pluralize(null);
const connectionAddress = "mongodb://localhost/testGOLOSOVANI";
mongoose.connect(connectionAddress, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Ошибка соединения с MongoDB:"));

// массив от Вадима переформатируется функцией introduceData
// сохраняется в переменную arr
// и эта переменная используется с помощью render в hbs

// массив вида
// [
//   {date: x, time: x, people: [{name: x, phone: x}, {name: x, phone: x}]},
//   {date: x, time: x, people: [{name: x, phone: x}, {name: x, phone: x}]}
// ]
// переформатируется в массив вида
// [
//   {
//     widthScale: numberOfPeople, 
//     date: eventDate,
//     time: eventTime,
//     count: quantity,
//     list: allVoted
//     },
//   {
//     widthScale: numberOfPeople, 
//     date: eventDate, 
//     time: eventTime, 
//     count: quantity,
//     list: allVoted
//     }
// ]


// const arrayFromVadim = [
//   {date: 2, time: 1700, people: [{name: 'srtwft', phone: 345345}, {name: 'stdk', phone: 345345}, {name: 'dwfhst', phone: 345345}, {name: '1Atsbhrst', phone: 345345}, {name: 'rsthbrs', phone: 345345}, {name: 'rstbrs', phone: 345345}, {name: 'tkpn', phone: 345345}, {name: '2Argjgnst', phone: 345345}, {name: '3Arsgjngt', phone: 345345}, {name: 'rasdZb', phone: 345345}, {name: '2Atttrst', phone: 345345}, {name: '3arsdcArst', phone: 345345}]},
//   {date: 1, time: 1700, people: [{name: '4Arrasdwt', phone: 345345}, {name: '5Arsssst', phone: 345345}, {name: 'arsv', phone: 345345}, {name: '1Ararsdfast', phone: 345345}, {name: 'arsdvpbr', phone: 345345}, {name: 'ardsvv', phone: 345345}, {name: 'barxvh', phone: 345345}, {name: 'rsvrs', phone: 345345}, {name: 'rstAaaaa', phone: 345345}]},
//   {date: 1, time: 1700, people: [{name: '1Arst', phone: 345345}, {name: 'srttbstt', phone: 345345}, {name: 'srtbsrt', phone: 345345}, {name: 'araazaz', phone: 345345}, {name: ',;pdk,;,j', phone: 345345}, {name: 'trst', phone: 345345}]},
//   {date: 1, time: 1700, people: [{name: 'cwf', phone: 345345}, {name: '3Arsst', phone: 345345}]},
//   {date: 1, time: 1700, people: [{name: 's', phone: 345345}, {name: 'dfh', phone: 345345}, {name: '3qqrst', phone: 345345}]}
// ];

// let arr = introduceData(arrayFromVadim);

const data = eventModel
  .findOne()
  .then(async event => {
    const arrByPopularity = sortTheMostPopular(event.time);
        for (let obj of arrByPopularity){
          for (let index in obj.people){
            const documentUser = await userModel.findOne(obj.people[+index]);
            obj.people[index] = documentUser
          }
        }
  })

function sortTheMostPopular(arrAllData) {
  const arrSeparateByStepTime = [];
  arrAllData.forEach(arrDay => {
    arrDay.forEach(timeObj => {

      arrSeparateByStepTime.push(timeObj);
    });
  });
  arrSeparateByStepTime.sort((a, b) => b.people.length - a.people.length);
  return arrSeparateByStepTime;
}

function introduceData(data) {
  let sum = 0;
  const reFormatArray = [];
  arr.forEach(element => {
    sum += element.people.length;
  });
  arr.forEach(element => {
    let numberOfPeople = Math.floor(element.people.length / sum * 500);
    let eventDate = element.date;
    let eventTime = element.time;
    let quantity = element.people.length;
    let allVoted = new String();
    element.people.forEach(person => {
      allVoted += ` ${person.name}[ ${person.phone} ]`;
    });
    reFormatArray.push({
      widthScale: numberOfPeople, 
      date: eventDate, 
      time: eventTime, 
      count: quantity,
      list: allVoted
    });
  });
  return reFormatArray;
}

  router.get('/', async (req, res) => {
    await data;
    res.render('showStats', {data});
  });

module.exports = router;
