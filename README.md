# ubii-topic-data

## Table of Contents

- [Topic Data](#topic-data)
- [Command Line Interfaces (CLIs)](#clis)
- [Testing](#testing)

## Topic Data

A `Topic Data` is a key-value store with `Topic` strings as keys and arbitrary data as values.

### Runtime Topic Data

The `RuntimeTopicData` is a runtime implementaion of a `topicData`. "Runtime" means the data is only available at runtime and is not permanently stored in a persistent medium such as a local file or database. The data lives only in the program memory.

The `RuntimeTopicData` uses a common javascript object as storage structure that resembles the topic hierarchy. This is the most performant way to find key-value pairs.

## Topic

A `Topic` is simple string indicating a chain of topics that are in a parent-child relation. Childs can be seen as subtopics of the previous one. The individual (sub-)topics are separated by a special character ("->").

The follwoing string is an example for a *valid* `Topic`:
```js
valid = 'root->subtopic1->subtopic2->subtopic3->subtopic4';
```

## CLIs

### Tests

- Run ``npm test`` to process all standard tests. See the [Testing section](Testing) for more details on tests.

## Testing

- This module uses the [AVA](https://github.com/avajs/ava) test runner.
- You can add new tests to the test folder. Entry point for the test runner is test.js within the test folder. See the [AVA Documentation](https://github.com/avajs/ava#contents) for more details on how to create new test cases for AVA.