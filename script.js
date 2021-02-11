'use strict';

(function () {
  const filmsRequest = makeRequest('GET', 'https://swapi.dev/api/films/');
  filmsRequest.addEventListener('load', function () {
    const filmsDataArray = getData(this).results;

    document
      .querySelector('.select-section')
      .insertAdjacentHTML('afterbegin', renderFilms(filmsDataArray));
    document
      .querySelector('.content-section')
      .insertAdjacentHTML('afterbegin', renderStarships(filmsDataArray));

    for (let k = filmsDataArray.length, i = 0; i < k; i++) {
      for (let l = filmsDataArray[i].starships.length, j = 0; j < l; j++) {
        const url = filmsDataArray[i].starships[j];
        const starshipsRequest = makeRequest('GET', url);

        starshipsRequest.addEventListener('load', function () {
          const starshipsData = getData(this);
          document
            .querySelector(`.content-section [data-number="${i + 1}"]`)
            .insertAdjacentHTML(
              'afterbegin',
              renderStarshipsData(starshipsData)
            );
        });
      }
    }

    const buttons = document.querySelectorAll('.select-section button');
    for (const button of buttons) {
      button.addEventListener('click', function (event) {
        const eventTarget = event.target;
        const active = document.querySelector('.active');
        if (active) {
          active.classList.remove('active');
        }
        eventTarget.classList.add('active');
        const allContent = document.querySelectorAll('.content');
        for (const content of allContent) {
          if (
            content.getAttribute('data-number') ===
            button.getAttribute('data-number')
          ) {
            content.style.display = 'block';
          } else {
            content.style.display = 'none';
          }
        }
      });
    }
  });
})();

function makeRequest(requestMethod, url) {
  const request = new XMLHttpRequest();
  request.open(requestMethod, url);
  request.send();
  return request;
}

function getData(request) {
  if (request.readyState === 4 && request.status === 200) {
    return JSON.parse(request.response);
  } else {
    console.log('ooops');
  }
}

function renderFilms(filmsDataArray) {
  return filmsDataArray
    .sort((a, b) => a.episode_id - b.episode_id)
    .reduce(
      (html, film, index) =>
        (html += `<button type="button" data-number="${index + 1}">${
          film.title
        }</button>`),
      ``
    );
}
function renderStarships(filmsDataArray) {
  return filmsDataArray
    .sort((a, b) => a.episode_id - b.episode_id)
    .reduce(
      (html, _, index) =>
        (html += `<div class="content" data-number="${index + 1}"></div>`),
      ``
    );
}

function renderStarshipsData(spaceshipsObjects) {
  return `<p><span>Ship</span>: ${spaceshipsObjects.name}<br><span>Model</span>: ${spaceshipsObjects.model}</p><hr>`;
}
