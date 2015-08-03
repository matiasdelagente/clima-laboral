angular.module("stockApp")

.controller("MainCtrl", function($scope, $rootScope, $location, Auth){
  $scope.loggedIn = Auth.isLoggedIn();
  $rootScope.$on('$routeChangeStart',function(){
    $scope.loggedIn = Auth.isLoggedIn();
    Auth.getUser().success(function(data){
      $scope.user = data;
    });
  });

  $scope.doLogin = function(){
    Auth.login($scope.loginData.username, $scope.loginData.password).success(function(data){
      $location.path('/scores');
    });
  };

  $scope.doLogout = function(){
    Auth.logout();
    $scope.user = {};
    $location.path('/')
  }
})

.controller("ScoresCtrl", function($scope, scoreSrvc, userSrvc){
  $scope.processing = true;
  userSrvc.all().success(function(data){
    $scope.processing = false
    $scope.users = data
  })
  scoreSrvc.getAll().success(function(data){
    $scope.scores = data;
    $scope.questions = new Array(40);
  })
})

.controller("AddCtrl", function($scope, scoreSrvc){
  $scope.form = {}
  $scope.form.scores = []
  $scope.company = "Telefonica"

  $scope.add = function(){
    scoreSrvc.add($scope.form).success(function(data){
      $scope.form = {}
      console.log(data);
    })
  }
})

.controller("UserCtrl",function($scope,userSrvc){
  $scope.processing = true;
  userSrvc.all().success(function(data){
    $scope.processing = false
    $scope.users = data
  })
})
.controller("userScoresCtrl", function($scope, scoreSrvc, userSrvc){
  $scope.processing = true;
  userSrvc.all().success(function(data){
    $scope.processing = false
    $scope.users = data
  })
  scoreSrvc.getAll().success(function(data){
    $scope.scores = data;
    $scope.questions = new Array(40);
  })
})
