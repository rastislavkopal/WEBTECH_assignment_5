var map;
var coordinatesFei = { lat: 48.151776, lng: 17.073353 };
var directionsDisplay, directionsService;
var placeLat,placeLng;
var infowindow;

function initMap() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsService = new google.maps.DirectionsService();

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: coordinatesFei
    });

    const panorama = new google.maps.StreetViewPanorama(
        document.getElementById("streetview"),
        {
          position: coordinatesFei,
          pov: {
            heading: 34,
            pitch: 10,
          },
        }
      );
    map.setStreetView(panorama);
      
    var markerFei = new google.maps.Marker({
      position: coordinatesFei,
      map: map,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        labelOrigin: new google.maps.Point(20, 45)
      },
      label: {
        text: "FEI STU",
        color: "#C70E20",
        fontWeight: "bold"
      }
    });

    // Add popup on click for fei stu
    infowindow = new google.maps.InfoWindow({
        content:"Fakulta Elektrotechniky a Informatiky<br>48°09'08.1N<br> 17°04'24.5E"
    });
    google.maps.event.addListener(markerFei, 'click', function() {
        infowindow.open(map,markerFei);
    });


    const input = document.getElementById("pac-input");
    const autocomplete = new google.maps.places.Autocomplete(input);
    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo("bounds", map);

    var marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29),
    });
    autocomplete.addListener("place_changed", () => {
    infowindow.close();
    marker.setVisible(false);
    place = autocomplete.getPlace();

    if (!place.geometry) {// not existing place
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
    
    if (place.geometry.viewport) { // If the place has a geometry, then present it on a map.
      placeLat = place.geometry.location.lat();
      placeLng = place.geometry.location.lng();
    } 
  });
}


function calcRoute(){
    directionsDisplay.setMap(map);
    var end;
    if (placeLng == null || placeLat == null){
        window.alert("Defaultna cesta je: Prešov. :)");
        end = new google.maps.LatLng(49.002193, 21.238038);
    }
    else{
        end = new google.maps.LatLng(placeLat, placeLng);
    }
    
    var request = {
        origin: coordinatesFei,
        destination: end,
        travelMode: document.querySelector("input[name=travelMode]:checked").value
    };
    
    directionsService.route(request, function(response, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(response);
            document.getElementById("distance").innerHTML = "Vzdialenost: " + response.routes[0].legs[0].distance.value/1000 + " km";
            document.getElementById("distance").style.display = "block";
            // placeLng = null;placeLat = null;
        } else {
            alert("directions request failed, status=" + status)
        }
    });
    google.maps.event.addDomListener(window, "load", initMap);
}

function searchBusStops()
{
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: coordinatesFei,
      radius: 500,
      type: ['transit_station']
    }, callback);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    }
}
  
function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      draggable: true,
      icon: {
        url: "https://img.icons8.com/cotton/24/000000/bus--v2.png",
        labelOrigin: new google.maps.Point(20, 45)
      },
    });
  
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent( place.name + ": " + place.rating);
      infowindow.open(map, this);
    });
}