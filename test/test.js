import test from 'ava';
import {RuntimeTopicData} from './../src/index.js';
const {
    validateTopic
  } = require('./../src/topicData/utility.js');

(function () {

    // Creates and returns deep copies of the specified topic arrays.
    const getTopicA = () => JSON.parse(JSON.stringify(['a']));
    const getTopicAX = () => JSON.parse(JSON.stringify(['a', 'x']));
    const getTopicAXO = () => JSON.parse(JSON.stringify(['a', 'x', 'o']));
    const getTopicAY = () => JSON.parse(JSON.stringify(['a', 'y']));
    const getTopicB = () => JSON.parse(JSON.stringify(['b']));

    // Snapshots for comparison
    let createTopicDataSnapshotOne = () => {
        let raw = {};

        return raw;
    }

    let createTopicDataSnapshotTwo = () => {
        let raw = {
            't:a': {
                'd:data': 'awesome a',
                't:x': {
                    'd:data': 'awesome ax',
                    't:o': {
                        'd:data': 'awesome axo',
                    }
                },
                't:y': {
                    'd:data': 'awesome ay',
                }
            },
            't:b': {
                'd:data': 'awesome b',
            }
        };

        return raw;
    }

    let createTopicDataSnapshotThree = () => {
        let raw = {
            't:a': {
                'd:data': 'awesome a',
                't:x': {
                    't:o': {
                        'd:data': `awesome axo`,
                    }
                },
                't:y': {
                    'd:data': 'awesome ay',
                }
            },
            't:b': {
                'd:data': 'awesome b',
            }
        };

        return raw;
    }

    let createTopicDataSnapshotFour = () => {
        let raw = {
            't:a': {
                'd:data': 'awesome a',
                't:y': {
                    'd:data': `awesome ay`,
                }
            },
            't:b': {
                'd:data': 'awesome b',
            }
        };

        return raw;
    }

    let createTopicDataSnapshotFive = () => {
        let raw = {
            't:a': {
                'd:data': 'awesome a',
                't:y': {
                    'd:data': `awesome ay`,
                }
            }
        };

        return raw;
    }

    // Topic Data builder functions
    let createTopicDataTwo = () => {
        let topicData = new RuntimeTopicData();

        topicData.publish(getTopicA(), `awesome a`);
        topicData.publish(getTopicAX(), `awesome ax`);
        topicData.publish(getTopicAXO(), `awesome axo`);
        topicData.publish(getTopicAY(), `awesome ay`);
        topicData.publish(getTopicB(), `awesome b`);

        return topicData;
    }




    test('empty', t => {
        let snapshot = createTopicDataSnapshotOne();
        let topicData = new RuntimeTopicData();

        t.deepEqual(topicData.storage, snapshot);

    });

    test('publish', t => {
        let snapshot = createTopicDataSnapshotTwo();
        let topicData = createTopicDataTwo();

        t.deepEqual(topicData.storage, snapshot);

    });

    test('has', t => {
        let topicData = createTopicDataTwo();

        t.is(topicData.has(getTopicA()), true);
        t.is(topicData.has(getTopicAX()), true);
        t.is(topicData.has(getTopicAXO()), true);
        t.is(topicData.has(getTopicAY()), true);
        t.is(topicData.has(getTopicB()), true);

    });

    test('subscribe', t => {
        let topicData = createTopicDataTwo();
        let one, two, three;
        let functionOne = (topic, data) => {
            one = 'hallo '+data;
        }
        let functionTwo = (topic, data) => {
            two = 'hallo '+data;
        }
        let functionThree = (topic, data) => {
            three = 'hei '+data;
        }

        topicData.subscribe(getTopicA(), functionOne);
        topicData.subscribe(getTopicAX(), functionTwo);
        topicData.subscribe(getTopicA(), functionThree);

        topicData.publish(getTopicA(), `awesome a blubb`);
        topicData.publish(getTopicAX(), `awesome ax blubb`);

        t.deepEqual(one, 'hallo awesome a blubb');
        t.deepEqual(two, 'hallo awesome ax blubb');
        t.deepEqual(three, 'hei awesome a blubb');

    });

    test('unsubscribe', t => {
        let topicData = createTopicDataTwo();
        let one, two, three;
        let functionOne = (topic, data) => {
            one = 'hallo '+data;
        }
        let functionTwo = (topic, data) => {
            two = 'hallo '+data;
        }
        let functionThree = (topic, data) => {
            three = 'hei '+data;
        }

        let tokenOne = topicData.subscribe(getTopicA(), functionOne);
        let tokenTwo = topicData.subscribe(getTopicA(), functionTwo);
        let tokenThree = topicData.subscribe(getTopicA(), functionThree);

        topicData.publish(getTopicA(), `awesome a blubb`);

        t.deepEqual(one, 'hallo awesome a blubb');
        t.deepEqual(two, 'hallo awesome a blubb');
        t.deepEqual(three, 'hei awesome a blubb');

        topicData.unsubscribe(tokenTwo);

        topicData.publish(getTopicA(), `awesome a blubb2`);

        t.deepEqual(one, 'hallo awesome a blubb2');
        t.deepEqual(two, 'hallo awesome a blubb');
        t.deepEqual(three, 'hei awesome a blubb2');

        topicData.unsubscribe(tokenOne);
        topicData.unsubscribe(tokenOne);

        topicData.publish(getTopicA(), `awesome a blubb3`);

        t.deepEqual(one, 'hallo awesome a blubb2');
        t.deepEqual(two, 'hallo awesome a blubb');
        t.deepEqual(three, 'hei awesome a blubb3');

    });

    test('pull', t => {
        let snapshot = createTopicDataSnapshotTwo();
        let topicData = createTopicDataTwo();

        let dataA = topicData.pull(getTopicA());
        let dataB = topicData.pull(getTopicB());
        let dataAX = topicData.pull(getTopicAX());
        let dataAY = topicData.pull(getTopicAY());
        let dataAXO = topicData.pull(getTopicAXO());

        t.is(dataA, 'awesome a');
        t.is(dataB, 'awesome b');
        t.is(dataAX, 'awesome ax');
        t.is(dataAY, 'awesome ay');
        t.is(dataAXO, 'awesome axo');

    });

    test('remove', t => {
        let snapshot = createTopicDataSnapshotTwo();
        let topicData = createTopicDataTwo();

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

    test('validateTopic', t => {
        let valid, invalid;

        valid = ['root', 'subtopic1', 'subtopic2', 'subtopic3', 'subtopic4'];
        t.notThrows(()=>{
            validateTopic(valid);
        });

        invalid = ['root', 'subtopic1', 'subtopic2', {}, 'subtopic4'];
        t.throws(() => {
            validateTopic(invalid);
        });

        invalid = ['root', 'subtopic1', 'subtopic2', () => {}, 'subtopic4'];
        t.throws(() => {
            validateTopic(invalid);
        });

        invalid = 'root,subtopic1,subtopic2,subtopic3,subtopic4';
        t.throws(() => {
            validateTopic(invalid);
        });

        invalid = 'root , subtopic1 , subtopic2 , subtopic3 , subtopic4';
        t.throws(() => {
            validateTopic(invalid);
        });

        invalid = 'rootsubtopic1subtopic2subtopic3subtopic4';
        t.throws(() => {
            validateTopic(invalid);
        });

        invalid = {};
        t.throws(() => {
            validateTopic(invalid);
        });

        invalid = {'root':'root', 'subtopic':'subtopic1'};
        t.throws(() => {
            validateTopic(invalid);
        });

        invalid = [{'root':'root', 'subtopic':'subtopic1'}, {}];
        t.throws(() => {
            validateTopic(invalid);
        });

        invalid = () => {};
        t.throws(() => {
            validateTopic(invalid);
        });

        invalid = [()=>{}, ()=>{}];
        t.throws(() => {
            validateTopic(invalid);
        });
    });
})();