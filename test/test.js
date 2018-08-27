import test from 'ava';
import {RuntimeTopicData} from './../src/index.js';
const {
    validateTopic
  } = require('./../src/topicData/utility.js');
  const {
    TOPIC_PREFIX,
    TOPIC_SUFFIX
} = require('./../src/topicData/constants.js');

(function () {

    // Creates and returns deep copies of the specified topic arrays.
    const getTopicA = () => 'a';
    const getTopicAX = () => 'a->x';
    const getTopicAXO = () => 'a->x->o';
    const getTopicAY = () => 'a->y';
    const getTopicB = () => 'b';

    // Snapshots for comparison
    let createTopicDataSnapshotOne = () => {
        let raw = {};

        return raw;
    }

    let createTopicDataSnapshotTwo = () => {
        let raw = {
            't:a:t': {
                'd:data': 'awesome a',
                't:x:t': {
                    'd:data': 'awesome ax',
                    't:o:t': {
                        'd:data': 'awesome axo',
                    }
                },
                't:y:t': {
                    'd:data': 'awesome ay',
                }
            },
            't:b:t': {
                'd:data': 'awesome b',
            }
        };

        return raw;
    }

    let createTopicDataSnapshotThree = () => {
        let raw = {
            't:a:t': {
                'd:data': 'awesome a',
                't:x:t': {
                    't:o:t': {
                        'd:data': `awesome axo`,
                    }
                },
                't:y:t': {
                    'd:data': 'awesome ay',
                }
            },
            't:b:t': {
                'd:data': 'awesome b',
            }
        };

        return raw;
    }

    let createTopicDataSnapshotFour = () => {
        let raw = {
            't:a:t': {
                'd:data': 'awesome a',
                't:y:t': {
                    'd:data': `awesome ay`,
                }
            },
            't:b:t': {
                'd:data': 'awesome b',
            }
        };

        return raw;
    }

    let createTopicDataSnapshotFive = () => {
        let raw = {
            't:a:t': {
                'd:data': 'awesome a',
                't:y:t': {
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
        let topicData = createTopicDataTwo();

        // invalid subscribtions:
        t.throws(() => {
            topicData.subscribeAll();
        })
        t.throws(() => {
            topicData.subscribeAll( {});
        })
        t.throws(() => {
            topicData.subscribeAll( 'foo');
        })


        // correct subscribtion resolving after publishing on topics:
        let dataOne='', dataTwo = '', dataThree= '', dataFour='', dataFive='5';
        let topicOne='', topicTwo = '', topicThree= '', topicFour='', topicFive='';
        let functionOne = (topic, data) => {
            dataOne = '1 '+data;
            topicOne = topic;
        }
        let functionTwo = (topic, data) => {
            dataTwo = '2 '+data;
            topicTwo = topic;
        }
        let functionThree = (topic, data) => {
            dataThree = '3 '+data;
            topicThree = topic;
        }
        let functionFour = (topic, data) => {
            throw new Error();
        }
        let functionFive = (topic, data) => {
            dataFive = dataFive+' '+data;
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
        let topicData = createTopicDataTwo();
        let one, two, three, four = '4';
        let functionOne = (topic, data) => {
            one = 'hallo '+data;
        }
        let functionTwo = (topic, data) => {
            two = 'hallo '+data;
        }
        let functionThree = (topic, data) => {
            three = 'hei '+data;
        }
        let functionFour = (topic, data) => {
            four = four+' '+data;
        }

        let tokenOne = topicData.subscribe(getTopicA(), functionOne);
        let tokenTwo = topicData.subscribe(getTopicA(), functionTwo);
        let tokenThree = topicData.subscribe(getTopicA(), functionThree);
        let tokenFour = topicData.subscribeAll(functionFour);

        topicData.publish(getTopicA(), `awesome a blubb`);

        t.deepEqual(one, 'hallo awesome a blubb');
        t.deepEqual(two, 'hallo awesome a blubb');
        t.deepEqual(three, 'hei awesome a blubb');
        t.deepEqual(four, '4 awesome a blubb');

        topicData.unsubscribe(tokenTwo);

        topicData.publish(getTopicA(), `awesome a blubb2`);

        t.deepEqual(one, 'hallo awesome a blubb2');
        t.deepEqual(two, 'hallo awesome a blubb');
        t.deepEqual(three, 'hei awesome a blubb2');
        t.deepEqual(four, '4 awesome a blubb awesome a blubb2');

        topicData.unsubscribe(tokenOne);
        topicData.unsubscribe(tokenOne);

        topicData.unsubscribe(tokenFour);

        topicData.publish(getTopicA(), `awesome a blubb3`);

        t.deepEqual(one, 'hallo awesome a blubb2');
        t.deepEqual(two, 'hallo awesome a blubb');
        t.deepEqual(three, 'hei awesome a blubb3');
        t.deepEqual(four, '4 awesome a blubb awesome a blubb2');

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
        let topicData = createTopicDataTwo();

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
                topicData.subscribe(invalid, ()=>{});
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
                topicData.subscribe(valid, ()=>{});
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
        invalid = [{'a': 'a'}, {'b': 'b'}, {}];
        invalidChecks(invalid);

        // array of functions
        invalid = [()=>{}, ()=>{}];
        invalidChecks(invalid);

        // object
        invalid = {'a': 'a'};
        invalidChecks(invalid);

        // empty object
        invalid = {};
        invalidChecks(invalid);

        // function
        invalid = () => {};
        invalidChecks(invalid);


    });
})();