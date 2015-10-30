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
      return $http.put('/api/users/' + id, user)
    }
    user.save = function(user){
      return $http.post('/api/users', user)
    }
    user.delete = function(id){
      return $http.delete('/api/users/' + id)
    }
  return user;
})
.factory("companySrvc", function($http){
  var user = {}
    user.all = function(){
      return $http.get('/api/companies')
    }
    user.get = function(id){
      return $http.get('/api/companies/'+id)
    }
    user.edit = function(id, company){
      return $http.put('/api/companies/' + id, company)
    }
    user.save = function(company){
      return $http.post('/api/companies', company)
    }
    user.delete = function(id){
      return $http.delete('/api/companies/' + id)
    }
  return user;
})
