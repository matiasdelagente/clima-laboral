angular.module("climaLaboral")

.controller("MainCtrl", function($scope, $rootScope, $location, Auth){
  $scope.loggedIn = Auth.isLoggedIn();
  $rootScope.$on('$routeChangeStart',function(){
    if(Auth.isLoggedIn()){
      $scope.loggedIn = true;
    }
    else {
      $scope.loggedIn = false;
      $location.path('/');
    }
    Auth.getUser().success(function(data){
      $scope.user = data;
    });
  });

  $scope.doLogin = function(){
    $scope.processing = true;
    $scope.error = "";

    Auth.login($scope.loginData.username, $scope.loginData.password).success(function(data){
      $scope.processing = false;
      if(data.success){
        Auth.getUser().success(function(data){
          if(data.admin){
            $location.path('/scores');
          }
          else if(!data.admin){
            $location.path('/questions/'+ data._id);
          }
        });
      }
      else {
        $scope.error = data.message;
      }

    });
  };

  $scope.doLogout = function(){
    Auth.logout();
    $scope.user = {};
    $location.path('/');
  };
})

.controller("ScoresCtrl", function($scope, scoreSrvc, userSrvc){
  $scope.processing = true;
  $scope.areas = ["Recursos Humanos", "Contaduria",  "Sistemas", "Marketing", "Administracion", "Compras", "Legales"];
  $scope.roles = ["Gerente", "Secretario", "Asistente", "Contador", "Abogado", "Pasante", "Escriba"];
  $scope.formUser = {area: null, role: null};

  userSrvc.all().success(function(data){
    $scope.processing = false;
    $scope.users = data;
    $scope.showCompromiso = false;
    $scope.calcAll();
  });

  $scope.calcCompromiso = function(){
    console.log($scope.formUser.area,$scope.formUser.role)
    var area = $scope.formUser.area;
    var role = $scope.formUser.role;
    var dataCompromiso = [0, 0, 0];
    for(var i=0; i<$scope.users.length; i++){
      if(!$scope.formUser.area) area = $scope.users[i].area;
      if(!$scope.formUser.role) role = $scope.users[i].role;
      console.log($scope.users[i].username ,$scope.users[i].username != "admin" && $scope.users[i].area === area && $scope.users[i].role === role);
      if($scope.users[i].username != "admin" && $scope.users[i].area === area && $scope.users[i].role === role){
        for(var j=0; j<$scope.pregCompromiso.length; j++){
          if($scope.users[i].scores[$scope.pregCompromiso[j]] > 3) dataCompromiso[0]++;
          else if($scope.users[i].scores[$scope.pregCompromiso[j]] < 3) dataCompromiso[2]++;
          else dataCompromiso[1]++;
        }
      }
    }
    $scope.dataCompromiso = dataCompromiso;
  };

  $scope.calcMotivadores = function(){
    var dataMotivadores = [0,0,0,0,0,0,0,0,0,0];
    var total = [0,0,0,0,0,0,0,0,0,0];
    for(var i=0; i<$scope.users.length; i++){
      for(var j=0; j<$scope.pregMotivadores.length; j++){
        if($scope.users[i].username != "admin"){
          total[j]++;
          if($scope.users[i].scores[$scope.pregMotivadores[j]] > 3) dataMotivadores[j]++;
        }
      }
    }
    for(var i=0; i<dataMotivadores.length; i++){
      dataMotivadores[i] = (100*dataMotivadores[i])/total[i];
    }
    $scope.dataMotivadores = dataMotivadores;
  };

  $scope.calcFavorable = function(){
    $scope.dataFavorable = new Array(1);
    $scope.dataFavorable[0] = new Array(1);
    var total = $scope.dataCompromiso[0] + $scope.dataCompromiso[1] + $scope.dataCompromiso[2];
    $scope.dataFavorable[0][0] = (100*$scope.dataCompromiso[0])/total;
    if(total == 0) $scope.vacioFavorable = true; 
  };

  $scope.calcAll = function(){
    $scope.showCompromiso = false;
    $scope.pregCompromiso = [3, 4, 5, 6];
    $scope.pregMotivadores = [21, 17, 34, 24, 18, 2, 39, 20, 23, 25];
    $scope.calcCompromiso();
    $scope.calcMotivadores();
    $scope.calcFavorable();
  };
// Datos Grafico Compromiso
  $scope.labelsCompromiso = ["Porcentage Favorable", "Porcentage Neutro", "Porcentage Desfavorable"];
// Datos Grafico Año Favorable
  $scope.labelsFavorable = ['2015','2014','Best in Class','General'];
  $scope.series1 = ['Serie 2015'];
// Datos Grafico Motivadores

})

.controller("AddCtrl", function($scope, $routeParams,$location, userSrvc){
  $scope.company = "Telefonica";
  $scope.formProcessing = false;
  $scope.processing = true;
  console.log($routeParams.id);
  userSrvc.get($routeParams.id).success(function(data){
    $scope.user = data;
    $scope.processing = false;
    console.log($scope.user);
  });
  $scope.add = function(){
    $scope.formProcessing = true;
    userSrvc.edit($scope.user._id, $scope.user).success(function(data){
      $scope.formProcessing = false;
      $location.path('/scores/'+ $scope.user._id);
    });
  };
})

.controller("UserCtrl",function($scope, userSrvc){
  $scope.processing = true;
  userSrvc.all().success(function(data){
    $scope.processing = false;
    $scope.users = data;
  });

  $scope.deleteUser = function(userDeleted){
    $scope.processing = true;
    userSrvc.delete(userDeleted._id).success(function(data){
      $scope.processing = false;
      var index = $scope.users.indexOf(userDeleted);
      $scope.users.splice(index,1);
    });
  };
})

.controller("EditUserCtrl", function($scope, $routeParams, $location, userSrvc){
  $scope.processing = false;
  $scope.areas = ["Recursos Humanos", "Contaduria",  "Sistemas", "Marketing", "Administracion", "Compras", "Legales"]
  $scope.roles = ["Gerente", "Secretario", "Asistente", "Contador", "Abogado", "Pasante", "Escriba"]

  userSrvc.get($routeParams.id).success(function(data){
    $scope.formUser = data;
  });

  $scope.save = function(){
    $scope.processing = true;
    userSrvc.edit($scope.formUser._id, $scope.formUser).success(function(data){
      $scope.processing = false;
      $scope.user = {};
      $location.path('/users');
    });
  };
})

.controller("AddUserCtrl", function($scope, $routeParams, $location, userSrvc){
  $scope.processing = false;
  $scope.areas = ["Recursos Humanos", "Contaduria",  "Sistemas", "Marketing", "Administracion", "Compras", "Legales"]
  $scope.roles = ["Gerente", "Secretario", "Asistente", "Contador", "Abogado", "Pasante", "Escriba"]

  $scope.save = function(){
    $scope.processing = true;
    userSrvc.save($scope.formUser).success(function(data){
      $scope.processing = false;
      $location.path('/users');
    });
  };
})

.controller("userScoresCtrl", function($scope, $routeParams,userSrvc){
  $scope.processing = true;

  userSrvc.get($routeParams.id).success(function(data){
    $scope.user = data;
    $scope.processing = false;
  });
});
