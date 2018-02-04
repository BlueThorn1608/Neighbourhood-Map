var map;
var infowindow;
// Empty Markers array
var markers = []; 
var latlng = {
	lat: 8.514398,
	lng: 76.954665
};

// Function to Initialise Map
function initMap() {

	var styles = [
          {
            featureType: 'water',
            stylers: [
              { color: '#19a0d8' }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [
              { color: '#ffffff' },
              { weight: 6 }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
              { color: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -40 }
            ]
          },{
            featureType: 'transit.station',
            stylers: [
              { weight: 9 },
              { hue: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [
              { visibility: 'off' }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [
              { lightness: 100 }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
              { lightness: -100 }
            ]
          },{
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
              { visibility: 'on' },
              { color: '#f0e4d3' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -25 }
            ]
          }
        ];

	if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
		map = new google.maps.Map(document.getElementById('map'), {
			center: latlng,
			zoom: 14
		});
	}
  else {
    viewModel.unavailable(true);
  }

	infowindow = new google.maps.InfoWindow();

  // Declare different icons for defaultIcon and highlightedIcon events
	var defaultIcon = makeMarkerIcon('d32323');
	var highlightedIcon = makeMarkerIcon('51b249');

	var mapSpots = viewModel.places();
  var length = mapSpots.length;

	for(var i = 0; i < length; i++) {
    var position = mapSpots[i].location;
		var title = mapSpots[i].title;
    // Going through the places array and creating the respective markers array
		var marker = new google.maps.Marker({
			position: position,
			title: title,
			map: map,
			animation: google.maps.Animation.DROP,
			icon: defaultIcon,
			id: i
		});
    // Push each arker into the observable markers array
		markers.push(marker); 
    // Event Listeners are added
		marker.addListener('mouseover', function() {
			this.setIcon(highlightedIcon);
		});
		marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});
    // Event Listener to open the infowindow
		marker.addListener('click', function() {
			populateInfoWindow(this);
		});
	}
}

// Function to create marker according to different color
function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor + '|40|_|%E2%80%A2', 
		new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34)
  );
  return markerImage;
}

// Function to open infowindow and add info from wikipedia to infowindow
function populateInfoWindow(marker) {
	
	if(infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div class="marker-title">' + marker.title + '</div>');
    // View the Infowindow
		infowindow.open(map, marker);
		infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
      // Making the rest of the markers visible
      for(var i = 0; i < markers.length; i++) {
        markers[i].setVisible(true);
      }
		});
	}

  // Event Listener for wikipedia api and information
	marker.addListener('click', loadData(marker, infowindow));

  // Animation to make the markers bounce
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function() {
    marker.setAnimation(null);
  }, 700);

}

// Function to load wikipedia api and information 
function loadData(marker, infowindow) {
  var $information = $('.info');
  $information.text = "";
  var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
  $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function(response){
          $information.text = "";
          var text = response[2];
          console.log(text);
          infowindow.setContent('<div class="marker-title">' + marker.title + '</div>' + '<p class="info">' + text + '</p>');
        }
    }).fail(function(){
        infowindow.setContent('<div class="info">Sorry, Wikipedia was unable to load. Check your Internet connection and try again.</div>');
    });
    return false;
}

// Fallback error handling method for Google Maps
mapError = function () {
  viewModel.unavailable(true);
};