angular.module("authService", [])
.factory("AuthToken", function($window){
  var authTokenFactory = {};
  //get token
  authTokenFactory.getToken = function(){
    return $window.localStorage.getItem('token');
  };
  //set token o clear token
  authTokenFactory.setToken = function(token){
    if(token){
      $window.localStorage.setItem('token',token);
    }
    else {
      $window.localStorage.removeItem('token');
    }
  };

  return authTokenFactory;
})

.factory("Auth", function($http, $q, AuthToken){
  var authFactory = {};
  //login
  authFactory.login = function(username, password){
    return $http.post('/api/authenticate',{username: username, password: password}).success(function(data){
      AuthToken.setToken(data.token);
      return data
    })
  }
  //logout
  authFactory.logout = function(){
    AuthToken.setToken();
  }
  //check if is logged in
  authFactory.isLoggedIn = function(){
    if(AuthToken.getToken()){
      return true
    }
    else {
      return false
    }
  }
  //get user info
  authFactory.getUser = function(){
    if(AuthToken.getToken()){
      return $http.get('/api/me');
    }
    else {
      return $q.reject({ message: 'User has no token.' });
    }
  };

  return authFactory;
})

.factory("AuthInterceptor", function($q, $location, AuthToken){
  var authInterceptorFactory = {};
  //atach the token to every request
  authInterceptorFactory.request = function (config) {
    var token = AuthToken.getToken()
    if(token){
      config.headers['x-access-token'] = token;
    }
    return config
  };
  //redirect if a token doesn't authenticate
  authInterceptorFactory.responseError = function(response){

    if(response = 403){
      AuthToken.setToken();
      $location.path('/')
    }
    return $q.reject(response)
  }

  return authInterceptorFactory;
});
