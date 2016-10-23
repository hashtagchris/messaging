var util = require('util'),
var twitter = require('twitter');

var twit = new twitter({
    consumer_key: process.env.TwitterConsumerKey,
    consumer_secret: process.env.ConsumerSecret,
    access_token_key: process.env.AccessTokenKey,
    access_token_secret: process.env.AccessTokenSecret
});

module.exports = function (context, message) {
    //Pull Lat/Long from Twitter, based on Tweet
    var rest = '/statuses/show/' + message.tweetid + '.json';
    twit.get(rest, { include_entities: true }, function (data) {
        context.log(data);
        message.latitude = -115.00002;
        message.longitude = 41.94000;
    });

    //Pull in X # of Photos from Twitter
    message.photos = [];

    context.bindings.out = message;
    context.done();
};