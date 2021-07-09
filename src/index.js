const NodeTreeTopicData = require('./topicData/nodeTreeTopicData.js');
const MapTopicData = require('./topicData/mapTopicData.js');
const { TOPIC_EVENTS } = require('./topicData/constants.js');

module.exports = {
  NodeTreeTopicData,
  MapTopicData,
  RuntimeTopicData: MapTopicData,
  TOPIC_EVENTS,
};
