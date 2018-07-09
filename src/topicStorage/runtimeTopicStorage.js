const {TopicStorage} = require('./topicStorage.js');
const {DATA_PROPERTY_KEY} = require('./constants.js');
const {getTopicPathFromArray} = require('./utility.js');

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
     * @param {String[]} topic Array of unprefixed subtopic strings specifying the topic path.
     * @param {*} data 
     */
    push(topic, data){
      let subtreeRoot = traverseAndCreateTopicPath.call(this, topic);
      subtreeRoot[DATA_PROPERTY_KEY] = data;
    }

    /**
     * Pulls the data from memory that is stored under the given topic.
     * @param {String[]} topic Array of unprefixed subtopic strings specifying the topic path.
     * @returns Returns the data stored under the given topic. Returns undefined if the topic does not exist.
     */
    pull(topic){
      if(!this.has(topic)){
        return undefined;
      }
      let subtreeRoot = traverseAndCreateTopicPath.call(this, topic);
      return subtreeRoot[DATA_PROPERTY_KEY];
    }

    /**
     * Removes the topic and data from memory that is stored under the given topic if the topic exists. 
     * Cleans up the path afterwards.
     * @param {String[]} topic Array of unprefixed subtopic strings specifying the topic path.
     */
    remove(topic){
      if(!this.has(topic)){
        return;
      }
      let subtreeRoot = traverseAndCreateTopicPath.call(this,topic);
      delete subtreeRoot[DATA_PROPERTY_KEY];

      cleanPath.call(this,topic);
    }

    /**
     * Does the the storage has the given topic?
     * @param {String[]} topic Array of unprefixed subtopic strings specifying the topic path.
     * @returns {Boolean} Returns whether the the storage has the given topic or not.
     */
    has(topic){
      // get topic path
      const path = getTopicPathFromArray(topic);

      // traverse path
      let node = this.storage;
      const il = path.length;
      for(let i = 0; i < il; i++){
        if(node.hasOwnProperty(path[i])){
          node = node[path[i]];
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
   * @param {String[]} topic Array of unprefixed subtopic strings specifying the topic path.
   * @return returns the path target subtree
   */
  let traverseAndCreateTopicPath = function(topic){
    // get topic path
    const path = getTopicPathFromArray(topic);

    // traverse path and create if necessary
    let subtree = this.storage;

    const il = path.length;
    for(let i = 0; i < il; i++){
      if(subtree.hasOwnProperty(path[i])){
        subtree = subtree[path[i]];
      }else{
        subtree[path[i]] = {};
        subtree = subtree[path[i]];
      }
    }

    return subtree;
  }

  let cleanPath = function(topic){
    const path = getTopicPathFromArray(topic);

    if(!recursiveIsRelevantCleanUp(this.storage[path[0]])){
      delete this.storage[path[0]];
    }
  }

  let recursiveIsRelevantCleanUp = function(node){
    let rootIsRelevant = false;
    let keys = Object.getOwnPropertyNames(node);

    const il = keys.length;
    for(let i = 0; i < il; i++){
      if(keys[i] === DATA_PROPERTY_KEY){
        rootIsRelevant = true;
      }else{
        // ToDo: Check for valid path subtree (starts with t:)
        let subtreeIsReleveant = recursiveIsRelevantCleanUp(subtree[keys[i]]);
        if(!subtreeIsReleveant){
          delete subtree[keys[i]];
        }
        rootIsRelevant = rootIsRelevant || subtreeIsReleveant;
      }
    }
    return rootIsRelevant;
  }


  module.exports = RuntimeTopicStorage;

})();

