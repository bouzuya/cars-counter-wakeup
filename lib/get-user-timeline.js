'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var toCamelCase = function toCamelCase(s) {
    return s.replace(/_(.)/g, function (_, c) {
        return c.toUpperCase();
    });
};
var buildParameters = function buildParameters(parameterNames, options) {
    var parameters = {};
    parameterNames.forEach(function (parameterName) {
        var optionName = toCamelCase(parameterName);
        var optionValue = options[optionName];
        if (optionValue) parameters[parameterName] = optionValue;
    });
    return parameters;
};
var getUserTimeline = function getUserTimeline(twitter, options) {
    return new Promise(function (resolve, reject) {
        var url = 'statuses/user_timeline';
        var parameterNames = ['user_id', 'screen_name', 'since_id', 'count', 'max_id', 'trim_user', 'exclude_replies', 'contributor_details', 'include_rts'];
        var parameters = buildParameters(parameterNames, options);
        twitter.get(url, parameters, function (error, timeline) {
            if (error) {
                reject(error);
            } else {
                resolve(timeline);
            }
        });
    });
};
exports.default = getUserTimeline;