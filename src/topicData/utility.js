const {
    TOPIC_PREFIX,
    TOPIC_SUFFIX,
    TOPIC_SEPARATOR
} = require('./constants.js');

let getTopicPathFromString = function (topicString) {
    return topicString.toString().split(TOPIC_SEPARATOR).map(t => '' + TOPIC_PREFIX + t + TOPIC_SUFFIX);
}

let validateTopic = function (topic) {
    //topic is a string
    if (!(typeof topic === 'string' || topic instanceof String)) {
        throw new Error('The specified topic is not valid: The topic is not a string: ' + topic);
    }
}

module.exports = {
    getTopicPathFromString: getTopicPathFromString,
    validateTopic: validateTopic
}