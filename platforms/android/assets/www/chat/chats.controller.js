(function () {
    'use strict';
    angular.module('starter.chat')
        .controller('ChatsCtrl', ChatsCtrl);

    ChatsCtrl.$inject = ['$scope', 'Chats', 'Students', 'Attendances', '$ionicPopup', '$filter', 'Clubs', '$localStorage', 'Attendance','$rootScope'];

    function ChatsCtrl($scope, Chats, Students, Attendances, $ionicPopup, $filter, Clubs, $localStorage, Attendance,$rootScope) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});
        
        $localStorage.clubPartials = {};
        if (!($localStorage.lastPartial)) {
            $localStorage.lastPartial = {}
        }
        if(!$localStorage.selectedPartial){
            $localStorage.selectedPartial = 1;
        }
        $scope.selectedPartial = $localStorage.selectedPartial;
        $scope.chats = Chats.all();
        $scope.students = Students.query();
        $scope.attendances = Attendances.query();
        $scope.partials = [];
        $scope.clubs = Clubs.query({}, function () {
            $scope.clubs.forEach(function (club) {
                console.log("Partials: " + club.partials);
                $localStorage.clubPartials[club._id] = club.partials;
            });

            if ($localStorage.selectedClub)
                $scope.selectedClub = $localStorage.selectedClub;
            else
                $scope.selectedClub = $scope.clubs[0]._id;
            $scope.fillPartials();
        });

        $scope.selectClub = function (clubid) {
            $localStorage.selectedClub = clubid;
            //delete $scope.selectedPartial;
            //console.log(clubid +' = ' +$scope.selectedClub);
            $scope.fillPartials();
        };

        $scope.selectPartial = function (inp) {
            console.log(inp);
            //$localStorage['lp' + $localStorage.selectedClub] = $scope.selectedPartial;
            $localStorage.selectedPartial = inp;
            $scope.selectedPartial = inp;
            console.log("sp" + $scope.selectedPartial);
        };

        $scope.fillPartials = function () {
            var clubid = $localStorage.selectedClub;
            var partials = $localStorage.clubPartials[clubid];
            console.log("refilling partials: " + clubid + " " + partials + " " + (typeof partials));
            var partialsa = new Array();
            for (var i = 1; i <= partials; i++) {
                //console.log("psps"+i);
                partialsa[i - 1] = i;
            }
            $scope.partials = partialsa;
            console.log(partialsa);
            //            if ($localStorage['lp' + clubid])
            //                $scope.selectedPartial = $localStorage['lp' + clubid];
            //            else
            //                $scope.selectedPartial = partialsa[0];
        }

        console.log($scope.attendances);
        console.log(Attendances);
        $scope.edit = function (student) {
            alert('Edit ' + JSON.stringify(student));
        };

        $scope.refresh = function () {
            $scope.students = Students.query({}, function () {

            });

        };

        $scope.getAttendancesByStudent = function (student) {
            //console.log('Called with '+student);
            var data = $filter('AttendanceStudent')($scope.attendances, student, $localStorage.selectedClub, $localStorage.selectedPartial);
            //console.log(data);
            return data.length;
        };

        $scope.delete = function (student) {
            var user = Students.get({
                id: student._id
            }, function () {
                //                user.$save();
                console.log('Delete ' + JSON.stringify(user));
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Deleting ' + user.name,
                    template: 'Are you sure you want to delete ' + user.name + '?'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        user.$delete({
                            id: student._id
                        }, function () {
                            $scope.refresh();
                        });
                    } else {
                        console.log('You are not sure');
                    }
                });

            }, function (err) {
                console.log(err);
            });

        };
        $scope.refreshStudentsList = function () {
            $scope.refresh();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply()
        };
        $scope.record = function (student) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Did ' + student.name + ' attended? (Partial ' + $localStorage.selectedPartial + ')',
                template: 'Are you sure you want to add attendance?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    //alert('You are sure');
                    var att = new Attendance();
                    att.student_id = student._id;
                    att.user_id = $rootScope.currentUser.data._id;
                    att.club_id = $localStorage.selectedClub;
                    att.partial = parseInt($localStorage.selectedPartial);
                    //console.log(att);
                    var attp = new Attendances(att);
                    console.log(Attendances);
                    console.log(attp);
                    attp.$save({}, function () {
                        $scope.attendances = Attendances.query({}, function () {
                            $scope.lmessage = "Attendance added to: " + student.name + " (" + $scope.getAttendancesByStudent(student) + ")";
                            $scope.filter = '';
                        });

                    })
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