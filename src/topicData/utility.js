let getTopicPathFromString = function(topicString, topicSeparator){
    return topicString.toString().split(topicSeparator).map( t => '' + topicPrefix + t );
  }

let getTopicPathFromArray = function(topic){
    return topic.map( t => '' + topicPrefix + t );
}

module.exports = {
    getTopicPathFromString: getTopicPathFromString,
    getTopicPathFromArray: getTopicPathFromArray,
}