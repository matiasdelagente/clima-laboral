angular.module("climaLaboral")

.controller("MainCtrl", function($scope, $rootScope, $location, Auth, $route){
  $scope.company = "Fostering Talent"
  $scope.areas = ["Recursos Humanos", "Contaduria",  "Sistemas", "Marketing", "Administracion", "Compras", "Legales"];
  $scope.roles = ["Gerente", "Secretario", "Asistente", "Contador", "Abogado", "Pasante", "Escriba"];
  $scope.assessments = ["Clima Laboral", "Felicímetro"];
  
  $scope.loggedIn = Auth.isLoggedIn();
  $rootScope.$on('$routeChangeStart',function(){
    if(Auth.isLoggedIn()){
      $scope.loggedIn = true;
    }
    else {
      $scope.loggedIn = false;
      $location.path('/login');
    }
    Auth.getUser().success(function(data){
      $scope.user = data;
    });

    $scope.url = $location.path();
  });

  $scope.doLogin = function(){
    $scope.processing = true;
    $scope.disabled = true;
    $scope.error = "";
    Auth.login($scope.loginData.username, $scope.loginData.password).success(function(data){
      //$scope.processing = false;
      if(data.success){
        Auth.getUser().success(function(data){
          if(data.admin){
            $location.path('/');
          }
          else if(!data.admin){
            // $location.path('/questions/'+ data._id);
            $location.path('/');
          }
        });
      }
      else {
        $scope.error = data.message;
        $scope.disabled = false;
        $scope.processing = false;
      }

    });
  };

  $scope.doLogout = function(){
    Auth.logout();
    $scope.user = {};
    $location.path('/login');
  };

  $scope.route = $route;


})

.controller("ScoresCtrl", function($scope, scoreSrvc, userSrvc){
  $scope.processing = true;
  $scope.formUser = {area: null, role: null};
  $scope.questionsMotivadores = [
  'En '+$scope.company+' la comunicación es abierta y honesta en ambos sentidos (del jefe al colaborador y del colaborador al jefe). (Comunicación)',
  ''+$scope.company+' está realizando los cambios necesarios para competir eficientemente. (Estrategia)',
  'Creo que habrá cambios positivos como resultado de esta encuesta. (Seguimiento del Cuestionario)',
  'Mi trabajo aprovecha muy bien mis talentos, habilidades y aptitudes. (Aprendizaje y Desarrollo)',
  'Tengo confianza en el futuro de '+$scope.company+'. (Estrategia)',
  'Estoy dispuesto a contribuir con soluciones sostenibles para nuestros clientes. (Promesa al Cliente)',
  'En general, estoy satisfecho con el tipo de trabajo que realizo. (Condiciones Laborales)',
  'Recibo la información y comunicación que necesito para realizar mi trabajo efectivamente. (Comunicación)',
  'En general, estoy satisfecho con el intercambio de información y la comunicación en mi área de trabajo. (Comunicación)',
  ''+$scope.company+' me brinda la oportunidad de aprender y desarrollarme profesionalmente. (Aprendizaje y Desarrollo)'
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
    $scope.vacioMotivadores = null;
    for(var i in $scope.dataMotivadores) $scope.vacioMotivadores += $scope.dataMotivadores[i];
      $scope.showMotivadores = true;
    if (isNaN($scope.vacioMotivadores)) $scope.showMotivadores = false;
  };

  $scope.calcFavorable = function(data){
    var favorable = new Array(1);
    favorable[0] = new Array(1);
    var total = data.reduce(function(a,b){return a+b;});
    favorable[0][0] = ((100 * data[0])/total).toFixed();
    return favorable;
  };

  $scope.calcAll = function(){
    $scope.showCompromiso = false;
    // Numero de las preguntas de cada kpi
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
    //Calculo de los valores de cada kpi, con las preguntas como parametro
    $scope.dataPromesa = $scope.calcCompromiso($scope.pregPromesa);
    $scope.dataCompromiso = $scope.calcCompromiso($scope.pregCompromiso);
    $scope.dataLiderazgo = $scope.calcCompromiso($scope.pregLiderazgo);
    $scope.dataEstrategia = $scope.calcCompromiso($scope.pregEstrategia);
    $scope.dataComunicacion = $scope.calcCompromiso($scope.pregComunicacion);
    $scope.dataAprendizaje = $scope.calcCompromiso($scope.pregAprendizaje);
    $scope.dataCooperacion = $scope.calcCompromiso($scope.pregCooperacion);
    $scope.dataVivir = $scope.calcCompromiso($scope.pregVivir);
    $scope.dataResponsabilidad = $scope.calcCompromiso($scope.pregResponsabilidad);
    $scope.dataSeguimiento = $scope.calcCompromiso($scope.pregSeguimiento);
    $scope.dataCondiciones = $scope.calcCompromiso($scope.pregCondiciones);
    //Calclulo de los % favorables, con los valores de cada kpi como parametro
    $scope.faborablePromesa = $scope.calcFavorable($scope.dataPromesa);
    $scope.faborableCompromiso = $scope.calcFavorable($scope.dataCompromiso);
    $scope.faborableLiderazgo = $scope.calcFavorable($scope.dataLiderazgo);
    $scope.faborableEstrategia = $scope.calcFavorable($scope.dataEstrategia);
    $scope.faborableComunicacion = $scope.calcFavorable($scope.dataComunicacion);
    $scope.faborableAprendizaje = $scope.calcFavorable($scope.dataAprendizaje);
    $scope.faborableCooperacion = $scope.calcFavorable($scope.dataCooperacion);
    $scope.faborableVivir = $scope.calcFavorable($scope.dataVivir);
    $scope.faborableResponsabilidad = $scope.calcFavorable($scope.dataResponsabilidad);
    $scope.faborableSeguimiento = $scope.calcFavorable($scope.dataSeguimiento);
    $scope.faborableCondiciones = $scope.calcFavorable($scope.dataCondiciones);
    // Calculo principales Motivadores
    $scope.calcMotivadores();
  };
// Datos Grafico Compromiso
$scope.labelsCompromiso = ["Porcentaje Favorable", "Porcentaje Neutro", "Porcentaje Desfavorable"];
// Datos Grafico Año Favorable
$scope.labelsFavorable = ['2015','2014','Top 25%','General'];
$scope.series1 = ['Serie 2015'];
// Datos Grafico Motivadores

})

.controller("Scores3Ctrl", function($scope, scoreSrvc, userSrvc){
  $scope.processing = true;
  $scope.formUser = {area: null, role: null};

  userSrvc.all().success(function(data){
    $scope.processing = false;
    $scope.users = data;
    $scope.showCompromiso = false;
    $scope.calcAll();
  });

  $scope.calcKpi = function(preguntas){
    var area = $scope.formUser.area;
    var role = $scope.formUser.role;
    var favorable = [];
    for(var i=0; i<$scope.users.length; i++){
      if(!$scope.formUser.area) area = $scope.users[i].area;
      if(!$scope.formUser.role) role = $scope.users[i].role;
      if($scope.users[i].username != "admin" && $scope.users[i].area === area && $scope.users[i].role === role && $scope.users[i].scores.length > 0){
        var dataCompromiso = [0, 0, 0];
        for(var j=0; j<preguntas.length; j++){
          if($scope.users[i].scores[preguntas[j]] > 3) dataCompromiso[0]++;
          else if($scope.users[i].scores[preguntas[j]] < 3) dataCompromiso[2]++;
          else dataCompromiso[1]++;
        }
        var total = dataCompromiso.reduce(function(a,b){return a+b;});
        favorable.push((100 * dataCompromiso[0])/total);
        if($scope.users[i].username == 'fran4')console.log(dataCompromiso[0]);
      }
    }
    return favorable;
  };
  $scope.calcUsers = function(){
    var area = $scope.formUser.area;
    var role = $scope.formUser.role;
    var users = [];
    for(var i=0; i<$scope.users.length; i++){
      if(!$scope.formUser.area) area = $scope.users[i].area;
      if(!$scope.formUser.role) role = $scope.users[i].role;
      if($scope.users[i].username != "admin" && $scope.users[i].area === area && $scope.users[i].role === role && $scope.users[i].scores.length > 0){
        users.push([$scope.users[i].username, $scope.users[i].area, $scope.users[i].role]);
      }
    }
    return users;
  }

  $scope.calcAll = function(){
    // Numero de las preguntas de cada kpi
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
    //Calculo de los valores de cada kpi, con las preguntas como parametro
    $scope.dataUsers = $scope.calcUsers();
    $scope.dataKpi1 = $scope.calcKpi($scope.pregPromesa);
    $scope.dataKpi2 = $scope.calcKpi($scope.pregCompromiso);
    $scope.dataKpi3 = $scope.calcKpi($scope.pregLiderazgo);
    $scope.dataKpi4 = $scope.calcKpi($scope.pregEstrategia);
    $scope.dataKpi5 = $scope.calcKpi($scope.pregComunicacion);
    $scope.dataKpi6 = $scope.calcKpi($scope.pregAprendizaje);
    $scope.dataKpi7 = $scope.calcKpi($scope.pregCooperacion);
    $scope.dataKpi8 = $scope.calcKpi($scope.pregVivir);
    $scope.dataKpi9 = $scope.calcKpi($scope.pregResponsabilidad);
    $scope.dataKpi10 = $scope.calcKpi($scope.pregSeguimiento);
    $scope.dataKpi11 = $scope.calcKpi($scope.pregCondiciones);

  };

  $('[data-toggle="tooltip"]').tooltip();
})

.controller("AddCtrl", function($scope, $routeParams,$location, userSrvc){
  $scope.formProcessing = false;
  $scope.processing = true;
  userSrvc.get($routeParams.id).success(function(data){
    $scope.user = data;
    $scope.processing = false;
  });
  $scope.add = function(){
    $scope.formProcessing = true;
    userSrvc.edit($scope.user._id, $scope.user).success(function(data){
      $scope.formProcessing = false;
      $location.path('/scores/'+ $scope.user._id);
    });
  };
})

.controller("CompaniesCtrl",function($scope, $location, companySrvc){
  $scope.processing = true;
  companySrvc.all().success(function(data){
    $scope.processing = false;
    $scope.companies = data;
  });

  $scope.deleteCompany = function(companyDeleted){
    $scope.processing = true;
    
    companySrvc.delete(companyDeleted._id).success(function(data){
      $scope.processing = false;
      var index = $scope.companies.indexOf(companyDeleted);
      $scope.companies.splice(index,1);
    });
  };
})

.controller("AddCompaniesCtrl", function($scope, $location, companySrvc, userSrvc, $filter){
  $scope.save = function(){
    $scope.processing = true;
    var url = $filter('encodeUri') ($scope.formCompany.name);
    $scope.formCompany.url = 'http://system.fosteringtalent.com/' + url;
    //SET USER AS ADMIN
    $scope.formUser.admin = true;
    //Add ADMIN USER to company

    userSrvc.save($scope.formUser).success(function(data){
      // AFTER USER ADD, CREATE COMPANY
      $scope.formCompany.user = data._id;
      console.log($scope.formCompany)
      companySrvc.save($scope.formCompany).success(function(data){
        console.log(data)
        $scope.processing = false;
        $scope.company = {};
        $location.path('/companies');
        console.log(data)
      });
    });
  };

})

.controller("EditCompaniesCtrl", function($scope, $routeParams, $location, companySrvc){
  $scope.processing = true;

  companySrvc.get($routeParams.id).success(function(data){
    $scope.formCompany = data;
    $scope.processing = false;
  });

  $scope.save = function(){
    $scope.processing = true;
    companySrvc.edit($scope.formCompany._id, $scope.formCompany).success(function(data){
      $scope.processing = false;
      $scope.company = {};
      $location.path('/companies');
    });
  };
})


.controller("PriceCtrl",function(){

})

.controller("UserCtrl",function($scope, $rootScope, AuthToken, userSrvc, companySrvc){
  $scope.processing = true;
  var session = AuthToken.getSession();

  if (session.admin) {

    var companyId = undefined;
    companySrvc.companyByUser(session._id).success(function(data){
      companyId = data._id;

      userSrvc.allByCompany(companyId).success(function(data){
        $scope.processing = false;
        $scope.users = data;
      });      
    });

  } else {
    userSrvc.all().success(function(data){
      $scope.processing = false;
      $scope.users = data;
    });    
  }


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

.controller("AddUserCtrl", function($scope, $routeParams, $location, userSrvc, $http){
  $scope.processing = false;


  $scope.save = function(){
    $scope.processing = true;
    userSrvc.save($scope.formUser).success(function(data){
      $scope.processing = false;
      $location.path('/users');
    });
  };


  $scope.sendMail = function(){

    console.log($scope.formUser.email);
    
    var mailJSON ={
      "key": "yXbOSbsEdGY5XDGY1G4JMw",
      "template_name": "fts-invitacion",
      "template_content": [
      {
        "name": "",
        "content": ""
      }
      ],
      "message": {
        "html": "",
        "text": "",
        "subject": "",
        "from_email": "no-responder@fosterintalent.com",
        "from_name": "Soporte FTS",
        "to": [
        {
          "email": $scope.formUser.email,
          "name": $scope.formUser.user_name,
          "type": "to"
        }
        ],
        "important": false,
        "track_opens": null,
        "track_clicks": null,
        "auto_text": null,
        "auto_html": null,
        "inline_css": null,
        "url_strip_qs": null,
        "preserve_recipients": null,
        "view_content_link": null,
        "tracking_domain": null,
        "signing_domain": null,
        "return_path_domain": null,
        "global_merge_vars": [
        {
          "name": "user_name",
          "content": $scope.formUser.user_name
        },
        {
          "name": "username",
          "content": $scope.formUser.username
        },
        {
          "name": "password",
          "content": $scope.formUser.password
        },
        {
          "name": "company",
          "content": $scope.formUser.company
        },
        {
          "name": "URLEmpresa",
          "content": $scope.formUser.URLEmpresa
        }
        ]
      },
      "async": false,
      "ip_pool": "Main Pool"
    };

    var apiURL = "https://mandrillapp.com/api/1.0/messages/send-template.json";
    $http.post(apiURL, mailJSON,{
      headers: {

      }}).
    success(function(data, status, headers, config) {
      alert('successful email send.');
      $scope.form={};
      console.log('successful email send.');
      console.log('status: ' + status);
      console.log('data: ' + data);
      console.log('headers: ' + headers);
      console.log('config: ' + config);
    }).error(function(data, status, headers, config) {
      console.log('error sending email.');
      console.log('status: ' + status);
    });


  };

})

.controller("HallOfFameCtrl", function(){
  
})

.controller("HallOfFameVoteCtrl", function($scope, userSrvc){
  $scope.processing = true;
  userSrvc.all().success(function(data){
    $scope.processing = false;
    $scope.users = data;
  });
})

.controller("ListUserCtrl", function(){

  //Converter Class 
  var Converter = require("csvtojson").Converter;
  var converter = new Converter({});

  //end_parsed will be emitted once parsing finished 
  converter.on("end_parsed", function (jsonArray) {
     console.log(jsonArray); //here is your result jsonarray 
   });

  //read from file 
  require("fs").createReadStream("./file.csv").pipe(converter);

})

.controller("userScoresCtrl", function($scope, $routeParams,userSrvc){
  $scope.processing = true;
  $('[data-toggle="tooltip"]').tooltip();

  userSrvc.get($routeParams.id).success(function(data){
    $scope.user = data;
    $scope.processing = false;
  });
})

.directive('tooltip', function() {
  return function(scope, element, attrs) {
    console.log(scope, element, attrs, 'aaaaa' )
    element.find('[data-toggle="tooltip"]').tooltip();
  };
});