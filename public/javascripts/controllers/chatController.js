app.controller('chatController', ['$scope', 'userFactory', 'chatFactory', ($scope, userFactory, chatFactory) => {
    /**
     * initialization
     */
    function init() {
        userFactory.getUser().then(user => {
            $scope.user = user;
        });
    }

    init();

    /**
     * Scope's variables.
     */
    $scope.onlineList   = [];
    $scope.roomList     = [];
    $scope.activeTab    = 1;
    $scope.chatClicked  = false;
    $scope.chatName     = "";
    $scope.roomId       = "";
    $scope.message      = "";
    $scope.messages     = [];
    $scope.user         = {};

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
        $scope.roomId = room.id;
        $scope.chatName = room.name;

        chatFactory.getMessages($scope.roomId).then(data => {
            $scope.messages[$scope.roomId] = data;
        });
        // $scope.$apply();
    };

    $scope.newMessage = () => {
        socket.emit('newMessage', {
            roomId: $scope.roomId,
            message: $scope.message,
        });
        $scope.message = '';
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