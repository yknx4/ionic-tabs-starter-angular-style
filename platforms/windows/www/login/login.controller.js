(function () {
    'use strict';
    angular.module('starter.login')
        .controller('LoginCtrl', LoginCtrl)
        .controller('LoginModalCtrl', function ($scope, UsersApi) {

            this.cancel = $scope.$dismiss;

            this.submit = function (email, password) {
                UsersApi.login(email, password).then(function (user) {
                    $scope.$close(user);
                });
            };

        });

    LoginCtrl.$inject = ['$scope', 'LoginService', '$ionicPopup', '$state', '$rootScope', 'Login', '$localStorage'];

    function LoginCtrl($scope, LoginService, $ionicPopup, $state, $rootScope, Login, $localStorage) {
        $scope.data = {};
        if ($localStorage.token) {
            
            var go = function(){
                $state.go('tab.chats');
            };
            $rootScope.token = $localStorage.token;
            $rootScope.currentUser = Login.get({token:$rootScope.token},go);
            console.log($rootScope);
            
        }


        $scope.validateLogin = function () {};

        $scope.login = function () {
            $scope.pending = true;
            var okay = function (data) {
                
                $rootScope.token = data.token;
                $rootScope.currentUser = Login.get({token:data.token});
                $localStorage.token = $rootScope.token;
                $scope.pending = false;
                $state.go('tab.chats');
                //$localStorage.currentUser = JSON.stringify($rootScope.currentUser);
            };
            var error = function (data) {
                var template = 'Please check your credentials!';
                if(data.message) template = data.message;
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: template
                });
                $scope.pending = false;
            };
            
            new Login($scope.data).$save({},okay,error);




        }


        //        $scope.login = function () {
        //            LoginService.loginUser($scope.data.user, $scope.data.password).success(function (data) {
        //                $state.go('tab.chats');
        //                $rootScope.currentUser = {};
        //                $rootScope.token = {};
        //            }).error(function (data) {
        //                var alertPopup = $ionicPopup.alert({
        //                    title: 'Login failed!',
        //                    template: 'Please check your credentials!'
        //                });
        //            });
        //        }
    }
})();