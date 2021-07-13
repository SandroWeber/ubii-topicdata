const randomStringChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let generateRandomTopicString = (length) => {
  // Pick characers randomly
  let str = '';
  for (let i = 0; i < length; i++) {
    str += randomStringChars.charAt(
      Math.floor(Math.random() * randomStringChars.length)
    );
  }

  return str;
};

let generateRandomTopics = (numTopics, lengthLimitLower, lengthLimitUpper) => {
  let topics = [];
  for (let i = 0; i < numTopics; i++) {
    let length =
      lengthLimitLower +
      Math.floor(Math.random() * (lengthLimitUpper - lengthLimitLower));
    topics.push(generateRandomTopicString(length));
  }

  return topics;
};

let pickRandomTopicFromList = (topics) => {
  return topics[Math.floor(Math.random() * topics.length)];
};

let generateTopicDataRecord = (dataType) => {
  if (dataType === 'int32') {
    return generateTopicDataRecordInt32();
  } else if (dataType === 'string') {
    return generateTopicDataRecordString();
  }
};

let generateTopicDataRecordInt32 = () => {
  return {
    int32: 42,
    type: 'int32',
    timestamp: {
      millis: Date.now(),
    },
  };
};

let generateTopicDataRecordString = () => {
  return {
    string: 'some test string',
    type: 'string',
    timestamp: {
      millis: Date.now(),
    },
  };
};

module.exports = {
  generateRandomTopicString,
  generateRandomTopics,
  pickRandomTopicFromList,
  generateTopicDataRecord,
};
