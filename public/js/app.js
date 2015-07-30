angular.module("stockApp", [
  "ngRoute",
  "authService"
  ])

.config(function($routeProvider){
  $routeProvider
  .when('/',{
    controller: "MainCtrl",
    templateUrl: "../views/home.html"
  })
  .when('/login',{
    controller: "MainCtrl",
    templateUrl: "../views/login.html"
  })
  .when('/scores',{
    controller: "ScoresCtrl",
    templateUrl: "../views/scores.html"
  })
  .when('/agregar',{
    controller: "AddCtrl",
    templateUrl: "../views/add.html"
  })
})
