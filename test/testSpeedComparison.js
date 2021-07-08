const test = require('ava');
const sinon = require('sinon');

const {
  RuntimeTopicData,
  MapTopicData,
  TOPIC_EVENTS,
} = require('./../src/index.js');

const TOPIC_STRING_LIMITS = {
  LOWER: 4,
  UPPER: 50,
};

let generateRandomTopics = (numTopics) => {
  let topics = [];
  for (let i = 0; i < numTopics; i++) {
    let length =
      TOPIC_STRING_LIMITS.LOWER +
      Math.floor(
        Math.random() * (TOPIC_STRING_LIMITS.UPPER - TOPIC_STRING_LIMITS.LOWER)
      );
    topics.push(generateRandomTopicString(length));
  }

  return topics;
};

const randomStringChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let generateRandomTopicString = (length) => {
  // Pick characers randomly
  let str = '';
  for (let i = 0; i < length; i++) {
    str += randomStringChars.charAt(
      Math.floor(Math.random() * randomStringChars.length)
    );
  }

  return str;
};

let pickTopicFromList = (topics) => {
    return topics[Math.floor(Math.random() * topics.length)];
}

test('random topics, compare successfull publish + subscribe callback count', async (t) => {
  const NUM_TOPICS = 50;
  const topics = generateRandomTopics(NUM_TOPICS);
  //console.info(topics);
  const MEASUREMENT_TIME_MS = 5000;
  t.timeout(3 * MEASUREMENT_TIME_MS);

  const topicDataObject = {
      data: 42,
      type: 'int',
      timestamp: Date.now()
  }

  let callbackCounter = 0;
  let callback = () => {
    ++callbackCounter;
  };

  // time MapTopicData
  let mapTopicData = new MapTopicData();
  let subTokensMapTopicData = [];

  callbackCounter = 0;
  topics.forEach((topic) => {
    let token = mapTopicData.subscribe(topic, callback);
    subTokensMapTopicData.push(token);
  });

  let tStartMapTopicData = Date.now();
  while (Date.now() - tStartMapTopicData <= MEASUREMENT_TIME_MS) {
      let topic = pickTopicFromList(topics);
      mapTopicData.publish(topic, topicDataObject);
  }
  let tEndMapTopicData = Date.now();
  let scoreMapTopicData = callbackCounter / (tEndMapTopicData - tStartMapTopicData);
  console.info('Score MapTopicData: ' + scoreMapTopicData);

  subTokensMapTopicData.forEach((token) => {
    mapTopicData.unsubscribe(token);
  });
  delete mapTopicData;

  // time RuntimeTopicData
  let runtimeTopicData = new RuntimeTopicData();
  let subTokensRuntimeTopicData = [];

  callbackCounter = 0;
  topics.forEach((topic) => {
    let token = runtimeTopicData.subscribe(topic, callback);
    subTokensRuntimeTopicData.push(token);
  });

  let tStartRuntimeTopicData = Date.now();
  while (Date.now() - tStartRuntimeTopicData <= MEASUREMENT_TIME_MS) {
      let topic = pickTopicFromList(topics);
      runtimeTopicData.publish(topic, topicDataObject.data, topicDataObject.type, topicDataObject.timestamp);
  }
  let tEndRuntimeTopicData = Date.now();
  let scoreRuntimeTopicData = callbackCounter / (tEndRuntimeTopicData - tStartRuntimeTopicData);
  console.info('Score RuntimeTopicData: ' + scoreRuntimeTopicData);

  subTokensRuntimeTopicData.forEach((token) => {
    runtimeTopicData.unsubscribe(token);
  });
  delete runtimeTopicData;

  t.pass();
});
