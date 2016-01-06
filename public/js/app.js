angular.module("climaLaboral", [
  "authService",
  "app.routes",
  "chart.js",
  "rt.encodeuri",
  "ngFileUpload",
  'ngImgCrop',
  "ng-nestable"
  ])
.config(function($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptor');
})
