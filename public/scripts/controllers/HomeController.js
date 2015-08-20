app.controller('HomeController', function ($scope) {
    var socket = io();

    $scope.message = '';

    $scope.sendMessage = function () {
        socket.emit('message', $scope.message);
        $scope.message = '';
    };

});