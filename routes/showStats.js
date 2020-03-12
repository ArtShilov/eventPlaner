const express = require('express');
const router = express.Router();

// const path = require('path');
// const app = express();

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

const incomingVoices = [
  {date: 2, time: 1700, people: [1, 4]},
  {date: 1, time: 1700, people: [4, 4, '3', '1', '2', '3']},
  {date: 1, time: 1700, people: ['1', '2', '3', 1, 1, 1, 1]},
  {date: 1, time: 1700, people: ['1', 4, '3','1', 7, '3','1', '2', '3']},
  {date: 1, time: 1700, people: ['1', '2', '3']}
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
    arrOfCountVotedPeople.push({
      widthScale: numberOfPeople, 
      date: eventDate, 
      time: eventTime, 
      count: quantity
    });
  });
  return arrOfCountVotedPeople;
}

  router.get('/', (req, res) => {
    res.render('showStats', {arr});
  });

module.exports = router;
