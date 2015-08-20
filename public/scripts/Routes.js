app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/home/index.html',
        controller: 'HomeController'
    }).otherwise({
        redirectTo: '/'
    });
});