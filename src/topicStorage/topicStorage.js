class TopicStorage {
  constructor() {
    if (new.target === TopicStorage) {
      throw new TypeError("Cannot construct TopicStorage instances directly");
    }

    if (this.push === undefined) {
      // or maybe test typeof this.method === "function"
      throw new TypeError("Must override push");
    }

    if (this.pull === undefined) {
      // or maybe test typeof this.method === "function"
      throw new TypeError("Must override pull");
    }

    if (this.remove === undefined) {
      // or maybe test typeof this.method === "function"
      throw new TypeError("Must override subscribe");
    }

    if (this.has === undefined) {
      // or maybe test typeof this.method === "function"
      throw new TypeError("Must override subscribe");
    }
  }
}

module.exports = {
  TopicStorage: TopicStorage,
}
