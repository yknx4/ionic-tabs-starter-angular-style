(function () {
    'use strict';

    angular
        .module('starter.login')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates(), '/login');
    }

    function getStates() {
        return [
            {
                state: 'login',
                config: {
                    url: '/login',
                    controller: 'LoginCtrl',
                    //template: '<ion-view><ion-content><h1>Gesundheit</h1><ui-view/></ion-content></ion-view>'								
                    templateUrl: 'login/login.html',
                    data: {
                        requireLogin: false
                    }
                    //template: '<ui-view/>'
                }
            }
        ];
    }
})();