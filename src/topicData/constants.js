const TOPIC_PREFIX = 't:';
const TOPIC_SUFFIX = ':t';  // Topic suffix allows the use of sub-topics with spaces at the end without encouraging bugs and human error.
const TOPIC_SEPARATOR = '->';

const DATA_PREFIX = 'd:';
const DATA_SPECIFIER = 'data';
const DATA_PROPERTY_KEY = DATA_PREFIX + DATA_SPECIFIER;

const TYPE_PREFIX = 'tp:';
const TYPE_SPECIFIER = 'type';
const TYPE_PROPERTY_KEY = TYPE_PREFIX + TYPE_SPECIFIER;

const SUBSCRIBER_PREFIX = 's:';
const SUBSCRIBER_SPECIFIER = 'subscriber';
const SUBSCRIBER_PROPERTY_KEY = SUBSCRIBER_PREFIX + SUBSCRIBER_SPECIFIER;

module.exports = {
    TOPIC_PREFIX: TOPIC_PREFIX,
    TOPIC_SUFFIX: TOPIC_SUFFIX,
    TOPIC_SEPARATOR: TOPIC_SEPARATOR,
    DATA_PREFIX: DATA_PREFIX,
    DATA_SPECIFIER: DATA_PREFIX,
    DATA_PROPERTY_KEY: DATA_PROPERTY_KEY,
    TYPE_PREFIX: TYPE_PREFIX,
    TYPE_SPECIFIER: TYPE_SPECIFIER,
    TYPE_PROPERTY_KEY: TYPE_PROPERTY_KEY,
    SUBSCRIBER_PREFIX: SUBSCRIBER_PREFIX,
    SUBSCRIBER_SPECIFIER: SUBSCRIBER_SPECIFIER,
    SUBSCRIBER_PROPERTY_KEY: SUBSCRIBER_PROPERTY_KEY,
};