angular.module("stockApp")

.factory("scoreSrvc",function($http){
  var score = {}
  score.getAll = function(){
    return $http.get('/scores')
  }
  score.add = function(scores){
    console.log(scores)
    return $http.post("/scores", scores)
  }
  return score
})
