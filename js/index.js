const form = document.querySelector("form");
const cards = document.querySelector(".row");
const loader = document.querySelector(".spinner-border");
const search = document.querySelector("form input[type='search']");
const mod = document.querySelector(".modal");

mod.onclick = function (e) {
  if (e.target.classList.contains("btn")) {
    mod.style.display = "none";
  }
};

cards.onclick = function (e) {
  if (e.target.classList.contains("btn")) {
    let per = data.results.filter((person) => {
      return person.id.value == e.target.dataset.personid;
    });
    let lat = per[0].location.coordinates.latitude;
    let lon = per[0].location.coordinates.longitude;
    let img = per[0].picture.large;

    initMap(lat, lon, img);
    mod.style.display = "block";
  }
};

form.onkeydown = function (e) {
  return e.key != "Enter";
};

search.oninput = function (e) {
  if (e.target.value.length >= 3) {
    let value = e.target.value;
    value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    render(value);
  } else render();
};

let data = [];
let buttonclass = "";

async function getData() {
  loader.style.display = "content";
  try {
    const response = await fetch("https://randomuser.me/api/?results=200");
    data = await response.json();

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
      (person) =>
        `<div class="col">
    <div class="card shadow-sm" style="width: 18rem">
    <img src="${person.picture.large}" class="card-img-top" alt="" />
    <div class="card-body">
      <h5 class="card-title">${person.name.first} ${person.name.last}</h5>
      <p class="card-text">
      ${person.location.street.name} ${person.location.street.number} </br> ${
          person.location.postcode
        } ${person.location.city} </br>
      ${person.location.country}
      </p>
      <p class="card-text">
      <a href="mailto:${person.email}"> ${person.email}</a>  
      </p>
      <button type="button" class="btn btn-outline-${
        person.id.value == null ? "danger disabled" : "info"
      }" data-personid="${person.id.value}">See location</button>
      </div>
    </div>
  </div>`
    )
    .join("");
  loader.style.display = "none";
}

getData();

let map;

function initMap(lat = 0, lon = 0, img) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(lat, lon),
    zoom: 5,
  });

  const image = {
    url: img,
    scaledSize: new google.maps.Size(50, 50),
  };
  const Marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lon),
    map,
    icon: image,
  });
}
