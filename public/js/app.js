angular.module('itopia', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/login");
  //
  // Now set up the states
  $stateProvider
    .state('login', {
      url: "login",
      templateUrl: "views/login.html",
      controller : 'loginCtrl'
    })
    .state('posts', {
      url: "/posts",
      templateUrl: "views/posts.html",
      controller: 'postsCtrl'
    })


})
.run(function ($state) {
  $state.transitionTo('login');
})
.controller('appctrl', ['$scope', '$http', function ($scope, $http) {
  //console.log('hello world!');
  $scope.view = 'app';
  var now = moment();
  $scope.user = {};


  $scope.addPost = function (post) {
    //console.log(post);
    $http.post('/itopia', post).success(function (res) {
      console.log(res);
      $scope.posts = res;
    })
  }
  }])
  .controller('loginCtrl', ['$scope', '$http', '$state', loginCtrl])
  //posts controller
  .controller('postsCtrl', ['$scope', '$http', '$state', postsCtrl])
;
