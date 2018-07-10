# ubii-topic-data

Ubii topic data module.

- This project is managed as [OpenProject instance of the FAR group at the Technical Unitversity of Munich (TUM)](OpenProject.far.in.tum.de).

## Table of Contents

- [Topic Data](#Topic Data)
- [Command Line Interfaces (CLIs)](#CLIs)
- [Testing](#Testing)

## Topic Data

### Topic

A topic is interpreted as array of unprefixed subtopic strings specifying the topic path.

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
- Run the tests with ```npm test```