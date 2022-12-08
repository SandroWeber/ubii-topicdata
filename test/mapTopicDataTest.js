const test = require('ava');
const sinon = require('sinon');
const { TOPIC_EVENTS } = require('../src/topicData/constants');
const MapTopicData = require('../src/topicData/mapTopicData');

const { generateRandomTopics, generateTopicDataRecord } = require('./utility');

const NUM_TEST_TOPICS = 10; // needs to be even number
const TEST_TOPIC_LENGTH_MIN = 5;
const TEST_TOPIC_LENGTH_MAX = 20;

test.beforeEach((test) => {
  test.context.topicData = new MapTopicData();
  test.context.topics = generateRandomTopics(
    NUM_TEST_TOPICS,
    TEST_TOPIC_LENGTH_MIN,
    TEST_TOPIC_LENGTH_MAX
  );
});

test('publish()', (t) => {
  let topicData = t.context.topicData;
  let topics = t.context.topics;

  let eventNewTopicString = '';
  let eventCallback = sinon.fake((topic) => {
    eventNewTopicString = topic;
  });
  topicData.events.on(TOPIC_EVENTS.NEW_TOPIC, eventCallback);

  // publish first topic
  let topic = topics[0];
  topicData.publish(topic, {});
  t.is(eventNewTopicString, topic);
  t.is(eventCallback.callCount, 1);
  t.deepEqual(topicData.pull(topic), {});

  // publish topic again
  let changedData = generateTopicDataRecord('int32');
  topicData.publish(topic, changedData);
  t.is(eventNewTopicString, topic);
  t.is(eventCallback.callCount, 1);
  t.deepEqual(topicData.pull(topic), changedData);

  // trying to publish on an empty or undefined topic should throw an error
  t.throws(() => {
    topicData.publish('', {});
  });
  t.throws(() => {
    topicData.publish(undefined, {});
  });
});

test('has() & hasData()', (t) => {
  let topicData = t.context.topicData;
  let topics = t.context.topics;

  // publish on the first half of topics
  for (let i = 0; i < topics.length / 2; i++) {
    topicData.publish(topics[i], {});
  }

  // check that has() returns are correct
  for (let i = 0; i < topics.length; i++) {
    if (i < 5) {
      t.true(topicData.has(topics[i]));
    } else {
      t.false(topicData.has(topics[i]));
    }
  }

  // subscribe to topics with no data
  for (let i = topics.length / 2; i < topics.length; i++) {
    topicData.subscribeTopic(topics[i], sinon.fake());
  }
  // check that hasData() returns are correct
  for (let i = 0; i < topics.length; i++) {
    if (i < 5) {
      t.true(topicData.hasData(topics[i]));
    } else {
      t.true(topicData.has(topics[i]));
      t.false(topicData.hasData(topics[i]));
    }
  }
});

test('pull()', (t) => {
  let topicData = t.context.topicData;
  let topics = t.context.topics;

  // publish on the first half of topics
  for (let i = 0; i < topics.length / 2; i++) {
    topicData.publish(topics[i], {});
  }

  // check that has() returns are correct
  for (let i = 0; i < topics.length; i++) {
    if (i < 5) {
      t.deepEqual(topicData.pull(topics[i]), {});
    } else {
      t.is(topicData.pull(topics[i]), undefined);
    }
  }
});

test('remove()', (t) => {
  let topicData = t.context.topicData;
  let topics = t.context.topics;

  // publish on the first half of topics
  for (let i = 0; i < topics.length / 2; i++) {
    topicData.publish(topics[i], {});
  }

  // try removing topic that doesn't exist
  t.false(topicData.remove(topics[topics.length - 1]));

  // remove the first topic
  t.true(topicData.remove(topics[0]));
  t.false(topicData.has(topics[0]));
  // try removing the same topic twice
  t.false(topicData.remove(topics[0]));
});

test('getAllTopics()', (t) => {
  let topicData = t.context.topicData;

  let topics = t.context.topics;
  for (let i = 0; i < topics.length; i++) {
    topicData.publish(topics[i], {});
  }

  t.deepEqual(topicData.getAllTopics(), topics);
});

test('getAllTopicsWithData()', (t) => {
  let topicData = t.context.topicData;
  let topics = t.context.topics;

  // publish on the first half of topics
  for (let i = 0; i < topics.length / 2; i++) {
    topicData.publish(topics[i], {});
  }

  // try removing topic that doesn't exist
  let topicsWithData = topicData.getAllTopicsWithData();
  t.is(topicsWithData.length, topics.length / 2);
});

test('getSubscriptionTokensForTopic()', (t) => {
  let topicData = t.context.topicData;
  let topics = t.context.topics;

  let subscriptionTokens = [];
  for (let topic of topics) {
    let callback1 = sinon.fake();
    let callback2 = sinon.fake();
    let token1 = topicData.subscribeTopic(topic, callback1);
    let token2 = topicData.subscribeTopic(topic, callback2);
    subscriptionTokens.push(token1);
    subscriptionTokens.push(token2);
  }

  for (let topic of topics) {
    let subTokensFromTopicData = topicData.getSubscriptionTokensForTopic(topic);
    for (let token of subTokensFromTopicData) {
      t.true(subscriptionTokens.includes(token));
    }
  }
});

test('getSubscriptionTokensForRegex()', (t) => {
  let topicData = t.context.topicData;
  let regexString = '/prefix/.*/suffix';

  let regexSubs = topicData.getSubscriptionTokensForRegex(regexString);
  t.is (regexSubs.length, 0);
  
  let token1 = topicData.subscribeRegex(regexString, sinon.fake());
  let token2 = topicData.subscribeRegex(regexString, sinon.fake());

  regexSubs = topicData.getSubscriptionTokensForRegex(regexString);
  t.is (regexSubs.length, 2);

  topicData.unsubscribe(token2);

  regexSubs = topicData.getSubscriptionTokensForRegex(regexString);
  t.is (regexSubs.length, 1);

  topicData.unsubscribe(token1);

  regexSubs = topicData.getSubscriptionTokensForRegex(regexString);
  t.is (regexSubs.length, 0);
});

test('subscribe() & unsubscribe()', (t) => {
  let topicData = t.context.topicData;
  let topics = t.context.topics;

  // subscription callbacks
  let subscriptionTokens = [];
  for (let topic of topics) {
    let callback = sinon.fake();
    let token = topicData.subscribeTopic(topic, callback);
    subscriptionTokens.push(token);
  }

  // publish all topics
  for (let topic of topics) {
    topicData.publish(topic, {});
  }
  // check that all callbacks have been called
  for (let token of subscriptionTokens) {
    t.is(token.callback.callCount, 1);
  }

  // unsubscribe for the first half of subscription tokens
  let unsubscribedTokens = [];
  for (let i = 0; i < subscriptionTokens.length / 2; i++) {
    unsubscribedTokens.push(subscriptionTokens[i]);
    topicData.unsubscribe(subscriptionTokens[i]);
  }
  subscriptionTokens = subscriptionTokens.filter(
    (token) => !unsubscribedTokens.includes(token)
  );

  // publish all topics again
  for (let topic of topics) {
    topicData.publish(topic, {});
  }
  // check that callbacks for tokens still subscribed are called again
  for (let token of subscriptionTokens) {
    t.is(token.callback.callCount, 2);
  }
  // check that callbacks for tokens unsubscribed are not called again
  for (let token of unsubscribedTokens) {
    t.is(token.callback.callCount, 1);
  }

  // trying to subscribe to an empty or undefined topic should throw an error
  t.throws(() => {
    topicData.subscribeTopic('', () => {});
  });
  t.throws(() => {
    topicData.subscribeTopic(undefined, () => {});
  });
  // trying to subscribe with something other than a function as callback should throw an error
  t.throws(() => {
    topicData.subscribeTopic('/some/topic', {});
  });
  t.throws(() => {
    topicData.subscribeTopic('/some/topic', undefined);
  });
});

test('subscribeRegex() & subscribeAll() & unsubscribe()', (t) => {
  let topicData = t.context.topicData;
  let topics = ['/a', '/a/b', '/a/b/c', '/x', '/x/y', '/x/y/z'];

  let subAll = topicData.subscribeAll(sinon.fake());
  let subA = topicData.subscribeRegex('/a', sinon.fake());
  let subAB = topicData.subscribeRegex('/a/b', sinon.fake());
  let subBC = topicData.subscribeRegex('/b/c', sinon.fake());
  let subABC = topicData.subscribeRegex('/a/b/c', sinon.fake());
  let subX = topicData.subscribeRegex('/x', sinon.fake());
  let subXY = topicData.subscribeRegex('/x/y', sinon.fake());
  let subYZ = topicData.subscribeRegex('/y/z', sinon.fake());
  let subXYZ = topicData.subscribeRegex('/x/y/z', sinon.fake());
  let subTokens = [subAll, subA, subAB, subBC, subABC, subX , subXY, subYZ, subXYZ];

  for (let topic of topics) {
    topicData.publish(topic, {});
  }
  t.is(subAll.callback.callCount, 6);
  t.is(subA.callback.callCount, 3);
  t.is(subAB.callback.callCount, 2);
  t.is(subBC.callback.callCount, 1);
  t.is(subABC.callback.callCount, 1);
  t.is(subX.callback.callCount, 3);
  t.is(subXY.callback.callCount, 2);
  t.is(subYZ.callback.callCount, 1);
  t.is(subXYZ.callback.callCount, 1);

  for (let token of subTokens) {
      token.callback.resetHistory();
      t.is(token.callback.callCount, 0);
  }

  topicData.unsubscribe(subA);
  topicData.unsubscribe(subXY);
  topicData.unsubscribe(subXYZ);

  for (let topic of topics) {
    topicData.publish(topic, {});
  }
  t.is(subAll.callback.callCount, 6);
  t.is(subA.callback.callCount, 0);
  t.is(subAB.callback.callCount, 2);
  t.is(subBC.callback.callCount, 1);
  t.is(subABC.callback.callCount, 1);
  t.is(subX.callback.callCount, 3);
  t.is(subXY.callback.callCount, 0);
  t.is(subYZ.callback.callCount, 1);
  t.is(subXYZ.callback.callCount, 0);
});
