const form = document.querySelector("form");
const cards = document.querySelector(".row");
const loader = document.querySelector(".spinner-border");
const search = document.querySelector("form input[type='search']");
const mod = document.querySelector(".modal");
const buttonAll = document.querySelector("#btnall");

buttonAll.onclick = function (e) {
  const locations = data.results
    .filter((person) => person.id.value !== null)
    .reduce((acc, person) => {
      acc.push([
        person.name.first + " " + person.name.last,
        person.location.coordinates.latitude,
        person.location.coordinates.longitude,
        person.picture.large,
      ]);

      return acc;
    }, []);
  map(locations);
  mod.style.display = "block";
};

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

    const locations = [
      [
        per[0].name.first + " " + per[0].name.last,
        per[0].location.coordinates.latitude,
        per[0].location.coordinates.longitude,
        per[0].picture.large,
      ],
    ];

    map(locations, 5);
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

async function getData() {
  loader.style.display = "block";
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

function map(locations, zoom = 3) {
  let map = new google.maps.Map(document.getElementById("map"), {
    zoom: zoom,
    center: new google.maps.LatLng(locations[0][1], locations[0][2]),
  });

  let infowindow = new google.maps.InfoWindow();

  let marker, i;

  for (i = 0; i < locations.length; i++) {
    const image = {
      url: locations[i][3],
      scaledSize: new google.maps.Size(50, 50),
    };
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map,
      icon: image,
    });

    google.maps.event.addListener(
      marker,
      "click",
      (function (marker, i) {
        return function () {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        };
      })(marker, i)
    );
  }
}
