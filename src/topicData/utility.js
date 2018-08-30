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

let getTopicStringFromPath = function (topicPath) {
    let result = '';
    let first = true;
    topicPath.map(t => removeTopicPrefixAndSuffix(t));
    topicPath.forEach(t => {
        if(!first){
            result = result + TOPIC_SEPARATOR;
        }else{
            first = false;
        }
        result = result + t;
    })
    return result;
}

let removeTopicPrefixAndSuffix = function(key){
    let removePrefixRegex = new RegExp("^("+TOPIC_PREFIX+")");
    let removeSuffixRegex = new RegExp("("+TOPIC_SUFFIX+")$");
    return key.replace(removePrefixRegex,'').replace(removeSuffixRegex, '');
}

let validateTopic = function (topic) {
    //topic is a string
    if (!(typeof topic === 'string' || topic instanceof String)) {
        throw new Error('The specified topic is not valid: The topic is not a string: ' + topic);
    }
}

module.exports = {
    getTopicPathFromString: getTopicPathFromString,
    removeTopicPrefixAndSuffix: removeTopicPrefixAndSuffix,
    validateTopic: validateTopic
}