//const test = require('ava');
//const sinon = require('sinon');

const {
  NodeTreeTopicData,
  MapTopicData
} = require('../src/index.js');
const { generateRandomTopics, pickRandomTopicFromList, generateTopicDataRecord } = require('../test/utility');

const TOPIC_STRING_LIMITS = {
  LOWER: 4,
  UPPER: 50,
};

/*const templateTopicDataRecord = {
  int32: 42,
  type: 'int32',
  timestamp: {
    millis: Date.now()
  }
};*/
const templateTopicDataRecord = generateTopicDataRecord('string');

let comparePublishSubscribeSpeed = () => {
  const MEASUREMENT_TIME_MS = 5000;
  console.info('\n... running speed comparison: publish & subscribe (time / run: ' + MEASUREMENT_TIME_MS + 'ms)');
  const NUM_TOPICS = 50;
  const topics = generateRandomTopics(NUM_TOPICS, TOPIC_STRING_LIMITS.LOWER, TOPIC_STRING_LIMITS.UPPER);

  let callbackCounter = 0;
  let callback = () => {
    ++callbackCounter;
  };
  let records = new Map();
  topics.forEach((topic) => {
    records.set(topic, Object.assign({topic: topic}, templateTopicDataRecord));
  });

  // time NodeTreeTopicData
  let nodeTreeTopicData = new NodeTreeTopicData();
  let subTokensNodeTreeTopicData = [];

  callbackCounter = 0;
  topics.forEach((topic) => {
    let token = nodeTreeTopicData.subscribe(topic, callback);
    subTokensNodeTreeTopicData.push(token);
  });

  let tStartNodeTreeTopicData = Date.now();
  while (Date.now() - tStartNodeTreeTopicData <= MEASUREMENT_TIME_MS) {
      let topic = pickRandomTopicFromList(topics);
      let record = records.get(topic);
      nodeTreeTopicData.publish(
        record.topic,
        record[record.type],
        record.type,
        record.timestamp);
  }
  let tEndNodeTreeTopicData = Date.now();
  let scoreNodeTreeTopicData = callbackCounter / (tEndNodeTreeTopicData - tStartNodeTreeTopicData);

  subTokensNodeTreeTopicData.forEach((token) => {
    nodeTreeTopicData.unsubscribe(token);
  });
  delete nodeTreeTopicData;

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
    let topic = pickRandomTopicFromList(topics);
    let record = records.get(topic);
    mapTopicData.publish(topic, record);
  }
  let tEndMapTopicData = Date.now();
  let scoreMapTopicData = callbackCounter / (tEndMapTopicData - tStartMapTopicData);

  subTokensMapTopicData.forEach((token) => {
    mapTopicData.unsubscribe(token);
  });
  delete mapTopicData;

  console.info('--- Speed Comparison NodeTreeTopicData vs. MapTopicData - successful publish() calls & subscribe callbacks over timeframe');
  console.info('Scores:\nNodeTreeTopicData = ' + scoreNodeTreeTopicData + '\nMapTopicData = ' + scoreMapTopicData);
};

let comparePullSpeed = () => {
  const MEASUREMENT_TIME_MS = 5000;
  console.info('\n... running speed comparison: pull (time / run: ' + MEASUREMENT_TIME_MS + 'ms)');
  const NUM_TOPICS = 50;
  const topics = generateRandomTopics(NUM_TOPICS, TOPIC_STRING_LIMITS.LOWER, TOPIC_STRING_LIMITS.UPPER);

  let records = new Map();
  topics.forEach((topic) => {
    records.set(topic, Object.assign({topic: topic}, templateTopicDataRecord));
  });

  let counter = 0;
  let nodeTreeTopicData = new NodeTreeTopicData();
  let mapTopicData = new MapTopicData();

  topics.forEach((topic) => {
    let record = records.get(topic);

    nodeTreeTopicData.publish(
      record.topic,
      record[record.type],
      record.type,
      record.timestamp);
    
    mapTopicData.publish(topic, record);
  });

  // measure MapTopicData
  counter = 0;
  let tStartMapTopicData = Date.now();
  while (Date.now() - tStartMapTopicData <= MEASUREMENT_TIME_MS) {
    let topic = pickRandomTopicFromList(topics);
    let record = mapTopicData.pull(topic);
    record && counter++;
  }
  let tEndMapTopicData = Date.now();
  let scoreMapTopicData = counter / (tEndMapTopicData - tStartMapTopicData);

  // measure NodeTreeTopicData
  counter = 0;
  let tStartNodeTreeTopicData = Date.now();
  while (Date.now() - tStartNodeTreeTopicData <= MEASUREMENT_TIME_MS) {
    let topic = pickRandomTopicFromList(topics);
    let record = nodeTreeTopicData.pull(topic);
    record && counter++;
  }
  let tEndNodeTreeTopicData = Date.now();
  let scoreNodeTreeTopicData = counter / (tEndNodeTreeTopicData - tStartNodeTreeTopicData);

  console.info('--- Speed Comparison NodeTreeTopicData vs. MapTopicData - successful pull() calls over timeframe');
  console.info('Scores:\nNodeTreeTopicData = ' + scoreNodeTreeTopicData + '\nMapTopicData = ' + scoreMapTopicData);
};

let getAllTopicsWithDataCheck = () => {
  console.info('\n... running check return of getAllTopicsWithData() calls');
  const NUM_TOPICS = 2;
  const topics = generateRandomTopics(NUM_TOPICS, TOPIC_STRING_LIMITS.LOWER, TOPIC_STRING_LIMITS.UPPER);

  let nodeTreeTopicData = new NodeTreeTopicData();
  let mapTopicData = new MapTopicData();

  topics.forEach((topic) => {
    nodeTreeTopicData.publish(
      topic,
      templateTopicDataRecord[templateTopicDataRecord.type],
      templateTopicDataRecord.type,
      templateTopicDataRecord.timestamp);
    
    let record = Object.assign({}, templateTopicDataRecord);
    record.topic = topic;
    mapTopicData.publish(topic, record);
  });

  console.info(nodeTreeTopicData.getAllTopicsWithData());
  console.info(mapTopicData.getAllTopicsWithData());
};

(function() {
  comparePublishSubscribeSpeed();
  comparePullSpeed();
  //getAllTopicsWithDataCheck();
})();
