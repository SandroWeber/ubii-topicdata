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
    return topicString.toString()
        .split(TOPIC_SEPARATOR)
        .filter(t => t !== '')
        .map(t => '' + TOPIC_PREFIX + t + TOPIC_SUFFIX);
}

/**
 * Creates a topic string from a path array. Removes the topic prefix and suffix of each subtopic of the path array.
 * @param {*} topicPath 
 */
let getTopicStringFromPath = function (topicPath) {
    topicStringArray = topicPath.map(t => removeTopicPrefixAndSuffix(t));

    return getTopicStringFromArray(topicStringArray);
}

/**
 * Creates a topic string from a array.
 * @param {String[]} stringArray 
 */
let getTopicStringFromArray = function (stringArray) {
    let result = '';
    let first = true;

    stringArray.forEach(t => {
        if (!first) {
            result = result + TOPIC_SEPARATOR;
        } else {
            first = false;
        }
        result = result + t;
    });

    return result;
}

/**
 * Removes the prefix and suffix of a string and returns the new string.
 * @param {String} key 
 */
let removeTopicPrefixAndSuffix = function (key) {
    let removePrefixRegex = new RegExp("^(" + TOPIC_PREFIX + ")");
    let removeSuffixRegex = new RegExp("(" + TOPIC_SUFFIX + ")$");
    return key.replace(removePrefixRegex, '').replace(removeSuffixRegex, '');
}

let validateTopic = function (topic) {
    if (!(typeof topic === 'string' || topic instanceof String)) {
        throw new Error('The specified topic is not valid: The topic is not a string: ' + topic);
    }
}

module.exports = {
    getTopicPathFromString: getTopicPathFromString,
    getTopicStringFromPath: getTopicStringFromPath,
    getTopicStringFromArray: getTopicStringFromArray,
    removeTopicPrefixAndSuffix: removeTopicPrefixAndSuffix,
    validateTopic: validateTopic
}