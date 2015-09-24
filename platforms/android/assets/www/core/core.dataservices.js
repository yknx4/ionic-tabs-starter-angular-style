(function () {

    'use strict';

    angular.module('starter.core')
        //        .constant('ApiUrl', 'http://127.0.0.1:8080')
        .filter('AttendanceStudent', FilterAttendancesByStudent)
        .constant('ApiUrl', 'http://attendance-yknx4.rhcloud.com')
        .factory('MasterToken',GetToken)
        .factory('Students', Students)
        .constant('Student', StudentModel)
        .factory('Attendances', Attendances)
        .factory('Chats', Chats)
        .factory('Clubs', Club)
        .factory('Login', Login)
        .factory('Users',Users)
        .factory('AttendanceList', AttendanceList)
        .constant('Attendance', AttendanceModel)
        .constant('CheckAccount', CheckAccount)
        .service('LoginService', LoginService)
        .service('loginModal', LoginModal)
        .directive('usernameAvailable', UserNameAvailable);

    function GetToken($localStorage){
        return $localStorage.token;
    }
    function CheckAccount(account, students) {
        console.log(students);
        console.log("Checking " + account);
        for (var i = 0; i < students.length; i++) {
            if (students[i].account == parseInt(account)) {
                return false;
            }
        }
        return true;
    };

    function UserNameAvailable($timeout, $q, $http, CheckAccount) {
        return {
            restrict: 'AE',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$asyncValidators.usernameExists = function (modelValue, viewValue) {
                    console.log(viewValue);
                    if (!viewValue) {
                        return $q.when(true);
                    }
                    var deferred = $q.defer();
                    $timeout(function () {
                        // Faking actual server-side validity check with $http.
                        // Let's pretend our service is so popular all short username are already taken
                        if (!CheckAccount(viewValue, scope.$parent.students)) {
                            deferred.reject();
                        }

                        deferred.resolve();
                    }, 1);
                    return deferred.promise;
                };





                //                    function (modelValue, viewValue) {
                //                    //here you should access the backend, to check if username exists
                //                    //and return a promise
                ////                    console.log(model.$viewValue);
                ////                    console.log(scope);
                //                    var vl = viewValue;
                //                    var res = scope.$parent.students;
                //                    console.log(res);
                //
                //                    var defer = $q.defer();
                //                    $timeout(function () {
                //                        var valid = true;
                //                        for (var i = 0; i < res.length; i++) {
                //                            if (res[i].account == parseInt(vl)) {
                //                                valid = false;
                //                            }
                //                            if (!valid) break;
                //                        }
                //                        model.$setValidity('usernameExists', valid);
                //                        defer.resolve;
                //                    }, 1);
                //
                //
                //                    return defer.promise;
                //
                //
                //
                //
                //
                //
                //                };
            }
        }
    }


    function LoginService($q,Login) {
        return {
            loginUser: function (name, pw) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                if (name == 'user' && pw == 'secret') {
                    deferred.resolve('Welcome ' + name + '!');
                } else {
                    deferred.reject('Wrong credentials.');
                }
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            }
        }
    };

    function AttendanceModel() {

        /*{"student_id":"55ff8cc1a3f821a814e49a5e","club_id":"55ff10beac872d2442b57068","user_id":"55ff0f56ac872d2442b57064","partial":1,"date":1442856637779,"_id":"56005d1eced51e1a53dddc21"}*/
        this.student_id = '';
        this.club_id = '';
        this.user_id = '';
        this.partial = '';
        this.date = Date.now();

    }

    function StudentModel() {
        /*"_id": "55ff8cc1a3f821a814e49a99",
    "name": "Abril Sarahi Lopez Perez",
    "account": 20144228,
    "school": "Bachillerato 4",
    "email": 0,
    "modified": 1442809700444,
    "created": 1442809700444,*/
        this.name = '';
        this.account = 0;
        this.school = '';
        this.email = '';
        this.created = Date.now();
        this.modified = Date.now();

    }

    function AttendanceList($resource, ApiUrl) {

        return $resource(ApiUrl + '/list', {}, {
            query: {
                method: 'GET',
                params: {
                    club: '',
                    partial: 0,
                    get_all: true
                },
                isArray: true
            }
        })
    };

    function Users($resource, ApiUrl) {

        return $resource(ApiUrl + '/user/:id', {}, {
            query: {
                method: 'GET',
                params: {
                    sort: 'name'
                },
                isArray: true
            }
        })
    };
    function Club($resource, ApiUrl, MasterToken) {
        console.log("club");
        return $resource(ApiUrl + '/club/:id', {}, {
            query: {
                method: 'GET',
                params: {
                    sort: 'name'
                },
                isArray: true
            },
            delete: {
                method: 'DELETE',
                params: {
                    token: MasterToken
                }
            }
        });
    }

    function LoginModal($modal, $rootScope) {

        function assignCurrentUser(user) {
            $rootScope.currentUser = user;
            return user;
        }

        return function () {
            var instance = $modal.open({
                templateUrl: 'views/loginModalTemplate.html',
                controller: 'LoginModalCtrl',
                controllerAs: 'LoginModalCtrl'
            })

            return instance.result.then(assignCurrentUser);
        };

    };

    function FilterAttendancesByStudent() {
        return function (items, student, clubid, partial) {
            var filtered = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.student_id == student._id && item.club_id == clubid && item.partial == partial) {
                    filtered.push(item);
                }
            }
            return filtered;
        };
    }

    function Students($resource, ApiUrl, MasterToken) {
        return $resource(ApiUrl + '/student/:id', {}, {
            query: {
                method: 'GET',
                params: {
                    sort: 'name'
                },
                isArray: true
            },
            delete: {
                method: 'DELETE',
                params: {
                    token: MasterToken
                }
            }
        });
    };
    function Login($resource, ApiUrl) {
        return $resource(ApiUrl + '/login', {}, {
            get: {
                method: 'GET',
                params: {
                    token: ''
                }
            },
            save: {
                method: 'POST',
                params: {
                    user: '',
                    password:''
                }
            }
        });
    }

    function Attendances($resource, ApiUrl, MasterToken) {
        return $resource(ApiUrl + '/attendance/:id', {}, {
            query: {
                method: 'GET',
                params: {
                    sort: 'date'
                },
                isArray: true
            },
            delete: {
                method: 'DELETE',
                params: {
                    token: MasterToken
                }
            },
            save: {
                method: 'POST',
                params: {
                    token: MasterToken
                }
            }

        });
    }

    function Chats() {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var chats = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
        }, {
            id: 1,
            name: 'Max Lynx',
            lastText: 'Hey, it\'s me',
            face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
        }, {
            id: 2,
            name: 'Adam Bradleyson',
            lastText: 'I should buy a boat',
            face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
        }, {
            id: 3,
            name: 'Perry Governor',
            lastText: 'Look at my mukluks!',
            face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
        }, {
            id: 4,
            name: 'Mike Harrington',
            lastText: 'This is wicked good ice cream.',
            face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
        }];

        var service = {
            all: allChats,
            remove: removeChat,
            get: getChat
        };

        return service;

        //////////////////

        function allChats() {
            return chats;
        }

        function removeChat(chat) {
            chats.splice(chats.indexOf(chat), 1);
        }

        function getChat(chatId) {
            for (var i = 0; i < chats.length; i++) {
                if (chats[i].id === parseInt(chatId)) {
                    return chats[i];
                }
            }
            return null;
        }

    }

})();
