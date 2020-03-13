const arrEvent = [
  [ '13.3', '1' ],
  [ '13.3', '2' ],
  [ '14.3', '1' ],
  [ '14.3', '2' ]
]

const arrEvents = [];
for (let index in arrEvent){
  const objEvent = {
    date: arrEvent[index][0],
    time: arrEvent[index][1],
    people: [],
  } 
  arrEvents.push(objEvent)
}

const arrOfDays = [];
let dayCounter = 0;
for (let objEvent of arrEvents ){
  if (arrOfDays.length === 0){
    arrOfDays.push([objEvent])
    continue
  }
  if(arrOfDays[dayCounter][0].date === objEvent.date){
    arrOfDays[dayCounter].push(objEvent)
    continue
  }
  arrOfDays.push([objEvent]);
  dayCounter++
}
console.log(arrOfDays)
