class TopicData {
  constructor() {
    if (new.target === TopicData) {
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

    if (this.subscribeAll === undefined) {
      throw new TypeError("Must override subscribeAll");
    }

    if (this.unsubscribe === undefined) {
      throw new TypeError("Must override unsubscribe");
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

    if (this.getRawSubtree === undefined) {
      throw new TypeError("Must override getRawSubtree");
    }
  }
}

module.exports = {
  TopicData: TopicData,
}
