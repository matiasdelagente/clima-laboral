angular.module("stockApp")

.controller("HomeCtrl", function($scope, scoreSrvc){
  scoreSrvc.getAll().success(function(data){
    $scope.scores = data;
    //console.log()
  })
})

.controller("AddCtrl", function($scope, scoreSrvc){
  $scope.form = {}
  $scope.form.scores = []

  $scope.add = function(){
    scoreSrvc.add($scope.form).success(function(data){
      $scope.form = {}
      console.log(data)
    })
  }
})
