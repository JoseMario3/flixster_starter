//Global Constants
const apiKey = "017b97b7179fec2b73979d58f5d79972";
const limit = 0;

//askTA
//value error
//0

//variants for "show more" button
let offset = 9;
let pageNum = 1;
let values = "";
let searching = true;

//DOM
let movieForm = document.querySelector("form");
let movieResults = document.querySelector("#movie-results");
let showMoreButton = document.querySelector("#show-more");
let currentMovies = document.querySelector("#current-movies");
let currentHeader = document.querySelector("#current-header");
let searchHeader = document.querySelector("#search-header");

//eventListeners to show movies
movieForm.addEventListener("submit", handleFormSubmit);
showMoreButton.addEventListener("click", showMore);
//currentMovies.addEventListener("pageshow", getCurrent);

//sets up for the api call and show more functions when
//user presses the submit or show more buttons
function handleFormSubmit(evt) {
    evt.preventDefault();
    pageNum = 1;
    searching = true;
    movieResults.innerHTML = "";
    currentMovies.innerHTML = "";
    searchHeader.innerHTML = "";
    currentHeader.classList.add("hidden");

    if (showMoreButton.classList.contains("hidden")) {
        showMoreButton.classList.add("hidden");
    }

    values = evt.target.movie.value;

    getResults(evt);

    searchHeader.classList.remove("hidden");
    searchHeader.innerHTML += `
        <h4 id="search-header"> Showing search results for: ${movieForm.movie.value} </h4>
    `;

    if (!movieForm.movie.value == "") {
        movieForm.movie.value = "";
    }
}

async function getCurrent() {
    let apiUrl =
        "https://api.themoviedb.org/3/movie/now_playing?page=" +
        pageNum +
        "&api_key=" +
        apiKey +
        "&query=" +
        values;
    let response = await fetch(apiUrl);
    let responseData = await response.json();
    generateCurrent(responseData);
}

function generateCurrent(currentData) {
    //console.log(currentData);
    currentData.results.forEach((img) => {
        if (img.poster_path == null) {
            return;
        }
        currentMovies.innerHTML += `
            <div class="movie-area">
            <img src = "https://image.tmdb.org/t/p/original${img.poster_path}"  id=poster alt="movie poster" />
            <p id="title">${img.title}</p>
            <p id="votes">Votes: ${img.vote_average}</p>
            </div>
        `;
    });
    if (pageNum == currentData.total_pages) {
        showMoreButton.classList.add("hidden");
    } else {
        showMoreButton.classList.remove("hidden");
    }
}

//calls api to retrieve movieS
async function getResults(evt) {
    let apiUrl =
        "https://api.themoviedb.org/3/search/movie?page=" +
        pageNum +
        "&api_key=" +
        apiKey +
        "&query=" +
        values;
    let response = await fetch(apiUrl);
    let responseData = await response.json();
    generateHTML(responseData);
}

//uses JSON from api retrieval to print out movieS on webpage
function generateHTML(movieData) {
    //console.log(movieData);
    movieData.results.forEach((img) => {
        if (img.poster_path == null) {
            return;
        }
        movieResults.innerHTML += `
            <div class="movie-area">
            <img src = "https://image.tmdb.org/t/p/original${img.poster_path}"  id=poster alt="movie poster" />
            <p id="title">${img.title}</p>
            <p id="votes">Votes: ${img.vote_average}</p>
            </div>
        `;
    });

    if (pageNum == movieData.total_pages) {
        showMoreButton.classList.add("hidden");
    } else {
        showMoreButton.classList.remove("hidden");
    }
}

//makes the "show more" button work
function showMore(evt) {
    pageNum++;
    offset = pageNum * limit;
    showMoreButton.classList.add("hidden");
    if (searching) {
        getResults(evt);
    } else {
        getCurrent(evt);
    }
}

window.onload = function() {
    getCurrent();
    searching = false;
};