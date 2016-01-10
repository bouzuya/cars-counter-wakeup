'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _twitter = require('twitter');

var _twitter2 = _interopRequireDefault(_twitter);

var _getUserTimeline = require('./get-user-timeline');

var _getUserTimeline2 = _interopRequireDefault(_getUserTimeline);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getUserTimelineRecursive = function getUserTimelineRecursive(twitter, userId, until, result, maxId) {
    return (0, _getUserTimeline2.default)(twitter, {
        userId: userId, maxId: maxId,
        count: 200,
        includeRts: false,
        excludeReplies: true
    }).then(function (tweets) {
        var d = function d(s) {
            return (0, _moment2.default)(Date.parse(s));
        };
        var since = (0, _moment2.default)(until).endOf('day');
        var m = tweets.filter(function (i) {
            return d(i.created_at).isBetween(until, since);
        });
        var r = (result ? result : []).concat(m);
        if (tweets.length === 0 || tweets.length === 1 || tweets.some(function (i) {
            return d(i.created_at).isBefore(until);
        })) return r;
        var newMaxId = tweets[tweets.length - 1].id_str;
        return getUserTimelineRecursive(twitter, userId, until, r, newMaxId);
    });
};

exports.default = function () {
    var twitter = new _twitter2.default({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });
    var userId = '125962981'; // bouzuya
    var until = (0, _moment2.default)().subtract(1, 'day').startOf('day');
    return getUserTimelineRecursive(twitter, userId, until);
};