const {TopicStorage} = require('./topicStorage.js');
const {topicPrefix, dataPropertyKey} = require('./constants.js');


(function(){
  /**
   * Local runtime implementaion of a topic storage.
   * The data is only available at runtime and is not permanently stored.
   * (No local file or database involved. The data is only in the program memory.)
   */
  class RuntimeTopicStorage extends TopicStorage {
    /*
    * The runtime topic storage uses a common javascript object as storage structure.
    * This is the most performant way to find key-value pairs.
    * The topic of queries is split and used as property keys.
    * */
    
    constructor() {
      super();

      this.storage = {};
    }

    /**
     * Pushes data into memory under the specified topic.
     * If there is already data under this topic, it will be overwritten.
     * @param {String} topic Well formed topic string.
     * @param {*} data 
     */
    push(topic, data){
      let element = traverseAndCreateTopicPath.call(this, topic);
      element[dataPropertyKey] = data;
    }

    /**
     * Pulls the data from memory that is stored under the given topic.
     * @param {String} topic Well formed topic string.
     * @returns Returns the data stored under the given topic. Returns null if the topic does not exist.
     */
    pull(topic){
      if(!this.has(topic)){
        return null;
      }
      let element = traverseAndCreateTopicPath.call(this, topic);
      return element[dataPropertyKey];
    }

    /**
     * Removes the topic and data from memory that is stored under the given topic if the topic exists. 
     * Cleans up the path afterwards.
     * @param {String} topic Well formed topic string.
     */
    remove(topic){
      if(!this.has(topic)){
        return;
      }
      let element = traverseAndCreateTopicPath.call(this,topic);
      delete element[dataPropertyKey];

      cleanPath.call(this,topic);
    }

    /**
     * Does the the storage has the given topic?
     * @param {String} topic Well formed topic string.
     * @returns {Boolean} Returns whether the the storage has the given topic or not.
     */
    has(topic){
      // get topic path
      const path = getTopicPathArray(topic);

      // traverse path
      let element = this.storage;
      const il = path.length;
      for(let i = 0; i < il; i++){
        if(element.hasOwnProperty(path[i])){
          element = element[path[i]];
        }else{
          return false;
        }
      }
      return true;
    }
  }

  // --- private methods

  /**
   * 
   * @param {String} topic 
   * @return returns the path target element
   */
  let traverseAndCreateTopicPath = function(topic){
    // get topic path
    const path = getTopicPathArray(topic);

    // traverse path and create if necessary
    let element = this.storage;
    const il = path.length;
    for(let i = 0; i < il; i++){
      if(element.hasOwnProperty(path[i])){
        element = element[path[i]];
      }else{
        element[path[i]] = {};
        element = element[path[i]];
      }
    }
    return element;
  }

  let cleanPath = function(topic){
    // Get the topic path.
    const path = getTopicPathArray(topic);

    if(!recursiveIsRelevantCleanUp(this.storage[path[0]])){
      delete this.storage[path[0]];
    }
  }

  let recursiveIsRelevantCleanUp = function(element){
    let result = false;
    let keys = Object.getOwnPropertyNames(element);

    const il = keys.length;
    for(let i = 0; i < il; i++){
      if(keys[i] === dataPropertyKey){
        result = true;
      }else{
        // ToDo: Check for valid path element (starts with t:)
        let intermediateResult = recursiveIsRelevantCleanUp(element[keys[i]]);
        if(!intermediateResult){
          delete element[keys[i]];
        }
        result = result || intermediateResult;
      } 
      
    }
    return result;
  }

  let getData = function(topic){
    // get topic path
    const path = getTopicPathArray(topic);

    // check topic path
    let storageElement = this.storage;
    const il = path.length;
    for(let i = 0; i < il; i++){
      if(storageElement.hasOwnProperty(path[i])){
        storageElement = storageElement[path[i]];
      }else{
        throw new Error("The specified topic does not exist in the storage.");
        return null;
      }
    }

    // return data object
    return storageElement;
  }

  /**
   * Returns 
   * @param {String} topic 
   */
  let getTopicPathArray = function(topic){
    return topic.toString().split(':').map( t => '' + topicPrefix + t );
  }

  module.exports = {
    'RuntimeTopicStorage': RuntimeTopicStorage,
  }

})();

