
const form = document.getElementById('adminLink');


form.addEventListener('submit', function(event){

event.preventDefault()
console.log(event.target.firstElementChild);

document.getElementById("divId").innerHTML = `login/${event.target.firstElementChild.id}`; 

});





