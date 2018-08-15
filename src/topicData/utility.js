const {TOPIC_PREFIX} = require('./constants.js');

let getTopicPathFromString = function (topicString, topicSeparator) {
    return topicString.toString().split(topicSeparator).map(t => '' + TOPIC_PREFIX + t);
}

let validateTopic = function(topic){
    //topic is a string
    if (!(typeof topic === 'string' || topic instanceof String)){
        throw new Error('The specified topic is not valid: The topic is not a string: '+topic);
    }
}

module.exports = {
    getTopicPathFromString: getTopicPathFromString,
    validateTopic: validateTopic,
}