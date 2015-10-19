angular.module("climaLaboral", [
  "ngRoute",
  "authService",
  "app.routes",
  "chart.js",
  "rt.encodeuri"
  ])
.config(function($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptor');
})
