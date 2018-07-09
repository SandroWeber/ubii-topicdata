const {TopicData} = require('./topicData.js');
const {DATA_PROPERTY_KEY} = require('./constants.js');
const {getTopicPathFromArray} = require('./utility.js');

(function(){
  /**
   * Local runtime implementaion of a topic data.
   * The data is only available at runtime and is not permanently stored.
   * (No local file or database involved. The data is only in the program memory.)
   * 
   * The runtime topic storage uses a common javascript object as storage structure.
   * This is the most performant way to find key-value pairs.
   * The topic of queries is split and used as property keys.
   */
  class RuntimeTopicData extends TopicData {
    
    constructor() {
      super();

      this.storage = {};
    }

    /**
     * Pushes data under the specified topic into the topic data
     * If there is already data under this topic, it will be overwritten.
     * @param {String[]} topic Array of unprefixed subtopic strings specifying the topic path.
     * @param {*} data 
     */
    push(topic, data){
      let node = getTopicSubtree.call(this, topic);
      node[DATA_PROPERTY_KEY] = data;
    }

    /**
     * Pulls the data from topic data that is stored under the given topic.
     * @param {String[]} topic Array of unprefixed subtopic strings specifying the topic path.
     * @returns Returns the data stored under the given topic. Returns undefined if the topic does not exist.
     */
    pull(topic){
      if(!this.has(topic)){
        return undefined;
      }
      let node = getTopicSubtree.call(this, topic);
      return node[DATA_PROPERTY_KEY];
    }

    /**
     * Removes the topic and data from topic data that is stored under the given topic if the topic exists. 
     * Cleans up the path afterwards.
     * @param {String[]} topic Array of unprefixed subtopic strings specifying the topic path.
     */
    remove(topic){
      if(!this.has(topic)){
        return;
      }
      let node = getTopicSubtree.call(this,topic);
      delete node[DATA_PROPERTY_KEY];

      cleanUpPath.call(this,topic);
    }

    /**
     * Does the the storage has the given topic?
     * @param {String[]} topic Array of unprefixed subtopic strings specifying the topic path.
     * @returns {Boolean} Returns whether the the storage has the given topic or not.
     */
    has(topic){
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
   * Retruns the subtree with the specified topic as root.
   * If the spcified topic does not exist, its topic path is created if createOnTraverse is true.
   * @param {String[]} topic Array of unprefixed subtopic strings specifying the topic path.
   * @return returns the subtree of the topic path target
   */
  let getTopicSubtree = function(topic, createOnTraverse = true){
    const path = getTopicPathFromArray(topic);

    // traverse path and create if necessary
    let subtree = this.storage;

    const il = path.length;
    for(let i = 0; i < il; i++){
      if(subtree.hasOwnProperty(path[i])){
        subtree = subtree[path[i]];
      }else{
        if(createOnTraverse){
          subtree[path[i]] = {};
          subtree = subtree[path[i]];
        }else{
          subtree = undefined;
          break;
        }
      }
    }

    return subtree;
  }

  /**
   * Removes all properties that do not have any data key in its subtree.
   * @param {String[]} topic Array of unprefixed subtopic strings specifying the topic path.
   */
  let cleanUpPath = function(topic){
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
        let subtreeIsReleveant = recursiveIsRelevantCleanUp(subtree[keys[i]]);
        if(!subtreeIsReleveant){
          delete subtree[keys[i]];
        }
        rootIsRelevant = rootIsRelevant || subtreeIsReleveant;
      }
    }
    return rootIsRelevant;
  }


  module.exports = RuntimeTopicData;
})();

