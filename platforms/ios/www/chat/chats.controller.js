(function () {
    'use strict';
    angular.module('starter.chat')
        .controller('ChatsCtrl', ChatsCtrl);

    ChatsCtrl.$inject = ['$scope', 'Chats', 'Students', '$ionicPopup'];

    function ChatsCtrl($scope, Chats, Students, $ionicPopup) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.chats = Chats.all();
        $scope.students = Students.query();
        $scope.edit = function (student) {
            alert('Edit ' + JSON.stringify(student));
        };
        $scope.delete = function (student) {
            alert('Delete ' + JSON.stringify(student));
        };
        $scope.record = function (student) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Did '+student.name+' attended?',
                template: 'Are you sure you want to add attendance?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    alert('You are sure');
                } else {
                    console.log('You are not sure');
                }
            });
        }
        $scope.remove = function (chat) {
            Chats.remove(chat);
        };
    }
})();