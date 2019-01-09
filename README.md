# ubii-topic-data

Ubii topic data module.

## Table of Contents

- [Topic Data](#topic-data)
- [Command Line Interfaces (CLIs)](#clis)
- [Testing](#testing)

## Topic Data

### Topic

A topic is simple string. The individual subtopics are separated by a special character ("->").

Example for a *valid* topic:
```js
valid = 'root->subtopic1->subtopic2->subtopic3->subtopic4';
```

### Runtime Topic Data

Local runtime implementaion of a topic data.
The data is only available at runtime and is not permanently stored. No local file or database involved. The data is only in the program memory.

The runtime topic storage uses a common javascript object as storage structure. This is the most performant way to find key-value pairs.

## CLIs

### Tests

- Run ``npm test`` to process all standard tests. See the [Testing section](Testing) for more details on tests.

## Testing

- This module uses the [AVA](https://github.com/avajs/ava) test runner.
- You can add new tests to the test folder. Entry point for the test runner is test.js within the test folder. See the [AVA Documentation](https://github.com/avajs/ava#contents) for more details on how to create new test cases for AVA.