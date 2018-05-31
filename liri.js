require("dotenv").config();
let ascii_text_generator = require('ascii-text-generator');
var inquirer = require("inquirer");
var keys = require('./keys');
var request = require("request");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var moment = require('moment');
const chalk = require('chalk');
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

// var command = process.argv[2];
function run() {

    let color = 'blue';
    console.log(chalk[color]('dude'));
    console.log('');
    console.log('');
    console.log(chalk.bgWhiteBright.black('Welcome to...            '));
    console.log(chalk.bgWhiteBright.black(ascii_text_generator('Liri',"2")));

    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                choices: ['display tweets', 'search songs', 'search movies', 'random', 'exit'],
                name: 'action'
            }
        ])
        .then((choice) => {
            console.log('');
            switch (choice.action) {
                case "display tweets":
                    twitter();
                    break;
                case "search songs":
                    songSearch();
                    break;
                case "search movies":
                    movieSearch();
                    break;
                case "random":
                    random();
                    break;
                case "exit":
                    console.log(chalk.bgWhiteBright.black(ascii_text_generator('Goodbye',"2")));
                    console.log('');
                    break;
            }

        });
}


function songSearch() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'enter a song title.',
                name: 'song',
            }
        ])
        .then((choice) => {
            if (choice.song) {
                displaySong(choice.song);
            } else {
                random();
            }
        });
}

function displaySong(x) {
    spotify.search({ type: 'track', query: x, limit: 1 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var song = data.tracks.items[0];
        console.log('');
        console.log(chalk.yellowBright('*********************************************************'));
        console.log(chalk.bgRedBright.bold('Artist:') + '  ' + chalk.redBright(song.artists[0].name));
        console.log(chalk.bgMagentaBright.bold('Song Name:') + '  ' + chalk.magentaBright(song.name));
        console.log(chalk.bgGreenBright.bold('Album:') + '  ' + chalk.greenBright(song.album.name));
        console.log(chalk.bgBlueBright.bold('Preview Link:') + '  ' + chalk.blueBright(song.album.external_urls.spotify));
        console.log(chalk.yellowBright('*********************************************************'));
        console.log(''); 
        end();
    });

}

function movieSearch() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'enter a movie title',
                name: 'movie'
            }
        ])
        .then((choice) => {
            var movie = 'Mr. Nobody';
            if (choice.movie) {
                movie = choice.movie;
            }

            console.log(choice.movie)

    request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

    if (!error && response.statusCode === 200) {
            var info = JSON.parse(body);
            console.log('');
            console.log(chalk.yellowBright('*********************************************************'));
            console.log(chalk.bgRedBright.bold('Title:') + ' ' +  chalk.redBright(info.Title));
            console.log(chalk.bgMagentaBright.bold('Year:') + ' ' + chalk.magentaBright(info.Year));
            console.log(chalk.bgGreenBright.bold('IMDB rating:') + ' ' + chalk.greenBright(info.imdbRating));
            console.log(chalk.bgBlueBright.bold('Rotten Tomatoes rating:') + ' ' + chalk.blueBright(info.Ratings[0].Value));
            console.log(chalk.bgCyanBright.bold('Country:') + ' ' + chalk.cyanBright(info.Country));
            console.log(chalk.bgRedBright.bold('Language:') + ' ' + chalk.redBright(info.Language));
            console.log(chalk.bgMagentaBright.bold('Plot:') + ' ' + chalk.magentaBright(info.Plot));
            console.log(chalk.bgGreenBright.bold('Actors:') + ' ' + chalk.greenBright(info.Actors));
            console.log(chalk.yellowBright('*********************************************************'));
            console.log('')
            end();
        }
    });
})

}

function random() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }
        var dataArr = data.split(",");
        var song = dataArr[1].replace(/^"(.+(?="$))"$/, '$1');
        displaySong(song);
      });
}

function twitter() {
    var colors = ['redBright', 'greenBright', 'yellowBright', 'blueBright'];
    var bgColors = ['bgRedBright', 'bgGreenBright', 'bgYellowBright', 'bgBlueBright'];
    var color = '';
    var bgColor = '';
    var params = {count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if(error) throw error;
        console.log(chalk.bgWhiteBright.black.bold("@" + tweets[0].user.screen_name + "'s recent Tweets..."));
        for (i = 0; i < tweets.length; i++) {
            if (i % 4 === 0) {
                color = colors[3];
                bgColor = bgColors[3];
            } else if (i % 3 === 0) {
                color = colors[2];
                bgColor = bgColors[2];
            } else if (i % 2) {
                color = colors[1];
                bgColor = bgColors[1];
            } else {
                color = colors[0];
                bgColor = bgColors[0];
            }
            console.log(chalk.yellowBright('*********************************************************'));
            var created = moment(tweets[i].created_at, twitterDateFormat);
            created.local();
            console.log(chalk[bgColor].black.bold(created.format(twitterOutputDate)));
            console.log(chalk[color]('"' + tweets[i].text + '"'));
        }
        console.log(chalk.yellowBright('*********************************************************'));
        console.log('');
        end();
    });
}

function end() {
    inquirer
        .prompt([
            {
                type: 'confirm',
                message: "Back to liri?",
                name: 'confirm' 
            }
        ])
        .then((choice) => {
            console.log('');

            if (choice.confirm) {
                run();
            } else {
                console.log(chalk.bgWhiteBright.black(ascii_text_generator('Goodbye',"2")));
                console.log('');
            }
        });
}

run();