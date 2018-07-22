class TopicData {
  constructor() {
    if (new.target === TopicData) {
      throw new TypeError("Cannot construct TopicData instances directly");
    }

    if (this.push === undefined) {
      throw new TypeError("Must override push");
    }

    if (this.pull === undefined) {
      throw new TypeError("Must override pull");
    }

    if (this.subscribe === undefined) {
      throw new TypeError("Must override subscribe");
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
  }
}

module.exports = {
  TopicData: TopicData,
}
