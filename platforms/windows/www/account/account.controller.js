(function () {
    'use strict';
    angular.module('starter.account')
        .controller('AccountCtrl', AccountCtrl)
        .filter('externalLinks', function () {
            return function (text) {
                return String(text).replace(/href=/gm, "class=\"ex-link\" href=");
            }
        });

    AccountCtrl.$inject = ['$scope', '$rootScope', '$localStorage'];

    function AccountCtrl($scope, $rootScope, $localStorage) {



        $scope.user = $rootScope.currentUser.data;
        console.log($scope.user);
        $scope.settings = {
            enableFriends: true
        };
        $scope.listLink = 'http://attendance-yknx4.rhcloud.com/list?club=' + $localStorage.selectedClub + '&partial=' + $localStorage.selectedPartial + '&excel=true';
        $scope.openOutside = function (externalLinkToOpen) {
            
                window.open(externalLinkToOpen, '_system');
                return false;
            
        }
    }
})();