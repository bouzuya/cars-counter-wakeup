'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (callback) {
    (0, _fetch2.default)().then(function (tweets) {
        var p = /^\s*おきた\s*$/;
        var t = tweets.filter(function (i) {
            return i.text.match(p) !== null;
        });
        return { wakeup: t.length === 0 ? 0 : 1 };
    }).then(function (counts) {
        return callback(null, counts);
    }, callback);
};