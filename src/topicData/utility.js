const {TOPIC_PREFIX} = require('./constants.js');

let getTopicPathFromString = function (topicString, topicSeparator) {
    return topicString.toString().split(topicSeparator).map(t => '' + TOPIC_PREFIX + t);
}

let getTopicPathFromArray = function (topic) {
    return topic.map(t => '' + TOPIC_PREFIX + t);
}

module.exports = {
    getTopicPathFromString: getTopicPathFromString,
    getTopicPathFromArray: getTopicPathFromArray,
}