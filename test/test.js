import test from 'ava';
import {RuntimeTopicData} from './../src/index.js';

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
        let dataOne='', dataTwo = '', dataThree= '', dataFour='';
        let topicOne='', topicTwo = '', topicThree= '', topicFour='';
        let functionOne = (topic, data) => {
            dataOne = 'hallo '+data;
            topicOne = topic;
        }
        let functionTwo = (topic, data) => {
            dataTwo = 'hallo '+data;
            topicTwo = topic;
        }
        let functionThree = (topic, data) => {
            dataThree = 'hei '+data;
            topicThree = topic;
        }
        let functionFour = (topic, data) => {
            throw new Error();
        }

        topicData.subscribe(getTopicA(), functionOne);
        topicData.subscribe(getTopicAX(), functionTwo);
        topicData.subscribe(getTopicA(), functionThree);
        topicData.subscribe([], functionFour);

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
})();