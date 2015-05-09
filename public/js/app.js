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
  .controller('loginCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
    console.log('in login view');
    $scope.view = 'login';

    $scope.signUpModel = function () {
      $('#modal1').openModal();
    }

    $scope.loginModel = function () {
      $('#modal2').openModal();
    }

    $scope.signUp = function (newuser) {
      console.log(newuser);
      $http.post('/signup', newuser).success(function (res) {
        console.log(res);
        $scope.$parent.user = res;
        $state.transitionTo('posts');
      })
    }
    $scope.login = function (user) {
      $http.post('/login', user).success(function (res) {
        console.log(res);
        if(res[0]){
          $scope.$parent.user = res[0];
          $state.transitionTo('posts');
        }
      })
    }
  }])
  .controller('postsCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
    console.log('in posts view'+$scope.user);
    console.log($scope.user.firstname);
    $scope.view = 'posts';

    if($scope.user.firstname == undefined){
      $state.transitionTo('login');
    }

    $http.get('/posts').success(function (res) {
      $scope.posts = res;
      console.log($scope.posts);
    });

    $scope.postDetail = function () {
      $('#post-detail').openModal();
    }

  }])
;
