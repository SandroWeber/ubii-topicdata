import test from 'ava';
import {RuntimeTopicStorage} from './../src/index.js';

(function(){

    const getTopicA = () => JSON.parse(JSON.stringify(['a']));
    const getTopicAX = () => JSON.parse(JSON.stringify(['a', 'x']));
    const getTopicAXO = () => JSON.parse(JSON.stringify(['a', 'x', 'o']));
    const getTopicAY = () => JSON.parse(JSON.stringify(['a', 'y']));
    const getTopicB = () => JSON.parse(JSON.stringify(['b']));
    
    
	let createStorageSnapshotOne = () => {
		let raw = {};

		return raw;
    }
    
    let createStorageSnapshotTwo = () => {
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

    let createStorageSnapshotThree = () => {
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

    let createStorageSnapshotFour = () => {
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

    let createStorageSnapshotFive = () => {
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

    let createStorageTwo = () => {
        let storage = new RuntimeTopicStorage();

        storage.push(getTopicA(), `awesome a`);
        storage.push(getTopicAX(),`awesome ax`);
        storage.push(getTopicAXO(),`awesome axo`);
        storage.push(getTopicAY(),`awesome ay`);
        storage.push(getTopicB(),`awesome b`);

        return storage;
    }
    
    


	test('empty', t => {
        let snapshot = createStorageSnapshotOne();
        let storage = new RuntimeTopicStorage();

        t.deepEqual(storage.storage, snapshot);

    });
    
    test('push', t => {
        let snapshot = createStorageSnapshotTwo();
        let storage = createStorageTwo();

        t.deepEqual(storage.storage, snapshot);

    });

    test('pull', t => {
        let snapshot = createStorageSnapshotTwo();
        let storage = createStorageTwo();

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
        let snapshot = createStorageSnapshotTwo();
        let storage = createStorageTwo();

        t.deepEqual(storage.storage, snapshot);

        storage.remove(getTopicAX());
        snapshot = createStorageSnapshotThree();
        t.deepEqual(storage.storage, snapshot);

        storage.remove(getTopicAXO());
        snapshot = createStorageSnapshotFour();
        t.deepEqual(storage.storage, snapshot);

        storage.remove(getTopicB());
        snapshot = createStorageSnapshotFive();
        t.deepEqual(storage.storage, snapshot);

        storage.remove(getTopicA());
        storage.remove(getTopicAY());
        snapshot = createStorageSnapshotOne();
        t.deepEqual(storage.storage, snapshot);
    });
    


})();