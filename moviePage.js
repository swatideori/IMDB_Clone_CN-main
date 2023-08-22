// The API key, base URL, and image URL for The Movie Database API
const APIKEY = 'api_key=96c05c6f53c2f9b20b3e42af4887dc76';
const BASEURL = 'https://api.themoviedb.org/3';
const IMAGEURL = 'https://image.tmdb.org/t/p/w500';

// Get the movie ID from the URL parameters
let id = '';
const urlParams = new URLSearchParams(location.search);
for (const [key, value] of urlParams) {
    id = value;
}

// Build the URL to fetch movie details and videos
let link = `/movie/${id}?language=en-US&append_to_response=videos&`;
let f_url = BASEURL + link + APIKEY;

// Call the function to fetch movie data
apiCall(f_url);

// Function to make an API call and fetch movie data
function apiCall(url) {
    const x = new XMLHttpRequest();
    x.open('get', url);
    x.send();
    x.onload = function () {
        document.getElementById('movie-display').innerHTML = '';
        var res = x.response;
        var Json = JSON.parse(res);
        // Call the function to display movie details on the movie page
        getMovies(Json);
    }
    x.onerror = function () {
        window.alert('Cannot get data from API');
    }
}

// Function to display movie details on the movie page
function getMovies(myJson) {
    // Filter the videos to find the movie trailer
    var MovieTrailer = myJson.videos.results.filter(filterArray);

    // Set the background image for the page
    document.body.style.backgroundImage = `url(${IMAGEURL + myJson.backdrop_path}), linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0) 250%)`;

    // Create a div to hold movie details
    var movieDiv = document.createElement('div');
    movieDiv.classList.add('each-movie-page');

    // Set the YouTube URL for the movie trailer
    var youtubeURL;
    if (MovieTrailer.length == 0) {
        if (myJson.videos.results.length == 0) {
            youtubeURL = '';
        } else {
            youtubeURL = `https://www.youtube.com/embed/${myJson.videos.results[0].key}`;
        }
    } else {
        youtubeURL = `https://www.youtube.com/embed/${MovieTrailer[0].key}`;
    }

    // Create the HTML for the movie details page
    movieDiv.innerHTML = `
        <div class="movie-poster">
            <img src=${IMAGEURL + myJson.poster_path} alt="Poster">
        </div>
        <div class="movie-details">
            <div class="title">
                ${myJson.title}
            </div>
            <div class="tagline">${myJson.tagline}</div>
            <div style="display: flex;"> 
                <div class="movie-duration">
                    <b><i class="fas fa-clock"></i></b> ${myJson.runtime}
                </div>
                <div class="release-date">
                    <b>Released</b>: ${myJson.release_date}
                </div>
            </div>
            <div class="rating">
                <b>IMDb Rating</b>: ${myJson.vote_average}
            </div>
            <div class="trailer-div" id="trailer-div-btn">
                <i class="fab fa-youtube"></i>
            </div>
            <div id="trailer-video-div">
                <button id="remove-video-player"><i class="fas fa-times"></i></button>
                <br>
                <span><iframe width="560" height="315" src=${youtubeURL} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></span>
            </div>
            <div class="plot">
                ${myJson.overview}
            </div>
        </div>
    `;

    // Append the movie details to the movie-display element
    document.getElementById('movie-display').appendChild(movieDiv);

    // Play the YouTube video when the trailer-div-btn is clicked
    var youtubeVideo = document.getElementById('trailer-video-div');
    document.getElementById('trailer-div-btn').addEventListener('click', function () {
        youtubeVideo.style.display = 'block';
    });

    // Stop the YouTube video when the remove-video-player button is clicked
    document.getElementById('remove-video-player').addEventListener('click', function () {
        stopVideo();
        youtubeVideo.style.display = 'none';
    });

    // Function to stop the YouTube video
    function stopVideo() {
        var iframe = document.getElementsByTagName("iframe")[0];
        var url = iframe.getAttribute('src');
        iframe.setAttribute('src', '');
        iframe.setAttribute('src', url);
    }
}

// Function to filter the array and find the video with the name 'Official Trailer'
function filterArray(obj) {
    var vtitle = obj.name;
    var rg = /Official Trailer/i;
    if (vtitle.match(rg)) {
        return obj;
    }
}
