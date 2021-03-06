angular.module("app.routes", [])
.config(function($routeProvider){
  $routeProvider
  .when('/',{
    controller: "MainCtrl",
    templateUrl: "./views/dashboard.html"
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
  .when('/scores-1',{
    controller: "ScoresCtrl",
    templateUrl: "./views/scores-1.html",
    activetab: 'dashboard'
  })
  .when('/scores-2',{
    controller: "ScoresCtrl",
    templateUrl: "./views/scores-2.html",
    activetab: 'dashboard'
  })
  .when('/scores-3',{
    controller: "Scores3Ctrl",
    templateUrl: "./views/scores-3.html",
    activetab: 'dashboard'
  })
  .when("/scores/:id",{
    controller: "userScoresCtrl",
    templateUrl: "./views/user-scores.html"
  })
  .when('/questions/:id',{
    controller: "AddCtrl",
    //templateUrl: "./views/add.html"
    templateUrl: "./views/thanks.html"
  })
})
