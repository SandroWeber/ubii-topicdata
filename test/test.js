import test from 'ava';
import {RuntimeTopicStorage} from './../dist/js/bundle.js';

(function(){

	
	let createStorageSnapshotOne = () => {
		let raw = {};

		return raw;
    }
    
    let createStorageSnapshotTwo = () => {
		let raw = {
            't:a': {
                'd:data': 'awesome a',
                't:x': {
                    'd:data': 'awesome a:x',
                    't:o': {
                        'd:data': 'awesome a:x:o',
                    }
                },
                't:y': {
                    'd:data': 'awesome a:y',
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
                        'd:data': 'awesome a:x:o',
                    }
                },
                't:y': {
                    'd:data': 'awesome a:y',
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
                    'd:data': 'awesome a:y',
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
                    'd:data': 'awesome a:y',
                }
            }
        };

		return raw;
    }

    let createStorageTwo = () => {
        let storage = new RuntimeTopicStorage();

        storage.push('a','awesome a');
        storage.push('a:x','awesome a:x');
        storage.push('a:x:o','awesome a:x:o');
        storage.push('a:y','awesome a:y');
        storage.push('b','awesome b');

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
        let dataAX = storage.pull('a:x');
        let dataAY = storage.pull('a:y');
        let dataAXO = storage.pull('a:x:o');

        t.is(dataA, 'awesome a');
        t.is(dataB, 'awesome b');
        t.is(dataAX, 'awesome a:x');
        t.is(dataAY, 'awesome a:y');
        t.is(dataAXO, 'awesome a:x:o');

    });

    test('remove', t => {
        let snapshot = createStorageSnapshotTwo();
        let storage = createStorageTwo();

        t.deepEqual(storage.storage, snapshot);

        storage.remove('a:x');
        snapshot = createStorageSnapshotThree();
        t.deepEqual(storage.storage, snapshot);

        storage.remove('a:x:o');
        snapshot = createStorageSnapshotFour();
        t.deepEqual(storage.storage, snapshot);

        storage.remove('b');
        snapshot = createStorageSnapshotFive();
        t.deepEqual(storage.storage, snapshot);

        storage.remove('a');
        storage.remove('a:y');
        snapshot = createStorageSnapshotOne();
        t.deepEqual(storage.storage, snapshot);
    });
    


})();