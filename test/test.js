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