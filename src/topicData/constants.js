const DATA_PREFIX = 'd:';
const TOPIC_PREFIX = 't:';
const TOPIC_SUFFIX = ':t';  // Topic suffix allows the use of sub-topics with spaces at the end without encouraging bugs and human error.
const SUBSCRIBER_PREFIX = 's:';
const DATA_PROPERTY_KEY = DATA_PREFIX + 'data';
const SUBSCRIBER_PROPERTY_KEY = SUBSCRIBER_PREFIX + 'subscriber';
const TOPIC_SEPARATOR = '->';

module.exports = {
    TOPIC_PREFIX: TOPIC_PREFIX,
    TOPIC_SUFFIX: TOPIC_SUFFIX,
    DATA_PREFIX: DATA_PREFIX,
    SUBSCRIBER_PREFIX: SUBSCRIBER_PREFIX,
    DATA_PROPERTY_KEY: DATA_PROPERTY_KEY,
    SUBSCRIBER_PROPERTY_KEY: SUBSCRIBER_PROPERTY_KEY,
    TOPIC_SEPARATOR: TOPIC_SEPARATOR,
};