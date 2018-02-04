// Array of the places with title, latitude, longitude, and observable show for list 
var places =[
	{
		title: 'Pauls Creamery',
		location: {
			lat: 8.519388,
			lng: 76.959950
		},
		show: ko.observable(true)
	},
	{
		title: 'Baskin Robins',
		location: {
			lat: 8.516847,
			lng: 76.958143
		},
		show: ko.observable(true)
	},
	{
		title: 'Subway',
		location: {
			lat: 8.516704,
			lng: 76.958362
		},
		show: ko.observable(true)
	},
	{
		title: 'Pizza Hut',
		location: {
			lat: 8.516646,
			lng: 76.958419
		},
		show: ko.observable(true)
	},
	{
		title: 'Cafe Coffee Day',
		location: {
			lat: 8.516261,
			lng: 76.960378
		},
		show: ko.observable(true)
	},
	{
		title: 'Azad Bread Factory',
		location: {
			lat: 8.523045,
			lng: 76.958031
		},
		show: ko.observable(true)
	},
	{
		title: 'Supreme Upper Crust',
		location: {
			lat: 8.522852,
			lng: 76.951332
		},
		show: ko.observable(true)
	},
	{
		title: 'Entree',
		location: {
			lat: 8.522375,
			lng: 76.950474
		},
		show: ko.observable(true)
	},
	{
		title: 'Cafe Mojo',
		location: {
			lat: 8.523985,
			lng: 76.953414
		},
		show: ko.observable(true)
	},
	{
		title: '1976 Cafe Bistro',
		location: {
			lat: 8.494259,
			lng: 76.947047
		},
		show: ko.observable(true)
	},
	{
		title: 'Buhari Hotel',
		location: {
			lat: 8.479033,
			lng: 76.947397
		},
		show: ko.observable(true)
	}
];

// viewModel with observable array of places & markers
var viewModel = {
	places: ko.observableArray(places),
	markers: ko.observableArray(markers),
	unavailable: ko.observable(false)
};

viewModel.query = ko.observable('');

// Function to search and filter according to the search box
viewModel.search = function() {
    var value = viewModel.query().toLowerCase();
    console.log(value);
    if(value.length === 0) {
        viewModel.showAll(true);
    }
    else  {
        ko.utils.arrayFilter(viewModel.places(), function(place) {		
        	var title = place.title.toLowerCase();
        	if (title.indexOf(value) > -1) {
        		place.show(true);
        		// Sets markers visibility to true
        		for(var i = 0; i < viewModel.markers().length; i++) {
        			if(title == viewModel.markers()[i].title.toLowerCase()) {
        				viewModel.markers()[i].setVisible(true);
        				populateInfoWindow(viewModel.markers()[i]);
        			}
        		}
        	}		
        	else {
            	place.show(false);
            	// Sets markers visibility to false
            	for(var i = 0; i < viewModel.markers().length; i++) {
        			if(title == viewModel.markers()[i].title.toLowerCase()) {
        				viewModel.markers()[i].setVisible(false);
        			}
        		}
        	}
		});    
    }
};

// Function to make sure the list is visible
viewModel.showAll = function(val) {
    for (var i = 0; i < viewModel.places().length; i++) {
      viewModel.places()[i].show(val);
    }
};

// Function to decide how click is handled
viewModel.handle = function(location) {
	var self = this;
	for(var i = 0; i < viewModel.markers().length; i++) {
		// Setting marker visibility to true
		viewModel.markers()[i].setVisible(true);
		if(location.title == viewModel.markers()[i].title) {
			populateInfoWindow(viewModel.markers()[i]);
		}
		else {
			// Settine marker visibility to false
			viewModel.markers()[i].setVisible(false);
		}
	}
};

ko.applyBindings(viewModel);