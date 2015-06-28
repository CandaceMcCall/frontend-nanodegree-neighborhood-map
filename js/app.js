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
 * 06/25/2015	Add snippet of code to when resizing window
 *		to set height of map
 *		Add use strict
 *		Open only one window at a time
 * 06/27/2015	Don't add urls to content string if null
 * 06/28/2015	Use setCenter rather than pan to marker position
 *
 *
 */

"use strict";
/*
 * Declare global map variable
 */
    var	map;    
    var	listViewModel;    
/*
* Define bounds for map
*/
    window.mapBounds = new google.maps.LatLngBounds();
/*
 * Create global info Window
 */
    var infoWindow = new google.maps.InfoWindow();
/*************************************************************
 *
 * Helper Functions
 *
 *************************************************************
 *
 * Function:  createOfficeContent
 *
 * Creates the content string to use for MasterTools Software 
 * in popup window in GoogleMaps.
 *
 * Parameters:	    None
 */
function createOfficeContent() {
    var contentString = '<div id="content">'+
      '<h4>'+'ONLINE Computing, Inc.'+'</h4>'+
      '<p>'+'MasterTools ERP Software'+'</p>'+
      '<p><a href="'+'http://www.olcinc.com'+'">Website</a></p>'+
      '</div>';
    return contentString;
}
/*
 * Function:  showOfficeInfo
 *
 * Displays MasterTools Software Office info in GoogleMaps popup window.
 * Function is triggered when Office marker is clicked. 
 *
 * Parameters:
 *	marker		Marker 
 *	contentString	Content String to show in GoogleMaps
 *			popup window
 */
function showOfficeInfo(marker,contentString) {
    /*
     * Pan to the position of the marker
     */
    map.setCenter(marker.getPosition());
    /*
     * Bounce the marker to show that it's state has changed
     * Set timeout so it will quit bouncing after a couple seconds
     */
    toggleBounce(marker);
    setTimeout(function(){ toggleBounce(marker); }, 1400);
    /*
     * Set content string on GoogleMaps popup window 
     */
    infoWindow.setContent(contentString);
    /*
     * Open popup window.
     */
    infoWindow.open(map,marker);
}
/*
 *
 * Function:  createRestaurantContent
 *
 * Creates the content string to use in popup window in
 * GoogleMaps.
 *
 * Parameters:
 *	restaurant	Restaurant object
 */
function createRestaurantContent(restaurant) {
    var contentString = '<div id="content">'+
      '<h4>'+restaurant.name()+'</h4>'+
      '<p>'+restaurant.address()+
      '<br>'+restaurant.formattedPhone()+'</p>';
    if (restaurant.url() != null) {
	contentString = contentString.concat(
	'<p><a href="'+restaurant.url()+'">Website</a></p>');
    }
    if (restaurant.menuUrl() !=null) {
	contentString = contentString.concat(
      '<p><a href="'+restaurant.menuUrl()+'">Menu</a></p>');
    }
    contentString = contentString.concat(
		    '<p>Info provided by FourSquare</p>');
    contentString = contentString.concat('</div>');
    return contentString;
}
/*
 * Function:  showRestaurantInfo
 *
 * Displays restaurant info in GoogleMaps popup window.
 * Function is triggered when restaurant marker is clicked or
 * restaurant is clicked in restaurant list view. 
 *
 * Parameters:
 *	marker		Marker 
 *	contentString	Content String to show in GoogleMaps
 *			popup window
 */
function showRestaurantInfo(marker,contentString) {
    /*
     * Set Center to the position of the marker
     */
    map.setCenter(marker.getPosition());
    /*
     * Bounce the marker to show that it's state has changed
     * Set timeout so it will quit bouncing after a couple seconds
     */
    toggleBounce(marker);
    setTimeout(function(){ toggleBounce(marker); }, 1400);
    /*
     * Set content string of GoogleMaps popup window 
     */
    infoWindow.setContent(contentString);
    /*
     * Open popup window.
     */
    infoWindow.open(map,marker);
}
/*
 * Function: toggleBounce
 *
 * Parameters:
 *	marker	    Marker
 */
function toggleBounce(marker) {
    /*
     * Set the animating, stop it
     */
    if (marker.getAnimation() != null) {
	marker.setAnimation(null);
    /*
     * Else animate with bounce
     */
    } else {
	marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}
/*
 * Function:	initializeMap
 *
 * Initialize GoogleMap
 *
 * Parameters:	None
 */
function initializeMap() {
    /*
     * Latitude and Longitude for MasterTools ERP Software
     */
    var officeLatlng;
    try {
	officeLatlng = new google.maps.LatLng(36.035433,-86.80515);
    } catch (e) {
	listViewModel.errorMessage("Unable to load GoogleMaps");
	return;
    }
	
    var mapOptions = {
	disableDefaultUI: true,
	center: officeLatlng,
	zoom: 15
    };
    /* 
     * Create Map with focus on MasterTools office.  Attach to 
     * <div id="map">
     */
    map = new google.maps.Map(document.querySelector('#map-canvas'), mapOptions);
    /*
     * Create marker for office of MasterTools ERP Software
     */
    var content_string = createOfficeContent();

    var marker = new google.maps.Marker({
	position: officeLatlng,
	map: map,
	title: 'ONLINE Computing, Inc (home of MasterTools ERP Software)',
	icon: 'images/mt.png'
    });
    /*
     * Add listener for marker
     */
    google.maps.event.addListener(marker, 'click', (function(marker,content_string) {
	return function() {
	    showOfficeInfo(marker,content_string);
	}
    })(marker,content_string));
    /*
     * Now, let's initialize Four Square data model of nearby restaurants
     */
    initializeFourSquare();
}

/*
 * View Model
 */
var ViewModel = function() {
    var self = this;
    self.restaurantList = ko.observableArray([]);
    self.searchFilter = ko.observable("");
    self.errorMessage = ko.observable("");
    // Following for debugging
    //this.resultSearch = ko.computed(function() {
	//return self.searchFilter();
    //},this);
    self.getResultList = ko.computed(function() {
	/*
	 * If non-empty search filter, then filter
	 * list
	 */
	var restaurantListLength = self.restaurantList().length;
	if (self.searchFilter().length > 0 ) {
	    /*
	     * Hide all by setting show property to false
	     */
	    for (var i = 0; i < restaurantListLength; i++) {
		self.restaurantList()[i].show(false);
		self.restaurantList()[i].marker.setMap(null);
	    }
	    /*
	     * Use ajax grep to get list of restaurants that match
	     * filter
	     */
	    var filteredList = $.grep(self.restaurantList(), function(restaurant) {
		var filter = self.searchFilter().toLowerCase();
		return (restaurant.name().toLowerCase().indexOf(filter) != -1);
	    });
	    /*
	     * There may be a more elegant way, but for each filtered item
	     * set property show to true in observed restaurant array
	     */
	    var filteredListLength = filteredList.length;
	    for (i = 0; i < filteredListLength; i++) {
		for (var j = 0; j < restaurantListLength; j++) {
		    /* 
		     * Check that names match
		     */
		    if (filteredList[i].name() == self.restaurantList()[j].name()) {
			self.restaurantList()[j].show(true);
			self.restaurantList()[j].marker.setMap(map);
		    }
		}
	    }
	} else {
	    /*
	     * Show all by setting show property to true
	     */
	    for (var i = 0; i < restaurantListLength; i++) {
		self.restaurantList()[i].show(true);
		self.restaurantList()[i].marker.setMap(map);
	    }
	}
    });
    /*
     * Add listener if restaurant clicked
     */
    this.setRestaurant = function(clickedRestaurant) {
	var content_string = createRestaurantContent(clickedRestaurant);
	showRestaurantInfo(clickedRestaurant.marker,content_string);
    };
}
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
	this.longitude = longitude;
	this.formattedPhone = formattedPhone;
	this.url = url;
	this.menuUrl = menuUrl;
	this.mobileMenuUrl = mobileMenuUrl;
	this.distance = distance;
    },
    initialize: function(client_id,client_secret,latitude,longitude) {
	var miles = 4;		// Look in 4 mile radius
	var meters = miles * 1609.344;
	var foursquareURL = 'https://api.foursquare.com/v2/venues/search' + 
	    '?client_id=' + client_id +
	    '&client_secret=' + client_secret +
	    '&v=20150610' +
	    '&ll=' + latitude + ',' + longitude +
	    '&radius=' + meters +
	    '&query=restaurant';
	/*
	 * Call FourSquare
	 */
	$.getJSON(foursquareURL, function (data) {
	    var restaurants = data.response.venues;
	    var restaurantsLength = restaurants.length;
	    for (var i = 0; i < restaurantsLength; i++) {
		var foursquareRestaurant = restaurants[i];
		var menuURL = '';
		var mobileMenuURL = '';
		if (foursquareRestaurant.hasMenu == true) {
		    menuURL = foursquareRestaurant.menu.url;
		    mobileMenuURL = foursquareRestaurant.menu.mobileUrl;
		}
		/*
		 * Check distance from home office
		 */
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
	    };
	    model.restaurantList.forEach(function(restaurantItem) {
		listViewModel.restaurantList.push(new Restaurant(restaurantItem));
	    });
	}).error(function(e) {
	    listViewModel.errorMessage('FourSquare search could not be executed');
	});
    }
}
/*
 * Restaurant View
 */
var Restaurant = function(data) {
    this.name = ko.observable(data.name);
    this.show = ko.observable(true);
    this.marker = new google.maps.Marker({
	position: new google.maps.LatLng(data.latitude,data.longitude),
	map: map,
	title: data.name
    });
    this.address = ko.observable(data.address);
    // Future
    //this.crossStreet = ko.observable(data.crossStreet);
    //this.latitude = ko.observable(data.latitude);
    //this.longititude = ko.observable(data.longitude);
    //this.mobileMenuUrl = ko.observable(data.mobileMenuUrl);
    //this.distance = ko.observable(distance);
    this.formattedPhone = ko.observable(data.formattedPhone);
    this.url = ko.observable(data.url);
    this.menuUrl = ko.observable(data.menuUrl);
    var content_string = createRestaurantContent(this);
    google.maps.event.addListener(this.marker, 'click', (function(marker,content_string) {
	return function() {
	    showRestaurantInfo(marker,content_string);
	}
    })(this.marker,content_string));
    /*
     * bounds.extend() takes in a map location object
     */
    var bounds = window.mapBounds;
    bounds.extend(new google.maps.LatLng(data.latitude, data.longitude));
    /*
     * fit the map to the new marker
     */
    map.fitBounds(bounds);
    /*
     * center the map
     */
    map.setCenter(bounds.getCenter());
}
/*
 * Initialize map when page loads.
 */
//function loadMapScript() {
  //var script = document.createElement('script');
  //script.type = 'text/javascript';
  //script.src = 'http://maps.googleapis.com/maps/api/js?libraries=places' +
      //'&callback=initializeMap';
  //document.body.appendChild(script);
//}
/*
 * Initialize FourSquare Restaurant models
 *
 */
function initializeFourSquare() {
/*
 * Credentials for FourSquare
 * Latitude and longitude for office of Online Computing, Inc.
 */
    var client_id = 'CNAQFLPKZSX0NZN4QKPR2XZPSGDHSA4AQ5DI5IGUC4SQUDIP';
    var client_secret = 'FQ45PW4C3XOMAODSES544LFDU5H3MTF1KMLUQLRTKGHYP40X';
    var latitude = '36.035443';
    var longitude = '-86.80515';
/*
 * Initialize model
 */
    model.initialize(client_id,client_secret,latitude,longitude);
    listViewModel = new ViewModel();
    ko.applyBindings(listViewModel);
}

/*
 * Load map script
 */
    //window.onload = loadMapScript;
    window.addEventListener('load', initializeMap);
/*
 * Vanilla JS way to listen for resizing of the window
 * and adjust map bounds
 */
    window.addEventListener('resize', function(e) {
    /*
     * Make sure the map bounds get updated on page resize
     */
	map.fitBounds(mapBounds);
    });
    $(window).resize(function () {
	var h = $(window).height(),
	    offsetTop = 0; // Calculate the top offset
	$('#map-canvas').css('height', (h - offsetTop));
    }).resize();

