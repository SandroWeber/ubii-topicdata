const EventEmitter = require('events');

const { InterfaceTopicData } = require('./interfaceTopicData.js');
const { TOPIC_EVENTS } = require('./constants.js');

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
    this.regexSubscriptions = [];

    this.events = new EventEmitter();
    this.events.on(TOPIC_EVENTS.NEW_TOPIC, (topic) => {
      this.onEventNewTopic(topic);
    });
  }

  has(topic) {
    return this.topicDataBuffer.has(topic);
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

  remove(topic) {
    return this.topicDataBuffer.delete(topic);
  }

  getAllTopicsWithData() {
    return Array.from(this.topicDataBuffer.values())
      .filter((record) => record[ENTRY_PROPERTY_DATA])
      .map((record) =>
        Object.assign(
          {
            data: record[ENTRY_PROPERTY_DATA][record[ENTRY_PROPERTY_DATA].type],
          },
          record[ENTRY_PROPERTY_DATA]
        )
      );
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
    if (!entry) {
      entry = createEntry(topic, this.topicDataBuffer, data);
      this.events.emit(TOPIC_EVENTS.NEW_TOPIC, topic);
    } else {
      entry[ENTRY_PROPERTY_DATA] = data;
    }

    // Notify subscribers
    notifySubscribers(entry);
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
      throw new Error('Subscribe: passed topic parameter is ' + topic);
    }
    if (typeof callback !== 'function') {
      throw new Error(
        'Subscribe: passed callback parameter is not a function.'
      );
    }

    let entry = this.topicDataBuffer.get(topic);
    if (!entry) {
      entry = createEntry(topic, this.topicDataBuffer);
      this.events.emit(TOPIC_EVENTS.NEW_TOPIC, topic);
    }

    let token = generateSubscriptionToken(
      topic,
      MapTopicData.SUBSCRIPTION_TYPES.TOPIC,
      callback
    );
    entry[ENTRY_PROPERTY_SUBSCRIPTIONS].push(token);

    return token;
  }

  unsubscribeTopic(token) {
    let entry = this.topicDataBuffer.get(token.topic);
    entry[ENTRY_PROPERTY_SUBSCRIPTIONS] = entry[
      ENTRY_PROPERTY_SUBSCRIPTIONS
    ].filter((sub) => sub.id !== token.id);
  }

  subscribeRegex(regex, callback) {
    let token = generateSubscriptionToken(
      regex,
      MapTopicData.SUBSCRIPTION_TYPES.REGEX,
      callback
    );
    this.regexSubscriptions.push(token);
    for (const [topic, entry] of this.topicDataBuffer) {
      if (token.regex.test(topic)) {
        entry[ENTRY_PROPERTY_SUBSCRIPTIONS].push(token);
        token.regexTopicMatches.push(topic);
      }
    }

    return token;
  }

  unsubscribeRegex(token) {
    for (const topic of token.regexTopicMatches) {
      let entry = this.topicDataBuffer.get(topic);
      entry[ENTRY_PROPERTY_SUBSCRIPTIONS] = entry[ENTRY_PROPERTY_SUBSCRIPTIONS].filter(sub => sub.id !== token.id);
    }
  }

  subscribeAll(callback) {
    this.subscribeRegex('*', callback);
  }

  unsubscribe(token) {
    if (token.type === MapTopicData.SUBSCRIPTION_TYPES.TOPIC) {
      this.unsubscribeTopic(token);
    } else if (token.type === MapTopicData.SUBSCRIPTION_TYPES.REGEX || token.type === MapTopicData.SUBSCRIPTION_TYPES.ALL) {
      this.unsubscribeRegex(token);
    }
  }

  onEventNewTopic(topic) {
    this.regexSubscriptions.forEach((token) => {
      if (token.regex.test(topic)) {
        let entry = this.topicDataBuffer.get(topic);
        entry[ENTRY_PROPERTY_SUBSCRIPTIONS].push(token);
        token.regexTopicMatches.push(topic);
      }
    });
  }
}

let createEntry = (topic, topicDataBuffer, data = undefined) => {
  entry = {};
  entry[ENTRY_PROPERTY_SUBSCRIPTIONS] = [];
  entry[ENTRY_PROPERTY_DATA] = data;
  topicDataBuffer.set(topic, entry);

  return entry;
};

/**
 * Calls every callback function with the specified parameters.
 * @param {Function[]} subscribers Array of subscribed callback functions
 * @param {*} topic
 * @param {*} entry
 */
let notifySubscribers = (topicDataEntry) => {
  topicDataEntry &&
    topicDataEntry[ENTRY_PROPERTY_SUBSCRIPTIONS].forEach((token) => {
      token.callback(topicDataEntry[ENTRY_PROPERTY_DATA]);
    });
};

let subscriptionTokenID = -1;
let generateSubscriptionToken = (topic, subscriptionType, callback) => {
  let tokenID = ++this.subscriptionTokenID;

  let token = {
    id: tokenID,
    topic: topic,
    type: subscriptionType,
    callback: callback,
  };
  if (subscriptionType === MapTopicData.SUBSCRIPTION_TYPES.REGEX) {
    token.regex = new RegExp(topic);
    token.regexTopicMatches = [];
  }

  return token;
};

MapTopicData.SUBSCRIPTION_TYPES = Object.freeze({
  TOPIC: 0,
  REGEX: 1,
  ALL: 2,
});

module.exports = MapTopicData;
