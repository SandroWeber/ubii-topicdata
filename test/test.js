import test from 'ava';
import {RuntimeTopicStorage} from './../src/index.js';
import {topicSeparator} from './../src/topicStorage/constants.js';

(function(){

    const separator = topicSeparator;
    
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

        storage.push(`a`,`awesome a`);
        storage.push(`a${separator}x`,`awesome ax`);
        storage.push(`a${separator}x${separator}o`,`awesome axo`);
        storage.push(`a${separator}y`,`awesome ay`);
        storage.push(`b`,`awesome b`);

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

        let dataA = storage.pull('a');
        let dataB = storage.pull('b');
        let dataAX = storage.pull(`a${separator}x`);
        let dataAY = storage.pull(`a${separator}y`);
        let dataAXO = storage.pull(`a${separator}x${separator}o`);

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

        storage.remove(`a${separator}x`);
        snapshot = createStorageSnapshotThree();
        t.deepEqual(storage.storage, snapshot);

        storage.remove(`a${separator}x${separator}o`);
        snapshot = createStorageSnapshotFour();
        t.deepEqual(storage.storage, snapshot);

        storage.remove('b');
        snapshot = createStorageSnapshotFive();
        t.deepEqual(storage.storage, snapshot);

        storage.remove('a');
        storage.remove(`a${separator}y`);
        snapshot = createStorageSnapshotOne();
        t.deepEqual(storage.storage, snapshot);
    });
    


})();