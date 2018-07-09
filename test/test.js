import test from 'ava';
import {RuntimeTopicData} from './../src/index.js';

(function(){

    const getTopicA = () => JSON.parse(JSON.stringify(['a']));
    const getTopicAX = () => JSON.parse(JSON.stringify(['a', 'x']));
    const getTopicAXO = () => JSON.parse(JSON.stringify(['a', 'x', 'o']));
    const getTopicAY = () => JSON.parse(JSON.stringify(['a', 'y']));
    const getTopicB = () => JSON.parse(JSON.stringify(['b']));
    
    
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

    let createTopicDataTwo = () => {
        let storage = new RuntimeTopicData();

        storage.push(getTopicA(), `awesome a`);
        storage.push(getTopicAX(),`awesome ax`);
        storage.push(getTopicAXO(),`awesome axo`);
        storage.push(getTopicAY(),`awesome ay`);
        storage.push(getTopicB(),`awesome b`);

        return storage;
    }
    
    


	test('empty', t => {
        let snapshot = createTopicDataSnapshotOne();
        let storage = new RuntimeTopicData();

        t.deepEqual(storage.storage, snapshot);

    });
    
    test('push', t => {
        let snapshot = createTopicDataSnapshotTwo();
        let storage = createTopicDataTwo();

        t.deepEqual(storage.storage, snapshot);

    });

    test('pull', t => {
        let snapshot = createTopicDataSnapshotTwo();
        let storage = createTopicDataTwo();

        let dataA = storage.pull(getTopicA());
        let dataB = storage.pull(getTopicB());
        let dataAX = storage.pull(getTopicAX());
        let dataAY = storage.pull(getTopicAY());
        let dataAXO = storage.pull(getTopicAXO());

        t.is(dataA, 'awesome a');
        t.is(dataB, 'awesome b');
        t.is(dataAX, 'awesome ax');
        t.is(dataAY, 'awesome ay');
        t.is(dataAXO, 'awesome axo');

    });

    test('remove', t => {
        let snapshot = createTopicDataSnapshotTwo();
        let storage = createTopicDataTwo();

        t.deepEqual(storage.storage, snapshot);

        storage.remove(getTopicAX());
        snapshot = createTopicDataSnapshotThree();
        t.deepEqual(storage.storage, snapshot);

        storage.remove(getTopicAXO());
        snapshot = createTopicDataSnapshotFour();
        t.deepEqual(storage.storage, snapshot);

        storage.remove(getTopicB());
        snapshot = createTopicDataSnapshotFive();
        t.deepEqual(storage.storage, snapshot);

        storage.remove(getTopicA());
        storage.remove(getTopicAY());
        snapshot = createTopicDataSnapshotOne();
        t.deepEqual(storage.storage, snapshot);
    });
    


})();