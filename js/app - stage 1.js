/*
 * Neighborhood Map Project
 * Project 5 of Front-End Developer Nanodegree
 *
 * Author:  Candace McCall
 * Date:    06/08/2015
 *
 * Revisions:
 *
 * Date		Description
 * 06/08/2015	Initial draft
 *
 */

//  Declare global map variable
var	map;    

function initializeMap() {

  //var locations;

  var mapOptions = {
    //disableDefaultUI: true
	  center: { lat: 36.035443, lng: -86.80515},
	  zoom: 15
  };

  // This next line makes `map` a new Google Map JavaScript Object and attaches it to
  // <div id="map">, which is appended as part of an exercise late in the course.
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  //google.maps.event.addDomListener(window, 'load', initializeMap);

  /*
  locationFinder() returns an array of every location string from the JSONs
  written for bio, education, and work.
  */
  //function locationFinder() {

    // initializes an empty array
    //var locations = [];

    // adds the single location property from bio to the locations array
    //locations.push(bio.contacts.location);

    // iterates through school locations and appends each location to
    // the locations array
    //for (var school in education.schools) {
      //locations.push(education.schools[school].location);
    //}

    // iterates through work locations and appends each location to
    // the locations array
    //for (var job in work.jobs) {
      //locations.push(work.jobs[job].location);
    //}

    //return locations;
  //}

  /*
  createMapMarker(placeData) reads Google Places search results to create map pins.
  placeData is the object returned from search results containing information
  about a single location.
  */
  ///function createMapMarker(placeData) {

    // The next lines save location data from the search result object to local variables
    ///var lat = placeData.geometry.location.lat();  // latitude from the place service
    ///var lon = placeData.geometry.location.lng();  // longitude from the place service
    //var name = placeData.formatted_address;   // name of the place from the place service
    //var name = "<b>"+placeData.formatted_address+"</b>";   // name of the place from the place service
    //var bounds = window.mapBounds;            // current boundaries of the map window

    // marker is an object with additional data about the pin for a single location
    //var marker = new google.maps.Marker({
      //map: map,
      //position: placeData.geometry.location,
      //title: name
    //});

    // infoWindows are the little helper windows that open when you click
    // or hover over a pin on a map. They usually contain more information
    // about a location.
    //var infoWindow = new google.maps.InfoWindow({
      //content: name
    //});

    // hmmmm, I wonder what this is about...
    //google.maps.event.addListener(marker, 'click', function() {
      //// your code goes here!
      //infoWindow.open(map,marker);
    //});

    // this is where the pin actually gets added to the map.
    // bounds.extend() takes in a map location object
    //bounds.extend(new google.maps.LatLng(lat, lon));
    // fit the map to the new marker
    //map.fitBounds(bounds);
    // center the map
    //map.setCenter(bounds.getCenter());
  }

  /*
  callback(results, status) makes sure the search returned results for a location.
  If so, it creates a new map marker for that location.
  */
  //function callback(results, status) {
    //if (status == google.maps.places.PlacesServiceStatus.OK) {
      //createMapMarker(results[0]);
    //}
  //}

  /*
  pinPoster(locations) takes in the array of locations created by locationFinder()
  and fires off Google place searches for each location
  */
  //function pinPoster(locations) {

    // creates a Google place search service object. PlacesService does the work of
    // actually searching for location data.
    //var service = new google.maps.places.PlacesService(map);

    // Iterates through the array of locations, creates a search object for each location
    //for (var place in locations) {

      // the search request object
      //var request = {
        //query: locations[place]
      //};

      // Actually searches the Google Maps API for location data and runs the callback
      // function with the search results after each search.
      //service.textSearch(request, callback);
    //}
  //}

  // Sets the boundaries of the map based on pin locations
  //window.mapBounds = new google.maps.LatLngBounds();

  // locations is an array of location strings returned from locationFinder()
  //locations = locationFinder();

  // pinPoster(locations) creates pins on the map for each location in
  // the locations array
  //pinPoster(locations);

//}


// Initialize map when page loads.
////window.addEventListener('load', initializeMap);

// Vanilla JS way to listen for resizing of the window
// and adjust map bounds
//window.addEventListener('resize', function(e) {
  // Make sure the map bounds get updated on page resize
  //map.fitBounds(mapBounds);
//});
/*
 * View Model
 */
var ViewModel = function() {
    var self = this;
    this.restaurantList = ko.observableArray([]);
    this.searchFilter = ko.observable("");
    //this.resultSearch = ko.observable("Candy");
    this.resultSearch = ko.computed(function() {
	return self.searchFilter();
    },this);
    this.resultList = ko.computed(function() {
	if (self.searchFilter().length > 0 ) {
	    console.log("hiding all")
	    for (var i = 0; i < self.restaurantList().length; i++) {
		self.restaurantList()[i].show(false);
	    }
	    filteredList = $.grep(self.restaurantList(), function(restaurant) {
		var filter = self.searchFilter().toLowerCase();
		//console.log("restaurant ",restaurant.name());
		return (restaurant.name().toLowerCase().indexOf(filter) != -1);
	    });
	    console.log("showing "+filteredList.length);
	    for (i = 0; i < filteredList.length; i++) {
		console.log("should show "+filteredList[i].name());
		for (var j = 0; j < self.restaurantList().length; j++) {
		    if (filteredList[i].name() == self.restaurantList()[j].name()) {
			self.restaurantList()[j].show(true);
		    }
		}
	    }
	}
    });


};
var listViewModel = new ViewModel();
//ko.applyBindings(new ViewModel());
ko.applyBindings(listViewModel);
/*
 * Restaurant Model
 *
 * Model object for restaurant
 */
var model = {
    restaurantList: [],
    restaurant: function(name,address,crossStreet,latitude,longitude,
		formattedPhone,url,menuUrl,mobileMenuUrl,distance) {
	this.name = name;
	this.address = address;
	this.crossStreet = crossStreet;
	this.latitude = latitude;
	this.longititude = longitude;
	this.formattedPhone = formattedPhone;
	this.url = url;
	this.menuUrl = menuUrl;
	this.mobileMenuUrl = mobileMenuUrl;
	this.distance = distance;
    },
    initialize: function(client_id,client_secret,latitude,longitude) {
	var foursquareURL = 'https://api.foursquare.com/v2/venues/search' + 
	    '?client_id=' + client_id +
	    '&client_secret=' + client_secret +
	    '&v=20150610' +
	    '&ll=' + latitude + ',' + longitude +
	    '&query=restaurant';
	console.log("initializing");
	$.getJSON(foursquareURL, function (data) {
	    console.log(data);
	    var restaurants = data.response.venues;
	    for (var i = 0; i < restaurants.length; i++) {
		var foursquareRestaurant = restaurants[i];
		var menuURL = '';
		var mobileMenuURL = '';
		if (foursquareRestaurant.hasMenu == true) {
		    menuURL = foursquareRestaurant.menu.url;
		    mobileMenuURL = foursquareRestaurant.menu.mobileUrl;
		}
		model.restaurantList.push(new model.restaurant(
		    foursquareRestaurant.name,
		    foursquareRestaurant.location.address,
		    foursquareRestaurant.location.crossStreet,
		    foursquareRestaurant.location.lat,
		    foursquareRestaurant.location.lng,
		    foursquareRestaurant.contact.formattedPhone,
		    foursquareRestaurant.url,
		    menuURL,
		    mobileMenuURL,
		    foursquareRestaurant.location.distance));
		//console.log("name: "+foursquareRestaurant.name);
	    };
	    model.restaurantList.forEach(function(restaurantItem) {
		listViewModel.restaurantList.push(new Restaurant(restaurantItem));
	    });
	//}).error(function(e) {
	    //$nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
	});
	//$.ajax({
	    //url: foursquareURL,
	    //dataType: "json",
	    //success: function (foursquareResponse) {
		//console.log(foursquareResponse);
		//var restaurants = foursquareResponse.response.venues;
		//for (var i = 0; i < restaurants.length; i++) {
		    //var foursquareRestaurant = restaurants[i];
		    //var menuURL = '';
		    //var mobileMenuURL = '';
		    //if (foursquareRestaurant.hasMenu == true) {
			//menuURL = foursquareRestaurant.menu.url;
			//mobileMenuURL = foursquareRestaurant.menu.mobileUrl;
		    //}
		    //model.restaurantList.push(new model.restaurant(
			//foursquareRestaurant.name,
			//foursquareRestaurant.location.address,
			//foursquareRestaurant.location.crossStreet,
			//foursquareRestaurant.location.lat,
			//foursquareRestaurant.location.lng,
			//foursquareRestaurant.contact.formattedPhone,
			//foursquareRestaurant.url,
			//menuURL,
			//mobileMenuURL,
			//foursquareRestaurant.location.distance));
		    //console.log("name: "+foursquareRestaurant.name);
		//};
		//model.restaurantList.forEach(function(restaurantItem) {
		    //listViewModel.restaurantList.push(new Restaurant(restaurantItem));
		//});
	    //}
	//});
	//}).error(function(e) {
	    //$nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
	//});
	//console.log("restaurantList: "+model.restaurantList);
        //return model.restaurantList;
    }
};
/*
 * Restaurant View
 */
var Restaurant = function(data) {
    this.name = ko.observable(data.name);
    this.show = ko.observable(true);
    //this.address = ko.observable(data.address);
    //this.crossStreet = ko.observable(data.crossStreet);
    //this.latitude = ko.observable(data.latitude);
    //this.longititude = ko.observable(data.longitude);
    //this.formattedPhone = ko.observable(data.formattedPhone);
    //this.url = ko.observable(data.url);
    //this.menuUrl = ko.observable(data.menuUrl);
    //this.mobileMenuUrl = ko.observable(data.mobileMenuUrl);
    //this.distance = ko.observable(distance);
};

//console.log("Length "+model.restaurantList.length);
//for (var i = 0; i < model.restaurantList.length; i++) {
    //var item = model.restaurantList[i];
    //console.log("Restaurant "+item.name);
//};

var client_id = 'CNAQFLPKZSX0NZN4QKPR2XZPSGDHSA4AQ5DI5IGUC4SQUDIP';
var client_secret = 'FQ45PW4C3XOMAODSES544LFDU5H3MTF1KMLUQLRTKGHYP40X';
var latitude = '36.035443';
var longitude = '-86.80515';
model.initialize(client_id,client_secret,latitude,longitude);


