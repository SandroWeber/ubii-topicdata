const EventEmitter = require('events');

const { InterfaceTopicData } = require('./interfaceTopicData.js');
const {
  getTopicPathFromString,
  getTopicStringFromPath,
  removeTopicPrefixAndSuffix,
  validateTopic,
} = require('./utility.js');

const ENTRY_PROPERTY_DATA = 'd';
const ENTRY_PROPERTY_SUBSCRIPTIONS = 's';

/**
 * Local runtime implementaion of a topic data.
 * The data is only available at runtime and is not permanently stored.
 * (No local file or database involved. The data is only in the program memory.)
 *
 * The runtime topic data uses a common javascript object as storage structure.
 * This is the most performant way to find key-value pairs.
 * The topic of queries is split and used as property keys.
 */
class MapTopicData extends InterfaceTopicData {
  constructor() {
    super();

    this.topicDataBuffer = new Map();

    this.events = new EventEmitter();
  }

  /**
   * Publishes data under the specified topic to the topic data
   * If there is already data associated with this topic, it will be overwritten.
   * @param {String} topic Topic strings specifying the topic path.
   * @param {Object} object Type of the data.
   */
  publish(topic, data) {
    // Get the entry.
    let entry = this.topicDataBuffer.get(topic);
    entry[ENTRY_PROPERTY_DATA] = data;

    // Notify subscribers
    notifySubscribers(entry);
  }

  /**
   * Pulls the data from topic data that is associated with specified topic.
   * @param {String} topic Topic strings specifying the topic path.
   * @returns Returns the data associated with the specified topic. Returns undefined if the topic does not exist.
   */
  pull(topic) {
    if (!this.topicDataBuffer.has(topic)) {
      return undefined;
    }

    return this.topicDataBuffer.get(topic)[ENTRY_PROPERTY_DATA];
  }

  /**
   * Subscribes the callback function to the specified topic.
   * The callback function is called with the topic and a data parameter whenever data is published to the specified topic.
   * Returns a token which can be passed to the unsubscribe method in order to unsubscribe the callback from the topic.
   * @param {String} topic Topic strings specifying the topic path.
   * @param {Function} callback Function called when subscriber is notified. Should accept a topic and a entry parameter.
   * @return Returns a token which can be passed to the unsubscribe mthod in order to unsubscribe the callback from the topic.
   */
  subscribe(topic, callback) {
    if (!topic || topic === '') {
      throw new Error(
        'Subscribe: passed topic parameter is ' + topic
      );
    }
    if (typeof callback !== 'function') {
      throw new Error(
        'Subscribe: passed callback parameter is not a function.'
      );
    }

    let entry = this.topicDataBuffer.get(topic);
    if (!entry) {
      entry = {};
      entry[ENTRY_PROPERTY_SUBSCRIPTIONS] = [];
      this.topicDataBuffer.set(topic, entry);
    }

    let token = generateSubscriptionToken(topic, MapTopicData.SUBSCRIPTION_TYPES.SINGLE, callback);
    entry[ENTRY_PROPERTY_SUBSCRIPTIONS].push(token);

    return token;
  }

  subscribeRegex(topic, callback) {}

  /**
   * Subscribes the callback function to all topics.
   * The callback function is called with the topic and a data parameter whenever data is published to any topic of the topicData.
   * Returns a token which can be passed to the unsubscribe mthod in order to unsubscribe the callback.
   * @param {Function} callback Function called when subscriber is notified. Should accept a topic and a entry parameter.
   * @return Returns a token which can be passed to the unsubscribe mthod in order to unsubscribe the callback.
   */
  subscribeAll(callback) {
    if (typeof callback !== 'function') {
      throw new Error(
        'Subscribe: passed callback parameter is not a function.'
      );
    }
    if (this.universalSubscribtions === undefined) {
      this.universalSubscribtions = [];
    }
    let subscriberId = ++this.currentTokenId;
    this.universalSubscribtions.push({
      callback: callback,
      id: subscriberId,
    });

    let token = {
      topic: '',
      id: subscriberId,
      type: 'universal',
    };
    return token;
  }

  /**
   * Unsubscribes the callback specified by this token.
   * @param {*} token
   */
  unsubscribe(token) {
    if (token.type === 'single') {
      let entry = getTopicNode.call(this, token.topic);
      if (entry[SUBSCRIBER_PROPERTY_KEY] === undefined) {
        return;
      }
      entry[SUBSCRIBER_PROPERTY_KEY] = entry[SUBSCRIBER_PROPERTY_KEY].filter(
        (subscriber) => subscriber.id !== token.id
      );
    } else if (token.type === 'universal') {
      this.universalSubscribtions = this.universalSubscribtions.filter(
        (subscriber) => subscriber.id !== token.id
      );
    }
  }

  unsubscribeRegex(topic, callback) {}

  /**
   * Removes the topic and the associated data from the topic data if the topic exists. Cleans up the path afterwards.
   * @param {String[]} topic Array of unprefixed subtopic strings specifying the topic path.
   */
  remove(topic) {
    if (!this.has(topic)) {
      return;
    }
    let entry = getTopicNode.call(this, topic);
    delete entry[DATA_PROPERTY_KEY];
    delete entry[TYPE_PROPERTY_KEY];
    delete entry[TIMESTAMP_PROPERTY_KEY];

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
    let entry = this.topicDataBuffer;
    const il = path.length;
    for (let i = 0; i < il; i++) {
      if (entry[path[i]] !== undefined) {
        entry = entry[path[i]];
      } else {
        return false;
      }
    }
    return true;
  }

  /**
   * Get an array of all topics that have data associated to it.
   */
  getAllTopicsWithData() {
    let result = [];
    let currentTopicPath = [];

    // recursive helper method that adds the currentTopic and the data to the result array and calls itself on all subtopics
    let recursiveAddRelevantTopicDataPairs = function (entry) {
      let keys = Object.getOwnPropertyNames(entry);
      const il = keys.length;
      for (let i = 0; i < il; i++) {
        if (keys[i] === DATA_PROPERTY_KEY) {
          // This topic is relevant because it has its own data property
          let raw = {};
          raw[TOPIC_SPECIFIER] = getTopicStringFromPath(currentTopicPath);
          raw[DATA_SPECIFIER] = entry[DATA_PROPERTY_KEY];
          raw[TYPE_SPECIFIER] = entry[TYPE_PROPERTY_KEY];
          raw[TIMESTAMP_SPECIFIER] = entry[TIMESTAMP_PROPERTY_KEY];
          result.push(raw);
        } else if (
          keys[i] !== SUBSCRIBER_PROPERTY_KEY &&
          keys[i] !== TYPE_PROPERTY_KEY &&
          keys[i] !== TIMESTAMP_PROPERTY_KEY
        ) {
          // Process all subtopics
          currentTopicPath.push(removeTopicPrefixAndSuffix(keys[i]));
          recursiveAddRelevantTopicDataPairs(entry[keys[i]]);
          currentTopicPath.pop();
        }
      }
    };

    // start the procedure on all first layer topics (subtopics of root)
    let keys = Object.getOwnPropertyNames(this.topicDataBuffer);
    const il = keys.length;
    for (let i = 0; i < il; i++) {
      currentTopicPath.push(removeTopicPrefixAndSuffix(keys[i]));
      recursiveAddRelevantTopicDataPairs(this.topicDataBuffer[keys[i]]);
      currentTopicPath.pop();
    }

    return result;
  }

  /**
   * Get all subscriptions tokens for the topic.
   * @param {string} topic
   * @returns {Array} The list of subscription tokens
   */
  getSubscriptionTokens(topic) {
    let entry = getTopicNode.call(this, topic);
    return entry[SUBSCRIBER_PROPERTY_KEY];
  }

  getRawSubtree(topic) {
    if (!this.has(topic)) {
      return undefined;
    }
    let entry = getTopicNode.call(this, topic);
    return entry;
  }
}

// --- private methods

/**
 * Retruns the entry and its corresponding subentries with the specified topic as root.
 * If the spcified topic does not exist, its topic path is created if createOnTraverse is true.
 * @param {String[]} topic Array of unprefixed subtopic strings specifying the topic path.
 * @param {Boolean} createOnTraverse Should the path be created if it does not exist?
 * @return returns the entry specified by the path or undefined.
 */
let getTopicNode = function (topic, createOnTraverse = true) {
  validateTopic(topic);
  const path = getTopicPathFromString(topic);

  // traverse path and create if necessary
  let subtree = this.storage;

  let newTopic = false;
  const il = path.length;
  for (let i = 0; i < il; i++) {
    if (subtree[path[i]] !== undefined) {
      // Propaply faster than hasOwnProperty (--> less safe)
      subtree = subtree[path[i]];
    } else {
      if (createOnTraverse) {
        subtree[path[i]] = {};
        subtree = subtree[path[i]];
        newTopic = true;
      } else {
        subtree = undefined;
        break;
      }
    }
  }

  if (newTopic) {
    this.events.emit(TOPIC_EVENTS.NEW_TOPIC, topic);
  }

  return subtree;
};

/**
 * Cleans up the path by removing all properties that do not have any data key in its subtree (None of its
 *  subtopics has data associated to it).
 * @param {String[]} topic Array of unprefixed subtopic strings specifying the topic path.
 */
let cleanUpPath = function (topic) {
  validateTopic(topic);
  const path = getTopicPathFromString(topic);

  if (!recursiveIsRelevantCleanUp(this.storage[path[0]])) {
    delete this.storage[path[0]];
  }
};

let recursiveIsRelevantCleanUp = function (entry) {
  let isRelevant = false;
  let keys = Object.getOwnPropertyNames(entry);

  const il = keys.length;
  for (let i = 0; i < il; i++) {
    if (keys[i] === DATA_PROPERTY_KEY) {
      isRelevant = true;
    } else {
      // Check other subtopics, Therefore exclude special properties.
      if (
        keys[i] !== SUBSCRIBER_PROPERTY_KEY &&
        keys[i] !== TYPE_PROPERTY_KEY &&
        keys[i] !== TIMESTAMP_PROPERTY_KEY
      ) {
        let subtreeIsReleveant = recursiveIsRelevantCleanUp(entry[keys[i]]);
        if (!subtreeIsReleveant) {
          delete entry[keys[i]];
        }
        isRelevant = isRelevant || subtreeIsReleveant;
      }
    }
  }
  return isRelevant;
};

/**
 * Calls every callback function with the specified parameters.
 * @param {Function[]} subscribers Array of subscribed callback functions
 * @param {*} topic
 * @param {*} entry
 */
let notifySubscribers = (topicDataEntry) => {
  topicDataEntry && topicDataEntry[ENTRY_PROPERTY_SUBSCRIPTIONS].forEach(sub => {
    sub.callback(topicDataEntry[ENTRY_PROPERTY_DATA]);
  });
};

let subscriptionTokenID = -1;
let generateSubscriptionToken = (topic, subscriptionType, callback) => {
  let tokenID = ++this.subscriptionTokenID;
  return {
      id: tokenID,
      topic: topic,
      type: subscriptionType,
      callback: callback
  }
}

MapTopicData.SUBSCRIPTION_TYPES = Object.freeze({
  SINGLE: 0,
  REGEX: 1
});

module.exports = MapTopicData;
