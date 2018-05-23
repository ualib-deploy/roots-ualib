angular.module('ualib', [
    'ngRoute',
    'ngAnimate',
    'ualib.templates',
    'ualib.ui',
    /* @if NODE_ENV!='local' */
    'manage',
    /* @endif */
    'ualib.hours',
    'oneSearch',
    'ualib.imageCarousel',
    'ualib.databases',
    'musicSearch',
    'ualib.staffdir',
    'ualib.softwareList',
    'ualib.news',
    'ualib.alerts'
])
// Default offset for ui-scrollfix elements.
    .value('duScrollOffset', 100)

    .config(['$httpProvider', '$routeProvider', '$compileProvider', function($httpProvider, $routeProvider, $compileProvider) {

        //HTML tags are stripped after JSON data in all AJAX responses
        function stripHTMLFromJSON(data) {
            if (typeof data === 'string'){
                data = data.trim();
                if (data[0] === '{' || data[0] === '[' || data[0] === ')'){
                    console.log("Stripping HTML data from JSON in AJAX response...");
                    data = angular.fromJson(data.replace(/<\/?[^>]+(>|$)/g, ""));
                }
            }
            return data;
        }
        $httpProvider.defaults.transformResponse.push(function(responseData){
            return stripHTMLFromJSON(responseData);
        });

        /**
         * Register Bento Box display route with ngRoute's $routeProvider
         */
        $routeProvider
            .when('/home', {
                templateUrl: '_ualib-home.tpl.html',
                controller: ['$scope' ,'$rootScope', function($scope, $rootScope){
                    //$rootScope.appClass = 'front-page';
                    var testVar = 1;
                    var bgNum = (Math.floor(Math.random() * 1000) % 16) + testVar;
                    $rootScope.appStyle = {"background-image": "url('wp-content/themes/roots-ualib/assets/img/quad-sunset-lg_" + bgNum + ".jpg')"};
                }]
            })
            .when('/databases', {redirectTo: function(){
                window.location = 'http://guides.lib.ua.edu/az.php';
            }})
            .otherwise({redirectTo:'/home'});

        // Extend $compileProvider to allow mailto/file/ftp in ng-href - without this, links render as "unsafe:mailto:..."
        // This is only requires for Angular 1.2.28 - after upgrade, remove this
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|file|blob|tel):/);
    }])

    .run(['$routeParams', '$location', '$rootScope',
        function($routeParams, $location, $rootScope){
            $rootScope.appClass = 'page-loaded';
            $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {

                // Check if changing from another angular route, and if the previous route is different.
                // We should only force page views in GA when navigating from one app to another.
                // Otherwise the page view will have already be sent to GA via the WP base.php template
                // TODO: make this better - seems a bit long winded ya?
                if (pre && pre.hasOwnProperty('$$route') && pre.$$route.hasOwnProperty('originalPath') && current.hasOwnProperty('$$route') && current.$$route.hasOwnProperty('originalPath') && current.$$route.originalPath !== pre.$$route.originalPath){
                    // Send Google Analytics page view when routes are accessed
                    ga('require', 'linkid');
                    var hash = document.location.hash; //Get hash of URL if present -- for instance, /#/databases
                    if (hash !== ''){
                        console.log("Hash is present.");
                        //Test for presence of bento in URL
                        // If the bento is present, we send the pageview in the format needed to be tracked in GA Site Search
                        var isBentoResult = hash.search('/bento/');
                        if (isBentoResult === -1){
                            console.log("Bento not found.");
                            ga('send', 'pageview', $location.url());
                        }
                        else{
                            console.log("Bento found!");

                            //For lib.ua.edu/#/databases, this returns databases as a string
                            queryTerm = decodeURIComponent(hash.split('/').pop());

                            //This format is necessary for the pageview to be counted in the site search portion of GA
                            ga('send', 'pageview', 'bento?q=' + queryTerm);
                        }
                    }
                    else{
                        console.log("Hash not found.");
                        ga('send', 'pageview', $location.url());
                    }
                }

                var appRoute = $location.path().split('/')[1];
                $rootScope.appStyle = {};
                $rootScope.appClass = 'webapp ' + appRoute + '-webapp';

                //TODO: Temporary!! Remove when either removing or pushing new home/webapp CSS animations
                angular.element(document.querySelector('body')).addClass('webapp');

                //if ($rootScope.appClass === 'home') {
                //    $rootScope.appClass = 'front-page';
                //    var bgNum = (Math.floor(Math.random() * 1000) % 16) + 1;
                //    $rootScope.appStyle = {"background-image": "url('wp-content/themes/roots-ualib/assets/img/quad-sunset-lg_" + bgNum + ".jpg')"};
                //    //console.log('Background 1.');
                //}
                //$rootScope.appClass += ' webapp';
            });

        }])

        .directive('skipLink', [ function() {
            return {
                restrict: 'AC',
                link: function(scope, elm, attrs){
                    elm.on('click', function(){
                        document.getElementById('#mainContent').focus();
                    });
                }
            };
        }]);
