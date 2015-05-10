function postsCtrl ($scope, $http, $state) {
  console.log('in posts view'+$scope.user);
  console.log($scope.user.firstname);
  $scope.view = 'posts';
  $scope.distance = 0;
  $scope.selectedIndex = 0;
  initialize();
  if($scope.user.firstname == undefined){
    $state.transitionTo('login');
  }
  function getPosts () {
  $http.get('/posts').success(function (res) {
    $scope.posts = res;
    console.log($scope.posts);
  });
}
getPosts();
  $scope.postDetail = function (index) {
    $scope.selectedIndex = index;

    $('#post-detail').openModal();
  }
  $scope.addPostModal = function () {
    $('#add-post').openModal();
  }


  // This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

var placeSearch, autocomplete;
var componentForm = {
street_number: 'short_name',
route: 'long_name',
locality: 'long_name',
administrative_area_level_1: 'short_name',
country: 'long_name',
postal_code: 'short_name'
};

function initialize() {
// Create the autocomplete object, restricting the search
// to geographical location types.
autocomplete = new google.maps.places.Autocomplete(
    /** @type {HTMLInputElement} */(document.getElementById('address')),
    { types: ['geocode'] });
// When the user selects an address from the dropdown,
// populate the address fields in the form.
google.maps.event.addListener(autocomplete, 'place_changed', function() {
  fillInAddress();
});

//to geaocode the address
geocoder = new google.maps.Geocoder();
}

// [START region_fillform]
function fillInAddress() {
// Get the place details from the autocomplete object.
var place = autocomplete.getPlace();

for (var component in componentForm) {
  document.getElementById(component).value = '';
  document.getElementById(component).disabled = false;
}

// Get each component of the address from the place details
// and fill the corresponding field on the form.
for (var i = 0; i < place.address_components.length; i++) {
  var addressType = place.address_components[i].types[0];
  if (componentForm[addressType]) {
    var val = place.address_components[i][componentForm[addressType]];
    document.getElementById(addressType).value = val;
  }
}
}
// [END region_fillform]

// [START region_geolocation]
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var geolocation = new google.maps.LatLng(
        position.coords.latitude, position.coords.longitude);
    var circle = new google.maps.Circle({
      center: geolocation,
      radius: position.coords.accuracy
    });
    autocomplete.setBounds(circle.getBounds());
  });
}
}
// [END region_geolocation]

$scope.addPost = function (post) {
post.ts = moment().format('Do ddd hA');
console.log(post.ts);


var address = document.getElementById('address').value;
post.location = address;
geocoder.geocode( { 'address': address}, function(results, status) {
  if (status == google.maps.GeocoderStatus.OK) {
    post.pos = [results[0].geometry.location.F, results[0].geometry.location.A];
    post.user = $scope.user.email;
    console.log(post);
    $http.post('/posts', post).success(function (res) {
      console.log(res);
      getPosts();
      $('#add-post').closeModal();
    })
  } else {
    alert('Geocode was not successful for the following reason: ' + status);
  }
});
}

$scope.getDistance = function (origin, dest) {
var origin1 = new google.maps.LatLng(origin[1], origin[0]);
var destinationA = new google.maps.LatLng(dest[1], dest[0]);

var service = new google.maps.DistanceMatrixService();
service.getDistanceMatrix(
{
  origins: [origin1],
  destinations: [destinationA],
  travelMode: google.maps.TravelMode.DRIVING,
  unitSystem: google.maps.UnitSystem.METRIC,
  durationInTraffic: true,
  avoidHighways: false,
  avoidTolls: false,
}, callback);

function callback(response, status) {
// See Parsing the Results for
// the basics of a callback function.
    //alert(response.rows[0].elements[0].distance.text);
    $scope.$apply(function () {
      $scope.distance = response.rows[0].elements[0].distance.text;
    })

}
}//end get distance

$scope.getTime = function (ts, id) {
  console.log(ts);
  var timeago = moment(ts).fromNow();
  $('.time-box').append('<span class="time-text black-text">'+timeago+'</span>');
  console.log(timeago);
}

$scope.addRequest = function (id, request) {
  var reqobj = {
    postId : id,
    req : request,
    user : $scope.user.email
  }
  $http.post('/sendrequest', reqobj).success(function (res) {
    console.log(res);
    $('.type-request').hide();
  });
}

$scope.getRequest = function () {
  $http.get('/getrequests').success(function (res) {
    $scope.requests = res;
    console.log($scope.requests);
  })
}

$scope.selectRequest = function (uEmail) {
  console.log(uEmail);

  $http.post('/selectReq', {email:uEmail}).success(function (res) {
    console.log(res);
  })
}

}
