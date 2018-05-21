exports.twitter = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

module.exports = {
  spotifyId: function() {
     return exports.spotify.id;
  },
  spotifySecret: function() {
    return exports.spotify.secret;
  },
  twitterConsumerKey: function() {
    return exports.twitter.consumer_key;
  },
  twitterConsumerSecret: function() {
    return exports.twitter.consumer_secret;
  },
  twitterAccessKey: function() {
    return exports.twitter.access_token_key;
  }, 
  twitterAccessSecret: function() {
    return exports.twitter.access_token_secret;
  }
}