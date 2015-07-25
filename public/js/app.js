angular.module("stockApp", ["ngRoute"])

.config(function($routeProvider){
  $routeProvider
  .when('/',{
    controller: "HomeCtrl",
    templateUrl: "../views/home.html"
  })
  .when('/agregar',{
    controller: "AddCtrl",
    templateUrl: "../views/add.html"
  })
})
