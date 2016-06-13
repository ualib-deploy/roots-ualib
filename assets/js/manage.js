/**
 * Binds a TinyMCE widget to <textarea> elements.
 */
angular.module('ui.tinymce', [])
  .value('uiTinymceConfig', {})
  .directive('uiTinymce', ['$rootScope', '$compile', '$timeout', '$window', '$sce', 'uiTinymceConfig', function($rootScope, $compile, $timeout, $window, $sce, uiTinymceConfig) {
    uiTinymceConfig = uiTinymceConfig || {};
    var generatedIds = 0;
    var ID_ATTR = 'ui-tinymce';
    if (uiTinymceConfig.baseUrl) {
      tinymce.baseURL = uiTinymceConfig.baseUrl;
    }

    return {
      require: ['ngModel', '^?form'],
      link: function(scope, element, attrs, ctrls) {
        if (!$window.tinymce) {
          return;
        }

        var ngModel = ctrls[0],
          form = ctrls[1] || null;

        var expression, options = {}, tinyInstance,
          updateView = function(editor) {
            var content = editor.getContent({format: options.format}).trim();
            content = $sce.trustAsHtml(content);

            ngModel.$setViewValue(content);
            if (!$rootScope.$$phase) {
              scope.$apply();
            }
          };

        function toggleDisable(disabled) {
          if (disabled) {
            ensureInstance();

            if (tinyInstance) {
              tinyInstance.getBody().setAttribute('contenteditable', false);
            }
          } else {
            ensureInstance();

            if (tinyInstance && !tinyInstance.settings.readonly) {
              tinyInstance.getBody().setAttribute('contenteditable', true);
            }
          }
        }

        // generate an ID
        attrs.$set('id', ID_ATTR + '-' + generatedIds++);

        expression = {};

        angular.extend(expression, scope.$eval(attrs.uiTinymce));

        var setupOptions = {
          // Update model when calling setContent
          // (such as from the source editor popup)
          setup: function(ed) {
            ed.on('init', function() {
              ngModel.$render();
              ngModel.$setPristine();
              if (form) {
                form.$setPristine();
              }
            });

            // Update model on button click
            ed.on('ExecCommand', function() {
              ed.save();
              updateView(ed);
            });

            // Update model on change
            ed.on('change NodeChange', function() {
              ed.save();
              updateView(ed);
            });

            ed.on('blur', function() {
              element[0].blur();
            });

            // Update model when an object has been resized (table, image)
            ed.on('ObjectResized', function() {
              ed.save();
              updateView(ed);
            });

            ed.on('remove', function() {
              element.remove();
            });

            if (expression.setup) {
              expression.setup(ed, {
                updateView: updateView
              });
            }
          },
          format: expression.format || 'html',
          selector: '#' + attrs.id
        };
        // extend options with initial uiTinymceConfig and
        // options from directive attribute value
        angular.extend(options, uiTinymceConfig, expression, setupOptions);
        // Wrapped in $timeout due to $tinymce:refresh implementation, requires
        // element to be present in DOM before instantiating editor when
        // re-rendering directive
        $timeout(function() {
          if (options.baseURL){
            tinymce.baseURL = options.baseURL;            
          }
          tinymce.init(options);
          toggleDisable(scope.$eval(attrs.ngDisabled));
        });

        ngModel.$formatters.unshift(function(modelValue) {
          return modelValue ? $sce.trustAsHtml(modelValue) : '';
        });

        ngModel.$parsers.unshift(function(viewValue) {
          return viewValue ? $sce.getTrustedHtml(viewValue) : '';
        });

        ngModel.$render = function() {
          ensureInstance();

          var viewValue = ngModel.$viewValue ?
            $sce.getTrustedHtml(ngModel.$viewValue) : '';

          // instance.getDoc() check is a guard against null value
          // when destruction & recreation of instances happen
          if (tinyInstance &&
            tinyInstance.getDoc()
          ) {
            tinyInstance.setContent(viewValue);
            // Triggering change event due to TinyMCE not firing event &
            // becoming out of sync for change callbacks
            tinyInstance.fire('change');
          }
        };

        attrs.$observe('disabled', toggleDisable);

        // This block is because of TinyMCE not playing well with removal and
        // recreation of instances, requiring instances to have different
        // selectors in order to render new instances properly
        scope.$on('$tinymce:refresh', function(e, id) {
          var eid = attrs.id;
          if (angular.isUndefined(id) || id === eid) {
            var parentElement = element.parent();
            var clonedElement = element.clone();
            clonedElement.removeAttr('id');
            clonedElement.removeAttr('style');
            clonedElement.removeAttr('aria-hidden');
            tinymce.execCommand('mceRemoveEditor', false, eid);
            parentElement.append($compile(clonedElement)(scope));
          }
        });

        scope.$on('$destroy', function() {
          ensureInstance();

          if (tinyInstance) {
            tinyInstance.remove();
            tinyInstance = null;
          }
        });

        function ensureInstance() {
          if (!tinyInstance) {
            tinyInstance = tinymce.get(attrs.id);
          }
        }
      }
    };
  }]);

/**!
 * AngularJS file upload/drop directive and service with progress and abort
 * @author  Danial  <danial.farid@gmail.com>
 * @version 7.0.17
 */

if (window.XMLHttpRequest && !(window.FileAPI && FileAPI.shouldLoad)) {
  window.XMLHttpRequest.prototype.setRequestHeader = (function (orig) {
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
    };
  })(window.XMLHttpRequest.prototype.setRequestHeader);
}

var ngFileUpload = angular.module('ngFileUpload', []);

ngFileUpload.version = '7.0.17';

ngFileUpload.service('UploadBase', ['$http', '$q', '$timeout', function ($http, $q, $timeout) {
  function sendHttp(config) {
    config.method = config.method || 'POST';
    config.headers = config.headers || {};

    var deferred = $q.defer();
    var promise = deferred.promise;

    config.headers.__setXHR_ = function () {
      return function (xhr) {
        if (!xhr) return;
        config.__XHR = xhr;
        if (config.xhrFn) config.xhrFn(xhr);
        xhr.upload.addEventListener('progress', function (e) {
          e.config = config;
          if (deferred.notify) {
            deferred.notify(e);
          } else if (promise.progressFunc) {
            $timeout(function () {
              promise.progressFunc(e);
            });
          }
        }, false);
        //fix for firefox not firing upload progress end, also IE8-9
        xhr.upload.addEventListener('load', function (e) {
          if (e.lengthComputable) {
            e.config = config;
            if (deferred.notify) {
              deferred.notify(e);
            } else if (promise.progressFunc) {
              $timeout(function () {
                promise.progressFunc(e);
              });
            }
          }
        }, false);
      };
    };

    $http(config).then(function (r) {
      deferred.resolve(r);
    }, function (e) {
      deferred.reject(e);
    }, function (n) {
      deferred.notify(n);
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
      promise.progressFunc = fn;
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
          if (origXhrFn) origXhrFn.apply(promise, arguments);
          fn.apply(promise, arguments);
        };
      })(config.xhrFn);
      return promise;
    };

    return promise;
  }

  this.upload = function (config) {
    function addFieldToFormData(formData, val, key) {
      if (val !== undefined) {
        if (angular.isDate(val)) {
          val = val.toISOString();
        }
        if (angular.isString(val)) {
          formData.append(key, val);
        } else if (config.sendFieldsAs === 'form') {
          if (angular.isObject(val)) {
            for (var k in val) {
              if (val.hasOwnProperty(k)) {
                addFieldToFormData(formData, val[k], key + '[' + k + ']');
              }
            }
          } else {
            formData.append(key, val);
          }
        } else {
          val = angular.isString(val) ? val : angular.toJson(val);
          if (config.sendFieldsAs === 'json-blob') {
            formData.append(key, new Blob([val], {type: 'application/json'}));
          } else {
            formData.append(key, val);
          }
        }
      }
    }

    config.headers = config.headers || {};
    config.headers['Content-Type'] = undefined;
    config.transformRequest = config.transformRequest ?
      (angular.isArray(config.transformRequest) ?
        config.transformRequest : [config.transformRequest]) : [];
    config.transformRequest.push(function (data) {
      var formData = new FormData();
      var allFields = {};
      var key;
      for (key in config.fields) {
        if (config.fields.hasOwnProperty(key)) {
          allFields[key] = config.fields[key];
        }
      }
      if (data) allFields.data = data;
      for (key in allFields) {
        if (allFields.hasOwnProperty(key)) {
          var val = allFields[key];
          if (config.formDataAppender) {
            config.formDataAppender(formData, key, val);
          } else {
            addFieldToFormData(formData, val, key);
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
    config.transformRequest = config.transformRequest || function (data) {
        if ((window.ArrayBuffer && data instanceof window.ArrayBuffer) || data instanceof Blob) {
          return data;
        }
        return $http.defaults.transformRequest[0].apply(this, arguments);
      };
    return sendHttp(config);
  };

  this.setDefaults = function(defaults) {
    this.defaults = defaults || {};
  };

  this.defaults = {};
  this.version = ngFileUpload.version;
}

]);

(function () {

  ngFileUpload.service('Upload', ['$parse', '$timeout', '$compile', 'UploadValidate',
    function ($parse, $timeout, $compile, UploadValidate) {
      var upload = UploadValidate;
      upload.getAttrWithDefaults = function (attr, name) {
        return attr[name] != null ? attr[name] :
          (upload.defaults[name] == null ?
            upload.defaults[name] : upload.defaults[name].toString());
      };

      upload.attrGetter = function (name, attr, scope, params) {
        if (scope) {
          try {
            if (params) {
              return $parse(this.getAttrWithDefaults(attr, name))(scope, params);
            } else {
              return $parse(this.getAttrWithDefaults(attr, name))(scope);
            }
          } catch (e) {
            // hangle string value without single qoute
            if (name.search(/min|max|pattern/i)) {
              return this.getAttrWithDefaults(attr, name);
            } else {
              throw e;
            }
          }
        } else {
          return this.getAttrWithDefaults(attr, name);
        }
      };

      upload.updateModel = function (ngModel, attr, scope, fileChange, files, evt, noDelay) {
        function update() {
          var file = files && files.length ? files[0] : null;
          if (ngModel) {
            var singleModel = !upload.attrGetter('ngfMultiple', attr, scope) && !upload.attrGetter('multiple', attr) && !keep;
            $parse(upload.attrGetter('ngModel', attr)).assign(scope, singleModel ? file : files);
          }
          var ngfModel = upload.attrGetter('ngfModel', attr);
          if (ngfModel) {
            $parse(ngfModel).assign(scope, files);
          }

          if (fileChange) {
            $parse(fileChange)(scope, {
              $files: files,
              $file: file,
              $event: evt
            });
          }
          // scope apply changes
          $timeout(function(){});
        }

        var keep = upload.attrGetter('ngfKeep', attr, scope);
        if (keep === true) {
          if (!files || !files.length) {
            return;
          } else {
            var prevFiles = ((ngModel && ngModel.$modelValue) || attr.$$ngfPrevFiles || []).slice(0),
              hasNew = false;
            if (upload.attrGetter('ngfKeepDistinct', attr, scope) === true) {
              var len = prevFiles.length;
              for (var i = 0; i < files.length; i++) {
                for (var j = 0; j < len; j++) {
                  if (files[i].name === prevFiles[j].name) break;
                }
                if (j === len) {
                  prevFiles.push(files[i]);
                  hasNew = true;
                }
              }
              if (!hasNew) return;
              files = prevFiles;
            } else {
              files = prevFiles.concat(files);
            }
          }
        }

        attr.$$ngfPrevFiles = files;

        if (noDelay) {
          update();
        } else if (upload.validate(files, ngModel, attr, scope, upload.attrGetter('ngfValidateLater', attr), function () {
            $timeout(function () {
              update();
            });
          }));
      };

      return upload;
    }]);
})();

(function () {
  var generatedElems = [];

  ngFileUpload.directive('ngfSelect', ['$parse', '$timeout', '$compile', 'Upload',
    function ($parse, $timeout, $compile, Upload) {
      return {
        restrict: 'AEC',
        require: '?ngModel',
        link: function (scope, elem, attr, ngModel) {
          linkFileSelect(scope, elem, attr, ngModel, $parse, $timeout, $compile, Upload);
        }
      };
    }]);

  function linkFileSelect(scope, elem, attr, ngModel, $parse, $timeout, $compile, upload) {
    /** @namespace attr.ngfSelect */
    /** @namespace attr.ngfChange */
    /** @namespace attr.ngModel */
    /** @namespace attr.ngfModel */
    /** @namespace attr.ngfMultiple */
    /** @namespace attr.ngfCapture */
    /** @namespace attr.ngfValidate */
    /** @namespace attr.ngfKeep */
    /** @namespace attr.ngfKeepDistinct */
    var attrGetter = function (name, scope) {
      return upload.attrGetter(name, attr, scope);
    };

    function isInputTypeFile() {
      return elem[0].tagName.toLowerCase() === 'input' && attr.type && attr.type.toLowerCase() === 'file';
    }

    function fileChangeAttr() {
      return attrGetter('ngfChange') || attrGetter('ngfSelect');
    }

    function changeFn(evt) {
      var fileList = evt.__files_ || (evt.target && evt.target.files), files = [];
      for (var i = 0; i < fileList.length; i++) {
        files.push(fileList[i]);
      }
      upload.updateModel(ngModel, attr, scope, fileChangeAttr(), files.length ? files : null, evt);
    }

    var unwatches = [];
    unwatches.push(scope.$watch(attrGetter('ngfMultiple'), function() {
      fileElem.attr('multiple', attrGetter('ngfMultiple', scope));
    }));
    unwatches.push(scope.$watch(attrGetter('ngfCapture'), function() {
      fileElem.attr('capture', attrGetter('ngfCapture', scope));
    }));
    attr.$observe('accept', function() {
      fileElem.attr('accept', attrGetter('accept'));
    });
    unwatches.push(function () {
      if (attr.$$observers) delete attr.$$observers.accept;
    });
    function bindAttrToFileInput(fileElem) {
      if (elem !== fileElem) {
        for (var i = 0; i < elem[0].attributes.length; i++) {
          var attribute = elem[0].attributes[i];
          if (attribute.name !== 'type' && attribute.name !== 'class' &&
            attribute.name !== 'id' && attribute.name !== 'style') {
            if (attribute.value == null || attribute.value === '') {
              if (attribute.name === 'required') attribute.value = 'required';
              if (attribute.name === 'multiple') attribute.value = 'multiple';
            }
            fileElem.attr(attribute.name, attribute.value);
          }
        }
      }
    }

    function createFileInput() {
      if (isInputTypeFile()) {
        return elem;
      }

      var fileElem = angular.element('<input type="file">');
      bindAttrToFileInput(fileElem);

      fileElem.css('visibility', 'hidden').css('position', 'absolute').css('overflow', 'hidden')
        .css('width', '0px').css('height', '0px').css('border', 'none')
        .css('margin', '0px').css('padding', '0px').attr('tabindex', '-1');
      generatedElems.push({el: elem, ref: fileElem});
      document.body.appendChild(fileElem[0]);

      return fileElem;
    }

    var initialTouchStartY = 0;

    function clickHandler(evt) {
      if (elem.attr('disabled') || attrGetter('ngfSelectDisabled', scope)) return false;

      var r = handleTouch(evt);
      if (r != null) return r;

      resetModel(evt);

      // fix for android native browser < 4.4
      if (shouldClickLater(navigator.userAgent)) {
        setTimeout(function () {
          fileElem[0].click();
        }, 0);
      } else {
        fileElem[0].click();
      }

      return false;
    }

    function handleTouch(evt) {
      var touches = evt.changedTouches || (evt.originalEvent && evt.originalEvent.changedTouches);
      if (evt.type === 'touchstart') {
        initialTouchStartY = touches ? touches[0].clientY : 0;
        return true; // don't block event default
      } else {
        evt.stopPropagation();
        evt.preventDefault();

        // prevent scroll from triggering event
        if (evt.type === 'touchend') {
          var currentLocation = touches ? touches[0].clientY : 0;
          if (Math.abs(currentLocation - initialTouchStartY) > 20) return false;
        }
      }
    }

    function shouldClickLater(ua) {
      // android below 4.4
      var m = ua.match(/Android[^\d]*(\d+)\.(\d+)/);
      if (m && m.length > 2) {
        var v = upload.defaults.androidFixMinorVersion || 4;
        return parseInt(m[1]) < 4 || (parseInt(m[1]) === v && parseInt(m[2]) < v);
      }

      // safari on windows
      return ua.indexOf('Chrome') === -1 && /.*Windows.*Safari.*/.test(ua);
    }

    var fileElem = elem;

    function resetModel(evt) {
      if (fileElem.val()) {
        fileElem.val(null);
        upload.updateModel(ngModel, attr, scope, fileChangeAttr(), null, evt, true);
      }
    }

    if (!isInputTypeFile()) {
      fileElem = createFileInput();
    }
    fileElem.bind('change', changeFn);

    if (!isInputTypeFile()) {
      elem.bind('click touchstart touchend', clickHandler);
    } else {
      elem.bind('click', resetModel);
    }

    upload.registerValidators(ngModel, fileElem, attr, scope);

    function ie10SameFileSelectFix(evt) {
      if (fileElem && !fileElem.attr('__ngf_ie10_Fix_')) {
        if (!fileElem[0].parentNode) {
          fileElem = null;
          return;
        }
        evt.preventDefault();
        evt.stopPropagation();
        fileElem.unbind('click');
        var clone = fileElem.clone();
        fileElem.replaceWith(clone);
        fileElem = clone;
        fileElem.attr('__ngf_ie10_Fix_', 'true');
        fileElem.bind('change', changeFn);
        fileElem.bind('click', ie10SameFileSelectFix);
        fileElem[0].click();
        return false;
      } else {
        fileElem.removeAttr('__ngf_ie10_Fix_');
      }
    }

    if (navigator.appVersion.indexOf('MSIE 10') !== -1) {
      fileElem.bind('click', ie10SameFileSelectFix);
    }

    scope.$on('$destroy', function () {
      if (!isInputTypeFile()) fileElem.remove();
      angular.forEach(unwatches, function(unwatch) {
        unwatch();
      });
    });

    $timeout(function() {
      for (var i = 0; i < generatedElems.length; i++) {
        var g = generatedElems[i];
        if (!document.body.contains(g.el[0])) {
          generatedElems.splice(i, 1);
          g.ref.remove();
        }
      }
    });

    if (window.FileAPI && window.FileAPI.ngfFixIE) {
      window.FileAPI.ngfFixIE(elem, fileElem, changeFn);
    }
  }
})();

(function () {

  ngFileUpload.service('UploadDataUrl', ['UploadBase', '$timeout', '$q', function (UploadBase, $timeout, $q) {
    var upload = UploadBase;
    upload.dataUrl = function (file, disallowObjectUrl) {
      if ((disallowObjectUrl && file.dataUrl != null) || (!disallowObjectUrl && file.blobUrl != null)) {
        var d = $q.defer();
        $timeout(function () {
          d.resolve(disallowObjectUrl ? file.dataUrl : file.blobUrl);
        });
        return d.promise;
      }
      var p = disallowObjectUrl ? file.$ngfDataUrlPromise : file.$ngfBlobUrlPromise;
      if (p) return p;

      var deferred = $q.defer();
      $timeout(function () {
        if (window.FileReader && file &&
          (!window.FileAPI || navigator.userAgent.indexOf('MSIE 8') === -1 || file.size < 20000) &&
          (!window.FileAPI || navigator.userAgent.indexOf('MSIE 9') === -1 || file.size < 4000000)) {
          //prefer URL.createObjectURL for handling refrences to files of all sizes
          //since it doesn´t build a large string in memory
          var URL = window.URL || window.webkitURL;
          if (URL && URL.createObjectURL && !disallowObjectUrl) {
            var url;
            try {
              url = URL.createObjectURL(file);
            } catch (e) {
              $timeout(function () {
                file.blobUrl = '';
                deferred.reject();
              });
              return;
            }
            $timeout(function () {
              file.blobUrl = url;
              if (url) deferred.resolve(url);
            });
          } else {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
              $timeout(function () {
                file.dataUrl = e.target.result;
                deferred.resolve(e.target.result);
              });
            };
            fileReader.onerror = function () {
              $timeout(function () {
                file.dataUrl = '';
                deferred.reject();
              });
            };
            fileReader.readAsDataURL(file);
          }
        } else {
          $timeout(function () {
            file[disallowObjectUrl ? 'dataUrl' : 'blobUrl'] = '';
            deferred.reject();
          });
        }
      });

      if (disallowObjectUrl) {
        p = file.$ngfDataUrlPromise = deferred.promise;
      } else {
        p = file.$ngfBlobUrlPromise = deferred.promise;
      }
      p['finally'](function () {
        delete file[disallowObjectUrl ? '$ngfDataUrlPromise' : '$ngfBlobUrlPromise'];
      });
      return p;
    };
    return upload;
  }]);

  function getTagType(el) {
    if (el.tagName.toLowerCase() === 'img') return 'image';
    if (el.tagName.toLowerCase() === 'audio') return 'audio';
    if (el.tagName.toLowerCase() === 'video') return 'video';
    return /\./;
  }

  var style = angular.element('<style>.ngf-hide{display:none !important}</style>');
  document.getElementsByTagName('head')[0].appendChild(style[0]);

  /** @namespace attr.ngfSrc */
  /** @namespace attr.ngfNoObjectUrl */
  ngFileUpload.directive('ngfSrc', ['$compile', '$timeout', 'Upload', function ($compile, $timeout, Upload) {
    return {
      restrict: 'AE',
      link: function (scope, elem, attr) {
        $timeout(function () {
          var unwatch = scope.$watch(attr.ngfSrc, function (file) {
            if (angular.isString(file)) {
              elem.removeClass('ngf-hide');
              return elem.attr('src', file);
            }
            if (file && file.type && file.type.indexOf(getTagType(elem[0])) === 0) {
              var disallowObjectUrl = Upload.attrGetter('ngfNoObjectUrl', attr, scope);
              Upload.dataUrl(file, disallowObjectUrl)['finally'](function () {
                $timeout(function () {
                  if ((disallowObjectUrl && file.dataUrl) || (!disallowObjectUrl && file.blobUrl)) {
                    elem.removeClass('ngf-hide');
                    elem.attr('src', disallowObjectUrl ? file.dataUrl : file.blobUrl);
                  } else {
                    elem.addClass('ngf-hide');
                  }
                });
              });
            } else {
              elem.addClass('ngf-hide');
            }
          });

          scope.$on('$destroy', function () {
            unwatch();
          });
        });
      }
    };
  }]);

  /** @namespace attr.ngfBackground */
  /** @namespace attr.ngfNoObjectUrl */
  ngFileUpload.directive('ngfBackground', ['Upload', '$compile', '$timeout', function (Upload, $compile, $timeout) {
    return {
      restrict: 'AE',
      link: function (scope, elem, attr) {
        $timeout(function () {
          var unwatch = scope.$watch(attr.ngfBackground, function (file) {
            if (angular.isString(file)) return elem.css('background-image', 'url(\'' + file + '\')');
            if (file && file.type && file.type.indexOf('image') === 0) {
              var disallowObjectUrl = Upload.attrGetter('ngfNoObjectUrl', attr, scope);
              Upload.dataUrl(file, disallowObjectUrl)['finally'](function () {
                $timeout(function () {
                  if ((disallowObjectUrl && file.dataUrl) || (!disallowObjectUrl && file.blobUrl)) {
                    elem.css('background-image', 'url(\'' + (disallowObjectUrl ? file.dataUrl : file.blobUrl) + '\')');
                  } else {
                    elem.css('background-image', '');
                  }
                });
              });
            } else {
              elem.css('background-image', '');
            }
          });
          scope.$on('$destroy', function () {
            unwatch();
          });
        });
      }
    };
  }]);

  ngFileUpload.config(['$compileProvider', function ($compileProvider) {
    if ($compileProvider.imgSrcSanitizationWhitelist) $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|local|file|data|blob):/);
    if ($compileProvider.aHrefSanitizationWhitelist) $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|local|file|data|blob):/);
  }]);

  ngFileUpload.filter('ngfDataUrl', ['UploadDataUrl', '$sce', function (UploadDataUrl, $sce) {
    return function (file, disallowObjectUrl) {
      if (angular.isString(file)) {
        return $sce.trustAsResourceUrl(file);
      }
      if (file && !file.dataUrl) {
        if (file.dataUrl === undefined && angular.isObject(file)) {
          file.dataUrl = null;
          UploadDataUrl.dataUrl(file, disallowObjectUrl);
        }
        return '';
      }
      return (file && file.dataUrl ? $sce.trustAsResourceUrl(file.dataUrl) : file) || '';
    };
  }]);

})();

(function () {
  function globStringToRegex(str) {
    if (str.length > 2 && str[0] === '/' && str[str.length - 1] === '/') {
      return str.substring(1, str.length - 1);
    }
    var split = str.split(','), result = '';
    if (split.length > 1) {
      for (var i = 0; i < split.length; i++) {
        result += '(' + globStringToRegex(split[i]) + ')';
        if (i < split.length - 1) {
          result += '|';
        }
      }
    } else {
      if (str.indexOf('.') === 0) {
        str = '*' + str;
      }
      result = '^' + str.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + '-]', 'g'), '\\$&') + '$';
      result = result.replace(/\\\*/g, '.*').replace(/\\\?/g, '.');
    }
    return result;
  }

  function translateScalars(str) {
    if (angular.isString(str)) {
      if (str.search(/kb/i) === str.length - 2) {
        return parseFloat(str.substring(0, str.length - 2) * 1000);
      } else if (str.search(/mb/i) === str.length - 2) {
        return parseFloat(str.substring(0, str.length - 2) * 1000000);
      } else if (str.search(/gb/i) === str.length - 2) {
        return parseFloat(str.substring(0, str.length - 2) * 1000000000);
      } else if (str.search(/b/i) === str.length - 1) {
        return parseFloat(str.substring(0, str.length - 1));
      } else if (str.search(/s/i) === str.length - 1) {
        return parseFloat(str.substring(0, str.length - 1));
      } else if (str.search(/m/i) === str.length - 1) {
        return parseFloat(str.substring(0, str.length - 1) * 60);
      } else if (str.search(/h/i) === str.length - 1) {
        return parseFloat(str.substring(0, str.length - 1) * 3600);
      }
    }
    return str;
  }

  ngFileUpload.service('UploadValidate', ['UploadDataUrl', '$q', '$timeout', function (UploadDataUrl, $q, $timeout) {
    var upload = UploadDataUrl;

    upload.registerValidators = function (ngModel, elem, attr, scope) {
      if (!ngModel) return;

      ngModel.$ngfValidations = [];
      function setValidities(ngModel) {
        angular.forEach(ngModel.$ngfValidations, function (validation) {
          ngModel.$setValidity(validation.name, validation.valid);
        });
      }

      ngModel.$formatters.push(function (val) {
        if (upload.attrGetter('ngfValidateLater', attr, scope) || !ngModel.$$ngfValidated) {
          upload.validate(val, ngModel, attr, scope, false, function () {
            setValidities(ngModel);
            ngModel.$$ngfValidated = false;
          });
          if (val && val.length === 0) {
            val = null;
          }
          if (elem && (val == null || val.length === 0)) {
            if (elem.val()) {
              elem.val(null);
            }
          }
        } else {
          setValidities(ngModel);
          ngModel.$$ngfValidated = false;
        }
        return val;
      });
    };

    upload.validatePattern = function (file, val) {
      if (!val) {
        return true;
      }
      var regexp = new RegExp(globStringToRegex(val), 'gi');
      return (file.type != null && regexp.test(file.type.toLowerCase())) ||
        (file.name != null && regexp.test(file.name.toLowerCase()));
    };

    upload.validate = function (files, ngModel, attr, scope, later, callback) {
      ngModel = ngModel || {};
      ngModel.$ngfValidations = ngModel.$ngfValidations || [];

      angular.forEach(ngModel.$ngfValidations, function (v) {
        v.valid = true;
      });

      var attrGetter = function (name, params) {
        return upload.attrGetter(name, attr, scope, params);
      };

      if (later) {
        callback.call(ngModel);
        return;
      }
      ngModel.$$ngfValidated = true;

      if (files == null || files.length === 0) {
        callback.call(ngModel);
        return;
      }

      files = files.length === undefined ? [files] : files.slice(0);

      function validateSync(name, validatorVal, fn) {
        if (files) {
          var dName = 'ngf' + name[0].toUpperCase() + name.substr(1);
          var i = files.length, valid = null;

          while (i--) {
            var file = files[i];
            var val = attrGetter(dName, {'$file': file});
            if (val == null) {
              val = validatorVal(attrGetter('ngfValidate') || {});
              valid = valid == null ? true : valid;
            }
            if (val != null) {
              if (!fn(file, val)) {
                file.$error = name;
                file.$errorParam = val;
                files.splice(i, 1);
                valid = false;
              }
            }
          }
          if (valid !== null) {
            ngModel.$ngfValidations.push({name: name, valid: valid});
          }
        }
      }

      validateSync('pattern', function (cons) {
        return cons.pattern;
      }, upload.validatePattern);
      validateSync('minSize', function (cons) {
        return cons.size && cons.size.min;
      }, function (file, val) {
        return file.size >= translateScalars(val);
      });
      validateSync('maxSize', function (cons) {
        return cons.size && cons.size.max;
      }, function (file, val) {
        return file.size <= translateScalars(val);
      });

      validateSync('validateFn', function () {
        return null;
      }, function (file, r) {
        return r === true || r === null || r === '';
      });

      if (!files.length) {
        callback.call(ngModel, ngModel.$ngfValidations);
        return;
      }

      var pendings = 0;

      function validateAsync(name, validatorVal, type, asyncFn, fn) {
        if (files) {
          var thisPendings = 0, hasError = false, dName = 'ngf' + name[0].toUpperCase() + name.substr(1);
          files = files.length === undefined ? [files] : files;
          angular.forEach(files, function (file) {
            if (file.type.search(type) !== 0) {
              return true;
            }
            var val = attrGetter(dName, {'$file': file}) || validatorVal(attrGetter('ngfValidate', {'$file': file}) || {});
            if (val) {
              pendings++;
              thisPendings++;
              asyncFn(file, val).then(function (d) {
                if (!fn(d, val)) {
                  file.$error = name;
                  file.$errorParam = val;
                  hasError = true;
                }
              }, function () {
                if (attrGetter('ngfValidateForce', {'$file': file})) {
                  file.$error = name;
                  file.$errorParam = val;
                  hasError = true;
                }
              })['finally'](function () {
                pendings--;
                thisPendings--;
                if (!thisPendings) {
                  ngModel.$ngfValidations.push({name: name, valid: !hasError});
                }
                if (!pendings) {
                  callback.call(ngModel, ngModel.$ngfValidations);
                }
              });
            }
          });
        }
      }

      validateAsync('maxHeight', function (cons) {
        return cons.height && cons.height.max;
      }, /image/, this.imageDimensions, function (d, val) {
        return d.height <= val;
      });
      validateAsync('minHeight', function (cons) {
        return cons.height && cons.height.min;
      }, /image/, this.imageDimensions, function (d, val) {
        return d.height >= val;
      });
      validateAsync('maxWidth', function (cons) {
        return cons.width && cons.width.max;
      }, /image/, this.imageDimensions, function (d, val) {
        return d.width <= val;
      });
      validateAsync('minWidth', function (cons) {
        return cons.width && cons.width.min;
      }, /image/, this.imageDimensions, function (d, val) {
        return d.width >= val;
      });
      validateAsync('ratio', function (cons) {
        return cons.ratio;
      }, /image/, this.imageDimensions, function (d, val) {
        var split = val.toString().split(','), valid = false;

        for (var i = 0; i < split.length; i++) {
          var r = split[i], xIndex = r.search(/x/i);
          if (xIndex > -1) {
            r = parseFloat(r.substring(0, xIndex)) / parseFloat(r.substring(xIndex + 1));
          } else {
            r = parseFloat(r);
          }
          if (Math.abs((d.width / d.height) - r) < 0.0001) {
            valid = true;
          }
        }
        return valid;
      });
      validateAsync('maxDuration', function (cons) {
        return cons.duration && cons.duration.max;
      }, /audio|video/, this.mediaDuration, function (d, val) {
        return d <= translateScalars(val);
      });
      validateAsync('minDuration', function (cons) {
        return cons.duration && cons.duration.min;
      }, /audio|video/, this.mediaDuration, function (d, val) {
        return d >= translateScalars(val);
      });

      validateAsync('validateAsyncFn', function () {
        return null;
      }, /./, function (file, val) {
        return val;
      }, function (r) {
        return r === true || r === null || r === '';
      });

      if (!pendings) {
        callback.call(ngModel, ngModel.$ngfValidations);
      }
    };

    upload.imageDimensions = function (file) {
      if (file.width && file.height) {
        var d = $q.defer();
        $timeout(function () {
          d.resolve({width: file.width, height: file.height});
        });
        return d.promise;
      }
      if (file.$ngfDimensionPromise) return file.$ngfDimensionPromise;

      var deferred = $q.defer();
      $timeout(function () {
        if (file.type.indexOf('image') !== 0) {
          deferred.reject('not image');
          return;
        }
        upload.dataUrl(file).then(function (dataUrl) {
          var img = angular.element('<img>').attr('src', dataUrl).css('visibility', 'hidden').css('position', 'fixed');

          function success() {
            var width = img[0].clientWidth;
            var height = img[0].clientHeight;
            img.remove();
            file.width = width;
            file.height = height;
            deferred.resolve({width: width, height: height});
          }

          function error() {
            img.remove();
            deferred.reject('load error');
          }

          img.on('load', success);
          img.on('error', error);
          var count = 0;

          function checkLoadError() {
            $timeout(function () {
              if (img[0].parentNode) {
                if (img[0].clientWidth) {
                  success();
                } else if (count > 10) {
                  error();
                } else {
                  checkLoadError();
                }
              }
            }, 1000);
          }

          checkLoadError();

          angular.element(document.getElementsByTagName('body')[0]).append(img);
        }, function () {
          deferred.reject('load error');
        });
      });

      file.$ngfDimensionPromise = deferred.promise;
      file.$ngfDimensionPromise['finally'](function () {
        delete file.$ngfDimensionPromise;
      });
      return file.$ngfDimensionPromise;
    };

    upload.mediaDuration = function (file) {
      if (file.duration) {
        var d = $q.defer();
        $timeout(function () {
          d.resolve(file.duration);
        });
        return d.promise;
      }
      if (file.$ngfDurationPromise) return file.$ngfDurationPromise;

      var deferred = $q.defer();
      $timeout(function () {
        if (file.type.indexOf('audio') !== 0 && file.type.indexOf('video') !== 0) {
          deferred.reject('not media');
          return;
        }
        upload.dataUrl(file).then(function (dataUrl) {
          var el = angular.element(file.type.indexOf('audio') === 0 ? '<audio>' : '<video>')
            .attr('src', dataUrl).css('visibility', 'none').css('position', 'fixed');

          function success() {
            var duration = el[0].duration;
            file.duration = duration;
            el.remove();
            deferred.resolve(duration);
          }

          function error() {
            el.remove();
            deferred.reject('load error');
          }

          el.on('loadedmetadata', success);
          el.on('error', error);
          var count = 0;

          function checkLoadError() {
            $timeout(function () {
              if (el[0].parentNode) {
                if (el[0].duration) {
                  success();
                } else if (count > 10) {
                  error();
                } else {
                  checkLoadError();
                }
              }
            }, 1000);
          }

          checkLoadError();

          angular.element(document.body).append(el);
        }, function () {
          deferred.reject('load error');
        });
      });

      file.$ngfDurationPromise = deferred.promise;
      file.$ngfDurationPromise['finally'](function () {
        delete file.$ngfDurationPromise;
      });
      return file.$ngfDurationPromise;
    };
    return upload;
  }
  ]);

})();

(function () {
  ngFileUpload.directive('ngfDrop', ['$parse', '$timeout', '$location', 'Upload',
    function ($parse, $timeout, $location, Upload) {
      return {
        restrict: 'AEC',
        require: '?ngModel',
        link: function (scope, elem, attr, ngModel) {
          linkDrop(scope, elem, attr, ngModel, $parse, $timeout, $location, Upload);
        }
      };
    }]);

  ngFileUpload.directive('ngfNoFileDrop', function () {
    return function (scope, elem) {
      if (dropAvailable()) elem.css('display', 'none');
    };
  });

  ngFileUpload.directive('ngfDropAvailable', ['$parse', '$timeout', 'Upload', function ($parse, $timeout, Upload) {
    return function (scope, elem, attr) {
      if (dropAvailable()) {
        var model = $parse(Upload.attrGetter('ngfDropAvailable', attr));
        $timeout(function () {
          model(scope);
          if (model.assign) {
            model.assign(scope, true);
          }
        });
      }
    };
  }]);

  function linkDrop(scope, elem, attr, ngModel, $parse, $timeout, $location, upload) {
    var available = dropAvailable();

    var attrGetter = function (name, scope, params) {
      return upload.attrGetter(name, attr, scope, params);
    };

    if (attrGetter('dropAvailable')) {
      $timeout(function () {
        if (scope[attrGetter('dropAvailable')]) {
          scope[attrGetter('dropAvailable')].value = available;
        } else {
          scope[attrGetter('dropAvailable')] = available;
        }
      });
    }
    if (!available) {
      if (attrGetter('ngfHideOnDropNotAvailable', scope) === true) {
        elem.css('display', 'none');
      }
      return;
    }

    function isDisabled() {
      return elem.attr('disabled') || attrGetter('ngfDropDisabled', scope);
    }

    upload.registerValidators(ngModel, null, attr, scope);

    var leaveTimeout = null;
    var stopPropagation = $parse(attrGetter('ngfStopPropagation'));
    var dragOverDelay = 1;
    var actualDragOverClass;

    elem[0].addEventListener('dragover', function (evt) {
      if (isDisabled()) return;
      evt.preventDefault();
      if (stopPropagation(scope)) evt.stopPropagation();
      // handling dragover events from the Chrome download bar
      if (navigator.userAgent.indexOf('Chrome') > -1) {
        var b = evt.dataTransfer.effectAllowed;
        evt.dataTransfer.dropEffect = ('move' === b || 'linkMove' === b) ? 'move' : 'copy';
      }
      $timeout.cancel(leaveTimeout);
      if (!actualDragOverClass) {
        actualDragOverClass = 'C';
        calculateDragOverClass(scope, attr, evt, function (clazz) {
          actualDragOverClass = clazz;
          elem.addClass(actualDragOverClass);
        });
      }
    }, false);
    elem[0].addEventListener('dragenter', function (evt) {
      if (isDisabled()) return;
      evt.preventDefault();
      if (stopPropagation(scope)) evt.stopPropagation();
    }, false);
    elem[0].addEventListener('dragleave', function () {
      if (isDisabled()) return;
      leaveTimeout = $timeout(function () {
        elem.removeClass(actualDragOverClass);
        actualDragOverClass = null;
      }, dragOverDelay || 1);
    }, false);
    elem[0].addEventListener('drop', function (evt) {
      if (isDisabled()) return;
      evt.preventDefault();
      if (stopPropagation(scope)) evt.stopPropagation();
      elem.removeClass(actualDragOverClass);
      actualDragOverClass = null;
      extractFiles(evt, function (files) {
          upload.updateModel(ngModel, attr, scope, attrGetter('ngfChange') || attrGetter('ngfDrop'), files, evt);
        }, attrGetter('ngfAllowDir', scope) !== false,
        attrGetter('multiple') || attrGetter('ngfMultiple', scope));
    }, false);
    elem[0].addEventListener('paste', function (evt) {
      if (isDisabled()) return;
      var files = [];
      var clipboard = evt.clipboardData || evt.originalEvent.clipboardData;
      if (clipboard && clipboard.items) {
        for (var k = 0; k < clipboard.items.length; k++) {
          if (clipboard.items[k].type.indexOf('image') !== -1) {
            files.push(clipboard.items[k].getAsFile());
          }
        }
        upload.updateModel(ngModel, attr, scope, attrGetter('ngfChange') || attrGetter('ngfDrop'), files, evt);
      }
    }, false);

    function calculateDragOverClass(scope, attr, evt, callback) {
      var clazz = attrGetter('ngfDragOverClass', scope, {$event: evt}),
        dClass = attrGetter('ngfDragOverClass') || 'dragover';
      if (angular.isString(clazz)) {
        callback(clazz);
        return;
      }
      if (clazz) {
        if (clazz.delay) dragOverDelay = clazz.delay;
        if (clazz.accept || clazz.reject) {
          var items = evt.dataTransfer.items;
          if (items != null) {
            var pattern = attrGetter('ngfPattern', scope, {$event: evt});
            for (var i = 0; i < items.length; i++) {
              if (items[i].kind === 'file' || items[i].kind === '') {
                if (!upload.validatePattern(items[i], pattern)) {
                  dClass = clazz.reject;
                  break;
                } else {
                  dClass = clazz.accept;
                }
              }
            }
          }
        }
      }
      callback(dClass);
    }

    function extractFiles(evt, callback, allowDir, multiple) {
      var files = [], processing = 0;

      function traverseFileTree(files, entry, path) {
        if (entry != null) {
          if (entry.isDirectory) {
            var filePath = (path || '') + entry.name;
            files.push({name: entry.name, type: 'directory', path: filePath});
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
                files.push(file);
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

      var items = evt.dataTransfer.items;

      if (items && items.length > 0 && $location.protocol() !== 'file') {
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
            if (f != null) files.push(f);
          }
          if (!multiple && files.length > 0) break;
        }
      } else {
        var fileList = evt.dataTransfer.files;
        if (fileList != null) {
          for (var j = 0; j < fileList.length; j++) {
            files.push(fileList.item(j));
            if (!multiple && files.length > 0) {
              break;
            }
          }
        }
      }
      var delays = 0;
      (function waitForProcess(delay) {
        $timeout(function () {
          if (!processing) {
            if (!multiple && files.length > 1) {
              i = 0;
              while (files[i].type === 'directory') i++;
              files = [files[i]];
            }
            callback(files);
          } else {
            if (delays++ * 10 < 20 * 1000) {
              waitForProcess(10);
            }
          }
        }, delay || 0);
      })();
    }
  }

  function dropAvailable() {
    var div = document.createElement('div');
    return ('draggable' in div) && ('ondrop' in div) && !/Edge\/12./i.test(navigator.userAgent);
  }

})();

angular.module('manage.templates', ['manageAlerts/manageAlerts.tpl.html', 'manageAlerts/manageAlertsItemFields.tpl.html', 'manageDatabases/manageDatabases.tpl.html', 'manageERCarousel/manageERCarousel.tpl.html', 'manageERCarousel/manageSlideFields.tpl.html', 'manageERCarousel/manageSlideList.tpl.html', 'manageHours/manageEx.tpl.html', 'manageHours/manageHours.tpl.html', 'manageHours/manageHoursUsers.tpl.html', 'manageHours/manageLoc.tpl.html', 'manageHours/manageSem.tpl.html', 'manageHours/manageUsers.tpl.html', 'manageNews/manageNews.tpl.html', 'manageNews/manageNewsAdmins.tpl.html', 'manageNews/manageNewsItemFields.tpl.html', 'manageNews/manageNewsList.tpl.html', 'manageOneSearch/mainOneSearch.tpl.html', 'manageOneSearch/manageOneSearch.tpl.html', 'manageOneSearch/oneSearchStat.tpl.html', 'manageSoftware/manageSoftware.tpl.html', 'manageSoftware/manageSoftwareComputerMaps.tpl.html', 'manageSoftware/manageSoftwareItemFields.tpl.html', 'manageSoftware/manageSoftwareList.tpl.html', 'manageSoftware/manageSoftwareLocCat.tpl.html', 'manageUserGroups/manageUG.tpl.html', 'manageUserGroups/viewMyWebApps.tpl.html', 'oneSearchErrors/oneSearchErrors.tpl.html', 'staffDirectory/staffDirectory.tpl.html', 'staffDirectory/staffDirectoryDepartments.tpl.html', 'staffDirectory/staffDirectoryPeople.tpl.html', 'staffDirectory/staffDirectoryProfile.tpl.html', 'staffDirectory/staffDirectorySubjects.tpl.html', 'submittedForms/submittedForms.tpl.html']);

angular.module("manageAlerts/manageAlerts.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageAlerts/manageAlerts.tpl.html",
    "<div class=\"container\">\n" +
    "    <h2>Manage Website Alerts</h2>\n" +
    "\n" +
    "    <div ng-if=\"hasAccess\">\n" +
    "        <h3>Add New Alert</h3>\n" +
    "        <form ng-submit=\"createAlert(newAlert)\">\n" +
    "            <div class=\"sdOpen\">\n" +
    "                <div alerts-item-fields alertdata=\"newAlert\" list=\"data\"></div>\n" +
    "                <div class=\"row form-group text-center\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-success\"\n" +
    "                            ng-disabled=\"uploading ||\n" +
    "                                         newAlert.message.length < 1 ||\n" +
    "                                         newAlert.dateStart.length < 1 ||\n" +
    "                                         newAlert.dateEnd.length < 1\">\n" +
    "                        Create New Alert\n" +
    "                    </button><br>\n" +
    "                    {{newAlert.formResponse}}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "\n" +
    "        <h3>Alerts</h3>\n" +
    "        <div class=\"row form-inline\">\n" +
    "            <div class=\"form-group col-md-12\">\n" +
    "                <label for=\"filterBy\">Filter <small>{{filteredList.length}}</small> results by</label>\n" +
    "                <div id=\"filterBy\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Message contains\" ng-model=\"alertFilter\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"text-center\">\n" +
    "            <pagination total-items=\"filteredList.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                        boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredList.length > perPage\"></pagination>\n" +
    "        </div>\n" +
    "        <div class=\"table-responsive\">\n" +
    "            <table class=\"table table-condensed table-hover\">\n" +
    "                <thead>\n" +
    "                <tr>\n" +
    "                    <th class=\"hidden-xs\">\n" +
    "                        <a ng-click=\"sortBy(0)\"\n" +
    "                           ng-class=\"{'sortable': !sortModes[0].reverse && sortMode == 0, 'sortable-reverse': sortModes[0].reverse && sortMode == 0}\">\n" +
    "                            Message\n" +
    "                        </a>\n" +
    "                    </th>\n" +
    "                    <th class=\"hidden-xs\">\n" +
    "                        <a ng-click=\"sortBy(1)\"\n" +
    "                           ng-class=\"{'sortable': !sortModes[1].reverse && sortMode == 1, 'sortable-reverse': sortModes[1].reverse && sortMode == 1}\">\n" +
    "                            Type\n" +
    "                        </a>\n" +
    "                    </th>\n" +
    "                    <th class=\"hidden-xs\">\n" +
    "                        <a ng-click=\"sortBy(2)\"\n" +
    "                           ng-class=\"{'sortable': !sortModes[2].reverse && sortMode == 2, 'sortable-reverse': sortModes[2].reverse && sortMode == 2}\">\n" +
    "                            Start Date\n" +
    "                        </a>\n" +
    "                    </th>\n" +
    "                    <th class=\"hidden-xs\">\n" +
    "                        <a ng-click=\"sortBy(3)\"\n" +
    "                           ng-class=\"{'sortable': !sortModes[3].reverse && sortMode == 3, 'sortable-reverse': sortModes[3].reverse && sortMode == 3}\">\n" +
    "                            End Date\n" +
    "                        </a>\n" +
    "                    </th>\n" +
    "                </tr>\n" +
    "                </thead>\n" +
    "                <tbody>\n" +
    "                <tr ng-repeat=\"alert in filteredList = (data.alerts | filter:{message:alertFilter}\n" +
    "                                                                    | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\n" +
    "                                                                    | startFrom:(currentPage-1)*perPage\n" +
    "                                                                    | limitTo:perPage\">\n" +
    "                    <td>\n" +
    "                        <h4 ng-click=\"toggleAlerts(alert)\" style=\"cursor: pointer;\">\n" +
    "                            <a>\n" +
    "                                <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"alert.show\"></span>\n" +
    "                                <span class=\"fa fa-fw fa-caret-down\" ng-show=\"alert.show\"></span>\n" +
    "                                {{alert.message}}\n" +
    "                            </a>\n" +
    "                        </h4>\n" +
    "                        <div ng-show=\"alert.show\">\n" +
    "                            <form ng-submit=\"updateAlert(alert)\">\n" +
    "                                <div alerts-item-fields alertdata=\"alert\" list=\"data\"></div>\n" +
    "                                <div class=\"row form-group text-center\">\n" +
    "                                    <button type=\"submit\" class=\"btn btn-success\"\n" +
    "                                            ng-disabled=\"uploading ||\n" +
    "                                             alert.message.length < 1 ||\n" +
    "                                             alert.dateStart.length < 1 ||\n" +
    "                                             alert.dateEnd.length < 1\">\n" +
    "                                        Update Alert\n" +
    "                                    </button>\n" +
    "                                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteAlert(alert)\"\n" +
    "                                            ng-disabled=\"uploading\">\n" +
    "                                        Delete Alert\n" +
    "                                    </button>\n" +
    "                                    <br>\n" +
    "                                    {{alert.formResponse}}\n" +
    "                                </div>\n" +
    "                            </form>\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                    <td ng-click=\"toggleAlerts(alert)\" style=\"cursor: pointer;\">\n" +
    "                        <h4>\n" +
    "                            <small ng-if=\"alert.selType.value == 0\"><span class=\"label label-success\">success</span></small>\n" +
    "                            <small ng-if=\"alert.selType.value == 1\"><span class=\"label label-warning\">warning</span></small>\n" +
    "                            <small ng-if=\"alert.selType.value == 2\"><span class=\"label label-danger\">danger</span></small>\n" +
    "                        </h4>\n" +
    "                    </td>\n" +
    "                    <td ng-click=\"toggleAlerts(alert)\" style=\"cursor: pointer;\">\n" +
    "                        {{alert.dateStart | date : 'MMM d, y'}}\n" +
    "                    </td>\n" +
    "                    <td ng-click=\"toggleAlerts(alert)\" style=\"cursor: pointer;\">\n" +
    "                        {{alert.dateEnd | date : 'MMM d, y'}}\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"text-center\">\n" +
    "            <pagination total-items=\"filteredList.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                        boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredList.length > perPage\"></pagination>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ng-if=\"!hasAccess\">\n" +
    "        <h3>Sorry, you don't have permissions to edit alerts</h3>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("manageAlerts/manageAlertsItemFields.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageAlerts/manageAlertsItemFields.tpl.html",
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-2 form-group\">\n" +
    "        <label for=\"type\">Type</label>\n" +
    "        <select class=\"form-control\" ng-model=\"alert.selType\" id=\"type\"\n" +
    "                ng-options=\"type.name for type in types\">\n" +
    "        </select>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-2 form-group\">\n" +
    "        <label for=\"from\">Active From</label>\n" +
    "        <input type=\"text\" class=\"form-control\" id=\"from\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "               ng-model=\"alert.dateStart\" is-open=\"alert.dpStart\" close-text=\"Close\"\n" +
    "               ng-click=\"onAlertDPFocus(alert, true)\"/>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-2 form-group\">\n" +
    "        <label for=\"until\">Active Until</label>\n" +
    "        <input type=\"text\" class=\"form-control\" id=\"until\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "               ng-model=\"alert.dateEnd\" is-open=\"alert.dpEnd\" close-text=\"Close\"\n" +
    "               ng-click=\"onAlertDPFocus(alert, false)\"/>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6 form-group\">\n" +
    "        <label for=\"url\">URL (optional)</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"http://lib.ua.edu/more-details/\" ng-model=\"alert.url\"\n" +
    "               id=\"url\" maxlength=\"1024\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-12 form-group\">\n" +
    "        <label for=\"message\">Message</label>\n" +
    "        <textarea class=\"form-control\" ng-model=\"alert.message\" rows=\"3\" maxlength=\"200\" id=\"message\" required></textarea>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("manageDatabases/manageDatabases.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageDatabases/manageDatabases.tpl.html",
    "<div class=\"container\">\n" +
    "    <h2>Manage Databases</h2>\n" +
    "\n" +
    "    <div ng-if=\"hasAccess\">\n" +
    "        <div>\n" +
    "            <div class=\"row form-inline\">\n" +
    "                <div class=\"form-group col-md-12\">\n" +
    "                    <label for=\"filterBy\">Filter <small>{{filteredDB.length}}</small> results by</label>\n" +
    "                    <div id=\"filterBy\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Title starts with\" ng-model=\"filters.titleStart\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"filters.title\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Description contains\" ng-model=\"filters.description\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Subjects contain\" ng-model=\"filters.subjects\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Media Types contain\" ng-model=\"filters.types\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Publisher contains\" ng-model=\"filters.publisher\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Vendor contains\" ng-model=\"filters.vendor\">\n" +
    "                        <select class=\"form-control\" ng-model=\"filters.disabled\" ng-options=\"val.value as val.name for val in disValues\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <label for=\"sortBy\">Sort by</label>\n" +
    "                    <div id=\"sortBy\">\n" +
    "                        <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortMode\" btn-radio=\"0\" ng-click=\"sortBy(0)\">\n" +
    "                            Title\n" +
    "                            <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[0].reverse\"></span>\n" +
    "                            <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[0].reverse\"></span>\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortMode\" btn-radio=\"1\" ng-click=\"sortBy(1)\">\n" +
    "                            Creation Date\n" +
    "                            <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[1].reverse\"></span>\n" +
    "                            <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[1].reverse\"></span>\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortMode\" btn-radio=\"2\" ng-click=\"sortBy(2)\">\n" +
    "                            Last Modified\n" +
    "                            <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[2].reverse\"></span>\n" +
    "                            <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[2].reverse\"></span>\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortMode\" btn-radio=\"3\" ng-click=\"sortBy(3)\">\n" +
    "                            Temporary Disabled\n" +
    "                            <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[3].reverse\"></span>\n" +
    "                            <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[3].reverse\"></span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"text-center\">\n" +
    "                <pagination total-items=\"filteredDB.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                            boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredDB.length > perPage\"></pagination>\n" +
    "            </div>\n" +
    "            <div class=\"row row-clickable\"\n" +
    "                 ng-repeat=\"db in filteredDB | startFrom:(currentPage-1)*perPage | limitTo:perPage track by $index\"\n" +
    "                 ng-class=\"{sdOpen: db.show}\">\n" +
    "                <div class=\"col-md-12\" ng-click=\"toggleDB(db)\" style=\"cursor: pointer;\">\n" +
    "                    <div class=\"col-md-10\">\n" +
    "                        <h4>\n" +
    "                            <a>\n" +
    "                                <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"db.show\"></span>\n" +
    "                                <span class=\"fa fa-fw fa-caret-down\" ng-show=\"db.show\"></span>\n" +
    "                            </a>\n" +
    "                            <a>{{db.title}}</a>\n" +
    "                            <small>{{db.publisher}} <span ng-show=\"db.vendor.length > 0\">: {{db.vendor}}</span></small>\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-1 text-right\">\n" +
    "                        <h4>\n" +
    "                            <small ng-if=\"db.tmpDisabled == 1\"><span class=\"label label-warning\">Tmp</span></small>\n" +
    "                            <small ng-if=\"db.changed\"><span class=\"label label-danger\">Unsaved</span></small>\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-1\">\n" +
    "                        <h4 ng-show=\"db.disabled == 1 || db.tmpDisabled == 1\"><small><span class=\"label label-danger\">Disabled</span></small></h4>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\" ng-if=\"db.show\">\n" +
    "                    <form ng-submit=\"updateDB(db)\">\n" +
    "                        <div class=\"col-md-6 form-group\">\n" +
    "                            <label for=\"{{db.id}}_title\">Title</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"{{db.title}}\" ng-model=\"db.title\"\n" +
    "                                   id=\"{{db.id}}_title\" maxlength=\"200\" required ng-change=\"changed(db)\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2 form-group\">\n" +
    "                            <label for=\"{{db.id}}_Publisher\">Publisher</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"{{db.publisher}}\" ng-model=\"db.publisher\"\n" +
    "                                   id=\"{{db.id}}_Publisher\" maxlength=\"100\" ng-change=\"changed(db)\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2 form-group\">\n" +
    "                            <label for=\"{{db.id}}_Vendor\">Vendor</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"{{db.vendor}}\" ng-model=\"db.vendor\"\n" +
    "                                   id=\"{{db.id}}_Vendor\" maxlength=\"100\" ng-change=\"changed(db)\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2 form-group\">\n" +
    "                            <label for=\"{{db.id}}_Format\">Format</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"{{db.format}}\" ng-model=\"db.format\"\n" +
    "                                   id=\"{{db.id}}_Format\" maxlength=\"50\" ng-change=\"changed(db)\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-6 form-group\">\n" +
    "                            <label for=\"{{db.id}}_URL\">URL</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"{{db.url}}\" ng-model=\"db.url\"\n" +
    "                                   id=\"{{db.id}}_URL\" maxlength=\"2000\" required ng-change=\"changed(db)\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-3 form-group\">\n" +
    "                            <label for=\"{{db.id}}_Location\">Location</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"{{db.location}}\" ng-model=\"db.location\"\n" +
    "                                   id=\"{{db.id}}_Location\" maxlength=\"50\" ng-change=\"changed(db)\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-1 form-group\">\n" +
    "                            <label for=\"{{db.id}}_NotInEDS\">In EDS</label>\n" +
    "                            <select class=\"form-control\" ng-model=\"db.notInEDS\" ng-options=\"val for val in inEDSValues\"\n" +
    "                                    id=\"{{db.id}}_NotInEDS\" ng-change=\"changed(db)\">\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-1 form-group\">\n" +
    "                            <label for=\"{{db.id}}_Full-text\">Fulltext</label>\n" +
    "                            <select class=\"form-control\" ng-model=\"db.hasFullText\" ng-options=\"val for val in fullTextValues\"\n" +
    "                                    id=\"{{db.id}}_Full-text\" ng-change=\"changed(db)\">\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-1 form-group\">\n" +
    "                            <label for=\"{{db.id}}_Authenticate\">Authenticate</label>\n" +
    "                            <input type=\"checkbox\" class=\"form-control\" ng-model=\"db.auth\" ng-true-value=\"1\" ng-false-value=\"0\"\n" +
    "                                   id=\"{{db.id}}_Authenticate\" ng-change=\"changed(db)\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-6 form-group\">\n" +
    "                            <label for=\"{{db.id}}_Coverage\">Coverage</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"{{db.coverage}}\" ng-model=\"db.coverage\"\n" +
    "                                   id=\"{{db.id}}_Coverage\" maxlength=\"256\" ng-change=\"changed(db)\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-3 form-group\">\n" +
    "                            <label for=\"{{db.id}}_Notes\">Notes</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"{{db.notes}}\" ng-model=\"db.notes\"\n" +
    "                                   id=\"{{db.id}}_Notes\" maxlength=\"100\" ng-change=\"changed(db)\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-3 form-group\">\n" +
    "                            <label for=\"{{db.id}}_Status\">Status</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"{{db.status}}\" ng-model=\"db.status\"\n" +
    "                                   id=\"{{db.id}}_Status\" maxlength=\"100\" ng-change=\"changed(db)\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-12 form-group\">\n" +
    "                            <label for=\"{{db.id}}_descr\">Database Description</label>\n" +
    "                            <textarea class=\"form-control\" rows=\"3\" id=\"{{db.id}}_descr\" ng-model=\"db.description\" maxlength=\"4096\"\n" +
    "                                      required ng-change=\"changed(db)\"></textarea>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-1 form-group\">\n" +
    "                            <label for=\"{{db.id}}_presented\">PresentedBy</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"{{db.presentedBy}}\" ng-model=\"db.presentedBy\"\n" +
    "                                   id=\"{{db.id}}_presented\" maxlength=\"50\" ng-change=\"changed(db)\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-1 form-group\">\n" +
    "                            <label for=\"{{db.id}}_Audience1\">Audience1</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"{{db.audience1}}\" ng-model=\"db.audience1\"\n" +
    "                                   id=\"{{db.id}}_Audience1\" maxlength=\"30\" ng-change=\"changed(db)\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2 form-group\">\n" +
    "                            <label for=\"{{db.id}}_Audience2\">Audience2</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"{{db.audience2}}\" ng-model=\"db.audience2\"\n" +
    "                                   id=\"{{db.id}}_Audience2\" maxlength=\"30\" ng-change=\"changed(db)\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2 form-group\">\n" +
    "                            <label for=\"{{db.id}}_updatedBy\">Updated by</label>\n" +
    "                            <p id=\"{{db.id}}_updatedBy\">{{db.updatedBy}}</p>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2 form-group\">\n" +
    "                            <label for=\"{{db.id}}_dAuthor\">Description Author</label>\n" +
    "                            <input type=\"text\" class=\"form-control\" placeholder=\"{{db.descrAuthor}}\" ng-model=\"db.descrAuthor\"\n" +
    "                                   id=\"{{db.id}}_dAuthor\" maxlength=\"50\" required ng-change=\"changed(db)\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2 form-group\">\n" +
    "                            <label for=\"{{db.id}}_date1\">Created/Modified</label>\n" +
    "                            <p id=\"{{db.id}}_date1\">{{db.dateCreated}}<br>{{db.lastModified}}</p>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-1 form-group\">\n" +
    "                            <label for=\"{{db.id}}_Disable\">Disabled</label>\n" +
    "                            <input type=\"checkbox\" class=\"form-control\" ng-model=\"db.disabled\" ng-true-value=\"1\" ng-false-value=\"0\"\n" +
    "                                   id=\"{{db.id}}_Disable\" ng-change=\"changed(db)\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-1 form-group\">\n" +
    "                            <label for=\"{{db.id}}_tmpDisable\">TmpDisable</label>\n" +
    "                            <input type=\"checkbox\" class=\"form-control\" ng-model=\"db.tmpDisabled\" ng-true-value=\"1\" ng-false-value=\"0\"\n" +
    "                                   id=\"{{db.id}}_tmpDisable\" ng-change=\"changed(db)\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-12\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-md-6 form-group\">\n" +
    "                                    <label for=\"{{db.id}}_subjects\">Subjects</label>\n" +
    "                                    <ul class=\"list-group\" id=\"{{db.id}}_subjects\">\n" +
    "                                        <li class=\"list-group-item\" ng-repeat=\"subject in db.subjects\">\n" +
    "                                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteSubject(db,subject)\">Delete</button>\n" +
    "                                            {{subject.subject}} : {{subject.type}}\n" +
    "                                        </li>\n" +
    "                                        <li class=\"list-group-item\">\n" +
    "                                            <div class=\"row\">\n" +
    "                                                <div class=\"col-md-7\">\n" +
    "                                                    <select class=\"form-control\" ng-model=\"db.selSubj\" ng-options=\"sub.subject for sub in subjects\">\n" +
    "                                                    </select>\n" +
    "                                                </div>\n" +
    "                                                <div class=\"col-md-2\">\n" +
    "                                                    <select class=\"form-control\" ng-model=\"db.subjType\" ng-options=\"val for val in subjectValues\">\n" +
    "                                                    </select>\n" +
    "                                                </div>\n" +
    "                                                <div class=\"col-md-3\">\n" +
    "                                                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"addSubject(db)\">Add Subject</button>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                        </li>\n" +
    "                                    </ul>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-6 form-group\">\n" +
    "                                    <label for=\"{{db.id}}_types\">Types</label>\n" +
    "                                    <ul class=\"list-group\" id=\"{{db.id}}_types\">\n" +
    "                                        <li class=\"list-group-item\" ng-repeat=\"type in db.types\">\n" +
    "                                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteType(db,type)\">Delete</button>\n" +
    "                                            {{type.type}}\n" +
    "                                        </li>\n" +
    "                                        <li class=\"list-group-item form-inline\">\n" +
    "                                            <select class=\"form-control\" ng-model=\"db.selType\" ng-options=\"typ.type for typ in types\">\n" +
    "                                            </select>\n" +
    "                                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"addType(db)\">Add Type</button>\n" +
    "                                        </li>\n" +
    "                                    </ul>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-12 text-center\">\n" +
    "                            <button type=\"submit\" class=\"btn btn-success\">Update information</button>\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteDB(db)\">\n" +
    "                                Delete {{db[0]}} database\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </form>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"text-center\">\n" +
    "            <pagination total-items=\"filteredDB.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                        boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredDB.length > perPage\"></pagination>\n" +
    "        </div>\n" +
    "\n" +
    "        <h3>Create new Database</h3>\n" +
    "        <form ng-submit=\"createDB()\">\n" +
    "            <div class=\"row sdOpen\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"title\">Title</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Database Title\" ng-model=\"newDB.title\"\n" +
    "                               id=\"title\" maxlength=\"200\" required>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-2 form-group\">\n" +
    "                        <label for=\"Publisher\">Publisher</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Publisher\" ng-model=\"newDB.publisher\"\n" +
    "                               id=\"Publisher\" maxlength=\"100\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-2 form-group\">\n" +
    "                        <label for=\"Vendor\">Vendor</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Vendor\" ng-model=\"newDB.vendor\"\n" +
    "                               id=\"Vendor\" maxlength=\"100\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-2 form-group\">\n" +
    "                        <label for=\"Format\">Format</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Format\" ng-model=\"newDB.format\"\n" +
    "                               id=\"Format\" maxlength=\"50\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"URL\">URL</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"http://www.example.com/\" ng-model=\"newDB.url\"\n" +
    "                               id=\"URL\" maxlength=\"2000\" required>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-3 form-group\">\n" +
    "                        <label for=\"Location\">Location</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Location\" ng-model=\"newDB.location\"\n" +
    "                               id=\"Location\" maxlength=\"50\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-1 form-group\">\n" +
    "                        <label for=\"NotInEDS\">In EDS</label>\n" +
    "                        <select class=\"form-control\" ng-model=\"newDB.notInEDS\" ng-options=\"val for val in inEDSValues\"\n" +
    "                                id=\"NotInEDS\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-1 form-group\">\n" +
    "                        <label for=\"Full-text\">Fulltext</label>\n" +
    "                        <select class=\"form-control\" ng-model=\"newDB.hasFullText\" ng-options=\"val for val in fullTextValues\"\n" +
    "                                id=\"Full-text\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-1 form-group\">\n" +
    "                        <label for=\"Authenticate\">Authenticate</label>\n" +
    "                        <input type=\"checkbox\" class=\"form-control\" ng-model=\"newDB.auth\" ng-true-value=\"'1'\" ng-false-value=\"'0'\"\n" +
    "                               id=\"Authenticate\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"Coverage\">Coverage</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Database Coverage\" ng-model=\"newDB.coverage\"\n" +
    "                               id=\"Coverage\" maxlength=\"256\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-3 form-group\">\n" +
    "                        <label for=\"dAuthor\">Description Author</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Enter Author Name\" ng-model=\"newDB.descrAuthor\"\n" +
    "                               id=\"dAuthor\" maxlength=\"50\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-3 form-group\">\n" +
    "                        <label for=\"Status\">Status</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Status\" ng-model=\"newDB.status\"\n" +
    "                               id=\"Status\" maxlength=\"100\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12 form-group\">\n" +
    "                        <label for=\"descr\">Database Description</label>\n" +
    "                        <textarea class=\"form-control\" rows=\"3\" id=\"descr\" ng-model=\"newDB.description\" maxlength=\"4096\" required></textarea>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-2 form-group\">\n" +
    "                        <label for=\"presented\">Presented by</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Presented By\" ng-model=\"newDB.presentedBy\"\n" +
    "                               id=\"presented\" maxlength=\"50\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-2 form-group\">\n" +
    "                        <label for=\"Audience1\">Audience One</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Audience One\" ng-model=\"newDB.audience1\"\n" +
    "                               id=\"Audience1\" maxlength=\"30\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-2 form-group\">\n" +
    "                        <label for=\"Audience2\">Audience Two</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Audience Two\" ng-model=\"newDB.audience2\"\n" +
    "                               id=\"Audience2\" maxlength=\"30\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4 form-group\">\n" +
    "                        <label for=\"Notes\">Notes</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Notes\" ng-model=\"newDB.notes\"\n" +
    "                               id=\"Notes\" maxlength=\"100\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-1 form-group\">\n" +
    "                        <label for=\"Disable\">Disabled</label>\n" +
    "                        <input type=\"checkbox\" class=\"form-control\" ng-model=\"newDB.disabled\" ng-true-value=\"'1'\" ng-false-value=\"'0'\"\n" +
    "                               id=\"Disable\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-1 form-group\">\n" +
    "                        <label for=\"tmpDisable\">TmpDisable</label>\n" +
    "                        <input type=\"checkbox\" class=\"form-control\" ng-model=\"newDB.tmpDisabled\" ng-true-value=\"'1'\" ng-false-value=\"'0'\"\n" +
    "                               id=\"tmpDisable\">\n" +
    "                    </div>\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-md-6 form-group\">\n" +
    "                            <label for=\"subjects\">Subjects</label>\n" +
    "                            <ul class=\"list-group\" id=\"subjects\">\n" +
    "                                <li class=\"list-group-item\" ng-repeat=\"subject in newDB.subjects\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"delSubjNewDB($index)\">Delete</button>\n" +
    "                                    {{subject.subject}} : {{subject.type}}\n" +
    "                                </li>\n" +
    "                                <li class=\"list-group-item col-md-12\">\n" +
    "                                    <div class=\"col-md-7\">\n" +
    "                                        <select class=\"form-control\" ng-model=\"newDB.selSubj\" ng-options=\"sub.subject for sub in subjects\">\n" +
    "                                        </select>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-2\">\n" +
    "                                        <select class=\"form-control\" ng-model=\"newDB.subjType\" ng-options=\"val for val in subjectValues\">\n" +
    "                                        </select>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-3\">\n" +
    "                                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"addSubjNewDB()\">Add Subject</button>\n" +
    "                                    </div>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-6 form-group\">\n" +
    "                            <label for=\"types\">Types</label>\n" +
    "                            <ul class=\"list-group\" id=\"types\">\n" +
    "                                <li class=\"list-group-item\" ng-repeat=\"type in newDB.types\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"delTypeNewDB($index)\">Delete</button>\n" +
    "                                    {{type.type}}\n" +
    "                                </li>\n" +
    "                                <li class=\"list-group-item form-inline\">\n" +
    "                                    <select class=\"form-control\" ng-model=\"newDB.selType\" ng-options=\"typ.type for typ in types\">\n" +
    "                                    </select>\n" +
    "                                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"addTypeNewDB()\">Add Type</button>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12 text-center\">\n" +
    "                        <button type=\"submit\" class=\"btn btn-success\">Create Database Record</button><br>\n" +
    "                        {{formResponse}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "    <div ng-if=\"!hasAccess\">\n" +
    "        <h3>Sorry, you don't have permissions to edit databases</h3>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("manageERCarousel/manageERCarousel.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageERCarousel/manageERCarousel.tpl.html",
    "<div class=\"container\">\n" +
    "    <h2>Manage ER Carousel Slides</h2>\n" +
    "\n" +
    "    <div manage-slide-list>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"!hasAccess\">\n" +
    "        <h3>Sorry, you don't have permissions to edit slides</h3>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("manageERCarousel/manageSlideFields.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageERCarousel/manageSlideFields.tpl.html",
    "<div class=\"row\">\n" +
    "    <div class=\"col-xs-12 col-sm-6 form-group\">\n" +
    "        <label for=\"title\">Title</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"Slide Title\" ng-model=\"slide.title\"\n" +
    "               id=\"title\" maxlength=\"150\" required>\n" +
    "    </div>\n" +
    "    <div class=\"col-xs-12 col-sm-6 form-group\">\n" +
    "        <label for=\"url\">URL</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"http://www.example.com\" ng-model=\"slide.url\"\n" +
    "               id=\"url\" maxlength=\"1024\" required>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-xs-6 col-sm-3 form-group\">\n" +
    "        <label for=\"priority\">Priority</label>\n" +
    "        <input type=\"number\" class=\"form-control\" placeholder=\"13\" ng-model=\"slide.tmpPriority\"\n" +
    "               id=\"priority\" required>\n" +
    "    </div>\n" +
    "    <div class=\"col-xs-6 col-sm-3 form-group\">\n" +
    "        <label for=\"browse\">Select Image</label>\n" +
    "        <div id=\"browse\">\n" +
    "            <button type=\"file\" ngf-select=\"\" ng-model=\"slide.picFile\" accept=\"image/*\" ngf-multiple=\"false\"\n" +
    "                    ngf-change=\"generateThumb($files, slide)\" class=\"btn btn-primary\">\n" +
    "                <span class=\"fa fa-fw fa-plus\"></span>Browse\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-xs-12 col-sm-6 form-group\">\n" +
    "        <label for=\"selected\">Selected Image</label>\n" +
    "        <div id=\"selected\">\n" +
    "            <div ng-repeat=\"img in slide.selectedFiles\">\n" +
    "                <img ngf-src=\"img\" width=\"150px\" height=\"100px\">\n" +
    "                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"slide.selectedFiles.splice($index,1)\">\n" +
    "                    <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("manageERCarousel/manageSlideList.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageERCarousel/manageSlideList.tpl.html",
    "<div>\n" +
    "    <form ng-submit=\"createSlide(newSlide)\">\n" +
    "        <div class=\"sdOpen\">\n" +
    "            <h3>Add New Slide</h3>\n" +
    "            <div slide-fields-list slide=\"newSlide\"></div>\n" +
    "            <div class=\"row text-center form-group\">\n" +
    "                <button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"uploading\">\n" +
    "                    <span class=\"fa fa-plus\"></span> Create New Slide\n" +
    "                </button><br>\n" +
    "                {{newSlide.formResponse}}\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "    <h3>Slides (only top <span class=\"label label-info\">{{numShow}}</span> slides will be shown)</h3>\n" +
    "    <div class=\"row\" ng-repeat=\"slide in slides | orderBy:'priority':true\">\n" +
    "        <div class=\"col-xs-2 col-sm-1\">\n" +
    "            <h2 class=\"clickable\" ng-click=\"toggleSlide(slide)\">\n" +
    "                <span class=\"label label-success\" ng-if=\"$index < numShow\">{{$index + 1}}</span>\n" +
    "            </h2>\n" +
    "            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"approveSlide(slide)\"\n" +
    "                    ng-if=\"slide.status < 1 && admin\">\n" +
    "                <span class=\"fa fa-thumbs-o-up\"></span> Approve\n" +
    "            </button>\n" +
    "            <span class=\"label label-warning\" ng-if=\"slide.status < 1 && !admin\">Approval Pending</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-10 col-sm-4 col-md-3\">\n" +
    "            <a class=\"thumbnail clickable\" ng-click=\"toggleSlide(slide)\">\n" +
    "                <img ng-src=\"{{slide.image}}\" alt=\"Click to edit slide\">\n" +
    "            </a>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-12 col-sm-7 col-md-8 clickable\" ng-hide=\"slide.show\" ng-click=\"toggleSlide(slide)\">\n" +
    "            <h4><a>{{slide.title}}</a></h4>\n" +
    "            <h5><a>{{slide.url}}</a></h5>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-12 col-sm-7 col-md-8\" ng-show=\"slide.show\">\n" +
    "            <form ng-submit=\"updateSlide(slide)\">\n" +
    "                <div slide-fields-list slide=\"slide\"></div>\n" +
    "                <div class=\"row text-center\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"uploading\">\n" +
    "                        <span class=\"fa fa-save\"></span> Update Slide\n" +
    "                    </button>\n" +
    "                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteSlide(slide)\">\n" +
    "                        <span class=\"fa fa-trash-o\"></span> Delete Slide\n" +
    "                    </button><br>\n" +
    "                    {{slide.formResponse}}\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("manageHours/manageEx.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageHours/manageEx.tpl.html",
    "<div>\n" +
    "    <h3>List of Exceptions</h3>\n" +
    "    <div class=\"text-right\">\n" +
    "        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteOldExc()\" ng-disabled=\"loading\">Delete All Outdated Exceptions</button>\n" +
    "        <br>{{resultDel}}\n" +
    "    </div>\n" +
    "    <table class=\"table table-hover table-condensed\" ng-repeat=\"excData in allowedLibraries.exc\" ng-if=\"$index == selLib.index\">\n" +
    "        <thead>\n" +
    "        <tr>\n" +
    "            <th>Exception Description</th>\n" +
    "            <th class=\"text-center\" style=\"width:140px;\">Date</th>\n" +
    "            <th class=\"text-center\" style=\"width:80px;\">Days</th>\n" +
    "            <th class=\"text-center\" style=\"width:320px;\">Hours</th>\n" +
    "            <th class=\"text-center\" style=\"width:120px;\">Action</th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tr ng-repeat=\"exception in excData track by exception.id\" ng-click=\"expandExc($event, exception)\">\n" +
    "            <td style=\"cursor: pointer;\">\n" +
    "                <div ng-hide=\"isExpExc(exception.id)\"><a>{{exception.desc}}</a></div>\n" +
    "                <div ng-if=\"isExpExc(exception.id)\"><input type=\"text\" class=\"form-control\" ng-model=\"exception.desc\" ng-required /></div>\n" +
    "            </td>\n" +
    "            <td class=\"text-center\" style=\"cursor: pointer;\">\n" +
    "                <div ng-hide=\"isExpExc(exception.id)\">{{exception.datems | date : 'MMM d, y'}}</div>\n" +
    "                <div ng-if=\"isExpExc(exception.id)\">\n" +
    "\n" +
    "                    <input type=\"text\" class=\"form-control\" datepicker-popup=\"{{format}}\"\n" +
    "                           ng-model=\"exception.datems\" is-open=\"exception.dp\"\n" +
    "                           ng-required=\"true\" close-text=\"Close\"\n" +
    "                           ng-focus=\"onExcFocus($event, $index)\" />\n" +
    "                </div>\n" +
    "            </td>\n" +
    "            <td class=\"text-center\" style=\"cursor: pointer;\">\n" +
    "                <div ng-hide=\"isExpExc(exception.id)\">{{exception.days}}</div>\n" +
    "                <div ng-if=\"isExpExc(exception.id)\"><input type=\"text\" class=\"form-control\" ng-model=\"exception.days\" ng-required /></div>\n" +
    "            </td>\n" +
    "            <td class=\"text-center\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <select class=\"form-control\" ng-model=\"exception.from\">\n" +
    "                            <option ng-repeat=\"hours in hrsFrom\" ng-selected=\"{{exception.from == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <select class=\"form-control\" ng-model=\"exception.to\">\n" +
    "                            <option ng-repeat=\"hours in hrsTo\" ng-selected=\"{{exception.to == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </td>\n" +
    "            <td class=\"form-group text-center\">\n" +
    "                <div ng-show=\"isExpExc(exception.id)\">\n" +
    "                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"updateExc(exception)\" ng-disabled=\"loading\">\n" +
    "                        <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                    </button>\n" +
    "                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteExc(exception, $index)\" ng-disabled=\"loading\">\n" +
    "                        <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                    </button>\n" +
    "                    <br>{{result}}\n" +
    "                </div>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        <tr class=\"sdOpen\">\n" +
    "            <td>\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"newException.desc\" placeholder=\"Exception Description\" ng-required />\n" +
    "            </td>\n" +
    "            <td class=\"text-center\">\n" +
    "\n" +
    "                <input type=\"text\" class=\"form-control\" datepicker-popup=\"{{format}}\" show-button-bar=\"false\"\n" +
    "                       ng-model=\"newException.datems\" is-open=\"newException.dp\" close-text=\"Close\"\n" +
    "                       ng-required=\"true\" placeholder=\"MM/DD/YYYY\" ng-focus=\"onExcFocus($event)\" />\n" +
    "            </td>\n" +
    "            <td class=\"text-center\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"newException.days\" placeholder=\"Days\" ng-required />\n" +
    "            </td>\n" +
    "            <td class=\"text-center\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <select class=\"form-control\" ng-model=\"newException.from\">\n" +
    "                            <option ng-repeat=\"hours in hrsFrom\" ng-selected=\"{{newException.from == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <select class=\"form-control\" ng-model=\"newException.to\">\n" +
    "                            <option ng-repeat=\"hours in hrsTo\" ng-selected=\"{{newException.to == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </td>\n" +
    "            <td class=\"form-group text-right\">\n" +
    "                <label for=\"isGlobal\">Create For All Libraries</label>\n" +
    "                <input type=\"checkbox\" ng-model=\"newException.isGlobal\" id=\"isGlobal\">\n" +
    "                <br>\n" +
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"createExc()\"\n" +
    "                        ng-disabled=\"loading || newException.desc.length < 1 || !(newException.days > 0) || newException.datems.length < 1\">\n" +
    "                    Create Exception\n" +
    "                </button>\n" +
    "                <br>{{result}}\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "</div>");
}]);

angular.module("manageHours/manageHours.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageHours/manageHours.tpl.html",
    "<div class=\"container\">\n" +
    "    <h2>\n" +
    "        Manage Hours <small>{{selLib.name}}</small>\n" +
    "    </h2>\n" +
    "\n" +
    "    <div ng-if=\"hasAccess\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-4 form-group\">\n" +
    "                <select class=\"form-control\" ng-model=\"selLib\" ng-options=\"lib.name for lib in allowedLibraries.libraries\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"alert alert-warning\" role=\"alert\">\n" +
    "            <span class=\"fa fa-exclamation-triangle\"></span> Warning: Please use exceptions in order to create periods with the non\n" +
    "            standard hours (for example, Finals week).\n" +
    "        </div>\n" +
    "        <div class=\"alert alert-info\" role=\"alert\">\n" +
    "            <span class=\"fa fa-info-circle\"></span> Note: set <strong>From</strong> and <strong>To</strong> hours to\n" +
    "            <strong>Midnight</strong> in order to indicate <strong>Open 24 hours</strong>.\n" +
    "        </div>\n" +
    "        <tabset justified=\"true\">\n" +
    "            <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "                <div ng-if=\"tab.number == 0\">\n" +
    "                    <div semester-list semesters=\"allowedLibraries.sem\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div ng-if=\"tab.number == 1\" >\n" +
    "                    <div exception-list exceptions=\"allowedLibraries.exc\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </tab>\n" +
    "        </tabset>\n" +
    "    </div>\n" +
    "    <div ng-if=\"userInfo.hours.admin\">\n" +
    "        <h3><a href=\"/#/manage-hours-users\">Manage Users</a></h3>\n" +
    "    </div>\n" +
    "    <div ng-if=\"!hasAccess\">\n" +
    "        <h3>Sorry, you don't have permissions to manage hours</h3>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("manageHours/manageHoursUsers.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageHours/manageHoursUsers.tpl.html",
    "<div class=\"container\">\n" +
    "    <h2>Manage Hours Users</h2>\n" +
    "\n" +
    "    <tabset justified=\"true\" ng-if=\"hasAccess\">\n" +
    "        <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "            <div ng-show=\"tab.number == 0\">\n" +
    "                <div hours-user-list>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-show=\"tab.number == 1\">\n" +
    "                <div hours-location-list>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </tab>\n" +
    "    </tabset>\n" +
    "    <div ng-if=\"!hasAccess\">\n" +
    "        <h3>Sorry, you don't have permissions to manage hours users</h3>\n" +
    "    </div>\n" +
    "</div>");
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
    "<div>\n" +
    "    <h3>Semester List</h3>\n" +
    "    <table class=\"table table-hover table-condensed\" ng-repeat=\"semData in allowedLibraries.sem\" ng-if=\"$index == selLib.index\">\n" +
    "        <thead>\n" +
    "        <tr>\n" +
    "            <th>Semester</th>\n" +
    "            <th class=\"text-center\" style=\"width:10%\">Sun</th>\n" +
    "            <th class=\"text-center\" style=\"width:10%\">Mon</th>\n" +
    "            <th class=\"text-center\" style=\"width:10%\">Tue</th>\n" +
    "            <th class=\"text-center\" style=\"width:10%\">Wed</th>\n" +
    "            <th class=\"text-center\" style=\"width:10%\">Thu</th>\n" +
    "            <th class=\"text-center\" style=\"width:10%\">Fri</th>\n" +
    "            <th class=\"text-center\" style=\"width:10%\">Sat</th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tr ng-repeat=\"sem in semData\" ng-click=\"expandSem($event, sem)\" style=\"cursor: pointer;\">\n" +
    "            <th ng-hide=\"isExpSem(sem.dsid)\">\n" +
    "                <h4><a>{{sem.name}}</a></h4>\n" +
    "                {{sem.startdate | date : 'MMM d, y'}}<br>{{sem.enddate | date : 'MMM d, y'}}\n" +
    "            </th>\n" +
    "            <th ng-if=\"isExpSem(sem.dsid)\">\n" +
    "                <h4><a>{{sem.name}}</a></h4>\n" +
    "                <div class=\"col-md-7 form-group\">\n" +
    "                    <label for=\"{{sem.dsid}}_startDate\">Start Date</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" datepicker-popup=\"{{format}}\" size=\"3\"\n" +
    "                           ng-model=\"sem.startdate\" is-open=\"sem.dp\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                           ng-focus=\"onSemFocus($event, $index)\" id=\"{{sem.dsid}}_startDate\" placeholder=\"MM/DD/YYYY\"/>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-5 form-group\">\n" +
    "                    <div id=\"{{sem.dsid}}_action\">\n" +
    "                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"saveChanges(sem)\" ng-disabled=\"loading\">\n" +
    "                            <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteSem(sem, $index)\" ng-disabled=\"loading\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button><br>\n" +
    "                        {{result}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </th>\n" +
    "            <td class=\"text-center\" ng-repeat=\"day in sem.dow\">\n" +
    "                <div ng-hide=\"isExpSem(sem.dsid)\">\n" +
    "                    {{day.hours}}\n" +
    "                </div>\n" +
    "                <div ng-if=\"isExpSem(sem.dsid)\">\n" +
    "                    <select class=\"form-control\" ng-model=\"day.from\">\n" +
    "                        <option ng-repeat=\"hours in hrsFrom\" ng-selected=\"{{day.from == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                    </select>\n" +
    "                    <select class=\"form-control\" ng-model=\"day.to\">\n" +
    "                        <option ng-repeat=\"hours in hrsTo\" ng-selected=\"{{day.to == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "\n" +
    "    <h3>Create New Semester</h3>\n" +
    "    <div class=\"sdOpen\">\n" +
    "        <table class=\"table table-hover table-condensed\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th>Semester</th>\n" +
    "                <th class=\"text-center\" style=\"width:10%;\">Sun</th>\n" +
    "                <th class=\"text-center\" style=\"width:10%;\">Mon</th>\n" +
    "                <th class=\"text-center\" style=\"width:10%;\">Tue</th>\n" +
    "                <th class=\"text-center\" style=\"width:10%;\">Wed</th>\n" +
    "                <th class=\"text-center\" style=\"width:10%;\">Thu</th>\n" +
    "                <th class=\"text-center\" style=\"width:10%;\">Fri</th>\n" +
    "                <th class=\"text-center\" style=\"width:10%;\">Sat</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tr>\n" +
    "                <th>\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <input type=\"text\" class=\"form-control\" ng-minlength=\"4\" ng-maxlength=\"32\" ng-model=\"newSemester.name\" placeholder=\"Semester Name\" ng-required /><br>\n" +
    "                        <input type=\"text\" class=\"form-control\" datepicker-popup=\"{{format}}\" placeholder=\"Start Date (MM/DD/YYYY)\"\n" +
    "                               ng-model=\"newSemester.startdate\" is-open=\"newSemester.dp\" ng-required=\"true\" close-text=\"Close\"\n" +
    "                               ng-focus=\"onSemFocus($event)\" />\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"createSem()\"\n" +
    "                                ng-disabled=\"loading || newSemester.name.length < 1 || newSemester.startdate.length < 1\">\n" +
    "                            Create New Semester\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                    {{result}}\n" +
    "                </th>\n" +
    "                <td class=\"text-center\" style=\"width:11%\" ng-repeat=\"day in newSemester.dow\">\n" +
    "                    <select class=\"form-control\" ng-model=\"day.from\">\n" +
    "                        <option ng-repeat=\"hours in hrsFrom\" ng-selected=\"{{day.from == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                    </select>\n" +
    "                    <select class=\"form-control\" ng-model=\"day.to\">\n" +
    "                        <option ng-repeat=\"hours in hrsTo\" ng-selected=\"{{day.to == hours.value}}\" ng-value=\"{{hours.value}}\">{{hours.name}}</option>\n" +
    "                    </select>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>");
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
    "    <tr ng-repeat=\"user in dataUL.users | orderBy:'name'\" ng-click=\"expandUser(user)\">\n" +
    "        <th scope=\"row\">{{user.fullName}}\n" +
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
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"updateUser(user)\" ng-disabled=\"isLoading\">\n" +
    "                    Save\n" +
    "                </button>\n" +
    "                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteUser(user, $index)\" ng-disabled=\"isLoading\">\n" +
    "                    Delete\n" +
    "                </button><br>\n" +
    "                {{result}}\n" +
    "            </div>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "        <th scope=\"row\">\n" +
    "            <select class=\"form-control\" ng-model=\"newUser\" ng-options=\"user.fullName for user in wpUsers | orderBy:'fullName'\">\n" +
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
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"createUser(newUser)\" ng-disabled=\"isLoading || newUser.login.length <= 1\">\n" +
    "                    Grant Access\n" +
    "                </button><br>\n" +
    "                {{result2}}\n" +
    "            </div>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "");
}]);

angular.module("manageNews/manageNews.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageNews/manageNews.tpl.html",
    "<div class=\"container\">\n" +
    "    <h2>Manage News and Exhibitions</h2>\n" +
    "\n" +
    "    <tabset justified=\"true\" ng-if=\"hasAccess\">\n" +
    "        <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "            <div ng-show=\"tab.number == 0\">\n" +
    "                <div manage-news-list>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-show=\"tab.number == 1\" >\n" +
    "                <div manage-admins-list>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </tab>\n" +
    "    </tabset>\n" +
    "    <div ng-if=\"!hasAccess\">\n" +
    "        <h3>Sorry, you don't have permissions to edit news</h3>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("manageNews/manageNewsAdmins.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageNews/manageNewsAdmins.tpl.html",
    "<div class=\"row\" ng-if=\"userInfo.news.admin\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                <h3 class=\"panel-title\">People who can approve submitted News and Exhibits</h3>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <ul class=\"list-group\">\n" +
    "                    <li class=\"list-group-item\" ng-repeat=\"admin in data.admins\">\n" +
    "                        {{admin.name}}\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\" ng-if=\"!userInfo.news.admin\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                <h3 class=\"panel-title\">People who can approve submitted News and Exhibits</h3>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <ul class=\"list-group\">\n" +
    "                    <li class=\"list-group-item\" ng-repeat=\"admin in data.admins\">\n" +
    "                        {{admin.name}}\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("manageNews/manageNewsItemFields.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageNews/manageNewsItemFields.tpl.html",
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-6 form-group\">\n" +
    "        <label for=\"title\">Title</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"News/Exhibit Title\" ng-model=\"news.title\"\n" +
    "               id=\"title\" maxlength=\"100\" required>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-2 form-group\">\n" +
    "        <div ng-show=\"news.type > 0\">\n" +
    "            <label for=\"from\">Active From</label>\n" +
    "            <input type=\"text\" class=\"form-control\" id=\"from\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                   ng-model=\"news.activeFrom\" is-open=\"news.dpFrom\" close-text=\"Close\"\n" +
    "                   ng-click=\"onNewsDPFocus($event, news, true)\"/>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-2 form-group\">\n" +
    "        <div ng-show=\"news.type > 0\">\n" +
    "            <label for=\"until\">Active Until</label>\n" +
    "            <input type=\"text\" class=\"form-control\" id=\"until\" datepicker-popup=\"{{dpFormat}}\"\n" +
    "                   ng-model=\"news.activeUntil\" is-open=\"news.dpUntil\" close-text=\"Close\"\n" +
    "                   ng-click=\"onNewsDPFocus($event, news, false)\"/>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-1 form-group\">\n" +
    "        <label for=\"isExhibit\">Exhibit</label>\n" +
    "        <div class=\"checkbox text-center\" id=\"isExhibit\">\n" +
    "            <input type=\"checkbox\" ng-model=\"news.type\" ng-true-value=\"1\" ng-false-value=\"0\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-1 form-group\">\n" +
    "        <label for=\"sticky\">Sticky</label>\n" +
    "        <div class=\"checkbox text-center\" id=\"sticky\">\n" +
    "            <input type=\"checkbox\" ng-model=\"news.sticky\" ng-true-value=\"1\" ng-false-value=\"0\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-2 form-group\">\n" +
    "        <label for=\"browse\">Select Images</label>\n" +
    "        <div id=\"browse\">\n" +
    "            <button type=\"file\" ngf-select=\"\" ng-model=\"news.picFile\" accept=\"image/*\" ngf-multiple=\"true\"\n" +
    "                    ngf-change=\"generateThumb($files, news)\" class=\"btn btn-success\">\n" +
    "                <span class=\"fa fa-fw fa-plus\"></span>Browse\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-10 form-group\">\n" +
    "        <label for=\"selected\">Selected Images</label>\n" +
    "        <div id=\"selected\">\n" +
    "            <div class=\"col-md-3\" ng-repeat=\"img in news.images\">\n" +
    "                <img ng-src=\"{{img.image}}\" width=\"150px\" height=\"100px\">\n" +
    "                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"news.images.splice($index,1)\">\n" +
    "                    <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3\" ng-repeat=\"img in news.selectedFiles\">\n" +
    "                <img ngf-src=\"img\" width=\"150px\" height=\"100px\">\n" +
    "                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"news.selectedFiles.splice($index,1)\">\n" +
    "                    <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-12 form-group\">\n" +
    "        <label>Detailed Description</label>\n" +
    "        <textarea ui-tinymce=\"tinymceOptions\" ng-model=\"news.description\" rows=\"5\" maxlength=\"64000\" required></textarea>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row form-group\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <h4><small>Select contact person from the list or enter new contact information</small></h4>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            <label for=\"contact1\">Library Faculty and Staff</label>\n" +
    "            <select class=\"form-control\" id=\"contact1\" ng-options=\"people.fullName for people in data.people\"\n" +
    "                    ng-model=\"news.contactID\">\n" +
    "            </select>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3\">\n" +
    "            <label for=\"contact2\">Name</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Contact Name\" ng-model=\"news.contactName\"\n" +
    "                   id=\"contact2\" maxlength=\"60\">\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3\">\n" +
    "            <label for=\"contact3\">Email</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Contact Email\" ng-model=\"news.contactEmail\"\n" +
    "                   id=\"contact3\"  maxlength=\"1024\">\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3\">\n" +
    "            <label for=\"contact4\">Phone</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Contact Phone\" ng-model=\"news.contactPhone\"\n" +
    "                   id=\"contact4\" maxlength=\"20\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("manageNews/manageNewsList.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageNews/manageNewsList.tpl.html",
    "<div>\n" +
    "    <form name=\"addNewsExh\" ng-submit=\"createNews()\">\n" +
    "        <div class=\"sdOpen\">\n" +
    "            <h3>Add News Record</h3>\n" +
    "            <div news-item-fields-list newsdata=\"newNews\" list=\"data\"></div>\n" +
    "            <div class=\"row text-center form-group\">\n" +
    "                <button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"uploading\">Create New Record</button><br>\n" +
    "                {{newNews.formResponse}}\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "    <h3>News</h3>\n" +
    "    <div class=\"row form-inline\">\n" +
    "        <div class=\"form-group col-md-12\">\n" +
    "            <label for=\"filterBy\">Filter <small>{{filteredNews.length}}</small> results by</label>\n" +
    "            <div id=\"filterBy\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"titleFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Description contains\" ng-model=\"descrFilter\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredNews.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredNews.length > perPage\"></pagination>\n" +
    "    </div>\n" +
    "    <div class=\"table-responsive\">\n" +
    "        <table class=\"table table-condensed table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th style=\"width:80px\">\n" +
    "                    Thumbnail\n" +
    "                </th>\n" +
    "                <th class=\"hidden-xs\">\n" +
    "                    <a\n" +
    "                       ng-click=\"sortBy(0)\"\n" +
    "                       ng-class=\"{'sortable': !sortModes[0].reverse && sortMode == 0, 'sortable-reverse': sortModes[0].reverse && sortMode == 0}\">\n" +
    "                        Details\n" +
    "                    </a>\n" +
    "                </th>\n" +
    "                <th class=\"hidden-xs\" style=\"width: 8%\">\n" +
    "                    <a\n" +
    "                       ng-click=\"sortBy(1)\"\n" +
    "                       ng-class=\"{'sortable': !sortModes[1].reverse && sortMode == 1, 'sortable-reverse': sortModes[1].reverse && sortMode == 1}\">\n" +
    "                        Date\n" +
    "                    </a>\n" +
    "                </th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"news in filteredNews = (data.news | filter:{title:titleFilter}\n" +
    "                                                             | filter:{description:descrFilter}\n" +
    "                                                             | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\n" +
    "                                                             | startFrom:(currentPage-1)*perPage\n" +
    "                                                             | limitTo:perPage\"\n" +
    "                >\n" +
    "                <td ng-click=\"toggleNews(news)\" style=\"cursor: pointer;\">\n" +
    "                    <table>\n" +
    "                        <tr>\n" +
    "                            <td>\n" +
    "                                <a>\n" +
    "                                    <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"news.show\"></span>\n" +
    "                                    <span class=\"fa fa-fw fa-caret-down\" ng-show=\"news.show\"></span>\n" +
    "                                </a>\n" +
    "                            </td>\n" +
    "                            <td style=\"width:64px\">\n" +
    "                                <img ng-show=\"news.tb.length > 0\" ng-src=\"{{news.tb}}\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                                <img ng-hide=\"news.tb.length > 0\" ngf-src=\"news.selectedFiles[0]\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                    </table>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-md-10\">\n" +
    "                            <h4 style=\"cursor: pointer;\" ng-click=\"toggleNews(news)\">\n" +
    "                                <a>{{news.title}}</a>\n" +
    "                                <small>{{news.creator}}</small>\n" +
    "                            </h4>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-2 text-right\">\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"approveNews(news)\"\n" +
    "                                    ng-if=\"news.status == 0 && userInfo.news.admin\">\n" +
    "                                Approve\n" +
    "                            </button>\n" +
    "                            <span ng-if=\"news.status == 0 && !userInfo.news.admin\">Approval Pending</span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <form name=\"editNewsExh{{news.nid}}\" ng-submit=\"updateNews(news)\" ng-if=\"news.show\">\n" +
    "                        <div news-item-fields-list newsdata=\"news\" list=\"data\"></div>\n" +
    "                        <div class=\"row text-center\">\n" +
    "                            <button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"uploading\">Update information</button>\n" +
    "                            <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteNews(news)\">\n" +
    "                                Delete News\n" +
    "                            </button><br>\n" +
    "                            {{news.formResponse}}\n" +
    "                        </div>\n" +
    "                    </form>\n" +
    "                </td>\n" +
    "                <td class=\"hidden-xs\" ng-click=\"toggleNews(news)\" style=\"cursor: pointer;\">\n" +
    "                    <h5>{{news.created | date : 'MMM d, y'}}</h5>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <pagination total-items=\"filteredNews.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredNews.length > perPage\"></pagination>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <h4 ng-show=\"filteredNews.length == 0\">Nothing found</h4>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("manageOneSearch/mainOneSearch.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageOneSearch/mainOneSearch.tpl.html",
    "<div class=\"container\">\n" +
    "    <h2>Manage OneSearch</h2>\n" +
    "\n" +
    "    <tabset justified=\"true\" ng-if=\"hasAccess\">\n" +
    "        <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "            <div ng-if=\"tab.number == 0\">\n" +
    "                <div recommended-links-list>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-if=\"tab.number == 1\" >\n" +
    "                <div search-statistics-list>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </tab>\n" +
    "    </tabset>\n" +
    "    <div ng-if=\"!hasAccess\">\n" +
    "        <h3>Sorry, you don't have permissions to manage oneSearch</h3>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("manageOneSearch/manageOneSearch.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageOneSearch/manageOneSearch.tpl.html",
    "<h3>OneSearch Recommended Links</h3>\n" +
    "\n" +
    "<form ng-submit=\"addRecommendation()\">\n" +
    "    <div class=\"row sdOpen\">\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"K\">Keyword</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Keyword\" maxlength=\"200\" ng-model=\"addRec.keyword\"\n" +
    "                   id=\"K\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"L\">Link URL</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"http://www.example.com/\" maxlength=\"1024\"\n" +
    "                   id=\"L\" ng-model=\"addRec.link\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"LT\">Link Title</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Link Title\" maxlength=\"100\" ng-model=\"addRec.description\"\n" +
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
    "\n" +
    "<div class=\"row form-inline\">\n" +
    "    <div class=\"form-group col-md-12\">\n" +
    "        <label for=\"filterBy\">Filter <small>{{filteredList.length}}</small> results by</label>\n" +
    "        <div id=\"filterBy\">\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Keyword contains\" ng-model=\"filterKeyword\">\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"filterLinkTitle\">\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"URL contains\" ng-model=\"filterLink\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"table-responsive\">\n" +
    "    <table class=\"table table-condensed table-hover\">\n" +
    "        <thead>\n" +
    "        <tr>\n" +
    "            <th class=\"hidden-xs\" style=\"width:20%\">\n" +
    "                <a\n" +
    "                        ng-click=\"sortBy(0)\"\n" +
    "                        ng-class=\"{'sortable': !sortModes[0].reverse && sortMode == 0, 'sortable-reverse': sortModes[0].reverse && sortMode == 0}\">\n" +
    "                    Keyword\n" +
    "                </a>\n" +
    "            </th>\n" +
    "            <th class=\"hidden-xs\">\n" +
    "                <a\n" +
    "                        ng-click=\"sortBy(1)\"\n" +
    "                        ng-class=\"{'sortable': !sortModes[1].reverse && sortMode == 1, 'sortable-reverse': sortModes[1].reverse && sortMode == 1}\">\n" +
    "                    Title\n" +
    "                </a>\n" +
    "            </th>\n" +
    "            <th class=\"hidden-xs\">\n" +
    "                <a\n" +
    "                        ng-click=\"sortBy(2)\"\n" +
    "                        ng-class=\"{'sortable': !sortModes[2].reverse && sortMode == 2, 'sortable-reverse': sortModes[2].reverse && sortMode == 2}\">\n" +
    "                    URL\n" +
    "                </a>\n" +
    "            </th>\n" +
    "            <th style=\"width:120px\">\n" +
    "                Action\n" +
    "            </th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "        <tr ng-repeat=\"rec in (filteredList = recList.RecList | filter:{keyword:filterKeyword}\n" +
    "                                                              | filter:{link:filterLink}\n" +
    "                                                              | filter:{description:filterLinkTitle}\n" +
    "                                                              | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\"\n" +
    "                ng-click=\"expand(rec)\">\n" +
    "            <td>\n" +
    "                <span ng-show=\"expanded != rec.id\">{{rec.keyword}}</span>\n" +
    "                <span ng-show=\"expanded == rec.id\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Keyword\" maxlength=\"200\" ng-model=\"rec.keyword\">\n" +
    "                </span>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <span ng-show=\"expanded != rec.id\">{{rec.description}}</span>\n" +
    "                <span ng-show=\"expanded == rec.id\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Title\" maxlength=\"100\" ng-model=\"rec.description\">\n" +
    "                </span>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <span ng-show=\"expanded != rec.id\"><a href=\"{{rec.link}}\">{{rec.link}}</a></span>\n" +
    "                <span ng-show=\"expanded == rec.id\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"URL\" maxlength=\"1024\" ng-model=\"rec.link\">\n" +
    "                </span>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <span ng-show=\"expanded == rec.id\">\n" +
    "                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"updateRec(rec)\">\n" +
    "                        <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                    </button>\n" +
    "                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteRec(rec, $index)\">\n" +
    "                        <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                    </button>\n" +
    "                </span>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "</div>\n" +
    "");
}]);

angular.module("manageOneSearch/oneSearchStat.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageOneSearch/oneSearchStat.tpl.html",
    "<h3>OneSearch Statistics</h3>\n" +
    "\n" +
    "\n" +
    "<div class=\"table-responsive\">\n" +
    "    <table class=\"table table-condensed table-hover\">\n" +
    "        <thead>\n" +
    "        <tr>\n" +
    "            <th style=\"width:80px;\">\n" +
    "                Number\n" +
    "            </th>\n" +
    "            <th>\n" +
    "                Keyword\n" +
    "            </th>\n" +
    "            <th style=\"width:150px;\">\n" +
    "                Count\n" +
    "            </th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "        <tr ng-repeat=\"stat in statList\">\n" +
    "            <td>\n" +
    "                {{$index}}\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                {{stat.keyword}}\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                {{stat.count}}\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "</div>\n" +
    "");
}]);

angular.module("manageSoftware/manageSoftware.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageSoftware/manageSoftware.tpl.html",
    "<div class=\"container\">\n" +
    "    <h2>Manage Software</h2>\n" +
    "\n" +
    "    <tabset justified=\"true\" ng-if=\"hasAccess\">\n" +
    "        <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "            <div ng-if=\"tab.number == 0\">\n" +
    "                <div software-manage-list>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-if=\"tab.number == 1\" >\n" +
    "                <div software-manage-loc-cat>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-if=\"tab.number == 2\" >\n" +
    "                <div software-manage-computer-maps>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </tab>\n" +
    "    </tabset>\n" +
    "    <div ng-if=\"!hasAccess\">\n" +
    "        <h3>Sorry, you don't have permissions to edit software</h3>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("manageSoftware/manageSoftwareComputerMaps.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageSoftware/manageSoftwareComputerMaps.tpl.html",
    "<div>\n" +
    "    <div class=\"row\">\n" +
    "        <form class=\"form-inline\">\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"plan\">Choose Floor Plan</label>\n" +
    "                <select class=\"form-control\" ng-model=\"selMap\" ng-change=\"updateMap()\" id=\"plan\"\n" +
    "                        ng-options=\"map.name for map in SWList.maps | orderBy:'name'\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "    <div class=\"alert alert-info\" role=\"alert\">\n" +
    "        <span class=\"fa fa-exclamation-triangle\"></span> Note: Right-click on the floor plan map in order to add a computer or left-click on existing one in order to edit it.\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"comps-map\" id=\"computer-map\"\n" +
    "             style=\"background: transparent url('//wwwdev.lib.ua.edu/softwareList/floorMaps/{{selMap.floor_plan_file}}') no-repeat 0 0;\n" +
    "                    width:{{selMap.width}}px;\n" +
    "                    height:{{selMap.height}}px;\n" +
    "                    clear: both;\"\n" +
    "             ng-mousedown=\"createComp($event)\"\n" +
    "            >\n" +
    "            <span class=\"comp-normal\"\n" +
    "                 ng-repeat=\"comp in selMap.computers\"\n" +
    "                 style=\"left:{{comp.mapX}}px;top:{{comp.mapY}}px;position: absolute;\"\n" +
    "                 ng-click=\"expand($index)\"\n" +
    "                 ng-class=\"{\n" +
    "                 'fa fa-windows': comp.type == 1,\n" +
    "                 'fa fa-apple': comp.type == 2,\n" +
    "                 'comp-selected': selComp == $index,\n" +
    "                 'comp-turned-off': comp.status !== 1\n" +
    "                 }\"\n" +
    "                    >\n" +
    "            </span>\n" +
    "            <div class=\"selected-form\" ng-show=\"selComp >= 0\" style=\"left:{{selCompX}}px;top:{{selCompY}}px;\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-8\">\n" +
    "                        <h4>&nbsp; Computer ID: {{selMap.computers[selComp].compid}}</h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4 text-right\">\n" +
    "                        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"selComp = -1\" style=\"left:450px;top:-15px;\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <form ng-submit=\"updateComp()\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-md-12\">\n" +
    "                            <div class=\"col-md-4 form-group\">\n" +
    "                                <label for=\"sel_X\">Coordinate X</label>\n" +
    "                                <input type=\"text\" class=\"form-control\" placeholder=\"X\" ng-model=\"selMap.computers[selComp].mapX\" id=\"sel_X\"\n" +
    "                                       maxlength=\"4\" required>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-4 form-group\">\n" +
    "                                <label for=\"sel_Y\">Coordinate Y</label>\n" +
    "                                <input type=\"text\" class=\"form-control\" placeholder=\"Y\" ng-model=\"selMap.computers[selComp].mapY\" id=\"sel_Y\"\n" +
    "                                       maxlength=\"4\" required>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-4 form-group\">\n" +
    "                                <label for=\"sel_status\">Status</label>\n" +
    "                                <select class=\"form-control\" ng-model=\"selCompStatus\" ng-options=\"status.name for status in compStatus\"\n" +
    "                                        id=\"sel_status\">\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"sel_name\">Computer Name</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Enter Computer Name\" ng-model=\"selMap.computers[selComp].name\"\n" +
    "                               id=\"sel_name\" maxlength=\"100\" required>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"sel_os\">OS</label>\n" +
    "                        <select class=\"form-control\" ng-model=\"selCompOS\" ng-options=\"opSys.name for opSys in os\" id=\"sel_os\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12 form-group\">\n" +
    "                        <label for=\"sel_loc\">Location</label>\n" +
    "                        <select class=\"form-control\" ng-model=\"selCompLoc\"\n" +
    "                                ng-options=\"loc.fullName for loc in SWList.locations | orderBy:'fullName'\" id=\"sel_loc\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12 text-center form-group\">\n" +
    "                        <label></label>\n" +
    "                        <button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"selMap.computers[selComp].name.length == 0\">\n" +
    "                            <span class=\"fa fa-fw fa-edit\"></span> Update Information\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteComp()\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span> Delete Computer\n" +
    "                        </button><br>\n" +
    "                        {{compResponse}}\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "            </div>\n" +
    "            <div class=\"selected-form row\" ng-show=\"showCreate\"\n" +
    "                 style=\"left:{{newComp.mapX}}px;top:{{newComp.mapY}}px;\"\n" +
    "                    >\n" +
    "                <div class=\"col-md-8\">\n" +
    "                    <h4>New Computer</h4>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-4 text-right\">\n" +
    "                    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"showCreate = false\" style=\"left:450px;top:-15px;\">\n" +
    "                        <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                <form ng-submit=\"addComp()\">\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"newComp_X\">Coordinate X</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"X\" ng-model=\"newComp.mapX\" id=\"newComp_X\"\n" +
    "                               maxlength=\"4\" required>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"newComp_Y\">Coordinate Y</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Y\" ng-model=\"newComp.mapY\" id=\"newComp_Y\"\n" +
    "                               maxlength=\"4\" required>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"newComp_name\">Computer Name</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Enter Computer Name\" ng-model=\"newComp.name\"\n" +
    "                               id=\"newComp_name\" maxlength=\"100\" required>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6 form-group\">\n" +
    "                        <label for=\"newComp_os\">OS</label>\n" +
    "                        <select class=\"form-control\" ng-model=\"newComp.selType\" ng-options=\"opSys.name for opSys in os\" id=\"newComp_os\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12 form-group\">\n" +
    "                        <label for=\"newComp_loc\">Location</label>\n" +
    "                        <select class=\"form-control\" ng-model=\"newComp.selLoc\"\n" +
    "                                ng-options=\"loc.fullName for loc in SWList.locations | orderBy:'fullName'\" id=\"newComp_loc\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12 text-center form-group\">\n" +
    "                        <label></label>\n" +
    "                        <button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"newComp.name.length == 0\">\n" +
    "                            <span class=\"fa fa-fw fa-plus\"></span> Create Computer\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</div>");
}]);

angular.module("manageSoftware/manageSoftwareItemFields.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageSoftware/manageSoftwareItemFields.tpl.html",
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-6 form-group\">\n" +
    "        <label for=\"up\">Upload Icon</label>\n" +
    "        <input type=\"file\" ngf-select=\"\" accept=\"image/png\" ng-model=\"sw.picFile\"\n" +
    "               ngf-change=\"generateThumb(sw, $files)\" id=\"up\">\n" +
    "        <span class=\"progress\" ng-show=\"sw.picFile[0].progress >= 0\">\n" +
    "            <div class=\"ng-binding\" style=\"width:{{sw.picFile[0].progress}}%\" ng-bind=\"sw.picFile[0].progress + '%'\"></div>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6 form-group\">\n" +
    "        <label for=\"title\">Title</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"Software Title\" ng-model=\"sw.title\"\n" +
    "               id=\"title\" maxlength=\"50\" required>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-6 form-group\">\n" +
    "        <label for=\"descr\">Description</label>\n" +
    "                        <textarea class=\"form-control\" rows=\"3\" id=\"descr\" ng-model=\"sw.description\"\n" +
    "                                  maxlength=\"4096\" required></textarea>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6 form-group\">\n" +
    "        <label for=\"mod\">List of Installed Modules</label>\n" +
    "                        <textarea class=\"form-control\" rows=\"3\" id=\"mod\" ng-model=\"sw.modules\"\n" +
    "                                  maxlength=\"4096\"></textarea>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-12 form-group\">\n" +
    "        <label for=\"links\">Links</label>\n" +
    "        <ul class=\"list-group\" id=\"links\">\n" +
    "            <li class=\"list-group-item\" ng-repeat=\"link in sw.links\">\n" +
    "                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteLink(sw,link)\">\n" +
    "                    <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                </button>\n" +
    "                {{link.description}} <a ng-href=\"{{link.url}}\">{{link.title}}</a>\n" +
    "            </li>\n" +
    "            <li class=\"list-group-item col-md-12\">\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Link Description\"\n" +
    "                           ng-model=\"sw.newLink.description\" maxlength=\"200\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Link Title\"\n" +
    "                           ng-model=\"sw.newLink.title\" maxlength=\"100\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"http://www.example.com/\"\n" +
    "                           ng-model=\"sw.newLink.url\" maxlength=\"1024\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-1\">\n" +
    "                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"addLink(sw)\"\n" +
    "                            ng-disabled=\"sw.newLink.title.length == 0 || sw.newLink.url.length < 2\">\n" +
    "                        <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-12 form-group\">\n" +
    "        <label for=\"ver\">Versions</label>\n" +
    "        <ul class=\"list-group\" id=\"ver\">\n" +
    "            <li class=\"list-group-item col-md-12\" ng-repeat=\"version in sw.versions\">\n" +
    "                <div class=\"col-md-1\">\n" +
    "                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteVersion(sw,version)\">\n" +
    "                        <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                    </button>\n" +
    "                    <span class=\"fa fa-fw fa-windows\" ng-show=\"version.os == 1\"></span>\n" +
    "                    <span class=\"fa fa-fw fa-apple\" ng-show=\"version.os == 2\"></span>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Version\" ng-model=\"version.version\"\n" +
    "                           maxlength=\"50\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-8 form-group\">\n" +
    "                    <label for=\"loc\">Locations</label>\n" +
    "                    <ul class=\"list-group\" id=\"loc\">\n" +
    "                        <li class=\"list-group-item col-md-12\" ng-repeat=\"loc in version.locations\">\n" +
    "                            <div class=\"col-md-8\">\n" +
    "                                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteLocation(sw,version,loc)\">\n" +
    "                                    <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                </button>\n" +
    "                                {{loc.name}}\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-4\">\n" +
    "                                <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 1)\">\n" +
    "                                    <span class=\"fa fa-fw fa-windows\"></span>\n" +
    "                                    <span class=\"fa fa-fw fa-desktop\"></span>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 2)\">\n" +
    "                                    <span class=\"fa fa-fw fa-apple\"></span>\n" +
    "                                    <span class=\"fa fa-fw fa-desktop\"></span>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 4)\">\n" +
    "                                    <span class=\"fa fa-fw fa-windows\"></span>\n" +
    "                                    <span class=\"fa fa-fw fa-laptop\"></span>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-6\" ng-show=\"checkDevices(loc.devices, 8)\">\n" +
    "                                    <span class=\"fa fa-fw fa-apple\"></span>\n" +
    "                                    <span class=\"fa fa-fw fa-laptop\"></span>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item col-md-12\">\n" +
    "                            <div class=\"col-md-8\">\n" +
    "                                <select class=\"form-control\" ng-model=\"version.newLoc.selLoc\"\n" +
    "                                        ng-options=\"loc.fullName for loc in data.locations | orderBy:'fullName'\">\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <div class=\"col-md-6\" ng-repeat=\"device in version.newLoc.devices track by $index\"\n" +
    "                                     ng-show=\"(($index == 0 || $index == 2) && version.os == 1) ||\n" +
    "                                                              (($index == 1 || $index == 3) && version.os == 2)\">\n" +
    "                                    <input type=\"checkbox\" ng-model=\"version.newLoc.devices[$index]\">\n" +
    "                                                    <span ng-show=\"$index <= 1\">\n" +
    "                                                        <span class=\"fa fa-fw fa-desktop\"></span>\n" +
    "                                                    </span>\n" +
    "                                                    <span ng-show=\"$index > 1\">\n" +
    "                                                        <span class=\"fa fa-fw fa-laptop\"></span>\n" +
    "                                                    </span>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-1\">\n" +
    "                                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addLocation(sw,version)\">\n" +
    "                                    <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                                </button>\n" +
    "                            </div>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            <li class=\"list-group-item col-md-6\">\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Version\" ng-model=\"sw.newVer.version\"\n" +
    "                           maxlength=\"50\">\n" +
    "                </div>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <select class=\"form-control\" ng-model=\"sw.newVer.selOS\" ng-options=\"opSys.name for opSys in os\">\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2\">\n" +
    "                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"addVersion(sw)\"\n" +
    "                            ng-disabled=\"sw.newVer.version.length == 0\">\n" +
    "                        <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-6 form-group\">\n" +
    "        <label for=\"cat\">Categories</label>\n" +
    "        <ul class=\"list-group\" id=\"cat\">\n" +
    "            <li class=\"list-group-item col-md-12\">\n" +
    "                <div class=\"col-md-4\" ng-repeat=\"category in sw.categories\">\n" +
    "                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteCategory(sw,category)\">\n" +
    "                        <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                    </button>\n" +
    "                    {{category.name}}\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            <li class=\"list-group-item col-md-12\">\n" +
    "                <div class=\"col-md-10\">\n" +
    "                    <select class=\"form-control\" ng-model=\"sw.selCat\" ng-options=\"cat.name for cat in data.categories\">\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2\">\n" +
    "                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"addCategory(sw)\">\n" +
    "                        <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-3 form-group\">\n" +
    "        <label for=\"effectDate\">Maintenance Effective Date</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"YYYY-MM-DD\" ng-model=\"sw.main_effect\"\n" +
    "               maxlength=\"10\" id=\"effectDate\">\n" +
    "    </div>\n" +
    "    <div class=\"col-md-3 form-group\">\n" +
    "        <label for=\"expDate\">Maintenance Expiration Date</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"YYYY-MM-DD\" ng-model=\"sw.main_exp\"\n" +
    "               maxlength=\"10\" id=\"expDate\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-2 form-group\">\n" +
    "        <label for=\"trf\">TRF</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"TRF number\" ng-model=\"sw.trf\"\n" +
    "               maxlength=\"100\" id=\"trf\">\n" +
    "    </div>\n" +
    "    <div class=\"col-md-2 form-group\">\n" +
    "        <label for=\"po\">PO</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"PO number\" ng-model=\"sw.po\"\n" +
    "               maxlength=\"100\" id=\"po\">\n" +
    "    </div>\n" +
    "    <div class=\"col-md-2 form-group\">\n" +
    "        <label for=\"numL\">Number of Licenses</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"Number of Licenses\" ng-model=\"sw.num_licenses\"\n" +
    "               maxlength=\"100\" id=\"numL\">\n" +
    "    </div>\n" +
    "    <div class=\"col-md-2 form-group\">\n" +
    "        <label for=\"trfNotes\">TRF Notes</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"TRF notes\" ng-model=\"sw.trf_notes\"\n" +
    "               maxlength=\"100\" id=\"trfNotes\">\n" +
    "    </div>\n" +
    "    <div class=\"col-md-2 form-group\">\n" +
    "        <label for=\"lMode\">License Mode</label>\n" +
    "        <select class=\"form-control\" ng-model=\"sw.selMode\" ng-options=\"mode.name for mode in data.licenseModes\"\n" +
    "                id=\"lMode\">\n" +
    "        </select>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-2 form-group\">\n" +
    "        <label for=\"purDate\">Purchase Date</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"YYYY-MM-DD\" ng-model=\"sw.purch_date\"\n" +
    "               maxlength=\"10\" id=\"purDate\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-6 form-group\">\n" +
    "        <label for=\"prodKey\">Product Key</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"Product Key\" ng-model=\"sw.pkey\"\n" +
    "               maxlength=\"100\" id=\"prodKey\">\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6 form-group\">\n" +
    "        <label for=\"apDev\">Approved for Devices</label>\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"List of Devices\" ng-model=\"sw.devices\"\n" +
    "               maxlength=\"100\" id=\"apDev\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-1\">\n" +
    "        <label>Vendor</label>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-11\">\n" +
    "        <div class=\"col-md-4 form-group\">\n" +
    "            <label for=\"vendorName\">Company</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Company Name\" ng-model=\"sw.vendor_name\"\n" +
    "                   maxlength=\"60\" id=\"vendorName\">\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"vendorContact\">Contact</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Contact Name\" ng-model=\"sw.vendor_contact\"\n" +
    "                   maxlength=\"60\" id=\"vendorContact\">\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"vendorEmail\">Email</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Contact Email\" ng-model=\"sw.vendor_email\"\n" +
    "                   maxlength=\"255\" id=\"vendorEmail\">\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2 form-group\">\n" +
    "            <label for=\"vendorPhone\">Phone</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Contact Phone\" ng-model=\"sw.vendor_phone\"\n" +
    "                   maxlength=\"20\" id=\"vendorPhone\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-1\">\n" +
    "        <label>Owner</label>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-11\">\n" +
    "        <div class=\"col-md-4 form-group\">\n" +
    "            <label for=\"ownerDept\">Department</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Owner Department\" ng-model=\"sw.owner.department\"\n" +
    "                   maxlength=\"100\" id=\"ownerDept\" required>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"ownerName\">Contact</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Owner Contact Name\" ng-model=\"sw.owner.name\"\n" +
    "                   maxlength=\"60\" id=\"ownerName\">\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"ownerEmail\">Email</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Owner Contact Email\" ng-model=\"sw.owner.email\"\n" +
    "                   maxlength=\"128\" id=\"ownerEmail\">\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2 form-group\">\n" +
    "            <label for=\"ownerPhone\">Phone</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Owner Contact Phone\" ng-model=\"sw.owner.phone\"\n" +
    "                   maxlength=\"13\" id=\"ownerPhone\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row\" ng-repeat=\"partner in sw.partners\">\n" +
    "    <div class=\"col-md-1\">\n" +
    "        <label>Partner{{$index + 1}}</label>\n" +
    "        <button type=\"button\" class=\"btn btn-success\" ng-click=\"addPartner(sw)\" ng-if=\"$index == 0\">\n" +
    "            <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "        </button>\n" +
    "        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deletePartner(sw, partner)\" ng-if=\"$index !== 0\">\n" +
    "            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-11\">\n" +
    "        <div class=\"col-md-4 form-group\">\n" +
    "            <label for=\"partnerDept\">Department</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Partner Department\" ng-model=\"partner.department\"\n" +
    "                   maxlength=\"100\" id=\"partnerDept\">\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"partnerName\">Contact</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Partner Contact Name\" ng-model=\"partner.name\"\n" +
    "                   maxlength=\"60\" id=\"partnerName\">\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"partnerEmail\">Email</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Partner Contact Email\" ng-model=\"partner.email\"\n" +
    "                   maxlength=\"128\" id=\"partnerEmail\">\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2 form-group\">\n" +
    "            <label for=\"partnerPhone\">Phone</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Partner Contact Phone\" ng-model=\"partner.phone\"\n" +
    "                   maxlength=\"13\" id=\"partnerPhone\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-1\">\n" +
    "        <label>Requester</label>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-11\">\n" +
    "        <div class=\"col-md-4 form-group\">\n" +
    "            <label for=\"requesterDept\">Department</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"requester Department\" ng-model=\"sw.requester.department\"\n" +
    "                   maxlength=\"100\" id=\"requesterDept\">\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"requesterName\">Contact</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Requester Contact Name\" ng-model=\"sw.requester.name\"\n" +
    "                   maxlength=\"60\" id=\"requesterName\">\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 form-group\">\n" +
    "            <label for=\"requesterEmail\">Email</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Requester Contact Email\" ng-model=\"sw.requester.email\"\n" +
    "                   maxlength=\"128\" id=\"requesterEmail\">\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2 form-group\">\n" +
    "            <label for=\"requesterPhone\">Phone</label>\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Requester Contact Phone\" ng-model=\"sw.requester.phone\"\n" +
    "                   maxlength=\"13\" id=\"requesterPhone\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("manageSoftware/manageSoftwareList.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageSoftware/manageSoftwareList.tpl.html",
    "<div>\n" +
    "    <div class=\"row form-inline\">\n" +
    "        <div class=\"form-group col-md-12\">\n" +
    "            <div class=\"col-md-6\">\n" +
    "                <label for=\"filterBy\">Filter <small>{{filteredSW.length}}</small> results by</label>\n" +
    "                <div id=\"filterBy\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"titleFilter\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Description contains\" ng-model=\"descrFilter\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3\">\n" +
    "                <label for=\"sortBy\">Sort by</label>\n" +
    "                <div id=\"sortBy\">\n" +
    "                    <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"0\" ng-click=\"sortBy(0)\">\n" +
    "                        Title\n" +
    "                        <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[0].reverse\"></span>\n" +
    "                        <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[0].reverse\"></span>\n" +
    "                    </button>\n" +
    "                    <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"1\" ng-click=\"sortBy(1)\">\n" +
    "                        Status\n" +
    "                        <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[1].reverse\"></span>\n" +
    "                        <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[1].reverse\"></span>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3\">\n" +
    "                <label>Export</label>\n" +
    "                <div>\n" +
    "                    <button type=\"button\" class=\"btn btn-default\" ng-click=\"export()\">\n" +
    "                        <span class=\"fa fa-fw fa-download\"></span> JSON\n" +
    "                    </button><br>\n" +
    "                    <a target=\"_self\" ng-href=\"{{exportUrl}}\" download=\"softwareData.json\" ng-if=\"exportUrl\">Download file</a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredSW.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredSW.length > perPage\"></pagination>\n" +
    "    </div>\n" +
    "    <div class=\"row row-clickable\"\n" +
    "         ng-repeat=\"sw in filteredSW = (SWList.software | filter:{title:titleFilter}\n" +
    "                                                        | filter:{description:descrFilter}\n" +
    "                                                        | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\n" +
    "        | startFrom:(currentPage-1)*perPage | limitTo:perPage\"\n" +
    "         ng-class=\"{sdOpen: sw.show}\">\n" +
    "        <div class=\"col-md-12\" ng-click=\"toggleSW(sw)\" style=\"cursor: pointer;\">\n" +
    "            <table class=\"table\">\n" +
    "                <tr>\n" +
    "                    <td style=\"width: 15px;\">\n" +
    "                        <a>\n" +
    "                            <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"sw.show\"></span>\n" +
    "                            <span class=\"fa fa-fw fa-caret-down\" ng-show=\"sw.show\"></span>\n" +
    "                        </a>\n" +
    "                    </td>\n" +
    "                    <td style=\"width:64px;\">\n" +
    "                        <img ng-hide=\"sw.picFile.length > 0\" src=\"{{sw.icon}}\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                        <img ng-show=\"sw.picFile.length > 0\" ngf-src=\"sw.picFile[0]\" class=\"thumb\" width=\"64px\" height=\"64px\">\n" +
    "                    </td>\n" +
    "                    <td>\n" +
    "                        <h4>\n" +
    "                            <a>{{sw.title}}</a>\n" +
    "                        </h4>\n" +
    "                    </td>\n" +
    "                    <td style=\"width: 79px;\">\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"publishSW(sw)\" ng-show=\"sw.status == 0\">\n" +
    "                            Publish\n" +
    "                        </button>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "        <div ng-if=\"sw.show\">\n" +
    "            <form name=\"editSW{{sw.sid}}\" ng-submit=\"updateSW(sw)\">\n" +
    "                <div software-item-fields-list swdata=\"sw\" list=\"SWList\"></div>\n" +
    "                <div class=\"row form-group text-center\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-success\">Update information</button>\n" +
    "                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"unpublishSW(sw)\" ng-hide=\"sw.status == 0\">\n" +
    "                        Unpublish\n" +
    "                    </button>\n" +
    "                    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"copySW(sw)\">\n" +
    "                        Copy to New\n" +
    "                    </button>\n" +
    "                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteSW(sw)\">\n" +
    "                        Delete {{sw.title}} software\n" +
    "                    </button><br>\n" +
    "                    {{sw.formResponse}}\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <pagination total-items=\"filteredSW.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredSW.length > perPage\"></pagination>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <h4 ng-show=\"filteredSW.length == 0\">Nothing found</h4>\n" +
    "</div>\n" +
    "\n" +
    "<h3>Add New Software</h3>\n" +
    "<form name=\"addNewSW\" ng-submit=\"createSW()\">\n" +
    "    <div class=\"sdOpen\">\n" +
    "        <div software-item-fields-list swdata=\"newSW\" list=\"SWList\"></div>\n" +
    "        <div class=\"row form-group text-center\">\n" +
    "            <button type=\"submit\" class=\"btn btn-success\">Create Software Record</button><br>\n" +
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
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Parent ID\" ng-model=\"newLocation.parent\"\n" +
    "                       maxlength=\"3\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-8\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"New Location Name\" ng-model=\"newLocation.name\"\n" +
    "                       maxlength=\"50\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addLocation()\" ng-disabled=\"newLocation.name.length == 0\">\n" +
    "                    <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            {{locResponse}}\n" +
    "        </div>\n" +
    "        <table class=\"table table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th style=\"width:50px;\">ID</th>\n" +
    "                <th style=\"width:75px;\">Parent</th>\n" +
    "                <th>Name</th>\n" +
    "                <th style=\"width:120px;\">Action</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"location in SWList.locations\" ng-click=\"selectLocation(location)\">\n" +
    "                <td>\n" +
    "                    {{location.lid}}\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"selLocation == location.lid\">\n" +
    "                        {{location.parent}}\n" +
    "                    </span>\n" +
    "                    <span ng-show=\"selLocation == location.lid\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Parent ID\" ng-model=\"location.parent\"\n" +
    "                               maxlength=\"3\">\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"selLocation == location.lid\">\n" +
    "                        {{location.name}}\n" +
    "                    </span>\n" +
    "                    <span ng-show=\"selLocation == location.lid\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Location Name\" ng-model=\"location.name\"\n" +
    "                               maxlength=\"50\">\n" +
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
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-10\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"New Category\" ng-model=\"newCategory\" maxlength=\"30\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addCategory()\" ng-disabled=\"newCategory.length == 0\">\n" +
    "                    <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            {{catResponse}}\n" +
    "        </div>\n" +
    "        <table class=\"table table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th style=\"width:50px;\">ID</th>\n" +
    "                <th>Name</th>\n" +
    "                <th style=\"width:120px;\">Action</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"category in SWList.categories\" ng-click=\"selectCategory(category)\">\n" +
    "                <td>\n" +
    "                    {{category.cid}}\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"selCategory == category.cid\">\n" +
    "                        {{category.name}}\n" +
    "                    </span>\n" +
    "                    <span ng-show=\"selCategory == category.cid\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Category Name\" ng-model=\"category.name\"\n" +
    "                               maxlength=\"30\">\n" +
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
    "<div class=\"container\">\n" +
    "    <h2>Web Applications Admin Interface</h2>\n" +
    "\n" +
    "    <tabset justified=\"true\" ng-if=\"hasAccess\">\n" +
    "        <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "            <div ng-show=\"tab.number == 0\">\n" +
    "                <table class=\"table table-hover table-condensed\">\n" +
    "                    <thead>\n" +
    "                    <tr>\n" +
    "                        <th style=\"width:15%;\"><a ng-click=\"sortBy(0)\" style=\"cursor: pointer;\">Login</a></th>\n" +
    "                        <th style=\"width:15%;\" class=\"text-center\"><a ng-click=\"sortBy(1)\" style=\"cursor: pointer;\">Name</a></th>\n" +
    "                        <th class=\"text-center\">Access Rights to Web Applications</th>\n" +
    "                        <th class=\"text-center\" style=\"width:120px;\">Action</th>\n" +
    "                    </tr>\n" +
    "                    </thead>\n" +
    "                    <tr ng-repeat=\"user in users | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse\" ng-click=\"expandUser(user)\">\n" +
    "                        <th scope=\"row\" class=\"clickable\">\n" +
    "                            {{user.wpLogin}}\n" +
    "                        </th>\n" +
    "                        <td class=\"text-center clickable\">\n" +
    "                            {{user.name}}\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <div ng-show=\"isExpUser(user.id)\">\n" +
    "                                <div class=\"row\" ng-repeat=\"app in apps\">\n" +
    "                                    <div class=\"col-md-2 text-right\">\n" +
    "                                        <input type=\"checkbox\" ng-model=\"user.access[$index]\">\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-10\">\n" +
    "                                        <a href=\"{{app.link}}\">{{app.appName}}</a>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div ng-hide=\"isExpUser(user.id)\" class=\"row text-center\">\n" +
    "                                <div class=\"col-md-3\" ng-repeat=\"app in apps\" ng-show=\"user.access[$index]\">\n" +
    "                                    <a href=\"{{app.link}}\">{{app.appName}}</a>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </td>\n" +
    "                        <td class=\"text-center\">\n" +
    "                            <div ng-show=\"isExpUser(user.id)\" class=\"form-group\">\n" +
    "                                <button type=\"button\" class=\"btn btn-success\" ng-click=\"updateUser(user)\" ng-disabled=\"isLoading\">\n" +
    "                                    <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                                </button>\n" +
    "                                <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteUser(user, $index)\" ng-disabled=\"isLoading\">\n" +
    "                                    <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                </button>\n" +
    "                                <br>\n" +
    "                                {{result}}\n" +
    "                            </div>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                    <tr>\n" +
    "                        <td colspan=\"2\">\n" +
    "                            <select class=\"form-control\" ng-model=\"newUser\" ng-options=\"wpUser.fullName for wpUser in wpUsers | orderBy:'last_name'\">\n" +
    "                            </select>\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <div class=\"row\" ng-repeat=\"app in apps\">\n" +
    "                                <div class=\"col-md-2 text-right\">\n" +
    "                                    <input type=\"checkbox\" ng-model=\"newUserAccess[$index]\">\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-10\">\n" +
    "                                    <a href=\"{{app.link}}\">{{app.appName}}</a>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </td>\n" +
    "                        <td class=\"text-center\">\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <button type=\"button\" class=\"btn btn-success\" ng-click=\"createUser(newUser)\" ng-disabled=\"isLoading || newUser.login.length <= 1\">\n" +
    "                                    <span class=\"fa fa-fw fa-plus\"></span> Grant Access\n" +
    "                                </button><br>\n" +
    "                                {{result2}}\n" +
    "                            </div>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "            <div ng-show=\"tab.number == 1\">\n" +
    "                <h4>Web applications with data manageable by users:</h4>\n" +
    "                <h4 class=\"text-center\">\n" +
    "                    <a href=\"/edit-directory-profile/\">Edit my Directory Profile</a>\n" +
    "                </h4>\n" +
    "                <h4 class=\"text-center\" ng-repeat=\"app in apps\" ng-show=\"$index > 0\">\n" +
    "                    <a href=\"{{app.link}}\">{{app.appName}}</a>\n" +
    "                </h4>\n" +
    "                <p>When we create new web application it has to be added to the database manually.</p>\n" +
    "            </div>\n" +
    "        </tab>\n" +
    "    </tabset>\n" +
    "    <div ng-if=\"!hasAccess\">\n" +
    "        <div view-my-web-apps>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("manageUserGroups/viewMyWebApps.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("manageUserGroups/viewMyWebApps.tpl.html",
    "<h3>My Web Applications</h3>\n" +
    "\n" +
    "<div class=\"form-group\" ng-if=\"appsAccess\">\n" +
    "    <label for=\"webapps\">Web Application Back-End access links</label>\n" +
    "    <ul class=\"list-group\" id=\"webapps\">\n" +
    "        <li class=\"list-group-item\">\n" +
    "            <a href=\"/edit-directory-profile/\">Edit my Directory Profile</a>\n" +
    "        </li>\n" +
    "        <li class=\"list-group-item\" ng-repeat=\"app in userInfo.myApps\">\n" +
    "            <a ng-href=\"{{app.link}}\">{{app.appName}}</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "<div ng-if=\"!appsAccess\">\n" +
    "    <h4>Sorry, you have to be logged in to manage applications</h4>\n" +
    "</div>");
}]);

angular.module("oneSearchErrors/oneSearchErrors.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("oneSearchErrors/oneSearchErrors.tpl.html",
    "<div class=\"container\">\n" +
    "    <h2>OneSearch Errors</h2>\n" +
    "\n" +
    "    <tabset ng-if=\"dataProcessed\">\n" +
    "        <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "            <div ng-if=\"tab.number == 0\">\n" +
    "                <div error-graph errors=\"errors\" range=\"today\"></div>\n" +
    "            </div>\n" +
    "            <div ng-if=\"tab.number == 1\" >\n" +
    "                <div error-graph errors=\"errors\" range=\"month\"></div>\n" +
    "            </div>\n" +
    "            <div ng-if=\"tab.number == 2\" >\n" +
    "                <div error-graph errors=\"errors\" range=\"year\"></div>\n" +
    "            </div>\n" +
    "        </tab>\n" +
    "    </tabset>\n" +
    "    <table class=\"table-colors\">\n" +
    "        <tr>\n" +
    "            <td class=\"table-ebsco\"></td>\n" +
    "            <td>EBSCO API errors</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td class=\"table-catalog\"></td>\n" +
    "            <td>Catalog API errors</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td class=\"table-eJournals\"></td>\n" +
    "            <td>Serial Solutions eJournals errors</td>\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <h3>Detailed Error List</h3>\n" +
    "        <div class=\"btn-group\">\n" +
    "            <label class=\"btn btn-primary\" ng-model=\"eEngine.engine\" btn-radio=\"0\">EBSCO</label>\n" +
    "            <label class=\"btn btn-primary\" ng-model=\"eEngine.engine\" btn-radio=\"1\">Catalog</label>\n" +
    "            <label class=\"btn btn-primary\" ng-model=\"eEngine.engine\" btn-radio=\"2\">eJournals</label>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-12\" ng-repeat=\"year in errors.tree[eEngine.engine].years\">\n" +
    "            <h4 class=\"clickable\" ng-click=\"year.open = !year.open\">\n" +
    "                <a>{{year.name}}</a>\n" +
    "                <span class=\"label label-warning\">{{year.counter}}</span>\n" +
    "            </h4>\n" +
    "            <div class=\"col-xs-12\" ng-repeat=\"month in year.months\" ng-if=\"year.open\">\n" +
    "                <h5 class=\"clickable\" ng-click=\"month.open = !month.open\">\n" +
    "                    <a>{{month.name}}</a>\n" +
    "                    <span class=\"label label-warning\">{{month.counter}}</span>\n" +
    "                </h5>\n" +
    "                <div class=\"col-xs-12\" ng-repeat=\"day in month.days\" ng-if=\"month.open\">\n" +
    "                    <h6 class=\"clickable\"  ng-click=\"day.open = !day.open\">\n" +
    "                        <a>{{day.day}}</a>\n" +
    "                        <span class=\"label label-warning\">{{day.counter}}</span>\n" +
    "                    </h6>\n" +
    "                    <p ng-repeat=\"error in day.errors\" ng-if=\"day.open\">\n" +
    "                        <span class=\"label label-info\">\n" +
    "                            {{error.recorded | date : 'hh:mm a'}}\n" +
    "                        </span>\n" +
    "                        {{error.description}}\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("staffDirectory/staffDirectory.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staffDirectory/staffDirectory.tpl.html",
    "<div class=\"container\">\n" +
    "    <h2>Library Staff Directory Management</h2>\n" +
    "\n" +
    "    <tabset justified=\"true\" ng-if=\"hasAccess\">\n" +
    "        <tab ng-repeat=\"tab in tabs\" heading=\"{{tab.name}}\" active=\"tab.active\">\n" +
    "            <div ng-if=\"tab.number == 0\">\n" +
    "                <div manage-sd-people>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-if=\"tab.number == 1\" >\n" +
    "                <div manage-sd-subjects>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-if=\"tab.number == 2\">\n" +
    "                <div manage-sd-departments>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </tab>\n" +
    "    </tabset>\n" +
    "    <div ng-if=\"!hasAccess\">\n" +
    "        <h3>Sorry, you don't have permissions to manage staff directory</h3>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("staffDirectory/staffDirectoryDepartments.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staffDirectory/staffDirectoryDepartments.tpl.html",
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <h3>Departments</h3>\n" +
    "        <div class=\"row sdOpen\">\n" +
    "            <div class=\"col-md-5\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Department Name\" ng-model=\"newDept.name\"\n" +
    "                       maxlength=\"100\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-5\">\n" +
    "                <select class=\"form-control\" ng-model=\"newDept.selLib\" ng-options=\"lib.name for lib in Directory.libraries\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addDepartment()\" ng-disabled=\"newDept.name.length == 0\">\n" +
    "                    <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            {{depResponse}}\n" +
    "        </div>\n" +
    "        <table class=\"table table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th>Department</th>\n" +
    "                <th>Location</th>\n" +
    "                <th style=\"width:120px;\">Action</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"dept in Directory.departments\" ng-click=\"expandDepartment(dept)\">\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"dept.show\">{{dept.name}}</span>\n" +
    "                    <span ng-show=\"dept.show\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Department Name\" ng-model=\"dept.name\"\n" +
    "                               maxlength=\"100\">\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"dept.show\">{{dept.selLib.name}}</span>\n" +
    "                    <span ng-show=\"dept.show\">\n" +
    "                        <select class=\"form-control\" ng-model=\"dept.selLib\" ng-options=\"lib.name for lib in Directory.libraries\">\n" +
    "                        </select>\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div ng-show=\"dept.show\">\n" +
    "                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"editDepartment(dept)\" ng-disabled=\"dept.name.length == 0\">\n" +
    "                            <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteDepartment(dept)\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <h3>Libraries/Locations</h3>\n" +
    "        <div class=\"row sdOpen\">\n" +
    "            <div class=\"col-md-10\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Location Name\" ng-model=\"newLoc.name\"\n" +
    "                       maxlength=\"100\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addLibrary()\" ng-disabled=\"newLoc.name.length == 0\">\n" +
    "                    <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            {{libResponse}}\n" +
    "        </div>\n" +
    "        <table class=\"table table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th>Library/Location</th>\n" +
    "                <th style=\"width:120px;\">Action</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"lib in Directory.libraries\" ng-click=\"expandLibrary(lib)\">\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"lib.show\">{{lib.name}}</span>\n" +
    "                    <span ng-show=\"lib.show\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Library Name\" ng-model=\"lib.name\"\n" +
    "                               maxlength=\"100\">\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div ng-show=\"lib.show\">\n" +
    "                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"editLibrary(lib)\" ng-disabled=\"lib.name.length == 0\">\n" +
    "                            <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteLibrary(lib)\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "\n" +
    "        <h3>Divisions</h3>\n" +
    "        <div class=\"row sdOpen\">\n" +
    "            <div class=\"col-md-10\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Division Name\" ng-model=\"newDiv.name\"\n" +
    "                       maxlength=\"100\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addDivision()\" ng-disabled=\"newDiv.name.length == 0\">\n" +
    "                    <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            {{divResponse}}\n" +
    "        </div>\n" +
    "        <table class=\"table table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th>Division</th>\n" +
    "                <th style=\"width:120px;\">Action</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"division in Directory.divisions\" ng-click=\"expandDivision(division)\" ng-if=\"division.divid > 0\">\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"division.show\">{{division.name}}</span>\n" +
    "                    <span ng-show=\"division.show\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Division Name\" ng-model=\"division.name\"\n" +
    "                               maxlength=\"100\">\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div ng-show=\"division.show\">\n" +
    "                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"editDivision(division)\"\n" +
    "                                ng-disabled=\"division.name.length == 0\">\n" +
    "                            <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteDivision(division)\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("staffDirectory/staffDirectoryPeople.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staffDirectory/staffDirectoryPeople.tpl.html",
    "<div>\n" +
    "    <h3>Add New Person</h3>\n" +
    "    <form ng-submit=\"addPerson()\">\n" +
    "        <div class=\"row sdOpen\">\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"rank\">Rank</label>\n" +
    "                <select class=\"form-control\" ng-model=\"newPerson.rank\" ng-options=\"rank for rank in ranks\" id=\"rank\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"firstName\">First Name</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"First Name\" maxlength=\"25\"\n" +
    "                       ng-model=\"newPerson.first\" id=\"firstName\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"lastName\">Last Name</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Last Name\" maxlength=\"25\"\n" +
    "                       ng-model=\"newPerson.last\" id=\"lastName\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4 form-group\">\n" +
    "                <label for=\"title\">Title</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title\" maxlength=\"150\"\n" +
    "                       ng-model=\"newPerson.title\" id=\"title\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"divis\">Division</label>\n" +
    "                <select class=\"form-control\" ng-model=\"newPerson.selDiv\" ng-options=\"div.name for div in Directory.divisions\" id=\"divis\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"dept\">Department</label>\n" +
    "                <select class=\"form-control\" ng-model=\"newPerson.selDept\" ng-options=\"dept.name for dept in Directory.departments\" id=\"dept\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"email\">Email</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Email\" maxlength=\"255\"\n" +
    "                       ng-model=\"newPerson.email\" id=\"email\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"phone\">Phone</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Phone\" maxlength=\"15\"\n" +
    "                       ng-model=\"newPerson.phone\" id=\"phone\" required>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"fax\">Fax</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Fax\" maxlength=\"15\" ng-model=\"newPerson.fax\" id=\"fax\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12 form-group text-center\">\n" +
    "                <button type=\"submit\" class=\"btn btn-success\"\n" +
    "                        ng-disabled=\"newPerson.first.length < 1 ||\n" +
    "                                     newPerson.last.length < 1 ||\n" +
    "                                     newPerson.title.length < 1 ||\n" +
    "                                     newPerson.email.length < 1\">\n" +
    "                    Create New Record\n" +
    "                </button><br>\n" +
    "                {{formResponse}}\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "    <h3>People List</h3>\n" +
    "    <div class=\"row form-inline\">\n" +
    "        <div class=\"form-group col-md-12\">\n" +
    "            <label for=\"filterBy\">Filter <small>{{filteredList.length}}</small> results by</label>\n" +
    "            <div id=\"filterBy\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Last name contains\" ng-model=\"lastNameFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"First name contains\" ng-model=\"firstNameFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"titleFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Department contains\" ng-model=\"deptFilter\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredList.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredList.length > perPage\"></pagination>\n" +
    "    </div>\n" +
    "    <div class=\"table-responsive\">\n" +
    "        <table class=\"table table-condensed table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th class=\"hidden-xs\" style=\"width:21%\">\n" +
    "                    <a ng-click=\"sortBy(0)\"\n" +
    "                       ng-class=\"{'sortable': !sortModes[0].reverse && sortMode == 0, 'sortable-reverse': sortModes[0].reverse && sortMode == 0}\">\n" +
    "                        Name\n" +
    "                    </a>\n" +
    "                </th>\n" +
    "                <th class=\"hidden-xs\" style=\"width:21%\">\n" +
    "                    <a ng-click=\"sortBy(1)\"\n" +
    "                       ng-class=\"{'sortable': !sortModes[1].reverse && sortMode == 1, 'sortable-reverse': sortModes[1].reverse && sortMode == 1}\">\n" +
    "                        Title\n" +
    "                    </a>\n" +
    "                </th>\n" +
    "                <th class=\"hidden-xs\" style=\"width:21%\">\n" +
    "                    <a ng-click=\"sortBy(2)\"\n" +
    "                       ng-class=\"{'sortable': !sortModes[2].reverse && sortMode == 2, 'sortable-reverse': sortModes[2].reverse && sortMode == 2}\">\n" +
    "                        Department/Division\n" +
    "                    </a>\n" +
    "                </th>\n" +
    "                <th class=\"hidden-xs\" style=\"width:16%\">\n" +
    "                    Contact Info\n" +
    "                </th>\n" +
    "                <th class=\"hidden-xs\" style=\"width:21%\">\n" +
    "                    Subjects\n" +
    "                </th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"person in filteredList = (Directory.list\n" +
    "                                                        | filter:{lastname:lastNameFilter}\n" +
    "                                                        | filter:{firstname:firstNameFilter}\n" +
    "                                                        | filter:{title:titleFilter}\n" +
    "                                                        | filter:{department:deptFilter}\n" +
    "                                                        | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\n" +
    "                                                        | startFrom:(currentPage-1)*perPage\n" +
    "                                                        | limitTo:perPage\">\n" +
    "                <td ng-click=\"togglePerson(person)\" style=\"cursor: pointer;\">\n" +
    "                    <h4>\n" +
    "                        <a>\n" +
    "                            <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"person.show\"></span>\n" +
    "                            <span class=\"fa fa-fw fa-caret-down\" ng-show=\"person.show\"></span>\n" +
    "                            {{person.firstname}} {{person.lastname}}\n" +
    "                        </a>\n" +
    "                        <span ng-show=\"person.rank.length > 0\">\n" +
    "                            <small>{{person.rank}}</small>\n" +
    "                        </span>\n" +
    "                    </h4>\n" +
    "                    <img ng-src=\"{{person.photo}}\" width=\"180\" height=\"225\" ng-if=\"person.photo != null\" ng-show=\"person.show\">\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <h4 ng-hide=\"person.show\">\n" +
    "                        <small>{{person.title}}</small>\n" +
    "                    </h4>\n" +
    "                    <div class=\"form-group\" ng-show=\"person.show\">\n" +
    "                        <label for=\"{{person.id}}_title\">Title</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"{{person.title}}\" maxlength=\"150\" ng-model=\"person.title\" required\n" +
    "                               id=\"{{person.id}}_title\">\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\" ng-show=\"person.show\">\n" +
    "                        <label for=\"{{person.id}}_rank\">Rank</label>\n" +
    "                        <select class=\"form-control\" id=\"{{person.id}}_rank\" ng-model=\"person.rank\"\n" +
    "                                ng-options=\"rank for rank in ranks\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\" ng-show=\"person.show\">\n" +
    "                        <label for=\"{{person.id}}_addSubj\">Select New Subject</label>\n" +
    "                        <select class=\"form-control\" id=\"{{person.id}}_addSubj\" ng-model=\"person.selSubj\"\n" +
    "                                ng-options=\"sub.subject for sub in Directory.subjects\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"text-center\" ng-show=\"person.show\">\n" +
    "                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"updatePerson(person)\"\n" +
    "                                ng-disabled=\"person.first.length < 1 ||\n" +
    "                                             person.last.length < 1 ||\n" +
    "                                             person.title.length < 1 ||\n" +
    "                                             person.email.length < 1\">\n" +
    "                            Update information\n" +
    "                        </button><br>\n" +
    "                        {{person.subjResponse}}\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <h4 ng-hide=\"person.show\">\n" +
    "                        <small>{{person.department}}</small>\n" +
    "                    </h4>\n" +
    "                    <h4 ng-hide=\"person.show\">\n" +
    "                        <small>{{person.division}}</small>\n" +
    "                    </h4>\n" +
    "                    <div class=\"form-group\" ng-show=\"person.show\">\n" +
    "                        <label for=\"{{person.id}}_dept\">Department</label>\n" +
    "                        <select class=\"form-control\" id=\"{{person.id}}_dept\" ng-model=\"person.selDept\"\n" +
    "                                ng-options=\"dept.name for dept in Directory.departments\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\" ng-show=\"person.show\">\n" +
    "                        <label for=\"{{person.id}}_divis\">Division</label>\n" +
    "                        <select class=\"form-control\" id=\"{{person.id}}_divis\" ng-model=\"person.selDiv\"\n" +
    "                                ng-options=\"div.name for div in Directory.divisions\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"row form-group\" ng-show=\"person.show\">\n" +
    "                        <div class=\"col-md-8\">\n" +
    "                            <label for=\"{{person.id}}_addType\">Select Subject Type</label>\n" +
    "                            <select class=\"form-control\" id=\"{{person.id}}_addType\" ng-model=\"person.selType\"\n" +
    "                                    ng-options=\"type.name for type in subjectTypes\">\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            <label>Add</label>\n" +
    "                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"addSubject(person)\">\n" +
    "                                <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"text-center\" ng-show=\"person.show\">\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deletePerson(person)\">\n" +
    "                            Delete {{person.firstname}} {{person.lastname}}\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div ng-hide=\"person.show\">\n" +
    "                        <span class=\"fa fa-fw fa-envelope\"></span><small>{{person.email}}</small>\n" +
    "                    </div>\n" +
    "                    <div ng-hide=\"person.show\">\n" +
    "                        <span class=\"fa fa-fw fa-phone\"></span><small>{{person.phone}}</small>\n" +
    "                    </div>\n" +
    "                    <div ng-hide=\"person.show\">\n" +
    "                        <span class=\"fa fa-fw fa-fax\"></span><small>{{person.fax}}</small>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\" ng-show=\"person.show\">\n" +
    "                        <label for=\"{{person.id}}_email\">Email</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"{{person.email}}\" maxlength=\"1024\" ng-model=\"person.email\" required\n" +
    "                               id=\"{{person.id}}_email\">\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\" ng-show=\"person.show\">\n" +
    "                        <label for=\"{{person.id}}_phone\">Phone</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"{{person.phone}}\" maxlength=\"15\" ng-model=\"person.phone\" required\n" +
    "                               id=\"{{person.id}}_phone\">\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\" ng-show=\"person.show\">\n" +
    "                        <label for=\"{{person.id}}_fax\">Fax</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"{{person.fax}}\" maxlength=\"15\" ng-model=\"person.fax\"\n" +
    "                               id=\"{{person.id}}_fax\">\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div ng-repeat=\"subject in person.subjects\" ng-hide=\"person.show\">\n" +
    "                        <a href=\"{{subject.link}}\">{{subject.subject}}</a>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12 form-group\" ng-show=\"person.show\">\n" +
    "                        <label for=\"{{person.id}}_subj\">Subjects</label>\n" +
    "                        <div id=\"{{person.id}}_subj\">\n" +
    "                            <div class=\"row form-group\" ng-repeat=\"subject in person.subjects\">\n" +
    "                                <div class=\"col-md-2\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteSubject(person, subject, $index)\">\n" +
    "                                        <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                                    </button>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-10\">\n" +
    "                                    <a href=\"{{subject.link}}\">{{subject.subject}}</a><br>\n" +
    "                                    <small>{{subjectTypes[subject.type - 1].name}}</small>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredList.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredList.length > perPage\"></pagination>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("staffDirectory/staffDirectoryProfile.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staffDirectory/staffDirectoryProfile.tpl.html",
    "<div class=\"container\">\n" +
    "    <h2>Profile Management</h2>\n" +
    "\n" +
    "    <div ng-if=\"userProfile.person.uid > 0 && userInfo.login\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-3\">\n" +
    "                <img class=\"staff-portrait thumbnail\" ng-src=\"{{userProfile.person.photo}}\" ng-if=\"userProfile.person.photo != null\"\n" +
    "                     width=\"180\" height=\"225\">\n" +
    "                <img class=\"staff-portrait thumbnail\" ng-src=\"wp-content/themes/roots-ualib/assets/img/user-profile.png\"\n" +
    "                     ng-if=\"userProfile.person.photo == null\" width=\"180\" height=\"225\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-9\">\n" +
    "                <h3 class=\"name\">\n" +
    "                    <small ng-if=\"userProfile.person.rank\">{{userProfile.person.rank}}</small>\n" +
    "                    <span ng-bind-html=\"userProfile.person.firstname\"></span> <span ng-bind-html=\"userProfile.person.lastname\"></span>\n" +
    "                </h3>\n" +
    "                <h4 class=\"title\"><span ng-bind-html=\"userProfile.person.title\"></span></h4>\n" +
    "                <h5 class=\"hidden-xs\"><span ng-bind-html=\"userProfile.person.department\"></span></h5>\n" +
    "                <ul class=\"fa-ul\">\n" +
    "                    <li ng-if=\"userProfile.person.phone\"><span class=\"fa fa-phone fa-li\"></span>{{userProfile.person.phone}}</li>\n" +
    "                    <li class=\"hidden-xs\" ng-if=\"userProfile.person.fax\"><span class=\"fa fa-fax fa-li\"></span>{{userProfile.person.fax}}</li>\n" +
    "                    <li ng-if=\"userProfile.person.email\"><span class=\"fa fa-envelope fa-li\"></span>\n" +
    "                        <a ng-href=\"mailto:{{userProfile.person.email}}\">{{userProfile.person.email}}</a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"alert alert-info\" role=\"alert\">\n" +
    "            <span class=\"fa fa-info-circle\"></span> Note: you can edit an optional part of your <a href=\"/#/staffdir\">Library Directory</a>\n" +
    "            profile here. It is an appropriate place to post the information about your research, interests, publications,\n" +
    "            photos, personal website, etc. Please try to keep your profile professional oriented.\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"website\">Personal Website</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"http://john-doe.com/\" maxlength=\"100\"\n" +
    "                       ng-model=\"userProfile.person.website\" id=\"website\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"resume\">External Resume / CV link</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"http://example.com/my_resume.pdf\" maxlength=\"255\"\n" +
    "                       ng-model=\"userProfile.person.resume\" id=\"resume\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-4 form-group\">\n" +
    "                <label for=\"sn1\">Social Network 1</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"http://facebook.com/johndoe\" maxlength=\"100\"\n" +
    "                       ng-model=\"userProfile.person.social1\" id=\"sn1\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4 form-group\">\n" +
    "                <label for=\"sn2\">Social Network 2</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"http://twitter.com/johndoe\" maxlength=\"100\"\n" +
    "                       ng-model=\"userProfile.person.social2\" id=\"sn2\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4 form-group\">\n" +
    "                <label for=\"sn3\">Social Network 3</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"http://linkedin.com/johndoe\" maxlength=\"100\"\n" +
    "                       ng-model=\"userProfile.person.social3\" id=\"sn3\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12 form-group\">\n" +
    "                <label>Description (allowed tags:\n" +
    "                    <code>\n" +
    "                        &lt;h3&gt;, &lt;h4&gt;, &lt;a&gt;, &lt;img&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;\n" +
    "                    </code>)</label>\n" +
    "                <textarea ui-tinymce=\"tinymceOptions\" ng-model=\"userProfile.person.profile\" rows=\"10\"\n" +
    "                          maxlength=\"64000\"></textarea>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12 text-center form-group\">\n" +
    "                <button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"uploading\" ng-click=\"update()\">\n" +
    "                    Update Profile\n" +
    "                </button><br>\n" +
    "                {{userProfile.person.formResponse}}\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <span ng-bind-html=\"userProfile.person.profile\"></span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <h4 ng-if=\"!userProfile.person && userInfo.login\">Can not find your profile!</h4>\n" +
    "    <div ng-if=\"!userInfo.login\">\n" +
    "        <h3>Sorry, you don't have permissions to manage staff directory</h3>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("staffDirectory/staffDirectorySubjects.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staffDirectory/staffDirectorySubjects.tpl.html",
    "<div>\n" +
    "    <h3>Manage Subjects</h3>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"row sdOpen\">\n" +
    "            <div class=\"col-md-5\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Subject Name\" ng-model=\"newSubj.subject\"\n" +
    "                       maxlength=\"255\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-5\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"http://guides.lib.ua.edu/example\" ng-model=\"newSubj.link\"\n" +
    "                       maxlength=\"1024\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <button type=\"button\" class=\"btn btn-success\" ng-click=\"addSubject()\" ng-disabled=\"newSubj.subject.length == 0\">\n" +
    "                    <span class=\"fa fa-fw fa-plus\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            {{subResponse}}\n" +
    "        </div>\n" +
    "        <table class=\"table table-hover\">\n" +
    "            <thead>\n" +
    "            <tr>\n" +
    "                <th style=\"width:41.6%;\">Subject</th>\n" +
    "                <th style=\"width:41.6%;\">Subject Link</th>\n" +
    "                <th style=\"width:120px;\">Action</th>\n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"subject in Directory.subjects\" ng-click=\"expandSubject(subject)\">\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"subject.show\">{{subject.subject}}</span>\n" +
    "                    <span ng-show=\"subject.show\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Subject Name\" ng-model=\"subject.subject\"\n" +
    "                               maxlength=\"255\">\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <span ng-hide=\"subject.show\">\n" +
    "                        <a href=\"{{subject.link}}\" ng-if=\"subject.link.length > 0\">{{subject.link}}</a>\n" +
    "                        <span ng-if=\"subject.link.length == 0\">{{subject.link}}</span>\n" +
    "                    </span>\n" +
    "                    <span ng-show=\"subject.show\">\n" +
    "                        <input type=\"text\" class=\"form-control\" placeholder=\"Subject Link\" ng-model=\"subject.link\"\n" +
    "                               maxlength=\"1024\">\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <div ng-show=\"subject.show\">\n" +
    "                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"editSubject(subject)\" ng-disabled=\"subject.subject.length == 0\">\n" +
    "                            <span class=\"fa fa-fw fa-edit\"></span>\n" +
    "                        </button>\n" +
    "                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"deleteSubject(subject)\">\n" +
    "                            <span class=\"fa fa-fw fa-close\"></span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("submittedForms/submittedForms.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("submittedForms/submittedForms.tpl.html",
    "<div class=\"container\">\n" +
    "    <h2>Manage Submitted Forms</h2>\n" +
    "\n" +
    "    <div ng-if=\"hasAccess\">\n" +
    "        <div class=\"row form-inline\">\n" +
    "            <div class=\"form-group col-md-12\">\n" +
    "                <label for=\"filterBy\">Filter <small>{{filteredForms.length}}</small> results by</label>\n" +
    "                <div id=\"filterBy\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"titleFilter\">\n" +
    "                </div>\n" +
    "                <label for=\"sortBy\">Sort by</label>\n" +
    "                <div id=\"sortBy\">\n" +
    "                    <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"0\" ng-click=\"sortBy(0)\">\n" +
    "                        Title\n" +
    "                        <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[0].reverse\"></span>\n" +
    "                        <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[0].reverse\"></span>\n" +
    "                    </button>\n" +
    "                    <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"1\" ng-click=\"sortBy(1)\">\n" +
    "                        Status\n" +
    "                        <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[1].reverse\"></span>\n" +
    "                        <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[1].reverse\"></span>\n" +
    "                    </button>\n" +
    "                    <button type=\"button\" class=\"btn btn-default\" ng-model=\"sortButton\" btn-radio=\"2\" ng-click=\"sortBy(2)\">\n" +
    "                        Date Submitted\n" +
    "                        <span class=\"fa fa-fw fa-long-arrow-down\" ng-show=\"!sortModes[2].reverse\"></span>\n" +
    "                        <span class=\"fa fa-fw fa-long-arrow-up\" ng-show=\"sortModes[2].reverse\"></span>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"text-center\">\n" +
    "            <pagination total-items=\"filteredForms.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                        boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredForms.length > 0\"></pagination>\n" +
    "        </div>\n" +
    "        <div class=\"row row-clickable\"\n" +
    "             ng-repeat=\"form in filteredForms = (data.forms | filter:{title:titleFilter}\n" +
    "                                                            | orderBy:sortModes[sortMode].by:sortModes[sortMode].reverse)\n" +
    "            | startFrom:(currentPage-1)*perPage | limitTo:perPage\"\n" +
    "             ng-class=\"{sdOpen: form.show}\">\n" +
    "            <div class=\"col-md-12 clickable\" ng-click=\"toggleForms(form)\">\n" +
    "                <div class=\"col-md-10\">\n" +
    "                    <h4>\n" +
    "                        <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"form.show\"></span>\n" +
    "                        <span class=\"fa fa-fw fa-caret-down\" ng-show=\"form.show\"></span>\n" +
    "                        {{form.title}}\n" +
    "                        <small>{{form.fields[0].value}}</small>\n" +
    "                    </h4>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2\">\n" +
    "                    <h5>{{form.created}}</h5>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12\" ng-show=\"form.show\">\n" +
    "                <div class=\"col-md-12 panel panel-default\">\n" +
    "                    <div class=\"panel-heading\">\n" +
    "                        <h4 class=\"panel-title\">Form was sent to</h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"panel-body\">\n" +
    "                        {{form.addresseeEmails}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-4 panel panel-default\" ng-repeat=\"field in form.fields\"\n" +
    "                     ng-show=\"field.name.length > 0 && field.value.length > 0\">\n" +
    "                    <div class=\"panel-heading\">\n" +
    "                        <h4 class=\"panel-title\">{{field.name}}</h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"panel-body\">\n" +
    "                        {{field.value}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"text-center\">\n" +
    "            <pagination total-items=\"filteredForms.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                        boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\" ng-show=\"filteredForms.length > 0\"></pagination>\n" +
    "        </div>\n" +
    "        <div class=\"text-center\">\n" +
    "            <h4 ng-show=\"filteredForms.length == 0\">Nothing found</h4>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ng-if=\"!hasAccess\">\n" +
    "        <h3>Sorry, you don't have permissions to manage submitted forms</h3>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module('manage', [
    'ngResource',
    'ngAnimate',
    'ngRoute',
    'ui.bootstrap',
    'manage.common',
    'manage.templates',
    'manage.manageHours',
    'manage.manageHoursUsers',
    'manage.manageUserGroups',
    'manage.manageOneSearch',
    'manage.staffDirectory',
    'manage.manageDatabases',
    'manage.manageSoftware',
    'manage.manageNews',
    'manage.submittedForms',
    'manage.manageAlerts',
    'manage.oneSearchErrors',
    'manage.manageERCarousel'
])

    .constant('HOURS_MANAGE_URL', 'https://wwwdev2.lib.ua.edu/libhours2/')
    .constant('USER_GROUPS_URL', 'https://wwwdev2.lib.ua.edu/userGroupsAdmin/')
    .constant('SITE_FEEDBACK_URL', 'https://wwwdev2.lib.ua.edu/siteSurvey/')
    .constant('ONE_SEARCH_URL', 'https://wwwdev2.lib.ua.edu/oneSearch/')
    .constant('STAFF_DIR_URL', 'https://wwwdev2.lib.ua.edu/staffDir/')
    .constant('DATABASES_URL', 'https://wwwdev2.lib.ua.edu/databases/')
    .constant('SOFTWARE_URL', 'https://wwwdev2.lib.ua.edu/softwareList/')
    .constant('FORMS_URL', '//wwwdev2.lib.ua.edu/form/')
    .constant('NEWS_URL', 'https://wwwdev2.lib.ua.edu/newsApp/')
    .constant('ALERTS_URL', 'https://wwwdev2.lib.ua.edu/alerts/')
    .constant('ERRORS_URL', 'https://wwwdev2.lib.ua.edu/errors/')
    .constant('ERCAROUSEL_URL', 'https://wwwdev2.lib.ua.edu/erCarousel/api/');
angular.module('manage.common', [
    'common.manage'
])

    .filter('startFrom', [ function() {
        return function(input, start) {
            if (angular.isObject(input)){
                start = +start; //parse to int
                if (typeof input == 'undefined')
                    return input;
                return input.slice(start);
            }
        };
    }]);

angular.module('common.manage', [])
    .constant('API', 'https://wwwdev2.lib.ua.edu/wp-json/wp/v2/')

    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }])

    .factory('AuthInterceptor', ['AuthService', function (AuthService) {
        return {
            // automatically attach Authorization header
            request: function(config) {
                config.headers = config.headers || {};

                //interceptor for UALib JWT tokens
                var token = AuthService.getToken();
                if(config.url.indexOf("https://wwwdev2.lib.ua.edu/") === 0 && token) {
                    config.headers.Authorization = "Bearer " + token;
                }

                //interceptor for WordPress nonce headers
                if (typeof myLocalized !== 'undefined') {
                    config.headers['X-WP-Nonce'] = myLocalized.nonce;
                } else {
                    console.log("myLocalized is not defined.");
                }
                return config;
            },

            // If a token was sent back, save it
            response: function(res) {
                if(res.config.url.indexOf("https://wwwdev2.lib.ua.edu/") === 0 && angular.isDefined(res.data.token)) {
                    AuthService.saveToken(res.data.token);
                }
                return res;
            }
        };
    }])

    .service('AuthService', ['$window', function($window){
        var self = this;

        self.parseJWT = function(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        };
        self.saveToken = function(token) {
            $window.localStorage['ualibweb.Token'] = token;
            console.log('Token saved');
        };
        self.getToken = function() {
            return $window.localStorage['ualibweb.Token'];
        };
        self.isAuthorized = function() {
            var token = self.getToken();
            if (token) {
                var params = self.parseJWT(token);
                if (Math.round(new Date().getTime() / 1000) <= params.exp) {
                    console.log('Authenticated.');
                    return params.user;
                }
            }
            console.log('Authentication failed.');
            return false;
        };
        self.logout = function() {
            $window.localStorage.removeItem('ualibweb.Token');
            console.log('Token deleted');
        };
    }])

    .factory('ercFactory', ['$resource', 'ERCAROUSEL_URL', function($resource, API){
        return {
            slides: function(){
                console.log("ercFactory.Slides");
                return $resource(
                    API + '/slides/:slideID',
                    {slideID:'@slideID'}
                );
            }
        };
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
        };
    }])
    .factory('ugFactory', ['$http', 'USER_GROUPS_URL', function ugFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/users", params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url, params: params, data: data})
            }
        };
    }])
    .factory('osFactory', ['$http', 'ONE_SEARCH_URL', function osFactory($http, url){
        return {
            getData: function(pPoint){
                return $http({method: 'GET', url: url + "api/" + pPoint, params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        };
    }])
    .factory('sdFactory', ['$http', 'STAFF_DIR_URL', function sdFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/people", params: {}})
            },
            getProfile: function(login){
                return $http({method: 'GET', url: url + "api/profile/" + login, params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        };
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
        };
    }])
    .factory('swFactory', ['$http', 'SOFTWARE_URL', function swFactory($http, url){
        return {
            getData: function(pPoint){
                return $http({method: 'GET', url: url + "api/" + pPoint, params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        };
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
        };
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
        };
    }])
    .factory('alertFactory', ['$http', 'ALERTS_URL', function alertFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/all", params: {}})
            },
            postData: function(params, data){
                params = angular.isDefined(params) ? params : {};
                return $http({method: 'POST', url: url + "processData.php", params: params, data: data})
            }
        };
    }])
    .factory('errorsFactory', ['$http', 'ERRORS_URL', function errorsFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url + "api/all", params: {}})
            }
        };
    }])
    .factory('wpUsersFactory', ['$http', 'API', function wpUsersFactory($http, API){
        return {
            getAllUsersWP : function(){
                return $http.get(API + 'users');
            }
        };
    }])

    .service('tokenReceiver', ['$http', 'API', function($http, API){
        this.promise = null;
        function makeRequest() {
            return $http.get(API + 'users/me')
                .then(function(r1){
                    if (angular.isDefined(r1.data.id)) {
                        $http.get(API + 'users/' + r1.data.id, {context: 'edit'})
                            .then(function (r2) {
                                return r2.data;
                            });
                    }
                });
        }
        this.getPromise = function(update){
            if (update || !this.promise) {
                this.promise = makeRequest();
            }
            return this.promise;
        };
    }])

    .run(['$rootScope', function($rootScope) {
        $rootScope.userInfo = {};
    }]);

angular.module('manage.manageAlerts', [])
    .constant('TYPES', [
        {name:'Success', value:0},
        {name:'Warning', value:1},
        {name:'Danger', value:2}
    ])
    .constant('ALERTS_GROUP', 512)

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/manage-alerts', {
            controller: 'manageAlertsCtrl',
            templateUrl: 'manageAlerts/manageAlerts.tpl.html',
            resolve: {
                userData: function(tokenReceiver){
                    return tokenReceiver.getPromise();
                }
            }
        });
    }])

    .controller('manageAlertsCtrl', ['$scope', 'alertFactory', 'TYPES', 'userData', 'ALERTS_GROUP', 'AuthService',
    function manageAlertsCtrl($scope, alertFactory, TYPES, userData, ALERTS_GROUP, AuthService){
        $scope.userInfo = AuthService.isAuthorized();
        $scope.data = {};
        $scope.newAlert = {};
        $scope.newAlert.message = "";
        $scope.newAlert.selType = TYPES[0];
        $scope.newAlert.dateStartDP = new Date();
        $scope.newAlert.dateStartDP.setHours(0,0,0,0);
        $scope.newAlert.dateEndDP = new Date();
        $scope.newAlert.dateEndDP.setHours(0,0,0,0);
        $scope.newAlert.url = "";
        $scope.newAlert.dpStart = false;
        $scope.newAlert.dpEnd = false;

        $scope.uploading = false;

        $scope.sortModes = [
            {by:'message', reverse:false},
            {by:'type', reverse:false},
            {by:'dateStart', reverse:true},
            {by:'dateEnd', reverse:true}
        ];
        $scope.sortMode = $scope.sortModes[2];
        $scope.sortBy = function(by){
            if ($scope.sortMode === by)
                $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
            else
                $scope.sortMode = by;
        };

        $scope.currentPage = 1;
        $scope.maxPageSize = 10;
        $scope.perPage = 20;

        $scope.hasAccess = false;
        if (angular.isDefined($scope.userInfo.group)) {
            if ((parseInt($scope.userInfo.group) & ALERTS_GROUP) === ALERTS_GROUP) {
                $scope.hasAccess = true;
            }
        }
        alertFactory.getData("all")
            .success(function(data) {
                console.dir(data);
                for (var i = 0; i < data.alerts.length; i++){
                    data.alerts[i].show = false;
                    data.alerts[i].dpStart = false;
                    data.alerts[i].dpEnd = false;
                    data.alerts[i].selType = TYPES[0];
                    for (var j = 1; j < TYPES.length; j++)
                        if (TYPES[j].value == data.alerts[i].type){
                            data.alerts[i].selType = TYPES[j];
                            break;
                        }
                    data.alerts[i].dateStart = new Date(data.alerts[i].dateStart);
                    data.alerts[i].dateStart.setTime(
                        data.alerts[i].dateStart.getTime() +
                        data.alerts[i].dateStart.getTimezoneOffset()*60*1000
                    );
                    data.alerts[i].dateEnd = new Date(data.alerts[i].dateEnd);
                    data.alerts[i].dateEnd.setTime(
                        data.alerts[i].dateEnd.getTime() +
                        data.alerts[i].dateEnd.getTimezoneOffset()*60*1000
                    );
                }
                $scope.data = data;
            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });

        $scope.toggleAlerts = function(alert){
            $scope.data.alerts[$scope.data.alerts.indexOf(alert)].show =
                !$scope.data.alerts[$scope.data.alerts.indexOf(alert)].show;
        };

        $scope.validateAlert = function(alert) {
            if (!angular.isDefined(alert.dateStart)) {
                return "Please enter Active From date!";
            }
            if (!angular.isDefined(alert.dateEnd)) {
                return "Please enter Active Until date!";
            }
            if (angular.isDefined(alert.message) && alert.message.length > 10) {
                return "";
            } else {
                return "Please enter alert Message, minimum 10 characters!";
            }
        };

        $scope.deleteAlert = function(alert){
            if (confirm("Delete alert permanently?") == true){
                $scope.uploading = true;
                alert.formResponse = "";
                alertFactory.postData({action : 1}, alert)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.data.alerts.splice($scope.data.alerts.indexOf(alert), 1);
                        } else {
                            alert.formResponse = "Error: Can not delete alert! " + data;
                        }
                        $scope.uploading = false;
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        alert.formResponse = "Error: Could not delete alert! " + data;
                        $scope.uploading = false;
                        console.log(data);
                    });
            }
        };
        $scope.updateAlert = function(alert){
            alert.formResponse = $scope.validateAlert(alert);
            if (alert.formResponse.length < 1) {
                $scope.uploading = true;
                alert.tsStart = alert.dateStart.valueOf() / 1000;
                alert.tsEnd = alert.dateEnd.valueOf() / 1000;
                alertFactory.postData({action: 2}, alert)
                    .success(function (data, status, headers, config) {
                        if (data == 1) {
                            alert.formResponse = "Alert has been updated!";
                        } else {
                            alert.formResponse = "Error: Can not update alert! " + data;
                        }
                        $scope.uploading = false;
                        console.log(data);
                    })
                    .error(function (data, status, headers, config) {
                        alert.formResponse = "Error: Could not update alert! " + data;
                        $scope.uploading = false;
                        console.log(data);
                    });
            }
        };
        $scope.createAlert = function(alert) {
            $scope.newAlert.formResponse = "";
            $scope.newAlert.formResponse = $scope.validateAlert(alert);
            if ($scope.newAlert.formResponse.length < 1) {
                $scope.uploading = true;
                alert.tsStart = alert.dateStart.valueOf() / 1000;
                alert.tsEnd = alert.dateEnd.valueOf() / 1000;
                alertFactory.postData({action: 3}, alert)
                    .success(function (data, status, headers, config) {
                        if ((typeof data === 'object') && (data !== null)) {
                            var newAlert = {};
                            newAlert = angular.copy(alert);
                            newAlert.aid = data.id;
                            newAlert.show = false;
                            newAlert.selType = TYPES[0];
                            for (var j = 1; j < TYPES.length; j++)
                                if (TYPES[j].value == alert.type) {
                                    newAlert.selType = TYPES[j];
                                    break;
                                }
                            $scope.data.alerts.push(newAlert);
                            $scope.newAlert.formResponse = "Alert has been created.";
                        } else {
                            $scope.newAlert.formResponse = "Error: Can not create alert! " + data;
                        }
                        console.dir(data);
                        $scope.uploading = false;
                    })
                    .error(function (data, status, headers, config) {
                        $scope.newAlert.formResponse = "Error: Could not create alert! " + data;
                        console.log(data);
                        $scope.uploading = false;
                    });
            }
        };
    }])

    .controller('manageAlertFieldsCtrl', ['$scope', 'TYPES',
    function manageAlertFieldsCtrl($scope, TYPES){
        $scope.types = TYPES;
        $scope.dpFormat = 'MM/dd/yyyy';

        $scope.showDatePicker = function(alert, isFrom) {
            if (alert.aid > 0) {
                if (isFrom === true) {
                    $scope.data.alerts[$scope.data.alerts.indexOf(alert)].dpStart = true;
                } else {
                    $scope.data.alerts[$scope.data.alerts.indexOf(alert)].dpEnd = true;
                }
            } else {
                if (isFrom === true) {
                    $scope.alert.dpStart = true;
                } else {
                    $scope.alert.dpEnd = true;
                }
            }
        };

    }])

    .directive('alertsItemFields', ['$timeout', function($timeout) {
        return {
            restrict: 'AC',
            scope: {
                alert: '=alertdata',
                data: '=list'
            },
            controller: 'manageAlertFieldsCtrl',
            link: function(scope, elm, attrs){
                scope.onAlertDPFocus = function(alert, isFrom){
                    $timeout(function() {
                        scope.showDatePicker(alert, isFrom);
                        scope.$apply();
                    }, 0);
                };
            },
            templateUrl: 'manageAlerts/manageAlertsItemFields.tpl.html'
        };
    }]);


angular.module('manage.manageDatabases', [])
    .constant('DATABASES_GROUP', 32)

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/manage-databases', {
            controller: 'manageDBCtrl',
            templateUrl: 'manageDatabases/manageDatabases.tpl.html',
            resolve: {
                userData: function(tokenReceiver){
                    return tokenReceiver.getPromise();
                }
            }
        });
    }])
    .controller('manageDBCtrl', ['$scope', '$filter', 'mdbFactory', 'userData', 'DATABASES_GROUP', 'AuthService',
        function manageDBCtrl($scope, $filter, mdbFactory, userData, DATABASES_GROUP, AuthService){
            $scope.userInfo = AuthService.isAuthorized();

            var DBList = {};
            $scope.filters = {
                titleStart: '',
                title: '',
                description: '',
                subjects: '',
                types: '',
                publisher: '',
                vendor: '',
                disabled: '',
                sort: {}
            };
            $scope.filteredDB = null;
            $scope.disValues = [
                {name:'Show all', value:''},
                {name:'Enabled only', value:'0'},
                {name:'Disabled only', value:'1'}
            ];
            $scope.sortMode = 0;
            $scope.sortModes = [
                {by:'title', reverse:false},
                {by:'dateCreated', reverse:false},
                {by:'lastModified', reverse:false},
                {by:'tmpDisabled', reverse:true}
            ];
            $scope.newDB = {};
            $scope.newDB.subjects = [];
            $scope.newDB.types = [];

            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

            //primary, secondary
            $scope.subjectValues = [ 1, 2 ];
            $scope.fullTextValues = [ "", "A", "N", "P", "S" ];
            $scope.inEDSValues = [ "", "Y", "P" ];

            $scope.hasAccess = false;
             if (angular.isDefined($scope.userInfo.group)) {
                if ((parseInt($scope.userInfo.group) & DATABASES_GROUP) === DATABASES_GROUP) {
                    $scope.hasAccess = true;
                    $scope.newDB.updatedBy = $scope.userInfo.login;
                }
             }

            mdbFactory.getData()
                .success(function(data) {
                    for (var i = 0; i < data.databases.length; i++){
                        data.databases[i].show = false;
                        data.databases[i].changed = false;
                        data.databases[i].class = "";
                        data.databases[i].selSubj = data.subjects[0];
                        data.databases[i].subjType = 1;
                        data.databases[i].selType = data.types[0];
                    }
                    $scope.newDB.selSubj = data.subjects[0];
                    $scope.newDB.subjType = 1;
                    $scope.newDB.selType = data.types[0];

                    $scope.types = angular.copy(data.types);
                    $scope.subjects = angular.copy(data.subjects);
                    DBList = angular.copy(data);
                    $scope.filteredDB = angular.copy(data.databases);
                    $scope.filters.sort = {by:'title', reverse:false};
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.$watchCollection('filters', processFilters);

            function processFilters(newVal, oldVal){
                newVal = angular.isUndefined(newVal) ? angular.copy($scope.filters) : newVal;
                var db = angular.copy(DBList.databases);

                for(var filter in newVal){
                    if (oldVal === undefined || newVal[filter] !== oldVal[filter] || filter === 'sort'){
                        switch(filter){
                            case 'sort':
                                db = $filter('orderBy')(db, newVal[filter].by, newVal[filter].reverse);
                                break;
                            case 'titleStart':
                                db = $filter('filter')(db, {title:newVal[filter]}, startTitle);
                                break;
                            default:
                                var f = {};
                                f[filter] = newVal[filter];
                                db = $filter('filter')(db, f);
                        }
                    }
                }

                $scope.filteredDB = angular.copy(db);
            }


            function startTitle(actual, expected){
                if (!expected)
                    return true;
                if (actual.toLowerCase().indexOf(expected.toLowerCase()) == 0)
                    return true;
                return false;
            }

            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
                $scope.filters.sort = angular.copy($scope.sortModes[by]);
            };

            $scope.toggleDB = function(db){
                db.show = !db.show;
            };

            $scope.changed = function(db){
                db.changed = true;
            };

            $scope.deleteDB = function(db){
                if (confirm("Delete " + db.title  + " permanently?") == true){
                    mdbFactory.postData({action : 1}, db)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                //$scope.DBList.databases.splice($scope.DBList.databases.indexOf(db), 1);
                                $scope.filteredDB.splice($scope.filteredDB.indexOf(db), 1);
                                DBList.databases = DBList.databases.filter(function(item){
                                    return item.id !== db.id;
                                });
                                $scope.formResponse = "Database has been deleted.";
                            } else {
                                $scope.formResponse = "Error: Can not delete database! " + data;
                                alert($scope.formResponse);
                            }
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
                        db.changed = false;

                        alert($scope.formResponse);
                        DBList.databases = DBList.databases.filter(function(item){
                            return item.id !== db.id;
                        });
                        DBList.databases.push(angular.copy(db));
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not update database! " + data;
                        alert($scope.formResponse);
                        console.log(data);
                    });
            };



            $scope.createDB = function(){
                mdbFactory.postData({action : 3}, $scope.newDB)
                    .success(function(data, status, headers, config) {
                        if ((typeof data === 'object') && (data !== null)){
                            var newDB = {};
                            newDB = angular.extend({publisher: '', vendor:'', disabled: 0}, $scope.newDB);
                            newDB.id = data.id;
                            newDB.subjects = angular.copy(data.subjects);
                            newDB.types = angular.copy(data.types);
                            newDB.show = false;
                            newDB.changed = false;
                            newDB.class = "";
                            newDB.selSubj = data.subjects[0];
                            newDB.subjType = 1;
                            newDB.selType = data.types[0];
                            DBList.databases.push(newDB);
                            processFilters();
                            $scope.formResponse = "Database has been created.";
                        } else {
                            $scope.formResponse = "Error: Can not create database! " + data;
                        }
                        console.dir(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not create database! " + data;
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
                            if (typeof db.subjects == 'undefined')
                                db.subjects = [];
                            db.subjects.push(newSubject);
                            $scope.formResponse = "Subject has been added.";
                        } else {
                            $scope.formResponse = "Error: Can not add subject! " + data;
                            alert($scope.formResponse);
                        }
                        console.dir(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not add subject! " + data;
                        alert($scope.formResponse);
                        console.dir(data);
                    });
            };
            $scope.deleteSubject = function(db,subject){
                subject.dbid = db.id;
                subject.updatedBy = $scope.newDB.updatedBy;
                mdbFactory.postData({action : 5}, subject)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            db.subjects.splice(
                                db.subjects.indexOf(subject),1
                            );
                            $scope.formResponse = "Subject has been deleted.";
                        } else {
                            $scope.formResponse = "Error: Can not delete subject! " + data;
                            alert($scope.formResponse);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not delete subject! " + data;
                        alert($scope.formResponse);
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
                            if (typeof db.types == 'undefined')
                                db.types = [];
                            db.types.push(newType);
                            $scope.formResponse = "Type has been added.";
                        } else {
                            $scope.formResponse = "Error: Can not add type! " + data;
                            alert($scope.formResponse);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not add type! " + data;
                        alert($scope.formResponse);
                    });
            };
            $scope.deleteType = function(db,type){
                type.dbid = db.id;
                type.updatedBy = $scope.newDB.updatedBy;
                mdbFactory.postData({action : 7}, type)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            db.types.splice(
                                db.types.indexOf(type),1
                            );
                            $scope.formResponse = "Type has been deleted.";
                        } else {
                            $scope.formResponse = "Error: Can not delete type! " + data;
                            alert($scope.formResponse);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not delete type! " + data;
                        alert($scope.formResponse);
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
angular.module('manage.manageERCarousel', ['ngFileUpload'])
    .constant('ERC_GROUP', 1024)

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/manage-erc', {
            controller: 'manageErcCtrl',
            templateUrl: 'manageERCarousel/manageERCarousel.tpl.html',
            resolve: {
                userData: function(tokenReceiver){
                    return tokenReceiver.getPromise();
                }
            }
        });
    }])

    .controller('manageErcCtrl', ['$scope', 'ercFactory', 'userData', 'ERC_GROUP', 'AuthService',
    function manageErcCtrl($scope, ercFactory, userData, ERC_GROUP, AuthService){
        $scope.userInfo = AuthService.isAuthorized();
        $scope.slides = {};
        $scope.numShow = 0;
        $scope.admin = false;
        $scope.newSlide = {};
        $scope.newSlide.selectedFiles = [];
        $scope.newSlide.picFile = [];
        $scope.updating = true;

        $scope.hasAccess = false;
        if (angular.isDefined($scope.userInfo.group)) {
            if ((parseInt($scope.userInfo.group) & ERC_GROUP) === ERC_GROUP) {
                $scope.hasAccess = true;
            }
        }

        ercFactory.slides().get()
            .$promise.then(function(data){
                $scope.updating = false;
                console.dir(data.slides);
                for (var i = 0; i < data.slides.length; i++) {
                    data.slides[i].priority = parseInt(data.slides[i].priority);
                    data.slides[i].show = false;
                    data.slides[i].selectedFiles = [];
                    data.slides[i].tmpPriority = data.slides[i].priority;
                }
                $scope.slides = data.slides;
                $scope.numShow = data.numShow;
                $scope.admin = data.admin;
            }, function(data, status){
                $scope.updating = false;
                console.dir(data);
            });
    }])

    .controller('manageSlideListCtrl', ['$scope', '$timeout', 'Upload', 'ercFactory', 'ERCAROUSEL_URL',
        function manageSlideListCtrl($scope, $timeout, Upload, ercFactory, appURL){
            $scope.appURL = appURL;
            $scope.uploading = false;

            $scope.newSlide.title = '';
            $scope.newSlide.tmpPriority = 0;
            $scope.newSlide.url = '';

            $scope.toggleSlide = function(slide){
                $scope.slides[$scope.slides.indexOf(slide)].show =
                    !$scope.slides[$scope.slides.indexOf(slide)].show;
            };

            $scope.validateSlide = function(slide){
                if (slide.title.length < 1)
                    return "Form error: Please fill out Title!";
                if (slide.url.length < 11)
                    return "Form error: Please fill out URL!";
                return "";
            };
            $scope.approveSlide = function(slide){
                if (confirm("Are you sure you want to approve " + slide.title  + "?") == true){
                    $scope.uploading = true;
                    slide.approve = true;
                    ercFactory.slides().save({slideID: slide.sid}, slide)
                        .$promise.then(function(data){
                            $scope.uploading = false;
                            $scope.slides[$scope.slides.indexOf(slide)].status = data.status;
                        }, function(data, status){
                            $scope.uploading = false;
                            $scope.slides[$scope.slides.indexOf(slide)].formResponse = data.message;
                            console.dir(data);
                        });
                }
            };
            $scope.deleteSlide = function(slide){
                if (confirm("Delete " + slide.title  + " permanently?") == true){
                    $scope.uploading = true;
                    slide.approve = true;
                    ercFactory.slides().delete({slideID: slide.sid})
                        .$promise.then(function(data){
                            $scope.uploading = false;
                            $scope.slides.splice($scope.slides.indexOf(slide), 1);
                        }, function(data, status){
                            $scope.uploading = false;
                            $scope.formResponse = "Error: Could not delete slide! " + data;
                            console.dir(data);
                        });
                }
            };
            $scope.updateSlide = function(slide){
                console.dir(slide);
                $scope.slides[$scope.slides.indexOf(slide)].formResponse = $scope.validateSlide(slide);
                if ($scope.slides[$scope.slides.indexOf(slide)].formResponse.length > 0)
                    return false;
                $scope.uploading = true;
                slide.title = slide.title.replace(/\//g, ' ');
                slide.priority = slide.tmpPriority;
                if (slide.selectedFiles.length < 1){
                    ercFactory.slides().save({slideID: slide.sid}, slide)
                        .$promise.then(function(data){
                            $scope.uploading = false;
                            $scope.slides[$scope.slides.indexOf(slide)].formResponse = data.message;
                        }, function(data, status){
                            $scope.uploading = false;
                            $scope.slides[$scope.slides.indexOf(slide)].formResponse = data.message;
                            console.dir(data);
                        });
                } else {
                    var names = [];
                    for (var i = 0; i < slide.selectedFiles.length; i++)
                        names.push(slide.selectedFiles[i].name);
                    slide.selectedFiles.upload = Upload.upload({
                        url: appURL + 'slides/' + slide.sid,
                        method: 'POST',
                        fields: {
                            erCarousel: slide
                        },
                        file: slide.selectedFiles,
                        fileFormDataName: names
                    });
                    slide.selectedFiles.upload.then(function(response) {
                        $timeout(function() {
                            slide.selectedFiles.length = 0;
                            slide.picFile.length = 0;
                            $scope.slides[$scope.slides.indexOf(slide)].formResponse = response.data.message;
                            $scope.uploading = false;
                        });
                    }, function(response) {
                        if (response.status > 0) {
                            $scope.slides[$scope.slides.indexOf(slide)].formResponse = response.status + ': ' + response.data;
                        }
                        $scope.uploading = false;
                    });
                    slide.selectedFiles.upload.progress(function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        slide.selectedFiles.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            };
            $scope.createSlide = function(slide){
                slide.formResponse = $scope.validateSlide(slide);
                if (slide.formResponse.length > 0)
                    return false;
                $scope.uploading = true;
                slide.title = slide.title.replace(/\//g, ' ');
                slide.priority = slide.tmpPriority;
                if (slide.selectedFiles.length > 0){
                    var names = [];
                    for (var i = 0; i < slide.selectedFiles.length; i++)
                        names.push(slide.selectedFiles[i].name);
                    slide.selectedFiles.upload = Upload.upload({
                        url: appURL + 'slides/',
                        method: 'POST',
                        fields: {
                            erCarousel: slide
                        },
                        file: slide.selectedFiles,
                        fileFormDataName: names
                    });
                    slide.selectedFiles.upload.then(function(res) {
                        $timeout(function() {
                            $scope.uploading = false;
                            if (angular.isDefined(res.data.sid) && angular.isDefined(res.data.status) && angular.isDefined(res.data.image)) {
                                var newSlide = {};
                                newSlide.sid = res.data.sid;
                                newSlide.status = res.data.status;
                                newSlide.image = res.data.image;
                                newSlide.title = slide.title;
                                newSlide.priority = slide.priority;
                                newSlide.url = slide.url;
                                newSlide.show = false;
                                newSlide.selectedFiles = [];
                                $scope.slides.push(newSlide);
                            }
                            slide.formResponse = res.data.message;
                        });
                    }, function(response) {
                        $scope.uploading = false;
                        if (response.status > 0)
                            slide.formResponse = response.status + ': ' + response.data;
                    });
                    slide.selectedFiles.upload.progress(function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        slide.selectedFiles.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                } else {
                    slide.formResponse = "Please select a slide image.";
                }
            };
        }])

    .directive('manageSlideList', [ function() {
        return {
            restrict: 'A',
            controller: 'manageSlideListCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageERCarousel/manageSlideList.tpl.html'
        };
    }])

    .controller('slideFieldsCtrl', ['$scope', '$timeout', 'Upload',
        function slideFieldsCtrl($scope, $timeout, Upload){
            $scope.generateThumb = function(files, slide) {
                if (files.length > 0 && files !== null) {
                    for (var i = 0; i < files.length; i++){
                        $scope.slide.selectedFiles.push(files[i]);
                        if ($scope.fileReaderSupported && files[i].type.indexOf('image') > -1) {
                            $timeout(function() {
                                var fileReader = new FileReader();
                                fileReader.readAsDataURL(files[i]);
                                fileReader.onload = function(e) {
                                    $timeout(function() {
                                        files[i].dataUrl = e.target.result;
                                    });
                                }
                            });
                        }
                    }
                }
            };
        }])

    .directive('slideFieldsList', ['$timeout', function($timeout) {
        return {
            restrict: 'AC',
            scope: {
                slide: '='
            },
            controller: 'slideFieldsCtrl',
            link: function(scope, elm, attrs){
            },
            templateUrl: 'manageERCarousel/manageSlideFields.tpl.html'
        };
    }]);

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
        {name:'1:00 pm', value:'1300'},
        {name:'3:00 pm', value:'1500'},
        {name:'6:00 pm', value:'1800'}
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
        {name:'6:30 pm', value:'1830'},
        {name:'7:00 pm', value:'1900'},
        {name:'8:00 pm', value:'2000'},
        {name:'9:00 pm', value:'2100'},
        {name:'10:00 pm', value:'2200'},
        {name:'11:00 pm', value:'2300'},
        {name:'Midnight', value:'2400'}
    ])
    .constant('DP_FORMAT', 'MM/dd/yyyy')
    .constant('HOURS_GROUP', 2)

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/manage-hours', {
            controller: 'manageHrsCtrl',
            templateUrl: 'manageHours/manageHours.tpl.html',
            resolve: {
                userData: function(tokenReceiver){
                    return tokenReceiver.getPromise();
                }
            }
        });
    }])

    .controller('manageHrsCtrl', ['$scope', '$animate', 'hmFactory', 'HOURS_FROM', 'HOURS_TO', 'DP_FORMAT', 'userData', 'HOURS_GROUP', 'AuthService',
        function manageHrsCtrl($scope, $animate, hmFactory, hoursFrom, hoursTo, dpFormat, userData, HOURS_GROUP, AuthService){
            $scope.userInfo = AuthService.isAuthorized();
            $scope.allowedLibraries = [];
            $scope.format = dpFormat;
            $scope.hrsFrom = hoursFrom;
            $scope.hrsTo = hoursTo;
            $scope.selLib = {};
            $scope.hasAccess = false;
            if (angular.isDefined($scope.userInfo.group)) {
                if ((parseInt($scope.userInfo.group) & HOURS_GROUP) === HOURS_GROUP) {
                    $scope.hasAccess = true;
                }
            }

            $scope.initSemesters = function(semesters){
                for (var sem = 0; sem < semesters.length; sem++){
                    semesters[sem].startdate = new Date(semesters[sem].startdate);
                    semesters[sem].startdate.setTime(
                        semesters[sem].startdate.getTime() +
                        semesters[sem].startdate.getTimezoneOffset()*60*1000
                    );
                    semesters[sem].enddate = new Date(semesters[sem].enddate);
                    semesters[sem].enddate.setTime(
                        semesters[sem].enddate.getTime() +
                        semesters[sem].enddate.getTimezoneOffset()*60*1000
                    );
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

    .controller('semListCtrl', ['$scope', 'hmFactory', function semListCtrl($scope, hmFactory) {
        $scope.expSem = -1;
        $scope.weekHrs = [];
        $scope.loading = false;
        $scope.newSemester = {};
        $scope.newSemester.dp = false;
        $scope.newSemester.dow = [];
        $scope.newSemester.name = "";
        $scope.newSemester.startdate = new Date();
        $scope.newSemester.startdate.setHours(0,0,0,0);

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

    .directive('semesterList', [ function() {
        return {
            restrict: 'A',
            controller: 'semListCtrl',
            templateUrl: 'manageHours/manageSem.tpl.html'
        };
    }])

    .controller('exListCtrl', ['$scope', 'hmFactory', function exListCtrl($scope, hmFactory) {
        $scope.newException = {};
        $scope.newException.from = -1;
        $scope.newException.to = 0;
        $scope.newException.dp = false;
        $scope.newException.isGlobal = false;
        $scope.newException.desc = "";
        $scope.newException.days = 1;
        $scope.newException.datems = new Date();
        $scope.newException.datems.setHours(0,0,0,0);
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
            exception.datems2 = exception.datems.valueOf() / 1000;
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
            $scope.newException.datems2 = $scope.newException.datems.valueOf() / 1000;
            hmFactory.postData({action : 6}, $scope.newException)
                .success(function(data) {
                    if ((typeof data === 'object') && (data !== null)){
                        var i = 0;
                        for (i = 0; i < data.length; i++){
                            var newExc = {};
                            newExc.id = data[i].id;
                            newExc.datems = new Date($scope.newException.datems2 * 1000);
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
    .directive('exceptionList',[ function() {
        return {
            restrict: 'A',
            controller: 'exListCtrl',
            link: function(scope, elem, attrs) {

            },
            templateUrl: 'manageHours/manageEx.tpl.html'
        };
    }])

angular.module('manage.manageHoursUsers', [])
    .constant('HOURS_GROUP', 2)

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/manage-hours-users', {
            controller: 'manageHrsUsersCtrl',
            templateUrl: 'manageHours/manageHoursUsers.tpl.html',
            resolve: {
                userData: function(tokenReceiver){
                    return tokenReceiver.getPromise();
                }
            }
        });
    }])

    .controller('manageHrsUsersCtrl', ['$scope', '$animate', 'wpUsersFactory', 'hmFactory', 'userData', 'HOURS_GROUP', 'AuthService',
        function manageHrsUsersCtrl($scope, $animate, wpUsersFactory, hmFactory, userData, HOURS_GROUP, AuthService){
            $scope.userInfo = AuthService.isAuthorized();
            $scope.isLoading = true;
            $scope.dataUL = {};
            $scope.dataUL.users = [];
            $scope.dataUL.locations = [];
            $scope.wpUsers = [];
            $scope.hasAccess = false;
            if (angular.isDefined($scope.userInfo.group)) {
                if ((parseInt($scope.userInfo.group) & HOURS_GROUP) === HOURS_GROUP) {
                    $scope.hasAccess = true;
                }
            }

            wpUsersFactory.getAllUsersWP()
                .success(function(data) {
                    //remove admin accounts
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].last_name.length < 1) {
                            data.splice(i, 1);
                        }
                    }
                    for (i = 0; i < data.length; i++) {
                        data[i].fullName = data[i].last_name + ", " + data[i].first_name + " (" + data[i].nickname + ")";
                    }
                    $scope.wpUsers = data;
                    $scope.newUser = $scope.wpUsers[0];
                    console.dir(data);
                    hmFactory.getData("users")
                        .success(function(data2){
                            for (i = 0; i < data2.users.length; i++)
                                for (var j = 0; j < $scope.wpUsers.length; j++)
                                    if (data2.users[i].name === $scope.wpUsers[j].nickname) {
                                        data2.users[i].fullName = $scope.wpUsers[j].fullName;
                                        break;
                                    }
                            $scope.dataUL = data2;
                            $scope.isLoading = false;
                            console.dir(data2);
                        })
                        .error(function(data, status, headers, config) {
                            $scope.isLoading = false;
                        });
                })
                .error(function(data, status, headers, config) {
                    $scope.isLoading = false;
                    console.dir(data);
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

    .controller('hrsUserListCtrl', ['$scope', 'hmFactory', function hrsUserListCtrl($scope, hmFactory) {
        $scope.expUser = -1;
        $scope.expUserIndex = -1;
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
            $scope.result2 = "";
            user.admin = $scope.newUserAdmin;
            user.access = $scope.newUserAccess;
            user.locations = $scope.dataUL.locations;
            hmFactory.postData({action : 9}, user)
                .success(function(data) {
                    if ((typeof data === 'object') && (data !== null)){
                        $scope.result2 = "Access granted!";
                        var createdUser = {};
                        createdUser.name = user.nickname;
                        createdUser.fullName = user.fullName;
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
                        $scope.result2 = "User has been added!";
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
    .directive('hoursUserList', [function() {
        return {
            restrict: 'AC',
            controller: 'hrsUserListCtrl',
            templateUrl: 'manageHours/manageUsers.tpl.html'
        };
    }])

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
    .directive('hoursLocationList', [function() {
        return {
            restrict: 'AC',
            controller: 'hrsLocationsCtrl',
            templateUrl: 'manageHours/manageLoc.tpl.html'
        };
    }])

angular.module('manage.manageNews', ['ngFileUpload', 'oc.lazyLoad', 'ui.tinymce'])
    .constant('NEWS_GROUP', 256)

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/manage-news', {
            controller: 'manageNewsCtrl',
            templateUrl: 'manageNews/manageNews.tpl.html',
            resolve: {
                userData: function(tokenReceiver){
                    return tokenReceiver.getPromise();
                },
                lazyLoad: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load('https://cdn.tinymce.com/4/tinymce.min.js');
                }]
            }
        });
    }])

    .controller('manageNewsCtrl', ['$scope', 'newsFactory', 'userData', 'NEWS_GROUP', 'lazyLoad', 'AuthService',
    function manageNewsCtrl($scope, newsFactory, userData, NEWS_GROUP, lazyLoad, AuthService){
        $scope.userInfo = AuthService.isAuthorized();
        $scope.data = {};
        $scope.newNews = {};
        $scope.newNews.creator = $scope.userInfo.login;
        $scope.newNews.selectedFiles = [];
        $scope.newNews.picFile = [];
        $scope.sortModes = [
            {by:'title', reverse:false},
            {by:'created', reverse:true}
        ];

        $scope.hasAccess = false;
        if (angular.isDefined($scope.userInfo.group)) {
            if ((parseInt($scope.userInfo.group) & NEWS_GROUP) === NEWS_GROUP) {
                $scope.hasAccess = true;
            }
        }

        newsFactory.getData("all")
            .success(function(data) {
                console.dir(data);
                for (var i = 0; i < data.news.length; i++){
                    data.news[i].created = new Date(data.news[i].created * 1000);
                    if (data.news[i].activeFrom !== null)
                        data.news[i].activeFrom = new Date(data.news[i].activeFrom * 1000);
                    if (data.news[i].activeUntil !== null)
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
                    data.news[i].selectedFiles = [];
                }
                $scope.newNews.contactID = data.people[0];
                $scope.data = data;
            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });

        $scope.tabs = [
            { name: 'News and Exhibits',
                number: 0,
                active: true
            },
            { name: 'Admins',
                number: 1,
                active: false
            }];
    }])

    .controller('manageNewsListCtrl', ['$scope', '$timeout', 'Upload', 'newsFactory', 'NEWS_URL',
        function manageNewsListCtrl($scope, $timeout, Upload, newsFactory, appURL){
            $scope.titleFilter = '';
            $scope.descrFilter = '';
            $scope.sortMode = 1;
            $scope.appURL = appURL;
            $scope.uploading = false;

            $scope.newNews.activeFrom = new Date();
            $scope.newNews.activeFrom.setHours(0,0,0,0);
            $scope.newNews.activeUntil = new Date();
            $scope.newNews.activeUntil.setHours(0,0,0,0);
            $scope.newNews.dpFrom = false;
            $scope.newNews.dpUntil = false;
            $scope.newNews.contactName = '';
            $scope.newNews.contactEmail = '';
            $scope.newNews.contactPhone = '';
            $scope.newNews.sticky = 0;
            $scope.newNews.type = 0;

            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

            $scope.toggleNews = function(news){
                $scope.data.news[$scope.data.news.indexOf(news)].show =
                    !$scope.data.news[$scope.data.news.indexOf(news)].show;
            };
            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
            };

            $scope.validateNews = function(news){
                if (news.title.length < 1)
                    return "Form error: Please fill out Title!";
                if (news.description.length < 1)
                    return "Form error: Please fill out Description!";

                return "";
            };
            $scope.approveNews = function(news){
                news.admin = $scope.newNews.creator;
                if (confirm("Are you sure you want to approve " + news.title  + "?") == true){
                    newsFactory.postData({action : 4}, news)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.data.news[$scope.data.news.indexOf(news)].status = 1;
                            } else {
                                alert("Error: Cannot approve news item! " + data);
                            }
                            console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            alert("Error: Could not approve news item! " + data);
                            console.log(data);
                        });
                }
            };
            $scope.deleteNews = function(news){
                if (confirm("Delete " + news.title  + " permanently?") == true){
                    newsFactory.postData({action : 1}, news)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.data.news.splice($scope.data.news.indexOf(news), 1);
                                $scope.formResponse = "News item has been deleted.";
                            } else {
                                $scope.formResponse = "Error: Cannot delete news item! " + data;
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
                $scope.uploading = true;
                news.title = news.title.replace(/\//g, '');
                if (news.type < 1) {
                    news.activeFrom = null;
                    news.activeUntil = null;
                }
                if (news.activeFrom !== null)
                    news.tsFrom = news.activeFrom.valueOf() / 1000;
                else
                    news.tsFrom = null;
                if (news.activeUntil !== null)
                    news.tsUntil = news.activeUntil.valueOf() / 1000;
                else
                    news.tsUntil = null;
                if (news.selectedFiles.length < 1){
                    newsFactory.postData({action : 21}, news)
                        .success(function(data, status, headers, config) {
                            if ((typeof data === 'object') && (data !== null)){
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                    "News has been updated.";
                            } else {
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                    "Error: Can not update news! " + data;
                            }
                            console.log(data);
                            $scope.uploading = false;
                        })
                        .error(function(data, status, headers, config) {
                            $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                "Error: Could not update news! " + data;
                            console.log(data);
                            $scope.uploading = false;
                        });
                } else {
                    var names = [];
                    for (var i = 0; i < news.selectedFiles.length; i++)
                        names.push(news.selectedFiles[i].name);
                    news.selectedFiles.upload = Upload.upload({
                        url: appURL + 'processData.php?action=2',
                        method: 'POST',
                        fields: {
                            news: news
                        },
                        file: news.selectedFiles,
                        fileFormDataName: names
                    });
                    news.selectedFiles.upload.then(function(response) {
                        $timeout(function() {
                            if ((typeof response.data === 'object') && (response.data !== null)){
                                $scope.data.news[$scope.data.news.indexOf(news)].images = [];
                                $scope.data.news[$scope.data.news.indexOf(news)].images = angular.copy(response.data.images);
                                news.selectedFiles.length = 0;
                                news.picFile.length = 0;
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse = "News has been updated, images have been uploaded.";
                            } else {
                                $scope.data.news[$scope.data.news.indexOf(news)].formResponse = 
                                    "Error: Can not update news! " + response.data;
                            }
                            console.log(response.data);
                            $scope.uploading = false;
                        });
                    }, function(response) {
                        if (response.status > 0)
                            $scope.data.news[$scope.data.news.indexOf(news)].formResponse = response.status + ': ' + response.data;
                        $scope.uploading = false;
                    });
                    news.selectedFiles.upload.progress(function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        news.selectedFiles.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            };
            $scope.createNews = function(){
                $scope.newNews.formResponse = $scope.validateNews($scope.newNews);
                if ($scope.newNews.formResponse.length > 0)
                    return false;
                $scope.uploading = true;
                $scope.newNews.title = $scope.newNews.title.replace(/\//g, '');
                if ($scope.newNews.type < 1) {
                    $scope.newNews.activeFrom = null;
                    $scope.newNews.activeUntil = null;
                }
                if ($scope.newNews.activeFrom !== null)
                    $scope.newNews.tsFrom = $scope.newNews.activeFrom.valueOf() / 1000;
                else
                    $scope.newNews.tsFrom = null;
                if ($scope.newNews.activeUntil !== null)
                    $scope.newNews.tsUntil = $scope.newNews.activeUntil.valueOf() / 1000;
                else
                    $scope.newNews.tsUntil = null;

                if ($scope.newNews.selectedFiles.length < 1){
                    newsFactory.postData({action : 31}, $scope.newNews)
                        .success(function(data, status, headers, config) {
                            if ((typeof data === 'object') && (data !== null)){
                                var newNews = {};
                                newNews.nid = data.id;
                                newNews.images = angular.copy(data.images);
                                newNews.title = $scope.newNews.title;
                                newNews.description = $scope.newNews.description;
                                if ($scope.newNews.activeFrom > 0)
                                    newNews.activeFrom = new Date($scope.newNews.activeFrom * 1000);
                                else
                                    newNews.activeFrom = null;
                                if ($scope.newNews.activeUntil > 0)
                                    newNews.activeUntil = new Date($scope.newNews.activeUntil * 1000);
                                else
                                    newNews.activeUntil = null;
                                newNews.contactName = $scope.newNews.contactName;
                                newNews.contactEmail = $scope.newNews.contactEmail;
                                newNews.contactPhone = $scope.newNews.contactPhone;
                                newNews.sticky = $scope.newNews.sticky;
                                for (var j = 0; j < $scope.data.people.length; j++)
                                    if ($scope.newNews.contactID.uid === $scope.data.people[j].uid){
                                        newNews.contactID = $scope.data.people[j];
                                        break;
                                    }
                                newNews.show = false;
                                newNews.class = "";
                                newNews.status = 0;
                                newNews.type = $scope.newNews.type;
                                newNews.selectedFiles = [];
                                $scope.data.news.push(newNews);
                                $scope.newNews.formResponse = "News has been added.";
                            } else {
                                $scope.newNews.formResponse = "Error: Cannot add news 2! " + data;
                            }
                            console.dir(data);
                            $scope.uploading = false;
                        })
                        .error(function(data, status, headers, config) {
                            $scope.data.news[$scope.data.news.indexOf(news)].formResponse =
                                "Error: Could not add news 2! " + data;
                            console.log(data);
                            $scope.uploading = false;
                        });
                } else {
                    var names = [];
                    for (var i = 0; i < $scope.newNews.selectedFiles.length; i++)
                        names.push($scope.newNews.selectedFiles[i].name);
                    $scope.newNews.selectedFiles.upload = Upload.upload({
                        url: appURL + 'processData.php?action=3',
                        method: 'POST',
                        fields: {
                            news: $scope.newNews
                        },
                        file: $scope.newNews.selectedFiles,
                        fileFormDataName: names
                    });
                    $scope.newNews.selectedFiles.upload.then(function(response) {
                        $timeout(function() {
                            if ((typeof response.data === 'object') && (response.data !== null)){
                                var newNews = {};
                                newNews.nid = response.data.id;
                                newNews.images = angular.copy(response.data.images);
                                newNews.title = $scope.newNews.title;
                                newNews.description = $scope.newNews.description;
                                if ($scope.newNews.activeFrom > 0)
                                    newNews.activeFrom = new Date($scope.newNews.activeFrom * 1000);
                                else
                                    newNews.activeFrom = null;
                                if ($scope.newNews.activeUntil > 0)
                                    newNews.activeUntil = new Date($scope.newNews.activeUntil * 1000);
                                else
                                    newNews.activeUntil = null;
                                newNews.contactName = $scope.newNews.contactName;
                                newNews.contactEmail = $scope.newNews.contactEmail;
                                newNews.contactPhone = $scope.newNews.contactPhone;
                                newNews.sticky = $scope.newNews.sticky;
                                for (var j = 0; j < $scope.data.people.length; j++)
                                    if ($scope.newNews.contactID.uid === $scope.data.people[j].uid){
                                        newNews.contactID = $scope.data.people[j];
                                        break;
                                    }
                                newNews.show = false;
                                newNews.class = "";
                                newNews.status = 0;
                                newNews.type = $scope.newNews.type;
                                newNews.selectedFiles = [];
                                $scope.data.news.push(newNews);
                                $scope.newNews.formResponse = "News has been added.";
                            } else {
                                $scope.newNews.formResponse = "Error: Can not add news! " + response.data;
                            }
                            console.dir(response.data);
                            $scope.uploading = false;
                        });
                    }, function(response) {
                        if (response.status > 0)
                            $scope.newNews.formResponse = response.status + ': ' + response.data;
                        $scope.uploading = false;
                    });
                    $scope.newNews.selectedFiles.upload.progress(function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        $scope.newNews.selectedFiles.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            };
        }])

    .directive('manageNewsList', [ function() {
        return {
            restrict: 'A',
            controller: 'manageNewsListCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageNews/manageNewsList.tpl.html'
        };
    }])

    .controller('NewsItemFieldsCtrl', ['$scope', '$timeout', 'Upload',
        function NewsItemFieldsCtrl($scope, $timeout, Upload){
            $scope.dpFormat = 'MM/dd/yyyy';
            $scope.tinymceOptions = {
                inline: false,
                plugins : 'link spellchecker code',
                toolbar: 'undo redo | bold italic | link | code',
                menubar : false,
                skin: 'lightgray',
                theme : 'modern'
            };

            $scope.generateThumb = function(files, news) {
                if (files.length > 0 && files !== null) {
                    for (var i = 0; i < files.length; i++){
                        if (news.nid > 0) {
                            $scope.data.news[$scope.data.news.indexOf(news)].selectedFiles.push(files[i]);
                        } else {
                            $scope.news.selectedFiles.push(files[i]);
                        }
                        if ($scope.fileReaderSupported && files[i].type.indexOf('image') > -1) {
                            $timeout(function() {
                                var fileReader = new FileReader();
                                fileReader.readAsDataURL(files[i]);
                                fileReader.onload = function(e) {
                                    $timeout(function() {
                                        files[i].dataUrl = e.target.result;
                                    });
                                }
                            });
                        }
                    }
                }
            };

            $scope.showDatePicker = function(news, isFrom) {
                if (news.nid > 0) {
                    if (isFrom === true) {
                        if ($scope.data.news[$scope.data.news.indexOf(news)].activeFrom == null) {
                            $scope.data.news[$scope.data.news.indexOf(news)].activeFrom = new Date();
                            $scope.data.news[$scope.data.news.indexOf(news)].activeFrom.setHours(0,0,0,0);
                        }
                        $scope.data.news[$scope.data.news.indexOf(news)].dpFrom = true;
                    } else {
                        if ($scope.data.news[$scope.data.news.indexOf(news)].activeUntil == null) {
                            $scope.data.news[$scope.data.news.indexOf(news)].activeUntil = new Date();
                            $scope.data.news[$scope.data.news.indexOf(news)].activeUntil.setHours(0,0,0,0);
                        }
                        $scope.data.news[$scope.data.news.indexOf(news)].dpUntil = true;
                    }
                } else {
                    if (isFrom === true) {
                        $scope.news.dpFrom = true;
                    } else {
                        $scope.news.dpUntil = true;
                    }
                }
            };
        }])

    .directive('newsItemFieldsList', ['$timeout', function($timeout) {
        return {
            restrict: 'AC',
            scope: {
                news: '=newsdata',
                data: '=list'
            },
            controller: 'NewsItemFieldsCtrl',
            link: function(scope, elm, attrs){
                scope.onNewsDPFocus = function($event, news, isFrom){
                    $timeout(function() {
                        scope.showDatePicker(news, isFrom);
                        scope.$apply();
                    }, 0);
                };
            },
            templateUrl: 'manageNews/manageNewsItemFields.tpl.html'
        };
    }])

    .controller('manageAdminsListCtrl', ['$scope', 'newsFactory',
        function manageAdminsListCtrl($scope, newsFactory){

        }])

    .directive('manageAdminsList', [ function() {
        return {
            restrict: 'A',
            controller: 'manageAdminsListCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageNews/manageNewsAdmins.tpl.html'
        };
    }]);



angular.module('manage.manageOneSearch', [])
    .constant('ONESEARCH_GROUP', 4)

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/manage-onesearch', {
            controller: 'mainOneSearchCtrl',
            templateUrl: 'manageOneSearch/mainOneSearch.tpl.html',
            resolve: {
                userData: function(tokenReceiver){
                    return tokenReceiver.getPromise();
                }
            }
        });
    }])

    .controller('mainOneSearchCtrl', ['$scope', 'userData', 'ONESEARCH_GROUP', 'AuthService',
    function mainOneSearchCtrl($scope, userData, ONESEARCH_GROUP, AuthService){
        $scope.userInfo = AuthService.isAuthorized();
        $scope.hasAccess = false;
        if (angular.isDefined($scope.userInfo.group)) {
            if ((parseInt($scope.userInfo.group) & ONESEARCH_GROUP) === ONESEARCH_GROUP) {
                $scope.hasAccess = true;
            }
        }
        $scope.tabs = [
            { name: 'Recommended Links',
                number: 0,
                active: true
            },
            { name: 'Search Statistics',
                number: 1,
                active: false
            }
        ];
    }])

    .controller('manageOneSearchCtrl', ['$scope', 'osFactory',
        function manageOneSearchCtrl($scope, osFactory){
            $scope.recList = [];
            $scope.addRec = {};
            $scope.addRec.keyword = "";
            $scope.addRec.link = "";
            $scope.addRec.description = "";
            $scope.response = "";
            $scope.filterKeyword = '';
            $scope.filterLink = '';
            $scope.filterLinkTitle = '';
            $scope.expanded = -1;

            $scope.sortModes = [
                {by:'keyword', reverse:false},
                {by:'description', reverse:false},
                {by:'link', reverse:false}
            ];

            osFactory.getData('reclist')
                .success(function(data) {
                    $scope.recList = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.expand = function(rec){
                $scope.expanded = rec.id;
            };

            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
            };

            $scope.addRecommendation = function(){
                if ( ($scope.addRec.keyword.length > 0) && ($scope.addRec.link.length > 0) && ($scope.addRec.description.length > 0) ){
                    osFactory.postData({action : 1}, $scope.addRec)
                        .success(function(data, status, headers, config) {
                            console.dir(data);
                            if ((typeof data === 'object') && (data !== null)){
                                var newRec = {};
                                newRec.id = data.rid;
                                newRec.linkid = data.lid;
                                newRec.keyword = $scope.addRec.keyword;
                                newRec.link = $scope.addRec.link;
                                newRec.description = $scope.addRec.description;
                                $scope.recList.RecList.push(newRec);
                                $scope.response = data.text;
                            } else
                                $scope.response = data;
                        })
                        .error(function(data, status, headers, config) {
                            $scope.response = "Error: Could not add recommendation link! " + data;
                        });
                } else
                    alert("Please fill out all required fields!");
            };
            $scope.deleteRec = function(rec, index){
                if (confirm("Are you sure you want to delete " + rec.description + " link?")){
                    osFactory.postData({action : 2}, rec)
                        .success(function(data, status, headers, config) {
                            $scope.response = data;
                            $scope.recList.RecList.splice(index, 1);
                            $scope.expanded = -1;
                        })
                        .error(function(data, status, headers, config) {
                            $scope.response = "Error: Could not delete recommendation! " + data;
                        });
                }
            };
            $scope.updateRec = function(rec){
                osFactory.postData({action : 3}, rec)
                    .success(function(data, status, headers, config) {
                        $scope.response = data;
                        $scope.expanded = -1;
                    })
                    .error(function(data, status, headers, config) {
                        $scope.response = "Error: Could not update recommendation! " + data;
                    });
            };
        }])
    .directive('recommendedLinksList', [ function() {
        return {
            restrict: 'AC',
            controller: 'manageOneSearchCtrl',
            templateUrl: 'manageOneSearch/manageOneSearch.tpl.html'
        };
    }])

    .controller('oneSearchStatCtrl', ['$scope', 'osFactory',
        function oneSearchStatCtrl($scope, osFactory){
            $scope.statList = [];

            osFactory.getData('statistics')
                .success(function(data) {
                    $scope.statList = data;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

        }])
    .directive('searchStatisticsList', [ function() {
        return {
            restrict: 'AC',
            controller: 'oneSearchStatCtrl',
            templateUrl: 'manageOneSearch/oneSearchStat.tpl.html'
        };
    }]);
angular.module('manage.manageSoftware', ['ngFileUpload'])
    .constant('OS', [
        {name:'MS Windows', value:1},
        {name:'Apple Mac', value:2}
    ])
    .constant('SOFTWARE_GROUP', 64)

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/manage-software', {
            controller: 'manageSWCtrl',
            templateUrl: 'manageSoftware/manageSoftware.tpl.html',
            resolve: {
                userData: function(tokenReceiver){
                    return tokenReceiver.getPromise();
                }
            }
        });
    }])

    .controller('manageSWCtrl', ['$scope', 'swFactory', 'OS', 'userData', 'SOFTWARE_GROUP', 'AuthService',
    function manageSWCtrl($scope, swFactory, OS, userData, SOFTWARE_GROUP, AuthService){
        $scope.userInfo = AuthService.isAuthorized();
        $scope.SWList = {};
        $scope.newSW = {};
        $scope.newComp = {};
        $scope.hasAccess = false;
        if (angular.isDefined($scope.userInfo.group)) {
            if ((parseInt($scope.userInfo.group) & SOFTWARE_GROUP) === SOFTWARE_GROUP) {
                $scope.hasAccess = true;
            }
        }

        swFactory.getData("all/backend")
            .success(function(data) {
                console.dir(data);
                for (var i = 0; i < data.software.length; i++){
                    data.software[i].show = false;
                    data.software[i].class = "";
                    data.software[i].selCat = data.categories[0];
                    data.software[i].newVer = {};
                    data.software[i].newVer.version = "";
                    data.software[i].newVer.selOS = OS[0];
                    for (var j = 0; j < data.software[i].versions.length; j++){
                        data.software[i].versions[j].newLoc = {};
                        data.software[i].versions[j].newLoc.selLoc = data.locations[0];
                        data.software[i].versions[j].newLoc.devices = [];
                        for (var k = 0; k < data.devices.length; k++)
                            data.software[i].versions[j].newLoc.devices[k] = false;
                    }
                    for (var j = 0; j < data.licenseModes.length; j++)
                        if (data.licenseModes[j].lmid === data.software[i].lmid){
                            data.software[i].selMode = data.licenseModes[j];
                        }
                    data.software[i].newLink = {};
                    data.software[i].newLink.description = "";
                    data.software[i].newLink.title = "";
                    data.software[i].newLink.url = "";
                }
                $scope.newSW.selCat = data.categories[0];
                $scope.newSW.selMode = data.licenseModes[0];
                $scope.selMap = data.maps[3];
                $scope.newComp.selLoc = data.locations[0];

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
            },
            { name: 'Computer Maps',
                number: 2,
                active: false
            }
        ];
    }])

    .controller('manageSWListCtrl', ['$scope', '$timeout', 'Upload', 'swFactory', 'SOFTWARE_URL', 'OS',
        function manageSWListCtrl($scope, $timeout, Upload, swFactory, appURL, OS){
            this.swFactory = swFactory;
            $scope.titleFilter = '';
            $scope.descrFilter = '';
            $scope.sortMode = 0;
            $scope.sortModes = [
                {by:'title', reverse:false},
                {by:'status', reverse:false}
            ];
            $scope.sortButton = $scope.sortMode;
            $scope.appURL = appURL;

            $scope.newSW.versions = [];
            $scope.newSW.links = [];
            $scope.newSW.categories = [];
            $scope.newSW.newVer = {};
            $scope.newSW.newVer.selOS = OS[0];
            $scope.newSW.newVer.version = "";
            $scope.newSW.newLink = {};
            $scope.newSW.newLink.description = "";
            $scope.newSW.newLink.title = "";
            $scope.newSW.newLink.url = "";
            $scope.newSW.modules = "";
            $scope.newSW.trf = 0;
            $scope.newSW.po = 0;
            $scope.newSW.num_licenses = 0;
            $scope.newSW.trf_notes = "";
            $scope.newSW.purch_date = "2015-1-1";
            $scope.newSW.vendor_name = "";
            $scope.newSW.vendor_contact = "";
            $scope.newSW.vendor_phone = "";
            $scope.newSW.vendor_email = "";
            $scope.newSW.main_effect = "2015-1-1";
            $scope.newSW.main_exp = "2015-1-1";
            $scope.newSW.pkey = "";
            $scope.newSW.devices = "";
            $scope.newSW.owner = {};
            $scope.newSW.owner.department = "";
            $scope.newSW.owner.name = "";
            $scope.newSW.owner.email = "";
            $scope.newSW.owner.phone = "";
            $scope.newSW.partners = [];
            $scope.newSW.partners[0] = {};
            $scope.newSW.partners[0].department = "";
            $scope.newSW.partners[0].name = "";
            $scope.newSW.partners[0].email = "";
            $scope.newSW.partners[0].phone = "";
            $scope.newSW.requester = {};
            $scope.newSW.requester.department = "";
            $scope.newSW.requester.name = "";
            $scope.newSW.requester.email = "";
            $scope.newSW.requester.phone = "";

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
            $scope.sortBy = function(by){
                if ($scope.sortMode === by)
                    $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
                else
                    $scope.sortMode = by;
            };

            $scope.publishSW = function(sw){
                swFactory.postData({action : 10}, sw)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.SWList.software[$scope.SWList.software.indexOf(sw)].status = 1;
                            $scope.formResponse = "Software has been published.";
                        } else {
                            $scope.formResponse = "Error: Can not publish software! " + data;
                        }
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not publish software! " + data;
                        console.log(data);
                    });
            };
            $scope.unpublishSW = function(sw){
                swFactory.postData({action : 11}, sw)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.SWList.software[$scope.SWList.software.indexOf(sw)].status = 0;
                            $scope.formResponse = "Software has been unpublished.";
                        } else {
                            $scope.formResponse = "Error: Can not publish software! " + data;
                        }
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.formResponse = "Error: Could not publish software! " + data;
                        console.log(data);
                    });
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
                            newSW.status = 0;
                            newSW.icon = response.data.icon;
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
                            newSW.newVer.selOS = OS[0];
                            newSW.newVer.version = "";
                            newSW.newLink = {};
                            newSW.newLink.description = "";
                            newSW.newLink.title = "";
                            newSW.newLink.url = "";
                            newSW.trf = $scope.newSW.trf;
                            newSW.po = $scope.newSW.po;
                            newSW.num_licenses = $scope.newSW.num_licenses;
                            newSW.trf_notes = $scope.newSW.trf_notes;
                            newSW.purch_date = $scope.newSW.purch_date;
                            newSW.vendor_name = $scope.newSW.vendor_name;
                            newSW.vendor_contact = $scope.newSW.vendor_contact;
                            newSW.vendor_phone = $scope.newSW.vendor_phone;
                            newSW.vendor_email = $scope.newSW.vendor_email;
                            newSW.main_effect = $scope.newSW.main_effect;
                            newSW.main_exp = $scope.newSW.main_exp;
                            newSW.pkey = $scope.newSW.pkey;
                            newSW.devices = $scope.newSW.devices;
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
            $scope.copySW = function(sw) {
                $scope.newSW = angular.copy(sw);
                $scope.newSW.selCat = $scope.SWList.categories[0];
                $scope.newSW.newVer = {};
                $scope.newSW.newVer.version = "";
                $scope.newSW.newVer.selOS = OS[0];
                for (var j = 0; j < $scope.newSW.versions.length; j++){
                    $scope.newSW.versions[j].newLoc = {};
                    $scope.newSW.versions[j].newLoc.selLoc = $scope.SWList.locations[0];
                    $scope.newSW.versions[j].newLoc.devices = [];
                    for (var k = 0; k < $scope.SWList.devices.length; k++)
                        $scope.newSW.versions[j].newLoc.devices[k] = false;
                }
                for (var j = 0; j < $scope.SWList.licenseModes.length; j++)
                    if ($scope.SWList.licenseModes[j].lmid === $scope.newSW.lmid){
                        $scope.newSW.selMode = $scope.SWList.licenseModes[j];
                    }
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
    }])

    .directive('softwareManageList',['$timeout',  function($timeout) {
        return {
            restrict: 'A',
            controller: 'manageSWListCtrl',
            link: function(scope, elm, attrs, Ctrl){
                scope.export = function() {
                    $timeout(function() {
                        Ctrl.swFactory.getData("export")
                            .success(function(data) {
                                var blob = new Blob([ JSON.stringify(data) ], { type : 'application/json' });
                                scope.exportUrl = (window.URL || window.webkitURL).createObjectURL( blob );

                                var downloadLink = angular.element('<a></a>');
//                              downloadLink.attr('href', 'data:attachment/json;base64,' + data);
                                downloadLink.attr('href', scope.exportUrl);
                                downloadLink.attr('target', '_self');
                                downloadLink.attr('download', 'softwareData.json');
                                elm.append(downloadLink);
                                downloadLink[0].click();
                                scope.$apply();
                            })
                            .error(function(data, status, headers, config) {
                                console.log(data);
                            });
                    }, 0);
                };
            },
            templateUrl: 'manageSoftware/manageSoftwareList.tpl.html'
        };
    }])

    .controller('SWItemFieldsCtrl', ['$scope', '$timeout', 'Upload', 'OS',
    function SWItemFieldsCtrl($scope, $timeout, Upload, OS){
        $scope.os = OS;
        $scope.generateThumb = function(sw, files) {
            if (files.length > 0 && files !== null) {
                if (files[0].type.indexOf('image') > -1) {
                    if (sw.sid > 0) {
                        $scope.data.software[$scope.data.software.indexOf(sw)].picFile = [];
                        $scope.data.software[$scope.data.software.indexOf(sw)].picFile.push(files[0]);
                    } else {
                        $scope.sw.picFile = [];
                        $scope.sw.picFile.push(files[0]);
                    }
                    console.dir(sw);
                    $timeout(function() {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL(files[0]);
                        fileReader.onload = function(e) {
                            $timeout(function() {
                                files[0].dataUrl = e.target.result;
                            });
                        }
                    });
                }
            }
        };

        $scope.checkDevices = function(device, number){
            device = parseInt(device);
            number = parseInt(number);
            if ((device & number) === number)
                return true;
            return false;
        };

        $scope.addVersionBoth = function(sw){
            if (sw.newVer.version.length > 0){
                var isPresent = false;
                for (var i = 0; i < sw.versions.length; i++)
                    if (sw.versions[i].version === sw.newVer.version && sw.versions[i].os === sw.newVer.os){
                        isPresent = true;
                        break;
                    }
                if (!isPresent) {
                    var newVer = {};
                    newVer.version = sw.newVer.version;
                    newVer.os = sw.newVer.selOS.value;
                    newVer.locations = [];
                    newVer.newLoc = {};
                    newVer.newLoc.selLoc = $scope.data.locations[0];
                    newVer.newLoc.devices = [];
                    for (var j = 0; j < $scope.data.devices.length; j++)
                        newVer.newLoc.devices[j] = false;

                    if (sw.sid > 0) {
                        newVer.vid = -1;
                        newVer.sid = sw.sid;
                        $scope.data.software[$scope.data.software.indexOf(sw)].versions.push(newVer);
                    } else {
                        $scope.sw.versions.push(newVer);
                    }
                }
            }
        };
        $scope.deleteVersionBoth = function(sw, version){
            if (sw.sid > 0) {
                $scope.data.software[$scope.data.software.indexOf(sw)].versions.splice(
                    $scope.data.software[$scope.data.software.indexOf(sw)].versions.indexOf(version), 1
                );
            } else {
                $scope.sw.versions.splice($scope.sw.versions.indexOf(version), 1);
            }
        };
        $scope.addLocationBoth = function(sw,version){
            var isPresent = false;
            for (var i = 0; i < version.locations.length; i++)
                if (version.locations[i].lid === version.newLoc.selLoc.lid){
                    isPresent = true;
                    break;
                }
            if (!isPresent){
                var newLoc = {};
                newLoc.lid = version.newLoc.selLoc.lid;
                newLoc.name = version.newLoc.selLoc.name;
                newLoc.parent = version.newLoc.selLoc.parent;
                newLoc.devices = 0;
                for (var i = 0; i < $scope.data.devices.length; i++)
                    if (version.newLoc.devices[i])
                        newLoc.devices += parseInt($scope.data.devices[i].did);
                if (newLoc.devices > 0) {
                    if (sw.sid > 0) {
                        newLoc.id = -1;
                        newLoc.sid = sw.sid;
                        newLoc.vid = version.vid;
                        $scope.data.software[$scope.data.software.indexOf(sw)].versions[$scope.data.software[$scope.data.software.indexOf(sw)].versions.indexOf(version)].locations.push(newLoc);
                    } else {
                        $scope.sw.versions[$scope.sw.versions.indexOf(version)].locations.push(newLoc);
                    }
                } else {
                    alert("Please select at least one device type!");
                }
            }
        };
        $scope.deleteLocationBoth = function(sw, version, location){
            if (sw.sid > 0) {
                $scope.data.software[$scope.data.software.indexOf(sw)].versions[$scope.data.software[$scope.data.software.indexOf(sw)].versions.indexOf(version)].locations
                    .splice(
                        $scope.data.software[$scope.data.software.indexOf(sw)].versions[$scope.data.software[$scope.data.software.indexOf(sw)].versions.indexOf(version)].locations.indexOf(location),
                        1
                    );
            } else {
                $scope.sw.versions[$scope.sw.versions.indexOf(version)].locations
                    .splice(
                        $scope.sw.versions[$scope.sw.versions.indexOf(version)].locations.indexOf(location),
                        1
                    );
            }
        };
        $scope.addCategoryBoth = function(sw){
            var isPresent = false;
            for (var i = 0; i < sw.categories.length; i++)
                if (sw.categories[i].cid === sw.selCat.cid){
                    isPresent = true;
                    break;
                }
            if (!isPresent) {
                var newCat = {};
                newCat.cid = sw.selCat.cid;
                newCat.name = sw.selCat.name;

                if (sw.sid > 0) {
                    newCat.id = -1;
                    $scope.data.software[$scope.data.software.indexOf(sw)].categories.push(newCat);
                } else {
                    $scope.sw.categories.push(newCat);
                }
            }
        };
        $scope.deleteCategoryBoth = function(sw, category){
            if (sw.sid > 0) {
                $scope.data.software[$scope.data.software.indexOf(sw)].categories.splice(
                    $scope.data.software[$scope.data.software.indexOf(sw)].categories.indexOf(category), 1
                );
            } else {
                $scope.sw.categories.splice($scope.sw.categories.indexOf(category), 1);
            }
        };
        $scope.addLinkBoth = function(sw){
            if (sw.newLink.title.length > 0 && sw.newLink.url.length > 1){
                var isPresent = false;
                for (var i = 0; i < sw.links.length; i++)
                    if (sw.links[i].title === sw.newLink.title && sw.links[i].url === sw.newLink.url){
                        isPresent = true;
                        break;
                    }
                if (!isPresent) {
                    var newLink = {};
                    newLink.description = sw.newLink.description;
                    newLink.title = sw.newLink.title;
                    newLink.url = sw.newLink.url;

                    if (sw.sid > 0) {
                        newLink.linkid = -1;
                        newLink.sid = sw.sid;
                        $scope.data.software[$scope.data.software.indexOf(sw)].links.push(newLink);
                    } else {
                        $scope.sw.links.push(newLink);
                    }
                }
            }
        };
        $scope.deleteLinkBoth = function(sw, link){
            if (sw.sid > 0) {
                $scope.data.software[$scope.data.software.indexOf(sw)].links
                    .splice($scope.data.software[$scope.data.software.indexOf(sw)].links.indexOf(link), 1);
            } else {
                $scope.sw.links.splice($scope.sw.links.indexOf(link), 1);
            }
        };
        $scope.addPartnerBoth = function(sw){
            var partner = {};
            partner.department = "";
            partner.name = "";
            partner.email = "";
            partner.phone = "";

            if (sw.sid > 0) {
                $scope.data.software[$scope.data.software.indexOf(sw)].partners.push(partner);
            } else {
                $scope.sw.partners.push(partner);
            }
        };
        $scope.deletePartnerBoth = function(sw, partner){
            if (sw.sid > 0) {
                $scope.data.software[$scope.data.software.indexOf(sw)].partners
                    .splice($scope.data.software[$scope.data.software.indexOf(sw)].partners.indexOf(partner), 1);
            } else {
                $scope.sw.partners.splice($scope.sw.partners.indexOf(partner), 1);
            }
        };
    }])

    .directive('softwareItemFieldsList', ['$timeout', 'Upload', function($timeout, Upload) {
        return {
            restrict: 'AC',
            scope: {
                sw: '=swdata',
                data: '=list'
            },
            controller: 'SWItemFieldsCtrl',
            link: function(scope, elm, attrs){
                scope.addVersion = function(sw){
                    $timeout(function() {
                        scope.addVersionBoth(sw);
                        scope.$apply();
                    }, 0);
                };
                scope.deleteVersion = function(sw, version){
                    $timeout(function() {
                        scope.deleteVersionBoth(sw, version);
                        scope.$apply();
                    }, 0);
                };
                scope.addLocation = function(sw, version){
                    $timeout(function() {
                        scope.addLocationBoth(sw, version);
                        scope.$apply();
                    }, 0);
                };
                scope.deleteLocation = function(sw, version, location){
                    $timeout(function() {
                        scope.deleteLocationBoth(sw, version, location);
                        scope.$apply();
                    }, 0);
                };
                scope.addCategory = function(sw){
                    $timeout(function() {
                        scope.addCategoryBoth(sw);
                        scope.$apply();
                    }, 0);
                };
                scope.deleteCategory = function(sw, category){
                    $timeout(function() {
                        scope.deleteCategoryBoth(sw, category);
                        scope.$apply();
                    }, 0);
                };
                scope.addLink = function(sw){
                    $timeout(function() {
                        scope.addLinkBoth(sw);
                        scope.$apply();
                    }, 0);
                };
                scope.deleteLink = function(sw, link){
                    $timeout(function() {
                        scope.deleteLinkBoth(sw, link);
                        scope.$apply();
                    }, 0);
                };
                scope.addPartner = function(sw){
                    $timeout(function() {
                        scope.addPartnerBoth(sw);
                        scope.$apply();
                    }, 0);
                };
                scope.deletePartner = function(sw, partner){
                    $timeout(function() {
                        scope.deletePartnerBoth(sw, partner);
                        scope.$apply();
                    }, 0);
                };
            },
            templateUrl: 'manageSoftware/manageSoftwareItemFields.tpl.html'
        };
    }])

    .controller('manageSWLocCatCtrl', ['$scope', '$timeout', 'swFactory', 'OS',
        function manageSWLocCatCtrl($scope, $timeout, swFactory, OS){
            $scope.selLocation = -1;
            $scope.selCategory = -1;
            $scope.newLocation = {};
            $scope.newLocation.name = '';
            $scope.newLocation.parent = 0;
            $scope.newCategory = '';
            $scope.locResponse = '';
            $scope.catResponse = '';
            $scope.os = OS;


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
                            newLoc.fullName = newLoc.name;
                            if ($scope.newLocation.parent > 0)
                                for (var i = 0; i < $scope.SWList.locations.length; i++)
                                    if ($scope.SWList.locations[i].lid === $scope.newLocation.parent){
                                        newLoc.parent = $scope.newLocation.parent;
                                        newLoc.fullName = $scope.SWList.locations[i].name + ": " + newLoc.name;
                                        break;
                                    }
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
    .directive('softwareManageLocCat', [ function() {
        return {
            restrict: 'A',
            controller: 'manageSWLocCatCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageSoftware/manageSoftwareLocCat.tpl.html'
        };
    }])

    .controller('manageSWCompMapsCtrl', ['$scope', '$window', 'swFactory', 'OS',
    function manageSWCompMapsCtrl($scope, $window, swFactory, OS){
        $scope.selComp = -1;
        $scope.selCompX = 0;
        $scope.selCompY = 0;
        $scope.selCompOS = {};
        $scope.selCompLoc = {};
        $scope.high = -1;
        $scope.newComp.name = "";
        $scope.newComp.selType = OS[0];
        $scope.showCreate = false;
        $scope.compStatus = [
            {name: 'Off', value: 0},
            {name: 'On', value: 1}
        ];
        $scope.selCompStatus = $scope.compStatus[0];
        $scope.os = OS;

        $scope.highlight = function(comp){
            $scope.high = comp.compid;
        };
        $scope.expand = function(index){
            if ($scope.selComp !== index){
                $scope.selComp = index;
                var comp = $scope.selMap.computers[index];
                $scope.selCompX = parseInt(comp.mapX) + 15;
                $scope.selCompY = parseInt(comp.mapY) + 15;
                if (comp.type == OS[0].value)
                    $scope.selCompOS = OS[0];
                else
                    $scope.selCompOS = OS[1];
                if (comp.status == 1)
                    $scope.selCompStatus = $scope.compStatus[1];
                else
                    $scope.selCompStatus = $scope.compStatus[0];
                for (var i = 0; i < $scope.SWList.locations.length; i++)
                    if ($scope.SWList.locations[i].lid == comp.lid){
                        $scope.selCompLoc = $scope.SWList.locations[i];
                        break;
                    }
                $scope.compResponse = "";
            } else
                $scope.selComp = -1;
        };
        $scope.updateMap = function(){
            $scope.selComp = -1;
            $scope.showCreate = false;
        };

        $scope.createComp = function(event){
            if (event.button === 2 && event.target.id === "computer-map"){
                $scope.newComp.mid = $scope.selMap.mid;
                var offset = getOffset(event.target);
                $scope.newComp.mapX = Math.round(event.pageX - offset.left);
                $scope.newComp.mapY = Math.round(event.pageY - offset.top);

                $scope.showCreate = true;
                $scope.compResponse = "";
            }
        };

        function getOffset(elm){
            var rect = elm.getBoundingClientRect();
            //return {top: rect.top, left: rect.left};
            var doc = elm.ownerDocument;
            var docElem = doc.documentElement;

            return {
                top: rect.top + $window.pageYOffset - docElem.clientTop,
                left: rect.left + $window.pageXOffset - docElem.clientLeft
            };
        }

        $scope.addComp = function(){
            swFactory.postData({action : 12}, $scope.newComp)
                .success(function(data, status, headers, config) {
                    if ((typeof data === 'object') && (data !== null)){
                        var newComputer = {};
                        newComputer.compid = data.id;
                        newComputer.name = $scope.newComp.name;
                        newComputer.type = $scope.newComp.selType.value;
                        newComputer.lid = $scope.newComp.selLoc.lid;
                        newComputer.mid = $scope.newComp.mid;
                        newComputer.mapX = $scope.newComp.mapX;
                        newComputer.mapY = $scope.newComp.mapY;
                        newComputer.status = 1;
                        $scope.SWList.maps[$scope.SWList.maps.indexOf($scope.selMap)].computers.push(newComputer);
                        $scope.showCreate = false;
                        $scope.compResponse = "Computer has been added!";
                    } else {
                        $scope.compResponse = "Error: Can not add Computer! " + data;
                    }
                    console.log(data);
                })
                .error(function(data, status, headers, config) {
                    $scope.compResponse = "Error: Could not add Computer! " + data;
                    console.log(data);
                });
        };
        $scope.deleteComp = function(){
            if (confirm("Delete " + $scope.selMap.computers[$scope.selComp].name + " permanently?") == true){
                swFactory.postData({action : 13}, $scope.selMap.computers[$scope.selComp])
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.SWList.maps[$scope.SWList.maps.indexOf($scope.selMap)].computers.splice($scope.selComp, 1);
                            $scope.selComp = -1;
                            $scope.compResponse = "Computer has been deleted!";
                        } else {
                            $scope.compResponse = "Error: Can not delete Computer! " + data;
                        }
                        console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        $scope.compResponse = "Error: Could not delete Computer! " + data;
                        console.log(data);
                    });
            }
        };
        $scope.updateComp = function(){
            $scope.SWList.maps[$scope.SWList.maps.indexOf($scope.selMap)].computers[$scope.selComp].type = $scope.selCompOS.value;
            $scope.SWList.maps[$scope.SWList.maps.indexOf($scope.selMap)].computers[$scope.selComp].lid = $scope.selCompLoc.lid;
            $scope.SWList.maps[$scope.SWList.maps.indexOf($scope.selMap)].computers[$scope.selComp].status = $scope.selCompStatus.value;
            swFactory.postData({action : 14}, $scope.SWList.maps[$scope.SWList.maps.indexOf($scope.selMap)].computers[$scope.selComp])
                .success(function(data, status, headers, config) {
                    if (data == 1){
                        $scope.compResponse = "Computer name has been updated!";
                    } else {
                        $scope.compResponse = "Error: Can not update Computer! " + data;
                    }
                    console.log(data);
                })
                .error(function(data, status, headers, config) {
                    $scope.compResponse = "Error: Could not update Computer! " + data;
                    console.log(data);
                });
        };


    }])
    .directive('softwareManageComputerMaps', [ function() {
        return {
            restrict: 'A',
            controller: 'manageSWCompMapsCtrl',
            link: function(scope, elm, attrs){

            },
            templateUrl: 'manageSoftware/manageSoftwareComputerMaps.tpl.html'
        };
    }]);

angular.module('manage.manageUserGroups', [])
    .constant('USERS_GROUP', 1)

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/manage-user-groups', {
            controller: 'userGroupsCtrl',
            templateUrl: 'manageUserGroups/manageUG.tpl.html',
            resolve: {
                userData: function(tokenReceiver){
                    return tokenReceiver.getPromise();
                }
            }
        });
    }])

    .controller('userGroupsCtrl', ['$scope', 'wpUsersFactory', 'ugFactory', 'userData', 'USERS_GROUP', 'AuthService',
    function userGroupsCtrl($scope, wpUsersFactory, ugFactory, userData, USERS_GROUP, AuthService){
        $scope.userInfo = AuthService.isAuthorized();
        $scope.isLoading = true;
        $scope.expUser = -1;
        $scope.wpUsers = [];
        $scope.users = [];
        $scope.apps = [];
        $scope.newUserAccess = [];
        $scope.hasAccess = false;
        if (angular.isDefined($scope.userInfo.group)) {
            if ((parseInt($scope.userInfo.group) & USERS_GROUP) === USERS_GROUP) {
                $scope.hasAccess = true;
            }
        }
        wpUsersFactory.getAllUsersWP()
            .success(function(data) {
                //remove admin accounts
                for (var i = 0; i < data.length; i++) {
                    if (data[i].last_name.length < 1) {
                        data.splice(i, 1);
                    }
                }

                for (i = 0; i < data.length; i++) {
                    data[i].fullName = data[i].last_name + ", " + data[i].first_name + " (" + data[i].nickname + ")";
                }
                $scope.wpUsers = data;
                $scope.newUser = $scope.wpUsers[0];
                console.log("WP user list received:");
                ugFactory.getData()
                    .success(function(data2) {
                        if (angular.isDefined(data2.users) && angular.isDefined(data2.apps)) {
                            $scope.users = data2.users;
                            $scope.apps = data2.apps;
                            for (i = 0; i < $scope.apps.length; i++)
                                $scope.newUserAccess[i] = false;
                            $scope.isLoading = false;
                            console.log("User groups received.");
                        } else {
                            console.dir(data2);
                        }
                    })
                    .error(function(data2, status, headers, config) {
                        $scope.result = "Error! Could not retrieve user data! " + data2;
                        $scope.isLoading = false;
                        console.dir(data2);
                    });
            })
            .error(function(data, status, headers, config) {
                $scope.isLoading = false;
                console.dir(data);
            });

        $scope.tabs = [
            { name: 'Users',
                number: 0,
                active: true
            },
            { name: 'Applications',
                number: 1,
                active: false
            }];

        $scope.sortMode = 1;
        $scope.sortModes = [
            {by:'wpLogin', reverse:false},
            {by:'name', reverse:false}
        ];

        $scope.expandUser = function(user){
            $scope.result = "";
            $scope.expUser = user.id;
        };
        $scope.isExpUser = function(uID){
            if ($scope.expUser === uID)
                return true;
            return false;
        };
        $scope.sortBy = function(by){
            if ($scope.sortMode === by)
                $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
            else
                $scope.sortMode = by;
        };

        $scope.updateUser = function(user){
            $scope.isLoading = true;
            ugFactory.postData({action : 1}, user)
                .success(function(data) {
                    if (data == 1){
                        $scope.result = "Saved";
                    } else
                        $scope.result = "Error! Could not save data! " + data;
                    $scope.isLoading = false;
                    console.dir(data);
                })
                .error(function(data, status, headers, config) {
                    $scope.result = "Error! Could not save data! " + data;
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
                        $scope.result2 = "Error! Could not grant access! " + data;
                    $scope.isLoading = false;
                })
                .error(function(data, status, headers, config) {
                    $scope.isLoading = false;
                    $scope.result2 = "Error! Could not grant access! " + data;
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
                            $scope.result = "Error! Could not delete user access! " + data;
                        $scope.isLoading = false;
                    })
                    .error(function(data, status, headers, config) {
                        $scope.result = "Error! Could not delete user access! " + data;
                        $scope.isLoading = false;
                    });
            }
        };

    }])

    .controller('myWebAppsCtrl', ['$scope',
        function myWebAppsCtrl($scope){
            $scope.appsAccess = false;
            if (angular.isDefined($scope.userInfo.group)) {
                $scope.appsAccess = true;
            }
        }])
    .directive('viewMyWebApps', [ function() {
        return {
            restrict: 'A',
            controller: 'myWebAppsCtrl',
            templateUrl: 'manageUserGroups/viewMyWebApps.tpl.html'
        };
    }])
angular.module('manage.oneSearchErrors', ['oc.lazyLoad'])

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/onesearch-errors', {
            controller: 'oneSearchErrorsCtrl',
            templateUrl: 'oneSearchErrors/oneSearchErrors.tpl.html',
            resolve: {
                lazyLoad: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load('https://d3js.org/d3.v3.min.js');
                }]
            }
        });
    }])

    .controller('oneSearchErrorsCtrl', ['$scope', 'errorsFactory', 'lazyLoad',
    function oneSearchErrorsCtrl($scope, errorsFactory, lazyLoad){
        $scope.dataProcessed = false;
        $scope.errors = {};
        $scope.errors.tree = {};
        $scope.errors.list = [];
        $scope.errors.mapped = {};
        $scope.errors.mapped.today = [];
        $scope.errors.mapped.month = [];
        $scope.errors.mapped.year = [];
        $scope.eEngine = {};
        $scope.eEngine.engine = 0;

        errorsFactory.getData()
            .success(function(data) {
                var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
                var today = new Date();
                var tree = [];
                for (var j = 0; j < 3; j++) {
                    tree[j] = {};
                    tree[j].years = [];
                    $scope.errors.mapped.today[j] = [];
                    $scope.errors.mapped.month[j] = [];
                    $scope.errors.mapped.year[j] = [];
                    for (var i = 0; i < 24; i++) {
                        $scope.errors.mapped.today[j].push({"x": i, "y": 0});
                    }
                    for (i = 0; i < 31; i++) {
                        $scope.errors.mapped.month[j].push({"x": i + 1, "y": 0});
                    }
                    for (i = 0; i < 12; i++) {
                        $scope.errors.mapped.year[j].push({"x": i, "y": 0});
                    }
                    var curData = [];
                    switch (j) {
                        case 0:
                            curData = data.scout;
                            break;
                        case 1:
                            curData = data.catalog;
                            break;
                        case 2:
                            curData = data.ejournals;
                            break;
                    }
                    for (i = 0; i < curData.length; i++) {
                        curData[i].recorded = curData[i].recorded.replace(/-/g,'/');
                        var dt = new Date(curData[i].recorded);
                        var isPresent = false;
                        var y = 0, m = 0, d = 0;
                        for (y = 0; y < tree[j].years.length; y++) {
                            if (tree[j].years[y].name === dt.getFullYear()) {
                                isPresent = true;
                                break;
                            }
                        }
                        if (!isPresent) {
                            var year = {};
                            year.open = false;
                            year.counter = 0;
                            year.name = dt.getFullYear();
                            year.months = [];
                            tree[j].years.push(year);
                            y = tree[j].years.length - 1;
                        }
                        isPresent = false;
                        for (m = 0; m < tree[j].years[y].months.length; m++) {
                            if (tree[j].years[y].months[m].mm === dt.getMonth()) {
                                isPresent = true;
                                break;
                            }
                        }
                        if (!isPresent) {
                            var month = {};
                            month.open = false;
                            month.counter = 0;
                            month.mm = dt.getMonth();
                            month.name = months[month.mm];
                            month.days = [];
                            tree[j].years[y].months.push(month);
                            m = tree[j].years[y].months.length - 1;
                        }
                        isPresent = false;
                        for (d = 0; d < tree[j].years[y].months[m].days.length; d++) {
                            if (tree[j].years[y].months[m].days[d].day === dt.getDate()) {
                                isPresent = true;
                                break;
                            }
                        }
                        if (!isPresent) {
                            var day = {};
                            day.open = false;
                            day.day = dt.getDate();
                            day.counter = 0;
                            day.errors = [];
                            tree[j].years[y].months[m].days.push(day);
                            d = tree[j].years[y].months[m].days.length - 1;
                        }
                        tree[j].years[y].counter++;
                        tree[j].years[y].months[m].counter++;
                        tree[j].years[y].months[m].days[d].counter++;
                        tree[j].years[y].months[m].days[d].errors.push({recorded: dt, description: curData[i].description});

                        if (dt.getFullYear() === today.getFullYear()) {
                            $scope.errors.mapped.year[j][dt.getMonth()].y++;

                            if (dt.getMonth() === today.getMonth()) {
                                $scope.errors.mapped.month[j][dt.getDate() - 1].y++;

                                if (dt.getDate() === today.getDate()) {
                                    $scope.errors.mapped.today[j][dt.getHours()].y++;
                                }
                            }
                        }
                    }
                    $scope.errors.list[j] = curData;
                }
                $scope.errors.tree = tree;
                $scope.dataProcessed = true;
                console.dir($scope.errors);
            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });

        $scope.tabs = [
            { name: 'Today',
                number: 0,
                active: true
            },
            { name: 'This Month',
                number: 1,
                active: false
            },
            { name: 'This Year',
                number: 2,
                active: false
            }
        ];
    }])

    .controller('errorGraphCtrl', ['$scope', function errorGraphCtrl($scope){

    }])

    .directive('errorGraph', ['$window', function($window) {
        return {
            restrict: 'A',
            scope: {
                errors: '=',
                range: '@'
            },
            controller: 'errorGraphCtrl',
            link: function(scope, elm, attrs){
                var n = 3; // number of layers
                var m = 0; // number of samples per layer
                var margin = {top: 40, right: 10, bottom: 20, left: 10},
                    width = 960 - margin.left - margin.right,
                    height = 540 - margin.top - margin.bottom;
                var stack = d3.layout.stack();
                var layers;
                var x;
                var xAxis;
                var axisX = 0, axisY = height;
                switch (scope.range) {
                    case 'today':
                        m = 24;
                        layers = stack(scope.errors.mapped.today);
                        x = d3.scale.ordinal()
                            .domain(d3.range(m))
                            .rangeRoundBands([0, width], .08);
                        xAxis = d3.svg.axis()
                            .scale(x)
                            .tickSize(0)
                            .tickPadding(6)
                            .orient("bottom");
                        break;
                    case 'month':
                        m = 31;
                        layers = stack(scope.errors.mapped.month);
                        x = d3.scale.ordinal()
                            .domain(d3.range(1, m + 1))
                            .rangeRoundBands([0, width], .08);
                        xAxis = d3.svg.axis()
                            .scale(x)
                            .tickSize(0)
                            .tickPadding(6)
                            .orient("bottom");
                        break;
                    case 'year':
                    default:
                        m = 12;
                        axisX = 44;
                        axisY = height - 16;
                        layers = stack(scope.errors.mapped.year);
                        x = d3.scale.ordinal()
                            .domain(d3.range(m))
                            .rangeRoundBands([0, width], .08);
                        var xD = d3.time.scale()
                            .domain([new Date(2015, 0, 1), new Date(2015, 11, 31)])
                            .range([0, width]);
                        xAxis = d3.svg.axis()
                            .scale(xD)
                            .orient("bottom")
                            .ticks(d3.time.months)
                            .tickSize(16, 0)
                            .tickFormat(d3.time.format("%B"));
                        break;
                }
                console.log(scope.range + " : " + m);
                var yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
                    yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

                var y = d3.scale.linear()
                    .domain([0, yStackMax])
                    .range([height, 0]);

                var yTicks = 20;
                if (yTicks > yGroupMax) {
                    yTicks = yGroupMax;
                }

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .ticks(yTicks)
                    .orient("right");

                var color = d3.scale.linear()
                    .domain([0, n - 1])
                    .range(["#aad", "#556"]);

                var svg = d3.select(elm[0]).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var layer = svg.selectAll(".layer")
                    .data(layers)
                    .enter().append("g")
                    .attr("class", "layer")
                    .style("fill", function(d, i) { return color(i); });

                var rect = layer.selectAll("rect")
                    .data(function(d) { return d; })
                    .enter().append("rect")
                    .attr("x", function(d) {
                        return x(d.x);
                    })
                    .attr("y", height)
                    .attr("width", x.rangeBand())
                    .attr("height", 0);

                rect.transition()
                    .delay(function(d, i) { return i * 10; })
                    .attr("y", function(d) { return y(d.y0 + d.y); })
                    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate("+ axisX +"," + axisY + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(0, 0)")
                    .call(yAxis);

                function transitionGrouped() {
                    console.log("drawing grouped");
                    y.domain([0, yGroupMax]);

                    rect.transition()
                        .duration(500)
                        .delay(function(d, i) { return i * 10; })
                        .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
                        .attr("width", x.rangeBand() / n)
                        .transition()
                        .attr("y", function(d) { return y(d.y); })
                        .attr("height", function(d) { return height - y(d.y); });
                }

                function transitionStacked() {
                    console.log("drawing stacked");
                    y.domain([0, yStackMax]);

                    rect.transition()
                        .duration(500)
                        .delay(function(d, i) { return i * 10; })
                        .attr("y", function(d) { return y(d.y0 + d.y); })
                        .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
                        .transition()
                        .attr("x", function(d) { return x(d.x); })
                        .attr("width", x.rangeBand());
                }

                transitionStacked();
            },
            template: '<div></div>'
        };
    }]);



angular.module('manage.staffDirectory', ['oc.lazyLoad', 'ui.tinymce'])
    .constant('STAFF_DIR_RANKS', [
        "",
        "Prof.",
        "Assoc. Prof.",
        "Asst. Prof."
    ])
    .constant('STAFFDIR_GROUP', 8)

    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/manage-staff-directory', {
                controller: 'staffDirCtrl',
                templateUrl: 'staffDirectory/staffDirectory.tpl.html',
                resolve: {
                    userData: function(tokenReceiver){
                        return tokenReceiver.getPromise();
                    }
                }
            })
            .when('/manage-my-profile', {
                controller: 'staffDirProfileCtrl',
                templateUrl: 'staffDirectory/staffDirectoryProfile.tpl.html',
                resolve: {
                    userData: function(tokenReceiver){
                        return tokenReceiver.getPromise();
                    },
                    lazyLoad: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('https://cdn.tinymce.com/4/tinymce.min.js');
                    }]
                }
            });
    }])

    .controller('staffDirCtrl', ['$scope', 'sdFactory', 'STAFF_DIR_URL', 'userData', 'STAFFDIR_GROUP', 'AuthService',
    function staffDirCtrl($scope, sdFactory, appUrl, userData, STAFFDIR_GROUP, AuthService){
        $scope.userInfo = AuthService.isAuthorized();
        $scope.Directory = {};
        $scope.newPerson = {};
        $scope.newDept = {};

        $scope.tabs = [
            { name: 'Directory',
                number: 0,
                active: true
            },
            { name: 'Subjects',
                number: 1,
                active: false
            },
            { name: 'Departments/Locations',
                number: 2,
                active: false
            }
        ];
        $scope.subjectTypes = [
            {name: 'Specialist', value: 1},
            {name: 'Instructor', value: 2},
            {name: 'Both', value: 3}
        ];
        $scope.sortModes = [
            {by:'lastname', reverse:false},
            {by:'title', reverse:false},
            {by:'department', reverse:false}
        ];
        $scope.sortMode = $scope.sortModes[0];
        $scope.sortBy = function(by){
            if ($scope.sortMode === by)
                $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
            else
                $scope.sortMode = by;
        };

        $scope.hasAccess = false;
        if (angular.isDefined($scope.userInfo.group)) {
            if ((parseInt($scope.userInfo.group) & STAFFDIR_GROUP) === STAFFDIR_GROUP) {
                $scope.hasAccess = true;
            }
        }

        sdFactory.getData()
            .success(function(data) {
                console.dir(data);
                $scope.Directory = data;
                for (var i = 0; i < $scope.Directory.list.length; i++){
                    $scope.Directory.list[i].selSubj = $scope.Directory.subjects[0];
                    $scope.Directory.list[i].selType = $scope.subjectTypes[0];
                    for (var j = 0; j < $scope.Directory.departments.length; j++)
                        if ($scope.Directory.departments[j].depid == $scope.Directory.list[i].dept){
                            $scope.Directory.list[i].selDept = $scope.Directory.departments[j];
                            break;
                        }
                    for (var j = 0; j < $scope.Directory.divisions.length; j++)
                        if ($scope.Directory.divisions[j].divid == $scope.Directory.list[i].divis){
                            $scope.Directory.list[i].selDiv = $scope.Directory.divisions[j];
                            break;
                        }
                    $scope.Directory.list[i].class = "";
                    $scope.Directory.list[i].show = false;
                    $scope.Directory.list[i].image = appUrl + "staffImages/" + $scope.Directory.list[i].id + ".jpg";
                }
                $scope.newPerson.selSubj = $scope.Directory.subjects[0];
                for (var i = 0; i < $scope.Directory.subjects.length; i++)
                    $scope.Directory.subjects[i].show = false;
                $scope.newPerson.selDept = $scope.Directory.departments[0];
                for (var i = 0; i < $scope.Directory.departments.length; i++){
                    $scope.Directory.departments[i].show = false;
                    for (var j = 0; j < $scope.Directory.libraries.length; j++)
                        if ($scope.Directory.libraries[j].lid == $scope.Directory.departments[i].library){
                            $scope.Directory.departments[i].selLib = $scope.Directory.libraries[j];
                        }
                }
                $scope.newPerson.selDiv = $scope.Directory.divisions[0];
                for (var i = 0; i < $scope.Directory.libraries.length; i++)
                    $scope.Directory.libraries[i].show = false;
                for (var i = 0; i < $scope.Directory.divisions.length; i++)
                    $scope.Directory.divisions[i].show = false;
                $scope.newDept.selLib = $scope.Directory.libraries[0];

                $scope.sortBy(0);
            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });

    }])

    .controller('staffDirPeopleCtrl', ['$scope', 'sdFactory', 'STAFF_DIR_RANKS', 'STAFF_DIR_URL',
        function staffDirPeopleCtrl($scope, sdFactory, ranks, appUrl){
            $scope.lastNameFilter = '';
            $scope.firstNameFilter = '';
            $scope.titleFilter = '';
            $scope.deptFilter = '';
            $scope.ranks = ranks;

            $scope.newPerson.first = "";
            $scope.newPerson.last = "";
            $scope.newPerson.email = "";
            $scope.newPerson.title = "";
            $scope.newPerson.phone = "";
            $scope.newPerson.fax = "";
            $scope.newPerson.rank = ranks[0];
            $scope.formResponse = '';

            $scope.currentPage = 1;
            $scope.maxPageSize = 10;
            $scope.perPage = 20;

            $scope.togglePerson = function(person){
                $scope.Directory.list[$scope.Directory.list.indexOf(person)].show =
                    !$scope.Directory.list[$scope.Directory.list.indexOf(person)].show;
                $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjResponse = "";
            };

            $scope.deletePerson = function(person){
                if (confirm("Delete " + person.lastname + ", " + person.firstname  + " record permanently?") == true){
                    sdFactory.postData({action : 1}, person)
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
                sdFactory.postData({action : 2}, person)
                    .success(function(data, status, headers, config) {
                        $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjResponse = "Person has been updated!";
                    })
                    .error(function(data, status, headers, config) {
                        $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjResponse = "Error: Person update failed! " + data;
                    });
            };
            $scope.deleteSubject = function(person, subject, index){
                $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjects.splice(index, 1);
            };
            $scope.addSubject = function(person){
                var isPresent = false;
                for (var i = 0; i < person.subjects.length; i++)
                    if (person.subjects[i].sid === person.selSubj.sid){
                        isPresent = true;
                        $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjects[i].type = person.selType.value;
                        break;
                    }
                if (!isPresent){
                    var newSubj = {};
                    newSubj.sid = person.selSubj.sid;
                    newSubj.subject = person.selSubj.subject;
                    newSubj.link = person.selSubj.link;
                    newSubj.type = person.selType.value;
                    $scope.Directory.list[$scope.Directory.list.indexOf(person)].subjects.push(newSubj);
                }
            };

            $scope.isValidEmailAddress = function(emailAddress) {
                var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
                return pattern.test(emailAddress);
            };

            $scope.addPerson = function() {
                $scope.formResponse = '';
                if ( $scope.newPerson.first.length > 0 )
                {
                    if ( $scope.newPerson.last.length > 0 )
                    {
                        if ( $scope.isValidEmailAddress( $scope.newPerson.email) )
                        {
                            if ( $scope.newPerson.title.length > 0 )
                            {
                                if ( $scope.newPerson.phone.length >= 7 )
                                    sdFactory.postData({action : 3}, $scope.newPerson)
                                        .success(function(data, status, headers, config) {
                                            if ((typeof data === 'object') && (data !== null)){
                                                var createdUser = {};
                                                createdUser.id = data.id;
                                                createdUser.lastname = $scope.newPerson.last;
                                                createdUser.firstname = $scope.newPerson.first;
                                                createdUser.title = $scope.newPerson.title;
                                                createdUser.rank = $scope.newPerson.rank;
                                                createdUser.department = $scope.newPerson.selDept.name;
                                                createdUser.division = $scope.newPerson.selDiv.name;
                                                createdUser.phone = $scope.newPerson.phone;
                                                createdUser.email = $scope.newPerson.email;
                                                createdUser.fax = $scope.newPerson.fax;
                                                createdUser.subjects = [];
                                                createdUser.show = false;
                                                createdUser.selSubj = $scope.Directory.subjects[0];
                                                createdUser.selType = $scope.subjectTypes[0];
                                                for (var j = 0; j < $scope.Directory.departments.length; j++)
                                                    if ($scope.Directory.departments[j].depid == $scope.newPerson.selDept.depid){
                                                        createdUser.selDept = $scope.Directory.departments[j];
                                                        break;
                                                    }
                                                for (var j = 0; j < $scope.Directory.divisions.length; j++)
                                                    if ($scope.Directory.divisions[j].divid == $scope.newPerson.selDiv.divid){
                                                        createdUser.selDiv = $scope.Directory.divisions[j];
                                                        break;
                                                    }
                                                createdUser.class = "";
                                                createdUser.image = appUrl + "staffImages/" + createdUser.id + ".jpg";
                                                $scope.Directory.list.push(createdUser);
                                                $scope.formResponse = "Person has been added!";
                                            } else
                                                $scope.formResponse = "Error: Person could not be added! " + data;
                                        })
                                        .error(function(data, status, headers, config) {
                                            $scope.formResponse = "Error: Person Creation failed! " + data;
                                        });
                                else
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
    .directive('manageSdPeople', [ function() {
        return {
            restrict: 'AC',
            controller: 'staffDirPeopleCtrl',
            link: function(scope, elm, attrs){
            },
            templateUrl: 'staffDirectory/staffDirectoryPeople.tpl.html'
        };
    }])

    .controller('staffDirSubjectsCtrl', ['$scope', 'sdFactory',
        function staffDirSubjectsCtrl($scope, sdFactory){
            $scope.newSubj = {};
            $scope.newSubj.subject = "";
            $scope.newSubj.link = "";
            $scope.subResponse = '';

            $scope.expandSubject = function(subject){
                if (!$scope.Directory.subjects[$scope.Directory.subjects.indexOf(subject)].show)
                    $scope.Directory.subjects[$scope.Directory.subjects.indexOf(subject)].show = true;
            };

            $scope.editSubject = function(subject){
                sdFactory.postData({action : 6}, subject)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.Directory.subjects[$scope.Directory.subjects.indexOf(subject)].show = false;
                        } else {
                            $scope.subResponse = "Error: Can not save subject! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.subResponse = "Error: Could not save subject! " + data;
                    });
            };
            $scope.deleteSubject = function(subject){
                if (confirm("Delete "+ subject.subject + " subject?") == true){
                    sdFactory.postData({action : 7}, subject)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.Directory.subjects.splice($scope.Directory.subjects.indexOf(subject), 1);
                                $scope.subResponse = "Subject has been deleted!";
                            } else {
                                $scope.subResponse = "Error: Can not delete subject! " + data;
                            }
                        })
                        .error(function(data, status, headers, config) {
                            $scope.subResponse = "Error: Could not delete subject! " + data;
                        });
                }
            };
            $scope.addSubject = function(){
                sdFactory.postData({action : 8}, $scope.newSubj)
                    .success(function(data, status, headers, config) {
                        if (typeof data == 'object' && data != null){
                            var newSubject = {};
                            newSubject.sid = data.id;
                            newSubject.subject = $scope.newSubj.subject;
                            newSubject.link = $scope.newSubj.link;
                            newSubject.show = false;
                            $scope.Directory.subjects.push(newSubject);
                            $scope.subResponse = "Subject has been added!";
                        } else {
                            $scope.subResponse = "Error: Can not add subject! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.subResponse = "Error: Could not add subject! " + data;
                    });

            };

        }])
    .directive('manageSdSubjects', [ function() {
        return {
            restrict: 'AC',
            controller: 'staffDirSubjectsCtrl',
            link: function(scope, elm, attrs){
            },
            templateUrl: 'staffDirectory/staffDirectorySubjects.tpl.html'
        };
    }])

    .controller('staffDirDepartmentsCtrl', ['$scope', 'sdFactory',
        function staffDirDepartmentsCtrl($scope, sdFactory){
            $scope.newDept.name = "";
            $scope.newLoc = {};
            $scope.newLoc.name = "";
            $scope.newDiv = {};
            $scope.newDiv.name = "";
            $scope.depResponse = '';
            $scope.libResponse = '';
            $scope.divResponse = '';

            $scope.expandDepartment = function(dept){
                if (!$scope.Directory.departments[$scope.Directory.departments.indexOf(dept)].show)
                    $scope.Directory.departments[$scope.Directory.departments.indexOf(dept)].show = true;
            };
            $scope.expandLibrary = function(lib){
                if (!$scope.Directory.libraries[$scope.Directory.libraries.indexOf(lib)].show)
                    $scope.Directory.libraries[$scope.Directory.libraries.indexOf(lib)].show = true;
            };
            $scope.expandDivision = function(division){
                if (!$scope.Directory.divisions[$scope.Directory.divisions.indexOf(division)].show)
                    $scope.Directory.divisions[$scope.Directory.divisions.indexOf(division)].show = true;
            };

            $scope.editDepartment = function(dept){
                sdFactory.postData({action : 9}, dept)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.Directory.departments[$scope.Directory.departments.indexOf(dept)].show = false;
                        } else {
                            $scope.depResponse = "Error: Can not save department! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.depResponse = "Error: Could not save subject! " + data;
                    });
            };
            $scope.deleteDepartment = function(dept){
                if (confirm("Delete "+ dept.name + " department?") == true){
                    sdFactory.postData({action : 10}, dept)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.Directory.departments.splice($scope.Directory.departments.indexOf(dept), 1);
                                $scope.depResponse = "Department has been deleted!";
                            } else {
                                $scope.depResponse = "Error: Can not delete department! " + data;
                            }
                        })
                        .error(function(data, status, headers, config) {
                            $scope.depResponse = "Error: Could not delete department! " + data;
                        });
                }
            };
            $scope.addDepartment = function(){
                sdFactory.postData({action : 11}, $scope.newDept)
                    .success(function(data, status, headers, config) {
                        if (typeof data == 'object' && data != null){
                            var newDepartment = {};
                            newDepartment.depid = data.id;
                            newDepartment.name = $scope.newDept.name;
                            newDepartment.library = $scope.newDept.selLib.lid;
                            newDepartment.show = false;
                            $scope.Directory.departments.push(newDepartment);
                            $scope.depResponse = "Department has been added!";
                        } else {
                            $scope.depResponse = "Error: Can not add department! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.depResponse = "Error: Could not add department! " + data;
                    });

            };
            $scope.editLibrary = function(lib){
                sdFactory.postData({action : 12}, lib)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.Directory.libraries[$scope.Directory.libraries.indexOf(lib)].show = false;
                        } else {
                            $scope.libResponse = "Error: Can not update library! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.libResponse = "Error: Could not update library! " + data;
                    });
            };
            $scope.deleteLibrary = function(lib){
                if (confirm("Delete "+ lib.name + "?") == true){
                    sdFactory.postData({action : 13}, lib)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.Directory.libraries.splice($scope.Directory.libraries.indexOf(lib), 1);
                                $scope.libResponse = "Library has been deleted!";
                            } else {
                                $scope.libResponse = "Error: Can not delete library! " + data;
                            }
                        })
                        .error(function(data, status, headers, config) {
                            $scope.libResponse = "Error: Could not delete library! " + data;
                        });
                }
            };
            $scope.addLibrary = function(){
                sdFactory.postData({action : 14}, $scope.newLoc)
                    .success(function(data, status, headers, config) {
                        if (typeof data == 'object' && data != null){
                            var newLibrary = {};
                            newLibrary.lid = data.id;
                            newLibrary.name = $scope.newLoc.name;
                            newLibrary.show = false;
                            $scope.Directory.libraries.push(newLibrary);
                            $scope.libResponse = "Library has been added!";
                        } else {
                            $scope.libResponse = "Error: Can not add library! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.libResponse = "Error: Could not add library! " + data;
                    });

            };
            $scope.editDivision = function(division){
                sdFactory.postData({action : 15}, division)
                    .success(function(data, status, headers, config) {
                        if (data == 1){
                            $scope.Directory.divisions[$scope.Directory.divisions.indexOf(division)].show = false;
                        } else {
                            $scope.divResponse = "Error: Can not save division! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.divResponse = "Error: Could not save division! " + data;
                    });
            };
            $scope.deleteDivision = function(division){
                if (confirm("Delete "+ division.name + " division?") == true){
                    sdFactory.postData({action : 16}, division)
                        .success(function(data, status, headers, config) {
                            if (data == 1){
                                $scope.Directory.divisions.splice($scope.Directory.divisions.indexOf(division), 1);
                                $scope.divResponse = "Division has been deleted!";
                            } else {
                                $scope.divResponse = "Error: Can not delete division! " + data;
                            }
                        })
                        .error(function(data, status, headers, config) {
                            $scope.divResponse = "Error: Could not delete division! " + data;
                        });
                }
            };
            $scope.addDivision = function(){
                sdFactory.postData({action : 17}, $scope.newDiv)
                    .success(function(data, status, headers, config) {
                        if (typeof data == 'object' && data != null){
                            var newDivision = {};
                            newDivision.divid = data.id;
                            newDivision.name = $scope.newDiv.name;
                            newDivision.show = false;
                            $scope.Directory.divisions.push(newDivision);
                            $scope.divResponse = "Division has been added!";
                        } else {
                            $scope.divResponse = "Error: Can not add division! " + data;
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.divResponse = "Error: Could not add division! " + data;
                    });

            };

        }])
    .directive('manageSdDepartments', [ function() {
        return {
            restrict: 'AC',
            controller: 'staffDirDepartmentsCtrl',
            link: function(scope, elm, attrs){
            },
            templateUrl: 'staffDirectory/staffDirectoryDepartments.tpl.html'
        };
    }])

    .controller('staffDirProfileCtrl', ['$scope', 'sdFactory', 'userData', 'lazyLoad', 'AuthService',
    function staffDirProfileCtrl($scope, sdFactory, userData, lazyLoad, AuthService){
        $scope.userInfo = AuthService.isAuthorized();
        $scope.userProfile = {};
        $scope.tinymceOptions = {
            onChange: function(e) {
                // put logic here for keypress and cut/paste changes
            },
            inline: false,
            plugins : 'link image lists spellchecker code print preview',
            skin: 'lightgray',
            theme : 'modern'
        };

        if (angular.isDefined($scope.userInfo.login)) {
            sdFactory.getProfile($scope.userInfo.login)
                .success(function (data) {
                    $scope.userProfile = data;
                    console.dir(data);
                })
                .error(function (data, status, headers, config) {
                    console.log(data);
                });
        }

        $scope.update = function(){
            $scope.userProfile.person.login = $scope.userInfo.login;
            $scope.userProfile.person.formResponse = "";
            sdFactory.postData({action : 18}, $scope.userProfile.person)
                .success(function(data, status, headers, config) {
                    $scope.userProfile.person.formResponse = data;
                })
                .error(function(data, status, headers, config) {
                    $scope.userProfile.person.formResponse = "Error: Could not update profile! " + data;
                });
        };
    }]);

angular.module('manage.submittedForms', ['ngFileUpload'])
    .constant('FORMS_GROUP', 128)

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/manage-forms', {
            controller: 'manageSubFormsCtrl',
            templateUrl: 'submittedForms/submittedForms.tpl.html',
            resolve: {
                userData: function(tokenReceiver){
                    return tokenReceiver.getPromise();
                }
            }
        });
    }])
    .controller('manageSubFormsCtrl', ['$scope', '$timeout', 'formFactory', 'userData', 'FORMS_GROUP', 'AuthService',
    function manageSubFormsCtrl($scope, $timeout, formFactory, userData, FORMS_GROUP, AuthService){
        $scope.userInfo = AuthService.isAuthorized();
        $scope.data = {};
        $scope.currentPage = 1;
        $scope.maxPageSize = 10;
        $scope.perPage = 20;
        $scope.titleFilter = '';
        $scope.sortModes = [
            {by:'title', reverse:false},
            {by:'status', reverse:false},
            {by:'created', reverse:true}
        ];
        $scope.sortMode = 2;
        $scope.sortButton = $scope.sortMode;
        $scope.mOver = 0;

        $scope.hasAccess = false;
        if (angular.isDefined($scope.userInfo.group)) {
            if ((parseInt($scope.userInfo.group) & FORMS_GROUP) === FORMS_GROUP) {
                $scope.hasAccess = true;
            }
        }

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

        $scope.toggleForms = function(form){
            $scope.data.forms[$scope.data.forms.indexOf(form)].show =
                !$scope.data.forms[$scope.data.forms.indexOf(form)].show;
        };
        $scope.sortBy = function(by){
            if ($scope.sortMode === by)
                $scope.sortModes[by].reverse = !$scope.sortModes[by].reverse;
            else
                $scope.sortMode = by;
        };
    }])

    .controller('customFormCtrl', ['$scope', '$timeout', 'formFactory', 'Upload', 'FORMS_URL',
    function customFormCtrl($scope, $timeout, formFactory, Upload, API){
        $scope.mailToLib = 0;
        $scope.form = {};
        $scope.form.attachment = [];
        $scope.form.selectedFiles = [];
        $scope.uploading = false;

        $scope.generateThumb = function(files) {
            if (files.length > 0 && files !== null) {
                for (var i = 0; i < files.length; i++){
                    $scope.form.selectedFiles.push(files[i]);
                    if ($scope.fileReaderSupported) {
                        $timeout(function() {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(files[i]);
                            fileReader.onload = function(e) {
                                $timeout(function() {
                                    files[i].dataUrl = e.target.result;
                                });
                            }
                        });
                    }
                }
            }
        };

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
            if ($scope.form.selectedFiles.length < 1) {
                console.log("No attachment.");
                formFactory.submitForm(form)
                    .success(function (data) {
                        $scope.formResponse = data;
                        console.log(data);
                    })
                    .error(function (data, status, headers, config) {
                        $scope.formResponse = "Error! " + data;
                        console.log(data);
                    });
            } else {
                console.log("File attached.");
                $scope.uploading = true;
                var names = [];
                for (var i = 0; i < $scope.form.selectedFiles.length; i++)
                    names.push($scope.form.selectedFiles[i].name);
                $scope.form.selectedFiles.upload = Upload.upload({
                    url: API + 'api/process/upload',
                    method: 'POST',
                    fields: {
                        form: form
                    },
                    file: $scope.form.selectedFiles,
                    fileFormDataName: names
                });
                $scope.form.selectedFiles.upload.then(function(response) {
                    $timeout(function() {
                        $scope.formResponse = response.data;
                        $scope.uploading = false;
                    });
                }, function(response) {
                    $scope.formResponse = "Error: " + response.data;
                    console.dir(response.data);
                    $scope.uploading = false;
                });
                $scope.form.selectedFiles.upload.progress(function(evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    $scope.form.selectedFiles.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
        };
    }]);