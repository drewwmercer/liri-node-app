var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var twitter = require("twitter");
var spotify = require("node-spotify-api");

var liriOption = process.argv[2];
var searchTerm = process.argv[3];

switch (liriOption) {
  case "my-tweets":
    myTweets();
    break;
  case "spotify-this-song":
    spotifyThisSong();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log(
      "\r\n" +
        "Type one of the following commands after 'node liri.js' : " +
        "\r\n" +
        "1. my-tweets 'any twitter name' " +
        "\r\n" +
        "2. spotify-this-song 'any song name' " +
        "\r\n" +
        "3. movie-this 'any movie name' " +
        "\r\n" +
        "4. do-what-it-says." +
        "\r\n"
    );
  //"Be sure to put the movie or song name in quotation marks if it's more than one word.");
}

function movieThis() {
  var searchTerm = process.argv[3];
  if (!searchTerm) {
    searchTerm = "Mr. Nobody";
  }
  var queryUrl =
    "http://www.omdbapi.com/?t=" +
    searchTerm +
    "&y=&plot=short&apikey=40e9cece";
  console.log("---------------\nqueryURL variable: " + queryUrl);
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var movieResponse = JSON.parse(body);
      var movieOutput =
        "------------------------------ Movie Output Start ------------------------------" +
        "\nMovie Title: " +
        movieResponse.Title +
        "\n" +
        "Release Year: " +
        movieResponse.Year +
        "\n" +
        "IMDB Rating: " +
        movieResponse.imdbRating +
        "\n" +
        "Country: " +
        movieResponse.Country +
        "\n" +
        "Language: " +
        movieResponse.Language +
        "\n" +
        "Plot: " +
        movieResponse.Plot +
        "\n" +
        "Actors: " +
        movieResponse.Actors +
        "\n" +
        "Rotten Tomatoes Rating: " +
        movieResponse.tomatoRating +
        "\n" +
        "------------------------------ Movie Output End ------------------------------" +
        "\n";
      console.log(movieOutput);
      //logOut(movieOutput);
    }
  });
}

// Then run a request to the OMDB API with the movie specified

// This line is just to help us debug against the actual URL.

// request(queryUrl, function(error, response, body) {
//   // If the request is successful
//     // Parse the body of the site and recover just the imdbRating
//     // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
//     console.log("Release Year: " + JSON.parse(body).Year);
//   }
// });
