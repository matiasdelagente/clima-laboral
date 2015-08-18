angular.module("app.routes", [])
.config(function($routeProvider){
  $routeProvider
  .when('/',{
    controller: "MainCtrl",
    templateUrl: "./views/home.html"
  })
  .when('/login',{
    controller: "MainCtrl",
    templateUrl: "./views/login.html"
  })
  .when('/users',{
    controller: "UserCtrl",
    templateUrl: "./views/users/all.html"
  })
  .when('/users/:id',{
    controller: "EditUserCtrl",
    templateUrl: "./views/edit-user.html"
  })
  .when('/user/add',{
    controller: "AddUserCtrl",
    templateUrl: "./views/edit-user.html"
  })
  .when('/scores',{
    controller: "ScoresCtrl",
    templateUrl: "./views/scores.html"
  })
  .when("/scores/:id",{
    controller: "userScoresCtrl",
    templateUrl: "./views/user-scores.html"
  })
  .when('/questions/:id',{
    controller: "AddCtrl",
    templateUrl: "./views/add.html"
  })
})
