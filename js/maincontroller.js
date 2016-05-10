var coffeeApp = angular.module('coffeeApp', ['ngRoute', 'ngCookies', 'ngAnimate', 'ngTouch', 'ui.bootstrap']);
var apiUrl = 'http://localhost:3020/';

coffeeApp.controller('MainController', function($scope, $http, $location, $cookies) {

    // STRIPE Secret Key: sk_test_qftJXSV8HrggGGriTCdcpTdb
    // STRIPE Publishable Key: pk_test_GZ31rO5xxGkl8AMnZglI9DHI

    $scope.loginForm = function() {
        $http.post(apiUrl + 'login', {
            username: $scope.username,
            password: $scope.password
        }).then(function successCallback(response) {
            console.log(response.data);
            if (response.data.success == 'found') {
                $cookies.put('token', response.data.token);
                $cookies.put('username', $scope.username);

                $location.path('/options');
            } else if (response.data.failure == 'noUser') {
                $scope.errorMessage = 'No such user in the database.';
            } else if (response.data.failure == 'badPassword') {
                $scope.errorMessage = 'Bad password for this user.'

            }
        }, function errorCallback(response) {
            console.log(response.status);
        });
    }

    $scope.registerForm = function(form) {

        $http.post(apiUrl + 'register', {
            username: $scope.username,
            password: $scope.password,
            password2: $scope.password2,
            email: $scope.email
        }).then(function successCallback(response) {

            if (response.data.failure == 'passwordMatch') {
                $scope.errorMessage = "Your passwords do not match!";
            } else if (response.data.success == 'added') {
                $cookies.put('token', response.data.token);
                $cookies.put('username', $scope.username);
                $location.path('/options');
            }
        }, function errorCallback(response) {
            console.log(response.status);
        });
    }


    $scope.getStates = function() {
        var _states = []; // reset

        $http.get('http://openstates.org/api/v1/metadata/?apikey=506273161a02457ca2c53d5d916be5fd', {

        }).then(function successCallback(response) {
            //console.log(response);
            for (var i = 0; i < response.data.length; i++) {
                _states.push({
                    abbr: response.data[i].abbreviation,
                    name: response.data[i].name
                })
            }
            $scope.states = _states;
            return _states;
        }, function errorCallback(response) {
            console.log(response.status);
            return -1;
        });
    }

    $scope.grindTypes = ['Extra-Course', 'Course', 'Medium-Course', 'Medium', 'Medium-Fine', 'Fine', 'Extra-Fine'];


    // DATE PICKER [ BOOTSTRAP / ANGUALAR VERSION ] =================
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function() {
        $scope.dt = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.toggleMin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [{
        date: tomorrow,
        status: 'full'
    }, {
        date: afterTomorrow,
        status: 'partially'
    }];

    function getDayClass(data) {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }

});


coffeeApp.config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/', {
        templateUrl: "views/main.html",
        controller: 'MainController'
    }).when('/register', {
        templateUrl: "views/register.html",
        controller: 'MainController'
    }).when('/options', {
        templateUrl: "views/options.html",
        controller: 'MainController'
    }).when('/login', {
        templateUrl: "views/login.html",
        controller: 'MainController'
    }).when('/delivery', {
        templateUrl: "views/delivery.html",
        controller: "MainController"
    }).when('/payment', {
        templateUrl: "views/payment.html",
        controller: "MainController"
    }).otherwise('/', {
        templateUrl: "views/main.html",
        controller: "MainController"
    })
}]);
