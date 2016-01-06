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
  user.setChildrens = function(id, childrens){
    return $http.put('/api/users/setChildrens/' + id, childrens)
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
      return $http.post('/api/areas', area);
    };
    area.delete = function(id){
      return $http.delete('/api/areas/' + id);
    };
    area.allByCompany = function(id){
      return $http.get('/api/areas/allByCompany/' + id);
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
    role.allByCompany = function(id){
      return $http.get('/api/roles/allByCompany/' + id);
    };
  return role ;
})
.factory("competenceSrvc", function($http){
  var competence = {};
    competence.all = function(){
      return $http.get('/api/competencies');
    };
    competence.get = function(id){
      return $http.get('/api/competencies/'+id);
    };
    competence.edit = function(id, competence){
      return $http.put('/api/competencies/' + id, competence);
    };
    competence.save = function(competence){
      console.log(competence);
      return $http.post('/api/competencies', competence);
    };
    competence.delete = function(id){
      return $http.delete('/api/competencies/' + id);
    };
  return competence ;
})
.factory("awsSrvc", function ($http, $q, $timeout, Upload) {
  
  var aws = {
    signS3: function (fileName, fileType) {
      return $http.get('/api/sign_s3?file_name='+fileName+'&file_type='+fileType);
    },
    uploadS3CroppedImage: function (croppedData, file) {
      var defer = $q.defer();
      
      if (!file.$error && croppedData) {
        aws.signS3(file.name, file.type).then(function (data) {
          
          var d = data.data;
          
          var xhr = new XMLHttpRequest();
          xhr.open("PUT", d.signed_request);
          xhr.setRequestHeader('x-amz-acl', 'public-read');
          xhr.onload = function() {
            defer.resolve(d.url);
          };
          
          xhr.onerror = function() {
            alert("Lo sentimos, intente nuevamente.");
          };
          
          xhr.send(Upload.dataUrltoBlob(croppedData));
          
        });
      } else {
        $timeout(function () {
          defer.reject();
        });
      }
      
      return defer.promise;
    }
  };
  
  return aws;
});