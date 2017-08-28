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
    "&y=&plot=short&tomatoes=true&r=json&apikey=40e9cece";
  console.log("---------------\nqueryURL variable: " + queryUrl);
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var movieResponse = JSON.parse(body);
      var movieOutput =
        "------------------------------ OMDB Output Start ------------------------------" +
        "\nMovie Title: " +
        movieResponse.Title +
        "\n" +
        "Release Year: " +
        movieResponse.Year +
        "\n" +
        "IMDB Rating: " +
        movieResponse.Ratings[0].Value +
        "\n" +
        "Rotten Tomatoes Rating: " +
        movieResponse.Ratings[1].Value +
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
        "------------------------------ OMDB Output End ------------------------------\n";
      console.log(movieOutput);
      logOutput(movieOutput);
    }
  });
}

function myTweets() {
  var twitOption = new twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  });
  var handle = searchTerm;
  var params = { screen_name: searchTerm };
  console.log(params); //testing that this is working so far
  twitOption.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      tweets.forEach(function(tweet) {
        var twitterOutput = tweet.text + "\n";
        console.log(twitterOutput);
        logOutput(
          "------------------------------ Twitter Output Start ------------------------------"
        );
        logOutput(twitterOutput);
        logOutput(
          "\n------------------------------ Twitter Output End ------------------------------\n"
        );
      });
    }
  });
}

function spotifyThisSong(searchTerm) {
  var searchTerm = process.argv[3];
  var spotifyOption = new spotify({
    id: keys.spotifyKeys.id,
    secret: keys.spotifyKeys.secret
  });
  if (!searchTerm) {
    searchTerm = "The Sign";
  }
  spotifyOption.search({ type: "track", query: searchTerm }, function(err, data) {
    if (!err) {
      var songInfo = data.tracks.items;
      for (var i = 0; i < 3; i++) {
        if (songInfo[i] != undefined) {
          var spotifyOutput =
            "Artist: " +
            songInfo[i].artists[0].name +
            "\n" +
            "Song: " +
            songInfo[i].name +
            "\n" +
            "Preview: " +
            songInfo[i].preview_url +
            "\n" +
            "Album: " +
            songInfo[i].album.name +
            "\n" +
            "------------------------------ " +
            i +
            " ------------------------------" +
            "\n";
          console.log(spotifyOutput);
          logOutput(spotifyOutput);
        }
      }
    } else {
      console.log("Error :" + err);
      return;
    }
  });
}

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (!error) {
      doWhatItSaysResults = data.split(",");
      spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
    } else {
      console.log(error);
    }
  });
}

function logOutput(logResults) {
  fs.appendFile("log.txt", logResults, error => {
    if (error) {
      throw error;
    }
  });
}
