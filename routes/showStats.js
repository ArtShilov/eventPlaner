const express = require('express');
const router = express.Router();

// const path = require('path');
// const app = express();

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

const incomingVoices = [
  {date: 1, time: 1700, people: [1, 4]},
  {date: 1, time: 1700, people: [4, 4, '3', '1', '2', '3']},
  {date: 1, time: 1700, people: ['1', '2', '3', 1, 1, 1, 1]},
  {date: 1, time: 1700, people: ['1', 4, '3','1', 7, '3','1', '2', '3']},
  {date: 1, time: 1700, people: ['1', '2', '3']}
];

let arr = renderWidth(incomingVoices);

function renderWidth(arr) {
  const arrOfCountVotedPeople = [];
  let sum = 0;
  arr.forEach(element => {
    sum += element.people.length;
  });
  arr.forEach(element => {
    let temp = Math.floor(element.people.length / sum * 500);
    arrOfCountVotedPeople.push({number: temp});
  });
  
  return arrOfCountVotedPeople;
}

  router.get('/', (req, res) => {    
    res.render('showStats', {arr});
  });

module.exports = router;
