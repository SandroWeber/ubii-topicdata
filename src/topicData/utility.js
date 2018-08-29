const {
    TOPIC_PREFIX,
    TOPIC_SUFFIX,
    TOPIC_SEPARATOR
} = require('./constants.js');

/**
 * Creates a path array from a topic string. Removes all empty subtopic strings and adds the topic prefix and suffix to each subtopic of the path array.
 * @param {String} topicString 
 */
let getTopicPathFromString = function (topicString) {
    return topicString.toString().split(TOPIC_SEPARATOR).filter(t => t!=='').map(t => '' + TOPIC_PREFIX + t + TOPIC_SUFFIX);
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