//Global Constant, API Key
const apiKey = "017b97b7179fec2b73979d58f5d79972";
const limit = 0;

//Global variables
let offset = 9;
let pageNum = 1;
let values = "";
let apiUrl = "";
let searching = false; //switching between current and search movies

//DOM
let movieForm = document.querySelector("form");
let moviesGrid = document.querySelector("#movies-grid");
let showMoreBtn = document.querySelector("#load-more-movies-btn");
let currentHeader = document.querySelector("#current-header");
let searchHeader = document.querySelector("#search-header");
let closeSearchBtn = document.querySelector("#close-search-btn");

//eventListeners for when someone searches for a movie, clicks the 'show more' button,
//or clicks the 'current movies' button
movieForm.addEventListener("submit", handleFormSubmit);
showMoreBtn.addEventListener("click", showMore);
closeSearchBtn.addEventListener("click", handleCloseSearch);

//sets up for the api call and show more functions when
//user presses the submit or show more buttons
function handleFormSubmit(evt) {
    evt.preventDefault();
    pageNum = 1;
    searching = true;
    moviesGrid.innerHTML = "";
    currentHeader.classList.add("hidden");

    // if (showMoreBtn.classList.contains("hidden")) {
    //     showMoreBtn.classList.add("hidden");
    //}

    values = evt.target.movie.value;
    getMovies(evt);

    if (evt) {
        searchHeader.classList.remove("hidden");
        closeSearchBtn.classList.remove("hidden");
        searchHeader.innerHTML += `
            <h4 id="search-show"> Showing search results for: ${movieForm.movie.value} </h4>
        `;
    }

    if (!movieForm.movie.value == "") {
        movieForm.movie.value = "";
    }
}

//calls api to retrieve current or searched movies
async function getMovies(evt) {
    if (evt) {
        evt.preventDefault();
    }
    if (searching) {
        apiUrl =
            "https://api.themoviedb.org/3/search/movie?page=" +
            pageNum +
            "&api_key=" +
            apiKey +
            "&query=" +
            values;
    } else {
        apiUrl =
            "https://api.themoviedb.org/3/movie/now_playing?page=" +
            pageNum +
            "&api_key=" +
            apiKey;
    }

    let response = await fetch(apiUrl);
    let responseData = await response.json();
    generateMovies(responseData);
}

//uses JSON from api retrieval to print out movies on webpage
function generateMovies(movieData) {
    movieData.results.forEach((img) => {
        if (img.poster_path == null) {
            return;
        }
        moviesGrid.innerHTML += `
            <div class="movie-card">
            <img src = "https://image.tmdb.org/t/p/original${img.poster_path}"  class="movie-poster" alt="movie poster" />
            <p class="movie-title">${img.title}</p>
            <p class="movie-votes">Votes: ${img.vote_average}</p>
            </div>
        `;
    });
    if (pageNum == movieData.total_pages) {
        showMoreBtn.classList.add("hidden");
    } else {
        showMoreBtn.classList.remove("hidden");
    }
}

//causes more movies to show up on the screen, without refreshing the page
function showMore(evt) {
    console.log("showing more");
    pageNum++;
    offset = pageNum * limit;
    showMoreBtn.classList.add("hidden");
    getMovies(evt);
}

//tells the getMovies function to get current movies (instead of searched movies)
function handleCloseSearch(evt) {
    pageNum = 1;
    searching = false;
    moviesGrid.innerHTML = "";
    getMovies(evt);
}

//loads current movies when page is opened/refreshed
window.onload = function() {
    getMovies();
    searching = false;
};