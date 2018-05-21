require("dotenv").config();


var keys = require('./keys');
// var spotifyId = keys.spotifyId();
// var spotifySecret = keys.spotifySecret();
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");
var Twitter = require('twitter');
var moment = require('moment');
const twitterDateFormat = 'ddd MMM DD HH:mm:ss ZZ YYYY';
const twitterOutputDate = 'MM-DD-YYYY hh:mm a';

var client = new Twitter({
    consumer_key: keys.twitterConsumerKey(),
    consumer_secret: keys.twitterConsumerSecret(),
    access_token_key: keys.twitterAccessKey(),
    access_token_secret: keys.twitterAccessSecret()
});


 
var spotify = new Spotify({
  id: keys.spotifyId(),
  secret: keys.spotifySecret()
});

var command = process.argv[2];

function run(comm, arg) {
    switch (comm) {
        case "my-tweets":
            console.log('Show last 20 tweets & when they were created')
            twitter();
            break;

        case "spotify-this-song":
            if (process.argv[3]) {
                var track = '';
                for (var i = 3; i < process.argv.length; i++) {
                    track += process.argv[i] + ' ';
                }                
            } else if (arg) {
                track = arg;
            } else {
                track = 'Ace of base the sign';
            }
            songSearch(track);
            break;

        case "movie-this":
            if (process.argv[3]) {
                var movie = '';
                for (var i = 3; i < process.argv.length; i++) {
                    movie += '+' + process.argv[i];
                }
            } else {
                movie = 'Mr. Nobody';
            }
            movieSearch(movie);
            break;

        case "do-what-it-says":
            random();
            break;
    }
}
// }

function songSearch(x) {
    spotify.search({ type: 'track', query: x, limit: 1 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var song = data.tracks.items[0];
        console.log('')
        console.log('*********************************************************')
        console.log('Artist: ' + song.artists[0].name)
        console.log('Song Name: ' + song.name)
        console.log('Album: ' + song.album.name)
        console.log('Preview Link: ' + song.album.external_urls.spotify)
        console.log('*********************************************************')
        console.log('')
    });
}

function movieSearch(x) {
    request("http://www.omdbapi.com/?t=" + x + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

    if (!error && response.statusCode === 200) {
            var info = JSON.parse(body);
            console.log('')
            console.log('*********************************************************')
            console.log('Title: ' + info.Title)
            console.log('Year: ' + info.Year)
            console.log('IMDB rating: ' + info.imdbRating)
            console.log('Rotten Tomatoes rating: ' + info.Ratings[0].Value)
            console.log('Country: ' + info.Country)
            console.log('Language: ' + info.Language)
            console.log('Plot: ' + info.Plot)
            console.log('Actors: ' + info.Actors)
            console.log('*********************************************************')
            console.log('')
        }
    });
}

function random() {
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
      
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
      
        // We will then re-display the content as an array for later use.
        var song = dataArr[1].replace(/^"(.+(?="$))"$/, '$1');

        run(dataArr[0], song);
      
      });
}

function twitter() {
    // var twitterId;
    // client.get('account/verify_credentials', function(error, user, response) {
    //     if(error) throw error;
    //     twitterId = user.id;
    // });
    
    var params = {count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if(error) throw error;
        for (i = 0; i < tweets.length; i++) {
            console.log(tweets[i].text);
            var created = moment(tweets[i].created_at, twitterDateFormat);
            created.local();
            console.log(created.format(twitterOutputDate));
        }
        // console.log(tweets);  // The favorites.
        // console.log(response);  // Raw response object.
    });
}

// // function twitter() {
//     var params = {screen_name: '@yd1090'};
//     client.get('statuses/user_timeline', function(error, tweets, response) {
//         if(error) throw error;
//         console.log(tweets);  // The favorites.
//         // console.log(response);  // Raw response object.
//     });
// }

run(command, null);