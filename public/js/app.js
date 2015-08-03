angular.module("stockApp", [
  "ngRoute",
  "authService",
  "app.routes"
  ])
.config(function($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptor');
})
