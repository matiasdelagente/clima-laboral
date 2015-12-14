angular.module("climaLaboral")

.controller("MainCtrl", function($scope, $rootScope, $location, Auth, $route){
  $scope.company = "Fostering Talent";
  $scope.areas = ["Recursos Humanos", "Contaduria",  "Sistemas", "Marketing", "Administracion", "Compras", "Legales"];
  $scope.roles = ["Gerente", "Secretario", "Asistente", "Contador", "Abogado", "Pasante", "Escriba"];
  $scope.assessments = ["Clima Laboral", "Bienestar Organizacional"];

  $scope.loggedIn = Auth.isLoggedIn();
  $rootScope.$on('$routeChangeStart',function(){
    if(Auth.isLoggedIn()){
      $scope.loggedIn = true;
    }
    else {
      $scope.loggedIn = false;
      $location.path('/login');
    }
    Auth.getUser()
      .success(function(data){
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

.controller("ScoresCtrl", function($scope, scoreSrvc, userSrvc, AuthToken){
  var session = AuthToken.getSession();

  if (!session.company) session.company = {name :'Todas las Compañias'};

  $scope.processing = true;
  $scope.formUser = {area: null, role: null};
  $scope.questionsMotivadores = [
  'En '+ session.company.name +' la comunicación es abierta y honesta en ambos sentidos (del jefe al colaborador y del colaborador al jefe). (Comunicación)',
  ''+session.company.name+' está realizando los cambios necesarios para competir eficientemente. (Estrategia)',
  'Creo que habrá cambios positivos como resultado de esta encuesta. (Seguimiento del Cuestionario)',
  'Mi trabajo aprovecha muy bien mis talentos, habilidades y aptitudes. (Aprendizaje y Desarrollo)',
  'Tengo confianza en el futuro de '+session.company.name+'. (Estrategia)',
  'Estoy dispuesto a contribuir con soluciones sostenibles para nuestros clientes. (Promesa al Cliente)',
  'En general, estoy satisfecho con el tipo de trabajo que realizo. (Condiciones Laborales)',
  'Recibo la información y comunicación que necesito para realizar mi trabajo efectivamente. (Comunicación)',
  'En general, estoy satisfecho con el intercambio de información y la comunicación en mi área de trabajo. (Comunicación)',
  ''+session.company.name+' me brinda la oportunidad de aprender y desarrollarme profesionalmente. (Aprendizaje y Desarrollo)'
  ];

  if (session.admin && !session.superadmin) {

    userSrvc.usersByCompany(session.company._id).success(function(data){
      $scope.processing = false;
      $scope.users = data;
      $scope.showCompromiso = false;
      $scope.calcAll();
    });

  } else {
    userSrvc.all().success(function(data){
      $scope.processing = false;
      $scope.users = data;
      $scope.showCompromiso = false;
      $scope.calcAll();
    });
  }

  // userSrvc.all().success(function(data){
  //   $scope.processing = false;
  //   $scope.users = data;
  //   $scope.showCompromiso = false;
  //   $scope.calcAll();
  // });

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

.controller("Scores3Ctrl", function($scope, scoreSrvc, userSrvc, AuthToken){
  var session = AuthToken.getSession();

  $scope.processing = true;
  $scope.formUser = {area: null, role: null};

  if (session.admin && !session.superadmin) {
    userSrvc.usersByCompany(session.company._id).success(function(data){
      $scope.processing = false;
      $scope.users = data;
      // console.log(data)
      $scope.showCompromiso = false;
      $scope.calcAll();
    });

  } else {
    userSrvc.all().success(function(data){
      $scope.processing = false;
      $scope.users = data;
      $scope.showCompromiso = false;
      $scope.calcAll();
    });
  }


  // userSrvc.all().success(function(data){
  //   $scope.processing = false;
  //   $scope.users = data;
  //   $scope.showCompromiso = false;
  //   $scope.calcAll();
  // });

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
  };

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

.controller("AddCtrl", function($scope, $routeParams,$location, userSrvc, AuthToken){
  $scope.formProcessing = false;
  // $scope.processing = true;
  var session = AuthToken.getSession();

  $scope.isDemo = !!(session.company) ? session.company.demo : false;

  userSrvc.get($routeParams.id).success(function(data){
    $scope.user = data;
    $scope.company = session.company.name;
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
    var psw = $scope.formUser.password;
    // console.log(psw)
    $scope.processing = true;
    var url = $filter('encodeUri') ($scope.formCompany.name);

    $scope.formCompany.url = 'http://system.fosteringtalent.com/' + url;
    //IF WE HAVE A COMPANY, WE SET USER AS ADMIN
    $scope.formUser.admin = true;

    //Add ADMIN USER to company
    userSrvc.save($scope.formUser).success(function(userData){
      $scope.formUser = userData;

      // AFTER USER CREEATION, CREATE COMPANY AND LINK TO THE USER
      $scope.formCompany.user = userData._id;
      $scope.formCompany.userPsw = psw;

      //RE-SET PASSWORD
      $scope.formUser.password = psw;

      companySrvc.save($scope.formCompany).success(function(companyData){
        $scope.formUser.company = companyData._id;

        userSrvc.edit(userData._id, $scope.formUser).success(function(userResponse){
          //LINK USER TO COMPANY
          $scope.processing = false;
          $scope.company = {};
          $location.path('/companies');
        });
      });
    });
  };

})

.controller("EditCompaniesCtrl", function($scope, $routeParams, $location, companySrvc, userSrvc){
  $scope.processing = true;

  companySrvc.get($routeParams.id).success(function(data){
    $scope.formCompany = data;

    userSrvc.get(data.user).success(function(userData) {
      $scope.formUser = userData;
      $scope.processing = false;
    });
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

.controller("EditAreasAndRolesCtrl", function($scope, AuthToken, $routeParams, $location, companySrvc, areaSrvc, roleSrvc){
  $scope.processing = true;
  $scope.company = AuthToken.getSession().company;
  $scope.newArea = {};
  $scope.newRole = {};

  companySrvc.get($scope.company._id).success(function(data){
    $scope.processing = false;
    $scope.company = data;
    // console.log(data);
  });

  $scope.addArea = function(){
    $scope.addingArea = true;
    $scope.newArea.company = $scope.company._id;

    areaSrvc.save($scope.newArea).success(function(area){

      $scope.company.areas.push(area._id);
      companySrvc.edit($scope.company._id, $scope.company).success(function(company){
        $scope.addingArea = false;
        $scope.company = company;
        $scope.newArea = {};
      });
    });
  };

  $scope.editArea = function(area){
    $scope.formSaving = true;

    areaSrvc.edit(area._id, area).success(function(area){
      $scope.formSaving = false;
    });
  };

  $scope.deleteArea = function(id){
    $scope.areaDel = true;
    areaSrvc.delete(id).success(function(area){
      companySrvc.get($scope.company._id).success(function(data){
        $scope.areaDel = false;
        $scope.company = data;
      });
    });
  };

  $scope.addRole = function(){
    $scope.addingArea = true;
    $scope.newRole.company = $scope.company._id;

    roleSrvc.save($scope.newRole).success(function(role){
      $scope.company.roles.push(role._id);
      companySrvc.edit($scope.company._id, $scope.company).success(function(company){
        $scope.company = company;
        $scope.newRole = {};

        $scope.addingArea = false;
      });
    });
  };

  $scope.editRole = function(role){
    $scope.formSaving = true;
  
    roleSrvc.edit(role._id, role).success(function(role){
      $scope.formSaving = false;
    });
  };

  $scope.deleteRole = function(id){
    $scope.roleDel = true;
    roleSrvc.delete(id).success(function(role){
      companySrvc.get($scope.company._id).success(function(data){
        $scope.roleDel = false;
        $scope.company = data;
      });
    });
  };

})

.controller("CompetencesCtrl", function($scope, AuthToken, $routeParams, $location, companySrvc, competenceSrvc, areaSrvc, roleSrvc){
  $scope.processing = true;
  $scope.company = AuthToken.getSession().company;
  $scope.formCompetence = {};

  //GET COMPANY DATA
  companySrvc.get($scope.company._id).success(function(data){
    $scope.company = data;
    
    console.log($scope.company);

    $scope.selection = {};

    // angular.forEach($scope.company.competencies, function(competence, key) {
    //   var algo = $scope.selection.competence = {id: competence._id}
    //   console.log($scope.selection)
    //   angular.forEach(competence.areas, function(area, key) {
    //     algo = {'area': ids: {"50d5ad": true}}
    //   });
    // });

    areaSrvc.allByCompany($scope.company._id).success(function(areas){
      $scope.allAreas = areas;
      
      roleSrvc.allByCompany($scope.company._id).success(function(roles){
        $scope.allRoles = roles;
        $scope.processing = false;
      });
    });
  });

  $scope.addCompetence = function(){
    $scope.processing = true;
    
    competenceSrvc.save($scope.formCompetence).success(function(competence){
      $scope.adding = false;

      $scope.company.competencies.push(competence._id);
      companySrvc.edit($scope.company._id, $scope.company).success(function(company){
        console.log(company)
        $scope.company = company;
        $scope.formCompetence = {}
      });
    });
  };

  $scope.editCompetence = function(competence){
    $scope.formSaving = true;

    competenceSrvc.edit(competence._id, competence).success(function(competence){
      // $scope.adding = false;
      $scope.formSaving = false;      
    });
  };

  $scope.deleteCompetence = function(id){
    $scope.processing = true;
    competenceSrvc.delete(id).success(function(competence){
      companySrvc.get($scope.company._id).success(function(data){
        $scope.processing = false;
        $scope.company = data;
      });
    });
  };

})

.controller("organizationChartCtrl", function($scope, $routeParams, $location, companySrvc, userSrvc, AuthToken){
  $scope.processing = true;
  $scope.hasChanged = false;
  $scope.usersNewVal = [];
  $scope.users = [];

  var session = AuthToken.getSession();
  var usersChanged = [];

  //GET ALL USER FROM COMPANY
  if (session.admin && !session.superadmin) {

    var companyId = undefined;
    userSrvc.usersByCompany(session.company._id).success(function(data){
      $scope.users = data;
      $scope.items = getUsersHierarchy(data);
      $scope.processing = false;

    });

  } else {
    userSrvc.all().success(function(data){
      $scope.users = data;
      $scope.items = getUsersHierarchy(data);
      $scope.processing = false;
    });
  }

  $scope.$watch(function(scope) { return scope.items }, function(newVal, oldVal){
    //RESET VAR THAT STORE HIERARCHY CHANGES
    usersChanged.length = 0;

    //GET USERS THAT NEED TO BE UPDATED FROM HIERARCHY IN CASE THAT NEW VAL <> FROM OLDVAL
    if (newVal != oldVal && oldVal.length > 0 ) {
      $scope.hasChanged = true;
      $scope.usersNewVal = newVal;
    }

  });

  findUserChanged = function(newUsers, user) {
    angular.forEach(newUsers, function(newUser, key) {
      if (!newUser.admin) {
        // console.log(newUser.children)
        if (!!newUser.children) {

          if (user._id == newUser.item.id) {
            // console.log('coincidencia', newUser.item.text)
            // console.log(user, newUser, typeof(user.childrens), typeof(user.children))

            if (typeof(user.children) == 'object') {
              //NO TENGO HIJOS EN DB, PERO SI EN NEW USER
              // console.info(newUser.children, user.childrens)
              if (newUser.children.length != user.children.length) {
                console.info('HIJOS DIFERENTES, TENGO QUE HACER UN UPDATE DE ', newUser.item.text);
                usersChanged.push({id:user._id, 'childrens':newUser.children})
              } else {
                console.info('MISMA CANTIDAD DE HIJOS, TENGO QUE HACER UN BUCLE PARA VER SI HAY UPDATE DE ', newUser.item.text)
              }
            } else {
              //EL NODO NUEVO TIENE HIJOS, PERO ANTES NO ESTABAN
              console.info('ANTES NO TENIA HIJOS, AHORA HAY UPDATE DE ', newUser.item.text)
              usersChanged.push({id:user._id, 'childrens':newUser.children});
            }
            return;
          } else {
            findUserChanged(newUser.children, user)
          }
        } else {
          if (user._id == newUser.item.id) {
            // console.log('coincidencia', newUser.item.text, user, newUser)
            if (typeof(user.children) == 'object' && user.children.length > 0 ) {
              //NEW USER DOESNT HAVE CHILDS, OLD USER HAS SO WE CLEAN DB USER CHILDS
              console.info('BORRAR HIJOS DE ' + newUser.item.text);
              usersChanged.push({id:user._id, 'childrens':[]});
            }
            return;
          }
        }
      }
    });
  }

  //GET COMPANY USERS AS AN ARRAY SUITABLE FOR NESTABLE.JS
  var alreadyInHierarchy = [];  //TO STORE USERS THAT ARE ALREADY IN THE HIERARCHY
  getUsersHierarchy = function(users) {
      var data = [];
      var isChildren = [];
      // console.log('users', users)
      angular.forEach(users, function(user, key) {
        // console.log('iteration ' + key, user)
        if (!user.admin && alreadyInHierarchy.indexOf(user._id) < 0) {
          if (!!user.children) {
            var childs = [];

            angular.forEach(user.children, function(child, key) {
              // console.log(child, $scope.users)
              var el = $.grep($scope.users, function(e){ return e._id == child; })
              // console.log(el)
              childs.push(el[0])
            });
            // console.log(user, childs)
            data.push({'item' : {'id':user._id, text: user.name + " " + user.lastname} , 'children': getUsersHierarchy(childs) });
          } else {
            data.push({'item' : {'id':user._id, text: user.name + " " + user.lastname}, 'children': [] })
          }
          alreadyInHierarchy.push(user._id)
        }

      });
      return data;
  }

  $scope.save = function(){
    $scope.processing = true;
    $scope.hasChanged = false;

    angular.forEach($scope.users, function(user, key) {
        // var userChanged = findUserChanged(newVal, oldVal);
      findUserChanged($scope.usersNewVal, user);
    });

    //STORE NEW VALUES FOR EVERY USER THAT HAS CHANGED
    angular.forEach(usersChanged, function(userChanged, key) {
      var childrens = [];

      angular.forEach(userChanged.childrens, function(childs, key) {
        // console.log(childs, key);
        childrens.push(childs.item.id)
      });

      // console.log('saving user', userChanged, childrens);

      userSrvc.setChildrens(userChanged.id, childrens).success(function(data){
        // console.log('after save', data)
        $scope.processing = false;
        $location.path('/organigrama');
      });
    });
  };
})

.controller("edScores2Ctrl", function($scope, $routeParams, $location, companySrvc, userSrvc){
  $scope.processing = true;

  angular.module('plot', ['ui.load']);

  uiLoad.load( [   '../libs/jquery/flot/jquery.flot.js',
                    '../libs/jquery/flot/jquery.flot.pie.js',
                    '../libs/jquery/flot/jquery.flot.resize.js',
                    '../libs/jquery/flot.tooltip/js/jquery.flot.tooltip.min.js',
                    '../libs/jquery/flot.orderbars/js/jquery.flot.orderBars.js',
                    '../libs/jquery/flot-spline/js/jquery.flot.spline.min.js']
                    ).then(function() {

    var plot = $.plot("#graph1",
      [
        {label:'Excelente', data:10},
        {label:'Muy Bueno',data:20},
        {label:'Bueno',data:30},
        {label:'Regular',data:30},
        {label:'Deficiente',data:10}
      ],
      {
        series: { pie: { show: true, innerRadius: 0.5, stroke: { width: 0 }, label: { show: true, threshold: 0.05 } } },
        colors: ['#761c19','#f05050','#fad733','#27c24c','#4cae4c'],
        grid: { hoverable: true, clickable: true, borderWidth: 0, color: '#ccc' },
        tooltip: false,
        tooltipOpts: { content: '%s: %p.0%' }
      }
    );

    var plot2 = $.plot("#graph2",
      [
        {label:'Excelente', data:20},
        {label:'Muy Bueno',data:25},
        {label:'Bueno',data:35},
        {label:'Regular',data:15},
        {label:'Deficiente',data:5}
      ],
      {
        series: { pie: { show: true, innerRadius: 0.5, stroke: { width: 0 }, label: { show: true, threshold: 0.05 } } },
        colors: ['#761c19','#f05050','#fad733','#27c24c','#4cae4c'],
        grid: { hoverable: true, clickable: true, borderWidth: 0, color: '#ccc' },
        tooltip: false,
        tooltipOpts: { content: '%s: %p.0%' }
      }
    );

    var plot3 = $.plot("#graph3",
      [
        { data: [[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]], label: 'Unique Visits', points: { show: true } },
        { data: [["Recursos Humanos",4],[1,4.5],[2,7],[3,4.5],[4,3],[5,3.5],[6,6],[7,3],[8,4],[9,3]], label: 'Page Views', bars: { show: true, barWidth: 0.6, fillColor: { colors: [{ opacity: 0.2 }, { opacity: 0.4}] } } }
      ],
      {
        colors: [ '#23b7e5','#27c24c' ],
        series: { shadowSize: 2 },
        xaxis:{ font: { color: '#ccc' } },
        yaxis:{ font: { color: '#ccc' } },
        grid: { hoverable: true, clickable: true, borderWidth: 0, color: '#ccc' },
        tooltip: true,
        tooltipOpts: { content: '%s of %x.1 is %y.4',  defaultTheme: false, shifts: { x: 0, y: 20 } }
      }
    );

    $scope.processing = false;
    console.log('graph1 done');
  });

})


.controller("PriceCtrl",function(){

})

.controller("UserCtrl",function($scope, $rootScope, AuthToken, userSrvc, companySrvc){
  $scope.processing = true;
  var session = AuthToken.getSession();

  if (session.admin && !session.superadmin) {

    var companyId = undefined;

    userSrvc.usersByCompany(session.company._id).success(function(data){
      $scope.processing = false;
      $scope.users = data;
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

.controller("AddUserCtrl", function($scope, $routeParams, $location, userSrvc, $http, AuthToken){
  $scope.processing = false;
  var session = AuthToken.getSession();

  $scope.save = function(){
    $scope.processing = true;

    if (session.admin && !session.superadmin) {
      // $scope.formUser.admin = false;
      $scope.formUser.company = session.company._id;
      $scope.formUser.companyName = session.company.name;

      userSrvc.usersByCompany(session.company._id).success(function(data){

        //IF THERE'S MORES USERS THAT ALLOWED, DO NOT ADD THE USER
        if(data.length >= session.company.maxUsers) {
          alert('EMPRESA DEMO, NO SE PUEDEN CREAR MAS DE ' + session.company.maxUsers + ' USUARIOS');
          $scope.processing = false;
          $location.path('/users');
          return false;
        }
      });
    }

    userSrvc.save($scope.formUser).success(function(data){

      $scope.processing = false;
      $location.path('/users');
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
    element.find('[data-toggle="tooltip"]').tooltip();
  };
});
