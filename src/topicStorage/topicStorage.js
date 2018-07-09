class TopicStorage {
  constructor() {
    if (new.target === TopicStorage) {
      throw new TypeError("Cannot construct TopicStorage instances directly");
    }

    if (this.push === undefined) {
      throw new TypeError("Must override push");
    }

    if (this.pull === undefined) {
      throw new TypeError("Must override pull");
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
  TopicStorage: TopicStorage,
}
