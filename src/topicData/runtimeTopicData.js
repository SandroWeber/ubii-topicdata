const {
  TopicData
} = require('./topicData.js');
const {
  DATA_PROPERTY_KEY,
  SUBSCRIBER_PROPERTY_KEY,
} = require('./constants.js');
const {
  getTopicPathFromString,
  getTopicStringFromPath,
  removeTopicPrefixAndSuffix,
  validateTopic,
} = require('./utility.js');

(function () {
  /**
   * Local runtime implementaion of a topic data.
   * The data is only available at runtime and is not permanently stored.
   * (No local file or database involved. The data is only in the program memory.)
   * 
   * The runtime topic data uses a common javascript object as storage structure.
   * This is the most performant way to find key-value pairs.
   * The topic of queries is split and used as property keys.
   */
  class RuntimeTopicData extends TopicData {

    constructor() {
      super();

      this.storage = {};
      this.currentTokenId = -1;

      this.universalSubscribtions = [];
    }

    /**
     * Publishes data under the specified topic to the topic data
     * If there is already data associated with this topic, it will be overwritten.
     * @param {String} topic Topic strings specifying the topic path.
     * @param {*} data 
     */
    publish(topic, data) {
      let node = getTopicNode.call(this, topic);
      node[DATA_PROPERTY_KEY] = data;

      if (node[SUBSCRIBER_PROPERTY_KEY] !== undefined) {
        notify.call(this, node[SUBSCRIBER_PROPERTY_KEY], topic, node[DATA_PROPERTY_KEY]);
      }
      if(this.universalSubscribtions.length > 0){
        notify.call(this, this.universalSubscribtions, topic, node[DATA_PROPERTY_KEY]);
      }

    }

    /**
     * Pulls the data from topic data that is stored under the given topic.
     * @param {String} topic Topic strings specifying the topic path.
     * @returns Returns the data stored under the given topic. Returns undefined if the topic does not exist.
     */
    pull(topic) {
      if (!this.has(topic)) {
        return undefined;
      }
      let node = getTopicNode.call(this, topic);
      return node[DATA_PROPERTY_KEY];
    }

    /**
     * Subscribes the callback function to the specified topic.
     * The callback function is called with the topic and a data parameter whenever data is published to the specified topic.
     * Returns a token which can be passed to the unsubscribe mthod in order to unsubscribe the callback from the topic.
     * @param {String} topic Topic strings specifying the topic path.
     * @param {Function} callback Function called when subscriber is notified. Should accept a topic and a data parameter.
     * @return Returns a token which can be passed to the unsubscribe mthod in order to unsubscribe the callback from the topic.
     */
    subscribe(topic, callback) {
      let node = getTopicNode.call(this, topic);
      if (typeof callback !== "function") {
        throw new Error('Subscribe: passed callback parameter is not a function.');
      }
      if (node[SUBSCRIBER_PROPERTY_KEY] === undefined) {
        node[SUBSCRIBER_PROPERTY_KEY] = [];
      }
      let subscriberId = ++this.currentTokenId;
      node[SUBSCRIBER_PROPERTY_KEY].push({
        'callback': callback,
        'id': subscriberId,
      });

      let token = {
        'topic': topic,
        'id': subscriberId,
        'type': 'topic'
      }
      return token;
    }

    /**
     * Subscribes the callback function to the specified topic.
     * The callback function is called with the topic and a data parameter whenever data is published to the specified topic.
     * Returns a token which can be passed to the unsubscribe mthod in order to unsubscribe the callback from the topic.
     * @param {String} topic Topic strings specifying the topic path.
     * @param {Function} callback Function called when subscriber is notified. Should accept a topic and a data parameter.
     * @return Returns a token which can be passed to the unsubscribe mthod in order to unsubscribe the callback from the topic.
     */
    subscribeAll(callback) {
      if (typeof callback !== "function") {
        throw new Error('Subscribe: passed callback parameter is not a function.');
      }
      if (this.universalSubscribtions === undefined) {
        this.universalSubscribtions = [];
      }
      let subscriberId = ++this.currentTokenId;
      this.universalSubscribtions.push({
        'callback': callback,
        'id': subscriberId,
      });

      let token = {
        'topic': '',
        'id': subscriberId,
        'type': 'universal'
      }
      return token;
    }

    /**
     * Unsubscribes the callback specified by this token from the coresponding topic.
     * @param {*} token 
     */
    unsubscribe(token) {
      if (token.type === 'topic') {
        let node = getTopicNode.call(this, token.topic);
        if (node[SUBSCRIBER_PROPERTY_KEY] === undefined) {
          return;
        }
        node[SUBSCRIBER_PROPERTY_KEY] = node[SUBSCRIBER_PROPERTY_KEY].filter(subscriber => subscriber.id !== token.id);
      } else if (token.type === 'universal') {
        this.universalSubscribtions = this.universalSubscribtions.filter(subscriber => subscriber.id !== token.id);
      }
    }

    /**
     * Removes the topic and data from topic data that is stored under the given topic if the topic exists. 
     * Cleans up the path afterwards.
     * @param {String[]} topic Array of unprefixed subtopic strings specifying the topic path.
     */
    remove(topic) {
      if (!this.has(topic)) {
        return;
      }
      let node = getTopicNode.call(this, topic);
      delete node[DATA_PROPERTY_KEY];

      cleanUpPath.call(this, topic);
    }

    /**
     * Does the the storage has the given topic?
     * @param {String[]} topic Array of unprefixed subtopic strings specifying the topic path.
     * @returns {Boolean} Returns whether the the storage has the given topic or not.
     */
    has(topic) {
      validateTopic(topic);
      const path = getTopicPathFromString(topic);

      // traverse path
      let node = this.storage;
      const il = path.length;
      for (let i = 0; i < il; i++) {
        if (node[path[i]] !== undefined) {
          node = node[path[i]];
        } else {
          return false;
        }
      }
      return true;
    }

    getAllTopicsWithData() {
      let result = [];
      let currentTopicPath = [];

      // recursive helper method that adds the currentTopic and the data to the result array and calls itself on all subtopics
      let recursiveAddRelevantTopicDataPairs = function (node) {
        let keys = Object.getOwnPropertyNames(node);
        const il = keys.length;
        for (let i = 0; i < il; i++) {
          if (keys[i] === DATA_PROPERTY_KEY) {
            // This topic is relevant because it has its own data property
            result.push({
              topic: getTopicStringFromPath(currentTopicPath),
              data: node[DATA_PROPERTY_KEY],
            });
          } else {
            // Process all subtopics
            currentTopicPath.push(removeTopicPrefixAndSuffix(keys[i]));
            recursiveAddRelevantTopicDataPairs(node[keys[i]]);
            currentTopicPath.pop();
          }
        }
      }

      // start the procedure on all first layer topics (subtopics of root)
      let keys = Object.getOwnPropertyNames(this.storage);
      const il = keys.length;
      for (let i = 0; i < il; i++) {
        currentTopicPath.push(removeTopicPrefixAndSuffix(keys[i]));
        recursiveAddRelevantTopicDataPairs(this.storage[keys[i]]);        
        currentTopicPath.pop();
      }

      return result;
    }

    getRawSubtree(topic) {
      if (!this.has(topic)) {
        return undefined;
      }
      let node = getTopicNode.call(this, topic);
      return node;
    }
  }



  // --- private methods

  /**
   * Retruns the node and its corresponding subtree with the specified topic as root.
   * If the spcified topic does not exist, its topic path is created if createOnTraverse is true.
   * @param {String[]} topic Array of unprefixed subtopic strings specifying the topic path.
   * @param {Boolean} createOnTraverse Should the path be created if it does not exist?
   * @return returns the node specified by the path or undefined.
   */
  let getTopicNode = function (topic, createOnTraverse = true) {
    validateTopic(topic);
    const path = getTopicPathFromString(topic);

    // traverse path and create if necessary
    let subtree = this.storage;

    const il = path.length;
    for (let i = 0; i < il; i++) {
      if (subtree[path[i]] !== undefined) { // Propaply faster than hasOwnProperty (--> less safe)
        subtree = subtree[path[i]];
      } else {
        if (createOnTraverse) {
          subtree[path[i]] = {};
          subtree = subtree[path[i]];
        } else {
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
  let cleanUpPath = function (topic) {
    validateTopic(topic);
    const path = getTopicPathFromString(topic);

    if (!recursiveIsRelevantCleanUp(this.storage[path[0]])) {
      delete this.storage[path[0]];
    }
  }

  let recursiveIsRelevantCleanUp = function (node) {
    let isRelevant = false;
    let keys = Object.getOwnPropertyNames(node);

    const il = keys.length;
    for (let i = 0; i < il; i++) {
      if (keys[i] === DATA_PROPERTY_KEY) {
        isRelevant = true;
      } else {
        let subtreeIsReleveant = recursiveIsRelevantCleanUp(node[keys[i]]);
        if (!subtreeIsReleveant) {
          delete node[keys[i]];
        }
        isRelevant = isRelevant || subtreeIsReleveant;
      }
    }
    return isRelevant;
  }

  /**
   * Calls every callback function with the specified parameters.
   * @param {Function[]} subscribers Array of subscribed callback functions
   * @param {*} topic 
   * @param {*} data 
   */
  let notify = function (subscribers, topic, data) {
    subscribers.forEach(subscriber => subscriber.callback(topic, data));
  }

  module.exports = RuntimeTopicData;
})();