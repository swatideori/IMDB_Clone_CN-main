// The API key, home URL, and image URL for The Movie Database API
const APIKEY = 'api_key=96c05c6f53c2f9b20b3e42af4887dc76';
const HOMEURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`;
const IMAGEURL = 'https://image.tmdb.org/t/p/w500';

// Fetching DOM elements from indexedDB.html
var container = document.getElementById('movie-container'); // Container for movie elements
var search = document.getElementById('searchMovie'); // Search input element
var wrapperDiv = document.querySelector('.search-conten'); // Search content wrapper
var resultsDiv = document.querySelector('.results'); // Div for displaying search results

// DOM elements for previous and next buttons and page count
var pBtn = document.getElementById('prev-page'); // Previous button
var nBtn = document.getElementById('next-page'); // Next button
let pageNumber = 1; // Current page number

// Call the function to request data from the API for the homepage
apiCall(HOMEURL);

// Function to make an API call and fetch movie data
function apiCall(url) {
    const x = new XMLHttpRequest();
    x.open('get', url);
    x.send();
    x.onload = function () {
        container.innerHTML = ""; // Clear the existing movie container
        var res = x.response;
        var conJson = JSON.parse(res); // Convert the API response to JSON data
        var moviesArray = conJson.results; // Get the array of movies from the API response
        // Create movie cards for each movie and display them
        moviesArray.forEach(movie => moviesElement(movie));
        addMovieToListButtonArray = document.getElementsByClassName('.add-movie-to-list');
    }
}

// Function to create movie cards for the homepage
function moviesElement(movie) {
    var movieElement = document.createElement('div');
    movieElement.classList.add('movie-element');
    movieElement.innerHTML = `
        <div class="movie-poster">
            <a href="moviePage.html?id=${movie.id}"><img src= ${IMAGEURL + movie.poster_path} alt="Movie Poster"></a>
        </div>
        <div class="movie-title">${movie.title}</div>
        <div class="movie-element-tags">
            <div class="movie-rating">
                <i class="fas fa-star"></i> ${movie.vote_average} 
            </div>
            <div class="add-movie-to-list"  id="${movie.id}" onclick="addMovie(${movie.id})">
                <i class="fas fa-plus"></i>
            </div>
        </div>
    `;
    container.appendChild(movieElement); // Append the movie card to the movie container
}

// Array to store favorite movies and old movies from local storage
var favMovies = [];
var oldMovies = [];

// Function to add a movie to the favorite list
function addMovie(btnId) {
    document.getElementById(btnId).innerHTML = '<i class="fas fa-check"></i>';
    if (!favMovies.includes(btnId.toString())) {
        favMovies.push(btnId.toString()); // Add the movie ID to the favorite list array
    }

    oldMovies = JSON.parse(localStorage.getItem('MovieArray')); // Get the existing array from local storage
    if (oldMovies == null) {
        localStorage.setItem('MovieArray', JSON.stringify(favMovies)); // If empty, set the favorite movies as the new array
    } else {
        favMovies.forEach(item => {
            if (!oldMovies.includes(item)) {
                oldMovies.push(item); // If not empty, merge the new favorite movies with the old ones
            }
        });
        localStorage.setItem('MovieArray', JSON.stringify(oldMovies)); // Update the array in local storage
    }
}

// Search function to fetch movies based on the input query
search.addEventListener('keyup', function () {
    var input = search.value; // Get the input text from the search box
    var inputUrl = `https://api.themoviedb.org/3/search/movie?query=${input}&${APIKEY}`; // Create the URL for searching movies
    if (input.length != 0) {
        apiCall(inputUrl); // Call the function to fetch search results
    } else {
        window.location.reload(); // Reload the homepage if the search input is empty
    }
})

// Disable the previous button when the page number is 1
pBtn.disabled = true;

// Function to disable the previous button based on the current page number
function disablePBtn() {
    if (pageNumber == 1) {
        pBtn.disabled = true;
    } else {
        pBtn.disabled = false;
    }
}

// Go to the next page when the next button is clicked
nBtn.addEventListener('click', () => {
    pageNumber++;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate`;
    apiCall(tempURL);
    disablePBtn();
});

// Go to the previous page when the previous button is clicked
pBtn.addEventListener('click', () => {
    if (pageNumber == 1) return;
    pageNumber--;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate`;
    apiCall(tempURL);
    disablePBtn();
});
