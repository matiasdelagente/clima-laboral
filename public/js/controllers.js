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
      Auth.getUser().success(function(data){
        if(data.admin){
          $location.path('/scores');
        }
        else {
          $location.path('/agregar');
        }
      });
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

.controller("AddCtrl", function($scope, $location, userSrvc){
  $scope.company = "Telefonica"

  $scope.add = function(){
    userSrvc.edit($scope.user._id, $scope.user).success(function(data){
      $location.path('/scores/'+ $scope.user._id)
      //$location.path('/scores')
    })
  }
})

.controller("UserCtrl",function($scope, userSrvc){
  $scope.processing = true;
  userSrvc.all().success(function(data){
    $scope.processing = false
    $scope.users = data
  })
})

.controller("EditUserCtrl", function($scope, $routeParams, $location, userSrvc){
  $scope.processing = true;

  userSrvc.get($routeParams.id).success(function(data){
    $scope.form = data;
    $scope.processing = false;
  })

  $scope.save = function(){
    userSrvc.edit($scope.form._id, $scope.form).success(function(data){
      $scope.user = {};
      $location.path('/users')
    })
  }
})

.controller("AddUserCtrl", function($scope, $routeParams, $location, userSrvc){
  console.log("toto")
  $scope.save = function(){
    userSrvc.edit($scope.user._id, $scope.form).success(function(data){
      $scope.user = {};
      $location.path('/users')
    })
  }
})

.controller("userScoresCtrl", function($scope, $routeParams,userSrvc){
  $scope.processing = false;

  userSrvc.get($routeParams.id).success(function(data){
    $scope.user = data
    $scope.processing = true;
  })
})
