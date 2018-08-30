import test from 'ava';
import {
    RuntimeTopicData
} from './../src/index.js';
const {
    validateTopic,
    removeTopicPrefixAndSuffix,
    getTopicPathFromString,
    getTopicStringFromPath,
} = require('./../src/topicData/utility.js');
const {
    TOPIC_PREFIX,
    TOPIC_SUFFIX
} = require('./../src/topicData/constants.js');

(function () {
    test('validateTopic', t => {
        let valid, invalid;

        let invalidChecks = (invalid) => {
            t.throws(() => {
                validateTopic(invalid);
            });
        }

        let validChecks = (valid) => {
            t.notThrows(() => {
                validateTopic(valid);
            });
        }

        // valid topic tests

        // simple valid topic
        valid = 'root->subtopic1->subtopic2->subtopic3->subtopic4';
        validChecks(valid);

        // trailing space
        valid = 'root->subtopic1 ->subtopic2 ->subtopic3 ->subtopic4';
        validChecks(valid);

        // trailing space (also on first)
        valid = 'root->subtopic1 ->subtopic2 ->subtopic3 ->subtopic4';
        validChecks(valid);

        // prefixed space
        valid = 'root-> subtopic1-> subtopic2->subtopic3->subtopic4';
        validChecks(valid);

        // prefixed space (also on first)
        valid = ' root-> subtopic1-> subtopic2->subtopic3->subtopic4';
        validChecks(valid);

        // trailing and prefixed space
        valid = 'root-> subtopic1 -> subtopic2 -> subtopic3 ->subtopic4';
        validChecks(valid);

        // trailing and prefixed space (also on first)
        valid = ' root -> subtopic1 -> subtopic2 -> subtopic3 ->subtopic4';
        validChecks(valid);


        // invalid topic tests

        // array of strings
        invalid = ['root', 'subtopic1', 'subtopic2', 'subtopic4'];
        invalidChecks(invalid);

        // array of objects
        invalid = [{
            'a': 'a'
        }, {
            'b': 'b'
        }, {}];
        invalidChecks(invalid);

        // array of functions
        invalid = [() => {}, () => {}];
        invalidChecks(invalid);

        // object
        invalid = {
            'a': 'a'
        };
        invalidChecks(invalid);

        // empty object
        invalid = {};
        invalidChecks(invalid);

        // function
        invalid = () => {};
        invalidChecks(invalid);


    });

    test('removeTopicPrefixAndSuffix', t => {
        let s = TOPIC_PREFIX + "abc" + TOPIC_SUFFIX;
        t.deepEqual(removeTopicPrefixAndSuffix(s), 'abc');

        s = TOPIC_PREFIX + TOPIC_PREFIX + "abc" + TOPIC_SUFFIX;
        t.deepEqual(removeTopicPrefixAndSuffix(s), TOPIC_PREFIX + 'abc');

        s = TOPIC_PREFIX + "abc" + TOPIC_SUFFIX + TOPIC_SUFFIX;
        t.deepEqual(removeTopicPrefixAndSuffix(s), 'abc' + TOPIC_SUFFIX);

        s = TOPIC_PREFIX + TOPIC_PREFIX + "abc" + TOPIC_SUFFIX + TOPIC_SUFFIX;
        t.deepEqual(removeTopicPrefixAndSuffix(s), TOPIC_PREFIX + 'abc' + TOPIC_SUFFIX);

        s = TOPIC_PREFIX + "a" + TOPIC_PREFIX + "abc" + TOPIC_SUFFIX + TOPIC_SUFFIX;
        t.deepEqual(removeTopicPrefixAndSuffix(s), 'a' + TOPIC_PREFIX + 'abc' + TOPIC_SUFFIX);
    });

    let pathSnapshot = [
        TOPIC_PREFIX + 'a' + TOPIC_SUFFIX,
        TOPIC_PREFIX + 'b' + TOPIC_SUFFIX,
        TOPIC_PREFIX + 'c' + TOPIC_SUFFIX,
        TOPIC_PREFIX + 'd' + TOPIC_SUFFIX,
        TOPIC_PREFIX + 'e' + TOPIC_SUFFIX,
    ];
    let stringSnapshot = 'a->b->c->d->e';

    test('getTopicPathFromString', t => {
        t.deepEqual(getTopicPathFromString(stringSnapshot), pathSnapshot);
    });

    test('getTopicStringFromPath', t => {
        t.deepEqual(getTopicStringFromPath(pathSnapshot), stringSnapshot);
    });
})();