angular.module("stockApp")

.controller("MainCtrl", function($scope, $rootScope, $location, Auth){
  $scope.hola = "hola"
  $scope.loggedIn = Auth.isLoggedIn();

  $rootScope.$on('$routeChangeStart',function(){
    $scope.loggedIn = Auth.isLoggedIn();
    console.log(Auth.getUser())
    Auth.getUser().success(function(data){
      $scope.user = data;
    });
  });

  $scope.doLogin = function(){
    Auth.login($scope.loginData.username, $scope.loginData.password).success(function(data){
      console.log(data);
      $location.path('/scores');
    });
  };

  $scope.doLogout = function(){
    console.log("chau");
    Auth.logout();
    $scope.user = {};
    $location.path('/')
  }

})

.controller("ScoresCtrl", function($scope, scoreSrvc){
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
