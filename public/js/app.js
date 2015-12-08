angular.module("climaLaboral", [
  "ngRoute",
  "authService",
  "app.routes",
  "chart.js",
  "rt.encodeuri",
  "ng-nestable"
  ])
.config(function($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptor');
})
