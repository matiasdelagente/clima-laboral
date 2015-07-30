angular.module("stockApp")

.factory("scoreSrvc",function($http){
  var score = {}
  score.getAll = function(){
    return $http.get('/api/scores')
  }
  score.add = function(scores){
    console.log(scores)
    return $http.post("/api/scores", scores)
  }
  return score
})
