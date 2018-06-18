import test from 'ava';
import {RuntimeTopicStorage} from './../dist/js/bundle.js';

(function(){

	
	let createStorageSnapwhotOne = function(){
		let raw = {};

		return raw;
    }
    
    let createStorageSnapwhotTwo = function(){
		let raw = {
            't:a': {
                'd:data': {},
            }
        };

		return raw;
	}


	test('empty', t => {
        let snapshot = createStorageSnapwhotOne();
        
        let storage = new RuntimeTopicStorage();

        t.deepEqual(storage.storage, snapshot);

    });
    
    test('push', t => {
        let snapshot = createStorageSnapwhotTwo();
        
        let storage = new RuntimeTopicStorage();

        storage.push('a',{});

        t.deepEqual(storage.storage, snapshot);

	});

})();