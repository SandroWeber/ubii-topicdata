// Topic constants.
const TOPIC_PREFIX = 't:';
const TOPIC_SUFFIX = ':t'; // Topic suffix allows the use of sub-topics with spaces at the end without encouraging bugs and human error.
const TOPIC_SEPARATOR = '->';
/**
 * Used for internal representation and for the property names of the entry objects returned by some methods.
 */
const TOPIC_SPECIFIER = 'topic';

// Data constants.
const DATA_PREFIX = 'd:';
/**
 * Used for internal representation and for the property names of the entry objects returned by some methods.
 */
const DATA_SPECIFIER = 'data';
/**
 * Propertey key for internal representation.
 */
const DATA_PROPERTY_KEY = DATA_PREFIX + DATA_SPECIFIER;

// Type constants.
const TYPE_PREFIX = 'tp:';
/**
 * Used for internal representation and for the property names of the entry objects returned by some methods.
 */
const TYPE_SPECIFIER = 'type';
/**
 * Propertey key for internal representation.
 */
const TYPE_PROPERTY_KEY = TYPE_PREFIX + TYPE_SPECIFIER;

// Timestamp constants.
const TIMESTAMP_PREFIX = 'ts:';
/**
 * Used for internal representation and for the property names of the entry objects returned by some methods.
 */
const TIMESTAMP_SPECIFIER = 'timestamp';
/**
 * Propertey key for internal representation.
 */
const TIMESTAMP_PROPERTY_KEY = TIMESTAMP_PREFIX + TIMESTAMP_SPECIFIER;

// Subscriber constants.
const SUBSCRIBER_PREFIX = 's:';
const SUBSCRIBER_SPECIFIER = 'subscriber';
/**
 * Propertey key for internal representation.
 */
const SUBSCRIBER_PROPERTY_KEY = SUBSCRIBER_PREFIX + SUBSCRIBER_SPECIFIER;

// Event constants
const TOPIC_EVENTS = {
  NEW_TOPIC: 'NEW_TOPIC',
  TOPIC_DELETED: 'TOPIC_DELETED'
};

const SUBSCRIPTION_TYPES = {
  TOPIC: 0,
  REGEX: 1,
  ALL: 2,
};

module.exports = {
  TOPIC_PREFIX: TOPIC_PREFIX,
  TOPIC_SUFFIX: TOPIC_SUFFIX,
  TOPIC_SEPARATOR: TOPIC_SEPARATOR,
  TOPIC_SPECIFIER: TOPIC_SPECIFIER,
  DATA_PREFIX: DATA_PREFIX,
  DATA_SPECIFIER: DATA_SPECIFIER,
  DATA_PROPERTY_KEY: DATA_PROPERTY_KEY,
  TYPE_PREFIX: TYPE_PREFIX,
  TYPE_SPECIFIER: TYPE_SPECIFIER,
  TYPE_PROPERTY_KEY: TYPE_PROPERTY_KEY,
  TIMESTAMP_PREFIX: TIMESTAMP_PREFIX,
  TIMESTAMP_SPECIFIER: TIMESTAMP_SPECIFIER,
  TIMESTAMP_PROPERTY_KEY: TIMESTAMP_PROPERTY_KEY,
  SUBSCRIBER_PREFIX: SUBSCRIBER_PREFIX,
  SUBSCRIBER_SPECIFIER: SUBSCRIBER_SPECIFIER,
  SUBSCRIBER_PROPERTY_KEY: SUBSCRIBER_PROPERTY_KEY,
  TOPIC_EVENTS: TOPIC_EVENTS,
  SUBSCRIPTION_TYPES: SUBSCRIPTION_TYPES
};
