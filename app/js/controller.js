'use strict';

app.controller('MapCtrl', ['$scope', '$filter', 'MapServices', function($scope, $filter, MapServices){
    var places = [];
    if ("geolocation" in navigator) { $scope.canUseLocation = true; }

    $scope.markerOptions = { draggable: false }
    $scope.minRating = 0;
    $scope.places = null;
    $scope.place = null;
    $scope.map = null; // { center: { latitude: 45, longitude: -73 }, zoom: 8 };

    var initMap = function(coords) {
        $scope.map = {
            center: coords,
            zoom: 15
        }
    }

    $scope.filterPlaces = function(e) {
        $scope.places = [];
        angular.forEach(places, function(p) {
            if (p.rating >= e.rating) {
                $scope.places.push(p);
            }
        });
    }

    $scope.getMarkerPosition = function(location) {
        return({ latitude: location.lat(), longitude: location.lng() });
    }

    $scope.selectPlace = function(id, $index) {
        MapServices.get(id)
            .then(function(p) {
                $scope.place = p;
                $scope.place.selected = $index;
            }, function(e) {
                console.error(e);
            })
    }

    $scope.selectMarker = function(e) {
        MapServices.get(e.key)
            .then(function(p) {
                var infoContent =
                    `<div class="infowindow">
                        <div class="title">` + p.name + `</div>
                        <div>` + p.formatted_phone_number + `</div>
                        <div>` + p.vicinity + `</div>
                    </div>`;

                var infoWindow = new google.maps.InfoWindow({ content: infoContent });
                infoWindow.open(e.map, e);
            }, function(e) {
                console.error(e);
            })
    }

    $scope.getLocation = function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            MapServices.setLocation(position.coords);
            initMap({ latitude: position.coords.latitude, longitude: position.coords.longitude });
            $scope.search();
        });
    }

    $scope.find = function(address) {
        MapServices.setAddress(address)
            .then(function(coords) {
                initMap(coords);
                $scope.search();
            }, function(e) {
                console.error(e);
            })
    };

    $scope.search = function() {
        $scope.minRating = 0;
        $scope.places = null;
        $scope.place = null;
        MapServices.search()
            .then(function(p) {
                $scope.places = p;
                places = p;
            }, function(e) {
                console.error(e);
            })
    }
}]);
