angular.module("authService", [])
.factory("AuthToken", function($window){
  var authTokenFactory = {};
  //get token
  authTokenFactory.getToken = function(){
    return $window.localStorage.getItem('token');
  };
  //get session
  authTokenFactory.getSession = function(){
    return JSON.parse($window.localStorage.getItem('session'));
  };  
  //set token o clear token
  authTokenFactory.setToken = function(data){
    if(data && data.token){
      $window.localStorage.setItem('token',data.token);
      // console.log(data.session)
      $window.localStorage.setItem('session', JSON.stringify(data.session));
    }
    else {
      $window.localStorage.removeItem('token');
      $window.localStorage.removeItem('data');
    }
    // console.log($window.localStorage)
  };

  return authTokenFactory;
})

.factory("Auth", function($http, $q, AuthToken){
  var authFactory = {};
  //login
  authFactory.login = function(username, password){
    return $http.post('/api/authenticate',{username: username, password: password}).success(function(data){
      // console.log('login!', data);//companySrvc.get($routeParams.id).success(function(data){
      AuthToken.setToken(data);
      // console.log(data)
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
    // console.log(AuthToken.getToken())
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

    if(response = 403) {
      AuthToken.setToken();
      $location.path('/')
    }
    return $q.reject(response)
  }

  return authInterceptorFactory;
});
