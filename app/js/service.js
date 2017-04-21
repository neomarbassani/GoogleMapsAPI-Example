'use strict';

app.service('MapServices', ['$q', function($q) {
    var geocoder = new google.maps.Geocoder;
    var placesService = new google.maps.places.PlacesService(document.createElement('div'));

    var location = null;

    return {
        setLocation(position) {
            location = new google.maps.LatLng(position.latitude, position.longitude);
        },

        setAddress(address) {
            var d = $q.defer();

            geocoder.geocode({'address': address, 'region': 'BR'},
                function(r, status) {
                    if (status == 'OK') {
                        location = r[0].geometry.location;
                        d.resolve({ latitude: location.lat(), longitude: location.lng() })
                    } else {
                        d.reject(status)
                    }
                });

            return d.promise;
        },

        search() {
            var d = $q.defer();
            var places = [];

            var req = {
                    location: location,
                    radius: '10000',
                    types: ['car_repair']
            };
            placesService.nearbySearch(req,
                function(r, status, pagination) {
                    if (status == 'OK') {
                        places = places.concat(r);

                        if(pagination.hasNextPage) {
                            pagination.nextPage();
                        }else {
                            d.resolve(places)
                        }
                    } else {
                        d.reject(status)
                    }
                });
            return d.promise;
        },

        get(placeId) {
            var d = $q.defer();

            placesService.getDetails({ placeId: placeId },
                function(r, status) {
                    if (status == 'OK') {
                        d.resolve(r)
                    } else {
                        d.reject(status)
                    }
                });
            return d.promise;
        }
    }
}]);
