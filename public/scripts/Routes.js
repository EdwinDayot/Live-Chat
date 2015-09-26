app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/home/index.html',
        controller: 'HomeController'
    }).when('/signup', {
        templateUrl: 'views/auth/signup.html',
        controller: 'AuthController'
    }).when('/login', {
        templateUrl: 'views/auth/login.html',
        controller: 'AuthController'
    }).otherwise({
        redirectTo: '/'
    });
});