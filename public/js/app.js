angular.module("climaLaboral", [
  "ngRoute",
  "authService",
  "app.routes",
  "chart.js"
  ])
.config(function($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptor');
})
