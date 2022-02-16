const form = document.querySelector("form");
const cards = document.querySelector(".row");
const loader = document.querySelector(".spinner-border");
const search = document.querySelector("form input[type='search']");

search.oninput = function (e) {
  if (e.target.value.length >= 3) {
    let value = e.target.value;
    value = value.charAt(0).toUpperCase() + value.slice(1);
    render(value);
  } else {
    render();
  }
};

let data = [];

async function getData() {
  try {
    const response = await fetch("https://randomuser.me/api/?results=200");
    data = await response.json();
    loader.style.display = "flex";
    render();
  } catch (error) {
    console.log(error);
  }
}

async function render(str = "") {
  cards.innerHTML = data.results
    .filter(
      (person) =>
        person.name.first.indexOf(str) !== -1 ||
        person.name.last.indexOf(str) !== -1 ||
        person.location.city.indexOf(str) !== -1
    )
    .map(
      (person) => `<div class="col">
  <div class="card shadow-sm" style="width: 18rem">
    <img src="${person.picture.large}" class="card-img-top" alt="..." />
    <div class="card-body">
      <h5 class="card-title">${person.name.first} ${person.name.last}</h5>
      <p class="card-text">
      ${person.location.street.name} ${person.location.street.number} </br> ${person.location.postcode} ${person.location.city} </br>
      ${person.location.country}
      </p>
      <p class="card-text">
      <a href=" ${person.email}"> ${person.email}</a>  
      </p>
      </div>
    </div>
  </div>`
    )
    .join("");
  loader.style.display = "none";
}
getData();
