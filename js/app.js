angular.module("climaLaboral", [
  "ngRoute",
  "authService",
  "app.routes"
  ])
.config(function($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptor');
})