app.controller('AuthController', function ($scope, $http) {
    $scope.save = function(user) {
        $http({ method: 'POST', url: '/signup', data: user })
            .success( function (data) {
            console.log(data);
        });
    };
});