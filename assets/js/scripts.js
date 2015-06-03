/**
 * Bunch of useful filters for angularJS(with no external dependencies!)
 * @version v0.5.4 - 2015-02-20 * @link https://github.com/a8m/angular-filter
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
  return isArray(object) ? object :
    Object.keys(object).map(function(key) {
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

        collection = (isObject(collection))
          ? toArray(collection)
          : collection;

        if(!isArray(collection) || isUndefined(object))
          return collection;

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
        collection = (isObject(collection))
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

      collection = (isObject(collection))
        ? toArray(collection)
        : collection;

      if(!isArray(collection) || isUndefined(object))
        return collection;

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
        collection = (isObject(collection))
          ? toArray(collection)
          : collection;

        return (isArray(collection))
          ? collection.slice(0, (!count) ? count : --count)
          : collection;
      }
    });

/**
 * @ngdoc filter
 * @name concat
 * @kind function
 *
 * @description
 * get (array/object, object/array) and return merged collection
 */
angular.module('a8m.concat', [])
  //TODO(Ariel):unique option ? or use unique filter to filter result
  .filter('concat', [function () {
    return function (collection, joined) {

      if (isUndefined(joined)) {
        return collection;
      }
      if (isArray(collection)) {
        return (isObject(joined))
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

function containsFilter( $parse ) {
    return function (collection, expression) {

      collection = (isObject(collection)) ? toArray(collection) : collection;

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

      collection = (isObject(collection)) ? toArray(collection) : collection;

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
      collection = (isObject(collection)) ? toArray(collection) : collection;

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

      collection = (isObject(collection)) ? toArray(collection) : collection;

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

      collection = (isObject(collection))
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
      collection = (isObject(collection))
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

      collection = (isObject(collection)) ? toArray(collection) : collection;

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

      collection = (isObject(collection)) ? toArray(collection) : collection;

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

      var getterFn = $parse(property);

      return filterWatcher.isMemoized('groupBy', arguments) ||
        filterWatcher.memoize('groupBy', arguments, this,
          _groupBy(collection, getterFn));

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
      return (isObject(collection))
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
      if (isUndefined(delimiter)) {
        delimiter = ' ';
      }

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

      reversed = (isObject(reversed))
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

      collection = (isObject(collection))
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

      collection = (isObject(collection))
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
 * @name omit
 * @kind function
 *
 * @description
 * filter collection by expression
 */

angular.module('a8m.pick', [])

  .filter('pick', ['$parse', function($parse) {
    return function (collection, expression) {

      collection = (isObject(collection))
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

      collection = (isObject(collection)) ? toArray(collection) : collection;

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
        input = (isObject(input)) ? toArray(input) : input;

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

      collection = (isObject(collection)) ? toArray(collection) : collection;

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

      collection = (isObject(collection)) ? toArray(collection) : collection;

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

      if(isUndefined(object)) {
        return collection;
      }
      collection = (isObject(collection))
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

      col1 = (isObject(col1)) ? toArray(col1) : col1;
      col2 = (isObject(col2)) ? toArray(col2) : col2;

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

      var divider = (isString(input)) ? $window.Number(input) : input;
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
        return [fName, angular.toJson(args)]
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
       * if clear cache when the digest cycle end.
       */
      function cleanStateless() {
        $$timeout(function() {
          if(!$rootScope.$$phase)
            $$cache = {};
        });
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
})( window, window.angular );;/**
 * angular-ui-utils - Swiss-Army-Knife of AngularJS tools (with no external dependencies!)
 * @version v0.2.3 - 2015-03-30
 * @link http://angular-ui.github.com
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
angular.module('ui.alias', []).config(['$compileProvider', 'uiAliasConfig', function($compileProvider, uiAliasConfig){
  'use strict';

  uiAliasConfig = uiAliasConfig || {};
  angular.forEach(uiAliasConfig, function(config, alias){
    if (angular.isString(config)) {
      config = {
        replace: true,
        template: config
      };
    }
    $compileProvider.directive(alias, function(){
      return config;
    });
  });
}]);

/**
 * General-purpose Event binding. Bind any event not natively supported by Angular
 * Pass an object with keynames for events to ui-event
 * Allows $event object and $params object to be passed
 *
 * @example <input ui-event="{ focus : 'counter++', blur : 'someCallback()' }">
 * @example <input ui-event="{ myCustomEvent : 'myEventHandler($event, $params)'}">
 *
 * @param ui-event {string|object literal} The event to bind to as a string or a hash of events with their callbacks
 */
angular.module('ui.event',[]).directive('uiEvent', ['$parse',
  function ($parse) {
    'use strict';

    return function ($scope, elm, attrs) {
      var events = $scope.$eval(attrs.uiEvent);
      angular.forEach(events, function (uiEvent, eventName) {
        var fn = $parse(uiEvent);
        elm.bind(eventName, function (evt) {
          var params = Array.prototype.slice.call(arguments);
          //Take out first paramater (event object);
          params = params.splice(1);
          fn($scope, {$event: evt, $params: params});
          if (!$scope.$$phase) {
            $scope.$apply();
          }
        });
      });
    };
  }]);

/**
 * A replacement utility for internationalization very similar to sprintf.
 *
 * @param replace {mixed} The tokens to replace depends on type
 *  string: all instances of $0 will be replaced
 *  array: each instance of $0, $1, $2 etc. will be placed with each array item in corresponding order
 *  object: all attributes will be iterated through, with :key being replaced with its corresponding value
 * @return string
 *
 * @example: 'Hello :name, how are you :day'.format({ name:'John', day:'Today' })
 * @example: 'Records $0 to $1 out of $2 total'.format(['10', '20', '3000'])
 * @example: '$0 agrees to all mentions $0 makes in the event that $0 hits a tree while $0 is driving drunk'.format('Bob')
 */
angular.module('ui.format',[]).filter('format', function(){
  'use strict';

  return function(value, replace) {
    var target = value;
    if (angular.isString(target) && replace !== undefined) {
      if (!angular.isArray(replace) && !angular.isObject(replace)) {
        replace = [replace];
      }
      if (angular.isArray(replace)) {
        var rlen = replace.length;
        var rfx = function (str, i) {
          i = parseInt(i, 10);
          return (i >= 0 && i < rlen) ? replace[i] : str;
        };
        target = target.replace(/\$([0-9]+)/g, rfx);
      }
      else {
        angular.forEach(replace, function(value, key){
          target = target.split(':' + key).join(value);
        });
      }
    }
    return target;
  };
});

/**
 * Wraps the
 * @param text {string} haystack to search through
 * @param search {string} needle to search for
 * @param [caseSensitive] {boolean} optional boolean to use case-sensitive searching
 */
angular.module('ui.highlight',[]).filter('highlight', function () {
  'use strict';

  return function (text, search, caseSensitive) {
    if (text && (search || angular.isNumber(search))) {
      text = text.toString();
      search = search.toString();
      if (caseSensitive) {
        return text.split(search).join('<span class="ui-match">' + search + '</span>');
      } else {
        return text.replace(new RegExp(search, 'gi'), '<span class="ui-match">$&</span>');
      }
    } else {
      return text;
    }
  };
});

// modeled after: angular-1.0.7/src/ng/directive/ngInclude.js
angular.module('ui.include',[])
.directive('uiInclude', ['$http', '$templateCache', '$anchorScroll', '$compile',
                 function($http,   $templateCache,   $anchorScroll,   $compile) {
  'use strict';

  return {
    restrict: 'ECA',
    terminal: true,
    compile: function(element, attr) {
      var srcExp = attr.uiInclude || attr.src,
          fragExp = attr.fragment || '',
          onloadExp = attr.onload || '',
          autoScrollExp = attr.autoscroll;

      return function(scope, element) {
        var changeCounter = 0,
            childScope;

        var clearContent = function() {
          if (childScope) {
            childScope.$destroy();
            childScope = null;
          }

          element.html('');
        };

        function ngIncludeWatchAction() {
          var thisChangeId = ++changeCounter;
          var src = scope.$eval(srcExp);
          var fragment = scope.$eval(fragExp);

          if (src) {
            $http.get(src, {cache: $templateCache}).success(function(response) {
              if (thisChangeId !== changeCounter) { return; }

              if (childScope) { childScope.$destroy(); }
              childScope = scope.$new();

              var contents;
              if (fragment) {
                contents = angular.element('<div/>').html(response).find(fragment);
              }
              else {
                contents = angular.element('<div/>').html(response).contents();
              }
              element.html(contents);
              $compile(contents)(childScope);

              if (angular.isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                $anchorScroll();
              }

              childScope.$emit('$includeContentLoaded');
              scope.$eval(onloadExp);
            }).error(function() {
              if (thisChangeId === changeCounter) { clearContent(); }
            });
          } else { clearContent(); }
        }

        scope.$watch(fragExp, ngIncludeWatchAction);
        scope.$watch(srcExp, ngIncludeWatchAction);
      };
    }
  };
}]);

/**
 * Provides an easy way to toggle a checkboxes indeterminate property
 *
 * @example <input type="checkbox" ui-indeterminate="isUnkown">
 */
angular.module('ui.indeterminate',[]).directive('uiIndeterminate', [
  function () {
    'use strict';

    return {
      compile: function(tElm, tAttrs) {
        if (!tAttrs.type || tAttrs.type.toLowerCase() !== 'checkbox') {
          return angular.noop;
        }

        return function ($scope, elm, attrs) {
          $scope.$watch(attrs.uiIndeterminate, function(newVal) {
            elm[0].indeterminate = !!newVal;
          });
        };
      }
    };
  }]);

/**
 * Converts variable-esque naming conventions to something presentational, capitalized words separated by space.
 * @param {String} value The value to be parsed and prettified.
 * @param {String} [inflector] The inflector to use. Default: humanize.
 * @return {String}
 * @example {{ 'Here Is my_phoneNumber' | inflector:'humanize' }} => Here Is My Phone Number
 *          {{ 'Here Is my_phoneNumber' | inflector:'underscore' }} => here_is_my_phone_number
 *          {{ 'Here Is my_phoneNumber' | inflector:'variable' }} => hereIsMyPhoneNumber
 */
angular.module('ui.inflector',[]).filter('inflector', function () {
  'use strict';

  function tokenize(text) {
    text = text.replace(/([A-Z])|([\-|\_])/g, function(_, $1) { return ' ' + ($1 || ''); });
    return text.replace(/\s\s+/g, ' ').trim().toLowerCase().split(' ');
  }

  function capitalizeTokens(tokens) {
    var result = [];
    angular.forEach(tokens, function(token) {
      result.push(token.charAt(0).toUpperCase() + token.substr(1));
    });
    return result;
  }

  var inflectors = {
    humanize: function (value) {
      return capitalizeTokens(tokenize(value)).join(' ');
    },
    underscore: function (value) {
      return tokenize(value).join('_');
    },
    variable: function (value) {
      value = tokenize(value);
      value = value[0] + capitalizeTokens(value.slice(1)).join('');
      return value;
    }
  };

  return function (text, inflector) {
    if (inflector !== false && angular.isString(text)) {
      inflector = inflector || 'humanize';
      return inflectors[inflector](text);
    } else {
      return text;
    }
  };
});

/**
 * General-purpose jQuery wrapper. Simply pass the plugin name as the expression.
 *
 * It is possible to specify a default set of parameters for each jQuery plugin.
 * Under the jq key, namespace each plugin by that which will be passed to ui-jq.
 * Unfortunately, at this time you can only pre-define the first parameter.
 * @example { jq : { datepicker : { showOn:'click' } } }
 *
 * @param ui-jq {string} The $elm.[pluginName]() to call.
 * @param [ui-options] {mixed} Expression to be evaluated and passed as options to the function
 *     Multiple parameters can be separated by commas
 * @param [ui-refresh] {expression} Watch expression and refire plugin on changes
 *
 * @example <input ui-jq="datepicker" ui-options="{showOn:'click'},secondParameter,thirdParameter" ui-refresh="iChange">
 */
angular.module('ui.jq',[]).
  value('uiJqConfig',{}).
  directive('uiJq', ['uiJqConfig', '$timeout', function uiJqInjectingFunction(uiJqConfig, $timeout) {
  'use strict';


  return {
    restrict: 'A',
    compile: function uiJqCompilingFunction(tElm, tAttrs) {

      if (!angular.isFunction(tElm[tAttrs.uiJq])) {
        throw new Error('ui-jq: The "' + tAttrs.uiJq + '" function does not exist');
      }
      var options = uiJqConfig && uiJqConfig[tAttrs.uiJq];

      return function uiJqLinkingFunction(scope, elm, attrs) {

        // If change compatibility is enabled, the form input's "change" event will trigger an "input" event
        if (attrs.ngModel && elm.is('select,input,textarea')) {
          elm.bind('change', function() {
            elm.trigger('input');
          });
        }

        function createLinkOptions(){
          var linkOptions = [];

          // If ui-options are passed, merge (or override) them onto global defaults and pass to the jQuery method
          if (attrs.uiOptions) {
            linkOptions = scope.$eval('[' + attrs.uiOptions + ']');
            if (angular.isObject(options) && angular.isObject(linkOptions[0])) {
              linkOptions[0] = angular.extend({}, options, linkOptions[0]);
            }
          } else if (options) {
            linkOptions = [options];
          }
          return linkOptions;
        }

        // Call jQuery method and pass relevant options
        function callPlugin() {
          $timeout(function() {
            elm[attrs.uiJq].apply(elm, createLinkOptions());
          }, 0, false);
        }

        // If ui-refresh is used, re-fire the the method upon every change
        if (attrs.uiRefresh) {
          scope.$watch(attrs.uiRefresh, function() {
            callPlugin();
          });
        }
        callPlugin();
      };
    }
  };
}]);

angular.module('ui.keypress',[]).
factory('keypressHelper', ['$parse', function keypress($parse){
  'use strict';

  var keysByCode = {
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    27: 'esc',
    32: 'space',
    33: 'pageup',
    34: 'pagedown',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    45: 'insert',
    46: 'delete'
  };

  var capitaliseFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return function(mode, scope, elm, attrs) {
    var params, combinations = [];
    params = scope.$eval(attrs['ui'+capitaliseFirstLetter(mode)]);

    // Prepare combinations for simple checking
    angular.forEach(params, function (v, k) {
      var combination, expression;
      expression = $parse(v);

      angular.forEach(k.split(' '), function(variation) {
        combination = {
          expression: expression,
          keys: {}
        };
        angular.forEach(variation.split('-'), function (value) {
          combination.keys[value] = true;
        });
        combinations.push(combination);
      });
    });

    // Check only matching of pressed keys one of the conditions
    elm.bind(mode, function (event) {
      // No need to do that inside the cycle
      var metaPressed = !!(event.metaKey && !event.ctrlKey);
      var altPressed = !!event.altKey;
      var ctrlPressed = !!event.ctrlKey;
      var shiftPressed = !!event.shiftKey;
      var keyCode = event.keyCode;

      // normalize keycodes
      if (mode === 'keypress' && !shiftPressed && keyCode >= 97 && keyCode <= 122) {
        keyCode = keyCode - 32;
      }

      // Iterate over prepared combinations
      angular.forEach(combinations, function (combination) {

        var mainKeyPressed = combination.keys[keysByCode[keyCode]] || combination.keys[keyCode.toString()];

        var metaRequired = !!combination.keys.meta;
        var altRequired = !!combination.keys.alt;
        var ctrlRequired = !!combination.keys.ctrl;
        var shiftRequired = !!combination.keys.shift;

        if (
          mainKeyPressed &&
          ( metaRequired === metaPressed ) &&
          ( altRequired === altPressed ) &&
          ( ctrlRequired === ctrlPressed ) &&
          ( shiftRequired === shiftPressed )
        ) {
          // Run the function
          scope.$apply(function () {
            combination.expression(scope, { '$event': event });
          });
        }
      });
    });
  };
}]);

/**
 * Bind one or more handlers to particular keys or their combination
 * @param hash {mixed} keyBindings Can be an object or string where keybinding expression of keys or keys combinations and AngularJS Exspressions are set. Object syntax: "{ keys1: expression1 [, keys2: expression2 [ , ... ]]}". String syntax: ""expression1 on keys1 [ and expression2 on keys2 [ and ... ]]"". Expression is an AngularJS Expression, and key(s) are dash-separated combinations of keys and modifiers (one or many, if any. Order does not matter). Supported modifiers are 'ctrl', 'shift', 'alt' and key can be used either via its keyCode (13 for Return) or name. Named keys are 'backspace', 'tab', 'enter', 'esc', 'space', 'pageup', 'pagedown', 'end', 'home', 'left', 'up', 'right', 'down', 'insert', 'delete'.
 * @example <input ui-keypress="{enter:'x = 1', 'ctrl-shift-space':'foo()', 'shift-13':'bar()'}" /> <input ui-keypress="foo = 2 on ctrl-13 and bar('hello') on shift-esc" />
 **/
angular.module('ui.keypress').directive('uiKeydown', ['keypressHelper', function(keypressHelper){
  'use strict';

  return {
    link: function (scope, elm, attrs) {
      keypressHelper('keydown', scope, elm, attrs);
    }
  };
}]);

angular.module('ui.keypress').directive('uiKeypress', ['keypressHelper', function(keypressHelper){
  'use strict';

  return {
    link: function (scope, elm, attrs) {
      keypressHelper('keypress', scope, elm, attrs);
    }
  };
}]);

angular.module('ui.keypress').directive('uiKeyup', ['keypressHelper', function(keypressHelper){
  'use strict';

  return {
    link: function (scope, elm, attrs) {
      keypressHelper('keyup', scope, elm, attrs);
    }
  };
}]);

/*
 Attaches input mask onto input element
 */
angular.module('ui.mask', [])
  .value('uiMaskConfig', {
    'maskDefinitions': {
      '9': /\d/,
      'A': /[a-zA-Z]/,
      '*': /[a-zA-Z0-9]/
    },
    'clearOnBlur': true
  })
  .directive('uiMask', ['uiMaskConfig', '$parse', function (maskConfig, $parse) {
    'use strict';

    return {
      priority: 100,
      require: 'ngModel',
      restrict: 'A',
      compile: function uiMaskCompilingFunction(){
        var options = maskConfig;

        return function uiMaskLinkingFunction(scope, iElement, iAttrs, controller){
          var maskProcessed = false, eventsBound = false,
            maskCaretMap, maskPatterns, maskPlaceholder, maskComponents,
          // Minimum required length of the value to be considered valid
            minRequiredLength,
            value, valueMasked, isValid,
          // Vars for initializing/uninitializing
            originalPlaceholder = iAttrs.placeholder,
            originalMaxlength = iAttrs.maxlength,
          // Vars used exclusively in eventHandler()
            oldValue, oldValueUnmasked, oldCaretPosition, oldSelectionLength;

          function initialize(maskAttr){
            if (!angular.isDefined(maskAttr)) {
              return uninitialize();
            }
            processRawMask(maskAttr);
            if (!maskProcessed) {
              return uninitialize();
            }
            initializeElement();
            bindEventListeners();
            return true;
          }

          function initPlaceholder(placeholderAttr) {
            if(! angular.isDefined(placeholderAttr)) {
              return;
            }

            maskPlaceholder = placeholderAttr;

            // If the mask is processed, then we need to update the value
            if (maskProcessed) {
              eventHandler();
            }
          }

          function formatter(fromModelValue){
            if (!maskProcessed) {
              return fromModelValue;
            }
            value = unmaskValue(fromModelValue || '');
            isValid = validateValue(value);
            controller.$setValidity('mask', isValid);
            return isValid && value.length ? maskValue(value) : undefined;
          }

          function parser(fromViewValue){
            if (!maskProcessed) {
              return fromViewValue;
            }
            value = unmaskValue(fromViewValue || '');
            isValid = validateValue(value);
            // We have to set viewValue manually as the reformatting of the input
            // value performed by eventHandler() doesn't happen until after
            // this parser is called, which causes what the user sees in the input
            // to be out-of-sync with what the controller's $viewValue is set to.
            controller.$viewValue = value.length ? maskValue(value) : '';
            controller.$setValidity('mask', isValid);
            if (value === '' && iAttrs.required) {
                controller.$setValidity('required', !controller.$error.required);
            }
            return isValid ? value : undefined;
          }

          var linkOptions = {};

          if (iAttrs.uiOptions) {
            linkOptions = scope.$eval('[' + iAttrs.uiOptions + ']');
            if (angular.isObject(linkOptions[0])) {
              // we can't use angular.copy nor angular.extend, they lack the power to do a deep merge
              linkOptions = (function(original, current){
                for(var i in original) {
                  if (Object.prototype.hasOwnProperty.call(original, i)) {
                    if (current[i] === undefined) {
                      current[i] = angular.copy(original[i]);
                    } else {
                      angular.extend(current[i], original[i]);
                    }
                  }
                }
                return current;
              })(options, linkOptions[0]);
            }
          } else {
            linkOptions = options;
          }

          iAttrs.$observe('uiMask', initialize);
          iAttrs.$observe('placeholder', initPlaceholder);
          var modelViewValue = false;
          iAttrs.$observe('modelViewValue', function(val) {
            if(val === 'true') {
              modelViewValue = true;
            }
          });
          scope.$watch(iAttrs.ngModel, function(val) {
            if(modelViewValue && val) {
              var model = $parse(iAttrs.ngModel);
              model.assign(scope, controller.$viewValue);
            }
          });
          controller.$formatters.push(formatter);
          controller.$parsers.push(parser);

          function uninitialize(){
            maskProcessed = false;
            unbindEventListeners();

            if (angular.isDefined(originalPlaceholder)) {
              iElement.attr('placeholder', originalPlaceholder);
            } else {
              iElement.removeAttr('placeholder');
            }

            if (angular.isDefined(originalMaxlength)) {
              iElement.attr('maxlength', originalMaxlength);
            } else {
              iElement.removeAttr('maxlength');
            }

            iElement.val(controller.$modelValue);
            controller.$viewValue = controller.$modelValue;
            return false;
          }

          function initializeElement(){
            value = oldValueUnmasked = unmaskValue(controller.$viewValue || '');
            valueMasked = oldValue = maskValue(value);
            isValid = validateValue(value);
            var viewValue = isValid && value.length ? valueMasked : '';
            if (iAttrs.maxlength) { // Double maxlength to allow pasting new val at end of mask
              iElement.attr('maxlength', maskCaretMap[maskCaretMap.length - 1] * 2);
            }
            iElement.attr('placeholder', maskPlaceholder);
            iElement.val(viewValue);
            controller.$viewValue = viewValue;
            // Not using $setViewValue so we don't clobber the model value and dirty the form
            // without any kind of user interaction.
          }

          function bindEventListeners(){
            if (eventsBound) {
              return;
            }
            iElement.bind('blur', blurHandler);
            iElement.bind('mousedown mouseup', mouseDownUpHandler);
            iElement.bind('input keyup click focus', eventHandler);
            eventsBound = true;
          }

          function unbindEventListeners(){
            if (!eventsBound) {
              return;
            }
            iElement.unbind('blur', blurHandler);
            iElement.unbind('mousedown', mouseDownUpHandler);
            iElement.unbind('mouseup', mouseDownUpHandler);
            iElement.unbind('input', eventHandler);
            iElement.unbind('keyup', eventHandler);
            iElement.unbind('click', eventHandler);
            iElement.unbind('focus', eventHandler);
            eventsBound = false;
          }

          function validateValue(value){
            // Zero-length value validity is ngRequired's determination
            return value.length ? value.length >= minRequiredLength : true;
          }

          function unmaskValue(value){
            var valueUnmasked = '',
              maskPatternsCopy = maskPatterns.slice();
            // Preprocess by stripping mask components from value
            value = value.toString();
            angular.forEach(maskComponents, function (component){
              value = value.replace(component, '');
            });
            angular.forEach(value.split(''), function (chr){
              if (maskPatternsCopy.length && maskPatternsCopy[0].test(chr)) {
                valueUnmasked += chr;
                maskPatternsCopy.shift();
              }
            });
            return valueUnmasked;
          }

          function maskValue(unmaskedValue){
            var valueMasked = '',
                maskCaretMapCopy = maskCaretMap.slice();

            angular.forEach(maskPlaceholder.split(''), function (chr, i){
              if (unmaskedValue.length && i === maskCaretMapCopy[0]) {
                valueMasked  += unmaskedValue.charAt(0) || '_';
                unmaskedValue = unmaskedValue.substr(1);
                maskCaretMapCopy.shift();
              }
              else {
                valueMasked += chr;
              }
            });
            return valueMasked;
          }

          function getPlaceholderChar(i) {
            var placeholder = iAttrs.placeholder;

            if (typeof placeholder !== 'undefined' && placeholder[i]) {
              return placeholder[i];
            } else {
              return '_';
            }
          }

          // Generate array of mask components that will be stripped from a masked value
          // before processing to prevent mask components from being added to the unmasked value.
          // E.g., a mask pattern of '+7 9999' won't have the 7 bleed into the unmasked value.
          // If a maskable char is followed by a mask char and has a mask
          // char behind it, we'll split it into it's own component so if
          // a user is aggressively deleting in the input and a char ahead
          // of the maskable char gets deleted, we'll still be able to strip
          // it in the unmaskValue() preprocessing.
          function getMaskComponents() {
            return maskPlaceholder.replace(/[_]+/g, '_').replace(/([^_]+)([a-zA-Z0-9])([^_])/g, '$1$2_$3').split('_');
          }

          function processRawMask(mask){
            var characterCount = 0;

            maskCaretMap    = [];
            maskPatterns    = [];
            maskPlaceholder = '';

            if (typeof mask === 'string') {
              minRequiredLength = 0;

              var isOptional = false,
                  numberOfOptionalCharacters = 0,
                  splitMask  = mask.split('');

              angular.forEach(splitMask, function (chr, i){
                if (linkOptions.maskDefinitions[chr]) {

                  maskCaretMap.push(characterCount);

                  maskPlaceholder += getPlaceholderChar(i - numberOfOptionalCharacters);
                  maskPatterns.push(linkOptions.maskDefinitions[chr]);

                  characterCount++;
                  if (!isOptional) {
                    minRequiredLength++;
                  }
                }
                else if (chr === '?') {
                  isOptional = true;
                  numberOfOptionalCharacters++;
                }
                else {
                  maskPlaceholder += chr;
                  characterCount++;
                }
              });
            }
            // Caret position immediately following last position is valid.
            maskCaretMap.push(maskCaretMap.slice().pop() + 1);

            maskComponents = getMaskComponents();
            maskProcessed  = maskCaretMap.length > 1 ? true : false;
          }

          function blurHandler(){
            if (linkOptions.clearOnBlur) {
              oldCaretPosition = 0;
              oldSelectionLength = 0;
              if (!isValid || value.length === 0) {
                valueMasked = '';
                iElement.val('');
                scope.$apply(function () {
                  controller.$setViewValue('');
                });
              }
            }
          }

          function mouseDownUpHandler(e){
            if (e.type === 'mousedown') {
              iElement.bind('mouseout', mouseoutHandler);
            } else {
              iElement.unbind('mouseout', mouseoutHandler);
            }
          }

          iElement.bind('mousedown mouseup', mouseDownUpHandler);

          function mouseoutHandler(){
            /*jshint validthis: true */
            oldSelectionLength = getSelectionLength(this);
            iElement.unbind('mouseout', mouseoutHandler);
          }

          function eventHandler(e){
            /*jshint validthis: true */
            e = e || {};
            // Allows more efficient minification
            var eventWhich = e.which,
              eventType = e.type;

            // Prevent shift and ctrl from mucking with old values
            if (eventWhich === 16 || eventWhich === 91) { return;}

            var val = iElement.val(),
              valOld = oldValue,
              valMasked,
              valUnmasked = unmaskValue(val),
              valUnmaskedOld = oldValueUnmasked,
              valAltered = false,

              caretPos = getCaretPosition(this) || 0,
              caretPosOld = oldCaretPosition || 0,
              caretPosDelta = caretPos - caretPosOld,
              caretPosMin = maskCaretMap[0],
              caretPosMax = maskCaretMap[valUnmasked.length] || maskCaretMap.slice().shift(),

              selectionLenOld = oldSelectionLength || 0,
              isSelected = getSelectionLength(this) > 0,
              wasSelected = selectionLenOld > 0,

            // Case: Typing a character to overwrite a selection
              isAddition = (val.length > valOld.length) || (selectionLenOld && val.length > valOld.length - selectionLenOld),
            // Case: Delete and backspace behave identically on a selection
              isDeletion = (val.length < valOld.length) || (selectionLenOld && val.length === valOld.length - selectionLenOld),
              isSelection = (eventWhich >= 37 && eventWhich <= 40) && e.shiftKey, // Arrow key codes

              isKeyLeftArrow = eventWhich === 37,
            // Necessary due to "input" event not providing a key code
              isKeyBackspace = eventWhich === 8 || (eventType !== 'keyup' && isDeletion && (caretPosDelta === -1)),
              isKeyDelete = eventWhich === 46 || (eventType !== 'keyup' && isDeletion && (caretPosDelta === 0 ) && !wasSelected),

            // Handles cases where caret is moved and placed in front of invalid maskCaretMap position. Logic below
            // ensures that, on click or leftward caret placement, caret is moved leftward until directly right of
            // non-mask character. Also applied to click since users are (arguably) more likely to backspace
            // a character when clicking within a filled input.
              caretBumpBack = (isKeyLeftArrow || isKeyBackspace || eventType === 'click') && caretPos > caretPosMin;

            oldSelectionLength = getSelectionLength(this);

            // These events don't require any action
            if (isSelection || (isSelected && (eventType === 'click' || eventType === 'keyup'))) {
              return;
            }

            // Value Handling
            // ==============

            // User attempted to delete but raw value was unaffected--correct this grievous offense
            if ((eventType === 'input') && isDeletion && !wasSelected && valUnmasked === valUnmaskedOld) {
              while (isKeyBackspace && caretPos > caretPosMin && !isValidCaretPosition(caretPos)) {
                caretPos--;
              }
              while (isKeyDelete && caretPos < caretPosMax && maskCaretMap.indexOf(caretPos) === -1) {
                caretPos++;
              }
              var charIndex = maskCaretMap.indexOf(caretPos);
              // Strip out non-mask character that user would have deleted if mask hadn't been in the way.
              valUnmasked = valUnmasked.substring(0, charIndex) + valUnmasked.substring(charIndex + 1);
              valAltered = true;
            }

            // Update values
            valMasked = maskValue(valUnmasked);

            oldValue = valMasked;
            oldValueUnmasked = valUnmasked;
            iElement.val(valMasked);
            if (valAltered) {
              // We've altered the raw value after it's been $digest'ed, we need to $apply the new value.
              scope.$apply(function (){
                controller.$setViewValue(valUnmasked);
              });
            }

            // Caret Repositioning
            // ===================

            // Ensure that typing always places caret ahead of typed character in cases where the first char of
            // the input is a mask char and the caret is placed at the 0 position.
            if (isAddition && (caretPos <= caretPosMin)) {
              caretPos = caretPosMin + 1;
            }

            if (caretBumpBack) {
              caretPos--;
            }

            // Make sure caret is within min and max position limits
            caretPos = caretPos > caretPosMax ? caretPosMax : caretPos < caretPosMin ? caretPosMin : caretPos;

            // Scoot the caret back or forth until it's in a non-mask position and within min/max position limits
            while (!isValidCaretPosition(caretPos) && caretPos > caretPosMin && caretPos < caretPosMax) {
              caretPos += caretBumpBack ? -1 : 1;
            }

            if ((caretBumpBack && caretPos < caretPosMax) || (isAddition && !isValidCaretPosition(caretPosOld))) {
              caretPos++;
            }
            oldCaretPosition = caretPos;
            setCaretPosition(this, caretPos);
          }

          function isValidCaretPosition(pos){ return maskCaretMap.indexOf(pos) > -1; }

          function getCaretPosition(input){
            if (!input) return 0;
            if (input.selectionStart !== undefined) {
              return input.selectionStart;
            } else if (document.selection) {
              // Curse you IE
              input.focus();
              var selection = document.selection.createRange();
              selection.moveStart('character', input.value ? -input.value.length : 0);
              return selection.text.length;
            }
            return 0;
          }

          function setCaretPosition(input, pos){
            if (!input) return 0;
            if (input.offsetWidth === 0 || input.offsetHeight === 0) {
              return; // Input's hidden
            }
            if (input.setSelectionRange) {
              input.focus();
              input.setSelectionRange(pos, pos);
            }
            else if (input.createTextRange) {
              // Curse you IE
              var range = input.createTextRange();
              range.collapse(true);
              range.moveEnd('character', pos);
              range.moveStart('character', pos);
              range.select();
            }
          }

          function getSelectionLength(input){
            if (!input) return 0;
            if (input.selectionStart !== undefined) {
              return (input.selectionEnd - input.selectionStart);
            }
            if (document.selection) {
              return (document.selection.createRange().text.length);
            }
            return 0;
          }

          // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
          if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function (searchElement /*, fromIndex */){
              if (this === null) {
                throw new TypeError();
              }
              var t = Object(this);
              var len = t.length >>> 0;
              if (len === 0) {
                return -1;
              }
              var n = 0;
              if (arguments.length > 1) {
                n = Number(arguments[1]);
                if (n !== n) { // shortcut for verifying if it's NaN
                  n = 0;
                } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                  n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
              }
              if (n >= len) {
                return -1;
              }
              var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
              for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                  return k;
                }
              }
              return -1;
            };
          }

        };
      }
    };
  }
]);

/**
 * Add a clear button to form inputs to reset their value
 */
angular.module('ui.reset',[]).value('uiResetConfig',null).directive('uiReset', ['uiResetConfig', function (uiResetConfig) {
  'use strict';

  var resetValue = null;
  if (uiResetConfig !== undefined){
      resetValue = uiResetConfig;
  }
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      var aElement;
      aElement = angular.element('<a class="ui-reset" />');
      elm.wrap('<span class="ui-resetwrap" />').after(aElement);
      aElement.bind('click', function (e) {
        e.preventDefault();
        scope.$apply(function () {
          if (attrs.uiReset){
            ctrl.$setViewValue(scope.$eval(attrs.uiReset));
          }else{
            ctrl.$setViewValue(resetValue);
          }
          ctrl.$render();
        });
      });
    }
  };
}]);

/**
 * Set a $uiRoute boolean to see if the current route matches
 */
angular.module('ui.route', []).directive('uiRoute', ['$location', '$parse', function ($location, $parse) {
  'use strict';

  return {
    restrict: 'AC',
    scope: true,
    compile: function(tElement, tAttrs) {
      var useProperty;
      if (tAttrs.uiRoute) {
        useProperty = 'uiRoute';
      } else if (tAttrs.ngHref) {
        useProperty = 'ngHref';
      } else if (tAttrs.href) {
        useProperty = 'href';
      } else {
        throw new Error('uiRoute missing a route or href property on ' + tElement[0]);
      }
      return function ($scope, elm, attrs) {
        var modelSetter = $parse(attrs.ngModel || attrs.routeModel || '$uiRoute').assign;
        var watcher = angular.noop;

        // Used by href and ngHref
        function staticWatcher(newVal) {
          var hash = newVal.indexOf('#');
          if (hash > -1){
            newVal = newVal.substr(hash + 1);
          }
          watcher = function watchHref() {
            modelSetter($scope, ($location.path().indexOf(newVal) > -1));
          };
          watcher();
        }
        // Used by uiRoute
        function regexWatcher(newVal) {
          var hash = newVal.indexOf('#');
          if (hash > -1){
            newVal = newVal.substr(hash + 1);
          }
          watcher = function watchRegex() {
            var regexp = new RegExp('^' + newVal + '$', ['i']);
            modelSetter($scope, regexp.test($location.path()));
          };
          watcher();
        }

        switch (useProperty) {
          case 'uiRoute':
            // if uiRoute={{}} this will be undefined, otherwise it will have a value and $observe() never gets triggered
            if (attrs.uiRoute){
              regexWatcher(attrs.uiRoute);
            }else{
              attrs.$observe('uiRoute', regexWatcher);
            }
            break;
          case 'ngHref':
            // Setup watcher() every time ngHref changes
            if (attrs.ngHref){
              staticWatcher(attrs.ngHref);
            }else{
              attrs.$observe('ngHref', staticWatcher);
            }
            break;
          case 'href':
            // Setup watcher()
            staticWatcher(attrs.href);
        }

        $scope.$on('$routeChangeSuccess', function(){
          watcher();
        });

        //Added for compatibility with ui-router
        $scope.$on('$stateChangeSuccess', function(){
          watcher();
        });
      };
    }
  };
}]);

angular.module('ui.scroll.jqlite', ['ui.scroll']).service('jqLiteExtras', [
  '$log', '$window', function(console, window) {
    'use strict';

    return {
      registerFor: function(element) {
        var convertToPx, css, getMeasurements, getStyle, getWidthHeight, isWindow, scrollTo;
        css = angular.element.prototype.css;
        element.prototype.css = function(name, value) {
          var elem, self;
          self = this;
          elem = self[0];
          if (!(!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style)) {
            return css.call(self, name, value);
          }
        };
        isWindow = function(obj) {
          return obj && obj.document && obj.location && obj.alert && obj.setInterval;
        };
        scrollTo = function(self, direction, value) {
          var elem, method, preserve, prop, _ref;
          elem = self[0];
          _ref = {
            top: ['scrollTop', 'pageYOffset', 'scrollLeft'],
            left: ['scrollLeft', 'pageXOffset', 'scrollTop']
          }[direction], method = _ref[0], prop = _ref[1], preserve = _ref[2];
          if (isWindow(elem)) {
            if (angular.isDefined(value)) {
              return elem.scrollTo(self[preserve].call(self), value);
            } else {
              if (prop in elem) {
                return elem[prop];
              } else {
                return elem.document.documentElement[method];
              }
            }
          } else {
            if (angular.isDefined(value)) {
              return elem[method] = value;
            } else {
              return elem[method];
            }
          }
        };
        if (window.getComputedStyle) {
          getStyle = function(elem) {
            return window.getComputedStyle(elem, null);
          };
          convertToPx = function(elem, value) {
            return parseFloat(value);
          };
        } else {
          getStyle = function(elem) {
            return elem.currentStyle;
          };
          convertToPx = function(elem, value) {
            var core_pnum, left, result, rnumnonpx, rs, rsLeft, style;
            core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
            rnumnonpx = new RegExp('^(' + core_pnum + ')(?!px)[a-z%]+$', 'i');
            if (!rnumnonpx.test(value)) {
              return parseFloat(value);
            } else {
              style = elem.style;
              left = style.left;
              rs = elem.runtimeStyle;
              rsLeft = rs && rs.left;
              if (rs) {
                rs.left = style.left;
              }
              style.left = value;
              result = style.pixelLeft;
              style.left = left;
              if (rsLeft) {
                rs.left = rsLeft;
              }
              return result;
            }
          };
        }
        getMeasurements = function(elem, measure) {
          var base, borderA, borderB, computedMarginA, computedMarginB, computedStyle, dirA, dirB, marginA, marginB, paddingA, paddingB, _ref;
          if (isWindow(elem)) {
            base = document.documentElement[{
              height: 'clientHeight',
              width: 'clientWidth'
            }[measure]];
            return {
              base: base,
              padding: 0,
              border: 0,
              margin: 0
            };
          }
          _ref = {
            width: [elem.offsetWidth, 'Left', 'Right'],
            height: [elem.offsetHeight, 'Top', 'Bottom']
          }[measure], base = _ref[0], dirA = _ref[1], dirB = _ref[2];
          computedStyle = getStyle(elem);
          paddingA = convertToPx(elem, computedStyle['padding' + dirA]) || 0;
          paddingB = convertToPx(elem, computedStyle['padding' + dirB]) || 0;
          borderA = convertToPx(elem, computedStyle['border' + dirA + 'Width']) || 0;
          borderB = convertToPx(elem, computedStyle['border' + dirB + 'Width']) || 0;
          computedMarginA = computedStyle['margin' + dirA];
          computedMarginB = computedStyle['margin' + dirB];
          marginA = convertToPx(elem, computedMarginA) || 0;
          marginB = convertToPx(elem, computedMarginB) || 0;
          return {
            base: base,
            padding: paddingA + paddingB,
            border: borderA + borderB,
            margin: marginA + marginB
          };
        };
        getWidthHeight = function(elem, direction, measure) {
          var computedStyle, measurements, result;
          measurements = getMeasurements(elem, direction);
          if (measurements.base > 0) {
            return {
              base: measurements.base - measurements.padding - measurements.border,
              outer: measurements.base,
              outerfull: measurements.base + measurements.margin
            }[measure];
          } else {
            computedStyle = getStyle(elem);
            result = computedStyle[direction];
            if (result < 0 || result === null) {
              result = elem.style[direction] || 0;
            }
            result = parseFloat(result) || 0;
            return {
              base: result - measurements.padding - measurements.border,
              outer: result,
              outerfull: result + measurements.padding + measurements.border + measurements.margin
            }[measure];
          }
        };
        return angular.forEach({
          before: function(newElem) {
            var children, elem, i, parent, self, _i, _ref;
            self = this;
            elem = self[0];
            parent = self.parent();
            children = parent.contents();
            if (children[0] === elem) {
              return parent.prepend(newElem);
            } else {
              for (i = _i = 1, _ref = children.length - 1; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
                if (children[i] === elem) {
                  angular.element(children[i - 1]).after(newElem);
                  return;
                }
              }
              throw new Error('invalid DOM structure ' + elem.outerHTML);
            }
          },
          height: function(value) {
            var self;
            self = this;
            if (angular.isDefined(value)) {
              if (angular.isNumber(value)) {
                value = value + 'px';
              }
              return css.call(self, 'height', value);
            } else {
              return getWidthHeight(this[0], 'height', 'base');
            }
          },
          outerHeight: function(option) {
            return getWidthHeight(this[0], 'height', option ? 'outerfull' : 'outer');
          },
          /*
          UIScroller no longer relies on jQuery method offset. The jQLite implementation of the method
          is kept here just for the reference. Also the offset setter method was never implemented
          */

          offset: function(value) {
            var box, doc, docElem, elem, self, win;
            self = this;
            if (arguments.length) {
              if (value === void 0) {
                return self;
              } else {
                throw new Error('offset setter method is not implemented');
              }
            }
            box = {
              top: 0,
              left: 0
            };
            elem = self[0];
            doc = elem && elem.ownerDocument;
            if (!doc) {
              return;
            }
            docElem = doc.documentElement;
            if (elem.getBoundingClientRect != null) {
              box = elem.getBoundingClientRect();
            }
            win = doc.defaultView || doc.parentWindow;
            return {
              top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
              left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
            };
          },
          scrollTop: function(value) {
            return scrollTo(this, 'top', value);
          },
          scrollLeft: function(value) {
            return scrollTo(this, 'left', value);
          }
        }, function(value, key) {
          if (!element.prototype[key]) {
            return element.prototype[key] = value;
          }
        });
      }
    };
  }
]).run([
  '$log', '$window', 'jqLiteExtras', function(console, window, jqLiteExtras) {
    'use strict';

    if (!window.jQuery) {
      return jqLiteExtras.registerFor(angular.element);
    }
  }
]);

/*
//# sourceURL=src/scripts/ui-scroll-jqlite.js
*/


/*
 globals: angular, window

 List of used element methods available in JQuery but not in JQuery Lite

 element.before(elem)
 element.height()
 element.outerHeight(true)
 element.height(value) = only for Top/Bottom padding elements
 element.scrollTop()
 element.scrollTop(value)
 */

angular.module('ui.scroll', []).directive('uiScrollViewport', [
  '$log', function() {
    'use strict';

    return {
      controller: [
        '$scope', '$element', function(scope, element) {
          this.viewport = element;
          return this;
        }
      ]
    };
  }
]).directive('uiScroll', [
  '$log', '$injector', '$rootScope', '$timeout', function(console, $injector, $rootScope, $timeout) {
    'use strict';

    return {
      require: ['?^uiScrollViewport'],
      transclude: 'element',
      priority: 1000,
      terminal: true,
      compile: function(elementTemplate, attr, linker) {
        return function($scope, element, $attr, controllers) {
          var adapter, adapterOnScope, adjustBuffer, adjustRowHeight, applyUpdate, bof, bottomVisiblePos, buffer, bufferPadding, bufferSize, builder, clipBottom, clipTop, datasource, datasourceName, doAdjustment, doDelete, doInsert, doUpdate, enqueueFetch, eof, eventListener, fetch, finalize, first, getValueChain, hideElementBeforeAppend, insert, isDatasourceValid, itemName, loading, log, match, next, pending, reload, removeFromBuffer, resizeAndScrollHandler, ridActual, scrollHeight, setValueChain, shouldLoadBottom, shouldLoadTop, showElementAfterRender, topVisible, topVisiblePos, viewport, viewportScope, wheelHandler;
          log = console.debug || console.log;
          match = $attr.uiScroll.match(/^\s*(\w+)\s+in\s+([\w\.]+)\s*$/);
          if (!match) {
            throw new Error('Expected uiScroll in form of \'_item_ in _datasource_\' but got \'' + $attr.uiScroll + '\'');
          }
          itemName = match[1];
          datasourceName = match[2];
          getValueChain = function(targetScope, target) {
            var chain;
            if (!targetScope) {
              return;
            }
            chain = target.match(/^([\w]+)\.(.+)$/);
            if (!chain || chain.length !== 3) {
              return targetScope[target];
            }
            return getValueChain(targetScope[chain[1]], chain[2]);
          };
          setValueChain = function(targetScope, target, value, doNotSet) {
            var chain;
            if (!targetScope || !target) {
              return;
            }
            if (!(chain = target.match(/^([\w]+)\.(.+)$/))) {
              if (target.indexOf('.') !== -1) {
                return;
              }
            }
            if (!chain || chain.length !== 3) {
              if (!angular.isObject(targetScope[target]) && !doNotSet) {
                return targetScope[target] = value;
              }
              return targetScope[target] = value;
            }
            if (!angular.isObject(targetScope[chain[1]]) && !doNotSet) {
              targetScope[chain[1]] = {};
            }
            return setValueChain(targetScope[chain[1]], chain[2], value, doNotSet);
          };
          datasource = getValueChain($scope, datasourceName);
          isDatasourceValid = function() {
            return angular.isObject(datasource) && typeof datasource.get === 'function';
          };
          if (!isDatasourceValid()) {
            datasource = $injector.get(datasourceName);
            if (!isDatasourceValid()) {
              throw new Error('' + datasourceName + ' is not a valid datasource');
            }
          }
          bufferSize = Math.max(3, +$attr.bufferSize || 10);
          bufferPadding = function() {
            return viewport.outerHeight() * Math.max(0.1, +$attr.padding || 0.1);
          };
          scrollHeight = function(elem) {
            var _ref;
            return (_ref = elem[0].scrollHeight) != null ? _ref : elem[0].document.documentElement.scrollHeight;
          };
          builder = null;
          linker($scope.$new(), function(template) {
            var bottomPadding, createPadding, padding, repeaterType, topPadding, viewport;
            repeaterType = template[0].localName;
            if (repeaterType === 'dl') {
              throw new Error('ui-scroll directive does not support <' + template[0].localName + '> as a repeating tag: ' + template[0].outerHTML);
            }
            if (repeaterType !== 'li' && repeaterType !== 'tr') {
              repeaterType = 'div';
            }
            viewport = controllers[0] && controllers[0].viewport ? controllers[0].viewport : angular.element(window);
            viewport.css({
              'overflow-y': 'auto',
              'display': 'block'
            });
            padding = function(repeaterType) {
              var div, result, table;
              switch (repeaterType) {
                case 'tr':
                  table = angular.element('<table><tr><td><div></div></td></tr></table>');
                  div = table.find('div');
                  result = table.find('tr');
                  result.paddingHeight = function() {
                    return div.height.apply(div, arguments);
                  };
                  return result;
                default:
                  result = angular.element('<' + repeaterType + '></' + repeaterType + '>');
                  result.paddingHeight = result.height;
                  return result;
              }
            };
            createPadding = function(padding, element, direction) {
              element[{
                top: 'before',
                bottom: 'after'
              }[direction]](padding);
              return {
                paddingHeight: function() {
                  return padding.paddingHeight.apply(padding, arguments);
                },
                insert: function(element) {
                  return padding[{
                    top: 'after',
                    bottom: 'before'
                  }[direction]](element);
                }
              };
            };
            topPadding = createPadding(padding(repeaterType), element, 'top');
            bottomPadding = createPadding(padding(repeaterType), element, 'bottom');
            $scope.$on('$destroy', template.remove);
            return builder = {
              viewport: viewport,
              topPadding: topPadding.paddingHeight,
              bottomPadding: bottomPadding.paddingHeight,
              append: bottomPadding.insert,
              prepend: topPadding.insert,
              bottomDataPos: function() {
                return scrollHeight(viewport) - bottomPadding.paddingHeight();
              },
              topDataPos: function() {
                return topPadding.paddingHeight();
              }
            };
          });
          viewport = builder.viewport;
          viewportScope = viewport.scope() || $rootScope;
          topVisible = function(item) {
            adapter.topVisible = item.scope[itemName];
            adapter.topVisibleElement = item.element;
            adapter.topVisibleScope = item.scope;
            if ($attr.topVisible) {
              setValueChain(viewportScope, $attr.topVisible, adapter.topVisible);
            }
            if ($attr.topVisibleElement) {
              setValueChain(viewportScope, $attr.topVisibleElement, adapter.topVisibleElement);
            }
            if ($attr.topVisibleScope) {
              setValueChain(viewportScope, $attr.topVisibleScope, adapter.topVisibleScope);
            }
            if (typeof datasource.topVisible === 'function') {
              return datasource.topVisible(item);
            }
          };
          loading = function(value) {
            adapter.isLoading = value;
            if ($attr.isLoading) {
              setValueChain($scope, $attr.isLoading, value);
            }
            if (typeof datasource.loading === 'function') {
              return datasource.loading(value);
            }
          };
          ridActual = 0;
          first = 1;
          next = 1;
          buffer = [];
          pending = [];
          eof = false;
          bof = false;
          removeFromBuffer = function(start, stop) {
            var i, _i;
            for (i = _i = start; start <= stop ? _i < stop : _i > stop; i = start <= stop ? ++_i : --_i) {
              buffer[i].scope.$destroy();
              buffer[i].element.remove();
            }
            return buffer.splice(start, stop - start);
          };
          reload = function() {
            ridActual++;
            first = 1;
            next = 1;
            removeFromBuffer(0, buffer.length);
            builder.topPadding(0);
            builder.bottomPadding(0);
            pending = [];
            eof = false;
            bof = false;
            return adjustBuffer(ridActual);
          };
          bottomVisiblePos = function() {
            return viewport.scrollTop() + viewport.outerHeight();
          };
          topVisiblePos = function() {
            return viewport.scrollTop();
          };
          shouldLoadBottom = function() {
            return !eof && builder.bottomDataPos() < bottomVisiblePos() + bufferPadding();
          };
          clipBottom = function() {
            var bottomHeight, i, item, itemHeight, itemTop, newRow, overage, rowTop, _i, _ref;
            bottomHeight = 0;
            overage = 0;
            for (i = _i = _ref = buffer.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
              item = buffer[i];
              itemTop = item.element.offset().top;
              newRow = rowTop !== itemTop;
              rowTop = itemTop;
              if (newRow) {
                itemHeight = item.element.outerHeight(true);
              }
              if (builder.bottomDataPos() - bottomHeight - itemHeight > bottomVisiblePos() + bufferPadding()) {
                if (newRow) {
                  bottomHeight += itemHeight;
                }
                overage++;
                eof = false;
              } else {
                if (newRow) {
                  break;
                }
                overage++;
              }
            }
            if (overage > 0) {
              builder.bottomPadding(builder.bottomPadding() + bottomHeight);
              removeFromBuffer(buffer.length - overage, buffer.length);
              return next -= overage;
            }
          };
          shouldLoadTop = function() {
            return !bof && (builder.topDataPos() > topVisiblePos() - bufferPadding());
          };
          clipTop = function() {
            var item, itemHeight, itemTop, newRow, overage, rowTop, topHeight, _i, _len;
            topHeight = 0;
            overage = 0;
            for (_i = 0, _len = buffer.length; _i < _len; _i++) {
              item = buffer[_i];
              itemTop = item.element.offset().top;
              newRow = rowTop !== itemTop;
              rowTop = itemTop;
              if (newRow) {
                itemHeight = item.element.outerHeight(true);
              }
              if (builder.topDataPos() + topHeight + itemHeight < topVisiblePos() - bufferPadding()) {
                if (newRow) {
                  topHeight += itemHeight;
                }
                overage++;
                bof = false;
              } else {
                if (newRow) {
                  break;
                }
                overage++;
              }
            }
            if (overage > 0) {
              builder.topPadding(builder.topPadding() + topHeight);
              removeFromBuffer(0, overage);
              return first += overage;
            }
          };
          enqueueFetch = function(rid, direction) {
            if (!adapter.isLoading) {
              loading(true);
            }
            if (pending.push(direction) === 1) {
              return fetch(rid);
            }
          };
          hideElementBeforeAppend = function(element) {
            element.displayTemp = element.css('display');
            return element.css('display', 'none');
          };
          showElementAfterRender = function(element) {
            if (element.hasOwnProperty('displayTemp')) {
              return element.css('display', element.displayTemp);
            }
          };
          insert = function(index, item) {
            var itemScope, toBeAppended, wrapper;
            itemScope = $scope.$new();
            itemScope[itemName] = item;
            toBeAppended = index > first;
            itemScope.$index = index;
            if (toBeAppended) {
              itemScope.$index--;
            }
            wrapper = {
              scope: itemScope
            };
            linker(itemScope, function(clone) {
              wrapper.element = clone;
              if (toBeAppended) {
                if (index === next) {
                  hideElementBeforeAppend(clone);
                  builder.append(clone);
                  return buffer.push(wrapper);
                } else {
                  buffer[index - first].element.after(clone);
                  return buffer.splice(index - first + 1, 0, wrapper);
                }
              } else {
                hideElementBeforeAppend(clone);
                builder.prepend(clone);
                return buffer.unshift(wrapper);
              }
            });
            return {
              appended: toBeAppended,
              wrapper: wrapper
            };
          };
          adjustRowHeight = function(appended, wrapper) {
            var newHeight;
            if (appended) {
              return builder.bottomPadding(Math.max(0, builder.bottomPadding() - wrapper.element.outerHeight(true)));
            } else {
              newHeight = builder.topPadding() - wrapper.element.outerHeight(true);
              if (newHeight >= 0) {
                return builder.topPadding(newHeight);
              } else {
                return viewport.scrollTop(viewport.scrollTop() + wrapper.element.outerHeight(true));
              }
            }
          };
          doAdjustment = function(rid, finalize) {
            var item, itemHeight, itemTop, newRow, rowTop, topHeight, _i, _len, _results;
            if (shouldLoadBottom()) {
              enqueueFetch(rid, true);
            } else {
              if (shouldLoadTop()) {
                enqueueFetch(rid, false);
              }
            }
            if (finalize) {
              finalize(rid);
            }
            if (pending.length === 0) {
              topHeight = 0;
              _results = [];
              for (_i = 0, _len = buffer.length; _i < _len; _i++) {
                item = buffer[_i];
                itemTop = item.element.offset().top;
                newRow = rowTop !== itemTop;
                rowTop = itemTop;
                if (newRow) {
                  itemHeight = item.element.outerHeight(true);
                }
                if (newRow && (builder.topDataPos() + topHeight + itemHeight < topVisiblePos())) {
                  _results.push(topHeight += itemHeight);
                } else {
                  if (newRow) {
                    topVisible(item);
                  }
                  break;
                }
              }
              return _results;
            }
          };
          adjustBuffer = function(rid, newItems, finalize) {
            if (newItems && newItems.length) {
              return $timeout(function() {
                var elt, itemTop, row, rowTop, rows, _i, _j, _len, _len1;
                rows = [];
                for (_i = 0, _len = newItems.length; _i < _len; _i++) {
                  row = newItems[_i];
                  elt = row.wrapper.element;
                  showElementAfterRender(elt);
                  itemTop = elt.offset().top;
                  if (rowTop !== itemTop) {
                    rows.push(row);
                    rowTop = itemTop;
                  }
                }
                for (_j = 0, _len1 = rows.length; _j < _len1; _j++) {
                  row = rows[_j];
                  adjustRowHeight(row.appended, row.wrapper);
                }
                return doAdjustment(rid, finalize);
              });
            } else {
              return doAdjustment(rid, finalize);
            }
          };
          finalize = function(rid, newItems) {
            return adjustBuffer(rid, newItems, function() {
              pending.shift();
              if (pending.length === 0) {
                return loading(false);
              } else {
                return fetch(rid);
              }
            });
          };
          fetch = function(rid) {
            var direction;
            direction = pending[0];
            if (direction) {
              if (buffer.length && !shouldLoadBottom()) {
                return finalize(rid);
              } else {
                return datasource.get(next, bufferSize, function(result) {
                  var item, newItems, _i, _len;
                  if ((rid && rid !== ridActual) || $scope.$$destroyed) {
                    return;
                  }
                  newItems = [];
                  if (result.length < bufferSize) {
                    eof = true;
                    builder.bottomPadding(0);
                  }
                  if (result.length > 0) {
                    clipTop();
                    for (_i = 0, _len = result.length; _i < _len; _i++) {
                      item = result[_i];
                      newItems.push(insert(++next, item));
                    }
                  }
                  return finalize(rid, newItems);
                });
              }
            } else {
              if (buffer.length && !shouldLoadTop()) {
                return finalize(rid);
              } else {
                return datasource.get(first - bufferSize, bufferSize, function(result) {
                  var i, newItems, _i, _ref;
                  if ((rid && rid !== ridActual) || $scope.$$destroyed) {
                    return;
                  }
                  newItems = [];
                  if (result.length < bufferSize) {
                    bof = true;
                    builder.topPadding(0);
                  }
                  if (result.length > 0) {
                    if (buffer.length) {
                      clipBottom();
                    }
                    for (i = _i = _ref = result.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
                      newItems.unshift(insert(--first, result[i]));
                    }
                  }
                  return finalize(rid, newItems);
                });
              }
            }
          };
          resizeAndScrollHandler = function() {
            if (!$rootScope.$$phase && !adapter.isLoading) {
              adjustBuffer();
              return $scope.$apply();
            }
          };
          wheelHandler = function(event) {
            var scrollTop, yMax;
            scrollTop = viewport[0].scrollTop;
            yMax = viewport[0].scrollHeight - viewport[0].clientHeight;
            if ((scrollTop === 0 && !bof) || (scrollTop === yMax && !eof)) {
              return event.preventDefault();
            }
          };
          viewport.bind('resize', resizeAndScrollHandler);
          viewport.bind('scroll', resizeAndScrollHandler);
          viewport.bind('mousewheel', wheelHandler);
          $scope.$watch(datasource.revision, reload);
          if (datasource.scope) {
            eventListener = datasource.scope.$new();
          } else {
            eventListener = $scope.$new();
          }
          $scope.$on('$destroy', function() {
            var item, _i, _len;
            for (_i = 0, _len = buffer.length; _i < _len; _i++) {
              item = buffer[_i];
              item.scope.$destroy();
              item.element.remove();
            }
            viewport.unbind('resize', resizeAndScrollHandler);
            viewport.unbind('scroll', resizeAndScrollHandler);
            return viewport.unbind('mousewheel', wheelHandler);
          });
          adapter = {};
          adapter.isLoading = false;
          applyUpdate = function(wrapper, newItems) {
            var i, inserted, item, ndx, newItem, oldItemNdx, _i, _j, _k, _len, _len1, _len2;
            inserted = [];
            if (angular.isArray(newItems)) {
              if (newItems.length) {
                if (newItems.length === 1 && newItems[0] === wrapper.scope[itemName]) {
                  return inserted;
                } else {
                  ndx = wrapper.scope.$index;
                  if (ndx > first) {
                    oldItemNdx = ndx - first;
                  } else {
                    oldItemNdx = 1;
                  }
                  for (i = _i = 0, _len = newItems.length; _i < _len; i = ++_i) {
                    newItem = newItems[i];
                    inserted.push(insert(ndx + i, newItem));
                  }
                  removeFromBuffer(oldItemNdx, oldItemNdx + 1);
                  for (i = _j = 0, _len1 = buffer.length; _j < _len1; i = ++_j) {
                    item = buffer[i];
                    item.scope.$index = first + i;
                  }
                }
              } else {
                removeFromBuffer(wrapper.scope.$index - first, wrapper.scope.$index - first + 1);
                next--;
                for (i = _k = 0, _len2 = buffer.length; _k < _len2; i = ++_k) {
                  item = buffer[i];
                  item.scope.$index = first + i;
                }
              }
            }
            return inserted;
          };
          adapter.applyUpdates = function(arg1, arg2) {
            var inserted, wrapper, _i, _len, _ref, _ref1;
            inserted = [];
            ridActual++;
            if (angular.isFunction(arg1)) {
              _ref = buffer.slice(0);
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                wrapper = _ref[_i];
                inserted.concat(inserted, applyUpdate(wrapper, arg1(wrapper.scope[itemName], wrapper.scope, wrapper.element)));
              }
            } else {
              if (arg1 % 1 === 0) {
                if ((0 <= (_ref1 = arg1 - first - 1) && _ref1 < buffer.length)) {
                  inserted = applyUpdate(buffer[arg1 - first], arg2);
                }
              } else {
                throw new Error('applyUpdates - ' + arg1 + ' is not a valid index or outside of range');
              }
            }
            return adjustBuffer(ridActual, inserted);
          };
          if ($attr.adapter) {
            adapterOnScope = getValueChain($scope, $attr.adapter);
            if (!adapterOnScope) {
              setValueChain($scope, $attr.adapter, {});
              adapterOnScope = getValueChain($scope, $attr.adapter);
            }
            angular.extend(adapterOnScope, adapter);
            adapter = adapterOnScope;
          }
          doUpdate = function(locator, newItem) {
            var wrapper, _fn, _i, _len, _ref;
            if (angular.isFunction(locator)) {
              _fn = function(wrapper) {
                return locator(wrapper.scope);
              };
              for (_i = 0, _len = buffer.length; _i < _len; _i++) {
                wrapper = buffer[_i];
                _fn(wrapper);
              }
            } else {
              if ((0 <= (_ref = locator - first - 1) && _ref < buffer.length)) {
                buffer[locator - first - 1].scope[itemName] = newItem;
              }
            }
            return null;
          };
          doDelete = function(locator) {
            var i, item, temp, wrapper, _fn, _i, _j, _k, _len, _len1, _len2, _ref;
            if (angular.isFunction(locator)) {
              temp = [];
              for (_i = 0, _len = buffer.length; _i < _len; _i++) {
                item = buffer[_i];
                temp.unshift(item);
              }
              _fn = function(wrapper) {
                if (locator(wrapper.scope)) {
                  removeFromBuffer(temp.length - 1 - i, temp.length - i);
                  return next--;
                }
              };
              for (i = _j = 0, _len1 = temp.length; _j < _len1; i = ++_j) {
                wrapper = temp[i];
                _fn(wrapper);
              }
            } else {
              if ((0 <= (_ref = locator - first - 1) && _ref < buffer.length)) {
                removeFromBuffer(locator - first - 1, locator - first);
                next--;
              }
            }
            for (i = _k = 0, _len2 = buffer.length; _k < _len2; i = ++_k) {
              item = buffer[i];
              item.scope.$index = first + i;
            }
            return adjustBuffer();
          };
          doInsert = function(locator, item) {
            var i, inserted, _i, _len, _ref;
            inserted = [];
            if (angular.isFunction(locator)) {
              throw new Error('not implemented - Insert with locator function');
            } else {
              if ((0 <= (_ref = locator - first - 1) && _ref < buffer.length)) {
                inserted.push(insert(locator, item));
                next++;
              }
            }
            for (i = _i = 0, _len = buffer.length; _i < _len; i = ++_i) {
              item = buffer[i];
              item.scope.$index = first + i;
            }
            return adjustBuffer(null, inserted);
          };
          eventListener.$on('insert.item', function(event, locator, item) {
            return doInsert(locator, item);
          });
          eventListener.$on('update.items', function(event, locator, newItem) {
            return doUpdate(locator, newItem);
          });
          return eventListener.$on('delete.items', function(event, locator) {
            return doDelete(locator);
          });
        };
      }
    };
  }
]);

/*
//# sourceURL=src/scripts/ui-scroll.js
*/


/**
 * Adds a 'ui-scrollfix' class to the element when the page scrolls past it's position.
 * @param [offset] {int} optional Y-offset to override the detected offset.
 *   Takes 300 (absolute) or -300 or +300 (relative to detected)
 */
angular.module('ui.scrollfix',[]).directive('uiScrollfix', ['$window', function ($window) {
  'use strict';

  function getWindowScrollTop() {
    if (angular.isDefined($window.pageYOffset)) {
      return $window.pageYOffset;
    } else {
      var iebody = (document.compatMode && document.compatMode !== 'BackCompat') ? document.documentElement : document.body;
      return iebody.scrollTop;
    }
  }
  return {
    require: '^?uiScrollfixTarget',
    link: function (scope, elm, attrs, uiScrollfixTarget) {
      var absolute = true,
          shift = 0,
          fixLimit,
          $target = uiScrollfixTarget && uiScrollfixTarget.$element || angular.element($window);

      if (!attrs.uiScrollfix) {
          absolute = false;
      } else if (typeof(attrs.uiScrollfix) === 'string') {
        // charAt is generally faster than indexOf: http://jsperf.com/indexof-vs-charat
        if (attrs.uiScrollfix.charAt(0) === '-') {
          absolute = false;
          shift = - parseFloat(attrs.uiScrollfix.substr(1));
        } else if (attrs.uiScrollfix.charAt(0) === '+') {
          absolute = false;
          shift = parseFloat(attrs.uiScrollfix.substr(1));
        }
      }

      fixLimit = absolute ? attrs.uiScrollfix : elm[0].offsetTop + shift;

      function onScroll() {

        var limit = absolute ? attrs.uiScrollfix : elm[0].offsetTop + shift;

        // if pageYOffset is defined use it, otherwise use other crap for IE
        var offset = uiScrollfixTarget ? $target[0].scrollTop : getWindowScrollTop();
        if (!elm.hasClass('ui-scrollfix') && offset > limit) {
          elm.addClass('ui-scrollfix');
          fixLimit = limit;
        } else if (elm.hasClass('ui-scrollfix') && offset < fixLimit) {
          elm.removeClass('ui-scrollfix');
        }
      }

      $target.on('scroll', onScroll);

      // Unbind scroll event handler when directive is removed
      scope.$on('$destroy', function() {
        $target.off('scroll', onScroll);
      });
    }
  };
}]).directive('uiScrollfixTarget', [function () {
  'use strict';
  return {
    controller: ['$element', function($element) {
      this.$element = $element;
    }]
  };
}]);

/**
 * uiShow Directive
 *
 * Adds a 'ui-show' class to the element instead of display:block
 * Created to allow tighter control  of CSS without bulkier directives
 *
 * @param expression {boolean} evaluated expression to determine if the class should be added
 */
angular.module('ui.showhide',[])
.directive('uiShow', [function () {
  'use strict';

  return function (scope, elm, attrs) {
    scope.$watch(attrs.uiShow, function (newVal) {
      if (newVal) {
        elm.addClass('ui-show');
      } else {
        elm.removeClass('ui-show');
      }
    });
  };
}])

/**
 * uiHide Directive
 *
 * Adds a 'ui-hide' class to the element instead of display:block
 * Created to allow tighter control  of CSS without bulkier directives
 *
 * @param expression {boolean} evaluated expression to determine if the class should be added
 */
.directive('uiHide', [function () {
  'use strict';

  return function (scope, elm, attrs) {
    scope.$watch(attrs.uiHide, function (newVal) {
      if (newVal) {
        elm.addClass('ui-hide');
      } else {
        elm.removeClass('ui-hide');
      }
    });
  };
}])

/**
 * uiToggle Directive
 *
 * Adds a class 'ui-show' if true, and a 'ui-hide' if false to the element instead of display:block/display:none
 * Created to allow tighter control  of CSS without bulkier directives. This also allows you to override the
 * default visibility of the element using either class.
 *
 * @param expression {boolean} evaluated expression to determine if the class should be added
 */
.directive('uiToggle', [function () {
  'use strict';

  return function (scope, elm, attrs) {
    scope.$watch(attrs.uiToggle, function (newVal) {
      if (newVal) {
        elm.removeClass('ui-hide').addClass('ui-show');
      } else {
        elm.removeClass('ui-show').addClass('ui-hide');
      }
    });
  };
}]);

/**
 * Filters out all duplicate items from an array by checking the specified key
 * @param [key] {string} the name of the attribute of each object to compare for uniqueness
 if the key is empty, the entire object will be compared
 if the key === false then no filtering will be performed
 * @return {array}
 */
angular.module('ui.unique',[]).filter('unique', ['$parse', function ($parse) {
  'use strict';

  return function (items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var newItems = [],
        get = angular.isString(filterOn) ? $parse(filterOn) : function (item) { return item; };

      var extractValueToCompare = function (item) {
        return angular.isObject(item) ? get(item) : item;
      };

      angular.forEach(items, function (item) {
        var isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  };
}]);

/*
 * Author: Remy Alain Ticona Carbajal http://realtica.org
 * Description: The main objective of ng-uploader is to have a user control,
 * clean, simple, customizable, and above all very easy to implement.
 * Licence: MIT
 */

angular.module('ui.uploader', []).service('uiUploader', uiUploader);

uiUploader.$inject = ['$log'];

function uiUploader($log) {
    'use strict';

    /*jshint validthis: true */
    var self = this;
    self.files = [];
    self.options = {};
    self.activeUploads = 0;
    $log.info('uiUploader loaded');
    
    function addFiles(files) {
        for (var i = 0; i < files.length; i++) {
            self.files.push(files[i]);
        }
    }

    function getFiles() {
        return self.files;
    }

    function startUpload(options) {
        self.options = options;
        for (var i = 0; i < self.files.length; i++) {
            if (self.activeUploads == self.options.concurrency) {
                break;
            }
            if (self.files[i].active)
                continue;
            ajaxUpload(self.files[i], self.options.url);
        }
    }
    
    function removeFile(file){
        self.files.splice(self.files.indexOf(file),1);
    }
    
    function removeAll(){
        self.files.splice(0,self.files.length);
    }
    
    return {
        addFiles: addFiles,
        getFiles: getFiles,
        files: self.files,
        startUpload: startUpload,
        removeFile: removeFile,
        removeAll:removeAll
    };
    
    function getHumanSize(bytes) {
        var sizes = ['n/a', 'bytes', 'KiB', 'MiB', 'GiB', 'TB', 'PB', 'EiB', 'ZiB', 'YiB'];
        var i = +Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0) + ' ' + sizes[isNaN(bytes) ? 0 : i + 1];
    }

    function ajaxUpload(file, url) {
        var xhr, formData, prop, data = '',
            key = '' || 'file';
        self.activeUploads += 1;
        file.active = true;
        xhr = new window.XMLHttpRequest();
        formData = new window.FormData();
        xhr.open('POST', url);

        // Triggered when upload starts:
        xhr.upload.onloadstart = function() {};

        // Triggered many times during upload:
        xhr.upload.onprogress = function(event) {
            if (!event.lengthComputable) {
                return;
            }
            // Update file size because it might be bigger than reported by
            // the fileSize:
            //$log.info("progres..");
            //console.info(event.loaded);
            file.loaded = event.loaded;
            file.humanSize = getHumanSize(event.loaded);
            self.options.onProgress(file);
        };

        // Triggered when upload is completed:
        xhr.onload = function() {
            self.activeUploads -= 1;
            startUpload(self.options);
            self.options.onCompleted(file, xhr.responseText);
        };

        // Triggered when upload fails:
        xhr.onerror = function() {};

        // Append additional data if provided:
        if (data) {
            for (prop in data) {
                if (data.hasOwnProperty(prop)) {
                    formData.append(prop, data[prop]);
                }
            }
        }

        // Append file data:
        formData.append(key, file, file.name);

        // Initiate upload:
        xhr.send(formData);

        return xhr;
    }

}

/**
 * General-purpose validator for ngModel.
 * angular.js comes with several built-in validation mechanism for input fields (ngRequired, ngPattern etc.) but using
 * an arbitrary validation function requires creation of a custom formatters and / or parsers.
 * The ui-validate directive makes it easy to use any function(s) defined in scope as a validator function(s).
 * A validator function will trigger validation on both model and input changes.
 *
 * @example <input ui-validate=" 'myValidatorFunction($value)' ">
 * @example <input ui-validate="{ foo : '$value > anotherModel', bar : 'validateFoo($value)' }">
 * @example <input ui-validate="{ foo : '$value > anotherModel' }" ui-validate-watch=" 'anotherModel' ">
 * @example <input ui-validate="{ foo : '$value > anotherModel', bar : 'validateFoo($value)' }" ui-validate-watch=" { foo : 'anotherModel' } ">
 *
 * @param ui-validate {string|object literal} If strings is passed it should be a scope's function to be used as a validator.
 * If an object literal is passed a key denotes a validation error key while a value should be a validator function.
 * In both cases validator function should take a value to validate as its argument and should return true/false indicating a validation result.
 */
angular.module('ui.validate',[]).directive('uiValidate', function () {
  'use strict';

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      var validateFn, validators = {},
          validateExpr = scope.$eval(attrs.uiValidate);

      if (!validateExpr){ return;}

      if (angular.isString(validateExpr)) {
        validateExpr = { validator: validateExpr };
      }

      angular.forEach(validateExpr, function (exprssn, key) {
        validateFn = function (valueToValidate) {
          var expression = scope.$eval(exprssn, { '$value' : valueToValidate });
          if (angular.isObject(expression) && angular.isFunction(expression.then)) {
            // expression is a promise
            expression.then(function(){
              ctrl.$setValidity(key, true);
            }, function(){
              ctrl.$setValidity(key, false);
            });
            return valueToValidate;
          } else if (expression) {
            // expression is true
            ctrl.$setValidity(key, true);
            return valueToValidate;
          } else {
            // expression is false
            ctrl.$setValidity(key, false);
            return valueToValidate;
          }
        };
        validators[key] = validateFn;
        ctrl.$formatters.push(validateFn);
        ctrl.$parsers.push(validateFn);
      });

      function apply_watch(watch)
      {
          //string - update all validators on expression change
          if (angular.isString(watch))
          {
              scope.$watch(watch, function(){
                  angular.forEach(validators, function(validatorFn){
                      validatorFn(ctrl.$modelValue);
                  });
              });
              return;
          }

          //array - update all validators on change of any expression
          if (angular.isArray(watch))
          {
              angular.forEach(watch, function(expression){
                  scope.$watch(expression, function()
                  {
                      angular.forEach(validators, function(validatorFn){
                          validatorFn(ctrl.$modelValue);
                      });
                  });
              });
              return;
          }

          //object - update appropriate validator
          if (angular.isObject(watch))
          {
              angular.forEach(watch, function(expression, validatorKey)
              {
                  //value is string - look after one expression
                  if (angular.isString(expression))
                  {
                      scope.$watch(expression, function(){
                          validators[validatorKey](ctrl.$modelValue);
                      });
                  }

                  //value is array - look after all expressions in array
                  if (angular.isArray(expression))
                  {
                      angular.forEach(expression, function(intExpression)
                      {
                          scope.$watch(intExpression, function(){
                              validators[validatorKey](ctrl.$modelValue);
                          });
                      });
                  }
              });
          }
      }
      // Support for ui-validate-watch
      if (attrs.uiValidateWatch){
          apply_watch( scope.$eval(attrs.uiValidateWatch) );
      }
    }
  };
});

angular.module('ui.utils',  [
  'ui.event',
  'ui.format',
  'ui.highlight',
  'ui.include',
  'ui.indeterminate',
  'ui.inflector',
  'ui.jq',
  'ui.keypress',
  'ui.mask',
  'ui.reset',
  'ui.route',
  'ui.scrollfix',
  'ui.scroll',
  'ui.scroll.jqlite',
  'ui.showhide',
  'ui.unique',
  'ui.validate'
]);
;/**!
 * AngularJS file upload/drop directive and service with progress and abort
 * @author  Danial  <danial.farid@gmail.com>
 * @version 4.2.4
 */
(function () {

var key, i;
function patchXHR(fnName, newFn) {
    window.XMLHttpRequest.prototype[fnName] = newFn(window.XMLHttpRequest.prototype[fnName]);
}

if (window.XMLHttpRequest && !window.XMLHttpRequest.__isFileAPIShim) {
    patchXHR('setRequestHeader', function (orig) {
        return function (header, value) {
            if (header === '__setXHR_') {
                var val = value(this);
                // fix for angular < 1.2.0
                if (val instanceof Function) {
                    val(this);
                }
            } else {
                orig.apply(this, arguments);
            }
        }
    });
}

var ngFileUpload = angular.module('ngFileUpload', []);

ngFileUpload.version = '4.2.4';
ngFileUpload.service('Upload', ['$http', '$q', '$timeout', function ($http, $q, $timeout) {
    function sendHttp(config) {
        config.method = config.method || 'POST';
        config.headers = config.headers || {};
        config.transformRequest = config.transformRequest || function (data, headersGetter) {
            if (window.ArrayBuffer && data instanceof window.ArrayBuffer) {
                return data;
            }
            return $http.defaults.transformRequest[0](data, headersGetter);
        };
        var deferred = $q.defer();
        var promise = deferred.promise;

        config.headers['__setXHR_'] = function () {
            return function (xhr) {
                if (!xhr) return;
                config.__XHR = xhr;
                config.xhrFn && config.xhrFn(xhr);
                xhr.upload.addEventListener('progress', function (e) {
                    e.config = config;
                    deferred.notify ? deferred.notify(e) : promise.progress_fn && $timeout(function () {
                        promise.progress_fn(e)
                    });
                }, false);
                //fix for firefox not firing upload progress end, also IE8-9
                xhr.upload.addEventListener('load', function (e) {
                    if (e.lengthComputable) {
                        e.config = config;
                        deferred.notify ? deferred.notify(e) : promise.progress_fn && $timeout(function () {
                            promise.progress_fn(e)
                        });
                    }
                }, false);
            };
        };

        $http(config).then(function (r) {
            deferred.resolve(r)
        }, function (e) {
            deferred.reject(e)
        }, function (n) {
            deferred.notify(n)
        });

        promise.success = function (fn) {
            promise.then(function (response) {
                fn(response.data, response.status, response.headers, config);
            });
            return promise;
        };

        promise.error = function (fn) {
            promise.then(null, function (response) {
                fn(response.data, response.status, response.headers, config);
            });
            return promise;
        };

        promise.progress = function (fn) {
            promise.progress_fn = fn;
            promise.then(null, null, function (update) {
                fn(update);
            });
            return promise;
        };
        promise.abort = function () {
            if (config.__XHR) {
                $timeout(function () {
                    config.__XHR.abort();
                });
            }
            return promise;
        };
        promise.xhr = function (fn) {
            config.xhrFn = (function (origXhrFn) {
                return function () {
                    origXhrFn && origXhrFn.apply(promise, arguments);
                    fn.apply(promise, arguments);
                }
            })(config.xhrFn);
            return promise;
        };

        return promise;
    }

    this.upload = function (config) {
        config.headers = config.headers || {};
        config.headers['Content-Type'] = undefined;
        config.transformRequest = config.transformRequest ?
            (angular.isArray(config.transformRequest) ?
                config.transformRequest : [config.transformRequest]) : [];
        config.transformRequest.push(function (data) {
            var formData = new FormData();
            var allFields = {};
            for (key in config.fields) {
                if (config.fields.hasOwnProperty(key)) {
                    allFields[key] = config.fields[key];
                }
            }
            if (data) allFields['data'] = data;

            if (config.formDataAppender) {
                for (key in allFields) {
                    if (allFields.hasOwnProperty(key)) {
                        config.formDataAppender(formData, key, allFields[key]);
                    }
                }
            } else {
                for (key in allFields) {
                    if (allFields.hasOwnProperty(key)) {
                        var val = allFields[key];
                        if (val !== undefined) {
                            if (angular.isDate(val)) {
                                val = val.toISOString();
                            }
                            if (angular.isString(val)) {
                                formData.append(key, val);
                            } else {
                                if (config.sendObjectsAsJsonBlob && angular.isObject(val)) {
                                    formData.append(key, new Blob([val], {type: 'application/json'}));
                                } else {
                                    formData.append(key, JSON.stringify(val));
                                }
                            }

                        }
                    }
                }
            }

            if (config.file != null) {
                var fileFormName = config.fileFormDataName || 'file';

                if (angular.isArray(config.file)) {
                    var isFileFormNameString = angular.isString(fileFormName);
                    for (var i = 0; i < config.file.length; i++) {
                        formData.append(isFileFormNameString ? fileFormName : fileFormName[i], config.file[i],
                            (config.fileName && config.fileName[i]) || config.file[i].name);
                    }
                } else {
                    formData.append(fileFormName, config.file, config.fileName || config.file.name);
                }
            }
            return formData;
        });

        return sendHttp(config);
    };

    this.http = function (config) {
        return sendHttp(config);
    };
}]);

ngFileUpload.directive('ngfSelect', ['$parse', '$timeout', '$compile',
    function ($parse, $timeout, $compile) {
        return {
            restrict: 'AEC',
            require: '?ngModel',
            link: function (scope, elem, attr, ngModel) {
                linkFileSelect(scope, elem, attr, ngModel, $parse, $timeout, $compile);
            }
        }
    }]);

function linkFileSelect(scope, elem, attr, ngModel, $parse, $timeout, $compile) {
	if (elem.attr('__ngf_gen__')) {
		return;
	}
    function isInputTypeFile() {
        return elem[0].tagName.toLowerCase() === 'input' && elem.attr('type') && elem.attr('type').toLowerCase() === 'file';
    }
    var isUpdating = false;
    function changeFn(evt) {
        if (!isUpdating) {
            isUpdating = true;
            try {
                var fileList = evt.__files_ || (evt.target && evt.target.files);
                var files = [], rejFiles = [];

                for (var i = 0; i < fileList.length; i++) {
                    var file = fileList.item(i);
                    if (validate(scope, $parse, attr, file, evt)) {
                        files.push(file);
                    } else {
                        rejFiles.push(file);
                    }
                }
                updateModel($parse, $timeout, scope, ngModel, attr, attr.ngfChange || attr.ngfSelect, files, rejFiles, evt);
                if (files.length == 0) evt.target.value = files;
//                if (evt.target && evt.target.getAttribute('__ngf_gen__')) {
//                    angular.element(evt.target).remove();
//                }
            } finally {
                isUpdating = false;
            }
        }
    }

    function bindAttrToFileInput(fileElem) {
        if (attr.ngfMultiple) fileElem.attr('multiple', $parse(attr.ngfMultiple)(scope));
        if (!$parse(attr.ngfMultiple)(scope)) fileElem.attr('multiple', undefined);
        if (attr['accept']) fileElem.attr('accept', attr['accept']);
        if (attr.ngfCapture) fileElem.attr('capture', $parse(attr.ngfCapture)(scope));
//        if (attr.ngDisabled) fileElem.attr('disabled', $parse(attr.disabled)(scope));
        for (var i = 0; i < elem[0].attributes.length; i++) {
            var attribute = elem[0].attributes[i];
            if ((isInputTypeFile() && attribute.name !== 'type') 
            		|| (attribute.name !== 'type' && attribute.name !== 'class' && 
            		attribute.name !== 'id' && attribute.name !== 'style')) {
            	fileElem.attr(attribute.name, attribute.value);
            }
        }
    }

    function createFileInput(evt) {
        if (elem.attr('disabled')) {
            return;
        }
        var fileElem = angular.element('<input type="file">');
        bindAttrToFileInput(fileElem);

        if (isInputTypeFile()) {
            elem.replaceWith(fileElem);
            elem = fileElem;
            fileElem.attr('__ngf_gen__', true);
            $compile(elem)(scope);
        } else {
            fileElem.css('visibility', 'hidden').css('position', 'absolute')
            		.css('width', '1').css('height', '1').css('z-index', '-100000')
            		.attr('tabindex', '-1');
            if (elem.__ngf_ref_elem__) {elem.__ngf_ref_elem__.remove();}
            elem.__ngf_ref_elem__ = fileElem;
            document.body.appendChild(fileElem[0]);
        }
        
        return fileElem;
    }

    function resetModel(evt) {
        updateModel($parse, $timeout, scope, ngModel, attr, attr.ngfChange || attr.ngfSelect, [], [], evt, true);
    }

    function clickHandler(evt) {
    	if (evt != null) {
    		evt.preventDefault();
    		evt.stopPropagation();
    	}
        var fileElem = createFileInput(evt);
        if (fileElem) {
        	fileElem.bind('change', changeFn);
        	if (evt) {
        		resetModel(evt);
        	}

        	function clickAndAssign(evt) {
        		if (evt != null) {
        			fileElem[0].click();
        		}
    	        if (isInputTypeFile()) {
    	            elem.bind('click touchend', clickHandler);
    	        }
        	}
        	
        	// fix for android native browser
        	if (navigator.userAgent.toLowerCase().match(/android/)) {
                setTimeout(function() {
                	clickAndAssign(evt);
                }, 0);        		
        	} else {
        		clickAndAssign(evt);
        	}
        }
        return false;
    }
    
    if (window.FileAPI && window.FileAPI.ngfFixIE) {
        window.FileAPI.ngfFixIE(elem, createFileInput, bindAttrToFileInput, changeFn, resetModel);
    } else {
        clickHandler();
        if (!isInputTypeFile()) {
        	elem.bind('click touchend', clickHandler);
        }
    }
}

ngFileUpload.directive('ngfDrop', ['$parse', '$timeout', '$location', function ($parse, $timeout, $location) {
    return {
        restrict: 'AEC',
        require: '?ngModel',
        link: function (scope, elem, attr, ngModel) {
            linkDrop(scope, elem, attr, ngModel, $parse, $timeout, $location);
        }
    }
}]);

ngFileUpload.directive('ngfNoFileDrop', function () {
    return function (scope, elem) {
        if (dropAvailable()) elem.css('display', 'none')
    }
});

ngFileUpload.directive('ngfDropAvailable', ['$parse', '$timeout', function ($parse, $timeout) {
    return function (scope, elem, attr) {
        if (dropAvailable()) {
            var fn = $parse(attr.ngfDropAvailable);
            $timeout(function () {
                fn(scope);
                if (fn.assign) {
                    fn.assign(scope, true);                	
                }
            });
        }
    }
}]);

function linkDrop(scope, elem, attr, ngModel, $parse, $timeout, $location) {
    var available = dropAvailable();
    if (attr.dropAvailable) {
        $timeout(function () {
        	scope[attr.dropAvailable] ? scope[attr.dropAvailable].value = available : scope[attr.dropAvailable] = available;
        });
    }
    if (!available) {
        if ($parse(attr.ngfHideOnDropNotAvailable)(scope) == true) {
            elem.css('display', 'none');
        }
        return;
    }
    var leaveTimeout = null;
    var stopPropagation = $parse(attr.ngfStopPropagation);
    var dragOverDelay = 1;
    var accept = $parse(attr.ngfAccept);
    var actualDragOverClass;

    elem[0].addEventListener('dragover', function (evt) {
        if (elem.attr('disabled')) return;
        evt.preventDefault();
        if (stopPropagation(scope)) evt.stopPropagation();
        // handling dragover events from the Chrome download bar
        if (navigator.userAgent.indexOf("Chrome") > -1) {
            var b = evt.dataTransfer.effectAllowed;
            evt.dataTransfer.dropEffect = ('move' === b || 'linkMove' === b) ? 'move' : 'copy';
        }
        $timeout.cancel(leaveTimeout);
        if (!scope.actualDragOverClass) {
            actualDragOverClass = calculateDragOverClass(scope, attr, evt);
        }
        elem.addClass(actualDragOverClass);
    }, false);
    elem[0].addEventListener('dragenter', function (evt) {
        if (elem.attr('disabled')) return;
        evt.preventDefault();
        if (stopPropagation(scope)) evt.stopPropagation();
    }, false);
    elem[0].addEventListener('dragleave', function () {
        if (elem.attr('disabled')) return;
        leaveTimeout = $timeout(function () {
            elem.removeClass(actualDragOverClass);
            actualDragOverClass = null;
        }, dragOverDelay || 1);
    }, false);
    elem[0].addEventListener('drop', function (evt) {
        if (elem.attr('disabled')) return;
        evt.preventDefault();
        if (stopPropagation(scope)) evt.stopPropagation();
        elem.removeClass(actualDragOverClass);
        actualDragOverClass = null;
        extractFiles(evt, function (files, rejFiles) {
            updateModel($parse, $timeout, scope, ngModel, attr,
                attr.ngfChange || attr.ngfDrop, files, rejFiles, evt)
        }, $parse(attr.ngfAllowDir)(scope) != false, attr.multiple || $parse(attr.ngfMultiple)(scope));
    }, false);

    function calculateDragOverClass(scope, attr, evt) {
        var accepted = true;
        var items = evt.dataTransfer.items;
        if (items != null) {
            for (var i = 0; i < items.length && accepted; i++) {
                accepted = accepted
                    && (items[i].kind == 'file' || items[i].kind == '')
                    && validate(scope, $parse, attr, items[i], evt);
            }
        }
        var clazz = $parse(attr.ngfDragOverClass)(scope, {$event: evt});
        if (clazz) {
            if (clazz.delay) dragOverDelay = clazz.delay;
            if (clazz.accept) clazz = accepted ? clazz.accept : clazz.reject;
        }
        return clazz || attr.ngfDragOverClass || 'dragover';
    }

    function extractFiles(evt, callback, allowDir, multiple) {
        var files = [], rejFiles = [], items = evt.dataTransfer.items, processing = 0;

        function addFile(file) {
            if (validate(scope, $parse, attr, file, evt)) {
                files.push(file);
            } else {
                rejFiles.push(file);
            }
        }

        if (items && items.length > 0 && $location.protocol() != 'file') {
            for (var i = 0; i < items.length; i++) {
                if (items[i].webkitGetAsEntry && items[i].webkitGetAsEntry() && items[i].webkitGetAsEntry().isDirectory) {
                    var entry = items[i].webkitGetAsEntry();
                    if (entry.isDirectory && !allowDir) {
                        continue;
                    }
                    if (entry != null) {
                        traverseFileTree(files, entry);
                    }
                } else {
                    var f = items[i].getAsFile();
                    if (f != null) addFile(f);
                }
                if (!multiple && files.length > 0) break;
            }
        } else {
            var fileList = evt.dataTransfer.files;
            if (fileList != null) {
                for (var i = 0; i < fileList.length; i++) {
                    addFile(fileList.item(i));
                    if (!multiple && files.length > 0) break;
                }
            }
        }
        var delays = 0;
        (function waitForProcess(delay) {
            $timeout(function () {
                if (!processing) {
                    if (!multiple && files.length > 1) {
                        i = 0;
                        while (files[i].type == 'directory') i++;
                        files = [files[i]];
                    }
                    callback(files, rejFiles);
                } else {
                    if (delays++ * 10 < 20 * 1000) {
                        waitForProcess(10);
                    }
                }
            }, delay || 0)
        })();

        function traverseFileTree(files, entry, path) {
            if (entry != null) {
                if (entry.isDirectory) {
                    var filePath = (path || '') + entry.name;
                    addFile({name: entry.name, type: 'directory', path: filePath});
                    var dirReader = entry.createReader();
                    var entries = [];
                    processing++;
                    var readEntries = function () {
                        dirReader.readEntries(function (results) {
                            try {
                                if (!results.length) {
                                    for (var i = 0; i < entries.length; i++) {
                                        traverseFileTree(files, entries[i], (path ? path : '') + entry.name + '/');
                                    }
                                    processing--;
                                } else {
                                    entries = entries.concat(Array.prototype.slice.call(results || [], 0));
                                    readEntries();
                                }
                            } catch (e) {
                                processing--;
                                console.error(e);
                            }
                        }, function () {
                            processing--;
                        });
                    };
                    readEntries();
                } else {
                    processing++;
                    entry.file(function (file) {
                        try {
                            processing--;
                            file.path = (path ? path : '') + file.name;
                            addFile(file);
                        } catch (e) {
                            processing--;
                            console.error(e);
                        }
                    }, function () {
                        processing--;
                    });
                }
            }
        }
    }
}

ngFileUpload.directive('ngfSrc', ['$parse', '$timeout', function ($parse, $timeout) {
	return {
		restrict: 'AE',
		link: function (scope, elem, attr, file) {
			if (window.FileReader) {
				scope.$watch(attr.ngfSrc, function(file) {
					if (file &&
							validate(scope, $parse, attr, file, null) &&
							(!window.FileAPI || navigator.userAgent.indexOf('MSIE 8') === -1 || file.size < 20000) && 
							(!window.FileAPI || navigator.userAgent.indexOf('MSIE 9') === -1 || file.size < 4000000)) {
						$timeout(function() {
							//prefer URL.createObjectURL for handling refrences to files of all sizes
							//since it doesn´t build a large string in memory
							var URL = window.URL || window.webkitURL;
							if (URL && URL.createObjectURL){
								elem.attr('src', URL.createObjectURL(file));
							} else {
								var fileReader = new FileReader();
								fileReader.readAsDataURL(file);
								fileReader.onload = function(e) {
									$timeout(function() {
										elem.attr('src', e.target.result);										
									});
								}
							}
						});
					} else {
						elem.attr('src', attr.ngfDefaultSrc || '');
					}
				});
			}
		}
	}
}]);

function dropAvailable() {
    var div = document.createElement('div');
    return ('draggable' in div) && ('ondrop' in div);
}

function updateModel($parse, $timeout, scope, ngModel, attr, fileChange, files, rejFiles, evt, noDelay) {
    function update() {
        if (ngModel) {
            $parse(attr.ngModel).assign(scope, files);
            $timeout(function () {
                ngModel && ngModel.$setViewValue(files != null && files.length == 0 ? null : files);
            });
        }
        if (attr.ngModelRejected) {
            $parse(attr.ngModelRejected).assign(scope, rejFiles);
        }
        if (fileChange) {
            $parse(fileChange)(scope, {
                $files: files,
                $rejectedFiles: rejFiles,
                $event: evt
            });

        }
    }
    if (noDelay) {
        update();
    } else {
        $timeout(function () {
            update();
        });
    }
}

function validate(scope, $parse, attr, file, evt) {
    var accept = $parse(attr.ngfAccept)(scope, {$file: file, $event: evt});
    var fileSizeMax = $parse(attr.ngfMaxSize)(scope, {$file: file, $event: evt}) || 9007199254740991;
    var fileSizeMin = $parse(attr.ngfMinSize)(scope, {$file: file, $event: evt}) || -1;
    if (accept != null && angular.isString(accept)) {
        var regexp = new RegExp(globStringToRegex(accept), 'gi');
        accept = (file.type != null && regexp.test(file.type.toLowerCase())) ||
        		(file.name != null && regexp.test(file.name.toLowerCase()));
    }
    return (accept == null || accept) && (file.size == null || (file.size < fileSizeMax && file.size > fileSizeMin));
}

function globStringToRegex(str) {
    if (str.length > 2 && str[0] === '/' && str[str.length - 1] === '/') {
        return str.substring(1, str.length - 1);
    }
    var split = str.split(','), result = '';
    if (split.length > 1) {
        for (var i = 0; i < split.length; i++) {
            result += '(' + globStringToRegex(split[i]) + ')';
            if (i < split.length - 1) {
                result += '|'
            }
        }
    } else {
        if (str.indexOf('.') == 0) {
            str = '*' + str;
        }
        result = '^' + str.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + '-]', 'g'), '\\$&') + '$';
        result = result.replace(/\\\*/g, '.*').replace(/\\\?/g, '.');
    }
    return result;
}

})();

/**!
 * AngularJS file upload/drop directive and service with progress and abort
 * FileAPI Flash shim for old browsers not supporting FormData 
 * @author  Danial  <danial.farid@gmail.com>
 * @version 4.2.4
 */

(function() {

var hasFlash = function() {
	try {
	  var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
	  if (fo) return true;
	} catch(e) {
	  if (navigator.mimeTypes['application/x-shockwave-flash'] != undefined) return true;
	}
	return false;
}

function patchXHR(fnName, newFn) {
	window.XMLHttpRequest.prototype[fnName] = newFn(window.XMLHttpRequest.prototype[fnName]);
};

if ((window.XMLHttpRequest && !window.FormData) || (window.FileAPI && FileAPI.forceLoad)) {
	var initializeUploadListener = function(xhr) {
		if (!xhr.__listeners) {
			if (!xhr.upload) xhr.upload = {};
			xhr.__listeners = [];
			var origAddEventListener = xhr.upload.addEventListener;
			xhr.upload.addEventListener = function(t, fn, b) {
				xhr.__listeners[t] = fn;
				origAddEventListener && origAddEventListener.apply(this, arguments);
			};
		}
	}
	
	patchXHR('open', function(orig) {
		return function(m, url, b) {
			initializeUploadListener(this);
			this.__url = url;
			try {
				orig.apply(this, [m, url, b]);
			} catch (e) {
				if (e.message.indexOf('Access is denied') > -1) {
					this.__origError = e;
					orig.apply(this, [m, '_fix_for_ie_crossdomain__', b]);
				}
			}
		}
	});

	patchXHR('getResponseHeader', function(orig) {
		return function(h) {
			return this.__fileApiXHR && this.__fileApiXHR.getResponseHeader ? this.__fileApiXHR.getResponseHeader(h) : (orig == null ? null : orig.apply(this, [h]));
		};
	});

	patchXHR('getAllResponseHeaders', function(orig) {
		return function() {
			return this.__fileApiXHR && this.__fileApiXHR.getAllResponseHeaders ? this.__fileApiXHR.getAllResponseHeaders() : (orig == null ? null : orig.apply(this));
		}
	});

	patchXHR('abort', function(orig) {
		return function() {
			return this.__fileApiXHR && this.__fileApiXHR.abort ? this.__fileApiXHR.abort() : (orig == null ? null : orig.apply(this));
		}
	});

	patchXHR('setRequestHeader', function(orig) {
		return function(header, value) {
			if (header === '__setXHR_') {
				initializeUploadListener(this);
				var val = value(this);
				// fix for angular < 1.2.0
				if (val instanceof Function) {
					val(this);
				}
			} else {
				this.__requestHeaders = this.__requestHeaders || {};
				this.__requestHeaders[header] = value;
				orig.apply(this, arguments);
			}
		}
	});
	
	function redefineProp(xhr, prop, fn) {
		try {
			Object.defineProperty(xhr, prop, {get: fn});
		} catch (e) {/*ignore*/}
	}

	patchXHR('send', function(orig) {
		return function() {
			var xhr = this;
			if (arguments[0] && arguments[0].__isFileAPIShim) {
				var formData = arguments[0];
				var config = {
					url: xhr.__url,
					jsonp: false, //removes the callback form param
					cache: true, //removes the ?fileapiXXX in the url
					complete: function(err, fileApiXHR) {
						xhr.__completed = true;
						if (!err && xhr.__listeners['load']) 
							xhr.__listeners['load']({type: 'load', loaded: xhr.__loaded, total: xhr.__total, target: xhr, lengthComputable: true});
						if (!err && xhr.__listeners['loadend']) 
							xhr.__listeners['loadend']({type: 'loadend', loaded: xhr.__loaded, total: xhr.__total, target: xhr, lengthComputable: true});
						if (err === 'abort' && xhr.__listeners['abort']) 
							xhr.__listeners['abort']({type: 'abort', loaded: xhr.__loaded, total: xhr.__total, target: xhr, lengthComputable: true});
						if (fileApiXHR.status !== undefined) redefineProp(xhr, 'status', function() {return (fileApiXHR.status == 0 && err && err !== 'abort') ? 500 : fileApiXHR.status});
						if (fileApiXHR.statusText !== undefined) redefineProp(xhr, 'statusText', function() {return fileApiXHR.statusText});
						redefineProp(xhr, 'readyState', function() {return 4});
						if (fileApiXHR.response !== undefined) redefineProp(xhr, 'response', function() {return fileApiXHR.response});
						var resp = fileApiXHR.responseText || (err && fileApiXHR.status == 0 && err !== 'abort' ? err : undefined);
						redefineProp(xhr, 'responseText', function() {return resp});
						redefineProp(xhr, 'response', function() {return resp});
						if (err) redefineProp(xhr, 'err', function() {return err});
						xhr.__fileApiXHR = fileApiXHR;
						if (xhr.onreadystatechange) xhr.onreadystatechange();
						if (xhr.onload) xhr.onload();
					},
					progress: function(e) {
						e.target = xhr;
						xhr.__listeners['progress'] && xhr.__listeners['progress'](e);
						xhr.__total = e.total;
						xhr.__loaded = e.loaded;
						if (e.total === e.loaded) {
							// fix flash issue that doesn't call complete if there is no response text from the server  
							var _this = this
							setTimeout(function() {
								if (!xhr.__completed) {
									xhr.getAllResponseHeaders = function(){};
									_this.complete(null, {status: 204, statusText: 'No Content'});
								}
							}, FileAPI.noContentTimeout || 10000);
						}
					},
					headers: xhr.__requestHeaders
				}
				config.data = {};
				config.files = {}
				for (var i = 0; i < formData.data.length; i++) {
					var item = formData.data[i];
					if (item.val != null && item.val.name != null && item.val.size != null && item.val.type != null) {
						config.files[item.key] = item.val;
					} else {
						config.data[item.key] = item.val;
					}
				}

				setTimeout(function() {
					if (!hasFlash()) {
						throw 'Adode Flash Player need to be installed. To check ahead use "FileAPI.hasFlash"';
					}
					xhr.__fileApiXHR = FileAPI.upload(config);
				}, 1);
			} else {
				if (this.__origError) {
					throw this.__origError;
				}
				orig.apply(xhr, arguments);
			}
		}
	});
	window.XMLHttpRequest.__isFileAPIShim = true;

	function isInputTypeFile(elem) {
		return elem[0].tagName.toLowerCase() === 'input' && elem.attr('type') && elem.attr('type').toLowerCase() === 'file';
	}
	
	window.FormData = FormData = function() {
		return {
			append: function(key, val, name) {
				if (val.__isFileAPIBlobShim) {
					val = val.data[0];
				}
				this.data.push({
					key: key,
					val: val,
					name: name
				});
			},
			data: [],
			__isFileAPIShim: true
		};
	};

	window.Blob = Blob = function(b) {
		return {
			data: b,
			__isFileAPIBlobShim: true
		};
	};

	(function () {
		//load FileAPI
		if (!window.FileAPI) {
			window.FileAPI = {};
		}
		if (FileAPI.forceLoad) {
			FileAPI.html5 = false;
		}
		
		if (!FileAPI.upload) {
			var jsUrl, basePath, script = document.createElement('script'), allScripts = document.getElementsByTagName('script'), i, index, src;
			if (window.FileAPI.jsUrl) {
				jsUrl = window.FileAPI.jsUrl;
			} else if (window.FileAPI.jsPath) {
				basePath = window.FileAPI.jsPath;
			} else {
				for (i = 0; i < allScripts.length; i++) {
					src = allScripts[i].src;
					index = src.search(/\/ng\-file\-upload[\-a-zA-z0-9\.]*\.js/)
					if (index > -1) {
						basePath = src.substring(0, index + 1);
						break;
					}
				}
			}

			if (FileAPI.staticPath == null) FileAPI.staticPath = basePath;
			script.setAttribute('src', jsUrl || basePath + 'FileAPI.min.js');
			document.getElementsByTagName('head')[0].appendChild(script);
			FileAPI.hasFlash = hasFlash();
		}
	})();
	
	FileAPI.ngfFixIE = function(elem, createFileElemFn, bindAttr, changeFn, resetModel) {
		if (!hasFlash()) {
			throw 'Adode Flash Player need to be installed. To check ahead use "FileAPI.hasFlash"';
		}
		var makeFlashInput = function(evt) {
			if (elem.attr('disabled')) {
				elem.__ngf_elem__.removeClass('js-fileapi-wrapper');
			} else {
				var fileElem = elem.__ngf_elem__;
				if (!fileElem) {
					fileElem = elem.__ngf_elem__ = createFileElemFn();
					fileElem.addClass('js-fileapi-wrapper');
					if (!isInputTypeFile(elem)) {
//						if (fileElem.parent().css('position') === '' || fileElem.parent().css('position') === 'static') {
//							fileElem.parent().css('position', 'relative');
//						}
//						elem.parent()[0].insertBefore(fileElem[0], elem[0]);
//						elem.css('overflow', 'hidden');
					}
					setTimeout(function() {
						fileElem.bind('mouseenter', makeFlashInput);
					}, 10);
					fileElem.bind('change', function(evt) {
				    	fileApiChangeFn.apply(this, [evt]);
						changeFn.apply(this, [evt]);
//						alert('change' +  evt);
					});
				} else {
					bindAttr(elem.__ngf_elem__);
				}
				if (!isInputTypeFile(elem)) {
					fileElem.css('position', 'absolute')
							.css('top', getOffset(elem[0]).top + 'px').css('left', getOffset(elem[0]).left + 'px')
							.css('width', elem[0].offsetWidth + 'px').css('height', elem[0].offsetHeight + 'px')
							.css('filter', 'alpha(opacity=0)').css('display', elem.css('display'))
							.css('overflow', 'hidden').css('z-index', '900000')
							.css('visibility', 'visible');
				}
			}
			function getOffset(obj) {
			    var left, top;
			    left = top = 0;
			    if (obj.offsetParent) {
			        do {
			            left += obj.offsetLeft;
			            top  += obj.offsetTop;
			        } while (obj = obj.offsetParent);
			    }
			    return {
			        left : left,
			        top : top
			    };
			};
		};

		elem.bind('mouseenter', makeFlashInput);

		var fileApiChangeFn = function(evt) {
			var files = FileAPI.getFiles(evt);
			//just a double check for #233
			for (var i = 0; i < files.length; i++) {
				if (files[i].size === undefined) files[i].size = 0;
				if (files[i].name === undefined) files[i].name = 'file';
				if (files[i].type === undefined) files[i].type = 'undefined';
			}
			if (!evt.target) {
				evt.target = {};
			}
			evt.target.files = files;
			// if evt.target.files is not writable use helper field
			if (evt.target.files != files) {
				evt.__files_ = files;
			}
			(evt.__files_ || evt.target.files).item = function(i) {
				return (evt.__files_ || evt.target.files)[i] || null;
			};
		};
	};

	FileAPI.disableFileInput = function(elem, disable) {
		if (disable) {
			elem.removeClass('js-fileapi-wrapper')
		} else {
			elem.addClass('js-fileapi-wrapper');
		}
	};
}


if (!window.FileReader) {
	window.FileReader = function() {
		var _this = this, loadStarted = false;
		this.listeners = {};
		this.addEventListener = function(type, fn) {
			_this.listeners[type] = _this.listeners[type] || [];
			_this.listeners[type].push(fn);
		};
		this.removeEventListener = function(type, fn) {
			_this.listeners[type] && _this.listeners[type].splice(_this.listeners[type].indexOf(fn), 1);
		};
		this.dispatchEvent = function(evt) {
			var list = _this.listeners[evt.type];
			if (list) {
				for (var i = 0; i < list.length; i++) {
					list[i].call(_this, evt);
				}
			}
		};
		this.onabort = this.onerror = this.onload = this.onloadstart = this.onloadend = this.onprogress = null;

		var constructEvent = function(type, evt) {
			var e = {type: type, target: _this, loaded: evt.loaded, total: evt.total, error: evt.error};
			if (evt.result != null) e.target.result = evt.result;
			return e;
		};
		var listener = function(evt) {
			if (!loadStarted) {
				loadStarted = true;
				_this.onloadstart && _this.onloadstart(constructEvent('loadstart', evt));
			}
			if (evt.type === 'load') {
				_this.onloadend && _this.onloadend(constructEvent('loadend', evt));
				var e = constructEvent('load', evt);
				_this.onload && _this.onload(e);
				_this.dispatchEvent(e);
			} else if (evt.type === 'progress') {
				var e = constructEvent('progress', evt);
				_this.onprogress && _this.onprogress(e);
				_this.dispatchEvent(e);
			} else {
				var e = constructEvent('error', evt);
				_this.onerror && _this.onerror(e);
				_this.dispatchEvent(e);
			}
		};
		this.readAsArrayBuffer = function(file) {
			FileAPI.readAsBinaryString(file, listener);
		}
		this.readAsBinaryString = function(file) {
			FileAPI.readAsBinaryString(file, listener);
		}
		this.readAsDataURL = function(file) {
			FileAPI.readAsDataURL(file, listener);
		}
		this.readAsText = function(file) {
			FileAPI.readAsText(file, listener);
		}
	}
}
})();
;/**
  * x is a value between 0 and 1, indicating where in the animation you are.
  */
var duScrollDefaultEasing = function (x) {
  'use strict';

  if(x < 0.5) {
    return Math.pow(x*2, 2)/2;
  }
  return 1-Math.pow((1-x)*2, 2)/2;
};

angular.module('duScroll', [
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
  .value('duScrollBottomSpy', false);


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
.factory('spyAPI', ["$rootScope", "$timeout", "$window", "$document", "scrollContainerAPI", "duScrollGreedy", "duScrollSpyWait", "duScrollBottomSpy", function($rootScope, $timeout, $window, $document, scrollContainerAPI, duScrollGreedy, duScrollSpyWait, duScrollBottomSpy) {
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
        bottomReached = Math.round($window.pageYOffset + $window.innerHeight) >= $document[0].body.scrollHeight;
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
        currentlyActive.$element.removeClass('active');
        $rootScope.$broadcast('duScrollspy:becameInactive', currentlyActive.$element);
      }
      if(toBeActive) {
        toBeActive.$element.addClass('active');
        $rootScope.$broadcast('duScrollspy:becameActive', toBeActive.$element);
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
      $timeout(function() {
        var spy = new Spy(targetId, $scope, $element, -($attr.offset ? parseInt($attr.offset, 10) : duScrollOffset));
        spyAPI.addSpy(spy);

        $scope.$on('$locationChangeSuccess', spy.flushTargetCache.bind(spy));
        var deregisterOnStateChange = $rootScope.$on('$stateChangeSuccess', spy.flushTargetCache.bind(spy));
        $scope.$on('$destroy', function() {
          spyAPI.removeSpy(spy);
          deregisterOnStateChange();
        });
      }, 0, false);
    }
  };
}]);
;angular.module('ualib.ui.templates', ['page/templates/page-section.tpl.html', 'page/templates/page.tpl.html', 'stepcard/templates/step-card.tpl.html', 'stepcard/templates/step.tpl.html', 'tabs/templates/tab.tpl.html', 'tabs/templates/tabset.tpl.html']);

angular.module("page/templates/page-section.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("page/templates/page-section.tpl.html",
    "<div class=\"page-slice\" id=\"{{section}}\" ng-transclude>\n" +
    "</div>");
}]);

angular.module("page/templates/page.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("page/templates/page.tpl.html",
    "<div class=\"row\" ng-cloak>\n" +
    "  <div class=\"col-md-9\" ng-transclude></div>\n" +
    "  <div class=\"col-md-3 page-section-menu\">\n" +
    "    <div ui-scrollfix>\n" +
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

angular.module("stepcard/templates/step-card.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("stepcard/templates/step-card.tpl.html",
    "<div class=\"row step-card\">\n" +
    "  <h3 ng-if=\"heading\">{{heading}}</h3>\n" +
    "  <div ng-transclude></div>\n" +
    "</div>");
}]);

angular.module("stepcard/templates/step.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("stepcard/templates/step.tpl.html",
    "<div class=\"step-card-step\" ng-class=\"stepcard.colSize\">\n" +
    "  <div class=\"step-num pull-left\">{{}}</div>\n" +
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
;/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.12.1 - 2015-05-27
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.transition","ui.bootstrap.collapse","ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.bindHtml","ui.bootstrap.buttons","ui.bootstrap.carousel","ui.bootstrap.dateparser","ui.bootstrap.position","ui.bootstrap.datepicker","ui.bootstrap.modal","ui.bootstrap.pagination","ui.bootstrap.tooltip","ui.bootstrap.popover","ui.bootstrap.progressbar","ui.bootstrap.rating","ui.bootstrap.timepicker","ui.bootstrap.typeahead"]);
angular.module("ui.bootstrap.tpls", ["template/accordion/accordion-group.html","template/accordion/accordion.html","template/alert/alert.html","template/carousel/carousel.html","template/carousel/slide.html","template/datepicker/datepicker.html","template/datepicker/day.html","template/datepicker/month.html","template/datepicker/popup.html","template/datepicker/year.html","template/modal/backdrop.html","template/modal/window.html","template/pagination/pager.html","template/pagination/pagination.html","template/tooltip/tooltip-html-unsafe-popup.html","template/tooltip/tooltip-popup.html","template/popover/popover.html","template/progressbar/bar.html","template/progressbar/progress.html","template/progressbar/progressbar.html","template/rating/rating.html","template/timepicker/timepicker.html","template/typeahead/typeahead-match.html","template/typeahead/typeahead-popup.html"]);
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

/**
* @ngdoc overview
* @name ui.bootstrap.carousel
*
* @description
* AngularJS version of an image carousel.
*
*/
angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
.controller('CarouselController', ['$scope', '$timeout', '$interval', '$transition', function ($scope, $timeout, $interval, $transition) {
  var self = this,
    slides = self.slides = $scope.slides = [],
    currentIndex = -1,
    currentInterval, isPlaying;
  self.currentSlide = null;

  var destroyed = false;
  /* direction: "prev" or "next" */
  self.select = $scope.select = function(nextSlide, direction) {
    var nextIndex = slides.indexOf(nextSlide);
    //Decide direction if it's not given
    if (direction === undefined) {
      direction = nextIndex > currentIndex ? 'next' : 'prev';
    }
    if (nextSlide && nextSlide !== self.currentSlide) {
      if ($scope.$currentTransition) {
        $scope.$currentTransition.cancel();
        //Timeout so ng-class in template has time to fix classes for finished slide
        $timeout(goNext);
      } else {
        goNext();
      }
    }
    function goNext() {
      // Scope has been destroyed, stop here.
      if (destroyed) { return; }
      //If we have a slide to transition from and we have a transition type and we're allowed, go
      if (self.currentSlide && angular.isString(direction) && !$scope.noTransition && nextSlide.$element) {
        //We shouldn't do class manip in here, but it's the same weird thing bootstrap does. need to fix sometime
        nextSlide.$element.addClass(direction);
        var reflow = nextSlide.$element[0].offsetWidth; //force reflow

        //Set all other slides to stop doing their stuff for the new transition
        angular.forEach(slides, function(slide) {
          angular.extend(slide, {direction: '', entering: false, leaving: false, active: false});
        });
        angular.extend(nextSlide, {direction: direction, active: true, entering: true});
        angular.extend(self.currentSlide||{}, {direction: direction, leaving: true});

        $scope.$currentTransition = $transition(nextSlide.$element, {});
        //We have to create new pointers inside a closure since next & current will change
        (function(next,current) {
          $scope.$currentTransition.then(
            function(){ transitionDone(next, current); },
            function(){ transitionDone(next, current); }
          );
        }(nextSlide, self.currentSlide));
      } else {
        transitionDone(nextSlide, self.currentSlide);
      }
      self.currentSlide = nextSlide;
      currentIndex = nextIndex;
      //every time you change slides, reset the timer
      restartTimer();
    }
    function transitionDone(next, current) {
      angular.extend(next, {direction: '', active: true, leaving: false, entering: false});
      angular.extend(current||{}, {direction: '', active: false, leaving: false, entering: false});
      $scope.$currentTransition = null;
    }
  };
  $scope.$on('$destroy', function () {
    destroyed = true;
  });

  /* Allow outside people to call indexOf on slides array */
  self.indexOfSlide = function(slide) {
    return slides.indexOf(slide);
  };

  $scope.next = function() {
    var newIndex = (currentIndex + 1) % slides.length;

    //Prevent this user-triggered transition from occurring if there is already one in progress
    if (!$scope.$currentTransition) {
      return self.select(slides[newIndex], 'next');
    }
  };

  $scope.prev = function() {
    var newIndex = currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;

    //Prevent this user-triggered transition from occurring if there is already one in progress
    if (!$scope.$currentTransition) {
      return self.select(slides[newIndex], 'prev');
    }
  };

  $scope.isActive = function(slide) {
     return self.currentSlide === slide;
  };

  $scope.$watch('interval', restartTimer);
  $scope.$on('$destroy', resetTimer);

  function restartTimer() {
    resetTimer();
    var interval = +$scope.interval;
    if (!isNaN(interval) && interval > 0) {
      currentInterval = $interval(timerFn, interval);
    }
  }

  function resetTimer() {
    if (currentInterval) {
      $interval.cancel(currentInterval);
      currentInterval = null;
    }
  }

  function timerFn() {
    var interval = +$scope.interval;
    if (isPlaying && !isNaN(interval) && interval > 0) {
      $scope.next();
    } else {
      $scope.pause();
    }
  }

  $scope.play = function() {
    if (!isPlaying) {
      isPlaying = true;
      restartTimer();
    }
  };
  $scope.pause = function() {
    if (!$scope.noPause) {
      isPlaying = false;
      resetTimer();
    }
  };

  self.addSlide = function(slide, element) {
    slide.$element = element;
    slides.push(slide);
    //if this is the first slide or the slide is set to active, select it
    if(slides.length === 1 || slide.active) {
      self.select(slides[slides.length-1]);
      if (slides.length == 1) {
        $scope.play();
      }
    } else {
      slide.active = false;
    }
  };

  self.removeSlide = function(slide) {
    //get the index of the slide inside the carousel
    var index = slides.indexOf(slide);
    slides.splice(index, 1);
    if (slides.length > 0 && slide.active) {
      if (index >= slides.length) {
        self.select(slides[index-1]);
      } else {
        self.select(slides[index]);
      }
    } else if (currentIndex > index) {
      currentIndex--;
    }
  };

}])

/**
 * @ngdoc directive
 * @name ui.bootstrap.carousel.directive:carousel
 * @restrict EA
 *
 * @description
 * Carousel is the outer container for a set of image 'slides' to showcase.
 *
 * @param {number=} interval The time, in milliseconds, that it will take the carousel to go to the next slide.
 * @param {boolean=} noTransition Whether to disable transitions on the carousel.
 * @param {boolean=} noPause Whether to disable pausing on the carousel (by default, the carousel interval pauses on hover).
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
    <carousel>
      <slide>
        <img src="http://placekitten.com/150/150" style="margin:auto;">
        <div class="carousel-caption">
          <p>Beautiful!</p>
        </div>
      </slide>
      <slide>
        <img src="http://placekitten.com/100/150" style="margin:auto;">
        <div class="carousel-caption">
          <p>D'aww!</p>
        </div>
      </slide>
    </carousel>
  </file>
  <file name="demo.css">
    .carousel-indicators {
      top: auto;
      bottom: 15px;
    }
  </file>
</example>
 */
.directive('carousel', [function() {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    controller: 'CarouselController',
    require: 'carousel',
    templateUrl: 'template/carousel/carousel.html',
    scope: {
      interval: '=',
      noTransition: '=',
      noPause: '='
    }
  };
}])

/**
 * @ngdoc directive
 * @name ui.bootstrap.carousel.directive:slide
 * @restrict EA
 *
 * @description
 * Creates a slide inside a {@link ui.bootstrap.carousel.directive:carousel carousel}.  Must be placed as a child of a carousel element.
 *
 * @param {boolean=} active Model binding, whether or not this slide is currently active.
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
<div ng-controller="CarouselDemoCtrl">
  <carousel>
    <slide ng-repeat="slide in slides" active="slide.active">
      <img ng-src="{{slide.image}}" style="margin:auto;">
      <div class="carousel-caption">
        <h4>Slide {{$index}}</h4>
        <p>{{slide.text}}</p>
      </div>
    </slide>
  </carousel>
  Interval, in milliseconds: <input type="number" ng-model="myInterval">
  <br />Enter a negative number to stop the interval.
</div>
  </file>
  <file name="script.js">
function CarouselDemoCtrl($scope) {
  $scope.myInterval = 5000;
}
  </file>
  <file name="demo.css">
    .carousel-indicators {
      top: auto;
      bottom: 15px;
    }
  </file>
</example>
*/

.directive('slide', function() {
  return {
    require: '^carousel',
    restrict: 'EA',
    transclude: true,
    replace: true,
    templateUrl: 'template/carousel/slide.html',
    scope: {
      active: '=?'
    },
    link: function (scope, element, attrs, carouselCtrl) {
      carouselCtrl.addSlide(scope, element);
      //when the scope is destroyed then remove the slide from the current slides array
      scope.$on('$destroy', function() {
        carouselCtrl.removeSlide(scope);
      });

      scope.$watch('active', function(active) {
        if (active) {
          carouselCtrl.select(scope);
        }
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

angular.module('ui.bootstrap.modal', ['ui.bootstrap.transition'])

/**
 * A helper, internal data structure that acts as a map but also allows getting / removing
 * elements in the LIFO order
 */
  .factory('$$stackedMap', function () {
    return {
      createNew: function () {
        var stack = [];

        return {
          add: function (key, value) {
            stack.push({
              key: key,
              value: value
            });
          },
          get: function (key) {
            for (var i = 0; i < stack.length; i++) {
              if (key == stack[i].key) {
                return stack[i];
              }
            }
          },
          keys: function() {
            var keys = [];
            for (var i = 0; i < stack.length; i++) {
              keys.push(stack[i].key);
            }
            return keys;
          },
          top: function () {
            return stack[stack.length - 1];
          },
          remove: function (key) {
            var idx = -1;
            for (var i = 0; i < stack.length; i++) {
              if (key == stack[i].key) {
                idx = i;
                break;
              }
            }
            return stack.splice(idx, 1)[0];
          },
          removeTop: function () {
            return stack.splice(stack.length - 1, 1)[0];
          },
          length: function () {
            return stack.length;
          }
        };
      }
    };
  })

/**
 * A helper directive for the $modal service. It creates a backdrop element.
 */
  .directive('modalBackdrop', ['$timeout', function ($timeout) {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'template/modal/backdrop.html',
      link: function (scope, element, attrs) {
        scope.backdropClass = attrs.backdropClass || '';

        scope.animate = false;

        //trigger CSS transitions
        $timeout(function () {
          scope.animate = true;
        });
      }
    };
  }])

  .directive('modalWindow', ['$modalStack', '$timeout', function ($modalStack, $timeout) {
    return {
      restrict: 'EA',
      scope: {
        index: '@',
        animate: '='
      },
      replace: true,
      transclude: true,
      templateUrl: function(tElement, tAttrs) {
        return tAttrs.templateUrl || 'template/modal/window.html';
      },
      link: function (scope, element, attrs) {
        element.addClass(attrs.windowClass || '');
        scope.size = attrs.size;

        $timeout(function () {
          // trigger CSS transitions
          scope.animate = true;

          /**
           * Auto-focusing of a freshly-opened modal element causes any child elements
           * with the autofocus attribute to lose focus. This is an issue on touch
           * based devices which will show and then hide the onscreen keyboard.
           * Attempts to refocus the autofocus element via JavaScript will not reopen
           * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
           * the modal element if the modal does not contain an autofocus element.
           */
          if (!element[0].querySelectorAll('[autofocus]').length) {
            element[0].focus();
          }
        });

        scope.close = function (evt) {
          var modal = $modalStack.getTop();
          if (modal && modal.value.backdrop && modal.value.backdrop != 'static' && (evt.target === evt.currentTarget)) {
            evt.preventDefault();
            evt.stopPropagation();
            $modalStack.dismiss(modal.key, 'backdrop click');
          }
        };
      }
    };
  }])

  .directive('modalTransclude', function () {
    return {
      link: function($scope, $element, $attrs, controller, $transclude) {
        $transclude($scope.$parent, function(clone) {
          $element.empty();
          $element.append(clone);
        });
      }
    };
  })

  .factory('$modalStack', ['$transition', '$timeout', '$document', '$compile', '$rootScope', '$$stackedMap',
    function ($transition, $timeout, $document, $compile, $rootScope, $$stackedMap) {

      var OPENED_MODAL_CLASS = 'modal-open';

      var backdropDomEl, backdropScope;
      var openedWindows = $$stackedMap.createNew();
      var $modalStack = {};

      function backdropIndex() {
        var topBackdropIndex = -1;
        var opened = openedWindows.keys();
        for (var i = 0; i < opened.length; i++) {
          if (openedWindows.get(opened[i]).value.backdrop) {
            topBackdropIndex = i;
          }
        }
        return topBackdropIndex;
      }

      $rootScope.$watch(backdropIndex, function(newBackdropIndex){
        if (backdropScope) {
          backdropScope.index = newBackdropIndex;
        }
      });

      function removeModalWindow(modalInstance) {

        var body = $document.find('body').eq(0);
        var modalWindow = openedWindows.get(modalInstance).value;

        //clean up the stack
        openedWindows.remove(modalInstance);

        //remove window DOM element
        removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, 300, function() {
          modalWindow.modalScope.$destroy();
          body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
          checkRemoveBackdrop();
        });
      }

      function checkRemoveBackdrop() {
          //remove backdrop if no longer needed
          if (backdropDomEl && backdropIndex() == -1) {
            var backdropScopeRef = backdropScope;
            removeAfterAnimate(backdropDomEl, backdropScope, 150, function () {
              backdropScopeRef.$destroy();
              backdropScopeRef = null;
            });
            backdropDomEl = undefined;
            backdropScope = undefined;
          }
      }

      function removeAfterAnimate(domEl, scope, emulateTime, done) {
        // Closing animation
        scope.animate = false;

        var transitionEndEventName = $transition.transitionEndEventName;
        if (transitionEndEventName) {
          // transition out
          var timeout = $timeout(afterAnimating, emulateTime);

          domEl.bind(transitionEndEventName, function () {
            $timeout.cancel(timeout);
            afterAnimating();
            scope.$apply();
          });
        } else {
          // Ensure this call is async
          $timeout(afterAnimating);
        }

        function afterAnimating() {
          if (afterAnimating.done) {
            return;
          }
          afterAnimating.done = true;

          domEl.remove();
          if (done) {
            done();
          }
        }
      }

      $document.bind('keydown', function (evt) {
        var modal;

        if (evt.which === 27) {
          modal = openedWindows.top();
          if (modal && modal.value.keyboard) {
            evt.preventDefault();
            $rootScope.$apply(function () {
              $modalStack.dismiss(modal.key, 'escape key press');
            });
          }
        }
      });

      $modalStack.open = function (modalInstance, modal) {

        openedWindows.add(modalInstance, {
          deferred: modal.deferred,
          modalScope: modal.scope,
          backdrop: modal.backdrop,
          keyboard: modal.keyboard
        });

        var body = $document.find('body').eq(0),
            currBackdropIndex = backdropIndex();

        if (currBackdropIndex >= 0 && !backdropDomEl) {
          backdropScope = $rootScope.$new(true);
          backdropScope.index = currBackdropIndex;
          var angularBackgroundDomEl = angular.element('<div modal-backdrop></div>');
          angularBackgroundDomEl.attr('backdrop-class', modal.backdropClass);
          backdropDomEl = $compile(angularBackgroundDomEl)(backdropScope);
          body.append(backdropDomEl);
        }

        var angularDomEl = angular.element('<div modal-window></div>');
        angularDomEl.attr({
          'template-url': modal.windowTemplateUrl,
          'window-class': modal.windowClass,
          'size': modal.size,
          'index': openedWindows.length() - 1,
          'animate': 'animate'
        }).html(modal.content);

        var modalDomEl = $compile(angularDomEl)(modal.scope);
        openedWindows.top().value.modalDomEl = modalDomEl;
        body.append(modalDomEl);
        body.addClass(OPENED_MODAL_CLASS);
      };

      $modalStack.close = function (modalInstance, result) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow) {
          modalWindow.value.deferred.resolve(result);
          removeModalWindow(modalInstance);
        }
      };

      $modalStack.dismiss = function (modalInstance, reason) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow) {
          modalWindow.value.deferred.reject(reason);
          removeModalWindow(modalInstance);
        }
      };

      $modalStack.dismissAll = function (reason) {
        var topModal = this.getTop();
        while (topModal) {
          this.dismiss(topModal.key, reason);
          topModal = this.getTop();
        }
      };

      $modalStack.getTop = function () {
        return openedWindows.top();
      };

      return $modalStack;
    }])

  .provider('$modal', function () {

    var $modalProvider = {
      options: {
        backdrop: true, //can be also false or 'static'
        keyboard: true
      },
      $get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$modalStack',
        function ($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {

          var $modal = {};

          function getTemplatePromise(options) {
            return options.template ? $q.when(options.template) :
              $http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl,
                {cache: $templateCache}).then(function (result) {
                  return result.data;
              });
          }

          function getResolvePromises(resolves) {
            var promisesArr = [];
            angular.forEach(resolves, function (value) {
              if (angular.isFunction(value) || angular.isArray(value)) {
                promisesArr.push($q.when($injector.invoke(value)));
              }
            });
            return promisesArr;
          }

          $modal.open = function (modalOptions) {

            var modalResultDeferred = $q.defer();
            var modalOpenedDeferred = $q.defer();

            //prepare an instance of a modal to be injected into controllers and returned to a caller
            var modalInstance = {
              result: modalResultDeferred.promise,
              opened: modalOpenedDeferred.promise,
              close: function (result) {
                $modalStack.close(modalInstance, result);
              },
              dismiss: function (reason) {
                $modalStack.dismiss(modalInstance, reason);
              }
            };

            //merge and clean up options
            modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
            modalOptions.resolve = modalOptions.resolve || {};

            //verify options
            if (!modalOptions.template && !modalOptions.templateUrl) {
              throw new Error('One of template or templateUrl options is required.');
            }

            var templateAndResolvePromise =
              $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));


            templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

              var modalScope = (modalOptions.scope || $rootScope).$new();
              modalScope.$close = modalInstance.close;
              modalScope.$dismiss = modalInstance.dismiss;

              var ctrlInstance, ctrlLocals = {};
              var resolveIter = 1;

              //controllers
              if (modalOptions.controller) {
                ctrlLocals.$scope = modalScope;
                ctrlLocals.$modalInstance = modalInstance;
                angular.forEach(modalOptions.resolve, function (value, key) {
                  ctrlLocals[key] = tplAndVars[resolveIter++];
                });

                ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                if (modalOptions.controllerAs) {
                  modalScope[modalOptions.controllerAs] = ctrlInstance;
                }
              }

              $modalStack.open(modalInstance, {
                scope: modalScope,
                deferred: modalResultDeferred,
                content: tplAndVars[0],
                backdrop: modalOptions.backdrop,
                keyboard: modalOptions.keyboard,
                backdropClass: modalOptions.backdropClass,
                windowClass: modalOptions.windowClass,
                windowTemplateUrl: modalOptions.windowTemplateUrl,
                size: modalOptions.size
              });

            }, function resolveError(reason) {
              modalResultDeferred.reject(reason);
            });

            templateAndResolvePromise.then(function () {
              modalOpenedDeferred.resolve(true);
            }, function () {
              modalOpenedDeferred.reject(false);
            });

            return modalInstance;
          };

          return $modal;
        }]
    };

    return $modalProvider;
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

angular.module('ui.bootstrap.progressbar', [])

.constant('progressConfig', {
  animate: true,
  max: 100
})

.controller('ProgressController', ['$scope', '$attrs', 'progressConfig', function($scope, $attrs, progressConfig) {
    var self = this,
        animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : progressConfig.animate;

    this.bars = [];
    $scope.max = angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : progressConfig.max;

    this.addBar = function(bar, element) {
        if ( !animate ) {
            element.css({'transition': 'none'});
        }

        this.bars.push(bar);

        bar.$watch('value', function( value ) {
            bar.percent = +(100 * value / $scope.max).toFixed(2);
        });

        bar.$on('$destroy', function() {
            element = null;
            self.removeBar(bar);
        });
    };

    this.removeBar = function(bar) {
        this.bars.splice(this.bars.indexOf(bar), 1);
    };
}])

.directive('progress', function() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        controller: 'ProgressController',
        require: 'progress',
        scope: {},
        templateUrl: 'template/progressbar/progress.html'
    };
})

.directive('bar', function() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        require: '^progress',
        scope: {
            value: '=',
            type: '@'
        },
        templateUrl: 'template/progressbar/bar.html',
        link: function(scope, element, attrs, progressCtrl) {
            progressCtrl.addBar(scope, element);
        }
    };
})

.directive('progressbar', function() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        controller: 'ProgressController',
        scope: {
            value: '=',
            type: '@'
        },
        templateUrl: 'template/progressbar/progressbar.html',
        link: function(scope, element, attrs, progressCtrl) {
            progressCtrl.addBar(scope, angular.element(element.children()[0]));
        }
    };
});
angular.module('ui.bootstrap.rating', [])

.constant('ratingConfig', {
  max: 5,
  stateOn: null,
  stateOff: null
})

.controller('RatingController', ['$scope', '$attrs', 'ratingConfig', function($scope, $attrs, ratingConfig) {
  var ngModelCtrl  = { $setViewValue: angular.noop };

  this.init = function(ngModelCtrl_) {
    ngModelCtrl = ngModelCtrl_;
    ngModelCtrl.$render = this.render;

    this.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : ratingConfig.stateOn;
    this.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : ratingConfig.stateOff;

    var ratingStates = angular.isDefined($attrs.ratingStates) ? $scope.$parent.$eval($attrs.ratingStates) :
                        new Array( angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max );
    $scope.range = this.buildTemplateObjects(ratingStates);
  };

  this.buildTemplateObjects = function(states) {
    for (var i = 0, n = states.length; i < n; i++) {
      states[i] = angular.extend({ index: i }, { stateOn: this.stateOn, stateOff: this.stateOff }, states[i]);
    }
    return states;
  };

  $scope.rate = function(value) {
    if ( !$scope.readonly && value >= 0 && value <= $scope.range.length ) {
      ngModelCtrl.$setViewValue(value);
      ngModelCtrl.$render();
    }
  };

  $scope.enter = function(value) {
    if ( !$scope.readonly ) {
      $scope.value = value;
    }
    $scope.onHover({value: value});
  };

  $scope.reset = function() {
    $scope.value = ngModelCtrl.$viewValue;
    $scope.onLeave();
  };

  $scope.onKeydown = function(evt) {
    if (/(37|38|39|40)/.test(evt.which)) {
      evt.preventDefault();
      evt.stopPropagation();
      $scope.rate( $scope.value + (evt.which === 38 || evt.which === 39 ? 1 : -1) );
    }
  };

  this.render = function() {
    $scope.value = ngModelCtrl.$viewValue;
  };
}])

.directive('rating', function() {
  return {
    restrict: 'EA',
    require: ['rating', 'ngModel'],
    scope: {
      readonly: '=?',
      onHover: '&',
      onLeave: '&'
    },
    controller: 'RatingController',
    templateUrl: 'template/rating/rating.html',
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var ratingCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if ( ngModelCtrl ) {
        ratingCtrl.init( ngModelCtrl );
      }
    }
  };
});
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

angular.module('ui.bootstrap.typeahead', ['ui.bootstrap.position', 'ui.bootstrap.bindHtml'])

/**
 * A helper service that can parse typeahead's syntax (string provided by users)
 * Extracted to a separate service for ease of unit testing
 */
  .factory('typeaheadParser', ['$parse', function ($parse) {

  //                      00000111000000000000022200000000000000003333333333333330000000000044000
  var TYPEAHEAD_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;

  return {
    parse:function (input) {

      var match = input.match(TYPEAHEAD_REGEXP);
      if (!match) {
        throw new Error(
          'Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_"' +
            ' but got "' + input + '".');
      }

      return {
        itemName:match[3],
        source:$parse(match[4]),
        viewMapper:$parse(match[2] || match[1]),
        modelMapper:$parse(match[1])
      };
    }
  };
}])

  .directive('typeahead', ['$compile', '$parse', '$q', '$timeout', '$document', '$position', 'typeaheadParser',
    function ($compile, $parse, $q, $timeout, $document, $position, typeaheadParser) {

  var HOT_KEYS = [9, 13, 27, 38, 40];

  return {
    require:'ngModel',
    link:function (originalScope, element, attrs, modelCtrl) {

      //SUPPORTED ATTRIBUTES (OPTIONS)

      //minimal no of characters that needs to be entered before typeahead kicks-in
      var minSearch = originalScope.$eval(attrs.typeaheadMinLength) || 1;

      //minimal wait time after last character typed before typehead kicks-in
      var waitTime = originalScope.$eval(attrs.typeaheadWaitMs) || 0;

      //should it restrict model values to the ones selected from the popup only?
      var isEditable = originalScope.$eval(attrs.typeaheadEditable) !== false;

      //binding to a variable that indicates if matches are being retrieved asynchronously
      var isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop;

      //a callback executed when a match is selected
      var onSelectCallback = $parse(attrs.typeaheadOnSelect);

      var inputFormatter = attrs.typeaheadInputFormatter ? $parse(attrs.typeaheadInputFormatter) : undefined;

      var appendToBody =  attrs.typeaheadAppendToBody ? originalScope.$eval(attrs.typeaheadAppendToBody) : false;

      var focusFirst = originalScope.$eval(attrs.typeaheadFocusFirst) !== false;

      //INTERNAL VARIABLES

      //model setter executed upon match selection
      var $setModelValue = $parse(attrs.ngModel).assign;

      //expressions used by typeahead
      var parserResult = typeaheadParser.parse(attrs.typeahead);

      var hasFocus;

      //create a child scope for the typeahead directive so we are not polluting original scope
      //with typeahead-specific data (matches, query etc.)
      var scope = originalScope.$new();
      originalScope.$on('$destroy', function(){
        scope.$destroy();
      });

      // WAI-ARIA
      var popupId = 'typeahead-' + scope.$id + '-' + Math.floor(Math.random() * 10000);
      element.attr({
        'aria-autocomplete': 'list',
        'aria-expanded': false,
        'aria-owns': popupId
      });

      //pop-up element used to display matches
      var popUpEl = angular.element('<div typeahead-popup></div>');
      popUpEl.attr({
        id: popupId,
        matches: 'matches',
        active: 'activeIdx',
        select: 'select(activeIdx)',
        query: 'query',
        position: 'position'
      });
      //custom item template
      if (angular.isDefined(attrs.typeaheadTemplateUrl)) {
        popUpEl.attr('template-url', attrs.typeaheadTemplateUrl);
      }

      var resetMatches = function() {
        scope.matches = [];
        scope.activeIdx = -1;
        element.attr('aria-expanded', false);
      };

      var getMatchId = function(index) {
        return popupId + '-option-' + index;
      };

      // Indicate that the specified match is the active (pre-selected) item in the list owned by this typeahead.
      // This attribute is added or removed automatically when the `activeIdx` changes.
      scope.$watch('activeIdx', function(index) {
        if (index < 0) {
          element.removeAttr('aria-activedescendant');
        } else {
          element.attr('aria-activedescendant', getMatchId(index));
        }
      });

      var getMatchesAsync = function(inputValue) {

        var locals = {$viewValue: inputValue};
        isLoadingSetter(originalScope, true);
        $q.when(parserResult.source(originalScope, locals)).then(function(matches) {

          //it might happen that several async queries were in progress if a user were typing fast
          //but we are interested only in responses that correspond to the current view value
          var onCurrentRequest = (inputValue === modelCtrl.$viewValue);
          if (onCurrentRequest && hasFocus) {
            if (matches.length > 0) {

              scope.activeIdx = focusFirst ? 0 : -1;
              scope.matches.length = 0;

              //transform labels
              for(var i=0; i<matches.length; i++) {
                locals[parserResult.itemName] = matches[i];
                scope.matches.push({
                  id: getMatchId(i),
                  label: parserResult.viewMapper(scope, locals),
                  model: matches[i]
                });
              }

              scope.query = inputValue;
              //position pop-up with matches - we need to re-calculate its position each time we are opening a window
              //with matches as a pop-up might be absolute-positioned and position of an input might have changed on a page
              //due to other elements being rendered
              scope.position = appendToBody ? $position.offset(element) : $position.position(element);
              scope.position.top = scope.position.top + element.prop('offsetHeight');

              element.attr('aria-expanded', true);
            } else {
              resetMatches();
            }
          }
          if (onCurrentRequest) {
            isLoadingSetter(originalScope, false);
          }
        }, function(){
          resetMatches();
          isLoadingSetter(originalScope, false);
        });
      };

      resetMatches();

      //we need to propagate user's query so we can higlight matches
      scope.query = undefined;

      //Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later 
      var timeoutPromise;

      var scheduleSearchWithTimeout = function(inputValue) {
        timeoutPromise = $timeout(function () {
          getMatchesAsync(inputValue);
        }, waitTime);
      };

      var cancelPreviousTimeout = function() {
        if (timeoutPromise) {
          $timeout.cancel(timeoutPromise);
        }
      };

      //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
      //$parsers kick-in on all the changes coming from the view as well as manually triggered by $setViewValue
      modelCtrl.$parsers.unshift(function (inputValue) {

        hasFocus = true;

        if (inputValue && inputValue.length >= minSearch) {
          if (waitTime > 0) {
            cancelPreviousTimeout();
            scheduleSearchWithTimeout(inputValue);
          } else {
            getMatchesAsync(inputValue);
          }
        } else {
          isLoadingSetter(originalScope, false);
          cancelPreviousTimeout();
          resetMatches();
        }

        if (isEditable) {
          return inputValue;
        } else {
          if (!inputValue) {
            // Reset in case user had typed something previously.
            modelCtrl.$setValidity('editable', true);
            return inputValue;
          } else {
            modelCtrl.$setValidity('editable', false);
            return undefined;
          }
        }
      });

      modelCtrl.$formatters.push(function (modelValue) {

        var candidateViewValue, emptyViewValue;
        var locals = {};

        if (inputFormatter) {

          locals.$model = modelValue;
          return inputFormatter(originalScope, locals);

        } else {

          //it might happen that we don't have enough info to properly render input value
          //we need to check for this situation and simply return model value if we can't apply custom formatting
          locals[parserResult.itemName] = modelValue;
          candidateViewValue = parserResult.viewMapper(originalScope, locals);
          locals[parserResult.itemName] = undefined;
          emptyViewValue = parserResult.viewMapper(originalScope, locals);

          return candidateViewValue!== emptyViewValue ? candidateViewValue : modelValue;
        }
      });

      scope.select = function (activeIdx) {
        //called from within the $digest() cycle
        var locals = {};
        var model, item;

        locals[parserResult.itemName] = item = scope.matches[activeIdx].model;
        model = parserResult.modelMapper(originalScope, locals);
        $setModelValue(originalScope, model);
        modelCtrl.$setValidity('editable', true);

        onSelectCallback(originalScope, {
          $item: item,
          $model: model,
          $label: parserResult.viewMapper(originalScope, locals)
        });

        resetMatches();

        //return focus to the input element if a match was selected via a mouse click event
        // use timeout to avoid $rootScope:inprog error
        $timeout(function() { element[0].focus(); }, 0, false);
      };

      //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
      element.bind('keydown', function (evt) {

        //typeahead is open and an "interesting" key was pressed
        if (scope.matches.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
          return;
        }

        // if there's nothing selected (i.e. focusFirst) and enter is hit, don't do anything
        if (scope.activeIdx == -1 && (evt.which === 13 || evt.which === 9)) {
          return;
        }

        evt.preventDefault();

        if (evt.which === 40) {
          scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
          scope.$digest();

        } else if (evt.which === 38) {
          scope.activeIdx = (scope.activeIdx > 0 ? scope.activeIdx : scope.matches.length) - 1;
          scope.$digest();

        } else if (evt.which === 13 || evt.which === 9) {
          scope.$apply(function () {
            scope.select(scope.activeIdx);
          });

        } else if (evt.which === 27) {
          evt.stopPropagation();

          resetMatches();
          scope.$digest();
        }
      });

      element.bind('blur', function (evt) {
        hasFocus = false;
      });

      // Keep reference to click handler to unbind it.
      var dismissClickHandler = function (evt) {
        if (element[0] !== evt.target) {
          resetMatches();
          scope.$digest();
        }
      };

      $document.bind('click', dismissClickHandler);

      originalScope.$on('$destroy', function(){
        $document.unbind('click', dismissClickHandler);
        if (appendToBody) {
          $popup.remove();
        }
      });

      var $popup = $compile(popUpEl)(scope);
      if (appendToBody) {
        $document.find('body').append($popup);
      } else {
        element.after($popup);
      }
    }
  };

}])

  .directive('typeaheadPopup', function () {
    return {
      restrict:'EA',
      scope:{
        matches:'=',
        query:'=',
        active:'=',
        position:'=',
        select:'&'
      },
      replace:true,
      templateUrl:'template/typeahead/typeahead-popup.html',
      link:function (scope, element, attrs) {

        scope.templateUrl = attrs.templateUrl;

        scope.isOpen = function () {
          return scope.matches.length > 0;
        };

        scope.isActive = function (matchIdx) {
          return scope.active == matchIdx;
        };

        scope.selectActive = function (matchIdx) {
          scope.active = matchIdx;
        };

        scope.selectMatch = function (activeIdx) {
          scope.select({activeIdx:activeIdx});
        };
      }
    };
  })

  .directive('typeaheadMatch', ['$http', '$templateCache', '$compile', '$parse', function ($http, $templateCache, $compile, $parse) {
    return {
      restrict:'EA',
      scope:{
        index:'=',
        match:'=',
        query:'='
      },
      link:function (scope, element, attrs) {
        var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || 'template/typeahead/typeahead-match.html';
        $http.get(tplUrl, {cache: $templateCache}).success(function(tplContent){
           element.replaceWith($compile(tplContent.trim())(scope));
        });
      }
    };
  }])

  .filter('typeaheadHighlight', function() {

    function escapeRegexp(queryToEscape) {
      return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    return function(matchItem, query) {
      return query ? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem;
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

angular.module("template/carousel/carousel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/carousel/carousel.html",
    "<div ng-mouseenter=\"pause()\" ng-mouseleave=\"play()\" class=\"carousel\" ng-swipe-right=\"prev()\" ng-swipe-left=\"next()\">\n" +
    "    <ol class=\"carousel-indicators\" ng-show=\"slides.length > 1\">\n" +
    "        <li ng-repeat=\"slide in slides track by $index\" ng-class=\"{active: isActive(slide)}\" ng-click=\"select(slide)\"></li>\n" +
    "    </ol>\n" +
    "    <div class=\"carousel-inner\" ng-transclude></div>\n" +
    "    <a class=\"left carousel-control\" ng-click=\"prev()\" ng-show=\"slides.length > 1\"><span class=\"glyphicon glyphicon-chevron-left\"></span></a>\n" +
    "    <a class=\"right carousel-control\" ng-click=\"next()\" ng-show=\"slides.length > 1\"><span class=\"glyphicon glyphicon-chevron-right\"></span></a>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/carousel/slide.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/carousel/slide.html",
    "<div ng-class=\"{\n" +
    "    'active': leaving || (active && !entering),\n" +
    "    'prev': (next || active) && direction=='prev',\n" +
    "    'next': (next || active) && direction=='next',\n" +
    "    'right': direction=='prev',\n" +
    "    'left': direction=='next'\n" +
    "  }\" class=\"item text-center\" ng-transclude></div>\n" +
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

angular.module("template/modal/backdrop.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/modal/backdrop.html",
    "<div class=\"modal-backdrop fade {{ backdropClass }}\"\n" +
    "     ng-class=\"{in: animate}\"\n" +
    "     ng-style=\"{'z-index': 1040 + (index && 1 || 0) + index*10}\"\n" +
    "></div>\n" +
    "");
}]);

angular.module("template/modal/window.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/modal/window.html",
    "<div tabindex=\"-1\" role=\"dialog\" class=\"modal fade\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 1050 + index*10, display: 'block'}\" ng-click=\"close($event)\">\n" +
    "    <div class=\"modal-dialog\" ng-class=\"{'modal-sm': size == 'sm', 'modal-lg': size == 'lg'}\"><div class=\"modal-content\" modal-transclude></div></div>\n" +
    "</div>");
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

angular.module("template/progressbar/bar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/progressbar/bar.html",
    "<div class=\"progress-bar\" ng-class=\"type && 'progress-bar-' + type\" role=\"progressbar\" aria-valuenow=\"{{value}}\" aria-valuemin=\"0\" aria-valuemax=\"{{max}}\" ng-style=\"{width: percent + '%'}\" aria-valuetext=\"{{percent | number:0}}%\" ng-transclude></div>");
}]);

angular.module("template/progressbar/progress.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/progressbar/progress.html",
    "<div class=\"progress\" ng-transclude></div>");
}]);

angular.module("template/progressbar/progressbar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/progressbar/progressbar.html",
    "<div class=\"progress\">\n" +
    "  <div class=\"progress-bar\" ng-class=\"type && 'progress-bar-' + type\" role=\"progressbar\" aria-valuenow=\"{{value}}\" aria-valuemin=\"0\" aria-valuemax=\"{{max}}\" ng-style=\"{width: percent + '%'}\" aria-valuetext=\"{{percent | number:0}}%\" ng-transclude></div>\n" +
    "</div>");
}]);

angular.module("template/rating/rating.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/rating/rating.html",
    "<span ng-mouseleave=\"reset()\" ng-keydown=\"onKeydown($event)\" tabindex=\"0\" role=\"slider\" aria-valuemin=\"0\" aria-valuemax=\"{{range.length}}\" aria-valuenow=\"{{value}}\">\n" +
    "    <i ng-repeat=\"r in range track by $index\" ng-mouseenter=\"enter($index + 1)\" ng-click=\"rate($index + 1)\" class=\"glyphicon\" ng-class=\"$index < value && (r.stateOn || 'glyphicon-star') || (r.stateOff || 'glyphicon-star-empty')\">\n" +
    "        <span class=\"sr-only\">({{ $index < value ? '*' : ' ' }})</span>\n" +
    "    </i>\n" +
    "</span>");
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

angular.module("template/typeahead/typeahead-match.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/typeahead/typeahead-match.html",
    "<a tabindex=\"-1\" bind-html-unsafe=\"match.label | typeaheadHighlight:query\"></a>");
}]);

angular.module("template/typeahead/typeahead-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/typeahead/typeahead-popup.html",
    "<ul class=\"dropdown-menu\" ng-show=\"isOpen()\" ng-style=\"{top: position.top+'px', left: position.left+'px'}\" style=\"display: block;\" role=\"listbox\" aria-hidden=\"{{!isOpen()}}\">\n" +
    "    <li ng-repeat=\"match in matches track by $index\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" ng-click=\"selectMatch($index)\" role=\"option\" id=\"{{match.id}}\">\n" +
    "        <div typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\"></div>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module('ualib.ui', [
    'ui.bootstrap',
    'duScroll',
    'ualib.ui.templates'
])

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

  .directive('pageWithMenu', [function(){
    return{
      restrict: 'C',
      transclude: true,
        replace: true,
      templateUrl: 'page/templates/page.tpl.html',
      controller: function($scope, $element){
        var menu = $scope.menu = [];
        this.addSection = function(section){
          menu.push(section);
          console.log(section);
        }

          $element.addClass('loaded');
      }
    }
  }])

  .directive('pageSection', [function(){
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
        };
        return {
            restrict: 'AC',
            require: '^?uiScrollfixTarget',
            link: function (scope, elm, attrs, uiScrollfixTarget) {
                var absolute = true, 
                    shift = -30,
                    fixLimit,
                    $target = uiScrollfixTarget && uiScrollfixTarget.$element || angular.element($window);
                
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

                    if (!elm.hasClass('scrollfix') && offset > limit) {
                        var width = elm[0].offsetWidth;
                        elm.css('width', width + 'px');
                        elm.addClass('scrollfix');
                        fixLimit = limit;
                    } else if (elm.hasClass('scrollfix') && offset < fixLimit) {
                        elm.removeClass('scrollfix');
                        elm.css('width', 'auto');
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
            controller: function() {
                //Empty controller so other directives can require being 'under' a tab
            },
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
    });;angular.module('oneSearch.templates', ['bento/bento.tpl.html', 'common/directives/suggest/suggest.tpl.html', 'common/engines/acumen/acumen.tpl.html', 'common/engines/catalog/catalog.tpl.html', 'common/engines/databases/databases.tpl.html', 'common/engines/ejournals/ejournals.tpl.html', 'common/engines/google-cs/google-cs.tpl.html', 'common/engines/recommend/recommend.tpl.html', 'common/engines/scout/scout.tpl.html', 'videos/videos.tpl.html']);

angular.module("bento/bento.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bento/bento.tpl.html",
    "<div class=\"bento-box-container\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-4\">\n" +
    "            <div class=\"bento-box\" bento-box=\"articles\">\n" +
    "                <h2>Articles</h2>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-4\">\n" +
    "            <div class=\"bento-box\" bento-box=\"books\">\n" +
    "                <h2>Books</h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-sm-12 col-md-4\">\n" +
    "            <div class=\"bento-box\" bento-box=\"journals\">\n" +
    "                <h2>Journals</h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <div class=\"bento-box\" bento-box=\"media\">\n" +
    "                <h2>Multimedia</h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <div class=\"bento-box\" bento-box=\"acumen\">\n" +
    "                <h2>Acumen</h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-4\">\n" +
    "            <div class=\"bento-box\" bento-box=\"databases\">\n" +
    "                <h2>Databases\n" +
    "                    <small>\n" +
    "                        [<a href=\"{{domain}}sample-page/databases/#/databases/ts/d/{{s}}/fs/ft/\">more</a>]\n" +
    "                    </small>\n" +
    "                </h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-4\">\n" +
    "            <div class=\"bento-box\" bento-box=\"other\">\n" +
    "                <h2>Other Media</h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-12 col-md-4\">\n" +
    "            <div class=\"bento-box\" bento-box=\"libguides\">\n" +
    "                <h2>LibGuides</h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <div class=\"bento-box\" bento-box=\"googleCS\">\n" +
    "                <h2>Libraries' Website</h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <div class=\"bento-box\" bento-box=\"faq\">\n" +
    "                <h2>FAQ</h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/directives/suggest/suggest.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/directives/suggest/suggest.tpl.html",
    "<div class=\"input-group input-group-lg\">\n" +
    "    <input type=\"text\" name=\"search\" class=\"form-control onesearch-text\" placeholder=\"{{prompt}}\"\n" +
    "           ng-model=\"model\" ng-change=\"onChange()\" autocomplete=\"off\" ng-blur=\"onBlur()\" ng-focus=\"onFocus()\" />\n" +
    "    <div class=\"input-group-btn\">\n" +
    "        <button type=\"submit\" class=\"btn btn-onesearch btn-primary\"><span class=\"fa fa-search\"></span></button>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"suggest\" ng-hide=\"model.length < 3 || selected\">\n" +
    "    <div class=\"row\" ng-hide=\"items.suggest.length == 0\">\n" +
    "        <ul class=\"nav nav-pills nav-stacked\">\n" +
    "            <li role=\"presentation\"\n" +
    "                ng-repeat=\"item in filteredItems = (items.suggest | filter:compare(originalValue)) | limitTo:numShow track by $index\"\n" +
    "                ng-mousedown=\"handleSelection(item.search)\" ng-class=\"item.class\"\n" +
    "                ng-mouseenter=\"setCurrent($index, false)\">\n" +
    "                <a href=\"#\">{{item.search}}</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <div class=\"suggest-row\" ng-show=\"items.recommend.length || items.subjects.length || items.faq.searchInformation.totalResults > 0\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-sm-4\" ng-show=\"items.recommend.length\">\n" +
    "                <div class=\"suggest-col\">\n" +
    "                    <h4>Web site pages</h4>\n" +
    "                    <div ng-repeat=\"recommendation in items.recommend | limitTo:10\">\n" +
    "                        <a href=\"{{recommendation.link}}\" ng-mousedown=\"go(recommendation.link)\">\n" +
    "                            {{recommendation.description}}\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-sm-4\" ng-show=\"items.subjects.length\">\n" +
    "                <div class=\"suggest-col\">\n" +
    "                    <h4>LibGuides Subjects <a href=\"http://guides.lib.ua.edu/\" class=\"small\" ng-mousedown=\"go('http://guides.lib.ua.edu/')\">more</a></h4>\n" +
    "                    <div ng-repeat=\"person in items.subjects | limitTo:10\">\n" +
    "                        <div ng-repeat=\"subject in person.subjects | limitTo:2\">\n" +
    "                            <a ng-if=\"subject.link.length > 7\" href=\"{{subject.link}}\" ng-mousedown=\"go(subject.link)\">\n" +
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
    "            <div class=\"col-sm-4\" ng-show=\"items.faq.searchInformation.totalResults > 0\">\n" +
    "                <div class=\"suggest-col\">\n" +
    "                    <h4>FAQ <a href=\"http://ask.lib.ua.edu/\" class=\"small\" ng-mousedown=\"go('http://ask.lib.ua.edu/')\">more</a></h4>\n" +
    "                    <div ng-repeat=\"faq in items.faq.items | limitTo:5\">\n" +
    "                        <a href=\"{{faq.link}}\" ng-mousedown=\"go(faq.link)\">\n" +
    "                            {{faq.title}}\n" +
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
    "    <a class=\"pull-left\" ng-href=\"http://acumen.lib.ua.edu/{{item.link}}\" title=\"{{item.title}}\">\n" +
    "        <img ng-src=\"{{item.thumb_path}}\">\n" +
    "    </a>\n" +
    "    <div class=\"media-body\">\n" +
    "        <h4 class=\"media-heading\">\n" +
    "            <a ng-href=\"http://acumen.lib.ua.edu/{{item.link}}\" title=\"item.title\">{{item.title | truncate: 40: '...': true}}</a>\n" +
    "        </h4>\n" +
    "        <div class=\"details-context\">\n" +
    "            <span ng-if=\"item.date\" ng-bind-html=\"item.date\"></span>\n" +
    "            <span ng-if=\"item.type\" ng-bind-html=\"item.type | ucfirst\"></span>\n" +
    "        </div>\n" +
    "        <p>{{item.description | truncate: 125: '...': true}}</p>\n" +
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
    "               ng-bind-html=\"item.title | truncate: 50: '...': true\"></a>\n" +
    "        </h4>\n" +
    "        <div class=\"details-context\">\n" +
    "            <span ng-if=\"item.year && item.year | number\" ng-bind-html=\"item.year\"></span>\n" +
    "            <span ng-if=\"item.mediaType\" ng-bind-html=\"item.mediaType\"></span>\n" +
    "            <span ng-if=\"item.issn\">ISSN: {{item.issn}}</span>\n" +
    "        </div>\n" +
    "        <div class=\"details-container\" ng-if=\"item.author\">\n" +
    "            <span class=\"text-muted\">Author(s)</span>\n" +
    "            <span class=\"detail\">\n" +
    "                <span ng-bind-html=\"item.author | lowercase | ucfirst\"></span>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/engines/databases/databases.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/engines/databases/databases.tpl.html",
    "<div class=\"media\">\n" +
    "    <div class=\"media-body\">\n" +
    "        <h4 class=\"media-heading\">\n" +
    "            <a ng-href=\"{{item.url}}\" title=\"{{item.title}}\">{{item.title | truncate: 40: '...': true}}</a>\n" +
    "        </h4>\n" +
    "        <div class=\"details-context\">\n" +
    "            <span ng-if=\"item.coverage\" ng-bind-html=\"item.coverage\"></span>\n" +
    "        </div>\n" +
    "        <p>\n" +
    "            {{item.description | truncate: 125: '...'}}\n" +
    "        </p>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/engines/ejournals/ejournals.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/engines/ejournals/ejournals.tpl.html",
    "<div class=\"media\">\n" +
    "    <div class=\"media-body\">\n" +
    "        <h4 class=\"media-heading\">\n" +
    "            <a ng-href=\"{{item.links[0].href}}\" title=\"{{item.title}}\">{{item.title | ltrim | truncate: 50: '...': true}}</a>\n" +
    "        </h4>\n" +
    "\n" +
    "        <div class=\"details-context\">\n" +
    "            <span ng-if=\"item.date\" ng-bind-html=\"item.date\"></span>\n" +
    "            <span ng-if=\"item.links[0]\">\n" +
    "                Source: <span title=\"{{item.links[0].name}}\">{{item.links[0].name | ltrim | truncate: 35: '...'}}</span>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"details-container\" ng-if=\"item.authors\">\n" +
    "            <span class=\"text-muted\">Author(s)</span>\n" +
    "            <span class=\"details\" ng-bind-html=\"item.authors\"></span>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"details-container\" ng-if=\"item.links[1]\">\n" +
    "            <span class=\"text-muted\">Other Sources: </span>\n" +
    "            <span class=\"details\" ng-repeat=\"link in item.links | after:1 | limitTo : (sourceLimit ? 10 : 2)\">\n" +
    "                <a ng-href=\"{{link.href}}\"\n" +
    "                   title=\"{{link.name}}\"\n" +
    "                   class=\"source-link\"\n" +
    "                   ng-bind-html=\"link.name | ltrim | truncate: 35: '...': true\"></a>\n" +
    "            </span>\n" +
    "            <div ng-show=\"item.links[3]\">\n" +
    "                <button type=\"button\" class=\"btn btn-default btn-collapser\" ng-click=\"sourceLimit = !sourceLimit\">{{sourceLimit? 'more' : 'less'}}</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/engines/google-cs/google-cs.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/engines/google-cs/google-cs.tpl.html",
    "<div class=\"media\">\n" +
    "    <div class=\"media-body\">\n" +
    "        <h4 class=\"media-heading\"><a ng-href=\"{{item.link}}\" title=\"{{item.title}}\">{{item.title | truncate: 40: '...': true}}</a></h4>\n" +
    "        <p ng-bind-html=\"item.htmlSnippet\"></p>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!--div class=\"media\">\n" +
    "    <div class=\"media-body\">\n" +
    "        <h4 class=\"media-heading\"><a href=\"http://guides.lib.ua.edu\">Library Guides</a></h4>\n" +
    "        <div class=\"media\" ng-repeat=\"guide in items | limitTo:2 | filter:{link:'guides.lib.ua.edu'}\">\n" +
    "            <a class=\"media-left\" ng-href=\"{{guide.link}}\" title=\"{{guide.title}}\">\n" +
    "                <img ng-src=\"guide.pagemap.cse_thumbnail[0].src\"\n" +
    "                     width=\"{{guide.pagemap.cse_thumbnail[0].width}}\"\n" +
    "                     height=\"{{guide.pagemap.cse_thumbnail[0].height}}\">\n" +
    "            </a>\n" +
    "            <div class=\"media-body\">\n" +
    "                <h4 class=\"media-heading\">\n" +
    "                    <a ng-href=\"{{guide.link}}\">{{guide.title}}</a>\n" +
    "                </h4>\n" +
    "                <p>{{guide.snippet}}</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div-->");
}]);

angular.module("common/engines/recommend/recommend.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/engines/recommend/recommend.tpl.html",
    "<div class=\"media\">\n" +
    "    <div class=\"media-body\">\n" +
    "        <h4 class=\"media-heading\"><a ng-href=\"{{item.link}}\" title=\"{{item.descr}}\">{{item.descr}}</a></h4>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("common/engines/scout/scout.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/engines/scout/scout.tpl.html",
    "<div class=\"media\">\n" +
    "    <div class=\"media-body\">\n" +
    "        <h4 class=\"media-heading\">\n" +
    "            <a ng-href=\"{{item.PLink}}\"\n" +
    "               title=\"{{item.Items[0].Data}}\"\n" +
    "               ng-bind-html=\"item.RecordInfo.BibRecord.BibEntity.Titles[0].TitleFull | lowercase | ucfirst\"></a>\n" +
    "        </h4>\n" +
    "        <div class=\"details-context\">\n" +
    "            <span ng-if=\"item.RecordInfo.BibRecord.BibRelationships.IsPartOfRelationships[0].BibEntity.Dates[0]\">{{item.RecordInfo.BibRecord.BibRelationships.IsPartOfRelationships[0].BibEntity.Dates[0].Y}} </span>\n" +
    "            <span ng-if=\"item.mediaType\">{{item.mediaType}} </span>\n" +
    "            <span ng-if=\"item.FullText.Text.Availability\">Full Text Online</span>\n" +
    "        </div>\n" +
    "        <div collapse=\"isCollapsed\">\n" +
    "            <div class=\"details-container\" ng-if=\"item.RecordInfo.BibRecord.BibRelationships.HasContributorRelationships\">\n" +
    "                <span class=\"text-muted\">Author(s): </span>\n" +
    "            <span class=\"details\"\n" +
    "                  ng-repeat=\"author in item.RecordInfo.BibRecord.BibRelationships.HasContributorRelationships | unique: 'PersonEntity.Name.NameFull'\"\n" +
    "                  ng-bind-html=\"author.PersonEntity.Name.NameFull | lowercase | ucfirst\"></span>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"details-container\" ng-if=\"item.source\">\n" +
    "                <span class=\"text-muted\">Source(s): </span>\n" +
    "                <span class=\"details\" ng-bind-html=\"item.source\"></span>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"details-container\" ng-if=\"item.RecordInfo.BibRecord.BibEntity.Subjects\">\n" +
    "                <span class=\"text-muted\">Subejct(s): </span>\n" +
    "            <span class=\"details\"\n" +
    "                  ng-repeat=\"subject in item.RecordInfo.BibRecord.BibEntity.Subjects\"\n" +
    "                  ng-bind-html=\"subject.SubjectFull\"></span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <button type=\"button\" class=\"btn btn-default btn-xs\" ng-click=\"isCollapsed = !isCollapsed\">{{!isCollapsed ? 'less' : 'more'}} detail</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("videos/videos.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("videos/videos.tpl.html",
    "<div class=\"video-container\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-9 video-results\">\n" +
    "            <div class=\"media\" ng-repeat=\"item in videos.results | filter:facets\">\n" +
    "                <div class=\"media-body\">\n" +
    "                    <h4 class=\"media-heading\">\n" +
    "                        {{item.title}}\n" +
    "                    </h4>\n" +
    "                    <div class=\"details-context\">\n" +
    "                        <span ng-if=\"item.series_title\">{{item.series_title}}</span>\n" +
    "                        <span ng-if=\"item.call_number\">{{item.call_number}} </span>\n" +
    "                        <span ng-if=\"item.genre\">{{item.genre}} </span>\n" +
    "                        <span ng-if=\"item.language\">{{item.language}} </span>\n" +
    "                    </div>\n" +
    "                    <p>{{item.notes}}</p>\n" +
    "                    <span class=\"text-muted\">{{item.keywords}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-3 facets-container video-facets\">\n" +
    "            <form>\n" +
    "                <div class=\"form-group\" ng-repeat=\"(label, type) in videos.facets\">\n" +
    "                    <h4>{{label}}</h4>\n" +
    "                    <div class=\"facet-group-container\">\n" +
    "                        <div class=\"facet-group\">\n" +
    "                            <div class=\"checkbox\" ng-repeat=\"facet in type\">\n" +
    "                                <label>\n" +
    "                                    <input type=\"checkbox\"> {{facet.label}}\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
;/**
 * Central oneSearch module that defined all components and dependencies involved
 * for the oneSearch interface.
 *
 * All modules in this app are named with their immediate parent's name prepended.
 * So, all modules at this point are prepended with "oneSearch.*", and modules loaded in "oneSearch.common" are prepended with "common.*", and so on.
 * This is a lazy attempt to prevent namespace conflicts with other javascripts.
 */
angular.module('oneSearch', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngSanitize',
    'ui.bootstrap',
    'angular.filter',
    'oneSearch.common',
    'oneSearch.templates',
    'oneSearch.bento',
    'oneSearch.videos'
])
    // The URL to the main website
    .constant('UALIB_DOMAIN', '//wwwdev2.lib.ua.edu/')

    // Default search parameters
    .value('SearchParams', {
        pp: 100
    })
angular.module('oneSearch.bento', [])

    .config(['$routeProvider', function($routeProvider) {
        /**
         * Register Bento Box display route with ngRoute's $routeProvider
         */
        $routeProvider
            .when('/bento/:s', {
                templateUrl: 'bento/bento.tpl.html',
                controller: 'BentoCtrl'
            })
    }])

/**
 * Bento Service Provider
 *
 * This service uses the mediaTypes service to organize the engine results by media type
 * and preloaded an engine's template and controller (if defined) if there are results for that engine.
 */
    .service('Bento', ['$routeParams', '$rootScope','$q', 'oneSearch', 'mediaTypes', function($routeParams, $rootScope, $q, oneSearch, mediaTypes){
        //variable representing 'this' for closure context
        //this ensures function closure reference variables in the right context
        var self = this;

        /**
         * Object to hold box data
         * @Object = {
         *      // Box names are generated by media types defined by registered engines
         *      NAME: {
         *          // An Array of engine names (String) used to get engine templates/controllers and track when the box is done loading.
         *          // Once an engine is finished loading, the engine's name is removed from this array. The removed value is used to reference the loaded engine's preloaded
         *          // template/controller. Once this Array is empty the "box" is considered loaded.
         *          engines: Array,
         *
         *          // The object's keys are the engine names and the values are the results returned using
         *          // the JSON path from an engine's resultsPath param
         *          results: {
         *              ENGINE_NAME1: {},
         *              ENGINE_NAME2: {},
         *              etc...
         *          }
         *      }
         *  }
         */
        this.boxes = {};

        this.boxMenu = [];

        /**
         * Object to hold pre-loaded engine templates and controllers.
         * Templates and controllers are only pre-loaded if the engine yields results.
         * @Object = {
         *      // Engine name, defined by engine's config registering with the oneSearchProvider
         *      NAME: {
         *          // the "tpl" key returns a Promise to retrieve the engine's template
         *          // The Promise is generated from Angular's $http Service (https://code.angularjs.org/1.3.0/docs/api/ng/service/$http),
         *          // which uses the promise methods from Angular's $q Service (https://code.angularjs.org/1.3.0/docs/api/ng/service/$q)
         *          tpl: Promise,
         *
         *          // The "controller" key will return an instance of the engine's controller or "null" if no controller was defined
         *          controller: Controller Instance|null
         *      }
         * }
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
            })
        }

        function initResultLimit(box){
            var numEngines = self.boxes[box]['engines'].length;
            var limit = numEngines > 2 ? 1 : (numEngines < 2 ? 3 : 2);
            self.boxes[box].resultLimit = limit;
        }

        function setResultLimit(box){
            $q.when(self.boxes[box].results)
                .then(function(results){
                    var numResults = Object.keys(results).length;
                    var numEngines = self.boxes[box]['engines'].length;

                    if (self.boxes[box].resultLimit < 3 && numResults < 2 && numEngines < 2){
                        self.boxes[box].resultLimit++;
                    }
                });
        }



        // Gets all boxes
        this.getBoxes = function(){
            // Search all engines registered with the oneSearch Provider, giving the
            // $routeParams object as the parameter (https://code.angularjs.org/1.3.0/docs/api/ngRoute/service/$routeParams)
            var engines = oneSearch.searchAll($routeParams);

            // Deep copy media types defined by registered engines to the this.boxes object.
            angular.copy(mediaTypes.types, self.boxes);

            // Pre-define the "results" object for each media type - I only do this here so I don't have to check if it's defined later
            angular.forEach(self.boxes, function(box, type){
                initResultLimit(type);
                self.boxes[type].results = {};

            });

            //  Iterate over the Promises for each engine returned by the oneSearch.searchAll() function
            angular.forEach(engines, function(engine, name){
                engine.response
                    .$promise.then(function(data){ // If $http call was a success

                        // User the engine's results getter to get the results object
                        // The results getter is defined by the JSON path defined by the
                        // "resultsPath" param in an engine's config
                        var res = engine.getResults(data);

                        // Double check that the data is defined, in case the search API returned a '200' status with empty results.
                        if (isEmpty(res)){
                            //console.log(self.boxes);
                            removeFromBoxes(name);
                            //console.log(self.boxes);
                        }
                        else {
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
                                    self.boxes[type].results[name] = grouped[type];
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

        }
    }])

/**
 * BentoCtrl Controller - Bento Box route's Contorller
 *
 */
    .controller('BentoCtrl', ['$scope', 'Bento', function($scope, Bento){
        // When the route has changed/updated generate box results
        $scope.$on('$routeChangeSuccess', function(){
            Bento.boxMenu = [];
            Bento.getBoxes();
        })
    }])

/**
 * bentoBox Directive
 *
 * Each box is called using this directive, and is defined by a name. These names are first defined in an
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

    .controller('bentoBoxCtrl', ['$scope', '$routeParams', 'UALIB_DOMAIN', function($scope, $routeParams, domain){
        // Updates total results links
        $scope.domain = domain;
        $scope.s = $routeParams.s;
    }])

    .directive('bentoBoxMenu', ['Bento', '$animate', function(Bento, $animate){
        return {
            restrict: 'AC',
            link: function(scope, elm){

                scope.boxMenu = Bento.boxMenu;

            }
        }
    }])

    .directive('bentoBox', ['$rootScope', '$controller', '$compile', '$animate', 'Bento', function($rootScope, $controller, $compile, $animate, Bento){
        return {
            restrict: 'A', //The directive always requires and attribute, so disallow class use to avoid conflict
            scope: {},
            link: function(scope, elm, attrs, Ctrl){
                //Get the box name from the elements bentoBox attribute
                var box = attrs.bentoBox;
                elm.addClass(box);
                scope.bento= Bento;
                //Preload the spinner element
                var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');

                //Preload the location of the boxe's title element (needs to be more dynamic in the future)
                var titleElm = elm.find('h2');

                // Box menu/index scope variables
                Bento.boxMenu.push({box: box, title: titleElm.text(), loaded: false});

                //Enter the spinner animation, appending it to the title element
                $animate.enter(spinner, titleElm, angular.element(titleElm[0].lastChild));

                //Watch the boxes "engines" Array
                var boxWatcher = scope.$watchCollection(
                    function(){
                        return Bento.boxes[box]['engines'];
                    },
                    function(newVal, oldVal) {
                        // Has the "engines" Array changed?
                        if (newVal !== oldVal){
                            //variable for engine removed from array
                            var engine = '';

                            //intersect current and previous "engines" arrays to get the
                            //engine that is done loading (i.e., the engine name removed from the array)
                            //TODO: find more graceful way to know what engine is loaded?
                            for (var i = 0, len = oldVal.length; i < len; i++){
                                var eng = oldVal[i];
                                if (!(newVal.indexOf(eng) > -1)){
                                    engine = eng;
                                    break;
                                }
                            }

                            // Create a new scope for the engine's results
                            // See $rootScope docs: https://code.angularjs.org/1.3.0/docs/api/ng/type/$rootScope.Scope#$new
                            var engineScope = $rootScope.$new();

                            // Place engine results for the current box under an "items" object in the new local scope
                            engineScope.items = Bento.boxes[box]['results'][engine];

                            //console.log(Bento.boxes[box]['results']);
                            if (engineScope.items && engineScope.items.length > 0){
                                // Set isCollapsed boolean to true
                                // For engines that have collapsible results (see /common/engines/ejournals/ejournals.tpl.html for example)
                                engineScope.isCollapsed = true;

                                ///engineScope.limit = Bento.boxes[box].resultLimit;
                                engineScope.engine = engine;

                                // When the engine's promise is ready, then load the engine's controller/template data applying
                                // the new isolated scope.
                                Bento.engines[engine].tpl.then(function(data){

                                    var EngCtrl = ['$scope', 'Bento', function($scope, Bento){
                                        // Extend any controller defined by an engine's config
                                        if (Bento.engines[$scope.engine].controller){
                                            angular.extend(this, $controller(Bento.engines[$scope.engine].controller, {$scope: $scope}));
                                        }
                                        $scope.box = Bento.boxes[box];
                                    }];

                                    var controller = $controller(EngCtrl, {$scope: engineScope, Bento: Bento});
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
                            if (newVal.length == 0){
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
                    if (isEmpty(Bento.boxes[b]['results'])){

                        if (attrs.hideIfEmpty){
                            elm.addClass('hidden');
                        }
                        else{
                            elm.append("<strong>No Results</strong>");
                            elm.addClass('text-muted');
                        }
                    }

                    // Tell bentoMenu item it's loaded
                    Bento.boxMenu.map(function(obj){
                        if (obj.box === b){
                            obj.loaded = true;
                        }
                        return obj
                    });

                    // Tell spinner to exit animation
                    $animate.leave(spinner);

                    // Destroy this box's watcher (no need to waste the cycles)
                    boxWatcher();
                }
            },
            controller: 'bentoBoxCtrl'
        }
    }])
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
])
angular.module('oneSearch.common')
    .factory('dataFactory', function($http) {
        return {
            get: function(url) {
                return $http.get(url).then(function(resp) {
                    return resp.data; // success callback returns this
                });
            }
        };
    })
    .directive('suggestOneSearch', function($timeout) {
        return {
            restrict: 'AEC',
            scope: {
                prompt: '@',
                model: '=',
                search: '='
            },
            controller: function($scope, $window, $timeout, dataFactory){
                $scope.items = {};
                $scope.filteredItems = [];
                $scope.model = "";
                $scope.current = -1;
                $scope.originalValue = $scope.model;
                $scope.dataRequested = false;
                $scope.numShow = 5;

                // hides the list initially
                $scope.selected = true;

                $scope.onChange = function(){
                    var lastSpace = $scope.model.lastIndexOf(" ");
                    $scope.selected = false;

                    if ($scope.model.length - lastSpace <= 3 || $scope.model.indexOf($scope.originalValue) < 0){
                        $scope.items = {};
                        $scope.setCurrent(-1, false);
                        $scope.dataRequested = false;
                    }
                    if ($scope.model.length - lastSpace > 3 && !$scope.dataRequested){
                        dataFactory.get('//wwwdev2.lib.ua.edu/oneSearch/api/suggest/' + $scope.model)
                            .then(function(data) {
                                $scope.items.suggest = data;
                                $scope.setCurrent(-1, false);
                            });
                        $scope.dataRequested = true;
                    }
                    if ($scope.model.length > 2){
                        $timeout(function() {
                            dataFactory.get('//wwwdev2.lib.ua.edu/oneSearch/api/recommend/' + $scope.model)
                                .then(function(data) {
                                    $scope.items.recommend = data;
                                });
                            dataFactory.get('//wwwdev2.lib.ua.edu/staffDir/api/subject/' + $scope.model + '/match/startwith')
                                .then(function(data) {
                                    $scope.items.subjects = data;
                                });
                            dataFactory.get('//www.googleapis.com/customsearch/v1?key=AIzaSyCMGfdDaSfjqv5zYoS0mTJnOT3e9MURWkU&cx=003453353330912650815:lfyr_-azrxe&q=' +
                            $scope.model + '&siteSearch=ask.lib.ua.edu')
                                .then(function(data) {
                                    $scope.items.faq = data;
                                });
                        }, 200);
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
                        $scope.selected = false;
                    }
                };
                $scope.onBlur = function($event){
                    $scope.selected = true;
                };
                $scope.compare = function(query){
                    return function(item){
                        if (item.search.indexOf(query) == 0 &&
                            !angular.equals(item.search.toLowerCase(), query.toLowerCase()))
                            return true;
                        return false;
                    };
                };
            },
            link: function(scope, elem, attrs) {
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
                            scope.selected = true;
                            break;

                        default:
                            break;
                    }
                    scope.$apply();
                });
                scope.handleSelection = function(selectedItem) {
                    $timeout(function() {
                        scope.model = selectedItem;
                        scope.selected = true;
                        scope.$apply();
                        scope.search();
                    }, 0);
                };
            },
            templateUrl: 'common/directives/suggest/suggest.tpl.html'
        };
    })

angular.module('engines.acumen', [])

    .config(['oneSearchProvider', function(oneSearchProvider){
        oneSearchProvider.engine('acumen', {
            id: 8,
            priority: 3,
            resultsPath: 'Acumen.data',
            totalsPath: 'Acumen.metadata.numFound',
            templateUrl: 'common/engines/acumen/acumen.tpl.html',
            controller: function($scope, $filter){
                var items = $scope.items;

                for (var i = 0, len = items.length; i < len; i++) {
                    if (items[i].type) {
                        //console.log(items[i].type);
                        if (items[i].type[0] == 'text' && items[i].details && items[i].details.genre) items[i].type = items[i].details.genre.sort().shift();
                        else items[i].type = items[i].type.sort().shift();
                    }
                }
            }
        })
    }])
angular.module('engines.catalog', [])

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
                    journals: ['ab','as','bb','bs','cb','cs','db','ds','eb','es','fb','fs','gb','gs','ib','is','jb','js','kb','ks','mb','ms','ob','os','pb','ps','rb','rs','tb','ts'],
                    media: ['ga','gc','gd','gm','ia','ic','id','im','ja','jc','jd','jm']
                }
            },
            templateUrl: 'common/engines/catalog/catalog.tpl.html',
            controller: function($scope, $filter){
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

                $scope.items = items;
            }
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
    }]);

angular.module('engines.databases', [])

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

    .config(['oneSearchProvider', function(oneSearchProvider){
        oneSearchProvider.engine('ejournals', {
            id: 4,
            priority: 6,
            resultsPath: 'eJournals.results',
            totalsPath: 'eJournals.total',
            mediaTypes: {
                path: 'type',
                types: {
                    books: 'book',
                    journals: 'periodical'
                }
            },
            templateUrl: 'common/engines/ejournals/ejournals.tpl.html'
        })
    }])
/**
 * @module common.engines
 *
 * Acts as central dependency manager for search engines.
 * All engines must be included here to appear in the results.
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
    .service('enginesTemplateFactory', ['$http', '$templateCache', function($http, $templateCache){

        // Generic getter to load template based on engine config
        // @param config An Engine's config Object
        this.get = function(config){
            // return template is "templateUrl" is defined. otherwise, return null
            return angular.isDefined(config.templateUrl) ? this.fromUrl(config.templateUrl) : null;
        };

        // So far only templateUrl is supported - worked with both file and cached templates.
        // adopted from https://github.com/angular-ui/ui-router/blob/master/src/templateFactory.js
        this.fromUrl = function(url){
            if (url == null) return null;
            else return $http
                .get(url, {cache: $templateCache, headers: { Accept: 'text/html' }})
                .then(function(response){ return response.data});
        };

    }])
angular.module('engines.faq', [])

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

    .config(['oneSearchProvider', function(oneSearchProvider){
        oneSearchProvider.engine('googleCS', {
            id: 16,
            priority: 2,
            resultsPath: 'GoogleCS.items',
            totalsPath: 'GoogleCS.searchInformation.totalResults',
            filterQuery: '-side:guides.lib.ua.edu -site:ask.lib.ua.edu',
            templateUrl: 'common/engines/google-cs/google-cs.tpl.html'
        })
    }])
angular.module('engines.libguides', [])

    .config(['oneSearchProvider', function(oneSearchProvider){
        oneSearchProvider.engine('libguides', {
            id: 16,
            priority: 2,
            resultsPath: 'GoogleCS.items',
            totalsPath: 'GoogleCS.searchInformation.totalResults',
            filterQuery: 'site:guides.lib.ua.edu',
            templateUrl: 'common/engines/google-cs/google-cs.tpl.html'
        })
    }])
angular.module('engines.recommend', [])

    .config(['oneSearchProvider', function(oneSearchProvider){
        oneSearchProvider.engine('recommend', {
            id: 512,
            priority: 0,
            resultsPath: 'Recommendations',
            templateUrl: 'common/engines/recommend/recommend.tpl.html'
        })
    }])
angular.module('engines.scout', [])

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
                    //journals: 'serialPeriodical',
                    articles: 'academicJournal',
                    media: ['audio', 'videoRecording']
                }
            },
            templateUrl: 'common/engines/scout/scout.tpl.html',
            controller: function($scope){
                var items = $scope.items;
                for (var i = 0; i < items.length; i++){
                    if (items[i].Header.PubTypeId == 'audio'){
                        items[i].mediaType = 'Audio';
                    }
                    if (items[i].Header.PubTypeId == 'videoRecording'){
                        items[i].mediaType = 'Video Recording';
                    }

                    //Search for "source"
                    var bibRelationships = [];
                    if (bibRelationships = items[i].RecordInfo.BibRecord.BibRelationships.IsPartOfRelationships){
                        for (var x = 0, len = bibRelationships.length; x < len; x++){
                            if (angular.isDefined(bibRelationships[x].BibEntity.Identifiers) && bibRelationships[x].BibEntity.Identifiers[0].Type === 'issn-print'){
                                // define source title
                                items[i].source = bibRelationships[x].BibEntity.Titles[0].TitleFull;

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
                }
                $scope.items = items;

            }
        })
    }])
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

var invertArrayToObject = function(obj){
    var inverted = {};

    Object.keys(obj).map(function(value, index){
        for (var i = 0, len = obj[value].length; i < len; i++){
            inverted[obj[value][i]] = value;
        }
    });
    return inverted;
}
// Adopted from http://stackoverflow.com/questions/4994201/is-object-empty
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
 * Adopted from UI Router library
 * https://github.com/angular-ui/ui-router/blob/master/src/common.js
 */
function merge(dst) {
    forEach(arguments, function(obj) {
        if (obj !== dst) {
            forEach(obj, function(value, key) {
                if (!dst.hasOwnProperty(key)) dst[key] = value;
            });
        }
    });
    return dst;
}
/**
 * Adopted from UI Router library
 * https://github.com/angular-ui/ui-router/blob/master/src/common.js
 */
// extracted from underscore.js
// Return a copy of the object omitting the blacklisted properties.
function omit(obj) {
    var copy = {};
    var keys = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
    for (var key in obj) {
        if (indexOf(keys, key) == -1) copy[key] = obj[key];
    }
    return copy;
}
// adopted from https://github.com/a8m/angular-filter/blob/master/src/_common.js
function toArray(object) {
    return Array.isArray(object) ? object :
        Object.keys(object).map(function(key) {
            return object[key];
        });
}
angular.module('common.mediaTypes', [])

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

        }

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
            })
            return groups;
        }

        this.$get = ['$parse', function($parse){
            return {
                types: _types,

                // Heavily influenced by angular-filter's group-by function:
                // https://github.com/a8m/angular-filter/blob/master/src/_filter/collection/group-by.js
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
    }])
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

    .factory('Search', ['$resource', function($resource){
        return $resource("//wwwdev2.lib.ua.edu/oneSearch/api/search/:s/engine/:engine/limit/:pp", {}, {cache: true});
    }])

    .provider('oneSearch', ['mediaTypesProvider', function oneSearchProvider(mediaTypesProvider){
        //private object that holds registered engines
        var _engines = {};

        //function to allow engines to register as searchable
        this.engine = function(name, engine){
            if (angular.isString(name)){
                var defaults = {
                    id: null, priority: 10, resultsPath: null, totalsPath: null, mediaTypes: null, templateUrl: null, filterQuery: null, controller: null
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

        this.$get = ['$http', '$parse', '$filter', 'enginesTemplateFactory', 'SearchParams', 'Search', function($http, $parse, $filter, enginesTemplateFactory, SearchParams, Search){


            return {
                engines: _engines, // Expose engines at Service level
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

                        // Store the $http response promise in the engine's object with key 'response
                        engine.response = Search.get(p); //$http({method: 'GET', url: url, params: p});

                        // Create results getter function from given results JSON path
                        if (angular.isDefined(engine.resultsPath)){
                            engine.getResults = $parse(engine.resultsPath);
                        }

                        // Create results getter function from given results JSON path
                        if (angular.isDefined(engine.totalsPath)){
                            engine.getTotal = $parse(engine.totalsPath);
                        }

                        // Put engine's object in private _engines object
                        _engines[name] = engine;
                    });

                    // Return all engines with response promises, and getter functions
                    return _engines;
                },
                search: function(engName, params, search_url){
                    if (!angular.isDefined(search_url))
                        console.log("Error: URL is not defined!");
                    var engine = _engines[engName];
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

                    // Store the $http response promise in the engine's object with key 'response
                    engine.response = $http({method: 'GET', url: search_url, params: p});

                    // Create results getter function from given results JSON path
                    if (angular.isDefined(engine.resultsPath)){
                        engine.getResults = $parse(engine.resultsPath);
                    }

                    // Create results getter function from given results JSON path
                    if (angular.isDefined(engine.totalsPath)){
                        engine.getTotal = $parse(engine.totalsPath);
                    }

                    // Put engine's object in private _engines object
                    return engine;
                },
                getEngineTemplate: function(engine){
                    return enginesTemplateFactory.get(engine);
                },
                getEngineController: function(engine){
                    return angular.isDefined(engine.controller) ? engine.controller : null;
                }

            }
        }]
    }])

    .controller('OneSearchCtrl', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope){
        $scope.searchText;
        $scope.search = function(){
            if ($scope.searchText){
                // Compensate for when not on home page
                // Since WP pages aren't loaded as angular routes, we must detect if there is no '#/PATH' present
                // after the URI (or that it's not a 'bento' route), then send the browser to a pre-build URL.
                if (!$location.path() || $location.path().indexOf('/bento') < 0){
                    var url = '//' + $location.host() + '#/bento/'+$scope.searchText;
                    window.location = url; //Angular 1.2.8 $location is too limited...
                }
                else{
                    $location.path('/bento/'+$scope.searchText);
                }
            }
        }

        $rootScope.$on('$routeChangeSuccess', function(event,currentRoute){
            var s = currentRoute.params.s;
            if ($scope.searchText !== s){
                $scope.searchText = s;
            }
        });
    }])

    // Borrowed from https://github.com/fmquaglia/ngOrderObjectBy
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
angular.module('oneSearch.videos', [])

    .config(['$routeProvider', function($routeProvider) {
        /**
         * Register Videos videos display route with ngRoute's $routeProvider
         */
        $routeProvider
            .when('/videos/:search', {
                templateUrl: 'videos/videos.tpl.html',
                resolve: {
                    'Videos': ['$resource', '$location', '$routeParams', function($resource, $location, $routeParams){
                        var url = 'https://wwwdev.lib.ua.edu/musicsearch/api';
                        var params = {};

                        return {
                            results: function(){
                                var path = url;
                                angular.copy($routeParams, params);
                                angular.extend(params, $location.search());

                                angular.forEach(params, function(value, param){
                                    path += '/' + param + '/' + value;
                                })
                                return $resource(path);
                            },
                            facets: function(){
                                var path = url;
                                return $resource(path + '/genres');
                            }
                        }
                    }]
                },
                controller: ['$scope', 'Videos', function($scope, Videos){
                    $scope.videos = {
                        results: {},
                        facets: {}
                    };
                    $scope.currentPage = 1;

                    Videos.facets().get()
                        .$promise.then(function(data){
                            $scope.videos.facets = data;
                        },function(){
                            console.log('Error retrieving facets');
                        });

                    $scope.$on('$routeChangeSuccess', function(){
                        Videos.results().get()
                            .$promise.then(function(data){
                                $scope.videos.total = data.totalResults;
                                $scope.currentPage = 1;
                                $scope.videos.results = data.results;
                            });
                    });
                }]
            })
    }]);;angular.module('hours.templates', ['calendar/calendar-day.tpl.html', 'calendar/calendar.tpl.html', 'lib-hours-today/lib-hours-today.tpl.html', 'list/list.tpl.html']);

angular.module("calendar/calendar-day.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("calendar/calendar-day.tpl.html",
    "<div class=\"cal-day\">\n" +
    "    <div class=\"dat\">{{day.ts * 1000 | date:'d'}}</div>\n" +
    "    <div class=\"hours\">\n" +
    "        {{day.hoursFrom}}\n" +
    "        <div ng-show=\"day.hoursFrom != day.hoursTo\">\n" +
    "            {{day.hoursTo}}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("calendar/calendar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("calendar/calendar.tpl.html",
    "<h2>Calendar</h2>\n" +
    "<div class=\"cal-container\">\n" +
    "    <nav class=\"navbar navbar-default navbar-embedded\">\n" +
    "        <button type=\"button\" class=\"btn btn-default navbar-btn navbar-left\" ng-click=\"prevMonth()\">\n" +
    "            <span class=\"fa fa-angle-left\"></span>\n" +
    "        </button>\n" +
    "        <p class=\"navbar-text navbar-center\">{{calendar.cal[curMonth].month}}</p>\n" +
    "        <button type=\"button\" class=\"btn btn-default navbar-btn navbar-right\" ng-click=\"nextMonth()\">\n" +
    "            <span class=\"fa fa-angle-right\"></span>\n" +
    "        </button>\n" +
    "    </nav>\n" +
    "    <div class=\"col-month-cotnainer\">\n" +
    "        <div class=\"cal-month\" ng-repeat=\"month in cal.calendar\">\n" +
    "            <div class=\"cal-week\" ng-repeat=\"week in month.calendar.weeks\">\n" +
    "                <!--<div class=\"cal-day\" ng-repeat=\"day in week\" hours-calendar-day day=day\"></div>-->\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!--\n" +
    "    <table class=\"table table-bordered table-condensed\">\n" +
    "        <thead>\n" +
    "        <tr>\n" +
    "            <td>Sun</td>\n" +
    "            <td>Mon</td>\n" +
    "            <td>Tue</td>\n" +
    "            <td>Wed</td>\n" +
    "            <td>Thur</td>\n" +
    "            <td>Fri</td>\n" +
    "            <td>Sat</td>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "            <tr ng-repeat=\"week in calendar[libID - 1].cal[curMonth].weeks\">\n" +
    "                <td ng-repeat=\"day in week\" ng-class=\"day.class\">\n" +
    "                    <div style=\"width:100%;height:100%;\" popover=\"{{day.exc}}\" popover-trigger=\"mouseenter\" popover-placement=\"top\">\n" +
    "                        <div class=\"date\">\n" +
    "                            {{day.ts * 1000 | date:'d'}}\n" +
    "                        </div>\n" +
    "                        <div class=\"hours\">\n" +
    "                            {{day.hoursFrom}}\n" +
    "                            <span ng-show=\"day.hoursFrom != day.hoursTo\">\n" +
    "                                <br>{{day.hoursTo}}\n" +
    "                            </span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "    </table>-->\n" +
    "</div>");
}]);

angular.module("lib-hours-today/lib-hours-today.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("lib-hours-today/lib-hours-today.tpl.html",
    "<div class=\"library-hours-today\">\n" +
    "    <h2>\n" +
    "        <span class=\"fa fa-clock-o\"></span> Hours\n" +
    "        <span class=\"label\" ng-class=\"today.status.css\">{{today.status.text}}</span>\n" +
    "    </h2>\n" +
    "    <div class=\"h3\">{{today.hours}}</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("list/list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("list/list.tpl.html",
    "<h2>Hours <small>today</small></h2>\n" +
    "<div class=\"responsive-table\">\n" +
    "  <table class=\"table table-hover\">\n" +
    "    <tbody ng-repeat=\"lib in hoursList track by $index\">\n" +
    "    <tr ng-click=\"selectLib(lib)\">\n" +
    "      <td><a href=\"#\">{{lib.name}}</a></td>\n" +
    "      <td>{{lib.hours}}</td>\n" +
    "      <td><span ng-class=\"lib.status.css\">{{lib.status.text}}</span></td>\n" +
    "      <td>\n" +
    "        <span class=\"fa fa-lg fa-info-circle\" ng-if=\"lib.description\" tooltip=\"{{lib.description}}\"></span>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "    <tr class=\"hours-list-child\" ng-repeat=\"child in lib.children track by $index\" ng-click=\"selectLib(child)\">\n" +
    "      <td><a href=\"#\">{{child.name}}</a></td>\n" +
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
;angular.module('ualib.hours', [
    'ngAnimate',
    'ngResource',
    'ui.bootstrap',
    'angular.filter',
    'hours.common',
    'hours.templates',
    'hours.list'
])

.constant('HOURS_API_URL', '//wwwdev2.lib.ua.edu/libhours2/api/')

.controller('hoursCtrl', ['$scope', function hoursCtrl($scope){
    $scope.libID = 1;
}]);

// Temporary alias for hours module to not break dependencies not yet updated
angular.module('hours', ['ualib.hours']);



angular.module('hours.calendar', [])
    .constant('NUM_MONTHS', 6)

    .service('CalendarService', ['hoursFactory', '$rootScope', '$location', '$q', '$filter', function(hoursFactory, $rootScope, $location, $q, $filter){
        var self = this;
        var calData;
        this.calendar = {};
        this.params = {
            lid: 0,
            month: 0,
            library: ''
        };

        // initialize sync of URI query params an the API resource to get all calendar data
        this.init = function(){
            var deferred = $q.defer();

            hoursFactory.get({view: 'calendar'})
                .$promise
                .then(function(data){
                    paramsToService();
                    calData = data;
                    deferred.resolve();
                }, function(data, status, headers, config) {
                    console.log('Initial Error: ' + data);
                    deferred.reject('Hours Calendar Error' + data);
                });

            return deferred.promise;
        };



        function getCalendar(){
            var calendar = $filter('filter');


        }



    }])
    .controller('CalendarCtrl', ['$scope', '$element', '$animate', '$location', '$filter', 'hoursFactory', function CalendarCtrl($scope, $element, $animate, $location, $filter, hoursFactory){
        var calData;
        $scope.cal;
        $scope.params = {
            lid: 0,
            month: 0,
            library: 'gorgas'
        };

        hoursFactory.get({view: 'calendar'})
            .$promise
            .then(function(data){
                paramsToService();
                calData = data.cal;
                processCalendar(calData);
            }, function(data, status, headers, config) {
                console.log('Initial Error: ' + data);
            });

        $scope.$on('$locationChangeSuccess', function(){
            paramsToService();
        });

        function processCalendar(cal){
            cal = $filter('filterBy')(cal, ['library.name'], $scope.params.library);

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

        /*var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');
        var elm = $element.find();
        $animate.enter(spinner, elm, angular.element(elm[0].lastChild));*/

        /*hoursFactory.query({view: 'calendar'},
            function(data){
                calData = data;
                $animate.leave(spinner);
            },
            function(msg){
                console.log(msg);
            });

        this.getCal = function(lid){
            lid = angular.isDefined(lid) ? (lid-1) : 0;
            var deferred = $q.defer();
            var cal = calData[lid];
            $animate.enter(spinner, elm, angular.element(elm[0].lastChild));

            $q.when(cal)
                .then(function(){
                    $scope.calendar.library = cal.library.name;
                    $scope.calendar.month = cal.cal[$scope.currMonth].month;
                    $scope.calendar.cal = cal.cal;
                })
        };*/



        /*hoursFactory.query({view: 'calendar'}, function(data) {
            console.log("Initial data loaded");
            $scope.calendar = data;
            $scope.processClasses(nMonths);
            $animate.leave(spinner);
            console.dir($scope.calendar);
        }, function(data, status, headers, config) {
            console.log('Initial Error: ' + data);
        });

        $scope.nextMonth = function(){
            if ($scope.curMonth < nMonths - 1)
                $scope.curMonth++;
        };
        $scope.prevMonth = function(){
            if ($scope.curMonth > 0)
                $scope.curMonth--;
        };
        //determine class for each day
        $scope.processClasses = function(numMonths){
            $scope.calendar.forEach(function(calendar){
                for (var m = 0; m < numMonths; m++)
                    for (var w = 0; w < 6; w++)
                        for (var d = 0; d < 7; d++){
                            var className = "";
                            var date = "";
                            var hours = "";
                            var exc = "";
                            var dayClass = "";
                            var day = calendar.cal[m].weeks[w][d];
                            if (typeof day.date != "undefined")
                                date = day.date;
                            if (typeof day.hours != "undefined")
                                hours = day.hours;
                            if ((typeof day.exc != "undefined") && (day.exc != null))
                                exc = day.exc;
                            if ((typeof day.today != "undefined") && (day.today))
                                dayClass = " today";

                            if ((date.length == 0) && (hours.length == 0))
                                className = "prev-month";
                            else
                            if ((date.length > 0) && (exc.length > 0) && (hours != 'Closed'))
                                className = "exception" + dayClass;
                            else
                            if ((date.length > 0) && (exc.length > 0) && (hours == 'Closed'))
                                className = "exception closed" + dayClass;
                            else
                            if ((date.length > 0) && (exc.length == 0) && (hours == 'Closed'))
                                className = "closed" + dayClass;
                            else
                            if ((date.length > 0) && (exc.length == 0) && (hours != 'Closed'))
                                className = dayClass;
                            else
                            if ((date.length == 0) && (hours.length > 0) && (exc.length > 0) && (hours != 'Closed'))
                                className = "next-month exception";
                            else
                            if ((date.length == 0) && (hours.length > 0) && (exc.length > 0) && (hours == 'Closed'))
                                className = "next-month exception closed";
                            else
                            if ((date.length == 0) && (hours.length > 0) && (exc.length == 0) && (hours == 'Closed'))
                                className = "next-month closed";
                            else
                            if ((date.length == 0) && (hours.length > 0) && (exc.length == 0) && (hours != 'Closed'))
                                className = "next-month";

                            calendar.cal[m].weeks[w][d].class = className;
                        }
            });
        };*/
    }])


    .directive('hoursCalendar', [function(){
        return {
            restrict: 'AC',
            templateUrl: 'calendar/calendar.tpl.html',
            controller: 'CalendarCtrl'
        }
    }])

    .directive('hoursCalendarDay', [function(){
        return {
            restrict: 'EC',
            replace: true,
            scope: {
                day: '@'
            },
            link: function(scope, elm){
                var styles = [];
                if (angular.isUndefined(scope.day.date)){
                    styles.push('not-current-month');
                }
                else if (scope.day.today){
                    styles.push('today');
                }
                if (angular.isDefined(scope.day.exec)){
                    styles.push('exception');
                }
                if (angular.isDefined(scope.day.hours) == 'Closed'){
                    styles.push('closed');
                }

                if (styles.length > 0){
                    var toAdd = styles.join(' ');
                    elm.addClass(toAdd);
                }
            }
        }
    }]);
angular.module('hours.common', [
    'common.hours'
])
angular.module('common.hours', [])

    .factory('hoursFactory', ['$resource', function($resource){
        return $resource("//wwwdev2.lib.ua.edu/libhours2/api/:view", {cache: true});
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
            controller: function($scope, $element){
                var library = angular.isDefined($scope.library) ? $scope.library : 'gorgas';
                hoursFactory.get({view: 'today'},
                    function(data){
                        var libraries = [];
                        for (var lib in data.libraries){
                            libraries.push(data.libraries[lib]);
                            if (data.libraries[lib].hasOwnProperty('children')){
                                libraries = libraries.concat(data.libraries[lib]['children']);
                            }
                        }
                        var lib = $filter('filter')(libraries, {name: $scope.library});
                        $scope.today = setStatus(lib[0]);
                        $element.addClass('loaded');

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

            }
        }
    }])
angular.module('hours.list', [])

    .controller('ListCtrl', ['$scope', '$element', '$animate', 'hoursFactory', function ListCtrl($scope, $element, $animate, hoursFactory){
        var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');
        var elm = $element.find('h2');
        $scope.hoursList = {};

        $animate.enter(spinner, elm, angular.element(elm[0].lastChild));

        hoursFactory.get({view: 'today'},
            function(data){
                var list = setStatus(data.libraries);
                $scope.hoursList = list;
                $animate.leave(spinner);
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
    }]);;angular.module('manage.templates', ['manageDatabases/manageDatabases.tpl.html', 'manageHours/manageEx.tpl.html', 'manageHours/manageHours.tpl.html', 'manageHours/manageLoc.tpl.html', 'manageHours/manageSem.tpl.html', 'manageHours/manageUsers.tpl.html', 'manageNews/manageExhibitionsList.tpl.html', 'manageNews/manageNews.tpl.html', 'manageNews/manageNewsList.tpl.html', 'manageNews/viewNewsEventsExhibitions.tpl.html', 'manageOneSearch/manageOneSearch.tpl.html', 'manageSoftware/manageSoftware.tpl.html', 'manageSoftware/manageSoftwareList.tpl.html', 'manageSoftware/manageSoftwareLocCat.tpl.html', 'manageUserGroups/manageUG.tpl.html', 'manageUserGroups/viewMyWebApps.tpl.html', 'siteFeedback/siteFeedback.tpl.html', 'staffDirectory/staffDirectory.tpl.html', 'submittedForms/submittedForms.tpl.html']);

angular.module("manageDatabases/manageDatabases.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageDatabases/manageDatabases.tpl.html",
    "<h2>Manage Databases</h2>\n" +
    "\n" +
    "<div>\n" +
    "    <div class=\"row form-inline\">\n" +
    "        <div class=\"form-group col-md-12\">\n" +
    "            <label for=\"filterBy\">Filter <small>{{filteredDB.length}}</small> results by</label>\n" +
    "            <div id=\"filterBy\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title starts with\" ng-model=\"titleStartFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"titleFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Description contains\" ng-model=\"descrFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Subjects contain\" ng-model=\"subjectFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Media Types contain\" ng-model=\"typeFilter\">\n" +
    "                <select class=\"form-control\" ng-model=\"disFilter\" ng-options=\"val.name for val in disValues\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "            <label for=\"sortBy\">Sort by</label>\n" +
    "            <div id=\"sortBy\">\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"0\" ng-click=\"sortBy(0)\">\n" +
    "                    Title\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[0].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[0].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"1\" ng-click=\"sortBy(1)\">\n" +
    "                    Creation Date\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[1].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[1].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"2\" ng-click=\"sortBy(2)\">\n" +
    "                    Last Modified\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[2].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[2].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"3\" ng-click=\"sortBy(3)\">\n" +
    "                    Temporary Disabled\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[3].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[3].reverse\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredDB.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\"></pagination>\n" +
    "    </div>\n" +
    "    <div class=\"row\"\n" +
    "         ng-repeat=\"db in filteredDB = (DBList.databases | filter:{title:titleStartFilter}:startTitle\n" +
    "                                                         | filter:{title:titleFilter}\n" +
    "                                                         | filter:{description:descrFilter}\n" +
    "                                                         | filter:{subjects:subjectFilter}\n" +
    "                                                         | filter:{types:typeFilter}\n" +
    "                                                         | filter:{disabled:disFilter.value}\n" +
    "                                                         | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\n" +
    "        | startFrom:(currentPage-1)*perPage | limitTo:perPage\"\n" +
    "         ng-class=\"{sdOpen: db.show, sdOver: db.id == mOver}\" ng-mouseover=\"setOver(db)\">\n" +
    "        <div class=\"col-md-12\" ng-click=\"toggleDB(db)\">\n" +
    "            <div class=\"col-md-10\">\n" +
    "                <h4>\n" +
    "                    <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"db.show\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-caret-down\" ng-show=\"db.show\"></span>\n" +
    "                    <a href=\"{{db.url}}\">{{db.title}}</a>\n" +
    "                    <small>{{db.publisher}} <span ng-show=\"db.vendor.length > 0\">: {{db.vendor}}</span></small>\n" +
    "                </h4>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-1 text-right\">\n" +
    "                <h4 ng-show=\"db.tmpDisabled == 1\"><small>TMP</small></h4>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-1\">\n" +
    "                <h4 ng-show=\"db.disabled == 1 || db.tmpDisabled == 1\"><small>DISABLED</small></h4>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\" ng-show=\"db.show\">\n" +
    "            <form ng-submit=\"updateDB(db)\">\n" +
    "                <div class=\"col-md-6 form-group\">\n" +
    "                    <label for=\"{{db.id}}_title\">Title</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.title}}\" ng-model=\"db.title\"\n" +
    "                           id=\"{{db.id}}_title\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Publisher\">Publisher</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.publisher}}\" ng-model=\"db.publisher\"\n" +
    "                           id=\"{{db.id}}_Publisher\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Vendor\">Vendor</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.vendor}}\" ng-model=\"db.vendor\"\n" +
    "                           id=\"{{db.id}}_Vendor\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Format\">Format</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.format}}\" ng-model=\"db.format\"\n" +
    "                           id=\"{{db.id}}_Format\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6 form-group\">\n" +
    "                    <label for=\"{{db.id}}_URL\">URL</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.url}}\" ng-model=\"db.url\"\n" +
    "                           id=\"{{db.id}}_URL\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Location\">Location</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.location}}\" ng-model=\"db.location\"\n" +
    "                           id=\"{{db.id}}_Location\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_NotInEDS\">Not in EDS</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.notInEDS}}\" ng-model=\"db.notInEDS\"\n" +
    "                           id=\"{{db.id}}_NotInEDS\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-1 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Full-text\">Fulltext</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.hasFullText}}\" ng-model=\"db.hasFullText\"\n" +
    "                           id=\"{{db.id}}_Full-text\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-1 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Authenticate\">Authenticate</label>\n" +
    "                    <input type=\"checkbox\" class=\"form-control\" ng-model=\"db.auth\" ng-true-value=\"1\" ng-false-value=\"0\"\n" +
    "                           id=\"{{db.id}}_Authenticate\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Coverage\">Coverage</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.coverage}}\" ng-model=\"db.coverage\"\n" +
    "                           id=\"{{db.id}}_Coverage\" >\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Notes\">Notes</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.notes}}\" ng-model=\"db.notes\"\n" +
    "                           id=\"{{db.id}}_Notes\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Status\">Status</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.status}}\" ng-model=\"db.status\"\n" +
    "                           id=\"{{db.id}}_Status\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12 form-group\">\n" +
    "                    <label for=\"{{db.id}}_descr\">Database Description</label>\n" +
    "                    <textarea class=\"form-control\" rows=\"3\" id=\"{{db.id}}_descr\" ng-model=\"db.description\" ></textarea>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-1 form-group\">\n" +
    "                    <label for=\"{{db.id}}_presented\">PresentedBy</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.presentedBy}}\" ng-model=\"db.presentedBy\"\n" +
    "                           id=\"{{db.id}}_presented\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-1 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Audience1\">Audience1</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.audience1}}\" ng-model=\"db.audience1\"\n" +
    "                           id=\"{{db.id}}_Audience1\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Audience2\">Audience2</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.audience2}}\" ng-model=\"db.audience2\"\n" +
    "                           id=\"{{db.id}}_Audience2\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_updatedBy\">Updated by</label>\n" +
    "                    <p id=\"{{db.id}}_updatedBy\">{{db.updatedBy}}</p>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_dAuthor\">Description Author</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{db.descrAuthor}}\" ng-model=\"db.descrAuthor\"\n" +
    "                           id=\"{{db.id}}_dAuthor\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{db.id}}_date1\">Created/Modified</label>\n" +
    "                    <p id=\"{{db.id}}_date1\">{{db.dateCreated}}<br>{{db.lastModified}}</p>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-1 form-group\">\n" +
    "                    <label for=\"{{db.id}}_Disable\">Disabled</label>\n" +
    "                    <input type=\"checkbox\" class=\"form-control\" ng-model=\"db.disabled\" ng-true-value=\"1\" ng-false-value=\"0\"\n" +
    "                           id=\"{{db.id}}_Disable\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-1 form-group\">\n" +
    "                    <label for=\"{{db.id}}_tmpDisable\">TmpDisable</label>\n" +
    "                    <input type=\"checkbox\" class=\"form-control\" ng-model=\"db.tmpDisabled\" ng-true-value=\"1\" ng-false-value=\"0\"\n" +
    "                           id=\"{{db.id}}_tmpDisable\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{db.id}}_subjects\">Subjects</label>\n" +
    "                        <ul class=\"list-group\" id=\"{{db.id}}_subjects\">\n" +
    "                            <li class=\"list-group-item\" ng-repeat=\"subject in db.subjects\">\n" +
    "                                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteSubject(db,subject)\">Delete</button>\n" +
    "                                {{subject.subject}} : {{subject.type}}\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item col-md-12\">\n" +
    "                                <div class=\"col-md-7\">\n" +
    "                                    <select class=\"form-control\" ng-model=\"db.selSubj\" ng-options=\"sub.subject for sub in DBList.subjects\">\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-2\">\n" +
    "                                    <select class=\"form-control\" ng-model=\"db.subjType\" ng-options=\"val for val in subjectValues\">\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-3\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"addSubject(db)\">Add Subject</button>\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{db.id}}_types\">Types</label>\n" +
    "                        <ul class=\"list-group\" id=\"{{db.id}}_types\">\n" +
    "                            <li class=\"list-group-item\" ng-repeat=\"type in db.types\">\n" +
    "                                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteType(db,type)\">Delete</button>\n" +
    "                                {{type.type}}\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item form-inline\">\n" +
    "                                <select class=\"form-control\" ng-model=\"db.selType\" ng-options=\"typ.type for typ in DBList.types\">\n" +
    "                                </select>\n" +
    "                                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addType(db)\">Add Type</button>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12 text-center\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-success\">Update information</button>\n" +
    "                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteDB(db)\">\n" +
    "                        Delete {{db[0]}} database\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <pagination total-items=\"filteredDB.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\"></pagination>\n" +
    "</div>\n" +
    "\n" +
    "<h3>Create new Database</h3>\n" +
    "<form ng-submit=\"createDB()\">\n" +
    "    <div class=\"row sdOpen\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"title\">Title</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Database Title\" ng-model=\"newDB.title\"\n" +
    "                       id=\"title\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"Publisher\">Publisher</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Publisher\" ng-model=\"newDB.publisher\"\n" +
    "                       id=\"Publisher\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"Vendor\">Vendor</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Vendor\" ng-model=\"newDB.vendor\"\n" +
    "                       id=\"Vendor\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"Format\">Format</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Format\" ng-model=\"newDB.format\"\n" +
    "                       id=\"Format\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"URL\">URL</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"http://www.example.com/\" ng-model=\"newDB.url\"\n" +
    "                       id=\"URL\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"Location\">Location</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Location\" ng-model=\"newDB.location\"\n" +
    "                       id=\"Location\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"NotInEDS\">Not in EDS</label>\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"newDB.notInEDS\"\n" +
    "                       id=\"NotInEDS\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-1 form-group\">\n" +
    "                <label for=\"Full-text\">Fulltext</label>\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"newDB.hasFullText\"\n" +
    "                       id=\"Full-text\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-1 form-group\">\n" +
    "                <label for=\"Authenticate\">Authenticate</label>\n" +
    "                <input type=\"checkbox\" class=\"form-control\" ng-model=\"newDB.auth\" ng-true-value=\"'1'\" ng-false-value=\"'0'\"\n" +
    "                       id=\"Authenticate\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"Coverage\">Coverage</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Database Coverage\" ng-model=\"newDB.coverage\"\n" +
    "                       id=\"Coverage\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"dAuthor\">Description Author</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Enter Author Name\" ng-model=\"newDB.descrAuthor\"\n" +
    "                       id=\"dAuthor\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"Status\">Status</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Status\" ng-model=\"newDB.status\"\n" +
    "                       id=\"Status\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12 form-group\">\n" +
    "                <label for=\"descr\">Database Description</label>\n" +
    "                <textarea class=\"form-control\" rows=\"3\" id=\"descr\" ng-model=\"newDB.description\" required></textarea>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"presented\">Presented by</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Presented By\" ng-model=\"newDB.presentedBy\"\n" +
    "                       id=\"presented\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"Audience1\">Audience One</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Audience One\" ng-model=\"newDB.audience1\"\n" +
    "                       id=\"Audience1\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"Audience2\">Audience Two</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Audience Two\" ng-model=\"newDB.audience2\"\n" +
    "                       id=\"Audience2\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4 form-group\">\n" +
    "                <label for=\"Notes\">Notes</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Notes\" ng-model=\"newDB.notes\"\n" +
    "                       id=\"Notes\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-1 form-group\">\n" +
    "                <label for=\"Disable\">Disabled</label>\n" +
    "                <input type=\"checkbox\" class=\"form-control\" ng-model=\"newDB.disabled\" ng-true-value=\"'1'\" ng-false-value=\"'0'\"\n" +
    "                       id=\"Disable\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-1 form-group\">\n" +
    "                <label for=\"tmpDisable\">TmpDisable</label>\n" +
    "                <input type=\"checkbox\" class=\"form-control\" ng-model=\"newDB.tmpDisabled\" ng-true-value=\"'1'\" ng-false-value=\"'0'\"\n" +
    "                       id=\"tmpDisable\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <div class=\"col-md-6 form-group\">\n" +
    "                    <label for=\"subjects\">Subjects</label>\n" +
    "                    <ul class=\"list-group\" id=\"subjects\">\n" +
    "                        <li class=\"list-group-item\" ng-repeat=\"subject in newDB.subjects\">\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"delSubjNewDB($index)\">Delete</button>\n" +
    "                            {{subject.subject}} : {{subject.type}}\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item col-md-12\">\n" +
    "                            <div class=\"col-md-7\">\n" +
    "                                <select class=\"form-control\" ng-model=\"newDB.selSubj\" ng-options=\"sub.subject for sub in DBList.subjects\">\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-2\">\n" +
    "                                <select class=\"form-control\" ng-model=\"newDB.subjType\" ng-options=\"val for val in subjectValues\">\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addSubjNewDB()\">Add Subject</button>\n" +
    "                            </div>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6 form-group\">\n" +
    "                    <label for=\"types\">Types</label>\n" +
    "                    <ul class=\"list-group\" id=\"types\">\n" +
    "                        <li class=\"list-group-item\" ng-repeat=\"type in newDB.types\">\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"delTypeNewDB($index)\">Delete</button>\n" +
    "                            {{type.type}}\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item form-inline\">\n" +
    "                            <select class=\"form-control\" ng-model=\"newDB.selType\" ng-options=\"typ.type for typ in DBList.types\">\n" +
    "                            </select>\n" +
    "                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"addTypeNewDB()\">Add Type</button>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12 text-center\">\n" +
    "                <button type=\"submit\" class=\"btn btn-success\">Create Database Record</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "");
}]);

angular.module("manageHours/manageEx.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageHours/manageEx.tpl.html",
    "<div class=\"text-right\">\n" +
    "    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteOldExc()\" ng-disabled=\"loading\">Delete All Outdated Exceptions</button>\n" +
    "    <br>{{resultDel}}\n" +
    "</div>\n" +
    "<table class=\"table table-hover table-condensed\" ng-repeat=\"excData in allowedLibraries.exc\" ng-if=\"$index == selLib.index\">\n" +
    "    <thead>\n" +
    "    <tr>\n" +
    "        <th>Exception Description</th>\n" +
    "        <th class=\"text-center\">Date</th>\n" +
    "        <th class=\"text-center\">Days</th>\n" +
    "        <th class=\"text-center\">Hours</th>\n" +
    "        <th class=\"text-center\">Action</th>\n" +
    "    </tr>\n" +
    "    </thead>\n" +
    "    <tr ng-repeat=\"exception in excData track by exception.id\" ng-click=\"expandExc($event, exception)\">\n" +
    "        <td style=\"width:30%\">\n" +
    "            <div ng-hide=\"isExpExc(exception.id)\">{{exception.desc}}</div>\n" +
    "            <div ng-if=\"isExpExc(exception.id)\"><input type=\"text\" class=\"form-control\" ng-model=\"exception.desc\" ng-required /></div>\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            <div ng-hide=\"isExpExc(exception.id)\">{{exception.datems | date : 'MMM d, y'}}</div>\n" +
    "            <div ng-if=\"isExpExc(exception.id)\">\n" +
    "\n" +
    "                <input type=\"text\" class=\"form-control\" datepicker-popup=\"{{format}}\"\n" +
    "                       ng-model=\"exception.datems\" is-open=\"exception.dp\"\n" +
    "                       ng-required=\"true\" close-text=\"Close\"\n" +
    "                       ng-focus=\"onExcFocus($event, $index)\" />\n" +
    "            </div>\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            <div ng-hide=\"isExpExc(exception.id)\">{{exception.days}}</div>\n" +
    "            <div ng-if=\"isExpExc(exception.id)\"><input type=\"text\" class=\"form-control\" ng-model=\"exception.days\" ng-required /></div>\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <select class=\"form-control\" ng-model=\"exception.from\">\n" +
    "                        <option ng-repeat=\"hours in hrsFrom\" ng-selected=\"{{exception.from == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <select class=\"form-control\" ng-model=\"exception.to\">\n" +
    "                        <option ng-repeat=\"hours in hrsTo\" ng-selected=\"{{exception.to == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </td>\n" +
    "        <td class=\"text-right\">\n" +
    "            <button type=\"button\" class=\"btn btn-success\" ng-click=\"updateExc(exception)\" ng-show=\"isExpExc(exception.id)\" ng-disabled=\"loading\">Save</button>\n" +
    "            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteExc(exception, $index)\" ng-show=\"isExpExc(exception.id)\" ng-disabled=\"loading\">Delete</button>\n" +
    "            <div ng-show=\"isExpExc(exception.id)\"><br>{{result}}</div>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "        <td>\n" +
    "            <input type=\"text\" class=\"form-control\" ng-model=\"newException.desc\" placeholder=\"Exception Description\" ng-required />\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "\n" +
    "            <input type=\"text\" class=\"form-control\" datepicker-popup=\"{{format}}\" show-button-bar=\"false\"\n" +
    "                   ng-model=\"newException.datems\" is-open=\"newException.dp\" close-text=\"Close\"\n" +
    "                   ng-required=\"true\" placeholder=\"MM/DD/YYYY\" ng-focus=\"onExcFocus($event)\" />\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            <input type=\"text\" class=\"form-control\" ng-model=\"newException.days\" placeholder=\"Days\" ng-required />\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <select class=\"form-control\" ng-model=\"newException.from\">\n" +
    "                        <option ng-repeat=\"hours in hrsFrom\" ng-selected=\"{{newException.from == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <select class=\"form-control\" ng-model=\"newException.to\">\n" +
    "                        <option ng-repeat=\"hours in hrsTo\" ng-selected=\"{{newException.to == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </td>\n" +
    "        <td class=\"text-right\">\n" +
    "            <label for=\"isGlobal\">Create For All Libraries</label>\n" +
    "            <input type=\"checkbox\" ng-model=\"newException.isGlobal\" id=\"isGlobal\">\n" +
    "            <br>\n" +
    "            <button type=\"button\" class=\"btn btn-success\" ng-click=\"createExc()\" ng-disabled=\"loading\">Create Exception</button>\n" +
    "            <br>{{result}}\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "");
}]);

angular.module("manageHours/manageHours.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageHours/manageHours.tpl.html",
    "<h2>Hours Management\n" +
    "\n" +
    "    <select class=\"form-control\" ng-model=\"selLib\" ng-options=\"lib.name for lib in allowedLibraries.libraries\">\n" +
    "    </select>\n" +
    "\n" +
    "</h2>\n" +
    "<h2 class=\"text-center\">{{selLib.name}}</h2>\n" +
    "\n" +
    "<p><strong>*</strong> Set From and To hours to Midnight in order to indicate Open 24 hours.</p>\n" +
    "\n" +
    "<tabset justified=\"true\">\n" +
    "    <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "        <div ng-if=\"tab.number == 0\">\n" +
    "            <div semester-list>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"tab.number == 1\" >\n" +
    "            <div exception-list>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </tab>\n" +
    "</tabset>\n" +
    "");
}]);

angular.module("manageHours/manageLoc.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageHours/manageLoc.tpl.html",
    "<table class=\"table table-hover table-condensed\">\n" +
    "    <thead>\n" +
    "    <tr>\n" +
    "        <th>Library Name</th>\n" +
    "        <th class=\"text-center\">ID</th>\n" +
    "        <th class=\"text-center\">Parent ID</th>\n" +
    "        <th class=\"text-center\">Action</th>\n" +
    "    </tr>\n" +
    "    </thead>\n" +
    "    <tr ng-repeat=\"lib in dataUL.locations\" ng-click=\"expandLoc(lib)\">\n" +
    "        <td>\n" +
    "            {{lib.name}}\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            {{lib.lid}}\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            {{lib.parent}}\n" +
    "        </td>\n" +
    "        <td class=\"text-right\">\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "        <td>\n" +
    "            <input type=\"text\" class=\"form-control\" size=\"30\" ng-model=\"newLocation\" placeholder=\"Library Name\" ng-required />\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            <select class=\"form-control\" ng-model=\"newParent\" ng-options=\"lib.name for lib in dataUL.locations\">\n" +
    "                <option value=\"\" selected>Select parent library</option>\n" +
    "            </select>\n" +
    "        </td>\n" +
    "        <td class=\"text-right\">\n" +
    "            <button type=\"button\" class=\"btn btn-success\" ng-click=\"createLoc(newLocation, newParent)\" ng-disabled=\"isLoading\">Create Location</button>\n" +
    "            <br>{{result2}}\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "");
}]);

angular.module("manageHours/manageSem.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageHours/manageSem.tpl.html",
    "<table class=\"table table-hover table-condensed\" ng-repeat=\"semData in allowedLibraries.sem\" ng-if=\"$index == selLib.index\">\n" +
    "    <thead>\n" +
    "    <tr>\n" +
    "        <th>Semester</th>\n" +
    "        <th class=\"text-center\">Sun</th>\n" +
    "        <th class=\"text-center\">Mon</th>\n" +
    "        <th class=\"text-center\">Tue</th>\n" +
    "        <th class=\"text-center\">Wed</th>\n" +
    "        <th class=\"text-center\">Thu</th>\n" +
    "        <th class=\"text-center\">Fri</th>\n" +
    "        <th class=\"text-center\">Sat</th>\n" +
    "    </tr>\n" +
    "    </thead>\n" +
    "    <tr ng-repeat=\"sem in semData\" ng-click=\"expandSem($event, sem)\">\n" +
    "        <th scope=\"row\" ng-hide=\"isExpSem(sem.dsid)\">{{sem.name}}<br>\n" +
    "            {{sem.startdate | date : 'MMM d, y'}}<br>{{sem.enddate | date : 'MMM d, y'}}\n" +
    "        </th>\n" +
    "        <th scope=\"row\" ng-if=\"isExpSem(sem.dsid)\">{{sem.name}}<br>\n" +
    "            <div class=\"input-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" datepicker-popup=\"{{format}}\" size=\"3\"\n" +
    "                       ng-model=\"sem.startdate\" is-open=\"sem.dp\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                       ng-focus=\"onSemFocus($event, $index)\" />\n" +
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"saveChanges(sem)\" ng-disabled=\"loading\">Save</button>\n" +
    "                {{result}}\n" +
    "                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteSem(sem, $index)\" ng-disabled=\"loading\">Delete {{sem.name}}</button>\n" +
    "            </div>\n" +
    "        </th>\n" +
    "        <td class=\"text-center\" style=\"width:11%\" ng-repeat=\"day in sem.dow\">\n" +
    "            <div ng-hide=\"isExpSem(sem.dsid)\">\n" +
    "                {{day.hours}}\n" +
    "            </div>\n" +
    "            <div ng-if=\"isExpSem(sem.dsid)\">\n" +
    "                <select class=\"form-control\" ng-model=\"day.from\">\n" +
    "                    <option ng-repeat=\"hours in hrsFrom\" ng-selected=\"{{day.from == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                </select>\n" +
    "                <select class=\"form-control\" ng-model=\"day.to\">\n" +
    "                    <option ng-repeat=\"hours in hrsTo\" ng-selected=\"{{day.to == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "<table class=\"table table-hover table-condensed\">\n" +
    "    <thead>\n" +
    "    <tr>\n" +
    "        <th>Semester</th>\n" +
    "        <th class=\"text-center\">Sun</th>\n" +
    "        <th class=\"text-center\">Mon</th>\n" +
    "        <th class=\"text-center\">Tue</th>\n" +
    "        <th class=\"text-center\">Wed</th>\n" +
    "        <th class=\"text-center\">Thu</th>\n" +
    "        <th class=\"text-center\">Fri</th>\n" +
    "        <th class=\"text-center\">Sat</th>\n" +
    "    </tr>\n" +
    "    </thead>\n" +
    "    <tr>\n" +
    "        <th scope=\"row\">\n" +
    "            <div class=\"input-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-minlength=\"4\" ng-maxlength=\"32\" ng-model=\"newSemester.name\" placeholder=\"Semester Name\" ng-required /><br>\n" +
    "                <input type=\"text\" class=\"form-control\" datepicker-popup=\"{{format}}\" placeholder=\"Start Date (MM/DD/YYYY)\"\n" +
    "                       ng-model=\"newSemester.startdate\" is-open=\"newSemester.dp\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                       ng-focus=\"onSemFocus($event)\" />\n" +
    "            </div>\n" +
    "            <button type=\"button\" class=\"btn btn-success\" ng-click=\"createSem()\" ng-disabled=\"loading\">Create New Semester</button>\n" +
    "            {{result}}\n" +
    "        </th>\n" +
    "        <td class=\"text-center\" style=\"width:11%\" ng-repeat=\"day in newSemester.dow\">\n" +
    "            <select class=\"form-control\" ng-model=\"day.from\">\n" +
    "                <option ng-repeat=\"hours in hrsFrom\" ng-selected=\"{{day.from == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "            </select>\n" +
    "            <select class=\"form-control\" ng-model=\"day.to\">\n" +
    "                <option ng-repeat=\"hours in hrsTo\" ng-selected=\"{{day.to == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "            </select>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "");
}]);

angular.module("manageHours/manageUsers.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageHours/manageUsers.tpl.html",
    "<table class=\"table table-hover table-condensed\">\n" +
    "    <thead>\n" +
    "    <tr>\n" +
    "        <th>User Login</th>\n" +
    "        <th class=\"text-center\">Access to This Page</th>\n" +
    "        <th class=\"text-center\">Library Access</th>\n" +
    "        <th class=\"text-center\">Action</th>\n" +
    "    </tr>\n" +
    "    </thead>\n" +
    "    <tr ng-repeat=\"user in dataUL.users\" ng-click=\"expandUser(user)\">\n" +
    "        <th scope=\"row\">{{user.name}}\n" +
    "        </th>\n" +
    "        <td class=\"text-center\">\n" +
    "            <input type=\"checkbox\" ng-model=\"user.role\">\n" +
    "        </td>\n" +
    "        <td class=\"text-left\">\n" +
    "            <div class=\"row\" ng-repeat=\"lib in dataUL.locations\">\n" +
    "                <div class=\"col-md-2\">\n" +
    "                    <input type=\"checkbox\" ng-model=\"user.access[$index]\" ng-show=\"isExpUser(user.uid)\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-10\">\n" +
    "                    <div ng-show=\"isExpUser(user.uid) || user.access[$index]\">{{lib.name}}</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            <div ng-show=\"isExpUser(user.uid)\">\n" +
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"updateUser(user)\" ng-disabled=\"isLoading\"\n" +
    "                        ng-hide=\"expUserIndex == 0\">Save</button>\n" +
    "                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteUser(user, $index)\" ng-disabled=\"isLoading\"\n" +
    "                        ng-hide=\"expUserIndex == 0\">Delete</button><br>\n" +
    "                {{result}}\n" +
    "            </div>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "        <th scope=\"row\">\n" +
    "            <select class=\"form-control\" ng-model=\"newUser\" ng-options=\"user.name for user in users\">\n" +
    "            </select>\n" +
    "        </th>\n" +
    "        <td class=\"text-center\">\n" +
    "            <input type=\"checkbox\" ng-model=\"newUserAdmin\">\n" +
    "        </td>\n" +
    "        <td class=\"text-left\">\n" +
    "            <div class=\"row\" ng-repeat=\"lib in dataUL.locations\">\n" +
    "                <div class=\"col-md-2\">\n" +
    "                    <input type=\"checkbox\" ng-model=\"newUserAccess[$index]\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-10\">\n" +
    "                    {{lib.name}}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </td>\n" +
    "        <td class=\"text-center\">\n" +
    "            <div>\n" +
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"createUser(newUser)\" ng-disabled=\"isLoading\">Grant Access</button><br>\n" +
    "                {{result2}}\n" +
    "            </div>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "");
}]);

angular.module("manageNews/manageExhibitionsList.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageNews/manageExhibitionsList.tpl.html",
    "<div>\n" +
    "    <div class=\"row form-inline\">\n" +
    "        <div class=\"form-group col-md-12\">\n" +
    "            <label for=\"filterBy\">Filter <small>{{filteredExh.length}}</small> results by</label>\n" +
    "            <div id=\"filterBy\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"titleFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Description contains\" ng-model=\"descrFilter\">\n" +
    "            </div>\n" +
    "            <label for=\"sortBy\">Sort by</label>\n" +
    "            <div id=\"sortBy\">\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"0\" ng-click=\"sortBy(0)\">\n" +
    "                    Title\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[0].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[0].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"1\" ng-click=\"sortBy(1)\">\n" +
    "                    Date Active From\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[1].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[1].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"2\" ng-click=\"sortBy(2)\">\n" +
    "                    Date Active Until\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[2].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[2].reverse\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredExh.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredExh.length > 0\"></pagination>\n" +
    "    </div>\n" +
    "    <div class=\"row\"\n" +
    "         ng-repeat=\"exh in filteredExh = (data.exhibitions | filter:{title:titleFilter}\n" +
    "                                                            | filter:{description:descrFilter}\n" +
    "                                                            | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\n" +
    "        | startFrom:(currentPage-1)*perPage | limitTo:perPage\"\n" +
    "         ng-class=\"{sdOpen: exh.show, sdOver: exh.sid == mOver}\" ng-mouseover=\"setOver(exh)\">\n" +
    "        <div class=\"col-md-12\" ng-click=\"toggleExhibitions(exh)\">\n" +
    "            <table class=\"table\">\n" +
    "                <tr>\n" +
    "                    <td style=\"width: 15px;\">\n" +
    "                        <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"exh.show\"></span>\n" +
    "                        <span class=\"fa fa-fw fa-caret-down\" ng-show=\"exh.show\"></span>\n" +
    "                    </td>\n" +
    "                    <td style=\"width:64px\">\n" +
    "                        <img ng-hide=\"exh.picFile[0] != null\" src=\"{{exh.img}}\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                        <img ng-show=\"exh.picFile[0] != null\" ngf-src=\"exh.picFile[0]\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                    </td>\n" +
    "                    <td>\n" +
    "                        <div class=\"col-md-8\">\n" +
    "                            <h4>\n" +
    "                                {{exh.title}}\n" +
    "                            </h4>\n" +
    "                            <h4 style=\"text-align: justify;\"><small>{{exh.description}}</small></h4>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2\">\n" +
    "                            <h5>{{exh.activeFrom | date : 'MMM d, y'}}</h5>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2\">\n" +
    "                            <h5>{{exh.activeUntil | date : 'MMM d, y'}}</h5>\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "        <div ng-show=\"exh.show\">\n" +
    "            <form name=\"editNewsExh{{exh.sid}}\" ng-submit=\"updateExhibition(exh)\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{exh.sid}}_up\">Upload Icon</label>\n" +
    "                        <input type=\"file\" ngf-select=\"\" ng-model=\"exh.picFile\" accept=\"image/png\"\n" +
    "                               ngf-change=\"generateThumb(exh.picFile[0], $files)\" id=\"{{exh.sid}}_up\">\n" +
    "                        <span class=\"progress\" ng-show=\"exh.picFile[0].progress >= 0\">\n" +
    "                            <div class=\"ng-binding\" style=\"width:{{exh.picFile[0].progress}}%\" ng-bind=\"exh.picFile[0].progress + '%'\"></div>\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{exh.sid}}_title\">Title</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"{{exh.title}}\" ng-model=\"exh.title\"\n" +
    "                               id=\"{{exh.sid}}_title\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-3 form-group\">\n" +
    "                        <label for=\"{{exh.sid}}_blurb\">Short Description</label>\n" +
    "                        <textarea class=\"form-control\" rows=\"3\" id=\"{{exh.sid}}_blurb\" ng-model=\"exh.blurb\" ></textarea>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-9 form-group\">\n" +
    "                        <label for=\"{{exh.sid}}_descr\">Detailed Description</label>\n" +
    "                        <textarea class=\"form-control\" rows=\"3\" id=\"{{exh.sid}}_descr\" ng-model=\"exh.description\" ></textarea>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-4 form-group\">\n" +
    "                        <label for=\"{{exh.sid}}_from\">Active From</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" id=\"{{exh.sid}}_from\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                               ng-model=\"exh.activeFrom\" is-open=\"exh.dpFrom\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                               ng-focus=\"onExhDPFocusFrom($event, $index)\"/>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4 form-group\">\n" +
    "                        <label for=\"{{exh.sid}}_until\">Active Until</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" id=\"{{exh.sid}}_until\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                               ng-model=\"exh.activeUntil\" is-open=\"exh.dpUntil\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                               ng-focus=\"onExhDPFocusUntil($event, $index)\"/>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4 form-group\">\n" +
    "                        <label for=\"{{exh.sid}}_contact\">Contact Person</label>\n" +
    "                        <select class=\"form-control\" id=\"{{exh.sid}}_contact\" ng-options=\"people.fullName for people in data.people\"\n" +
    "                                ng-model=\"exh.contactID\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12 text-center\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-success\">Update information</button>\n" +
    "                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteExhibition(exh)\">\n" +
    "                        Delete Exhibition\n" +
    "                    </button>\n" +
    "                    {{exh.formResponse}}\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <pagination total-items=\"filteredExh.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredExh.length > 0\"></pagination>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <h4 ng-show=\"filteredExh.length == 0\">Nothing found</h4>\n" +
    "</div>\n" +
    "\n" +
    "<h3>Add Exhibition Record</h3>\n" +
    "<form name=\"addNewsExh\" ng-submit=\"createExhibition()\">\n" +
    "    <div class=\"row sdOpen\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"up\">Upload Icon</label>\n" +
    "                <input type=\"file\" ngf-select=\"\" ng-model=\"newExh.picFile\" accept=\"image/png\"\n" +
    "                       ngf-change=\"generateThumb(newExh.picFile[0], $files)\" id=\"up\">\n" +
    "                        <span class=\"progress\" ng-show=\"newExh.picFile[0].progress >= 0\">\n" +
    "                            <div class=\"ng-binding\" style=\"width:{{newExh.picFile[0].progress}}%\" ng-bind=\"newExh.picFile[0].progress + '%'\"></div>\n" +
    "                        </span>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"title\">Title</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Enter Title\" ng-model=\"newExh.title\"\n" +
    "                       id=\"title\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"blurb\">Short Description</label>\n" +
    "                <textarea class=\"form-control\" rows=\"3\" id=\"blurb\" ng-model=\"newExh.blurb\" ></textarea>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-9 form-group\">\n" +
    "                <label for=\"descr\">Detailed Description</label>\n" +
    "                <textarea class=\"form-control\" rows=\"3\" id=\"descr\" ng-model=\"newExh.description\" ></textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-4 form-group\">\n" +
    "                <label for=\"from\">Active From</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"from\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                       ng-model=\"newExh.activeFrom\" is-open=\"newExh.dpFrom\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                       ng-focus=\"onExhDPFocusFrom($event)\"/>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4 form-group\">\n" +
    "                <label for=\"until\">Active Until</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"until\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                       ng-model=\"newExh.activeUntil\" is-open=\"newExh.dpUntil\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                       ng-focus=\"onExhDPFocusUntil($event)\"/>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4 form-group\">\n" +
    "                <label for=\"contact\">Contact Person</label>\n" +
    "                <select class=\"form-control\" id=\"contact\" ng-options=\"people.fullName for people in data.people\"\n" +
    "                        ng-model=\"newExh.contactID\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12 text-center\">\n" +
    "            <button type=\"submit\" class=\"btn btn-success\">Create Exhibition Record</button>\n" +
    "            {{newExh.formResponse}}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "");
}]);

angular.module("manageNews/manageNews.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageNews/manageNews.tpl.html",
    "<h2>Manage News and Exhibitions</h2>\n" +
    "\n" +
    "<tabset justified=\"true\">\n" +
    "    <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "        <div ng-if=\"tab.number == 0\">\n" +
    "            <div manage-news-list>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"tab.number == 1\" >\n" +
    "            <div manage-exhibitions-list>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </tab>\n" +
    "</tabset>\n" +
    "");
}]);

angular.module("manageNews/manageNewsList.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageNews/manageNewsList.tpl.html",
    "<div>\n" +
    "    <div class=\"row form-inline\">\n" +
    "        <div class=\"form-group col-md-12\">\n" +
    "            <label for=\"filterBy\">Filter <small>{{filteredNews.length}}</small> results by</label>\n" +
    "            <div id=\"filterBy\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"titleFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Description contains\" ng-model=\"descrFilter\">\n" +
    "            </div>\n" +
    "            <label for=\"sortBy\">Sort by</label>\n" +
    "            <div id=\"sortBy\">\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"0\" ng-click=\"sortBy(0)\">\n" +
    "                    Title\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[0].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[0].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"1\" ng-click=\"sortBy(1)\">\n" +
    "                    Date Active From\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[1].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[1].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"2\" ng-click=\"sortBy(2)\">\n" +
    "                    Date Active Until\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[2].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[2].reverse\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredNews.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredNews.length > 0\"></pagination>\n" +
    "    </div>\n" +
    "    <div class=\"row\"\n" +
    "         ng-repeat=\"news in filteredNews = (data.news | filter:{title:titleFilter}\n" +
    "                                                      | filter:{description:descrFilter}\n" +
    "                                                      | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\n" +
    "        | startFrom:(currentPage-1)*perPage | limitTo:perPage\"\n" +
    "         ng-class=\"{sdOpen: news.show, sdOver: news.sid == mOver}\" ng-mouseover=\"setOver(news)\">\n" +
    "        <div class=\"col-md-12\" ng-click=\"toggleNews(news)\">\n" +
    "            <table class=\"table\">\n" +
    "                <tr>\n" +
    "                    <td style=\"width: 15px;\">\n" +
    "                        <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"news.show\"></span>\n" +
    "                        <span class=\"fa fa-fw fa-caret-down\" ng-show=\"news.show\"></span>\n" +
    "                    </td>\n" +
    "                    <td style=\"width:64px\">\n" +
    "                        <img ng-hide=\"news.picFile[0] != null\" src=\"{{news.img}}\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                        <img ng-show=\"news.picFile[0] != null\" ngf-src=\"news.picFile[0]\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                    </td>\n" +
    "                    <td>\n" +
    "                        <div class=\"col-md-8\">\n" +
    "                            <h4>\n" +
    "                                {{news.title}}\n" +
    "                            </h4>\n" +
    "                            <h4 style=\"text-align: justify;\"><small>{{news.description}}</small></h4>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2\">\n" +
    "                            <h5>{{news.activeFrom | date : 'MMM d, y'}}</h5>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2\">\n" +
    "                            <h5>{{news.activeUntil | date : 'MMM d, y'}}</h5>\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "        <div ng-show=\"news.show\">\n" +
    "            <form name=\"editNewsExh{{news.sid}}\" ng-submit=\"updateNews(news)\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{news.sid}}_up\">Upload Icon</label>\n" +
    "                        <input type=\"file\" ngf-select=\"\" ng-model=\"news.picFile\" accept=\"image/png\"\n" +
    "                               ngf-change=\"generateThumb(news.picFile[0], $files)\" id=\"{{news.sid}}_up\">\n" +
    "                        <span class=\"progress\" ng-show=\"news.picFile[0].progress >= 0\">\n" +
    "                            <div class=\"ng-binding\" style=\"width:{{news.picFile[0].progress}}%\" ng-bind=\"news.picFile[0].progress + '%'\"></div>\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{news.sid}}_title\">Title</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"{{news.title}}\" ng-model=\"news.title\"\n" +
    "                               id=\"{{news.sid}}_title\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-3 form-group\">\n" +
    "                        <label for=\"{{news.sid}}_blurb\">Short Description</label>\n" +
    "                        <textarea class=\"form-control\" rows=\"3\" id=\"{{news.sid}}_blurb\" ng-model=\"news.blurb\" ></textarea>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-9 form-group\">\n" +
    "                        <label for=\"{{news.sid}}_descr\">Detailed Description</label>\n" +
    "                        <textarea class=\"form-control\" rows=\"3\" id=\"{{news.sid}}_descr\" ng-model=\"news.description\" ></textarea>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-4 form-group\">\n" +
    "                        <label for=\"{{news.sid}}_from\">Active From</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" id=\"{{news.sid}}_from\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                               ng-model=\"news.activeFrom\" is-open=\"news.dpFrom\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                               ng-focus=\"onNewsDPFocusFrom($event, $index)\"/>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4 form-group\">\n" +
    "                        <label for=\"{{news.sid}}_until\">Active Until</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" id=\"{{news.sid}}_until\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                               ng-model=\"news.activeUntil\" is-open=\"news.dpUntil\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                               ng-focus=\"onNewsDPFocusUntil($event, $index)\"/>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4 form-group\">\n" +
    "                        <label for=\"{{news.sid}}_contact\">Contact Person</label>\n" +
    "                        <select class=\"form-control\" id=\"{{news.sid}}_contact\" ng-options=\"people.fullName for people in data.people\"\n" +
    "                                ng-model=\"news.contactID\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12 text-center\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-success\">Update information</button>\n" +
    "                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteNews(news)\">\n" +
    "                        Delete News\n" +
    "                    </button>\n" +
    "                    {{news.formResponse}}\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <pagination total-items=\"filteredNews.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredNews.length > 0\"></pagination>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <h4 ng-show=\"filteredNews.length == 0\">Nothing found</h4>\n" +
    "</div>\n" +
    "\n" +
    "<h3>Add News Record</h3>\n" +
    "<form name=\"addNewsExh\" ng-submit=\"createNews()\">\n" +
    "    <div class=\"row sdOpen\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"up\">Upload Icon</label>\n" +
    "                <input type=\"file\" ngf-select=\"\" ng-model=\"newNews.picFile\" accept=\"image/png\"\n" +
    "                       ngf-change=\"generateThumb(newNews.picFile[0], $files)\" id=\"up\">\n" +
    "                        <span class=\"progress\" ng-show=\"newNews.picFile[0].progress >= 0\">\n" +
    "                            <div class=\"ng-binding\" style=\"width:{{newNews.picFile[0].progress}}%\" ng-bind=\"newNews.picFile[0].progress + '%'\"></div>\n" +
    "                        </span>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"title\">Title</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Enter Title\" ng-model=\"newNews.title\"\n" +
    "                       id=\"title\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"blurb\">Short Description</label>\n" +
    "                <textarea class=\"form-control\" rows=\"3\" id=\"blurb\" ng-model=\"newNews.blurb\" ></textarea>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-9 form-group\">\n" +
    "                <label for=\"descr\">Detailed Description</label>\n" +
    "                <textarea class=\"form-control\" rows=\"3\" id=\"descr\" ng-model=\"newNews.description\" ></textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-4 form-group\">\n" +
    "                <label for=\"from\">Active From</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"from\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                       ng-model=\"newNews.activeFrom\" is-open=\"newNews.dpFrom\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                       ng-focus=\"onNewsDPFocusFrom($event)\"/>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4 form-group\">\n" +
    "                <label for=\"until\">Active Until</label>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"until\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                       ng-model=\"newNews.activeUntil\" is-open=\"newNews.dpUntil\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                       ng-focus=\"onNewsDPFocusUntil($event)\"/>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4 form-group\">\n" +
    "                <label for=\"contact\">Contact Person</label>\n" +
    "                <select class=\"form-control\" id=\"contact\" ng-options=\"people.fullName for people in data.people\"\n" +
    "                        ng-model=\"newNews.contactID\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12 text-center\">\n" +
    "            <button type=\"submit\" class=\"btn btn-success\">Create News Record</button>\n" +
    "            {{newNews.formResponse}}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "");
}]);

angular.module("manageNews/viewNewsEventsExhibitions.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageNews/viewNewsEventsExhibitions.tpl.html",
    "<h2>News and Events</h2>\n" +
    "<div class=\"event-card\" style=\"display: table-row\" ng-show=\"data.news.length > 0\">\n" +
    "    <div style=\"text-align: right; font-size: 20px; color: #999; display: table-cell; vertical-align: top; padding-right: 15px;\">          News        </div>\n" +
    "    <div style=\"display: table-cell; vertical-align: top;\">\n" +
    "        <div class=\"media\" ng-repeat=\"news in data.news\">\n" +
    "            <div class=\"media-left\">\n" +
    "                <a href=\"#\">\n" +
    "                    <img src=\"{{news.img}}\" style=\"height: 64px; width: 64px;\"/>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div class=\"media-body\">\n" +
    "                <h4 class=\"media-heading\">{{news.title}}</h4>\n" +
    "                {{news.blurb}}\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"event-card\" style=\"display: table-row\" ng-show=\"data.events.length > 0\">\n" +
    "    <div style=\"text-align: right; font-size: 20px; color: #999; display: table-cell; vertical-align: top; padding-right: 15px;\">          Events        </div>\n" +
    "    <div style=\"display: table-cell; vertical-align: top;\">\n" +
    "        <div class=\"media\" ng-repeat=\"event in data.events\">\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"event-card\" style=\"display: table-row\" ng-show=\"data.exhibitions.length > 0\">\n" +
    "    <div style=\"text-align: right; font-size: 20px; color: #999; display: table-cell; vertical-align: top; padding-right: 15px;\">          Exhibits        </div>\n" +
    "    <div style=\"display: table-cell; vertical-align: top;\">\n" +
    "        <div class=\"media\" ng-repeat=\"exh in data.exhibitions\">\n" +
    "            <div class=\"media-left\">\n" +
    "                <a href=\"#\">\n" +
    "                    <img src=\"{{exh.img}}\" style=\"height: 64px; width: 64px;\"/>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div class=\"media-body\">\n" +
    "                <h4 class=\"media-heading\">{{exh.title}}</h4>\n" +
    "                {{exh.blurb}}\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("manageOneSearch/manageOneSearch.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageOneSearch/manageOneSearch.tpl.html",
    "<h3>OneSearch Recommended Links Management</h3>\n" +
    "\n" +
    "<form ng-submit=\"addRecommendation()\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"K\">Keyword</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Keyword\" maxlength=\"200\" ng-model=\"addRec.keyword\"\n" +
    "                   id=\"K\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"L\">Link</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"http://www.example.com/\" maxlength=\"1024\"\n" +
    "                   id=\"L\" ng-model=\"addRec.link\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"LT\">Link Title</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Link Title\" maxlength=\"100\" ng-model=\"addRec.title\"\n" +
    "                   id=\"LT\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"B\">&nbsp</label><br>\n" +
    "            <button type=\"submit\" class=\"btn btn-success\" id=\"B\">Add Recommended Link</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "<div ng-show=\"response.length > 0\">\n" +
    "    {{response}}\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-4 form-group\">\n" +
    "        <label for=\"filterK\">Filter by Keyword</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"Keyword\" id=\"filterK\" ng-model=\"filterKeyword\">\n" +
    "    </div>\n" +
    "    <div class=\"col-md-4 form-group\">\n" +
    "        <label for=\"filterLT\">Filter by Link Title</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"Link Title\" id=\"filterLT\" ng-model=\"filterLinkTitle\">\n" +
    "    </div>\n" +
    "    <div class=\"col-md-4 form-group\">\n" +
    "        <label for=\"filterL\">Filter by Link</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"Link\" id=\"filterL\" ng-model=\"filterLink\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-6\"\n" +
    "         ng-repeat=\"rec in recList.RecList | filter:{keyword:filterKeyword} | filter:{link:filterLink} | filter:{description:filterLinkTitle}\">\n" +
    "        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteRec(rec, $index)\">Delete</button>\n" +
    "        <span>{{rec.keyword}} = <a href=\"{{rec.link}}\">{{rec.description}}</a></span>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("manageSoftware/manageSoftware.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageSoftware/manageSoftware.tpl.html",
    "<h2>Manage Software</h2>\n" +
    "\n" +
    "<tabset justified=\"true\">\n" +
    "    <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "        <div ng-if=\"tab.number == 0\">\n" +
    "            <div software-manage-list>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"tab.number == 1\" >\n" +
    "            <div software-manage-loc-cat>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </tab>\n" +
    "</tabset>\n" +
    "");
}]);

angular.module("manageSoftware/manageSoftwareList.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageSoftware/manageSoftwareList.tpl.html",
    "<div>\n" +
    "    <div class=\"row form-inline\">\n" +
    "        <div class=\"form-group col-md-12\">\n" +
    "            <label for=\"filterBy\">Filter <small>{{filteredSW.length}}</small> results by</label>\n" +
    "            <div id=\"filterBy\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"titleFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Description contains\" ng-model=\"descrFilter\">\n" +
    "            </div>\n" +
    "            <label for=\"sortBy\">Sort by</label>\n" +
    "            <div id=\"sortBy\">\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"0\" ng-click=\"sortBy(0)\">\n" +
    "                    Title\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[0].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[0].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"1\" ng-click=\"sortBy(1)\">\n" +
    "                    Location\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[1].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[1].reverse\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredSW.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredSW.length > 0\"></pagination>\n" +
    "    </div>\n" +
    "    <div class=\"row\"\n" +
    "         ng-repeat=\"sw in filteredSW = (SWList.software | filter:{title:titleFilter}\n" +
    "                                                        | filter:{description:descrFilter}\n" +
    "                                                        | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\n" +
    "        | startFrom:(currentPage-1)*perPage | limitTo:perPage\"\n" +
    "         ng-class=\"{sdOpen: sw.show, sdOver: sw.sid == mOver}\" ng-mouseover=\"setOver(sw)\">\n" +
    "        <div class=\"col-md-12\" ng-click=\"toggleSW(sw)\">\n" +
    "            <table class=\"table\">\n" +
    "                <tr>\n" +
    "                    <td style=\"width: 15px;\">\n" +
    "                        <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"sw.show\"></span>\n" +
    "                        <span class=\"fa fa-fw fa-caret-down\" ng-show=\"sw.show\"></span>\n" +
    "                    </td>\n" +
    "                    <td style=\"width:64px\">\n" +
    "                        <img ng-hide=\"sw.picFile[0] != null\" src=\"{{sw.icon}}\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                        <img ng-show=\"sw.picFile[0] != null\" ngf-src=\"sw.picFile[0]\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                    </td>\n" +
    "                    <td>\n" +
    "                        <h4>\n" +
    "                            {{sw.title}}\n" +
    "                        </h4>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "        <div ng-show=\"sw.show\">\n" +
    "            <form name=\"editSW{{sw.sid}}\" ng-submit=\"updateSW(sw)\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_up\">Upload Icon</label>\n" +
    "                        <input type=\"file\" ngf-select=\"\" ng-model=\"sw.picFile\" accept=\"image/png\"\n" +
    "                               ngf-change=\"generateThumb(sw.picFile[0], $files)\" id=\"{{sw.sid}}_up\">\n" +
    "                        <span class=\"progress\" ng-show=\"sw.picFile[0].progress >= 0\">\n" +
    "                            <div class=\"ng-binding\" style=\"width:{{sw.picFile[0].progress}}%\" ng-bind=\"sw.picFile[0].progress + '%'\"></div>\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_title\">Title</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"{{sw.title}}\" ng-model=\"sw.title\"\n" +
    "                               id=\"{{sw.sid}}_title\" required>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_descr\">Description</label>\n" +
    "                        <textarea class=\"form-control\" rows=\"3\" id=\"{{sw.sid}}_descr\" ng-model=\"sw.description\" required></textarea>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_mod\">List of Installed Modules</label>\n" +
    "                        <textarea class=\"form-control\" rows=\"3\" id=\"{{sw.sid}}_mod\" ng-model=\"sw.modules\" ></textarea>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-12 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_links\">Links</label>\n" +
    "                        <ul class=\"list-group\" id=\"{{sw.sid}}_links\">\n" +
    "                            <li class=\"list-group-item\" ng-repeat=\"link in sw.links\">\n" +
    "                                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteLink(sw,link)\">\n" +
    "                                    <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                </button>\n" +
    "                                {{link.description}} <a href=\"{{link.url}}\">{{link.title}}</a>\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item col-md-12\">\n" +
    "                                <div class=\"col-md-4\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" placeholder=\"Link Description\" ng-model=\"sw.newLink.description\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-3\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" placeholder=\"Link Title\" ng-model=\"sw.newLink.title\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-4\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" placeholder=\"http://www.example.com/\" ng-model=\"sw.newLink.url\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-1\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"addLink(sw)\"\n" +
    "                                            ng-disabled=\"sw.newLink.title.length == 0 || sw.newLink.url.length < 2\">\n" +
    "                                        <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-12 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_ver\">Versions</label>\n" +
    "                        <ul class=\"list-group\" id=\"{{sw.sid}}_ver\">\n" +
    "                            <li class=\"list-group-item col-md-12\" ng-repeat=\"version in sw.versions\">\n" +
    "                                <div class=\"col-md-4\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteVersion(sw,version)\">\n" +
    "                                        <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                    </button>\n" +
    "                                    {{version.version}}\n" +
    "                                    <span class=\"fa fa-fw fa-windows\" ng-show=\"version.os == 1\"></span>\n" +
    "                                    <span class=\"fa fa-fw fa-apple\" ng-show=\"version.os == 2\"></span>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-8 form-group\">\n" +
    "                                    <label for=\"{{sw.sid}}_loc\">Locations</label>\n" +
    "                                    <ul class=\"list-group\" id=\"{{sw.sid}}_loc\">\n" +
    "                                        <li class=\"list-group-item col-md-12\" ng-repeat=\"loc in version.locations\">\n" +
    "                                            <div class=\"col-md-6\">\n" +
    "                                                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteLocation(sw,version,loc)\">\n" +
    "                                                    <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                                </button>\n" +
    "                                                {{loc.name}}\n" +
    "                                            </div>\n" +
    "                                            <div class=\"col-md-6\">\n" +
    "                                                <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 1)\">\n" +
    "                                                    <span class=\"fa fa-fw fa-windows\"></span>\n" +
    "                                                    <span class=\"fa fa-fw fa-desktop\"></span>\n" +
    "                                                </div>\n" +
    "                                                <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 2)\">\n" +
    "                                                    <span class=\"fa fa-fw fa-apple\"></span>\n" +
    "                                                    <span class=\"fa fa-fw fa-desktop\"></span>\n" +
    "                                                </div>\n" +
    "                                                <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 4)\">\n" +
    "                                                    <span class=\"fa fa-fw fa-windows\"></span>\n" +
    "                                                    <span class=\"fa fa-fw fa-laptop\"></span>\n" +
    "                                                </div>\n" +
    "                                                <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 8)\">\n" +
    "                                                    <span class=\"fa fa-fw fa-apple\"></span>\n" +
    "                                                    <span class=\"fa fa-fw fa-laptop\"></span>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                        </li>\n" +
    "                                        <li class=\"list-group-item col-md-12\">\n" +
    "                                            <div class=\"col-md-6\">\n" +
    "                                                <select class=\"form-control\" ng-model=\"version.newLoc.selLoc\"\n" +
    "                                                        ng-options=\"loc.name for loc in SWList.locations\">\n" +
    "                                                </select>\n" +
    "                                            </div>\n" +
    "                                            <div class=\"col-md-5\">\n" +
    "                                                <div class=\"col-md-6\" ng-repeat=\"device in version.newLoc.devices track by $index\"\n" +
    "                                                     ng-show=\"(($index == 0 || $index == 2) && version.os == 1) ||\n" +
    "                                                              (($index == 1 || $index == 3) && version.os == 2)\">\n" +
    "                                                    <input type=\"checkbox\" ng-model=\"version.newLoc.devices[$index]\">\n" +
    "                                                    <span ng-show=\"$index == 0\">\n" +
    "                                                        <span class=\"fa fa-fw fa-windows\"></span>\n" +
    "                                                        <span class=\"fa fa-fw fa-desktop\"></span>\n" +
    "                                                    </span>\n" +
    "                                                    <span ng-show=\"$index == 1\">\n" +
    "                                                        <span class=\"fa fa-fw fa-apple\"></span>\n" +
    "                                                        <span class=\"fa fa-fw fa-desktop\"></span>\n" +
    "                                                    </span>\n" +
    "                                                    <span ng-show=\"$index == 2\">\n" +
    "                                                        <span class=\"fa fa-fw fa-windows\"></span>\n" +
    "                                                        <span class=\"fa fa-fw fa-laptop\"></span>\n" +
    "                                                    </span>\n" +
    "                                                    <span ng-show=\"$index == 3\">\n" +
    "                                                        <span class=\"fa fa-fw fa-apple\"></span>\n" +
    "                                                        <span class=\"fa fa-fw fa-laptop\"></span>\n" +
    "                                                    </span>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                            <div class=\"col-md-1\">\n" +
    "                                                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addLocation(sw,version)\">\n" +
    "                                                    <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                                                </button>\n" +
    "                                            </div>\n" +
    "                                        </li>\n" +
    "                                    </ul>\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item col-md-6\">\n" +
    "                                <div class=\"col-md-6\">\n" +
    "                                    <input type=\"text\" class=\"form-control\" placeholder=\"Version\" ng-model=\"sw.newVer.version\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-4\">\n" +
    "                                    <select class=\"form-control\" ng-model=\"sw.newVer.selOS\" ng-options=\"opSys.name for opSys in os\">\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-2\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"addVersion(sw)\"\n" +
    "                                            ng-disabled=\"sw.newVer.version.length == 0\">\n" +
    "                                        <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-12 form-group\">\n" +
    "                        <label for=\"{{sw.sid}}_cat\">Categories</label>\n" +
    "                        <ul class=\"list-group\" id=\"{{sw.sid}}_cat\">\n" +
    "                            <li class=\"list-group-item col-md-12\">\n" +
    "                                <div class=\"col-md-2\" ng-repeat=\"category in sw.categories\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteCategory(sw,category)\">\n" +
    "                                        <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                    </button>\n" +
    "                                    {{category.name}}\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                            <li class=\"list-group-item col-md-6\">\n" +
    "                                <div class=\"col-md-10\">\n" +
    "                                    <select class=\"form-control\" ng-model=\"sw.selCat\" ng-options=\"cat.name for cat in SWList.categories\">\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-2\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"addCategory(sw)\">\n" +
    "                                        <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12 text-center\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-success\">Update information</button>\n" +
    "                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteSW(sw)\">\n" +
    "                        Delete {{sw.title}} software\n" +
    "                    </button>\n" +
    "                    {{sw.formResponse}}\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <pagination total-items=\"filteredSW.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredSW.length > 0\"></pagination>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <h4 ng-show=\"filteredSW.length == 0\">Nothing found</h4>\n" +
    "</div>\n" +
    "\n" +
    "<h3>Add New Software</h3>\n" +
    "<form name=\"addNewSW\" ng-submit=\"createSW()\">\n" +
    "    <div class=\"row sdOpen\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"up\">Upload Icon</label>\n" +
    "                <input type=\"file\" ngf-select=\"\" ng-model=\"newSW.picFile\" accept=\"image/*\"\n" +
    "                       ngf-change=\"generateThumb(newSW.picFile[0], $files)\" id=\"up\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <span class=\"progress\" ng-show=\"newSW.picFile[0].progress >= 0\">\n" +
    "                    <div class=\"ng-binding\" style=\"width:{{newSW.picFile[0].progress}}%\" ng-bind=\"newSW.picFile[0].progress + '%'\"></div>\n" +
    "                </span>\n" +
    "                <img ng-show=\"newSW.picFile[0] != null\" ngf-src=\"newSW.picFile[0]\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"title\">Title</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Software Title\" ng-model=\"newSW.title\"\n" +
    "                       id=\"title\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"descr\">Description</label>\n" +
    "                <textarea class=\"form-control\" rows=\"3\" id=\"descr\" ng-model=\"newSW.description\" required></textarea>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"mod\">List of Installed Modules</label>\n" +
    "                <textarea class=\"form-control\" rows=\"3\" id=\"mod\" ng-model=\"newSW.modules\" ></textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-12 form-group\">\n" +
    "                <label for=\"links\">Links</label>\n" +
    "                <ul class=\"list-group\" id=\"links\">\n" +
    "                    <li class=\"list-group-item\" ng-repeat=\"link in newSW.links\">\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"delNewSWLink(link)\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                        {{link.description}} <a href=\"{{link.url}}\">{{link.title}}</a>\n" +
    "                    </li>\n" +
    "                    <li class=\"list-group-item col-md-12\">\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"Link Description\" ng-model=\"newSW.newLink.description\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-3\">\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"Link Title\" ng-model=\"newSW.newLink.title\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"http://www.example.com/\" ng-model=\"newSW.newLink.url\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-1\">\n" +
    "                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"addNewSWLink()\"\n" +
    "                                    ng-disabled=\"newSW.newLink.title.length == 0 || newSW.newLink.url.length < 2\">\n" +
    "                                <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-12 form-group\">\n" +
    "                <label for=\"ver\">Versions</label>\n" +
    "                <ul class=\"list-group\" id=\"ver\">\n" +
    "                    <li class=\"list-group-item col-md-12\" ng-repeat=\"version in newSW.versions\">\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"delNewSWVer(version)\">\n" +
    "                                <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                            </button>\n" +
    "                            {{version.version}}\n" +
    "                            <span class=\"fa fa-fw fa-windows\" ng-show=\"version.os == 1\"></span>\n" +
    "                            <span class=\"fa fa-fw fa-apple\" ng-show=\"version.os == 2\"></span>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-8 form-group\">\n" +
    "                            <label for=\"loc\">Locations</label>\n" +
    "                            <ul class=\"list-group\" id=\"loc\">\n" +
    "                                <li class=\"list-group-item col-md-12\" ng-repeat=\"loc in version.locations\">\n" +
    "                                    <div class=\"col-md-6\">\n" +
    "                                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"delNewSWLoc(version,loc)\">\n" +
    "                                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                        </button>\n" +
    "                                        {{loc.name}}\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-6\">\n" +
    "                                        <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 1)\">\n" +
    "                                            <span class=\"fa fa-fw fa-windows\"></span>\n" +
    "                                            <span class=\"fa fa-fw fa-desktop\"></span>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 2)\">\n" +
    "                                            <span class=\"fa fa-fw fa-apple\"></span>\n" +
    "                                            <span class=\"fa fa-fw fa-desktop\"></span>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 4)\">\n" +
    "                                            <span class=\"fa fa-fw fa-windows\"></span>\n" +
    "                                            <span class=\"fa fa-fw fa-laptop\"></span>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 8)\">\n" +
    "                                            <span class=\"fa fa-fw fa-apple\"></span>\n" +
    "                                            <span class=\"fa fa-fw fa-laptop\"></span>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </li>\n" +
    "                                <li class=\"list-group-item col-md-12\">\n" +
    "                                    <div class=\"col-md-6\">\n" +
    "                                        <select class=\"form-control\" ng-model=\"version.newLoc.selLoc\"\n" +
    "                                                ng-options=\"loc.name for loc in SWList.locations\">\n" +
    "                                        </select>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-5\">\n" +
    "                                        <div class=\"col-md-6\" ng-repeat=\"device in version.newLoc.devices track by $index\"\n" +
    "                                                ng-show=\"(($index == 0 || $index == 2) && version.os == 1) ||\n" +
    "                                                         (($index == 1 || $index == 3) && version.os == 2)\">\n" +
    "                                            <input type=\"checkbox\" ng-model=\"version.newLoc.devices[$index]\">\n" +
    "                                                    <span ng-show=\"$index == 0\">\n" +
    "                                                        <span class=\"fa fa-fw fa-windows\"></span>\n" +
    "                                                        <span class=\"fa fa-fw fa-desktop\"></span>\n" +
    "                                                    </span>\n" +
    "                                                    <span ng-show=\"$index == 1\">\n" +
    "                                                        <span class=\"fa fa-fw fa-apple\"></span>\n" +
    "                                                        <span class=\"fa fa-fw fa-desktop\"></span>\n" +
    "                                                    </span>\n" +
    "                                                    <span ng-show=\"$index == 2\">\n" +
    "                                                        <span class=\"fa fa-fw fa-windows\"></span>\n" +
    "                                                        <span class=\"fa fa-fw fa-laptop\"></span>\n" +
    "                                                    </span>\n" +
    "                                                    <span ng-show=\"$index == 3\">\n" +
    "                                                        <span class=\"fa fa-fw fa-apple\"></span>\n" +
    "                                                        <span class=\"fa fa-fw fa-laptop\"></span>\n" +
    "                                                    </span>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-1\">\n" +
    "                                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"addNewSWLoc(version)\">\n" +
    "                                            <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                                        </button>\n" +
    "                                    </div>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                    <li class=\"list-group-item col-md-6\">\n" +
    "                        <div class=\"col-md-6\">\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"Version\" ng-model=\"newSW.newVer.version\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            <select class=\"form-control\" ng-model=\"newSW.newVer.selOS\" ng-options=\"opSys.name for opSys in os\">\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2\">\n" +
    "                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"addNewSWVer()\"\n" +
    "                                    ng-disabled=\"newSW.newVer.version.length == 0\">\n" +
    "                                <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-12 form-group\">\n" +
    "                <label for=\"cat\">Categories</label>\n" +
    "                <ul class=\"list-group\" id=\"cat\">\n" +
    "                    <li class=\"list-group-item col-md-12\">\n" +
    "                        <div class=\"col-md-2\" ng-repeat=\"category in newSW.categories\">\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"delNewSWCat(category)\">\n" +
    "                                <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                            </button>\n" +
    "                            {{category.name}}\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                    <li class=\"list-group-item col-md-6\">\n" +
    "                        <div class=\"col-md-10\">\n" +
    "                            <select class=\"form-control\" ng-model=\"newSW.selCat\" ng-options=\"cat.name for cat in SWList.categories\">\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2\">\n" +
    "                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"addNewSWCat()\">\n" +
    "                                <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12 text-center\">\n" +
    "            <button type=\"submit\" class=\"btn btn-success\">Create Software Record</button>\n" +
    "            {{newSW.formResponse}}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "");
}]);

angular.module("manageSoftware/manageSoftwareLocCat.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageSoftware/manageSoftwareLocCat.tpl.html",
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <h3>Locations</h3>\n" +
    "        <table class=\"table table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th>ID</th>\n" +
    "                <th>Parent ID</th>\n" +
    "                <th>Name</th>\n" +
    "                <th>Action</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr>\n" +
    "                <div class=\"col-md-2\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Parent ID\" ng-model=\"newLocation.parent\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-8\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"New Location Name\" ng-model=\"newLocation.name\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2\">\n" +
    "                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"addLocation()\" ng-disabled=\"newLocation.name.length == 0\">\n" +
    "                        <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                {{locResponse}}\n" +
    "            </tr>\n" +
    "            <tr ng-repeat=\"location in SWList.locations\" ng-click=\"selectLocation(location)\">\n" +
    "                <td>\n" +
    "                    {{location.lid}}\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"selLocation == location.lid\">\n" +
    "                        {{location.parent}}\n" +
    "                    </span>\n" +
    "                    <span ng-show=\"selLocation == location.lid\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Parent ID\" ng-model=\"location.parent\">\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"selLocation == location.lid\">\n" +
    "                        {{location.name}}\n" +
    "                    </span>\n" +
    "                    <span ng-show=\"selLocation == location.lid\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Location Name\" ng-model=\"location.name\">\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div ng-show=\"selLocation == location.lid\">\n" +
    "                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"editLocation(location)\">\n" +
    "                            <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteLocation(location)\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <h3>Categories</h3>\n" +
    "        <table class=\"table table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th>ID</th>\n" +
    "                <th>Name</th>\n" +
    "                <th>Action</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr>\n" +
    "                <div class=\"col-md-10\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"New Category\" ng-model=\"newCategory\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2\">\n" +
    "                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"addCategory()\" ng-disabled=\"newCategory.length == 0\">\n" +
    "                        <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                {{catResponse}}\n" +
    "            </tr>\n" +
    "            <tr ng-repeat=\"category in SWList.categories\" ng-click=\"selectCategory(category)\">\n" +
    "                <td>\n" +
    "                    {{category.cid}}\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"selCategory == category.cid\">\n" +
    "                        {{category.name}}\n" +
    "                    </span>\n" +
    "                    <span ng-show=\"selCategory == category.cid\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Category Name\" ng-model=\"category.name\">\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div ng-show=\"selCategory == category.cid\">\n" +
    "                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"editCategory(category)\">\n" +
    "                            <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteCategory(category)\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("manageUserGroups/manageUG.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageUserGroups/manageUG.tpl.html",
    "<h2>Web Applications Admin Interface</h2>\n" +
    "\n" +
    "<tabset justified=\"true\">\n" +
    "    <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "        <div ng-show=\"tab.number == 0\">\n" +
    "            <table class=\"table table-hover table-condensed\">\n" +
    "                <thead>\n" +
    "                <tr>\n" +
    "                    <th>User Login</th>\n" +
    "                    <th class=\"text-center\">Name</th>\n" +
    "                    <th class=\"text-center\">Access Rights to Web Applications</th>\n" +
    "                    <th class=\"text-center\">Action</th>\n" +
    "                </tr>\n" +
    "                </thead>\n" +
    "                <tr ng-repeat=\"user in users\" ng-click=\"expandUser(user)\">\n" +
    "                    <th scope=\"row\">\n" +
    "                        {{user.wpLogin}}\n" +
    "                    </th>\n" +
    "                    <td class=\"text-center\">\n" +
    "                        {{user.name}}\n" +
    "                    </td>\n" +
    "                    <td class=\"text-center\">\n" +
    "                        <div ng-show=\"isExpUser(user.id) && $index > 0\">\n" +
    "                            <div class=\"row\" ng-repeat=\"app in apps\">\n" +
    "                                <div class=\"col-xs-4 text-right\">\n" +
    "                                    <input type=\"checkbox\" ng-model=\"user.access[$index]\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-xs-8\">\n" +
    "                                    <a href=\"{{app.link}}\">{{app.appName}}</a>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div ng-hide=\"isExpUser(user.id) && $index > 0\">\n" +
    "                            <div class=\"row\" ng-repeat=\"app in apps\">\n" +
    "                                <div class=\"col-xs-4 text-right\">\n" +
    "\n" +
    "                                </div>\n" +
    "                                <div class=\"col-xs-8\">\n" +
    "                                    <div ng-show=\"user.access[$index]\">\n" +
    "                                        <a href=\"{{app.link}}\">{{app.appName}}</a>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                    <td class=\"text-center\">\n" +
    "                        <div ng-show=\"isExpUser(user.id)\">\n" +
    "                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"updateUser(user)\" ng-disabled=\"isLoading\"\n" +
    "                                    ng-show=\"$index > 0\">Save</button>\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteUser(user, $index)\" ng-disabled=\"isLoading\"\n" +
    "                                    ng-show=\"$index > 0\">Remove All</button><br>\n" +
    "                            {{result}}\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "                <tr>\n" +
    "                    <th scope=\"row\">\n" +
    "                        <select class=\"form-control\" ng-model=\"newUser\" ng-options=\"user.name for user in wpUsers\">\n" +
    "                        </select>\n" +
    "                    </th>\n" +
    "                    <td class=\"text-center\">\n" +
    "\n" +
    "                    </td>\n" +
    "                    <td class=\"text-center\">\n" +
    "                        <div class=\"row\" ng-repeat=\"app in apps\">\n" +
    "                            <div class=\"col-xs-4 text-right\">\n" +
    "                                <input type=\"checkbox\" ng-model=\"newUserAccess[$index]\">\n" +
    "                            </div>\n" +
    "                            <div class=\"col-xs-8\">\n" +
    "                                <a href=\"{{app.link}}\">{{app.appName}}</a>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                    <td class=\"text-center\">\n" +
    "                        <div>\n" +
    "                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"createUser(newUser)\" ng-disabled=\"isLoading\">\n" +
    "                                Grant Access Rights\n" +
    "                            </button><br>\n" +
    "                            {{result2}}\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "        <div ng-show=\"tab.number == 1\">\n" +
    "            <h4>Web applications with data manageable by users:</h4>\n" +
    "            <h4 class=\"text-center\" ng-repeat=\"app in apps\" ng-show=\"$index > 0\">\n" +
    "                <a href=\"{{app.link}}\">{{app.appName}}</a>\n" +
    "            </h4>\n" +
    "            <p>When we create new web application it has to be added to the database manually.</p>\n" +
    "        </div>\n" +
    "    </tab>\n" +
    "</tabset>\n" +
    "");
}]);

angular.module("manageUserGroups/viewMyWebApps.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageUserGroups/viewMyWebApps.tpl.html",
    "<h2>My Web Applications</h2>\n" +
    "\n" +
    "<div class=\"form-group\">\n" +
    "    <label for=\"webapps\">Web Application Back-End access links</label>\n" +
    "    <ul class=\"list-group\" id=\"webapps\">\n" +
    "        <li class=\"list-group-item\" ng-repeat=\"app in apps\">\n" +
    "            <a href=\"{{app.link}}\">{{app.appName}}</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("siteFeedback/siteFeedback.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("siteFeedback/siteFeedback.tpl.html",
    "<h3>Received Feedback</h3>\n" +
    "<div class=\"row\" ng-repeat=\"record in responses\">\n" +
    "    <h4><a href=\"{{record.pageurl}}\">{{record.pageurl}}</a></h4>\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <div class=\"col-md-2\">\n" +
    "            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"delete(record)\"\n" +
    "                    ng-show=\"false\">\n" +
    "                Delete\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2\">\n" +
    "            Score: {{record.score}}\n" +
    "        </div>\n" +
    "        <div class=\"col-md-4\">\n" +
    "            {{record.when}}\n" +
    "        </div>\n" +
    "        <div class=\"col-md-4\">\n" +
    "            {{record.ip}}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6\">\n" +
    "        Comments: {{record.comments}}\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("staffDirectory/staffDirectory.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staffDirectory/staffDirectory.tpl.html",
    "<h2>Library Staff Directory</h2>\n" +
    "\n" +
    "<div>\n" +
    "    <div class=\"text-center row form-inline\">\n" +
    "        <div class=\"col-md-5 form-group text-right\">\n" +
    "            <label for=\"sortBy\">Sort By</label>\n" +
    "            <div id=\"sortBy\">\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"'first'\"\n" +
    "                        ng-click=\"sortMode='firstname'\">\n" +
    "                    First Name\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"'last'\"\n" +
    "                        ng-click=\"sortMode='lastname'\">\n" +
    "                    Last Name\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"'title'\"\n" +
    "                        ng-click=\"sortMode='title'\">\n" +
    "                    Title\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"'dept'\"\n" +
    "                        ng-click=\"sortMode='department'\">\n" +
    "                    Department\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-7 form-group text-left\">\n" +
    "            <label for=\"filterBy\">Filter by</label>\n" +
    "            <div id=\"filterBy\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Last Name\" ng-model=\"lastNameFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"First Name\" ng-model=\"firstNameFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title\" ng-model=\"titleFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Department\" ng-model=\"deptFilter\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredDB.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\"></pagination>\n" +
    "    </div>\n" +
    "    <div class=\"row\" ng-repeat=\"person in filteredDB = (Directory.list\n" +
    "                                                        | filter:{lastname:lastNameFilter}\n" +
    "                                                        | filter:{firstname:firstNameFilter}\n" +
    "                                                        | filter:{title:titleFilter}\n" +
    "                                                        | filter:{department:deptFilter}\n" +
    "                                                        | orderBy:sortMode)\n" +
    "                                | startFrom:(currentPage-1)*perPage | limitTo:perPage\"\n" +
    "         ng-class=\"{sdOpen: person.show, sdOver: person.id == mOver}\" ng-mouseover=\"setOver(person)\">\n" +
    "        <div class=\"col-md-7\" ng-click=\"togglePerson(person)\">\n" +
    "            <h4>\n" +
    "                <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"person.show\"></span>\n" +
    "                <span class=\"fa fa-fw fa-caret-down\" ng-show=\"person.show\"></span>\n" +
    "                {{person.firstname}} {{person.lastname}} <small>{{person.title}}</small>\n" +
    "            </h4>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-5\" ng-click=\"togglePerson(person)\">\n" +
    "            <h4>{{person.department}}</h4>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\" ng-show=\"person.show\">\n" +
    "            <div class=\"col-md-3\">\n" +
    "                <img ng-src=\"{{person.image}}\" style=\"height:250px;\" alt=\"{{person.firstname}} {{person.lastname}}\"/>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-9\" ng-show=\"person.show && hasAccess == 1\">\n" +
    "                <div class=\"col-md-4 form-group\">\n" +
    "                    <label for=\"{{person.id}}_title\">Title</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{person.title}}\" maxlength=\"150\" ng-model=\"person.title\" required\n" +
    "                           id=\"{{person.id}}_title\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2 form-group\">\n" +
    "                    <label for=\"{{person.id}}_rank\">Rank</label>\n" +
    "                    <select class=\"form-control\" id=\"{{person.id}}_rank\" ng-model=\"person.rank\"\n" +
    "                            ng-options=\"rank for rank in ranks\">\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6 form-group\">\n" +
    "                    <label for=\"{{person.id}}_dept\">Department</label>\n" +
    "                    <select class=\"form-control\" id=\"{{person.id}}_dept\" ng-model=\"person.department\"\n" +
    "                            ng-options=\"dept for dept in departments\">\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3 form-group\">\n" +
    "                    <label for=\"{{person.id}}_email\">Email</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{person.email}}\" maxlength=\"1024\" ng-model=\"person.email\" required\n" +
    "                           id=\"{{person.id}}_email\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3 form-group\">\n" +
    "                    <label for=\"{{person.id}}_phone\">Phone</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{person.phone}}\" maxlength=\"8\" ng-model=\"person.phone\" required\n" +
    "                           id=\"{{person.id}}_phone\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3 form-group\">\n" +
    "                    <label for=\"{{person.id}}_fax\">Fax</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{person.fax}}\" maxlength=\"8\" ng-model=\"person.fax\"\n" +
    "                           id=\"{{person.id}}_fax\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3 form-group\">\n" +
    "                    <label for=\"{{person.id}}_div\">Division</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"{{person.division}}\" maxlength=\"150\" ng-model=\"person.division\"\n" +
    "                           id=\"{{person.id}}_div\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6 text-center\">\n" +
    "                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"updatePerson(person)\">Update information</button>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6 text-center\">\n" +
    "                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deletePerson(person)\">\n" +
    "                        Delete {{person.firstname}} {{person.lastname}} record\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <h5>LibGuide Subjects</h5>\n" +
    "                    <dd>\n" +
    "                        <ul class=\"list-unstyled\">\n" +
    "                            <li  ng-repeat=\"subject in person.subjects\">\n" +
    "                                <button type=\"button\" class=\"btn btn-success\" ng-click=\"deleteSubject(person, subject.id, $index)\">\n" +
    "                                    Delete\n" +
    "                                </button>\n" +
    "                                <a href=\"{{subject.link}}\">{{subject.subject}}</a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                        <form class=\"form-inline\">\n" +
    "                            <select class=\"form-control\" ng-model=\"person.selSubj\" ng-options=\"sub.subject for sub in Directory.subjects\">\n" +
    "                            </select>\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"addSubject(person)\">Assign Subject</button>\n" +
    "                            <p>{{person.subjResponse}}</p>\n" +
    "                        </form>\n" +
    "                    </dd>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-9\" ng-show=\"person.show && hasAccess == 0\">\n" +
    "                <dt>Title</dt><dd>{{person.title}}</dd>\n" +
    "                <dt ng-show=\"person.rank.length > 0\">Rank</dt>  <dd>{{person.rank}}</dd>\n" +
    "                <dt>Departent</dt>  <dd>{{person.department}}</dd>\n" +
    "                <dt ng-show=\"person.division.length > 0\">Division</dt>  <dd>{{person.division}}</dd>\n" +
    "                <dt>Email</dt>  <dd>{{person.email}}</dd>\n" +
    "                <dt>Phone</dt>  <dd>{{person.phone}}</dd>\n" +
    "                <dt ng-show=\"person.fax.length > 0\">Fax</dt>  <dd>{{person.fax}}</dd>\n" +
    "                <dt ng-show=\"person.subjects.length > 0\">LibGuide Subjects</dt>\n" +
    "                <dd>\n" +
    "                    <ul class=\"list-inline\">\n" +
    "                        <li ng-repeat=\"subject in person.subjects\">\n" +
    "                            <a href=\"{{subject.link}}\">{{subject.subject}}</a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </dd>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <pagination total-items=\"filteredDB.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\"></pagination>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-show=\"hasAccess\" style=\"background-color:#f9f9f9;\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"firstName\">Firts Name</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"First Name\" maxlength=\"25\"\n" +
    "                   ng-model=\"formData.first\" id=\"firstName\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"lastName\">Last Name</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Last Name\" maxlength=\"25\"\n" +
    "                   ng-model=\"formData.last\" id=\"lastName\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"email\">Email</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Email\" maxlength=\"255\"\n" +
    "                   ng-model=\"formData.email\" id=\"email\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"title\">Title</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Title\" maxlength=\"150\"\n" +
    "                   ng-model=\"formData.title\" id=\"title\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2 form-group\">\n" +
    "            <label for=\"rank\">Rank</label>\n" +
    "            <select class=\"form-control\" ng-model=\"formData.rank\" ng-options=\"rank for rank in ranks\" id=\"rank\">\n" +
    "            </select>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-4 form-group\">\n" +
    "            <label for=\"dept\">Department</label>\n" +
    "            <select class=\"form-control\" ng-model=\"formData.dept\" ng-options=\"dept for dept in departments\" id=\"dept\">\n" +
    "            </select>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2 form-group\">\n" +
    "            <label for=\"phone\">Phone</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Phone\" maxlength=\"8\"\n" +
    "                   ng-model=\"formData.phone\" id=\"phone\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2 form-group\">\n" +
    "            <label for=\"fax\">Fax</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Fax\" maxlength=\"8\" ng-model=\"formData.fax\" id=\"fax\">\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2 form-group text-right\">\n" +
    "            <label for=\"addButton\">&nbsp</label><br>\n" +
    "            <button type=\"submit\" class=\"btn btn-success\" ng-click=\"addPerson()\" id=\"addButton\">Create New Record</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <p ng-model=\"formResponse\">{{formResponse}}</p>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("submittedForms/submittedForms.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("submittedForms/submittedForms.tpl.html",
    "<h2>Manage Submitted Forms</h2>\n" +
    "\n" +
    "<div>\n" +
    "    <div class=\"row form-inline\">\n" +
    "        <div class=\"form-group col-md-12\">\n" +
    "            <label for=\"filterBy\">Filter <small>{{filteredForms.length}}</small> results by</label>\n" +
    "            <div id=\"filterBy\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"titleFilter\">\n" +
    "            </div>\n" +
    "            <label for=\"sortBy\">Sort by</label>\n" +
    "            <div id=\"sortBy\">\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"0\" ng-click=\"sortBy(0)\">\n" +
    "                    Title\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[0].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[0].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"1\" ng-click=\"sortBy(1)\">\n" +
    "                    Status\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[1].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[1].reverse\"></span>\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"2\" ng-click=\"sortBy(2)\">\n" +
    "                    Date Submitted\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[2].reverse\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[2].reverse\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredForms.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredNews.length > 0\"></pagination>\n" +
    "    </div>\n" +
    "    <div class=\"row\"\n" +
    "         ng-repeat=\"form in filteredForms = (data.forms | filter:{title:titleFilter}\n" +
    "                                                         | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\n" +
    "        | startFrom:(currentPage-1)*perPage | limitTo:perPage\"\n" +
    "         ng-class=\"{sdOpen: form.show, sdOver: form.sid == mOver}\" ng-mouseover=\"setOver(form)\">\n" +
    "        <div class=\"col-md-12\" ng-click=\"toggleForms(form)\">\n" +
    "            <div class=\"col-md-10\">\n" +
    "                <h4>\n" +
    "                    <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"form.show\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-caret-down\" ng-show=\"form.show\"></span>\n" +
    "                    {{form.title}}\n" +
    "                    <small>{{form.status}}</small>\n" +
    "                </h4>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <h5>{{form.created}}</h5>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\" ng-show=\"form.show\">\n" +
    "            <div class=\"col-md-6 panel panel-default\" ng-repeat=\"field in form.fields\">\n" +
    "                <div class=\"panel-heading\">\n" +
    "                    <h4 class=\"panel-title\">{{field.name}}</h4>\n" +
    "                </div>\n" +
    "                <div class=\"panel-body\">\n" +
    "                    {{field.value}}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <pagination total-items=\"filteredForms.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredNews.length > 0\"></pagination>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <h4 ng-show=\"filteredForms.length == 0\">Nothing found</h4>\n" +
    "</div>\n" +
    "");
}]);
;angular.module('manage', [
    'ngAnimate',
    'ui.bootstrap',
    'manage.common',
    'manage.templates',
    'manage.manageHours',
    'manage.manageHoursUsers',
    'manage.manageUserGroups',
    'manage.siteFeedback',
    'manage.manageOneSearch',
    'manage.staffDirectory',
    'manage.manageDatabases',
    'manage.manageSoftware',
    'manage.manageNews',
    'manage.submittedForms'
])

    .constant('HOURS_MANAGE_URL', '//wwwdev2.lib.ua.edu/libhours2/')
    .constant('USER_GROUPS_URL', '//wwwdev2.lib.ua.edu/userGroupsAdmin/')
    .constant('SITE_FEEDBACK_URL', '//wwwdev2.lib.ua.edu/siteSurvey/')
    .constant('ONE_SEARCH_URL', '//wwwdev2.lib.ua.edu/oneSearch/')
    .constant('STAFF_DIR_URL', '//wwwdev2.lib.ua.edu/staffDir/')
    .constant('DATABASES_URL', '//wwwdev2.lib.ua.edu/databases/')
    .constant('SOFTWARE_URL', '//wwwdev2.lib.ua.edu/softwareList/')
    .constant('FORMS_URL', '//wwwdev2.lib.ua.edu/form/')
    .constant('NEWS_URL', '//wwwdev2.lib.ua.edu/newsApp/')

angular.module('manage.common', [
    'common.manage'
])
angular.module('common.manage', [])


    .factory('tokenFactory', ['$http', function tokenFactory($http){
        return function(tokenName){
            var cookies;
            this.GetCookie = function (name,c,C,i){
                if(cookies){ return cookies[name]; }
                c = document.cookie.split('; ');
                cookies = {};
                for(i=c.length-1; i>=0; i--){
                    C = c[i].split('=');
                    cookies[C[0]] = C[1];
                }
                return cookies[name];
            };
            var header = {};
            header["X-" + tokenName] = this.GetCookie(tokenName);
            $http.defaults.headers.post = header;
        }
    }])

    .factory('hmFactory', ['$http', 'HOURS_MANAGE_URL', function hmFactory($http, url){
        return {
            getData: function(pPoint){
                return $http({method: 'GET', url: url + "api/" + pPoint, params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "manageHours.php", params: params, data: data})
            }
        }
    }])
    .factory('ugFactory', ['$http', 'USER_GROUPS_URL', function ugFactory($http, url){
        return {
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url, params: params, data: data})
            }
        }
    }])
    .factory('sfFactory', ['$http', 'SITE_FEEDBACK_URL', function sfFactory($http, url){
        return {
            getData: function(params){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'GET', url: url, params: params})
            }
        }
    }])
    .factory('osFactory', ['$http', 'ONE_SEARCH_URL', function osFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/reclist", params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        }
    }])
    .factory('sdFactory', ['$http', 'STAFF_DIR_URL', function sdFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/people", params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        }
    }])
    .factory('mdbFactory', ['$http', 'DATABASES_URL', function mdbFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/all", params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        }
    }])
    .factory('swFactory', ['$http', 'SOFTWARE_URL', function swFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/all", params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        }
    }])
    .factory('newsFactory', ['$http', 'NEWS_URL', function newsFactory($http, url){
        return {
            getData: function(pPoint){
                return $http({method: 'GET', url: url + "api/" + pPoint, params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        }
    }])
    .factory('formFactory', ['$http', 'FORMS_URL', function formFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/all", params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            },
            submitForm: function(data){
                return $http({method: 'POST', url: url + "api/process", params: {}, data: data})
            }
        }
    }])

angular.module('manage.manageDatabases', [])
    .controller('manageDBCtrl', ['$scope', '$window', 'tokenFactory', 'mdbFactory',
        function manageDBCtrl($scope, $window, tokenFactory, mdbFactory){
            $scope.DBList = {};
            $scope.titleFilter = '';
            $scope.titleStartFilter = '';
            $scope.descrFilter = '';
            $scope.subjectFilter = '';
            $scope.typeFilter = '';
            $scope.disValues = [
                {name:'Show all', value:''},
                {name:'Enabled only', value:'0'},
                {name:'Disabled only', value:'1'}
            ];
            $scope.disFilter = $scope.disValues[0];
            $scope.sortMode = 0;
            $scope.sortModes = [
                {by:'title', reverse:false},
                {by:'dateCreated', reverse:false},
                {by:'lastModified', reverse:false},
                {by:'tmpDisabled', reverse:true}
                ];
            $scope.sortButton = $scope.sortMode;
            $scope.mOver = 0;
            $scope.newDB = {};
            $scope.newDB.updatedBy = $window.userName;
            $scope.newDB.subjects = [];
            $scope.newDB.types = [];
            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

            //primary, secondary
            $scope.subjectValues = [ 1, 2 ];

            tokenFactory("CSRF-libDatabases");

            mdbFactory.getData()
                .success(function(data) {
                    console.dir(data);
                    for (var i = 0; i < data.databases.length; i++){
                        data.databases[i].show = false;
                        data.databases[i].class = "";
                        data.databases[i].selSubj = data.subjects[0];
                        data.databases[i].subjType = 1;
                        data.databases[i].selType = data.types[0];
                    }
                    $scope.newDB.selSubj = data.subjects[0];
                    $scope.newDB.subjType = 1;
                    $scope.newDB.selType = data.types[0];
                    $scope.DBList = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.startTitle = function(actual, expected){
                if (!expected)
                    return true;
                if (actual.toLowerCase().indexOf(expected.toLowerCase()) == 0)
                    return true;
                return false;
            };
            $scope.toggleDB = function(db){
                $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].show =
                    !$scope.DBList.databases[$scope.DBList.databases.indexOf(db)].show;
            };
            $scope.setOver = function(db){
                $scope.mOver = db.id;
            };
            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
            };

            $scope.deleteDB = function(db){
                if (confirm("Delete " + db.title  + " permanently?") == true){
                    mdbFactory.postData({action : 1}, db)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.DBList.databases.splice($scope.DBList.databases.indexOf(db), 1);
                                $scope.formResponse = "Database has been deleted.";
                            } else {
                                $scope.formResponse = "Error: Can not delete database! " + data;
                            }
                            alert($scope.formResponse);
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.formResponse = "Error: Could not delete database! " + data;
                            alert($scope.formResponse);
                            console.log(data);
                        });
                }
            };
            $scope.updateDB = function(db){
                if (db.title.length < 1){
                    alert("Form error: Please fill out Title field!");
                    return false;
                }
                if (db.url.length < 11){
                    alert("Form error: Please fill out URL field!");
                    return false;
                }
                if (db.coverage.length < 1){
                    alert("Form error: Please fill out Coverage field!");
                    return false;
                }
                if (db.description.length < 1){
                    alert("Form error: Please fill out Description field!");
                    return false;
                }
                db.updatedBy = $scope.newDB.updatedBy;
                mdbFactory.postData({action : 2}, db)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.formResponse = "Database has been updated.";
                        } else {
                            $scope.formResponse = "Error: Can not update database! " + data;
                        }
                        alert($scope.formResponse);
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not update database! " + data;
                        alert($scope.formResponse);
                        console.log(data);
                    });
            };
            $scope.createDB = function(){
                console.dir($scope.newDB);
                mdbFactory.postData({action : 3}, $scope.newDB)
                    .success(function(data, status, headers, config) {
                        if ((typeof data === 'object') && (data !== null)){
                            var newDB = {};
                            newDB = angular.copy($scope.newDB);
                            newDB.id = data.id;
                            newDB.subjects = angular.copy(data.subjects);
                            newDB.types = angular.copy(data.types);
                            newDB.show = false;
                            newDB.class = "";
                            newDB.selSubj = data.subjects[0];
                            newDB.subjType = 1;
                            newDB.selType = data.types[0];
                            $scope.DBList.databases.push(newDB);
                            $scope.formResponse = "Database has been created.";
                        } else {
                            $scope.formResponse = "Error: Can not create database! " + data;
                        }
                        alert($scope.formResponse);
                        console.dir(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not create database! " + data;
                        alert($scope.formResponse);
                        console.dir(data);
                    });
            };

            $scope.addSubject = function(db){
                var newSubject = {};
                newSubject.dbid = db.id;
                newSubject.type = db.subjType;
                newSubject.sid = db.selSubj.sid;
                newSubject.subject = db.selSubj.subject;
                newSubject.updatedBy = $scope.newDB.updatedBy;
                mdbFactory.postData({action : 4}, newSubject)
                    .success(function(data, status, headers, config) {
                        if ((typeof data === 'object') && (data !== null)){
                            newSubject.id = data.id;
                            if (typeof $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].subjects == 'undefined')
                                $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].subjects = [];
                            $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].subjects.push(newSubject);
                            $scope.formResponse = "Subject has been added.";
                        } else {
                            $scope.formResponse = "Error: Can not add subject! " + data;
                        }
                        console.dir(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not add subject! " + data;
                        console.dir(data);
                    });
            };
            $scope.deleteSubject = function(db,subject){
                subject.updatedBy = $scope.newDB.updatedBy;
                mdbFactory.postData({action : 5}, subject)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].subjects.splice(
                                $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].subjects.indexOf(subject),1
                            );
                            $scope.formResponse = "Subject has been deleted.";
                        } else {
                            $scope.formResponse = "Error: Can not delete subject! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not delete subject! " + data;
                    });
            };
            $scope.addType = function(db){
                var newType = {};
                newType.dbid = db.id;
                newType.tid = db.selType.tid;
                newType.type = db.selType.type;
                newType.updatedBy = $scope.newDB.updatedBy;
                mdbFactory.postData({action : 6}, newType)
                    .success(function(data, status, headers, config) {
                        if ((typeof data === 'object') && (data !== null)){
                            newType.id = data.id;
                            if (typeof $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].types == 'undefined')
                                $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].types = [];
                            $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].types.push(newType);
                            $scope.formResponse = "Type has been added.";
                        } else {
                            $scope.formResponse = "Error: Can not add type! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not add type! " + data;
                    });
            };
            $scope.deleteType = function(db,type){
                type.updatedBy = $scope.newDB.updatedBy;
                mdbFactory.postData({action : 7}, type)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].types.splice(
                                $scope.DBList.databases[$scope.DBList.databases.indexOf(db)].types.indexOf(type),1
                            );
                            $scope.formResponse = "Type has been deleted.";
                        } else {
                            $scope.formResponse = "Error: Can not delete type! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not delete type! " + data;
                    });
            };

            $scope.delSubjNewDB = function(index){
                $scope.newDB.subjects.splice(index, 1);
            };
            $scope.addSubjNewDB = function(){
                var newSubject = {};
                newSubject.type = $scope.newDB.subjType;
                newSubject.sid = $scope.newDB.selSubj.sid;
                newSubject.subject = $scope.newDB.selSubj.subject;
                if (typeof $scope.newDB.subjects == 'undefined')
                    $scope.newDB.subjects = [];
                var isPresent = false;
                for (var i = 0; i < $scope.newDB.subjects.length; i++)
                    if ($scope.newDB.subjects[i].sid == newSubject.sid){
                        isPresent = true;
                        break;
                    }
                if (!isPresent)
                    $scope.newDB.subjects.push(newSubject);
            };
            $scope.delTypeNewDB = function(index){
                $scope.newDB.types.splice(index, 1);
            };
            $scope.addTypeNewDB = function(){
                var newType = {};
                newType.tid = $scope.newDB.selType.tid;
                newType.type = $scope.newDB.selType.type;
                if (typeof $scope.newDB.types == 'undefined')
                    $scope.newDB.types = [];
                var isPresent = false;
                for (var i = 0; i < $scope.newDB.types.length; i++)
                    if ($scope.newDB.types[i].tid == newType.tid){
                        isPresent = true;
                        break;
                    }
                if (!isPresent)
                    $scope.newDB.types.push(newType);
            };
        }])

    .directive('databasesManageList', function($animate) {
        return {
            restrict: 'A',
            scope: {},
            controller: 'manageDBCtrl',
            link: function(scope, elm, attrs){
                //Preload the spinner element
                var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');
                //Preload the location of the boxe's title element (needs to be more dynamic in the future)
                var titleElm = elm.find('h2');
                //Enter the spinner animation, appending it to the title element
                $animate.enter(spinner, titleElm[0]);

                var loadingWatcher = scope.$watch(
                    'DBList.totalTime',
                    function(newVal, oldVal){
                        if (newVal != oldVal){
                            $animate.leave(spinner);
                            console.log("Databases loaded");
                        }
                    },
                    true
                );
            },
            templateUrl: 'manageDatabases/manageDatabases.tpl.html'
        };
    })
    .filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            if (typeof input == 'undefined')
                return input;
            return input.slice(start);
        }
    })

angular.module('manage.manageHours', [])
    .constant('HOURS_FROM', [
        {name:'Closed 24hrs', value:'-1'},
        {name:'Midnight', value:'0'},
        {name:'6:00 am', value:'600'},
        {name:'7:00 am', value:'700'},
        {name:'7:30 am', value:'730'},
        {name:'7:45 am', value:'745'},
        {name:'8:00 am', value:'800'},
        {name:'9:00 am', value:'900'},
        {name:'10:00 am', value:'1000'},
        {name:'11:00 am', value:'1100'},
        {name:'Noon', value:'1200'},
        {name:'1:00 pm', value:'1300'}
    ])
    .constant('HOURS_TO', [
        {name:'1:00 am', value:'100'},
        {name:'2:00 am', value:'200'},
        {name:'3:00 am', value:'300'},
        {name:'8:00 am', value:'800'},
        {name:'9:00 am', value:'900'},
        {name:'10:00 am', value:'1000'},
        {name:'11:00 am', value:'1100'},
        {name:'Noon', value:'1200'},
        {name:'1:00 pm', value:'1300'},
        {name:'2:00 pm', value:'1400'},
        {name:'3:00 pm', value:'1500'},
        {name:'4:00 pm', value:'1600'},
        {name:'4:30 pm', value:'1630'},
        {name:'4:45 pm', value:'1645'},
        {name:'5:00 pm', value:'1700'},
        {name:'5:30 pm', value:'1730'},
        {name:'6:00 pm', value:'1800'},
        {name:'7:00 pm', value:'1900'},
        {name:'8:00 pm', value:'2000'},
        {name:'9:00 pm', value:'2100'},
        {name:'10:00 pm', value:'2200'},
        {name:'11:00 pm', value:'2300'},
        {name:'Midnight', value:'2400'}
    ])
    .constant('DP_FORMAT', 'MM/dd/yyyy')

    .controller('manageHrsCtrl', ['$scope', '$animate', 'tokenFactory', 'hmFactory', 'HOURS_FROM', 'HOURS_TO', 'DP_FORMAT',
        function manageHrsCtrl($scope, $animate, tokenFactory, hmFactory, hoursFrom, hoursTo, dpFormat){
            $scope.allowedLibraries = [];
            $scope.format = dpFormat;
            $scope.hrsFrom = hoursFrom;
            $scope.hrsTo = hoursTo;
            $scope.selLib = {};

            tokenFactory("CSRF-libHours");

            $scope.initSemesters = function(semesters){
                for (var sem = 0; sem < semesters.length; sem++){
                    semesters[sem].startdate = new Date(semesters[sem].startdate);
                    semesters[sem].enddate = new Date(semesters[sem].enddate);
                    semesters[sem].dp = false;
                }
                return semesters;
            };

            hmFactory.getData("semesters")
                .success(function(data) {
                    console.dir(data);
                    $scope.selLib = data.libraries[0];
                    for (var lib = 0; lib < data.libraries.length; lib++){
                        for (var ex = 0; ex < data.exc[lib].length; ex++){
                            data.exc[lib][ex].datems = new Date(data.exc[lib][ex].date * 1000);
                            data.exc[lib][ex].dp = false;
                        }
                        data.sem[lib] = $scope.initSemesters(data.sem[lib]);
                    }
                    $scope.allowedLibraries = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.tabs = [
                { name: 'Semesters',
                    number: 0,
                    active: true
                },
                { name: 'Exceptions',
                    number: 1,
                    active: false
                }];
    }])

    .directive('manageHours', function($animate) {
        return {
            restrict: 'A',
            scope: {},
            controller: 'manageHrsCtrl',
            link: function(scope, elm, attrs){
                //Preload the spinner element
                var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');
                //Preload the location of the boxe's title element (needs to be more dynamic in the future)
                var titleElm = elm.find('h2');
                //Enter the spinner animation, appending it to the title element
                $animate.enter(spinner, titleElm[0]);

                var loadingWatcher = scope.$watch(
                    'allowedLibraries',
                    function(newVal, oldVal){
                        if (scope.allowedLibraries.totalTime > 0){
                            $animate.leave(spinner);
                            console.log("Hours loaded");
                        }
                    },
                    true
                );
            },
            templateUrl: 'manageHours/manageHours.tpl.html'
        };
    })

    .controller('semListCtrl', ['$scope', 'hmFactory', function semListCtrl($scope, hmFactory) {
        $scope.expSem = -1;
        $scope.weekHrs = [];
        $scope.loading = false;
        $scope.newSemester = {};
        $scope.newSemester.dp = false;
        $scope.newSemester.dow = [];

        for (var day = 0; day < 7; day++) {
            $scope.newSemester.dow[day] = {};
            $scope.newSemester.dow[day].from = -1;
            $scope.newSemester.dow[day].to = 0;
        }

        $scope.onSemFocus = function($event, index){
            $event.preventDefault();
            $event.stopPropagation();
            if (typeof index != 'undefined' && index >= 0)
                $scope.allowedLibraries.sem[$scope.selLib.index][index].dp = true;
            else
                $scope.newSemester.dp = true;
        };

        $scope.expandSem = function($event, semester){
            if ($scope.expSem !== semester.dsid) {
                $scope.result = "";
                $scope.resultDel = "";
                for (var i = 0; i < 7; i++) {
                    var len = $scope.hrsFrom.length;
                    $scope.weekHrs[i] = {};
                    $scope.weekHrs[i].from = $scope.hrsFrom[0];
                    $scope.weekHrs[i].to = $scope.hrsTo[0];
                    for (var j = 0; j < len; j++) {
                        if ($scope.hrsFrom[j].value == semester.dow[i].from) {
                            $scope.weekHrs[i].from = $scope.hrsFrom[j];
                        }
                        if ($scope.hrsTo[j].value == semester.dow[i].to) {
                            $scope.weekHrs[i].to = $scope.hrsTo[j];
                        }
                    }
                }
            } else {
                $event.preventDefault();
                $event.stopPropagation();
            }
            $scope.expSem = semester.dsid;
        };
        $scope.isExpSem = function(semID){
            if ($scope.expSem === semID)
                return true;
            return false;
        };

        $scope.saveChanges = function(semester){
            semester.lid = $scope.selLib.lid;
            semester.libName = $scope.selLib.name;
            $scope.loading = true;
            hmFactory.postData({action : 1}, semester)
                .success(function(data) {
                    if ((typeof data === 'object') && (data !== null)){
                        $scope.result = "Semester updated";
                        $scope.allowedLibraries.sem[$scope.selLib.index] = $scope.initSemesters(data);
                    } else
                        $scope.result = "Error! Could not save data!";
                    $scope.loading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.loading = false;
                });
        };
        $scope.deleteSem = function(semester, index){
            if (confirm("Are you sure you want to delete " + semester.name + " semester?")){
                $scope.loading = true;
                semester.lid = $scope.selLib.lid;
                semester.libName = $scope.selLib.name;
                hmFactory.postData({action : 3}, semester)
                    .success(function(data) {
                        if ((typeof data === 'object') && (data !== null)){
                            $scope.result = "Semester deleted";
                            $scope.allowedLibraries.sem[$scope.selLib.index] = $scope.initSemesters(data);
                        } else
                            $scope.result = "Error! Could not delete semester!";
                        $scope.loading = false;
                    })
                    .error(function(data, status, headers, config) {
                        $scope.loading = false;
                    });
            }
        };
        $scope.createSem = function(){
            $scope.loading = true;
            $scope.newSemester.lid = $scope.selLib.lid;
            $scope.newSemester.libName = $scope.selLib.name;
            hmFactory.postData({action : 2}, $scope.newSemester)
                .success(function(data) {
                    if ((typeof data === 'object') && (data !== null)){
                        $scope.result = "Semester created";
                        $scope.allowedLibraries.sem[$scope.selLib.index] = $scope.initSemesters(data);
                    }else
                        $scope.result = "Error! Could not create semester!";
                    $scope.loading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.loading = false;
                });
        };
    }])

    .directive('semesterList', function() {
        return {
            require: '^manageHours',
            restrict: 'A',
            controller: 'semListCtrl',
            templateUrl: 'manageHours/manageSem.tpl.html'
        };
    })

    .controller('exListCtrl', ['$scope', 'hmFactory', function exListCtrl($scope, hmFactory) {
        $scope.newException = {};
        $scope.newException.from = -1;
        $scope.newException.to = 0;
        $scope.newException.dp = false;
        $scope.newException.isGlobal = false;
        $scope.expExc = -1;

        $scope.onExcFocus = function($event, index){
            $event.preventDefault();
            $event.stopPropagation();
            if (typeof index != 'undefined' && index >= 0)
                $scope.allowedLibraries.exc[$scope.selLib.index][index].dp = true;
            else
                $scope.newException.dp = true;
        };
        $scope.expandExc = function($event, exception){
            if ($scope.expExc != exception.id){
                $scope.result = "";
                $scope.resultDel = "";
            } else {
                $event.preventDefault();
                $event.stopPropagation();
            }
            $scope.expExc = exception.id;
        };
        $scope.isExpExc = function(excID){
            if ($scope.expExc === excID)
                return true;
            return false;
        };
        $scope.updateExc = function(exception){
            $scope.loading = true;
            exception.lid = $scope.selLib.lid;
            hmFactory.postData({action : 4}, exception)
                .success(function(data) {
                    if ( data == 1){
                        $scope.result = "Saved";
                    } else
                        $scope.result = "Error! Could not update exception!";
                    $scope.loading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.loading = false;
                });
        };

        $scope.deleteExc = function(exception, index){
            if (confirm("Are you sure you want to delete " + exception.desc + " exception?")){
                $scope.loading = true;
                exception.lid = $scope.selLib.lid;
                hmFactory.postData({action : 5}, exception)
                    .success(function(data) {
                        if ( data == 1){
                            $scope.allowedLibraries.exc[$scope.selLib.index].splice(index, 1);
                            $scope.expExc = -1;
                        } else
                            $scope.result = "Error! Could not delete exception!";
                        $scope.loading = false;
                    })
                    .error(function(data, status, headers, config) {
                        $scope.loading = false;
                    });
            }
        };

        $scope.createExc = function(){
            $scope.loading = true;
            $scope.newException.lid = $scope.selLib.lid;
            hmFactory.postData({action : 6}, $scope.newException)
                .success(function(data) {
                    if ((typeof data === 'object') && (data !== null)){
                        var i = 0;
                        for (i = 0; i < data.length; i++){
                            var newExc = {};
                            newExc.id = data[i].id;
                            newExc.datems = $scope.newException.datems;
                            newExc.days = $scope.newException.days;
                            newExc.desc = $scope.newException.desc;
                            newExc.from = $scope.newException.from;
                            newExc.to = $scope.newException.to;
                            newExc.dp = false;
                            var l = 0;
                            for (l = 0; l < $scope.allowedLibraries.libraries.length; l++)
                                if ($scope.allowedLibraries.libraries[l].lid === data[i].lid)
                                    break;
                            $scope.allowedLibraries.exc[$scope.allowedLibraries.libraries[l].index].push(newExc);
                        }
                        $scope.result = "Created exceptions count: " + i;
                    }else
                        $scope.result = "Error! Could not create an exception!";
                    $scope.loading = false;
                    console.log(data);
                })
                .error(function(data, status, headers, config) {
                    $scope.loading = false;
                });
        };

        $scope.deleteOldExc = function(){
            $scope.loading = true;
            hmFactory.postData({action : 7}, $scope.selLib)
                .success(function(data) {
                    if ((typeof data === 'object') && (data !== null)){
                        $scope.expExc = -1;
                        for (var ex = 0; ex < data.length; ex++){
                            data[ex].datems = new Date(data[ex].date * 1000);
                            data[ex].dp = false;
                        }
                        $scope.allowedLibraries.exc[$scope.selLib.index] = data;
                        $scope.resultDel = "Outdated exceptions deleted";
                    } else
                        $scope.resultDel = "Error! Could not delete exceptions!";
                    $scope.loading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.loading = false;
                });
        };
    }])
    .directive('exceptionList', function($timeout) {
        return {
            require: '^manageHours',
            restrict: 'A',
            controller: 'exListCtrl',
            link: function(scope, elem, attrs) {

            },
            templateUrl: 'manageHours/manageEx.tpl.html'
        };
    })

angular.module('manage.manageHoursUsers', [])
    .controller('manageHrsUsersCtrl', ['$scope', '$window', '$animate', 'tokenFactory', 'hmFactory',
        function manageHrsUsersCtrl($scope, $window, $animate, tokenFactory, hmFactory){
            $scope.isLoading = true;
            $scope.dataUL = {};
            $scope.dataUL.users = [];
            $scope.dataUL.locations = [];
            $scope.user = {};
            $scope.user.name = $window.userName;

            tokenFactory("CSRF-libHours");

            hmFactory.getData("users")
                .success(function(data){
                    $scope.dataUL = data;
                    $scope.isLoading = false;
                    console.dir(data);
                })
                .error(function(data, status, headers, config) {
                    $scope.isLoading = false;
                });

            $scope.tabs = [
                { name: 'Users',
                    number: 0,
                    active: true
                },
                { name: 'Locations',
                    number: 1,
                    active: false
                }];
    }])

    .controller('hrsUserListCtrl', ['$scope', '$window', 'hmFactory', function hrsUserListCtrl($scope, $window, hmFactory) {
        $scope.expUser = -1;
        $scope.expUserIndex = -1;
        $scope.users = $window.users;
        $scope.newUser = $scope.users[0];
        $scope.newUserAdmin = false;
        $scope.newUserAccess = [false, false, false, false, false, false, false, false, false, false, false, false];

        $scope.expandUser = function(user){
            if ($scope.expUser != user.uid){
                for (var i = 0; i < $scope.dataUL.users.length; i++)
                    if ($scope.dataUL.users[i].uid == user.uid){
                        $scope.expUserIndex = i;
                        break;
                    }
            }
            $scope.result = "";
            $scope.result2 = "";
            $scope.expUser = user.uid;
        };
        $scope.isExpUser = function(uID){
            if ($scope.expUser === uID)
                return true;
            return false;
        };

        $scope.updateUser = function(user){
            $scope.isLoading = true;
            user.locations = $scope.dataUL.locations;
            hmFactory.postData({action : 8}, user)
                .success(function(data) {
                    if (data == 1){
                        $scope.result = "Saved";
                    } else
                        $scope.result = "Error! Could not save data!";
                    $scope.isLoading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.result = "Error! Could not save data!";
                    $scope.isLoading = false;
                });
        };

        $scope.createUser = function(user){
            $scope.isLoading = true;
            user.admin = $scope.newUserAdmin;
            user.access = $scope.newUserAccess;
            user.locations = $scope.dataUL.locations;
            hmFactory.postData({action : 9}, user)
                .success(function(data) {
                    if ((typeof data === 'object') && (data !== null)){
                        $scope.result2 = "Access granted!";
                        var createdUser = {};
                        createdUser.name = user.login;
                        createdUser.uid = data.uid;
                        createdUser.role = user.admin;
                        createdUser.access = [];
                        for (var i = 0; i < user.access.length; i++)
                            if (user.access[i])
                                createdUser.access[i] = true;
                            else
                                createdUser.access[i] = false;
                        $scope.dataUL.users.push(createdUser);
                        $scope.expandUser(createdUser);
                    }else
                        $scope.result2 = "Error! Could not grant access!";
                    $scope.isLoading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.isLoading = false;
                    $scope.result2 = "Error! Could not grant access!";
                });
        };

        $scope.deleteUser = function(user, index){
            if (confirm("Are you sure you want to remove access for " + user.name + "?")){
                $scope.isLoading = true;
                hmFactory.postData({action : 10}, user)
                    .success(function(data) {
                        if (data == 1){
                            $scope.result = "User access deleted!";
                            $scope.dataUL.users.splice(index, 1);
                        } else
                            $scope.result = "Error! Could not delete user access!" + data;
                        $scope.isLoading = false;
                    })
                    .error(function(data, status, headers, config) {
                        $scope.result = "Error! Could not delete user access!";
                        $scope.isLoading = false;
                    });
            }
        };

    }])
    .directive('hoursUserList', function() {
        return {
            restrict: 'AC',
            controller: 'hrsUserListCtrl',
            templateUrl: 'manageHours/manageUsers.tpl.html'
        };
    })

    .controller('hrsLocationsCtrl', ['$scope', 'hmFactory', function hrsUserListCtrl($scope, hmFactory) {
        $scope.newLocation = "";
        $scope.newParent = $scope.dataUL.locations[0];

        $scope.createLoc = function(loc, par){
            if (loc.length < 3){
                alert("Library name is too short!");
                return false;
            }
            $scope.isLoading = true;
            var newLoc = {};
            newLoc.name = loc;
            if (typeof par === 'undefined')
                newLoc.parent = "0";
            else
            if (par === null)
                newLoc.parent = "0";
            else
            if (par.lid > 0)
                newLoc.parent = par.lid;
            else
                newLoc.parent = "0";
            hmFactory.postData({action : 11}, newLoc)
                .success(function(data) {
                    if ((typeof data === 'object') && (data !== null)){
                        newLoc.lid = data.lid;
                        $scope.dataUL.locations.push(newLoc);
                        $scope.result2 = "Location created!";
                    }else
                        $scope.result2 = "Error! Could not create location!";
                    $scope.isLoading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.isLoading = false;
                    $scope.result2 = "Error! Could not create location!";
                });
        };
    }])
    .directive('hoursLocationList', function() {
        return {
            restrict: 'AC',
            controller: 'hrsLocationsCtrl',
            templateUrl: 'manageHours/manageLoc.tpl.html'
        };
    })

angular.module('manage.manageNews', ['ngFileUpload'])
    .controller('manageNewsCtrl', ['$scope', '$window', '$timeout', 'tokenFactory', 'newsFactory',
        function manageNewsCtrl($scope, $window, $timeout, tokenFactory, newsFactory){
            $scope.data = {};
            $scope.dpFormat = 'MM/dd/yyyy';
            $scope.newNews = {};
            $scope.newNews.creator = $window.author;
            $scope.newExh = {};
            $scope.newExh.creator = $window.author;
            $scope.sortModes = [
                {by:'title', reverse:false},
                {by:'activeFrom', reverse:false},
                {by:'activeUntil', reverse:false}
            ];

            tokenFactory("CSRF-libNews");

            newsFactory.getData("all")
                .success(function(data) {
                    console.dir(data);
                    for (var i = 0; i < data.news.length; i++){
                        data.news[i].activeFrom = new Date(data.news[i].activeFrom * 1000);
                        data.news[i].activeUntil = new Date(data.news[i].activeUntil * 1000);
                        for (var j = 0; j < data.people.length; j++)
                            if (data.news[i].contactID.uid === data.people[j].uid){
                                data.news[i].contactID = data.people[j];
                                break;
                            }
                        data.news[i].show = false;
                        data.news[i].class = "";
                        data.news[i].dpFrom = false;
                        data.news[i].dpUntil = false;
                    }
                    for (var i = 0; i < data.exhibitions.length; i++){
                        data.exhibitions[i].activeFrom = new Date(data.exhibitions[i].activeFrom * 1000);
                        data.exhibitions[i].activeUntil = new Date(data.exhibitions[i].activeUntil * 1000);
                        for (var j = 0; j < data.people.length; j++)
                            if (data.exhibitions[i].contactID.uid === data.people[j].uid){
                                data.exhibitions[i].contactID = data.people[j];
                                break;
                            }
                        data.exhibitions[i].show = false;
                        data.exhibitions[i].class = "";
                        data.exhibitions[i].dpFrom = false;
                        data.exhibitions[i].dpUntil = false;
                    }
                    $scope.newNews.contactID = data.people[0];
                    $scope.newExh.contactID = data.people[0];
                    $scope.data = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.tabs = [
                { name: 'News',
                    number: 0,
                    active: true
                },
                { name: 'Exhibitions',
                    number: 1,
                    active: false
                }];
            
            $scope.validateNews = function(news){
                if (news.title.length < 1)
                    return "Form error: Please fill out Title!";
                if (news.description.length < 1)
                    return "Form error: Please fill out Description!";

                return "";
            };
            $scope.generateThumb = function(file) {
                if (file != null) {
                    if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                        $timeout(function() {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(file);
                            fileReader.onload = function(e) {
                                $timeout(function() {
                                    file.dataUrl = e.target.result;
                                });
                            }
                        });
                    }
                }
            };
        }])

    .directive('newsExhibitionsMain', function($animate) {
        return {
            restrict: 'A',
            scope: {},
            controller: 'manageNewsCtrl',
            link: function(scope, elm, attrs){
                //Preload the spinner element
                var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');
                //Preload the location of the boxe's title element (needs to be more dynamic in the future)
                var titleElm = elm.find('h2');
                //Enter the spinner animation, appending it to the title element
                $animate.enter(spinner, titleElm[0]);

                var loadingWatcher = scope.$watch(
                    'data.totalTime',
                    function(newVal, oldVal){
                        if (newVal != oldVal){
                            $animate.leave(spinner);
                            console.log("News data loaded");
                        }
                    },
                    true
                );
            },
            templateUrl: 'manageNews/manageNews.tpl.html'
        };
    })

    .controller('manageNewsListCtrl', ['$scope', '$timeout', 'Upload', 'newsFactory', 'NEWS_URL',
        function manageNewsListCtrl($scope, $timeout, Upload, newsFactory, appURL){
            $scope.titleFilter = '';
            $scope.descrFilter = '';
            $scope.sortMode = 0;
            $scope.sortButton = $scope.sortMode;
            $scope.mOver = 0;
            $scope.appURL = appURL;

            $scope.newNews.type = 0; // news
            $scope.newNews.activeFrom = new Date();
            $scope.newNews.activeUntil = new Date();
            $scope.newNews.dpFrom = false;
            $scope.newNews.dpUntil = false;

            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

            $scope.onNewsDPFocusFrom = function($event, index){
                $event.preventDefault();
                $event.stopPropagation();
                if (typeof index != 'undefined' && index >= 0)
                    $scope.data.news[index].dpFrom = true;
                else
                    $scope.newNews.dpFrom = true;
            };
            $scope.onNewsDPFocusUntil = function($event, index){
                $event.preventDefault();
                $event.stopPropagation();
                if (typeof index != 'undefined' && index >= 0)
                    $scope.data.news[index].dpUntil = true;
                else
                    $scope.newNews.dpUntil = true;
            };

            $scope.toggleNews = function(news){
                $scope.data.news[$scope.data.news.indexOf(news)].show =
                    !$scope.data.news[$scope.data.news.indexOf(news)].show;
            };
            $scope.setOver = function(news){
                $scope.mOver = news.nid;
            };
            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
            };

            $scope.deleteNews = function(news){
                if (confirm("Delete " + news.title  + " permanently?") == true){
                    newsFactory.postData({action : 1}, news)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.data.news.splice($scope.data.news.indexOf(news), 1);
                                $scope.formResponse = "News item has been deleted.";
                            } else {
                                $scope.formResponse = "Error: Can not delete news item! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.formResponse = "Error: Could not delete news item! " + data;
                            console.log(data);
                        });
                }
            };
            $scope.updateNews = function(news){
                $scope.data.news[$scope.data.news.indexOf(news)].formResponse = $scope.validateNews(news);
                if ($scope.data.news[$scope.data.news.indexOf(news)].formResponse.length > 0)
                    return false;
                news.tsFrom = news.activeFrom.valueOf() / 1000;
                news.tsUntil = news.activeUntil.valueOf() / 1000;
                if (typeof news.picFile === 'undefined'){
                    newsFactory.postData({action : 21}, news)
                        .success(function(data, status, headers, config) {
                            if ((typeof data === 'object') && (data !== null)){
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                    "News has been updated, Icon has not changed.";
                            } else {
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                    "Error: Can not update news! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                "Error: Could not update news! " + data;
                            console.log(data);
                        });
                } else {
                    news.picFile.upload = Upload.upload({
                        url: appURL + 'processData.php?action=2',
                        method: 'POST',
                        fields: {
                            news: news
                        },
                        file: news.picFile,
                        fileFormDataName: 'editNewsExh' + news.nid
                    });
                    news.picFile.upload.then(function(response) {
                        $timeout(function() {
                            if ((typeof response.data === 'object') && (response.data !== null)){
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse = "News has been updated, ";
                                if (response.data.iconUploaded)
                                    $scope.data.news[$scope.data.news.indexOf(news)].formResponse += "Icon uploaded.";
                                else
                                    $scope.data.news[$scope.data.news.indexOf(news)].formResponse += "Icon has not changed.";
                            } else {
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse = 
                                    "Error: Can not update news! " + response.data;
                            }
                            console.log(response.data);
                        });
                    }, function(response) {
                        if (response.status > 0)
                            $scope.data.news[$scope.data.news.indexOf(news)].formResponse = response.status + ': ' + response.data;
                    });
                    news.picFile.upload.progress(function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        news.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            };
            $scope.createNews = function(){
                if (typeof $scope.newNews.picFile === 'undefined'){
                    $scope.newNews.formResponse = "Please select icon file (.png)!";
                    return false;
                }
                $scope.newNews.formResponse = $scope.validateNews($scope.newNews);
                if ($scope.newNews.formResponse.length > 0)
                    return false;
                $scope.newNews.tsFrom = $scope.newNews.activeFrom.valueOf() / 1000;
                $scope.newNews.tsUntil = $scope.newNews.activeUntil.valueOf() / 1000;
                $scope.newNews.picFile.upload = Upload.upload({
                    url: appURL + 'processData.php?action=3',
                    method: 'POST',
                    fields: {
                        news: $scope.newNews
                    },
                    file: $scope.newNews.picFile,
                    fileFormDataName: 'addNewsExh'
                });
                $scope.newNews.picFile.upload.then(function(response) {
                    $timeout(function() {
                        if ((typeof response.data === 'object') && (response.data !== null)){
                            var newNews = {};
                            newNews.nid = response.data.id;
                            newNews.title = $scope.newNews.title;
                            newNews.description = $scope.newNews.description;
                            newNews.show = false;
                            newNews.class = "";
                            $scope.data.news.push(newNews);
                            $scope.newNews.formResponse = "News has been added.";
                        } else {
                            $scope.newNews.formResponse = "Error: Can not add news! " + response.data;
                        }
                        console.dir(response.data);
                    });
                }, function(response) {
                    if (response.status > 0)
                        $scope.newNews.formResponse = response.status + ': ' + response.data;
                });
                $scope.newNews.picFile.upload.progress(function(evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    $scope.newNews.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            };
        }])

    .directive('manageNewsList', function() {
        return {
            restrict: 'A',
            controller: 'manageNewsListCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageNews/manageNewsList.tpl.html'
        };
    })
    .filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            if (typeof input == 'undefined')
                return input;
            return input.slice(start);
        }
    })
    .controller('manageExhListCtrl', ['$scope', '$timeout', 'Upload', 'newsFactory', 'NEWS_URL',
        function manageExhListCtrl($scope, $timeout, Upload, newsFactory, appURL){
            $scope.titleFilter = '';
            $scope.descrFilter = '';
            $scope.sortMode = 0;
            $scope.sortButton = $scope.sortMode;
            $scope.mOver = 0;
            $scope.appURL = appURL;

            $scope.newExh.type = 1;//exhibition
            $scope.newExh.activeFrom = new Date();
            $scope.newExh.activeUntil = new Date();
            $scope.newExh.dpFrom = false;
            $scope.newExh.dpUntil = false;

            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

            $scope.onExhDPFocusFrom = function($event, index){
                $event.preventDefault();
                $event.stopPropagation();
                if (typeof index != 'undefined' && index >= 0)
                    $scope.data.exhibitions[index].dpFrom = true;
                else
                    $scope.newExh.dpFrom = true;
            };
            $scope.onExhDPFocusUntil = function($event, index){
                $event.preventDefault();
                $event.stopPropagation();
                if (typeof index != 'undefined' && index >= 0)
                    $scope.data.exhibitions[index].dpUntil = true;
                else
                    $scope.newExh.dpUntil = true;
            };

            $scope.toggleExhibitions = function(exh){
                $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].show =
                    !$scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].show;
            };
            $scope.setOver = function(exh){
                $scope.mOver = exh.nid;
            };
            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
            };

            $scope.deleteExhibition = function(exh){
                if (confirm("Delete " + exh.title  + " permanently?") == true){
                    newsFactory.postData({action : 1}, exh)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.data.exhibitions.splice($scope.data.exhibitions.indexOf(exh), 1);
                                $scope.formResponse = "Exhibition item has been deleted.";
                            } else {
                                $scope.formResponse = "Error: Can not delete exhibition item! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.formResponse = "Error: Could not delete Exhibition item! " + data;
                            console.log(data);
                        });
                }
            };
            $scope.updateExhibition = function(exh){
                $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse = $scope.validateNews(exh);
                if ($scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse.length > 0)
                    return false;
                exh.tsFrom = exh.activeFrom.valueOf() / 1000;
                exh.tsUntil = exh.activeUntil.valueOf() / 1000;
                if (typeof exh.picFile === 'undefined'){
                    newsFactory.postData({action : 21}, exh)
                        .success(function(data, status, headers, config) {
                            if ((typeof data === 'object') && (data !== null)){
                                $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse =
                                    "Exhibition has been updated, Icon has not changed.";
                            } else {
                                $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse =
                                    "Error: Can not update Exhibition! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse =
                                "Error: Could not update Exhibition! " + data;
                            console.log(data);
                        });
                } else {
                    exh.picFile.upload = Upload.upload({
                        url: appURL + 'processData.php?action=2',
                        method: 'POST',
                        fields: {
                            news: exh
                        },
                        file: exh.picFile,
                        fileFormDataName: 'editNewsExh' + exh.nid
                    });
                    exh.picFile.upload.then(function(response) {
                        $timeout(function() {
                            if ((typeof response.data === 'object') && (response.data !== null)){
                                $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse = "Exhibition has been updated, ";
                                if (response.data.iconUploaded)
                                    $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse += "Icon uploaded.";
                                else
                                    $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse += "Icon has not changed.";
                            } else {
                                $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse =
                                    "Error: Can not update Exhibition! " + response.data;
                            }
                            console.log(response.data);
                        });
                    }, function(response) {
                        if (response.status > 0)
                            $scope.data.exhibitions[$scope.data.exhibitions.indexOf(exh)].formResponse = response.status + ': ' + response.data;
                    });
                    exh.picFile.upload.progress(function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        exh.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            };
            $scope.createExhibition = function(){
                if (typeof $scope.newExh.picFile === 'undefined'){
                    $scope.newExh.formResponse = "Please select icon file (.png)!";
                    return false;
                }
                $scope.newExh.formResponse = $scope.validateNews($scope.newExh);
                if ($scope.newExh.formResponse.length > 0)
                    return false;
                $scope.newExh.tsFrom = $scope.newExh.activeFrom.valueOf() / 1000;
                $scope.newExh.tsUntil = $scope.newExh.activeUntil.valueOf() / 1000;
                $scope.newExh.picFile.upload = Upload.upload({
                    url: appURL + 'processData.php?action=3',
                    method: 'POST',
                    fields: {
                        news: $scope.newExh
                    },
                    file: $scope.newExh.picFile,
                    fileFormDataName: 'addNewsExh'
                });
                $scope.newExh.picFile.upload.then(function(response) {
                    $timeout(function() {
                        if ((typeof response.data === 'object') && (response.data !== null)){
                            var newExh = {};
                            newExh.nid = response.data.id;
                            newExh.title = $scope.newExh.title;
                            newExh.description = $scope.newExh.description;
                            newExh.show = false;
                            newExh.class = "";
                            $scope.data.exhibitions.push(newExh);
                            $scope.newExh.formResponse = "Exhibition has been added.";
                        } else {
                            $scope.newExh.formResponse = "Error: Can not add Exhibition! " + response.data;
                        }
                        console.dir(response.data);
                    });
                }, function(response) {
                    if (response.status > 0)
                        $scope.newExh.formResponse = response.status + ': ' + response.data;
                });
                $scope.newExh.picFile.upload.progress(function(evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    $scope.newExh.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            };
        }])
    .directive('manageExhibitionsList', function() {
        return {
            restrict: 'A',
            controller: 'manageExhListCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageNews/manageExhibitionsList.tpl.html'
        };
    })

    .controller('viewNEECtrl', ['$scope', '$timeout', 'newsFactory',
        function viewNEECtrl($scope, $timeout, newsFactory){
            $scope.data = {};

            newsFactory.getData("today")
                .success(function(data) {
                    console.dir(data);
                    $scope.data = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            //events will be pulled from XML feed
            //http://events.ua.edu/category/22/feed

        }])
    .directive('viewNewsEventsExhibitions', function() {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'viewNEECtrl',
            link: function(scope, elm, attrs){
                //Preload the spinner element
                var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');
                //Preload the location of the boxe's title element (needs to be more dynamic in the future)
                var titleElm = elm.find('h2');
                //Enter the spinner animation, appending it to the title element
                $animate.enter(spinner, titleElm[0]);

                var loadingWatcher = scope.$watch(
                    'data.totalTime',
                    function(newVal, oldVal){
                        if (newVal != oldVal){
                            $animate.leave(spinner);
                            console.log("News data loaded");
                        }
                    },
                    true
                );
            },
            templateUrl: 'manageNews/viewNewsEventsExhibitions.tpl.html'
        };
    })

angular.module('manage.manageOneSearch', [])
    .controller('manageOneSearchCtrl', ['$scope', 'tokenFactory', 'osFactory',
        function manageOneSearchCtrl($scope, tokenFactory, osFactory){
            $scope.recList = [];
            $scope.addRec = {};
            $scope.addRec.keyword = "";
            $scope.addRec.link = "";
            $scope.addRec.title = "";
            $scope.response = "";
            $scope.filterKeyword = '';
            $scope.filterLink = '';
            $scope.filterLinkTitle = '';

            tokenFactory("CSRF-libOneSearch");

            osFactory.getData()
                .success(function(data) {
                    console.dir(data);
                    $scope.recList = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.addRecommendation = function(){
                if ( ($scope.addRec.keyword.length > 0) && ($scope.addRec.link.length > 0) && ($scope.addRec.title.length > 0) )
                {
                    osFactory.postData({addRec : 1}, $scope.addRec)
                        .success(function(data, status, headers, config) {
                            console.dir(data);
                            if ((typeof data === 'object') && (data !== null)){
                                var newRec = {};
                                newRec.id = data.rid;
                                newRec.linkid = data.lid;
                                newRec.keyword = $scope.addRec.keyword;
                                newRec.link = $scope.addRec.link;
                                newRec.description = $scope.addRec.title;
                                $scope.recList.RecList.push(newRec);
                                $scope.response = data.text;
                            } else
                                $scope.response = data;
                        })
                        .error(function(data, status, headers, config) {
                            $scope.response = "Error: Could not add recommendation link! " + data;
                        });
                }
            };
            $scope.deleteRec = function(rec, index){
                if (confirm("Are you sure you want to delete " + rec.description + " link?")){
                    osFactory.postData({delRec : 1}, rec)
                        .success(function(data, status, headers, config) {
                            $scope.response = data;
                            $scope.recList.RecList.splice(index, 1);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.response = "Error: Could not delete recommendation! " + data;
                        });
                }
            };
        }])
    .directive('recommendeLinksList', function() {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'manageOneSearchCtrl',
            templateUrl: 'manageOneSearch/manageOneSearch.tpl.html'
        };
    })
angular.module('manage.manageSoftware', ['ngFileUpload'])
    .controller('manageSWCtrl', ['$scope', 'tokenFactory', 'swFactory',
        function manageSWCtrl($scope, tokenFactory, swFactory){
            $scope.SWList = {};
            $scope.newSW = {};
            $scope.os = [
                {name:'MS Windows', value:1},
                {name:'Apple Mac', value:2}
            ];

            tokenFactory("CSRF-libSoftware");

            swFactory.getData()
                .success(function(data) {
                    console.dir(data);
                    for (var i = 0; i < data.software.length; i++){
                        data.software[i].show = false;
                        data.software[i].class = "";
                        data.software[i].selCat = data.categories[0];
                        data.software[i].newVer = {};
                        data.software[i].newVer.selOS = $scope.os[0];
                        for (var j = 0; j < data.software[i].versions.length; j++){
                            data.software[i].versions[j].newLoc = {};
                            data.software[i].versions[j].newLoc.selLoc = data.locations[0];
                            data.software[i].versions[j].newLoc.devices = [];
                            for (var k = 0; k < data.devices.length; k++)
                                data.software[i].versions[j].newLoc.devices[k] = false;
                        }
                        data.software[i].newLink = {};
                    }
                    $scope.newSW.selCat = data.categories[0];
                    $scope.SWList = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.tabs = [
                { name: 'Software List',
                    number: 0,
                    active: true
                },
                { name: 'Locations and Categories',
                    number: 1,
                    active: false
                }];
        }])

    .directive('manageSoftwareMain', function($animate) {
        return {
            restrict: 'A',
            scope: {},
            controller: 'manageSWCtrl',
            link: function(scope, elm, attrs){
                //Preload the spinner element
                var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');
                //Preload the location of the boxe's title element (needs to be more dynamic in the future)
                var titleElm = elm.find('h2');
                //Enter the spinner animation, appending it to the title element
                $animate.enter(spinner, titleElm[0]);

                var loadingWatcher = scope.$watch(
                    'SWList.totalTime',
                    function(newVal, oldVal){
                        if (newVal != oldVal){
                            $animate.leave(spinner);
                            console.log("Software loaded");
                        }
                    },
                    true
                );
            },
            templateUrl: 'manageSoftware/manageSoftware.tpl.html'
        };
    })

    .controller('manageSWListCtrl', ['$scope', '$timeout', 'Upload', 'swFactory', 'SOFTWARE_URL',
        function manageSWListCtrl($scope, $timeout, Upload, swFactory, appURL){
            $scope.titleFilter = '';
            $scope.descrFilter = '';
            $scope.sortMode = 0;
            $scope.sortModes = [
                {by:'title', reverse:false},
                {by:'location', reverse:false}
            ];
            $scope.sortButton = $scope.sortMode;
            $scope.mOver = 0;
            $scope.appURL = appURL;

            $scope.newSW.versions = [];
            $scope.newSW.links = [];
            $scope.newSW.categories = [];
            $scope.newSW.newVer = {};
            $scope.newSW.newVer.selOS = $scope.os[0];
            $scope.newSW.newLink = {};
            $scope.newSW.details = '';

            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

            $scope.startTitle = function(actual, expected){
                if (!expected)
                    return true;
                if (actual.toLowerCase().indexOf(expected.toLowerCase()) == 0)
                    return true;
                return false;
            };
            $scope.toggleSW = function(sw){
                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].show =
                    !$scope.SWList.software[$scope.SWList.software.indexOf(sw)].show;
            };
            $scope.setOver = function(sw){
                $scope.mOver = sw.sid;
            };
            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
            };

            $scope.deleteSW = function(sw){
                if (confirm("Delete " + sw.title  + " permanently?") == true){
                    swFactory.postData({action : 1}, sw)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.SWList.software.splice($scope.SWList.software.indexOf(sw), 1);
                                $scope.formResponse = "Software has been deleted.";
                            } else {
                                $scope.formResponse = "Error: Can not delete software! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.formResponse = "Error: Could not delete software! " + data;
                            console.log(data);
                        });
                }
            };
            $scope.updateSW = function(sw){
                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse = $scope.validateSW(sw);
                if ($scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse.length > 0)
                    return false;
                console.dir(sw);
                if (typeof sw.picFile === 'undefined'){
                    swFactory.postData({action : 21}, sw)
                        .success(function(data, status, headers, config) {
                            if ((typeof data === 'object') && (data !== null)){
                                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse =
                                    "Software has been updated, Icon has not changed.";
                            } else {
                                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse =
                                    "Error: Can not update software! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse =
                                "Error: Could not delete software! " + data;
                            console.log(data);
                        });
                } else {
                    sw.picFile.upload = Upload.upload({
                        url: appURL + 'processData.php?action=2',
                        method: 'POST',
                        fields: {
                            sw: sw
                        },
                        file: sw.picFile,
                        fileFormDataName: 'editSW' + sw.sid
                    });
                    sw.picFile.upload.then(function(response) {
                        $timeout(function() {
                            if ((typeof response.data === 'object') && (response.data !== null)){
                                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse = "Software has been updated, ";
                                if (response.data.iconUploaded)
                                    $scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse += "Icon uploaded.";
                                else
                                    $scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse += "Icon has not changed.";
                            } else {
                                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse = "Error: Can not update software! " + response.data;
                            }
                            console.log(response.data);
                        });
                    }, function(response) {
                        if (response.status > 0)
                            $scope.SWList.software[$scope.SWList.software.indexOf(sw)].formResponse = response.status + ': ' + response.data;
                    });
                    sw.picFile.upload.progress(function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        sw.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            };
            $scope.createSW = function(){
                if (typeof $scope.newSW.picFile === 'undefined'){
                    $scope.newSW.formResponse = "Please select icon file (.png)!";
                    return false;
                }
                $scope.newSW.formResponse = $scope.validateSW($scope.newSW);
                if ($scope.newSW.formResponse.length > 0)
                    return false;
                $scope.newSW.picFile.upload = Upload.upload({
                    url: appURL + 'processData.php?action=3',
                    method: 'POST',
                    fields: {
                        sw: $scope.newSW
                    },
                    file: $scope.newSW.picFile,
                    fileFormDataName: 'addNewSW'
                });
                $scope.newSW.picFile.upload.then(function(response) {
                    $timeout(function() {
                        if ((typeof response.data === 'object') && (response.data !== null)){
                            var newSW = {};
                            newSW.sid = response.data.id;
                            newSW.title = $scope.newSW.title;
                            newSW.description = $scope.newSW.description;
                            newSW.modules = $scope.newSW.modules;
                            newSW.versions = angular.copy(response.data.versions);
                            newSW.links = angular.copy(response.data.links);
                            newSW.categories = angular.copy(response.data.categories);
                            newSW.show = false;
                            newSW.class = "";
                            for (var i = 0; i < newSW.versions.length; i++){
                                newSW.versions[i].newLoc = {};
                                newSW.versions[i].newLoc.selLoc = $scope.SWList.locations[0];
                                newSW.versions[i].newLoc.devices = [];
                                for (var j = 0; j < $scope.SWList.devices.length; j++)
                                    newSW.versions[i].newLoc.devices[j] = false;
                            }
                            newSW.selCat = response.data.categories[0];
                            newSW.newVer = {};
                            newSW.newVer.selOS = $scope.os[0];
                            newSW.newLink = {};
                            $scope.SWList.software.push(newSW);
                            $scope.newSW.formResponse = "Software has been added.";
                        } else {
                            $scope.newSW.formResponse = "Error: Can not add software! " + response.data;
                        }
                        console.dir(response.data);
                    });
                }, function(response) {
                    if (response.status > 0)
                        $scope.newSW.formResponse = response.status + ': ' + response.data;
                });
                $scope.newSW.picFile.upload.progress(function(evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    $scope.newSW.picFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            };
            $scope.validateSW = function(sw){
                if (sw.title.length < 1)
                    return "Form error: Please fill out Title!";
                if (sw.description.length < 1)
                    return "Form error: Please fill out Description!";
                if (sw.versions.length < 1)
                    return "Form error: Please add a version!";
                if (sw.categories.length < 1)
                    return "Form error: Please add a category!";

                return "";
            };
            $scope.checkDevices = function(device, number){
                device = parseInt(device);
                number = parseInt(number);
                if ((device & number) === number)
                    return true;
                return false;
            };

            $scope.addVersion = function(sw){
                if (sw.newVer.version.length > 0){
                    var newVer = {};
                    newVer.vid = -1;
                    newVer.sid = sw.sid;
                    newVer.version = sw.newVer.version;
                    newVer.os = sw.newVer.selOS.value;
                    newVer.locations = [];
                    newVer.newLoc = {};
                    newVer.newLoc.selLoc = $scope.SWList.locations[0];
                    newVer.newLoc.devices = [];
                    for (var j = 0; j < $scope.SWList.devices.length; j++)
                        newVer.newLoc.devices[j] = false;
                    var isPresent = false;
                    for (var i = 0; i < sw.versions.length; i++)
                        if (sw.versions[i].version === newVer.version &&
                            sw.versions[i].os === newVer.os){
                            isPresent = true;
                            break;
                        }
                    if (!isPresent)
                        $scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions.push(newVer);
                }
            };
            $scope.deleteVersion = function(sw, version){
                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions.splice(
                    $scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions.indexOf(version),1
                );
            };
            $scope.addLocation = function(sw,version){
                var newLoc = {};
                newLoc.id = -1;
                newLoc.sid = sw.sid;
                newLoc.vid = version.vid;
                newLoc.lid = version.newLoc.selLoc.lid;
                newLoc.name = version.newLoc.selLoc.name;
                newLoc.parent = version.newLoc.selLoc.parent;
                newLoc.devices = 0;
                var isPresent = false;
                for (var i = 0; i < version.locations.length; i++)
                    if (version.locations[i].lid == newLoc.lid){
                        isPresent = true;
                        break;
                    }
                if (!isPresent){
                    for (var i = 0; i < $scope.SWList.devices.length; i++)
                        if (version.newLoc.devices[i])
                            newLoc.devices += parseInt($scope.SWList.devices[i].did);
                    if (newLoc.devices > 0)
                        $scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions[$scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions.indexOf(version)].locations.push(newLoc);
                    else
                        alert("Please select at least one device type!");
                }
            };
            $scope.deleteLocation = function(sw, version, location){
                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions[$scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions.indexOf(version)].locations.splice(
                    $scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions[$scope.SWList.software[$scope.SWList.software.indexOf(sw)].versions.indexOf(version)].locations.indexOf(location),1
                );
            };
            $scope.addCategory = function(sw){
                var newCat = {};
                newCat.id = -1;
                newCat.cid = sw.selCat.cid;
                newCat.name = sw.selCat.name;
                var isPresent = false;
                for (var i = 0; i < sw.categories.length; i++)
                    if (sw.categories[i].cid == newCat.cid){
                        isPresent = true;
                        break;
                    }
                if (!isPresent)
                    $scope.SWList.software[$scope.SWList.software.indexOf(sw)].categories.push(newCat);
            };
            $scope.deleteCategory = function(sw, category){
                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].categories.splice(
                    $scope.SWList.software[$scope.SWList.software.indexOf(sw)].categories.indexOf(category),1
                );
            };
            $scope.addLink = function(sw){
                if (sw.newLink.title.length > 0 && sw.newLink.url.length > 1){
                    var newLink = {};
                    newLink.linkid = -1;
                    newLink.sid = sw.sid;
                    newLink.description = sw.newLink.description;
                    newLink.title = sw.newLink.title;
                    newLink.url = sw.newLink.url;
                    var isPresent = false;
                    for (var i = 0; i < sw.links.length; i++)
                        if (sw.links[i].title === newLink.title &&
                            sw.links[i].url === newLink.url){
                            isPresent = true;
                            break;
                        }
                    if (!isPresent)
                        $scope.SWList.software[$scope.SWList.software.indexOf(sw)].links.push(newLink);
                }
            };
            $scope.deleteLink = function(sw, link){
                $scope.SWList.software[$scope.SWList.software.indexOf(sw)].links.splice(
                    $scope.SWList.software[$scope.SWList.software.indexOf(sw)].links.indexOf(link),1
                );
            };

            $scope.delNewSWVer = function(version){
                $scope.newSW.versions.splice($scope.newSW.versions.indexOf(version), 1);
            };
            $scope.delNewSWLoc = function(version,location){
                $scope.newSW.versions[$scope.newSW.versions.indexOf(version)].locations.splice(
                    $scope.newSW.versions[$scope.newSW.versions.indexOf(version)].locations.indexOf(location),
                    1
                );
            };
            $scope.delNewSWCat = function(category){
                $scope.newSW.categories.splice($scope.newSW.categories.indexOf(category), 1);
            };
            $scope.delNewSWLink = function(link){
                $scope.newSW.links.splice($scope.newSW.links.indexOf(link), 1);
            };
            $scope.addNewSWVer = function(){
                if ($scope.newSW.newVer.version.length > 0){
                    var newVersion = {};
                    newVersion.version = $scope.newSW.newVer.version;
                    newVersion.os = $scope.newSW.newVer.selOS.value;
                    newVersion.locations = [];
                    newVersion.newLoc = {};
                    newVersion.newLoc.selLoc = $scope.SWList.locations[0];
                    newVersion.newLoc.devices = [];
                    for (var j = 0; j < $scope.SWList.devices.length; j++)
                        newVersion.newLoc.devices[j] = false;
                    var isPresent = false;
                    for (var i = 0; i < $scope.newSW.versions.length; i++)
                        if ($scope.newSW.versions[i].version == newVersion.version &&
                            $scope.newSW.versions[i].os == newVersion.os){
                            isPresent = true;
                            break;
                        }
                    if (!isPresent)
                        $scope.newSW.versions.push(newVersion);
                }
            };
            $scope.addNewSWLoc = function(version){
                var newLoc = {};
                newLoc.lid = version.newLoc.selLoc.lid;
                newLoc.name = version.newLoc.selLoc.name;
                newLoc.parent = version.newLoc.selLoc.parent;
                newLoc.devices = 0;
                var isPresent = false;
                for (var i = 0; i < version.locations.length; i++)
                    if (version.locations[i].lid == newLoc.lid){
                        isPresent = true;
                        break;
                    }
                if (!isPresent){
                    for (var i = 0; i < $scope.SWList.devices.length; i++)
                        if (version.newLoc.devices[i])
                            newLoc.devices += parseInt($scope.SWList.devices[i].did);
                    if (newLoc.devices > 0)
                        $scope.newSW.versions[$scope.newSW.versions.indexOf(version)].locations.push(newLoc);
                    else
                        alert("Please select at least one device type!");
                }
            };
            $scope.addNewSWCat = function(){
                var newCategory = {};
                newCategory.cid = $scope.newSW.selCat.cid;
                newCategory.name = $scope.newSW.selCat.name;
                var isPresent = false;
                for (var i = 0; i < $scope.newSW.categories.length; i++)
                    if ($scope.newSW.categories[i].cid == newCategory.cid){
                        isPresent = true;
                        break;
                    }
                if (!isPresent)
                    $scope.newSW.categories.push(newCategory);
            };
            $scope.addNewSWLink = function(){
                if ($scope.newSW.newLink.title.length > 0 && $scope.newSW.newLink.url.length > 11){
                    var newLink = {};
                    newLink.description = $scope.newSW.newLink.description;
                    newLink.title = $scope.newSW.newLink.title;
                    newLink.url = $scope.newSW.newLink.url;
                    var isPresent = false;
                    for (var i = 0; i < $scope.newSW.links.length; i++)
                        if ($scope.newSW.links[i].title == newLink.title &&
                            $scope.newSW.links[i].url == newLink.url){
                            isPresent = true;
                            break;
                        }
                    if (!isPresent)
                        $scope.newSW.links.push(newLink);
                }
            };

            $scope.generateThumb = function(file) {
                if (file != null) {
                    if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                        $timeout(function() {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(file);
                            fileReader.onload = function(e) {
                                $timeout(function() {
                                    file.dataUrl = e.target.result;
                                });
                            }
                        });
                    }
                }
            };

    }])

    .directive('softwareManageList', function() {
        return {
            restrict: 'A',
            controller: 'manageSWListCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageSoftware/manageSoftwareList.tpl.html'
        };
    })
    .filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            if (typeof input == 'undefined')
                return input;
            return input.slice(start);
        }
    })
    .controller('manageSWLocCatCtrl', ['$scope', '$timeout', 'swFactory',
        function manageSWLocCatCtrl($scope, $timeout, swFactory){
            $scope.selLocation = -1;
            $scope.selCategory = -1;
            $scope.newLocation = {};
            $scope.newLocation.name = '';
            $scope.newLocation.parent = 0;
            $scope.newCategory = '';
            $scope.locResponse = '';
            $scope.catResponse = '';


            $scope.selectLocation = function(location){
                $scope.selLocation = location.lid;
            };
            $scope.selectCategory = function(category){
                $scope.selCategory = category.cid;
            };
            $scope.addLocation = function(){
                swFactory.postData({action : 4}, $scope.newLocation)
                    .success(function(data, status, headers, config) {
                        if ((typeof data === 'object') && (data !== null)){
                            var newLoc = {};
                            newLoc.lid = data.id;
                            newLoc.name = $scope.newLocation.name;
                            newLoc.parent = 0;
                            if ($scope.newLocation.parent > 0)
                                newLoc.parent = $scope.newLocation.parent;
                            $scope.SWList.locations.push(newLoc);
                            $scope.locResponse = "Location has been added!";
                        } else {
                            $scope.locResponse = "Error: Can not add location! " + data;
                        }
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.locResponse = "Error: Could not add location! " + data;
                        console.log(data);
                    });
            };
            $scope.deleteLocation = function(location){
                if (confirm("Delete " + location.name  + " permanently?") == true){
                    swFactory.postData({action : 5}, location)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.SWList.locations.splice($scope.SWList.locations.indexOf(location), 1);
                                $scope.locResponse = "Location has been deleted!";
                            } else {
                                $scope.locResponse = "Error: Can not delete location! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.locResponse = "Error: Could not delete location! " + data;
                            console.log(data);
                        });
                }
            };
            $scope.editLocation = function(location){
                swFactory.postData({action : 6}, location)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.locResponse = "Location name has been updated!";
                        } else {
                            $scope.locResponse = "Error: Can not update location! " + data;
                        }
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.locResponse = "Error: Could not update location! " + data;
                        console.log(data);
                    });
            };
            $scope.addCategory = function(){
                swFactory.postData({action : 7}, {name: $scope.newCategory})
                    .success(function(data, status, headers, config) {
                        if ((typeof data === 'object') && (data !== null)){
                            var newCat = {};
                            newCat.cid = data.id;
                            newCat.name = $scope.newCategory;
                            $scope.SWList.categories.push(newCat);
                            $scope.catResponse = "Category has been added!";
                        } else {
                            $scope.catResponse = "Error: Can not add category! " + data;
                        }
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.catResponse = "Error: Could not add category! " + data;
                        console.log(data);
                    });
            };
            $scope.deleteCategory = function(category){
                if (confirm("Delete " + category.name  + " permanently?") == true){
                    swFactory.postData({action : 8}, category)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.SWList.categories.splice($scope.SWList.categories.indexOf(category), 1);
                                $scope.catResponse = "Category has been deleted!";
                            } else {
                                $scope.catResponse = "Error: Can not delete category! " + data;
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.catResponse = "Error: Could not delete category! " + data;
                            console.log(data);
                        });
                }
            };
            $scope.editCategory = function(category){
                swFactory.postData({action : 9}, category)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.catResponse = "Category name has been updated!";
                        } else {
                            $scope.catResponse = "Error: Can not update category! " + data;
                        }
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.catResponse = "Error: Could not update category! " + data;
                        console.log(data);
                    });
            };
        }])
    .directive('softwareManageLocCat', function() {
        return {
            restrict: 'A',
            controller: 'manageSWLocCatCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageSoftware/manageSoftwareLocCat.tpl.html'
        };
    })

angular.module('manage.manageUserGroups', [])
    .controller('userGroupsCtrl', ['$scope', '$window', 'tokenFactory', 'ugFactory',
        function userGroupsCtrl($scope, $window, tokenFactory, ugFactory){
        $scope.expUser = -1;
        $scope.users = $window.users;
        $scope.apps = $window.apps;
        $scope.wpUsers = $window.wpUsers;
        $scope.newUser = $scope.wpUsers[0];
        $scope.newUserAccess = [];
        for (var i = 0; i < $scope.apps.length; i++)
            $scope.newUserAccess[i] = false;

        $scope.tabs = [
            { name: 'Users',
                number: 0,
                active: true
            },
            { name: 'Applications',
                number: 1,
                active: false
            }];

        tokenFactory("CSRF-libAdmin");

        $scope.expandUser = function(user){
            $scope.result = "";
            $scope.expUser = user.id;
        };
        $scope.isExpUser = function(uID){
            if ($scope.expUser === uID)
                return true;
            return false;
        };

        $scope.updateUser = function(user){
            $scope.isLoading = true;
            ugFactory.postData({action : 1}, user)
                .success(function(data) {
                    if (data == 1){
                        $scope.result = "Saved";
                    } else
                        $scope.result = "Error! Could not save data!";
                    $scope.isLoading = false;
                    console.dir(data);
                })
                .error(function(data, status, headers, config) {
                    $scope.result = "Error! Could not save data!";
                    $scope.isLoading = false;
                    console.dir(data);
                });
        };

        $scope.createUser = function(user){
            $scope.isLoading = true;
            user.access = $scope.newUserAccess;
            console.dir(user);
            ugFactory.postData({action : 2}, user)
                .success(function(data) {
                    if ((typeof data === 'object') && (data !== null)){
                        $scope.result2 = "Access granted!";
                        var createdUser = {};
                        createdUser.name = user.name;
                        createdUser.wpLogin = user.login;
                        createdUser.id = data.id;
                        createdUser.access = [];
                        for (var i = 0; i < user.access.length; i++)
                            if (user.access[i])
                                createdUser.access[i] = true;
                            else
                                createdUser.access[i] = false;
                        $scope.users.push(createdUser);
                        $scope.expandUser(createdUser);
                    }else
                        $scope.result2 = "Error! Could not grant access!";
                    $scope.isLoading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.isLoading = false;
                    $scope.result2 = "Error! Could not grant access!";
                });
        };

        $scope.deleteUser = function(user, index){
            if (confirm("Are you sure you want to remove access for " + user.name + "?")){
                $scope.isLoading = true;
                ugFactory.postData({action : 3}, user)
                    .success(function(data) {
                        if (data == 1){
                            $scope.result = "User access deleted!";
                            $scope.users.splice(index, 1);
                        } else
                            $scope.result = "Error! Could not delete user access!";
                        $scope.isLoading = false;
                    })
                    .error(function(data, status, headers, config) {
                        $scope.result = "Error! Could not delete user access!";
                        $scope.isLoading = false;
                    });
            }
        };

    }])
    .directive('userGroupsList', function() {
        return {
            restrict: 'A',
            scope: {},
            controller: 'userGroupsCtrl',
            templateUrl: 'manageUserGroups/manageUG.tpl.html'
        };
    })
    .controller('myWebAppsCtrl', ['$scope', '$window',
        function myWebAppsCtrl($scope, $window){
            $scope.apps = $window.apps;
            $scope.userName = $window.userName;
        }])
    .directive('viewMyWebApps', function() {
        return {
            restrict: 'A',
            scope: {},
            controller: 'myWebAppsCtrl',
            templateUrl: 'manageUserGroups/viewMyWebApps.tpl.html'
        };
    })
angular.module('manage.siteFeedback', [])
    .controller('siteFeedbackCtrl', ['$scope', 'tokenFactory', 'sfFactory',
        function siteFeedbackCtrl($scope, tokenFactory, sfFactory){
            $scope.responses = [];

            tokenFactory("CSRF-libSiteFeedback");

            sfFactory.getData({json : 1})
                .success(function(data) {
                    console.dir(data);
                    $scope.responses = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });
        }])
    .directive('siteFeedbackList', function() {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'siteFeedbackCtrl',
            templateUrl: 'siteFeedback/siteFeedback.tpl.html'
        };
    })

angular.module('manage.staffDirectory', [])
    .constant('STAFF_DIR_RANKS', [
        "",
        "Prof.",
        "Asso. Prof.",
        "Asst. Prof."
    ])
    .constant('STAFF_DIR_DEPTS', [
        "Acquisitions",
        "Annex Services",
        "Area Computing Services",
        "Business Library",
        "Business Office",
        "Cataloging & Metadata Services",
        "Collection Management",
        "Digital Humanities Center",
        "Digital Services",
        "Education Library",
        "Electronic Resources",
        "Gorgas Information Services",
        "Gorgas Library, Circulation Department",
        "Government Documents",
        "Health Sciences Library",
        "ILS & E-Resources Management",
        "Interlibrary Loan",
        "Library Administration",
        "Office of Library Technology",
        "Sanford Media Center",
        "School of Social Work",
        "Science and Engineering Library",
        "Special Collections",
        "Web Infrastructure & Application Development",
        "Web Services"
    ])

    .controller('staffDirCtrl', ['$scope', '$window', 'tokenFactory', 'sdFactory', 'STAFF_DIR_RANKS', 'STAFF_DIR_DEPTS', 'STAFF_DIR_URL',
        function staffDirCtrl($scope, $window, tokenFactory, sdFactory, ranks, departments, appUrl){
            $scope.sortMode = 'lastname';
            $scope.lastNameFilter = '';
            $scope.firstNameFilter = '';
            $scope.titleFilter = '';
            $scope.deptFilter = '';
            $scope.sortButton = 'last';
            $scope.Directory = {};
            $scope.hasAccess = $window.isAdmin;
            $scope.ranks = ranks;
            $scope.departments = departments;
            $scope.mOver = 0;
            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 15;

            tokenFactory("CSRF-libStaffDir");

            sdFactory.getData()
                .success(function(data) {
                    console.dir(data);
                    $scope.Directory = data;
                    for (var i = 0; i < $scope.Directory.list.length; i++){
                        $scope.Directory.list[i].selSubj = $scope.Directory.subjects[0];
                        $scope.Directory.list[i].class = "";
                        $scope.Directory.list[i].image = appUrl + "staffImages/" + $scope.Directory.list[i].id + ".jpg";
                    }
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.togglePerson = function(person){
                $scope.Directory.list[$scope.Directory.list.indexOf(person)].show =
                    !$scope.Directory.list[$scope.Directory.list.indexOf(person)].show;
                $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjResponse = "";
            };

            $scope.setOver = function(person){
                $scope.mOver = person.id;
            };

            $scope.resetNewPersonForm = function(){
                $scope.formData.first = "";
                $scope.formData.last = "";
                $scope.formData.email = "";
                $scope.formData.phone = "";
                $scope.formData.fax = "";
            };

            $scope.deletePerson = function(person){
                if (confirm("Delete " + person.lastname + ", " + person.firstname  + " record permanently?") == true){
                    sdFactory.postData({delete : 1}, person)
                        .success(function(data, status, headers, config) {
                            $scope.formResponse = data;
                            $scope.Directory.list.splice($scope.Directory.list.indexOf(person), 1);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.formResponse = "Error: Could not delete person data! " + data;
                        });
                }
            };
            $scope.updatePerson = function(person){
                sdFactory.postData({update : person.id}, person)
                    .success(function(data, status, headers, config) {
                        $scope.formResponse = "Person has been updated!";
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Person update failed! " + data;
                    });
            };
            $scope.deleteSubject = function(person, subjectID, index){
                if (confirm("Delete this subject from " + person.firstname + " " + person.lastname + "?") == true){
                    sdFactory.postData({deleteSubject : subjectID}, {})
                        .success(function(data, status, headers, config) {
                            $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjects.splice(index, 1);
                            $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjResponse = "Subject Deleted!";
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjResponse =
                                "Error: Could not delete subject! " + data;
                        });
                }
            };
            $scope.addSubject = function(person){
                sdFactory.postData({addSubject : 1}, person)
                    .success(function(data, status, headers, config) {
                        var newSubj = {};
                        newSubj.id = person.selSubj.id;
                        newSubj.subject = person.selSubj.subject;
                        newSubj.link = person.selSubj.link;
                        $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjects.push(newSubj);
                        $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjResponse = "Subject Added!";
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjResponse =
                            "Error: Could not add subject! " + data;
                    });
            };

            $scope.formData = {};
            $scope.formData.first = "";
            $scope.formData.last = "";
            $scope.formData.email = "";
            $scope.formData.title = "";
            $scope.formData.phone = "";
            $scope.formData.fax = "";
            $scope.formData.rank = ranks[0];
            $scope.formData.dept = departments[0];
            $scope.formResponse = '';

            $scope.isValidEmailAddress = function(emailAddress) {
                var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
                return pattern.test(emailAddress);
            };

            $scope.addPerson = function() {
                $scope.formResponse = '';
                if ( $scope.formData.first.length > 0 )
                {
                    if ( $scope.formData.last.length > 0 )
                    {
                        if ( $scope.isValidEmailAddress( $scope.formData.email) )
                        {
                            if ( $scope.formData.title.length > 0 )
                            {
                                if ( $scope.formData.phone.length >= 7 )
                                {
                                    if ( $scope.formData.fax.length >= 7 )
                                    {
                                        sdFactory.postData({}, $scope.formData)
                                            .success(function(data, status, headers, config) {
                                                if ((typeof data === 'object') && (data !== null)){
                                                    var createdUser = {};
                                                    createdUser.id = data.id;
                                                    createdUser.lastname = $scope.formData.last;
                                                    createdUser.firstname = $scope.formData.first;
                                                    createdUser.title = $scope.formData.title;
                                                    createdUser.rank = $scope.formData.rank;
                                                    createdUser.department = $scope.formData.dept;
                                                    createdUser.division = "";
                                                    createdUser.phone = $scope.formData.phone;
                                                    createdUser.email = $scope.formData.email;
                                                    createdUser.fax = $scope.formData.fax;
                                                    createdUser.subjects = [];
                                                    createdUser.show = false;
                                                    createdUser.selSubj = $scope.Directory.subjects[0];
                                                    createdUser.class = "";
                                                    createdUser.image = appUrl + "staffImages/" + createdUser.id + ".jpg";
                                                    $scope.Directory.list.push(createdUser);
                                                    $scope.resetNewPersonForm();
                                                    $scope.formResponse = "Person has been added!";
                                                } else
                                                    $scope.formResponse = "Error: Person could not be added! " + data;
                                            })
                                            .error(function(data, status, headers, config) {
                                                $scope.formResponse = "Error: Person Creation failed! " + data;
                                            });
                                    } else
                                        alert("Fax number is too short!");
                                } else
                                    alert("Phone number is too short!");
                            } else
                                alert("Title is too short!");
                        } else
                            alert("User email is invalid!");
                    } else
                        alert("Last Name is too short!");
                } else
                    alert("First Name is too short!");
            };
        }])
    .directive('staffDirectoryList', function($animate) {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'staffDirCtrl',
            link: function(scope, elm, attrs){
                //Preload the spinner element
                var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');
                //Preload the location of the boxe's title element (needs to be more dynamic in the future)
                var titleElm = elm.find('h2');
                //Enter the spinner animation, appending it to the title element
                $animate.enter(spinner, titleElm[0]);

                var loadingWatcher = scope.$watch(
                    'Directory',
                    function(newVal, oldVal){
                        if (scope.Directory.totalTime > 0){
                            $animate.leave(spinner);
                            console.log("Staff Directory loaded");
                        }
                    }
                );
            },
            templateUrl: 'staffDirectory/staffDirectory.tpl.html'
        };
    })
    .filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            return input.slice(start);
        }
    })
angular.module('manage.submittedForms', [])
    .controller('manageSubFormsCtrl', ['$scope', '$timeout', 'tokenFactory', 'formFactory',
        function manageSubFormsCtrl($scope, $timeout, tokenFactory, formFactory){
            $scope.data = {};
            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;
            $scope.titleFilter = '';
            $scope.sortModes = [
                {by:'title', reverse:false},
                {by:'status', reverse:false},
                {by:'created', reverse:false}
            ];
            $scope.sortMode = 0;
            $scope.sortButton = $scope.sortMode;
            $scope.mOver = 0;

            tokenFactory("CSRF-libForms");

            formFactory.getData()
                .success(function(data) {
                    console.dir(data);
                    for (var i = 0; i < data.forms.length; i++){
                        data.forms[i].show = false;
                        data.forms[i].class = "";
                    }
                    $scope.data = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.setOver = function(form){
                $scope.mOver = form.fid;
            };
            $scope.toggleForms = function(form){
                $scope.data.forms[$scope.data.forms.indexOf(form)].show =
                    !$scope.data.forms[$scope.data.forms.indexOf(form)].show;
            };
        }])

    .directive('submittedFormsList', function($animate) {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'manageSubFormsCtrl',
            link: function(scope, elm, attrs){
                //Preload the spinner element
                var spinner = angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>');
                //Preload the location of the boxe's title element (needs to be more dynamic in the future)
                var titleElm = elm.find('h2');
                //Enter the spinner animation, appending it to the title element
                $animate.enter(spinner, titleElm[0]);

                var loadingWatcher = scope.$watch(
                    'data.totalTime',
                    function(newVal, oldVal){
                        if (newVal != oldVal){
                            $animate.leave(spinner);
                            console.log("Forms data loaded");
                        }
                    },
                    true
                );
            },
            templateUrl: 'submittedForms/submittedForms.tpl.html'
        };
    })
    .filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            if (typeof input == 'undefined')
                return input;
            return input.slice(start);
        }
    })

    .controller('customFormCtrl', ['$scope', 'formFactory',
    function customFormCtrl($scope, formFactory){

        $scope.submit = function(event){
            var form = {};
            form.length = event.target.length - 1;
            form.url = event.target.baseURI;
            console.dir(event.target);
            //copy every field but the submit button
            for (var i = 0; i < event.target.length - 1; i++){
                form[i] = {};
                form[i].name = event.target[i].name;
                form[i].value = event.target[i].value;
                if (event.target[i].type == 'checkbox' || event.target[i].type == 'radio')
                    if (!event.target[i].checked)
                        form[i].value = "";
            }
            formFactory.submitForm(form)
                .success(function(data) {
                    $scope.formResponse = data;
                    console.log(data);
                })
                .error(function(data, status, headers, config) {
                    $scope.formResponse = "Error! " + data;
                    console.log(data);
                });

        };
    }]);angular.module('databases.templates', ['databases/databases-list.tpl.html']);

angular.module("databases/databases-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("databases/databases-list.tpl.html",
    "<div class=\"page-header\"><h1>Databases</h1></div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-3 col-md-push-9\">\n" +
    "        <form class=\"facets-form\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <span class=\"page-header\">\n" +
    "                    <h4>Filter Databases By</h4>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"db.search\" placeholder=\"Keyword search\">\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group hidden-xs\">\n" +
    "                <h5>Title starts with</h5>\n" +
    "                <div class=\"facet-group alphanum-group\">\n" +
    "                    <div class=\"btn-group\">\n" +
    "                        <label class=\"btn btn-default\" ng-repeat=\"na in numAlpha\" ng-model=\"db.startsWith\" btn-radio=\"'{{na}}'\" ng-disabled=\"startsWithDisabled[na]\" uncheckable>{{na}}</label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group hidden-xs\">\n" +
    "                <h5>Subjects</h5>\n" +
    "                <div class=\"facet-group\">\n" +
    "                    <div class=\"radio\" ng-class=\"{'disabled': subj.disabled}\" ng-repeat=\"subj in subjects\">\n" +
    "                        <label>\n" +
    "                            <input type=\"checkbox\" ng-model=\"db.subjects[subj.subject]\" ng-disabled=\"subj.disabled\">\n" +
    "                            {{subj.subject}} ({{subj.total}})\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group hidden-xs\">\n" +
    "                <h5>Types</h5>\n" +
    "                <div class=\"facet-group\">\n" +
    "                    <div class=\"radio\" ng-class=\"{'disabled': type.disabled}\" ng-repeat=\"type in types\">\n" +
    "                        <label>\n" +
    "                            <input type=\"checkbox\" ng-model=\"db.types[type.type]\"  ng-disabled=\"type.disabled\">\n" +
    "                            {{type.type}} ({{type.total}})\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <button type=\"button\" class=\"btn btn-block btn-primary\" ng-click=\"resetFilters()\"><span class=\"fa fa-fw fa-refresh\"></span> Reset filters</button>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-9 col-md-pull-3 databases-list-container\">\n" +
    "        <p>\n" +
    "        Showing {{pager.firstItem}}-{{pager.lastItem}} of {{pager.totalItems}} results\n" +
    "        <div ng-if=\"activeFilters.startsWith || activeFilters.subjects || activeFilters.types\">\n" +
    "\n" +
    "        <ol class=\"breadcrumb\">\n" +
    "            <li ng-if=\"activeFilters.startsWith\"><strong>Starts with:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"db.startsWith = ''\">\"{{db.startsWith}}\" <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "            <li ng-if=\"activeFilters.subjects\"><strong>Subjects:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"db.subjects[subject] = false\" ng-repeat=\"(subject, key) in db.subjects\">{{subject}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "            <li ng-if=\"activeFilters.types\"><strong>Types:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"db.types[type] = false\" ng-repeat=\"(type, key) in db.types\">{{type}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "            <li class=\"pull-right\"><button type=\"button\" style=\"padding: 2px 6px;\" class=\"btn btn-primary btn-small\" title=\"Reset filters\" ng-click=\"resetFilters()\"><i class=\"fa fa-refresh\"></i></button></li>\n" +
    "        </ol>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        </p>\n" +
    "\n" +
    "        <div class=\"media\" ng-repeat=\"item in filteredDB | after:(pager.page-1)*pager.perPage | limitTo:20\">\n" +
    "            <div class=\"media-body\">\n" +
    "                <h4 class=\"media-heading\">\n" +
    "                    <a ng-href=\"{{DB_PROXY_PREPEND_URL}}{{item.url}}\" title=\"{{item.title}}\"> {{item.title}}</a>\n" +
    "                    <!--<small ng-if=\"item.presentedBy\">({{item.presentedBy}})</small>-->\n" +
    "                    <small>{{item.coverage}}</small>\n" +
    "                    <small>\n" +
    "                        <span class=\"label label-success\" ng-if=\"item.hasFullText == 'A'\">All Full Text</span>\n" +
    "                        <span class=\"label label-info\" ng-if=\"item.hasFullText == 'P'\">Primarily Full Text</span>\n" +
    "                        <span class=\"label label-warning\" ng-if=\"item.hasFullText == 'S'\">Some Full Text</span>\n" +
    "                        <span class=\"label label-danger\" ng-if=\"item.hasFullText == 'N'\">No Full Text</span>\n" +
    "                    </small>\n" +
    "                </h4>\n" +
    "\n" +
    "                <p>{{item.description}}</p>\n" +
    "\n" +
    "\n" +
    "                <div ng-if=\"item.location\">\n" +
    "                    <strong>Access:</strong> {{item.location}}\n" +
    "                </div>\n" +
    "                <div ng-if=\"(item.subjects | where:{type:1}).length > 0\">\n" +
    "                    <strong>Primary subjects: </strong><span ng-repeat=\"subj in item.subjects | where:{type:1}\">{{subj.subject}}</span>\n" +
    "                </div>\n" +
    "                <div ng-if=\"item.types\">\n" +
    "                    <strong>Types of material: </strong><span ng-repeat=\"type in item.types\">{{type.type}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"text-center\">\n" +
    "            <pagination class=\"pagination-sm\" ng-model=\"pager.page\" total-items=\"pager.totalItems\" max-size=\"pager.maxSize\" boundary-links=\"true\" rotate=\"false\" items-per-page=\"pager.perPage\" ng-change=\"pageChange()\" ng-if=\"pager.totalItems > pager.perPage\"></pagination>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"alert alert-warning text-center\" role=\"alert\" ng-show=\"pager.totalItems < 1\">\n" +
    "            <h2>No results found <span ng-if=\"db.search\"> for \"{{db.search}}\"</span></h2>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
;angular.module('ualib.databases', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ui.bootstrap',
    'angular.filter',
    'duScroll',
    'ualib.ui',
    'databases.templates'
])

    .constant('DB_PROXY_PREPEND_URL', 'http://libdata.lib.ua.edu/login?url=');




angular.module('ualib.databases')

    .factory('databasesFactory', ['$resource', function($resource){
        return $resource('https://wwwdev2.lib.ua.edu/databases/api/:db');
    }]);
angular.module('ualib.databases')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/databases', {
                reloadOnSearch: false,
                resolve: {
                    databases: function(databasesFactory){
                        return databasesFactory.get({db: 'all'})
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
            })
    }])

    .controller('DatabasesListCtrl', ['$scope', 'databases', '$filter' ,'$location' ,'$document', '$route', function($scope, db, $filter, $location, $document, $route){
        var databases = [];

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

            if (newVal.search.length > 2){
                filtered = $filter('filter')(filtered, newVal.search);
            }

            if (newVal.startsWith){
                var sw = newVal.startsWith.indexOf('-') == -1 ? "^"+newVal.startsWith+".+$" : '^['+newVal.startsWith+'].+$';
                filtered = $filter('filter')(filtered, function(item){
                    return $filter('test')(item.title, sw, 'i');
                });
            }

            filtered = $filter('orderBy')(filtered, 'title');

            // Set position for stable sort
            for (var i = 0, len = filtered.length; i < len; i++){
                filtered[i].position = i;
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
            $scope.pager.totalItems = $scope.filteredDB.length;
            $scope.pager.firstItem = (($scope.pager.page-1)*$scope.pager.perPage)+1;
            $scope.pager.lastItem = $scope.pager.page*($scope.pager.totalItems < $scope.pager.mazSize ? $scope.pager.totalItems : $scope.pager.perPage);
            var numPages =  Math.floor($scope.pager.totalItems / $scope.pager.maxSize);
            if (numPages < $scope.pager.page){
                $scope.pager.page = numPages || 1;
            }

            var newParams = angular.extend({}, newVal, {page: $scope.pager.page});

            processFacets(filtered);
            scopeToParams(newParams);


        }, true);


        function filterBySubject(item){
            var subjects = Object.keys($scope.db.subjects).filter(function(key){
                return $scope.db.subjects[key];
            });

            return item.subjects.filter(function(itemSubj){
                    return $scope.db.subjects[itemSubj.subject];
                }).length === subjects.length;
        };

        function filterByType(item){
            var types = Object.keys($scope.db.types).filter(function(key){
                return $scope.db.types[key];
            });

            return item.types.filter(function(itemSubj){
                    return $scope.db.types[itemSubj.type];
                }).length === types.length;
        };

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

            scopeToParams({page: $scope.pager.page});
            $document.duScrollTo(0, 30, 500, function (t) { return (--t)*t*t+1 });
        };

        $scope.$on('$destroy', function(){
            filterWatcher();
        });

        function processFacets(databases){
            var subjAvail = [];
            var subjCount = {};

            var typeAvail = [];
            var typeCount = {};


            for (var i = 0, len = databases.length; i < len; i++){
                databases[i].subjects.map(function(subj){
                    if (subjAvail.indexOf(subj.sid) == -1){
                        subjAvail.push(subj.sid);
                        subjCount[subj.sid] = 1;
                    }
                    else{
                        subjCount[subj.sid]++;
                    }
                });
                databases[i].types.map(function(type){
                    if (typeAvail.indexOf(type.tid) == -1){
                        typeAvail.push(type.tid);
                        typeCount[type.tid] = 1;
                    }
                    else{
                        typeCount[type.tid]++;
                    }
                });
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
                    console.log({
                        key: key,
                        val: val
                    });
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
                    else if (!(key === 'search' && val.length < 3)){
                        $location.search(key, val);
                    }
                    else{
                        $location.search(key, null);
                    }
                }
                else{
                    $location.search(key, null);
                }
            });
        }

        function paramsToScope(){
            var params = $location.search();
            var scopeFacets = $scope.db;
            $scope.activeFilters = params;

            if (params['page']){
                $scope.pager.page = params['page'];
            }

            angular.forEach(scopeFacets, function(val, key){
                if (angular.isDefined(params[key])){
                    if (key == 'subjects' || key == 'types' && val){
                        var filters = {};
                        params[key].split(',').forEach(function(filter){
                            filters[filter] = true;
                        });
                        val = filters;
                    }
                    scopeFacets[key] = val;
                }
                else{
                    scopeFacets[key] = angular.isObject(val) ? {} : '';
                }
            });
            $scope.db = scopeFacets
            /*angular.forEach(params, function(val, key){
                if (key === 'page'){
                    $scope.pager.page = val;
                }
                else {
                    if (angular.isDefined(val) && val !== ''){
                        if (key == 'subjects' || key == 'types'){
                            var filters = {};
                            val.split(',').forEach(function(filter){
                                filters[filter] = true;
                            });
                            val = filters;
                        }
                        $scope.db[key] = val;
                    }
                    else {
                        if (angular.isObject($scope.db[key])){
                            $scope.db[key] = {};
                        }
                        else{
                            $scope.db[key] = '';
                        }
                    }
                }
            });*/
        }

        // Adopted from http://stackoverflow.com/questions/4994201/is-object-empty
        var hasOwnProperty = Object.prototype.hasOwnProperty;

        function facetsActive(obj) {

            // null and undefined are "empty"
            if (obj == null) return true;

            // Assume if it has a length property with a non-zero value
            // that that property is correct.
            if (obj.length > 0)    return false;
            if (obj.length === 0)  return true;

            // Otherwise, does it have any properties of its own? And are those properties "truthy"
            // Note that this doesn't handle
            // toString and valueOf enumeration bugs in IE < 9
            for (var key in obj) {
                if (hasOwnProperty.call(obj, key) && key) return true;
            }

            return false;
        }

    }]);


;angular.module('ualib.musicSearch.templates', ['musicSearch.tpl.html']);

angular.module("musicSearch.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("musicSearch.tpl.html",
    "<h2>Music Video Database Search</h2>\n" +
    "\n" +
    "<form ng-submit=\"search()\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Search music and video database\" ng-model=\"searchText\">\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <button type=\"submit\" class=\"btn btn-primary\">\n" +
    "                Search\n" +
    "                <span class=\"fa fa-fw fa-search\"></span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "<div class=\"col-md-12 form-group form-inline\">\n" +
    "    <label for=\"filterBy\">Filter <strong>{{ms.results.length}}</strong> results by</label>\n" +
    "    <div id=\"filterBy\">\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"Title\" ng-model=\"titleFilter\">\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"Description\" ng-model=\"descrFilter\">\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"Genre\" ng-model=\"genreFilter\">\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"Language\" ng-model=\"languageFilter\">\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"Keywords\" ng-model=\"keywordsFilter\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"text-center\">\n" +
    "    <pagination total-items=\"filteredResults.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\"></pagination>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-12\" ng-repeat=\"item in filteredResults = (ms.results\n" +
    "                                                         | filter:{title:titleFilter}:compare\n" +
    "                                                         | filter:{notes:descrFilter}:compare\n" +
    "                                                         | filter:{genre:genreFilter}:compare\n" +
    "                                                         | filter:{language:languageFilter}:compare\n" +
    "                                                         | filter:{title:keywordsFilter}:compare\n" +
    "                                                         | orderBy:'title')\n" +
    "                                                     | startFrom:(currentPage-1)*perPage | limitTo:perPage\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-10\">\n" +
    "                <h4>\n" +
    "                    {{item.title}}\n" +
    "                    <small>{{item.genre}}</small>\n" +
    "                    <small ng-show=\"item.genre && item.series_title\"><span class=\"fa fa-fw fa-ellipsis-v\"></span></small>\n" +
    "                    <small>{{item.series_title}}</small>\n" +
    "                </h4>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <span>\n" +
    "                    <h4><small>{{item.call_number}}</small></h4>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <div class=\"col-md-1\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-8\">\n" +
    "                    <p style=\"text-align: justify;\">{{item.notes}}</p>\n" +
    "                    <p ng-show=\"item.keywords\"><small>Keywords: </small> {{item.keywords}}</p>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-1\">\n" +
    "                    {{item.language}}\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <br>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"text-center\">\n" +
    "    <pagination total-items=\"filteredResults.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\"></pagination>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);
;angular.module('ualib.musicSearch', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ui.bootstrap',
    'ualib.musicSearch.templates'
])

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/musicSearch/:tk?/show/:show', {
            templateUrl: 'musicSearch.tpl.html',
            controller: 'musicSearchCtrl',
            resolve: {
                mSearch: ['$resource', function($resource){
                    return $resource('https://wwwdev2.lib.ua.edu/musicsearch/api/search/:tk',{tk:'@sText'});
                }],
                mShowAll: ['$resource', function($resource){
                    return $resource('https://wwwdev2.lib.ua.edu/musicsearch/api/showall');
                }]
            }
        });
    }])

    .controller('musicSearchCtrl', ['$scope', '$location', 'mSearch', 'mShowAll', function($scope, $location, mSearch, mShowAll){
        $scope.ms = {};
        $scope.searchText = '';
        $scope.currentPage = 1;
        $scope.maxPageSize = 10;
        $scope.perPage = 10;
        $scope.titleFilter = '';
        $scope.descrFilter = '';
        $scope.keywordsFilter = '';
        $scope.genreFilter = '';
        $scope.languageFilter = '';

        $scope.search = function(){
            var newPath = '/musicSearch/';
            if ($scope.searchText)
                newPath = newPath + $scope.searchText + '/';

            newPath = newPath + 'show/' + $scope.perPage;

            $location.path(newPath);
        }

        $scope.$on('$routeChangeSuccess', function(event, currentRoute){
            if (typeof currentRoute.params.tk !== 'undefined')
                $scope.searchText = currentRoute.params.tk;
            else
                $scope.searchText = '';
            if (typeof currentRoute.params.s !== 'undefined')
                $scope.perPage = currentRoute.params.s;
            else
                $scope.perPage = 10;

            if ($scope.searchText)
                mSearch.get({tk:$scope.searchText})
                    .$promise.then(function(data){
                        $scope.ms = data;
                        console.dir($scope.ms);
                    }, function(){
                        console.log('musicSearch Error 1 -- Come on, put in proper error handling already');
                    });
            else
                mShowAll.get()
                    .$promise.then(function(data){
                        $scope.ms = data;
                        console.dir($scope.ms);
                    }, function(){
                        console.log('musicSearch Error 2 -- Come on, put in proper error handling already');
                    });
        });

        $scope.compare = function(actual, expected){
            if (!expected)
                return true;
            if (actual.toLowerCase().indexOf(expected.toLowerCase()) > -1)
                return true;
            return false;
        };
    }])
    .filter('startFrom', function() {
        return function(input, start) {
            if (typeof input === 'undefined')
                return null;
            start = +start; //parse to int
            return input.slice(start);
        }
    });

angular.module('musicSearch', ['ualib.musicSearch']);;angular.module('ualib.staffdir.templates', ['staff-card/staff-card-list.tpl.html', 'staff-card/staff-card.tpl.html', 'staff-directory/staff-directory-facets.tpl.html', 'staff-directory/staff-directory-listing.tpl.html', 'staff-directory/staff-directory.tpl.html']);

angular.module("staff-card/staff-card-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-card/staff-card-list.tpl.html",
    "<div class=\"row\" ng-repeat=\"person in staffdir track by person.id\">\n" +
    "\n" +
    "        <div class=\"staff-card\" staff-person=\"person\"></div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("staff-card/staff-card.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-card/staff-card.tpl.html",
    "<div class=\"staff-card-container panel panel-default\" style=\"position:relative;\">\n" +
    "    <div class=\"panel-body\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"name-plate col-sm-12 text-right\">\n" +
    "                <h4 class=\"name\"><small ng-if=\"staffPerson.rank\">{{staffPerson.rank}} </small>{{staffPerson.firstname}} {{staffPerson.lastname}}</h4>\n" +
    "                <div class=\"title\">{{staffPerson.title}}</div>\n" +
    "                <div class=\"\">{{staffPerson.department}}</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-sm-6\">\n" +
    "                <ul class=\"fa-ul\">\n" +
    "                    <li ng-if=\"staffPerson.phone\"><span class=\"fa fa-phone fa-li\"></span>{{staffPerson.phone}}</li>\n" +
    "                    <li ng-if=\"staffPerson.fax\"><span class=\"fa fa-fax fa-li\"></span>{{staffPerson.fax}}</li>\n" +
    "                    <li ng-if=\"staffPerson.email\"><span class=\"fa fa-envelope fa-li\"></span>{{staffPerson.email}}</li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <!--<div class=\"col-sm-6\">\n" +
    "                <div class=\"staff-card-detail pull-right\" ng-if=\"staffPerson.subjects\">\n" +
    "                    <div class=\"dropdown\">\n" +
    "                        <button class=\"btn btn-primary dropdown-toggle\"  type=\"button\">\n" +
    "                            Expert in\n" +
    "                        </button>\n" +
    "                        <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenu1\">\n" +
    "                            <li role=\"presentation\" ng-repeat=\"subject in staffPerson.subjects | orderBy:subject.subject\" ng-class=\"{'disabled': !subject.link}\">\n" +
    "                                <a ng-href=\"{{subject.link}}\" title=\"{{subject.subject}}\">{{subject.subject}}</a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>-->\n" +
    "        </div>\n" +
    "        <div ng-if=\"staffPerson.subjects\">\n" +
    "            <button class=\"btn btn-primary\" type=\"button\" style=\"position: absolute; bottom: 0; right: 0; border-top-right-radius: 0; border-bottom-left-radius: 0\" ng-click=\"isCollapsed = !isCollapsed\">Research Expert in</button>\n" +
    "            <div collapse=\"!isCollapsed\">\n" +
    "                <div class=\"bg-info\" style=\"width:100%; height:100%;\">\n" +
    "                    <h4>Expert Librarian in...</h4>\n" +
    "                    <ul>\n" +
    "                        <li role=\"presentation\" ng-repeat=\"subject in staffPerson.subjects | orderBy:subject.subject\" ng-class=\"{'disabled': !subject.link}\">\n" +
    "                            <a ng-href=\"{{subject.link}}\" title=\"{{subject.subject}}\">{{subject.subject}}</a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("staff-directory/staff-directory-facets.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-directory/staff-directory-facets.tpl.html",
    "<form class=\"facets-form form-inline text-center\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <input class=\"form-control\" id=\"directorySearch\" name=\"directorySearch\" type=\"text\" ng-model=\"staffdir.facet.search\" placeholder=\"Search...\" ng-keyup=\"clearFacet('subject')\"/>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group hidden-xs\">\n" +
    "        <strong class=\"text-center\">OR</strong>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group hidden-xs\">\n" +
    "        <select class=\"form-control\" ng-model=\"staffdir.facet.subject\" name=\"subject\" ng-options=\"subject.subject for subject in facets.subjects\" ng-change=\"clearFacet('search')\">\n" +
    "            <option value=\"\">Choose Expertise</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "    <button class=\"btn btn-primary hidden-xs\" type=\"button\" ng-click=\"clearFacet('search', 'subject')\">\n" +
    "        <span class=\"fa fa-refresh\"></span> Reset Filters\n" +
    "    </button>\n" +
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
    "                   ng-class=\"{'sortable': !staffdir.sortReverse && staffdir.sortBy == 'lastname', 'sortable-reverse': staffdir.sortReverse && staffdir.sortBy == 'lastname'}\">Name</a>\n" +
    "            </th>\n" +
    "            <th class=\"hidden-xs\">\n" +
    "                <a href=\"#\" \n" +
    "                   ng-click=\"sortList($event, 'title')\" \n" +
    "                   ng-class=\"{'sortable': !staffdir.sortReverse && staffdir.sortBy == 'title', 'sortable-reverse': staffdir.sortReverse && staffdir.sortBy == 'title'}\">Title</a>\n" +
    "            </th>\n" +
    "            <th class=\"hidden-xs\">\n" +
    "                <a href=\"#\" \n" +
    "                   ng-click=\"sortList($event, 'department')\" \n" +
    "                   ng-class=\"{'sortable': !staffdir.sortReverse && staffdir.sortBy == 'department', 'sortable-reverse': staffdir.sortReverse && staffdir.sortBy == 'department'}\">Department/Unit</a>\n" +
    "            </th>\n" +
    "            <th>Contact</th>\n" +
    "            <th class=\"hidden-xs hidden-sm\">Expertise</th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "        <tr ng-repeat=\"(column, person) in list | filter:staffdir.facet.search | filter:staffdir.facet.subject.subject:true | orderBy:staffdir.sortBy:staffdir.sortReverse track by  person.id \">\n" +
    "            <td class=\"text-nowrap\">\n" +
    "                <div ng-if=\"person.rank\" class=\"text-muted\"> {{person.rank}}</div>\n" +
    "                <span ng-bind-html=\"person.firstname | highlight:staffdir.facet.search\"></span> <strong ng-bind-html=\"person.lastname | highlight:staffdir.facet.search\"></strong>\n" +
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
    "            <td class=\"hidden-xs\">\n" +
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
    "</div>");
}]);

angular.module("staff-directory/staff-directory.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staff-directory/staff-directory.tpl.html",
    "<h1 class=\"page-header\">Staff Directory</h1>\n" +
    "<div class=\"staff-directory-facets\" facets=\"staffdir.facets\"></div>\n" +
    "<div class=\"staff-directory-listing\" list=\"staffdir.list\" sort-by=\"lastname\"></div>");
}]);
;angular.module('ualib.staffdir', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngSanitize',
    'angular.filter',
    'ui.bootstrap',
    'ui.utils',
    'ualib.ui',
    'ualib.staffdir.templates'
]);

//Alias for demo purposes
angular.module('staffdir', ['ualib.staffdir']);
;angular.module('ualib.staffdir')

    .service('StaffDirectoryService', [function(){
        var self = this; //ensures proper contest in closure statements
        this.sortBy = ''; // Default sort column, can be overridden via 'sortBy' attribute for staffDirectory directive
        this.sortReverse = false; // Default sort direction
        this.sortable = {}; // reference object for sortable columns
        this.facet = {}; // Object to hold filter values based on available facets (empty object means no filtering).

        // reset all facets
        this.resetFacets = function(){
            self.facet = {};
        };


        // Accepts string or array arguments of facets to clear
        this.clearFacets = function(){
            var copy = {};
            var omitKeys = Array.prototype.concat.apply(Array.prototype, arguments);
            console.log(omitKeys);

            Object.keys(self.facet).map(function(key){
                if (omitKeys.indexOf(key) === -1) {
                    copy[key] = self.facet[key];
                }
            });
            console.log(copy);
            angular.copy(copy, self.facet);
            console.log(self.facet);
        };

        /**
         * Inspired by Angular UI Router library omit() function
         * https://github.com/angular-ui/ui-router/blob/master/src/common.js
         */
        // extracted from underscore.js
        // Return a copy of the object omitting the blacklisted properties.
        function omit(obj) {
            var copy = {};
            var omitKeys = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
            console.log(omitKeys);
            Object.keys(obj).map(function(key, index){
                if (omitKeys.indexOf(key) === -1) {
                    copy[key] = obj[key];
                }
            });
            return copy;
        }
    }]);;angular.module('ualib.staffdir')

    .factory('StaffFactory', ['$resource', function($resource){
        return {
            directory: function(){
                return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/people', {}, {cache: true});
            },
            person: function(){
                return $resource('https://wwwdev2.lib.ua.edu/staffDir/api/person', {}, {cache: true});
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
            controller: function($scope){
                $scope.staffdir = {};

                StaffFactory.directory().get()
                    .$promise.then(function(data){
                        // get list of people
                        $scope.staffdir = data.list;

                    }, function(){
                        console.log('Staffdir Error -- Come on, put in proper error handling already');
                    });
            }
        };
    }])

    .directive('staffCard', [function(){
        return {
            restrict: 'AC',
            scope: {
                staffPerson: '='
            },
            templateUrl: 'staff-card/staff-card.tpl.html'
        };
    }]);

;angular.module('ualib.staffdir')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/staffdir', {
            controller: 'StaffDirCtrl',
            templateUrl: 'staff-directory/staff-directory.tpl.html',
            resolve: {
                StaffDir: ['StaffFactory', '$filter', function(StaffFactory, $filter){
                    var staff = {
                        list: [], // Array for directory listing
                        facets: {} //Object for available facets
                    };

                    function extend(target) {
                        var sources = [].slice.call(arguments, 1);
                        sources.forEach(function (source) {
                            for (var prop in source) {
                                target[prop] = source[prop];
                            }
                        });
                        return target;
                    }

                    return StaffFactory.directory().get()
                        .$promise.then(function(data){
                            // Build new object of only subject that currently have a subject/research expert
                            var subj = [];
                            angular.forEach(data.list, function(val){
                                if (angular.isDefined(val.subjects) && val.subjects.length > 0){
                                    angular.forEach(val.subjects, function(subject){
                                        subj.push(subject);
                                    });
                                }
                            });
                            subj = $filter('unique')(subj, 'subject');
                            subj = $filter('orderBy')(subj, 'subject');
                            staff.facets.subjects = subj;
                            // get list of people
                            staff.list = data.list;

                            return staff;
                        }, function(data, status){
                            console.log('Error' + status + ': ' + data);
                            return staff;
                        });
                }]
            }
        });
    }])

    .controller('StaffDirCtrl', ['$scope', 'StaffDir', function($scope, StaffDir){
        $scope.staffdir = StaffDir;
    }])

    .directive('staffDirectoryListing', ['StaffDirectoryService', function(SDS){
        return {
            restrict: 'AC',
            scope: {
                list: '=',
                sortBy: '@'
            },
            templateUrl: 'staff-directory/staff-directory-listing.tpl.html',
            controller: function($scope, $element){
                $scope.staffdir = SDS;

                SDS.sortBy = angular.isDefined($scope.sortBy) ? $scope.sortBy : 'lastname';
                SDS.sortable = $scope.sortable;

                // Not good practice, but done for brevity's sake
                // TODO: have sort functions event listeners defined in linking function and not via ng-click
                $scope.sortList = function(ev, column){
                    ev. preventDefault();

                    if (SDS.sortBy === column){
                        SDS.sortReverse = !SDS.sortReverse;
                    }
                    else {
                        SDS.sortBy = column;
                        SDS.sortReverse = false;
                    }
                };
            }
        };
    }])

    .directive('staffDirectoryFacets', ['StaffDirectoryService', function(SDS){
        return {
            restrict: 'AC',
            scope: {
                facets: '='
            },
            templateUrl: 'staff-directory/staff-directory-facets.tpl.html',
            controller: function($scope){
                $scope.staffdir = SDS;

                $scope.clearFacet = function(){
                    var copy = {};
                    var omitKeys = Array.prototype.concat.apply(Array.prototype, arguments);

                    Object.keys(SDS.facet).map(function(key){
                        if (omitKeys.indexOf(key) === -1) {
                            copy[key] = SDS.facet[key];
                        }
                    });
                    SDS.facet = copy;

                };
            }
        };
    }]);;angular.module('ualib.softwareList.templates', ['software-list/software-list.tpl.html']);

angular.module("software-list/software-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("software-list/software-list.tpl.html",
    "<div class=\"page-header\"><h1>Libraries' Software List</h1></div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-3 col-md-push-9\">\n" +
    "        <form>\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"soft.search\" placeholder=\"Search software, locations, etc...\" ng-change=\"update()\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"btn-group btn-group-justified\">\n" +
    "                    <label class=\"btn btn-default active\" ng-model=\"soft.os\" btn-radio=\"''\" ng-change=\"update()\" uncheckable>All</label>\n" +
    "                    <label class=\"btn btn-default\" ng-model=\"soft.os\" btn-radio=\"'1'\" ng-change=\"update()\" uncheckable><span class=\"fa fa-fw fa-windows\"></span></label>\n" +
    "                    <label class=\"btn btn-default\" ng-model=\"soft.os\" btn-radio=\"'2'\" ng-change=\"update()\" uncheckable><span class=\"fa fa-fw fa-apple\"></span></label>\n" +
    "                    <label class=\"btn btn-default\" ng-model=\"soft.os\" btn-radio=\"'3'\" ng-change=\"update()\" uncheckable><span class=\"fa fa-fw fa-linux\"></span></label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group hidden-xs\">\n" +
    "                <h5>Locations</h5>\n" +
    "                <div class=\"radio\">\n" +
    "                    <label>\n" +
    "                        <input type=\"radio\" value=\"\" ng-model=\"soft.loc\" ng-change=\"update()\" checked>\n" +
    "                        All Locations\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "                <div class=\"radio\" ng-repeat=\"loc in software.locations\">\n" +
    "                    <label>\n" +
    "                        <input type=\"radio\" value=\"{{loc.name}}\" ng-model=\"soft.loc\" ng-change=\"update()\">\n" +
    "                        {{loc.name}}\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group hidden-xs\">\n" +
    "                <h5>Categories</h5>\n" +
    "                <div class=\"radio\">\n" +
    "                    <label>\n" +
    "                        <input type=\"radio\" value=\"\" ng-model=\"soft.cat\" ng-change=\"update()\">\n" +
    "                        All categories\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "                <div class=\"radio\" ng-repeat=\"cat in software.categories\">\n" +
    "                    <label>\n" +
    "                        <input type=\"radio\" value=\"{{cat.name}}\" ng-model=\"soft.cat\" ng-change=\"update()\">\n" +
    "                        {{cat.name}}\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-9 col-md-pull-3 software-list-container\">\n" +
    "        <div class=\"text-center\">\n" +
    "            <pagination total-items=\"filteredSoft.length\" ng-model=\"soft.page\" max-size=\"10\" class=\"pagination-sm\" boundary-links=\"true\" items-per-page=\"soft.perPage\" ng-change=\"update()\" ng-if=\"filteredSoft.length > soft.perPage\"></pagination>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"media\" ng-repeat=\"item in filteredSoft = (software.software | filter:soft.cat | filter:soft.loc | filter:soft.search | filterBy:['os']:soft.os)\">\n" +
    "            <div class=\"media-left\">\n" +
    "                <img class=\"media-object\" ng-src=\"{{item.icon}}\" alt=\"{{item.title}}\" title=\"{{item.title}}\">\n" +
    "            </div>\n" +
    "            <div class=\"media-body\">\n" +
    "                <h4 class=\"media-heading\">\n" +
    "                    {{item.title}}\n" +
    "                    <small ng-repeat=\"ver in item.versions\" class=\"software-versions\"><span class=\"fa fa-{{ver.osName}} text-muted\"></span> {{ver.version}}</small>\n" +
    "                </h4>\n" +
    "\n" +
    "                <div class=\"details-context\">\n" +
    "                    <span ng-repeat=\"loc in item.locations\">{{loc.name}}</span>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    {{item.description}}\n" +
    "                </div>\n" +
    "                <div class=\"details hidden-xs\">\n" +
    "                    <div class=\"software-links pull-left\">\n" +
    "                        <h5>Tutorials &amp; Guides</h5>\n" +
    "                        <ul>\n" +
    "                            <li ng-repeat=\"link in item.links\">\n" +
    "                                <a ng-href=\"{{link.url}}\">{{link.title}}</a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                    <div class=\"pull-left\">\n" +
    "                        <h5>Who can use it</h5>\n" +
    "                        <span ng-bind-html=\"item.details\"></span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"text-center\">\n" +
    "            <pagination total-items=\"filteredSoft.length\" ng-model=\"soft.page\" max-size=\"10\" class=\"pagination-sm\" boundary-links=\"true\" items-per-page=\"soft.perPage\" ng-change=\"update()\" ng-if=\"filteredSoft.length > soft.perPage\"></pagination>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
;angular.module('ualib.softwareList', [
    'ngRoute',
    'ngResource',
    'ngSanitize',
    'angular.filter',
    'ui.bootstrap',
    'ualib.ui',
    'ualib.softwareList.templates'
]);;angular.module('ualib.softwareList')

    .factory('softwareFactory', ['$resource', function($resource){
        return $resource('https://wwwdev2.lib.ua.edu/softwareList/api/:software');
    }]);;angular.module('ualib.softwareList')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/software', {
                reloadOnSearch: false,
                resolve: {
                    software: function(softwareFactory){
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
                    }
                },
                templateUrl: 'software-list/software-list.tpl.html',
                controller: 'SoftwareListCtrl'
            });
    }])

    .controller('SoftwareListCtrl', ['$scope', 'software', '$location', function($scope, software, $location){
        var params = $location.search();
        var soft = $scope.soft = {};
        var defaults = {
            os: '',
            search: '',
            cat: '',
            loc: '',
            page: 1,
            perPage: 20
        };
        angular.copy(defaults, $scope.soft);
        angular.extend($scope.soft, params);

        $scope.software = software;


        $scope.update = function(){
            var q = {};
            angular.forEach(soft, function(val, key){
               if (angular.isDefined(val) && val !== ''){
                   q[key] = val;
               }
            });
            $location.search(q);
        };


    }]);;angular.module('ualib.templates', ['../assets/js/_ualib-home.tpl.html']);

angular.module("../assets/js/_ualib-home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../assets/js/_ualib-home.tpl.html",
    "<div class=\"home-slice\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-6 col-md-push-6\" style=\"padding: 15px; background-color: rgba(255,255,255,.9);\">\n" +
    "            <div class=\"hours-list\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-pull-6\" style=\"padding: 15px; background-color: rgba(255,255,255,.9); display: table;\">\n" +
    "            <div class=\"view-news-events-exhibitions\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
;/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can 
 * always reference jQuery with $, even when in .noConflict() mode.
 *
 * Google CDN, Latest jQuery
 * To use the default WordPress version of jQuery, go to lib/config.php and
 * remove or comment out: add_theme_support('jquery-cdn');
 * ======================================================================== */
/*
(function($) {

// Use this variable to set up the common and page specific functions. If you 
// rename this variable, you will also need to rename the namespace below.
var Roots = {
  // All pages
  common: {
    init: function() {
      // JavaScript to be fired on all pages
    }
  },
  // Home page
  home: {
    init: function() {
      // JavaScript to be fired on the home page
    }
  },
  // About us page, note the change from about-us to about_us.
  about_us: {
    init: function() {
      // JavaScript to be fired on the about us page
    }
  }
};

// The routing fires all common scripts, followed by the page specific scripts.
// Add additional events for more control over timing e.g. a finalize event
var UTIL = {
  fire: function(func, funcname, args) {
    var namespace = Roots;
    funcname = (funcname === undefined) ? 'init' : funcname;
    if (func !== '' && namespace[func] && typeof namespace[func][funcname] === 'function') {
      namespace[func][funcname](args);
    }
  },
  loadEvents: function() {
    UTIL.fire('common');

    $.each(document.body.className.replace(/-/g, '_').split(/\s+/),function(i,classnm) {
      UTIL.fire(classnm);
    });
  }
};

$(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.*/
;angular.module('ualib', [
    'ngRoute',
    'ualib.templates',
    'ualib.ui',
    'hours',
    'oneSearch',
    'manage',
    'ualib.databases',
    'musicSearch',
    'ualib.staffdir',
    'ualib.softwareList'
])

    .config(['$routeProvider', function($routeProvider, $location) {
        /**
         * Register Bento Box display route with ngRoute's $routeProvider
         */
        $routeProvider
            .when('/home', {
                templateUrl: '../assets/js/_ualib-home.tpl.html'
            })
            .otherwise({
                redirectTo: '/home'
            });
    }])

    .run(['$routeParams', '$location', '$rootScope', function($routeParams, $location, $rootScope){
        $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
            $rootScope.appClass = $location.path().split('/')[1];
            if ($rootScope.appClass === 'home'){
                $rootScope.appClass = 'front-page';
            }
            $rootScope.appClass += ' webapp';
        });
    }]);
