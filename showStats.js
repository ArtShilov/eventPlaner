const express = require('express');
const path = require('path');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const incomingVoices = [
  {date: 1, time: 1700, people: ['1', '2']},
  {date: 1, time: 1700, people: ['1', '2', '3']}
];

app.get('/', (req, res) => {
  res.render('showStats', {arr});
});

function renderWidth(arr) {
  const arrOfCountVotedPeople = [];
  arr.forEach(element => {
    let sum = element.people.reduce((acc, curr) => Number(acc) + Number(curr));
    let temp = Math.floor(element.people.length / sum * 500);
    arrOfCountVotedPeople.push({number: temp});
  });

  return arrOfCountVotedPeople;
}
let arr = renderWidth(incomingVoices);
console.log(arr);

app.listen(3000);
