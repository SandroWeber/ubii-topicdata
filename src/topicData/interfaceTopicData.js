/**
 * Abstarct topic data base class.
 */
class InterfaceTopicData {
  constructor() {
    if (new.target === InterfaceTopicData) {
      throw new TypeError("Cannot construct TopicData instances directly");
    }

    if (this.publish === undefined) {
      throw new TypeError("Must override publish");
    }

    if (this.pull === undefined) {
      throw new TypeError("Must override pull");
    }

    if (this.subscribe === undefined) {
      throw new TypeError("Must override subscribe");
    }

    if (this.subscribeRegex === undefined) {
      throw new TypeError("Must override subscribeRegex");
    }

    if (this.subscribeAll === undefined) {
      throw new TypeError("Must override subscribeAll");
    }

    if (this.unsubscribe === undefined) {
      throw new TypeError("Must override unsubscribe");
    }

    if (this.unsubscribeRegex === undefined) {
      throw new TypeError("Must override unsubscribeRegex");
    }

    if (this.remove === undefined) {
      throw new TypeError("Must override remove");
    }

    if (this.has === undefined) {
      throw new TypeError("Must override has");
    }

    if (this.getAllTopicsWithData === undefined) {
      throw new TypeError("Must override getAllTopicsWithData");
    }

    if (this.getSubscriptionTokens === undefined) {
      throw new TypeError("Must override getSubscriptionTokens");
    }
  }
}

module.exports = {
  InterfaceTopicData
}
