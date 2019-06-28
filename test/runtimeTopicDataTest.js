import test from 'ava';
import sinon from 'sinon';

import {
    RuntimeTopicData,
    TOPIC_EVENTS
} from './../src/index.js';
import {
    TOPIC_PREFIX,
    TOPIC_SUFFIX,
    TOPIC_SEPARATOR,
    TOPIC_SPECIFIER,
    DATA_PROPERTY_KEY,
    DATA_SPECIFIER,
    TYPE_PROPERTY_KEY,
    TYPE_SPECIFIER
} from './../src/topicData/constants.js';
const {
    validateTopic
} = require('./../src/topicData/utility.js');

(function () {
    // Creates and returns deep copies of the specified topic arrays.
    const getTopicA = () => 'a';
    const getTopicAX = () => `a${TOPIC_SEPARATOR}x`;
    const getTopicAXO = () => `a${TOPIC_SEPARATOR}x${TOPIC_SEPARATOR}o`;
    const getTopicAY = () => `a${TOPIC_SEPARATOR}y`;
    const getTopicB = () => 'b';

    // Snapshots for comparison
    let createTopicDataSnapshotOne = () => {
        let raw = {};

        return raw;
    }

    let createTopicDataSnapshotTwo = () => {
        let o = {};
        o[DATA_PROPERTY_KEY] = 'awesome axo';
        o[TYPE_PROPERTY_KEY] = 'string';

        let x = {};
        x[DATA_PROPERTY_KEY] = 'awesome ax';
        x[TYPE_PROPERTY_KEY] = 'string';
        x[`${TOPIC_PREFIX}o${TOPIC_SUFFIX}`] = o;

        let y = {};
        y[DATA_PROPERTY_KEY] = 'awesome ay';
        y[TYPE_PROPERTY_KEY] = 'string';

        let a = {};
        a[DATA_PROPERTY_KEY] = 'awesome a';
        a[TYPE_PROPERTY_KEY] = 'string';
        a[`${TOPIC_PREFIX}x${TOPIC_SUFFIX}`] = x;
        a[`${TOPIC_PREFIX}y${TOPIC_SUFFIX}`] = y;

        let b = {};
        b[DATA_PROPERTY_KEY] = 'awesome b';
        b[TYPE_PROPERTY_KEY] = 'string';

        let raw = {};
        raw[`${TOPIC_PREFIX}a${TOPIC_SUFFIX}`] = a;
        raw[`${TOPIC_PREFIX}b${TOPIC_SUFFIX}`] = b;

        return raw;
    }

    let createTopicDataSnapshotThree = () => {
        let o = {};
        o[DATA_PROPERTY_KEY] = 'awesome axo';
        o[TYPE_PROPERTY_KEY] = 'string';

        let x = {};
        x[`${TOPIC_PREFIX}o${TOPIC_SUFFIX}`] = o;

        let y = {};
        y[DATA_PROPERTY_KEY] = 'awesome ay';
        y[TYPE_PROPERTY_KEY] = 'string';

        let a = {};
        a[DATA_PROPERTY_KEY] = 'awesome a';
        a[TYPE_PROPERTY_KEY] = 'string';
        a[`${TOPIC_PREFIX}x${TOPIC_SUFFIX}`] = x;
        a[`${TOPIC_PREFIX}y${TOPIC_SUFFIX}`] = y;

        let b = {};
        b[DATA_PROPERTY_KEY] = 'awesome b';
        b[TYPE_PROPERTY_KEY] = 'string';

        let raw = {};
        raw[`${TOPIC_PREFIX}a${TOPIC_SUFFIX}`] = a;
        raw[`${TOPIC_PREFIX}b${TOPIC_SUFFIX}`] = b;

        return raw;
    }

    let createTopicDataSnapshotFour = () => {
        let y = {};
        y[DATA_PROPERTY_KEY] = 'awesome ay';
        y[TYPE_PROPERTY_KEY] = 'string';

        let a = {};
        a[DATA_PROPERTY_KEY] = 'awesome a';
        a[TYPE_PROPERTY_KEY] = 'string';
        a[`${TOPIC_PREFIX}y${TOPIC_SUFFIX}`] = y;

        let b = {};
        b[DATA_PROPERTY_KEY] = 'awesome b';
        b[TYPE_PROPERTY_KEY] = 'string';

        let raw = {};
        raw[`${TOPIC_PREFIX}a${TOPIC_SUFFIX}`] = a;
        raw[`${TOPIC_PREFIX}b${TOPIC_SUFFIX}`] = b;

        return raw;
    }

    let createTopicDataSnapshotFive = () => {
        let y = {};
        y[DATA_PROPERTY_KEY] = 'awesome ay';
        y[TYPE_PROPERTY_KEY] = 'string';

        let a = {};
        a[DATA_PROPERTY_KEY] = 'awesome a';
        a[TYPE_PROPERTY_KEY] = 'string';
        a[`${TOPIC_PREFIX}y${TOPIC_SUFFIX}`] = y;

        let raw = {};
        raw[`${TOPIC_PREFIX}a${TOPIC_SUFFIX}`] = a;

        return raw;
    }

    let createTopicDataRawSubtreeSnapshotOne = () => {
        let o = {};
        o[DATA_PROPERTY_KEY] = 'awesome axo';
        o[TYPE_PROPERTY_KEY] = 'string';

        let x = {};
        x[DATA_PROPERTY_KEY] = 'awesome ax';
        x[TYPE_PROPERTY_KEY] = 'string';
        x[`${TOPIC_PREFIX}o${TOPIC_SUFFIX}`] = o;

        let y = {};
        y[DATA_PROPERTY_KEY] = 'awesome ay';
        y[TYPE_PROPERTY_KEY] = 'string';

        let a = {};
        a[DATA_PROPERTY_KEY] = 'awesome a';
        a[TYPE_PROPERTY_KEY] = 'string';
        a[`${TOPIC_PREFIX}x${TOPIC_SUFFIX}`] = x;
        a[`${TOPIC_PREFIX}y${TOPIC_SUFFIX}`] = y;

        return a;
    }

    let createTopicDataRawSubtreeSnapshotTwo = () => {
        let o = {};
        o[DATA_PROPERTY_KEY] = 'awesome axo';
        o[TYPE_PROPERTY_KEY] = 'string';

        let x = {};
        x[DATA_PROPERTY_KEY] = 'awesome ax';
        x[TYPE_PROPERTY_KEY] = 'string';
        x[`${TOPIC_PREFIX}o${TOPIC_SUFFIX}`] = o;

        return x;
    }

    // Topic Data builder functions
    let createTopicDataTwoOrdered = () => {
        let topicData = new RuntimeTopicData();

        topicData.publish(getTopicA(), `awesome a`, 'string');
        topicData.publish(getTopicAX(), `awesome ax`, 'string');
        topicData.publish(getTopicAXO(), `awesome axo`, 'string');
        topicData.publish(getTopicAY(), `awesome ay`, 'string');
        topicData.publish(getTopicB(), `awesome b`, 'string');

        return topicData;
    }

    let createTopicDataTwoUnordered = () => {
        let topicData = new RuntimeTopicData();

        topicData.publish(getTopicAY(), `awesome ay`, 'string');
        topicData.publish(getTopicB(), `awesome b`, 'string');
        topicData.publish(getTopicAXO(), `awesome axo`, 'string');
        topicData.publish(getTopicA(), `awesome a`, 'string');
        topicData.publish(getTopicAX(), `awesome ax`, 'string');


        return topicData;
    }



    test('empty', t => {
        let snapshot = createTopicDataSnapshotOne();
        let topicData = new RuntimeTopicData();

        t.deepEqual(topicData.storage, snapshot);

    });

    test('publish', t => {
        let snapshot = createTopicDataSnapshotTwo();
        let topicData = createTopicDataTwoOrdered();

        t.deepEqual(topicData.storage, snapshot);

        snapshot = createTopicDataSnapshotTwo();
        topicData = createTopicDataTwoUnordered();

        t.deepEqual(topicData.storage, snapshot);

    });

    test('has', t => {
        let topicData = createTopicDataTwoOrdered();

        t.is(topicData.has(getTopicA()), true);
        t.is(topicData.has(getTopicAX()), true);
        t.is(topicData.has(getTopicAXO()), true);
        t.is(topicData.has(getTopicAY()), true);
        t.is(topicData.has(getTopicB()), true);

    });

    test('subscribe', t => {
        let topicData = createTopicDataTwoOrdered();


        // invalid subscribtions:
        t.throws(() => {
            topicData.subscribe(getTopicA());
        })
        t.throws(() => {
            topicData.subscribe(getTopicA(), {});
        })
        t.throws(() => {
            topicData.subscribe(getTopicA(), 'foo');
        })


        // correct subscribtion resolving after publishing on topics:
        let dataOne = '',
            dataTwo = '',
            dataThree = '',
            dataFour = '';
        let topicOne = '',
            topicTwo = '',
            topicThree = '',
            topicFour = '';
        let functionOne = (topic, entry) => {
            dataOne = 'hallo ' + entry[DATA_SPECIFIER];
            topicOne = topic;
        }
        let functionTwo = (topic, entry) => {
            dataTwo = 'hallo ' + entry[DATA_SPECIFIER];
            topicTwo = topic;
        }
        let functionThree = (topic, entry) => {
            dataThree = 'hei ' + entry[DATA_SPECIFIER];
            topicThree = topic;
        }
        let functionFour = (topic, entry) => {
            throw new Error();
        }

        topicData.subscribe(getTopicA(), functionOne);
        topicData.subscribe(getTopicAX(), functionTwo);
        topicData.subscribe(getTopicA(), functionThree);
        topicData.subscribe('', functionFour);

        topicData.publish(getTopicA(), `awesome a blubb`);

        t.deepEqual(dataOne, 'hallo awesome a blubb');
        t.deepEqual(dataTwo, '');
        t.deepEqual(dataThree, 'hei awesome a blubb');

        t.deepEqual(topicOne, getTopicA());
        t.deepEqual(topicTwo, '');
        t.deepEqual(topicThree, getTopicA());

        topicData.publish(getTopicAX(), `awesome ax blubb`);

        t.deepEqual(dataOne, 'hallo awesome a blubb');
        t.deepEqual(dataTwo, 'hallo awesome ax blubb');
        t.deepEqual(dataThree, 'hei awesome a blubb');

        t.deepEqual(topicOne, getTopicA());
        t.deepEqual(topicTwo, getTopicAX());
        t.deepEqual(topicThree, getTopicA());

    });

    test('subscribeAll', t => {
        let topicData = createTopicDataTwoOrdered();

        // invalid subscribtions:
        t.throws(() => {
            topicData.subscribeAll();
        })
        t.throws(() => {
            topicData.subscribeAll({});
        })
        t.throws(() => {
            topicData.subscribeAll('foo');
        })


        // correct subscribtion resolving after publishing on topics:
        let dataOne = '',
            dataTwo = '',
            dataThree = '',
            dataFour = '',
            dataFive = '5';
        let topicOne = '',
            topicTwo = '',
            topicThree = '',
            topicFour = '',
            topicFive = '';
        let functionOne = (topic, entry) => {
            dataOne = '1 ' + entry[DATA_SPECIFIER];
            topicOne = topic;
        }
        let functionTwo = (topic, entry) => {
            dataTwo = '2 ' + entry[DATA_SPECIFIER];
            topicTwo = topic;
        }
        let functionThree = (topic, entry) => {
            dataThree = '3 ' + entry[DATA_SPECIFIER];
            topicThree = topic;
        }
        let functionFour = (topic, entry) => {
            throw new Error();
        }
        let functionFive = (topic, entry) => {
            dataFive = dataFive + ' ' + entry[DATA_SPECIFIER];
            topicFive = topic;
        }


        topicData.subscribe(getTopicA(), functionOne);
        topicData.subscribe(getTopicAX(), functionTwo);
        topicData.subscribe(getTopicA(), functionThree);
        topicData.subscribe('', functionFour);
        topicData.subscribeAll(functionFive);

        topicData.publish(getTopicA(), `ablubb`);

        t.deepEqual(dataOne, '1 ablubb');
        t.deepEqual(dataTwo, '');
        t.deepEqual(dataThree, '3 ablubb');
        t.deepEqual(dataFive, '5 ablubb');

        t.deepEqual(topicOne, getTopicA());
        t.deepEqual(topicTwo, '');
        t.deepEqual(topicThree, getTopicA());
        t.deepEqual(topicFive, getTopicA());

        topicData.publish(getTopicAX(), `axblubb`);

        t.deepEqual(dataOne, '1 ablubb');
        t.deepEqual(dataTwo, '2 axblubb');
        t.deepEqual(dataThree, '3 ablubb');
        t.deepEqual(dataFive, '5 ablubb axblubb');

        t.deepEqual(topicOne, getTopicA());
        t.deepEqual(topicTwo, getTopicAX());
        t.deepEqual(topicThree, getTopicA());
        t.deepEqual(topicFive, getTopicAX());

    });

    test('unsubscribe', t => {
        let topicData = createTopicDataTwoOrdered();
        let one, two, three, four = '4';
        let functionOne = (topic, entry) => {
            one = '1 ' + entry.data;
        }
        let functionTwo = (topic, entry) => {
            two = '2 ' + entry.data;
        }
        let functionThree = (topic, entry) => {
            three = '3 ' + entry.data;
        }
        let functionFour = (topic, entry) => {
            four = four + ' ' + entry.data;
        }

        let tokenOne = topicData.subscribe(getTopicA(), functionOne);
        let tokenTwo = topicData.subscribe(getTopicA(), functionTwo);
        let tokenThree = topicData.subscribe(getTopicA(), functionThree);
        let tokenFour = topicData.subscribeAll(functionFour);

        topicData.publish(getTopicA(), `ablubb`);

        t.deepEqual(one, '1 ablubb');
        t.deepEqual(two, '2 ablubb');
        t.deepEqual(three, '3 ablubb');
        t.deepEqual(four, '4 ablubb');

        topicData.unsubscribe(tokenTwo);

        topicData.publish(getTopicA(), `ablubb2`);

        t.deepEqual(one, '1 ablubb2');
        t.deepEqual(two, '2 ablubb');
        t.deepEqual(three, '3 ablubb2');
        t.deepEqual(four, '4 ablubb ablubb2');

        topicData.unsubscribe(tokenOne);
        topicData.unsubscribe(tokenOne);

        topicData.unsubscribe(tokenFour);

        topicData.publish(getTopicA(), `ablubb3`);

        t.deepEqual(one, '1 ablubb2');
        t.deepEqual(two, '2 ablubb');
        t.deepEqual(three, '3 ablubb3');
        t.deepEqual(four, '4 ablubb ablubb2');

    });

    test('pull', t => {
        let snapshot = createTopicDataSnapshotTwo();
        let topicData = createTopicDataTwoOrdered();

        let entryA = topicData.pull(getTopicA());
        let entryB = topicData.pull(getTopicB());
        let entryAX = topicData.pull(getTopicAX());
        let entryAY = topicData.pull(getTopicAY());
        let entryAXO = topicData.pull(getTopicAXO());

        let raw = {};
        raw[TYPE_SPECIFIER] = 'string';

        raw[DATA_SPECIFIER] = 'awesome a';
        t.deepEqual(entryA, raw);

        raw[DATA_SPECIFIER] = 'awesome b';
        t.deepEqual(entryB, raw);

        raw[DATA_SPECIFIER] = 'awesome ax';
        t.deepEqual(entryAX, raw);

        raw[DATA_SPECIFIER] = 'awesome ay';
        t.deepEqual(entryAY, raw);

        raw[DATA_SPECIFIER] = 'awesome axo';
        t.deepEqual(entryAXO, raw);
    });

    test('remove', t => {
        let snapshot = createTopicDataSnapshotTwo();
        let topicData = createTopicDataTwoOrdered();

        t.deepEqual(topicData.storage, snapshot);

        topicData.remove(getTopicAX());
        snapshot = createTopicDataSnapshotThree();
        t.deepEqual(topicData.storage, snapshot);

        topicData.remove(getTopicAXO());
        snapshot = createTopicDataSnapshotFour();
        t.deepEqual(topicData.storage, snapshot);

        topicData.remove(getTopicB());
        snapshot = createTopicDataSnapshotFive();
        t.deepEqual(topicData.storage, snapshot);

        topicData.remove(getTopicA());
        topicData.remove(getTopicAY());
        snapshot = createTopicDataSnapshotOne();
        t.deepEqual(topicData.storage, snapshot);
    });

    test('validateTopicInRuntimeTopicData', t => {
        let valid, invalid;
        let topicData = createTopicDataTwoOrdered();

        let invalidChecks = (invalid) => {
            t.throws(() => {
                validateTopic(invalid);
            });
            t.throws(() => {
                topicData.publish(invalid, {});
            });
            t.throws(() => {
                topicData.has(invalid);
            });
            t.throws(() => {
                topicData.subscribe(invalid, () => { });
            });
            t.throws(() => {
                topicData.pull(invalid);
            });
            t.throws(() => {
                topicData.remove(invalid);
            });
        }

        let validChecks = (valid) => {
            t.notThrows(() => {
                validateTopic(valid);
            });
            t.notThrows(() => {
                topicData.publish(valid, {});
            });
            t.notThrows(() => {
                topicData.has(valid);
            });
            t.notThrows(() => {
                topicData.subscribe(valid, () => { });
            });
            t.notThrows(() => {
                topicData.pull(valid);
            });
            t.notThrows(() => {
                //topicData.remove(valid);
            });
        }

        // valid topic tests

        // simple valid topic
        valid = `root${TOPIC_SEPARATOR}subtopic1${TOPIC_SEPARATOR}subtopic2${TOPIC_SEPARATOR}subtopic3${TOPIC_SEPARATOR}subtopic4`;
        validChecks(valid);

        // trailing space
        valid = `root${TOPIC_SEPARATOR}subtopic1 ${TOPIC_SEPARATOR}subtopic2 ${TOPIC_SEPARATOR}subtopic3 ${TOPIC_SEPARATOR}subtopic4`;
        validChecks(valid);

        // trailing space (also on first)
        valid = `root${TOPIC_SEPARATOR}subtopic1 ${TOPIC_SEPARATOR}subtopic2 ${TOPIC_SEPARATOR}subtopic3 ${TOPIC_SEPARATOR}subtopic4`;
        validChecks(valid);

        // prefixed space
        valid = `root${TOPIC_SEPARATOR} subtopic1${TOPIC_SEPARATOR} subtopic2${TOPIC_SEPARATOR}subtopic3${TOPIC_SEPARATOR}subtopic4`;
        validChecks(valid);

        // prefixed space (also on first)
        valid = ` root${TOPIC_SEPARATOR} subtopic1${TOPIC_SEPARATOR} subtopic2${TOPIC_SEPARATOR}subtopic3${TOPIC_SEPARATOR}subtopic4`;
        validChecks(valid);

        // trailing and prefixed space
        valid = `root${TOPIC_SEPARATOR} subtopic1 ${TOPIC_SEPARATOR} subtopic2 ${TOPIC_SEPARATOR} subtopic3 ${TOPIC_SEPARATOR}subtopic4`;
        validChecks(valid);

        // trailing and prefixed space (also on first)
        valid = ` root ${TOPIC_SEPARATOR} subtopic1 ${TOPIC_SEPARATOR} subtopic2 ${TOPIC_SEPARATOR} subtopic3 ${TOPIC_SEPARATOR}subtopic4`;
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
        invalid = [() => { }, () => { }];
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
        invalid = () => { };
        invalidChecks(invalid);


    });

    test('getRawSubtree', t => {
        let topicData = createTopicDataTwoOrdered();

        let rawSubtree = topicData.getRawSubtree('');
        t.deepEqual(rawSubtree, createTopicDataSnapshotTwo());

        rawSubtree = topicData.getRawSubtree(`a`);
        t.deepEqual(rawSubtree, createTopicDataRawSubtreeSnapshotOne());

        rawSubtree = topicData.getRawSubtree(`a${TOPIC_SEPARATOR}x`);
        t.deepEqual(rawSubtree, createTopicDataRawSubtreeSnapshotTwo());
    });

    test('getAllTopicsWithData', t => {
        let topicData = createTopicDataTwoOrdered();

        let topics = topicData.getAllTopicsWithData();

        let compare = [];
        let raw = {};

        raw[TOPIC_SPECIFIER] = `a`;
        raw[DATA_SPECIFIER] = 'awesome a';
        raw[TYPE_SPECIFIER] = 'string';
        compare.push(raw);
        raw = {};
        raw[TOPIC_SPECIFIER] = `a${TOPIC_SEPARATOR}x`;
        raw[DATA_SPECIFIER] = 'awesome ax';
        raw[TYPE_SPECIFIER] = 'string';
        compare.push(raw);
        raw = {};
        raw[TOPIC_SPECIFIER] = `a${TOPIC_SEPARATOR}x${TOPIC_SEPARATOR}o`;
        raw[DATA_SPECIFIER] = 'awesome axo';
        raw[TYPE_SPECIFIER] = 'string';
        compare.push(raw);
        raw = {};
        raw[TOPIC_SPECIFIER] = `a${TOPIC_SEPARATOR}y`;
        raw[DATA_SPECIFIER] = 'awesome ay';
        raw[TYPE_SPECIFIER] = 'string';
        compare.push(raw);
        raw = {};
        raw[TOPIC_SPECIFIER] = `b`;
        raw[DATA_SPECIFIER] = 'awesome b';
        raw[TYPE_SPECIFIER] = 'string';
        compare.push(raw);

        t.deepEqual(topics, compare)

        topicData.remove(`a${TOPIC_SEPARATOR}x`);
        topics = topicData.getAllTopicsWithData();

        compare = [];
        raw = {};

        raw[TOPIC_SPECIFIER] = `a`;
        raw[DATA_SPECIFIER] = 'awesome a';
        raw[TYPE_SPECIFIER] = 'string';
        compare.push(raw);
        raw = {};
        raw[TOPIC_SPECIFIER] = `a${TOPIC_SEPARATOR}x${TOPIC_SEPARATOR}o`;
        raw[DATA_SPECIFIER] = 'awesome axo';
        raw[TYPE_SPECIFIER] = 'string';
        compare.push(raw);
        raw = {};
        raw[TOPIC_SPECIFIER] = `a${TOPIC_SEPARATOR}y`;
        raw[DATA_SPECIFIER] = 'awesome ay';
        raw[TYPE_SPECIFIER] = 'string';
        compare.push(raw);
        raw = {};
        raw[TOPIC_SPECIFIER] = `b`;
        raw[DATA_SPECIFIER] = 'awesome b';
        raw[TYPE_SPECIFIER] = 'string';
        compare.push(raw);

        t.deepEqual(topics, compare);
    });

    test('emit "new topic" event on first publish', t => {
        let topicData = new RuntimeTopicData();

        let callback = sinon.fake();
        topicData.events.on(TOPIC_EVENTS.NEW_TOPIC, callback);
        t.is(callback.callCount, 0);

        topicData.publish('/new/topic', true, 'bool');
        t.is(callback.callCount, 1);

        topicData.publish('/new/topic', false, 'bool');
        t.is(callback.callCount, 1);
    });
})();