angular.module("climaLaboral")

.factory("scoreSrvc",function($http){
  var score = {}
  score.getAll = function(){
    return $http.get('/api/scores')
  }
  score.add = function(scores){
    return $http.post("/api/scores", scores)
  }
  return score
})
.factory("userSrvc", function($http){
  var user = {}
    user.all = function(){
      return $http.get('/api/users')
    }
    user.get = function(id){
      return $http.get('/api/users/'+id)
    }
    user.edit = function(id, user){
      return $http.put('/api/users/'+id, user)
    }
    user.save = function(id, user){
      return $http.post('/api/users')
    }
  return user;
})
