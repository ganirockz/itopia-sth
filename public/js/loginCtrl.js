function loginCtrl ($scope, $http, $state) {
  console.log('in login view');
  $scope.view = 'login';

  $scope.signUpModel = function () {
    $('#modal1').openModal();
  }

  $scope.loginModel = function () {
    $('#modal2').openModal();
  }
  initialize();
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


  $scope.signUp = function (newuser) {
    console.log(newuser);
    var address = document.getElementById('address').value;
    newuser.location = address;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        newuser.pos = [results[0].geometry.location.F, results[0].geometry.location.A];

        console.log(newuser);
        $http.post('/signup', newuser).success(function (res) {
          console.log(res);
          $scope.$parent.user = res;
          $state.transitionTo('posts');
        })
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
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
}
