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
  $scope.questionsMotivadores = [
    'En DHL la comunicación es abierta y honesta en ambos sentidos (del jefe al colaborador y del colaborador al jefe). (Comunicación)',
    'DHL está realizando los cambios necesarios para competir eficientemente. (Estrategia)',
    'Creo que habrá cambios positivos como resultado de esta encuesta. (Seguimiento de la EOS)',
    'Mi trabajo aprovecha muy bien mis talentos, habilidades y aptitudes. (Aprendizaje y Desarrollo)',
    'Tengo confianza en el futuro de DHL. (Estrategia)',
    'Estoy dispuesto a contribuir con soluciones sostenibles para nuestros clientes. (Promesa al Cliente)',
    'En general, estoy satisfecho con el tipo de trabajo que realizo. (Condiciones Laborales)',
    'Recibo la información y comunicación que necesito para realizar mi trabajo efectivamente. (Comunicación)',
    'En general, estoy satisfecho con el intercambio de información y la comunicación en mi área de trabajo. (Comunicación)',
    'DHL me brinda la oportunidad de aprender y desarrollarme profesionalmente. (Aprendizaje y Desarrollo)'
  ];

  userSrvc.all().success(function(data){
    $scope.processing = false;
    $scope.users = data;
    $scope.showCompromiso = false;
    $scope.calcAll();
  });

  $scope.calcCompromiso = function(preguntas){
    var area = $scope.formUser.area;
    var role = $scope.formUser.role;
    var dataCompromiso = [0, 0, 0];
    for(var i=0; i<$scope.users.length; i++){
      if(!$scope.formUser.area) area = $scope.users[i].area;
      if(!$scope.formUser.role) role = $scope.users[i].role;
      if($scope.users[i].username != "admin" && $scope.users[i].area === area && $scope.users[i].role === role && $scope.users[i].scores.length > 0){
        for(var j=0; j<preguntas.length; j++){
          if($scope.users[i].scores[preguntas[j]] > 3) dataCompromiso[0]++;
          else if($scope.users[i].scores[preguntas[j]] < 3) dataCompromiso[2]++;
          else dataCompromiso[1]++;
          console.log($scope.users[i].username + "->"+ $scope.users[i].scores.length);
        }
      }
    }
    return dataCompromiso;
  };

  $scope.calcMotivadores = function(){
    var area = $scope.formUser.area;
    var role = $scope.formUser.role;
    var dataMotivadores = [0,0,0,0,0,0,0,0,0,0];
    var total = [0,0,0,0,0,0,0,0,0,0];
    for(var i=0; i<$scope.users.length; i++){
      if(!$scope.formUser.area) area = $scope.users[i].area;
      if(!$scope.formUser.role) role = $scope.users[i].role;
      if($scope.users[i].username != "admin" && $scope.users[i].area === area && $scope.users[i].role === role){
        for(var j=0; j<$scope.pregMotivadores.length; j++){
          total[j]++;
          if($scope.users[i].scores[$scope.pregMotivadores[j]] > 3) dataMotivadores[j]++;
        }
      }
    }
    for(var i=0; i<dataMotivadores.length; i++){
      dataMotivadores[i] = (100*dataMotivadores[i])/total[i];
    }
    $scope.dataMotivadores = dataMotivadores;
    $scope.vacioMotivadores = 0; for(var i in $scope.dataMotivadores) $scope.vacioMotivadores += $scope.dataMotivadores[i];
  };

  $scope.calcFavorable = function(){
    $scope.dataFavorable = new Array(1);
    $scope.dataFavorable[0] = new Array(1);
    var total = $scope.dataCompromiso[0] + $scope.dataCompromiso[1] + $scope.dataCompromiso[2];
    $scope.dataFavorable[0][0] = (100*$scope.dataCompromiso[0])/total;
    $scope.vacioFavorable = false ; if(total === 0) $scope.vacioFavorable = true;
  };

  $scope.calcAll = function(){
    $scope.showCompromiso = false;
    $scope.pregCompromiso = [3, 4, 5, 6];
    $scope.pregMotivadores = [21, 17, 34, 24, 18, 2, 39, 20, 23, 25];
    $scope.pregPromesa = [0, 1, 2];
    $scope.pregLiderazgo = [7, 8, 9, 10, 11, 12, 13, 14, 15];
    $scope.pregEstrategia = [16, 17, 18, 19];
    $scope.pregComunicacion = [20, 21, 22, 23];
    $scope.pregAprendizaje = [24, 25, 26];
    $scope.pregCooperacion = [27, 28, 29];
    $scope.pregVivir = [30, 31];
    $scope.pregResponsabilidad = [32, 33];
    $scope.pregSeguimiento = [34, 35];
    $scope.pregCondiciones = [36, 37, 38, 39];

    $scope.dataCompromiso = $scope.calcCompromiso($scope.pregCompromiso);
    $scope.dataPromesa = $scope.calcCompromiso($scope.pregPromesa);
    $scope.dataLiderazgo = $scope.calcCompromiso($scope.pregLiderazgo);
    $scope.dataEstrategia = $scope.calcCompromiso($scope.pregEstrategia);
    $scope.dataComunicacion = $scope.calcCompromiso($scope.pregComunicacion);
    $scope.dataAprendizaje = $scope.calcCompromiso($scope.pregAprendizaje);
    $scope.dataCooperacion = $scope.calcCompromiso($scope.pregCooperacion);
    $scope.dataVivir = $scope.calcCompromiso($scope.pregVivir);
    $scope.dataResponsabilidad = $scope.calcCompromiso($scope.pregResponsabilidad);
    $scope.dataSeguimiento = $scope.calcCompromiso($scope.pregSeguimiento);
    $scope.dataCondiciones = $scope.calcCompromiso($scope.pregCondiciones);

    $scope.calcMotivadores();
    $scope.calcFavorable();
  };
// Datos Grafico Compromiso
  $scope.labelsCompromiso = ["Porcentaje Favorable", "Porcentaje Neutro", "Porcentaje Desfavorable"];
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
  $scope.areas = ["Recursos Humanos", "Contaduria",  "Sistemas", "Marketing", "Administracion", "Compras", "Legales"];
  $scope.roles = ["Gerente", "Secretario", "Asistente", "Contador", "Abogado", "Pasante", "Escriba"];

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
  $scope.areas = ["Recursos Humanos", "Contaduria",  "Sistemas", "Marketing", "Administracion", "Compras", "Legales"];
  $scope.roles = ["Gerente", "Secretario", "Asistente", "Contador", "Abogado", "Pasante", "Escriba"];

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
