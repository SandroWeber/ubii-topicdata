import TopicStorage from './dataStorage';

(() => {
  const topicPrefix = 't:';
  const dataPrefix = 'd:';
  const dataPropertyKey = dataPrefix+'data'

  class RuntimeTopicStorage extends TopicStorage {
    
    constructor() {
      super();
      // more Derived-specific stuff here, maybe

      this.storage = {};
    }

    push(topic, data){
      let element = traverseAndCreateTopicPath(topic).apply(this);
      element[dataPropertyKey] = data;
    }

    pull(topic){
      let element = traverseAndCreateTopicPath(topic).apply(this);
      return element[dataPropertyKey];
    }

    remove(topic){
      let element = traverseAndCreateTopicPath(topic).apply(this);
      element[dataPropertyKey] = {};

      cleanPath(topic).apply(this);
    }

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

  // private methods

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

  function getTopicPathArray(topic){
    return topic.toString().split(':').map( t => '' + topicPrefix + t );
  }

  export default RuntimeTopicStorage;
}();)
