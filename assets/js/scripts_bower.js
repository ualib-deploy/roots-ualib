/**
 * Bunch of useful filters for angularJS(with no external dependencies!)
 * @version v0.5.7 - 2015-10-04 * @link https://github.com/a8m/angular-filter
 * @author Ariel Mashraki <ariel@mashraki.co.il>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function ( window, angular, undefined ) {
/*jshint globalstrict:true*/
'use strict';

var isDefined = angular.isDefined,
    isUndefined = angular.isUndefined,
    isFunction = angular.isFunction,
    isString = angular.isString,
    isNumber = angular.isNumber,
    isObject = angular.isObject,
    isArray = angular.isArray,
    forEach = angular.forEach,
    extend = angular.extend,
    copy = angular.copy,
    equals = angular.equals;


/**
 * @description
 * get an object and return array of values
 * @param object
 * @returns {Array}
 */
function toArray(object) {
  return isArray(object) 
    ? object 
    : Object.keys(object).map(function(key) {
      return object[key];
    });
}

/**
 * @param value
 * @returns {boolean}
 */
function isNull(value) {
    return value === null;
}

/**
 * @description
 * return if object contains partial object
 * @param partial{object}
 * @param object{object}
 * @returns {boolean}
 */
function objectContains(partial, object) {
  var keys = Object.keys(partial);

  return keys.map(function(el) {
    return (object[el] !== undefined) && (object[el] == partial[el]);
  }).indexOf(false) == -1;

}

/**
 * @description
 * search for approximate pattern in string
 * @param word
 * @param pattern
 * @returns {*}
 */
function hasApproxPattern(word, pattern) {
  if(pattern === '')
    return word;

  var index = word.indexOf(pattern.charAt(0));

  if(index === -1)
    return false;

  return hasApproxPattern(word.substr(index+1), pattern.substr(1))
}

/**
 * @description
 * return the first n element of an array,
 * if expression provided, is returns as long the expression return truthy
 * @param array
 * @param n {number}
 * @param expression {$parse}
 * @return array or single object
 */
function getFirstMatches(array, n, expression) {
  var count = 0;

  return array.filter(function(elm) {
    var rest = isDefined(expression) ? (count < n && expression(elm)) : count < n;
    count = rest ? count+1 : count;

    return rest;
  });
}
/**
 * Polyfill to ECMA6 String.prototype.contains
 */
if (!String.prototype.contains) {
  String.prototype.contains = function() {
    return String.prototype.indexOf.apply(this, arguments) !== -1;
  };
}

/**
 * @param num {Number}
 * @param decimal {Number}
 * @param $math
 * @returns {Number}
 */
function convertToDecimal(num, decimal, $math){
  return $math.round(num * $math.pow(10,decimal)) / ($math.pow(10,decimal));
}

/**
 * @description
 * Get an object, and return an array composed of it's properties names(nested too).
 * @param obj {Object}
 * @param stack {Array}
 * @param parent {String}
 * @returns {Array}
 * @example
 * parseKeys({ a:1, b: { c:2, d: { e: 3 } } }) ==> ["a", "b.c", "b.d.e"]
 */
function deepKeys(obj, stack, parent) {
  stack = stack || [];
  var keys = Object.keys(obj);

  keys.forEach(function(el) {
    //if it's a nested object
    if(isObject(obj[el]) && !isArray(obj[el])) {
      //concatenate the new parent if exist
      var p = parent ? parent + '.' + el : parent;
      deepKeys(obj[el], stack, p || el);
    } else {
      //create and save the key
      var key = parent ? parent + '.' + el : el;
      stack.push(key)
    }
  });
  return stack
}

/**
 * @description
 * Test if given object is a Scope instance
 * @param obj
 * @returns {Boolean}
 */
function isScope(obj) {
  return obj && obj.$evalAsync && obj.$watch;
}

/**
 * @ngdoc filter
 * @name a8m.angular
 * @kind function
 *
 * @description
 * reference to angular function
 */

angular.module('a8m.angular', [])

    .filter('isUndefined', function () {
      return function (input) {
        return angular.isUndefined(input);
      }
    })
    .filter('isDefined', function() {
      return function (input) {
        return angular.isDefined(input);
      }
    })
    .filter('isFunction', function() {
      return function (input) {
        return angular.isFunction(input);
      }
    })
    .filter('isString', function() {
      return function (input) {
        return angular.isString(input)
      }
    })
    .filter('isNumber', function() {
      return function (input) {
        return angular.isNumber(input);
      }
    })
    .filter('isArray', function() {
      return function (input) {
        return angular.isArray(input);
      }
    })
    .filter('isObject', function() {
      return function (input) {
        return angular.isObject(input);
      }
    })
    .filter('isEqual', function() {
      return function (o1, o2) {
        return angular.equals(o1, o2);
      }
    });

/**
 * @ngdoc filter
 * @name a8m.conditions
 * @kind function
 *
 * @description
 * reference to math conditions
 */
 angular.module('a8m.conditions', [])

  .filter({
    isGreaterThan  : isGreaterThanFilter,
    '>'            : isGreaterThanFilter,

    isGreaterThanOrEqualTo  : isGreaterThanOrEqualToFilter,
    '>='                    : isGreaterThanOrEqualToFilter,

    isLessThan  : isLessThanFilter,
    '<'         : isLessThanFilter,

    isLessThanOrEqualTo  : isLessThanOrEqualToFilter,
    '<='                 : isLessThanOrEqualToFilter,

    isEqualTo  : isEqualToFilter,
    '=='       : isEqualToFilter,

    isNotEqualTo  : isNotEqualToFilter,
    '!='          : isNotEqualToFilter,

    isIdenticalTo  : isIdenticalToFilter,
    '==='          : isIdenticalToFilter,

    isNotIdenticalTo  : isNotIdenticalToFilter,
    '!=='             : isNotIdenticalToFilter
  });

  function isGreaterThanFilter() {
    return function (input, check) {
      return input > check;
    };
  }

  function isGreaterThanOrEqualToFilter() {
    return function (input, check) {
      return input >= check;
    };
  }

  function isLessThanFilter() {
    return function (input, check) {
      return input < check;
    };
  }

  function isLessThanOrEqualToFilter() {
    return function (input, check) {
      return input <= check;
    };
  }

  function isEqualToFilter() {
    return function (input, check) {
      return input == check;
    };
  }

  function isNotEqualToFilter() {
    return function (input, check) {
      return input != check;
    };
  }

  function isIdenticalToFilter() {
    return function (input, check) {
      return input === check;
    };
  }

  function isNotIdenticalToFilter() {
    return function (input, check) {
      return input !== check;
    };
  }
/**
 * @ngdoc filter
 * @name isNull
 * @kind function
 *
 * @description
 * checks if value is null or not
 * @return Boolean
 */
angular.module('a8m.is-null', [])
    .filter('isNull', function () {
      return function(input) {
        return isNull(input);
      }
    });

/**
 * @ngdoc filter
 * @name after-where
 * @kind function
 *
 * @description
 * get a collection and properties object, and returns all of the items
 * in the collection after the first that found with the given properties.
 *
 */
angular.module('a8m.after-where', [])
    .filter('afterWhere', function() {
      return function (collection, object) {

        collection = isObject(collection)
          ? toArray(collection)
          : collection;

        if(!isArray(collection) || isUndefined(object)) return collection;

        var index = collection.map( function( elm ) {
          return objectContains(object, elm);
        }).indexOf( true );

        return collection.slice((index === -1) ? 0 : index);
      }
    });

/**
 * @ngdoc filter
 * @name after
 * @kind function
 *
 * @description
 * get a collection and specified count, and returns all of the items
 * in the collection after the specified count.
 *
 */

angular.module('a8m.after', [])
    .filter('after', function() {
      return function (collection, count) {
        collection = isObject(collection)
          ? toArray(collection)
          : collection;

        return (isArray(collection))
          ? collection.slice(count)
          : collection;
      }
    });

/**
 * @ngdoc filter
 * @name before-where
 * @kind function
 *
 * @description
 * get a collection and properties object, and returns all of the items
 * in the collection before the first that found with the given properties.
 */
angular.module('a8m.before-where', [])
  .filter('beforeWhere', function() {
    return function (collection, object) {

      collection = isObject(collection)
        ? toArray(collection)
        : collection;

      if(!isArray(collection) || isUndefined(object)) return collection;

      var index = collection.map( function( elm ) {
        return objectContains(object, elm);
      }).indexOf( true );

      return collection.slice(0, (index === -1) ? collection.length : ++index);
    }
  });

/**
 * @ngdoc filter
 * @name before
 * @kind function
 *
 * @description
 * get a collection and specified count, and returns all of the items
 * in the collection before the specified count.
 */
angular.module('a8m.before', [])
    .filter('before', function() {
      return function (collection, count) {
        collection = isObject(collection)
          ? toArray(collection)
          : collection;

        return (isArray(collection))
          ? collection.slice(0, (!count) ? count : --count)
          : collection;
      }
    });

/**
 * @ngdoc filter
 * @name chunkBy
 * @kind function
 *
 * @description
 * Collect data into fixed-length chunks or blocks
 */

angular.module('a8m.chunk-by', ['a8m.filter-watcher'])
    .filter('chunkBy', ['filterWatcher', function (filterWatcher) {
      return function (array, n, fillVal) {

        return filterWatcher.isMemoized('chunkBy', arguments) ||
            filterWatcher.memoize('chunkBy', arguments, this,
                _chunkBy(array, n, fillVal));
        /**
         * @description
         * Get array with size `n` in `val` inside it.
         * @param n
         * @param val
         * @returns {Array}
         */
        function fill(n, val) {
          var ret = [];
          while (n--) ret[n] = val;
          return ret;
        }

        function _chunkBy(array, n, fillVal) {
          if (!isArray(array)) return array;
          return array.map(function (el, i, self) {
            i = i * n;
            el = self.slice(i, i + n);
            return !isUndefined(fillVal) && el.length < n
                ? el.concat(fill(n - el.length, fillVal))
                : el;
          }).slice(0, Math.ceil(array.length / n));
        }
      }
    }]);

/**
 * @ngdoc filter
 * @name concat
 * @kind function
 *
 * @description
 * get (array/object, object/array) and return merged collection
 */
angular.module('a8m.concat', [])
  .filter('concat', [function () {
    return function (collection, joined) {

      if (isUndefined(joined)) return collection;

      if (isArray(collection)) {
        return isObject(joined)
          ? collection.concat(toArray(joined))
          : collection.concat(joined);
      }

      if (isObject(collection)) {
        var array = toArray(collection);
        return (isObject(joined))
          ? array.concat(toArray(joined))
          : array.concat(joined);
      }
      return collection;
    };
  }
]);

/**
 * @ngdoc filter
 * @name contains
 * @kind function
 *
 * @description
 * Checks if given expression is present in one or more object in the collection
 */
angular.module('a8m.contains', [])
  .filter({
    contains: ['$parse', containsFilter],
    some: ['$parse', containsFilter]
  });

function containsFilter($parse) {
    return function (collection, expression) {

      collection = isObject(collection) ? toArray(collection) : collection;

      if(!isArray(collection) || isUndefined(expression)) {
        return false;
      }

      return collection.some(function(elm) {
        return (isObject(elm) || isFunction(expression))
          ? $parse(expression)(elm)
          : elm === expression;
      });

    }
 }

/**
 * @ngdoc filter
 * @name countBy
 * @kind function
 *
 * @description
 * Sorts a list into groups and returns a count for the number of objects in each group.
 */

angular.module('a8m.count-by', [])

  .filter('countBy', [ '$parse', function ( $parse ) {
    return function (collection, property) {

      var result = {},
        get = $parse(property),
        prop;

      collection = (isObject(collection)) ? toArray(collection) : collection;

      if(!isArray(collection) || isUndefined(property)) {
        return collection;
      }

      collection.forEach( function( elm ) {
        prop = get(elm);

        if(!result[prop]) {
          result[prop] = 0;
        }

        result[prop]++;
      });

      return result;
    }
  }]);

/**
 * @ngdoc filter
 * @name defaults
 * @kind function
 *
 * @description
 * defaultsFilter allows to specify a default fallback value for properties that resolve to undefined.
 */
angular.module('a8m.defaults', [])
  .filter('defaults', ['$parse', function( $parse ) {
    return function(collection, defaults) {

      collection = isObject(collection) ? toArray(collection) : collection;

      if(!isArray(collection) || !isObject(defaults)) {
        return collection;
      }

      var keys = deepKeys(defaults);

      collection.forEach(function(elm) {
        //loop through all the keys
        keys.forEach(function(key) {
          var getter = $parse(key);
          var setter = getter.assign;
          //if it's not exist
          if(isUndefined(getter(elm))) {
            //get from defaults, and set to the returned object
            setter(elm, getter(defaults))
          }
        });
      });

      return collection;
    }
  }]);
/**
 * @ngdoc filter
 * @name every
 * @kind function
 *
 * @description
 * Checks if given expression is present in all members in the collection
 *
 */
angular.module('a8m.every', [])
  .filter('every', ['$parse', function($parse) {
    return function (collection, expression) {
      collection = isObject(collection) ? toArray(collection) : collection;

      if(!isArray(collection) || isUndefined(expression)) {
        return true;
      }

      return collection.every( function(elm) {
        return (isObject(elm) || isFunction(expression))
          ? $parse(expression)(elm)
          : elm === expression;
      });
    }
  }]);

/**
 * @ngdoc filter
 * @name filterBy
 * @kind function
 *
 * @description
 * filter by specific properties, avoid the rest
 */
angular.module('a8m.filter-by', [])
  .filter('filterBy', ['$parse', function( $parse ) {
    return function(collection, properties, search) {
      var comparator;

      search = (isString(search) || isNumber(search)) ?
        String(search).toLowerCase() : undefined;

      collection = isObject(collection) ? toArray(collection) : collection;

      if(!isArray(collection) || isUndefined(search)) {
        return collection;
      }

      return collection.filter(function(elm) {
        return properties.some(function(prop) {

          /**
           * check if there is concatenate properties
           * example:
           * object: { first: 'foo', last:'bar' }
           * filterBy: ['first + last'] => search by full name(i.e 'foo bar')
           */
          if(!~prop.indexOf('+')) {
            comparator = $parse(prop)(elm)
          } else {
            var propList = prop.replace(new RegExp('\\s', 'g'), '').split('+');
            comparator = propList.reduce(function(prev, cur, index) {
              return (index === 1) ? $parse(prev)(elm) + ' ' + $parse(cur)(elm) :
                prev + ' ' + $parse(cur)(elm);
            });
          }

          return (isString(comparator) || isNumber(comparator))
            ? String(comparator).toLowerCase().contains(search)
            : false;
        });
      });
    }
  }]);

/**
 * @ngdoc filter
 * @name first
 * @kind function
 *
 * @description
 * Gets the first element or first n elements of an array
 * if callback is provided, is returns as long the callback return truthy
 */
angular.module('a8m.first', [])
  .filter('first', ['$parse', function( $parse ) {
    return function(collection) {
      var n
        , getter
        , args;

      collection = isObject(collection)
        ? toArray(collection)
        : collection;

      if(!isArray(collection)) {
        return collection;
      }

      args = Array.prototype.slice.call(arguments, 1);
      n = (isNumber(args[0])) ? args[0] : 1;
      getter = (!isNumber(args[0]))  ? args[0] : (!isNumber(args[1])) ? args[1] : undefined;

      return (args.length) ? getFirstMatches(collection, n,(getter) ? $parse(getter) : getter) :
        collection[0];
    }
  }]);

/**
 * @ngdoc filter
 * @name flatten
 * @kind function
 *
 * @description
 * Flattens a nested array (the nesting can be to any depth).
 * If you pass shallow, the array will only be flattened a single level
 */
angular.module('a8m.flatten', [])
  .filter('flatten', function () {
    return function(collection, shallow) {

      shallow = shallow || false;
      collection = isObject(collection)
        ? toArray(collection)
        : collection;

      if(!isArray(collection)) {
        return collection;
      }

      return !shallow
        ? flatten(collection, 0)
        : [].concat.apply([], collection);
    }
  });

/**
 * flatten nested array (the nesting can be to any depth).
 * @param array {Array}
 * @param i {int}
 * @returns {Array}
 * @private
 */
function flatten(array, i) {
  i = i || 0;

  if(i >= array.length)
    return array;

  if(isArray(array[i])) {
    return flatten(array.slice(0,i)
      .concat(array[i], array.slice(i+1)), i);
  }
  return flatten(array, i+1);
}

/**
 * @ngdoc filter
 * @name fuzzyByKey
 * @kind function
 *
 * @description
 * fuzzy string searching by key
 */
angular.module('a8m.fuzzy-by', [])
  .filter('fuzzyBy', ['$parse', function ( $parse ) {
    return function (collection, property, search, csensitive) {

      var sensitive = csensitive || false,
        prop, getter;

      collection = isObject(collection) ? toArray(collection) : collection;

      if(!isArray(collection) || isUndefined(property)
        || isUndefined(search)) {
        return collection;
      }

      getter = $parse(property);

      return collection.filter(function(elm) {

        prop = getter(elm);
        if(!isString(prop)) {
          return false;
        }

        prop = (sensitive) ? prop : prop.toLowerCase();
        search = (sensitive) ? search : search.toLowerCase();

        return hasApproxPattern(prop, search) !== false
      })
    }

 }]);
/**
 * @ngdoc filter
 * @name fuzzy
 * @kind function
 *
 * @description
 * fuzzy string searching for array of strings, objects
 */
angular.module('a8m.fuzzy', [])
  .filter('fuzzy', function () {
    return function (collection, search, csensitive) {
      var sensitive = csensitive || false;
      collection = isObject(collection) ? toArray(collection) : collection;

      if(!isArray(collection) || isUndefined(search)) {
        return collection;
      }

      search = (sensitive) ? search : search.toLowerCase();

      return collection.filter(function(elm) {
        if(isString(elm)) {
          elm = (sensitive) ? elm : elm.toLowerCase();
          return hasApproxPattern(elm, search) !== false
        }
        return (isObject(elm)) ? _hasApproximateKey(elm, search) : false;
      });

      /**
       * checks if object has key{string} that match
       * to fuzzy search pattern
       * @param object
       * @param search
       * @returns {boolean}
       * @private
       */
      function _hasApproximateKey(object, search) {
        var properties = Object.keys(object),
          prop, flag;
        return 0 < properties.filter(function (elm) {
          prop = object[elm];

          //avoid iteration if we found some key that equal[performance]
          if(flag) return true;

          if (isString(prop)) {
            prop = (sensitive) ? prop : prop.toLowerCase();
            return flag = (hasApproxPattern(prop, search) !== false);
          }

          return false;

        }).length;
      }
    }
  });

/**
 * @ngdoc filter
 * @name groupBy
 * @kind function
 *
 * @description
 * Create an object composed of keys generated from the result of running each element of a collection,
 * each key is an array of the elements.
 */

angular.module('a8m.group-by', [ 'a8m.filter-watcher' ])
  .filter('groupBy', [ '$parse', 'filterWatcher', function ( $parse, filterWatcher ) {
    return function (collection, property) {

      if(!isObject(collection) || isUndefined(property)) {
        return collection;
      }

      return filterWatcher.isMemoized('groupBy', arguments) ||
        filterWatcher.memoize('groupBy', arguments, this,
          _groupBy(collection, $parse(property)));

      /**
       * groupBy function
       * @param collection
       * @param getter
       * @returns {{}}
       */
      function _groupBy(collection, getter) {
        var result = {};
        var prop;

        forEach( collection, function( elm ) {
          prop = getter(elm);

          if(!result[prop]) {
            result[prop] = [];
          }
          result[prop].push(elm);
        });
        return result;
      }
    }
 }]);

/**
 * @ngdoc filter
 * @name isEmpty
 * @kind function
 *
 * @description
 * get collection or string and return if it empty
 */
angular.module('a8m.is-empty', [])
  .filter('isEmpty', function () {
    return function(collection) {
      return isObject(collection)
        ? !toArray(collection).length
        : !collection.length;
    }
  });

/**
 * @ngdoc filter
 * @name join
 * @kind function
 *
 * @description
 * join a collection by a provided delimiter (space by default)
 */
angular.module('a8m.join', [])
  .filter('join', function () {
    return function (input, delimiter) {
      if (isUndefined(input) || !isArray(input)) {
        return input;
      }
      if (isUndefined(delimiter)) delimiter = ' ';

      return input.join(delimiter);
    };
  })
;

/**
 * @ngdoc filter
 * @name last
 * @kind function
 *
 * @description
 * Gets the last element or last n elements of an array
 * if callback is provided, is returns as long the callback return truthy
 */
angular.module('a8m.last', [])
  .filter('last', ['$parse', function( $parse ) {
    return function(collection) {
      var n
        , getter
        , args
        //cuz reverse change our src collection
        //and we don't want side effects
        , reversed = copy(collection);

      reversed = isObject(reversed)
        ? toArray(reversed)
        : reversed;

      if(!isArray(reversed)) {
        return reversed;
      }

      args = Array.prototype.slice.call(arguments, 1);
      n = (isNumber(args[0])) ? args[0] : 1;
      getter = (!isNumber(args[0]))  ? args[0] : (!isNumber(args[1])) ? args[1] : undefined;

      return (args.length)
        //send reversed collection as arguments, and reverse it back as result
        ? getFirstMatches(reversed.reverse(), n,(getter) ? $parse(getter) : getter).reverse()
        //get the last element
        : reversed[reversed.length-1];
    }
  }]);

/**
 * @ngdoc filter
 * @name map
 * @kind function
 *
 * @description
 * Returns a new collection of the results of each expression execution.
 */
angular.module('a8m.map', [])
  .filter('map', ['$parse', function($parse) {
    return function (collection, expression) {

      collection = isObject(collection)
        ? toArray(collection)
        : collection;

      if(!isArray(collection) || isUndefined(expression)) {
        return collection;
      }

      return collection.map(function (elm) {
        return $parse(expression)(elm);
      });
    }
  }]);

/**
 * @ngdoc filter
 * @name omit
 * @kind function
 *
 * @description
 * filter collection by expression
 */

angular.module('a8m.omit', [])

  .filter('omit', ['$parse', function($parse) {
    return function (collection, expression) {

      collection = isObject(collection)
        ? toArray(collection)
        : collection;

      if(!isArray(collection) || isUndefined(expression)) {
        return collection;
      }

      return collection.filter(function (elm) {
        return !($parse(expression)(elm));
      });
    }
  }]);

/**
 * @ngdoc filter
 * @name pick
 * @kind function
 *
 * @description
 * filter collection by expression
 */

angular.module('a8m.pick', [])

  .filter('pick', ['$parse', function($parse) {
    return function (collection, expression) {

      collection = isObject(collection)
        ? toArray(collection)
        : collection;

      if(!isArray(collection) || isUndefined(expression)) {
        return collection;
      }

      return collection.filter(function (elm) {
        return $parse(expression)(elm);
      });
    }
  }]);

/**
 * @ngdoc filter
 * @name range
 * @kind function
 *
 * @description
 * rangeFilter provides some support for a for loop using numbers
 */
angular.module('a8m.range', [])
  .filter('range', function () {
    return function (input, total) {
      for (var i = 0; i < parseInt(total); i++) {
        input.push(i);
      }
      return input;
	  };
  });
/**
 * @ngdoc filter
 * @name removeWith
 * @kind function
 *
 * @description
 * get collection and properties object, and removed elements
 * with this properties
 */

angular.module('a8m.remove-with', [])
  .filter('removeWith', function() {
    return function (collection, object) {

      if(isUndefined(object)) {
        return collection;
      }
      collection = isObject(collection)
        ? toArray(collection)
        : collection;

      return collection.filter(function (elm) {
        return !objectContains(object, elm);
      });
    }
  });


/**
 * @ngdoc filter
 * @name remove
 * @kind function
 *
 * @description
 * remove specific members from collection
 */

angular.module('a8m.remove', [])

  .filter('remove', function () {
    return function (collection) {
      collection = isObject(collection) ? toArray(collection) : collection;
      var args = Array.prototype.slice.call(arguments, 1);

      if(!isArray(collection)) {
        return collection;
      }

      return collection.filter( function( member ) {
        return !args.some(function(nest) {
          return equals(nest, member);
        })
      });
    }
  });

/**
 * @ngdoc filter
 * @name reverse
 * @kind function
 *
 * @description
 * Reverses a string or collection
 */
angular.module('a8m.reverse', [])
    .filter('reverse',[ function () {
      return function (input) {
        input = isObject(input) ? toArray(input) : input;

        if(isString(input)) {
          return input.split('').reverse().join('');
        }

        return isArray(input)
          ? input.slice().reverse()
          : input;
      }
    }]);

/**
 * @ngdoc filter
 * @name searchField
 * @kind function
 *
 * @description
 * for each member, join several strings field and add them to
 * new field called 'searchField' (use for search filtering)
 */
angular.module('a8m.search-field', [])
  .filter('searchField', ['$parse', function ($parse) {
    return function (collection) {

      var get, field;

      collection = isObject(collection) ? toArray(collection) : collection;

      var args = Array.prototype.slice.call(arguments, 1);

      if(!isArray(collection) || !args.length) {
        return collection;
      }

      return collection.map(function(member) {

        field = args.map(function(field) {
          get = $parse(field);
          return get(member);
        }).join(' ');

        return extend(member, { searchField: field });
      });
    }
  }]);

/**
 * @ngdoc filter
 * @name toArray
 * @kind function
 *
 * @description
 * Convert objects into stable arrays.
 * if addKey set to true,the filter also attaches a new property
 * $key to the value containing the original key that was used in
 * the object we are iterating over to reference the property
 */
angular.module('a8m.to-array', [])
  .filter('toArray', function() {
    return function (collection, addKey) {

      if(!isObject(collection)) {
        return collection;
      }

      return !addKey
        ? toArray(collection)
        : Object.keys(collection).map(function (key) {
            return extend(collection[key], { $key: key });
          });
    }
  });

/**
 * @ngdoc filter
 * @name unique/uniq
 * @kind function
 *
 * @description
 * get collection and filter duplicate members
 * if uniqueFilter get a property(nested to) as argument it's
 * filter by this property as unique identifier
 */

angular.module('a8m.unique', [])
  .filter({
      unique: ['$parse', uniqFilter],
      uniq: ['$parse', uniqFilter]
    });

function uniqFilter($parse) {
    return function (collection, property) {

      collection = isObject(collection) ? toArray(collection) : collection;

      if (!isArray(collection)) {
        return collection;
      }

      //store all unique identifiers
      var uniqueItems = [],
          get = $parse(property);

      return (isUndefined(property))
        //if it's kind of primitive array
        ? collection.filter(function (elm, pos, self) {
          return self.indexOf(elm) === pos;
        })
        //else compare with equals
        : collection.filter(function (elm) {
          var prop = get(elm);
          if(some(uniqueItems, prop)) {
            return false;
          }
          uniqueItems.push(prop);
          return true;
      });

      //checked if the unique identifier is already exist
      function some(array, member) {
        if(isUndefined(member)) {
          return false;
        }
        return array.some(function(el) {
          return equals(el, member);
        });
      }
    }
}

/**
 * @ngdoc filter
 * @name where
 * @kind function
 *
 * @description
 * of each element in a collection to the given properties object,
 * returning an array of all elements that have equivalent property values.
 *
 */
angular.module('a8m.where', [])
  .filter('where', function() {
    return function (collection, object) {
      if(isUndefined(object)) return collection;
      collection = isObject(collection)
        ? toArray(collection)
        : collection;

      return collection.filter(function (elm) {
        return objectContains(object, elm);
      });
    }
  });

/**
 * @ngdoc filter
 * @name xor
 * @kind function
 *
 * @description
 * Exclusive or filter by expression
 */

angular.module('a8m.xor', [])

  .filter('xor', ['$parse', function($parse) {
    return function (col1, col2, expression) {

      expression = expression || false;

      col1 = isObject(col1) ? toArray(col1) : col1;
      col2 = isObject(col2) ? toArray(col2) : col2;

      if(!isArray(col1) || !isArray(col2)) return col1;

      return col1.concat(col2)
        .filter(function(elm) {
          return !(some(elm, col1) && some(elm, col2));
        });

      function some(el, col) {
        var getter = $parse(expression);
        return col.some(function(dElm) {
          return expression
            ? equals(getter(dElm), getter(el))
            : equals(dElm, el);
        });
      }
    }
  }]);

/**
 * @ngdoc filter
 * @name formatBytes
 * @kind function
 *
 * @description
 * Convert bytes into appropriate display 
 * 1024 bytes => 1 KB
 */
angular.module('a8m.math.byteFmt', ['a8m.math'])
  .filter('byteFmt', ['$math', function ($math) {
    return function (bytes, decimal) {

      if(isNumber(decimal) && isFinite(decimal) && decimal%1===0 && decimal >= 0 &&
        isNumber(bytes) && isFinite(bytes)) {
        if(bytes < 1024) { // within 1 KB so B
          return convertToDecimal(bytes, decimal, $math) + ' B';
        } else if(bytes < 1048576) { // within 1 MB so KB
          return convertToDecimal((bytes / 1024), decimal, $math) + ' KB';
        } else if(bytes < 1073741824){ // within 1 GB so MB
          return convertToDecimal((bytes / 1048576), decimal, $math) + ' MB';
        } else { // GB or more
          return convertToDecimal((bytes / 1073741824), decimal, $math) + ' GB';
        }

      }
      return "NaN";
    }
  }]);
/**
 * @ngdoc filter
 * @name degrees
 * @kind function
 *
 * @description
 * Convert angle from radians to degrees
 */
angular.module('a8m.math.degrees', ['a8m.math'])
  .filter('degrees', ['$math', function ($math) {
    return function (radians, decimal) {
      // if decimal is not an integer greater than -1, we cannot do. quit with error "NaN"
      // if degrees is not a real number, we cannot do also. quit with error "NaN"
      if(isNumber(decimal) && isFinite(decimal) && decimal%1===0 && decimal >= 0 &&
        isNumber(radians) && isFinite(radians)) {
        var degrees = (radians * 180) / $math.PI;
        return $math.round(degrees * $math.pow(10,decimal)) / ($math.pow(10,decimal));
      } else {
        return "NaN";
      }
    }
  }]);

 
 
/**
 * @ngdoc filter
 * @name formatBytes
 * @kind function
 *
 * @description
 * Convert bytes into appropriate display 
 * 1024 kilobytes => 1 MB
 */
angular.module('a8m.math.kbFmt', ['a8m.math'])
  .filter('kbFmt', ['$math', function ($math) {
    return function (bytes, decimal) {

      if(isNumber(decimal) && isFinite(decimal) && decimal%1===0 && decimal >= 0 &&
        isNumber(bytes) && isFinite(bytes)) {
        if(bytes < 1024) { // within 1 MB so KB
          return convertToDecimal(bytes, decimal, $math) + ' KB';
        } else if(bytes < 1048576) { // within 1 GB so MB
          return convertToDecimal((bytes / 1024), decimal, $math) + ' MB';
        } else {
          return convertToDecimal((bytes / 1048576), decimal, $math) + ' GB';
        }
      }
      return "NaN";
    }
  }]);
/**
 * @ngdoc module
 * @name math
 * @description
 * reference to global Math object
 */
angular.module('a8m.math', [])
  .factory('$math', ['$window', function ($window) {
    return $window.Math;
  }]);

/**
 * @ngdoc filter
 * @name max
 * @kind function
 *
 * @description
 * Math.max will get an array and return the max value. if an expression
 * is provided, will return max value by expression.
 */
angular.module('a8m.math.max', ['a8m.math'])
  .filter('max', ['$math', '$parse', function ($math, $parse) {
    return function (input, expression) {

      if(!isArray(input)) {
        return input;
      }
      return isUndefined(expression)
        ? $math.max.apply($math, input)
        : input[indexByMax(input, expression)];
    };

    /**
     * @private
     * @param array
     * @param exp
     * @returns {number|*|Number}
     */
    function indexByMax(array, exp) {
      var mappedArray = array.map(function(elm){
        return $parse(exp)(elm);
      });
      return mappedArray.indexOf($math.max.apply($math, mappedArray));
    }
  }]);
/**
 * @ngdoc filter
 * @name min
 * @kind function
 *
 * @description
 * Math.min will get an array and return the min value. if an expression
 * is provided, will return min value by expression.
 */
angular.module('a8m.math.min', ['a8m.math'])
  .filter('min', ['$math', '$parse', function ($math, $parse) {
    return function (input, expression) {

      if(!isArray(input)) {
        return input;
      }
      return isUndefined(expression)
        ? $math.min.apply($math, input)
        : input[indexByMin(input, expression)];
    };

    /**
     * @private
     * @param array
     * @param exp
     * @returns {number|*|Number}
     */
    function indexByMin(array, exp) {
      var mappedArray = array.map(function(elm){
        return $parse(exp)(elm);
      });
      return mappedArray.indexOf($math.min.apply($math, mappedArray));
    }
  }]);
/**
 * @ngdoc filter
 * @name Percent
 * @kind function
 *
 * @description
 * percentage between two numbers
 */
angular.module('a8m.math.percent', ['a8m.math'])
  .filter('percent', ['$math', '$window', function ($math, $window) {
    return function (input, divided, round) {

      var divider = isString(input) ? $window.Number(input) : input;
      divided = divided || 100;
      round = round || false;

      if (!isNumber(divider) || $window.isNaN(divider)) return input;

      return round
        ? $math.round((divider / divided) * 100)
        : (divider / divided) * 100;
    }
  }]);

/**
 * @ngdoc filter
 * @name toRadians
 * @kind function
 *
 * @description
 * Convert angle from degrees to radians
 */
angular.module('a8m.math.radians', ['a8m.math'])
  .filter('radians', ['$math', function ($math) {
    return function (degrees, decimal) {
      // if decimal is not an integer greater than -1, we cannot do. quit with error "NaN"
      // if degrees is not a real number, we cannot do also. quit with error "NaN"
      if(isNumber(decimal) && isFinite(decimal) && decimal%1===0 && decimal >= 0 &&
        isNumber(degrees) && isFinite(degrees)) {
        var radians = (degrees * 3.14159265359) / 180;
        return $math.round(radians * $math.pow(10,decimal)) / ($math.pow(10,decimal));
      }
      return "NaN";
    }
  }]);

 
 
/**
 * @ngdoc filter
 * @name Radix
 * @kind function
 *
 * @description
 * converting decimal numbers to different bases(radix)
 */
angular.module('a8m.math.radix', [])
  .filter('radix', function () {
    return function (input, radix) {
      var RANGE = /^[2-9]$|^[1-2]\d$|^3[0-6]$/;

      if(!isNumber(input) || !RANGE.test(radix)) {
        return input;
      }

      return input.toString(radix).toUpperCase();
    }
  });

/**
 * @ngdoc filter
 * @name formatBytes
 * @kind function
 *
 * @description
 * Convert number into abbreviations.
 * i.e: K for one thousand, M for Million, B for billion
 * e.g: number of users:235,221, decimal:1 => 235.2 K
 */
angular.module('a8m.math.shortFmt', ['a8m.math'])
  .filter('shortFmt', ['$math', function ($math) {
    return function (number, decimal) {
      if(isNumber(decimal) && isFinite(decimal) && decimal%1===0 && decimal >= 0 &&
        isNumber(number) && isFinite(number)){
        if(number < 1e3) {
          return number;
        } else if(number < 1e6) {
          return convertToDecimal((number / 1e3), decimal, $math) + ' K';
        } else if(number < 1e9){
          return convertToDecimal((number / 1e6), decimal, $math) + ' M';
        } else {
          return convertToDecimal((number / 1e9), decimal, $math) + ' B';
        }

      }
      return "NaN";
    }
  }]);
/**
 * @ngdoc filter
 * @name sum
 * @kind function
 *
 * @description
 * Sum up all values within an array
 */
angular.module('a8m.math.sum', [])
  .filter('sum', function () {
    return function (input, initial) {
      return !isArray(input)
        ? input
        : input.reduce(function(prev, curr) {
          return prev + curr;
        }, initial || 0);
    }
  });

/**
 * @ngdoc filter
 * @name endsWith
 * @kind function
 *
 * @description
 * checks whether string ends with the ends parameter.
 */
angular.module('a8m.ends-with', [])

  .filter('endsWith', function () {
    return function (input, ends, csensitive) {

      var sensitive = csensitive || false,
        position;

      if(!isString(input) || isUndefined(ends)) {
        return input;
      }

      input = (sensitive) ? input : input.toLowerCase();
      position = input.length - ends.length;

      return input.indexOf((sensitive) ? ends : ends.toLowerCase(), position) !== -1;
    }
  });

/**
 * @ngdoc filter
 * @name latinize
 * @kind function
 *
 * @description
 * remove accents/diacritics from a string
 */
angular.module('a8m.latinize', [])
  .filter('latinize',[ function () {
    var defaultDiacriticsRemovalap = [
      {'base':'A', 'letters':'\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F'},
      {'base':'AA','letters':'\uA732'},
      {'base':'AE','letters':'\u00C6\u01FC\u01E2'},
      {'base':'AO','letters':'\uA734'},
      {'base':'AU','letters':'\uA736'},
      {'base':'AV','letters':'\uA738\uA73A'},
      {'base':'AY','letters':'\uA73C'},
      {'base':'B', 'letters':'\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181'},
      {'base':'C', 'letters':'\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E'},
      {'base':'D', 'letters':'\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779'},
      {'base':'DZ','letters':'\u01F1\u01C4'},
      {'base':'Dz','letters':'\u01F2\u01C5'},
      {'base':'E', 'letters':'\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E'},
      {'base':'F', 'letters':'\u0046\u24BB\uFF26\u1E1E\u0191\uA77B'},
      {'base':'G', 'letters':'\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E'},
      {'base':'H', 'letters':'\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D'},
      {'base':'I', 'letters':'\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197'},
      {'base':'J', 'letters':'\u004A\u24BF\uFF2A\u0134\u0248'},
      {'base':'K', 'letters':'\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2'},
      {'base':'L', 'letters':'\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780'},
      {'base':'LJ','letters':'\u01C7'},
      {'base':'Lj','letters':'\u01C8'},
      {'base':'M', 'letters':'\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C'},
      {'base':'N', 'letters':'\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4'},
      {'base':'NJ','letters':'\u01CA'},
      {'base':'Nj','letters':'\u01CB'},
      {'base':'O', 'letters':'\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C'},
      {'base':'OI','letters':'\u01A2'},
      {'base':'OO','letters':'\uA74E'},
      {'base':'OU','letters':'\u0222'},
      {'base':'OE','letters':'\u008C\u0152'},
      {'base':'oe','letters':'\u009C\u0153'},
      {'base':'P', 'letters':'\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754'},
      {'base':'Q', 'letters':'\u0051\u24C6\uFF31\uA756\uA758\u024A'},
      {'base':'R', 'letters':'\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782'},
      {'base':'S', 'letters':'\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784'},
      {'base':'T', 'letters':'\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786'},
      {'base':'TZ','letters':'\uA728'},
      {'base':'U', 'letters':'\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244'},
      {'base':'V', 'letters':'\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245'},
      {'base':'VY','letters':'\uA760'},
      {'base':'W', 'letters':'\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72'},
      {'base':'X', 'letters':'\u0058\u24CD\uFF38\u1E8A\u1E8C'},
      {'base':'Y', 'letters':'\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE'},
      {'base':'Z', 'letters':'\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762'},
      {'base':'a', 'letters':'\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250'},
      {'base':'aa','letters':'\uA733'},
      {'base':'ae','letters':'\u00E6\u01FD\u01E3'},
      {'base':'ao','letters':'\uA735'},
      {'base':'au','letters':'\uA737'},
      {'base':'av','letters':'\uA739\uA73B'},
      {'base':'ay','letters':'\uA73D'},
      {'base':'b', 'letters':'\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253'},
      {'base':'c', 'letters':'\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184'},
      {'base':'d', 'letters':'\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A'},
      {'base':'dz','letters':'\u01F3\u01C6'},
      {'base':'e', 'letters':'\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD'},
      {'base':'f', 'letters':'\u0066\u24D5\uFF46\u1E1F\u0192\uA77C'},
      {'base':'g', 'letters':'\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F'},
      {'base':'h', 'letters':'\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265'},
      {'base':'hv','letters':'\u0195'},
      {'base':'i', 'letters':'\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131'},
      {'base':'j', 'letters':'\u006A\u24D9\uFF4A\u0135\u01F0\u0249'},
      {'base':'k', 'letters':'\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3'},
      {'base':'l', 'letters':'\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747'},
      {'base':'lj','letters':'\u01C9'},
      {'base':'m', 'letters':'\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F'},
      {'base':'n', 'letters':'\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5'},
      {'base':'nj','letters':'\u01CC'},
      {'base':'o', 'letters':'\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275'},
      {'base':'oi','letters':'\u01A3'},
      {'base':'ou','letters':'\u0223'},
      {'base':'oo','letters':'\uA74F'},
      {'base':'p','letters':'\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755'},
      {'base':'q','letters':'\u0071\u24E0\uFF51\u024B\uA757\uA759'},
      {'base':'r','letters':'\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783'},
      {'base':'s','letters':'\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B'},
      {'base':'t','letters':'\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787'},
      {'base':'tz','letters':'\uA729'},
      {'base':'u','letters': '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289'},
      {'base':'v','letters':'\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C'},
      {'base':'vy','letters':'\uA761'},
      {'base':'w','letters':'\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73'},
      {'base':'x','letters':'\u0078\u24E7\uFF58\u1E8B\u1E8D'},
      {'base':'y','letters':'\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF'},
      {'base':'z','letters':'\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763'}
    ];

    var diacriticsMap = {};
    for (var i = 0; i < defaultDiacriticsRemovalap.length; i++) {
      var letters = defaultDiacriticsRemovalap[i].letters.split("");
      for (var j = 0; j < letters.length ; j++){
        diacriticsMap[letters[j]] = defaultDiacriticsRemovalap[i].base;
      }
    }

    // "what?" version ... http://jsperf.com/diacritics/12
    function removeDiacritics (str) {
      return str.replace(/[^\u0000-\u007E]/g, function(a){
        return diacriticsMap[a] || a;
      });
    }

    return function (input) {

      return isString(input)
        ? removeDiacritics(input)
        : input;
    }
  }]);

/**
 * @ngdoc filter
 * @name ltrim
 * @kind function
 *
 * @description
 * Left trim. Similar to trimFilter, but only for left side.
 */
angular.module('a8m.ltrim', [])
  .filter('ltrim', function () {
    return function(input, chars) {

      var trim = chars || '\\s';

      return isString(input)
        ? input.replace(new RegExp('^' + trim + '+'), '')
        : input;
    }
  });

/**
 * @ngdoc filter
 * @name match
 * @kind function
 *
 * @description
 * Return the matched pattern in a string.
 */
angular.module('a8m.match', [])
  .filter('match', function () {
    return function (input, pattern, flag) {

      var reg = new RegExp(pattern, flag);

      return isString(input)
        ? input.match(reg)
        : null;
    }
  });

/**
 * @ngdoc filter
 * @name repeat
 * @kind function
 *
 * @description
 * Repeats a string n times
 */
angular.module('a8m.repeat', [])
  .filter('repeat',[ function () {
    return function (input, n, separator) {

      var times = ~~n;

      if(!isString(input)) {
        return input;
      }

      return !times
        ? input
        : strRepeat(input, --n, separator || '');
    }
  }]);

/**
 * Repeats a string n times with given separator
 * @param str string to repeat
 * @param n number of times
 * @param sep separator
 * @returns {*}
 */
function strRepeat(str, n, sep) {
  if(!n) {
    return str;
  }
  return str + sep + strRepeat(str, --n, sep);
}
/**
* @ngdoc filter
* @name rtrim
* @kind function
*
* @description
* Right trim. Similar to trimFilter, but only for right side.
*/
angular.module('a8m.rtrim', [])
  .filter('rtrim', function () {
    return function(input, chars) {

      var trim = chars || '\\s';

      return isString(input)
        ? input.replace(new RegExp(trim + '+$'), '')
        : input;
    }
  });

/**
 * @ngdoc filter
 * @name slugify
 * @kind function
 *
 * @description
 * remove spaces from string, replace with "-" or given argument
 */
angular.module('a8m.slugify', [])
  .filter('slugify',[ function () {
    return function (input, sub) {

      var replace = (isUndefined(sub)) ? '-' : sub;

      return isString(input)
        ? input.toLowerCase().replace(/\s+/g, replace)
        : input;
    }
  }]);

/**
 * @ngdoc filter
 * @name startWith
 * @kind function
 *
 * @description
 * checks whether string starts with the starts parameter.
 */
angular.module('a8m.starts-with', [])
  .filter('startsWith', function () {
    return function (input, start, csensitive) {

      var sensitive = csensitive || false;

      if(!isString(input) || isUndefined(start)) {
        return input;
      }

      input = (sensitive) ? input : input.toLowerCase();

      return !input.indexOf((sensitive) ? start : start.toLowerCase());
    }
  });

/**
 * @ngdoc filter
 * @name stringular
 * @kind function
 *
 * @description
 * get string with {n} and replace match with enumeration values
 */
angular.module('a8m.stringular', [])
  .filter('stringular', function () {
    return function(input) {

      var args = Array.prototype.slice.call(arguments, 1);

      return input.replace(/{(\d+)}/g, function (match, number) {
        return isUndefined(args[number]) ? match : args[number];
      });
    }
  });

/**
 * @ngdoc filter
 * @name stripTags
 * @kind function
 *
 * @description
 * strip html tags from string
 */
angular.module('a8m.strip-tags', [])
  .filter('stripTags', function () {
    return function(input) {
      return isString(input)
        ? input.replace(/<\S[^><]*>/g, '')
        : input;
    }
  });

/**
 * @ngdoc filter
 * @name test
 * @kind function
 *
 * @description
 * test if a string match a pattern.
 */
angular.module('a8m.test', [])
  .filter('test', function () {
    return function (input, pattern, flag) {

      var reg = new RegExp(pattern, flag);

      return isString(input)
        ? reg.test(input)
        : input;
    }
  });

/**
 * @ngdoc filter
 * @name trim
 * @kind function
 *
 * @description
 *  Strip whitespace (or other characters) from the beginning and end of a string
 */
angular.module('a8m.trim', [])
  .filter('trim', function () {
    return function(input, chars) {

      var trim = chars || '\\s';

      return isString(input)
        ? input.replace(new RegExp('^' + trim + '+|' + trim + '+$', 'g'), '')
        : input;
    }
  });

/**
 * @ngdoc filter
 * @name truncate
 * @kind function
 *
 * @description
 * truncates a string given a specified length, providing a custom string to denote an omission.
 */
angular.module('a8m.truncate', [])
  .filter('truncate', function () {
    return function(input, length, suffix, preserve) {

      length = isUndefined(length) ? input.length : length;
      preserve = preserve || false;
      suffix = suffix || '';

      if(!isString(input) || (input.length <= length)) return input;

      return input.substring(0, (preserve)
        ? ((input.indexOf(' ', length) === -1) ? input.length : input.indexOf(' ', length))
        : length) + suffix;
    };
  });

/**
 * @ngdoc filter
 * @name ucfirst
 * @kind function
 *
 * @description
 * ucfirst
 */
angular.module('a8m.ucfirst', [])
  .filter('ucfirst', [function() {
    return function(input) {
      return isString(input)
        ? input
            .split(' ')
            .map(function (ch) {
              return ch.charAt(0).toUpperCase() + ch.substring(1);
            })
            .join(' ')
        : input;
    }
  }]);

/**
 * @ngdoc filter
 * @name uriComponentEncode
 * @kind function
 *
 * @description
 * get string as parameter and return encoded string
 */
angular.module('a8m.uri-component-encode', [])
  .filter('uriComponentEncode',['$window', function ($window) {
      return function (input) {
        return isString(input)
          ? $window.encodeURIComponent(input)
          : input;
      }
    }]);

/**
 * @ngdoc filter
 * @name uriEncode
 * @kind function
 *
 * @description
 * get string as parameter and return encoded string
 */
angular.module('a8m.uri-encode', [])
  .filter('uriEncode',['$window', function ($window) {
      return function (input) {
        return isString(input)
          ? $window.encodeURI(input)
          : input;
      }
    }]);

/**
 * @ngdoc filter
 * @name wrap
 * @kind function
 *
 * @description
 * Wrap a string with another string
 */
angular.module('a8m.wrap', [])
  .filter('wrap', function () {
    return function(input, wrap, ends) {
      return isString(input) && isDefined(wrap)
        ? [wrap, input, ends || wrap].join('')
        : input;
    }
  });

/**
 * @ngdoc provider
 * @name filterWatcher
 * @kind function
 *
 * @description
 * store specific filters result in $$cache, based on scope life time(avoid memory leak).
 * on scope.$destroy remove it's cache from $$cache container
 */

angular.module('a8m.filter-watcher', [])
  .provider('filterWatcher', function() {

    this.$get = ['$window', '$rootScope', function($window, $rootScope) {

      /**
       * Cache storing
       * @type {Object}
       */
      var $$cache = {};

      /**
       * Scope listeners container
       * scope.$destroy => remove all cache keys
       * bind to current scope.
       * @type {Object}
       */
      var $$listeners = {};

      /**
       * $timeout without triggering the digest cycle
       * @type {function}
       */
      var $$timeout = $window.setTimeout;

      /**
       * @description
       * get `HashKey` string based on the given arguments.
       * @param fName
       * @param args
       * @returns {string}
       */
      function getHashKey(fName, args) {
        function replacerFactory() {
          var cache = [];
          return function(key, val) {
            if(isObject(val) && !isNull(val)) {
              if (~cache.indexOf(val)) return '[Circular]';
              cache.push(val)
            }
            if($window == val) return '$WINDOW';
            if($window.document == val) return '$DOCUMENT';
            if(isScope(val)) return '$SCOPE';
            return val;
          }
        }
        return [fName, JSON.stringify(args, replacerFactory())]
          .join('#')
          .replace(/"/g,'');
      }

      /**
       * @description
       * fir on $scope.$destroy,
       * remove cache based scope from `$$cache`,
       * and remove itself from `$$listeners`
       * @param event
       */
      function removeCache(event) {
        var id = event.targetScope.$id;
        forEach($$listeners[id], function(key) {
          delete $$cache[key];
        });
        delete $$listeners[id];
      }

      /**
       * @description
       * for angular version that greater than v.1.3.0
       * it clear cache when the digest cycle is end.
       */
      function cleanStateless() {
        $$timeout(function() {
          if(!$rootScope.$$phase)
            $$cache = {};
        }, 2000);
      }

      /**
       * @description
       * Store hashKeys in $$listeners container
       * on scope.$destroy, remove them all(bind an event).
       * @param scope
       * @param hashKey
       * @returns {*}
       */
      function addListener(scope, hashKey) {
        var id = scope.$id;
        if(isUndefined($$listeners[id])) {
          scope.$on('$destroy', removeCache);
          $$listeners[id] = [];
        }
        return $$listeners[id].push(hashKey);
      }

      /**
       * @description
       * return the `cacheKey` or undefined.
       * @param filterName
       * @param args
       * @returns {*}
       */
      function $$isMemoized(filterName, args) {
        var hashKey = getHashKey(filterName, args);
        return $$cache[hashKey];
      }

      /**
       * @description
       * store `result` in `$$cache` container, based on the hashKey.
       * add $destroy listener and return result
       * @param filterName
       * @param args
       * @param scope
       * @param result
       * @returns {*}
       */
      function $$memoize(filterName, args, scope, result) {
        var hashKey = getHashKey(filterName, args);
        //store result in `$$cache` container
        $$cache[hashKey] = result;
        // for angular versions that less than 1.3
        // add to `$destroy` listener, a cleaner callback
        if(isScope(scope)) {
          addListener(scope, hashKey);
        } else {
          cleanStateless();
        }
        return result;
      }

      return {
        isMemoized: $$isMemoized,
        memoize: $$memoize
      }
    }];
  });
  

/**
 * @ngdoc module
 * @name angular.filters
 * @description
 * Bunch of useful filters for angularJS
 */

angular.module('angular.filter', [

  'a8m.ucfirst',
  'a8m.uri-encode',
  'a8m.uri-component-encode',
  'a8m.slugify',
  'a8m.latinize',
  'a8m.strip-tags',
  'a8m.stringular',
  'a8m.truncate',
  'a8m.starts-with',
  'a8m.ends-with',
  'a8m.wrap',
  'a8m.trim',
  'a8m.ltrim',
  'a8m.rtrim',
  'a8m.repeat',
  'a8m.test',
  'a8m.match',

  'a8m.to-array',
  'a8m.concat',
  'a8m.contains',
  'a8m.unique',
  'a8m.is-empty',
  'a8m.after',
  'a8m.after-where',
  'a8m.before',
  'a8m.before-where',
  'a8m.defaults',
  'a8m.where',
  'a8m.reverse',
  'a8m.remove',
  'a8m.remove-with',
  'a8m.group-by',
  'a8m.count-by',
  'a8m.chunk-by',
  'a8m.search-field',
  'a8m.fuzzy-by',
  'a8m.fuzzy',
  'a8m.omit',
  'a8m.pick',
  'a8m.every',
  'a8m.filter-by',
  'a8m.xor',
  'a8m.map',
  'a8m.first',
  'a8m.last',
  'a8m.flatten',
  'a8m.join',
  'a8m.range',
  
  'a8m.math',
  'a8m.math.max',
  'a8m.math.min',
  'a8m.math.percent',
  'a8m.math.radix',
  'a8m.math.sum',
  'a8m.math.degrees',
  'a8m.math.radians',
  'a8m.math.byteFmt',
  'a8m.math.kbFmt',
  'a8m.math.shortFmt',

  'a8m.angular',
  'a8m.conditions',
  'a8m.is-null',

  'a8m.filter-watcher'
]);
})( window, window.angular );
/*
 * angular-mousewheel v1.0.5
 * (c) 2013 Monospaced http://monospaced.com
 * License: MIT
 */

angular.module('monospaced.mousewheel', [])
  .directive('msdWheel', ['$parse', function($parse){
    return {
      restrict: 'A, C',
        link: function(scope, element, attr) {
        var expr = $parse(attr['msdWheel']),
            fn = function(event, delta, deltaX, deltaY){
              scope.$apply(function(){
                expr(scope, {
                  $event: event,
                  $delta: delta,
                  $deltaX: deltaX,
                  $deltaY: deltaY
                });
              });
            },
            hamster;

        if (typeof Hamster === 'undefined') {
          // fallback to standard wheel event
          element.bind('wheel', function(event){
            scope.$apply(function() {
              expr(scope, {
                $event: event
              });
            });
          });
          return;
        }

        // don't create multiple Hamster instances per element
        if (!(hamster = element.data('hamster'))) {
          hamster = Hamster(element[0]);
          element.data('hamster', hamster);
        }

        // bind Hamster wheel event
        hamster.wheel(fn);

        // unbind Hamster wheel event
        scope.$on('$destroy', function(){
          hamster.unwheel(fn);
        });
      }
    };
  }]);

/**
  * x is a value between 0 and 1, indicating where in the animation you are.
  */
var duScrollDefaultEasing = function (x) {
  'use strict';

  if(x < 0.5) {
    return Math.pow(x*2, 2)/2;
  }
  return 1-Math.pow((1-x)*2, 2)/2;
};

var duScroll = angular.module('duScroll', [
  'duScroll.scrollspy',
  'duScroll.smoothScroll',
  'duScroll.scrollContainer',
  'duScroll.spyContext',
  'duScroll.scrollHelpers'
])
  //Default animation duration for smoothScroll directive
  .value('duScrollDuration', 350)
  //Scrollspy debounce interval, set to 0 to disable
  .value('duScrollSpyWait', 100)
  //Wether or not multiple scrollspies can be active at once
  .value('duScrollGreedy', false)
  //Default offset for smoothScroll directive
  .value('duScrollOffset', 0)
  //Default easing function for scroll animation
  .value('duScrollEasing', duScrollDefaultEasing)
  //Which events on the container (such as body) should cancel scroll animations
  .value('duScrollCancelOnEvents', 'scroll mousedown mousewheel touchmove keydown')
  //Whether or not to activate the last scrollspy, when page/container bottom is reached
  .value('duScrollBottomSpy', false)
  //Active class name
  .value('duScrollActiveClass', 'active');

if (typeof module !== 'undefined' && module && module.exports) {
  module.exports = duScroll;
}


angular.module('duScroll.scrollHelpers', ['duScroll.requestAnimation'])
.run(["$window", "$q", "cancelAnimation", "requestAnimation", "duScrollEasing", "duScrollDuration", "duScrollOffset", "duScrollCancelOnEvents", function($window, $q, cancelAnimation, requestAnimation, duScrollEasing, duScrollDuration, duScrollOffset, duScrollCancelOnEvents) {
  'use strict';

  var proto = {};

  var isDocument = function(el) {
    return (typeof HTMLDocument !== 'undefined' && el instanceof HTMLDocument) || (el.nodeType && el.nodeType === el.DOCUMENT_NODE);
  };

  var isElement = function(el) {
    return (typeof HTMLElement !== 'undefined' && el instanceof HTMLElement) || (el.nodeType && el.nodeType === el.ELEMENT_NODE);
  };

  var unwrap = function(el) {
    return isElement(el) || isDocument(el) ? el : el[0];
  };

  proto.duScrollTo = function(left, top, duration, easing) {
    var aliasFn;
    if(angular.isElement(left)) {
      aliasFn = this.duScrollToElement;
    } else if(angular.isDefined(duration)) {
      aliasFn = this.duScrollToAnimated;
    }
    if(aliasFn) {
      return aliasFn.apply(this, arguments);
    }
    var el = unwrap(this);
    if(isDocument(el)) {
      return $window.scrollTo(left, top);
    }
    el.scrollLeft = left;
    el.scrollTop = top;
  };

  var scrollAnimation, deferred;
  proto.duScrollToAnimated = function(left, top, duration, easing) {
    if(duration && !easing) {
      easing = duScrollEasing;
    }
    var startLeft = this.duScrollLeft(),
        startTop = this.duScrollTop(),
        deltaLeft = Math.round(left - startLeft),
        deltaTop = Math.round(top - startTop);

    var startTime = null, progress = 0;
    var el = this;

    var cancelScrollAnimation = function($event) {
      if (!$event || (progress && $event.which > 0)) {
        if(duScrollCancelOnEvents) {
          el.unbind(duScrollCancelOnEvents, cancelScrollAnimation);
        }
        cancelAnimation(scrollAnimation);
        deferred.reject();
        scrollAnimation = null;
      }
    };

    if(scrollAnimation) {
      cancelScrollAnimation();
    }
    deferred = $q.defer();

    if(duration === 0 || (!deltaLeft && !deltaTop)) {
      if(duration === 0) {
        el.duScrollTo(left, top);
      }
      deferred.resolve();
      return deferred.promise;
    }

    var animationStep = function(timestamp) {
      if (startTime === null) {
        startTime = timestamp;
      }

      progress = timestamp - startTime;
      var percent = (progress >= duration ? 1 : easing(progress/duration));

      el.scrollTo(
        startLeft + Math.ceil(deltaLeft * percent),
        startTop + Math.ceil(deltaTop * percent)
      );
      if(percent < 1) {
        scrollAnimation = requestAnimation(animationStep);
      } else {
        if(duScrollCancelOnEvents) {
          el.unbind(duScrollCancelOnEvents, cancelScrollAnimation);
        }
        scrollAnimation = null;
        deferred.resolve();
      }
    };

    //Fix random mobile safari bug when scrolling to top by hitting status bar
    el.duScrollTo(startLeft, startTop);

    if(duScrollCancelOnEvents) {
      el.bind(duScrollCancelOnEvents, cancelScrollAnimation);
    }

    scrollAnimation = requestAnimation(animationStep);
    return deferred.promise;
  };

  proto.duScrollToElement = function(target, offset, duration, easing) {
    var el = unwrap(this);
    if(!angular.isNumber(offset) || isNaN(offset)) {
      offset = duScrollOffset;
    }
    var top = this.duScrollTop() + unwrap(target).getBoundingClientRect().top - offset;
    if(isElement(el)) {
      top -= el.getBoundingClientRect().top;
    }
    return this.duScrollTo(0, top, duration, easing);
  };

  proto.duScrollLeft = function(value, duration, easing) {
    if(angular.isNumber(value)) {
      return this.duScrollTo(value, this.duScrollTop(), duration, easing);
    }
    var el = unwrap(this);
    if(isDocument(el)) {
      return $window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft;
    }
    return el.scrollLeft;
  };
  proto.duScrollTop = function(value, duration, easing) {
    if(angular.isNumber(value)) {
      return this.duScrollTo(this.duScrollLeft(), value, duration, easing);
    }
    var el = unwrap(this);
    if(isDocument(el)) {
      return $window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    }
    return el.scrollTop;
  };

  proto.duScrollToElementAnimated = function(target, offset, duration, easing) {
    return this.duScrollToElement(target, offset, duration || duScrollDuration, easing);
  };

  proto.duScrollTopAnimated = function(top, duration, easing) {
    return this.duScrollTop(top, duration || duScrollDuration, easing);
  };

  proto.duScrollLeftAnimated = function(left, duration, easing) {
    return this.duScrollLeft(left, duration || duScrollDuration, easing);
  };

  angular.forEach(proto, function(fn, key) {
    angular.element.prototype[key] = fn;

    //Remove prefix if not already claimed by jQuery / ui.utils
    var unprefixed = key.replace(/^duScroll/, 'scroll');
    if(angular.isUndefined(angular.element.prototype[unprefixed])) {
      angular.element.prototype[unprefixed] = fn;
    }
  });

}]);


//Adapted from https://gist.github.com/paulirish/1579671
angular.module('duScroll.polyfill', [])
.factory('polyfill', ["$window", function($window) {
  'use strict';

  var vendors = ['webkit', 'moz', 'o', 'ms'];

  return function(fnName, fallback) {
    if($window[fnName]) {
      return $window[fnName];
    }
    var suffix = fnName.substr(0, 1).toUpperCase() + fnName.substr(1);
    for(var key, i = 0; i < vendors.length; i++) {
      key = vendors[i]+suffix;
      if($window[key]) {
        return $window[key];
      }
    }
    return fallback;
  };
}]);

angular.module('duScroll.requestAnimation', ['duScroll.polyfill'])
.factory('requestAnimation', ["polyfill", "$timeout", function(polyfill, $timeout) {
  'use strict';

  var lastTime = 0;
  var fallback = function(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = $timeout(function() { callback(currTime + timeToCall); },
      timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

  return polyfill('requestAnimationFrame', fallback);
}])
.factory('cancelAnimation', ["polyfill", "$timeout", function(polyfill, $timeout) {
  'use strict';

  var fallback = function(promise) {
    $timeout.cancel(promise);
  };

  return polyfill('cancelAnimationFrame', fallback);
}]);


angular.module('duScroll.spyAPI', ['duScroll.scrollContainerAPI'])
.factory('spyAPI', ["$rootScope", "$timeout", "$window", "$document", "scrollContainerAPI", "duScrollGreedy", "duScrollSpyWait", "duScrollBottomSpy", "duScrollActiveClass", function($rootScope, $timeout, $window, $document, scrollContainerAPI, duScrollGreedy, duScrollSpyWait, duScrollBottomSpy, duScrollActiveClass) {
  'use strict';

  var createScrollHandler = function(context) {
    var timer = false, queued = false;
    var handler = function() {
      queued = false;
      var container = context.container,
          containerEl = container[0],
          containerOffset = 0,
          bottomReached;

      if (typeof HTMLElement !== 'undefined' && containerEl instanceof HTMLElement || containerEl.nodeType && containerEl.nodeType === containerEl.ELEMENT_NODE) {
        containerOffset = containerEl.getBoundingClientRect().top;
        bottomReached = Math.round(containerEl.scrollTop + containerEl.clientHeight) >= containerEl.scrollHeight;
      } else {
        var documentScrollHeight = $document[0].body.scrollHeight || $document[0].documentElement.scrollHeight; // documentElement for IE11
        bottomReached = Math.round($window.pageYOffset + $window.innerHeight) >= documentScrollHeight;
      }
      var compareProperty = (duScrollBottomSpy && bottomReached ? 'bottom' : 'top');

      var i, currentlyActive, toBeActive, spies, spy, pos;
      spies = context.spies;
      currentlyActive = context.currentlyActive;
      toBeActive = undefined;

      for(i = 0; i < spies.length; i++) {
        spy = spies[i];
        pos = spy.getTargetPosition();
        if (!pos) continue;

        if((duScrollBottomSpy && bottomReached) || (pos.top + spy.offset - containerOffset < 20 && (duScrollGreedy || pos.top*-1 + containerOffset) < pos.height)) {
          //Find the one closest the viewport top or the page bottom if it's reached
          if(!toBeActive || toBeActive[compareProperty] < pos[compareProperty]) {
            toBeActive = {
              spy: spy
            };
            toBeActive[compareProperty] = pos[compareProperty];
          }
        }
      }

      if(toBeActive) {
        toBeActive = toBeActive.spy;
      }
      if(currentlyActive === toBeActive || (duScrollGreedy && !toBeActive)) return;
      if(currentlyActive) {
        currentlyActive.$element.removeClass(duScrollActiveClass);
        $rootScope.$broadcast(
          'duScrollspy:becameInactive',
          currentlyActive.$element,
          angular.element(currentlyActive.getTargetElement())
        );
      }
      if(toBeActive) {
        toBeActive.$element.addClass(duScrollActiveClass);
        $rootScope.$broadcast(
          'duScrollspy:becameActive',
          toBeActive.$element,
          angular.element(toBeActive.getTargetElement())
        );
      }
      context.currentlyActive = toBeActive;
    };

    if(!duScrollSpyWait) {
      return handler;
    }

    //Debounce for potential performance savings
    return function() {
      if(!timer) {
        handler();
        timer = $timeout(function() {
          timer = false;
          if(queued) {
            handler();
          }
        }, duScrollSpyWait, false);
      } else {
        queued = true;
      }
    };
  };

  var contexts = {};

  var createContext = function($scope) {
    var id = $scope.$id;
    var context = {
      spies: []
    };

    context.handler = createScrollHandler(context);
    contexts[id] = context;

    $scope.$on('$destroy', function() {
      destroyContext($scope);
    });

    return id;
  };

  var destroyContext = function($scope) {
    var id = $scope.$id;
    var context = contexts[id], container = context.container;
    if(container) {
      container.off('scroll', context.handler);
    }
    delete contexts[id];
  };

  var defaultContextId = createContext($rootScope);

  var getContextForScope = function(scope) {
    if(contexts[scope.$id]) {
      return contexts[scope.$id];
    }
    if(scope.$parent) {
      return getContextForScope(scope.$parent);
    }
    return contexts[defaultContextId];
  };

  var getContextForSpy = function(spy) {
    var context, contextId, scope = spy.$scope;
    if(scope) {
      return getContextForScope(scope);
    }
    //No scope, most likely destroyed
    for(contextId in contexts) {
      context = contexts[contextId];
      if(context.spies.indexOf(spy) !== -1) {
        return context;
      }
    }
  };

  var isElementInDocument = function(element) {
    while (element.parentNode) {
      element = element.parentNode;
      if (element === document) {
        return true;
      }
    }
    return false;
  };

  var addSpy = function(spy) {
    var context = getContextForSpy(spy);
    if (!context) return;
    context.spies.push(spy);
    if (!context.container || !isElementInDocument(context.container)) {
      if(context.container) {
        context.container.off('scroll', context.handler);
      }
      context.container = scrollContainerAPI.getContainer(spy.$scope);
      context.container.on('scroll', context.handler).triggerHandler('scroll');
    }
  };

  var removeSpy = function(spy) {
    var context = getContextForSpy(spy);
    if(spy === context.currentlyActive) {
      $rootScope.$broadcast('duScrollspy:becameInactive', context.currentlyActive.$element);
      context.currentlyActive = null;
    }
    var i = context.spies.indexOf(spy);
    if(i !== -1) {
      context.spies.splice(i, 1);
    }
		spy.$element = null;
  };

  return {
    addSpy: addSpy,
    removeSpy: removeSpy,
    createContext: createContext,
    destroyContext: destroyContext,
    getContextForScope: getContextForScope
  };
}]);


angular.module('duScroll.scrollContainerAPI', [])
.factory('scrollContainerAPI', ["$document", function($document) {
  'use strict';

  var containers = {};

  var setContainer = function(scope, element) {
    var id = scope.$id;
    containers[id] = element;
    return id;
  };

  var getContainerId = function(scope) {
    if(containers[scope.$id]) {
      return scope.$id;
    }
    if(scope.$parent) {
      return getContainerId(scope.$parent);
    }
    return;
  };

  var getContainer = function(scope) {
    var id = getContainerId(scope);
    return id ? containers[id] : $document;
  };

  var removeContainer = function(scope) {
    var id = getContainerId(scope);
    if(id) {
      delete containers[id];
    }
  };

  return {
    getContainerId:   getContainerId,
    getContainer:     getContainer,
    setContainer:     setContainer,
    removeContainer:  removeContainer
  };
}]);


angular.module('duScroll.smoothScroll', ['duScroll.scrollHelpers', 'duScroll.scrollContainerAPI'])
.directive('duSmoothScroll', ["duScrollDuration", "duScrollOffset", "scrollContainerAPI", function(duScrollDuration, duScrollOffset, scrollContainerAPI) {
  'use strict';

  return {
    link : function($scope, $element, $attr) {
      $element.on('click', function(e) {
        if((!$attr.href || $attr.href.indexOf('#') === -1) && $attr.duSmoothScroll === '') return;

        var id = $attr.href ? $attr.href.replace(/.*(?=#[^\s]+$)/, '').substring(1) : $attr.duSmoothScroll;

        var target = document.getElementById(id) || document.getElementsByName(id)[0];
        if(!target || !target.getBoundingClientRect) return;

        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();

        var offset    = $attr.offset ? parseInt($attr.offset, 10) : duScrollOffset;
        var duration  = $attr.duration ? parseInt($attr.duration, 10) : duScrollDuration;
        var container = scrollContainerAPI.getContainer($scope);

        container.duScrollToElement(
          angular.element(target),
          isNaN(offset) ? 0 : offset,
          isNaN(duration) ? 0 : duration
        );
      });
    }
  };
}]);


angular.module('duScroll.spyContext', ['duScroll.spyAPI'])
.directive('duSpyContext', ["spyAPI", function(spyAPI) {
  'use strict';

  return {
    restrict: 'A',
    scope: true,
    compile: function compile(tElement, tAttrs, transclude) {
      return {
        pre: function preLink($scope, iElement, iAttrs, controller) {
          spyAPI.createContext($scope);
        }
      };
    }
  };
}]);


angular.module('duScroll.scrollContainer', ['duScroll.scrollContainerAPI'])
.directive('duScrollContainer', ["scrollContainerAPI", function(scrollContainerAPI){
  'use strict';

  return {
    restrict: 'A',
    scope: true,
    compile: function compile(tElement, tAttrs, transclude) {
      return {
        pre: function preLink($scope, iElement, iAttrs, controller) {
          iAttrs.$observe('duScrollContainer', function(element) {
            if(angular.isString(element)) {
              element = document.getElementById(element);
            }

            element = (angular.isElement(element) ? angular.element(element) : iElement);
            scrollContainerAPI.setContainer($scope, element);
            $scope.$on('$destroy', function() {
              scrollContainerAPI.removeContainer($scope);
            });
          });
        }
      };
    }
  };
}]);


angular.module('duScroll.scrollspy', ['duScroll.spyAPI'])
.directive('duScrollspy', ["spyAPI", "duScrollOffset", "$timeout", "$rootScope", function(spyAPI, duScrollOffset, $timeout, $rootScope) {
  'use strict';

  var Spy = function(targetElementOrId, $scope, $element, offset) {
    if(angular.isElement(targetElementOrId)) {
      this.target = targetElementOrId;
    } else if(angular.isString(targetElementOrId)) {
      this.targetId = targetElementOrId;
    }
    this.$scope = $scope;
    this.$element = $element;
    this.offset = offset;
  };

  Spy.prototype.getTargetElement = function() {
    if (!this.target && this.targetId) {
      this.target = document.getElementById(this.targetId) || document.getElementsByName(this.targetId)[0];
    }
    return this.target;
  };

  Spy.prototype.getTargetPosition = function() {
    var target = this.getTargetElement();
    if(target) {
      return target.getBoundingClientRect();
    }
  };

  Spy.prototype.flushTargetCache = function() {
    if(this.targetId) {
      this.target = undefined;
    }
  };

  return {
    link: function ($scope, $element, $attr) {
      var href = $attr.ngHref || $attr.href;
      var targetId;

      if (href && href.indexOf('#') !== -1) {
        targetId = href.replace(/.*(?=#[^\s]+$)/, '').substring(1);
      } else if($attr.duScrollspy) {
        targetId = $attr.duScrollspy;
      } else if($attr.duSmoothScroll) {
        targetId = $attr.duSmoothScroll;
      }
      if(!targetId) return;

      // Run this in the next execution loop so that the scroll context has a chance
      // to initialize
      var timeoutPromise = $timeout(function() {
        var spy = new Spy(targetId, $scope, $element, -($attr.offset ? parseInt($attr.offset, 10) : duScrollOffset));
        spyAPI.addSpy(spy);

        $scope.$on('$locationChangeSuccess', spy.flushTargetCache.bind(spy));
        var deregisterOnStateChange = $rootScope.$on('$stateChangeSuccess', spy.flushTargetCache.bind(spy));
        $scope.$on('$destroy', function() {
          spyAPI.removeSpy(spy);
          deregisterOnStateChange();
        });
      }, 0, false);
      $scope.$on('$destroy', function() {$timeout.cancel(timeoutPromise);});
    }
  };
}]);

/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.12.1 - 2016-06-10
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.transition","ui.bootstrap.collapse","ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.bindHtml","ui.bootstrap.buttons","ui.bootstrap.dateparser","ui.bootstrap.position","ui.bootstrap.datepicker","ui.bootstrap.pagination","ui.bootstrap.tooltip","ui.bootstrap.popover","ui.bootstrap.timepicker"]);
angular.module("ui.bootstrap.tpls", ["template/accordion/accordion-group.html","template/accordion/accordion.html","template/alert/alert.html","template/datepicker/datepicker.html","template/datepicker/day.html","template/datepicker/month.html","template/datepicker/popup.html","template/datepicker/year.html","template/pagination/pager.html","template/pagination/pagination.html","template/tooltip/tooltip-html-unsafe-popup.html","template/tooltip/tooltip-popup.html","template/popover/popover.html","template/timepicker/timepicker.html"]);
angular.module('ui.bootstrap.transition', [])

/**
 * $transition service provides a consistent interface to trigger CSS 3 transitions and to be informed when they complete.
 * @param  {DOMElement} element  The DOMElement that will be animated.
 * @param  {string|object|function} trigger  The thing that will cause the transition to start:
 *   - As a string, it represents the css class to be added to the element.
 *   - As an object, it represents a hash of style attributes to be applied to the element.
 *   - As a function, it represents a function to be called that will cause the transition to occur.
 * @return {Promise}  A promise that is resolved when the transition finishes.
 */
.factory('$transition', ['$q', '$timeout', '$rootScope', function($q, $timeout, $rootScope) {

  var $transition = function(element, trigger, options) {
    options = options || {};
    var deferred = $q.defer();
    var endEventName = $transition[options.animation ? 'animationEndEventName' : 'transitionEndEventName'];

    var transitionEndHandler = function(event) {
      $rootScope.$apply(function() {
        element.unbind(endEventName, transitionEndHandler);
        deferred.resolve(element);
      });
    };

    if (endEventName) {
      element.bind(endEventName, transitionEndHandler);
    }

    // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
    $timeout(function() {
      if ( angular.isString(trigger) ) {
        element.addClass(trigger);
      } else if ( angular.isFunction(trigger) ) {
        trigger(element);
      } else if ( angular.isObject(trigger) ) {
        element.css(trigger);
      }
      //If browser does not support transitions, instantly resolve
      if ( !endEventName ) {
        deferred.resolve(element);
      }
    });

    // Add our custom cancel function to the promise that is returned
    // We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
    // i.e. it will therefore never raise a transitionEnd event for that transition
    deferred.promise.cancel = function() {
      if ( endEventName ) {
        element.unbind(endEventName, transitionEndHandler);
      }
      deferred.reject('Transition cancelled');
    };

    return deferred.promise;
  };

  // Work out the name of the transitionEnd event
  var transElement = document.createElement('trans');
  var transitionEndEventNames = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'transition': 'transitionend'
  };
  var animationEndEventNames = {
    'WebkitTransition': 'webkitAnimationEnd',
    'MozTransition': 'animationend',
    'OTransition': 'oAnimationEnd',
    'transition': 'animationend'
  };
  function findEndEventName(endEventNames) {
    for (var name in endEventNames){
      if (transElement.style[name] !== undefined) {
        return endEventNames[name];
      }
    }
  }
  $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
  $transition.animationEndEventName = findEndEventName(animationEndEventNames);
  return $transition;
}]);

angular.module('ui.bootstrap.collapse', ['ui.bootstrap.transition'])

  .directive('collapse', ['$transition', function ($transition) {

    return {
      link: function (scope, element, attrs) {

        var initialAnimSkip = true;
        var currentTransition;

        function doTransition(change) {
          var newTransition = $transition(element, change);
          if (currentTransition) {
            currentTransition.cancel();
          }
          currentTransition = newTransition;
          newTransition.then(newTransitionDone, newTransitionDone);
          return newTransition;

          function newTransitionDone() {
            // Make sure it's this transition, otherwise, leave it alone.
            if (currentTransition === newTransition) {
              currentTransition = undefined;
            }
          }
        }

        function expand() {
          if (initialAnimSkip) {
            initialAnimSkip = false;
            expandDone();
          } else {
            element.removeClass('collapse').addClass('collapsing');
            doTransition({ height: element[0].scrollHeight + 'px' }).then(expandDone);
          }
        }

        function expandDone() {
          element.removeClass('collapsing');
          element.addClass('collapse in');
          element.css({height: 'auto'});
        }

        function collapse() {
          if (initialAnimSkip) {
            initialAnimSkip = false;
            collapseDone();
            element.css({height: 0});
          } else {
            // CSS transitions don't work with height: auto, so we have to manually change the height to a specific value
            element.css({ height: element[0].scrollHeight + 'px' });
            //trigger reflow so a browser realizes that height was updated from auto to a specific value
            var x = element[0].offsetWidth;

            element.removeClass('collapse in').addClass('collapsing');

            doTransition({ height: 0 }).then(collapseDone);
          }
        }

        function collapseDone() {
          element.removeClass('collapsing');
          element.addClass('collapse');
        }

        scope.$watch(attrs.collapse, function (shouldCollapse) {
          if (shouldCollapse) {
            collapse();
          } else {
            expand();
          }
        });
      }
    };
  }]);

angular.module('ui.bootstrap.accordion', ['ui.bootstrap.collapse'])

.constant('accordionConfig', {
  closeOthers: true
})

.controller('AccordionController', ['$scope', '$attrs', 'accordionConfig', function ($scope, $attrs, accordionConfig) {

  // This array keeps track of the accordion groups
  this.groups = [];

  // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
  this.closeOthers = function(openGroup) {
    var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
    if ( closeOthers ) {
      angular.forEach(this.groups, function (group) {
        if ( group !== openGroup ) {
          group.isOpen = false;
        }
      });
    }
  };

  // This is called from the accordion-group directive to add itself to the accordion
  this.addGroup = function(groupScope) {
    var that = this;
    this.groups.push(groupScope);

    groupScope.$on('$destroy', function (event) {
      that.removeGroup(groupScope);
    });
  };

  // This is called from the accordion-group directive when to remove itself
  this.removeGroup = function(group) {
    var index = this.groups.indexOf(group);
    if ( index !== -1 ) {
      this.groups.splice(index, 1);
    }
  };

}])

// The accordion directive simply sets up the directive controller
// and adds an accordion CSS class to itself element.
.directive('accordion', function () {
  return {
    restrict:'EA',
    controller:'AccordionController',
    transclude: true,
    replace: false,
    templateUrl: 'template/accordion/accordion.html'
  };
})

// The accordion-group directive indicates a block of html that will expand and collapse in an accordion
.directive('accordionGroup', function() {
  return {
    require:'^accordion',         // We need this directive to be inside an accordion
    restrict:'EA',
    transclude:true,              // It transcludes the contents of the directive into the template
    replace: true,                // The element containing the directive will be replaced with the template
    templateUrl:'template/accordion/accordion-group.html',
    scope: {
      heading: '@',               // Interpolate the heading attribute onto this scope
      isOpen: '=?',
      isDisabled: '=?'
    },
    controller: function() {
      this.setHeading = function(element) {
        this.heading = element;
      };
    },
    link: function(scope, element, attrs, accordionCtrl) {
      accordionCtrl.addGroup(scope);

      scope.$watch('isOpen', function(value) {
        if ( value ) {
          accordionCtrl.closeOthers(scope);
        }
      });

      scope.toggleOpen = function() {
        if ( !scope.isDisabled ) {
          scope.isOpen = !scope.isOpen;
        }
      };
    }
  };
})

// Use accordion-heading below an accordion-group to provide a heading containing HTML
// <accordion-group>
//   <accordion-heading>Heading containing HTML - <img src="..."></accordion-heading>
// </accordion-group>
.directive('accordionHeading', function() {
  return {
    restrict: 'EA',
    transclude: true,   // Grab the contents to be used as the heading
    template: '',       // In effect remove this element!
    replace: true,
    require: '^accordionGroup',
    link: function(scope, element, attr, accordionGroupCtrl, transclude) {
      // Pass the heading to the accordion-group controller
      // so that it can be transcluded into the right place in the template
      // [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
      accordionGroupCtrl.setHeading(transclude(scope, function() {}));
    }
  };
})

// Use in the accordion-group template to indicate where you want the heading to be transcluded
// You must provide the property on the accordion-group controller that will hold the transcluded element
// <div class="accordion-group">
//   <div class="accordion-heading" ><a ... accordion-transclude="heading">...</a></div>
//   ...
// </div>
.directive('accordionTransclude', function() {
  return {
    require: '^accordionGroup',
    link: function(scope, element, attr, controller) {
      scope.$watch(function() { return controller[attr.accordionTransclude]; }, function(heading) {
        if ( heading ) {
          element.html('');
          element.append(heading);
        }
      });
    }
  };
});

angular.module('ui.bootstrap.alert', [])

.controller('AlertController', ['$scope', '$attrs', function ($scope, $attrs) {
  $scope.closeable = 'close' in $attrs;
  this.close = $scope.close;
}])

.directive('alert', function () {
  return {
    restrict:'EA',
    controller:'AlertController',
    templateUrl:'template/alert/alert.html',
    transclude:true,
    replace:true,
    scope: {
      type: '@',
      close: '&'
    }
  };
})

.directive('dismissOnTimeout', ['$timeout', function($timeout) {
  return {
    require: 'alert',
    link: function(scope, element, attrs, alertCtrl) {
      $timeout(function(){
        alertCtrl.close();
      }, parseInt(attrs.dismissOnTimeout, 10));
    }
  };
}]);

angular.module('ui.bootstrap.bindHtml', [])

  .directive('bindHtmlUnsafe', function () {
    return function (scope, element, attr) {
      element.addClass('ng-binding').data('$binding', attr.bindHtmlUnsafe);
      scope.$watch(attr.bindHtmlUnsafe, function bindHtmlUnsafeWatchAction(value) {
        element.html(value || '');
      });
    };
  });
angular.module('ui.bootstrap.buttons', [])

.constant('buttonConfig', {
  activeClass: 'active',
  toggleEvent: 'click'
})

.controller('ButtonsController', ['buttonConfig', function(buttonConfig) {
  this.activeClass = buttonConfig.activeClass || 'active';
  this.toggleEvent = buttonConfig.toggleEvent || 'click';
}])

.directive('btnRadio', function () {
  return {
    require: ['btnRadio', 'ngModel'],
    controller: 'ButtonsController',
    link: function (scope, element, attrs, ctrls) {
      var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      //model -> UI
      ngModelCtrl.$render = function () {
        element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.btnRadio)));
      };

      //ui->model
      element.bind(buttonsCtrl.toggleEvent, function () {
        var isActive = element.hasClass(buttonsCtrl.activeClass);

        if (!isActive || angular.isDefined(attrs.uncheckable)) {
          scope.$apply(function () {
            ngModelCtrl.$setViewValue(isActive ? null : scope.$eval(attrs.btnRadio));
            ngModelCtrl.$render();
          });
        }
      });
    }
  };
})

.directive('btnCheckbox', function () {
  return {
    require: ['btnCheckbox', 'ngModel'],
    controller: 'ButtonsController',
    link: function (scope, element, attrs, ctrls) {
      var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      function getTrueValue() {
        return getCheckboxValue(attrs.btnCheckboxTrue, true);
      }

      function getFalseValue() {
        return getCheckboxValue(attrs.btnCheckboxFalse, false);
      }

      function getCheckboxValue(attributeValue, defaultValue) {
        var val = scope.$eval(attributeValue);
        return angular.isDefined(val) ? val : defaultValue;
      }

      //model -> UI
      ngModelCtrl.$render = function () {
        element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, getTrueValue()));
      };

      //ui->model
      element.bind(buttonsCtrl.toggleEvent, function () {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(element.hasClass(buttonsCtrl.activeClass) ? getFalseValue() : getTrueValue());
          ngModelCtrl.$render();
        });
      });
    }
  };
});

angular.module('ui.bootstrap.dateparser', [])

.service('dateParser', ['$locale', 'orderByFilter', function($locale, orderByFilter) {

  this.parsers = {};

  var formatCodeToRegex = {
    'yyyy': {
      regex: '\\d{4}',
      apply: function(value) { this.year = +value; }
    },
    'yy': {
      regex: '\\d{2}',
      apply: function(value) { this.year = +value + 2000; }
    },
    'y': {
      regex: '\\d{1,4}',
      apply: function(value) { this.year = +value; }
    },
    'MMMM': {
      regex: $locale.DATETIME_FORMATS.MONTH.join('|'),
      apply: function(value) { this.month = $locale.DATETIME_FORMATS.MONTH.indexOf(value); }
    },
    'MMM': {
      regex: $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
      apply: function(value) { this.month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value); }
    },
    'MM': {
      regex: '0[1-9]|1[0-2]',
      apply: function(value) { this.month = value - 1; }
    },
    'M': {
      regex: '[1-9]|1[0-2]',
      apply: function(value) { this.month = value - 1; }
    },
    'dd': {
      regex: '[0-2][0-9]{1}|3[0-1]{1}',
      apply: function(value) { this.date = +value; }
    },
    'd': {
      regex: '[1-2]?[0-9]{1}|3[0-1]{1}',
      apply: function(value) { this.date = +value; }
    },
    'EEEE': {
      regex: $locale.DATETIME_FORMATS.DAY.join('|')
    },
    'EEE': {
      regex: $locale.DATETIME_FORMATS.SHORTDAY.join('|')
    }
  };

  function createParser(format) {
    var map = [], regex = format.split('');

    angular.forEach(formatCodeToRegex, function(data, code) {
      var index = format.indexOf(code);

      if (index > -1) {
        format = format.split('');

        regex[index] = '(' + data.regex + ')';
        format[index] = '$'; // Custom symbol to define consumed part of format
        for (var i = index + 1, n = index + code.length; i < n; i++) {
          regex[i] = '';
          format[i] = '$';
        }
        format = format.join('');

        map.push({ index: index, apply: data.apply });
      }
    });

    return {
      regex: new RegExp('^' + regex.join('') + '$'),
      map: orderByFilter(map, 'index')
    };
  }

  this.parse = function(input, format) {
    if ( !angular.isString(input) || !format ) {
      return input;
    }

    format = $locale.DATETIME_FORMATS[format] || format;

    if ( !this.parsers[format] ) {
      this.parsers[format] = createParser(format);
    }

    var parser = this.parsers[format],
        regex = parser.regex,
        map = parser.map,
        results = input.match(regex);

    if ( results && results.length ) {
      var fields = { year: 1900, month: 0, date: 1, hours: 0 }, dt;

      for( var i = 1, n = results.length; i < n; i++ ) {
        var mapper = map[i-1];
        if ( mapper.apply ) {
          mapper.apply.call(fields, results[i]);
        }
      }

      if ( isValid(fields.year, fields.month, fields.date) ) {
        dt = new Date( fields.year, fields.month, fields.date, fields.hours);
      }

      return dt;
    }
  };

  // Check if date is valid for specific month (and year for February).
  // Month: 0 = Jan, 1 = Feb, etc
  function isValid(year, month, date) {
    if ( month === 1 && date > 28) {
        return date === 29 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
    }

    if ( month === 3 || month === 5 || month === 8 || month === 10) {
        return date < 31;
    }

    return true;
  }
}]);

angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
  .factory('$position', ['$document', '$window', function ($document, $window) {

    function getStyle(el, cssprop) {
      if (el.currentStyle) { //IE
        return el.currentStyle[cssprop];
      } else if ($window.getComputedStyle) {
        return $window.getComputedStyle(el)[cssprop];
      }
      // finally try and get inline style
      return el.style[cssprop];
    }

    /**
     * Checks if a given element is statically positioned
     * @param element - raw DOM element
     */
    function isStaticPositioned(element) {
      return (getStyle(element, 'position') || 'static' ) === 'static';
    }

    /**
     * returns the closest, non-statically positioned parentOffset of a given element
     * @param element
     */
    var parentOffsetEl = function (element) {
      var docDomEl = $document[0];
      var offsetParent = element.offsetParent || docDomEl;
      while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docDomEl;
    };

    return {
      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/
       */
      position: function (element) {
        var elBCR = this.offset(element);
        var offsetParentBCR = { top: 0, left: 0 };
        var offsetParentEl = parentOffsetEl(element[0]);
        if (offsetParentEl != $document[0]) {
          offsetParentBCR = this.offset(angular.element(offsetParentEl));
          offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
          offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }

        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: elBCR.top - offsetParentBCR.top,
          left: elBCR.left - offsetParentBCR.left
        };
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/
       */
      offset: function (element) {
        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
          left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
        };
      },

      /**
       * Provides coordinates for the targetEl in relation to hostEl
       */
      positionElements: function (hostEl, targetEl, positionStr, appendToBody) {

        var positionStrParts = positionStr.split('-');
        var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

        var hostElPos,
          targetElWidth,
          targetElHeight,
          targetElPos;

        hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

        targetElWidth = targetEl.prop('offsetWidth');
        targetElHeight = targetEl.prop('offsetHeight');

        var shiftWidth = {
          center: function () {
            return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
          },
          left: function () {
            return hostElPos.left;
          },
          right: function () {
            return hostElPos.left + hostElPos.width;
          }
        };

        var shiftHeight = {
          center: function () {
            return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
          },
          top: function () {
            return hostElPos.top;
          },
          bottom: function () {
            return hostElPos.top + hostElPos.height;
          }
        };

        switch (pos0) {
          case 'right':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: shiftWidth[pos0]()
            };
            break;
          case 'left':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: hostElPos.left - targetElWidth
            };
            break;
          case 'bottom':
            targetElPos = {
              top: shiftHeight[pos0](),
              left: shiftWidth[pos1]()
            };
            break;
          default:
            targetElPos = {
              top: hostElPos.top - targetElHeight,
              left: shiftWidth[pos1]()
            };
            break;
        }

        return targetElPos;
      }
    };
  }]);

angular.module('ui.bootstrap.datepicker', ['ui.bootstrap.dateparser', 'ui.bootstrap.position'])

.constant('datepickerConfig', {
  formatDay: 'dd',
  formatMonth: 'MMMM',
  formatYear: 'yyyy',
  formatDayHeader: 'EEE',
  formatDayTitle: 'MMMM yyyy',
  formatMonthTitle: 'yyyy',
  datepickerMode: 'day',
  minMode: 'day',
  maxMode: 'year',
  showWeeks: true,
  startingDay: 0,
  yearRange: 20,
  minDate: null,
  maxDate: null
})

.controller('DatepickerController', ['$scope', '$attrs', '$parse', '$interpolate', '$timeout', '$log', 'dateFilter', 'datepickerConfig', function($scope, $attrs, $parse, $interpolate, $timeout, $log, dateFilter, datepickerConfig) {
  var self = this,
      ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl;

  // Modes chain
  this.modes = ['day', 'month', 'year'];

  // Configuration attributes
  angular.forEach(['formatDay', 'formatMonth', 'formatYear', 'formatDayHeader', 'formatDayTitle', 'formatMonthTitle',
                   'minMode', 'maxMode', 'showWeeks', 'startingDay', 'yearRange'], function( key, index ) {
    self[key] = angular.isDefined($attrs[key]) ? (index < 8 ? $interpolate($attrs[key])($scope.$parent) : $scope.$parent.$eval($attrs[key])) : datepickerConfig[key];
  });

  // Watchable date attributes
  angular.forEach(['minDate', 'maxDate'], function( key ) {
    if ( $attrs[key] ) {
      $scope.$parent.$watch($parse($attrs[key]), function(value) {
        self[key] = value ? new Date(value) : null;
        self.refreshView();
      });
    } else {
      self[key] = datepickerConfig[key] ? new Date(datepickerConfig[key]) : null;
    }
  });

  $scope.datepickerMode = $scope.datepickerMode || datepickerConfig.datepickerMode;
  $scope.uniqueId = 'datepicker-' + $scope.$id + '-' + Math.floor(Math.random() * 10000);
  this.activeDate = angular.isDefined($attrs.initDate) ? $scope.$parent.$eval($attrs.initDate) : new Date();

  $scope.isActive = function(dateObject) {
    if (self.compare(dateObject.date, self.activeDate) === 0) {
      $scope.activeDateId = dateObject.uid;
      return true;
    }
    return false;
  };

  this.init = function( ngModelCtrl_ ) {
    ngModelCtrl = ngModelCtrl_;

    ngModelCtrl.$render = function() {
      self.render();
    };
  };

  this.render = function() {
    if ( ngModelCtrl.$modelValue ) {
      var date = new Date( ngModelCtrl.$modelValue ),
          isValid = !isNaN(date);

      if ( isValid ) {
        this.activeDate = date;
      } else {
        $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
      }
      ngModelCtrl.$setValidity('date', isValid);
    }
    this.refreshView();
  };

  this.refreshView = function() {
    if ( this.element ) {
      this._refreshView();

      var date = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null;
      ngModelCtrl.$setValidity('date-disabled', !date || (this.element && !this.isDisabled(date)));
    }
  };

  this.createDateObject = function(date, format) {
    var model = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null;
    return {
      date: date,
      label: dateFilter(date, format),
      selected: model && this.compare(date, model) === 0,
      disabled: this.isDisabled(date),
      current: this.compare(date, new Date()) === 0
    };
  };

  this.isDisabled = function( date ) {
    return ((this.minDate && this.compare(date, this.minDate) < 0) || (this.maxDate && this.compare(date, this.maxDate) > 0) || ($attrs.dateDisabled && $scope.dateDisabled({date: date, mode: $scope.datepickerMode})));
  };

  // Split array into smaller arrays
  this.split = function(arr, size) {
    var arrays = [];
    while (arr.length > 0) {
      arrays.push(arr.splice(0, size));
    }
    return arrays;
  };

  $scope.select = function( date ) {
    if ( $scope.datepickerMode === self.minMode ) {
      var dt = ngModelCtrl.$modelValue ? new Date( ngModelCtrl.$modelValue ) : new Date(0, 0, 0, 0, 0, 0, 0);
      dt.setFullYear( date.getFullYear(), date.getMonth(), date.getDate() );
      ngModelCtrl.$setViewValue( dt );
      ngModelCtrl.$render();
    } else {
      self.activeDate = date;
      $scope.datepickerMode = self.modes[ self.modes.indexOf( $scope.datepickerMode ) - 1 ];
    }
  };

  $scope.move = function( direction ) {
    var year = self.activeDate.getFullYear() + direction * (self.step.years || 0),
        month = self.activeDate.getMonth() + direction * (self.step.months || 0);
    self.activeDate.setFullYear(year, month, 1);
    self.refreshView();
  };

  $scope.toggleMode = function( direction ) {
    direction = direction || 1;

    if (($scope.datepickerMode === self.maxMode && direction === 1) || ($scope.datepickerMode === self.minMode && direction === -1)) {
      return;
    }

    $scope.datepickerMode = self.modes[ self.modes.indexOf( $scope.datepickerMode ) + direction ];
  };

  // Key event mapper
  $scope.keys = { 13:'enter', 32:'space', 33:'pageup', 34:'pagedown', 35:'end', 36:'home', 37:'left', 38:'up', 39:'right', 40:'down' };

  var focusElement = function() {
    $timeout(function() {
      self.element[0].focus();
    }, 0 , false);
  };

  // Listen for focus requests from popup directive
  $scope.$on('datepicker.focus', focusElement);

  $scope.keydown = function( evt ) {
    var key = $scope.keys[evt.which];

    if ( !key || evt.shiftKey || evt.altKey ) {
      return;
    }

    evt.preventDefault();
    evt.stopPropagation();

    if (key === 'enter' || key === 'space') {
      if ( self.isDisabled(self.activeDate)) {
        return; // do nothing
      }
      $scope.select(self.activeDate);
      focusElement();
    } else if (evt.ctrlKey && (key === 'up' || key === 'down')) {
      $scope.toggleMode(key === 'up' ? 1 : -1);
      focusElement();
    } else {
      self.handleKeyDown(key, evt);
      self.refreshView();
    }
  };
}])

.directive( 'datepicker', function () {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'template/datepicker/datepicker.html',
    scope: {
      datepickerMode: '=?',
      dateDisabled: '&'
    },
    require: ['datepicker', '?^ngModel'],
    controller: 'DatepickerController',
    link: function(scope, element, attrs, ctrls) {
      var datepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if ( ngModelCtrl ) {
        datepickerCtrl.init( ngModelCtrl );
      }
    }
  };
})

.directive('daypicker', ['dateFilter', function (dateFilter) {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'template/datepicker/day.html',
    require: '^datepicker',
    link: function(scope, element, attrs, ctrl) {
      scope.showWeeks = ctrl.showWeeks;

      ctrl.step = { months: 1 };
      ctrl.element = element;

      var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      function getDaysInMonth( year, month ) {
        return ((month === 1) && (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) ? 29 : DAYS_IN_MONTH[month];
      }

      function getDates(startDate, n) {
        var dates = new Array(n), current = new Date(startDate), i = 0;
        current.setHours(12); // Prevent repeated dates because of timezone bug
        while ( i < n ) {
          dates[i++] = new Date(current);
          current.setDate( current.getDate() + 1 );
        }
        return dates;
      }

      ctrl._refreshView = function() {
        var year = ctrl.activeDate.getFullYear(),
          month = ctrl.activeDate.getMonth(),
          firstDayOfMonth = new Date(year, month, 1),
          difference = ctrl.startingDay - firstDayOfMonth.getDay(),
          numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : - difference,
          firstDate = new Date(firstDayOfMonth);

        if ( numDisplayedFromPreviousMonth > 0 ) {
          firstDate.setDate( - numDisplayedFromPreviousMonth + 1 );
        }

        // 42 is the number of days on a six-month calendar
        var days = getDates(firstDate, 42);
        for (var i = 0; i < 42; i ++) {
          days[i] = angular.extend(ctrl.createDateObject(days[i], ctrl.formatDay), {
            secondary: days[i].getMonth() !== month,
            uid: scope.uniqueId + '-' + i
          });
        }

        scope.labels = new Array(7);
        for (var j = 0; j < 7; j++) {
          scope.labels[j] = {
            abbr: dateFilter(days[j].date, ctrl.formatDayHeader),
            full: dateFilter(days[j].date, 'EEEE')
          };
        }

        scope.title = dateFilter(ctrl.activeDate, ctrl.formatDayTitle);
        scope.rows = ctrl.split(days, 7);

        if ( scope.showWeeks ) {
          scope.weekNumbers = [];
          var weekNumber = getISO8601WeekNumber( scope.rows[0][0].date ),
              numWeeks = scope.rows.length;
          while( scope.weekNumbers.push(weekNumber++) < numWeeks ) {}
        }
      };

      ctrl.compare = function(date1, date2) {
        return (new Date( date1.getFullYear(), date1.getMonth(), date1.getDate() ) - new Date( date2.getFullYear(), date2.getMonth(), date2.getDate() ) );
      };

      function getISO8601WeekNumber(date) {
        var checkDate = new Date(date);
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
        var time = checkDate.getTime();
        checkDate.setMonth(0); // Compare with Jan 1
        checkDate.setDate(1);
        return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
      }

      ctrl.handleKeyDown = function( key, evt ) {
        var date = ctrl.activeDate.getDate();

        if (key === 'left') {
          date = date - 1;   // up
        } else if (key === 'up') {
          date = date - 7;   // down
        } else if (key === 'right') {
          date = date + 1;   // down
        } else if (key === 'down') {
          date = date + 7;
        } else if (key === 'pageup' || key === 'pagedown') {
          var month = ctrl.activeDate.getMonth() + (key === 'pageup' ? - 1 : 1);
          ctrl.activeDate.setMonth(month, 1);
          date = Math.min(getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth()), date);
        } else if (key === 'home') {
          date = 1;
        } else if (key === 'end') {
          date = getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth());
        }
        ctrl.activeDate.setDate(date);
      };

      ctrl.refreshView();
    }
  };
}])

.directive('monthpicker', ['dateFilter', function (dateFilter) {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'template/datepicker/month.html',
    require: '^datepicker',
    link: function(scope, element, attrs, ctrl) {
      ctrl.step = { years: 1 };
      ctrl.element = element;

      ctrl._refreshView = function() {
        var months = new Array(12),
            year = ctrl.activeDate.getFullYear();

        for ( var i = 0; i < 12; i++ ) {
          months[i] = angular.extend(ctrl.createDateObject(new Date(year, i, 1), ctrl.formatMonth), {
            uid: scope.uniqueId + '-' + i
          });
        }

        scope.title = dateFilter(ctrl.activeDate, ctrl.formatMonthTitle);
        scope.rows = ctrl.split(months, 3);
      };

      ctrl.compare = function(date1, date2) {
        return new Date( date1.getFullYear(), date1.getMonth() ) - new Date( date2.getFullYear(), date2.getMonth() );
      };

      ctrl.handleKeyDown = function( key, evt ) {
        var date = ctrl.activeDate.getMonth();

        if (key === 'left') {
          date = date - 1;   // up
        } else if (key === 'up') {
          date = date - 3;   // down
        } else if (key === 'right') {
          date = date + 1;   // down
        } else if (key === 'down') {
          date = date + 3;
        } else if (key === 'pageup' || key === 'pagedown') {
          var year = ctrl.activeDate.getFullYear() + (key === 'pageup' ? - 1 : 1);
          ctrl.activeDate.setFullYear(year);
        } else if (key === 'home') {
          date = 0;
        } else if (key === 'end') {
          date = 11;
        }
        ctrl.activeDate.setMonth(date);
      };

      ctrl.refreshView();
    }
  };
}])

.directive('yearpicker', ['dateFilter', function (dateFilter) {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'template/datepicker/year.html',
    require: '^datepicker',
    link: function(scope, element, attrs, ctrl) {
      var range = ctrl.yearRange;

      ctrl.step = { years: range };
      ctrl.element = element;

      function getStartingYear( year ) {
        return parseInt((year - 1) / range, 10) * range + 1;
      }

      ctrl._refreshView = function() {
        var years = new Array(range);

        for ( var i = 0, start = getStartingYear(ctrl.activeDate.getFullYear()); i < range; i++ ) {
          years[i] = angular.extend(ctrl.createDateObject(new Date(start + i, 0, 1), ctrl.formatYear), {
            uid: scope.uniqueId + '-' + i
          });
        }

        scope.title = [years[0].label, years[range - 1].label].join(' - ');
        scope.rows = ctrl.split(years, 5);
      };

      ctrl.compare = function(date1, date2) {
        return date1.getFullYear() - date2.getFullYear();
      };

      ctrl.handleKeyDown = function( key, evt ) {
        var date = ctrl.activeDate.getFullYear();

        if (key === 'left') {
          date = date - 1;   // up
        } else if (key === 'up') {
          date = date - 5;   // down
        } else if (key === 'right') {
          date = date + 1;   // down
        } else if (key === 'down') {
          date = date + 5;
        } else if (key === 'pageup' || key === 'pagedown') {
          date += (key === 'pageup' ? - 1 : 1) * ctrl.step.years;
        } else if (key === 'home') {
          date = getStartingYear( ctrl.activeDate.getFullYear() );
        } else if (key === 'end') {
          date = getStartingYear( ctrl.activeDate.getFullYear() ) + range - 1;
        }
        ctrl.activeDate.setFullYear(date);
      };

      ctrl.refreshView();
    }
  };
}])

.constant('datepickerPopupConfig', {
  datepickerPopup: 'yyyy-MM-dd',
  currentText: 'Today',
  clearText: 'Clear',
  closeText: 'Done',
  closeOnDateSelection: true,
  appendToBody: false,
  showButtonBar: true
})

.directive('datepickerPopup', ['$compile', '$parse', '$document', '$position', 'dateFilter', 'dateParser', 'datepickerPopupConfig',
function ($compile, $parse, $document, $position, dateFilter, dateParser, datepickerPopupConfig) {
  return {
    restrict: 'EA',
    require: 'ngModel',
    scope: {
      isOpen: '=?',
      currentText: '@',
      clearText: '@',
      closeText: '@',
      dateDisabled: '&'
    },
    link: function(scope, element, attrs, ngModel) {
      var dateFormat,
          closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? scope.$parent.$eval(attrs.closeOnDateSelection) : datepickerPopupConfig.closeOnDateSelection,
          appendToBody = angular.isDefined(attrs.datepickerAppendToBody) ? scope.$parent.$eval(attrs.datepickerAppendToBody) : datepickerPopupConfig.appendToBody;

      scope.showButtonBar = angular.isDefined(attrs.showButtonBar) ? scope.$parent.$eval(attrs.showButtonBar) : datepickerPopupConfig.showButtonBar;

      scope.getText = function( key ) {
        return scope[key + 'Text'] || datepickerPopupConfig[key + 'Text'];
      };

      attrs.$observe('datepickerPopup', function(value) {
          dateFormat = value || datepickerPopupConfig.datepickerPopup;
          ngModel.$render();
      });

      // popup element used to display calendar
      var popupEl = angular.element('<div datepicker-popup-wrap><div datepicker></div></div>');
      popupEl.attr({
        'ng-model': 'date',
        'ng-change': 'dateSelection()'
      });

      function cameltoDash( string ){
        return string.replace(/([A-Z])/g, function($1) { return '-' + $1.toLowerCase(); });
      }

      // datepicker element
      var datepickerEl = angular.element(popupEl.children()[0]);
      if ( attrs.datepickerOptions ) {
        angular.forEach(scope.$parent.$eval(attrs.datepickerOptions), function( value, option ) {
          datepickerEl.attr( cameltoDash(option), value );
        });
      }

      scope.watchData = {};
      angular.forEach(['minDate', 'maxDate', 'datepickerMode'], function( key ) {
        if ( attrs[key] ) {
          var getAttribute = $parse(attrs[key]);
          scope.$parent.$watch(getAttribute, function(value){
            scope.watchData[key] = value;
          });
          datepickerEl.attr(cameltoDash(key), 'watchData.' + key);

          // Propagate changes from datepicker to outside
          if ( key === 'datepickerMode' ) {
            var setAttribute = getAttribute.assign;
            scope.$watch('watchData.' + key, function(value, oldvalue) {
              if ( value !== oldvalue ) {
                setAttribute(scope.$parent, value);
              }
            });
          }
        }
      });
      if (attrs.dateDisabled) {
        datepickerEl.attr('date-disabled', 'dateDisabled({ date: date, mode: mode })');
      }

      function parseDate(viewValue) {
        if (!viewValue) {
          ngModel.$setValidity('date', true);
          return null;
        } else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
          ngModel.$setValidity('date', true);
          return viewValue;
        } else if (angular.isString(viewValue)) {
          var date = dateParser.parse(viewValue, dateFormat) || new Date(viewValue);
          if (isNaN(date)) {
            ngModel.$setValidity('date', false);
            return undefined;
          } else {
            ngModel.$setValidity('date', true);
            return date;
          }
        } else {
          ngModel.$setValidity('date', false);
          return undefined;
        }
      }
      ngModel.$parsers.unshift(parseDate);

      // Inner change
      scope.dateSelection = function(dt) {
        if (angular.isDefined(dt)) {
          scope.date = dt;
        }
        ngModel.$setViewValue(scope.date);
        ngModel.$render();

        if ( closeOnDateSelection ) {
          scope.isOpen = false;
          element[0].focus();
        }
      };

      element.bind('input change keyup', function() {
        scope.$apply(function() {
          scope.date = ngModel.$modelValue;
        });
      });

      // Outter change
      ngModel.$render = function() {
        var date = ngModel.$viewValue ? dateFilter(ngModel.$viewValue, dateFormat) : '';
        element.val(date);
        scope.date = parseDate( ngModel.$modelValue );
      };

      var documentClickBind = function(event) {
        if (scope.isOpen && event.target !== element[0]) {
          scope.$apply(function() {
            scope.isOpen = false;
          });
        }
      };

      var keydown = function(evt, noApply) {
        scope.keydown(evt);
      };
      element.bind('keydown', keydown);

      scope.keydown = function(evt) {
        if (evt.which === 27) {
          evt.preventDefault();
          evt.stopPropagation();
          scope.close();
        } else if (evt.which === 40 && !scope.isOpen) {
          scope.isOpen = true;
        }
      };

      scope.$watch('isOpen', function(value) {
        if (value) {
          scope.$broadcast('datepicker.focus');
          scope.position = appendToBody ? $position.offset(element) : $position.position(element);
          scope.position.top = scope.position.top + element.prop('offsetHeight');

          $document.bind('click', documentClickBind);
        } else {
          $document.unbind('click', documentClickBind);
        }
      });

      scope.select = function( date ) {
        if (date === 'today') {
          var today = new Date();
          if (angular.isDate(ngModel.$modelValue)) {
            date = new Date(ngModel.$modelValue);
            date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
          } else {
            date = new Date(today.setHours(0, 0, 0, 0));
          }
        }
        scope.dateSelection( date );
      };

      scope.close = function() {
        scope.isOpen = false;
        element[0].focus();
      };

      var $popup = $compile(popupEl)(scope);
      // Prevent jQuery cache memory leak (template is now redundant after linking)
      popupEl.remove();

      if ( appendToBody ) {
        $document.find('body').append($popup);
      } else {
        element.after($popup);
      }

      scope.$on('$destroy', function() {
        $popup.remove();
        element.unbind('keydown', keydown);
        $document.unbind('click', documentClickBind);
      });
    }
  };
}])

.directive('datepickerPopupWrap', function() {
  return {
    restrict:'EA',
    replace: true,
    transclude: true,
    templateUrl: 'template/datepicker/popup.html',
    link:function (scope, element, attrs) {
      element.bind('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
      });
    }
  };
});

angular.module('ui.bootstrap.pagination', [])

.controller('PaginationController', ['$scope', '$attrs', '$parse', function ($scope, $attrs, $parse) {
  var self = this,
      ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
      setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

  this.init = function(ngModelCtrl_, config) {
    ngModelCtrl = ngModelCtrl_;
    this.config = config;

    ngModelCtrl.$render = function() {
      self.render();
    };

    if ($attrs.itemsPerPage) {
      $scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
        self.itemsPerPage = parseInt(value, 10);
        $scope.totalPages = self.calculateTotalPages();
      });
    } else {
      this.itemsPerPage = config.itemsPerPage;
    }
  };

  this.calculateTotalPages = function() {
    var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
    return Math.max(totalPages || 0, 1);
  };

  this.render = function() {
    $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
  };

  $scope.selectPage = function(page) {
    if ( $scope.page !== page && page > 0 && page <= $scope.totalPages) {
      ngModelCtrl.$setViewValue(page);
      ngModelCtrl.$render();
    }
  };

  $scope.getText = function( key ) {
    return $scope[key + 'Text'] || self.config[key + 'Text'];
  };
  $scope.noPrevious = function() {
    return $scope.page === 1;
  };
  $scope.noNext = function() {
    return $scope.page === $scope.totalPages;
  };

  $scope.$watch('totalItems', function() {
    $scope.totalPages = self.calculateTotalPages();
  });

  $scope.$watch('totalPages', function(value) {
    setNumPages($scope.$parent, value); // Readonly variable

    if ( $scope.page > value ) {
      $scope.selectPage(value);
    } else {
      ngModelCtrl.$render();
    }
  });
}])

.constant('paginationConfig', {
  itemsPerPage: 10,
  boundaryLinks: false,
  directionLinks: true,
  firstText: 'First',
  previousText: 'Previous',
  nextText: 'Next',
  lastText: 'Last',
  rotate: true
})

.directive('pagination', ['$parse', 'paginationConfig', function($parse, paginationConfig) {
  return {
    restrict: 'EA',
    scope: {
      totalItems: '=',
      firstText: '@',
      previousText: '@',
      nextText: '@',
      lastText: '@'
    },
    require: ['pagination', '?ngModel'],
    controller: 'PaginationController',
    templateUrl: 'template/pagination/pagination.html',
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
         return; // do nothing if no ng-model
      }

      // Setup configuration parameters
      var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
          rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
      scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
      scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;

      paginationCtrl.init(ngModelCtrl, paginationConfig);

      if (attrs.maxSize) {
        scope.$parent.$watch($parse(attrs.maxSize), function(value) {
          maxSize = parseInt(value, 10);
          paginationCtrl.render();
        });
      }

      // Create page object used in template
      function makePage(number, text, isActive) {
        return {
          number: number,
          text: text,
          active: isActive
        };
      }

      function getPages(currentPage, totalPages) {
        var pages = [];

        // Default page limits
        var startPage = 1, endPage = totalPages;
        var isMaxSized = ( angular.isDefined(maxSize) && maxSize < totalPages );

        // recompute if maxSize
        if ( isMaxSized ) {
          if ( rotate ) {
            // Current page is displayed in the middle of the visible ones
            startPage = Math.max(currentPage - Math.floor(maxSize/2), 1);
            endPage   = startPage + maxSize - 1;

            // Adjust if limit is exceeded
            if (endPage > totalPages) {
              endPage   = totalPages;
              startPage = endPage - maxSize + 1;
            }
          } else {
            // Visible pages are paginated with maxSize
            startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

            // Adjust last page if limit is exceeded
            endPage = Math.min(startPage + maxSize - 1, totalPages);
          }
        }

        // Add page number links
        for (var number = startPage; number <= endPage; number++) {
          var page = makePage(number, number, number === currentPage);
          pages.push(page);
        }

        // Add links to move between page sets
        if ( isMaxSized && ! rotate ) {
          if ( startPage > 1 ) {
            var previousPageSet = makePage(startPage - 1, '...', false);
            pages.unshift(previousPageSet);
          }

          if ( endPage < totalPages ) {
            var nextPageSet = makePage(endPage + 1, '...', false);
            pages.push(nextPageSet);
          }
        }

        return pages;
      }

      var originalRender = paginationCtrl.render;
      paginationCtrl.render = function() {
        originalRender();
        if (scope.page > 0 && scope.page <= scope.totalPages) {
          scope.pages = getPages(scope.page, scope.totalPages);
        }
      };
    }
  };
}])

.constant('pagerConfig', {
  itemsPerPage: 10,
  previousText: '« Previous',
  nextText: 'Next »',
  align: true
})

.directive('pager', ['pagerConfig', function(pagerConfig) {
  return {
    restrict: 'EA',
    scope: {
      totalItems: '=',
      previousText: '@',
      nextText: '@'
    },
    require: ['pager', '?ngModel'],
    controller: 'PaginationController',
    templateUrl: 'template/pagination/pager.html',
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
         return; // do nothing if no ng-model
      }

      scope.align = angular.isDefined(attrs.align) ? scope.$parent.$eval(attrs.align) : pagerConfig.align;
      paginationCtrl.init(ngModelCtrl, pagerConfig);
    }
  };
}]);

/**
 * The following features are still outstanding: animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, html tooltips, and selector delegation.
 */
angular.module( 'ui.bootstrap.tooltip', [ 'ui.bootstrap.position', 'ui.bootstrap.bindHtml' ] )

/**
 * The $tooltip service creates tooltip- and popover-like directives as well as
 * houses global options for them.
 */
.provider( '$tooltip', function () {
  // The default options tooltip and popover.
  var defaultOptions = {
    placement: 'top',
    animation: true,
    popupDelay: 0
  };

  // Default hide triggers for each show trigger
  var triggerMap = {
    'mouseenter': 'mouseleave',
    'click': 'click',
    'focus': 'blur'
  };

  // The options specified to the provider globally.
  var globalOptions = {};

  /**
   * `options({})` allows global configuration of all tooltips in the
   * application.
   *
   *   var app = angular.module( 'App', ['ui.bootstrap.tooltip'], function( $tooltipProvider ) {
   *     // place tooltips left instead of top by default
   *     $tooltipProvider.options( { placement: 'left' } );
   *   });
   */
	this.options = function( value ) {
		angular.extend( globalOptions, value );
	};

  /**
   * This allows you to extend the set of trigger mappings available. E.g.:
   *
   *   $tooltipProvider.setTriggers( 'openTrigger': 'closeTrigger' );
   */
  this.setTriggers = function setTriggers ( triggers ) {
    angular.extend( triggerMap, triggers );
  };

  /**
   * This is a helper function for translating camel-case to snake-case.
   */
  function snake_case(name){
    var regexp = /[A-Z]/g;
    var separator = '-';
    return name.replace(regexp, function(letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
  }

  /**
   * Returns the actual instance of the $tooltip service.
   * TODO support multiple triggers
   */
  this.$get = [ '$window', '$compile', '$timeout', '$document', '$position', '$interpolate', function ( $window, $compile, $timeout, $document, $position, $interpolate ) {
    return function $tooltip ( type, prefix, defaultTriggerShow ) {
      var options = angular.extend( {}, defaultOptions, globalOptions );

      /**
       * Returns an object of show and hide triggers.
       *
       * If a trigger is supplied,
       * it is used to show the tooltip; otherwise, it will use the `trigger`
       * option passed to the `$tooltipProvider.options` method; else it will
       * default to the trigger supplied to this directive factory.
       *
       * The hide trigger is based on the show trigger. If the `trigger` option
       * was passed to the `$tooltipProvider.options` method, it will use the
       * mapped trigger from `triggerMap` or the passed trigger if the map is
       * undefined; otherwise, it uses the `triggerMap` value of the show
       * trigger; else it will just use the show trigger.
       */
      function getTriggers ( trigger ) {
        var show = trigger || options.trigger || defaultTriggerShow;
        var hide = triggerMap[show] || show;
        return {
          show: show,
          hide: hide
        };
      }

      var directiveName = snake_case( type );

      var startSym = $interpolate.startSymbol();
      var endSym = $interpolate.endSymbol();
      var template =
        '<div '+ directiveName +'-popup '+
          'title="'+startSym+'title'+endSym+'" '+
          'content="'+startSym+'content'+endSym+'" '+
          'placement="'+startSym+'placement'+endSym+'" '+
          'animation="animation" '+
          'is-open="isOpen"'+
          '>'+
        '</div>';

      return {
        restrict: 'EA',
        compile: function (tElem, tAttrs) {
          var tooltipLinker = $compile( template );

          return function link ( scope, element, attrs ) {
            var tooltip;
            var tooltipLinkedScope;
            var transitionTimeout;
            var popupTimeout;
            var appendToBody = angular.isDefined( options.appendToBody ) ? options.appendToBody : false;
            var triggers = getTriggers( undefined );
            var hasEnableExp = angular.isDefined(attrs[prefix+'Enable']);
            var ttScope = scope.$new(true);

            var positionTooltip = function () {

              var ttPosition = $position.positionElements(element, tooltip, ttScope.placement, appendToBody);
              ttPosition.top += 'px';
              ttPosition.left += 'px';

              // Now set the calculated positioning.
              tooltip.css( ttPosition );
            };

            // By default, the tooltip is not open.
            // TODO add ability to start tooltip opened
            ttScope.isOpen = false;

            function toggleTooltipBind () {
              if ( ! ttScope.isOpen ) {
                showTooltipBind();
              } else {
                hideTooltipBind();
              }
            }

            // Show the tooltip with delay if specified, otherwise show it immediately
            function showTooltipBind() {
              if(hasEnableExp && !scope.$eval(attrs[prefix+'Enable'])) {
                return;
              }

              prepareTooltip();

              if ( ttScope.popupDelay ) {
                // Do nothing if the tooltip was already scheduled to pop-up.
                // This happens if show is triggered multiple times before any hide is triggered.
                if (!popupTimeout) {
                  popupTimeout = $timeout( show, ttScope.popupDelay, false );
                  popupTimeout.then(function(reposition){reposition();});
                }
              } else {
                show()();
              }
            }

            function hideTooltipBind () {
              scope.$apply(function () {
                hide();
              });
            }

            // Show the tooltip popup element.
            function show() {

              popupTimeout = null;

              // If there is a pending remove transition, we must cancel it, lest the
              // tooltip be mysteriously removed.
              if ( transitionTimeout ) {
                $timeout.cancel( transitionTimeout );
                transitionTimeout = null;
              }

              // Don't show empty tooltips.
              if ( ! ttScope.content ) {
                return angular.noop;
              }

              createTooltip();

              // Set the initial positioning.
              tooltip.css({ top: 0, left: 0, display: 'block' });
              ttScope.$digest();

              positionTooltip();

              // And show the tooltip.
              ttScope.isOpen = true;
              ttScope.$digest(); // digest required as $apply is not called

              // Return positioning function as promise callback for correct
              // positioning after draw.
              return positionTooltip;
            }

            // Hide the tooltip popup element.
            function hide() {
              // First things first: we don't show it anymore.
              ttScope.isOpen = false;

              //if tooltip is going to be shown after delay, we must cancel this
              $timeout.cancel( popupTimeout );
              popupTimeout = null;

              // And now we remove it from the DOM. However, if we have animation, we
              // need to wait for it to expire beforehand.
              // FIXME: this is a placeholder for a port of the transitions library.
              if ( ttScope.animation ) {
                if (!transitionTimeout) {
                  transitionTimeout = $timeout(removeTooltip, 500);
                }
              } else {
                removeTooltip();
              }
            }

            function createTooltip() {
              // There can only be one tooltip element per directive shown at once.
              if (tooltip) {
                removeTooltip();
              }
              tooltipLinkedScope = ttScope.$new();
              tooltip = tooltipLinker(tooltipLinkedScope, function (tooltip) {
                if ( appendToBody ) {
                  $document.find( 'body' ).append( tooltip );
                } else {
                  element.after( tooltip );
                }
              });
            }

            function removeTooltip() {
              transitionTimeout = null;
              if (tooltip) {
                tooltip.remove();
                tooltip = null;
              }
              if (tooltipLinkedScope) {
                tooltipLinkedScope.$destroy();
                tooltipLinkedScope = null;
              }
            }

            function prepareTooltip() {
              prepPlacement();
              prepPopupDelay();
            }

            /**
             * Observe the relevant attributes.
             */
            attrs.$observe( type, function ( val ) {
              ttScope.content = val;

              if (!val && ttScope.isOpen ) {
                hide();
              }
            });

            attrs.$observe( prefix+'Title', function ( val ) {
              ttScope.title = val;
            });

            function prepPlacement() {
              var val = attrs[ prefix + 'Placement' ];
              ttScope.placement = angular.isDefined( val ) ? val : options.placement;
            }

            function prepPopupDelay() {
              var val = attrs[ prefix + 'PopupDelay' ];
              var delay = parseInt( val, 10 );
              ttScope.popupDelay = ! isNaN(delay) ? delay : options.popupDelay;
            }

            var unregisterTriggers = function () {
              element.unbind(triggers.show, showTooltipBind);
              element.unbind(triggers.hide, hideTooltipBind);
            };

            function prepTriggers() {
              var val = attrs[ prefix + 'Trigger' ];
              unregisterTriggers();

              triggers = getTriggers( val );

              if ( triggers.show === triggers.hide ) {
                element.bind( triggers.show, toggleTooltipBind );
              } else {
                element.bind( triggers.show, showTooltipBind );
                element.bind( triggers.hide, hideTooltipBind );
              }
            }
            prepTriggers();

            var animation = scope.$eval(attrs[prefix + 'Animation']);
            ttScope.animation = angular.isDefined(animation) ? !!animation : options.animation;

            var appendToBodyVal = scope.$eval(attrs[prefix + 'AppendToBody']);
            appendToBody = angular.isDefined(appendToBodyVal) ? appendToBodyVal : appendToBody;

            // if a tooltip is attached to <body> we need to remove it on
            // location change as its parent scope will probably not be destroyed
            // by the change.
            if ( appendToBody ) {
              scope.$on('$locationChangeSuccess', function closeTooltipOnLocationChangeSuccess () {
              if ( ttScope.isOpen ) {
                hide();
              }
            });
            }

            // Make sure tooltip is destroyed and removed.
            scope.$on('$destroy', function onDestroyTooltip() {
              $timeout.cancel( transitionTimeout );
              $timeout.cancel( popupTimeout );
              unregisterTriggers();
              removeTooltip();
              ttScope = null;
            });
          };
        }
      };
    };
  }];
})

.directive( 'tooltipPopup', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: { content: '@', placement: '@', animation: '&', isOpen: '&' },
    templateUrl: 'template/tooltip/tooltip-popup.html'
  };
})

.directive( 'tooltip', [ '$tooltip', function ( $tooltip ) {
  return $tooltip( 'tooltip', 'tooltip', 'mouseenter' );
}])

.directive( 'tooltipHtmlUnsafePopup', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: { content: '@', placement: '@', animation: '&', isOpen: '&' },
    templateUrl: 'template/tooltip/tooltip-html-unsafe-popup.html'
  };
})

.directive( 'tooltipHtmlUnsafe', [ '$tooltip', function ( $tooltip ) {
  return $tooltip( 'tooltipHtmlUnsafe', 'tooltip', 'mouseenter' );
}]);

/**
 * The following features are still outstanding: popup delay, animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, html popovers, and selector delegatation.
 */
angular.module( 'ui.bootstrap.popover', [ 'ui.bootstrap.tooltip' ] )

.directive( 'popoverPopup', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&' },
    templateUrl: 'template/popover/popover.html'
  };
})

.directive( 'popover', [ '$tooltip', function ( $tooltip ) {
  return $tooltip( 'popover', 'popover', 'click' );
}]);

angular.module('ui.bootstrap.timepicker', [])

.constant('timepickerConfig', {
  hourStep: 1,
  minuteStep: 1,
  showMeridian: true,
  meridians: null,
  readonlyInput: false,
  mousewheel: true
})

.controller('TimepickerController', ['$scope', '$attrs', '$parse', '$log', '$locale', 'timepickerConfig', function($scope, $attrs, $parse, $log, $locale, timepickerConfig) {
  var selected = new Date(),
      ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
      meridians = angular.isDefined($attrs.meridians) ? $scope.$parent.$eval($attrs.meridians) : timepickerConfig.meridians || $locale.DATETIME_FORMATS.AMPMS;

  this.init = function( ngModelCtrl_, inputs ) {
    ngModelCtrl = ngModelCtrl_;
    ngModelCtrl.$render = this.render;

    var hoursInputEl = inputs.eq(0),
        minutesInputEl = inputs.eq(1);

    var mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : timepickerConfig.mousewheel;
    if ( mousewheel ) {
      this.setupMousewheelEvents( hoursInputEl, minutesInputEl );
    }

    $scope.readonlyInput = angular.isDefined($attrs.readonlyInput) ? $scope.$parent.$eval($attrs.readonlyInput) : timepickerConfig.readonlyInput;
    this.setupInputEvents( hoursInputEl, minutesInputEl );
  };

  var hourStep = timepickerConfig.hourStep;
  if ($attrs.hourStep) {
    $scope.$parent.$watch($parse($attrs.hourStep), function(value) {
      hourStep = parseInt(value, 10);
    });
  }

  var minuteStep = timepickerConfig.minuteStep;
  if ($attrs.minuteStep) {
    $scope.$parent.$watch($parse($attrs.minuteStep), function(value) {
      minuteStep = parseInt(value, 10);
    });
  }

  // 12H / 24H mode
  $scope.showMeridian = timepickerConfig.showMeridian;
  if ($attrs.showMeridian) {
    $scope.$parent.$watch($parse($attrs.showMeridian), function(value) {
      $scope.showMeridian = !!value;

      if ( ngModelCtrl.$error.time ) {
        // Evaluate from template
        var hours = getHoursFromTemplate(), minutes = getMinutesFromTemplate();
        if (angular.isDefined( hours ) && angular.isDefined( minutes )) {
          selected.setHours( hours );
          refresh();
        }
      } else {
        updateTemplate();
      }
    });
  }

  // Get $scope.hours in 24H mode if valid
  function getHoursFromTemplate ( ) {
    var hours = parseInt( $scope.hours, 10 );
    var valid = ( $scope.showMeridian ) ? (hours > 0 && hours < 13) : (hours >= 0 && hours < 24);
    if ( !valid ) {
      return undefined;
    }

    if ( $scope.showMeridian ) {
      if ( hours === 12 ) {
        hours = 0;
      }
      if ( $scope.meridian === meridians[1] ) {
        hours = hours + 12;
      }
    }
    return hours;
  }

  function getMinutesFromTemplate() {
    var minutes = parseInt($scope.minutes, 10);
    return ( minutes >= 0 && minutes < 60 ) ? minutes : undefined;
  }

  function pad( value ) {
    return ( angular.isDefined(value) && value.toString().length < 2 ) ? '0' + value : value;
  }

  // Respond on mousewheel spin
  this.setupMousewheelEvents = function( hoursInputEl, minutesInputEl ) {
    var isScrollingUp = function(e) {
      if (e.originalEvent) {
        e = e.originalEvent;
      }
      //pick correct delta variable depending on event
      var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
      return (e.detail || delta > 0);
    };

    hoursInputEl.bind('mousewheel wheel', function(e) {
      $scope.$apply( (isScrollingUp(e)) ? $scope.incrementHours() : $scope.decrementHours() );
      e.preventDefault();
    });

    minutesInputEl.bind('mousewheel wheel', function(e) {
      $scope.$apply( (isScrollingUp(e)) ? $scope.incrementMinutes() : $scope.decrementMinutes() );
      e.preventDefault();
    });

  };

  this.setupInputEvents = function( hoursInputEl, minutesInputEl ) {
    if ( $scope.readonlyInput ) {
      $scope.updateHours = angular.noop;
      $scope.updateMinutes = angular.noop;
      return;
    }

    var invalidate = function(invalidHours, invalidMinutes) {
      ngModelCtrl.$setViewValue( null );
      ngModelCtrl.$setValidity('time', false);
      if (angular.isDefined(invalidHours)) {
        $scope.invalidHours = invalidHours;
      }
      if (angular.isDefined(invalidMinutes)) {
        $scope.invalidMinutes = invalidMinutes;
      }
    };

    $scope.updateHours = function() {
      var hours = getHoursFromTemplate();

      if ( angular.isDefined(hours) ) {
        selected.setHours( hours );
        refresh( 'h' );
      } else {
        invalidate(true);
      }
    };

    hoursInputEl.bind('blur', function(e) {
      if ( !$scope.invalidHours && $scope.hours < 10) {
        $scope.$apply( function() {
          $scope.hours = pad( $scope.hours );
        });
      }
    });

    $scope.updateMinutes = function() {
      var minutes = getMinutesFromTemplate();

      if ( angular.isDefined(minutes) ) {
        selected.setMinutes( minutes );
        refresh( 'm' );
      } else {
        invalidate(undefined, true);
      }
    };

    minutesInputEl.bind('blur', function(e) {
      if ( !$scope.invalidMinutes && $scope.minutes < 10 ) {
        $scope.$apply( function() {
          $scope.minutes = pad( $scope.minutes );
        });
      }
    });

  };

  this.render = function() {
    var date = ngModelCtrl.$modelValue ? new Date( ngModelCtrl.$modelValue ) : null;

    if ( isNaN(date) ) {
      ngModelCtrl.$setValidity('time', false);
      $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
    } else {
      if ( date ) {
        selected = date;
      }
      makeValid();
      updateTemplate();
    }
  };

  // Call internally when we know that model is valid.
  function refresh( keyboardChange ) {
    makeValid();
    ngModelCtrl.$setViewValue( new Date(selected) );
    updateTemplate( keyboardChange );
  }

  function makeValid() {
    ngModelCtrl.$setValidity('time', true);
    $scope.invalidHours = false;
    $scope.invalidMinutes = false;
  }

  function updateTemplate( keyboardChange ) {
    var hours = selected.getHours(), minutes = selected.getMinutes();

    if ( $scope.showMeridian ) {
      hours = ( hours === 0 || hours === 12 ) ? 12 : hours % 12; // Convert 24 to 12 hour system
    }

    $scope.hours = keyboardChange === 'h' ? hours : pad(hours);
    $scope.minutes = keyboardChange === 'm' ? minutes : pad(minutes);
    $scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];
  }

  function addMinutes( minutes ) {
    var dt = new Date( selected.getTime() + minutes * 60000 );
    selected.setHours( dt.getHours(), dt.getMinutes() );
    refresh();
  }

  $scope.incrementHours = function() {
    addMinutes( hourStep * 60 );
  };
  $scope.decrementHours = function() {
    addMinutes( - hourStep * 60 );
  };
  $scope.incrementMinutes = function() {
    addMinutes( minuteStep );
  };
  $scope.decrementMinutes = function() {
    addMinutes( - minuteStep );
  };
  $scope.toggleMeridian = function() {
    addMinutes( 12 * 60 * (( selected.getHours() < 12 ) ? 1 : -1) );
  };
}])

.directive('timepicker', function () {
  return {
    restrict: 'EA',
    require: ['timepicker', '?^ngModel'],
    controller:'TimepickerController',
    replace: true,
    scope: {},
    templateUrl: 'template/timepicker/timepicker.html',
    link: function(scope, element, attrs, ctrls) {
      var timepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if ( ngModelCtrl ) {
        timepickerCtrl.init( ngModelCtrl, element.find('input') );
      }
    }
  };
});

angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/accordion/accordion-group.html",
    "<div class=\"panel panel-default\">\n" +
    "  <div class=\"panel-heading\">\n" +
    "    <h4 class=\"panel-title\">\n" +
    "      <a href class=\"accordion-toggle\" ng-click=\"toggleOpen()\" accordion-transclude=\"heading\"><span ng-class=\"{'text-muted': isDisabled}\">{{heading}}</span></a>\n" +
    "    </h4>\n" +
    "  </div>\n" +
    "  <div class=\"panel-collapse\" collapse=\"!isOpen\">\n" +
    "	  <div class=\"panel-body\" ng-transclude></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/accordion/accordion.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/accordion/accordion.html",
    "<div class=\"panel-group\" ng-transclude></div>");
}]);

angular.module("template/alert/alert.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/alert/alert.html",
    "<div class=\"alert\" ng-class=\"['alert-' + (type || 'warning'), closeable ? 'alert-dismissable' : null]\" role=\"alert\">\n" +
    "    <button ng-show=\"closeable\" type=\"button\" class=\"close\" ng-click=\"close()\">\n" +
    "        <span aria-hidden=\"true\">&times;</span>\n" +
    "        <span class=\"sr-only\">Close</span>\n" +
    "    </button>\n" +
    "    <div ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/datepicker/datepicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/datepicker/datepicker.html",
    "<div ng-switch=\"datepickerMode\" role=\"application\" ng-keydown=\"keydown($event)\">\n" +
    "  <daypicker ng-switch-when=\"day\" tabindex=\"0\"></daypicker>\n" +
    "  <monthpicker ng-switch-when=\"month\" tabindex=\"0\"></monthpicker>\n" +
    "  <yearpicker ng-switch-when=\"year\" tabindex=\"0\"></yearpicker>\n" +
    "</div>");
}]);

angular.module("template/datepicker/day.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/datepicker/day.html",
    "<table role=\"grid\" aria-labelledby=\"{{uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
    "      <th colspan=\"{{5 + showWeeks}}\"><button id=\"{{uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "      <th ng-show=\"showWeeks\" class=\"text-center\"></th>\n" +
    "      <th ng-repeat=\"label in labels track by $index\" class=\"text-center\"><small aria-label=\"{{label.full}}\">{{label.abbr}}</small></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat=\"row in rows track by $index\">\n" +
    "      <td ng-show=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n" +
    "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{dt.uid}}\" aria-disabled=\"{{!!dt.disabled}}\">\n" +
    "        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default btn-sm\" ng-class=\"{'btn-info': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"{'text-muted': dt.secondary, 'text-info': dt.current}\">{{dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module("template/datepicker/month.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/datepicker/month.html",
    "<table role=\"grid\" aria-labelledby=\"{{uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
    "      <th><button id=\"{{uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat=\"row in rows track by $index\">\n" +
    "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{dt.uid}}\" aria-disabled=\"{{!!dt.disabled}}\">\n" +
    "        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default\" ng-class=\"{'btn-info': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"{'text-info': dt.current}\">{{dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module("template/datepicker/popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/datepicker/popup.html",
    "<ul class=\"dropdown-menu\" ng-style=\"{display: (isOpen && 'block') || 'none', top: position.top+'px', left: position.left+'px'}\" ng-keydown=\"keydown($event)\">\n" +
    "	<li ng-transclude></li>\n" +
    "	<li ng-if=\"showButtonBar\" style=\"padding:10px 9px 2px\">\n" +
    "		<span class=\"btn-group pull-left\">\n" +
    "			<button type=\"button\" class=\"btn btn-sm btn-info\" ng-click=\"select('today')\">{{ getText('current') }}</button>\n" +
    "			<button type=\"button\" class=\"btn btn-sm btn-danger\" ng-click=\"select(null)\">{{ getText('clear') }}</button>\n" +
    "		</span>\n" +
    "		<button type=\"button\" class=\"btn btn-sm btn-success pull-right\" ng-click=\"close()\">{{ getText('close') }}</button>\n" +
    "	</li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("template/datepicker/year.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/datepicker/year.html",
    "<table role=\"grid\" aria-labelledby=\"{{uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
    "      <th colspan=\"3\"><button id=\"{{uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat=\"row in rows track by $index\">\n" +
    "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{dt.uid}}\" aria-disabled=\"{{!!dt.disabled}}\">\n" +
    "        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default\" ng-class=\"{'btn-info': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"{'text-info': dt.current}\">{{dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module("template/pagination/pager.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/pagination/pager.html",
    "<ul class=\"pager\">\n" +
    "  <li ng-class=\"{disabled: noPrevious(), previous: align}\"><a href ng-click=\"selectPage(page - 1)\">{{getText('previous')}}</a></li>\n" +
    "  <li ng-class=\"{disabled: noNext(), next: align}\"><a href ng-click=\"selectPage(page + 1)\">{{getText('next')}}</a></li>\n" +
    "</ul>");
}]);

angular.module("template/pagination/pagination.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/pagination/pagination.html",
    "<ul class=\"pagination\">\n" +
    "  <li ng-if=\"boundaryLinks\" ng-class=\"{disabled: noPrevious()}\"><a href ng-click=\"selectPage(1)\">{{getText('first')}}</a></li>\n" +
    "  <li ng-if=\"directionLinks\" ng-class=\"{disabled: noPrevious()}\"><a href ng-click=\"selectPage(page - 1)\">{{getText('previous')}}</a></li>\n" +
    "  <li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active}\"><a href ng-click=\"selectPage(page.number)\">{{page.text}}</a></li>\n" +
    "  <li ng-if=\"directionLinks\" ng-class=\"{disabled: noNext()}\"><a href ng-click=\"selectPage(page + 1)\">{{getText('next')}}</a></li>\n" +
    "  <li ng-if=\"boundaryLinks\" ng-class=\"{disabled: noNext()}\"><a href ng-click=\"selectPage(totalPages)\">{{getText('last')}}</a></li>\n" +
    "</ul>");
}]);

angular.module("template/tooltip/tooltip-html-unsafe-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/tooltip/tooltip-html-unsafe-popup.html",
    "<div class=\"tooltip {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
    "  <div class=\"tooltip-arrow\"></div>\n" +
    "  <div class=\"tooltip-inner\" bind-html-unsafe=\"content\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/tooltip/tooltip-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/tooltip/tooltip-popup.html",
    "<div class=\"tooltip {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
    "  <div class=\"tooltip-arrow\"></div>\n" +
    "  <div class=\"tooltip-inner\" ng-bind=\"content\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/popover/popover.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/popover/popover.html",
    "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
    "  <div class=\"arrow\"></div>\n" +
    "\n" +
    "  <div class=\"popover-inner\">\n" +
    "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-show=\"title\"></h3>\n" +
    "      <div class=\"popover-content\" ng-bind=\"content\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/timepicker/timepicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/timepicker/timepicker.html",
    "<table>\n" +
    "	<tbody>\n" +
    "		<tr class=\"text-center\">\n" +
    "			<td><a ng-click=\"incrementHours()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
    "			<td>&nbsp;</td>\n" +
    "			<td><a ng-click=\"incrementMinutes()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
    "			<td ng-show=\"showMeridian\"></td>\n" +
    "		</tr>\n" +
    "		<tr>\n" +
    "			<td style=\"width:50px;\" class=\"form-group\" ng-class=\"{'has-error': invalidHours}\">\n" +
    "				<input type=\"text\" ng-model=\"hours\" ng-change=\"updateHours()\" class=\"form-control text-center\" ng-mousewheel=\"incrementHours()\" ng-readonly=\"readonlyInput\" maxlength=\"2\">\n" +
    "			</td>\n" +
    "			<td>:</td>\n" +
    "			<td style=\"width:50px;\" class=\"form-group\" ng-class=\"{'has-error': invalidMinutes}\">\n" +
    "				<input type=\"text\" ng-model=\"minutes\" ng-change=\"updateMinutes()\" class=\"form-control text-center\" ng-readonly=\"readonlyInput\" maxlength=\"2\">\n" +
    "			</td>\n" +
    "			<td ng-show=\"showMeridian\"><button type=\"button\" class=\"btn btn-default text-center\" ng-click=\"toggleMeridian()\">{{meridian}}</button></td>\n" +
    "		</tr>\n" +
    "		<tr class=\"text-center\">\n" +
    "			<td><a ng-click=\"decrementHours()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
    "			<td>&nbsp;</td>\n" +
    "			<td><a ng-click=\"decrementMinutes()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
    "			<td ng-show=\"showMeridian\"></td>\n" +
    "		</tr>\n" +
    "	</tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module('ualib.ui.templates', ['page/templates/page-section.tpl.html', 'page/templates/page.tpl.html', 'tabs/templates/tab.tpl.html', 'tabs/templates/tabset.tpl.html']);

angular.module("page/templates/page-section.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("page/templates/page-section.tpl.html",
    "<div class=\"page-slice\" id=\"{{section}}\" ng-transclude>\n" +
    "</div>");
}]);

angular.module("page/templates/page.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("page/templates/page.tpl.html",
    "<div class=\"row\" ng-cloak>\n" +
    "    <div class=\"col-md-9\" ng-transclude></div>\n" +
    "  <div class=\"col-md-3 page-section-menu\">\n" +
    "    <div ui-scrollfix bound-by-parent class=\"hidden-sm hidden-xs\">\n" +
    "      <ul class=\"nav nav-pills nav-stacked\">\n" +
    "        <li ng-repeat=\"section in menu\" du-scrollspy=\"{{section.link}}\">\n" +
    "          <a ng-href=\"#{{section.link}}\" du-smooth-scroll>\n" +
    "            <span class=\"fa fa-fw\" ng-class=\"section.icon\" ng-if=\"section.icon\"></span>\n" +
    "            {{section.title}}\n" +
    "          </a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("tabs/templates/tab.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("tabs/templates/tab.tpl.html",
    "<li ng-class=\"{active: active, disabled: disabled}\">\n" +
    "    <a href ng-click=\"select()\" tab-heading-transclude>{{heading}}</a>\n" +
    "</li>");
}]);

angular.module("tabs/templates/tabset.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("tabs/templates/tabset.tpl.html",
    "<div ng-class=\"{'row tabset-vertical': vertical}\">\n" +
    "    <div ng-class=\"tabClass\">\n" +
    "        <ul class=\"nav nav-{{type || (vertical ? 'pills' : 'tabs')}}\" ng-class=\"{'nav-stacked': vertical, 'nav-justified': justified}\" ng-transclude></ul>\n" +
    "    </div>\n" +
    "    <div class=\"tab-content\" ng-class=\"contentClass\">\n" +
    "        <div class=\"tab-pane\"\n" +
    "             ng-repeat=\"tab in tabs\"\n" +
    "             ng-class=\"{active: tab.active}\"\n" +
    "             tab-content-transclude=\"tab\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module('ualib.ui', [
    'ui.bootstrap',
    'duScroll',
    'ualib.ui.templates'
])
    .value('duScrollBottomSpy', true)
    .value('duScrollOffset', 30);

angular.module('ualib.ui')
    //TODO: Write documentation and examples
    .directive('dropdownSticky', [function(){
        return {
            restrict: 'AC',
            link: function(scope, elm){
                elm.bind('click', function(ev){
                    ev.stopPropagation();
                });

                scope.$on('$destroy', function(){
                    elm.unbind('click');
                })
            }
        }
    }]);
//Straight up stolen from angular-bootstrap project - https://github.com/angular-ui/bootstrap/blob/master/src/dropdown/dropdown.js
angular.module('ualib.ui')

    .constant('dropdownConfig', {
        openClass: 'open'
    })

    .service('dropdownService', ['$document', function($document) {
        var openScope = null;

        this.open = function( dropdownScope ) {
            if ( !openScope ) {
                $document.bind('click', closeDropdown);
                $document.bind('keydown', escapeKeyBind);
            }

            if ( openScope && openScope !== dropdownScope ) {
                openScope.isOpen = false;
            }

            openScope = dropdownScope;
        };

        this.close = function( dropdownScope ) {
            if ( openScope === dropdownScope ) {
                openScope = null;
                $document.unbind('click', closeDropdown);
                $document.unbind('keydown', escapeKeyBind);
            }
        };

        var closeDropdown = function( evt ) {
            // This method may still be called during the same mouse event that
            // unbound this event handler. So check openScope before proceeding.
            if (!openScope) { return; }

            var toggleElement = openScope.getToggleElement();
            if ( evt && toggleElement && toggleElement[0].contains(evt.target) ) {
                return;
            }

            openScope.$apply(function() {
                openScope.isOpen = false;
            });
        };

        var escapeKeyBind = function( evt ) {
            if ( evt.which === 27 ) {
                openScope.focusToggleElement();
                closeDropdown();
            }
        };
    }])

    .controller('DropdownController', ['$scope', '$attrs', '$parse', 'dropdownConfig', 'dropdownService', '$animate', function($scope, $attrs, $parse, dropdownConfig, dropdownService, $animate) {
        var self = this,
            scope = $scope.$new(), // create a child scope so we are not polluting original one
            openClass = dropdownConfig.openClass,
            getIsOpen,
            setIsOpen = angular.noop,
            toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop;

        this.init = function( element ) {
            self.$element = element;

            if ( $attrs.isOpen ) {
                getIsOpen = $parse($attrs.isOpen);
                setIsOpen = getIsOpen.assign;

                $scope.$watch(getIsOpen, function(value) {
                    scope.isOpen = !!value;
                });
            }
        };

        this.toggle = function( open ) {
            return scope.isOpen = arguments.length ? !!open : !scope.isOpen;
        };

        // Allow other directives to watch status
        this.isOpen = function() {
            return scope.isOpen;
        };

        scope.getToggleElement = function() {
            return self.toggleElement;
        };

        scope.focusToggleElement = function() {
            if ( self.toggleElement ) {
                self.toggleElement[0].focus();
            }
        };

        scope.$watch('isOpen', function( isOpen, wasOpen ) {
            $animate[isOpen ? 'addClass' : 'removeClass'](self.$element, openClass);

            if ( isOpen ) {
                scope.focusToggleElement();
                dropdownService.open( scope );
            } else {
                dropdownService.close( scope );
            }

            setIsOpen($scope, isOpen);
            if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
                toggleInvoker($scope, { open: !!isOpen });
            }
        });

        $scope.$on('$locationChangeSuccess', function() {
            scope.isOpen = false;
        });

        $scope.$on('$destroy', function() {
            scope.$destroy();
        });
    }])

    .directive('dropdown', function() {
        return {
            restrict: 'AC',
            controller: 'DropdownController',
            link: function(scope, element, attrs, dropdownCtrl) {
                dropdownCtrl.init( element );
            }
        };
    })

    .directive('dropdownToggle', function() {
        return {
            restrict: 'AC',
            require: '?^dropdown',
            link: function(scope, element, attrs, dropdownCtrl) {
                if ( !dropdownCtrl ) {
                    return;
                }

                dropdownCtrl.toggleElement = element;

                var toggleDropdown = function(event) {
                    event.preventDefault();

                    if ( !element.hasClass('disabled') && !attrs.disabled ) {
                        scope.$apply(function() {
                            dropdownCtrl.toggle();
                        });
                    }
                };

                element.bind('click', toggleDropdown);

                // WAI-ARIA
                element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
                scope.$watch(dropdownCtrl.isOpen, function( isOpen ) {
                    element.attr('aria-expanded', !!isOpen);
                });

                scope.$on('$destroy', function() {
                    element.unbind('click', toggleDropdown);
                });
            }
        };
    });
angular.module('ualib.ui')

    .filter('highlight',[function() {
        return function(text, filterPhrase, strict) {
            if (filterPhrase && text) {
                var tag_re = /(<\S[^><]*>)/g;
                var tokens = strict ? filterPhrase : [].concat.apply([], filterPhrase.split('"').map(function(v,i){
                    return i%2 ? v : v.split(' ');
                })).filter(Boolean).join('|');

                var filter_re = new RegExp('(' + tokens + ')', 'gi');
                text = text.split(tag_re).map(function(string) {
                    if (string.match(tag_re)) {
                        return string;
                    } else {
                        return string.replace(filter_re,
                            '<span class="mark">$1</span>');
                    }
                }).join('');

            }
            return text;
        };
    }]);
angular.module('ualib.ui')

    .run(['$rootScope', '$document', '$location', '$timeout', function($rootScope, $document, $location, $timeout) {
        if(!window.history || !history.replaceState) {
            return;
        }

        $rootScope.$on('PageWithMenu:loaded', function(){
            var anchor = $location.hash() || $location.path().split('/')[1];
            if (anchor){
                $timeout(function(){
                    $document.scrollToElement(angular.element(document.getElementById(anchor)));
                }, 200);
            }
        });
        $rootScope.$on('duScrollspy:becameActive', function($event, $element, $target){
            //Automaticly update location
            var hash = $element.find('a').eq(0).prop('hash').substr(1);
            if (hash) {
                //history.replaceState(null, null, hash);
                if ($location.hash()){
                    $location.hash(hash);
                }
                else{
                    $location.path(hash);
                }
                $location.replace();
                $rootScope.$apply();
            }
        });
    }])

  .directive('pageWithMenu', [function(){
    return{
      restrict: 'C',
      transclude: true,
      replace: true,
      templateUrl: 'page/templates/page.tpl.html',
      controller: ['$scope', '$element', function($scope, $element){
        var menu = $scope.menu = [];
        this.addSection = function(section){
          menu.push(section);
        };

        $element.addClass('loaded');
      }]
    }
  }])

  .directive('pageSection', ['$rootScope', function($rootScope){
    return {
      require: '^pageWithMenu',
      restrict: 'EC',
      transclude: true,
        replace: true,
      scope: {
        title: '@',
        icon: '@'
      },
      templateUrl: 'page/templates/page-section.tpl.html',
      link: function(scope, elm, attrs, Ctrl){
        var titleElm = elm.find('h2')[0];
        if (titleElm){
            var title = angular.isDefined(scope.title) ? scope.title : titleElm.textContent;
            var icon = scope.icon || false;
            scope.section = title.replace(/[\s\-\\/"'&]+/g, '_');
            Ctrl.addSection({title: title, icon: icon, link: scope.section});
        }
          $rootScope.$broadcast('PageWithMenu:loaded');
      }
    }
  }]);
/**
 * Modified from ui-utils module - https://github.com/angular-ui/ui-utils
 *
 * This scroll fix preserves the fixed element's with
 */
/**
 * Adds a 'ui-scrollfix' class to the element when the page scrolls past it's position.
 * @param [offset] {int} optional Y-offset to override the detected offset.
 *   Takes 300 (absolute) or -300 or +300 (relative to detected)
 */
angular.module('ualib.ui').directive('uiScrollfix', [
    '$window',
    function ($window) {
        'use strict';
        function getWindowScrollTop() {
            if (angular.isDefined($window.pageYOffset)) {
                return $window.pageYOffset;
            } else {
                var iebody = document.compatMode && document.compatMode !== 'BackCompat' ? document.documentElement : document.body;
                return iebody.scrollTop;
            }
        }

        // Allows calculation of child elem offsets
        // borrowed from https://jsperf.com/offset-vs-getboundingclientrect/8
        function loopedOffset(elem) {
            var offsetLeft = elem.offsetLeft,
                offsetTop = elem.offsetTop;
            while (elem = elem.offsetParent) {
                offsetLeft += elem.offsetLeft;
                offsetTop += elem.offsetTop;
            }
            return {
                left: offsetLeft,
                top: offsetTop
            };
        }
        return {
            restrict: 'AC',
            require: '^?uiScrollfixTarget',
            link: function (scope, elm, attrs, uiScrollfixTarget) {
                var absolute = true,
                    shift = -80,
                    fixLimit = 0,
                    fixedOffsetTop = 0,
                    fluidWidth = attrs.hasOwnProperty('uiScrollfixFluidWidth'),
                    $target = uiScrollfixTarget && uiScrollfixTarget.$element || angular.element($window);
                var parent = angular.isDefined(attrs.boundByParent) ? elm.parent() : null;

                if (!attrs.uiScrollfix) {
                    absolute = false;
                } else if (typeof attrs.uiScrollfix === 'string') {

                    // charAt is generally faster than indexOf: http://jsperf.com/indexof-vs-charat
                    if (attrs.uiScrollfix.charAt(0) === '-') {
                        absolute = false;
                        shift = -parseFloat(attrs.uiScrollfix.substr(1));
                    } else if (attrs.uiScrollfix.charAt(0) === '+') {
                        absolute = false;
                        shift = parseFloat(attrs.uiScrollfix.substr(1));
                    }
                }
                fixLimit = absolute ? attrs.uiScrollfix : loopedOffset(elm[0]).top + shift;

                function onScroll() {
                    var limit = absolute ? attrs.uiScrollfix : loopedOffset(elm[0]).top + shift;
                    // if pageYOffset is defined use it, otherwise use other crap for IE
                    var offset = uiScrollfixTarget ? $target[0].scrollTop : getWindowScrollTop();

                    if (parent !== null){
                        //console.log(parent[0].offsetHeight+' + '+loopedOffset(parent[0]).top+' <= ('+offset+' + '+elm[0].offsetHeight+' + '+' + '+fixedOffsetTop+')');
                        if (parent[0].offsetHeight + loopedOffset(parent[0]).top <= (offset + elm[0].offsetHeight + fixedOffsetTop)){
                            elm.addClass('scrollfix-bottom-limit');

                        }
                        else if (elm.hasClass('scrollfix-bottom-limit')){
                            elm.removeClass('scrollfix-bottom-limit');
                        }
                    }

                    if (!elm.hasClass('scrollfix') && offset > limit) {
                        if (!fluidWidth){
                            var width = elm[0].offsetWidth;
                            elm.css('width', width + 'px');
                        }
                        elm.addClass('scrollfix');
                        fixLimit = limit;
                        fixedOffsetTop = elm[0].offsetTop;
                    } else if (elm.hasClass('scrollfix') && offset < fixLimit) {
                        elm.removeClass('scrollfix');
                        if (!fluidWidth){
                            elm.css('width', 'auto');
                        }
                        fixedOffsetTop = 0;
                    }
                }

                $target.on('scroll', onScroll);
                // Unbind scroll event handler when directive is removed
                scope.$on('$destroy', function () {
                    $target.off('scroll', onScroll);
                });
            }
        };
    }
]).directive('uiScrollfixTarget', [function () {
    'use strict';
    return {
        controller: [
            '$element',
            function ($element) {
                this.$element = $element;
            }
        ]
    };
}]);
/**
 * Adopted from UI Bootstrap
 * https://angular-ui.github.io/bootstrap/
 */

/**
 * @ngdoc overview
 * @name ui.bootstrap.tabs
 *
 * @description
 * AngularJS version of the tabs directive.
 */

angular.module('ualib.ui')

    .controller('TabsetController', ['$scope', function TabsetCtrl($scope) {
        var ctrl = this,
            tabs = ctrl.tabs = $scope.tabs = [];

        ctrl.select = function(selectedTab) {
            angular.forEach(tabs, function(tab) {
                if (tab.active && tab !== selectedTab) {
                    tab.active = false;
                    tab.onDeselect();
                }
            });
            selectedTab.active = true;
            selectedTab.onSelect();
        };

        ctrl.addTab = function addTab(tab) {
            tabs.push(tab);
            // we can't run the select function on the first tab
            // since that would select it twice
            if (tabs.length === 1 && tab.active !== false) {
                tab.active = true;
            } else if (tab.active) {
                ctrl.select(tab);
            }
            else {
                tab.active = false;
            }
        };

        ctrl.removeTab = function removeTab(tab) {
            var index = tabs.indexOf(tab);
            //Select a new tab if the tab to be removed is selected and not destroyed
            if (tab.active && tabs.length > 1 && !destroyed) {
                //If this is the last tab, select the previous tab. else, the next tab.
                var newActiveIndex = index == tabs.length - 1 ? index - 1 : index + 1;
                ctrl.select(tabs[newActiveIndex]);
            }
            tabs.splice(index, 1);
        };

        var destroyed;
        $scope.$on('$destroy', function() {
            destroyed = true;
        });
    }])

/**
 * @ngdoc directive
 * @name ui.bootstrap.tabs.directive:tabset
 * @restrict EA
 *
 * @description
 * Tabset is the outer container for the tabs directive
 *
 * @param {boolean=} vertical Whether or not to use vertical styling for the tabs.
 * @param {boolean=} justified Whether or not to use justified styling for the tabs.
 *
 * @example
 <example module="ui.bootstrap">
 <file name="index.html">
 <tabset>
 <tab heading="Tab 1"><b>First</b> Content!</tab>
 <tab heading="Tab 2"><i>Second</i> Content!</tab>
 </tabset>
 <hr />
 <tabset vertical="true">
 <tab heading="Vertical Tab 1"><b>First</b> Vertical Content!</tab>
 <tab heading="Vertical Tab 2"><i>Second</i> Vertical Content!</tab>
 </tabset>
 <tabset justified="true">
 <tab heading="Justified Tab 1"><b>First</b> Justified Content!</tab>
 <tab heading="Justified Tab 2"><i>Second</i> Justified Content!</tab>
 </tabset>
 </file>
 </example>
 */
    .directive('tabset', function() {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            scope: {
                type: '@',
                tabClass: '@',
                contentClass: '@'
            },
            controller: 'TabsetController',
            templateUrl: 'tabs/templates/tabset.tpl.html',
            link: function(scope, element, attrs) {
                scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
                scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : false;
            }
        };
    })

/**
 * @ngdoc directive
 * @name ui.bootstrap.tabs.directive:tab
 * @restrict EA
 *
 * @param {string=} heading The visible heading, or title, of the tab. Set HTML headings with {@link ui.bootstrap.tabs.directive:tabHeading tabHeading}.
 * @param {string=} select An expression to evaluate when the tab is selected.
 * @param {boolean=} active A binding, telling whether or not this tab is selected.
 * @param {boolean=} disabled A binding, telling whether or not this tab is disabled.
 *
 * @description
 * Creates a tab with a heading and content. Must be placed within a {@link ui.bootstrap.tabs.directive:tabset tabset}.
 *
 * @example
 <example module="ui.bootstrap">
 <file name="index.html">
 <div ng-controller="TabsDemoCtrl">
 <button class="btn btn-small" ng-click="items[0].active = true">
 Select item 1, using active binding
 </button>
 <button class="btn btn-small" ng-click="items[1].disabled = !items[1].disabled">
 Enable/disable item 2, using disabled binding
 </button>
 <br />
 <tabset>
 <tab heading="Tab 1">First Tab</tab>
 <tab select="alertMe()">
 <tab-heading><i class="icon-bell"></i> Alert me!</tab-heading>
 Second Tab, with alert callback and html heading!
 </tab>
 <tab ng-repeat="item in items"
 heading="{{item.title}}"
 disabled="item.disabled"
 active="item.active">
 {{item.content}}
 </tab>
 </tabset>
 </div>
 </file>
 <file name="script.js">
 function TabsDemoCtrl($scope) {
      $scope.items = [
        { title:"Dynamic Title 1", content:"Dynamic Item 0" },
        { title:"Dynamic Title 2", content:"Dynamic Item 1", disabled: true }
      ];

      $scope.alertMe = function() {
        setTimeout(function() {
          alert("You've selected the alert tab!");
        });
      };
    };
 </file>
 </example>
 */

/**
 * @ngdoc directive
 * @name ui.bootstrap.tabs.directive:tabHeading
 * @restrict EA
 *
 * @description
 * Creates an HTML heading for a {@link ui.bootstrap.tabs.directive:tab tab}. Must be placed as a child of a tab element.
 *
 * @example
 <example module="ui.bootstrap">
 <file name="index.html">
 <tabset>
 <tab>
 <tab-heading><b>HTML</b> in my titles?!</tab-heading>
 And some content, too!
 </tab>
 <tab>
 <tab-heading><i class="icon-heart"></i> Icon heading?!?</tab-heading>
 That's right.
 </tab>
 </tabset>
 </file>
 </example>
 */
    .directive('tab', ['$parse', function($parse) {
        return {
            require: '^tabset',
            restrict: 'EA',
            replace: true,
            templateUrl: 'tabs/templates/tab.tpl.html',
            transclude: true,
            scope: {
                active: '=?',
                heading: '@',
                onSelect: '&select', //This callback is called in contentHeadingTransclude
                //once it inserts the tab's content into the dom
                onDeselect: '&deselect'
            },
            controller: [function() {
                //Empty controller so other directives can require being 'under' a tab
            }],
            compile: function(elm, attrs, transclude) {
                return function postLink(scope, elm, attrs, tabsetCtrl) {
                    scope.$watch('active', function(active) {
                        if (active) {
                            tabsetCtrl.select(scope);
                        }
                    });

                    scope.disabled = false;
                    if ( attrs.disabled ) {
                        scope.$parent.$watch($parse(attrs.disabled), function(value) {
                            scope.disabled = !! value;
                        });
                    }

                    scope.select = function() {
                        if ( !scope.disabled ) {
                            scope.active = true;
                        }
                    };

                    tabsetCtrl.addTab(scope);
                    scope.$on('$destroy', function() {
                        tabsetCtrl.removeTab(scope);
                    });

                    //We need to transclude later, once the content container is ready.
                    //when this link happens, we're inside a tab heading.
                    scope.$transcludeFn = transclude;
                };
            }
        };
    }])

    .directive('tabHeadingTransclude', [function() {
        return {
            restrict: 'A',
            require: '^tab',
            link: function(scope, elm, attrs, tabCtrl) {
                scope.$watch('headingElement', function updateHeadingElement(heading) {
                    if (heading) {
                        elm.html('');
                        elm.append(heading);
                    }
                });
            }
        };
    }])

    .directive('tabContentTransclude', function() {
        return {
            restrict: 'A',
            require: '^tabset',
            link: function(scope, elm, attrs) {
                var tab = scope.$eval(attrs.tabContentTransclude);

                //Now our tab is ready to be transcluded: both the tab heading area
                //and the tab content area are loaded.  Transclude 'em both.
                tab.$transcludeFn(tab.$parent, function(contents) {
                    angular.forEach(contents, function(node) {
                        if (isTabHeading(node)) {
                            //Let tabHeadingTransclude know.
                            tab.headingElement = node;
                        } else {
                            elm.append(node);
                        }
                    });
                });
            }
        };
        function isTabHeading(node) {
            return node.tagName &&  (
                node.hasAttribute('tab-heading') ||
                node.hasAttribute('data-tab-heading') ||
                node.tagName.toLowerCase() === 'tab-heading' ||
                node.tagName.toLowerCase() === 'data-tab-heading'
                );
        }
    });
angular.module('databases.templates', ['databases/databases-list.tpl.html']);

angular.module("databases/databases-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("databases/databases-list.tpl.html",
    "<div class=\"jumbotron-header\">\n" +
    "    <div class=\"jumbotron\">\n" +
    "        <div class=\"container\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-sm-12\">\n" +
    "                    <ol class=\"breadcrumb\" typeof=\"BreadcrumbList\" vocab=\"http://schema.org/\">\n" +
    "                        <li><a title=\"Go to The University of Alabama Libraries.\" href=\"/#/home\" class=\"home\">The University of Alabama Libraries</a></li>\n" +
    "                        <li><a title=\"Go to News.\" href=\"/#/databases\" class=\"post post-page\">Databases</a></li>\n" +
    "                    </ol>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-7\">\n" +
    "                    <h1>Databases</h1>\n" +
    "                </div>\n" +
    "                <div class=\"hidden-xs col-md-5\">\n" +
    "                    <div class=\"well\">\n" +
    "                        <p class=\"lead\">Check out our database trials and tell us what you think!</p>\n" +
    "                        <a class=\"btn btn-primary\" href=\"/research-tools/e-resources/electronic-resource-trials/\" title=\"database trials\">See Trials <span class=\"fa fa-fw fa-eye\"></span></span></a>\n" +
    "                        <a class=\"btn btn-default\" href=\"/forms/electronic-resource-trial-evaluation-form/\" title=\"database trials evaluation form\">Evaluate <span class=\"fa fa-fw fa-check-square-o\"></span></span></a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-3 col-sm-push-9\">\n" +
    "            <form class=\"facets-form\">\n" +
    "                <div class=\"form-group\">\n" +
    "                <span class=\"page-header\">\n" +
    "                    <h4>Filter Databases By</h4>\n" +
    "                </span>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"db.search\" placeholder=\"Keyword search\">\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group hidden-xs\">\n" +
    "                    <h5>Title starts with</h5>\n" +
    "                    <div class=\"facet-group alphanum-group\">\n" +
    "                        <div class=\"btn-group\">\n" +
    "                            <label class=\"btn btn-default\" ng-repeat=\"na in numAlpha\" ng-model=\"db.startsWith\" btn-radio=\"'{{na}}'\" ng-disabled=\"startsWithDisabled[na]\" uncheckable>{{na}}</label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group hidden-xs\">\n" +
    "                    <h5>Subjects</h5>\n" +
    "                    <div class=\"facet-group\">\n" +
    "                        <div class=\"radio\" ng-class=\"{'disabled': subj.disabled}\" ng-repeat=\"subj in subjects\">\n" +
    "                            <label>\n" +
    "                                <input type=\"checkbox\" ng-model=\"db.subjects[subj.subject]\" ng-disabled=\"subj.disabled\">\n" +
    "                                {{subj.subject}} ({{subj.total}})\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group hidden-xs\">\n" +
    "                    <h5>Types</h5>\n" +
    "                    <div class=\"facet-group\">\n" +
    "                        <div class=\"radio\" ng-class=\"{'disabled': type.disabled}\" ng-repeat=\"type in types\">\n" +
    "                            <label>\n" +
    "                                <input type=\"checkbox\" ng-model=\"db.types[type.type]\"  ng-disabled=\"type.disabled\">\n" +
    "                                {{type.type}} ({{type.total}})\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <button type=\"button\" class=\"btn btn-block btn-primary\" ng-click=\"resetFilters()\"><span class=\"fa fa-fw fa-refresh\"></span> Reset filters</button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-9 col-sm-pull-3 databases-list-container\">\n" +
    "            <p>\n" +
    "            <h4 class=\"text-right\">Showing {{pager.firstItem}} - {{pager.lastItem}} of {{pager.totalItems}} results</h4>\n" +
    "            <div ng-if=\"!!activeFilters.startsWith || activeFilters.subjects || activeFilters.types\">\n" +
    "\n" +
    "                <ol class=\"breadcrumb facetcrumb\">\n" +
    "                    <li ng-if=\"!!activeFilters.startsWith\"><strong>Starts with:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"db.startsWith = ''\">\"{{db.startsWith}}\" <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "                    <li ng-if=\"activeFilters.subjects\"><strong>Subjects:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"db.subjects[subject] = false\" ng-repeat=\"(subject, key) in db.subjects\">{{subject}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "                    <li ng-if=\"activeFilters.types\"><strong>Types:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"db.types[type] = false\" ng-repeat=\"(type, key) in db.types\">{{type}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "                    <li class=\"pull-right\"><button type=\"button\" class=\"btn btn-primary btn-small reset-btn\" title=\"Reset filters\" ng-click=\"resetFilters()\"><i class=\"fa fa-refresh\"></i></button></li>\n" +
    "                </ol>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "            </p>\n" +
    "\n" +
    "            <div class=\"text-center\">\n" +
    "                <pagination class=\"pagination-sm\" ng-model=\"pager.page\" total-items=\"pager.totalItems\" max-size=\"pager.maxSize\" boundary-links=\"true\" rotate=\"false\" items-per-page=\"pager.perPage\" ng-change=\"pageChange()\" ng-if=\"pager.totalItems > pager.perPage\"></pagination>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"media animate-repeat\" ng-repeat=\"item in filteredDB | after:(pager.page-1)*pager.perPage | limitTo:20\">\n" +
    "                <div class=\"media-body\">\n" +
    "\n" +
    "                    <h4 class=\"media-heading\">\n" +
    "                        <a ng-href=\"{{item.url}}\" title=\"{{item.title}}\" ng-bind-html=\"item.title | highlight:db.search\"></a>\n" +
    "                        <!--<small ng-if=\"item.presentedBy\">({{item.presentedBy}})</small>-->\n" +
    "                        <small ng-bind-html=\"item.coverage | highlight:db.search\"></small>\n" +
    "\n" +
    "                        <small class=\"pull-right\">\n" +
    "                            <span class=\"label label-success\" ng-if=\"item.hasFullText == 'A'\">All Full Text</span>\n" +
    "                            <span class=\"label label-info\" ng-if=\"item.hasFullText == 'P'\">Primarily Full Text</span>\n" +
    "                            <span class=\"label label-warning\" ng-if=\"item.hasFullText == 'S'\">Some Full Text</span>\n" +
    "                            <span class=\"label label-danger\" ng-if=\"item.hasFullText == 'N'\">No Full Text</span>\n" +
    "                        </small>\n" +
    "                    </h4>\n" +
    "\n" +
    "                    <p class=\"text-justify\" ng-bind-html=\"item.description | highlight:db.search\"></p>\n" +
    "\n" +
    "                    <div ng-if=\"item.location\">\n" +
    "                        <strong>Access:</strong> {{item.location}}\n" +
    "                    </div>\n" +
    "                    <div class=\"databases-details\" ng-if=\"(item.subjects | where:{type:1}).length > 0\">\n" +
    "                        <strong>Primary subjects: </strong>\n" +
    "                        <span ng-repeat=\"subj in item.subjects | where:{type:1}\" ng-bind-html=\"subj.subject | highlight:db.search\"></span>\n" +
    "                    </div>\n" +
    "                    <div class=\"databases-details\" ng-if=\"item.types\">\n" +
    "                        <strong>Types of material: </strong>\n" +
    "                        <span ng-repeat=\"type in item.types\" ng-bind-html=\"type.type | highlight:db.search\"></span>\n" +
    "                    </div>\n" +
    "                    <div class=\"databases-details\" ng-if=\"item.vendor\">\n" +
    "                        <strong>Vendor: </strong>\n" +
    "                        <span ng-bind-html=\"item.vendor | highlight:db.search\"></span>\n" +
    "                    </div>\n" +
    "                    <div class=\"scout-coverage\">\n" +
    "                        <strong>Scout coverage: </strong>\n" +
    "                    <span class=\"fa text-info\" ng-class=\"{'fa-circle': item.notInEDS == 'Y', 'fa-adjust': item.notInEDS == 'P', 'fa-circle-o': !item.notInEDS}\">\n" +
    "                    </span>\n" +
    "                        <span ng-if=\"item.notInEDS == 'Y'\">Full</span>\n" +
    "                        <span  ng-if=\"item.notInEDS == 'P'\">Partial</span>\n" +
    "                        <span  ng-if=\"!item.notInEDS\">Not in Scout</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"text-center\">\n" +
    "                <pagination class=\"pagination-sm\" ng-model=\"pager.page\" total-items=\"pager.totalItems\" max-size=\"pager.maxSize\" boundary-links=\"true\" rotate=\"false\" items-per-page=\"pager.perPage\" ng-change=\"pageChange()\" ng-if=\"pager.totalItems > pager.perPage\"></pagination>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"alert alert-warning text-center\" role=\"alert\" ng-show=\"pager.totalItems < 1\">\n" +
    "                <h2>No results found <span ng-if=\"db.search\"> for \"{{db.search}}\"</span></h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

/**
 * @ngdoc overview
 * @name index
 *
 * @description
 * # Databases app UI.
 *
 * ## Default route: [/#/databases](http://www.lib.ua.edu/#/databases)
 */

/**
 * @ngdoc overview
 * @name databases
 *
 *
 * @requires ngRoute
 * @requires ngResource
 * @requires ngAnimate
 * @requires ngSanitize
 * @requires ui-bootstrap
 * @requires angular-filter
 * @requires duScroll
 * @requires ualib-ui
 *
 * @description
 * # Databases app UI.
 * ## Default route: [/#/databases](http://www.lib.ua.edu/#/databases)
 */

angular.module('ualib.databases', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngSanitize',
    'ui.bootstrap',
    'angular.filter',
    'duScroll',
    'ualib.ui',
    'databases.templates'
])
    /**
     * @ngdoc object
     * @name databases.constant:DB_PROXY_PREPEND_URL
     *
     * @description
     * Proxy URL to prefix database links
     *
     * | constant | value |
     * |----------|-------|
     * | DB_PROXY_PREPEND_URL | http://libdata.lib.ua.edu/login?url= |
     *
     */
    .constant('DB_PROXY_PREPEND_URL', 'http://libdata.lib.ua.edu/login?url=');




angular.module('ualib.databases')

/**
 * @ngdoc service
 * @name databases.databasesFactory
 *
 * @requires $resource
 * @requires $http
 * @requires $filter
 * @requires databases.constant:DB_PROXY_PREPEND_URL
 *
 * @description
 * Factory service to retrieve databases from the API.
 *
 */
    .factory('databasesFactory', ['$resource', '$http', '$filter', 'DB_PROXY_PREPEND_URL', function($resource, $http, $filter, DB_PROXY_PREPEND_URL){

        //TODO: centralize this function so it can be used with all apps

        /**
         * @ngdoc function
         * @name databases.databasesFactory#appendTransform
         * @methodOf databases.databasesFactory
         *
         * @param {Array.<function()>} defaults Default `Array` of `$http` transform response transform functions from Angular - will always be `$http.defaults.transformResponse`
         * @param {function()} transform Transform function to extend the `$http.defaults.transformResponse` Array with.
         *
         * @description
         * <span class="label label-warning">Private</span>
         * Extend the default responseTransform array - Straight from Angular 1.2.8 API docs - https://docs.angularjs.org/api/ng/service/$http#overriding-the-default-transformations-per-request
         *
         * Doing this allows custom modifications of the JSON response from the API to be cached after the initial `$resource` call, instead of
         * performing these modifications on every `$digest()` cycle (e.g., make modifications once, instead of every time the databases list is refreshed).
         *
         * @returns {Array.<function()>} Returns the new `transformResponse` Array
         */
        function appendTransform(defaults, transform) {

            // We can't guarantee that the default transformation is an array
            defaults = angular.isArray(defaults) ? defaults : [defaults];
            //console.log(defaults.concat(transform));
            // Append the new transformation to the defaults
            return defaults.concat(transform);
        }

        return $resource('//wwwdev2.lib.ua.edu/databases/api/:db', {db: 'all'}, {
            get: {
                cache: true,
                method: 'GET',
                transformResponse: appendTransform($http.defaults.transformResponse, function(data){
                    var db = angular.fromJson(data);

                    //Pre sort databases by title
                    var databases = $filter('orderBy')(db.databases, 'title');
                    // Set position for stable sort
                    angular.forEach(databases, function(db, i){
                        var access;

                        switch (databases[i].location){
                            case 'UA':
                                access = 'On campus only';
                                break;
                            case 'UA, Remote':
                                access = 'myBama login required off campus';
                                break;
                            case 'www':
                            case 'WWW':
                                access = false;
                                break;
                            default:
                                access = databases[i].location;
                        }

                        if (databases[i].auth == "1"){
                            databases[i].url = DB_PROXY_PREPEND_URL + databases[i].url;
                        }

                        databases[i].access = access;
                        databases[i].position = i;
                        databases[i].inScout = databases[i].notInEDS === 'Y';

                    });
                    db.databases = databases;
                    return db;
                })
            }
        });
    }]);
angular.module('ualib.databases')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/databases', {
                reloadOnSearch: false,
                resolve: {
                    databases: function(databasesFactory){
                        return databasesFactory.get({db: 'active'})
                            .$promise.then(function(data){
                                return data;
                            }, function(data, status, headers, config) {
                                console.log('ERROR: databases');
                                console.log({
                                    data: data,
                                    status: status,
                                    headers: headers,
                                    config: config
                                });
                            });
                    }
                },
                templateUrl: 'databases/databases-list.tpl.html',
                controller: 'DatabasesListCtrl'
            });
    }])

    /**
     * @ngdoc controller
     * @name databases.Controller:DatabasesListCtrl
     *
     * @requires $scope
     * @requires $filter
     * @requires $location
     * @requires $document
     * @requires databases.databasesFactory
     *
     *
     * @description
     * Controller for the databases route (`/#/databases`)
     */

    .controller('DatabasesListCtrl', ['$scope', 'databases', '$filter' ,'$location' ,'$document', function($scope, db, $filter, $location, $document){
        var databases = [];

        /**
         * @ngdoc object
         * @name databases.Controller:DatabasesListCtrl:$scope.numAlpha
         * @propertyOf databases.Controller:DatabasesListCtrl
         *
         * @description
         * `Array` of characters `a-z` for `Starts With` filter UI
         */
        $scope.numAlpha = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
        $scope.numAlpha.unshift('0-9');

        db.$promise.then(function(data){
            databases = data.databases;

            $scope.subjects = data.subjects;
            $scope.types = data.types;

            $scope.resetFilters();
            paramsToScope();

            $scope.totalItems = data.totalRecords;
            processStartsWith(databases);
            processFacets(databases);
        });

        $scope.$on('$locationChangeSuccess', function(){
            paramsToScope();
        });

        var filterWatcher = $scope.$watch('db', function(newVal, oldVal){
            var filtered = databases;

            filtered = $filter('filter')(filtered, filterBySubject);
            filtered = $filter('filter')(filtered, filterByType);


            //if (newVal.search && newVal.search.length > 2){
                filtered = $filter('filter')(filtered, newVal.search, simpleSearch);
            //}

            if (newVal.startsWith){
                var sw = newVal.startsWith.indexOf('-') == -1 ? "^"+newVal.startsWith+".+$" : '^['+newVal.startsWith+'].+$';

                filtered = $filter('filter')(filtered, function(item){
                    return $filter('test')(item.title, sw, 'i');
                });
            }

            filtered.sort(function(a, b){
                var aNum = countPrimarySubjects(a, newVal.subjects);
                var bNum = countPrimarySubjects(b, newVal.subjects);

                if (aNum === bNum){
                    return a.position - b.position;
                }
                if (aNum > bNum){
                    return -1;
                }
                return 1;
            });

            $scope.filteredDB = filtered;
            updatePager();

            var newParams = angular.extend({}, newVal);

            processFacets(filtered);
            scopeToParams(newParams);
        }, true);

        function simpleSearch(obj, text) {
            if (text){
                text = (''+text).toLowerCase();
                var tokens = [].concat.apply([], text.split('"').map(function(v,i){
                    return i%2 ? v : v.split(' ');
                })).filter(Boolean);

                var matched = tokens.filter(function(token){
                    return (''+obj).toLowerCase().indexOf(token) > -1;
                });

                return matched.length === tokens.length;
            }
            return true;
        }

        function updatePager(){
            $scope.pager.totalItems = $scope.filteredDB.length;
            var numPages =  Math.floor($scope.pager.totalItems / $scope.pager.maxSize);
            if (numPages < $scope.pager.page){
                $scope.pager.page = numPages || 1;
            }
            $scope.pager.firstItem = ($scope.pager.page-1)*$scope.pager.perPage+1;
            $scope.pager.lastItem = Math.min($scope.pager.totalItems, ($scope.pager.page * $scope.pager.perPage));

        }


        function filterBySubject(item){
            var subjects = Object.keys($scope.db.subjects).filter(function(key){
                return $scope.db.subjects[key];
            });

            return item.subjects.filter(function(itemSubj){
                    return $scope.db.subjects[itemSubj.subject];
                }).length === subjects.length;
        }

        function filterByType(item){
            var types = Object.keys($scope.db.types).filter(function(key){
                return $scope.db.types[key];
            });

            return item.types.filter(function(itemSubj){
                    return $scope.db.types[itemSubj.type];
                }).length === types.length;
        }

        $scope.resetFilters = function(){
            $scope.db = {
                subjects: {},
                types: {},
                search: '',
                startsWith: ''
            };
            $scope.pager = {
                page: 1,
                perPage: 20,
                maxSize: 10,
                totalItems: 0
            };
        };

        $scope.pageChange = function(){
            updatePager();
            scopeToParams({page: $scope.pager.page});
            $document.duScrollTo(0, 30, 500, function (t) { return (--t)*t*t+1; });
        };

        $scope.$on('$destroy', function(){
            filterWatcher();
        });

        function processFacets(databases){
            var subjAvail = [];
            var subjCount = {};

            var typeAvail = [];
            var typeCount = {};

            function processFacetsSubj(subj){
                if (subjAvail.indexOf(subj.sid) == -1){
                    subjAvail.push(subj.sid);
                    subjCount[subj.sid] = 1;
                }
                else{
                    subjCount[subj.sid]++;
                }
            }

            function processFacetsType(type){
                if (typeAvail.indexOf(type.tid) == -1){
                    typeAvail.push(type.tid);
                    typeCount[type.tid] = 1;
                }
                else{
                    typeCount[type.tid]++;
                }
            }


            for (var i = 0, len = databases.length; i < len; i++){
                databases[i].subjects.map(processFacetsSubj);
                databases[i].types.map(processFacetsType);
            }

            $scope.subjects.map(function(subject){
                var s = subject;
                s.disabled = subjAvail.indexOf(s.sid) == -1;
                s.total = subjCount[subject.sid] || 0;
                return s;
            });

            $scope.types.map(function(type){
                var t = type;
                t.disabled = typeAvail.indexOf(t.tid) == -1;
                t.total = typeCount[type.tid] || 0;
                return t;
            });
        }



        function processStartsWith(databases){
            $scope.startsWithDisabled = {};

            $scope.numAlpha.map(function(startsWith){
                var sw = startsWith.indexOf('-') == -1 ? "^"+startsWith+".+$" : '^['+startsWith+'].+$';
                for (var i = 0, len = databases.length; i < len; i++){
                    if ($filter('test')(databases[i].title, sw, 'i')){
                        return;
                    }
                }
                $scope.startsWithDisabled[startsWith] = true;
            });
        }

        function countPrimarySubjects(db, subjects){
            return db.subjects.filter(function(subj){
                return (parseInt(subj.type) === 1 && subjects[subj.subject]);
            }).length;
        }

        function scopeToParams(scopeVals){
            angular.forEach(scopeVals, function(val, key){
                var newParam = {};

                if (angular.isDefined(val) && val !== ''){
                    if (angular.isObject(val)){
                        val = Object.keys(val).filter(function(f){
                            return val[f];
                        }).join(",");
                       if (val.length > 0){
                           $location.search(key, val);
                       }
                       else{
                           $location.search(key, null);
                       }
                    }
                    else {
                        $location.search(key, val);
                    }
                    /*else if (!(key === 'search' && val.length < 3)){
                        $location.search(key, val);
                    }
                    else{
                        $location.search(key, null);
                    }*/
                }
                else{
                    $location.search(key, null);
                }
            });
        }

        function paramsToScope(){
            var params = $location.search();
            var scopeFacets = {};
            angular.copy($scope.db, scopeFacets);
            //console.log(params);
            $scope.activeFilters = params;

            if (params.page){
                $scope.pager.page = params.page;
            }

            angular.forEach(scopeFacets, function(val, key){

                if (angular.isDefined(params[key])){

                    if (key == 'subjects' || key == 'types'){
                        var filters = {};
                        params[key].split(',').forEach(function(filter){
                            filters[filter] = true;
                        });
                        scopeFacets[key] = filters;
                    }
                    else{
                        scopeFacets[key] = params[key];
                    }
                }
                else{
                    scopeFacets[key] = angular.isObject(val) ? {} : '';
                }
            });
            $scope.db = scopeFacets;
        }

    }]);


/**
 * oclazyload - Load modules on demand (lazy load) with angularJS
 * @version v1.0.9
 * @link https://github.com/ocombe/ocLazyLoad
 * @license MIT
 * @author Olivier Combe <olivier.combe@gmail.com>
 */
(function (angular, window) {
    'use strict';

    var regModules = ['ng', 'oc.lazyLoad'],
        regInvokes = {},
        regConfigs = [],
        modulesToLoad = [],
        // modules to load from angular.module or other sources
    realModules = [],
        // real modules called from angular.module
    recordDeclarations = [],
        broadcast = angular.noop,
        runBlocks = {},
        justLoaded = [];

    var ocLazyLoad = angular.module('oc.lazyLoad', ['ng']);

    ocLazyLoad.provider('$ocLazyLoad', ["$controllerProvider", "$provide", "$compileProvider", "$filterProvider", "$injector", "$animateProvider", function ($controllerProvider, $provide, $compileProvider, $filterProvider, $injector, $animateProvider) {
        var modules = {},
            providers = {
            $controllerProvider: $controllerProvider,
            $compileProvider: $compileProvider,
            $filterProvider: $filterProvider,
            $provide: $provide, // other things (constant, decorator, provider, factory, service)
            $injector: $injector,
            $animateProvider: $animateProvider
        },
            debug = false,
            events = false,
            moduleCache = [],
            modulePromises = {};

        moduleCache.push = function (value) {
            if (this.indexOf(value) === -1) {
                Array.prototype.push.apply(this, arguments);
            }
        };

        this.config = function (config) {
            // If we want to define modules configs
            if (angular.isDefined(config.modules)) {
                if (angular.isArray(config.modules)) {
                    angular.forEach(config.modules, function (moduleConfig) {
                        modules[moduleConfig.name] = moduleConfig;
                    });
                } else {
                    modules[config.modules.name] = config.modules;
                }
            }

            if (angular.isDefined(config.debug)) {
                debug = config.debug;
            }

            if (angular.isDefined(config.events)) {
                events = config.events;
            }
        };

        /**
         * Get the list of existing registered modules
         * @param element
         */
        this._init = function _init(element) {
            // this is probably useless now because we override angular.bootstrap
            if (modulesToLoad.length === 0) {
                var elements = [element],
                    names = ['ng:app', 'ng-app', 'x-ng-app', 'data-ng-app'],
                    NG_APP_CLASS_REGEXP = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/,
                    append = function append(elm) {
                    return elm && elements.push(elm);
                };

                angular.forEach(names, function (name) {
                    names[name] = true;
                    append(document.getElementById(name));
                    name = name.replace(':', '\\:');
                    if (typeof element[0] !== 'undefined' && element[0].querySelectorAll) {
                        angular.forEach(element[0].querySelectorAll('.' + name), append);
                        angular.forEach(element[0].querySelectorAll('.' + name + '\\:'), append);
                        angular.forEach(element[0].querySelectorAll('[' + name + ']'), append);
                    }
                });

                angular.forEach(elements, function (elm) {
                    if (modulesToLoad.length === 0) {
                        var className = ' ' + element.className + ' ';
                        var match = NG_APP_CLASS_REGEXP.exec(className);
                        if (match) {
                            modulesToLoad.push((match[2] || '').replace(/\s+/g, ','));
                        } else {
                            angular.forEach(elm.attributes, function (attr) {
                                if (modulesToLoad.length === 0 && names[attr.name]) {
                                    modulesToLoad.push(attr.value);
                                }
                            });
                        }
                    }
                });
            }

            if (modulesToLoad.length === 0 && !((window.jasmine || window.mocha) && angular.isDefined(angular.mock))) {
                console.error('No module found during bootstrap, unable to init ocLazyLoad. You should always use the ng-app directive or angular.boostrap when you use ocLazyLoad.');
            }

            var addReg = function addReg(moduleName) {
                if (regModules.indexOf(moduleName) === -1) {
                    // register existing modules
                    regModules.push(moduleName);
                    var mainModule = angular.module(moduleName);

                    // register existing components (directives, services, ...)
                    _invokeQueue(null, mainModule._invokeQueue, moduleName);
                    _invokeQueue(null, mainModule._configBlocks, moduleName); // angular 1.3+

                    angular.forEach(mainModule.requires, addReg);
                }
            };

            angular.forEach(modulesToLoad, function (moduleName) {
                addReg(moduleName);
            });

            modulesToLoad = []; // reset for next bootstrap
            recordDeclarations.pop(); // wait for the next lazy load
        };

        /**
         * Like JSON.stringify but that doesn't throw on circular references
         * @param obj
         */
        var stringify = function stringify(obj) {
            try {
                return JSON.stringify(obj);
            } catch (e) {
                var cache = [];
                return JSON.stringify(obj, function (key, value) {
                    if (angular.isObject(value) && value !== null) {
                        if (cache.indexOf(value) !== -1) {
                            // Circular reference found, discard key
                            return;
                        }
                        // Store value in our collection
                        cache.push(value);
                    }
                    return value;
                });
            }
        };

        var hashCode = function hashCode(str) {
            var hash = 0,
                i,
                chr,
                len;
            if (str.length == 0) {
                return hash;
            }
            for (i = 0, len = str.length; i < len; i++) {
                chr = str.charCodeAt(i);
                hash = (hash << 5) - hash + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        };

        function _register(providers, registerModules, params) {
            if (registerModules) {
                var k,
                    moduleName,
                    moduleFn,
                    tempRunBlocks = [];
                for (k = registerModules.length - 1; k >= 0; k--) {
                    moduleName = registerModules[k];
                    if (!angular.isString(moduleName)) {
                        moduleName = getModuleName(moduleName);
                    }
                    if (!moduleName || justLoaded.indexOf(moduleName) !== -1 || modules[moduleName] && realModules.indexOf(moduleName) === -1) {
                        continue;
                    }
                    // new if not registered
                    var newModule = regModules.indexOf(moduleName) === -1;
                    moduleFn = ngModuleFct(moduleName);
                    if (newModule) {
                        regModules.push(moduleName);
                        _register(providers, moduleFn.requires, params);
                    }
                    if (moduleFn._runBlocks.length > 0) {
                        // new run blocks detected! Replace the old ones (if existing)
                        runBlocks[moduleName] = [];
                        while (moduleFn._runBlocks.length > 0) {
                            runBlocks[moduleName].push(moduleFn._runBlocks.shift());
                        }
                    }
                    if (angular.isDefined(runBlocks[moduleName]) && (newModule || params.rerun)) {
                        tempRunBlocks = tempRunBlocks.concat(runBlocks[moduleName]);
                    }
                    _invokeQueue(providers, moduleFn._invokeQueue, moduleName, params.reconfig);
                    _invokeQueue(providers, moduleFn._configBlocks, moduleName, params.reconfig); // angular 1.3+
                    broadcast(newModule ? 'ocLazyLoad.moduleLoaded' : 'ocLazyLoad.moduleReloaded', moduleName);
                    registerModules.pop();
                    justLoaded.push(moduleName);
                }
                // execute the run blocks at the end
                var instanceInjector = providers.getInstanceInjector();
                angular.forEach(tempRunBlocks, function (fn) {
                    instanceInjector.invoke(fn);
                });
            }
        }

        function _registerInvokeList(args, moduleName) {
            var invokeList = args[2][0],
                type = args[1],
                newInvoke = false;
            if (angular.isUndefined(regInvokes[moduleName])) {
                regInvokes[moduleName] = {};
            }
            if (angular.isUndefined(regInvokes[moduleName][type])) {
                regInvokes[moduleName][type] = {};
            }
            var onInvoke = function onInvoke(invokeName, invoke) {
                if (!regInvokes[moduleName][type].hasOwnProperty(invokeName)) {
                    regInvokes[moduleName][type][invokeName] = [];
                }
                if (checkHashes(invoke, regInvokes[moduleName][type][invokeName])) {
                    newInvoke = true;
                    regInvokes[moduleName][type][invokeName].push(invoke);
                    broadcast('ocLazyLoad.componentLoaded', [moduleName, type, invokeName]);
                }
            };

            function checkHashes(potentialNew, invokes) {
                var isNew = true,
                    newHash;
                if (invokes.length) {
                    newHash = signature(potentialNew);
                    angular.forEach(invokes, function (invoke) {
                        isNew = isNew && signature(invoke) !== newHash;
                    });
                }
                return isNew;
            }

            function signature(data) {
                if (angular.isArray(data)) {
                    // arrays are objects, we need to test for it first
                    return hashCode(data.toString());
                } else if (angular.isObject(data)) {
                    // constants & values for example
                    return hashCode(stringify(data));
                } else {
                    if (angular.isDefined(data) && data !== null) {
                        return hashCode(data.toString());
                    } else {
                        // null & undefined constants
                        return data;
                    }
                }
            }

            if (angular.isString(invokeList)) {
                onInvoke(invokeList, args[2][1]);
            } else if (angular.isObject(invokeList)) {
                angular.forEach(invokeList, function (invoke, key) {
                    if (angular.isString(invoke)) {
                        // decorators for example
                        onInvoke(invoke, invokeList[1]);
                    } else {
                        // components registered as object lists {"componentName": function() {}}
                        onInvoke(key, invoke);
                    }
                });
            } else {
                return false;
            }
            return newInvoke;
        }

        function _invokeQueue(providers, queue, moduleName, reconfig) {
            if (!queue) {
                return;
            }

            var i, len, args, provider;
            for (i = 0, len = queue.length; i < len; i++) {
                args = queue[i];
                if (angular.isArray(args)) {
                    if (providers !== null) {
                        if (providers.hasOwnProperty(args[0])) {
                            provider = providers[args[0]];
                        } else {
                            throw new Error('unsupported provider ' + args[0]);
                        }
                    }
                    var isNew = _registerInvokeList(args, moduleName);
                    if (args[1] !== 'invoke') {
                        if (isNew && angular.isDefined(provider)) {
                            provider[args[1]].apply(provider, args[2]);
                        }
                    } else {
                        // config block
                        var callInvoke = function callInvoke(fct) {
                            var invoked = regConfigs.indexOf(moduleName + '-' + fct);
                            if (invoked === -1 || reconfig) {
                                if (invoked === -1) {
                                    regConfigs.push(moduleName + '-' + fct);
                                }
                                if (angular.isDefined(provider)) {
                                    provider[args[1]].apply(provider, args[2]);
                                }
                            }
                        };
                        if (angular.isFunction(args[2][0])) {
                            callInvoke(args[2][0]);
                        } else if (angular.isArray(args[2][0])) {
                            for (var j = 0, jlen = args[2][0].length; j < jlen; j++) {
                                if (angular.isFunction(args[2][0][j])) {
                                    callInvoke(args[2][0][j]);
                                }
                            }
                        }
                    }
                }
            }
        }

        function getModuleName(module) {
            var moduleName = null;
            if (angular.isString(module)) {
                moduleName = module;
            } else if (angular.isObject(module) && module.hasOwnProperty('name') && angular.isString(module.name)) {
                moduleName = module.name;
            }
            return moduleName;
        }

        function moduleExists(moduleName) {
            if (!angular.isString(moduleName)) {
                return false;
            }
            try {
                return ngModuleFct(moduleName);
            } catch (e) {
                if (/No module/.test(e) || e.message.indexOf('$injector:nomod') > -1) {
                    return false;
                }
            }
        }

        this.$get = ["$log", "$rootElement", "$rootScope", "$cacheFactory", "$q", function ($log, $rootElement, $rootScope, $cacheFactory, $q) {
            var instanceInjector,
                filesCache = $cacheFactory('ocLazyLoad');

            if (!debug) {
                $log = {};
                $log['error'] = angular.noop;
                $log['warn'] = angular.noop;
                $log['info'] = angular.noop;
            }

            // Make this lazy because when $get() is called the instance injector hasn't been assigned to the rootElement yet
            providers.getInstanceInjector = function () {
                return instanceInjector ? instanceInjector : instanceInjector = $rootElement.data('$injector') || angular.injector();
            };

            broadcast = function broadcast(eventName, params) {
                if (events) {
                    $rootScope.$broadcast(eventName, params);
                }
                if (debug) {
                    $log.info(eventName, params);
                }
            };

            function reject(e) {
                var deferred = $q.defer();
                $log.error(e.message);
                deferred.reject(e);
                return deferred.promise;
            }

            return {
                _broadcast: broadcast,

                _$log: $log,

                /**
                 * Returns the files cache used by the loaders to store the files currently loading
                 * @returns {*}
                 */
                _getFilesCache: function getFilesCache() {
                    return filesCache;
                },

                /**
                 * Let the service know that it should monitor angular.module because files are loading
                 * @param watch boolean
                 */
                toggleWatch: function toggleWatch(watch) {
                    if (watch) {
                        recordDeclarations.push(true);
                    } else {
                        recordDeclarations.pop();
                    }
                },

                /**
                 * Let you get a module config object
                 * @param moduleName String the name of the module
                 * @returns {*}
                 */
                getModuleConfig: function getModuleConfig(moduleName) {
                    if (!angular.isString(moduleName)) {
                        throw new Error('You need to give the name of the module to get');
                    }
                    if (!modules[moduleName]) {
                        return null;
                    }
                    return angular.copy(modules[moduleName]);
                },

                /**
                 * Let you define a module config object
                 * @param moduleConfig Object the module config object
                 * @returns {*}
                 */
                setModuleConfig: function setModuleConfig(moduleConfig) {
                    if (!angular.isObject(moduleConfig)) {
                        throw new Error('You need to give the module config object to set');
                    }
                    modules[moduleConfig.name] = moduleConfig;
                    return moduleConfig;
                },

                /**
                 * Returns the list of loaded modules
                 * @returns {string[]}
                 */
                getModules: function getModules() {
                    return regModules;
                },

                /**
                 * Let you check if a module has been loaded into Angular or not
                 * @param modulesNames String/Object a module name, or a list of module names
                 * @returns {boolean}
                 */
                isLoaded: function isLoaded(modulesNames) {
                    var moduleLoaded = function moduleLoaded(module) {
                        var isLoaded = regModules.indexOf(module) > -1;
                        if (!isLoaded) {
                            isLoaded = !!moduleExists(module);
                        }
                        return isLoaded;
                    };
                    if (angular.isString(modulesNames)) {
                        modulesNames = [modulesNames];
                    }
                    if (angular.isArray(modulesNames)) {
                        var i, len;
                        for (i = 0, len = modulesNames.length; i < len; i++) {
                            if (!moduleLoaded(modulesNames[i])) {
                                return false;
                            }
                        }
                        return true;
                    } else {
                        throw new Error('You need to define the module(s) name(s)');
                    }
                },

                /**
                 * Given a module, return its name
                 * @param module
                 * @returns {String}
                 */
                _getModuleName: getModuleName,

                /**
                 * Returns a module if it exists
                 * @param moduleName
                 * @returns {module}
                 */
                _getModule: function getModule(moduleName) {
                    try {
                        return ngModuleFct(moduleName);
                    } catch (e) {
                        // this error message really suxx
                        if (/No module/.test(e) || e.message.indexOf('$injector:nomod') > -1) {
                            e.message = 'The module "' + stringify(moduleName) + '" that you are trying to load does not exist. ' + e.message;
                        }
                        throw e;
                    }
                },

                /**
                 * Check if a module exists and returns it if it does
                 * @param moduleName
                 * @returns {boolean}
                 */
                moduleExists: moduleExists,

                /**
                 * Load the dependencies, and might try to load new files depending on the config
                 * @param moduleName (String or Array of Strings)
                 * @param localParams
                 * @returns {*}
                 * @private
                 */
                _loadDependencies: function _loadDependencies(moduleName, localParams) {
                    var loadedModule,
                        requires,
                        diff,
                        promisesList = [],
                        self = this;

                    moduleName = self._getModuleName(moduleName);

                    if (moduleName === null) {
                        return $q.when();
                    } else {
                        try {
                            loadedModule = self._getModule(moduleName);
                        } catch (e) {
                            return reject(e);
                        }
                        // get unloaded requires
                        requires = self.getRequires(loadedModule);
                    }

                    angular.forEach(requires, function (requireEntry) {
                        // If no configuration is provided, try and find one from a previous load.
                        // If there isn't one, bail and let the normal flow run
                        if (angular.isString(requireEntry)) {
                            var config = self.getModuleConfig(requireEntry);
                            if (config === null) {
                                moduleCache.push(requireEntry); // We don't know about this module, but something else might, so push it anyway.
                                return;
                            }
                            requireEntry = config;
                            // ignore the name because it's probably not a real module name
                            config.name = undefined;
                        }

                        // Check if this dependency has been loaded previously
                        if (self.moduleExists(requireEntry.name)) {
                            // compare against the already loaded module to see if the new definition adds any new files
                            diff = requireEntry.files.filter(function (n) {
                                return self.getModuleConfig(requireEntry.name).files.indexOf(n) < 0;
                            });

                            // If the module was redefined, advise via the console
                            if (diff.length !== 0) {
                                self._$log.warn('Module "', moduleName, '" attempted to redefine configuration for dependency. "', requireEntry.name, '"\n Additional Files Loaded:', diff);
                            }

                            // Push everything to the file loader, it will weed out the duplicates.
                            if (angular.isDefined(self.filesLoader)) {
                                // if a files loader is defined
                                promisesList.push(self.filesLoader(requireEntry, localParams).then(function () {
                                    return self._loadDependencies(requireEntry);
                                }));
                            } else {
                                return reject(new Error('Error: New dependencies need to be loaded from external files (' + requireEntry.files + '), but no loader has been defined.'));
                            }
                            return;
                        } else if (angular.isArray(requireEntry)) {
                            var files = [];
                            angular.forEach(requireEntry, function (entry) {
                                // let's check if the entry is a file name or a config name
                                var config = self.getModuleConfig(entry);
                                if (config === null) {
                                    files.push(entry);
                                } else if (config.files) {
                                    files = files.concat(config.files);
                                }
                            });
                            if (files.length > 0) {
                                requireEntry = {
                                    files: files
                                };
                            }
                        } else if (angular.isObject(requireEntry)) {
                            if (requireEntry.hasOwnProperty('name') && requireEntry['name']) {
                                // The dependency doesn't exist in the module cache and is a new configuration, so store and push it.
                                self.setModuleConfig(requireEntry);
                                moduleCache.push(requireEntry['name']);
                            }
                        }

                        // Check if the dependency has any files that need to be loaded. If there are, push a new promise to the promise list.
                        if (angular.isDefined(requireEntry.files) && requireEntry.files.length !== 0) {
                            if (angular.isDefined(self.filesLoader)) {
                                // if a files loader is defined
                                promisesList.push(self.filesLoader(requireEntry, localParams).then(function () {
                                    return self._loadDependencies(requireEntry);
                                }));
                            } else {
                                return reject(new Error('Error: the module "' + requireEntry.name + '" is defined in external files (' + requireEntry.files + '), but no loader has been defined.'));
                            }
                        }
                    });

                    // Create a wrapper promise to watch the promise list and resolve it once everything is done.
                    return $q.all(promisesList);
                },

                /**
                 * Inject new modules into Angular
                 * @param moduleName
                 * @param localParams
                 * @param real
                 */
                inject: function inject(moduleName) {
                    var localParams = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                    var real = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

                    var self = this,
                        deferred = $q.defer();
                    if (angular.isDefined(moduleName) && moduleName !== null) {
                        if (angular.isArray(moduleName)) {
                            var promisesList = [];
                            angular.forEach(moduleName, function (module) {
                                promisesList.push(self.inject(module, localParams, real));
                            });
                            return $q.all(promisesList);
                        } else {
                            self._addToLoadList(self._getModuleName(moduleName), true, real);
                        }
                    }
                    if (modulesToLoad.length > 0) {
                        var res = modulesToLoad.slice(); // clean copy
                        var loadNext = function loadNext(moduleName) {
                            moduleCache.push(moduleName);
                            modulePromises[moduleName] = deferred.promise;
                            self._loadDependencies(moduleName, localParams).then(function success() {
                                try {
                                    justLoaded = [];
                                    _register(providers, moduleCache, localParams);
                                } catch (e) {
                                    self._$log.error(e.message);
                                    deferred.reject(e);
                                    return;
                                }

                                if (modulesToLoad.length > 0) {
                                    loadNext(modulesToLoad.shift()); // load the next in list
                                } else {
                                        deferred.resolve(res); // everything has been loaded, resolve
                                    }
                            }, function error(err) {
                                deferred.reject(err);
                            });
                        };

                        // load the first in list
                        loadNext(modulesToLoad.shift());
                    } else if (localParams && localParams.name && modulePromises[localParams.name]) {
                        return modulePromises[localParams.name];
                    } else {
                        deferred.resolve();
                    }
                    return deferred.promise;
                },

                /**
                 * Get the list of required modules/services/... for this module
                 * @param module
                 * @returns {Array}
                 */
                getRequires: function getRequires(module) {
                    var requires = [];
                    angular.forEach(module.requires, function (requireModule) {
                        if (regModules.indexOf(requireModule) === -1) {
                            requires.push(requireModule);
                        }
                    });
                    return requires;
                },

                /**
                 * Invoke the new modules & component by their providers
                 * @param providers
                 * @param queue
                 * @param moduleName
                 * @param reconfig
                 * @private
                 */
                _invokeQueue: _invokeQueue,

                /**
                 * Check if a module has been invoked and registers it if not
                 * @param args
                 * @param moduleName
                 * @returns {boolean} is new
                 */
                _registerInvokeList: _registerInvokeList,

                /**
                 * Register a new module and loads it, executing the run/config blocks if needed
                 * @param providers
                 * @param registerModules
                 * @param params
                 * @private
                 */
                _register: _register,

                /**
                 * Add a module name to the list of modules that will be loaded in the next inject
                 * @param name
                 * @param force
                 * @private
                 */
                _addToLoadList: _addToLoadList,

                /**
                 * Unregister modules (you shouldn't have to use this)
                 * @param modules
                 */
                _unregister: function _unregister(modules) {
                    if (angular.isDefined(modules)) {
                        if (angular.isArray(modules)) {
                            angular.forEach(modules, function (module) {
                                regInvokes[module] = undefined;
                            });
                        }
                    }
                }
            };
        }];

        // Let's get the list of loaded modules & components
        this._init(angular.element(window.document));
    }]);

    var bootstrapFct = angular.bootstrap;
    angular.bootstrap = function (element, modules, config) {
        // we use slice to make a clean copy
        angular.forEach(modules.slice(), function (module) {
            _addToLoadList(module, true, true);
        });
        return bootstrapFct(element, modules, config);
    };

    var _addToLoadList = function _addToLoadList(name, force, real) {
        if ((recordDeclarations.length > 0 || force) && angular.isString(name) && modulesToLoad.indexOf(name) === -1) {
            modulesToLoad.push(name);
            if (real) {
                realModules.push(name);
            }
        }
    };

    var ngModuleFct = angular.module;
    angular.module = function (name, requires, configFn) {
        _addToLoadList(name, false, true);
        return ngModuleFct(name, requires, configFn);
    };

    // CommonJS package manager support:
    if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
        module.exports = 'oc.lazyLoad';
    }
})(angular, window);
(function (angular) {
    'use strict';

    angular.module('oc.lazyLoad').directive('ocLazyLoad', ["$ocLazyLoad", "$compile", "$animate", "$parse", "$timeout", function ($ocLazyLoad, $compile, $animate, $parse, $timeout) {
        return {
            restrict: 'A',
            terminal: true,
            priority: 1000,
            compile: function compile(element, attrs) {
                // we store the content and remove it before compilation
                var content = element[0].innerHTML;
                element.html('');

                return function ($scope, $element, $attr) {
                    var model = $parse($attr.ocLazyLoad);
                    $scope.$watch(function () {
                        return model($scope) || $attr.ocLazyLoad; // it can be a module name (string), an object, an array, or a scope reference to any of this
                    }, function (moduleName) {
                        if (angular.isDefined(moduleName)) {
                            $ocLazyLoad.load(moduleName).then(function () {
                                // Attach element contents to DOM and then compile them.
                                // This prevents an issue where IE invalidates saved element objects (HTMLCollections)
                                // of the compiled contents when attaching to the parent DOM.
                                $animate.enter(content, $element);
                                // get the new content & compile it
                                $compile($element.contents())($scope);
                            });
                        }
                    }, true);
                };
            }
        };
    }]);
})(angular);
(function (angular) {
    'use strict';

    angular.module('oc.lazyLoad').config(["$provide", function ($provide) {
        $provide.decorator('$ocLazyLoad', ["$delegate", "$q", "$window", "$interval", function ($delegate, $q, $window, $interval) {
            var uaCssChecked = false,
                useCssLoadPatch = false,
                anchor = $window.document.getElementsByTagName('head')[0] || $window.document.getElementsByTagName('body')[0];

            /**
             * Load a js/css file
             * @param type
             * @param path
             * @param params
             * @returns promise
             */
            $delegate.buildElement = function buildElement(type, path, params) {
                var deferred = $q.defer(),
                    el,
                    loaded,
                    filesCache = $delegate._getFilesCache(),
                    cacheBuster = function cacheBuster(url) {
                    var dc = new Date().getTime();
                    if (url.indexOf('?') >= 0) {
                        if (url.substring(0, url.length - 1) === '&') {
                            return url + '_dc=' + dc;
                        }
                        return url + '&_dc=' + dc;
                    } else {
                        return url + '?_dc=' + dc;
                    }
                };

                // Store the promise early so the file load can be detected by other parallel lazy loads
                // (ie: multiple routes on one page) a 'true' value isn't sufficient
                // as it causes false positive load results.
                if (angular.isUndefined(filesCache.get(path))) {
                    filesCache.put(path, deferred.promise);
                }

                // Switch in case more content types are added later
                switch (type) {
                    case 'css':
                        el = $window.document.createElement('link');
                        el.type = 'text/css';
                        el.rel = 'stylesheet';
                        el.href = params.cache === false ? cacheBuster(path) : path;
                        break;
                    case 'js':
                        el = $window.document.createElement('script');
                        el.src = params.cache === false ? cacheBuster(path) : path;
                        break;
                    default:
                        filesCache.remove(path);
                        deferred.reject(new Error('Requested type "' + type + '" is not known. Could not inject "' + path + '"'));
                        break;
                }
                el.onload = el['onreadystatechange'] = function (e) {
                    if (el['readyState'] && !/^c|loade/.test(el['readyState']) || loaded) return;
                    el.onload = el['onreadystatechange'] = null;
                    loaded = 1;
                    $delegate._broadcast('ocLazyLoad.fileLoaded', path);
                    deferred.resolve();
                };
                el.onerror = function () {
                    filesCache.remove(path);
                    deferred.reject(new Error('Unable to load ' + path));
                };
                el.async = params.serie ? 0 : 1;

                var insertBeforeElem = anchor.lastChild;
                if (params.insertBefore) {
                    var element = angular.element(angular.isDefined(window.jQuery) ? params.insertBefore : document.querySelector(params.insertBefore));
                    if (element && element.length > 0) {
                        insertBeforeElem = element[0];
                    }
                }
                insertBeforeElem.parentNode.insertBefore(el, insertBeforeElem);

                /*
                 The event load or readystatechange doesn't fire in:
                 - iOS < 6       (default mobile browser)
                 - Android < 4.4 (default mobile browser)
                 - Safari < 6    (desktop browser)
                 */
                if (type == 'css') {
                    if (!uaCssChecked) {
                        var ua = $window.navigator.userAgent.toLowerCase();

                        // iOS < 6
                        if (/iP(hone|od|ad)/.test($window.navigator.platform)) {
                            var v = $window.navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
                            var iOSVersion = parseFloat([parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)].join('.'));
                            useCssLoadPatch = iOSVersion < 6;
                        } else if (ua.indexOf("android") > -1) {
                            // Android < 4.4
                            var androidVersion = parseFloat(ua.slice(ua.indexOf("android") + 8));
                            useCssLoadPatch = androidVersion < 4.4;
                        } else if (ua.indexOf('safari') > -1) {
                            var versionMatch = ua.match(/version\/([\.\d]+)/i);
                            useCssLoadPatch = versionMatch && versionMatch[1] && parseFloat(versionMatch[1]) < 6;
                        }
                    }

                    if (useCssLoadPatch) {
                        var tries = 1000; // * 20 = 20000 miliseconds
                        var interval = $interval(function () {
                            try {
                                el.sheet.cssRules;
                                $interval.cancel(interval);
                                el.onload();
                            } catch (e) {
                                if (--tries <= 0) {
                                    el.onerror();
                                }
                            }
                        }, 20);
                    }
                }

                return deferred.promise;
            };

            return $delegate;
        }]);
    }]);
})(angular);
(function (angular) {
    'use strict';

    angular.module('oc.lazyLoad').config(["$provide", function ($provide) {
        $provide.decorator('$ocLazyLoad', ["$delegate", "$q", function ($delegate, $q) {
            /**
             * The function that loads new files
             * @param config
             * @param params
             * @returns {*}
             */
            $delegate.filesLoader = function filesLoader(config) {
                var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                var cssFiles = [],
                    templatesFiles = [],
                    jsFiles = [],
                    promises = [],
                    cachePromise = null,
                    filesCache = $delegate._getFilesCache();

                $delegate.toggleWatch(true); // start watching angular.module calls

                angular.extend(params, config);

                var pushFile = function pushFile(path) {
                    var file_type = null,
                        m;
                    if (angular.isObject(path)) {
                        file_type = path.type;
                        path = path.path;
                    }
                    cachePromise = filesCache.get(path);
                    if (angular.isUndefined(cachePromise) || params.cache === false) {

                        // always check for requirejs syntax just in case
                        if ((m = /^(css|less|html|htm|js)?(?=!)/.exec(path)) !== null) {
                            // Detect file type using preceding type declaration (ala requireJS)
                            file_type = m[1];
                            path = path.substr(m[1].length + 1, path.length); // Strip the type from the path
                        }

                        if (!file_type) {
                            if ((m = /[.](css|less|html|htm|js)?((\?|#).*)?$/.exec(path)) !== null) {
                                // Detect file type via file extension
                                file_type = m[1];
                            } else if (!$delegate.jsLoader.hasOwnProperty('ocLazyLoadLoader') && $delegate.jsLoader.hasOwnProperty('requirejs')) {
                                // requirejs
                                file_type = 'js';
                            } else {
                                $delegate._$log.error('File type could not be determined. ' + path);
                                return;
                            }
                        }

                        if ((file_type === 'css' || file_type === 'less') && cssFiles.indexOf(path) === -1) {
                            cssFiles.push(path);
                        } else if ((file_type === 'html' || file_type === 'htm') && templatesFiles.indexOf(path) === -1) {
                            templatesFiles.push(path);
                        } else if (file_type === 'js' || jsFiles.indexOf(path) === -1) {
                            jsFiles.push(path);
                        } else {
                            $delegate._$log.error('File type is not valid. ' + path);
                        }
                    } else if (cachePromise) {
                        promises.push(cachePromise);
                    }
                };

                if (params.serie) {
                    pushFile(params.files.shift());
                } else {
                    angular.forEach(params.files, function (path) {
                        pushFile(path);
                    });
                }

                if (cssFiles.length > 0) {
                    var cssDeferred = $q.defer();
                    $delegate.cssLoader(cssFiles, function (err) {
                        if (angular.isDefined(err) && $delegate.cssLoader.hasOwnProperty('ocLazyLoadLoader')) {
                            $delegate._$log.error(err);
                            cssDeferred.reject(err);
                        } else {
                            cssDeferred.resolve();
                        }
                    }, params);
                    promises.push(cssDeferred.promise);
                }

                if (templatesFiles.length > 0) {
                    var templatesDeferred = $q.defer();
                    $delegate.templatesLoader(templatesFiles, function (err) {
                        if (angular.isDefined(err) && $delegate.templatesLoader.hasOwnProperty('ocLazyLoadLoader')) {
                            $delegate._$log.error(err);
                            templatesDeferred.reject(err);
                        } else {
                            templatesDeferred.resolve();
                        }
                    }, params);
                    promises.push(templatesDeferred.promise);
                }

                if (jsFiles.length > 0) {
                    var jsDeferred = $q.defer();
                    $delegate.jsLoader(jsFiles, function (err) {
                        if (angular.isDefined(err) && ($delegate.jsLoader.hasOwnProperty("ocLazyLoadLoader") || $delegate.jsLoader.hasOwnProperty("requirejs"))) {
                            $delegate._$log.error(err);
                            jsDeferred.reject(err);
                        } else {
                            jsDeferred.resolve();
                        }
                    }, params);
                    promises.push(jsDeferred.promise);
                }

                if (promises.length === 0) {
                    var deferred = $q.defer(),
                        err = "Error: no file to load has been found, if you're trying to load an existing module you should use the 'inject' method instead of 'load'.";
                    $delegate._$log.error(err);
                    deferred.reject(err);
                    return deferred.promise;
                } else if (params.serie && params.files.length > 0) {
                    return $q.all(promises).then(function () {
                        return $delegate.filesLoader(config, params);
                    });
                } else {
                    return $q.all(promises)['finally'](function (res) {
                        $delegate.toggleWatch(false); // stop watching angular.module calls
                        return res;
                    });
                }
            };

            /**
             * Load a module or a list of modules into Angular
             * @param module Mixed the name of a predefined module config object, or a module config object, or an array of either
             * @param params Object optional parameters
             * @returns promise
             */
            $delegate.load = function (originalModule) {
                var originalParams = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                var self = this,
                    config = null,
                    deferredList = [],
                    deferred = $q.defer(),
                    errText;

                // clean copy
                var module = angular.copy(originalModule);
                var params = angular.copy(originalParams);

                // If module is an array, break it down
                if (angular.isArray(module)) {
                    // Resubmit each entry as a single module
                    angular.forEach(module, function (m) {
                        deferredList.push(self.load(m, params));
                    });

                    // Resolve the promise once everything has loaded
                    $q.all(deferredList).then(function (res) {
                        deferred.resolve(res);
                    }, function (err) {
                        deferred.reject(err);
                    });

                    return deferred.promise;
                }

                // Get or Set a configuration depending on what was passed in
                if (angular.isString(module)) {
                    config = self.getModuleConfig(module);
                    if (!config) {
                        config = {
                            files: [module]
                        };
                    }
                } else if (angular.isObject(module)) {
                    // case {type: 'js', path: lazyLoadUrl + 'testModule.fakejs'}
                    if (angular.isDefined(module.path) && angular.isDefined(module.type)) {
                        config = {
                            files: [module]
                        };
                    } else {
                        config = self.setModuleConfig(module);
                    }
                }

                if (config === null) {
                    var moduleName = self._getModuleName(module);
                    errText = 'Module "' + (moduleName || 'unknown') + '" is not configured, cannot load.';
                    $delegate._$log.error(errText);
                    deferred.reject(new Error(errText));
                    return deferred.promise;
                } else {
                    // deprecated
                    if (angular.isDefined(config.template)) {
                        if (angular.isUndefined(config.files)) {
                            config.files = [];
                        }
                        if (angular.isString(config.template)) {
                            config.files.push(config.template);
                        } else if (angular.isArray(config.template)) {
                            config.files.concat(config.template);
                        }
                    }
                }

                var localParams = angular.extend({}, params, config);

                // if someone used an external loader and called the load function with just the module name
                if (angular.isUndefined(config.files) && angular.isDefined(config.name) && $delegate.moduleExists(config.name)) {
                    return $delegate.inject(config.name, localParams, true);
                }

                $delegate.filesLoader(config, localParams).then(function () {
                    $delegate.inject(null, localParams).then(function (res) {
                        deferred.resolve(res);
                    }, function (err) {
                        deferred.reject(err);
                    });
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            };

            // return the patched service
            return $delegate;
        }]);
    }]);
})(angular);
(function (angular) {
    'use strict';

    angular.module('oc.lazyLoad').config(["$provide", function ($provide) {
        $provide.decorator('$ocLazyLoad', ["$delegate", "$q", function ($delegate, $q) {
            /**
             * cssLoader function
             * @type Function
             * @param paths array list of css files to load
             * @param callback to call when everything is loaded. We use a callback and not a promise
             * @param params object config parameters
             * because the user can overwrite cssLoader and it will probably not use promises :(
             */
            $delegate.cssLoader = function (paths, callback, params) {
                var promises = [];
                angular.forEach(paths, function (path) {
                    promises.push($delegate.buildElement('css', path, params));
                });
                $q.all(promises).then(function () {
                    callback();
                }, function (err) {
                    callback(err);
                });
            };
            $delegate.cssLoader.ocLazyLoadLoader = true;

            return $delegate;
        }]);
    }]);
})(angular);
(function (angular) {
    'use strict';

    angular.module('oc.lazyLoad').config(["$provide", function ($provide) {
        $provide.decorator('$ocLazyLoad', ["$delegate", "$q", function ($delegate, $q) {
            /**
             * jsLoader function
             * @type Function
             * @param paths array list of js files to load
             * @param callback to call when everything is loaded. We use a callback and not a promise
             * @param params object config parameters
             * because the user can overwrite jsLoader and it will probably not use promises :(
             */
            $delegate.jsLoader = function (paths, callback, params) {
                var promises = [];
                angular.forEach(paths, function (path) {
                    promises.push($delegate.buildElement('js', path, params));
                });
                $q.all(promises).then(function () {
                    callback();
                }, function (err) {
                    callback(err);
                });
            };
            $delegate.jsLoader.ocLazyLoadLoader = true;

            return $delegate;
        }]);
    }]);
})(angular);
(function (angular) {
    'use strict';

    angular.module('oc.lazyLoad').config(["$provide", function ($provide) {
        $provide.decorator('$ocLazyLoad', ["$delegate", "$templateCache", "$q", "$http", function ($delegate, $templateCache, $q, $http) {
            /**
             * templatesLoader function
             * @type Function
             * @param paths array list of css files to load
             * @param callback to call when everything is loaded. We use a callback and not a promise
             * @param params object config parameters for $http
             * because the user can overwrite templatesLoader and it will probably not use promises :(
             */
            $delegate.templatesLoader = function (paths, callback, params) {
                var promises = [],
                    filesCache = $delegate._getFilesCache();

                angular.forEach(paths, function (url) {
                    var deferred = $q.defer();
                    promises.push(deferred.promise);
                    $http.get(url, params).success(function (data) {
                        if (angular.isString(data) && data.length > 0) {
                            angular.forEach(angular.element(data), function (node) {
                                if (node.nodeName === 'SCRIPT' && node.type === 'text/ng-template') {
                                    $templateCache.put(node.id, node.innerHTML);
                                }
                            });
                        }
                        if (angular.isUndefined(filesCache.get(url))) {
                            filesCache.put(url, true);
                        }
                        deferred.resolve();
                    }).error(function (err) {
                        deferred.reject(new Error('Unable to load template file "' + url + '": ' + err));
                    });
                });
                return $q.all(promises).then(function () {
                    callback();
                }, function (err) {
                    callback(err);
                });
            };
            $delegate.templatesLoader.ocLazyLoadLoader = true;

            return $delegate;
        }]);
    }]);
})(angular);
// Array.indexOf polyfill for IE8
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        var k;

        // 1. Let O be the result of calling ToObject passing
        //    the this value as the argument.
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get
        //    internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If len is 0, return -1.
        if (len === 0) {
            return -1;
        }

        // 5. If argument fromIndex was passed let n be
        //    ToInteger(fromIndex); else let n be 0.
        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        // 6. If n >= len, return -1.
        if (n >= len) {
            return -1;
        }

        // 7. If n >= 0, then Let k be n.
        // 8. Else, n<0, Let k be len - abs(n).
        //    If k is less than 0, then let k be 0.
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        // 9. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the
            //    HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            //    i.  Let elementK be the result of calling the Get
            //        internal method of O with the argument ToString(k).
            //   ii.  Let same be the result of applying the
            //        Strict Equality Comparison Algorithm to
            //        searchElement and elementK.
            //  iii.  If same is true, return k.
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}
angular.module('ualib.musicSearch.templates', ['videos/videos-list.tpl.html']);

angular.module("videos/videos-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("videos/videos-list.tpl.html",
    "<div class=\"jumbotron-header\">\n" +
    "    <div class=\"jumbotron\">\n" +
    "\n" +
    "        <div class=\"container\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <ol class=\"breadcrumb\" typeof=\"BreadcrumbList\" vocab=\"http://schema.org/\">\n" +
    "                        <li><a title=\"Go to The University of Alabama Libraries.\" href=\"/#/home\" class=\"home\">The University of Alabama Libraries</a></li>\n" +
    "                        <li><a title=\"Go to Video Database.\" href=\"/#/videos\" class=\"post post-page\">Video Database</a></li>\n" +
    "                    </ol>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-7\">\n" +
    "                    <h1>Video Database</h1>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-5\">\n" +
    "                    <div class=\"well\">\n" +
    "                        <p class=\"lead\"> Videos are available through the Music Library</p>\n" +
    "                        <a href=\"https://wwwdev2.lib.ua.edu/libraries-and-collections/music-library/\" class=\"btn btn-primary\" title=\"Music Library\">Get more info <span class=\"fa fa-fw fa-info-circle\"></span></a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-3 col-md-push-9\">\n" +
    "            <form class=\"facets-form\">\n" +
    "                <div class=\"form-group\">\n" +
    "                <span class=\"page-header\">\n" +
    "                    <h4>Filter Videos By</h4>\n" +
    "                </span>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"vid.search\" placeholder=\"Keyword search\">\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group hidden-xs\">\n" +
    "                    <h5>Format</h5>\n" +
    "                    <div class=\"facet-group\">\n" +
    "                        <div class=\"btn-group btn-group-justified\">\n" +
    "                            <label class=\"btn btn-default\" ng-model=\"vid.format\" btn-radio=\"''\">All</label>\n" +
    "                            <label class=\"btn btn-default\" ng-model=\"vid.format\" btn-radio=\"'dvd'\">DVD</label>\n" +
    "                            <label class=\"btn btn-default\" ng-model=\"vid.format\" btn-radio=\"'vcr'\">VHS</label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group hidden-xs\">\n" +
    "                    <h5>Genre</h5>\n" +
    "                    <div class=\"facet-group\">\n" +
    "                        <div class=\"radio\">\n" +
    "                            <label>\n" +
    "                                <input type=\"radio\" ng-model=\"vid.genre\" value=\"\">\n" +
    "                                All Genres\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                        <div class=\"radio\" ng-repeat=\"genre in genres\">\n" +
    "                            <label>\n" +
    "                                <input type=\"radio\" ng-model=\"vid.genre\" ng-value=\"genre.label\">\n" +
    "                                {{genre.label}}\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group hidden-xs\">\n" +
    "                    <h5>Language</h5>\n" +
    "                    <div class=\"facet-group\">\n" +
    "                        <div class=\"radio\">\n" +
    "                            <label>\n" +
    "                                <input type=\"radio\" ng-model=\"vid.language\" value=\"\">\n" +
    "                                All Languages\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                        <div class=\"radio\" ng-repeat=\"lang in languages\">\n" +
    "                            <label>\n" +
    "                                <input type=\"radio\" ng-model=\"vid.language\" ng-value=\"lang.label\">\n" +
    "                                {{lang.label}}\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <button type=\"button\" class=\"btn btn-block btn-primary\" ng-click=\"resetFilters()\"><span class=\"fa fa-fw fa-refresh\"></span> Reset filters</button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-9 col-md-pull-3 videos-list-container\">\n" +
    "            <p>\n" +
    "            <h4 class=\"text-right\">Showing {{pager.totalItems}} results</h4>\n" +
    "            <div ng-if=\"activeFilters.format || activeFilters.genre || activeFilters.language\">\n" +
    "\n" +
    "                <ol class=\"breadcrumb facetcrumb\">\n" +
    "                    <li ng-if=\"activeFilters.format\"><strong>Format:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"vid.format = ''\">{{vid.format}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "                    <li ng-if=\"activeFilters.genre\"><strong>Genre:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"vid.genre = ''\">{{vid.genre}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "                    <li ng-if=\"activeFilters.language\"><strong>Language:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"vid.language = ''\">{{vid.language}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "                    <li class=\"pull-right\"><button type=\"button\" class=\"btn btn-primary btn-small reset-btn\" title=\"Reset filters\" ng-click=\"resetFilters()\"><i class=\"fa fa-refresh\"></i></button></li>\n" +
    "                </ol>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "            </p>\n" +
    "\n" +
    "            <div class=\"media animate-repeat\" ng-repeat=\"item in filteredvidoes | after:(pager.page-1)*pager.perPage | limitTo:20\">\n" +
    "                <div class=\"media-body\">\n" +
    "\n" +
    "                    <h4 class=\"media-heading\">\n" +
    "                        <span ng-bind-html=\"item.title | highlight:vid.search\"></span>\n" +
    "\n" +
    "                        <small>\n" +
    "                            <span ng-bind-html=\"item.series_title | highlight:vid.search\"></span>\n" +
    "                        </small>\n" +
    "                    </h4>\n" +
    "\n" +
    "                    <div class=\"details-context\">\n" +
    "                        <span ng-bind-html=\"item.call_number | highlight:vid.search\"></span>\n" +
    "                        <span ng-bind-html=\"item.genre | highlight:vid.genre\" ng-if=\"item.genre\"></span>\n" +
    "                        <span ng-bind-html=\"item.language | highlight:vid.language\" ng-if=\"item.language\"></span>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <p class=\"text-justify\" ng-bind-html=\"item.notes | highlight:vid.search\"></p>\n" +
    "                </div>\n" +
    "                <div class=\"details-context\">\n" +
    "                    <span ng-bind-html=\"item.keywords | highlight:vid.search\"></span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "            <div class=\"text-center\">\n" +
    "                <pagination class=\"pagination-sm\" ng-model=\"pager.page\" total-items=\"pager.totalItems\" max-size=\"pager.maxSize\" boundary-links=\"true\" rotate=\"false\" items-per-page=\"pager.perPage\" ng-change=\"pageChange()\" ng-if=\"pager.totalItems > pager.perPage\"></pagination>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"alert alert-warning text-center\" role=\"alert\" ng-show=\"pager.totalItems < 1\">\n" +
    "                <h2>No results found <span ng-if=\"vid.search\"> for \"{{vid.search}}\"</span></h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
;/**
 * @ngdoc overview
 * @name index
 *
 * @description
 * # The Music Library's Videos search application.
 * ## URL route [/#/videos](http://www.lib.ua.edu/#/videos)
 *
 */

angular.module('ualib.musicSearch', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngSanitize',
    'angular.filter',
    'ui.bootstrap',
    'duScroll',
    'ualib.ui',
    'ualib.musicSearch.templates'
]);

angular.module('musicSearch', ['ualib.musicSearch']);;angular.module('ualib.musicSearch')

    /**
     * @ngdoc service
     * @name videos.videosFactory
     *
     * @requires ng.$resource
     *
     * @param {object} params Params object to pass to videos API
     * @param {string} params.videos videos to show
     *
     * @description
     * Angular Service to call musicSearch API
     *
     * @returns {$promise} A $resource promise
     *
     * @example
     * videosFactory
     *      .get({videos: 'showall'})
     *      .$promise.then(function(data){
     *          return data;
     *      });
     */

    .factory('videosFactory', ['$resource', function($resource){

        return $resource('//wwwdev2.lib.ua.edu/musicsearch/api/:videos', {videos: 'showall'}, {
            get: {
                method: 'GET',
                cache: true
            }
        });
    }]);;/**
 * @ngdoc overview
 * @name videos
 *
 * @requires ngRoute
 * @requires ngResource
 * @requires ngAnimate
 * @requires ngSanitize
 * @requires angular-filter
 * @requires ui-bootstrap
 * @requires duScroll
 * @requires ualib-ui
 *
 * @description
 * # The Music Library's Videos search application.
 * ## URL route [/#/videos](http://www.lib.ua.edu/#/videos)
 *
 */
angular.module('ualib.musicSearch')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/videos', {
                reloadOnSearch: false,
                resolve: {
                    /**
                     * @ngdoc service
                     * @name videos.filters
                     *
                     * @description
                     * Gets filters available for the videos search UI
                     */
                    filters: ['videosFactory', function(videosFactory){
                        return videosFactory.get({videos: 'genres'})
                            .$promise.then(function(data){
                                var newData = data;
                                for (var f in data){
                                    if (f === 'genres' || f === 'languages'){
                                        newData[f] = data[f].filter(function(d){
                                            return d.value !== 0;
                                        });
                                    }
                                }
                                return newData;
                            }, function(data, status, headers, config) {
                                console.log('ERROR: videos');
                                console.log({
                                    data: data,
                                    status: status,
                                    headers: headers,
                                    config: config
                                });
                            });
                    }],
                    /**
                     * @ngdoc service
                     * @name videos.videos
                     *
                     * @description
                     * Gets the list of videos available in the Music Library
                     */
                    videos: ['videosFactory', function(videosFactory){
                        return videosFactory.get()
                            .$promise.then(function(data){
                                return data;
                            }, function(data, status, headers, config) {
                                console.log('ERROR: videos');
                                console.log({
                                    data: data,
                                    status: status,
                                    headers: headers,
                                    config: config
                                });
                            });
                    }]
                },
                templateUrl: 'videos/videos-list.tpl.html',
                controller: 'VideosListCtrl'
            });
    }])

    /**
     * @ngdoc controller
     * @name videos.Controller:VideosListCtrl
     *
     * @requires $scope
     * @requires $location
     * @requires $document
     * @requires $filter
     * @requires videos.Resolve:filters
     * @requires videos.Resolve:videos
     *
     * @description
     * Controller for the `videos` route.
     */

    .controller('VideosListCtrl', ['$scope', 'videos', 'filters', '$filter' ,'$location' ,'$document', function($scope, vid, filters, $filter, $location, $document){
        var videos = [];


        filters.$promise.then(function(filterData){
            $scope.genres = filterData.genres;
            $scope.languages = filterData.languages;

            vid.$promise.then(function(data){
                videos = data.results;

                $scope.resetFilters();
                paramsToScope();

                $scope.totalItems = data.processedResults;

                //processFacets(videos);
            });
        });

        $scope.$on('$locationChangeSuccess', function(){
            paramsToScope();
        });

        var filterWatcher = $scope.$watch('vid', function(newVal, oldVal){
            var filtered = videos;

            filtered = $filter('filter')(filtered, {genre: newVal.genre});
            filtered = $filter('filter')(filtered, {language: newVal.language});
            filtered = $filter('filter')(filtered, {call_number: newVal.format});

            //if (newVal.search && newVal.search.length > 2){
            filtered = $filter('filter')(filtered, newVal.search);
            //}


            $scope.filteredvidoes = filtered;
            $scope.pager.totalItems = $scope.filteredvidoes.length;
            $scope.pager.firstItem = (($scope.pager.page-1)*$scope.pager.perPage)+1;
            $scope.pager.lastItem = $scope.pager.page*($scope.pager.totalItems < $scope.pager.maxSize ? $scope.pager.totalItems : $scope.pager.perPage);
            var numPages =  Math.floor($scope.pager.totalItems / $scope.pager.maxSize);
            if (numPages < $scope.pager.page){
                $scope.pager.page = numPages || 1;
            }

            var newParams = angular.extend({}, newVal, {page: $scope.pager.page});


            scopeToParams(newParams);
        }, true);

        /**
         * @ngdoc method
         * @name videos.Controller:VideosListCtrl#$scope.resetFilters
         * @methodOf videos.Controller:VideosListCtrl
         *
         * @description
         * Method, exposed to `$scope`, that will reset the filters/pager to their default values.
         */
        $scope.resetFilters = function(){
            $scope.vid = {
                genre: '',
                language: '',
                format: '',
                search: ''
            };
            $scope.pager = {
                page: 1,
                perPage: 20,
                maxSize: 10,
                totalItems: 0
            };
        };

        /**
         * @ngdoc method
         * @name videos.Controller:VideosListCtrl#$scope.pageChange
         * @methodOf videos.Controller:VideosListCtrl
         *
         * @description
         * Method, exposed to `$scope`, that is triggered when navigating to another page.
         * Once triggered, it will bind the new page value to the URI params and auto-scroll to the top of the page.
         */
        $scope.pageChange = function(){

            scopeToParams({page: $scope.pager.page});
            $document.duScrollTo(0, 30, 500, function (t) { return (--t)*t*t+1; });
        };

        $scope.$on('$destroy', function(){
            filterWatcher();
        });

        /**
         * Maps Angular $scope variables to URI query params
         *
         * `$scope.tasty='chimichangas'` gets mapped to `http://url.com?tasty=chimichangas`
         */

        function scopeToParams(scopeVals){
            angular.forEach(scopeVals, function(val, key){
                var newParam = {};

                if (angular.isDefined(val) && val !== ''){
                    if (angular.isObject(val)){
                        val = Object.keys(val).filter(function(f){
                            return val[f];
                        }).join(",");
                        if (val.length > 0){
                            $location.search(key, val);
                        }
                        else{
                            $location.search(key, null);
                        }
                    }
                    else {
                        $location.search(key, val);
                    }
                }
                else{
                    $location.search(key, null);
                }
            });
        }

        /**
         * Maps URI query params to Angular $scope object
         *
         * `http://url.com?tasty=chimichangas` gets mapped to `$scope.tasty='chimichangas'`
         */

        function paramsToScope(){
            var params = $location.search();
            var scopeFacets = {};
            angular.copy($scope.vid, scopeFacets);

            $scope.activeFilters = params;

            if (params.page){
                $scope.pager.page = params.page;
            }

            angular.forEach(scopeFacets, function(val, key){

                if (angular.isDefined(params[key])){

                    if (key === 'genres' || key === 'languages'){
                        var filters = {};
                        params[key].split(',').forEach(function(filter){
                            filters[filter] = true;
                        });
                        scopeFacets[key] = filters;
                    }
                    else{
                        scopeFacets[key] = params[key];
                    }
                }
                else{
                    scopeFacets[key] = angular.isObject(val) ? {} : '';
                }
            });
            $scope.vid = scopeFacets;
           
        }

    }]);



angular.module('oneSearch.templates', ['bento/bento.tpl.html', 'common/directives/suggest/suggest.tpl.html', 'common/engines/acumen/acumen.tpl.html', 'common/engines/catalog/catalog.tpl.html', 'common/engines/databases/databases.tpl.html', 'common/engines/ejournals/ejournals.tpl.html', 'common/engines/google-cs/google-cs.tpl.html', 'common/engines/recommend/recommend.tpl.html', 'common/engines/scout/scout.tpl.html']);

angular.module("bento/bento.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bento/bento.tpl.html",
    "<div class=\"container bento-box-container\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-4\">\n" +
    "            <div class=\"bento-box\" bento-box=\"articles\">\n" +
    "                <h2>\n" +
    "                    Articles\n" +
    "                    <small>\n" +
    "                        <span class=\"fa fa-info-circle\"\n" +
    "                              tooltip-placement=\"right\"\n" +
    "                              tooltip=\"Keyword search in journal titles, and full text article content in Scout.\"></span>\n" +
    "                    </small>\n" +
    "                </h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-4\">\n" +
    "            <div class=\"bento-box\" bento-box=\"books\">\n" +
    "                <h2>\n" +
    "                    Books\n" +
    "                    <small>\n" +
    "                        <span class=\"fa fa-info-circle\"\n" +
    "                              tooltip-placement=\"right\"\n" +
    "                              tooltip=\"Keyword search in book titles using both the Libraries' Catalog and Scout.\"></span>\n" +
    "                    </small>\n" +
    "                </h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-12 col-md-4\">\n" +
    "            <div class=\"bento-box\" bento-box=\"journals\">\n" +
    "                <h2>\n" +
    "                    Journals\n" +
    "                    <small>\n" +
    "                        <span class=\"fa fa-info-circle\"\n" +
    "                              tooltip-placement=\"right\"\n" +
    "                              tooltip=\"Keyword search in journal titles and journal collections, in both Scout and our E-Resources.\"></span>\n" +
    "                    </small>\n" +
    "                </h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-4\">\n" +
    "            <div class=\"bento-box\" bento-box=\"databases\">\n" +
    "                <h2>\n" +
    "                    Databases\n" +
    "                    <small>\n" +
    "                        <span class=\"fa fa-info-circle\"\n" +
    "                              tooltip-placement=\"right\"\n" +
    "                              tooltip=\"Keyword search in titles and databases descriptions from our own Databases Page.\"></span>\n" +
    "                    </small>\n" +
    "                </h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-4\">\n" +
    "            <div class=\"bento-box\" bento-box=\"googleCS\">\n" +
    "                <h2 id=\"site-search\">\n" +
    "                    Libraries' Website\n" +
    "                    <small>\n" +
    "                        <span class=\"fa fa-info-circle\"\n" +
    "                              tooltip-placement=\"right\"\n" +
    "                              tooltip=\"Targeted, full-text search of library website pages and sections.\"></span>\n" +
    "                    </small>\n" +
    "                </h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-4\">\n" +
    "            <div class=\"bento-box\" bento-box=\"acumen\">\n" +
    "                <h2 id=\"acumen\">\n" +
    "                    Acumen <small>Digital Archives</small>\n" +
    "                    <small>\n" +
    "                        <span class=\"fa fa-info-circle\"\n" +
    "                              tooltip-placement=\"right\"\n" +
    "                              tooltip=\"Returns a keyword search in titles and full text of our Special Collections Digital Archive.\"></span>\n" +
    "                    </small>\n" +
    "                </h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-4\">\n" +
    "            <div class=\"bento-box\" bento-box=\"other\">\n" +
    "                <h2>\n" +
    "                    Other Items & Media\n" +
    "                    <small>\n" +
    "                        <span class=\"fa fa-info-circle\"\n" +
    "                              tooltip-placement=\"right\"\n" +
    "                              tooltip=\"Keyword and item type search in the Libraries' catalog and Scout, retrieving media items - videos, DVDs, CDs, etc.\"></span>\n" +
    "                    </small>\n" +
    "                </h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-4\">\n" +
    "            <div class=\"bento-box\" bento-box=\"faq\">\n" +
    "                <h2>\n" +
    "                    FAQ\n" +
    "                    <small>\n" +
    "                        <span class=\"fa fa-info-circle\"\n" +
    "                              tooltip-placement=\"right\"\n" +
    "                              tooltip='Full text keyword search via our Google search engine interface, through our FAQ repository, also known as \"Ask a Librarian.\"'></span>\n" +
    "                    </small>\n" +
    "                </h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-4\">\n" +
    "            <div class=\"bento-box\" bento-box=\"libguides\">\n" +
    "                <h2>\n" +
    "                    Research Guides\n" +
    "                    <small>\n" +
    "                        <span class=\"fa fa-info-circle\"\n" +
    "                              tooltip-placement=\"right\"\n" +
    "                              tooltip=\"Uses Google API to run a keyword search in titles and full text for our research guides.\"></span>\n" +
    "                    </small>\n" +
    "                </h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"bento-box well\" bento-box=\"recommend\" hide-if-empty=\"true\" omit-from-menu=\"true\">\n" +
    "                <h2>\n" +
    "                    Recommended Links\n" +
    "                </h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/directives/suggest/suggest.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/directives/suggest/suggest.tpl.html",
    "<div class=\"input-group input-group-lg\">\n" +
    "    <input type=\"text\" name=\"search\" class=\"form-control onesearch-text\" placeholder=\"{{prompt}}\" id=\"osTextField\"\n" +
    "           ng-model=\"model\" ng-change=\"onChange()\" ng-trim=\"false\" autocomplete=\"off\" />\n" +
    "    <div class=\"input-group-btn\">\n" +
    "        <button type=\"submit\" class=\"btn btn-onesearch btn-primary\"><span class=\"fa fa-search\"></span></button>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"suggest\" ng-show=\"showSuggestions && selected && (items.suggest.length > 0 || items.recommend.length > 0 || items.subjects[0].subjects.length > 0 || items.faq.length > 0)\">\n" +
    "    <div ng-if=\"items.suggest.length > 0\">\n" +
    "        <ul class=\"nav nav-pills nav-stacked\">\n" +
    "            <li role=\"presentation\"\n" +
    "                ng-repeat=\"item in filteredItems = (items.suggest | filter:compare(originalValue)) | limitTo:numShow track by $index\"\n" +
    "                ng-mousedown=\"handleSelection(item.search)\" ng-class=\"item.class\"\n" +
    "                ng-mouseenter=\"setCurrent($index, false)\">\n" +
    "                <a href=\"#/bento/{{item.search}}\" ng-click=\"gaTypeAhead(item.search)\">{{item.search}}</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <div class=\"suggest-row\" ng-show=\"items.recommend.length > 0 || items.subjects[0].subjects.length > 0 || items.faq.length > 0\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-sm-4 suggest-col\" ng-show=\"items.recommend.length > 0\">\n" +
    "                <div class=\"\">\n" +
    "                    <h4>Recommended Links</h4>\n" +
    "                    <div ng-repeat=\"recommendation in items.recommend | limitTo:10\">\n" +
    "                        <a ng-href=\"{{recommendation.link}}\" ng-click=\"gaSuggestion(recommendation.description)\">\n" +
    "                            {{recommendation.description}}\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-sm-4 suggest-col\" ng-show=\"items.subjects[0].subjects.length > 0\">\n" +
    "                <div class=\"\">\n" +
    "                    <h4>Research Guides&#39; Subjects <a href=\"http://guides.lib.ua.edu/\" class=\"small\" ng-mousedown=\"go('http://guides.lib.ua.edu/')\">more</a></h4>\n" +
    "                    <div ng-repeat=\"person in items.subjects | limitTo:10\">\n" +
    "                        <div ng-repeat=\"subject in person.subjects | limitTo:2\">\n" +
    "                            <a ng-if=\"subject.link.length > 7\" ng-href=\"{{subject.link}}\" ng-mousedown=\"go(subject.link)\" ng-click=\"gaSuggestion(subject.subject)\">\n" +
    "                                {{subject.subject}}\n" +
    "                            </a>\n" +
    "                            <a ng-if=\"subject.link.length <= 7\" href=\"#\"\n" +
    "                               ng-mousedown=\"go('mailto:' + person.email + '?subject=Question')\">\n" +
    "                                Ask {{person.name}}, {{person.title}} at {{person.department}}\n" +
    "                            </a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-sm-4 suggest-col\" ng-show=\"items.faq.length > 0\">\n" +
    "                <div class=\"\">\n" +
    "                    <h4>FAQ <a href=\"http://ask.lib.ua.edu/\" class=\"small\" ng-mousedown=\"go('http://ask.lib.ua.edu/')\">more</a></h4>\n" +
    "                    <div ng-repeat=\"faq in items.faq | limitTo:5\">\n" +
    "                        <a ng-href=\"{{faq.link}}\" ng-mousedown=\"go(faq.link)\"  ng-click=\"gaSuggestion(faq.title)\" ng-bind-html=\"faq.title\">\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/engines/acumen/acumen.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/engines/acumen/acumen.tpl.html",
    "<div class=\"media\">\n" +
    "    <a class=\"pull-left\" ng-href=\"http://acumen.lib.ua.edu/{{item.link}}\" title=\"{{item.title}}\" target=\"_acumen\">\n" +
    "        <img ng-src=\"{{item.thumb_path}}\" alt=\"{{item.title}}\">\n" +
    "    </a>\n" +
    "    <div class=\"media-body\">\n" +
    "        <h4 class=\"media-heading\">\n" +
    "            <a ng-href=\"http://acumen.lib.ua.edu/{{item.link}}\" target=\"_acumen\" title=\"{{item.title}}\" ng-click=\"gaPush()\">{{item.title | truncate: 40: '...': true}}</a>\n" +
    "        </h4>\n" +
    "        <div class=\"details-context\">\n" +
    "            <span ng-if=\"item.date\" ng-bind-html=\"item.date\"></span>\n" +
    "            <span ng-if=\"item.type\" ng-bind-html=\"item.type | ucfirst\"></span>\n" +
    "        </div>\n" +
    "        <p>{{item.description | truncate: 100: '...': true}}</p>\n" +
    "        <ul class=\"list-inline\">\n" +
    "            <li>\n" +
    "                <a ng-href=\"{{resourceLink}}\" class=\"external-link\" ng-if=\"resourceLink\" target=\"_{{engine}}\" ng-click=\"gaMore()\">Results in {{engineName}}</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/engines/catalog/catalog.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/engines/catalog/catalog.tpl.html",
    "<div class=\"media\">\n" +
    "    <div class=\"media-body\">\n" +
    "        <h4 class=\"media-heading\">\n" +
    "            <a ng-href=\"{{item.href}}\"\n" +
    "               title=\"{{item.title}}\"\n" +
    "               ng-bind-html=\"item.title | truncate: 50: '...': true\" target=\"_catalog\" ng-click=\"gaPush()\"></a>\n" +
    "        </h4>\n" +
    "        <div class=\"details-context\">\n" +
    "            <span ng-if=\"item.year && item.year | number\" ng-bind-html=\"item.year\"></span>\n" +
    "            <span ng-if=\"item.mediaType\" ng-bind-html=\"item.mediaType\"></span>\n" +
    "            <span ng-if=\"item.issn\">ISSN: {{item.issn}}</span>\n" +
    "        </div>\n" +
    "        <div collapse=\"isCollapsed\" class=\"details-container\" ng-if=\"item.author\">\n" +
    "            <span class=\"text-muted\">Author(s)</span>\n" +
    "            <span class=\"detail\">\n" +
    "                <span ng-bind-html=\"item.author | lowercase | ucfirst\"></span>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "        <ul class=\"list-inline\">\n" +
    "            <li ng-show=\"item.author\">\n" +
    "                <a href=\"\" ng-click=\"isCollapsed = !isCollapsed\">Item details <span class=\"fa\" ng-class=\"{'fa-caret-down': isCollapsed, 'fa-caret-up': !isCollapsed}\"></span></a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <a ng-href=\"{{resourceLink}}\" class=\"external-link\" ng-if=\"resourceLink\" target=\"_{{engine}}\" ng-click=\"gaMore()\">Results in {{engineName}}</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/engines/databases/databases.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/engines/databases/databases.tpl.html",
    "<div class=\"media\">\n" +
    "    <div class=\"media-body\">\n" +
    "        <h4 class=\"media-heading\">\n" +
    "            <a ng-href=\"{{item.url}}\" title=\"{{item.title}}\" target=\"_databases\" ng-click=\"gaPush()\">{{item.title | truncate: 40: '...': true}}</a>\n" +
    "        </h4>\n" +
    "        <div class=\"details-context\">\n" +
    "            <span ng-if=\"item.coverage\" ng-bind-html=\"item.coverage\"></span>\n" +
    "        </div>\n" +
    "        <div class=\"details-container\" ng-if=\"item.subjects\">\n" +
    "            <span class=\"text-muted\">Subjects: </span>\n" +
    "            <span class=\"detail\" ng-repeat=\"subj in item.subjects\">{{subj.subject}}{{$last ? '' : ', '}}</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/engines/ejournals/ejournals.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/engines/ejournals/ejournals.tpl.html",
    "<div class=\"media\">\n" +
    "    <div class=\"media-body\">\n" +
    "        <h4 class=\"media-heading\">\n" +
    "            <a ng-href=\"{{item.links[0].href}}\" title=\"{{item.title}}\" target=\"_ejournals\" ng-click=\"gaPush()\">{{item.title | ltrim | truncate: 50: '...': true}}</a>\n" +
    "        </h4>\n" +
    "\n" +
    "        <div class=\"details-context\">\n" +
    "            <span ng-if=\"item.date\" ng-bind-html=\"item.date\"></span>\n" +
    "            <span ng-if=\"item.links[0]\">\n" +
    "                <span title=\"{{item.links[0].name}}\">{{item.links[0].name | ltrim | truncate: 45: '...'}}</span>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "\n" +
    "        <div collapse=\"isCollapsed\">\n" +
    "            <div class=\"details-container\" ng-if=\"item.authors\">\n" +
    "                <span class=\"text-muted\">Authors </span>\n" +
    "                <span class=\"details\" ng-bind-html=\"item.authors\"></span>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"details-container\" ng-if=\"item.links[1]\">\n" +
    "                <span class=\"text-muted\">Other Sources </span>\n" +
    "            <span class=\"details\" ng-repeat=\"link in item.links | after: 1\">\n" +
    "                <a ng-href=\"{{link.href}}\"\n" +
    "                   title=\"{{link.name}}\"\n" +
    "                   class=\"source-link\"\n" +
    "                   ng-bind-html=\"link.name | truncate: 35: '...': true\"></a>\n" +
    "            </span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <ul class=\"list-inline\">\n" +
    "            <li ng-show=\"item.links[1]\">\n" +
    "                <a href=\"\" ng-click=\"isCollapsed = !isCollapsed\">Item details <span class=\"fa\" ng-class=\"{'fa-caret-down': isCollapsed, 'fa-caret-up': !isCollapsed}\"></span></a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <a ng-href=\"{{resourceLink}}\" class=\"external-link\" ng-if=\"resourceLink\" target=\"_{{engine}}\" ng-click=\"gaMore()\">Results in {{engineName}}</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/engines/google-cs/google-cs.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/engines/google-cs/google-cs.tpl.html",
    "<div class=\"media\">\n" +
    "    <div class=\"media-body\">\n" +
    "        <h4 class=\"media-heading\"><a ng-href=\"{{item.link}}\" title=\"{{item.title}}\" target=\"_googlecs\" ng-click=\"gaPush()\">{{item.title | truncate: 40: '...': true}}</a></h4>\n" +
    "        <p ng-bind-html=\"item.snippet | truncate: 100: '...': true\"></p>\n" +
    "        <ul class=\"list-inline\">\n" +
    "            <li>\n" +
    "                <a ng-href=\"{{resourceLink}}\" class=\"external-link\" ng-if=\"resourceLink\" target=\"_{{engine}}\" ng-click=\"gaMore()\">Results in {{engineName}}</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/engines/recommend/recommend.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/engines/recommend/recommend.tpl.html",
    "<a ng-href=\"{{item.link}}\" title=\"{{item.descr}}\">{{item.descr}}</a>\n" +
    "");
}]);

angular.module("common/engines/scout/scout.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/engines/scout/scout.tpl.html",
    "<div class=\"media\">\n" +
    "    <div class=\"media-body\">\n" +
    "        <h4 class=\"media-heading\">\n" +
    "            <a ng-href=\"{{item.PLink}}\"\n" +
    "               title=\"{{item.Items[0].Data}}\"\n" +
    "               target=\"_scout\"\n" +
    "               ng-bind-html=\"item.title | lowercase | ucfirst | truncate: 80: '...': true\" ng-click=\"gaPush()\"></a>\n" +
    "        </h4>\n" +
    "        <div class=\"details-context\">\n" +
    "            <span ng-if=\"item.RecordInfo.BibRecord.BibRelationships.IsPartOfRelationships[0].BibEntity.Dates[0]\">{{item.RecordInfo.BibRecord.BibRelationships.IsPartOfRelationships[0].BibEntity.Dates[0].Y}} </span>\n" +
    "            <span ng-if=\"item.mediaType\">{{item.mediaType}} </span>\n" +
    "            <span ng-if=\"item.FullText.Text.Availability\">Full Text Online</span>\n" +
    "        </div>\n" +
    "        <div collapse=\"isCollapsed\" ng-show=\"(item.RecordInfo.BibRecord.BibRelationships.HasContributorRelationships || item.source || item.RecordInfo.BibRecord.BibEntity.Subjects)\">\n" +
    "            <div class=\"details-container\" ng-if=\"item.RecordInfo.BibRecord.BibRelationships.HasContributorRelationships\">\n" +
    "                <span class=\"text-muted\">Authors </span>\n" +
    "            <span class=\"details\"...\n" +
    "                  ..\n" +
    "\n" +
    "                  ng-repeat=\"author in item.RecordInfo.BibRecord.BibRelationships.HasContributorRelationships | unique: 'PersonEntity.Name.NameFull'\"\n" +
    "                  ng-bind-html=\"author.PersonEntity.Name.NameFull | lowercase | ucfirst\"></span>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"details-container\" ng-if=\"item.source\">\n" +
    "                <span class=\"text-muted\">Sources </span>\n" +
    "                <span class=\"details\" ng-bind-html=\"item.source\"></span>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"details-container\" ng-if=\"item.RecordInfo.BibRecord.BibEntity.Subjects\">\n" +
    "                <span class=\"text-muted\">Subjects </span>\n" +
    "            <span class=\"details\"\n" +
    "                  ng-repeat=\"subject in item.RecordInfo.BibRecord.BibEntity.Subjects\"\n" +
    "                  ng-bind-html=\"subject.SubjectFull\"></span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <ul class=\"list-inline\">\n" +
    "            <li ng-show=\"item.RecordInfo.BibRecord.BibRelationships.HasContributorRelationships || item.source || item.RecordInfo.BibRecord.BibEntity.Subjects\">\n" +
    "                <a href=\"\" ng-click=\"isCollapsed = !isCollapsed\">Item details <span class=\"fa\" ng-class=\"{'fa-caret-down': isCollapsed, 'fa-caret-up': !isCollapsed}\"></span></a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <a ng-href=\"{{resourceLink}}\" class=\"external-link\" ng-if=\"resourceLink\" target=\"_{{engine}}\" ng-click=\"gaMore()\">Results in {{engineName}}</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

/**
 * @ngdoc overview
 * @name index
 * @description
 * # Quick Start
 *
 * Run the following commands to install:
 *
 * ```shell
 * npm install
 * bower install
 * ```
 *
 * <div class="alert alert-warning">
 *     If you are unfamiliar with **Node.js**, **Grunt**, or **Bower** tools *or* have not installed them on your computer,
 *     read through the instructions in the [Getting Started](#getting-started) section.
 * </div>
 *
 * # Getting Started
 *
 * This package requires[Node.js](http://nodejs.org/) - an application platform which many development and automation tools may be run.
 * Download [Node.js](http://nodejs.org/download/) and install it on your computer.
 *
 * > The **Node.js** platform is used to run development tools such as [Grunt](#getting-started_install-grunt) and [Bower](#getting-started_install-bower)
 *
 * Once `Node.js` is installed, use the `npm` (node package manager) command to install this project's node dependencies:
 *
 * ```shell
 * npm install
 * ```
 *
 * <div class="alert alert-info">
 *     When the [npm install](https://docs.npmjs.com/cli/install) command is run without a package (e.g., `npm install <package_name>`),
 *     it installs dependencies listed in the `package.json` file (located in the root directory of this project).
 * </div>
 *
 *
 * ## Install Grunt
 * *This package requires Grunt `~0.4.5`*
 *
 * If you have not already installed `Grunt` on your computer, use the following command to install the `Grunt Command Line Interface (grunt-cli)`:
 *
 * ```shell
 * npm install -g grunt-cli
 * ```
 * <div class="alert alert-info">
 *     The **-g** option installs `grunt-cli` globally on you computer. You only need to run this command once.
 * </div>
 *
 * > If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide,
 * > as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins.
 *
 *
 * ## Install Bower
 *
 * If `Bower` is not globally installed on your computer, run the following command:
 *
 * ```shell
 * npm install -g bower
 * ```
 *
 * [Bower](http://bower.io/) is also a package manager for front-end web frameworks such as jQuery, Angular, and Bootstrap.
 * This project uses Bower to manage front-end third-party and peer dependencies.
 *
 * Once installed, you can download this project's `Bower` dependencies with the following command:
 *
 * ```shell
 * bower install
 * ```
 *
 * <div class="alert alert-info">
 *     Similar to `npm install` if `Bower's install` command is not given a package name (e.g., `bower install <package_name>`), it will install
 *     dependencies listed in the `bower.json` config file.
 * </div>
 */
/**
 * @ngdoc overview
 * @name oneSearch
 *
 * @requires ngRoute
 * @requires ngResource
 * @requires ngAnimate
 * @requires ngSanitize
 * @requires ui-bootstrap
 * @requires angular-filter
 * @requires ualib-ui
 * 
 * @description
 * <p class="lead">
 *     The `oneSearch` module allows multiple search engines to be searched easily through one interface. For information on how to add new or edit existing
 * engines, see docs for the {@link oneSearch.oneSearchProvider oneSearchProvider}.
 * </p>
 *
 * _All modules in this app are named with their immediate parent's name prepended.
 * So, all modules at this point are prepended with `oneSearch.*`, and modules loaded in `oneSearch.common` are prepended with `common.*`, and so on.
 * This is a lazy attempt to prevent namespace conflicts with other javascripts._
 */

angular.module('oneSearch', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngSanitize',
    'ui.bootstrap',
    'angular.filter',
    'ualib.ui',
    'oneSearch.common',
    'oneSearch.templates',
    'oneSearch.bento'
])
    // The URL to the main website
    .constant('UALIB_DOMAIN', '//wwwdev2.lib.ua.edu/')

    // Default search parameters
    /**
     * @ngdoc service
     * @name oneSearch.SearchParams
     *
     * @description
     * `Value` service for default search params.
     * These defaults can be overwritten when using the {@link oneSearch.oneSearch#methods_searchAll oneSearch.searchAll()} method.
     * For more deatils on Angular `Value` services, see their {@link https://code.angularjs.org/1.2.29/docs/guide/providers#value-recipe Value Recipe} documentation.
     */
    .value('SearchParams', {
        limit: 100
    });

/**
 * @ngdoc overview
 * @name bento
 *
 * @requires $routeProvider
 *
 * @description
 * # Default route pattern: <code>/#/bento/:search_term</code>
 * Bento box module provides BentoBox route and {@link bento.Bento Bento} service.
 *
 */
angular.module('oneSearch.bento', [])

    .config(['$routeProvider', function($routeProvider) {
        /**
         * Register Bento Box display route with ngRoute's $routeProvider
         */
        $routeProvider
            .when('/bento/:s', {
                templateUrl: 'bento/bento.tpl.html',
                controller: 'BentoCtrl'
            });
    }])

/**
 * @ngdoc service
 * @name bento.Bento
 *
 * @requires $q
 * @requires $rootScope
 * @requires $rootParams
 * @requires oneSearch.oneSearch
 * @requires mediaTypes.mediaTypes
 *
 * @description
 * This service uses the mediaTypes service to organize the engine results by media type
 * and preloaded an engine's template and controller (if defined) if there are results for that engine.
 */
    .service('Bento', ['$routeParams', '$rootScope','$q', 'oneSearch', 'mediaTypes', function($routeParams, $rootScope, $q, oneSearch, mediaTypes){
        //variable representing 'this' for closure context
        //this ensures function closure reference variables in the right context
        var self = this;

        /**
         * @ngdoc object
         * @name bento.Bento#boxes
         * @propertyOf bento.Bento
         *
         * @property {string} name Name of the Media Type
         * @property {string} name.engines[] Array of engine objects registered for this mediaType
         * @property {Object} name.results Object of where the properties are engine names and the values are the search results
         *
         * @description
         * the `boxes` object holds all box data
         *
         * Object Structure:
         *
         * - `TYPE_NAME` - `{string}` - Name of the Media Type
         *      - `engines` - `{Array.<string>}` - Array of engine objects registered for this mediaType
         *      - `results` - `{Object}` - Object of where the properties are engine names and the values are the search results
         *
         * @example
         *  <pre>
         *      {
         *          books: {
         *              engines: ['scout','catalog'],
         *              results: {
         *                  scout: {},
         *                  catalog: {}
         *              }
         *      }
         *  </pre>
         **/
        this.boxes = {};

        /**
         * @ngdoc object
         * @name bento.Bento#engines
         * @propertyOf bento.Bento
         *
         * @description
         * Object to hold pre-loaded engine templates and controllers.
         * Templates and controllers are only pre-loaded if the engine yields results.
         *
         * Object Structure:
         *
         * - `TYPE_NAME` - `{string}` - Engine name, defined by engine's config registered through {@link oneSearch.oneSearchProvider#engine}
         *      - `tpl` - `{Promise}` - Promise to retrieve the engine's template.
         *      - `contorller` - `{function()|null}` - An instance of the engine's controller or "null" if no controller was defined
         *
         * @example object structure
         * <pre>
         * {
         *  scout: {
         *      tpl: oneSearch.getEngineTemplate(engine),
         *      controller: oneSearch.getEngineController(engine)
         *  }
         * }
         * </pre>
         * For more details see {@link oneSearch.oneSearch#getEngineTemplate oneSearch.getEngineTemplate()} and {@link oneSearch.oneSearch#getEngineController oneSearch.getEngineController()}
         */
        this.engines = {};

        // Helper function that removes an engine's name from a box's "engines" Array
        // Once the "engines" Array is empty, the box is considered "loaded"
        function loadProgress(type, engine){
            var i = self.boxes[type].engines.indexOf(engine);
            if(i != -1) {
                setResultLimit(type);
                self.boxes[type].engines.splice(i, 1);
            }
        }

        // Remove an engine from all boxes
        function removeFromBoxes(engine){
            angular.forEach(self.boxes, function(box, type){

                loadProgress(type, engine);
            });
        }

        function initResultLimit(box){
            var numEngines = self.boxes[box].engines.length;
            var limit = numEngines > 1 ? 1 : (numEngines < 2 ? 3 : 2);
            self.boxes[box].resultLimit = limit;
        }

        function setResultLimit(box){

            $q.when(self.boxes[box].results)
                .then(function(results){

                    var numResults = Object.keys(results).length;
                    var numEngines = self.boxes[box].engines.length;
                    var expecting = numResults + numEngines;

                    //console.log('box ' + box + ' number of results ' + numResults + ' number of engines' + numEngines +  'expecting ' + expecting);
                    if (box == 'articles'){
                        self.boxes[box].resultLimit = 6;
                    }
                    else if (box == 'journals'){
                        if (expecting < 2 && self.boxes[box].resultLimit == 3){
                            self.boxes[box].resultLimit = 6;
                        }
                        else {
                            self.boxes[box].resultLimit = 3;
                        }
                    }
                    else if (box == 'books') {
                        if (expecting < 3 && self.boxes[box].resultLimit == 2){

                            self.boxes[box].resultLimit = 3;
                        }
                        else if (expecting < 2 && self.boxes[box].resultLimit == 3){
                            self.boxes[box].resultLimit = 6;
                        }
                        else {
                            self.boxes[box].resultLimit = 2;
                        }
                    }

                    if ((expecting < 2 && self.boxes[box].resultLimit < 3) || (expecting < 3 && self.boxes[box].resultLimit < 2)){
                        self.boxes[box].resultLimit++;
                    }
                });
        }

        var engines;

        /**
        * @ngdoc function
        * @name bento.Bento#getBoxes
        * @methodOf bento.Bento
        *
        * @description
        * Get all boxes, searching engine engine registered with each box.
        */
        this.getBoxes = function(){
            // Search all engines registered with the oneSearch Provider, giving the
            // $routeParams object as the parameter (https://code.angularjs.org/1.3.0/docs/api/ngRoute/service/$routeParams)
            engines = oneSearch.searchAll($routeParams);

            // Deep copy media types defined by registered engines to the this.boxes object.
            /**
             * @lends bento.Bento#boxes
             */
            angular.copy(mediaTypes.types, self.boxes);

            // Pre-define the "results" object for each media type - I only do this here so I don't have to check if it's defined later
            angular.forEach(self.boxes, function(box, type){
                initResultLimit(type);
                self.boxes[type].results = {};
                self.boxes[type].resourceLinks = {};
                self.boxes[type].resourceLinkParams = {};

            });

            //  Iterate over the Promises for each engine returned by the oneSearch.searchAll() function
            angular.forEach(engines, function(engine, name){

                engine.response
                    .then(function(data){ // If $http call was a success

                        // User the engine's results getter to get the results object
                        // The results getter is defined by the JSON path defined by the
                        // "resultsPath" param in an engine's config
                        var res = engine.getResults(data);
                        var link = engine.getResourceLink(data);

                        // Double check that the data is defined, in case the search API returned a '200' status with empty results.
                        if (isEmpty(res)){
                            //console.log(self.boxes);
                            removeFromBoxes(name);
                            //console.log(self.boxes);
                        }
                        else {
                            res = res.map(function(item, i){
                                var newItem = item;
                                newItem.position = i;
                                return newItem;
                            });
                            //console.log(res);
                            // Group the results by defined media types
                            var grouped = mediaTypes.groupBy(res, engine.mediaTypes);

                            // Iterate over the boxes.
                            Object.keys(self.boxes).forEach(function(type){
                                // If a box type matches a group in the grouped results
                                if (grouped.hasOwnProperty(type)){
                                    // Put results in the boxes "results" object, referenced by the engine's name
                                    // Ex: self.boxes['books'].results['catalog'] = group_result;
                                    //
                                    // Also, limit the number of results per group by 3
                                    // and sort by generation position in the original results list
                                    self.boxes[type].results[name] = grouped[type].sort(function(a, b){
                                        if (a.position > b.position){
                                            return 1;
                                        }
                                        if (a.position < b.position){
                                            return -1;
                                        }
                                        return 0;
                                    });

                                    // set resource "more" link
                                    self.boxes[type].resourceLinks[name] = decodeURIComponent(link[engine.id]);

                                    // set resource link parameters by media type specified by the engine config
                                    if (engine.resourceLink && engine.resourceLink.params){
                                        self.boxes[type].resourceLinkParams[name] = engine.resourceLink.params;
                                    }
                                    else if (angular.isObject(engine.mediaTypes)){
                                        self.boxes[type].resourceLinkParams[name] = engine.mediaTypes.types[type];
                                    }
                                }
                                // update loading progress, setting engine as loaded for current box
                                loadProgress(type, name);
                            });

                            //preload the engine's template for easy access for directives
                            self.engines[name] = {};
                            self.engines[name].tpl = oneSearch.getEngineTemplate(engine);
                            self.engines[name].controller = oneSearch.getEngineController(engine);
                        }
                    }, function(msg){
                        // If error code return from $http, iterate through boxes object
                        // and remove any instance engine from a box's "engines" array
                        removeFromBoxes(name);
                    });
            });

        };
    }])

/**
 * BentoCtrl Controller - Bento Box route's Contorller
 *
 */
    .controller('BentoCtrl', ['$scope', 'Bento', function($scope, Bento){
        // When the route has changed/updated generate box results
        $scope.$on('$routeChangeSuccess', function(){
            Bento.getBoxes();
        });
    }])

/**
     * bentoBox Directive
     *
     * Each bento box is called using this directive, and is defined by a name. These names are first defined in an
     * engine's config while registering with the oneSearch Provider.
     *
     * Engine results, appropriate for each box, will be asynchronously appended to the HTML element with the following attribute:
     *      bento-box="BOX_NAME"
     *
     * HTML Example:
     *  <!-- Box names must match those defined by an engine's config -->
     *  <div bento-box="BOX_NAME">
     *      <h2>Box Title</h2>
     *  </div>
     */

    /**
     * @ngdoc directive
     * @name bento.directive:bento-box
     *
     * @requires $rootScope
     * @requires $controller
     * @requires $compile
     * @requires $animate
     * @requires $timeout
     * @requires Bento
     * @requires oneSearch
     *
     * @scope
     * @restrict A
     *
     * @description
     * Define Bento Boxes to render specific media types
     *
     * @param {string} bento-box The name of the mediaType or engine the bento box represents. The mediaType name is defined
     */

    .directive('bentoBox', ['$rootScope', '$controller', '$compile', '$animate', '$timeout', 'Bento', 'oneSearch', function($rootScope, $controller, $compile, $animate, $timeout, Bento, oneSearch){
        return {
            restrict: 'A', //The directive always requires and attribute, so disallow class use to avoid conflict
            scope: {},
            link: function(scope, elm, attrs, Ctrl){
                //Get the box name from the elements bentoBox attribute
                var box = attrs.bentoBox;
                elm.addClass(box);
                elm.parent().attr('id', box + '-parent');

                scope.bento= Bento;

                //Preload the spinner element
                var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');

                //Preload the location of the boxe's title element (needs to be more dynamic in the future)
                var titleElm = elm.find('h2');
                titleElm.attr('id', box);

                // Preserve boxTitle text before any loading/waiting messages are inserted.
                var boxTitle = titleElm.text();

                //Enter the spinner animation, appending it to the title element
                $animate.enter(spinner, titleElm, angular.element(titleElm[0].lastChild));

                var engineTimeout;
                var waitingMessage = angular.element(' <span class="unresponsive-msg">Awaiting results from provider</span>');

                function checkEngineStatus(){
                    var engines = angular.copy(Bento.boxes[box].engines);
                    var en = [];
                    for (var e in oneSearch.engines){
                        if (engines.indexOf(e) > -1){
                            if (oneSearch.engines[e].response && !oneSearch.engines[e].response.done){
                                en.push(e);
                            }

                        }
                    }
                    if (engineTimeout && !spinner.hasClass('unresponsive')){
                        spinner.addClass('unresponsive');

                        $animate.enter(waitingMessage, spinner, angular.element(spinner[0].lastChild));
                    }

                    if (en.length){
                        engineTimeout = $timeout(checkEngineStatus, 500);
                    }

                }

                $timeout(checkEngineStatus, 2000);

                //Watch the boxes "engines" Array
                var boxWatcher = scope.$watchCollection(
                    function(){
                        return Bento.boxes[box].engines;
                    },
                    function(newVal, oldVal) {
                        // Has the "engines" Array changed?
                        if (newVal !== oldVal){
                            //console.log(box);
                            //console.log(newVal);
                            //console.log(oldVal);
                            //console.log('----------------------------');

                            //variable for engine removed from array
                            var engine = '';

                            //intersect current and previous "engines" arrays to get the
                            //engine that is done loading (i.e., the engine name removed from the array)
                            //TODO: find more graceful way to know what engine is loaded?
                            for (var i = 0, len = oldVal.length; i < len; i++){
                                var eng = oldVal[i];
                                if (newVal.indexOf(eng) < 0){
                                    engine = eng;
                                    break;
                                }
                            }

                            // Create a new scope for the engine's results
                            // See $rootScope docs: https://code.angularjs.org/1.3.0/docs/api/ng/type/$rootScope.Scope#$new
                            var engineScope = $rootScope.$new();

                            // Place engine results for the current box under an "items" object in the new local scope
                            engineScope.items = Bento.boxes[box].results[engine];


                            if (engineScope.items && engineScope.items.length > 0){
                                // Set isCollapsed boolean to true
                                // For engines that have collapsible results (see /common/engines/ejournals/ejournals.tpl.html for example)
                                engineScope.isCollapsed = true;

                                ///engineScope.limit = Bento.boxes[box].resultLimit;
                                engineScope.engine = engine;

                                // engineName used for "more" links. If 'title' property is not set in the engine's config, then use the string used when registering with the oneSearchProvider
                                engineScope.engineName = oneSearch.engines[engine].title ? oneSearch.engines[engine].title : engine.charAt(0).toUpperCase() + engine.slice(1);
                                engineScope.resourceLink = Bento.boxes[box].resourceLinks[engine] === "undefined" ? false : Bento.boxes[box].resourceLinks[engine];
                                engineScope.resourceLinkParams = Bento.boxes[box].resourceLinkParams[engine];

                                if (oneSearch.engines[engine].resourceLink && oneSearch.engines[engine].resourceLink.params){
                                    engineScope.resourceLinkParams = oneSearch.engines[engine].resourceLink.params;
                                }

                                engineScope.boxName = boxTitle;
                                engineScope.mediaType = box;
                                // When the engine's promise is ready, then load the engine's controller/template data applying
                                // the new isolated scope.
                                Bento.engines[engine].tpl.then(function(data){

                                    var EngCtrl = ['$scope', '$element', 'Bento', function($scope, $element, Bento){
                                        // Extend any controller defined by an engine's config
                                        if (Bento.engines[$scope.engine].controller){
                                            angular.extend(this, $controller(Bento.engines[$scope.engine].controller, {$scope: $scope}));
                                        }
                                        var gaBox = $scope.boxName.toLowerCase().trim().replace(/\s+/g, '_').replace(/[']+/g, '');
                                        $scope.box = Bento.boxes[box];

                                        $scope.gaPush = function(){
                                            ga('send', 'event', 'oneSearch', 'item_click', gaBox);
                                        };
                                        $scope.gaMore = function(){
                                            ga('send', 'event', 'oneSearch', 'more_click', 'more_' + gaBox);
                                        };

                                    }];

                                    var controller = $controller(EngCtrl, {$scope: engineScope, $element: elm});
                                    elm.data('$ngControllerController', controller);
                                    elm.children().data('$ngControllerController', controller);

                                    // Wrap the template in an element that specifies ng-repeat over the "items" object (i.e., the results),
                                    // gives the generic classes for items in a bento box.
                                    var template = angular.element('<div class="animate-repeat bento-box-item" ng-repeat="item in items | limitTo: box.resultLimit">'+data+'</div>');

                                    // Compile wrapped template with the isolated scope's context
                                    var html = $compile(template)(engineScope);

                                    // Append compiled HTML to box element
                                    elm.append(html);
                                });
                            }
                            else {
                                $rootScope.$broadcast('NoResultsForEngine', {engine: engine, box: box});
                            }
                            //if (box == "recommend") console.log(newVal.length);
                            // If new array is empty, the box is considered "loaded"
                            if (newVal.length === 0){
                                done(box);
                            }
                        }
                    },
                    true
                );

                // Loaded and cleanup function
                function done(b){
                    //console.log({b: b, box: box});
                    // If there are no results, print generated message
                    if (isEmpty(Bento.boxes[b].results)){

                        if (attrs.hideIfEmpty){
                            elm.addClass('hidden');
                        }
                        else{
                            elm.append("<strong>No Results</strong>");
                            elm.addClass('text-muted');
                        }
                    }

                    // Tell spinner to exit animation
                    $animate.leave(spinner);

                    //$timeout.cancel(engineTimeout);

                    // Destroy this box's watcher (no need to waste the cycles)
                    boxWatcher();
                }
            }
        };
    }]);


/**
 * Central registration module for all common components.
 * "Common" components are modules that can be used by any view or front-end controller,
 * allowing them to be globally accessible to all aspects of the application.
 *
 */
angular.module('oneSearch.common', [
    'common.mediaTypes',
    'common.oneSearch',
    'common.engines',
    'filters.nameFilter'
]);
angular.module('oneSearch.common')
    /**
     * @ngdoc service
     * @name oneSearch.dataFactory
     *
     * @requires $http
     *
     * @description
     * Factory service to retrieve results for the search box suggestion dropdown generated by {@link oneSearch.directive:suggest-one-search suggest-one-search directive}.
     *
     * @returns {HttpPromise} Returns a promise object with standard $http `then` method.
     */
    .factory('dataFactory', ['$http', function($http) {
        return {
            get: function(url) {
                return $http.get(url).then(function(resp) {
                    return resp.data; // success callback returns this
                });
            }
        };
    }])

    /**
     * @ngdoc directive
     * @name oneSearch.directive:suggest-one-search
     *
     * @requires $timeout
     * @requires $document
     *
     * @scope
     * @restrict AEC
     *
     * @param {string} prompt The `placeholder` text to display in the search text box
     * @param {string} model Name of the `$scope` variable to store the search string
     * @param {string} search Name of the `$scope` reference to the `search()` function defined in the {@link oneSearch.oneSearch:OneSearchCtrl OneSearchCtrl}
     *
     * @description
     * Directive for the search box with suggestion dropdown
     */
    .directive('suggestOneSearch', ['$timeout', '$document', function($timeout, $document) {
        return {
            restrict: 'AEC',
            scope: {
                prompt: '@',
                model: '=',
                search: '='
            },
            controller: ['$scope', '$window', '$timeout', '$document', 'dataFactory', 'Bento', function($scope, $window, $timeout, $document,  dataFactory, Bento){
                $scope.items = {};
                $scope.filteredItems = [];
                $scope.model = "";
                $scope.current = -1;
                $scope.originalValue = $scope.model;
                $scope.dataRequested = false;
                $scope.numShow = 5;
                $scope.faqSearched = false;

                // hides the list initially
                $scope.selected = false;



                $scope.onChange = function(){




                    $scope.selected = true;
                    var fixedString = $scope.model.replace(/[&\/\\#+()$~%':*?<>{}]/g, ' ').trim();
                    fixedString = fixedString.substring(0, 150);

                    if ($scope.model.length < 3 ||
                        ($scope.model.indexOf($scope.originalValue) < 0 && $scope.model.length >= $scope.originalValue.length) ||
                        ($scope.originalValue.indexOf($scope.model) < 0 && $scope.model.length <= $scope.originalValue.length)){
                        $scope.items = {};
                        $scope.setCurrent(-1, false);
                        $scope.dataRequested = false;
                        $scope.selected = false;
                        $scope.faqSearched = false;
                    }
                    if ($scope.model.length > 2 && !$scope.dataRequested){
/*
                        dataFactory.get('//wwwdev2.lib.ua.edu/oneSearch/api/suggest/' + encodeURI(fixedString))
                            .then(function(data) {
                                $scope.items.suggest = data;
                                $scope.setCurrent(-1, false);
                            });
*/
                        $scope.dataRequested = true;
                    }
                    if ($scope.model.length > 2){
                        $timeout(function() {
                            dataFactory.get('//wwwdev2.lib.ua.edu/oneSearch/api/recommend/' + encodeURI(fixedString))
                                .then(function(data) {
                                    $scope.items.recommend = data;
                                });
                            dataFactory.get('//wwwdev2.lib.ua.edu/staffDir/api/subject/' + encodeURI(fixedString) + '/match/startwith')
                                .then(function(data) {
                                    $scope.items.subjects = data;
                                });
                        }, 0);
                    }
                    if ($scope.model.length > 4 && !$scope.faqSearched){
                        //run GCS only if the last character is a space and prev one is not
                        var lastTwo = fixedString.slice(-2);
                        //console.log("Checking conditions for GCS search..." + lastTwo);
                        if (lastTwo.indexOf(" ") > 0) {
                            //console.log("Running GCS search.");
                            $timeout(function() {
                                $scope.faqSearched = true;
                                dataFactory.get('https://www.googleapis.com/customsearch/v1?key=AIzaSyCMGfdDaSfjqv5zYoS0mTJnOT3e9MURWkU&cx=003453353330912650815:lfyr_-azrxe&q=' +
                                    encodeURI(fixedString) + '&siteSearch=ask.lib.ua.edu')
                                    .then(function (data) {
                                        // pluck out the items array for easier 'suggestWatcher' processing
                                        $scope.items.faq = data.items;
                                    });
                            }, 0);
                        }
                    }
                    $scope.originalValue = $scope.model;
                };
                $scope.go = function ( path ) {
                    $scope.model = "";
                    $scope.originalValue = $scope.model;
                    $window.location.href = path;
                };
                $scope.setCurrent = function(index, forceModel) {
                    $scope.current = index;
                    if (typeof $scope.items.suggest != 'undefined')
                        for (var i = 0; i < $scope.items.suggest.length; i++)
                            $scope.items.suggest[i].class = '';
                    if (index >= 0)
                        if ($scope.filteredItems.length > 0){
                            if (index > $scope.filteredItems.length - 1)
                                index = $scope.filteredItems.length - 1;
                            if (forceModel)
                                $scope.model = $scope.filteredItems[index].search;
                            $scope.filteredItems[index].class = 'active';
                            $scope.current = index;
                        }
                };
                $scope.onFocus = function(){
                    if (angular.isDefined($scope.model) && $scope.model.length > 2){
                        $scope.selected = true;
                    }
                    //console.log("onFocus()");
                };
                $scope.onBlur = function(event){
                    //console.log("onBlur()");
                    $scope.selected = false;
                    $document.unbind("click");
                };
                $scope.compare = function(query){
                    return function(item){
                        if (item.search.indexOf(query) == 0 &&
                            !angular.equals(item.search.toLowerCase(), query.toLowerCase()))
                            return true;
                        return false;
                    };
                };

                // This is dumb, but quick fix to get GA events on suggestion box.
                // TODO: Remove this and add in global GA directives
                $scope.gaSuggestion = function(linkTitle){
                    ga('send', 'event', 'oneSearch', 'suggestion_click', linkTitle);
                };
                $scope.gaTypeAhead = function(linkTitle){
                    ga('send', 'event', 'oneSearch', 'type_ahead_click', linkTitle);
                };



            }],
            link: function(scope, elem, attrs) {
                scope.showSuggestions = false;
                var suggestWatcher = scope.$watch('items', function(newVal, oldVal){
                    var show = false;

                    for (var item in newVal){
                        if (item.length > 0){
                            show = true;
                            break;
                        }
                    }

                    scope.showSuggestions = (scope.model.length > 2 && show);
                }, true);

                elem.bind("keydown", function (event) {
                    switch(event.keyCode){
                        //ArrowUp
                        case 38:
                            if (scope.current > 0){
                                scope.setCurrent(scope.current - 1, true);
                                event.preventDefault();
                            } else {
                                scope.setCurrent(-1, false);
                                scope.model = scope.originalValue;
                                event.preventDefault();
                            }
                            break;

                        //ArrowDown
                        case 40:
                            if (scope.model.length > 2 && scope.current < scope.numShow - 1)
                                if (scope.current < scope.items.suggest.length - 1){
                                    scope.setCurrent(scope.current + 1, true);
                                    event.preventDefault();
                                }
                            break;

                        //Enter
                        case 13:
                            scope.selected = false;

                            // Check if type-ahead selected. If so, trigger GA event
                            // gaTypeAhead() is also bound to ng-click for each type-ahead link
                            if (scope.current > -1 && scope.filteredItems[scope.current] && scope.model === scope.filteredItems[scope.current].search){
                                scope.gaTypeAhead(scope.model);
                            }
                            break;

                        //Backspace
                        case 8:
                        //Delete
                        case 46:
                            scope.selected = true;
                            break;

                        default:
                            //console.log("KeyCode " + event.keyCode);
                            break;
                    }
                    scope.$apply();
                });

                // Unbind key event when scope is destroyed
                scope.$on('$destroy', function(){
                    elem.unbind("keydown");
                    suggestWatcher();
                    //console.log("$destroy");
                });

                elem.bind("click", function (event) {
                    if (event.target.id === "osTextField") {
                        scope.onFocus();
                        $document.bind("click", function(event) {
                            if (event.target.id === "osTextField") {
                                scope.onFocus();
                            } else
                            if (event.button < 1) {
                                scope.onBlur(event);
                            }
                            scope.$apply();
                        });
                    } else
                    if (event.button < 1) {
                        scope.onBlur(event);
                    }
                    scope.$apply();
                });

                scope.handleSelection = function(selectedItem) {
                    $timeout(function() {
                        scope.model = selectedItem;
                        scope.originalValue = "";
                        scope.items = {};
                        scope.setCurrent(-1, false);
                        scope.dataRequested = false;
                        scope.selected = false;
                        scope.faqSearched = false;
                        scope.$apply();
                        scope.search();
                    }, 0);
                };

            },
            templateUrl: 'common/directives/suggest/suggest.tpl.html'
        };
    }]);

angular.module('engines.acumen', [])

    /**
     * @ngdoc object
     * @name engines.type:acumen
     *
     * @description
     * Engine config properties (For more details, see {@link oneSearch.oneSearchProvider#methods_engine oneSearchProvider.engine()} documentation)
     *
     * | property | value |
     * |----------|-------|
     * | id       | 8     |
     * | title      | N/A *(defaults to `Acumen`)*    |
     * | priority | 3     |
     * | resultsPath | `Acumen.data`     |
     * | totalsPath | `Acumen.metadata.numFound`     |
     * | mediaTypes | N/A *(appears as its own box)*    |
     * | filterQuery | N/A  |
     * | templateUrl | `common/engines/acumen/acumen.tpl.html` |
     * | controller | {@link engines.type:acumen:AcumenCtrl AcumenCtrl} |
     *
     * @requires oneSearch.oneSearchProvider
     */

    .config(['oneSearchProvider', function(oneSearchProvider){
        oneSearchProvider.engine('acumen', {
            id: 8,
            priority: 3,
            resultsPath: 'Acumen.data',
            totalsPath: 'Acumen.metadata.numFound',
            templateUrl: 'common/engines/acumen/acumen.tpl.html',
            controller: 'AcumenCtrl'
        })
    }])

    /**
     * @ngdoc controller
     * @name engines.type:acumen:AcumenCtrl
     *
     * @description
     * Adds a `type` property to each item to display, from genres that may return with the API results.
     * <mark>TODO:</mark>   add proper description.
     */

    .controller('AcumenCtrl', ['$scope', '$filter', function($scope, $filter){
        var items = $scope.items;

        for (var i = 0, len = items.length; i < len; i++) {
            if (items[i].type) {
                //console.log(items[i].type);
                if (items[i].type[0] == 'text' && items[i].details && items[i].details.genre) items[i].type = items[i].details.genre.sort().shift();
                else items[i].type = items[i].type.sort().shift();
            }
        }
    }]);
angular.module('engines.catalog', [])

    /**
     * @ngdoc object
     * @name engines.type:catalog
     *
     * @description
     * Engine config properties (For more details, see {@link oneSearch.oneSearchProvider#methods_engine oneSearchProvider.engine()} documentation)
     *
     * | property | value |
     * |----------|-------|
     * | id       | 64     |
     * | title    | N/A *(defaults to Catalog)*     |
     * | priority | 5     |
     * | resultsPath | `Catalog.list`     |
     * | totalsPath | `Catalog.total`     |
     * | mediaTypes | <ul><li>**path:** `bibFormat`</li><li>**types**: <ul><li>**books**: ['aa','ac', 'ad', 'am']</li><li>**journals**:  ['ab','as','bb','bs','cb','cs','db','ds','eb','es','fb','fs','gb','gs','ib','is','jb','js','kb','ks','mb','ms','ob','os','pb','ps','rb','rs','tb','ts']</li></ul></li></ul>  |
     * | filterQuery | N/A |
     * | templateUrl | `common/engines/catalog/catalog.tpl.html` |
     * | controller | {@link engines.type:catalog:CatalogCtrl CatalogCtrl} |
     *
     * @requires oneSearch.oneSearchProvider
     */

    .config(['oneSearchProvider', function(oneSearchProvider){
        oneSearchProvider.engine('catalog', {
            id: 64,
            priority: 5,
            resultsPath: 'Catalog.list',
            totalsPath: 'Catalog.total',
            mediaTypes: {
                path: 'bibFormat',
                types: {
                    books: ['aa','ac', 'ad', 'am'],
                    journals: ['ab','as','bb','bs','cb','cs','db','ds','eb','es','fb','fs','gb','gs','ib','is','jb','js','kb','ks','mb','ms','ob','os','pb','ps','rb','rs','tb','ts']
                }
            },
            templateUrl: 'common/engines/catalog/catalog.tpl.html',
            controller: 'CatalogCtrl'
        })
    }])

    .filter('catalogSplitTitleAuthor', [function(){
        return function(title){
            if (title.indexOf('/') > -1){
                var titleParts = title.split(/\s\/\sedited\sby\s([^.+]+)\./);
                title = titleParts
            }
            return title;
        }
    }])

    /**
     * @ngdoc controller
     * @name engines.type:catalog:CatalogCtrl
     *
     * @description
     * <mark>TODO:</mark>   add proper description.
     */

    .controller('CatalogCtrl', ['$scope', '$filter', function($scope, $filter){
        var types = {
            bc: "Archive/Manuscript",
            cm: "Music Score",
            em: "Map",
            im: "Nonmusical Recording",
            jm: "Musical Recording",
            mm: "Computer File/Software",
            om: "Kit",
            pc: "Mixed Material/Collection",
            pm: "Mixed Material",
            rm: "Visual Material"
        };
        var items = $scope.items;

        for (var i = 0; i < items.length; i++){
            var t = items[i]['bibFormat'];
            items[i].mediaType = types[t];

            //Check for authors field. If not there, check the title for author names.
            if (!items[i].author){
                var split = $filter('catalogSplitTitleAuthor')(items[i].title);
                if (angular.isArray(split)){
                    items[i].title = split[0];
                    items[i].author = split[2];
                }
            }
        }

        if (angular.isArray($scope.resourceLinkParams)){
            var typeParam = '&limitTo=TYPE%3D';
            var params = typeParam + $scope.resourceLinkParams.join(typeParam);
            if ($scope.resourceLink.indexOf('limitTo=') > 0){
                $scope.resourceLink = $scope.resourceLink.replace(/(&limitTo=[^&]+)/, params);
            }
            else {
                $scope.resourceLink += params;
            }
            //$scope.resourceLink += params;
        }

        $scope.items = items;
    }]);

angular.module('engines.databases', [])

    /**
     * @ngdoc object
     * @name engines.type:databases
     *
     * @description
     * Engine config properties (For more details, see {@link oneSearch.oneSearchProvider#methods_engine oneSearchProvider.engine()} documentation)
     *
     * | property | value |
     * |----------|-------|
     * | id       | 2     |
     * | title   | N/A *(defaults to `Databases`)*     |
     * | priority | 1     |
     * | resultsPath | `Databases.databases`     |
     * | totalsPath | `Databases.totalResults`     |
     * | mediaTypes | N/A *(appears as its own box)*    |
     * | filterQuery | N/A    |
     * | templateUrl | `common/engines/databases/databases.tpl.html` |
     * | controller | N/A |
     *
     * @requires oneSearchProvider
     */

    .config(['oneSearchProvider', function(oneSearchProvider){
        oneSearchProvider.engine('databases', {
            id: 2,
            priority: 1,
            resultsPath: 'Databases.databases',
            totalsPath: 'Databases.totalResults',
            templateUrl: 'common/engines/databases/databases.tpl.html'
        })
    }])
angular.module('engines.ejournals', [])
    /**
     * @ngdoc object
     * @name engines.type:ejournals
     *
     * @description
     * Engine config properties
     *
     * | property | value |
     * |----------|-------|
     * | id       | 4     |
     * | title | N/A *(defaults to `Ejournals`)* |
     * | priority | 6     |
     * | resultsPath | `eJournals.results`     |
     * | totalsPath | `eJournals.total`     |
     * | mediaTypes | <ul><li>**books**: `book` </li><li>**journals**:  `periodical`</li></ul>  |
     * | filterQuery | N/A |
     * | templateUrl | `common/engines/ejournals/ejournals.tpl.html` |
     * | controller | {@link engines.type:ejournals:EjouralsCtrl EjouralsCtrl} |
     *
     * @requires oneSearch.oneSearchProvider
     */

    .config(['oneSearchProvider', function(oneSearchProvider){
        oneSearchProvider.engine('ejournals', {
            id: 4,
            priority: 6,
            resultsPath: 'eJournals.list',
            totalsPath: 'eJournals.total',
            mediaTypes: {
                path: 'type',
                types: {
                    books: 'book',
                    journals: 'periodical'
                }
            },
            templateUrl: 'common/engines/ejournals/ejournals.tpl.html',
            controller: 'EjouralsCtrl'
        })
    }])

    /**
     * @ngdoc controller
     * @name engines.type:ejournals:EjouralsCtrl
     *
     * @description
     * <mark>TODO:</mark>   add proper description.
     */

    .controller('EjouralsCtrl', ['$scope', function($scope){

        var param;
        switch ($scope.mediaType){
            case 'books':
                param = 'SS_searchTypeBook=yes';
                break;
            case 'journals':
                param = 'SS_searchTypeJournal=yes';
                break;
            case 'other':
                param = 'SS_searchTypeOther=yes'
        }

        if (param){
            $scope.resourceLink = $scope.resourceLink.replace('SS_searchTypeAll=yes&SS_searchTypeBook=yes&SS_searchTypeJournal=yes&SS_searchTypeOther=yes', param);
        }
    }]);
/**
 * @ngdoc overview
 * @name engines
 *
 * @description
 * # Adding Engines to oneSearch
 * <div class="alert alert-primary">Engines are configured and registered via the `oneSearchProvider`, {@link oneSearch.oneSearchProvider#methods_engine see here for details}</div>
 *
 *
 * ## The `engines module` acts as the entry point to load engine configs.
 *
 * ## Adding engines to oneSearch
 *
 * 1. Create a directory with the engines name under ``src/app/common/engines/ENGINE_NAME``
 *      - This will contain the engine's config module, template, and LESS/CSS files
 *
 * 2. In the engines folder create the `engine config` module file: `ENGINE_NAME.js`:
 *      - **Note:** be sure to add the `@ngdoc` comments, filling in the `properties` table, so the engine info will appear in these docs! You can use the example below as a template.
 * <pre>
 *     &#47;**
 *       * @ngdoc object
 *       * @name engines.type:ENGIEN_NAME
 *       *
 *       * @description
 *       * Engine config properties
 *       *
 *       * | property | value |
 *       * |----------|-------|
 *       * | id       | ID_VAL      |
 *       * | priority | WEIGHT      |
 *       * | resultsPath | JSON_RESULTS_PATH     |
 *       * | totalsPath | TOTALS_RESULTS_PATH     |
 *       * | templateUrl | TEMPLATE_URL |
 *       * | controller |  CONTROLLER  |
 *       *
 *       * @requires oneSearchProvider
 *       *&#47;
 *
 *     angular.module('engines.ENGINE_NAME', [])
 *          .config (...)
 *          .controller(...);
 * </pre>
 *
 * 3. Create a template for engine items - this template is applied to each item in the search results individually
 *      - **Note:** template files should *always* end in `.tpl.html` (i.e., ENGINE_NAME.tpl.html)
 *
 * 4. *(optional)* Create LESS file to create custom styles for the engine's template
 *
 * 5. Add the `ENGINE_NAME` config module to the `common.engines` module's dependencies
 * <pre>
 *     angular.module('common.engines', [
 *          'engines.scout',
 *          'engines.catalog',
 *          ...
 *          'engines.ENGINE_NAME`
 *     ])
 * </pre>
 *
 */
angular.module('common.engines', [
    'engines.acumen',
    'engines.catalog',
    'engines.databases',
    'engines.scout',
    'engines.googleCS',
    'engines.faq',
    'engines.libguides',
    'engines.ejournals',
    'engines.recommend'
])
/**
 * @Service enginesTemplateFactory
 *
 * Used to load an engine's template, defined through params in the engine's config with the oneSearch Provider
 * Currently, only loading templates through URL and $templateCache is available.
 * TODO: Allow String templates and TemplateProviders to load engine templates.
 *
 *
 */
    /**
     * @ngdoc service
     * @name engines.enginesTemplateFactory
     *
     * @requires $http
     * @requires $templateCache
     *
     * @description
     * This service retrieves the templates registered with each engine's config.
     *
     * **Note:** Although templates can only be retrieved via URL or $templateCache at the moment, it is recommended with use the {@link engines.enginesTemplateFactory#methods_get enginesTemplateFactory.get()} method,
     * as other template config methods may be supported in the future.
     */
    .service('enginesTemplateFactory', ['$http', '$templateCache', function($http, $templateCache){

        // Generic getter to load template based on engine config
        // @param config An Engine's config Object
        /**
         * @ngdoc function
         * @name engines.enginesTemplateFactory#get
         * @methodOf engines.enginesTemplateFactory
         *
         * @param {object} config An engine's config object
         *
         * @description
         * Takes an engine's `config` object and returns a template or a promise to the template, depending on how the template is defined in the engine's config.
         **/
        this.get = function(config){
            // return template is "templateUrl" is defined. otherwise, return null
            return angular.isDefined(config.templateUrl) ? this.fromUrl(config.templateUrl) : null;
        };

        // So far only templateUrl is supported - worked with both file and cached templates.
        // adopted from https://github.com/angular-ui/ui-router/blob/master/src/templateFactory.js
        /**
         * @ngdoc method
         * @name engines.enginesTemplateFactory#fromUrl
         * @methodOf engines.enginesTemplateFactory
         *
         * @param {string} url The URL or `$templateCache` path to the template.
         *
         * @description
         * Takes a `URL` string and returns a promise to the template. `$templateCache` will be checked first. If no cached template is found, then
         * it loads via `$http`.
         *
         * Adopted from {@link https://github.com/angular-ui/ui-router/blob/master/src/templateFactory.js}
         *
         * @returns {string|Promise.<string>} The template html as a string, or a promise
         * for that string.
         */
        this.fromUrl = function(url){
            if (url == null) return null;
            else return $http
                .get(url, {cache: $templateCache, headers: { Accept: 'text/html' }})
                .then(function(response){ return response.data});
        };

    }])
angular.module('engines.faq', [])

    /**
     * @ngdoc object
     * @name engines.type:faq
     *
     * @description
     * Engine config properties
     *
     * | property | value |
     * |----------|-------|
     * | id       | 16     |
     * | title | N/A *(defaults to `FAQ`)* |
     * | priority | 2     |
     * | resultsPath | `GoogleCS.items`     |
     * | totalsPath | `GoogleCS.searchInformation.totalResults`     |
     * | mediaTypes | N/A *(Appears as it's own box)*     |
     * | filterQuery | `site:ask.lib.ua.edu`  |
     * | templateUrl | `common/engines/google-cs/google-cs.tpl.html` |
     * | controller | N/A |
     *
     * @requires oneSearch.oneSearchProvider
     */
    .config(['oneSearchProvider', function(oneSearchProvider){
        oneSearchProvider.engine('faq', {
            id: 16,
            priority: 2,
            resultsPath: 'GoogleCS.items',
            totalsPath: 'GoogleCS.searchInformation.totalResults',
            filterQuery: 'site:ask.lib.ua.edu',
            templateUrl: 'common/engines/google-cs/google-cs.tpl.html'
        })
    }])
angular.module('engines.googleCS', [])
    /**
     * @ngdoc object
     * @name engines.type:googleCS
     *
     * @description
     * Engine config properties (For more details, see {@link oneSearch.oneSearchProvider#methods_engine oneSearchProvider.engine()} documentation)
     *
     * | property | value |
     * |----------|-------|
     * | id       | 16     |
     * | title   | `Libraries' Website`    |
     * | priority | 2     |
     * | resultsPath | `GoogleCS.items`     |
     * | totalsPath | `GoogleCS.searchInformation.totalResults`     |
     * | mediaTypes | N/A *(appears as its own box)*    |
     * | filterQuery | `-site:guides.lib.ua.edu -site:ask.lib.ua.edu`    |
     * | templateUrl | `common/engines/google-cs/google-cs.tpl.html` |
     * | controller | N/A |
     *
     * @requires oneSearch.oneSearchProvider
     */

    .config(['oneSearchProvider', function(oneSearchProvider){
        oneSearchProvider.engine('googleCS', {
            id: 16,
            title: 'Libraries\' Website',
            priority: 2,
            resultsPath: 'GoogleCS.items',
            totalsPath: 'GoogleCS.searchInformation.totalResults',
            filterQuery: '-site:guides.lib.ua.edu -site:ask.lib.ua.edu',
            templateUrl: 'common/engines/google-cs/google-cs.tpl.html'
        })
    }])
angular.module('engines.libguides', [])

    /**
     * @ngdoc object
     * @name engines.type:libguides
     *
     * @description
     * Engine config properties (For more details, see {@link oneSearch.oneSearchProvider#methods_engine oneSearchProvider.engine()} documentation)
     *
     * | property | value |
     * |----------|-------|
     * | id       | 16     |
     * | title   | `Research Guides`    |
     * | priority | 2     |
     * | resultsPath | `GoogleCS.items`     |
     * | totalsPath | `GoogleCS.searchInformation.totalResults`     |
     * | mediaTypes | N/A *(appears as its own box)*    |
     * | filterQuery | `site:guides.lib.ua.edu`    |
     * | templateUrl | `common/engines/google-cs/google-cs.tpl.html` |
     * | controller | N/A |
     *
     * @requires oneSearch.oneSearchProvider
     */

    .config(['oneSearchProvider', function(oneSearchProvider){
        oneSearchProvider.engine('libguides', {
            id: 16,
            title: 'Research Guides',
            priority: 2,
            resultsPath: 'GoogleCS.items',
            totalsPath: 'GoogleCS.searchInformation.totalResults',
            filterQuery: 'site:guides.lib.ua.edu',
            templateUrl: 'common/engines/google-cs/google-cs.tpl.html'
        })
    }])
angular.module('engines.recommend', [])

    /**
     * @ngdoc object
     * @name engines.type:recommend
     *
     * @description
     * Engine config properties (For more details, see {@link oneSearch.oneSearchProvider#methods_engine oneSearchProvider.engine()} documentation)
     *
     * | property | value |
     * |----------|-------|
     * | id       | 16     |
     * | title   | N/A *(defaults to `Recommend`)*    |
     * | priority | 0     |
     * | resultsPath | `Recommendations`     |
     * | totalsPath | N/A     |
     * | mediaTypes | N/A *(appears as its own box)*    |
     * | filterQuery | `N/A   |
     * | templateUrl | `common/engines/recommend/recommend.tpl.html` |
     * | controller | N/A |
     *
     * @requires oneSearch.oneSearchProvider
     */

    .config(['oneSearchProvider', function(oneSearchProvider){
        oneSearchProvider.engine('recommend', {
            id: 512,
            priority: 0,
            resultsPath: 'Recommendations',
            templateUrl: 'common/engines/recommend/recommend.tpl.html'
        })
    }])
angular.module('engines.scout', [])
    /**
     * @ngdoc object
     * @name engines.type:scout
     *
     * @description
     * Engine config properties
     *
     * | property | value |
     * |----------|-------|
     * | id       | 1     |
     * | title | N/A *(defaults to `Scout`)* |
     * | priority | 4     |
     * | resultsPath | `Scout.SearchResult.Data.Records`     |
     * | totalsPath | `Scout.SearchResult.Statistics.TotalHits`     |
     * | mediaTypes | <ul><li>**path:** `Header.PubTypeId`</li><li>**types:** <ul><li>**books**: `['book', 'ebook']`</li><li>**articles**: `academicJournal`</li></ul></li></ul>    |
     * | filterQuery | N/A  |
     * | templateUrl | `common/engines/scout/scout.tpl.html` |
     * | controller | {@link engines.type:scout:ScoutCtrl ScoutCtrl} |
     *
     * @requires oneSearch.oneSearchProvider
     */
    
    .config(['oneSearchProvider', function(oneSearchProvider){
        oneSearchProvider.engine('scout', {
            id: 1,
            priority: 4,
            resultsPath: 'Scout.SearchResult.Data.Records',
            totalsPath: 'Scout.SearchResult.Statistics.TotalHits',
            mediaTypes: {
                path: 'Header.PubTypeId',
                types: {
                    books: ['book', 'ebook'],
                    articles: 'academicJournal'
                }
            },
            //TODO: Add this functionality to the oneSearchProvider. Currently, resourceLink params are assigned per each engine's custom Controller (see below)
            //TODO: Merge properly with the 'resourceLink' and 'resourceLinkParams' generated from mediaTypes in Bento Service
            // Param keys should match mediaTypes assigned about (keep in mind "other" is a default/catchall handled by mediaTypeProvider
            // This will page params to match 'Source Types' from the Scout interface.
            resourceLink: {
                params: {
                    books: ['Books', 'eBooks'],
                    articles: ['AcademicJournals'],
                    other: [
                        'News',
                        'Magazines',
                        'Reviews',
                        'Biographies',
                        'ConferenceMaterials',
                        'ElectronicResources',
                        'TradePublications',
                        'NonPrintResources',
                        'MusicScores',
                        'DissertationsTheses',
                        'PrimarySourceDocuments',
                        'Reports',
                        'Maps',
                        'Audio',
                        'Videos'
                    ]
                }
            },
            templateUrl: 'common/engines/scout/scout.tpl.html',
            controller: 'ScoutCtrl'
        })
    }])

    /**
     * @ngdoc controller
     * @name engines.type:scout:ScoutCtrl
     *
     * @description
     * <mark>TODO:</mark>   add proper description.
     */

    .controller('ScoutCtrl', ['$scope', function($scope){
        var title; // Title variable to bind to $scope. ".BibRelationships.IsPartOfRelationships" title is used if no item title is present.
        var items = $scope.items;
        for (var i = 0; i < items.length; i++){
            if (items[i].Header.PubTypeId == 'audio'){
                items[i].mediaType = 'Audio';
            }
            if (items[i].Header.PubTypeId == 'videoRecording'){
                items[i].mediaType = 'Video Recording';
            }

            //Check if item has a title
            if (items[i].RecordInfo.BibRecord.BibEntity.Titles){
                title = items[i].RecordInfo.BibRecord.BibEntity.Titles[0].TitleFull;
            }

            //Search for "source"
            var bibRelationships = [];
            if (items[i].RecordInfo.BibRecord.hasOwnProperty('BibRelationships') && angular.isDefined(items[i].RecordInfo.BibRecord.BibRelationships.IsPartOfRelationships)){

                bibRelationships = items[i].RecordInfo.BibRecord.BibRelationships.IsPartOfRelationships;

                for (var x = 0, len = bibRelationships.length; x < len; x++){
                    if (angular.isUndefined(title)){
                        if (bibRelationships[x].BibEntity && bibRelationships[x].BibEntity.Titles){
                            title = bibRelationships[x].BibEntity.Titles[0].TitleFull;
                        }
                    }
                    if (angular.isDefined(bibRelationships[x].BibEntity.Identifiers) && bibRelationships[x].BibEntity.Identifiers[0].Type === 'issn-print'){
                        // define source title
                        if (bibRelationships[x].BibEntity.Titles){
                            items[i].source = bibRelationships[x].BibEntity.Titles[0].TitleFull;
                        }

                        // Append source volume, issue, etc.
                        if (angular.isDefined(bibRelationships[x].BibEntity.Numbering)){
                            for (var y = 0, l = bibRelationships[x].BibEntity.Numbering.length; y < l; y++){
                                items[i].source += ' ' + bibRelationships[x].BibEntity.Numbering[y].Type.substring(0,3) + '.' + bibRelationships[x].BibEntity.Numbering[y].Value;
                            }
                        }
                    }
                }
            }

            if (angular.isDefined(items[i].Items)){
                for (var x = 0; x < items[i].Items.length; x++){
                    if (items[i].Items[x].Group == 'Src'){
                        //console.log(items[i].Items[x].Group);
                        items[i].source = items[i].Items[x].Data;
                    }
                }
            }

            //Set item title
            items[i].title = title;
        }
        $scope.items = items;

        //Preprocess resource link to include facet. This is injected in the EDS header to limit results to media type (this is not native to EDS API)
        var mediaType = angular.copy($scope.mediaType);
        var link = angular.copy($scope.resourceLink);
        var params;

        if ($scope.resourceLinkParams[mediaType]){
            params = $scope.resourceLinkParams[mediaType].join(',');
            if (link.indexOf('facet=') > 0){
                link = link.replace(/&facet=(.+)&?/, params);
            }
            else {
                link += '&facet=' + params;
            }
        }

        $scope.resourceLink = angular.copy(link);
    }]);
angular.module('filters.nameFilter', [])

    .filter('nameFilter', ['$filter', function($filter){
        return function(name){
            if (name.indexOf(',') > -1) {
                var nameParts = name.split(',');
                name = nameParts.map(function (obj) {
                    return obj.trim();
                }).reverse().join(' ');
            }
            return name;
        }
    }]);
/**
 * @ngdoc function
 * @name oneSearch.type:inArray
 *
 * @param {*} val Value to test for
 * @param {Array} arr Array to search
 *
 * @description
 * Checks to see if a value is in an Array
 *
 * @example
 * <pre>
 * var myArray = [0, 9, 2];
 * var value = 01189998819991197253;
 * var isInArray = inArray(value, myArray); // returns false;
 * </pre>
 *
 * @returns {boolean} Returns `true` or `false`
 */

function inArray(val, arr){
    return arr.indexOf(val) > -1;
}
/*
    Given an object with an array as it's value,
    this function will create a new object having the array
    keys as separate object keys and the old object keys as their value

    {
        field: ['value1', 'value2']
    }

    will result in

    {
        value1: 'field',
        value2: 'field'
    }
 */
/**
 * @ngdoc function
 * @name oneSearch.type:invertArrayToObject
 *
 * @param {object} obj An `Object` with an `Array` as the property values
 *
 * @description
 * Given an object with an array as it's value,
 * this function will create a new object having the array
 * keys as separate object keys and the old object keys as their value
 *
 * @example
 * <pre>
 * var myObj = {
 *      field: ['value1', 'value2']
 * };
 * var invertedObj = invertArrayToObject(myObj);
 * // The resulting invertedObj will look like:
 * // {
 * //   value1: 'field',
 * //   value2: 'field',
 * // }
 * </pre>
 *
 * @returns {object} An new, inverted object, where the values of the `Array` are now the properties assigned a value of the old `property`
 */

var invertArrayToObject = function(obj){
    var inverted = {};

    Object.keys(obj).map(function(value, index){
        for (var i = 0, len = obj[value].length; i < len; i++){
            inverted[obj[value][i]] = value;
        }
    });
    return inverted;
}
/**
 * @ngdoc function
 * @name oneSearch.type:isEmpty
 *
 * @param {object|Array} obj An `Object` or `Array` to check.
 *
 * @description
 * Checks to see if an `Object` or `Array` is empty
 *
 * Adopted from {@link http://stackoverflow.com/questions/4994201/is-object-empty}
 *
 * @example
 * <pre>
 * var myObj = {};
 *
 * var isObjEmpty = isEmpty(myObj); // true
 * </pre>
 *
 * @returns {boolean} `true` or `false`
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}
/**
 * @ngdoc function
 * @name oneSearch.global:toArray
 *
 * @param {object} object `Object` to convert into an `Array`.
 *
 * @description
 * Converts the given object into an `Array` of it's values
 *
 * Adopted from {@link https://github.com/a8m/angular-filter/blob/master/src/_common.js}
 *
 * @example
 * <pre>
 * var myObj = {
 *  prop1: "Don't",
 *  prop2: "cross the",
 *  prop3: "streams!"
 * };
 *
 * var arrayNowPlease = toArray(myObj); // returns ["Don't", "cross the", "streams"]
 * </pre>
 *
 * @returns {Array} Array of the object's property's values
 */
function toArray(object) {
    return Array.isArray(object) ? object :
        Object.keys(object).map(function(key) {
            return object[key];
        });
}
/**
 * @ngdoc overview
 * @name mediaTypes
 *
 * @description
 * The `mediaTypes` module allows engines to easily split their results, grouped into different media types. See {@link mediaTypes.mediaTypesProvider mediaTypesProvider} for more details.
 */
angular.module('common.mediaTypes', [])

    /**
     * @ngdoc service
     * @name mediaTypes.mediaTypesProvider
     *
     * @description
     * This module extends the `engine object` with a `mediaTypes` property,
     * allowing multiple engines pool their results into similar `media types`.
     *
     * The `mediaTypes` config object is defined as part of the engine's config object passed to the {@link oneSearch.oneSearchProvider#methods_engine oneSearchProvider.engine()} method.
     *
     *
     * The `mediaTypes` config object has the following properties:
     * - path *(optional)* - `{string=}` - The JSON path to the `value` that determines a media type in a results object. This path extends the `resultsPath` from the `engine object`
     * - types - `{object}` - Object where the properties are the name of the media type, and the values are the value which defines that type in the results object.
     *      - TYPE_NAME - `{string|Array.<string>}` - String or Array of strings for values that define the media type.
     *
     * # Example
     *
     * Here we have a search engine called `myEngine`. When creating the engine's config module, we specify what `mediaTypes` we want the engine's
     * results to be split into.
     *
     * Each item in the `myEngine.results` Array from the JSON response has a `metadata` object with a `type` property,
     * which defines the item's media type. Specifying the `mediaTypes.path` property as `metadata.type` will tell `oneSearch` to look for the media type
     * values under `myEngine.results[index].metadata.type`.
     *
     * Search result items that do not match `mediaTypes` defined in an engine's config will be place into the `other` media type.
     *
     * <div class="tabbable">
     *  <div class="tab-pane" title="myEngine Results">
     *      With the given `myEngine Config` and `JSON Response`, the search results would be organized by `mediaTypes`.
     *
     *      **Note:** all types not defined in `mediaTypes.types` of the `myEngine's` config are put into an `other` type
     *
     *      <div class="well">
     *      <ul>
     *          <li>
     *              `books`
     *              <ul>
     *                  <li>`Title of Book`</li>
     *                  <li>`Title of E-Book`</li>
     *              </ul>
     *          </li>
     *          <li>
     *              `articles`
     *              <ul>
     *                  <li>`Title of Journal Article`</li>
     *              </ul>
     *          </li>
     *          <li>
     *              `other`
     *              <ul>
     *                  <li>`Title of Audio Recording`</li>
     *              </ul>
     *          </li>
     *      </ul>
     *      </div>
     *  </div>
     *  <div class="tab-pane" title="myEngine Config">
     *      <pre>
              angular.module('engines.myEngine', [])

               .config(['oneSearchProvider', function(oneSearchProvider){
                    oneSearchProvider.engine('myEngine', {
                        id: 90,
                        priority: 15,
                        resultsPath: 'myEngine.results',
                        mediaTypes: {
                            path: 'metadata.type',
                            types: {
                                books: ['book', 'ebook'],
                                articles: 'academicJournal'
                            }
                        }
                    });
                });
        </pre>
     *  </div>
     *  <div class="tab-pane" title="JSON Response">
     *      <pre>
     *          {
     *          "myEngine": {
     *              "results": [
     *                  {
     *                      "title": "Title of Book",
     *                      "metadata": {
     *                          "type": "book"
     *                      }
     *                  },
     *                  {
     *                      "title": "Title of E-Book",
     *                      "metadata": {
     *                          "type": "ebook"
     *                      }
     *                  },
     *                  {
     *                     "title": "Title of Journal Article",
     *                      "metadata": {
     *                          "type": "academicJournal"
     *                      }
     *                  },
     *                  {
     *                      "title": "Title of Audio Recording",
     *                      "metadata": {
     *                          "type": "audio"
     *                      }
     *                  }
     *              ]
     *          }
     *      }
     *      </pre>
     *  </div>
     * </div>
     */

    .provider('mediaTypes', [function mediaTypesProvider(){
        // Private Object for registered types
        var _types = {
            other: {
                engines: [],
                loaded: false
            }
        };

        // Register a media type and associate it with a given engine
        // These are only the anticipated media types - registered engines have no results
        // associated with a type, the type will be removed for that search.
        /**
         * @ngdoc method
         * @name mediaTypes.mediaTypesProvider#type
         * @methodOf mediaTypes.mediaTypesProvider
         *
         * @param {string} type The `type` of media to look in an engine's search results
         * @param {string} engine The name of the engine, defined when registering an engine with the {@link oneSearch.oneSearchProvider oneSearchProvider}.
         *
         * @description
         * This method is used by the {@link oneSearch.oneSearchProvider oneSearchProvider} to organize engines by their media types,
         * if specified in the {@link oneSearch.oneSearchProvider#methods_engine engine object}.
         *
         * A `mediaTypes` property is looked for in the `engine` object. If no `mediaTypes` property is found, the engine is considered as its own media type.
         *
         */
        this.type = function(type, engine){
            if (!_types[type]){
                _types[type] = {
                    engines: [],
                    loaded: false
                };
            }
            if (!(_types['other'].engines.indexOf(engine) > -1)){
                //Automatically assume the registered engine will contain 'other' media types
                _types['other'].engines.push(engine);
            }
            _types[type].engines.push(engine);

        };

        // Helper function
        // will return a new object to map results from an engines results
        // This helps drive the 'mediaTypes' property for engine configuration
        function buildGroups(types){
            var groups = {};

            angular.forEach(types, function(value, type){
                var v = {};
                switch (typeof value){
                    case 'string':
                    case 'number':
                        value = [value];
                        break;
                    case 'object':
                        value = toArray(value);
                        break;
                }
                v[type] = value;

                //function at: /common/helpers/invert-array-to-object.js
                // This was the best name I could think of so far for this type of operation.
                // If you can think of a better name, let me know!
                // Honestly, I had almost no clue what to call it...
                v = invertArrayToObject(v);
                angular.extend(groups, v);
            });
            return groups;
        }

        /**
         * @ngdoc service
         * @name mediaTypes.mediaTypes
         *
         * @requires $parse
         */

        this.$get = ['$parse', function($parse){
            return {
                /**
                 * @ngdoc object
                 * @name mediaTypes.mediaTypes#types
                 * @propertyOf mediaTypes.mediaTypes
                 *
                 * @description
                 * The `types` object contains results from engines organized by media type.
                 */
                types: _types,

                // Heavily influenced by angular-filter's group-by function:
                // https://github.com/a8m/angular-filter/blob/master/src/_filter/collection/group-by.js
                /**
                 * @ngdoc method
                 * @name mediaTypes.mediaTypes#groupBy
                 * @methodOf mediaTypes.mediaTypes
                 *
                 * @param {object} collection The `collection` object containing an engine's search results
                 * @param {string|object} media The`mediaTypes` object defined in and engine's config. If no `mediaTypes` were defined, then the name of the engine is used
                 * @returns {object} Returns an object organizing the results by `mediaType`
                 *
                 */
                groupBy: function(collection, media){
                    var result = {};

                    if (angular.isObject(media)) {
                        var groups = buildGroups(media.types);
                        var getter = $parse(media.path);
                        var prop;
                        var g;

                        angular.forEach(collection, function(item){
                            prop = getter(item);
                            g = groups[prop];

                            //If not a registered media type, put into 'other' catch-all type
                            if (angular.isUndefined(g)){
                                if(!result['other']) {
                                    result['other'] = [];
                                }
                                result['other'].push(item);
                            }
                            else{
                                if (!result[g]){
                                    result[g] = [];
                                }
                                result[g].push(item);
                            }
                        });
                    }
                    else{
                        result[media] = collection;
                    }
                    return result;
                }
            }
        }];
    }]);
/**
 * oneSearch Provider:
 *  This is the core of the oneSearch application.
 *  Search engines (i.e., resources) use the oneSearch Provider to register as searchable.
 *  This allows resources/engines to be easily plug-able and templated independent of each other.
 *
 *  The oneSearch Provider expects engines to register in the config phase.
 *  Engines are registered using the Provider's engine(engine_name, params) function:
 *      engine_name: String - defines the identifier for the engine
 *      params: Object - defines details for querying the engine (see example below)
 *
 *  Example:
 *
 *  // Define the engine as an Angular module
 *  angular.module('engines.MY_ENGINES_NAME')
 *
 *  //Register the engine's configuration with the oneSearch Provider
 *  .config(['oneSearchProvider', function(oneSearchProvider){
 *      oneSearchProvider.engine('MY_ENGINE_NAME', {
 *          id: String|Integer, //The id given to the backend JSON response handler that identifies the engine
 *          resultsPath: String, // A string representing the Object path to the search results (e.g., "engine.path.to.results")
            totalsPath: String, // Optional - A string representing the Object path to the total number of results found
            mediaTypes: { // Optional - Requires mediaTypesProvider module - An Object that specify media type qualifiers within the engines results
                path: String // The base path in the results object for the media type qualifier
                types: {    // Object that specifies what media types there are and how to identify them
                    TYPE_LABEL: String|Array // TYPE_LABEL will be the type id and the String or Array of Strings will represent the value given from the 'path' specified above.
                }
            },
            templateUrl: String //a string representing that url path to the engine's template
            controller: Function|String //an injectable controller for the engine - can be a Function or String referring to an existing Controller
        });
    });
 *
 */

angular.module('common.oneSearch', [])

    /**
     * @ngdoc service
     * @name oneSearch.Search
     *
     * @requires $http
     * @requires $q
     *
     * @description
     * Factory service use to make requests to the oneSearch API which will query and return an engine's results
     */

    .factory('Search', ['$http', '$q', function($http, $q){

        function search(params){

            var checkbox = document.querySelector('#scoutCheckbox input');
            var searchtext = document.querySelector('#osTextField').value;


/*
            console.log('SEARCHTEXT IS ');
            console.log(searchtext);
            if ((checkbox.checked) && (searchtext != null)) {
                window.location = 'http://search.ebscohost.com/login.aspx?direct=true&site=eds-live&;scope=site&type=0&custid=s4594951&groupid=main&profid=eds&mode=and&authtype=ip,guest&bquery=' + params['s'];
            }
            else {
                break;
            }*/


            var canceller = $q.defer();
            var url = '//wwwdev2.lib.ua.edu/oneSearch/api/search/' + params['s'] + '/engine/' + params['engine'] + '/limit/' + params['limit'];

            var request = $http({
                method: 'GET',
                url: url,
                timeout: canceller.promise
            });

            var promise = request.then(function(data){
                this.done = true;
                return data.data;
            }, function(data){
                return $q.reject('Error');
            });

            promise.done = false;

            promise.abort = function(){
                this.done = true;
                canceller.resolve();
            };

            promise.finally(
                function(){
                    promise.abort = angular.noop;
                    canceller = request = promise = null;
                    this.done = false;
                }
            );

            return promise;
        }

        /**
         * @ngdoc method
         * @name oneSearch.Search#request
         * @methodOf oneSearch.Search
         *
         * @param {Object} params Object of search parameters (defaults can be set via the {@link oneSearch.SearchParams SearchParams service}).
         * @param {string} params.s Search string
         * @param {integer|string} params.engine The `id` of the engine to search
         * @param {integer=} [params.limit=100] - Maximum number of results to return
         *
         * @description
         *
         * @returns {Promise} Returns a custom `Promise` which allows the `$http` request to be aborted. Check the status of or abort a request using the `response` property.
         *
         * This custom promise contains all the standard {@link https://code.angularjs.org/1.2.29/docs/api/ng/service/$http#usage $http} return properties, but adds the `response` property:
         * - **response.done** - `{boolean}` - `true` when the $http request is finished
         * - **response.abort** - `{function}` - A function to abort a pending `$http` request
         *
         *
         * <pre>
         *     // Abort the request if it takes longer than 400ms
         *     var search = Search.request(params);
         *
         *     $timeout(function(){
         *          if (!search.request.done){
         *              search.request.abort();
         *          }
         *     }, 400);
         *
         * </pre>
         *
         */

        return {
            request: search
        };
    }])

    /**
     * @ngdoc service
     * @name oneSearch.oneSearchProvider
     *
     * @requires mediaTypes.mediaTypesProvider
     *
     * @description
     * This is the core of the oneSearch application.
     *  Search engines (i.e., resources) use the oneSearch Provider to register as searchable.
     *  This allows resources/engines to be easily plug-able and templated independent of each other.
     *
     *  The oneSearch Provider expects engines to register in the config phase.
     *  Engines are registered using the Provider's engine(engine_name, params) function:
     *      engine_name: String - defines the identifier for the engine
     *      params: Object - defines details for querying the engine (see example below)
     *
     * @example
     * <pre>
     * angular.module('engines.googleCS', [])
     *
     *    .config(['oneSearchProvider', function(oneSearchProvider){
     *       oneSearchProvider.engine('googleCS', {
     *           id: 16,
     *           title: 'Libraries\' Website',
     *           priority: 2,
     *           resultsPath: 'GoogleCS.items',
     *           totalsPath: 'GoogleCS.searchInformation.totalResults',
     *           filterQuery: '-site:guides.lib.ua.edu -site:ask.lib.ua.edu',
     *           templateUrl: 'common/engines/google-cs/google-cs.tpl.html',
     *           controller: 'GoogleCsCtrl'
     *       })
     *     }])
     *
     *     .controller(['$scope', function($scope){
     *       var items = $scope.items; // Grab the result items from controller $scope to manipulate
     *     })
     * </pre>
     * *__Note:__ For details on how new engines should be configured, see the {@link engines engines module} docs*
     */

    .provider('oneSearch', ['mediaTypesProvider', function oneSearchProvider(mediaTypesProvider){
        //private object that holds registered engines
        var _engines = {};

        /**
         * @ngdoc function
         * @name oneSearch.oneSearchProvider#engine
         * @methodOf oneSearch.oneSearchProvider
         *
         * @param {string} name Machine readable name of the engine being registered (e.g., no space or special characters)
         * @param {Object} engine Then `engine` object. This tells oneSearch how to search and process results from each engine
         *
         * @param {number|string} engine.id The id given to the backend JSON response handler that identifies the engine
         * @param {string=} engine.title Title to be displayed in the template
         * *(defaults to `string` value give by {@link oneSearch.oneSearchProvider#engine.name name parameter})*
         * @param {number} [engine.priority=10] Weight determining request order of engines. Smaller (lighter) number float to the top and are loaded first.
         * @param {string} engine.resultsPath String representing the JSON path to the search results from the API response (e.g., "engine.path.to.results")
         * @param {string=} engine.totalsPath String representing the JSON path to the `total results` object from API response
         * @param {Object=} engine.mediaTypes Configuration object to assign certain results to different `mediaTypes` (see @link oneSearch.mediaTypesProvider for details)
         * @param {string} engine.templateUrl File path to the engine's template. The template can either be a physical file or loaded into $templateCache *(template functions not yet supported)*
         * @param {string=} engine.filterQuery Filter query string that will be appended to search string.
         * @param {(string|function())=} engine.controller Custom controller to control $scope of each engine. Will accept a function or the name of a defined controller.
         *
         */

        //function to allow engines to register as searchable
        this.engine = function(name, engine){
            if (angular.isString(name)){
                var defaults = {
                    id: null, title: null, priority: 10, resultsPath: null, totalsPath: null, mediaTypes: null, templateUrl: null, filterQuery: null, controller: null
                };

                var e = angular.extend(defaults, engine);
                if (e.id){
                    if (e.mediaTypes){
                        Object.keys(e.mediaTypes.types).map(function(type){
                            mediaTypesProvider.type(type, name);
                        })
                    }
                    else{ //if no mediaTypes are defined, the engine is considered it's own media type
                        mediaTypesProvider.type(name, name);
                        e.mediaTypes = name;
                    }

                    e.name = name;
                    _engines[name] = e;
                }
            }
            else{
                console.log({Error: "oneSearch engine must have STRING defined name", engineParams: engine});
            }
        };

        /**
         * @ngdoc object
         * @name oneSearch.oneSearch
         *
         * @requires $q
         * @requires $parse
         * @requires $filter
         * @requires $rootScope
         * @requires $enginesTemplateFactory
         * @requires oneSearch.SearchParams
         * @requires oneSearch.Search
         *
         * @description
         * The `oneSearch` service acts as the access point to search engines during Angular's `run` phase (see Angular's {@link https://code.angularjs.org/1.2.29/docs/guide/module#module-loading-dependencies Module Loading & dependencies} documentation}.
         * Engines are configured and registered with `oneSearch` during the `configuration` phase. See {@link oneSearch.oneSearchProvider oneSearchProvider} docs for more details.
         *
         */

        this.$get = ['$q', '$parse', '$filter', '$rootScope', 'enginesTemplateFactory', 'SearchParams', 'Search', function($q, $parse, $filter, $rootScope, enginesTemplateFactory, SearchParams, Search){

            return {
                /**
                 * @ngdoc object
                 * @name oneSearch.oneSearch#engines
                 * @propertyOf oneSearch.oneSearch
                 *
                 * @description
                 * Object containing information about all engines registered through the {@link oneSearch.oneSearchProvider}. This `object` is extended upon
                 * search, adding the engine's results and status.
                 *
                 */
                engines: _engines, // Expose engines at Service level
                /**
                 * @ngdoc method
                 * @name oneSearch.oneSearch#searchAll
                 * @methodOf oneSearch.oneSearch
                 *
                 * @param {Object} params Params to send with REST API request
                 *
                 * @description
                 * Function to search all engines. The order requests are made is determined by the {@link oneSearch.oneSearchProvider#methods_engine priority} weight of each engine's configuration object
                 */
                searchAll: function(params){

                    //extend give params with default SearchParams
                    angular.extend(params, SearchParams);

                    // Sort engines by 'priority'
                    var prioritized = $filter('orderObjectBy')( _engines, 'priority');

                    // Cycle through each registered engine, send the GET request, then return $http's promise by default.
                    // Returning the promise, instead of the JSON data, allows for async loading of results.
                    angular.forEach(prioritized, function(engine, name){
                        //Create a local parameters variable 'p' and specify the engine id.
                        var p = {engine: engine.id};

                        //Extend local parameters by global params.
                        angular.extend(p, params);

                        //if filterQuery present, add it to query
                        // TODO: add proper REST support by accepting filter queries as objects and not just strings
                        if (engine.filterQuery !== null){
                            p.s += ' ' + engine.filterQuery;
                        }

                        /*console.log({
                         engine: engine,
                         params: p
                         });*/

                        // Store the $http response promise in the engine's object with key 'response'
                        engine.response = Search.request(p);

                        // Create results getter function from given results JSON path
                        if (angular.isDefined(engine.resultsPath)){
                            engine.getResults = $parse(engine.resultsPath);
                        }

                        // Create results getter function from given results JSON path
                        if (angular.isDefined(engine.totalsPath)){
                            engine.getTotal = $parse(engine.totalsPath);
                        }

                        // Create resource link getter for "more" results link
                        engine.getResourceLink = $parse("resourceLinks");

                        // Put engine's object in private _engines object
                        _engines[name] = engine;
                    });

                    // Return all engines with response promises, and getter functions
                    return _engines;
                },
                /**
                 * @ngdoc method
                 * @name oneSearch.oneSearch#getEngineTemplate
                 * @methodOf oneSearch.oneSearch
                 *
                 * @param {Object} engine Config object for an engine
                 *
                 * @description
                 * Gets the template defined in an engine's config object
                 *
                 * @returns {string|Promise.<string>} The template html as a string, or a promise
                 * for that string.
                 */
                getEngineTemplate: function(engine){
                    return enginesTemplateFactory.get(engine);
                },
                /**
                 * @ngdoc method
                 * @name oneSearch.oneSearch#getEngineController
                 * @methodOf oneSearch.oneSearch
                 *
                 * @param {Object} engine Config object for an engine
                 *
                 * @description
                 * Gets the controller defined in an engine's config object
                 *
                 * @returns {string|function|null} Returns the name of a defined controller or the controller function defined with the given engine. If no
                 * controller was defined for the engine, then `null` is returned.
                 */
                getEngineController: function(engine){
                    return angular.isDefined(engine.controller) ? engine.controller : null;
                }

            }
        }]
    }])

    /**
     * @ngdoc controller
     * @name oneSearch.oneSearch:OneSearchCtrl
     *
     * @requires $scope
     * @requires $rootScope
     * @requires $location
     * @requires $window
     * @requires oneSearch.oneSearch
     *
     * @description
     * This controller should warp the search box form. It will provide search variables/methods relative to it's `$scope`. Be sure to compensate if any
     * directives under this controller define an isolated $scope.
     */

    .controller('OneSearchCtrl', ['$scope', '$location', '$rootScope', '$window', 'oneSearch', function($scope, $location, $rootScope, $window, oneSearch){
        $scope.searchText;

        function abortPendingSearches(){
            for (var e in oneSearch.engines){
                if (oneSearch.engines[e].response && !oneSearch.engines[e].response.done){
                    oneSearch.engines[e].response.abort();
                }
            }
        }

        /**
         * @ngdoc method
         * @name oneSearch.oneSearch:OneSearchCtrl#$scope.search
         * @methodOf oneSearch.oneSearch:OneSearchCtrl
         *
         * @description
         * This function will first check if the `$scope.searchText` model has value. If so, it will
         * 1. Trim any `/` characters from `$scope.searchText`
         * 2. Cancel any pending searches
         * 3. Route the browser to `#/bento/{$scope.searchText}`.
         *
         * Currently only the {@link bento} route is supported. Other views/routes may be supported in the future.
         *
         * **Note:** This function will route relative to UA Libraries' `live` and `dev` URLs. If this function is executed outside a UALib domain, `www.lib.ua.edu` will be used by default.
         */


        $scope.search = function(){
            /**
             * @ngdoc property
             * @name oneSearch.oneSearch:OneSearchCtrl:$scope.searchText
             * @propertyOf oneSearch.oneSearch:OneSearchCtrl
             *
             *  @description
             * The $scope model for the search string, bound to the input text box.
             */


            var checkbox = document.querySelector('#scoutCheckbox input');
            var searchtext = document.querySelector('#osTextField').value;


            if (checkbox && (checkbox.checked) && (searchtext !== '')) {
                ga('send', 'event', 'oneSearch', 'scout_checkbox_click');
                window.location = 'http://search.ebscohost.com/login.aspx?direct=true&site=eds-live&;scope=site&type=0&custid=s4594951&groupid=main&profid=eds&mode=and&authtype=ip,guest&bquery=' + searchtext;
            }
            else {
                if ($scope.searchText) {
                    $scope.searchText = $scope.searchText.replace(/[&\/\\#+()$~%':*?<>{}]/g, ' ').trim();
                    $scope.searchText = $scope.searchText.substring(0, 150);
                    var searchText = encodeURIComponent($scope.searchText);

                    //Cancel any pending searches - prevents mixed results by canceling the ajax requests
                    abortPendingSearches();

                    // Compensate for when not on home page
                    // Since WP pages aren't loaded as angular routes, we must detect if there is no '#/PATH' present
                    // after the URI (or that it's not a 'bento' route), then send the browser to a pre-build URL.
                    if (!$location.path() || $location.path().indexOf('/bento') < 0) {
                        var url = '#/bento/' + searchText;
                        switch ($location.host()) {
                            case 'wwwdev2.lib.ua.edu':
                            case 'www.lib.ua.edu':
                                url = '//' + $location.host() + url;
                                break;
                            case 'localhost':
                                url = $location.absUrl().replace(/(#.*)/, '') + url;
                                break;
                            default:
                                url = '//www.lib.ua.edu' + url;
                        }
                        $window.location = url; //Angular 1.2.8 $location is too limited...
                    }
                    else {
                        $location.path('/bento/' + $scope.searchText);
                    }
                }
            }
        };

        $scope.getRecommend = function(val){
            return $resource('//wwwdev2.lib.ua.edu/oneSearch/api/recommend/:search')
                .query({search: val})
                .$promise.then(function(rec) {
                    //console.log(rec);

                    return rec;
                });
        };


        $rootScope.$on('$routeChangeSuccess', function(event,currentRoute){
            if (currentRoute && $scope.searchText !== currentRoute.params.s){
                $scope.searchText = currentRoute.params.s;
            }
        });


    }])

    // Borrowed from https://github.com/fmquaglia/ngOrderObjectBy
    /**
     * @ngdoc filter
     * @name oneSearch.filter:orderObjectBy
     *
     * @param {Array.<Object>} items An `Array` or `Objects` to order
     * @param {string} field The field/property of the objects to order by
     * @param {boolean} [reverse=false] Order objects in reverse
     *
     * @description
     * Order's an array of objects by the value of a property in those objects.
     *
     * @example
     * <pre>
     *     var arrObj = [
     *          {n: 10},
     *          {n: 1},
     *          {n: -5}
     *      ];
     *
     *      var ordered = $filter('orderObjectBy')( _engines, 'n');
     *      &#47;*
     *        ordered is given an array of objects, ordered by `n`:
     *        [
     *          {n: -5},
     *          {n: 1},
     *          {n: 10}
     *        ];
     *      *&#47;
     * </pre>
     */
    .filter('orderObjectBy', function() {
        return function (items, field, reverse) {
            var filtered = [];
            var newObj = {};
            angular.forEach(items, function(item) {
                filtered.push(item);
            });
            function index(obj, i) {
                return obj[i];
            }
            filtered.sort(function (a, b) {
                var comparator;
                var reducedA = field.split('.').reduce(index, a);
                var reducedB = field.split('.').reduce(index, b);
                if (reducedA === reducedB) {
                    comparator = 0;
                } else {
                    comparator = (reducedA > reducedB ? 1 : -1);
                }
                return comparator;
            });
            if (reverse) {
                filtered.reverse();
            }
            for (var i= 0, len = filtered.length; i < len; i++){
                var eng = filtered[i].name;
                newObj[eng] = filtered[i]
            }

            return newObj;
        };
    });
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
/*! NOTE: If you're already including a window.matchMedia polyfill via Modernizr or otherwise, you don't need this part */
(function(w) {
  "use strict";
  w.matchMedia = w.matchMedia || function(doc, undefined) {
    var bool, docElem = doc.documentElement, refNode = docElem.firstElementChild || docElem.firstChild, fakeBody = doc.createElement("body"), div = doc.createElement("div");
    div.id = "mq-test-1";
    div.style.cssText = "position:absolute;top:-100em";
    fakeBody.style.background = "none";
    fakeBody.appendChild(div);
    return function(q) {
      div.innerHTML = '&shy;<style media="' + q + '"> #mq-test-1 { width: 42px; }</style>';
      docElem.insertBefore(fakeBody, refNode);
      bool = div.offsetWidth === 42;
      docElem.removeChild(fakeBody);
      return {
        matches: bool,
        media: q
      };
    };
  }(w.document);
})(this);

/*! Respond.js v1.4.0: min/max-width media query polyfill. (c) Scott Jehl. MIT Lic. j.mp/respondjs  */
(function(w) {
  "use strict";
  var respond = {};
  w.respond = respond;
  respond.update = function() {};
  var requestQueue = [], xmlHttp = function() {
    var xmlhttpmethod = false;
    try {
      xmlhttpmethod = new w.XMLHttpRequest();
    } catch (e) {
      xmlhttpmethod = new w.ActiveXObject("Microsoft.XMLHTTP");
    }
    return function() {
      return xmlhttpmethod;
    };
  }(), ajax = function(url, callback) {
    var req = xmlHttp();
    if (!req) {
      return;
    }
    req.open("GET", url, true);
    req.onreadystatechange = function() {
      if (req.readyState !== 4 || req.status !== 200 && req.status !== 304) {
        return;
      }
      callback(req.responseText);
    };
    if (req.readyState === 4) {
      return;
    }
    req.send(null);
  };
  respond.ajax = ajax;
  respond.queue = requestQueue;
  respond.regex = {
    media: /@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,
    keyframes: /@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,
    urls: /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,
    findStyles: /@media *([^\{]+)\{([\S\s]+?)$/,
    only: /(only\s+)?([a-zA-Z]+)\s?/,
    minw: /\([\s]*min\-width\s*:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/,
    maxw: /\([\s]*max\-width\s*:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/
  };
  respond.mediaQueriesSupported = w.matchMedia && w.matchMedia("only all") !== null && w.matchMedia("only all").matches;
  if (respond.mediaQueriesSupported) {
    return;
  }
  var doc = w.document, docElem = doc.documentElement, mediastyles = [], rules = [], appendedEls = [], parsedSheets = {}, resizeThrottle = 30, head = doc.getElementsByTagName("head")[0] || docElem, base = doc.getElementsByTagName("base")[0], links = head.getElementsByTagName("link"), lastCall, resizeDefer, eminpx, getEmValue = function() {
    var ret, div = doc.createElement("div"), body = doc.body, originalHTMLFontSize = docElem.style.fontSize, originalBodyFontSize = body && body.style.fontSize, fakeUsed = false;
    div.style.cssText = "position:absolute;font-size:1em;width:1em";
    if (!body) {
      body = fakeUsed = doc.createElement("body");
      body.style.background = "none";
    }
    docElem.style.fontSize = "100%";
    body.style.fontSize = "100%";
    body.appendChild(div);
    if (fakeUsed) {
      docElem.insertBefore(body, docElem.firstChild);
    }
    ret = div.offsetWidth;
    if (fakeUsed) {
      docElem.removeChild(body);
    } else {
      body.removeChild(div);
    }
    docElem.style.fontSize = originalHTMLFontSize;
    if (originalBodyFontSize) {
      body.style.fontSize = originalBodyFontSize;
    }
    ret = eminpx = parseFloat(ret);
    return ret;
  }, applyMedia = function(fromResize) {
    var name = "clientWidth", docElemProp = docElem[name], currWidth = doc.compatMode === "CSS1Compat" && docElemProp || doc.body[name] || docElemProp, styleBlocks = {}, lastLink = links[links.length - 1], now = new Date().getTime();
    if (fromResize && lastCall && now - lastCall < resizeThrottle) {
      w.clearTimeout(resizeDefer);
      resizeDefer = w.setTimeout(applyMedia, resizeThrottle);
      return;
    } else {
      lastCall = now;
    }
    for (var i in mediastyles) {
      if (mediastyles.hasOwnProperty(i)) {
        var thisstyle = mediastyles[i], min = thisstyle.minw, max = thisstyle.maxw, minnull = min === null, maxnull = max === null, em = "em";
        if (!!min) {
          min = parseFloat(min) * (min.indexOf(em) > -1 ? eminpx || getEmValue() : 1);
        }
        if (!!max) {
          max = parseFloat(max) * (max.indexOf(em) > -1 ? eminpx || getEmValue() : 1);
        }
        if (!thisstyle.hasquery || (!minnull || !maxnull) && (minnull || currWidth >= min) && (maxnull || currWidth <= max)) {
          if (!styleBlocks[thisstyle.media]) {
            styleBlocks[thisstyle.media] = [];
          }
          styleBlocks[thisstyle.media].push(rules[thisstyle.rules]);
        }
      }
    }
    for (var j in appendedEls) {
      if (appendedEls.hasOwnProperty(j)) {
        if (appendedEls[j] && appendedEls[j].parentNode === head) {
          head.removeChild(appendedEls[j]);
        }
      }
    }
    appendedEls.length = 0;
    for (var k in styleBlocks) {
      if (styleBlocks.hasOwnProperty(k)) {
        var ss = doc.createElement("style"), css = styleBlocks[k].join("\n");
        ss.type = "text/css";
        ss.media = k;
        head.insertBefore(ss, lastLink.nextSibling);
        if (ss.styleSheet) {
          ss.styleSheet.cssText = css;
        } else {
          ss.appendChild(doc.createTextNode(css));
        }
        appendedEls.push(ss);
      }
    }
  }, translate = function(styles, href, media) {
    var qs = styles.replace(respond.regex.keyframes, "").match(respond.regex.media), ql = qs && qs.length || 0;
    href = href.substring(0, href.lastIndexOf("/"));
    var repUrls = function(css) {
      return css.replace(respond.regex.urls, "$1" + href + "$2$3");
    }, useMedia = !ql && media;
    if (href.length) {
      href += "/";
    }
    if (useMedia) {
      ql = 1;
    }
    for (var i = 0; i < ql; i++) {
      var fullq, thisq, eachq, eql;
      if (useMedia) {
        fullq = media;
        rules.push(repUrls(styles));
      } else {
        fullq = qs[i].match(respond.regex.findStyles) && RegExp.$1;
        rules.push(RegExp.$2 && repUrls(RegExp.$2));
      }
      eachq = fullq.split(",");
      eql = eachq.length;
      for (var j = 0; j < eql; j++) {
        thisq = eachq[j];
        mediastyles.push({
          media: thisq.split("(")[0].match(respond.regex.only) && RegExp.$2 || "all",
          rules: rules.length - 1,
          hasquery: thisq.indexOf("(") > -1,
          minw: thisq.match(respond.regex.minw) && parseFloat(RegExp.$1) + (RegExp.$2 || ""),
          maxw: thisq.match(respond.regex.maxw) && parseFloat(RegExp.$1) + (RegExp.$2 || "")
        });
      }
    }
    applyMedia();
  }, makeRequests = function() {
    if (requestQueue.length) {
      var thisRequest = requestQueue.shift();
      ajax(thisRequest.href, function(styles) {
        translate(styles, thisRequest.href, thisRequest.media);
        parsedSheets[thisRequest.href] = true;
        w.setTimeout(function() {
          makeRequests();
        }, 0);
      });
    }
  }, ripCSS = function() {
    for (var i = 0; i < links.length; i++) {
      var sheet = links[i], href = sheet.href, media = sheet.media, isCSS = sheet.rel && sheet.rel.toLowerCase() === "stylesheet";
      if (!!href && isCSS && !parsedSheets[href]) {
        if (sheet.styleSheet && sheet.styleSheet.rawCssText) {
          translate(sheet.styleSheet.rawCssText, href, media);
          parsedSheets[href] = true;
        } else {
          if (!/^([a-zA-Z:]*\/\/)/.test(href) && !base || href.replace(RegExp.$1, "").split("/")[0] === w.location.host) {
            if (href.substring(0, 2) === "//") {
              href = w.location.protocol + href;
            }
            requestQueue.push({
              href: href,
              media: media
            });
          }
        }
      }
    }
    makeRequests();
  };
  ripCSS();
  respond.update = ripCSS;
  respond.getEmValue = getEmValue;
  function callMedia() {
    applyMedia(true);
  }
  if (w.addEventListener) {
    w.addEventListener("resize", callMedia, false);
  } else if (w.attachEvent) {
    w.attachEvent("onresize", callMedia);
  }
})(this);
(function(root, factory) {
if (typeof exports === "object") {
module.exports = factory(require('angular'));
} else if (typeof define === "function" && define.amd) {
define(['angular'], factory);
} else{
factory(root.angular);
}
}(this, function(angular) {
/**
 * AngularJS Google Maps Ver. 1.17.2
 *
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014, 2015, 1016 Allen Kim
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
angular.module('ngMap', []);

/**
 * @ngdoc controller
 * @name MapController
 */
(function() {
  'use strict';
  var Attr2MapOptions;

  var __MapController = function(
      $scope, $element, $attrs, $parse, _Attr2MapOptions_, NgMap, NgMapPool
    ) {
    Attr2MapOptions = _Attr2MapOptions_;
    var vm = this;

    vm.mapOptions; /** @memberof __MapController */
    vm.mapEvents;  /** @memberof __MapController */
    vm.eventListeners;  /** @memberof __MapController */

    /**
     * Add an object to the collection of group
     * @memberof __MapController
     * @function addObject
     * @param groupName the name of collection that object belongs to
     * @param obj  an object to add into a collection, i.e. marker, shape
     */
    vm.addObject = function(groupName, obj) {
      if (vm.map) {
        vm.map[groupName] = vm.map[groupName] || {};
        var len = Object.keys(vm.map[groupName]).length;
        vm.map[groupName][obj.id || len] = obj;

        if (vm.map instanceof google.maps.Map) {
          //infoWindow.setMap works like infoWindow.open
          if (groupName != "infoWindows" && obj.setMap) {
            obj.setMap && obj.setMap(vm.map);
          }
          if (obj.centered && obj.position) {
            vm.map.setCenter(obj.position);
          }
          (groupName == 'markers') && vm.objectChanged('markers');
          (groupName == 'customMarkers') && vm.objectChanged('customMarkers');
        }
      }
    };

    /**
     * Delete an object from the collection and remove from map
     * @memberof __MapController
     * @function deleteObject
     * @param {Array} objs the collection of objects. i.e., map.markers
     * @param {Object} obj the object to be removed. i.e., marker
     */
    vm.deleteObject = function(groupName, obj) {
      /* delete from group */
      if (obj.map) {
        var objs = obj.map[groupName];
        for (var name in objs) {
          if (objs[name] === obj) {
            void 0;
            google.maps.event.clearInstanceListeners(obj);
            delete objs[name];
          }
        }

        /* delete from map */
        obj.map && obj.setMap && obj.setMap(null);

        (groupName == 'markers') && vm.objectChanged('markers');
        (groupName == 'customMarkers') && vm.objectChanged('customMarkers');
      }
    };

    /**
     * @memberof __MapController
     * @function observeAttrSetObj
     * @param {Hash} orgAttrs attributes before its initialization
     * @param {Hash} attrs    attributes after its initialization
     * @param {Object} obj    map object that an action is to be done
     * @description watch changes of attribute values and
     * do appropriate action based on attribute name
     */
    vm.observeAttrSetObj = function(orgAttrs, attrs, obj) {
      if (attrs.noWatcher) {
        return false;
      }
      var attrsToObserve = Attr2MapOptions.getAttrsToObserve(orgAttrs);
      for (var i=0; i<attrsToObserve.length; i++) {
        var attrName = attrsToObserve[i];
        attrs.$observe(attrName, NgMap.observeAndSet(attrName, obj));
      }
    };

    /**
     * @memberof __MapController
     * @function zoomToIncludeMarkers
     */
    vm.zoomToIncludeMarkers = function() {
      var bounds = new google.maps.LatLngBounds();
      for (var k1 in vm.map.markers) {
        bounds.extend(vm.map.markers[k1].getPosition());
      }
      for (var k2 in vm.map.customMarkers) {
        bounds.extend(vm.map.customMarkers[k2].getPosition());
      }
	  if (vm.mapOptions.maximumZoom) {
		  vm.enableMaximumZoomCheck = true; //enable zoom check after resizing for markers
	  }
      vm.map.fitBounds(bounds);
    };

    /**
     * @memberof __MapController
     * @function objectChanged
     * @param {String} group name of group e.g., markers
     */
    vm.objectChanged = function(group) {
      if ( vm.map &&
        (group == 'markers' || group == 'customMarkers') &&
        vm.map.zoomToIncludeMarkers == 'auto'
      ) {
        vm.zoomToIncludeMarkers();
      }
    };

    /**
     * @memberof __MapController
     * @function initializeMap
     * @description
     *  . initialize Google map on <div> tag
     *  . set map options, events, and observers
     *  . reset zoom to include all (custom)markers
     */
    vm.initializeMap = function() {
      var mapOptions = vm.mapOptions,
          mapEvents = vm.mapEvents;

      var lazyInitMap = vm.map; //prepared for lazy init
      vm.map = NgMapPool.getMapInstance($element[0]);
      NgMap.setStyle($element[0]);

      // set objects for lazyInit
      if (lazyInitMap) {

        /**
         * rebuild mapOptions for lazyInit
         * becasue attributes values might have been changed
         */
        var filtered = Attr2MapOptions.filter($attrs);
        var options = Attr2MapOptions.getOptions(filtered);
        var controlOptions = Attr2MapOptions.getControlOptions(filtered);
        mapOptions = angular.extend(options, controlOptions);
        void 0;

        for (var group in lazyInitMap) {
          var groupMembers = lazyInitMap[group]; //e.g. markers
          if (typeof groupMembers == 'object') {
            for (var id in groupMembers) {
              vm.addObject(group, groupMembers[id]);
            }
          }
        }
        vm.map.showInfoWindow = vm.showInfoWindow;
        vm.map.hideInfoWindow = vm.hideInfoWindow;
      }

      // set options
      mapOptions.zoom = mapOptions.zoom || 15;
      var center = mapOptions.center;
      if (!mapOptions.center ||
        ((typeof center === 'string') && center.match(/\{\{.*\}\}/))
      ) {
        mapOptions.center = new google.maps.LatLng(0, 0);
      } else if (!(center instanceof google.maps.LatLng)) {
        var geoCenter = mapOptions.center;
        delete mapOptions.center;
        NgMap.getGeoLocation(geoCenter, mapOptions.geoLocationOptions).
          then(function (latlng) {
            vm.map.setCenter(latlng);
            var geoCallback = mapOptions.geoCallback;
            geoCallback && $parse(geoCallback)($scope);
          }, function () {
            if (mapOptions.geoFallbackCenter) {
              vm.map.setCenter(mapOptions.geoFallbackCenter);
            }
          });
      }
      vm.map.setOptions(mapOptions);

      // set events
      for (var eventName in mapEvents) {
        var event = mapEvents[eventName];
        var listener = google.maps.event.addListener(vm.map, eventName, event);
        vm.eventListeners[eventName] = listener;
      }

      // set observers
      vm.observeAttrSetObj(orgAttrs, $attrs, vm.map);
      vm.singleInfoWindow = mapOptions.singleInfoWindow;

      google.maps.event.trigger(vm.map, 'resize');

      google.maps.event.addListenerOnce(vm.map, "idle", function () {
        NgMap.addMap(vm);
        if (mapOptions.zoomToIncludeMarkers) {
          vm.zoomToIncludeMarkers();
        }
        //TODO: it's for backward compatibiliy. will be removed
        $scope.map = vm.map;
        $scope.$emit('mapInitialized', vm.map);

        //callback
        if ($attrs.mapInitialized) {
          $parse($attrs.mapInitialized)($scope, {map: vm.map});
        }
      });
	  
	  //add maximum zoom listeners if zoom-to-include-markers and and maximum-zoom are valid attributes
	  if (mapOptions.zoomToIncludeMarkers && mapOptions.maximumZoom) {
	    google.maps.event.addListener(vm.map, 'zoom_changed', function() {
          if (vm.enableMaximumZoomCheck == true) {
			vm.enableMaximumZoomCheck = false;
	        google.maps.event.addListenerOnce(vm.map, 'bounds_changed', function() { 
		      vm.map.setZoom(Math.min(mapOptions.maximumZoom, vm.map.getZoom())); 
		    });
	  	  }
	    });
	  }
    };

    $scope.google = google; //used by $scope.eval to avoid eval()

    /**
     * get map options and events
     */
    var orgAttrs = Attr2MapOptions.orgAttributes($element);
    var filtered = Attr2MapOptions.filter($attrs);
    var options = Attr2MapOptions.getOptions(filtered, {scope: $scope});
    var controlOptions = Attr2MapOptions.getControlOptions(filtered);
    var mapOptions = angular.extend(options, controlOptions);
    var mapEvents = Attr2MapOptions.getEvents($scope, filtered);
    void 0;
    Object.keys(mapEvents).length && void 0;

    vm.mapOptions = mapOptions;
    vm.mapEvents = mapEvents;
    vm.eventListeners = {};

    if (options.lazyInit) { // allows controlled initialization
      // parse angular expression for dynamic ids
      if (!!$attrs.id && $attrs.id.startsWith('{{') && $attrs.id.endsWith('}}')) {
        var idExpression = $attrs.id.slice(2,-2);
        var mapId = $parse(idExpression)($scope);
      } else {
        var mapId = $attrs.id;
      }
      vm.map = {id: mapId}; //set empty, not real, map
      NgMap.addMap(vm);
    } else {
      vm.initializeMap();
    }

    //Trigger Resize
    if(options.triggerResize) {
      google.maps.event.trigger(vm.map, 'resize');
    }

    $element.bind('$destroy', function() {
      NgMapPool.returnMapInstance(vm.map);
      NgMap.deleteMap(vm);
    });
  }; // __MapController

  __MapController.$inject = [
    '$scope', '$element', '$attrs', '$parse', 'Attr2MapOptions', 'NgMap', 'NgMapPool'
  ];
  angular.module('ngMap').controller('__MapController', __MapController);
})();

/**
 * @ngdoc directive
 * @name bicycling-layer
 * @param Attr2Options {service}
 *   convert html attribute to Gogole map api options
 * @description
 *   Requires:  map directive
 *   Restrict To:  Element
 *
 * @example
 *
 *   <map zoom="13" center="34.04924594193164, -118.24104309082031">
 *     <bicycling-layer></bicycling-layer>
 *    </map>
 */
(function() {
  'use strict';
  var parser;

  var linkFunc = function(scope, element, attrs, mapController) {
    mapController = mapController[0]||mapController[1];
    var orgAttrs = parser.orgAttributes(element);
    var filtered = parser.filter(attrs);
    var options = parser.getOptions(filtered, {scope: scope});
    var events = parser.getEvents(scope, filtered);

    void 0;

    var layer = getLayer(options, events);
    mapController.addObject('bicyclingLayers', layer);
    mapController.observeAttrSetObj(orgAttrs, attrs, layer);  //observers
    element.bind('$destroy', function() {
      mapController.deleteObject('bicyclingLayers', layer);
    });
  };

  var getLayer = function(options, events) {
    var layer = new google.maps.BicyclingLayer(options);
    for (var eventName in events) {
      google.maps.event.addListener(layer, eventName, events[eventName]);
    }
    return layer;
  };

  var bicyclingLayer= function(Attr2MapOptions) {
    parser = Attr2MapOptions;
    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],
      link: linkFunc
     };
  };
  bicyclingLayer.$inject = ['Attr2MapOptions'];

  angular.module('ngMap').directive('bicyclingLayer', bicyclingLayer);
})();

/**
 * @ngdoc directive
 * @name custom-control
 * @param Attr2Options {service} convert html attribute to Gogole map api options
 * @param $compile {service} AngularJS $compile service
 * @description
 *   Build custom control and set to the map with position
 *
 *   Requires:  map directive
 *
 *   Restrict To:  Element
 *
 * @attr {String} position position of this control
 *        i.e. TOP_RIGHT
 * @attr {Number} index index of the control
 * @example
 *
 * Example:
 *  <map center="41.850033,-87.6500523" zoom="3">
 *    <custom-control id="home" position="TOP_LEFT" index="1">
 *      <div style="background-color: white;">
 *        <b>Home</b>
 *      </div>
 *    </custom-control>
 *  </map>
 *
 */
(function() {
  'use strict';
  var parser, $compile, NgMap;

  var linkFunc = function(scope, element, attrs, mapController) {
    mapController = mapController[0]||mapController[1];
    var filtered = parser.filter(attrs);
    var options = parser.getOptions(filtered, {scope: scope});
    var events = parser.getEvents(scope, filtered);

    /**
     * build a custom control element
     */
    var customControlEl = element[0].parentElement.removeChild(element[0]);
    $compile(customControlEl.innerHTML.trim())(scope);

    /**
     * set events
     */
    for (var eventName in events) {
      google.maps.event.addDomListener(customControlEl, eventName, events[eventName]);
    }

    mapController.addObject('customControls', customControlEl);
    var position = options.position;
    mapController.map.controls[google.maps.ControlPosition[position]].push(customControlEl);

    element.bind('$destroy', function() {
      mapController.deleteObject('customControls', customControlEl);
    });
  };

  var customControl =  function(Attr2MapOptions, _$compile_, _NgMap_)  {
    parser = Attr2MapOptions, $compile = _$compile_, NgMap = _NgMap_;

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],
      link: linkFunc
    }; // return
  };
  customControl.$inject = ['Attr2MapOptions', '$compile', 'NgMap'];

  angular.module('ngMap').directive('customControl', customControl);
})();

/**
 * @ngdoc directive
 * @memberof ngmap
 * @name custom-marker
 * @param Attr2Options {service} convert html attribute to Gogole map api options
 * @param $timeout {service} AngularJS $timeout
 * @description
 *   Marker with html
 *   Requires:  map directive
 *   Restrict To:  Element
 *
 * @attr {String} position required, position on map
 * @attr {Number} z-index optional
 * @attr {Boolean} visible optional
 * @example
 *
 * Example:
 *   <map center="41.850033,-87.6500523" zoom="3">
 *     <custom-marker position="41.850033,-87.6500523">
 *       <div>
 *         <b>Home</b>
 *       </div>
 *     </custom-marker>
 *   </map>
 *
 */
/* global document */
(function() {
  'use strict';
  var parser, $timeout, $compile, NgMap;

  var CustomMarker = function(options) {
    options = options || {};

    this.el = document.createElement('div');
    this.el.style.display = 'inline-block';
    this.el.style.visibility = "hidden";
    this.visible = true;
    for (var key in options) { /* jshint ignore:line */
     this[key] = options[key];
    }
  };

  var setCustomMarker = function() {

    CustomMarker.prototype = new google.maps.OverlayView();

    CustomMarker.prototype.setContent = function(html, scope) {
      this.el.innerHTML = html;
      this.el.style.position = 'absolute';
      if (scope) {
        $compile(angular.element(this.el).contents())(scope);
      }
    };

    CustomMarker.prototype.getDraggable = function() {
      return this.draggable;
    };

    CustomMarker.prototype.setDraggable = function(draggable) {
      this.draggable = draggable;
    };

    CustomMarker.prototype.getPosition = function() {
      return this.position;
    };

    CustomMarker.prototype.setPosition = function(position) {
      position && (this.position = position); /* jshint ignore:line */

      if (this.getProjection() && typeof this.position.lng == 'function') {
        var posPixel = this.getProjection().fromLatLngToDivPixel(this.position);
        var _this = this;
        var setPosition = function() {
          var x = Math.round(posPixel.x - (_this.el.offsetWidth/2));
          var y = Math.round(posPixel.y - _this.el.offsetHeight - 10); // 10px for anchor
          _this.el.style.left = x + "px";
          _this.el.style.top = y + "px";
          _this.el.style.visibility = "visible";
        };
        if (_this.el.offsetWidth && _this.el.offsetHeight) { 
          setPosition();
        } else {
          //delayed left/top calculation when width/height are not set instantly
          $timeout(setPosition, 300);
        }
      }
    };

    CustomMarker.prototype.setZIndex = function(zIndex) {
      zIndex && (this.zIndex = zIndex); /* jshint ignore:line */
      this.el.style.zIndex = this.zIndex;
    };

    CustomMarker.prototype.getVisible = function() {
      return this.visible;
    };

    CustomMarker.prototype.setVisible = function(visible) {
      this.el.style.display = visible ? 'inline-block' : 'none';
      this.visible = visible;
    };

    CustomMarker.prototype.addClass = function(className) {
      var classNames = this.el.className.trim().split(' ');
      (classNames.indexOf(className) == -1) && classNames.push(className); /* jshint ignore:line */
      this.el.className = classNames.join(' ');
    };

    CustomMarker.prototype.removeClass = function(className) {
      var classNames = this.el.className.split(' ');
      var index = classNames.indexOf(className);
      (index > -1) && classNames.splice(index, 1); /* jshint ignore:line */
      this.el.className = classNames.join(' ');
    };

    CustomMarker.prototype.onAdd = function() {
      this.getPanes().overlayMouseTarget.appendChild(this.el);
    };

    CustomMarker.prototype.draw = function() {
      this.setPosition();
      this.setZIndex(this.zIndex);
      this.setVisible(this.visible);
    };

    CustomMarker.prototype.onRemove = function() {
      this.el.parentNode.removeChild(this.el);
      //this.el = null;
    };
  };

  var linkFunc = function(orgHtml, varsToWatch) {
    //console.log('orgHtml', orgHtml, 'varsToWatch', varsToWatch);

    return function(scope, element, attrs, mapController) {
      mapController = mapController[0]||mapController[1];
      var orgAttrs = parser.orgAttributes(element);

      var filtered = parser.filter(attrs);
      var options = parser.getOptions(filtered, {scope: scope});
      var events = parser.getEvents(scope, filtered);

      /**
       * build a custom marker element
       */
      element[0].style.display = 'none';
      void 0;
      var customMarker = new CustomMarker(options);

      $timeout(function() { //apply contents, class, and location after it is compiled

        scope.$watch('[' + varsToWatch.join(',') + ']', function() {
          customMarker.setContent(orgHtml, scope);
        }, true);

        customMarker.setContent(element[0].innerHTML, scope);
        var classNames = element[0].firstElementChild.className;
        customMarker.addClass('custom-marker');
        customMarker.addClass(classNames);
        void 0;

        if (!(options.position instanceof google.maps.LatLng)) {
          NgMap.getGeoLocation(options.position).then(
                function(latlng) {
                  customMarker.setPosition(latlng);
                }
          );
        }

      });

      void 0;
      for (var eventName in events) { /* jshint ignore:line */
        google.maps.event.addDomListener(
          customMarker.el, eventName, events[eventName]);
      }
      mapController.addObject('customMarkers', customMarker);

      //set observers
      mapController.observeAttrSetObj(orgAttrs, attrs, customMarker);

      element.bind('$destroy', function() {
        //Is it required to remove event listeners when DOM is removed?
        mapController.deleteObject('customMarkers', customMarker);
      });

    }; // linkFunc
  };


  var customMarkerDirective = function(
      _$timeout_, _$compile_, Attr2MapOptions, _NgMap_
    )  {
    parser = Attr2MapOptions;
    $timeout = _$timeout_;
    $compile = _$compile_;
    NgMap = _NgMap_;

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],
      compile: function(element) {
        setCustomMarker();
        element[0].style.display ='none';
        var orgHtml = element.html();
        var matches = orgHtml.match(/{{([^}]+)}}/g);
        var varsToWatch = [];
        //filter out that contains '::', 'this.'
        (matches || []).forEach(function(match) {
          var toWatch = match.replace('{{','').replace('}}','');
          if (match.indexOf('::') == -1 &&
            match.indexOf('this.') == -1 &&
            varsToWatch.indexOf(toWatch) == -1) {
            varsToWatch.push(match.replace('{{','').replace('}}',''));
          }
        });

        return linkFunc(orgHtml, varsToWatch);
      }
    }; // return
  };// function
  customMarkerDirective.$inject =
    ['$timeout', '$compile', 'Attr2MapOptions', 'NgMap'];

  angular.module('ngMap').directive('customMarker', customMarkerDirective);
})();

/**
 * @ngdoc directive
 * @name directions
 * @description
 *   Enable directions on map.
 *   e.g., origin, destination, draggable, waypoints, etc
 *
 *   Requires:  map directive
 *
 *   Restrict To:  Element
 *
 * @attr {String} DirectionsRendererOptions
 *   [Any DirectionsRendererOptions](https://developers.google.com/maps/documentation/javascript/reference#DirectionsRendererOptions)
 * @attr {String} DirectionsRequestOptions
 *   [Any DirectionsRequest options](https://developers.google.com/maps/documentation/javascript/reference#DirectionsRequest)
 * @example
 *  <map zoom="14" center="37.7699298, -122.4469157">
 *    <directions
 *      draggable="true"
 *      panel="directions-panel"
 *      travel-mode="{{travelMode}}"
 *      waypoints="[{location:'kingston', stopover:true}]"
 *      origin="{{origin}}"
 *      destination="{{destination}}">
 *    </directions>
 *  </map>
 */
/* global document */
(function() {
  'use strict';
  var NgMap, $timeout, NavigatorGeolocation;

  var getDirectionsRenderer = function(options, events) {
    if (options.panel) {
      options.panel = document.getElementById(options.panel) ||
        document.querySelector(options.panel);
    }
    var renderer = new google.maps.DirectionsRenderer(options);
    for (var eventName in events) {
      google.maps.event.addListener(renderer, eventName, events[eventName]);
    }
    return renderer;
  };

  var updateRoute = function(renderer, options) {
    var directionsService = new google.maps.DirectionsService();

    /* filter out valid keys only for DirectionsRequest object*/
    var request = options;
    request.travelMode = request.travelMode || 'DRIVING';
    var validKeys = [
      'origin', 'destination', 'travelMode', 'transitOptions', 'unitSystem',
      'durationInTraffic', 'waypoints', 'optimizeWaypoints', 
      'provideRouteAlternatives', 'avoidHighways', 'avoidTolls', 'region'
    ];
    for(var key in request){
      (validKeys.indexOf(key) === -1) && (delete request[key]);
    }

    if(request.waypoints) {
      // Check fo valid values
      if(request.waypoints == "[]" || request.waypoints === "") {
        delete request.waypoints;
      }
    }

    var showDirections = function(request) {
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          $timeout(function() {
            renderer.setDirections(response);
          });
        }
      });
    };

    if (request.origin && request.destination) {
      if (request.origin == 'current-location') {
        NavigatorGeolocation.getCurrentPosition().then(function(ll) {
          request.origin = new google.maps.LatLng(ll.coords.latitude, ll.coords.longitude);
          showDirections(request);
        });
      } else if (request.destination == 'current-location') {
        NavigatorGeolocation.getCurrentPosition().then(function(ll) {
          request.destination = new google.maps.LatLng(ll.coords.latitude, ll.coords.longitude);
          showDirections(request);
        });
      } else {
        showDirections(request);
      }
    }
  };

  var directions = function(
      Attr2MapOptions, _$timeout_, _NavigatorGeolocation_, _NgMap_) {
    var parser = Attr2MapOptions;
    NgMap = _NgMap_;
    $timeout = _$timeout_;
    NavigatorGeolocation = _NavigatorGeolocation_;

    var linkFunc = function(scope, element, attrs, mapController) {
      mapController = mapController[0]||mapController[1];

      var orgAttrs = parser.orgAttributes(element);
      var filtered = parser.filter(attrs);
      var options = parser.getOptions(filtered, {scope: scope});
      var events = parser.getEvents(scope, filtered);
      var attrsToObserve = parser.getAttrsToObserve(orgAttrs);

      var renderer = getDirectionsRenderer(options, events);
      mapController.addObject('directionsRenderers', renderer);

      attrsToObserve.forEach(function(attrName) {
        (function(attrName) {
          attrs.$observe(attrName, function(val) {
            if (attrName == 'panel') {
              $timeout(function(){
                var panel =
                  document.getElementById(val) || document.querySelector(val);
                void 0;
                panel && renderer.setPanel(panel);
              });
            } else if (options[attrName] !== val) { //apply only if changed
              var optionValue = parser.toOptionValue(val, {key: attrName});
              void 0;
              options[attrName] = optionValue;
              updateRoute(renderer, options);
            }
          });
        })(attrName);
      });

      NgMap.getMap().then(function() {
        updateRoute(renderer, options);
      });
      element.bind('$destroy', function() {
        mapController.deleteObject('directionsRenderers', renderer);
      });
    };

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],
      link: linkFunc
    };
  }; // var directions
  directions.$inject =
    ['Attr2MapOptions', '$timeout', 'NavigatorGeolocation', 'NgMap'];

  angular.module('ngMap').directive('directions', directions);
})();


/**
 * @ngdoc directive
 * @name drawing-manager
 * @param Attr2Options {service} convert html attribute to Gogole map api options
 * @description
 *   Requires:  map directive
 *   Restrict To:  Element
 *
 * @example
 * Example:
 *
 *  <map zoom="13" center="37.774546, -122.433523" map-type-id="SATELLITE">
 *    <drawing-manager
 *      on-overlaycomplete="onMapOverlayCompleted()"
 *      position="ControlPosition.TOP_CENTER"
 *      drawingModes="POLYGON,CIRCLE"
 *      drawingControl="true"
 *      circleOptions="fillColor: '#FFFF00';fillOpacity: 1;strokeWeight: 5;clickable: false;zIndex: 1;editable: true;" >
 *    </drawing-manager>
 *  </map>
 *
 *  TODO: Add remove button.
 *  currently, for our solution, we have the shapes/markers in our own
 *  controller, and we use some css classes to change the shape button
 *  to a remove button (<div>X</div>) and have the remove operation in our own controller.
 */
(function() {
  'use strict';
  angular.module('ngMap').directive('drawingManager', [
    'Attr2MapOptions', function(Attr2MapOptions) {
    var parser = Attr2MapOptions;

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],

      link: function(scope, element, attrs, mapController) {
        mapController = mapController[0]||mapController[1];

        var filtered = parser.filter(attrs);
        var options = parser.getOptions(filtered, {scope: scope});
        var controlOptions = parser.getControlOptions(filtered);
        var events = parser.getEvents(scope, filtered);

        /**
         * set options
         */
        var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: options.drawingmode,
          drawingControl: options.drawingcontrol,
          drawingControlOptions: controlOptions.drawingControlOptions,
          circleOptions:options.circleoptions,
          markerOptions:options.markeroptions,
          polygonOptions:options.polygonoptions,
          polylineOptions:options.polylineoptions,
          rectangleOptions:options.rectangleoptions
        });

        //Observers
        attrs.$observe('drawingControlOptions', function (newValue) {
          drawingManager.drawingControlOptions = parser.getControlOptions({drawingControlOptions: newValue}).drawingControlOptions;
          drawingManager.setDrawingMode(null);
          drawingManager.setMap(mapController.map);
        });


        /**
         * set events
         */
        for (var eventName in events) {
          google.maps.event.addListener(drawingManager, eventName, events[eventName]);
        }

        mapController.addObject('mapDrawingManager', drawingManager);

        element.bind('$destroy', function() {
          mapController.deleteObject('mapDrawingManager', drawingManager);
        });
      }
    }; // return
  }]);
})();

/**
 * @ngdoc directive
 * @name dynamic-maps-engine-layer
 * @description
 *   Requires:  map directive
 *   Restrict To:  Element
 *
 * @example
 * Example:
 *   <map zoom="14" center="[59.322506, 18.010025]">
 *     <dynamic-maps-engine-layer
 *       layer-id="06673056454046135537-08896501997766553811">
 *     </dynamic-maps-engine-layer>
 *    </map>
 */
(function() {
  'use strict';

  angular.module('ngMap').directive('dynamicMapsEngineLayer', [
    'Attr2MapOptions', function(Attr2MapOptions) {
    var parser = Attr2MapOptions;

    var getDynamicMapsEngineLayer = function(options, events) {
      var layer = new google.maps.visualization.DynamicMapsEngineLayer(options);

      for (var eventName in events) {
        google.maps.event.addListener(layer, eventName, events[eventName]);
      }

      return layer;
    };

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],

      link: function(scope, element, attrs, mapController) {
        mapController = mapController[0]||mapController[1];

        var filtered = parser.filter(attrs);
        var options = parser.getOptions(filtered, {scope: scope});
        var events = parser.getEvents(scope, filtered, events);

        var layer = getDynamicMapsEngineLayer(options, events);
        mapController.addObject('mapsEngineLayers', layer);
      }
     }; // return
  }]);
})();

/**
 * @ngdoc directive
 * @name fusion-tables-layer
 * @description
 *   Requires:  map directive
 *   Restrict To:  Element
 *
 * @example
 * Example:
 *   <map zoom="11" center="41.850033, -87.6500523">
 *     <fusion-tables-layer query="{
 *       select: 'Geocodable address',
 *       from: '1mZ53Z70NsChnBMm-qEYmSDOvLXgrreLTkQUvvg'}">
 *     </fusion-tables-layer>
 *   </map>
 */
(function() {
  'use strict';

  angular.module('ngMap').directive('fusionTablesLayer', [
    'Attr2MapOptions', function(Attr2MapOptions) {
    var parser = Attr2MapOptions;

    var getLayer = function(options, events) {
      var layer = new google.maps.FusionTablesLayer(options);

      for (var eventName in events) {
        google.maps.event.addListener(layer, eventName, events[eventName]);
      }

      return layer;
    };

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],

      link: function(scope, element, attrs, mapController) {
        mapController = mapController[0]||mapController[1];

        var filtered = parser.filter(attrs);
        var options = parser.getOptions(filtered, {scope: scope});
        var events = parser.getEvents(scope, filtered, events);
        void 0;

        var layer = getLayer(options, events);
        mapController.addObject('fusionTablesLayers', layer);
      }
     }; // return
  }]);
})();

/**
 * @ngdoc directive
 * @name heatmap-layer
 * @param Attr2Options {service} convert html attribute to Gogole map api options
 * @description
 *   Requires:  map directive
 *   Restrict To:  Element
 *
 * @example
 *
 * <map zoom="11" center="[41.875696,-87.624207]">
 *   <heatmap-layer data="taxiData"></heatmap-layer>
 * </map>
 */
(function() {
  'use strict';

  angular.module('ngMap').directive('heatmapLayer', [
    'Attr2MapOptions', '$window', function(Attr2MapOptions, $window) {
    var parser = Attr2MapOptions;
    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],

      link: function(scope, element, attrs, mapController) {
        mapController = mapController[0]||mapController[1];

        var filtered = parser.filter(attrs);

        /**
         * set options
         */
        var options = parser.getOptions(filtered, {scope: scope});
        options.data = $window[attrs.data] || scope[attrs.data];
        if (options.data instanceof Array) {
          options.data = new google.maps.MVCArray(options.data);
        } else {
          throw "invalid heatmap data";
        }
        var layer = new google.maps.visualization.HeatmapLayer(options);

        /**
         * set events
         */
        var events = parser.getEvents(scope, filtered);
        void 0;

        mapController.addObject('heatmapLayers', layer);
      }
     }; // return
  }]);
})();

/**
 * @ngdoc directive
 * @name info-window
 * @param Attr2MapOptions {service}
 *   convert html attribute to Gogole map api options
 * @param $compile {service} $compile service
 * @description
 *  Defines infoWindow and provides compile method
 *
 *  Requires:  map directive
 *
 *  Restrict To:  Element
 *
 *  NOTE: this directive should **NOT** be used with `ng-repeat`
 *  because InfoWindow itself is a template, and a template must be
 *  reused by each marker, thus, should not be redefined repeatedly
 *  by `ng-repeat`.
 *
 * @attr {Boolean} visible
 *   Indicates to show it when map is initialized
 * @attr {Boolean} visible-on-marker
 *   Indicates to show it on a marker when map is initialized
 * @attr {Expression} geo-callback
 *   if position is an address, the expression is will be performed
 *   when geo-lookup is successful. e.g., geo-callback="showDetail()"
 * @attr {String} &lt;InfoWindowOption> Any InfoWindow options,
 *   https://developers.google.com/maps/documentation/javascript/reference?csw=1#InfoWindowOptions
 * @attr {String} &lt;InfoWindowEvent> Any InfoWindow events,
 *   https://developers.google.com/maps/documentation/javascript/reference
 * @example
 * Usage:
 *   <map MAP_ATTRIBUTES>
 *    <info-window id="foo" ANY_OPTIONS ANY_EVENTS"></info-window>
 *   </map>
 *
 * Example:
 *  <map center="41.850033,-87.6500523" zoom="3">
 *    <info-window id="1" position="41.850033,-87.6500523" >
 *      <div ng-non-bindable>
 *        Chicago, IL<br/>
 *        LatLng: {{chicago.lat()}}, {{chicago.lng()}}, <br/>
 *        World Coordinate: {{worldCoordinate.x}}, {{worldCoordinate.y}}, <br/>
 *        Pixel Coordinate: {{pixelCoordinate.x}}, {{pixelCoordinate.y}}, <br/>
 *        Tile Coordinate: {{tileCoordinate.x}}, {{tileCoordinate.y}} at Zoom Level {{map.getZoom()}}
 *      </div>
 *    </info-window>
 *  </map>
 */
/* global google */
(function() {
  'use strict';

  var infoWindow = function(Attr2MapOptions, $compile, $timeout, $parse, NgMap)  {
    var parser = Attr2MapOptions;

    var getInfoWindow = function(options, events, element) {
      var infoWindow;

      /**
       * set options
       */
      if (options.position && !(options.position instanceof google.maps.LatLng)) {
        delete options.position;
      }
      infoWindow = new google.maps.InfoWindow(options);

      /**
       * set events
       */
      for (var eventName in events) {
        if (eventName) {
          google.maps.event.addListener(infoWindow, eventName, events[eventName]);
        }
      }

      /**
       * set template ane template-relate functions
       * it must have a container element with ng-non-bindable
       */
      var template = element.html().trim();
      if (angular.element(template).length != 1) {
        throw "info-window working as a template must have a container";
      }
      infoWindow.__template = template.replace(/\s?ng-non-bindable[='"]+/,"");

      infoWindow.__open = function(map, scope, anchor) {
        $timeout(function() {
          anchor && (scope.anchor = anchor);
          var el = $compile(infoWindow.__template)(scope);
          infoWindow.setContent(el[0]);
          scope.$apply();
          if (anchor && anchor.getPosition) {
            infoWindow.open(map, anchor);
          } else if (anchor && anchor instanceof google.maps.LatLng) {
            infoWindow.open(map);
            infoWindow.setPosition(anchor);
          } else {
            infoWindow.open(map);
          }
          var infoWindowContainerEl = infoWindow.content.parentElement.parentElement.parentElement;
          infoWindowContainerEl.className = "ng-map-info-window";
        });
      };

      return infoWindow;
    };

    var linkFunc = function(scope, element, attrs, mapController) {
      mapController = mapController[0]||mapController[1];

      element.css('display','none');

      var orgAttrs = parser.orgAttributes(element);
      var filtered = parser.filter(attrs);
      var options = parser.getOptions(filtered, {scope: scope});
      var events = parser.getEvents(scope, filtered);

      var address;
      if (options.position && !(options.position instanceof google.maps.LatLng)) {
        address = options.position;
      }
      var infoWindow = getInfoWindow(options, events, element);
      if (address) {
        NgMap.getGeoLocation(address).then(function(latlng) {
          infoWindow.setPosition(latlng);
          infoWindow.__open(mapController.map, scope, latlng);
          var geoCallback = attrs.geoCallback;
          geoCallback && $parse(geoCallback)(scope);
        });
      }

      mapController.addObject('infoWindows', infoWindow);
      mapController.observeAttrSetObj(orgAttrs, attrs, infoWindow);

      mapController.showInfoWindow = 
      mapController.map.showInfoWindow = mapController.showInfoWindow ||
        function(p1, p2, p3) { //event, id, marker
          var id = typeof p1 == 'string' ? p1 : p2;
          var marker = typeof p1 == 'string' ? p2 : p3;
          if (typeof marker == 'string') {
            //Check if markers if defined to avoid odd 'undefined' errors
            if (typeof mapController.map.markers != "undefined"
                && typeof mapController.map.markers[marker] != "undefined") {
              marker = mapController.map.markers[marker];
            } else if (
                //additionally check if that marker is a custom marker
            typeof mapController.map.customMarkers
            && typeof mapController.map.customMarkers[marker] != "undefined") {
              marker = mapController.map.customMarkers[marker];
            } else {
              //Better error output if marker with that id is not defined
              throw new Error("Cant open info window for id " + marker + ". Marker or CustomMarker is not defined")
            }
          }

          var infoWindow = mapController.map.infoWindows[id];
          var anchor = marker ? marker : (this.getPosition ? this : null);
          infoWindow.__open(mapController.map, scope, anchor);
          if(mapController.singleInfoWindow) {
            if(mapController.lastInfoWindow) {
              scope.hideInfoWindow(mapController.lastInfoWindow);
            }
            mapController.lastInfoWindow = id;
          }
        };

      mapController.hideInfoWindow =
      mapController.map.hideInfoWindow = mapController.hideInfoWindow ||
        function(p1, p2) {
          var id = typeof p1 == 'string' ? p1 : p2;
          var infoWindow = mapController.map.infoWindows[id];
          infoWindow.close();
        };

      //TODO DEPRECATED
      scope.showInfoWindow = mapController.map.showInfoWindow;
      scope.hideInfoWindow = mapController.map.hideInfoWindow;

      NgMap.getMap().then(function(map) {
        infoWindow.visible && infoWindow.__open(map, scope);
        if (infoWindow.visibleOnMarker) {
          var markerId = infoWindow.visibleOnMarker;
          infoWindow.__open(map, scope, map.markers[markerId]);
        }
      });

    }; //link

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],
      link: linkFunc
    };

  }; // infoWindow
  infoWindow.$inject =
    ['Attr2MapOptions', '$compile', '$timeout', '$parse', 'NgMap'];

  angular.module('ngMap').directive('infoWindow', infoWindow);
})();

/**
 * @ngdoc directive
 * @name kml-layer
 * @param Attr2MapOptions {service} convert html attribute to Gogole map api options
 * @description
 *   renders Kml layer on a map
 *   Requires:  map directive
 *   Restrict To:  Element
 *
 * @attr {Url} url url of the kml layer
 * @attr {KmlLayerOptions} KmlLayerOptions
 *   (https://developers.google.com/maps/documentation/javascript/reference#KmlLayerOptions) 
 * @attr {String} &lt;KmlLayerEvent> Any KmlLayer events,
 *   https://developers.google.com/maps/documentation/javascript/reference
 * @example
 * Usage:
 *   <map MAP_ATTRIBUTES>
 *    <kml-layer ANY_KML_LAYER ANY_KML_LAYER_EVENTS"></kml-layer>
 *   </map>
 *
 * Example:
 *
 * <map zoom="11" center="[41.875696,-87.624207]">
 *   <kml-layer url="https://gmaps-samples.googlecode.com/svn/trunk/ggeoxml/cta.kml" >
 *   </kml-layer>
 * </map>
 */
(function() {
  'use strict';

  angular.module('ngMap').directive('kmlLayer', [
    'Attr2MapOptions', function(Attr2MapOptions) {
    var parser = Attr2MapOptions;

    var getKmlLayer = function(options, events) {
      var kmlLayer = new google.maps.KmlLayer(options);
      for (var eventName in events) {
        google.maps.event.addListener(kmlLayer, eventName, events[eventName]);
      }
      return kmlLayer;
    };

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],

      link: function(scope, element, attrs, mapController) {
        mapController = mapController[0]||mapController[1];

        var orgAttrs = parser.orgAttributes(element);
        var filtered = parser.filter(attrs);
        var options = parser.getOptions(filtered, {scope: scope});
        var events = parser.getEvents(scope, filtered);
        void 0;

        var kmlLayer = getKmlLayer(options, events);
        mapController.addObject('kmlLayers', kmlLayer);
        mapController.observeAttrSetObj(orgAttrs, attrs, kmlLayer);  //observers
        element.bind('$destroy', function() {
          mapController.deleteObject('kmlLayers', kmlLayer);
        });
      }
     }; // return
  }]);
})();

/**
 * @ngdoc directive
 * @name map-data
 * @param Attr2MapOptions {service}
 *   convert html attribute to Gogole map api options
 * @description
 *   set map data
 *   Requires:  map directive
 *   Restrict To:  Element
 *
 * @wn {String} method-name, run map.data[method-name] with attribute value
 * @example
 * Example:
 *
 *  <map zoom="11" center="[41.875696,-87.624207]">
 *    <map-data load-geo-json="https://storage.googleapis.com/maps-devrel/google.json"></map-data>
 *   </map>
 */
(function() {
  'use strict';

  angular.module('ngMap').directive('mapData', [
    'Attr2MapOptions', 'NgMap', function(Attr2MapOptions, NgMap) {
    var parser = Attr2MapOptions;
    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],

      link: function(scope, element, attrs) {
        var filtered = parser.filter(attrs);
        var options = parser.getOptions(filtered, {scope: scope});
        var events = parser.getEvents(scope, filtered, events);

        void 0;
        NgMap.getMap().then(function(map) {
          //options
          for (var key in options) {
            var val = options[key];
            if (typeof scope[val] === "function") {
              map.data[key](scope[val]);
            } else {
              map.data[key](val);
            }
          }

          //events
          for (var eventName in events) {
            map.data.addListener(eventName, events[eventName]);
          }
        });
      }
     }; // return
  }]);
})();

/**
 * @ngdoc directive
 * @name map-lazy-load
 * @param Attr2Options {service} convert html attribute to Gogole map api options
 * @description
 *  Requires: Delay the initialization of map directive
 *    until the map is ready to be rendered
 *  Restrict To: Attribute
 *
 * @attr {String} map-lazy-load
 *    Maps api script source file location.
 *    Example:
 *      'https://maps.google.com/maps/api/js'
 * @attr {String} map-lazy-load-params
 *   Maps api script source file location via angular scope variable.
 *   Also requires the map-lazy-load attribute to be present in the directive.
 *   Example: In your controller, set
 *     $scope.googleMapsURL = 'https://maps.google.com/maps/api/js?v=3.20&client=XXXXXenter-api-key-hereXXXX'
 *
 * @example
 * Example:
 *
 *   <div map-lazy-load="http://maps.google.com/maps/api/js">
 *     <map center="Brampton" zoom="10">
 *       <marker position="Brampton"></marker>
 *     </map>
 *   </div>
 *
 *   <div map-lazy-load="http://maps.google.com/maps/api/js"
 *        map-lazy-load-params="{{googleMapsUrl}}">
 *     <map center="Brampton" zoom="10">
 *       <marker position="Brampton"></marker>
 *     </map>
 *   </div>
 */
/* global window, document */
(function() {
  'use strict';
  var $timeout, $compile, src, savedHtml;

  var preLinkFunc = function(scope, element, attrs) {
    var mapsUrl = attrs.mapLazyLoadParams || attrs.mapLazyLoad;

    window.lazyLoadCallback = function() {
      void 0;
      $timeout(function() { /* give some time to load */
        element.html(savedHtml);
        $compile(element.contents())(scope);
      }, 100);
    };

    if(window.google === undefined || window.google.maps === undefined) {
      var scriptEl = document.createElement('script');
      void 0;

      scriptEl.src = mapsUrl +
        (mapsUrl.indexOf('?') > -1 ? '&' : '?') +
        'callback=lazyLoadCallback';

        if (!document.querySelector('script[src="' + scriptEl.src + '"]')) {
          document.body.appendChild(scriptEl);
        }
    } else {
      element.html(savedHtml);
      $compile(element.contents())(scope);
    }
  };

  var compileFunc = function(tElement, tAttrs) {

    (!tAttrs.mapLazyLoad) && void 0;
    savedHtml = tElement.html();
    src = tAttrs.mapLazyLoad;

    /**
     * if already loaded, stop processing it
     */
    if(window.google !== undefined && window.google.maps !== undefined) {
      return false;
    }

    tElement.html('');  // will compile again after script is loaded

    return {
      pre: preLinkFunc
    };
  };

  var mapLazyLoad = function(_$compile_, _$timeout_) {
    $compile = _$compile_, $timeout = _$timeout_;
    return {
      compile: compileFunc
    };
  };
  mapLazyLoad.$inject = ['$compile','$timeout'];

  angular.module('ngMap').directive('mapLazyLoad', mapLazyLoad);
})();

/**
 * @ngdoc directive
 * @name map-type
 * @param Attr2MapOptions {service} 
 *   convert html attribute to Google map api options
 * @description
 *   Requires:  map directive
 *   Restrict To:  Element
 *
 * @example
 * Example:
 *
 *   <map zoom="13" center="34.04924594193164, -118.24104309082031">
 *     <map-type name="coordinate" object="coordinateMapType"></map-type>
 *   </map>
 */
(function() {
  'use strict';

  angular.module('ngMap').directive('mapType', ['$parse', 'NgMap',
    function($parse, NgMap) {

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],

      link: function(scope, element, attrs, mapController) {
        mapController = mapController[0]||mapController[1];

        var mapTypeName = attrs.name, mapTypeObject;
        if (!mapTypeName) {
          throw "invalid map-type name";
        }
        mapTypeObject = $parse(attrs.object)(scope);
        if (!mapTypeObject) {
          throw "invalid map-type object";
        }

        NgMap.getMap().then(function(map) {
          map.mapTypes.set(mapTypeName, mapTypeObject);
        });
        mapController.addObject('mapTypes', mapTypeObject);
      }
     }; // return
  }]);
})();

/**
 * @ngdoc directive
 * @memberof ngMap
 * @name ng-map
 * @param Attr2Options {service}
 *  convert html attribute to Gogole map api options
 * @description
 * Implementation of {@link __MapController}
 * Initialize a Google map within a `<div>` tag
 *   with given options and register events
 *
 * @attr {Expression} map-initialized
 *   callback function when map is initialized
 *   e.g., map-initialized="mycallback(map)"
 * @attr {Expression} geo-callback if center is an address or current location,
 *   the expression is will be executed when geo-lookup is successful.
 *   e.g., geo-callback="showMyStoreInfo()"
 * @attr {Array} geo-fallback-center
 *   The center of map incase geolocation failed. i.e. [0,0]
 * @attr {Object} geo-location-options
 *  The navigator geolocation options.
 *  e.g., { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }.
 *  If none specified, { timeout: 5000 }.
 *  If timeout not specified, timeout: 5000 added
 * @attr {Boolean} zoom-to-include-markers
 *  When true, map boundary will be changed automatially
 *  to include all markers when initialized
 * @attr {Boolean} default-style
 *  When false, the default styling,
 *  `display:block;height:300px`, will be ignored.
 * @attr {String} &lt;MapOption> Any Google map options,
 *  https://developers.google.com/maps/documentation/javascript/reference?csw=1#MapOptions
 * @attr {String} &lt;MapEvent> Any Google map events,
 *  https://rawgit.com/allenhwkim/angularjs-google-maps/master/build/map_events.html
 * @attr {Boolean} single-info-window
 *  When true the map will only display one info window at the time,
 *  if not set or false,
 *  everytime an info window is open it will be displayed with the othe one.
 * @attr {Boolean} trigger-resize
 *  Default to false.  Set to true to trigger resize of the map.  Needs to be done anytime you resize the map
 * @example
 * Usage:
 *   <map MAP_OPTIONS_OR_MAP_EVENTS ..>
 *     ... Any children directives
 *   </map>
 *
 * Example:
 *   <map center="[40.74, -74.18]" on-click="doThat()">
 *   </map>
 *
 *   <map geo-fallback-center="[40.74, -74.18]" zoom-to-inlude-markers="true">
 *   </map>
 */
(function () {
  'use strict';

  var mapDirective = function () {
    return {
      restrict: 'AE',
      controller: '__MapController',
      controllerAs: 'ngmap'
    };
  };

  angular.module('ngMap').directive('map', [mapDirective]);
  angular.module('ngMap').directive('ngMap', [mapDirective]);
})();

/**
 * @ngdoc directive
 * @name maps-engine-layer
 * @description
 *   Requires:  map directive
 *   Restrict To:  Element
 *
 * @example
 * Example:
 *  <map zoom="14" center="[59.322506, 18.010025]">
 *    <maps-engine-layer layer-id="06673056454046135537-08896501997766553811">
 *    </maps-engine-layer>
 *  </map>
 */
(function() {
  'use strict';

  angular.module('ngMap').directive('mapsEngineLayer', ['Attr2MapOptions', function(Attr2MapOptions) {
    var parser = Attr2MapOptions;

    var getMapsEngineLayer = function(options, events) {
      var layer = new google.maps.visualization.MapsEngineLayer(options);

      for (var eventName in events) {
        google.maps.event.addListener(layer, eventName, events[eventName]);
      }

      return layer;
    };

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],

      link: function(scope, element, attrs, mapController) {
        mapController = mapController[0]||mapController[1];

        var filtered = parser.filter(attrs);
        var options = parser.getOptions(filtered, {scope: scope});
        var events = parser.getEvents(scope, filtered, events);
        void 0;

        var layer = getMapsEngineLayer(options, events);
        mapController.addObject('mapsEngineLayers', layer);
      }
     }; // return
  }]);
})();

/**
 * @ngdoc directive
 * @name marker
 * @param Attr2Options {service} convert html attribute to Gogole map api options
 * @param NavigatorGeolocation It is used to find the current location
 * @description
 *  Draw a Google map marker on a map with given options and register events
 *
 *  Requires:  map directive
 *
 *  Restrict To:  Element
 *
 * @attr {String} position address, 'current', or [latitude, longitude]
 *  example:
 *    '1600 Pennsylvania Ave, 20500  Washingtion DC',
 *    'current position',
 *    '[40.74, -74.18]'
 * @attr {Boolean} centered if set, map will be centered with this marker
 * @attr {Expression} geo-callback if position is an address,
 *   the expression is will be performed when geo-lookup is successful.
 *   e.g., geo-callback="showStoreInfo()"
 * @attr {Boolean} no-watcher if true, no attribute observer is added.
 *   Useful for many ng-repeat
 * @attr {String} &lt;MarkerOption>
 *   [Any Marker options](https://developers.google.com/maps/documentation/javascript/reference?csw=1#MarkerOptions)
 * @attr {String} &lt;MapEvent>
 *   [Any Marker events](https://developers.google.com/maps/documentation/javascript/reference)
 * @example
 * Usage:
 *   <map MAP_ATTRIBUTES>
 *    <marker ANY_MARKER_OPTIONS ANY_MARKER_EVENTS"></MARKER>
 *   </map>
 *
 * Example:
 *   <map center="[40.74, -74.18]">
 *    <marker position="[40.74, -74.18]" on-click="myfunc()"></div>
 *   </map>
 *
 *   <map center="the cn tower">
 *    <marker position="the cn tower" on-click="myfunc()"></div>
 *   </map>
 */
/* global google */
(function() {
  'use strict';
  var parser, $parse, NgMap;

  var getMarker = function(options, events) {
    var marker;

    if (NgMap.defaultOptions.marker) {
      for (var key in NgMap.defaultOptions.marker) {
        if (typeof options[key] == 'undefined') {
          void 0;
          options[key] = NgMap.defaultOptions.marker[key];
        }
      }
    }

    if (!(options.position instanceof google.maps.LatLng)) {
      options.position = new google.maps.LatLng(0,0);
    }
    marker = new google.maps.Marker(options);

    /**
     * set events
     */
    if (Object.keys(events).length > 0) {
      void 0;
    }
    for (var eventName in events) {
      if (eventName) {
        google.maps.event.addListener(marker, eventName, events[eventName]);
      }
    }

    return marker;
  };

  var linkFunc = function(scope, element, attrs, mapController) {
    mapController = mapController[0]||mapController[1];

    var orgAttrs = parser.orgAttributes(element);
    var filtered = parser.filter(attrs);
    var markerOptions = parser.getOptions(filtered, scope, {scope: scope});
    var markerEvents = parser.getEvents(scope, filtered);
    void 0;

    var address;
    if (!(markerOptions.position instanceof google.maps.LatLng)) {
      address = markerOptions.position;
    }
    var marker = getMarker(markerOptions, markerEvents);
    mapController.addObject('markers', marker);
    if (address) {
      NgMap.getGeoLocation(address).then(function(latlng) {
        marker.setPosition(latlng);
        markerOptions.centered && marker.map.setCenter(latlng);
        var geoCallback = attrs.geoCallback;
        geoCallback && $parse(geoCallback)(scope);
      });
    }

    //set observers
    mapController.observeAttrSetObj(orgAttrs, attrs, marker); /* observers */

    element.bind('$destroy', function() {
      mapController.deleteObject('markers', marker);
    });
  };

  var marker = function(Attr2MapOptions, _$parse_, _NgMap_) {
    parser = Attr2MapOptions;
    $parse = _$parse_;
    NgMap = _NgMap_;

    return {
      restrict: 'E',
      require: ['^?map','?^ngMap'],
      link: linkFunc
    };
  };

  marker.$inject = ['Attr2MapOptions', '$parse', 'NgMap'];
  angular.module('ngMap').directive('marker', marker);

})();

/**
 * @ngdoc directive
 * @name overlay-map-type
 * @param Attr2MapOptions {service} convert html attribute to Gogole map api options
 * @param $window {service}
 * @description
 *   Requires:  map directive
 *   Restrict To:  Element
 *
 * @example
 * Example:
 *
 * <map zoom="13" center="34.04924594193164, -118.24104309082031">
 *   <overlay-map-type index="0" object="coordinateMapType"></map-type>
 * </map>
 */
(function() {
  'use strict';

  angular.module('ngMap').directive('overlayMapType', [
    'NgMap', function(NgMap) {

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],

      link: function(scope, element, attrs, mapController) {
        mapController = mapController[0]||mapController[1];

        var initMethod = attrs.initMethod || "insertAt";
        var overlayMapTypeObject = scope[attrs.object];

        NgMap.getMap().then(function(map) {
          if (initMethod == "insertAt") {
            var index = parseInt(attrs.index, 10);
            map.overlayMapTypes.insertAt(index, overlayMapTypeObject);
          } else if (initMethod == "push") {
            map.overlayMapTypes.push(overlayMapTypeObject);
          }
        });
        mapController.addObject('overlayMapTypes', overlayMapTypeObject);
      }
     }; // return
  }]);
})();

/**
 * @ngdoc directive
 * @name places-auto-complete
 * @param Attr2MapOptions {service} convert html attribute to Gogole map api options
 * @description
 *   Provides address auto complete feature to an input element
 *   Requires: input tag
 *   Restrict To: Attribute
 *
 * @attr {AutoCompleteOptions}
 *   [Any AutocompleteOptions](https://developers.google.com/maps/documentation/javascript/3.exp/reference#AutocompleteOptions)
 *
 * @example
 * Example:
 *   <script src="https://maps.googleapis.com/maps/api/js?libraries=places"></script>
 *   <input places-auto-complete types="['geocode']" on-place-changed="myCallback(place)" />
 */
/* global google */
(function() {
  'use strict';

  var placesAutoComplete = function(Attr2MapOptions, $timeout) {
    var parser = Attr2MapOptions;

    var linkFunc = function(scope, element, attrs, ngModelCtrl) {
      if (attrs.placesAutoComplete ==='false') {
        return false;
      }
      var filtered = parser.filter(attrs);
      var options = parser.getOptions(filtered, {scope: scope});
      var events = parser.getEvents(scope, filtered);
      var autocomplete = new google.maps.places.Autocomplete(element[0], options);
      for (var eventName in events) {
        google.maps.event.addListener(autocomplete, eventName, events[eventName]);
      }

      var updateModel = function() {
        $timeout(function(){
          ngModelCtrl && ngModelCtrl.$setViewValue(element.val());
        },100);
      };
      google.maps.event.addListener(autocomplete, 'place_changed', updateModel);
      element[0].addEventListener('change', updateModel);

      attrs.$observe('types', function(val) {
        if (val) {
          var optionValue = parser.toOptionValue(val, {key: 'types'});
          autocomplete.setTypes(optionValue);
        }
      });
    };

    return {
      restrict: 'A',
      require: '?ngModel',
      link: linkFunc
    };
  };

  placesAutoComplete.$inject = ['Attr2MapOptions', '$timeout'];
  angular.module('ngMap').directive('placesAutoComplete', placesAutoComplete);

})();

/**
 * @ngdoc directive
 * @name shape
 * @param Attr2MapOptions {service} convert html attribute to Gogole map api options
 * @description
 *   Initialize a Google map shape in map with given options and register events
 *   The shapes are:
 *     . circle
 *     . polygon
 *     . polyline
 *     . rectangle
 *     . groundOverlay(or image)
 *
 *   Requires:  map directive
 *
 *   Restrict To:  Element
 *
 * @attr {Boolean} centered if set, map will be centered with this marker
 * @attr {Expression} geo-callback if shape is a circle and the center is
 *   an address, the expression is will be performed when geo-lookup
 *   is successful. e.g., geo-callback="showDetail()"
 * @attr {String} &lt;OPTIONS>
 *   For circle, [any circle options](https://developers.google.com/maps/documentation/javascript/reference#CircleOptions)
 *   For polygon, [any polygon options](https://developers.google.com/maps/documentation/javascript/reference#PolygonOptions)
 *   For polyline, [any polyline options](https://developers.google.com/maps/documentation/javascript/reference#PolylineOptions)
 *   For rectangle, [any rectangle options](https://developers.google.com/maps/documentation/javascript/reference#RectangleOptions)
 *   For image, [any groundOverlay options](https://developers.google.com/maps/documentation/javascript/reference#GroundOverlayOptions)
 * @attr {String} &lt;MapEvent> [Any Shape events](https://developers.google.com/maps/documentation/javascript/reference)
 * @example
 * Usage:
 *   <map MAP_ATTRIBUTES>
 *    <shape name=SHAPE_NAME ANY_SHAPE_OPTIONS ANY_SHAPE_EVENTS"></MARKER>
 *   </map>
 *
 * Example:
 *
 *   <map zoom="11" center="[40.74, -74.18]">
 *     <shape id="polyline" name="polyline" geodesic="true"
 *       stroke-color="#FF0000" stroke-opacity="1.0" stroke-weight="2"
 *       path="[[40.74,-74.18],[40.64,-74.10],[40.54,-74.05],[40.44,-74]]" >
 *     </shape>
 *   </map>
 *
 *   <map zoom="11" center="[40.74, -74.18]">
 *     <shape id="polygon" name="polygon" stroke-color="#FF0000"
 *       stroke-opacity="1.0" stroke-weight="2"
 *       paths="[[40.74,-74.18],[40.64,-74.18],[40.84,-74.08],[40.74,-74.18]]" >
 *     </shape>
 *   </map>
 *
 *   <map zoom="11" center="[40.74, -74.18]">
 *     <shape id="rectangle" name="rectangle" stroke-color='#FF0000'
 *       stroke-opacity="0.8" stroke-weight="2"
 *       bounds="[[40.74,-74.18], [40.78,-74.14]]" editable="true" >
 *     </shape>
 *   </map>
 *
 *   <map zoom="11" center="[40.74, -74.18]">
 *     <shape id="circle" name="circle" stroke-color='#FF0000'
 *       stroke-opacity="0.8"stroke-weight="2"
 *       center="[40.70,-74.14]" radius="4000" editable="true" >
 *     </shape>
 *   </map>
 *
 *   <map zoom="11" center="[40.74, -74.18]">
 *     <shape id="image" name="image"
 *       url="https://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg"
 *       bounds="[[40.71,-74.22],[40.77,-74.12]]" opacity="0.7"
 *       clickable="true">
 *     </shape>
 *   </map>
 *
 *  For full-working example, please visit
 *    [shape example](https://rawgit.com/allenhwkim/angularjs-google-maps/master/build/shape.html)
 */
/* global google */
(function() {
  'use strict';

  var getShape = function(options, events) {
    var shape;

    var shapeName = options.name;
    delete options.name;  //remove name bcoz it's not for options
    void 0;

    /**
     * set options
     */
    switch(shapeName) {
      case "circle":
        if (!(options.center instanceof google.maps.LatLng)) {
          options.center = new google.maps.LatLng(0,0);
        } 
        shape = new google.maps.Circle(options);
        break;
      case "polygon":
        shape = new google.maps.Polygon(options);
        break;
      case "polyline":
        shape = new google.maps.Polyline(options);
        break;
      case "rectangle":
        shape = new google.maps.Rectangle(options);
        break;
      case "groundOverlay":
      case "image":
        var url = options.url;
        var opts = {opacity: options.opacity, clickable: options.clickable, id:options.id};
        shape = new google.maps.GroundOverlay(url, options.bounds, opts);
        break;
    }

    /**
     * set events
     */
    for (var eventName in events) {
      if (events[eventName]) {
        google.maps.event.addListener(shape, eventName, events[eventName]);
      }
    }
    return shape;
  };

  var shape = function(Attr2MapOptions, $parse, NgMap) {
    var parser = Attr2MapOptions;

    var linkFunc = function(scope, element, attrs, mapController) {
      mapController = mapController[0]||mapController[1];

      var orgAttrs = parser.orgAttributes(element);
      var filtered = parser.filter(attrs);
      var shapeOptions = parser.getOptions(filtered, {scope: scope});
      var shapeEvents = parser.getEvents(scope, filtered);

      var address, shapeType;
      shapeType = shapeOptions.name;
      if (!(shapeOptions.center instanceof google.maps.LatLng)) {
        address = shapeOptions.center;
      }
      var shape = getShape(shapeOptions, shapeEvents);
      mapController.addObject('shapes', shape);

      if (address && shapeType == 'circle') {
        NgMap.getGeoLocation(address).then(function(latlng) {
          shape.setCenter(latlng);
          shape.centered && shape.map.setCenter(latlng);
          var geoCallback = attrs.geoCallback;
          geoCallback && $parse(geoCallback)(scope);
        });
      }

      //set observers
      mapController.observeAttrSetObj(orgAttrs, attrs, shape);
      element.bind('$destroy', function() {
        mapController.deleteObject('shapes', shape);
      });
    };

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],
      link: linkFunc
     }; // return
  };
  shape.$inject = ['Attr2MapOptions', '$parse', 'NgMap'];

  angular.module('ngMap').directive('shape', shape);

})();

/**
 * @ngdoc directive
 * @name streetview-panorama
 * @param Attr2MapOptions {service} convert html attribute to Gogole map api options
 * @description
 *   Requires:  map directive
 *   Restrict To:  Element
 *
 * @attr container Optional, id or css selector, if given, streetview will be in the given html element
 * @attr {String} &lt;StreetViewPanoramaOption>
 *   [Any Google StreetViewPanorama options](https://developers.google.com/maps/documentation/javascript/reference?csw=1#StreetViewPanoramaOptions)
 * @attr {String} &lt;StreetViewPanoramaEvent>
 *   [Any Google StreetViewPanorama events](https://developers.google.com/maps/documentation/javascript/reference#StreetViewPanorama)
 *
 * @example
 *   <map zoom="11" center="[40.688738,-74.043871]" >
 *     <street-view-panorama
 *       click-to-go="true"
 *       disable-default-ui="true"
 *       disable-double-click-zoom="true"
 *       enable-close-button="true"
 *       pano="my-pano"
 *       position="40.688738,-74.043871"
 *       pov="{heading:0, pitch: 90}"
 *       scrollwheel="false"
 *       visible="true">
 *     </street-view-panorama>
 *   </map>
 */
/* global google, document */
(function() {
  'use strict';

  var streetViewPanorama = function(Attr2MapOptions, NgMap) {
    var parser = Attr2MapOptions;

    var getStreetViewPanorama = function(map, options, events) {
      var svp, container;
      if (options.container) {
        container = document.getElementById(options.container);
        container = container || document.querySelector(options.container);
      }
      if (container) {
        svp = new google.maps.StreetViewPanorama(container, options);
      } else {
        svp = map.getStreetView();
        svp.setOptions(options);
      }

      for (var eventName in events) {
        eventName &&
          google.maps.event.addListener(svp, eventName, events[eventName]);
      }
      return svp;
    };

    var linkFunc = function(scope, element, attrs) {
      var filtered = parser.filter(attrs);
      var options = parser.getOptions(filtered, {scope: scope});
      var controlOptions = parser.getControlOptions(filtered);
      var svpOptions = angular.extend(options, controlOptions);

      var svpEvents = parser.getEvents(scope, filtered);
      void 0;

      NgMap.getMap().then(function(map) {
        var svp = getStreetViewPanorama(map, svpOptions, svpEvents);

        map.setStreetView(svp);
        (!svp.getPosition()) && svp.setPosition(map.getCenter());
        google.maps.event.addListener(svp, 'position_changed', function() {
          if (svp.getPosition() !== map.getCenter()) {
            map.setCenter(svp.getPosition());
          }
        });
        //needed for geo-callback
        var listener =
          google.maps.event.addListener(map, 'center_changed', function() {
            svp.setPosition(map.getCenter());
            google.maps.event.removeListener(listener);
          });
      });

    }; //link

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],
      link: linkFunc
    };

  };
  streetViewPanorama.$inject = ['Attr2MapOptions', 'NgMap'];

  angular.module('ngMap').directive('streetViewPanorama', streetViewPanorama);
})();

/**
 * @ngdoc directive
 * @name traffic-layer
 * @param Attr2MapOptions {service} convert html attribute to Gogole map api options
 * @description
 *   Requires:  map directive
 *   Restrict To:  Element
 *
 * @example
 * Example:
 *
 *   <map zoom="13" center="34.04924594193164, -118.24104309082031">
 *     <traffic-layer></traffic-layer>
 *    </map>
 */
(function() {
  'use strict';

  angular.module('ngMap').directive('trafficLayer', [
    'Attr2MapOptions', function(Attr2MapOptions) {
    var parser = Attr2MapOptions;

    var getLayer = function(options, events) {
      var layer = new google.maps.TrafficLayer(options);
      for (var eventName in events) {
        google.maps.event.addListener(layer, eventName, events[eventName]);
      }
      return layer;
    };

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],

      link: function(scope, element, attrs, mapController) {
        mapController = mapController[0]||mapController[1];

        var orgAttrs = parser.orgAttributes(element);
        var filtered = parser.filter(attrs);
        var options = parser.getOptions(filtered, {scope: scope});
        var events = parser.getEvents(scope, filtered);
        void 0;

        var layer = getLayer(options, events);
        mapController.addObject('trafficLayers', layer);
        mapController.observeAttrSetObj(orgAttrs, attrs, layer);  //observers
        element.bind('$destroy', function() {
          mapController.deleteObject('trafficLayers', layer);
        });
      }
     }; // return
  }]);
})();

/**
 * @ngdoc directive
 * @name transit-layer
 * @param Attr2MapOptions {service} convert html attribute to Gogole map api options
 * @description
 *   Requires:  map directive
 *   Restrict To:  Element
 *
 * @example
 * Example:
 *
 *  <map zoom="13" center="34.04924594193164, -118.24104309082031">
 *    <transit-layer></transit-layer>
 *  </map>
 */
(function() {
  'use strict';

  angular.module('ngMap').directive('transitLayer', [
    'Attr2MapOptions', function(Attr2MapOptions) {
    var parser = Attr2MapOptions;

    var getLayer = function(options, events) {
      var layer = new google.maps.TransitLayer(options);
      for (var eventName in events) {
        google.maps.event.addListener(layer, eventName, events[eventName]);
      }
      return layer;
    };

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],

      link: function(scope, element, attrs, mapController) {
        mapController = mapController[0]||mapController[1];

        var orgAttrs = parser.orgAttributes(element);
        var filtered = parser.filter(attrs);
        var options = parser.getOptions(filtered, {scope: scope});
        var events = parser.getEvents(scope, filtered);
        void 0;

        var layer = getLayer(options, events);
        mapController.addObject('transitLayers', layer);
        mapController.observeAttrSetObj(orgAttrs, attrs, layer);  //observers
        element.bind('$destroy', function() {
          mapController.deleteObject('transitLayers', layer);
        });
      }
     }; // return
  }]);
})();

/**
 * @ngdoc filter
 * @name camel-case
 * @description
 *   Converts string to camel cased
 */
(function() {
  'use strict';

  var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
  var MOZ_HACK_REGEXP = /^moz([A-Z])/;

  var camelCaseFilter = function() {
    return function(name) {
      return name.
        replace(SPECIAL_CHARS_REGEXP,
          function(_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        }).
        replace(MOZ_HACK_REGEXP, 'Moz$1');
    };
  };

  angular.module('ngMap').filter('camelCase', camelCaseFilter);
})();

/**
 * @ngdoc filter
 * @name jsonize
 * @description
 *   Converts json-like string to json string
 */
(function() {
  'use strict';

  var jsonizeFilter = function() {
    return function(str) {
      try {       // if parsable already, return as it is
        JSON.parse(str);
        return str;
      } catch(e) { // if not parsable, change little
        return str
          // wrap keys without quote with valid double quote
          .replace(/([\$\w]+)\s*:/g,
            function(_, $1) {
              return '"'+$1+'":';
            }
          )
          // replacing single quote wrapped ones to double quote
          .replace(/'([^']+)'/g,
            function(_, $1) {
              return '"'+$1+'"';
            }
          );
      }
    };
  };

  angular.module('ngMap').filter('jsonize', jsonizeFilter);
})();

/**
 * @ngdoc service
 * @name Attr2MapOptions
 * @description
 *   Converts tag attributes to options used by google api v3 objects
 */
/* global google */
(function() {
  'use strict';

  //i.e. "2015-08-12T06:12:40.858Z"
  var isoDateRE =
    /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))?$/;

  var Attr2MapOptions = function(
      $parse, $timeout, $log, NavigatorGeolocation, GeoCoder,
      camelCaseFilter, jsonizeFilter
    ) {

    /**
     * Returns the attributes of an element as hash
     * @memberof Attr2MapOptions
     * @param {HTMLElement} el html element
     * @returns {Hash} attributes
     */
    var orgAttributes = function(el) {
      (el.length > 0) && (el = el[0]);
      var orgAttributes = {};
      for (var i=0; i<el.attributes.length; i++) {
        var attr = el.attributes[i];
        orgAttributes[attr.name] = attr.value;
      }
      return orgAttributes;
    };

    var getJSON = function(input) {
      var re =/^[\+\-]?[0-9\.]+,[ ]*\ ?[\+\-]?[0-9\.]+$/; //lat,lng
      if (input.match(re)) {
        input = "["+input+"]";
      }
      return JSON.parse(jsonizeFilter(input));
    };

    var getLatLng = function(input) {
      var output = input;
      if (input[0].constructor == Array) { // [[1,2],[3,4]]
        output = input.map(function(el) {
          return new google.maps.LatLng(el[0], el[1]);
        });
      } else if(!isNaN(parseFloat(input[0])) && isFinite(input[0])) {
        output = new google.maps.LatLng(output[0], output[1]);
      }
      return output;
    };

    var toOptionValue = function(input, options) {
      var output;
      try { // 1. Number?
        output = getNumber(input);
      } catch(err) {
        try { // 2. JSON?
          var output = getJSON(input);
          if (output instanceof Array) {
            // [{a:1}] : not lat/lng ones
            if (output[0].constructor == Object) {
              output = output;
            } else { // [[1,2],[3,4]] or [1,2]
              output = getLatLng(output);
            }
          }
          // JSON is an object (not array or null)
          else if (output === Object(output)) {
            // check for nested hashes and convert to Google API options
            var newOptions = options;
            newOptions.doNotConverStringToNumber = true;
            output = getOptions(output, newOptions);
          }
        } catch(err2) {
          // 3. Google Map Object function Expression. i.e. LatLng(80,-49)
          if (input.match(/^[A-Z][a-zA-Z0-9]+\(.*\)$/)) {
            try {
              var exp = "new google.maps."+input;
              output = eval(exp); /* jshint ignore:line */
            } catch(e) {
              output = input;
            }
          // 4. Google Map Object constant Expression. i.e. MayTypeId.HYBRID
          } else if (input.match(/^([A-Z][a-zA-Z0-9]+)\.([A-Z]+)$/)) {
            try {
              var matches = input.match(/^([A-Z][a-zA-Z0-9]+)\.([A-Z]+)$/);
              output = google.maps[matches[1]][matches[2]];
            } catch(e) {
              output = input;
            }
          // 5. Google Map Object constant Expression. i.e. HYBRID
          } else if (input.match(/^[A-Z]+$/)) {
            try {
              var capitalizedKey = options.key.charAt(0).toUpperCase() +
                options.key.slice(1);
              if (options.key.match(/temperatureUnit|windSpeedUnit|labelColor/)) {
                capitalizedKey = capitalizedKey.replace(/s$/,"");
                output = google.maps.weather[capitalizedKey][input];
              } else {
                output = google.maps[capitalizedKey][input];
              }
            } catch(e) {
              output = input;
            }
          // 6. Date Object as ISO String
          } else if (input.match(isoDateRE)) {
            try {
              output = new Date(input);
            } catch(e) {
              output = input;
            }
          // 7. evaluate dynamically bound values
          } else if (input.match(/^{/) && options.scope) {
            try {
              var expr = input.replace(/{{/,'').replace(/}}/g,'');
              output = options.scope.$eval(expr);
            } catch (err) {
              output = input;
            }
          } else {
            output = input;
          }
        } // catch(err2)
      } // catch(err)

      // convert output more for center and position
      if (
        (options.key == 'center' || options.key == 'center') &&
        output instanceof Array
      ) {
        output = new google.maps.LatLng(output[0], output[1]);
      }

      // convert output more for shape bounds
      if (options.key == 'bounds' && output instanceof Array) {
        output = new google.maps.LatLngBounds(output[0], output[1]);
      }

      // convert output more for shape icons
      if (options.key == 'icons' && output instanceof Array) {

        for (var i=0; i<output.length; i++) {
          var el = output[i];
          if (el.icon.path.match(/^[A-Z_]+$/)) {
            el.icon.path =  google.maps.SymbolPath[el.icon.path];
          }
        }
      }

      // convert output more for marker icon
      if (options.key == 'icon' && output instanceof Object) {
        if ((""+output.path).match(/^[A-Z_]+$/)) {
          output.path = google.maps.SymbolPath[output.path];
        }
        for (var key in output) { //jshint ignore:line
          var arr = output[key];
          if (key == "anchor" || key == "origin" || key == "labelOrigin") {
            output[key] = new google.maps.Point(arr[0], arr[1]);
          } else if (key == "size" || key == "scaledSize") {
            output[key] = new google.maps.Size(arr[0], arr[1]);
          }
        }
      }

      return output;
    };

    var getAttrsToObserve = function(attrs) {
      var attrsToObserve = [];

      if (!attrs.noWatcher) {
        for (var attrName in attrs) { //jshint ignore:line
          var attrValue = attrs[attrName];
          if (attrValue && attrValue.match(/\{\{.*\}\}/)) { // if attr value is {{..}}
            attrsToObserve.push(camelCaseFilter(attrName));
          }
        }
      }

      return attrsToObserve;
    };

    /**
     * filters attributes by skipping angularjs methods $.. $$..
     * @memberof Attr2MapOptions
     * @param {Hash} attrs tag attributes
     * @returns {Hash} filterd attributes
     */
    var filter = function(attrs) {
      var options = {};
      for(var key in attrs) {
        if (key.match(/^\$/) || key.match(/^ng[A-Z]/)) {
          void(0);
        } else {
          options[key] = attrs[key];
        }
      }
      return options;
    };

    /**
     * converts attributes hash to Google Maps API v3 options
     * ```
     *  . converts numbers to number
     *  . converts class-like string to google maps instance
     *    i.e. `LatLng(1,1)` to `new google.maps.LatLng(1,1)`
     *  . converts constant-like string to google maps constant
     *    i.e. `MapTypeId.HYBRID` to `google.maps.MapTypeId.HYBRID`
     *    i.e. `HYBRID"` to `google.maps.MapTypeId.HYBRID`
     * ```
     * @memberof Attr2MapOptions
     * @param {Hash} attrs tag attributes
     * @param {Hash} options
     * @returns {Hash} options converted attributess
     */
    var getOptions = function(attrs, params) {
      params = params || {};
      var options = {};
      for(var key in attrs) {
        if (attrs[key] || attrs[key] === 0) {
          if (key.match(/^on[A-Z]/)) { //skip events, i.e. on-click
            continue;
          } else if (key.match(/ControlOptions$/)) { // skip controlOptions
            continue;
          } else {
            // nested conversions need to be typechecked
            // (non-strings are fully converted)
            if (typeof attrs[key] !== 'string') {
              options[key] = attrs[key];
            } else {
              if (params.doNotConverStringToNumber &&
                attrs[key].match(/^[0-9]+$/)
              ) {
                options[key] = attrs[key];
              } else {
                options[key] = toOptionValue(attrs[key], {key: key, scope: params.scope});
              }
            }
          }
        } // if (attrs[key])
      } // for(var key in attrs)
      return options;
    };

    /**
     * converts attributes hash to scope-specific event function 
     * @memberof Attr2MapOptions
     * @param {scope} scope angularjs scope
     * @param {Hash} attrs tag attributes
     * @returns {Hash} events converted events
     */
    var getEvents = function(scope, attrs) {
      var events = {};
      var toLowercaseFunc = function($1){
        return "_"+$1.toLowerCase();
      };
      var EventFunc = function(attrValue) {
        // funcName(argsStr)
        var matches = attrValue.match(/([^\(]+)\(([^\)]*)\)/);
        var funcName = matches[1];
        var argsStr = matches[2].replace(/event[ ,]*/,'');  //remove string 'event'
        var argsExpr = $parse("["+argsStr+"]"); //for perf when triggering event
        return function(event) {
          var args = argsExpr(scope); //get args here to pass updated model values
          function index(obj,i) {return obj[i];}
          var f = funcName.split('.').reduce(index, scope);
          f && f.apply(this, [event].concat(args));
          $timeout( function() {
            scope.$apply();
          });
        };
      };

      for(var key in attrs) {
        if (attrs[key]) {
          if (!key.match(/^on[A-Z]/)) { //skip if not events
            continue;
          }

          //get event name as underscored. i.e. zoom_changed
          var eventName = key.replace(/^on/,'');
          eventName = eventName.charAt(0).toLowerCase() + eventName.slice(1);
          eventName = eventName.replace(/([A-Z])/g, toLowercaseFunc);

          var attrValue = attrs[key];
          events[eventName] = new EventFunc(attrValue);
        }
      }
      return events;
    };

    /**
     * control means map controls, i.e streetview, pan, etc, not a general control
     * @memberof Attr2MapOptions
     * @param {Hash} filtered filtered tag attributes
     * @returns {Hash} Google Map options
     */
    var getControlOptions = function(filtered) {
      var controlOptions = {};
      if (typeof filtered != 'object') {
        return false;
      }

      for (var attr in filtered) {
        if (filtered[attr]) {
          if (!attr.match(/(.*)ControlOptions$/)) {
            continue; // if not controlOptions, skip it
          }

          //change invalid json to valid one, i.e. {foo:1} to {"foo": 1}
          var orgValue = filtered[attr];
          var newValue = orgValue.replace(/'/g, '"');
          newValue = newValue.replace(/([^"]+)|("[^"]+")/g, function($0, $1, $2) {
            if ($1) {
              return $1.replace(/([a-zA-Z0-9]+?):/g, '"$1":');
            } else {
              return $2;
            }
          });
          try {
            var options = JSON.parse(newValue);
            for (var key in options) { //assign the right values
              if (options[key]) {
                var value = options[key];
                if (typeof value === 'string') {
                  value = value.toUpperCase();
                } else if (key === "mapTypeIds") {
                  value = value.map( function(str) {
                    if (str.match(/^[A-Z]+$/)) { // if constant
                      return google.maps.MapTypeId[str.toUpperCase()];
                    } else { // else, custom map-type
                      return str;
                    }
                  });
                }

                if (key === "style") {
                  var str = attr.charAt(0).toUpperCase() + attr.slice(1);
                  var objName = str.replace(/Options$/,'')+"Style";
                  options[key] = google.maps[objName][value];
                } else if (key === "position") {
                  options[key] = google.maps.ControlPosition[value];
                } else {
                  options[key] = value;
                }
              }
            }
            controlOptions[attr] = options;
          } catch (e) {
            void 0;
          }
        }
      } // for

      return controlOptions;
    };

    return {
      filter: filter,
      getOptions: getOptions,
      getEvents: getEvents,
      getControlOptions: getControlOptions,
      toOptionValue: toOptionValue,
      getAttrsToObserve: getAttrsToObserve,
      orgAttributes: orgAttributes
    }; // return

  };
  Attr2MapOptions.$inject= [
    '$parse', '$timeout', '$log', 'NavigatorGeolocation', 'GeoCoder',
    'camelCaseFilter', 'jsonizeFilter'
  ];

  angular.module('ngMap').service('Attr2MapOptions', Attr2MapOptions);
})();

/**
 * @ngdoc service
 * @name GeoCoder
 * @description
 *   Provides [defered/promise API](https://docs.angularjs.org/api/ng/service/$q)
 *   service for Google Geocoder service
 */
(function() {
  'use strict';
  var $q;
  /**
   * @memberof GeoCoder
   * @param {Hash} options
   *   https://developers.google.com/maps/documentation/geocoding/#geocoding
   * @example
   * ```
   *   GeoCoder.geocode({address: 'the cn tower'}).then(function(result) {
   *     //... do something with result
   *   });
   * ```
   * @returns {HttpPromise} Future object
   */
  var geocodeFunc = function(options) {
    var deferred = $q.defer();
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode(options, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        deferred.resolve(results);
      } else {
        deferred.reject(status);
      }
    });
    return deferred.promise;
  };

  var GeoCoder = function(_$q_) {
    $q = _$q_;
    return {
      geocode : geocodeFunc
    };
  };
  GeoCoder.$inject = ['$q'];

  angular.module('ngMap').service('GeoCoder', GeoCoder);
})();

/**
 * @ngdoc service
 * @name NavigatorGeolocation
 * @description
 *  Provides [defered/promise API](https://docs.angularjs.org/api/ng/service/$q)
 *  service for navigator.geolocation methods
 */
/* global google */
(function() {
  'use strict';
  var $q;

  /**
   * @memberof NavigatorGeolocation
   * @param {Object} geoLocationOptions the navigator geolocations options.
   *  i.e. { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }.
   *  If none specified, { timeout: 5000 }. 
   *  If timeout not specified, timeout: 5000 added
   * @param {function} success success callback function
   * @param {function} failure failure callback function
   * @example
   * ```
   *  NavigatorGeolocation.getCurrentPosition()
   *    .then(function(position) {
   *      var lat = position.coords.latitude, lng = position.coords.longitude;
   *      .. do something lat and lng
   *    });
   * ```
   * @returns {HttpPromise} Future object
   */
  var getCurrentPosition = function(geoLocationOptions) {
    var deferred = $q.defer();
    if (navigator.geolocation) {

      if (geoLocationOptions === undefined) {
        geoLocationOptions = { timeout: 5000 };
      }
      else if (geoLocationOptions.timeout === undefined) {
        geoLocationOptions.timeout = 5000;
      }

      navigator.geolocation.getCurrentPosition(
        function(position) {
          deferred.resolve(position);
        }, function(evt) {
          void 0;
          deferred.reject(evt);
        },
        geoLocationOptions
      );
    } else {
      deferred.reject("Browser Geolocation service failed.");
    }
    return deferred.promise;
  };

  var NavigatorGeolocation = function(_$q_) {
    $q = _$q_;
    return {
      getCurrentPosition: getCurrentPosition
    };
  };
  NavigatorGeolocation.$inject = ['$q'];

  angular.module('ngMap').
    service('NavigatorGeolocation', NavigatorGeolocation);
})();

/**
 * @ngdoc factory
 * @name NgMapPool
 * @description
 *   Provide map instance to avoid memory leak
 */
(function() {
  'use strict';
  /**
   * @memberof NgMapPool
   * @desc map instance pool
   */
  var mapInstances = [];
  var $window, $document, $timeout;

  var add = function(el) {
    var mapDiv = $document.createElement("div");
    mapDiv.style.width = "100%";
    mapDiv.style.height = "100%";
    el.appendChild(mapDiv);
    var map = new $window.google.maps.Map(mapDiv, {});
    mapInstances.push(map);
    return map;
  };

  var findById = function(el, id) {
    var notInUseMap;
    for (var i=0; i<mapInstances.length; i++) {
      var map = mapInstances[i];
      if (map.id == id && !map.inUse) {
        var mapDiv = map.getDiv();
        el.appendChild(mapDiv);
        notInUseMap = map;
        break;
      }
    }
    return notInUseMap;
  };

  var findUnused = function(el) { //jshint ignore:line
    var notInUseMap;
    for (var i=0; i<mapInstances.length; i++) {
      var map = mapInstances[i];
      if (map.id) {
        continue;
      }
      if (!map.inUse) {
        var mapDiv = map.getDiv();
        el.appendChild(mapDiv);
        notInUseMap = map;
        break;
      }
    }
    return notInUseMap;
  };

  /**
   * @memberof NgMapPool
   * @function getMapInstance
   * @param {HtmlElement} el map container element
   * @return map instance for the given element
   */
  var getMapInstance = function(el) {
    var map = findById(el, el.id) || findUnused(el);
    if (!map) {
      map = add(el);
    } else {
      /* firing map idle event, which is used by map controller */
      $timeout(function() {
        google.maps.event.trigger(map, 'idle');
      }, 100);
    }
    map.inUse = true;
    return map;
  };

  /**
   * @memberof NgMapPool
   * @function returnMapInstance
   * @param {Map} an instance of google.maps.Map
   * @desc sets the flag inUse of the given map instance to false, so that it 
   * can be reused later
   */
  var returnMapInstance = function(map) {
    map.inUse = false;
  };
  
  /**
   * @memberof NgMapPool
   * @function resetMapInstances
   * @desc resets mapInstance array
   */
  var resetMapInstances = function() {
    for(var i = 0;i < mapInstances.length;i++) {
        mapInstances[i] = null;
    }
    mapInstances = [];
  };

  var NgMapPool = function(_$document_, _$window_, _$timeout_) {
    $document = _$document_[0], $window = _$window_, $timeout = _$timeout_;

    return {
	  mapInstances: mapInstances,
      resetMapInstances: resetMapInstances,
      getMapInstance: getMapInstance,
      returnMapInstance: returnMapInstance
    };
  };
  NgMapPool.$inject = [ '$document', '$window', '$timeout'];

  angular.module('ngMap').factory('NgMapPool', NgMapPool);

})();

/**
 * @ngdoc provider
 * @name NgMap
 * @description
 *  common utility service for ng-map
 */
(function() {
  'use strict';
  var $window, $document, $q;
  var NavigatorGeolocation, Attr2MapOptions, GeoCoder, camelCaseFilter;

  var mapControllers = {};

  var getStyle = function(el, styleProp) {
    var y;
    if (el.currentStyle) {
      y = el.currentStyle[styleProp];
    } else if ($window.getComputedStyle) {
      y = $document.defaultView.
        getComputedStyle(el, null).
        getPropertyValue(styleProp);
    }
    return y;
  };

  /**
   * @memberof NgMap
   * @function initMap
   * @param id optional, id of the map. default 0
   */
  var initMap = function(id) {
    var ctrl = mapControllers[id || 0];
    if (!(ctrl.map instanceof google.maps.Map)) {
      ctrl.initializeMap();
      return ctrl.map;
    } else {
      void 0;
    }
  };

  /**
   * @memberof NgMap
   * @function getMap
   * @param {String} optional, id e.g., 'foo'
   * @returns promise
   */
  var getMap = function(id) {
    id = typeof id === 'object' ? id.id : id;
    id = id || 0;

    var deferred = $q.defer();
    var timeout = 2000;

    function waitForMap(timeElapsed){
      if(mapControllers[id]){
        deferred.resolve(mapControllers[id].map);
      } else if (timeElapsed > timeout) {
        deferred.reject('could not find map');
      } else {
        $window.setTimeout( function(){
          waitForMap(timeElapsed+100);
        }, 100);
      }
    }
    waitForMap(0);

    return deferred.promise;
  };

  /**
   * @memberof NgMap
   * @function addMap
   * @param mapController {__MapContoller} a map controller
   * @returns promise
   */
  var addMap = function(mapCtrl) {
    if (mapCtrl.map) {
      var len = Object.keys(mapControllers).length;
      mapControllers[mapCtrl.map.id || len] = mapCtrl;
    }
  };

  /**
   * @memberof NgMap
   * @function deleteMap
   * @param mapController {__MapContoller} a map controller
   */
  var deleteMap = function(mapCtrl) {
    var len = Object.keys(mapControllers).length - 1;
    var mapId = mapCtrl.map.id || len;
    if (mapCtrl.map) {
      for (var eventName in mapCtrl.eventListeners) {
        void 0;
        var listener = mapCtrl.eventListeners[eventName];
        google.maps.event.removeListener(listener);
      }
      if (mapCtrl.map.controls) {
        mapCtrl.map.controls.forEach(function(ctrl) {
          ctrl.clear();
        });
      }
    }

    //Remove Heatmap Layers
    if (mapCtrl.map.heatmapLayers) {
      Object.keys(mapCtrl.map.heatmapLayers).forEach(function (layer) {
        mapCtrl.deleteObject('heatmapLayers', mapCtrl.map.heatmapLayers[layer]);
      });
    }

    delete mapControllers[mapId];
  };

  /**
   * @memberof NgMap
   * @function getGeoLocation
   * @param {String} address
   * @param {Hash} options geo options
   * @returns promise
   */
  var getGeoLocation = function(string, options) {
    var deferred = $q.defer();
    if (!string || string.match(/^current/i)) { // current location
      NavigatorGeolocation.getCurrentPosition(options).then(
        function(position) {
          var lat = position.coords.latitude;
          var lng = position.coords.longitude;
          var latLng = new google.maps.LatLng(lat,lng);
          deferred.resolve(latLng);
        },
        function(error) {
          deferred.reject(error);
        }
      );
    } else {
      GeoCoder.geocode({address: string}).then(
        function(results) {
          deferred.resolve(results[0].geometry.location);
        },
        function(error) {
          deferred.reject(error);
        }
      );
    }

    return deferred.promise;
  };

  /**
   * @memberof NgMap
   * @function observeAndSet
   * @param {String} attrName attribute name
   * @param {Object} object A Google maps object to be changed
   * @returns attribue observe function
   */
  var observeAndSet = function(attrName, object) {
    void 0;
    return function(val) {
      if (val) {
        var setMethod = camelCaseFilter('set-'+attrName);
        var optionValue = Attr2MapOptions.toOptionValue(val, {key: attrName});
        if (object[setMethod]) { //if set method does exist
          void 0;
          /* if an location is being observed */
          if (attrName.match(/center|position/) &&
            typeof optionValue == 'string') {
            getGeoLocation(optionValue).then(function(latlng) {
              object[setMethod](latlng);
            });
          } else {
            object[setMethod](optionValue);
          }
        }
      }
    };
  };

  /**
   * @memberof NgMap
   * @function setStyle
   * @param {HtmlElement} map contriner element
   * @desc set display, width, height of map container element
   */
  var setStyle = function(el) {
    //if style is not given to the map element, set display and height
    var defaultStyle = el.getAttribute('default-style');
    if (defaultStyle == "true") {
      el.style.display = 'block';
      el.style.height = '300px';
    } else {
      if (getStyle(el, 'display') != "block") {
        el.style.display = 'block';
      }
      if (getStyle(el, 'height').match(/^(0|auto)/)) {
        el.style.height = '300px';
      }
    }
  };

  angular.module('ngMap').provider('NgMap', function() {
    var defaultOptions = {};

    /**
     * @memberof NgMap
     * @function setDefaultOptions
     * @param {Hash} options
     * @example
     *  app.config(function(NgMapProvider) {
     *    NgMapProvider.setDefaultOptions({
     *      marker: {
     *        optimized: false
     *      }
     *    });
     *  });
     */
    this.setDefaultOptions = function(options) {
      defaultOptions = options;
    };

    var NgMap = function(
        _$window_, _$document_, _$q_,
        _NavigatorGeolocation_, _Attr2MapOptions_,
        _GeoCoder_, _camelCaseFilter_
      ) {
      $window = _$window_;
      $document = _$document_[0];
      $q = _$q_;
      NavigatorGeolocation = _NavigatorGeolocation_;
      Attr2MapOptions = _Attr2MapOptions_;
      GeoCoder = _GeoCoder_;
      camelCaseFilter = _camelCaseFilter_;

      return {
        defaultOptions: defaultOptions,
        addMap: addMap,
        deleteMap: deleteMap,
        getMap: getMap,
        initMap: initMap,
        setStyle: setStyle,
        getGeoLocation: getGeoLocation,
        observeAndSet: observeAndSet
      };
    };
    NgMap.$inject = [
      '$window', '$document', '$q',
      'NavigatorGeolocation', 'Attr2MapOptions',
      'GeoCoder', 'camelCaseFilter'
    ];

    this.$get = NgMap;
  });
})();

/**
 * @ngdoc service
 * @name StreetView
 * @description
 *  Provides [defered/promise API](https://docs.angularjs.org/api/ng/service/$q)
 *  service for [Google StreetViewService]
 *  (https://developers.google.com/maps/documentation/javascript/streetview)
 */
(function() {
  'use strict';
  var $q;

  /**
   * Retrieves panorama id from the given map (and or position)
   * @memberof StreetView
   * @param {map} map Google map instance
   * @param {LatLng} latlng Google LatLng instance
   *   default: the center of the map
   * @example
   *   StreetView.getPanorama(map).then(function(panoId) {
   *     $scope.panoId = panoId;
   *   });
   * @returns {HttpPromise} Future object
   */
  var getPanorama = function(map, latlng) {
    latlng = latlng || map.getCenter();
    var deferred = $q.defer();
    var svs = new google.maps.StreetViewService();
    svs.getPanoramaByLocation( (latlng||map.getCenter), 100,
      function (data, status) {
        // if streetView available
        if (status === google.maps.StreetViewStatus.OK) {
          deferred.resolve(data.location.pano);
        } else {
          // no street view available in this range, or some error occurred
          deferred.resolve(false);
          //deferred.reject('Geocoder failed due to: '+ status);
        }
      }
    );
    return deferred.promise;
  };

  /**
   * Set panorama view on the given map with the panorama id
   * @memberof StreetView
   * @param {map} map Google map instance
   * @param {String} panoId Panorama id fro getPanorama method
   * @example
   *   StreetView.setPanorama(map, panoId);
   */
  var setPanorama = function(map, panoId) {
    var svp = new google.maps.StreetViewPanorama(
      map.getDiv(), {enableCloseButton: true}
    );
    svp.setPano(panoId);
  };

  var StreetView = function(_$q_) {
    $q = _$q_;

    return {
      getPanorama: getPanorama,
      setPanorama: setPanorama
    };
  };
  StreetView.$inject = ['$q'];

  angular.module('ngMap').service('StreetView', StreetView);
})();

return 'ngMap';
}));
angular.module('hours.templates', ['calendar/calendar.tpl.html', 'hours-locations/hours-locations.tpl.html', 'lib-hours-today/lib-hours-today.tpl.html', 'list/list.tpl.html']);

angular.module("calendar/calendar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("calendar/calendar.tpl.html",
    "<div class=\"calendar\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"btn-group\">\n" +
    "            <label class=\"btn btn-default\" ng-model=\"calView\" btn-radio=\"\">Typical Schedule</label>\n" +
    "            <label class=\"btn btn-default\" ng-model=\"calView\" btn-radio=\"1\">Calendar &amp; Exceptions</label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ng-show=\"!calView\">\n" +
    "        <div class=\"text-info\" ng-show=\"defHours[1].ts > 0\">\n" +
    "            <span class=\"fa fw fa-info-circle\"></span> Until {{defHours[1].ts * 1000 | date:'MMM d, y'}}\n" +
    "        </div>\n" +
    "        <table class=\"table table-bordered table-condensed\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <td>Sun</td>\n" +
    "                <td>Mon</td>\n" +
    "                <td>Tue</td>\n" +
    "                <td>Wed</td>\n" +
    "                <td>Thur</td>\n" +
    "                <td>Fri</td>\n" +
    "                <td>Sat</td>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr>\n" +
    "                <td ng-repeat=\"day in defHours[0].hours\">\n" +
    "                    <div class=\"hours\">\n" +
    "                        {{day.hoursFrom}}\n" +
    "                    <span ng-show=\"day.hoursFrom != day.hoursTo\">\n" +
    "                        <br>{{day.hoursTo}}\n" +
    "                    </span>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "    <div ng-show=\"calView\">\n" +
    "        <nav class=\"navbar navbar-default navbar-embedded\">\n" +
    "            <button type=\"button\" class=\"btn btn-primary navbar-btn navbar-left\" ng-class=\"{'disabled': params.month <= 0}\" ng-disabled=\"params.month <= 0\" ng-click=\"getPrevMonth()\">\n" +
    "                <span class=\"fa fa-angle-left\"></span>\n" +
    "            </button>\n" +
    "            <h2 class=\"navbar-text navbar-center\">{{cal.month}}</h2>\n" +
    "            <button type=\"button\" class=\"btn btn-primary navbar-btn navbar-right\" ng-class=\"{'disabled': params.month >= 5}\" ng-disabled=\"params.month >= 5\" ng-click=\"getNextMonth()\"><span class=\"fa fa-angle-right\"></span></button>\n" +
    "        </nav>\n" +
    "        <table class=\"table table-bordered table-condensed\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <td>Sun</td>\n" +
    "                <td>Mon</td>\n" +
    "                <td>Tue</td>\n" +
    "                <td>Wed</td>\n" +
    "                <td>Thur</td>\n" +
    "                <td>Fri</td>\n" +
    "                <td>Sat</td>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"week in cal.weeks\">\n" +
    "                <td ng-repeat=\"day in week\" ng-class=\"day.css\">\n" +
    "\n" +
    "                    <div class=\"date\">\n" +
    "                        {{day.ts * 1000 | date:'d'}}\n" +
    "                    </div>\n" +
    "                    <div class=\"hours\">\n" +
    "                        {{day.hoursFrom}}\n" +
    "                        <div ng-if=\"day.hoursFrom != day.hoursTo\">\n" +
    "                            {{day.hoursTo}}\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "                    <div class=\"fa fa-exclamation-circle exception-icon\" ng-if=\"day.exc\" popover=\"{{day.exc}}\" popover-trigger=\"mouseenter\" popover-append-to-body=\"true\"></div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>");
}]);

angular.module("hours-locations/hours-locations.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("hours-locations/hours-locations.tpl.html",
    "<!--<script src='//maps.googleapis.com/maps/api/js?sensor=false&key=AIzaSyCdXuKwZiDx5W2uP8plV5d-o-jLQ5UQtIQ&mid=z4A8-271j5C8.kowwE312jycE'></script>-->\n" +
    "\n" +
    "\n" +
    "<div class=\"jumbotron-header\">\n" +
    "    <div class=\"jumbotron\">\n" +
    "        <div class=\"container\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-sm-12\">\n" +
    "                    <ol class=\"breadcrumb\" typeof=\"BreadcrumbList\" vocab=\"http://schema.org/\">\n" +
    "                        <li><a title=\"Go to The University of Alabama Libraries.\" href=\"/#/home\" class=\"home\">The University of Alabama Libraries</a></li>\n" +
    "                        <li><a title=\"Go to Hours.\" href=\"/#/hours\" class=\"post post-page\">Hours</a></li>\n" +
    "                    </ol>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-sm-8\">\n" +
    "                    <h1>Hours & Locations</h1>\n" +
    "                    <h2 class=\"hidden-xs hidden-sm\">{{library}}</h2>\n" +
    "                    <div class=\"dropdown multipage-menu visible-xs visible-sm\">\n" +
    "                        <button class=\"btn btn-default btn-lg dropdown-toggle\" id=\"locationMenu\"  type=\"button\">\n" +
    "                            {{library}}\n" +
    "                        </button>\n" +
    "                        <ul class=\"dropdown-menu nav nav-stacked hours-locations-menu\" role=\"menu\" aria-labelledby=\"locationMenu\">\n" +
    "                            <li><a href=\"#\" hours-href=\"{library: 'gorgas', month: 0}\">Gorgas</a>\n" +
    "                                <ul class=\"nav nav-stacked\">\n" +
    "                                    <li><a href=\"#\" hours-href=\"{library: 'music', month: 0}\">Music Library</a></li>\n" +
    "                                    <li><a href=\"#\" hours-href=\"{library: 'media', month: 0}\">Sanford Media Center</a></li>\n" +
    "                                    <li><a href=\"#\" hours-href=\"{library: 'williams', month: 0}\">Williams Americana Collection</a></li>\n" +
    "                                </ul>\n" +
    "                            </li>\n" +
    "                            <li><a href=\"#\" hours-href=\"{library: 'rodgers', month: 0}\">Rodgers</a></li>\n" +
    "                            <li><a href=\"#\" hours-href=\"{library: 'mclure', month: 0}\">McLure</a></li>\n" +
    "                            <li><a href=\"#\" hours-href=\"{library: 'hoole', month: 0}\">Hoole</a></li>\n" +
    "                            <li><a href=\"#\" hours-href=\"{library: 'bruno', month: 0}\">Bruno</a></li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                    <ul class=\"list-unstyled fa-ul\" ng-if=\"contact\">\n" +
    "                        <li ng-if=\"contact.email\"><span class=\"fa fa-li fa-envelope\"></span> <a ng-href=\"mailto:{{contact.email}}\">{{contact.email}}</a></li>\n" +
    "                        <li ng-if=\"contact.phone\">\n" +
    "                            <span class=\"fa fa-li fa-phone\"></span>\n" +
    "                            <ul class=\"list-unstyled\">\n" +
    "                                <li ng-repeat=\"phone in contact.phone\">\n" +
    "                                    <span ng-if=\"phone.dept\">{{phone.dept}}: </span>\n" +
    "                                    <a ng-href=\"tel:+1-205-{{phone.number}}\" title=\"{{library}} phone number\">{{phone.number}}</a>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                <div class=\"col-sm-4\">\n" +
    "                    <div class=\"well\">\n" +
    "                        <p class=\"lead\">What can {{library}} do for you?</p>\n" +
    "                        <a ng-href=\"{{moreLink}}\" class=\"btn btn-primary\">Learn more <span class=\"fa fa-fw fa-info-circle\"></span></a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"container\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-3 col-md-push-9\">\n" +
    "            <div class=\"hidden-xs hidden-sm\">\n" +
    "                <ul class=\"nav nav-pills nav-stacked hours-locations-menu\">\n" +
    "                    <li><a href=\"#\" hours-href=\"{library: 'gorgas', month: 0}\">Gorgas</a>\n" +
    "                        <ul class=\"nav nav-pills nav-stacked\">\n" +
    "                            <li><a href=\"#\" hours-href=\"{library: 'music', month: 0}\">Music Library</a></li>\n" +
    "                            <li><a href=\"#\" hours-href=\"{library: 'media', month: 0}\">Sanford Media Center</a></li>\n" +
    "                            <li><a href=\"#\" hours-href=\"{library: 'williams', month: 0}\">Williams Americana Collection</a></li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                    <li><a href=\"#\" hours-href=\"{library: 'rodgers', month: 0}\">Rodgers</a></li>\n" +
    "                    <li><a href=\"#\" hours-href=\"{library: 'mclure', month: 0}\">McLure</a></li>\n" +
    "                    <li><a href=\"#\" hours-href=\"{library: 'hoole', month: 0}\">Hoole</a></li>\n" +
    "                    <li><a href=\"#\" hours-href=\"{library: 'bruno', month: 0}\">Bruno</a></li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-9 col-md-pull-3\">\n" +
    "\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"hours-calendar\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"panel panel-default\">\n" +
    "                        <div class=\"panel-body\">\n" +
    "                            <div map-lazy-load=\"https://maps.google.com/maps/api/js\"\n" +
    "                                 map-lazy-load-params=\"{{googleMapsUrl}}\">\n" +
    "                                <ng-map center='{{center}}' zoom='18' scrollwheel=\"false\" id=\"map-canvas\" map-initialized=\"updateMap()\">\n" +
    "                                    <marker\n" +
    "                                            ng-repeat=\"l in loc\"\n" +
    "                                            no-watcher=\"true\"\n" +
    "                                            position=\"{{l.latitude}}, {{l.longitude}}\"\n" +
    "                                            title=\"{{l.name}}\"></marker>\n" +
    "                                </ng-map>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"panel-footer\">\n" +
    "                            <form ng-submit=\"getDirections()\">\n" +
    "                                <div class=\"input-group\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" ng-model=\"directionsFrom\" placeholder=\"Your address or location\" required>\n" +
    "                        <span class=\"input-group-btn\">\n" +
    "                            <button type=\"submit\" class=\"btn btn-default\" target=\"_gmaps\">Get Directions <span class=\"fa fa-external-link\"></span></button>\n" +
    "                        </span>\n" +
    "                                </div>\n" +
    "                            </form>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("lib-hours-today/lib-hours-today.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("lib-hours-today/lib-hours-today.tpl.html",
    "<div class=\"library-hours-today\" ng-cloak>\n" +
    "    <div class=\"media\">\n" +
    "        <div class=\"media-left\">\n" +
    "            <div class=\"media-object fa fa-2x fa-clock-o\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"media-body\">\n" +
    "            <h3 class=\"media-heading\">Today</h3>\n" +
    "            <h4 class=\"media-heading\">{{today.hours}} <span class=\"fa fa-lg fa-info-circle\" ng-if=\"today.description\" tooltip=\"{{today.description}}\"></span></h4>\n" +
    "            <span class=\"label\" ng-class=\"today.status.css\">{{today.status.text}}</span>\n" +
    "            <a class=\"btn btn-default btn-xs\" ng-href=\"/#hours?library={{today.name}}\" title=\"All hours {{today.name}}\">See all hours <span class=\"fa fa-fw fa-chevron-right\"></span></a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("list/list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("list/list.tpl.html",
    "<div class=\"responsive-table\">\n" +
    "  <table class=\"table table-hover\">\n" +
    "    <tbody ng-repeat=\"lib in hoursList track by $index\">\n" +
    "    <tr ng-click=\"selectLib(lib)\">\n" +
    "      <td><a href=\"#\" ng-href=\"#/hours?library={{lib.name}}\">{{lib.name}}</a></td>\n" +
    "      <td>{{lib.hours}}</td>\n" +
    "      <td><span ng-class=\"lib.status.css\">{{lib.status.text}}</span></td>\n" +
    "      <td>\n" +
    "        <span class=\"fa fa-lg fa-info-circle\" ng-if=\"lib.description\" tooltip=\"{{lib.description}}\"></span>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "    <tr class=\"hours-list-child\" ng-repeat=\"child in lib.children track by $index\" ng-click=\"selectLib(child)\">\n" +
    "      <td><a ng-href=\"#/hours?library={{child.name}}\">{{child.name}}</a></td>\n" +
    "      <td>{{child.hours}}</td>\n" +
    "      <td><span ng-class=\"child.status.css\">{{child.status.text}}</span></td>\n" +
    "      <td>\n" +
    "        <span class=\"fa fa-lg fa-info-circle\" ng-if=\"child.description\" tooltip=\"{{child.description}}\"></span>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "</div>");
}]);

angular.module('ualib.hours', [
    'ngAnimate',
    'ngRoute',
    'ngResource',
    'ui.bootstrap',
    'oc.lazyLoad',
    'angular.filter',
    'ngMap',
    'hours.common',
    'hours.templates',
    'hours.list',
    'hours.calendar'
])

    .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider){

    }]);

// Temporary alias for hours module to not break dependencies not yet updated
angular.module('hours', ['ualib.hours']);



angular.module('hours.calendar', [])

    .controller('CalendarCtrl', ['$scope', '$location', '$filter', 'hoursFactory', '$rootScope', function CalendarCtrl($scope, $location, $filter, hoursFactory, $rootScope){
        var calData;
        $scope.cal;
        $scope.month;
        $scope.library;
        $scope.defHours;
        $scope.params = {
            lid: 1,
            month: 0,
            library: 'gorgas'
        };

        hoursFactory.get({view: 'calendar'})
            .$promise
            .then(function(data){
                paramsToService();
                calData = data.cal;
                processCalendar(calData);

                $scope.$on('$locationChangeSuccess', function(){
                    paramsToService();
                    processCalendar(calData);
                });
            }, function(data, status, headers, config) {
                console.log('Initial Error: ' + data);
            });

        $scope.getPrevMonth = function(){
            var mid = parseInt($scope.params.month) - 1;
            if (mid < 0) mid = 0;
            $location.search('month', mid);
            $location.replace();
        };

        $scope.getNextMonth = function(){
            var mid = parseInt($scope.params.month) + 1;
            if (mid > 5) mid = 5;
            $location.search('month', mid);
            $location.replace();
        };

        function processCalendar(cal){
            var lid;
            var library;
            var thisMonth;
            var defHours;

            cal = $filter('filterBy')(cal, ['library.name'], $scope.params.library);

            lid = cal[0].library.lid;
            library = cal[0].library.name;
            thisMonth = cal[0].calendar[$scope.params.month];
            defHours = cal[0].defaultHours;

            $scope.params.lid = lid;
            $scope.library = library;
            $scope.cal = getCalStyles(thisMonth);
            $scope.defHours = defHours;
            $rootScope.$broadcast('hoursLoaded');
        }


        function paramsToService(){
            var params = $location.search();
            var _scope = $scope.params;
            for (var prop in params){
                if (_scope.hasOwnProperty(prop)){
                    _scope[prop] = params[prop];

                }
            }
            $scope.params = _scope;
        }

        function getCalStyles(month){
            for (var i = 0, len = month.weeks.length; i < len; i++){
                for (var x = 0, l = month.weeks[i].length; x < l; x++){
                    var css = [];
                    if (month.weeks[i][x].hasOwnProperty('today')){
                        css.push('today');
                    }
                    if (!month.weeks[i][x].hasOwnProperty('date')){
                        css.push('not-current-month');
                    }
                    if (month.weeks[i][x].hoursTo === 'Closed'){
                        css.push('closed');
                    }
                    if (month.weeks[i][x].hasOwnProperty('exc')){
                        css.push('exception');
                    }
                    month.weeks[i][x].css = css.join(' ');
                }
            }
            return month;
        }
    }])


    .directive('hoursCalendar', [function(){
        return {
            restrict: 'AC',
            templateUrl: 'calendar/calendar.tpl.html',
            controller: 'CalendarCtrl'
        }
    }]);
angular.module('hours.common', [
    'common.hours'
])
angular.module('common.hours', [])

    .factory('hoursFactory', ['$resource', function($resource){
        return $resource("//wwwdev2.lib.ua.edu/libhours2/api/:view", {}, {
            get: {
                cache: true
            }
        });
    }]);

angular.module('ualib.hours')

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/hours', {
                reloadOnSearch: false,
                templateUrl: 'hours-locations/hours-locations.tpl.html',
                controller: 'HoursLocationsCtrl'
            });
    }])


    .controller('HoursLocationsCtrl', ['$scope', '$location', 'NgMap', function($scope, $location, NgMap){
        var libChangeListener = $scope.$on('hoursLoaded', function(){
            updateMap();
        });
        $scope.center = [33.211803, -87.546032];

        $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyCdXuKwZiDx5W2uP8plV5d-o-jLQ5UQtIQ&mid=z4A8-271j5C8.kowwE312jycE";

        $scope.loc = [
            {
                id: 1,
                name: "Gorgas Library",
                latitude: 33.211803,
                longitude: -87.546032,
                icon: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                contact: {
                    phone: [{
                            number: '(205) 348-6047',
                            dept:   'Reference'
                        },
                        {
                            number: '(205) 348-9748',
                            dept: 'Circulation'
                        }],
                    email: 'gorgasinfo@ua.edu'
                },
                link: '/libraries/gorgas/'
            },
            {
                id: 2,
                name: "Bruno Business Library",
                latitude: 33.211107,
                longitude: -87.549255,
                icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                contact: {
                    phone: [
                        {
                            number: '(205) 348-1080'
                        }],

                    email: 'brunolibrary@culverhouse.ua.edu'
                },
                link: '/libraries/bruno/'
            },
            {
                id: 3,
                name: "Rodgers Library",
                latitude: 33.2134785,
                longitude: -87.5427543,
                icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                contact: {
                    phone: [{
                        number: '(205) 348-2100',
                        dept:   'Reference & Circulation'
                    }],
                    email: 'scenglib@bama.ua.edu'
                },
                link: '/libraries/rodgers/'
            },
            {
                id: 4,
                name: "Hoole Special Collections",
                latitude: 33.210927,
                longitude: -87.543182,
                icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                contact: {
                    phone: [{
                        number: '(205) 348-0500',
                        dept: 'Front Desk'
                    }],
                    email: 'archives@bama.ua.edu',
                    alert: [{
                        type: 'info',
                        msg: 'For reference questions'
                    }]
                },
                link: '/libraries/hoole/'
            },
            {
                id: 5,
                name: "McLure Education Library",
                latitude: 33.2104774,
                longitude: -87.5490442,
                icon: 'https://maps.google.com/mapfiles/ms/icons/pink-dot.png',
                contact: {
                    phone: [{
                        number: '(205) 348-6055',
                        dept:   'Reference & Circulation'
                    }]
                },
                link: '/libraries/mclure/'
            },
            {
                id: 6,
                name: "Music Library",
                latitude: 33.211803,
                longitude: -87.546032,
                icon: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                link: '/libraries/music/'
            },
            {
                id: 7,
                name: "Sanford Media Center",
                latitude: 33.211803,
                longitude: -87.546032,
                icon: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                contact: {
                    phone: [{
                        number: '(205) 348-4651'
                    }]
                },
                link: '/using-the-library/sanford-media-center/'
            },
            {
                id: 8,
                name: "Williams Collection",
                latitude: 33.211803,
                longitude: -87.546032,
                icon: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                contact: {
                    phone: [{
                        number: '(205) 358-1489'
                    }]
                },
                link: '/collections/williams/'
            }
        ];


        $scope.getDirections = function(){
            var link = "https://www.google.com/maps/dir/" + $scope.directionsFrom + "/" + $scope.center[0] + "," + $scope.center[1];
            window.open(link);
        };

        $scope.$on('$destroy', function(){
            libChangeListener();
        });

        function updateMap(){
            var lid = $scope.params.lid - 1;
            var loc = $scope.loc[lid];
            $scope.center = [loc.latitude, loc.longitude];
            $scope.zoom = 18;
            $scope.contact = loc.contact;
            $scope.moreLink = loc.link;
            $scope.library = loc.name;
        }
    }])

    .directive('hoursLocationsMenu', ['$location', function($location){
        return {
            restrict: 'AC',
            link: function(scope, elm){
                scope.$on('$locationChangeSuccess', function(event, newLoc, oldLoc){
                    if (getLib(newLoc) !== getLib(oldLoc)){
                        elm.find('li').removeClass('active');
                    }
                })

                function getLib(url) {
                    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                    var regex = new RegExp("[\\?&]library=([^&#]*)"),
                        results = regex.exec(url);
                    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
                }
            }
        }
    }])

    .directive('hoursHref', ['$location', function($location){
        return {
            restrict: 'A',
            scope: {
                hoursHref: '@'
            },
            link: function(scope, elm){
                var library = $location.search().library || 'gorgas';
                var href = scope.$eval(scope.hoursHref);
                elm.bind('click', click);
                if (library.toLowerCase().indexOf(href.library) !== -1){
                    elm.parent().addClass('active');
                }

                scope.$on('$destroy', function(){
                    elm.unbind('click');
                });

                function click(ev){
                    ev.preventDefault();
                    scope.$apply(function(){
                        for (var param in href){
                            $location.search(param, href[param]);
                            $location.replace();
                        }
                    });
                    elm.parent().addClass('active');
                }

            }
        }
    }]);

angular.module('ualib.hours')

    .directive('libHoursToday', ['hoursFactory', '$filter', function(hoursFactory, $filter){
        return {
            restrict: 'EAC',
            replace: true,
            scope: {
                library: '@'
            },
            templateUrl: 'lib-hours-today/lib-hours-today.tpl.html',
            controller: ['$scope', '$element', function($scope, $element){
                var library = angular.isDefined($scope.library) ? $scope.library : 'gorgas';
                hoursFactory.get({view: 'today'},
                    function(data){
                        var libraries = [];
                        if (angular.isDefined(data.today.libraries)) {
                            for (var lib in data.today.libraries) {
                                libraries.push(data.today.libraries[lib]);
                                if (data.today.libraries[lib].hasOwnProperty('children')) {
                                    libraries = libraries.concat(data.today.libraries[lib]['children']);
                                }
                            }
                            var library = $filter('filter')(libraries, {name: $scope.library});
                            $scope.today = setStatus(library[0]);
                            $element.addClass('loaded');
                        } else {
                            console.log("Error: could not retrieve today hours");
                        }
                    },
                    function(msg){
                        console.log(msg);
                    });


                //TODO: Rewrite hours ListCtrl to handle both single library and list views - setting status here is redundant
                function setStatus(hours){
                    var text = 'open';
                    var css = 'label label';
                    var status = {
                        text: text,
                        css: css+'-success'
                    };

                    if (hours.timeLeft <= 7200 && hours.timeLeft > 0){
                        if (hours.isOpen) status.text = 'closing soon';
                        else status.text = 'opening soon';
                        status.css = css+'-warning';
                    }
                    else if (!hours.isOpen){
                        status.text = 'closed';
                        status.css = css+'-danger';
                    }
                    hours.status = status;
                    return hours;
                }

            }]
        }
    }])
angular.module('hours.list', [])

    .controller('ListCtrl', ['$scope', '$element', '$animate', 'hoursFactory', function ListCtrl($scope, $element, $animate, hoursFactory){

        $scope.hoursList = {};

        hoursFactory.get({view: 'today'},
            function(data){
                var list = setStatus(data.today.libraries);
                $scope.hoursList = list;
            },
            function(msg){
                console.log(msg);
            });

        function setStatus(hours){
            var h = [];

            for (var i = 0, len = hours.length; i < len; i++){
                var text = 'open';
                var css = 'label label';
                var status = {
                    text: text,
                    css: css+'-success'
                };

                if (hours[i].timeLeft <= 7200 && hours[i].timeLeft > 0){
                    if (hours[i].isOpen) status.text = 'closing soon';
                    else status.text = 'opening soon';
                    status.css = css+'-warning';
                }
                else if (!hours[i].isOpen){
                    status.text = 'closed';
                    status.css = css+'-danger';
                }

                hours[i].status = status;

                if (angular.isObject(hours[i].children)){
                    hours[i].children = setStatus(hours[i].children);
                }
                h.push(hours[i]);
            }
            return h;
        }

        $scope.selectLib = function(library){
            $scope.libID = library.id;
        };

    }])

    .directive('hoursList', [function hoursList(){
        return {
            restrict: 'AC',
            templateUrl: 'list/list.tpl.html',
            controller: 'ListCtrl'
        }
    }]);
/**
 * @license AngularJS v1.5.6
 * (c) 2010-2016 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular) {'use strict';

/* global ngTouchClickDirectiveFactory: false,
 */

/**
 * @ngdoc module
 * @name ngTouch
 * @description
 *
 * # ngTouch
 *
 * The `ngTouch` module provides touch events and other helpers for touch-enabled devices.
 * The implementation is based on jQuery Mobile touch event handling
 * ([jquerymobile.com](http://jquerymobile.com/)).
 *
 *
 * See {@link ngTouch.$swipe `$swipe`} for usage.
 *
 * <div doc-module-components="ngTouch"></div>
 *
 */

// define ngTouch module
/* global -ngTouch */
var ngTouch = angular.module('ngTouch', []);

ngTouch.provider('$touch', $TouchProvider);

function nodeName_(element) {
  return angular.lowercase(element.nodeName || (element[0] && element[0].nodeName));
}

/**
 * @ngdoc provider
 * @name $touchProvider
 *
 * @description
 * The `$touchProvider` allows enabling / disabling {@link ngTouch.ngClick ngTouch's ngClick directive}.
 */
$TouchProvider.$inject = ['$provide', '$compileProvider'];
function $TouchProvider($provide, $compileProvider) {

  /**
   * @ngdoc method
   * @name  $touchProvider#ngClickOverrideEnabled
   *
   * @param {boolean=} enabled update the ngClickOverrideEnabled state if provided, otherwise just return the
   * current ngClickOverrideEnabled state
   * @returns {*} current value if used as getter or itself (chaining) if used as setter
   *
   * @kind function
   *
   * @description
   * Call this method to enable/disable {@link ngTouch.ngClick ngTouch's ngClick directive}. If enabled,
   * the default ngClick directive will be replaced by a version that eliminates the 300ms delay for
   * click events on browser for touch-devices.
   *
   * The default is `false`.
   *
   */
  var ngClickOverrideEnabled = false;
  var ngClickDirectiveAdded = false;
  this.ngClickOverrideEnabled = function(enabled) {
    if (angular.isDefined(enabled)) {

      if (enabled && !ngClickDirectiveAdded) {
        ngClickDirectiveAdded = true;

        // Use this to identify the correct directive in the delegate
        ngTouchClickDirectiveFactory.$$moduleName = 'ngTouch';
        $compileProvider.directive('ngClick', ngTouchClickDirectiveFactory);

        $provide.decorator('ngClickDirective', ['$delegate', function($delegate) {
          if (ngClickOverrideEnabled) {
            // drop the default ngClick directive
            $delegate.shift();
          } else {
            // drop the ngTouch ngClick directive if the override has been re-disabled (because
            // we cannot de-register added directives)
            var i = $delegate.length - 1;
            while (i >= 0) {
              if ($delegate[i].$$moduleName === 'ngTouch') {
                $delegate.splice(i, 1);
                break;
              }
              i--;
            }
          }

          return $delegate;
        }]);
      }

      ngClickOverrideEnabled = enabled;
      return this;
    }

    return ngClickOverrideEnabled;
  };

  /**
  * @ngdoc service
  * @name $touch
  * @kind object
  *
  * @description
  * Provides the {@link ngTouch.$touch#ngClickOverrideEnabled `ngClickOverrideEnabled`} method.
  *
  */
  this.$get = function() {
    return {
      /**
       * @ngdoc method
       * @name  $touch#ngClickOverrideEnabled
       *
       * @returns {*} current value of `ngClickOverrideEnabled` set in the {@link ngTouch.$touchProvider $touchProvider},
       * i.e. if {@link ngTouch.ngClick ngTouch's ngClick} directive is enabled.
       *
       * @kind function
       */
      ngClickOverrideEnabled: function() {
        return ngClickOverrideEnabled;
      }
    };
  };

}

/* global ngTouch: false */

    /**
     * @ngdoc service
     * @name $swipe
     *
     * @description
     * The `$swipe` service is a service that abstracts the messier details of hold-and-drag swipe
     * behavior, to make implementing swipe-related directives more convenient.
     *
     * Requires the {@link ngTouch `ngTouch`} module to be installed.
     *
     * `$swipe` is used by the `ngSwipeLeft` and `ngSwipeRight` directives in `ngTouch`.
     *
     * # Usage
     * The `$swipe` service is an object with a single method: `bind`. `bind` takes an element
     * which is to be watched for swipes, and an object with four handler functions. See the
     * documentation for `bind` below.
     */

ngTouch.factory('$swipe', [function() {
  // The total distance in any direction before we make the call on swipe vs. scroll.
  var MOVE_BUFFER_RADIUS = 10;

  var POINTER_EVENTS = {
    'mouse': {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup'
    },
    'touch': {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      cancel: 'touchcancel'
    }
  };

  function getCoordinates(event) {
    var originalEvent = event.originalEvent || event;
    var touches = originalEvent.touches && originalEvent.touches.length ? originalEvent.touches : [originalEvent];
    var e = (originalEvent.changedTouches && originalEvent.changedTouches[0]) || touches[0];

    return {
      x: e.clientX,
      y: e.clientY
    };
  }

  function getEvents(pointerTypes, eventType) {
    var res = [];
    angular.forEach(pointerTypes, function(pointerType) {
      var eventName = POINTER_EVENTS[pointerType][eventType];
      if (eventName) {
        res.push(eventName);
      }
    });
    return res.join(' ');
  }

  return {
    /**
     * @ngdoc method
     * @name $swipe#bind
     *
     * @description
     * The main method of `$swipe`. It takes an element to be watched for swipe motions, and an
     * object containing event handlers.
     * The pointer types that should be used can be specified via the optional
     * third argument, which is an array of strings `'mouse'` and `'touch'`. By default,
     * `$swipe` will listen for `mouse` and `touch` events.
     *
     * The four events are `start`, `move`, `end`, and `cancel`. `start`, `move`, and `end`
     * receive as a parameter a coordinates object of the form `{ x: 150, y: 310 }` and the raw
     * `event`. `cancel` receives the raw `event` as its single parameter.
     *
     * `start` is called on either `mousedown` or `touchstart`. After this event, `$swipe` is
     * watching for `touchmove` or `mousemove` events. These events are ignored until the total
     * distance moved in either dimension exceeds a small threshold.
     *
     * Once this threshold is exceeded, either the horizontal or vertical delta is greater.
     * - If the horizontal distance is greater, this is a swipe and `move` and `end` events follow.
     * - If the vertical distance is greater, this is a scroll, and we let the browser take over.
     *   A `cancel` event is sent.
     *
     * `move` is called on `mousemove` and `touchmove` after the above logic has determined that
     * a swipe is in progress.
     *
     * `end` is called when a swipe is successfully completed with a `touchend` or `mouseup`.
     *
     * `cancel` is called either on a `touchcancel` from the browser, or when we begin scrolling
     * as described above.
     *
     */
    bind: function(element, eventHandlers, pointerTypes) {
      // Absolute total movement, used to control swipe vs. scroll.
      var totalX, totalY;
      // Coordinates of the start position.
      var startCoords;
      // Last event's position.
      var lastPos;
      // Whether a swipe is active.
      var active = false;

      pointerTypes = pointerTypes || ['mouse', 'touch'];
      element.on(getEvents(pointerTypes, 'start'), function(event) {
        startCoords = getCoordinates(event);
        active = true;
        totalX = 0;
        totalY = 0;
        lastPos = startCoords;
        eventHandlers['start'] && eventHandlers['start'](startCoords, event);
      });
      var events = getEvents(pointerTypes, 'cancel');
      if (events) {
        element.on(events, function(event) {
          active = false;
          eventHandlers['cancel'] && eventHandlers['cancel'](event);
        });
      }

      element.on(getEvents(pointerTypes, 'move'), function(event) {
        if (!active) return;

        // Android will send a touchcancel if it thinks we're starting to scroll.
        // So when the total distance (+ or - or both) exceeds 10px in either direction,
        // we either:
        // - On totalX > totalY, we send preventDefault() and treat this as a swipe.
        // - On totalY > totalX, we let the browser handle it as a scroll.

        if (!startCoords) return;
        var coords = getCoordinates(event);

        totalX += Math.abs(coords.x - lastPos.x);
        totalY += Math.abs(coords.y - lastPos.y);

        lastPos = coords;

        if (totalX < MOVE_BUFFER_RADIUS && totalY < MOVE_BUFFER_RADIUS) {
          return;
        }

        // One of totalX or totalY has exceeded the buffer, so decide on swipe vs. scroll.
        if (totalY > totalX) {
          // Allow native scrolling to take over.
          active = false;
          eventHandlers['cancel'] && eventHandlers['cancel'](event);
          return;
        } else {
          // Prevent the browser from scrolling.
          event.preventDefault();
          eventHandlers['move'] && eventHandlers['move'](coords, event);
        }
      });

      element.on(getEvents(pointerTypes, 'end'), function(event) {
        if (!active) return;
        active = false;
        eventHandlers['end'] && eventHandlers['end'](getCoordinates(event), event);
      });
    }
  };
}]);

/* global ngTouch: false,
  nodeName_: false
*/

/**
 * @ngdoc directive
 * @name ngClick
 * @deprecated
 *
 * @description
 * <div class="alert alert-danger">
 * **DEPRECATION NOTICE**: Beginning with Angular 1.5, this directive is deprecated and by default **disabled**.
 * The directive will receive no further support and might be removed from future releases.
 * If you need the directive, you can enable it with the {@link ngTouch.$touchProvider $touchProvider#ngClickOverrideEnabled}
 * function. We also recommend that you migrate to [FastClick](https://github.com/ftlabs/fastclick).
 * To learn more about the 300ms delay, this [Telerik article](http://developer.telerik.com/featured/300-ms-click-delay-ios-8/)
 * gives a good overview.
 * </div>
 * A more powerful replacement for the default ngClick designed to be used on touchscreen
 * devices. Most mobile browsers wait about 300ms after a tap-and-release before sending
 * the click event. This version handles them immediately, and then prevents the
 * following click event from propagating.
 *
 * Requires the {@link ngTouch `ngTouch`} module to be installed.
 *
 * This directive can fall back to using an ordinary click event, and so works on desktop
 * browsers as well as mobile.
 *
 * This directive also sets the CSS class `ng-click-active` while the element is being held
 * down (by a mouse click or touch) so you can restyle the depressed element if you wish.
 *
 * @element ANY
 * @param {expression} ngClick {@link guide/expression Expression} to evaluate
 * upon tap. (Event object is available as `$event`)
 *
 * @example
    <example module="ngClickExample" deps="angular-touch.js">
      <file name="index.html">
        <button ng-click="count = count + 1" ng-init="count=0">
          Increment
        </button>
        count: {{ count }}
      </file>
      <file name="script.js">
        angular.module('ngClickExample', ['ngTouch']);
      </file>
    </example>
 */

var ngTouchClickDirectiveFactory = ['$parse', '$timeout', '$rootElement',
    function($parse, $timeout, $rootElement) {
  var TAP_DURATION = 750; // Shorter than 750ms is a tap, longer is a taphold or drag.
  var MOVE_TOLERANCE = 12; // 12px seems to work in most mobile browsers.
  var PREVENT_DURATION = 2500; // 2.5 seconds maximum from preventGhostClick call to click
  var CLICKBUSTER_THRESHOLD = 25; // 25 pixels in any dimension is the limit for busting clicks.

  var ACTIVE_CLASS_NAME = 'ng-click-active';
  var lastPreventedTime;
  var touchCoordinates;
  var lastLabelClickCoordinates;


  // TAP EVENTS AND GHOST CLICKS
  //
  // Why tap events?
  // Mobile browsers detect a tap, then wait a moment (usually ~300ms) to see if you're
  // double-tapping, and then fire a click event.
  //
  // This delay sucks and makes mobile apps feel unresponsive.
  // So we detect touchstart, touchcancel and touchend ourselves and determine when
  // the user has tapped on something.
  //
  // What happens when the browser then generates a click event?
  // The browser, of course, also detects the tap and fires a click after a delay. This results in
  // tapping/clicking twice. We do "clickbusting" to prevent it.
  //
  // How does it work?
  // We attach global touchstart and click handlers, that run during the capture (early) phase.
  // So the sequence for a tap is:
  // - global touchstart: Sets an "allowable region" at the point touched.
  // - element's touchstart: Starts a touch
  // (- touchcancel ends the touch, no click follows)
  // - element's touchend: Determines if the tap is valid (didn't move too far away, didn't hold
  //   too long) and fires the user's tap handler. The touchend also calls preventGhostClick().
  // - preventGhostClick() removes the allowable region the global touchstart created.
  // - The browser generates a click event.
  // - The global click handler catches the click, and checks whether it was in an allowable region.
  //     - If preventGhostClick was called, the region will have been removed, the click is busted.
  //     - If the region is still there, the click proceeds normally. Therefore clicks on links and
  //       other elements without ngTap on them work normally.
  //
  // This is an ugly, terrible hack!
  // Yeah, tell me about it. The alternatives are using the slow click events, or making our users
  // deal with the ghost clicks, so I consider this the least of evils. Fortunately Angular
  // encapsulates this ugly logic away from the user.
  //
  // Why not just put click handlers on the element?
  // We do that too, just to be sure. If the tap event caused the DOM to change,
  // it is possible another element is now in that position. To take account for these possibly
  // distinct elements, the handlers are global and care only about coordinates.

  // Checks if the coordinates are close enough to be within the region.
  function hit(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) < CLICKBUSTER_THRESHOLD && Math.abs(y1 - y2) < CLICKBUSTER_THRESHOLD;
  }

  // Checks a list of allowable regions against a click location.
  // Returns true if the click should be allowed.
  // Splices out the allowable region from the list after it has been used.
  function checkAllowableRegions(touchCoordinates, x, y) {
    for (var i = 0; i < touchCoordinates.length; i += 2) {
      if (hit(touchCoordinates[i], touchCoordinates[i + 1], x, y)) {
        touchCoordinates.splice(i, i + 2);
        return true; // allowable region
      }
    }
    return false; // No allowable region; bust it.
  }

  // Global click handler that prevents the click if it's in a bustable zone and preventGhostClick
  // was called recently.
  function onClick(event) {
    if (Date.now() - lastPreventedTime > PREVENT_DURATION) {
      return; // Too old.
    }

    var touches = event.touches && event.touches.length ? event.touches : [event];
    var x = touches[0].clientX;
    var y = touches[0].clientY;
    // Work around desktop Webkit quirk where clicking a label will fire two clicks (on the label
    // and on the input element). Depending on the exact browser, this second click we don't want
    // to bust has either (0,0), negative coordinates, or coordinates equal to triggering label
    // click event
    if (x < 1 && y < 1) {
      return; // offscreen
    }
    if (lastLabelClickCoordinates &&
        lastLabelClickCoordinates[0] === x && lastLabelClickCoordinates[1] === y) {
      return; // input click triggered by label click
    }
    // reset label click coordinates on first subsequent click
    if (lastLabelClickCoordinates) {
      lastLabelClickCoordinates = null;
    }
    // remember label click coordinates to prevent click busting of trigger click event on input
    if (nodeName_(event.target) === 'label') {
      lastLabelClickCoordinates = [x, y];
    }

    // Look for an allowable region containing this click.
    // If we find one, that means it was created by touchstart and not removed by
    // preventGhostClick, so we don't bust it.
    if (checkAllowableRegions(touchCoordinates, x, y)) {
      return;
    }

    // If we didn't find an allowable region, bust the click.
    event.stopPropagation();
    event.preventDefault();

    // Blur focused form elements
    event.target && event.target.blur && event.target.blur();
  }


  // Global touchstart handler that creates an allowable region for a click event.
  // This allowable region can be removed by preventGhostClick if we want to bust it.
  function onTouchStart(event) {
    var touches = event.touches && event.touches.length ? event.touches : [event];
    var x = touches[0].clientX;
    var y = touches[0].clientY;
    touchCoordinates.push(x, y);

    $timeout(function() {
      // Remove the allowable region.
      for (var i = 0; i < touchCoordinates.length; i += 2) {
        if (touchCoordinates[i] == x && touchCoordinates[i + 1] == y) {
          touchCoordinates.splice(i, i + 2);
          return;
        }
      }
    }, PREVENT_DURATION, false);
  }

  // On the first call, attaches some event handlers. Then whenever it gets called, it creates a
  // zone around the touchstart where clicks will get busted.
  function preventGhostClick(x, y) {
    if (!touchCoordinates) {
      $rootElement[0].addEventListener('click', onClick, true);
      $rootElement[0].addEventListener('touchstart', onTouchStart, true);
      touchCoordinates = [];
    }

    lastPreventedTime = Date.now();

    checkAllowableRegions(touchCoordinates, x, y);
  }

  // Actual linking function.
  return function(scope, element, attr) {
    var clickHandler = $parse(attr.ngClick),
        tapping = false,
        tapElement,  // Used to blur the element after a tap.
        startTime,   // Used to check if the tap was held too long.
        touchStartX,
        touchStartY;

    function resetState() {
      tapping = false;
      element.removeClass(ACTIVE_CLASS_NAME);
    }

    element.on('touchstart', function(event) {
      tapping = true;
      tapElement = event.target ? event.target : event.srcElement; // IE uses srcElement.
      // Hack for Safari, which can target text nodes instead of containers.
      if (tapElement.nodeType == 3) {
        tapElement = tapElement.parentNode;
      }

      element.addClass(ACTIVE_CLASS_NAME);

      startTime = Date.now();

      // Use jQuery originalEvent
      var originalEvent = event.originalEvent || event;
      var touches = originalEvent.touches && originalEvent.touches.length ? originalEvent.touches : [originalEvent];
      var e = touches[0];
      touchStartX = e.clientX;
      touchStartY = e.clientY;
    });

    element.on('touchcancel', function(event) {
      resetState();
    });

    element.on('touchend', function(event) {
      var diff = Date.now() - startTime;

      // Use jQuery originalEvent
      var originalEvent = event.originalEvent || event;
      var touches = (originalEvent.changedTouches && originalEvent.changedTouches.length) ?
          originalEvent.changedTouches :
          ((originalEvent.touches && originalEvent.touches.length) ? originalEvent.touches : [originalEvent]);
      var e = touches[0];
      var x = e.clientX;
      var y = e.clientY;
      var dist = Math.sqrt(Math.pow(x - touchStartX, 2) + Math.pow(y - touchStartY, 2));

      if (tapping && diff < TAP_DURATION && dist < MOVE_TOLERANCE) {
        // Call preventGhostClick so the clickbuster will catch the corresponding click.
        preventGhostClick(x, y);

        // Blur the focused element (the button, probably) before firing the callback.
        // This doesn't work perfectly on Android Chrome, but seems to work elsewhere.
        // I couldn't get anything to work reliably on Android Chrome.
        if (tapElement) {
          tapElement.blur();
        }

        if (!angular.isDefined(attr.disabled) || attr.disabled === false) {
          element.triggerHandler('click', [event]);
        }
      }

      resetState();
    });

    // Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
    // something else nearby.
    element.onclick = function(event) { };

    // Actual click handler.
    // There are three different kinds of clicks, only two of which reach this point.
    // - On desktop browsers without touch events, their clicks will always come here.
    // - On mobile browsers, the simulated "fast" click will call this.
    // - But the browser's follow-up slow click will be "busted" before it reaches this handler.
    // Therefore it's safe to use this directive on both mobile and desktop.
    element.on('click', function(event, touchend) {
      scope.$apply(function() {
        clickHandler(scope, {$event: (touchend || event)});
      });
    });

    element.on('mousedown', function(event) {
      element.addClass(ACTIVE_CLASS_NAME);
    });

    element.on('mousemove mouseup', function(event) {
      element.removeClass(ACTIVE_CLASS_NAME);
    });

  };
}];

/* global ngTouch: false */

/**
 * @ngdoc directive
 * @name ngSwipeLeft
 *
 * @description
 * Specify custom behavior when an element is swiped to the left on a touchscreen device.
 * A leftward swipe is a quick, right-to-left slide of the finger.
 * Though ngSwipeLeft is designed for touch-based devices, it will work with a mouse click and drag
 * too.
 *
 * To disable the mouse click and drag functionality, add `ng-swipe-disable-mouse` to
 * the `ng-swipe-left` or `ng-swipe-right` DOM Element.
 *
 * Requires the {@link ngTouch `ngTouch`} module to be installed.
 *
 * @element ANY
 * @param {expression} ngSwipeLeft {@link guide/expression Expression} to evaluate
 * upon left swipe. (Event object is available as `$event`)
 *
 * @example
    <example module="ngSwipeLeftExample" deps="angular-touch.js">
      <file name="index.html">
        <div ng-show="!showActions" ng-swipe-left="showActions = true">
          Some list content, like an email in the inbox
        </div>
        <div ng-show="showActions" ng-swipe-right="showActions = false">
          <button ng-click="reply()">Reply</button>
          <button ng-click="delete()">Delete</button>
        </div>
      </file>
      <file name="script.js">
        angular.module('ngSwipeLeftExample', ['ngTouch']);
      </file>
    </example>
 */

/**
 * @ngdoc directive
 * @name ngSwipeRight
 *
 * @description
 * Specify custom behavior when an element is swiped to the right on a touchscreen device.
 * A rightward swipe is a quick, left-to-right slide of the finger.
 * Though ngSwipeRight is designed for touch-based devices, it will work with a mouse click and drag
 * too.
 *
 * Requires the {@link ngTouch `ngTouch`} module to be installed.
 *
 * @element ANY
 * @param {expression} ngSwipeRight {@link guide/expression Expression} to evaluate
 * upon right swipe. (Event object is available as `$event`)
 *
 * @example
    <example module="ngSwipeRightExample" deps="angular-touch.js">
      <file name="index.html">
        <div ng-show="!showActions" ng-swipe-left="showActions = true">
          Some list content, like an email in the inbox
        </div>
        <div ng-show="showActions" ng-swipe-right="showActions = false">
          <button ng-click="reply()">Reply</button>
          <button ng-click="delete()">Delete</button>
        </div>
      </file>
      <file name="script.js">
        angular.module('ngSwipeRightExample', ['ngTouch']);
      </file>
    </example>
 */

function makeSwipeDirective(directiveName, direction, eventName) {
  ngTouch.directive(directiveName, ['$parse', '$swipe', function($parse, $swipe) {
    // The maximum vertical delta for a swipe should be less than 75px.
    var MAX_VERTICAL_DISTANCE = 75;
    // Vertical distance should not be more than a fraction of the horizontal distance.
    var MAX_VERTICAL_RATIO = 0.3;
    // At least a 30px lateral motion is necessary for a swipe.
    var MIN_HORIZONTAL_DISTANCE = 30;

    return function(scope, element, attr) {
      var swipeHandler = $parse(attr[directiveName]);

      var startCoords, valid;

      function validSwipe(coords) {
        // Check that it's within the coordinates.
        // Absolute vertical distance must be within tolerances.
        // Horizontal distance, we take the current X - the starting X.
        // This is negative for leftward swipes and positive for rightward swipes.
        // After multiplying by the direction (-1 for left, +1 for right), legal swipes
        // (ie. same direction as the directive wants) will have a positive delta and
        // illegal ones a negative delta.
        // Therefore this delta must be positive, and larger than the minimum.
        if (!startCoords) return false;
        var deltaY = Math.abs(coords.y - startCoords.y);
        var deltaX = (coords.x - startCoords.x) * direction;
        return valid && // Short circuit for already-invalidated swipes.
            deltaY < MAX_VERTICAL_DISTANCE &&
            deltaX > 0 &&
            deltaX > MIN_HORIZONTAL_DISTANCE &&
            deltaY / deltaX < MAX_VERTICAL_RATIO;
      }

      var pointerTypes = ['touch'];
      if (!angular.isDefined(attr['ngSwipeDisableMouse'])) {
        pointerTypes.push('mouse');
      }
      $swipe.bind(element, {
        'start': function(coords, event) {
          startCoords = coords;
          valid = true;
        },
        'cancel': function(event) {
          valid = false;
        },
        'end': function(coords, event) {
          if (validSwipe(coords)) {
            scope.$apply(function() {
              element.triggerHandler(eventName);
              swipeHandler(scope, {$event: event});
            });
          }
        }
      }, pointerTypes);
    };
  }]);
}

// Left is negative X-coordinate, right is positive.
makeSwipeDirective('ngSwipeLeft', -1, 'swipeleft');
makeSwipeDirective('ngSwipeRight', 1, 'swiperight');



})(window, window.angular);

/**
 * Angular Carousel - Mobile friendly touch carousel for AngularJS
 * @version v0.3.12 - 2015-06-11
 * @link http://revolunet.github.com/angular-carousel
 * @author Julien Bouquillon <julien@revolunet.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
/*global angular */

/*
Angular touch carousel with CSS GPU accel and slide buffering
http://github.com/revolunet/angular-carousel

*/

angular.module('angular-carousel', [
    'ngTouch',
    'angular-carousel.shifty'
]);

angular.module('angular-carousel')

.directive('rnCarouselAutoSlide', ['$interval', function($interval) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
        var stopAutoPlay = function() {
            if (scope.autoSlider) {
                $interval.cancel(scope.autoSlider);
                scope.autoSlider = null;
            }
        };
        var restartTimer = function() {
            scope.autoSlide();
        };

        scope.$watch('carouselIndex', restartTimer);

        if (attrs.hasOwnProperty('rnCarouselPauseOnHover') && attrs.rnCarouselPauseOnHover !== 'false'){
            element.on('mouseenter', stopAutoPlay);
            element.on('mouseleave', restartTimer);
        }

        scope.$on('$destroy', function(){
            stopAutoPlay();
            element.off('mouseenter', stopAutoPlay);
            element.off('mouseleave', restartTimer);
        });
    }
  };
}]);

angular.module('angular-carousel')

.directive('rnCarouselIndicators', ['$parse', function($parse) {
  return {
    restrict: 'A',
    scope: {
      slides: '=',
      index: '=rnCarouselIndex'
    },
    templateUrl: 'carousel-indicators.html',
    link: function(scope, iElement, iAttributes) {
      var indexModel = $parse(iAttributes.rnCarouselIndex);
      scope.goToSlide = function(index) {
        indexModel.assign(scope.$parent.$parent, index);
      };
    }
  };
}]);

angular.module('angular-carousel').run(['$templateCache', function($templateCache) {
  $templateCache.put('carousel-indicators.html',
      '<div class="rn-carousel-indicator">\n' +
        '<span ng-repeat="slide in slides" ng-class="{active: $index==index}" ng-click="goToSlide($index)">●</span>' +
      '</div>'
  );
}]);

(function() {
    "use strict";

    angular.module('angular-carousel')

    .service('DeviceCapabilities', function() {

        // TODO: merge in a single function

        // detect supported CSS property
        function detectTransformProperty() {
            var transformProperty = 'transform',
                safariPropertyHack = 'webkitTransform';
            if (typeof document.body.style[transformProperty] !== 'undefined') {

                ['webkit', 'moz', 'o', 'ms'].every(function (prefix) {
                    var e = '-' + prefix + '-transform';
                    if (typeof document.body.style[e] !== 'undefined') {
                        transformProperty = e;
                        return false;
                    }
                    return true;
                });
            } else if (typeof document.body.style[safariPropertyHack] !== 'undefined') {
                transformProperty = '-webkit-transform';
            } else {
                transformProperty = undefined;
            }
            return transformProperty;
        }

        //Detect support of translate3d
        function detect3dSupport() {
            var el = document.createElement('p'),
                has3d,
                transforms = {
                    'webkitTransform': '-webkit-transform',
                    'msTransform': '-ms-transform',
                    'transform': 'transform'
                };
            // Add it to the body to get the computed style
            document.body.insertBefore(el, null);
            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = 'translate3d(1px,1px,1px)';
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }
            document.body.removeChild(el);
            return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
        }

        return {
            has3d: detect3dSupport(),
            transformProperty: detectTransformProperty()
        };

    })

    .service('computeCarouselSlideStyle', ["DeviceCapabilities", function(DeviceCapabilities) {
        // compute transition transform properties for a given slide and global offset
        return function(slideIndex, offset, transitionType) {
            var style = {
                    display: 'inline-block'
                },
                opacity,
                absoluteLeft = (slideIndex * 100) + offset,
                slideTransformValue = DeviceCapabilities.has3d ? 'translate3d(' + absoluteLeft + '%, 0, 0)' : 'translate3d(' + absoluteLeft + '%, 0)',
                distance = ((100 - Math.abs(absoluteLeft)) / 100);

            if (!DeviceCapabilities.transformProperty) {
                // fallback to default slide if transformProperty is not available
                style['margin-left'] = absoluteLeft + '%';
            } else {
                if (transitionType == 'fadeAndSlide') {
                    style[DeviceCapabilities.transformProperty] = slideTransformValue;
                    opacity = 0;
                    if (Math.abs(absoluteLeft) < 100) {
                        opacity = 0.3 + distance * 0.7;
                    }
                    style.opacity = opacity;
                } else if (transitionType == 'hexagon') {
                    var transformFrom = 100,
                        degrees = 0,
                        maxDegrees = 60 * (distance - 1);

                    transformFrom = offset < (slideIndex * -100) ? 100 : 0;
                    degrees = offset < (slideIndex * -100) ? maxDegrees : -maxDegrees;
                    style[DeviceCapabilities.transformProperty] = slideTransformValue + ' ' + 'rotateY(' + degrees + 'deg)';
                    style[DeviceCapabilities.transformProperty + '-origin'] = transformFrom + '% 50%';
                } else if (transitionType == 'zoom') {
                    style[DeviceCapabilities.transformProperty] = slideTransformValue;
                    var scale = 1;
                    if (Math.abs(absoluteLeft) < 100) {
                        scale = 1 + ((1 - distance) * 2);
                    }
                    style[DeviceCapabilities.transformProperty] += ' scale(' + scale + ')';
                    style[DeviceCapabilities.transformProperty + '-origin'] = '50% 50%';
                    opacity = 0;
                    if (Math.abs(absoluteLeft) < 100) {
                        opacity = 0.3 + distance * 0.7;
                    }
                    style.opacity = opacity;
                } else {
                    style[DeviceCapabilities.transformProperty] = slideTransformValue;
                }
            }
            return style;
        };
    }])

    .service('createStyleString', function() {
        return function(object) {
            var styles = [];
            angular.forEach(object, function(value, key) {
                styles.push(key + ':' + value);
            });
            return styles.join(';');
        };
    })

    .directive('rnCarousel', ['$swipe', '$window', '$document', '$parse', '$compile', '$timeout', '$interval', 'computeCarouselSlideStyle', 'createStyleString', 'Tweenable',
        function($swipe, $window, $document, $parse, $compile, $timeout, $interval, computeCarouselSlideStyle, createStyleString, Tweenable) {
            // internal ids to allow multiple instances
            var carouselId = 0,
                // in absolute pixels, at which distance the slide stick to the edge on release
                rubberTreshold = 3;

            var requestAnimationFrame = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame || $window.mozRequestAnimationFrame;

            function getItemIndex(collection, target, defaultIndex) {
                var result = defaultIndex;
                collection.every(function(item, index) {
                    if (angular.equals(item, target)) {
                        result = index;
                        return false;
                    }
                    return true;
                });
                return result;
            }

            return {
                restrict: 'A',
                scope: true,
                compile: function(tElement, tAttributes) {
                    // use the compile phase to customize the DOM
                    var firstChild = tElement[0].querySelector('li'),
                        firstChildAttributes = (firstChild) ? firstChild.attributes : [],
                        isRepeatBased = false,
                        isBuffered = false,
                        repeatItem,
                        repeatCollection;

                    // try to find an ngRepeat expression
                    // at this point, the attributes are not yet normalized so we need to try various syntax
                    ['ng-repeat', 'data-ng-repeat', 'ng:repeat', 'x-ng-repeat'].every(function(attr) {
                        var repeatAttribute = firstChildAttributes[attr];
                        if (angular.isDefined(repeatAttribute)) {
                            // ngRepeat regexp extracted from angular 1.2.7 src
                            var exprMatch = repeatAttribute.value.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),
                                trackProperty = exprMatch[3];

                            repeatItem = exprMatch[1];
                            repeatCollection = exprMatch[2];

                            if (repeatItem) {
                                if (angular.isDefined(tAttributes['rnCarouselBuffered'])) {
                                    // update the current ngRepeat expression and add a slice operator if buffered
                                    isBuffered = true;
                                    repeatAttribute.value = repeatItem + ' in ' + repeatCollection + '|carouselSlice:carouselBufferIndex:carouselBufferSize';
                                    if (trackProperty) {
                                        repeatAttribute.value += ' track by ' + trackProperty;
                                    }
                                }
                                isRepeatBased = true;
                                return false;
                            }
                        }
                        return true;
                    });

                    return function(scope, iElement, iAttributes, containerCtrl) {

                        carouselId++;

                        var defaultOptions = {
                            transitionType: iAttributes.rnCarouselTransition || 'slide',
                            transitionEasing: iAttributes.rnCarouselEasing || 'easeTo',
                            transitionDuration: parseInt(iAttributes.rnCarouselDuration, 10) || 300,
                            isSequential: true,
                            autoSlideDuration: 3,
                            bufferSize: 5,
                            /* in container % how much we need to drag to trigger the slide change */
                            moveTreshold: 0.1,
                            defaultIndex: 0
                        };

                        // TODO
                        var options = angular.extend({}, defaultOptions);

                        var pressed,
                            startX,
                            isIndexBound = false,
                            offset = 0,
                            destination,
                            swipeMoved = false,
                            //animOnIndexChange = true,
                            currentSlides = [],
                            elWidth = null,
                            elX = null,
                            animateTransitions = true,
                            intialState = true,
                            animating = false,
                            mouseUpBound = false,
                            locked = false;

                        //rn-swipe-disabled =true will only disable swipe events
                        if(iAttributes.rnSwipeDisabled !== "true") {
                            $swipe.bind(iElement, {
                                start: swipeStart,
                                move: swipeMove,
                                end: swipeEnd,
                                cancel: function(event) {
                                    swipeEnd({}, event);
                                }
                            });
                        }

                        function getSlidesDOM() {
                            return iElement[0].querySelectorAll('ul[rn-carousel] > li');
                        }

                        function documentMouseUpEvent(event) {
                            // in case we click outside the carousel, trigger a fake swipeEnd
                            swipeMoved = true;
                            swipeEnd({
                                x: event.clientX,
                                y: event.clientY
                            }, event);
                        }

                        function updateSlidesPosition(offset) {
                            // manually apply transformation to carousel childrens
                            // todo : optim : apply only to visible items
                            var x = scope.carouselBufferIndex * 100 + offset;
                            angular.forEach(getSlidesDOM(), function(child, index) {
                                child.style.cssText = createStyleString(computeCarouselSlideStyle(index, x, options.transitionType));
                            });
                        }

                        scope.nextSlide = function(slideOptions) {
                            var index = scope.carouselIndex + 1;
                            if (index > currentSlides.length - 1) {
                                index = 0;
                            }
                            if (!locked) {
                                goToSlide(index, slideOptions);
                            }
                        };

                        scope.prevSlide = function(slideOptions) {
                            var index = scope.carouselIndex - 1;
                            if (index < 0) {
                                index = currentSlides.length - 1;
                            }
                            goToSlide(index, slideOptions);
                        };

                        function goToSlide(index, slideOptions) {
                            //console.log('goToSlide', arguments);
                            // move a to the given slide index
                            if (index === undefined) {
                                index = scope.carouselIndex;
                            }

                            slideOptions = slideOptions || {};
                            if (slideOptions.animate === false || options.transitionType === 'none') {
                                locked = false;
                                offset = index * -100;
                                scope.carouselIndex = index;
                                updateBufferIndex();
                                return;
                            }

                            locked = true;
                            var tweenable = new Tweenable();
                            tweenable.tween({
                                from: {
                                    'x': offset
                                },
                                to: {
                                    'x': index * -100
                                },
                                duration: options.transitionDuration,
                                easing: options.transitionEasing,
                                step: function(state) {
                                    updateSlidesPosition(state.x);
                                },
                                finish: function() {
                                    scope.$apply(function() {
                                        scope.carouselIndex = index;
                                        offset = index * -100;
                                        updateBufferIndex();
                                        $timeout(function () {
                                          locked = false;
                                        }, 0, false);
                                    });
                                }
                            });
                        }

                        function getContainerWidth() {
                            var rect = iElement[0].getBoundingClientRect();
                            return rect.width ? rect.width : rect.right - rect.left;
                        }

                        function updateContainerWidth() {
                            elWidth = getContainerWidth();
                        }

                        function bindMouseUpEvent() {
                            if (!mouseUpBound) {
                              mouseUpBound = true;
                              $document.bind('mouseup', documentMouseUpEvent);
                            }
                        }

                        function unbindMouseUpEvent() {
                            if (mouseUpBound) {
                              mouseUpBound = false;
                              $document.unbind('mouseup', documentMouseUpEvent);
                            }
                        }

                        function swipeStart(coords, event) {
                            // console.log('swipeStart', coords, event);
                            if (locked || currentSlides.length <= 1) {
                                return;
                            }
                            updateContainerWidth();
                            elX = iElement[0].querySelector('li').getBoundingClientRect().left;
                            pressed = true;
                            startX = coords.x;
                            return false;
                        }

                        function swipeMove(coords, event) {
                            //console.log('swipeMove', coords, event);
                            var x, delta;
                            bindMouseUpEvent();
                            if (pressed) {
                                x = coords.x;
                                delta = startX - x;
                                if (delta > 2 || delta < -2) {
                                    swipeMoved = true;
                                    var moveOffset = offset + (-delta * 100 / elWidth);
                                    updateSlidesPosition(moveOffset);
                                }
                            }
                            return false;
                        }

                        var init = true;
                        scope.carouselIndex = 0;

                        if (!isRepeatBased) {
                            // fake array when no ng-repeat
                            currentSlides = [];
                            angular.forEach(getSlidesDOM(), function(node, index) {
                                currentSlides.push({id: index});
                            });
                        }

                        if (iAttributes.rnCarouselControls!==undefined) {
                            // dont use a directive for this
                            var nextSlideIndexCompareValue = isRepeatBased ? repeatCollection.replace('::', '') + '.length - 1' : currentSlides.length - 1;
                            var tpl = '<div class="rn-carousel-controls">\n' +
                                '  <span class="rn-carousel-control rn-carousel-control-prev" ng-click="prevSlide()" ng-if="carouselIndex > 0"></span>\n' +
                                '  <span class="rn-carousel-control rn-carousel-control-next" ng-click="nextSlide()" ng-if="carouselIndex < ' + nextSlideIndexCompareValue + '"></span>\n' +
                                '</div>';
                            iElement.parent().append($compile(angular.element(tpl))(scope));
                        }

                        if (iAttributes.rnCarouselAutoSlide!==undefined) {
                            var duration = parseInt(iAttributes.rnCarouselAutoSlide, 10) || options.autoSlideDuration;
                            scope.autoSlide = function() {
                                if (scope.autoSlider) {
                                    $interval.cancel(scope.autoSlider);
                                    scope.autoSlider = null;
                                }
                                scope.autoSlider = $interval(function() {
                                    if (!locked && !pressed) {
                                        scope.nextSlide();
                                    }
                                }, duration * 1000);
                            };
                        }

                        if (iAttributes.rnCarouselDefaultIndex) {
                            var defaultIndexModel = $parse(iAttributes.rnCarouselDefaultIndex);
                            options.defaultIndex = defaultIndexModel(scope.$parent) || 0;
                        }

                        if (iAttributes.rnCarouselIndex) {
                            var updateParentIndex = function(value) {
                                indexModel.assign(scope.$parent, value);
                            };
                            var indexModel = $parse(iAttributes.rnCarouselIndex);
                            if (angular.isFunction(indexModel.assign)) {
                                /* check if this property is assignable then watch it */
                                scope.$watch('carouselIndex', function(newValue) {
                                    updateParentIndex(newValue);
                                });
                                scope.$parent.$watch(indexModel, function(newValue, oldValue) {

                                    if (newValue !== undefined && newValue !== null) {
                                        if (currentSlides && currentSlides.length > 0 && newValue >= currentSlides.length) {
                                            newValue = currentSlides.length - 1;
                                            updateParentIndex(newValue);
                                        } else if (currentSlides && newValue < 0) {
                                            newValue = 0;
                                            updateParentIndex(newValue);
                                        }
                                        if (!locked) {
                                            goToSlide(newValue, {
                                                animate: !init
                                            });
                                        }
                                        init = false;
                                    }
                                });
                                isIndexBound = true;

                                if (options.defaultIndex) {
                                    goToSlide(options.defaultIndex, {
                                        animate: !init
                                    });
                                }
                            } else if (!isNaN(iAttributes.rnCarouselIndex)) {
                                /* if user just set an initial number, set it */
                                goToSlide(parseInt(iAttributes.rnCarouselIndex, 10), {
                                    animate: false
                                });
                            }
                        } else {
                            goToSlide(options.defaultIndex, {
                                animate: !init
                            });
                            init = false;
                        }

                        if (iAttributes.rnCarouselLocked) {
                            scope.$watch(iAttributes.rnCarouselLocked, function(newValue, oldValue) {
                                // only bind swipe when it's not switched off
                                if(newValue === true) {
                                    locked = true;
                                } else {
                                    locked = false;
                                }
                            });
                        }

                        if (isRepeatBased) {
                            // use rn-carousel-deep-watch to fight the Angular $watchCollection weakness : https://github.com/angular/angular.js/issues/2621
                            // optional because it have some performance impacts (deep watch)
                            var deepWatch = (iAttributes.rnCarouselDeepWatch!==undefined);

                            scope[deepWatch?'$watch':'$watchCollection'](repeatCollection, function(newValue, oldValue) {
                                //console.log('repeatCollection', currentSlides);
                                currentSlides = newValue;
                                // if deepWatch ON ,manually compare objects to guess the new position
                                if (deepWatch && angular.isArray(newValue)) {
                                    var activeElement = oldValue[scope.carouselIndex];
                                    var newIndex = getItemIndex(newValue, activeElement, scope.carouselIndex);
                                    goToSlide(newIndex, {animate: false});
                                } else {
                                    goToSlide(scope.carouselIndex, {animate: false});
                                }
                            }, true);
                        }

                        function swipeEnd(coords, event, forceAnimation) {
                            //  console.log('swipeEnd', 'scope.carouselIndex', scope.carouselIndex);
                            // Prevent clicks on buttons inside slider to trigger "swipeEnd" event on touchend/mouseup
                            // console.log(iAttributes.rnCarouselOnInfiniteScroll);
                            if (event && !swipeMoved) {
                                return;
                            }
                            unbindMouseUpEvent();
                            pressed = false;
                            swipeMoved = false;
                            destination = startX - coords.x;
                            if (destination===0) {
                                return;
                            }
                            if (locked) {
                                return;
                            }
                            offset += (-destination * 100 / elWidth);
                            if (options.isSequential) {
                                var minMove = options.moveTreshold * elWidth,
                                    absMove = -destination,
                                    slidesMove = -Math[absMove >= 0 ? 'ceil' : 'floor'](absMove / elWidth),
                                    shouldMove = Math.abs(absMove) > minMove;

                                if (currentSlides && (slidesMove + scope.carouselIndex) >= currentSlides.length) {
                                    slidesMove = currentSlides.length - 1 - scope.carouselIndex;
                                }
                                if ((slidesMove + scope.carouselIndex) < 0) {
                                    slidesMove = -scope.carouselIndex;
                                }
                                var moveOffset = shouldMove ? slidesMove : 0;

                                destination = (scope.carouselIndex + moveOffset);

                                goToSlide(destination);
                                if(iAttributes.rnCarouselOnInfiniteScrollRight!==undefined && slidesMove === 0 && scope.carouselIndex !== 0) {
                                    $parse(iAttributes.rnCarouselOnInfiniteScrollRight)(scope)
                                    goToSlide(0);
                                }
                                if(iAttributes.rnCarouselOnInfiniteScrollLeft!==undefined && slidesMove === 0 && scope.carouselIndex === 0 && moveOffset === 0) {
                                    $parse(iAttributes.rnCarouselOnInfiniteScrollLeft)(scope)
                                    goToSlide(currentSlides.length);
                                }

                            } else {
                                scope.$apply(function() {
                                    scope.carouselIndex = parseInt(-offset / 100, 10);
                                    updateBufferIndex();
                                });

                            }

                        }

                        scope.$on('$destroy', function() {
                            unbindMouseUpEvent();
                        });

                        scope.carouselBufferIndex = 0;
                        scope.carouselBufferSize = options.bufferSize;

                        function updateBufferIndex() {
                            // update and cap te buffer index
                            var bufferIndex = 0;
                            var bufferEdgeSize = (scope.carouselBufferSize - 1) / 2;
                            if (isBuffered) {
                                if (scope.carouselIndex <= bufferEdgeSize) {
                                    // first buffer part
                                    bufferIndex = 0;
                                } else if (currentSlides && currentSlides.length < scope.carouselBufferSize) {
                                    // smaller than buffer
                                    bufferIndex = 0;
                                } else if (currentSlides && scope.carouselIndex > currentSlides.length - scope.carouselBufferSize) {
                                    // last buffer part
                                    bufferIndex = currentSlides.length - scope.carouselBufferSize;
                                } else {
                                    // compute buffer start
                                    bufferIndex = scope.carouselIndex - bufferEdgeSize;
                                }

                                scope.carouselBufferIndex = bufferIndex;
                                $timeout(function() {
                                    updateSlidesPosition(offset);
                                }, 0, false);
                            } else {
                                $timeout(function() {
                                    updateSlidesPosition(offset);
                                }, 0, false);
                            }
                        }

                        function onOrientationChange() {
                            updateContainerWidth();
                            goToSlide();
                        }

                        // handle orientation change
                        var winEl = angular.element($window);
                        winEl.bind('orientationchange', onOrientationChange);
                        winEl.bind('resize', onOrientationChange);

                        scope.$on('$destroy', function() {
                            unbindMouseUpEvent();
                            winEl.unbind('orientationchange', onOrientationChange);
                            winEl.unbind('resize', onOrientationChange);
                        });
                    };
                }
            };
        }
    ]);
})();



angular.module('angular-carousel.shifty', [])

.factory('Tweenable', function() {

    /*! shifty - v1.3.4 - 2014-10-29 - http://jeremyckahn.github.io/shifty */
  ;(function (root) {

  /*!
   * Shifty Core
   * By Jeremy Kahn - jeremyckahn@gmail.com
   */

  var Tweenable = (function () {

    'use strict';

    // Aliases that get defined later in this function
    var formula;

    // CONSTANTS
    var DEFAULT_SCHEDULE_FUNCTION;
    var DEFAULT_EASING = 'linear';
    var DEFAULT_DURATION = 500;
    var UPDATE_TIME = 1000 / 60;

    var _now = Date.now
         ? Date.now
         : function () {return +new Date();};

    var now = typeof SHIFTY_DEBUG_NOW !== 'undefined' ? SHIFTY_DEBUG_NOW : _now;

    if (typeof window !== 'undefined') {
      // requestAnimationFrame() shim by Paul Irish (modified for Shifty)
      // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
      DEFAULT_SCHEDULE_FUNCTION = window.requestAnimationFrame
         || window.webkitRequestAnimationFrame
         || window.oRequestAnimationFrame
         || window.msRequestAnimationFrame
         || (window.mozCancelRequestAnimationFrame
         && window.mozRequestAnimationFrame)
         || setTimeout;
    } else {
      DEFAULT_SCHEDULE_FUNCTION = setTimeout;
    }

    function noop () {
      // NOOP!
    }

    /*!
     * Handy shortcut for doing a for-in loop. This is not a "normal" each
     * function, it is optimized for Shifty.  The iterator function only receives
     * the property name, not the value.
     * @param {Object} obj
     * @param {Function(string)} fn
     */
    function each (obj, fn) {
      var key;
      for (key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          fn(key);
        }
      }
    }

    /*!
     * Perform a shallow copy of Object properties.
     * @param {Object} targetObject The object to copy into
     * @param {Object} srcObject The object to copy from
     * @return {Object} A reference to the augmented `targetObj` Object
     */
    function shallowCopy (targetObj, srcObj) {
      each(srcObj, function (prop) {
        targetObj[prop] = srcObj[prop];
      });

      return targetObj;
    }

    /*!
     * Copies each property from src onto target, but only if the property to
     * copy to target is undefined.
     * @param {Object} target Missing properties in this Object are filled in
     * @param {Object} src
     */
    function defaults (target, src) {
      each(src, function (prop) {
        if (typeof target[prop] === 'undefined') {
          target[prop] = src[prop];
        }
      });
    }

    /*!
     * Calculates the interpolated tween values of an Object for a given
     * timestamp.
     * @param {Number} forPosition The position to compute the state for.
     * @param {Object} currentState Current state properties.
     * @param {Object} originalState: The original state properties the Object is
     * tweening from.
     * @param {Object} targetState: The destination state properties the Object
     * is tweening to.
     * @param {number} duration: The length of the tween in milliseconds.
     * @param {number} timestamp: The UNIX epoch time at which the tween began.
     * @param {Object} easing: This Object's keys must correspond to the keys in
     * targetState.
     */
    function tweenProps (forPosition, currentState, originalState, targetState,
      duration, timestamp, easing) {
      var normalizedPosition = (forPosition - timestamp) / duration;

      var prop;
      for (prop in currentState) {
        if (currentState.hasOwnProperty(prop)) {
          currentState[prop] = tweenProp(originalState[prop],
            targetState[prop], formula[easing[prop]], normalizedPosition);
        }
      }

      return currentState;
    }

    /*!
     * Tweens a single property.
     * @param {number} start The value that the tween started from.
     * @param {number} end The value that the tween should end at.
     * @param {Function} easingFunc The easing curve to apply to the tween.
     * @param {number} position The normalized position (between 0.0 and 1.0) to
     * calculate the midpoint of 'start' and 'end' against.
     * @return {number} The tweened value.
     */
    function tweenProp (start, end, easingFunc, position) {
      return start + (end - start) * easingFunc(position);
    }

    /*!
     * Applies a filter to Tweenable instance.
     * @param {Tweenable} tweenable The `Tweenable` instance to call the filter
     * upon.
     * @param {String} filterName The name of the filter to apply.
     */
    function applyFilter (tweenable, filterName) {
      var filters = Tweenable.prototype.filter;
      var args = tweenable._filterArgs;

      each(filters, function (name) {
        if (typeof filters[name][filterName] !== 'undefined') {
          filters[name][filterName].apply(tweenable, args);
        }
      });
    }

    var timeoutHandler_endTime;
    var timeoutHandler_currentTime;
    var timeoutHandler_isEnded;
    var timeoutHandler_offset;
    /*!
     * Handles the update logic for one step of a tween.
     * @param {Tweenable} tweenable
     * @param {number} timestamp
     * @param {number} duration
     * @param {Object} currentState
     * @param {Object} originalState
     * @param {Object} targetState
     * @param {Object} easing
     * @param {Function(Object, *, number)} step
     * @param {Function(Function,number)}} schedule
     */
    function timeoutHandler (tweenable, timestamp, duration, currentState,
      originalState, targetState, easing, step, schedule) {
      timeoutHandler_endTime = timestamp + duration;
      timeoutHandler_currentTime = Math.min(now(), timeoutHandler_endTime);
      timeoutHandler_isEnded =
        timeoutHandler_currentTime >= timeoutHandler_endTime;

      timeoutHandler_offset = duration - (
          timeoutHandler_endTime - timeoutHandler_currentTime);

      if (tweenable.isPlaying() && !timeoutHandler_isEnded) {
        tweenable._scheduleId = schedule(tweenable._timeoutHandler, UPDATE_TIME);

        applyFilter(tweenable, 'beforeTween');
        tweenProps(timeoutHandler_currentTime, currentState, originalState,
          targetState, duration, timestamp, easing);
        applyFilter(tweenable, 'afterTween');

        step(currentState, tweenable._attachment, timeoutHandler_offset);
      } else if (timeoutHandler_isEnded) {
        step(targetState, tweenable._attachment, timeoutHandler_offset);
        tweenable.stop(true);
      }
    }


    /*!
     * Creates a usable easing Object from either a string or another easing
     * Object.  If `easing` is an Object, then this function clones it and fills
     * in the missing properties with "linear".
     * @param {Object} fromTweenParams
     * @param {Object|string} easing
     */
    function composeEasingObject (fromTweenParams, easing) {
      var composedEasing = {};

      if (typeof easing === 'string') {
        each(fromTweenParams, function (prop) {
          composedEasing[prop] = easing;
        });
      } else {
        each(fromTweenParams, function (prop) {
          if (!composedEasing[prop]) {
            composedEasing[prop] = easing[prop] || DEFAULT_EASING;
          }
        });
      }

      return composedEasing;
    }

    /**
     * Tweenable constructor.
     * @param {Object=} opt_initialState The values that the initial tween should start at if a "from" object is not provided to Tweenable#tween.
     * @param {Object=} opt_config See Tweenable.prototype.setConfig()
     * @constructor
     */
    function Tweenable (opt_initialState, opt_config) {
      this._currentState = opt_initialState || {};
      this._configured = false;
      this._scheduleFunction = DEFAULT_SCHEDULE_FUNCTION;

      // To prevent unnecessary calls to setConfig do not set default configuration here.
      // Only set default configuration immediately before tweening if none has been set.
      if (typeof opt_config !== 'undefined') {
        this.setConfig(opt_config);
      }
    }

    /**
     * Configure and start a tween.
     * @param {Object=} opt_config See Tweenable.prototype.setConfig()
     * @return {Tweenable}
     */
    Tweenable.prototype.tween = function (opt_config) {
      if (this._isTweening) {
        return this;
      }

      // Only set default config if no configuration has been set previously and none is provided now.
      if (opt_config !== undefined || !this._configured) {
        this.setConfig(opt_config);
      }

      this._timestamp = now();
      this._start(this.get(), this._attachment);
      return this.resume();
    };

    /**
     * Sets the tween configuration. `config` may have the following options:
     *
     * - __from__ (_Object=_): Starting position.  If omitted, the current state is used.
     * - __to__ (_Object=_): Ending position.
     * - __duration__ (_number=_): How many milliseconds to animate for.
     * - __start__ (_Function(Object)_): Function to execute when the tween begins.  Receives the state of the tween as the first parameter. Attachment is the second parameter.
     * - __step__ (_Function(Object, *, number)_): Function to execute on every tick.  Receives the state of the tween as the first parameter. Attachment is the second parameter, and the time elapsed since the start of the tween is the third parameter. This function is not called on the final step of the animation, but `finish` is.
     * - __finish__ (_Function(Object, *)_): Function to execute upon tween completion.  Receives the state of the tween as the first parameter. Attachment is the second parameter.
     * - __easing__ (_Object|string=_): Easing curve name(s) to use for the tween.
     * - __attachment__ (_Object|string|any=_): Value that is attached to this instance and passed on to the step/start/finish methods.
     * @param {Object} config
     * @return {Tweenable}
     */
    Tweenable.prototype.setConfig = function (config) {
      config = config || {};
      this._configured = true;

      // Attach something to this Tweenable instance (e.g.: a DOM element, an object, a string, etc.);
      this._attachment = config.attachment;

      // Init the internal state
      this._pausedAtTime = null;
      this._scheduleId = null;
      this._start = config.start || noop;
      this._step = config.step || noop;
      this._finish = config.finish || noop;
      this._duration = config.duration || DEFAULT_DURATION;
      this._currentState = config.from || this.get();
      this._originalState = this.get();
      this._targetState = config.to || this.get();

      // Aliases used below
      var currentState = this._currentState;
      var targetState = this._targetState;

      // Ensure that there is always something to tween to.
      defaults(targetState, currentState);

      this._easing = composeEasingObject(
        currentState, config.easing || DEFAULT_EASING);

      this._filterArgs =
        [currentState, this._originalState, targetState, this._easing];

      applyFilter(this, 'tweenCreated');
      return this;
    };

    /**
     * Gets the current state.
     * @return {Object}
     */
    Tweenable.prototype.get = function () {
      return shallowCopy({}, this._currentState);
    };

    /**
     * Sets the current state.
     * @param {Object} state
     */
    Tweenable.prototype.set = function (state) {
      this._currentState = state;
    };

    /**
     * Pauses a tween.  Paused tweens can be resumed from the point at which they were paused.  This is different than [`stop()`](#stop), as that method causes a tween to start over when it is resumed.
     * @return {Tweenable}
     */
    Tweenable.prototype.pause = function () {
      this._pausedAtTime = now();
      this._isPaused = true;
      return this;
    };

    /**
     * Resumes a paused tween.
     * @return {Tweenable}
     */
    Tweenable.prototype.resume = function () {
      if (this._isPaused) {
        this._timestamp += now() - this._pausedAtTime;
      }

      this._isPaused = false;
      this._isTweening = true;

      var self = this;
      this._timeoutHandler = function () {
        timeoutHandler(self, self._timestamp, self._duration, self._currentState,
          self._originalState, self._targetState, self._easing, self._step,
          self._scheduleFunction);
      };

      this._timeoutHandler();

      return this;
    };

    /**
     * Move the state of the animation to a specific point in the tween's timeline.
     * If the animation is not running, this will cause the `step` handlers to be
     * called.
     * @param {millisecond} millisecond The millisecond of the animation to seek to.
     * @return {Tweenable}
     */
    Tweenable.prototype.seek = function (millisecond) {
      this._timestamp = now() - millisecond;

      if (!this.isPlaying()) {
        this._isTweening = true;
        this._isPaused = false;

        // If the animation is not running, call timeoutHandler to make sure that
        // any step handlers are run.
        timeoutHandler(this, this._timestamp, this._duration, this._currentState,
          this._originalState, this._targetState, this._easing, this._step,
          this._scheduleFunction);

        this._timeoutHandler();
        this.pause();
      }

      return this;
    };

    /**
     * Stops and cancels a tween.
     * @param {boolean=} gotoEnd If false or omitted, the tween just stops at its current state, and the "finish" handler is not invoked.  If true, the tweened object's values are instantly set to the target values, and "finish" is invoked.
     * @return {Tweenable}
     */
    Tweenable.prototype.stop = function (gotoEnd) {
      this._isTweening = false;
      this._isPaused = false;
      this._timeoutHandler = noop;

      (root.cancelAnimationFrame            ||
        root.webkitCancelAnimationFrame     ||
        root.oCancelAnimationFrame          ||
        root.msCancelAnimationFrame         ||
        root.mozCancelRequestAnimationFrame ||
        root.clearTimeout)(this._scheduleId);

      if (gotoEnd) {
        shallowCopy(this._currentState, this._targetState);
        applyFilter(this, 'afterTweenEnd');
        this._finish.call(this, this._currentState, this._attachment);
      }

      return this;
    };

    /**
     * Returns whether or not a tween is running.
     * @return {boolean}
     */
    Tweenable.prototype.isPlaying = function () {
      return this._isTweening && !this._isPaused;
    };

    /**
     * Sets a custom schedule function.
     *
     * If a custom function is not set the default one is used [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame) if available, otherwise [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/Window.setTimeout)).
     *
     * @param {Function(Function,number)} scheduleFunction The function to be called to schedule the next frame to be rendered
     */
    Tweenable.prototype.setScheduleFunction = function (scheduleFunction) {
      this._scheduleFunction = scheduleFunction;
    };

    /**
     * `delete`s all "own" properties.  Call this when the `Tweenable` instance is no longer needed to free memory.
     */
    Tweenable.prototype.dispose = function () {
      var prop;
      for (prop in this) {
        if (this.hasOwnProperty(prop)) {
          delete this[prop];
        }
      }
    };

    /*!
     * Filters are used for transforming the properties of a tween at various
     * points in a Tweenable's life cycle.  See the README for more info on this.
     */
    Tweenable.prototype.filter = {};

    /*!
     * This object contains all of the tweens available to Shifty.  It is extendible - simply attach properties to the Tweenable.prototype.formula Object following the same format at linear.
     *
     * `pos` should be a normalized `number` (between 0 and 1).
     */
    Tweenable.prototype.formula = {
      linear: function (pos) {
        return pos;
      }
    };

    formula = Tweenable.prototype.formula;

    shallowCopy(Tweenable, {
      'now': now
      ,'each': each
      ,'tweenProps': tweenProps
      ,'tweenProp': tweenProp
      ,'applyFilter': applyFilter
      ,'shallowCopy': shallowCopy
      ,'defaults': defaults
      ,'composeEasingObject': composeEasingObject
    });

    root.Tweenable = Tweenable;
    return Tweenable;

  } ());

  /*!
   * All equations are adapted from Thomas Fuchs' [Scripty2](https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/penner.js).
   *
   * Based on Easing Equations (c) 2003 [Robert Penner](http://www.robertpenner.com/), all rights reserved. This work is [subject to terms](http://www.robertpenner.com/easing_terms_of_use.html).
   */

  /*!
   *  TERMS OF USE - EASING EQUATIONS
   *  Open source under the BSD License.
   *  Easing Equations (c) 2003 Robert Penner, all rights reserved.
   */

  ;(function () {

    Tweenable.shallowCopy(Tweenable.prototype.formula, {
      easeInQuad: function (pos) {
        return Math.pow(pos, 2);
      },

      easeOutQuad: function (pos) {
        return -(Math.pow((pos - 1), 2) - 1);
      },

      easeInOutQuad: function (pos) {
        if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,2);}
        return -0.5 * ((pos -= 2) * pos - 2);
      },

      easeInCubic: function (pos) {
        return Math.pow(pos, 3);
      },

      easeOutCubic: function (pos) {
        return (Math.pow((pos - 1), 3) + 1);
      },

      easeInOutCubic: function (pos) {
        if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,3);}
        return 0.5 * (Math.pow((pos - 2),3) + 2);
      },

      easeInQuart: function (pos) {
        return Math.pow(pos, 4);
      },

      easeOutQuart: function (pos) {
        return -(Math.pow((pos - 1), 4) - 1);
      },

      easeInOutQuart: function (pos) {
        if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,4);}
        return -0.5 * ((pos -= 2) * Math.pow(pos,3) - 2);
      },

      easeInQuint: function (pos) {
        return Math.pow(pos, 5);
      },

      easeOutQuint: function (pos) {
        return (Math.pow((pos - 1), 5) + 1);
      },

      easeInOutQuint: function (pos) {
        if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,5);}
        return 0.5 * (Math.pow((pos - 2),5) + 2);
      },

      easeInSine: function (pos) {
        return -Math.cos(pos * (Math.PI / 2)) + 1;
      },

      easeOutSine: function (pos) {
        return Math.sin(pos * (Math.PI / 2));
      },

      easeInOutSine: function (pos) {
        return (-0.5 * (Math.cos(Math.PI * pos) - 1));
      },

      easeInExpo: function (pos) {
        return (pos === 0) ? 0 : Math.pow(2, 10 * (pos - 1));
      },

      easeOutExpo: function (pos) {
        return (pos === 1) ? 1 : -Math.pow(2, -10 * pos) + 1;
      },

      easeInOutExpo: function (pos) {
        if (pos === 0) {return 0;}
        if (pos === 1) {return 1;}
        if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(2,10 * (pos - 1));}
        return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
      },

      easeInCirc: function (pos) {
        return -(Math.sqrt(1 - (pos * pos)) - 1);
      },

      easeOutCirc: function (pos) {
        return Math.sqrt(1 - Math.pow((pos - 1), 2));
      },

      easeInOutCirc: function (pos) {
        if ((pos /= 0.5) < 1) {return -0.5 * (Math.sqrt(1 - pos * pos) - 1);}
        return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
      },

      easeOutBounce: function (pos) {
        if ((pos) < (1 / 2.75)) {
          return (7.5625 * pos * pos);
        } else if (pos < (2 / 2.75)) {
          return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
        } else if (pos < (2.5 / 2.75)) {
          return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
        } else {
          return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
        }
      },

      easeInBack: function (pos) {
        var s = 1.70158;
        return (pos) * pos * ((s + 1) * pos - s);
      },

      easeOutBack: function (pos) {
        var s = 1.70158;
        return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
      },

      easeInOutBack: function (pos) {
        var s = 1.70158;
        if ((pos /= 0.5) < 1) {return 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s));}
        return 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
      },

      elastic: function (pos) {
        return -1 * Math.pow(4,-8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
      },

      swingFromTo: function (pos) {
        var s = 1.70158;
        return ((pos /= 0.5) < 1) ? 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s)) :
            0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
      },

      swingFrom: function (pos) {
        var s = 1.70158;
        return pos * pos * ((s + 1) * pos - s);
      },

      swingTo: function (pos) {
        var s = 1.70158;
        return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
      },

      bounce: function (pos) {
        if (pos < (1 / 2.75)) {
          return (7.5625 * pos * pos);
        } else if (pos < (2 / 2.75)) {
          return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
        } else if (pos < (2.5 / 2.75)) {
          return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
        } else {
          return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
        }
      },

      bouncePast: function (pos) {
        if (pos < (1 / 2.75)) {
          return (7.5625 * pos * pos);
        } else if (pos < (2 / 2.75)) {
          return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
        } else if (pos < (2.5 / 2.75)) {
          return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
        } else {
          return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
        }
      },

      easeFromTo: function (pos) {
        if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,4);}
        return -0.5 * ((pos -= 2) * Math.pow(pos,3) - 2);
      },

      easeFrom: function (pos) {
        return Math.pow(pos,4);
      },

      easeTo: function (pos) {
        return Math.pow(pos,0.25);
      }
    });

  }());

  /*!
   * The Bezier magic in this file is adapted/copied almost wholesale from
   * [Scripty2](https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/cubic-bezier.js),
   * which was adapted from Apple code (which probably came from
   * [here](http://opensource.apple.com/source/WebCore/WebCore-955.66/platform/graphics/UnitBezier.h)).
   * Special thanks to Apple and Thomas Fuchs for much of this code.
   */

  /*!
   *  Copyright (c) 2006 Apple Computer, Inc. All rights reserved.
   *
   *  Redistribution and use in source and binary forms, with or without
   *  modification, are permitted provided that the following conditions are met:
   *
   *  1. Redistributions of source code must retain the above copyright notice,
   *  this list of conditions and the following disclaimer.
   *
   *  2. Redistributions in binary form must reproduce the above copyright notice,
   *  this list of conditions and the following disclaimer in the documentation
   *  and/or other materials provided with the distribution.
   *
   *  3. Neither the name of the copyright holder(s) nor the names of any
   *  contributors may be used to endorse or promote products derived from
   *  this software without specific prior written permission.
   *
   *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   *  "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
   *  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   *  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
   *  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   *  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
   *  ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   *  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  ;(function () {
    // port of webkit cubic bezier handling by http://www.netzgesta.de/dev/
    function cubicBezierAtTime(t,p1x,p1y,p2x,p2y,duration) {
      var ax = 0,bx = 0,cx = 0,ay = 0,by = 0,cy = 0;
      function sampleCurveX(t) {return ((ax * t + bx) * t + cx) * t;}
      function sampleCurveY(t) {return ((ay * t + by) * t + cy) * t;}
      function sampleCurveDerivativeX(t) {return (3.0 * ax * t + 2.0 * bx) * t + cx;}
      function solveEpsilon(duration) {return 1.0 / (200.0 * duration);}
      function solve(x,epsilon) {return sampleCurveY(solveCurveX(x,epsilon));}
      function fabs(n) {if (n >= 0) {return n;}else {return 0 - n;}}
      function solveCurveX(x,epsilon) {
        var t0,t1,t2,x2,d2,i;
        for (t2 = x, i = 0; i < 8; i++) {x2 = sampleCurveX(t2) - x; if (fabs(x2) < epsilon) {return t2;} d2 = sampleCurveDerivativeX(t2); if (fabs(d2) < 1e-6) {break;} t2 = t2 - x2 / d2;}
        t0 = 0.0; t1 = 1.0; t2 = x; if (t2 < t0) {return t0;} if (t2 > t1) {return t1;}
        while (t0 < t1) {x2 = sampleCurveX(t2); if (fabs(x2 - x) < epsilon) {return t2;} if (x > x2) {t0 = t2;}else {t1 = t2;} t2 = (t1 - t0) * 0.5 + t0;}
        return t2; // Failure.
      }
      cx = 3.0 * p1x; bx = 3.0 * (p2x - p1x) - cx; ax = 1.0 - cx - bx; cy = 3.0 * p1y; by = 3.0 * (p2y - p1y) - cy; ay = 1.0 - cy - by;
      return solve(t, solveEpsilon(duration));
    }
    /*!
     *  getCubicBezierTransition(x1, y1, x2, y2) -> Function
     *
     *  Generates a transition easing function that is compatible
     *  with WebKit's CSS transitions `-webkit-transition-timing-function`
     *  CSS property.
     *
     *  The W3C has more information about
     *  <a href="http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag">
     *  CSS3 transition timing functions</a>.
     *
     *  @param {number} x1
     *  @param {number} y1
     *  @param {number} x2
     *  @param {number} y2
     *  @return {function}
     */
    function getCubicBezierTransition (x1, y1, x2, y2) {
      return function (pos) {
        return cubicBezierAtTime(pos,x1,y1,x2,y2,1);
      };
    }
    // End ported code

    /**
     * Creates a Bezier easing function and attaches it to `Tweenable.prototype.formula`.  This function gives you total control over the easing curve.  Matthew Lein's [Ceaser](http://matthewlein.com/ceaser/) is a useful tool for visualizing the curves you can make with this function.
     *
     * @param {string} name The name of the easing curve.  Overwrites the old easing function on Tweenable.prototype.formula if it exists.
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @return {function} The easing function that was attached to Tweenable.prototype.formula.
     */
    Tweenable.setBezierFunction = function (name, x1, y1, x2, y2) {
      var cubicBezierTransition = getCubicBezierTransition(x1, y1, x2, y2);
      cubicBezierTransition.x1 = x1;
      cubicBezierTransition.y1 = y1;
      cubicBezierTransition.x2 = x2;
      cubicBezierTransition.y2 = y2;

      return Tweenable.prototype.formula[name] = cubicBezierTransition;
    };


    /**
     * `delete`s an easing function from `Tweenable.prototype.formula`.  Be careful with this method, as it `delete`s whatever easing formula matches `name` (which means you can delete default Shifty easing functions).
     *
     * @param {string} name The name of the easing function to delete.
     * @return {function}
     */
    Tweenable.unsetBezierFunction = function (name) {
      delete Tweenable.prototype.formula[name];
    };

  })();

  ;(function () {

    function getInterpolatedValues (
      from, current, targetState, position, easing) {
      return Tweenable.tweenProps(
        position, current, from, targetState, 1, 0, easing);
    }

    // Fake a Tweenable and patch some internals.  This approach allows us to
    // skip uneccessary processing and object recreation, cutting down on garbage
    // collection pauses.
    var mockTweenable = new Tweenable();
    mockTweenable._filterArgs = [];

    /**
     * Compute the midpoint of two Objects.  This method effectively calculates a specific frame of animation that [Tweenable#tween](shifty.core.js.html#tween) does many times over the course of a tween.
     *
     * Example:
     *
     *     var interpolatedValues = Tweenable.interpolate({
     *       width: '100px',
     *       opacity: 0,
     *       color: '#fff'
     *     }, {
     *       width: '200px',
     *       opacity: 1,
     *       color: '#000'
     *     }, 0.5);
     *
     *     console.log(interpolatedValues);
     *     // {opacity: 0.5, width: "150px", color: "rgb(127,127,127)"}
     *
     * @param {Object} from The starting values to tween from.
     * @param {Object} targetState The ending values to tween to.
     * @param {number} position The normalized position value (between 0.0 and 1.0) to interpolate the values between `from` and `to` for.  `from` represents 0 and `to` represents `1`.
     * @param {string|Object} easing The easing curve(s) to calculate the midpoint against.  You can reference any easing function attached to `Tweenable.prototype.formula`.  If omitted, this defaults to "linear".
     * @return {Object}
     */
    Tweenable.interpolate = function (from, targetState, position, easing) {
      var current = Tweenable.shallowCopy({}, from);
      var easingObject = Tweenable.composeEasingObject(
        from, easing || 'linear');

      mockTweenable.set({});

      // Alias and reuse the _filterArgs array instead of recreating it.
      var filterArgs = mockTweenable._filterArgs;
      filterArgs.length = 0;
      filterArgs[0] = current;
      filterArgs[1] = from;
      filterArgs[2] = targetState;
      filterArgs[3] = easingObject;

      // Any defined value transformation must be applied
      Tweenable.applyFilter(mockTweenable, 'tweenCreated');
      Tweenable.applyFilter(mockTweenable, 'beforeTween');

      var interpolatedValues = getInterpolatedValues(
        from, current, targetState, position, easingObject);

      // Transform values back into their original format
      Tweenable.applyFilter(mockTweenable, 'afterTween');

      return interpolatedValues;
    };

  }());

  /**
   * Adds string interpolation support to Shifty.
   *
   * The Token extension allows Shifty to tween numbers inside of strings.  Among
   * other things, this allows you to animate CSS properties.  For example, you
   * can do this:
   *
   *     var tweenable = new Tweenable();
   *     tweenable.tween({
   *       from: { transform: 'translateX(45px)'},
   *       to: { transform: 'translateX(90xp)'}
   *     });
   *
   * ` `
   * `translateX(45)` will be tweened to `translateX(90)`.  To demonstrate:
   *
   *     var tweenable = new Tweenable();
   *     tweenable.tween({
   *       from: { transform: 'translateX(45px)'},
   *       to: { transform: 'translateX(90px)'},
   *       step: function (state) {
   *         console.log(state.transform);
   *       }
   *     });
   *
   * ` `
   * The above snippet will log something like this in the console:
   *
   *     translateX(60.3px)
   *     ...
   *     translateX(76.05px)
   *     ...
   *     translateX(90px)
   *
   * ` `
   * Another use for this is animating colors:
   *
   *     var tweenable = new Tweenable();
   *     tweenable.tween({
   *       from: { color: 'rgb(0,255,0)'},
   *       to: { color: 'rgb(255,0,255)'},
   *       step: function (state) {
   *         console.log(state.color);
   *       }
   *     });
   *
   * ` `
   * The above snippet will log something like this:
   *
   *     rgb(84,170,84)
   *     ...
   *     rgb(170,84,170)
   *     ...
   *     rgb(255,0,255)
   *
   * ` `
   * This extension also supports hexadecimal colors, in both long (`#ff00ff`)
   * and short (`#f0f`) forms.  Be aware that hexadecimal input values will be
   * converted into the equivalent RGB output values.  This is done to optimize
   * for performance.
   *
   *     var tweenable = new Tweenable();
   *     tweenable.tween({
   *       from: { color: '#0f0'},
   *       to: { color: '#f0f'},
   *       step: function (state) {
   *         console.log(state.color);
   *       }
   *     });
   *
   * ` `
   * This snippet will generate the same output as the one before it because
   * equivalent values were supplied (just in hexadecimal form rather than RGB):
   *
   *     rgb(84,170,84)
   *     ...
   *     rgb(170,84,170)
   *     ...
   *     rgb(255,0,255)
   *
   * ` `
   * ` `
   * ## Easing support
   *
   * Easing works somewhat differently in the Token extension.  This is because
   * some CSS properties have multiple values in them, and you might need to
   * tween each value along its own easing curve.  A basic example:
   *
   *     var tweenable = new Tweenable();
   *     tweenable.tween({
   *       from: { transform: 'translateX(0px) translateY(0px)'},
   *       to: { transform:   'translateX(100px) translateY(100px)'},
   *       easing: { transform: 'easeInQuad' },
   *       step: function (state) {
   *         console.log(state.transform);
   *       }
   *     });
   *
   * ` `
   * The above snippet create values like this:
   *
   *     translateX(11.560000000000002px) translateY(11.560000000000002px)
   *     ...
   *     translateX(46.24000000000001px) translateY(46.24000000000001px)
   *     ...
   *     translateX(100px) translateY(100px)
   *
   * ` `
   * In this case, the values for `translateX` and `translateY` are always the
   * same for each step of the tween, because they have the same start and end
   * points and both use the same easing curve.  We can also tween `translateX`
   * and `translateY` along independent curves:
   *
   *     var tweenable = new Tweenable();
   *     tweenable.tween({
   *       from: { transform: 'translateX(0px) translateY(0px)'},
   *       to: { transform:   'translateX(100px) translateY(100px)'},
   *       easing: { transform: 'easeInQuad bounce' },
   *       step: function (state) {
   *         console.log(state.transform);
   *       }
   *     });
   *
   * ` `
   * The above snippet create values like this:
   *
   *     translateX(10.89px) translateY(82.355625px)
   *     ...
   *     translateX(44.89000000000001px) translateY(86.73062500000002px)
   *     ...
   *     translateX(100px) translateY(100px)
   *
   * ` `
   * `translateX` and `translateY` are not in sync anymore, because `easeInQuad`
   * was specified for `translateX` and `bounce` for `translateY`.  Mixing and
   * matching easing curves can make for some interesting motion in your
   * animations.
   *
   * The order of the space-separated easing curves correspond the token values
   * they apply to.  If there are more token values than easing curves listed,
   * the last easing curve listed is used.
   */
  function token () {
    // Functionality for this extension runs implicitly if it is loaded.
  } /*!*/

  // token function is defined above only so that dox-foundation sees it as
  // documentation and renders it.  It is never used, and is optimized away at
  // build time.

  ;(function (Tweenable) {

    /*!
     * @typedef {{
     *   formatString: string
     *   chunkNames: Array.<string>
     * }}
     */
    var formatManifest;

    // CONSTANTS

    var R_NUMBER_COMPONENT = /(\d|\-|\.)/;
    var R_FORMAT_CHUNKS = /([^\-0-9\.]+)/g;
    var R_UNFORMATTED_VALUES = /[0-9.\-]+/g;
    var R_RGB = new RegExp(
      'rgb\\(' + R_UNFORMATTED_VALUES.source +
      (/,\s*/.source) + R_UNFORMATTED_VALUES.source +
      (/,\s*/.source) + R_UNFORMATTED_VALUES.source + '\\)', 'g');
    var R_RGB_PREFIX = /^.*\(/;
    var R_HEX = /#([0-9]|[a-f]){3,6}/gi;
    var VALUE_PLACEHOLDER = 'VAL';

    // HELPERS

    var getFormatChunksFrom_accumulator = [];
    /*!
     * @param {Array.number} rawValues
     * @param {string} prefix
     *
     * @return {Array.<string>}
     */
    function getFormatChunksFrom (rawValues, prefix) {
      getFormatChunksFrom_accumulator.length = 0;

      var rawValuesLength = rawValues.length;
      var i;

      for (i = 0; i < rawValuesLength; i++) {
        getFormatChunksFrom_accumulator.push('_' + prefix + '_' + i);
      }

      return getFormatChunksFrom_accumulator;
    }

    /*!
     * @param {string} formattedString
     *
     * @return {string}
     */
    function getFormatStringFrom (formattedString) {
      var chunks = formattedString.match(R_FORMAT_CHUNKS);

      if (!chunks) {
        // chunks will be null if there were no tokens to parse in
        // formattedString (for example, if formattedString is '2').  Coerce
        // chunks to be useful here.
        chunks = ['', ''];

        // If there is only one chunk, assume that the string is a number
        // followed by a token...
        // NOTE: This may be an unwise assumption.
      } else if (chunks.length === 1 ||
          // ...or if the string starts with a number component (".", "-", or a
          // digit)...
          formattedString[0].match(R_NUMBER_COMPONENT)) {
        // ...prepend an empty string here to make sure that the formatted number
        // is properly replaced by VALUE_PLACEHOLDER
        chunks.unshift('');
      }

      return chunks.join(VALUE_PLACEHOLDER);
    }

    /*!
     * Convert all hex color values within a string to an rgb string.
     *
     * @param {Object} stateObject
     *
     * @return {Object} The modified obj
     */
    function sanitizeObjectForHexProps (stateObject) {
      Tweenable.each(stateObject, function (prop) {
        var currentProp = stateObject[prop];

        if (typeof currentProp === 'string' && currentProp.match(R_HEX)) {
          stateObject[prop] = sanitizeHexChunksToRGB(currentProp);
        }
      });
    }

    /*!
     * @param {string} str
     *
     * @return {string}
     */
    function  sanitizeHexChunksToRGB (str) {
      return filterStringChunks(R_HEX, str, convertHexToRGB);
    }

    /*!
     * @param {string} hexString
     *
     * @return {string}
     */
    function convertHexToRGB (hexString) {
      var rgbArr = hexToRGBArray(hexString);
      return 'rgb(' + rgbArr[0] + ',' + rgbArr[1] + ',' + rgbArr[2] + ')';
    }

    var hexToRGBArray_returnArray = [];
    /*!
     * Convert a hexadecimal string to an array with three items, one each for
     * the red, blue, and green decimal values.
     *
     * @param {string} hex A hexadecimal string.
     *
     * @returns {Array.<number>} The converted Array of RGB values if `hex` is a
     * valid string, or an Array of three 0's.
     */
    function hexToRGBArray (hex) {

      hex = hex.replace(/#/, '');

      // If the string is a shorthand three digit hex notation, normalize it to
      // the standard six digit notation
      if (hex.length === 3) {
        hex = hex.split('');
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }

      hexToRGBArray_returnArray[0] = hexToDec(hex.substr(0, 2));
      hexToRGBArray_returnArray[1] = hexToDec(hex.substr(2, 2));
      hexToRGBArray_returnArray[2] = hexToDec(hex.substr(4, 2));

      return hexToRGBArray_returnArray;
    }

    /*!
     * Convert a base-16 number to base-10.
     *
     * @param {Number|String} hex The value to convert
     *
     * @returns {Number} The base-10 equivalent of `hex`.
     */
    function hexToDec (hex) {
      return parseInt(hex, 16);
    }

    /*!
     * Runs a filter operation on all chunks of a string that match a RegExp
     *
     * @param {RegExp} pattern
     * @param {string} unfilteredString
     * @param {function(string)} filter
     *
     * @return {string}
     */
    function filterStringChunks (pattern, unfilteredString, filter) {
      var pattenMatches = unfilteredString.match(pattern);
      var filteredString = unfilteredString.replace(pattern, VALUE_PLACEHOLDER);

      if (pattenMatches) {
        var pattenMatchesLength = pattenMatches.length;
        var currentChunk;

        for (var i = 0; i < pattenMatchesLength; i++) {
          currentChunk = pattenMatches.shift();
          filteredString = filteredString.replace(
            VALUE_PLACEHOLDER, filter(currentChunk));
        }
      }

      return filteredString;
    }

    /*!
     * Check for floating point values within rgb strings and rounds them.
     *
     * @param {string} formattedString
     *
     * @return {string}
     */
    function sanitizeRGBChunks (formattedString) {
      return filterStringChunks(R_RGB, formattedString, sanitizeRGBChunk);
    }

    /*!
     * @param {string} rgbChunk
     *
     * @return {string}
     */
    function sanitizeRGBChunk (rgbChunk) {
      var numbers = rgbChunk.match(R_UNFORMATTED_VALUES);
      var numbersLength = numbers.length;
      var sanitizedString = rgbChunk.match(R_RGB_PREFIX)[0];

      for (var i = 0; i < numbersLength; i++) {
        sanitizedString += parseInt(numbers[i], 10) + ',';
      }

      sanitizedString = sanitizedString.slice(0, -1) + ')';

      return sanitizedString;
    }

    /*!
     * @param {Object} stateObject
     *
     * @return {Object} An Object of formatManifests that correspond to
     * the string properties of stateObject
     */
    function getFormatManifests (stateObject) {
      var manifestAccumulator = {};

      Tweenable.each(stateObject, function (prop) {
        var currentProp = stateObject[prop];

        if (typeof currentProp === 'string') {
          var rawValues = getValuesFrom(currentProp);

          manifestAccumulator[prop] = {
            'formatString': getFormatStringFrom(currentProp)
            ,'chunkNames': getFormatChunksFrom(rawValues, prop)
          };
        }
      });

      return manifestAccumulator;
    }

    /*!
     * @param {Object} stateObject
     * @param {Object} formatManifests
     */
    function expandFormattedProperties (stateObject, formatManifests) {
      Tweenable.each(formatManifests, function (prop) {
        var currentProp = stateObject[prop];
        var rawValues = getValuesFrom(currentProp);
        var rawValuesLength = rawValues.length;

        for (var i = 0; i < rawValuesLength; i++) {
          stateObject[formatManifests[prop].chunkNames[i]] = +rawValues[i];
        }

        delete stateObject[prop];
      });
    }

    /*!
     * @param {Object} stateObject
     * @param {Object} formatManifests
     */
    function collapseFormattedProperties (stateObject, formatManifests) {
      Tweenable.each(formatManifests, function (prop) {
        var currentProp = stateObject[prop];
        var formatChunks = extractPropertyChunks(
          stateObject, formatManifests[prop].chunkNames);
        var valuesList = getValuesList(
          formatChunks, formatManifests[prop].chunkNames);
        currentProp = getFormattedValues(
          formatManifests[prop].formatString, valuesList);
        stateObject[prop] = sanitizeRGBChunks(currentProp);
      });
    }

    /*!
     * @param {Object} stateObject
     * @param {Array.<string>} chunkNames
     *
     * @return {Object} The extracted value chunks.
     */
    function extractPropertyChunks (stateObject, chunkNames) {
      var extractedValues = {};
      var currentChunkName, chunkNamesLength = chunkNames.length;

      for (var i = 0; i < chunkNamesLength; i++) {
        currentChunkName = chunkNames[i];
        extractedValues[currentChunkName] = stateObject[currentChunkName];
        delete stateObject[currentChunkName];
      }

      return extractedValues;
    }

    var getValuesList_accumulator = [];
    /*!
     * @param {Object} stateObject
     * @param {Array.<string>} chunkNames
     *
     * @return {Array.<number>}
     */
    function getValuesList (stateObject, chunkNames) {
      getValuesList_accumulator.length = 0;
      var chunkNamesLength = chunkNames.length;

      for (var i = 0; i < chunkNamesLength; i++) {
        getValuesList_accumulator.push(stateObject[chunkNames[i]]);
      }

      return getValuesList_accumulator;
    }

    /*!
     * @param {string} formatString
     * @param {Array.<number>} rawValues
     *
     * @return {string}
     */
    function getFormattedValues (formatString, rawValues) {
      var formattedValueString = formatString;
      var rawValuesLength = rawValues.length;

      for (var i = 0; i < rawValuesLength; i++) {
        formattedValueString = formattedValueString.replace(
          VALUE_PLACEHOLDER, +rawValues[i].toFixed(4));
      }

      return formattedValueString;
    }

    /*!
     * Note: It's the duty of the caller to convert the Array elements of the
     * return value into numbers.  This is a performance optimization.
     *
     * @param {string} formattedString
     *
     * @return {Array.<string>|null}
     */
    function getValuesFrom (formattedString) {
      return formattedString.match(R_UNFORMATTED_VALUES);
    }

    /*!
     * @param {Object} easingObject
     * @param {Object} tokenData
     */
    function expandEasingObject (easingObject, tokenData) {
      Tweenable.each(tokenData, function (prop) {
        var currentProp = tokenData[prop];
        var chunkNames = currentProp.chunkNames;
        var chunkLength = chunkNames.length;
        var easingChunks = easingObject[prop].split(' ');
        var lastEasingChunk = easingChunks[easingChunks.length - 1];

        for (var i = 0; i < chunkLength; i++) {
          easingObject[chunkNames[i]] = easingChunks[i] || lastEasingChunk;
        }

        delete easingObject[prop];
      });
    }

    /*!
     * @param {Object} easingObject
     * @param {Object} tokenData
     */
    function collapseEasingObject (easingObject, tokenData) {
      Tweenable.each(tokenData, function (prop) {
        var currentProp = tokenData[prop];
        var chunkNames = currentProp.chunkNames;
        var chunkLength = chunkNames.length;
        var composedEasingString = '';

        for (var i = 0; i < chunkLength; i++) {
          composedEasingString += ' ' + easingObject[chunkNames[i]];
          delete easingObject[chunkNames[i]];
        }

        easingObject[prop] = composedEasingString.substr(1);
      });
    }

    Tweenable.prototype.filter.token = {
      'tweenCreated': function (currentState, fromState, toState, easingObject) {
        sanitizeObjectForHexProps(currentState);
        sanitizeObjectForHexProps(fromState);
        sanitizeObjectForHexProps(toState);
        this._tokenData = getFormatManifests(currentState);
      },

      'beforeTween': function (currentState, fromState, toState, easingObject) {
        expandEasingObject(easingObject, this._tokenData);
        expandFormattedProperties(currentState, this._tokenData);
        expandFormattedProperties(fromState, this._tokenData);
        expandFormattedProperties(toState, this._tokenData);
      },

      'afterTween': function (currentState, fromState, toState, easingObject) {
        collapseFormattedProperties(currentState, this._tokenData);
        collapseFormattedProperties(fromState, this._tokenData);
        collapseFormattedProperties(toState, this._tokenData);
        collapseEasingObject(easingObject, this._tokenData);
      }
    };

  } (Tweenable));

  }(window));

  return window.Tweenable;
});

(function() {
    "use strict";

    angular.module('angular-carousel')

    .filter('carouselSlice', function() {
        return function(collection, start, size) {
            if (angular.isArray(collection)) {
                return collection.slice(start, start + size);
            } else if (angular.isObject(collection)) {
                // dont try to slice collections :)
                return collection;
            }
        };
    });

})();

angular.module('ualib.news.templates', ['news-item/event-card.tpl.html', 'news-item/news-card.tpl.html', 'news-item/news-item.tpl.html', 'news/news-list.tpl.html', 'today/news-today.tpl.html']);

angular.module("news-item/event-card.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("news-item/event-card.tpl.html",
    "<a ng-href=\"{{newsCard.link}}\" target=\"_new\" class=\"media news-card\">\n" +
    "    <div class=\"media-left\">\n" +
    "        <div class=\"cal-icon\">\n" +
    "            <div class=\"cal-month\">{{newsCard.activeFrom | date:'MMM'}}</div>\n" +
    "            <div class=\"cal-day\">{{newsCard.activeFrom | date:'d'}}</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"media-body\">\n" +
    "        <h4 class=\"media-heading\" ng-bind-html=\"newsCard.title | truncate:50:'...':true\"></h4>\n" +
    "        <p ng-bind-html=\"newsCard.blurb | truncate:150:'...':true\"></p>\n" +
    "    </div>\n" +
    "</a>");
}]);

angular.module("news-item/news-card.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("news-item/news-card.tpl.html",
    "<a ng-href=\"#/news-exhibits/{{newsCard.link}}\" class=\"media news-card\">\n" +
    "    <div class=\"media-body\">\n" +
    "        <h4 class=\"media-heading\">\n" +
    "            <span ng-bind-html=\"newsCard.title | truncate:50:'...':true\"></span>\n" +
    "        </h4>\n" +
    "        <div class=\"details-context\" ng-if=\"(newsCard.activeFrom != newsCard.activeUntil && newsCard.type != 0)\">\n" +
    "            {{newsCard.activeFrom | date:mediumDate}} - {{newsCard.activeUntil | date:mediumDate}}\n" +
    "        </div>\n" +
    "        <div class=\"details-context\" ng-if=\"(newsCard.type == 0)\">\n" +
    "            {{newsCard.created | date:mediumDate}}\n" +
    "        </div>\n" +
    "        <p ng-bind-html=\"newsCard.blurb | truncate:150:'...':true\"></p>\n" +
    "    </div>\n" +
    "</a>");
}]);

angular.module("news-item/news-item.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("news-item/news-item.tpl.html",
    "<div class=\"jumbotron-header\">\n" +
    "    <div class=\"jumbotron\">\n" +
    "        <div class=\"container\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-sm-12\">\n" +
    "                    <ol class=\"breadcrumb\" typeof=\"BreadcrumbList\" vocab=\"http://schema.org/\">\n" +
    "                        <li><a title=\"Go to The University of Alabama Libraries.\" href=\"/#/home\" class=\"home\">The University of Alabama Libraries</a></li>\n" +
    "                        <li><a title=\"Go to News.\" href=\"/#/news-exhibits\" class=\"post post-page\">News</a></li>\n" +
    "                        <li><a title=\"Go to news article.\" href=\"\" class=\"post post-page\">{{newsItem.title | truncate: 30: '...': true}}</a></li>\n" +
    "                    </ol>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-sm-7\">\n" +
    "                    <h1>News &amp; Exhibits</h1>\n" +
    "                </div>\n" +
    "                <div class=\"col-sm-5\">\n" +
    "                    <div class=\"well\">\n" +
    "                        <p class=\"lead\">Looking for upcoming events in the University Libraries?</p>\n" +
    "                        <a href=\"http://events.ua.edu/category/22/\" class=\"btn btn-primary\" target=\"_new\">View event calendar <span class=\"fa fa-external-link\"></span></a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <div class=\"page-header\">\n" +
    "        <h2>{{newsItem.title}}</h2>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-4 col-md-push-8\">\n" +
    "            <div class=\"well\" ng-if=\"newsItem.contactName\">\n" +
    "                <h4>For more information contact</h4>\n" +
    "                <ul class=\"fa-ul\">\n" +
    "                    <li><span class=\"fa fa-user fa-li\"></span>{{newsItem.contactName}}</li>\n" +
    "                    <li><span class=\"fa fa-phone fa-li\"></span>{{newsItem.contactPhone}}</li>\n" +
    "                    <li><span class=\"fa fa-envelope fa-li\"></span>{{newsItem.contactEmail}}</li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <a href=\"#/news-exhibits\" class=\"btn btn-default\"><span class=\"fa fa-reply\"></span> See all news &amp; exhibits</a>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-8 col-md-pull-4\">\n" +
    "            <div class=\"text-center news-carousel-container-small\" ng-if=\"newsItem.images.length > 0\">\n" +
    "                <ul rn-carousel rn-carousel-auto-slide rn-carousel-buffered\n" +
    "                    rn-carousel-index=\"curImage\" rn-carousel-locked=\"isLocked\"\n" +
    "                    class=\"image news-carousel-small\">\n" +
    "                    <li ng-repeat=\"img in newsItem.images track by $index\">\n" +
    "                        <div class=\"layer text-center\">\n" +
    "                            <div class=\"news-carousel-image-small\"\n" +
    "                                 ng-style=\"{'background-image':img.styles}\"\n" +
    "                                 ng-class=\"{portrait: img.isPortrait}\"\n" +
    "                                 ng-click=\"enlargeImages(true, $index)\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "                <div rn-carousel-indicators ng-if=\"newsItem.images.length > 1\" slides=\"newsItem.images\" rn-carousel-index=\"curImage\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <h5 class=\"text-muted\">\n" +
    "                <span>Created on {{newsItem.created | date:mediumDate}}</span>\n" +
    "            </h5>\n" +
    "            <p class=\"text-justify\" ng-bind-html=\"newsItem.description\"></p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ng-show=\"showEnlarged\">\n" +
    "        <div class=\"carousel-lg\" ng-click=\"enlargeImages(false)\">\n" +
    "            <button type=\"button\" class=\"close\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "            <ul rn-carousel rn-carousel-controls rn-carousel-index=\"curEnlImage\" class=\"image\">\n" +
    "                <li ng-repeat=\"img in newsItem.images\">\n" +
    "                    <div class=\"layer\"><img class=\"fullsize-img\" ng-src=\"{{img.src}}\" ng-click=\"nextSlide()\"/></div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <div class=\"text-center\" rn-carousel-indicators ng-if=\"newsItem.images.length > 1\" slides=\"newsItem.images\" rn-carousel-index=\"curEnlImage\"></div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <!--<div class=\"news-carousel-container-large\">-->\n" +
    "        <!--<ul rn-carousel rn-carousel-controls rn-carousel-buffered-->\n" +
    "        <!--rn-carousel-index=\"curEnlImage\" rn-carousel-transition=\"none\"-->\n" +
    "        <!--class=\"image news-carousel-large\" rn-carousel-controls-allow-loop>-->\n" +
    "        <!--<li ng-repeat=\"img in newsItem.images\">-->\n" +
    "        <!--<div class=\"layer text-center\">-->\n" +
    "        <!--<div class=\"news-carousel-image-large\"-->\n" +
    "        <!--ng-style=\"{'background-image':'url('+img+')'}\" ng-click=\"setCurEnlImage($event, $index)\">-->\n" +
    "        <!--</div>-->\n" +
    "        <!--</div>-->\n" +
    "        <!--</li>-->\n" +
    "        <!--</ul>-->\n" +
    "        <!--<div rn-carousel-indicators ng-if=\"newsItem.images.length > 1\" slides=\"newsItem.images\" rn-carousel-index=\"curEnlImage\">-->\n" +
    "        <!--&lt;!&ndash;<div class=\"news-carousel-large-indicators text-center\" ng-if=\"newsItem.images.length > 1\">&ndash;&gt;-->\n" +
    "        <!--&lt;!&ndash;<span ng-repeat=\"img in newsItem.images\" class=\"clickable-item\"&ndash;&gt;-->\n" +
    "        <!--&lt;!&ndash;ng-click=\"setCurEnlImage($event, $index)\">&ndash;&gt;-->\n" +
    "        <!--&lt;!&ndash;<span class=\"fa fa-2x fa-circle-o\" ng-class=\"{'fa-3x': $index == $parent.curEnlImage}\">&ndash;&gt;-->\n" +
    "        <!--&lt;!&ndash;</span>&ndash;&gt;-->\n" +
    "        <!--&lt;!&ndash;</span>&ndash;&gt;-->\n" +
    "        <!--&lt;!&ndash;</div>&ndash;&gt;-->\n" +
    "        <!--</div>-->\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("news/news-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("news/news-list.tpl.html",
    "<div class=\"jumbotron-header\">\n" +
    "    <div class=\"jumbotron\">\n" +
    "        <div class=\"container\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-sm-12\">\n" +
    "                    <ol class=\"breadcrumb\" typeof=\"BreadcrumbList\" vocab=\"http://schema.org/\">\n" +
    "                        <li><a title=\"Go to The University of Alabama Libraries.\" href=\"/#/home\" class=\"home\">The University of Alabama Libraries</a></li>\n" +
    "                        <li><a title=\"Go to News.\" href=\"/#/news-exhibits\" class=\"post post-page\">News</a></li>\n" +
    "                    </ol>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-sm-7\">\n" +
    "                    <h1>News &amp; Exhibits</h1>\n" +
    "                </div>\n" +
    "                <div class=\"col-sm-5\">\n" +
    "                    <div class=\"well\">\n" +
    "                        <p class=\"lead\">Looking for upcoming events in the University Libraries?</p>\n" +
    "                        <a href=\"http://events.ua.edu/category/22/\" class=\"btn btn-primary\" target=\"_new\">View event calendar <span class=\"fa fa-external-link\"></span></a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-9\">\n" +
    "\n" +
    "            <div class=\"media animate-repeat\" ng-repeat=\"item in news | filter:{type: newsFilters.type}\n" +
    "                                                                  | filter:newsFilters.search\n" +
    "                                                                  | orderBy:['-sticky','-created']\">\n" +
    "                <div class=\"media-left hidden-sm hidden-xs\">\n" +
    "                    <a ng-href=\"#/news-exhibits/{{item.link}}\" class=\"news-list-tb\" ng-class=\"{img: item.tb}\">\n" +
    "                        <img class=\"media-object\" ng-src=\"{{item.tb}}\" ng-if=\"item.tb\" />\n" +
    "                        <span class=\"media-object\"\n" +
    "                          ng-if=\"item.type == 0 && !item.tb\"><span class=\"fa fa-newspaper-o\"></span></span>\n" +
    "                        <span class=\"media-object\"\n" +
    "                          ng-if=\"item.type == 1 && !item.tb\"><span class=\"fa fa-calendar\"></span></span>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                <div class=\"media-body\">\n" +
    "                    <h3 class=\"media-heading\">\n" +
    "                        <a ng-href=\"#/news-exhibits/{{item.link}}\" ng-bind-html=\"item.title | highlight:newsFilters.search\"></a>\n" +
    "                    </h3>\n" +
    "\n" +
    "                    <h5 class=\"text-muted\" ng-if=\"item.type > 0\">Exhibit {{item.activeFrom | date:mediumDate}} - {{item.activeUntil | date:mediumDate}}</h5>\n" +
    "                    <h5 class=\"text-muted\" ng-if=\"item.type < 1\">Created on {{item.created | date:mediumDate}}</h5>\n" +
    "                    <p class=\"text-justify\">\n" +
    "                    <span ng-bind-html=\"item.blurb | highlight:newsFilters.search\">\n" +
    "                    </span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"text-center\">\n" +
    "                <pagination total-items=\"filteredNews.length\" ng-model=\"soft.page\" max-size=\"10\" class=\"pagination-sm\" boundary-links=\"true\" items-per-page=\"soft.perPage\" ng-change=\"update()\" ng-if=\"filteredNews.length > soft.perPage\"></pagination>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"alert alert-warning text-center\" role=\"alert\" ng-show=\"news.length < 1\">\n" +
    "                <h2>\n" +
    "                    No\n" +
    "                    <span ng-show=\"newsFilters.type == ''\">News or Exhibits</span>\n" +
    "                    <span ng-show=\"newsFilters.type == '0'\">News</span>\n" +
    "                    <span ng-show=\"newsFilters.type == '1'\">Exhibits</span>\n" +
    "                    match the search \"<strong>{{newsFilters.search}}</strong>\"</span>\n" +
    "                </h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-md-3 hidden-xs\">\n" +
    "            <h4>Filters</h4>\n" +
    "            <form class=\"facets-form\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"newsFilters.search\" placeholder=\"Keyword search\">\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("today/news-today.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("today/news-today.tpl.html",
    "<div class=\"row\" ng-controller=\"NewsTodayCtrl\">\n" +
    "\n" +
    "    <a news-card=\"item\" ng-repeat=\"item in news\">\n" +
    "    </a>\n" +
    "\n" +
    "    <masonry>\n" +
    "        <div class=\"masonry-brick\">\n" +
    "            <a news-card=\"item\" ng-repeat=\"item in news\">\n" +
    "            </a>\n" +
    "        </div>\n" +
    "        <div class=\"masonry-brick\">\n" +
    "            <a news-card=\"item\" ng-repeat=\"item in events\">\n" +
    "            </a>\n" +
    "        </div>\n" +
    "        <div class=\"masonry-brick\">\n" +
    "            <div class=\"hours-list\"></div>\n" +
    "        </div>\n" +
    "    </masonry>\n" +
    "\n" +
    "</div>");
}]);
;/**
 * @ngdoc overview
 * @name index
 * @description
 * # Quick Start
 *
 * Run the following commands to install:
 *
 * ```shell
 * npm install
 * bower install
 * ```
 *
 * <div class="alert alert-warning">
 *     If you are unfamiliar with **Node.js**, **Grunt**, or **Bower** tools *or* have not installed them on your computer,
 *     read through the instructions in the [Getting Started](#getting-started) section.
 * </div>
 *
 * # Getting Started
 *
 * This package requires[Node.js](http://nodejs.org/) - an application platform which many development and automation tools may be run.
 * Download [Node.js](http://nodejs.org/download/) and install it on your computer.
 *
 * > The **Node.js** platform is used to run development tools such as [Grunt](#getting-started_install-grunt) and [Bower](#getting-started_install-bower)
 *
 * Once `Node.js` is installed, use the `npm` (node package manager) command to install this project's node dependencies:
 *
 * ```shell
 * npm install
 * ```
 *
 * <div class="alert alert-info">
 *     When the [npm install](https://docs.npmjs.com/cli/install) command is run without a package (e.g., `npm install <package_name>`),
 *     it installs dependencies listed in the `package.json` file (located in the root directory of this project).
 * </div>
 *
 *
 * ## Install Grunt
 * *This package requires Grunt `~0.4.5`*
 *
 * If you have not already installed `Grunt` on your computer, use the following command to install the `Grunt Command Line Interface (grunt-cli)`:
 *
 * ```shell
 * npm install -g grunt-cli
 * ```
 * <div class="alert alert-info">
 *     The **-g** option installs `grunt-cli` globally on you computer. You only need to run this command once.
 * </div>
 *
 * > If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide,
 * > as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins.
 *
 *
 * ## Install Bower
 *
 * If `Bower` is not globally installed on your computer, run the following command:
 *
 * ```shell
 * npm install -g bower
 * ```
 *
 * [Bower](http://bower.io/) is also a package manager for front-end web frameworks such as jQuery, Angular, and Bootstrap.
 * This project uses Bower to manage front-end third-party and peer dependencies.
 *
 * Once installed, you can download this project's `Bower` dependencies with the following command:
 *
 * ```shell
 * bower install
 * ```
 *
 * <div class="alert alert-info">
 *     Similar to `npm install` if `Bower's install` command is not given a package name (e.g., `bower install <package_name>`), it will install
 *     dependencies listed in the `bower.json` config file.
 * </div>
 */

angular.module('ualib.news', [
    'ngRoute',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'angular.filter',
    'duScroll',
    'ui.bootstrap',
    'angular-carousel',
    'ualib.ui',
    'ualib.news.templates'
]);;angular.module('ualib.news')

    /**
     * @ngdoc service
     * @name news.ualibNewsFactory
     *
     * @requires $resource
     * @requires $sce
     * @requires $filters
     * @requires $http
     */

    .factory('ualibNewsFactory', ['$resource', '$sce', '$filter', '$http', function($resource, $sce, $filter, $http){

        function preprocessNews(news){
            news = $filter('unique')(news, 'title');
            return news.map(function(item){
                var n = item;
                n.type = 1;

                // Convert timestamps into JS millisecond standard
                if (item.activeFrom !== null) {
                    n.activeFrom = new Date(item.activeFrom * 1000);
                } else {
                    n.activeFrom = null;
                }
                if (item.activeUntil !== null) {
                    n.activeUntil = new Date(item.activeUntil * 1000);
                } else {
                    n.activeUntil = null;
                }

                //it is news if dates are not set, exhibit otherwise
                if (n.activeFrom === null && n.activeUntil === null) {
                    n.type = 0;
                }
                n.created = new Date(item.created * 1000);

                // If link doesn't already exist, create one from the new item's title
                if (!n.hasOwnProperty('link')){
                    n.link = $filter('slugify')(n.title);
                }

                // If no 'blurb' exists, create one by truncating the description
                if (!n.hasOwnProperty('blurb')){
                    n.blurb = $filter('stripTags')(n.description);
                    n.blurb = $filter('truncate')(n.blurb, 250, '...', true);
                }

                return n;
            });
        }

        //TODO: centralize this function so it can be used with all apps
        // Extend the default responseTransform array - Straight from Angular 1.2.8 API docs - https://docs.angularjs.org/api/ng/service/$http#overriding-the-default-transformations-per-request
        
        /**
         * @ngdoc function
         * @name news.ualibNewsFactory#appendTransform
         * @methodOf news.ualibNewsFactory
         *
         * @param {Array.<function()>} defaults Default `Array` of `$http` transform response transform functions from Angular - will always be `$http.defaults.transformResponse`
         * @param {function()} transform Transform function to extend the `$http.defaults.transformResponse` Array with.
         *
         * @description
         * <span class="label label-warning">Private</span>
         * Extend the default responseTransform array - Straight from Angular 1.2.8 API docs - https://docs.angularjs.org/api/ng/service/$http#overriding-the-default-transformations-per-request
         *
         * Doing this allows custom modifications of the JSON response from the API to be cached after the initial `$resource` call, instead of
         * performing these modifications on every `$digest()` cycle (e.g., make modifications once, instead of every time the news list is refreshed).
         *
         * @returns {Array.<function()>} Returns the new `transformResponse` Array
         */
        function appendTransform(defaults, transform) {

            // We can't guarantee that the default transformation is an array1
            defaults = angular.isArray(defaults) ? defaults : [defaults];
            //console.log(defaults.concat(transform));
            // Append the new transformation to the defaults
            return defaults.concat(transform);
        }

        /**
         * @ngdoc method
         * @name news.ualibNewsFactory:get
         * @methodOf news.ualibNewsFactory
         *
         * @param {object.<string>=} params REST params object to send to the API
         * @param {string} params.news News list identifier
         *
         * Available `identifiers`:
         * - `archive` - Retrieves all news items from the API.
         *
         * @example
         * <pre>
         ualibNewsFactory.get({news: 'archive'})
            .$promise
            .then(function(data){
                $scope.news = data;
            }, function(data, status, headers, config) {
                console.log({
                    data: data,
                    status: status,
                    headers: headers,
                    config: config
                });
            });
         * </pre>
         *
         * @returns {Promise} Returns a [promise](https://code.angularjs.org/1.2.29/docs/api/ng/service/$q).
         */

        /**
         * @ngdoc method
         * @name news.ualibNewsFactory:today
         * @methodOf news.ualibNewsFactory
         *
         * @description
         * Retrieves *current* news items from the API and upcoming events from the [UA Events Calendar](http://events.ua.edu/category/22/).
         *
         * @example
         * <pre>
         *     ualibNewsFactory.today()
         .$promise
         .then(function(data){
                $scope.news = data.news;
                $scope.events = data.events;
            });
         * </pre>
         *
         * @returns {Promise} Returns a [promise](https://code.angularjs.org/1.2.29/docs/api/ng/service/$q).
         */

        return $resource('//wwwdev2.lib.ua.edu/newsApp/api/:news', {}, {
            get: {
                method: 'GET',
                params: {news: 'archive'},
                cache: true,
                transformResponse: appendTransform($http.defaults.transformResponse, function(data){
                    var news = angular.fromJson(data);
                    formatted = preprocessNews(news.news);
                    news.news = formatted;
                    return news;
                })
            },
            today: {
                method: 'GET',
                params: {news: 'today'},
                cache: true,
                transformResponse: appendTransform($http.defaults.transformResponse, function(data){
                    var news = angular.fromJson(data);
                    //var formatted = $filter('unique')(news.news, 'title');
                    for (var prop in news){
                        if (angular.isArray(news[prop])){
                            news[prop] = preprocessNews(news[prop]);

                        }
                    }
                    return news;
                })
            }
        });
    }]);;angular.module('ualib.news')

    /**
     * @ngdoc interface
     * @name news.news-item
     *
     * @description
     * Route module to display individual news items
     *
     * ```
     * /#/news-exhibits/:news-item
     * ```
     *
     *
     */

    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/news-exhibits/:link', {
                reloadOnSearch: false,
                resolve: {
                    /**
                     * @ngdoc service
                     * @name news.news-item.newsItem
                     *
                     * @requires news.ualibNewsFactory
                     *
                     * @description
                     * A resolve service for {@link news.Route:news-item news-item} route, which is injected into the {@link news.controller:newsItemCtrl}
                     */
                    newsItem: ['ualibNewsFactory', function(ualibNewsFactory){
                        return ualibNewsFactory.get({news: 'archive'}, function(data){
                            return data;
                        }, function(data, status, headers, config) {
                            console.log('ERROR: news item');
                            console.log({
                                data: data,
                                status: status,
                                headers: headers,
                                config: config
                            });
                        });
                    }]
                },
                templateUrl: 'news-item/news-item.tpl.html',
                controller: 'newsItemCtrl'
            });
    }])

    /**
     * @ngdoc controller
     * @name news.news-item.controller:newsItemCtrl
     *
     * @requires $scope
     * @requires $routeParams
     * @requires $document
     * @requires ualibNewsFactory
     *
     * @description
     * Route controller when viewing individual news items
     */

    .controller('newsItemCtrl', ['$scope', 'newsItem', '$routeParams', '$document', '$q', function($scope, newsItem, $routeParams, $document, $q){
        $document.duScrollTo(0, 30, 500, function (t) { return (--t)*t*t+1; });
        $scope.showEnlarged = false;
        $scope.curImage = 0;

        var controlElms;

        function loadImages(item, i, len, deferred){
            i = i ? i :0;
            len = len ? len : item.images.length;
            deferred = deferred ? deferred : $q.defer();

            if (len < 1){
                deferred.resolve(item);
            }

            var image = new Image();

            image.onload = function(){
                this.styles = 'url('+this.src+')';

                if (this.width/this.height < 1.3){
                    this.isPortrait = true;
                }
                item.images[i] = this;

                if (i+1 === len){
                    deferred.resolve(item);
                }
                else {
                    i++;
                    loadImages(item, i, len, deferred);
                }
            };

            image.src = item.images[i];

            return deferred.promise;
        }

        /**
         * @ndgoc method
         * @name news.news-item.controller:newsItemCtrl.$scope.englargeImages
         * @methodOf news.controller:newsItemCtrl
         *
         * @param {boolean} enlarge `true` or `false` to toggle full screen
         * @param {number} index Element index of the image clicked - ensures that the image clicked is the one visible when toggling full screen
         *
         * @description
         * `$scope` function used to trigger full-screen carousel when images are attached to a news item.
         */
        $scope.enlargeImages = function(enlarge, index) {
            if (enlarge) {
                $scope.showEnlarged = true;
                $scope.isLocked = true;
                $scope.curEnlImage = index;
                if (!controlElms){
                    controlElms = angular.element(document.querySelectorAll('.rn-carousel-controls, .rn-carousel-indicator, .fullsize-img'));
                    controlElms.bind('click', function(ev){
                        ev.preventDefault();
                        ev.stopPropagation();
                    });
                }
            } else {
                $scope.showEnlarged = false;
                $scope.isLocked = false;
            }
        };

        /**
         * @ndgoc method
         * @name news.news-item.controller:newsItemCtrl.$scope.setCurEnlImage
         * @methodOf news.controller:newsItemCtrl
         *
         * @param {number} index Element index of the image
         *
         * @description
         * `$scope` function to set the currently viewable image in the carousel.
         */

        $scope.setCurEnlImage = function(index) {
            $scope.curEnlImage = index;
        };

       newsItem.$promise.then(function(data){
           var item = null;
           for (var i = 0, len = data.news.length; i < len; i++){
               item = data.news[i];
               if (item.link && item.link === $routeParams.link){
                   break;
               }
           }

           loadImages(item).then(function(newsItem){
               $scope.newsItem = newsItem;
           });
       });



        $scope.$on('$destroy', function(){
            if (controlElms){
                controlElms.unbind('click');
            }
        });
    }])

    /**
     * @ngdoc directive
     * @name news.news-item.directive:newsCard
     *
     * @restrict A
     * @scope
     *
     * @param {object} newsCard The news item JSON object from the API
     * @param {string=} [newsType=news] Used to load templates for different types of news items
     *
     * Supported `news types`:
     *
     * | type | template |
     * |------|----------|
     * | news | `news-item/news-card.tpl.html` |
     * | event | `news-item/news-card.tpl.html` |
     *
     * @description
     * Directive to render different types of news items in a condensed list. This is useful for lists of the most current items and not intended for
     * rendering a list of the whole news archive
     *
     * @example
     *
     * ```html
     * <h2>News</h2>
     * <div ng-repeat="item in news">
     *      <div news-card="item">
     * </div>
     *
     * <h2>Events</h2>
     * <div ng-repeat="item in event">
     *      <div news-card="item" news-type="event">
     * </div>
     * ```
     * 
     */

    .directive('newsCard', [function(){
        return {
            restrict: 'A',
            replace: true,
            scope: {
                newsCard: '=?',
                newsFilters: '=?',
                newsType: '@'
            },
            templateUrl: function(tElem, tAttrs){
                var type = angular.isDefined(tAttrs.newsType) ? tAttrs.newsType : 'news';
                return 'news-item/' + type + '-card.tpl.html';
            }
        };
    }]);;/**
 * @ngdoc overview
 * @name news
 * 
 * @requires  ngRoute
 * @requires ngResource
 * @requires ngSanitize
 * @requires ngAnimate
 * @requires angular.filter
 * @requires duScroll
 * @requires ui.bootstrap
 * @requires angular-carousel
 * @requires ualib.ui
 *
 * @description
 * News and Events web app
 *
 * **default route: [/#/news-exhibits](http://www.lib.ua.edu/#/news-exhibits/)**
 */
angular.module('ualib.news')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/news-exhibits/', {
                reloadOnSearch: false,
                resolve: {
                    newsList: ['ualibNewsFactory', function(ualibNewsFactory){
                        return ualibNewsFactory.get({news: 'archive'}, function(data){
                            return data;
                        }, function(data, status, headers, config) {
                            console.log('ERROR: news');
                            console.log({
                                data: data,
                                status: status,
                                headers: headers,
                                config: config
                            });
                        });
                    }]
                },
                templateUrl: 'news/news-list.tpl.html',
                controller: 'newsListCtrl'
            });
    }])

    /**
     * @ngdoc controller
     * @name news.Controller:newsListCtrl
     *
     * @requires $scope
     * @requires $location
     * @requires news.ualibNewsFactory
     *
     * @description
     * Controller for the News and Exhibits web app route {@link $scope}
     *
     */

    .controller('newsListCtrl', ['$scope', '$location', 'newsList', function($scope, $location, newsList){
        var filterWatcher;
        /**
         * @ngdoc object
         * @name news.Controller:newsListCtrl:$scope.newsFilter
         * @propertyOf news.Controller:newsListCtrl
         * @type {Object.<string>}
         *
         * @description
         * `$scope` object for the news list filters
         */
        $scope.newsFilters = {
            sort: 'created',
            type: '',
            search: ''
        };

        /**
         * @ngdoc object
         * @name news.Controller:newsListCtrl:$scope.news
         * @propertyOf news.Controller:newsListCtrl
         *
         * @description
         * `$scope` variable for the list of news items return from the API via the {@link news.ualibNewsFactory ualibNewsFactory} service.
         */

        newsList.$promise.then(function(data){
            $scope.news = data.news;
            paramsToScope();
            filterWatcher = $scope.$watch('newsFilters', function(newVal, oldVal){
                if (newVal !== oldVal){
                    processFilters();
                }
            }, true);
        });

        $scope.$on('$destroy', function(){
            filterWatcher();
        });

        //TODO: will need to replace highlight filter by a custom one
        // if we use item.description instead of item.blurb

        /**
         * @ngdoc function
         * @name news.Controller:newsListCtrl#paramsToScope
         * @methodOf news.Controller:newsListCtrl
         *
         * @description
         * <span class="label label-danger">private</span>
         *
         * Function to bind `URI query params` to `$scope.newsFilters`.
         */
        function paramsToScope(){
            var params = $location.search();
            for (var param in params){
                if ($scope.newsFilters.hasOwnProperty(param)){
                    $scope.newsFilters[param] = params[param];
                }
            }
        }

        /**
         * @ngdoc function
         * @name news.Controller:newsListCtrl#processFilters
         * @methodOf news.Controller:newsListCtrl
         *
         * @description
         * <span class="label label-danger">private</span>
         *
         * Function to bind `$scope.newsFilters` to `URI query params`.
         */
        function processFilters(){
            var f = $scope.newsFilters;
            var params = $location.search();
            for (var filter in f){
                if (angular.isDefined(f[filter]) && f[filter] !== ''){
                    $location.search(filter, f[filter]);
                }
                else if (params.hasOwnProperty(filter)){
                    $location.search(filter, null);
                }
            }
        }
    }]);;angular.module('ualib.news')

    /**
     * @ngdoc controller
     * @name news.controller:NewsTodayCtrl
     *
     * @requires $scope
     * @requires $filter
     * @requires ualibNewsFactory
     *
     * @description
     * Convenience controller to be used with the {@link news.directive:newsCard newsCard} directive, to display
     * current `news` and `events`.
     *
     * @example
     * ```html
     * <div ng-contorller="NewsTodayCtrl">
     *  <h2>News</h2>
     *  <div ng-repeat="item in news">
     *      <div news-card="item">
     *  </div>
     *
     *  <h2>Events</h2>
     *  <div ng-repeat="item in event">
     *      <div news-card="item" news-type="event">
     *  </div>
     * </div>
     * ```
     */

    .controller('NewsTodayCtrl', ['$scope', '$filter', 'ualibNewsFactory', function($scope, $filter, ualibNewsFactory){
        ualibNewsFactory.today()
            .$promise
            .then(function(data){
                $scope.news = data.news;
                $scope.events = data.events;
                $scope.newsOverflow = (data.news.length + data.events.length) > 3;
            });
    }]);
angular.module('ualib.softwareList.templates', ['software-list/software-list.tpl.html']);

angular.module("software-list/software-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("software-list/software-list.tpl.html",
    "<div class=\"jumbotron-header\">\n" +
    "    <div class=\"jumbotron\">\n" +
    "        <div class=\"container\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <ol class=\"breadcrumb\" typeof=\"BreadcrumbList\" vocab=\"http://schema.org/\">\n" +
    "                        <li><a title=\"Go to The University of Alabama Libraries.\" href=\"/#/home\" class=\"home\">The University of Alabama Libraries</a></li>\n" +
    "                        <li><a title=\"Go to SoftwareList.\" href=\"/#/software\" class=\"post post-page\">Software List</a></li>\n" +
    "                    </ol>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <h1>Libraries' Software List</h1>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-3 col-md-push-9\">\n" +
    "            <form>\n" +
    "                <div class=\"form-group\">\n" +
    "                <span class=\"page-header\">\n" +
    "                    <h4>Filter Software List By</h4>\n" +
    "                </span>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"soft.search\" placeholder=\"Search software, locations, etc...\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"btn-group btn-group-justified\">\n" +
    "                        <label class=\"btn btn-default active\" ng-model=\"soft.os\" btn-radio=\"''\" uncheckable>All</label>\n" +
    "                        <label class=\"btn btn-default\" ng-model=\"soft.os\" btn-radio=\"'1'\" uncheckable><span class=\"fa fa-fw fa-windows\"></span></label>\n" +
    "                        <label class=\"btn btn-default\" ng-model=\"soft.os\" btn-radio=\"'2'\" uncheckable><span class=\"fa fa-fw fa-apple\"></span></label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group hidden-xs\">\n" +
    "                    <h5>Locations</h5>\n" +
    "                    <div class=\"radio\">\n" +
    "                        <label>\n" +
    "                            <input type=\"radio\" value=\"\" ng-model=\"soft.loc\" checked>\n" +
    "                            All Locations\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                    <div class=\"radio\" ng-repeat=\"loc in locations\">\n" +
    "                        <label>\n" +
    "                            <input type=\"radio\" value=\"{{loc.name}}\" ng-model=\"soft.loc\">\n" +
    "                            {{loc.name}}\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group hidden-xs\">\n" +
    "                    <h5>Categories</h5>\n" +
    "                    <div class=\"radio\">\n" +
    "                        <label>\n" +
    "                            <input type=\"radio\" value=\"\" ng-model=\"soft.cat\">\n" +
    "                            All categories\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                    <div class=\"radio\" ng-repeat=\"cat in categories\">\n" +
    "                        <label>\n" +
    "                            <input type=\"radio\" value=\"{{cat.name}}\" ng-model=\"soft.cat\">\n" +
    "                            {{cat.name}}\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group hidden-xs\">\n" +
    "                    <button type=\"button\" class=\"btn btn-block btn-primary\" ng-click=\"resetFilters()\"><span class=\"fa fa-fw fa-refresh\"></span> Reset filters</button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-9 col-md-pull-3 software-list-container\">\n" +
    "            <h4 class=\"text-right\" ng-show=\"pager.totalItems > 0\">\n" +
    "                Showing {{pager.firstItem}}-{{pager.lastItem}} of {{pager.totalItems}} results\n" +
    "            </h4>\n" +
    "\n" +
    "            <div ng-if=\"(soft.cat || soft.os || soft.loc)\">\n" +
    "\n" +
    "                <ol class=\"breadcrumb facetcrumb\">\n" +
    "                    <li ng-if=\"soft.os\"><strong>OS:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"soft.os = ''\">{{soft.os == 1 ? 'Windows' : 'OS X'}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "                    <li ng-if=\"soft.loc\"><strong>Location:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"soft.loc = ''\">{{soft.loc}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "                    <li ng-if=\"soft.cat\"><strong>Category:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"soft.cat = ''\">{{soft.cat}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "\n" +
    "                    <li class=\"pull-right\"><button type=\"button\" class=\"btn btn-primary btn-small reset-btn\" title=\"Reset filters\" ng-click=\"resetFilters()\"><i class=\"fa fa-refresh\"></i></button></li>\n" +
    "                </ol>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"media software-item animate-repeat\" ng-repeat=\"item in filteredSoft | after:(pager.page-1)*pager.perPage | limitTo:20\">\n" +
    "                <div class=\"media-left\">\n" +
    "                    <img class=\"media-object\" ng-src=\"{{item.icon}}\" alt=\"{{item.title}}\" title=\"{{item.title}}\">\n" +
    "                </div>\n" +
    "                <div class=\"media-body\">\n" +
    "                    <h3 class=\"media-heading\" ng-bind-html=\"item.title | highlight:soft.search\">\n" +
    "                    </h3>\n" +
    "\n" +
    "                    <div ng-bind-html=\"item.description | highlight:soft.search\"></div>\n" +
    "\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"details-context col-md-6\" ng-repeat=\"ver in item.versions | orderBy:os\">\n" +
    "                            <div class=\"h4 text-muted\">\n" +
    "                                <span class=\"fa fa-{{ver.osName}}\"></span>\n" +
    "                                Version {{ver.version}}\n" +
    "                            </div>\n" +
    "                        <span ng-repeat=\"loc in ver.locations | orderBy:'name'\">\n" +
    "                            <!--<span ng-if=\"loc.parent\" ng-bind-html=\"(locations | filter:loc.parent)[0].name\"></span>-->\n" +
    "                            <span ng-bind-html=\"loc.name | highlight:soft.search | highlight:soft.loc:true\"></span>\n" +
    "                        </span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"details hidden-xs\">\n" +
    "                        <div class=\"software-links\">\n" +
    "                            <ul class=\"list-inline nav-justified\" style=\"margin-top: 5px;\">\n" +
    "                                <li ng-repeat=\"link in item.links\" ng-if=\"item.links\">\n" +
    "                                    <a ng-href=\"{{link.url}}\" target=\"{{link.title}}\" class=\"external-link\">{{link.title}}</a>\n" +
    "                                </li>\n" +
    "                                <li ng-if=\"item.modules\">\n" +
    "                                    <div collapse=\"!isCollapsed\" ng-bind-html=\"item.modules | highlight:soft.search\"></div>\n" +
    "                                    <button class=\"btn btn-default btn-xs\" ng-click=\"isCollapsed = !isCollapsed\">\n" +
    "                                        {{!isCollapsed ? \"Show\" : \"Hide\"}} Available Modules\n" +
    "                                    </button>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"text-center\">\n" +
    "                <pagination class=\"pagination-sm\" ng-model=\"pager.page\" total-items=\"pager.totalItems\" max-size=\"pager.maxSize\" boundary-links=\"true\" rotate=\"false\" items-per-page=\"pager.perPage\" ng-change=\"pageChange()\" ng-if=\"pager.totalItems > pager.perPage\"></pagination>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"alert alert-warning text-center\" role=\"alert\" ng-show=\"pager.totalItems < 1\">\n" +
    "                <h2>\n" +
    "                    No <span ng-if=\"soft.cat\"><strong>{{soft.cat | lowercase}}</strong></span> software is available\n" +
    "                    <span ng-if=\"soft.os\">on <strong>{{soft.os == 1 ? 'Windows' : 'OS X'}}</strong> computers</span>\n" +
    "                    <span ng-if=\"soft.loc\">in <strong>{{soft.loc}}</strong></span>\n" +
    "                    <span ng-if=\"soft.search\">that matches the search \"<strong>{{soft.search}}</strong>\"</span>\n" +
    "                </h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
;angular.module('ualib.softwareList', [
    'ngRoute',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'angular.filter',
    'ui.bootstrap',
    'duScroll',
    'ualib.ui',
    'ualib.softwareList.templates'
]);;angular.module('ualib.softwareList')

    .factory('softwareFactory', ['$resource', function($resource){
        return $resource('//wwwdev2.lib.ua.edu/softwareList/api/:software', {software: 'all'}, {
            get: {
                method: 'GET',
                cache: true
            }
        });
    }]);;angular.module('ualib.softwareList')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/software', {
                reloadOnSearch: false,
                resolve: {
                    software: ['$filter', 'softwareFactory', function($filter, softwareFactory){
                        return softwareFactory.get({software: 'all'}, function(data){

                            for (var i = 0, len = data.software.length; i < len; i++){

                                // insert OS string names for easier ng-repeat filtering
                                var os = [];
                                for (var x = 0, l = data.software[i].versions.length; x < l; x++){
                                    os.push(data.software[i].versions[x].os);
                                    switch (data.software[i].versions[x].os){
                                        case '3':
                                            data.software[i].versions[x].osName = 'linux';
                                            break;
                                        case '2':
                                            data.software[i].versions[x].osName = 'apple';
                                            break;
                                        default:
                                            data.software[i].versions[x].osName = 'windows';
                                    }
                                }
                                data.software[i].os = os.join('');


                            }

                            return data;
                        }, function(data, status, headers, config) {
                            console.log('ERROR: software list');
                            console.log({
                                data: data,
                                status: status,
                                headers: headers,
                                config: config
                            });
                        });
                    }]
                },
                templateUrl: 'software-list/software-list.tpl.html',
                controller: 'SoftwareListCtrl'
            });
    }])

    .controller('SoftwareListCtrl', ['$scope', 'software', '$location', '$filter', '$document', function($scope, software, $location, $filter, $document){
        var softwareList = [];
        $scope.soft = {};
        var defaults = {
            os: '',
            search: '',
            cat: '',
            loc: ''
        };


        software.$promise.then(function(data){
            softwareList = data.software;
            $scope.resetFilters();

            $scope.categories = data.categories;
            $scope.locations = data.locations.filter(function(loc){
                return parseInt(loc.parent) === 0;
            });

            //Apply URI query params to scope
            var params = $location.search();
            for (var p in params){
                if ($scope.pager.hasOwnProperty(p)){
                    $scope.pager[p] = params[p];
                }
                if ($scope.soft.hasOwnProperty(p)){
                    $scope.soft[p] = params[p];
                }
            }

            //Scope watchers and listeners
            $scope.$on('$locationChangeSuccess', function(){
                processSoftwareList(softwareList);
            });

            $scope.$on('$destroy', function(){
                filterWatcher();
            });

            processSoftwareList(softwareList);
        });

        var filterWatcher = $scope.$watch('soft', function(newVal, oldVal){
            for (var filter in newVal){
                if (newVal[filter] !== ''){
                    $location.search(filter, newVal[filter]);
                }
                else{
                    $location.search(filter, null);
                }
            }
        }, true);


        $scope.update = function(){
            var q = {};
            angular.forEach(soft, function(val, key){
               if (angular.isDefined(val) && val !== ''){
                   q[key] = val;
               }
            });
            $location.search(q);
        };

        $scope.pageChange = function(){
            $location.search('page', $scope.pager.page);
            $document.duScrollTo(0, 30, 500, function (t) { return (--t)*t*t+1; });
        };

        $scope.resetFilters = function(){
            $scope.pager = {
                page: 1,
                perPage: 20,
                maxSize: 10,
                totalItems: 0
            };
            angular.copy(defaults, $scope.soft);
        };

        function processSoftwareList(softwareList){
            var filtered = softwareList;

            filtered = $filter('filter')(filtered, {categories: $scope.soft.cat});
            filtered = $filter('filter')(filtered, {versions: $scope.soft.loc});
            filtered = $filter('filter')(filtered, $scope.soft.search);
            filtered = $filter('filterBy')(filtered, ['os'], $scope.soft.os);

            $scope.filteredSoft = filtered;

            $scope.pager.totalItems = $scope.filteredSoft.length;
            $scope.pager.firstItem = (($scope.pager.page-1)*$scope.pager.perPage)+1;
            //$scope.pager.lastItem = $scope.pager.page*(($scope.pager.totalItems < $scope.pager.maxSize) ? $scope.pager.totalItems : $scope.pager.perPage);
            $scope.pager.lastItem = $scope.pager.totalItems < $scope.pager.perPage ?  $scope.pager.totalItems : ($scope.pager.page * $scope.pager.perPage);



            var numPages =  Math.floor($scope.pager.totalItems / $scope.pager.maxSize);
            if (numPages < $scope.pager.page){
                $scope.pager.page = numPages || 1;
            }
        }


    }]);
angular.module('ualib.staffdir.templates', ['staff-card/staff-card-list.tpl.html', 'staff-card/staff-card-md.tpl.html', 'staff-directory/staff-directory-facets.tpl.html', 'staff-directory/staff-directory-listing.tpl.html', 'staff-directory/staff-directory.tpl.html', 'staff-profile/staff-profile.tpl.html']);

angular.module("staff-card/staff-card-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-card/staff-card-list.tpl.html",
    "<div ng-repeat=\"person in filteredList | after:(staffdir.pager.page-1)*staffdir.pager.perPage | limitTo:staffdir.pager.perPage\">\n" +
    "    <div class=\"page-slice\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"hidden-xs col-sm-3\">\n" +
    "                <img class=\"staff-portrait thumbnail\" ng-src='{{person.photo}}' />\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-12 col-sm-7\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-xs-12 col-sm-7 name-plate\">\n" +
    "                        <h3 class=\"name\">\n" +
    "                            <small ng-if=\"person.rank\">{{person.rank}}</small>\n" +
    "                            <a ng-href=\"#/staffdir/{{person.emailPrefix}}\" ng-if=\"person.profile\">\n" +
    "                                <span ng-class=\"{'sorting-by': staffdir.facet.sortBy == 'firstname'}\" ng-bind-html=\"person.firstname | highlight:staffdir.facet.search\"></span>\n" +
    "                                <span ng-class=\"{'sorting-by': staffdir.facet.sortBy == 'lastname'}\" ng-bind-html=\"person.lastname | highlight:staffdir.facet.search\"></span>\n" +
    "                            </a>\n" +
    "                            <span ng-if=\"!person.profile\">\n" +
    "                                <span ng-class=\"{'sorting-by': staffdir.facet.sortBy == 'firstname'}\" ng-bind-html=\"person.firstname | highlight:staffdir.facet.search\"></span>\n" +
    "                                <span ng-class=\"{'sorting-by': staffdir.facet.sortBy == 'lastname'}\" ng-bind-html=\"person.lastname | highlight:staffdir.facet.search\"></span>\n" +
    "                            </span>\n" +
    "                        </h3>\n" +
    "                        <h4 class=\"title\"><span ng-bind-html=\"person.title | highlight:staffdir.facet.search\"></span></h4>\n" +
    "                        <h5 class=\"hidden-xs\"><span ng-bind-html=\"person.department | highlight:staffdir.facet.search\"></span></h5>\n" +
    "\n" +
    "                    </div>\n" +
    "                    <div class=\"col-xs-12 col-sm-5\">\n" +
    "                        <ul class=\"fa-ul\">\n" +
    "                            <li ng-if=\"person.phone\"><span class=\"fa fa-phone fa-li\"></span><a ng-href=\"tel:+1{{person.phone}}\">{{person.phone}}</a></li>\n" +
    "                            <li class=\"hidden-xs\" ng-if=\"person.fax\"><span class=\"fa fa-fax fa-li\"></span>{{person.fax}}</li>\n" +
    "                            <li ng-if=\"person.email\"><span class=\"fa fa-envelope fa-li\"></span><a ng-href=\"mailto:{{person.email}}\" title=\"Email {{person.firstname}} {{person.lastname}}\">{{person.email}}</a></li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-sm-12 subject-specialty hidden-xs\" ng-if=\"person.subjects\">\n" +
    "                        <table class=\"table table-condensed\">\n" +
    "                            <thead>\n" +
    "                            <tr>\n" +
    "                                <th>Subject specialty</th>\n" +
    "                                <th class=\"text-center\">Selector</th>\n" +
    "                                <th class=\"text-center\">Instruction</th>\n" +
    "                            </tr>\n" +
    "                            </thead>\n" +
    "                            <tbody>\n" +
    "                            <tr ng-repeat=\"subject in person.subjects | orderBy:'subject'\">\n" +
    "                                <td>\n" +
    "                                    <a ng-href=\"{{subject.link}}\" title=\"{{subject.subject}}\" ng-if=\"subject.link\" ng-bind-html=\"subject.subject | highlight:staffdir.facet.search\"></a>\n" +
    "                                    <span ng-if=\"!subject.link\" ng-bind-html=\"subject.subject | highlight:staffdir.facet.search\">{{subject.subject}}</span>\n" +
    "                                </td>\n" +
    "                                <td class=\"text-center\"><span class=\"fa fa-circle text-info\" ng-if=\"subject.type == 1 || subject.type == 3\"></span></td>\n" +
    "                                <td class=\"text-center\"><span class=\"fa fa-circle text-info\" ng-if=\"subject.type > 1\"></span></td>\n" +
    "                            </tr>\n" +
    "                            </tbody>\n" +
    "                        </table>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"alert alert-warning text-center\" role=\"alert\" ng-if=\"filteredList.length < 1\">\n" +
    "    <h2>\n" +
    "        No staff members found\n" +
    "        <span ng-if=\"staffdir.facet.library\"> in {{staffdir.facet.library}}</span>\n" +
    "        <span ng-if=\"staffdir.facet.selector\"> that are subject selectors</span>\n" +
    "        <span ng-if=\"staffdir.facet.instructor\"><span ng-if=\"staffdir.facet.selector\"> or</span> <span ng-if=\"!staffdir.facet.selector\"> that are</span> instruction librarians</span>\n" +
    "                <span ng-if=\"staffdir.facet.subject\">\n" +
    "                    <span ng-if=\"staffdir.facet.selector || staffdir.facet.instructor\"> for</span>\n" +
    "                    <span ng-if=\"!staffdir.facet.selector && !staffdir.facet.instructor\"> with a specialty in</span>\n" +
    "                     {{staffdir.facet.subject}}\n" +
    "                </span>\n" +
    "    </h2>\n" +
    "</div>");
}]);

angular.module("staff-card/staff-card-md.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-card/staff-card-md.tpl.html",
    "<div class=\"staff-card-container panel panel-default\">\n" +
    "    <div class=\"panel-body\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"name-plate col-sm-12 text-right\">\n" +
    "                <h4 class=\"name\"><small ng-if=\"staffPerson.rank\">{{staffPerson.rank}} </small>{{staffPerson.firstname}} {{staffPerson.lastname}}</h4>\n" +
    "                <div class=\"title\">{{staffPerson.title}}</div>\n" +
    "                <div class=\"\">{{staffPerson.department}}</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-xs-6\">\n" +
    "                <div class=\"staff-card-detail\">\n" +
    "                    <h6>Contact</h6>\n" +
    "                    <ul class=\"fa-ul\">\n" +
    "                        <li ng-if=\"staffPerson.phone\"><span class=\"fa fa-phone fa-li\"></span><a ng-href=\"tel:+1-{{staffPerson.phone}}\">{{staffPerson.phone}}</a></li>\n" +
    "                        <li ng-if=\"staffPerson.fax\"><span class=\"fa fa-fax fa-li\"></span>{{staffPerson.fax}}</li>\n" +
    "                        <li ng-if=\"staffPerson.email\"><span class=\"fa fa-envelope fa-li\"></span><a href=\"mailto:{{staffPerson.email}}\">{{staffPerson.email}}</a></li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-6\">\n" +
    "                <div class=\"staff-card-detail\" ng-if=\"staffPerson.subjects\">\n" +
    "                    <h6>Subject Expertise</h6>\n" +
    "                    <ul class=\"list-unstyled\">\n" +
    "                        <li role=\"presentation\" ng-repeat=\"subject in staffPerson.subjects | orderBy:subject.subject\" ng-class=\"{'disabled': !subject.link}\">\n" +
    "                            <a ng-href=\"{{subject.link}}\" title=\"{{subject.subject}}\" ng-if=\"subject.link\">{{subject.subject}}</a>\n" +
    "                            <span title=\"{{subject.subject}}\" ng-if=\"!subject.link\">{{subject.subject}}</span>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("staff-directory/staff-directory-facets.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-directory/staff-directory-facets.tpl.html",
    "<form class=\"facets-form\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <h4>Filters</h4>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"facet-group\">\n" +
    "            <input class=\"form-control\" id=\"directorySearch\" name=\"directorySearch\" type=\"text\" ng-model=\"staffdir.facet.search\" placeholder=\"Keyword Search...\" ng-keyup=\"staffdir.changeFacet('search')\"/>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <h5>Sort by</h5>\n" +
    "        <div class=\"facet-group\">\n" +
    "            <div class=\"btn-group btn-group-justified\">\n" +
    "                <label class=\"btn btn-default\" ng-model=\"staffdir.facet.sortBy\" btn-radio=\"'lastname'\" ng-change=\"staffdir.changeFacet('sortBy')\">Last name</label>\n" +
    "                <label class=\"btn btn-default\" ng-model=\"staffdir.facet.sortBy\" btn-radio=\"'firstname'\" ng-change=\"staffdir.changeFacet('sortBy')\">First name</label>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group hidden-xs hidden-sm\">\n" +
    "        <h5>Subject specialty</h5>\n" +
    "\n" +
    "        <div class=\"facet-group\">\n" +
    "\n" +
    "            <select class=\"form-control\" ng-model=\"staffdir.facet.subject\" name=\"subject\" ng-options=\"subject for subject in facets.subjects\" ng-change=\"staffdir.changeFacet('subject')\">\n" +
    "                <option value=\"\">-- Select Subject --</option>\n" +
    "            </select>\n" +
    "            <label class=\"checkbox-inline\">\n" +
    "                <input type=\"checkbox\" id=\"selector\" ng-true-value=\"1\" ng-model=\"staffdir.facet.selector\" ng-change=\"staffdir.changeFacet('selector')\"> Selector\n" +
    "            </label>\n" +
    "            <label class=\"checkbox-inline\">\n" +
    "                <input type=\"checkbox\" id=\"instructor\" ng-true-value=\"2\" ng-model=\"staffdir.facet.instructor\" ng-change=\"staffdir.changeFacet('instructor')\"> Instructor\n" +
    "            </label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group hidden-xs hidden-sm\">\n" +
    "        <h5>Department</h5>\n" +
    "        <div class=\"facet-group\">\n" +
    "            <select class=\"form-control\" ng-model=\"staffdir.facet.department\" name=\"department\" ng-options=\"department for department in facets.departments\" ng-change=\"staffdir.changeFacet('department')\">\n" +
    "                <option value=\"\">-- Select Department --</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group hidden-xs hidden-sm\">\n" +
    "        <h5>Library Location</h5>\n" +
    "        <div class=\"facet-group\">\n" +
    "            <div class=\"radio\">\n" +
    "                <label>\n" +
    "                    <input type=\"radio\" ng-model=\"staffdir.facet.library\" value=\"\" ng-checked=\"!staffdir.facet.library\" ng-change=\"staffdir.changeFacet('library')\"> All\n" +
    "                </label>\n" +
    "            </div>\n" +
    "            <div class=\"radio\" ng-repeat=\"library in facets.libraries\">\n" +
    "                <label>\n" +
    "                    <input type=\"radio\" ng-model=\"staffdir.facet.library\" value=\"{{library}}\" ng-change=\"staffdir.changeFacet('library')\"> {{library}}\n" +
    "                </label>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group hidden-xs hidden-sm\">\n" +
    "        <button class=\"btn btn-primary btn-block\" type=\"button\" ng-click=\"staffdir.clearFacets()\">\n" +
    "            <span class=\"fa fa-fw fa-refresh\"></span> Reset Filters\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</form>");
}]);

angular.module("staff-directory/staff-directory-listing.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-directory/staff-directory-listing.tpl.html",
    "<div class=\"table-responsive\">\n" +
    "    <table class=\"table table-striped table-condensed table-hover\">\n" +
    "        <thead>\n" +
    "        <tr>\n" +
    "            <th>\n" +
    "                <a href=\"#\"\n" +
    "                   ng-click=\"sortList($event, 'lastname')\"\n" +
    "                   ng-class=\"{'sortable': !staffdir.sortReverse && staffdir.facet.sortBy == 'lastname', 'sortable-reverse': staffdir.sortReverse && staffdir.facet.sortBy == 'lastname'}\">Name</a>\n" +
    "            </th>\n" +
    "            <th class=\"hidden-xs\">\n" +
    "                <a href=\"#\" \n" +
    "                   ng-click=\"sortList($event, 'title')\" \n" +
    "                   ng-class=\"{'sortable': !staffdir.sortReverse && staffdir.facet.sortBy == 'title', 'sortable-reverse': staffdir.sortReverse && staffdir.facet.sortBy == 'title'}\">Title</a>\n" +
    "            </th>\n" +
    "            <th class=\"hidden-xs\">\n" +
    "                <a href=\"#\" \n" +
    "                   ng-click=\"sortList($event, 'department')\" \n" +
    "                   ng-class=\"{'sortable': !staffdir.sortReverse && staffdir.facet.sortBy == 'department', 'sortable-reverse': staffdir.sortReverse && staffdir.sortBy == 'department'}\">Department/Unit</a>\n" +
    "            </th>\n" +
    "            <th>Contact</th>\n" +
    "            <th class=\"hidden-xs hidden-sm\">Specialty</th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "        <tr ng-repeat=\"person in filteredList = (list | filter:staffdir.facet.search | filter:staffdir.facet.subject:true | orderBy:staffdir.sortBy:staffdir.sortReverse) track by $index\">\n" +
    "            <td class=\"text-nowrap\">\n" +
    "                <div ng-if=\"person.rank\" class=\"text-muted\"> {{person.rank}}</div>\n" +
    "                <span ng-bind-html=\"person.firstname | highlight:staffdir.facet.search\"></span> <strong ng-bind-html=\"person.lastname | highlight:staffdir.facet.search\"></strong>\n" +
    "\n" +
    "            </td>\n" +
    "            <td class=\"hidden-xs\"><span ng-bind-html=\"person.title | highlight:staffdir.facet.search\"></span></td>\n" +
    "            <td class=\"hidden-xs\"><span ng-bind-html=\"person.department | highlight:staffdir.facet.search\"></span></td>\n" +
    "            <td>\n" +
    "                <ul class=\"fa-ul\">\n" +
    "                    <li ng-if=\"person.phone\"><span class=\"fa fa-phone fa-li\"></span>{{person.phone}}</li>\n" +
    "                    <li ng-if=\"person.fax\"><span class=\"fa fa-fax fa-li\"></span>{{person.fax}}</li>\n" +
    "                    <li ng-if=\"person.email\"><span class=\"fa fa-envelope fa-li\"></span> <a ng-href=\"mailto:{{person.email}}\" title=\"Email {{person.firstname}} {{persone.lastname}}\">{{person.email}}</a></li>\n" +
    "                </ul>\n" +
    "            </td>\n" +
    "            <td class=\"hidden-xs hidden-sm\">\n" +
    "                <ul class=\"list-unstyled\" ng-if=\"person.subjects\">\n" +
    "                    <li ng-repeat=\"subject in person.subjects | orderBy:subject.subject\">\n" +
    "                        <a ng-href=\"{{subject.link}}\" title=\"{{subject.subject}}\" ng-if=\"subject.link\" ng-bind-html=\"subject.subject | highlight:staffdir.facet.search\"></a>\n" +
    "                        <span ng-if=\"!subject.link\" ng-bind-html=\"subject.subject | highlight:staffdir.facet.search\">{{subject.subject}}</span>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "    <div class=\"alert alert-warning text-center\" role=\"alert\" ng-show=\"filteredList.length === 0\">\n" +
    "        <h2>\n" +
    "            No results<span ng-if=\"staffdir.facet.subject\"><strong> for {{staffdir.facet.subject}}</strong> subject specialists</span>\n" +
    "            <span ng-if=\"staffdir.facet.search\"> matching <strong>\"{{staffdir.facet.search}}\"</strong></span>\n" +
    "        </h2>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("staff-directory/staff-directory.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-directory/staff-directory.tpl.html",
    "<div class=\"jumbotron-header\">\n" +
    "    <div class=\"jumbotron\">\n" +
    "        <div class=\"container\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-sm-12\">\n" +
    "                    <ol class=\"breadcrumb\" typeof=\"BreadcrumbList\" vocab=\"http://schema.org/\">\n" +
    "                        <li><a title=\"Go to The University of Alabama Libraries.\" href=\"/#/home\" class=\"home\">The University of Alabama Libraries</a></li>\n" +
    "                        <li><a title=\"Go to News.\" href=\"/#/staffdir\" class=\"post post-page\">Staff Directory</a></li>\n" +
    "                    </ol>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <h1>Staff Directory</h1>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <div class=\"row staff-directory\">\n" +
    "        <div class=\"col-md-3 col-md-push-9\">\n" +
    "            <div class=\"staff-directory-facets\" facets=\"staffdir.facets\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-9 col-md-pull-3\">\n" +
    "            <div ng-show=\"facets.showFacetBar\">\n" +
    "                <ol class=\"breadcrumb facetcrumb\">\n" +
    "                    <li ng-if=\"facets.facet.department\"><strong>Department:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"facets.clearFacets('department')\">{{facets.facet.department | truncate : 20 : '...'}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "                    <li ng-if=\"facets.facet.library\"><strong>Library:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"facets.clearFacets('library')\">{{facets.facet.library}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "                    <li ng-if=\"facets.facet.subject\"><strong>Subject:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"facets.clearFacets('subject')\">{{facets.facet.subject}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "                    <li ng-if=\"facets.facet.selector\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"facets.clearFacets('selector')\">Selector <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "                    <li ng-if=\"facets.facet.instructor\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"facets.clearFacets('instructor')\">Instructor <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "\n" +
    "                    <li class=\"pull-right\"><button type=\"button\" class=\"btn btn-primary btn-small reset-btn\" title=\"Reset filters\" ng-click=\"facets.clearFacets()\"><i class=\"fa fa-refresh\"></i></button></li>\n" +
    "                </ol>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"text-center\">\n" +
    "                <pagination class=\"pagination-sm\" ng-model=\"facets.pager.page\" total-items=\"facets.pager.totalItems\" max-size=\"facets.pager.maxSize\" boundary-links=\"true\" rotate=\"false\" items-per-page=\"facets.pager.perPage\" ng-change=\"facets.changeFacet('page')\" ng-if=\"facets.pager.totalItems > facets.pager.perPage\"></pagination>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"staff-directory-listing\" id=\"staff-directory-listing\" list=\"staffdir.list\" sort-by=\"lastname\"></div>\n" +
    "\n" +
    "            <div class=\"text-center\">\n" +
    "                <pagination class=\"pagination-sm\" ng-model=\"facets.pager.page\" total-items=\"facets.pager.totalItems\" max-size=\"facets.pager.maxSize\" boundary-links=\"true\" rotate=\"false\" items-per-page=\"facets.pager.perPage\" ng-change=\"facets.changeFacet('page')\" ng-if=\"facets.pager.totalItems > facets.pager.perPage\"></pagination>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("staff-profile/staff-profile.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-profile/staff-profile.tpl.html",
    "<div class=\"container\">\n" +
    "    <ol class=\"breadcrumb\" typeof=\"BreadcrumbList\" vocab=\"http://schema.org/\">\n" +
    "        <li><a title=\"Go to The University of Alabama Libraries.\" href=\"/#/home\" class=\"home\">The University of Alabama Libraries</a></li>\n" +
    "        <li><a title=\"Go to the Staff Directory.\" href=\"/#/staffdir\" class=\"home\">Staff Directory</a></li>\n" +
    "        <li><a title=\"Go to user profile.\" href=\"\" class=\"home\">{{userProfile.person.firstname}} {{userProfile.person.lastname}}</a></li>\n" +
    "    </ol>\n" +
    "    <div class=\"page-header\">\n" +
    "        <h2>Faculty/Staff Profile</h2>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row staff-profile\">\n" +
    "        <div class=\"hidden-xs col-md-3\">\n" +
    "            <img class=\"staff-portrait thumbnail\" ng-src=\"{{userProfile.person.photo}}\" ng-if=\"userProfile.person.photo\">\n" +
    "            <img class=\"staff-portrait thumbnail\" ng-src=\"wp-content/themes/roots-ualib/assets/img/user-profile.png\" ng-if=\"!userProfile.person.photo\">\n" +
    "        </div>\n" +
    "        <div class=\"col-md-9\">\n" +
    "            <div class=\"name-plate\">\n" +
    "                <h1 class=\"name\">\n" +
    "                    <small ng-if=\"userProfile.person.rank\">{{userProfile.person.rank}}</small>\n" +
    "                    <span ng-bind-html=\"userProfile.person.firstname\"></span> <span ng-bind-html=\"userProfile.person.lastname\"></span>\n" +
    "                </h1>\n" +
    "                <h2 class=\"title\"><span ng-bind-html=\"userProfile.person.title\"></span></h2>\n" +
    "                <h3 class=\"hidden-xs\"><span ng-bind-html=\"userProfile.person.department\"></span></h3>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"page-slice\">\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <ul class=\"fa-ul\">\n" +
    "                            <li ng-if=\"userProfile.person.phone\"><span class=\"fa fa-phone fa-li\"></span><a ng-href=\"tel:+1-{{userProfile.person.phone}}\">{{userProfile.person.phone}}</a></li>\n" +
    "                            <li class=\"hidden-xs\" ng-if=\"userProfile.person.fax\"><span class=\"fa fa-fax fa-li\"></span>{{userProfile.person.fax}}</li>\n" +
    "                            <li ng-if=\"userProfile.person.email\"><span class=\"fa fa-envelope fa-li\"></span>\n" +
    "                                <a href=\"mailto:{{userProfile.person.email}}\">{{userProfile.person.email}}</a>\n" +
    "                            </li>\n" +
    "                            <li ng-if=\"userProfile.person.website.length > 11\"><span class=\"fa fa-external-link-square fa-li\"></span>\n" +
    "                                <a ng-href=\"{{userProfile.person.website}}\" class=\"external-link\">Personal website</a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <ul class=\"fa-ul\">\n" +
    "                            <li ng-if=\"userProfile.person.resume.length > 11\"><span class=\"fa fa-file-text fa-li\"></span>\n" +
    "                                <a ng-href=\"{{userProfile.person.resume}}\">Resume / CV</a>\n" +
    "                            </li>\n" +
    "                            <li ng-if=\"userProfile.person.social1\">\n" +
    "                                <span class=\"{{userProfile.person.snClass1}}\"></span>\n" +
    "                                <a ng-href=\"{{userProfile.person.social1}}\" class=\"external-link\">{{userProfile.person.snTitle1}}</a>\n" +
    "                            </li>\n" +
    "                            <li ng-if=\"userProfile.person.social2\">\n" +
    "                                <span class=\"{{userProfile.person.snClass2}}\"></span>\n" +
    "                                <a ng-href=\"{{userProfile.person.social2}}\" class=\"external-link\">{{userProfile.person.snTitle2}}</a>\n" +
    "                            </li>\n" +
    "                            <li ng-if=\"userProfile.person.social3\">\n" +
    "                                <span class=\"{{userProfile.person.snClass3}}\"></span>\n" +
    "                                <a ng-href=\"{{userProfile.person.social3}}\" class=\"external-link\">{{userProfile.person.snTitle3}}</a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <span ng-bind-html=\"userProfile.person.profile\"></span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>");
}]);
;/**
 * @ngdoc overview
 * @name index
 *
 * @description
 * # Staff Directory App
 * ## default route: [/#/staffdir](http://www.lib.ua.edu/#/staffdir)
 */
/**
 * @ngdoc overview
 * @name staffdir
 *
 * @requires ngRoute
 * @requires ngResource
 * @requires ngAnimate
 * @requires ngSanitize
 * @requires angular-filter
 * @requires ui-bootstrap
 * @requires angularLazyImg
 * @requires ualib-ui
 *
 * @description
 * # Staff Directory App
 * ## default route: [/#/staffdir](http://www.lib.ua.edu/#/staffdir)
 */

angular.module('ualib.staffdir', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngSanitize',
    'angular.filter',
    'ui.bootstrap',
    'ualib.ui',
    'ualib.staffdir.templates'
]);


//Alias for demo purposes
angular.module('staffdir', ['ualib.staffdir']);
;angular.module('ualib.staffdir')

    // Capture any existing URL facet parameters.
    .run(['StaffDirectoryService', '$location', '$rootScope', function(SDS, $location, $rootScope){
        $rootScope.$on('$locationChangeStart', function(ev, next, last){
            //console.log(arguments);
            //console.log($location.path());
            if ($location.path() === '/staffdir'){
                var params = $location.search();
                for (var param in params){
                    //TODO: This must be temporary. Any URI param will cause the facet bar to display on load!!
                    if (!SDS.showFacetBar && !SDS.facetExceptions.hasOwnProperty(param)) {
                        SDS.showFacetBar = true;
                    }
                    SDS.facet[param] = params[param];
                }
            }
        });
    }])

    .service('StaffDirectoryService', ['$location', '$rootScope', function($location, $rootScope){
        var self = this; //ensures proper contest in closure statements
        this.sortReverse = false; // Default sort direction
        this.sortable = {}; // reference object for sortable columns
        this.facet = {}; // Object to hold filter values based on available facets (empty object means no filtering).
        this.facetExceptions = {sortBy: 'lastname', search: '', page: 1};
        this.pager =  {
            page: 1,
            perPage: 20,
            maxSize: 10,
            totalItems: 0
        };

        //TODO: handle this variable through a central route/event instead of on a function-by-function basis
        this.showFacetBar = false;

        // Accepts string or array arguments of facets to clear
        this.clearFacets = function(){
            var args = arguments.length ? arguments : Object.keys(self.facet);
            var omitKeys = Array.prototype.concat.apply(Array.prototype, args);
            var test ={}, copy = {};

            Object.keys(self.facet).map(function(key){
                if (self.facetExceptions.hasOwnProperty(key)){
                    copy[key] = self.facetExceptions[key];
                    $location.search(key, null);
                }
                else if (omitKeys.indexOf(key) === -1) {
                    copy[key] = self.facet[key];
                    test[key] = self.facet[key];
                }
                else{
                    $location.search(key, null);
                }

            });

            self.showFacetBar = !isEmptyObj(test);
            self.facet = angular.copy(copy);

            $rootScope.$broadcast('facetsChange');
        };
        
        this.changeFacet = function(facet){
            var val = (self.facet.hasOwnProperty(facet) && self.facet[facet] !== '' && self.facet[facet] !== false) ? self.facet[facet] : null;
            $location.search(facet, val);
            $location.replace();
            self.showFacetBar = !isEmptyObj(self.facet);
            $rootScope.$broadcast('facetsChange', facet);

        };

        this.specialtyType = function(staff){
            var type = (self.facet.selector | self.facet.instructor);
            if (type){
                return staff.subjects.filter(function(subj){
                        var isType = (subj.type & type) === type;
                        if (type === 3){
                            return self.facet.subject ? (self.facet.subject === subj.subject) && subj.type > 0 : subj.type > 0;
                        }
                        return self.facet.subject ? (self.facet.subject === subj.subject) && isType : isType;
                    }).length > 0;
            }
            return true;
        };

        function isEmptyObj(obj){
            var name;
            for (name in obj){
                if (obj[name] && !self.facetExceptions.hasOwnProperty(name)){
                    return false;
                }
            }
            return true;
        }

    }]);;angular.module('ualib.staffdir')

    /**
     * @ngdoc service
     * @name staffdir.StaffFactory
     *
     * @requires $resource
     * @requires $http
     * @requires $filter
     *
     * @description
     * Factory service to get staff directory info from the API.
     */

    .factory('StaffFactory', ['$resource', '$filter', '$http', function($resource, $filter, $http){
        //TODO: centralize this function so it can be used with all apps
        // Extend the default responseTransform array - Straight from Angular 1.2.8 API docs - //docs.angularjs.org/api/ng/service/$http#overriding-the-default-transformations-per-request
        function appendTransform(defaults, transform) {

            // We can't guarantee that the default transformation is an array
            defaults = angular.isArray(defaults) ? defaults : [defaults];

            // Append the new transformation to the defaults
            return defaults.concat(transform);
        }

        return {
            /**
             * @ngdoc object
             * @name staffdir.StaffFactory:directory
             * @methodOf staffdir.StaffFactory
             *
             * @description
             * Gets full list of library faculty and staff
             *
             * @example
             * <pre>
             *      var list = StaffFactory.directory().get()
                        .$promise.then(function(data){
                            return data;
                        }, function(data, status){
                            console.log('Error' + status + ': ' + data);
                            return staff;
                        });
             * </pre>
             *
             * @returns {Promise} $resource promise
             */
            directory: function(){
                return $resource('//wwwdev2.lib.ua.edu/staffDir/api/people', {}, {
                    get: {
                        cache: true,
                        method: 'GET',
                        transformResponse: appendTransform($http.defaults.transformResponse, function(d){
                            // temporary fix. Not sustainable to manually remove arbitrary fields from API for different views
                            // TODO: work out proper API output for each view
                            var toRemove = ['division', 'prefix', 'website','resume','social1','social2','social3'];

                            var data = angular.fromJson(d);
                            var staff = {
                                list: [], // Array for directory listing
                                facets: {} //Object for available facets
                            };

                            // Build new object of only subject that currently have a subject/research expert
                            var subj = [];
                            var list = [];
                            angular.forEach(data.list, function(val){
                                // Remove all properties listed in the toRemove array
                                var newVal = {};
                                for (var prop in val){
                                    if (val.hasOwnProperty(prop) && toRemove.indexOf(prop) === -1){
                                        newVal[prop] = val[prop];
                                    }
                                }
                                val = newVal;

                                val.photo = val.photo || "https://www.lib.ua.edu/wp-content/themes/roots-ualib/assets/img/user-profile.png";
                                //Overwrite "profile" text so its not searchable, set it as a boolean so the tpl knows if to link to a profile
                                if (val.profile){
                                    val.profile = true;
                                }


                                var rx = /^([\w-]+(?:\.[\w-]+)*)/;
                                var prefix = val.email.match(rx);
                                //added in order to prevent crashes from empty email address
                                if (prefix !== null) {
                                    val.emailPrefix = prefix[0];
                                }

                                //preset alpha index values base on first and last name
                                /*val.alphaIndex = {};
                                val.alphaIndex.lastname = val.lastname.charAt(0).toUpperCase();
                                val.alphaIndex.firstname = val.firstname.charAt(0).toUpperCase();*/

                                list.push(val);

                                if (angular.isDefined(val.subjects) && val.subjects.length > 0){
                                    angular.forEach(val.subjects, function(subject){
                                        subj.push(subject);
                                    });
                                }
                            });
                            subj = $filter('unique')(subj, 'subject');
                            subj = $filter('orderBy')(subj, 'subject');
                            staff.facets.subjects = subj.map(function(s){
                                return s.subject;
                            });
                            // get libraries
                            staff.facets.libraries = data.libraries.map(function(lib){
                                return lib.name;
                            });

                            // get libraries
                            staff.facets.departments = data.departments.map(function(dept){
                                return dept.name;
                            });

                            // get list of people
                            staff.list = list;

                            return staff;
                        })
                    }
                });
            },
            /**
             * @ngdoc object
             * @name staffdir.StaffFactory:byEmail
             * @methodOf staffdir.StaffFactory
             *
             * @param {object} email Email param object
             * @param {string} email.email Faculty/staff member's email address
             *
             * @description
             * Gets faculty/staff info by email
             *
             * @example
             * <pre>
             *      var person = StaffFactory.email().get({email: 'email@addres.com'})
                        .$promise.then(function(data){
                            return data;
                        }, function(data, status){
                            console.log('Error' + status + ': ' + data);
                            return staff;
                        });
             * </pre>
             *
             * @returns {Promise} $resource promise
             */
            byEmail: function(){
                return $resource('//wwwdev2.lib.ua.edu/staffDir/api/people/search/email/:email', {}, {cache: true});
            },
            /**
             * @ngdoc object
             * @name staffdir.StaffFactory:byName
             * @methodOf staffdir.StaffFactory
             *
             * @param {object} name Name param object
             * @param {string} name.firstname Faculty/staff member's first name
             * @param {string} name.lastname Faculty/staff member's last name
             *
             * @description
             * Gets faculty/staff info by full name.
             *
             * @example
             * <pre>
             *      var person = StaffFactory.email().get({firstname: 'Malcolm', lastname: 'Reynolds'})
                        .$promise.then(function(data){
                            return data;
                        }, function(data, status){
                            console.log('Error' + status + ': ' + data);
                            return staff;
                        });
             * </pre>
             *
             * @returns {Promise} $resource promise
             */
            byName: function(){
                return $resource('//wwwdev2.lib.ua.edu/staffDir/api/people/search/firstname/:firstname/lastname/:lastname', {}, {cache: true});
            },
            /**
             * @ngdoc object
             * @name staffdir.StaffFactory:byId
             * @methodOf staffdir.StaffFactory
             *
             * @param {object} id ID param object
             * @param {number} id.id Faculty/staff member's ID (in the API database)
             *
             * @description
             * Gets faculty/staff info by ID (in the API database).
             *
             * @example
             * <pre>
             *      var person = StaffFactory.email().get({id: 2468})
                        .$promise.then(function(data){
                            return data;
                        }, function(data, status){
                            console.log('Error' + status + ': ' + data);
                            return staff;
                        });
             * </pre>
             *
             * @returns {Promise} $resource promise
             */
            byId: function(){
                return $resource('//wwwdev2.lib.ua.edu/staffDir/api/people/search/id/:id', {}, {cache: true});
            },
            /**
             * @ngdoc object
             * @name staffdir.StaffFactory:profile
             * @methodOf staffdir.StaffFactory
             *
             * @param {object} id ID param object
             * @param {number} id.id Faculty/staff member's ID (in the API database)
             *
             * @description
             * Gets faculty/staff info by ID (in the API database).
             *
             * @example
             * <pre>
             *      var person = StaffFactory.email().get({id: 2468})
                    .$promise.then(function(data){
                            return data;
                        }, function(data, status){
                            console.log('Error' + status + ': ' + data);
                            return staff;
                        });
             * </pre>
             *
             * @returns {Promise} $resource promise
             */
            profile: function(){
                return $resource('//wwwdev2.lib.ua.edu/staffDir/api/profile/:login', {}, {cache: true});
            }
        };
    }]);;angular.module('ualib.staffdir')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/staffdir/cardlist', {
            template: '<div class="staff-card-list"></div>'
        });
    }])

    .directive('staffCardList', ['StaffFactory', function(StaffFactory){
        return {
            restrict: 'AC',
            templateUrl: 'staff-card/staff-card-list.tpl.html',
            controller: ['$scope', function($scope){
                $scope.staffdir = {};

                StaffFactory.directory().get()
                    .$promise.then(function(data){
                        // get list of people
                        $scope.staffdir = data.list;

                    }, function(){
                        console.log('Staffdir Error -- Come on, put in proper error handling already');
                    });
            }]
        };
    }])

    .directive('staffCard', ['StaffFactory', function(StaffFactory){
        return {
            restrict: 'EA',
            scope: {
                person: '@',
                size: '@'
            },
            templateUrl: function(tElem, tAttrs){
                var tpl = 'staff-card/';

                switch (tAttrs.size){
                    case 'sm':
                        tpl += 'staff-card-sm.tpl.html';
                        break;
                    default:
                        tpl += 'staff-card-md.tpl.html';
                }

                return tpl;
            },
            link: function(scope, elm){
                //console.log(scope.person);
                if (angular.isDefined(scope.person)){
                    scope.info = {};


                    if (angular.isNumber(scope.person)){
                        StaffFactory.byId().get({id: scope.person})
                            .$promise.then(function(data){
                                scope.staffPerson = data.list[0];
                            }, function(){
                                console.log('Staffdir Error -- Come on, put in proper error handling already');
                            });
                    }
                    else {
                        var p = scope.person.split(/\s/);

                        if (p.length > 1){
                            //console.log({firstname: p[0], lastname: p[1]});
                            StaffFactory.byName().get({firstname: p[0], lastname: p[1]})
                                .$promise.then(function(data){
                                    scope.staffPerson = data.list[0];
                                }, function(){
                                    console.log('Staffdir Error -- Come on, put in proper error handling already');
                                });
                        }
                        else {
                            StaffFactory.byEmail().get({email: p[0]})
                                .$promise.then(function(data){
                                    scope.staffPerson = data.list[0];
                                }, function(){
                                    console.log('Staffdir Error -- Come on, put in proper error handling already');
                                });
                        }
                    }

                }
            }
        };
    }]);

;angular.module('ualib.staffdir')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/staffdir', {
            reloadOnSearch: false,
            controller: 'StaffDirCtrl',
            templateUrl: 'staff-directory/staff-directory.tpl.html',
            resolve: {
                StaffDir: ['StaffFactory', function(StaffFactory){

                    return StaffFactory.directory().get()
                        .$promise.then(function(data){
                            return data;
                        }, function(data, status){
                            console.log('Error' + status + ': ' + data);
                            return staff;
                        });
                }]
            }
        });
    }])

    .controller('StaffDirCtrl', ['$scope', 'StaffDir', 'StaffDirectoryService', function($scope, StaffDir, SDS){
        $scope.staffdir = StaffDir;
        $scope.facets = SDS;
        SDS.pager.totalItems = StaffDir.list.length;

    }])

    .directive('staffDirectoryListing', ['StaffDirectoryService', '$document', '$filter', function(SDS, $document, $filter){
        return {
            restrict: 'AC',
            scope: {
                list: '=',
                sortBy: '@'
            },
            templateUrl: 'staff-card/staff-card-list.tpl.html',
            controller: ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout){
                $scope.filteredList = $scope.list;
                $scope.staffdir = SDS;


                //TODO: temporary work around because CMS file handling is dumb. Need to fix and make sustainable
                $scope.placeholder = 'https://www.lib.ua.edu/wp-content/themes/roots-ualib/assets/img/user-profile.png';


                //If sortby hasn't been defined in URI, check it default defined with directive
                if (angular.isUndefined(SDS.facet.sortBy)){
                    $scope.staffdir.facet.sortBy = angular.isDefined($scope.sortBy) ? $scope.sortBy : 'lastname';
                }


                // Update listing when SDS broadcasts "facetsChange" event
                var facetsListener = $scope.$on('facetsChange', function(){
                    updateList();
                });                

                function updatePager(totalItems){
                    SDS.pager.totalItems = totalItems;
                    var numPages =  Math.floor(SDS.pager.totalItems / SDS.pager.maxSize);
                    if (numPages < SDS.pager.page){
                        SDS.pager.page = numPages || 1;
                    }
                    SDS.pager.firstItem = (SDS.pager.page-1)*SDS.pager.perPage+1;
                    SDS.pager.lastItem = Math.min(SDS.pager.totalItems, (SDS.pager.page * SDS.pager.perPage));
                    $document.duScrollTo(0, 30, 500, function (t) { return (--t)*t*t+1; });
                }

                function updateList(){
                    $scope.filteredList = filterList($scope.list);
                }

                function filterList(list){
                    for (var facet in SDS.facet){
                        switch (facet){
                            case 'department':
                            case 'library':
                                list = $filter('filterBy')(list, [facet], SDS.facet[facet]);
                                break;
                            case 'selector':
                            case 'instructor':
                                list = $filter('filter')(list, SDS.specialtyType);
                                break;
                            case 'subject':
                                list = $filter('filter')(list, SDS.facet[facet], true);
                                //console.log(facet+'s.'+facet);
                                //console.log(list);
                                break;
                            case 'sortBy':
                                list = $filter('orderBy')(list, SDS.facet[facet], SDS.sortReverse);
                                break;
                            default:
                                list = $filter('filter')(list, SDS.facet[facet]);
                        }
                    }
                    updatePager(list.length);
                    return list;
                }

                $scope.$on('$destroy', function(){
                    facetsListener();
                });

            }]
        };
    }])

    .directive('staffDirectoryFacets', ['StaffDirectoryService', function(SDS){
        return {
            restrict: 'AC',
            scope: {
                facets: '='
            },
            templateUrl: 'staff-directory/staff-directory-facets.tpl.html',
            controller: ['$scope', function($scope){
                $scope.staffdir = SDS;
            }]
        };
    }])

    .filter('alphaIndex', function(){
        return function(items, indexProp){
            var alphaIndexed = items.map(function(item){
                item.alphaIndex = item[indexProp].charAt(0).toUpperCase();
                return item;
            });
            return alphaIndexed;
        };
    });;angular.module('ualib.staffdir')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/staffdir/:email', {
            template: function(params) {
                return '<div class="staff-faculty-profile" email="' + params.email + '"></div>';
            }
        });
    }])

    .directive('staffFacultyProfile', ['StaffFactory', function(StaffFactory){
        return {
            restrict: 'AC',
            scope:{
                login: '@email'
            },
            templateUrl: 'staff-profile/staff-profile.tpl.html',
            controller: ['$scope', function($scope){
                $scope.userProfile = {};

                //console.log("Login: " + $scope.login);

                StaffFactory.profile().get({login: $scope.login})
                    .$promise.then(function(data){
                        for (var i = 1; i < 4; i++) {
                            if (data.person["social" + i] !== null) {
                                data.person["snClass" + i] = "fa fa-user fa-li";
                                data.person["snTitle" + i] = "Social Network";
                                if (data.person["social" + i].toLowerCase().indexOf("facebook.com") > 0) {
                                    data.person["snClass" + i] = "fa fa-facebook fa-li";
                                    data.person["snTitle" + i] = "Facebook";
                                }
                                if (data.person["social" + i].toLowerCase().indexOf("twitter.com") > 0) {
                                    data.person["snClass" + i] = "fa fa-twitter fa-li";
                                    data.person["snTitle" + i] = "Twitter";
                                }
                                if (data.person["social" + i].toLowerCase().indexOf("linkedin.com") > 0) {
                                    data.person["snClass" + i] = "fa fa-linkedin fa-li";
                                    data.person["snTitle" + i] = "LinkedIn";
                                }
                                if (data.person["social" + i].toLowerCase().indexOf("vk.com") > 0) {
                                    data.person["snClass" + i] = "fa fa-vk fa-li";
                                    data.person["snTitle" + i] = "VK";
                                }
                                if (data.person["social" + i].toLowerCase().indexOf("plus.google.com") > 0) {
                                    data.person["snClass" + i] = "fa fa-google-plus fa-li";
                                    data.person["snTitle" + i] = "Google Plus";
                                }
                                if (data.person["social" + i].toLowerCase().indexOf("instagram.com") > 0) {
                                    data.person["snClass" + i] = "fa fa-instagram fa-li";
                                    data.person["snTitle" + i] = "Instagram";
                                }
                                if (data.person["social" + i].toLowerCase().indexOf("youtube.com") > 0) {
                                    data.person["snClass" + i] = "fa fa-youtube fa-li";
                                    data.person["snTitle" + i] = "Youtube";
                                }
                            }
                        }
                        $scope.userProfile = data;
                        //console.dir(data);
                    }, function(data){
                        console.log('Error: cold not get profile! ' + data);
                    });
            }]
        };
    }]);

