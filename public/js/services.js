angular.module("climaLaboral")

.factory("scoreSrvc",function($http){
  var score = {}
  score.getAll = function(){
    return $http.get('/api/scores')
  }
  score.add = function(scores){
    return $http.post("/api/scores", scores)
  };
  return score;
})
.factory("userSrvc", function($http){
  var user = {};
    user.all = function(){
      return $http.get('/api/users');
    };
    user.get = function(id){
      return $http.get('/api/users/'+id);
    };
    user.edit = function(id, user){
      return $http.put('/api/users/' + id, user);
    };
    user.save = function(user){
      return $http.post('/api/users', user);
    };
    user.delete = function(id){
      return $http.delete('/api/users/' + id);
    }
    user.usersByCompany = function(id){
      return $http.get('/api/usersByCompany/' + id);
    }
    user.allByCompany = function(id){
      return $http.get('/api/allByCompany/' + id);
    }
  return user;
})
.factory("companySrvc", function($http){
  var company = {}
    company.all = function(){
      return $http.get('/api/companies')
    }
    company.get = function(id){
      return $http.get('/api/companies/'+id)
    }
    company.edit = function(id, company){
      return $http.put('/api/companies/' + id, company)
    }
    company.save = function(company){
      return $http.post('/api/companies', company)
    }
    company.delete = function(id){
      return $http.delete('/api/companies/' + id)
    }
    company.companyByUser = function(id){
      return $http.get('/api/companyByUser/' + id)
    }
  return company;
})
.factory("areaSrvc", function($http){
  var area = {};
    area.all = function(){
      return $http.get('/api/areas');
    };
    area.get = function(id){
      return $http.get('/api/areas/'+id);
    };
    area.edit = function(id, area){
      return $http.put('/api/areas/' + id, area);
    };
    area.save = function(area){
      console.log(area);
      return $http.post('/api/areas', area);
    };
    area.delete = function(id){
      return $http.delete('/api/areas/' + id);
    };
  return area;
})
.factory("roleSrvc", function($http){
  var role = {};
    role.all = function(){
      return $http.get('/api/roles');
    };
    role.get = function(id){
      return $http.get('/api/roles/'+id);
    };
    role.edit = function(id, role){
      return $http.put('/api/roles/' + id, role);
    };
    role.save = function(role){
      console.log(role);
      return $http.post('/api/roles', role);
    };
    role.delete = function(id){
      return $http.delete('/api/roles/' + id);
    };
  return role ;
});
