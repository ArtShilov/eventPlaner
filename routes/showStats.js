const express = require('express');
const router = express.Router();

// const path = require('path');
// const app = express();

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

const incomingVoices = [
  {date: 2, time: 1700, people: [{name: '1Arst', phone: 345345}, {name: '2Arst', phone: 345345}, {name: '3Arst', phone: 345345}]},
  {date: 1, time: 1700, people: [{name: '4Arst', phone: 345345}, {name: '5Arst', phone: 345345}, {name: '6Arst', phone: 345345}]},
  {date: 1, time: 1700, people: [{name: '1Arst', phone: 345345}, {name: '7Arst', phone: 345345}, {name: '8Arst', phone: 345345}]},
  {date: 1, time: 1700, people: [{name: '1Arst', phone: 345345}, {name: '2Arst', phone: 345345}, {name: '3Arst', phone: 345345}]},
  {date: 1, time: 1700, people: [{name: '1Arst', phone: 345345}, {name: '2Arst', phone: 345345}, {name: '3Arst', phone: 345345}]}
];

let arr = introduceData(incomingVoices);

function introduceData(arr) {
  let sum = 0;
  const arrOfCountVotedPeople = [];
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
      allVoted += `   ${person.name}[${person.phone}]   `;
    });
    arrOfCountVotedPeople.push({
      widthScale: numberOfPeople, 
      date: eventDate, 
      time: eventTime, 
      count: quantity,
      list: allVoted
    });
  });
  return arrOfCountVotedPeople;
}

  router.get('/', (req, res) => {
    res.render('showStats', {arr});
  });

module.exports = router;
