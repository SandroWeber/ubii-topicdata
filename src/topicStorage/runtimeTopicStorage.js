import TopicStorage from './topicStorage.js';
import {topicPrefix, dataPropertyKey} from './constants.js';

(() => {
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
      let element = traverseAndCreateTopicPath(topic).apply(this);
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
      let element = traverseAndCreateTopicPath(topic).apply(this);
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
      let element = traverseAndCreateTopicPath(topic).apply(this);
      element[dataPropertyKey] = {};

      cleanPath(topic).apply(this);
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
          element = e[path[i]];
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
  function traverseAndCreateTopicPath(topic){
    // get topic path
    const path = getTopicPathArray(topic);

    // traverse path and create if necessary
    let element = this.storage;
    const il = path.length;
    for(let i = 0; i < il; i++){
      if(element.hasOwnProperty(path[i])){
        element = e[path[i]];
      }else{
        element[path[i]] = {};
        element = e[path[i]];
      }
    }
    return element;
  }

  function cleanPath(topic){
    // Get the topic path.
    const path = getTopicPathArray(topic);

    recursiveIsRelevantCleanUp(this.storage[path[0]]);

    /* None-recursive approach: (Should be minimal more efficient since only the specified path is checked, but the recursive version is more reliable due to redundant checks of all sub-paths)
    // Do not clean if the topic path target is no "leaf".
    if(Object.getOwnPropertyNames(obj).length !== 0){
      return;
    }

    // Traverse the path to the target and fill relevance map
    let element = this.storage;
    let relevanceMap = [];
    const il = path.length;
    for(let i = 0; i < il; i++){
      if(element.hasOwnProperty(path[i])){
        element = e[path[i]];
      }else{
        break;
      }

      if(Object.getOwnPropertyNames(element).length > 1){
        // has data or another path
        relevanceMap.push(true);
      }else{
        relevanceMap.push(false);
      }
    }

    // Now check if the topic is still relevant and clean up if necessary.
    const ol = relevanceMap.length;
    let element = this.storage;

    for(let i = 0; i < il; i++){
      // The topic is relevant if any descendant is relevant
      let nextIsRelevant = false;
      for(let o = i; o < ol; o++){ 
        if(relevanceMap[o]){
          nextIsRelevant = true;
          break;
        }
      }

      if(!nextIsRelevant){
        delete element[path[i]];
        break;
      }

      if(element.hasOwnProperty(path[i])){
        element = e[path[i]];
      }else{
        break;
      }
    }*/
  }

  function recursiveIsRelevantCleanUp(element){
    let result = false;
    let keys = Object.getOwnPropertyNames(element);

    il = keys.length;
    for(let i = 0; i < il; i++){
      if(keys[i] = dataPropertyKey){
        return true;
      }else{
        let intermediateResult = recursiveIsRelevantCleanUp(element[keys[i]]);
        if(!intermediateResult){
          delete element[keys[i]];
        }
        result = result || intermediateResult;
      }
    }

    return result;
  }

  function getData(topic){
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
  function getTopicPathArray(topic){
    return topic.toString().split(':').map( t => '' + topicPrefix + t );
  }

  export default RuntimeTopicStorage;
})();
