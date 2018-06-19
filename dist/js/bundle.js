module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(/*! ./topicStorage/runtimeTopicStorage.js */ "./src/topicStorage/runtimeTopicStorage.js"),
    RuntimeTopicStorage = _require.RuntimeTopicStorage;

module.exports = {
    'RuntimeTopicStorage': RuntimeTopicStorage
};

/***/ }),

/***/ "./src/topicStorage/constants.js":
/*!***************************************!*\
  !*** ./src/topicStorage/constants.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dataPrefix = 'd:';

module.exports = {
    topicPrefix: 't:',
    dataPrefix: dataPrefix,
    dataPropertyKey: dataPrefix + 'data',
    'topicSeparator': '->'
};

/***/ }),

/***/ "./src/topicStorage/runtimeTopicStorage.js":
/*!*************************************************!*\
  !*** ./src/topicStorage/runtimeTopicStorage.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = __webpack_require__(/*! ./topicStorage.js */ "./src/topicStorage/topicStorage.js"),
    TopicStorage = _require.TopicStorage;

var _require2 = __webpack_require__(/*! ./constants.js */ "./src/topicStorage/constants.js"),
    topicPrefix = _require2.topicPrefix,
    dataPropertyKey = _require2.dataPropertyKey,
    topicSeparator = _require2.topicSeparator;

(function () {
  /**
   * Local runtime implementaion of a topic storage.
   * The data is only available at runtime and is not permanently stored.
   * (No local file or database involved. The data is only in the program memory.)
   */
  var RuntimeTopicStorage = function (_TopicStorage) {
    _inherits(RuntimeTopicStorage, _TopicStorage);

    /*
    * The runtime topic storage uses a common javascript object as storage structure.
    * This is the most performant way to find key-value pairs.
    * The topic of queries is split and used as property keys.
    * */

    function RuntimeTopicStorage() {
      var customTopicSeparator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : topicSeparator;

      _classCallCheck(this, RuntimeTopicStorage);

      var _this = _possibleConstructorReturn(this, (RuntimeTopicStorage.__proto__ || Object.getPrototypeOf(RuntimeTopicStorage)).call(this, customTopicSeparator));

      _this.storage = {};
      return _this;
    }

    /**
     * Pushes data into memory under the specified topic.
     * If there is already data under this topic, it will be overwritten.
     * @param {String} topic Well formed topic string.
     * @param {*} data 
     */


    _createClass(RuntimeTopicStorage, [{
      key: 'push',
      value: function push(topic, data) {
        var element = traverseAndCreateTopicPath.call(this, topic);
        element[dataPropertyKey] = data;
      }

      /**
       * Pulls the data from memory that is stored under the given topic.
       * @param {String} topic Well formed topic string.
       * @returns Returns the data stored under the given topic. Returns null if the topic does not exist.
       */

    }, {
      key: 'pull',
      value: function pull(topic) {
        if (!this.has(topic)) {
          return null;
        }
        var element = traverseAndCreateTopicPath.call(this, topic);
        return element[dataPropertyKey];
      }

      /**
       * Removes the topic and data from memory that is stored under the given topic if the topic exists. 
       * Cleans up the path afterwards.
       * @param {String} topic Well formed topic string.
       */

    }, {
      key: 'remove',
      value: function remove(topic) {
        if (!this.has(topic)) {
          return;
        }
        var element = traverseAndCreateTopicPath.call(this, topic);
        delete element[dataPropertyKey];

        cleanPath.call(this, topic);
      }

      /**
       * Does the the storage has the given topic?
       * @param {String} topic Well formed topic string.
       * @returns {Boolean} Returns whether the the storage has the given topic or not.
       */

    }, {
      key: 'has',
      value: function has(topic) {
        // get topic path
        var path = getTopicPathArray.call(this, topic);

        // traverse path
        var element = this.storage;
        var il = path.length;
        for (var i = 0; i < il; i++) {
          if (element.hasOwnProperty(path[i])) {
            element = element[path[i]];
          } else {
            return false;
          }
        }
        return true;
      }
    }]);

    return RuntimeTopicStorage;
  }(TopicStorage);

  // --- private methods

  /**
   * 
   * @param {String} topic 
   * @return returns the path target element
   */


  var traverseAndCreateTopicPath = function traverseAndCreateTopicPath(topic) {
    // get topic path
    var path = getTopicPathArray.call(this, topic);

    // traverse path and create if necessary
    var element = this.storage;
    var il = path.length;
    for (var i = 0; i < il; i++) {
      if (element.hasOwnProperty(path[i])) {
        element = element[path[i]];
      } else {
        element[path[i]] = {};
        element = element[path[i]];
      }
    }
    return element;
  };

  var cleanPath = function cleanPath(topic) {
    // Get the topic path.
    var path = getTopicPathArray.call(this, topic);

    if (!recursiveIsRelevantCleanUp(this.storage[path[0]])) {
      delete this.storage[path[0]];
    }
  };

  var recursiveIsRelevantCleanUp = function recursiveIsRelevantCleanUp(element) {
    var result = false;
    var keys = Object.getOwnPropertyNames(element);

    var il = keys.length;
    for (var i = 0; i < il; i++) {
      if (keys[i] === dataPropertyKey) {
        result = true;
      } else {
        // ToDo: Check for valid path element (starts with t:)
        var intermediateResult = recursiveIsRelevantCleanUp(element[keys[i]]);
        if (!intermediateResult) {
          delete element[keys[i]];
        }
        result = result || intermediateResult;
      }
    }
    return result;
  };

  var getData = function getData(topic) {
    // get topic path
    var path = getTopicPathArray.call(this, topic);

    // check topic path
    var storageElement = this.storage;
    var il = path.length;
    for (var i = 0; i < il; i++) {
      if (storageElement.hasOwnProperty(path[i])) {
        storageElement = storageElement[path[i]];
      } else {
        throw new Error("The specified topic does not exist in the storage.");
        return null;
      }
    }

    // return data object
    return storageElement;
  };

  /**
   * Returns 
   * @param {String} topic 
   */
  var getTopicPathArray = function getTopicPathArray(topic) {
    return topic.toString().split(this.topicSeparator).map(function (t) {
      return '' + topicPrefix + t;
    });
  };

  module.exports = {
    'RuntimeTopicStorage': RuntimeTopicStorage
  };
})();

/***/ }),

/***/ "./src/topicStorage/topicStorage.js":
/*!******************************************!*\
  !*** ./src/topicStorage/topicStorage.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(/*! ./constants.js */ "./src/topicStorage/constants.js"),
    topicSeparator = _require.topicSeparator;

var TopicStorage = function TopicStorage() {
  var customTopicSeparator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : topicSeparator;

  _classCallCheck(this, TopicStorage);

  if (new.target === TopicStorage) {
    throw new TypeError("Cannot construct TopicStorage instances directly");
  }

  this.topicSeparator = customTopicSeparator;

  if (this.push === undefined) {
    // or maybe test typeof this.method === "function"
    throw new TypeError("Must override push");
  }

  if (this.pull === undefined) {
    // or maybe test typeof this.method === "function"
    throw new TypeError("Must override pull");
  }

  if (this.remove === undefined) {
    // or maybe test typeof this.method === "function"
    throw new TypeError("Must override subscribe");
  }

  if (this.has === undefined) {
    // or maybe test typeof this.method === "function"
    throw new TypeError("Must override subscribe");
  }
};

module.exports = {
  TopicStorage: TopicStorage
};

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map