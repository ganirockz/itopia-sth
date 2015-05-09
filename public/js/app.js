$('#modal1').openModal();

angular.module('itopia', [ ])
.controller('appctrl', ['$scope', '$http', function ($scope, $http) {
  //console.log('hello world!');
  var now = moment();
  $http.get('/itopia').success(function (res) {
    $scope.posts = res;
  });

  $scope.addPost = function (post) {
    //console.log(post);
    $http.post('/itopia', post).success(function (res) {
      console.log(res);
      $scope.posts = res;
    })
  }
  }]);
;
