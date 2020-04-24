app.controller('chatController', ['$scope', ($scope) => {
    /**
     * Scope's variables.
     */
    $scope.onlineList   = [];
    $scope.roomList     = [];
    $scope.activeTab    = 1;
    $scope.chatClicked  = false;
    $scope.chatName     = "";

    /**
     * Scope's actions.
     */
    $scope.changeTab = tab => {
        $scope.activeTab = tab;
    };

    $scope.newRoom = () => {
        //let randomName = Math.random().toString(36).substring(7);
        let roomName = window.prompt("Enter room name").trim();
        if (roomName !== '' && roomName !== null) {
            socket.emit('newRoom', roomName);
        }
    };

    $scope.switchRoom = room => {
        $scope.chatClicked = true;
        $scope.chatName = room.name;
        // $scope.$apply();
    };

    /**
     * Socket's actions.
     */
    const socket = io.connect("http://localhost:3000");

    socket.on('onlineList', users => {
        $scope.onlineList = users;
        $scope.$apply();
    });

    socket.on('roomList', rooms => {
        $scope.roomList = rooms;
        $scope.$apply();
    });
}]);