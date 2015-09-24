(function () {
    'use strict';

    angular.module('starter.dash')
        .controller('DashCtrl', DashCtrl)

    function DashCtrl(AttendanceList, $localStorage, $scope, Clubs, Student, Students, $ionicPopup,Users) {
        /*********VARIABLES*********/
        var clubid = $localStorage.selectedClub;
        var club = Clubs.get({
            id: clubid
        });
        var partial = parseInt($localStorage.selectedPartial);
        /**************************/


        /*********SCOPE VARIABLES*********/
        $scope.club = club;
        $scope.groups = AttendanceList.query({
            club: clubid,
            partial: partial
        });
        $scope.students = Students.query();
        $scope.nstudent = new Student();
        $scope.student = new Student();
        /*********************************/


        /*********SCOPE FUNCTIONS*********/
        $scope.validateForm = function () {};


        $scope.getUser = function (userid) {
            var name = 'name';

            if($localStorage[name+userid]){
                return $localStorage[name+userid];
            }
            function getNew(data){
                $localStorage[name+userid] = data;
            };
            return Users.get({id:userid},getNew).data;
            
        }
        $scope.getUserName = function (userid) {
            //console.log("called get user name: " + userid);
            if(userid){
                return $scope.getUser(userid).name;
            }
            return "";
        };

        $scope.setFormScope = function (form) {
            $scope.userForm = form;
        };

        $scope.addStudent = function () {
            var student = angular.copy($scope.student);
            var confirmPopup = $ionicPopup.confirm({
                title: 'Adding ' + student.name,
                template: 'Are you sure you want to add ' + student.name + '?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    var stp = new Students(student);
                    console.log(stp);

                    stp.$save({}, function () {
                        $scope.students = Students.query();
                        $scope.lmessage = stp.name + " has been registered.";
                        $scope.student = {};
                        $scope.student = angular.copy($scope.nstudent);
                        $scope.student.school = stp.school;
                        $scope.userForm.userForm.$setPristine();
                        console.log($scope.student);
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    })
                } else {
                    console.log('You are not sure');
                    //                    console.log($scope.userForm.userForm.account);
                    //                    $scope.userForm.userForm.account.$setViewValue("");
                }
            });
        };

        $scope.refreshClubList = function () {
            clubid = $localStorage.selectedClub;
            club = Clubs.get({
                id: clubid
            });
            console.log(club);
            partial = parseInt($localStorage.selectedPartial);
            $scope.club = club;
            $scope.groups = AttendanceList.query({
                club: clubid,
                partial: partial
            });
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply()
        };

        $scope.toggleGroup = function (group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };

        $scope.isGroupShown = function (group) {
            return $scope.shownGroup === group;
        };

        /*********************************/
    }

})();