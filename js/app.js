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

/*
 * Declare global map variable
 */
var	map;    
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
};
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
    map.panTo(marker.getPosition());
    /*
     * Create GoogleMaps popup window with content string
     */
    var infoWindow = new google.maps.InfoWindow({
      content: contentString
    });
    /*
     * Bounce the marker to show that it's state has changed
     * Set timeout so it will quit bouncing after a couple seconds
     */
    toggleBounce(marker);
    setTimeout(function(){ toggleBounce(marker); }, 1400);
    /*
     * Open popup window.
     */
    infoWindow.open(map,marker);
};
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
      '<br>'+restaurant.formattedPhone()+'</p>'+
      '<p><a href="'+restaurant.url()+'">Website</a></p>'+
      '<p><a href="'+restaurant.menuUrl()+'">Menu</a></p>'+
      '</div>';
    return contentString;
};
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
     * Pan to the position of the marker
     */
    map.panTo(marker.getPosition());
    /*
     * Create GoogleMaps popup window with content string
     */
    var infoWindow = new google.maps.InfoWindow({
      content: contentString
    });
    /*
     * Bounce the marker to show that it's state has changed
     * Set timeout so it will quit bouncing after a couple seconds
     */
    toggleBounce(marker);
    setTimeout(function(){ toggleBounce(marker); }, 1400);
    /*
     * Open popup window.
     */
    infoWindow.open(map,marker);
};
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
};
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
    var officLatlng;
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

    window.mapBounds = new google.maps.LatLngBounds();
}

/*
 * View Model
 */
var ViewModel = function() {
    var self = this;
    this.restaurantList = ko.observableArray([]);
    this.searchFilter = ko.observable("");
    this.errorMessage = ko.observable("");
    // Following for debugging
    //this.resultSearch = ko.computed(function() {
	//return self.searchFilter();
    //},this);
    this.getResultList = ko.computed(function() {
	/*
	 * If non-empty search filter, then filter
	 * list
	 */
	if (self.searchFilter().length > 0 ) {
	    /*
	     * Hide all by setting show property to false
	     */
	    for (var i = 0; i < self.restaurantList().length; i++) {
		self.restaurantList()[i].show(false);
		self.restaurantList()[i].marker.setMap(null);
	    }
	    /*
	     * Use ajax grep to get list of restaurants that match
	     * filter
	     */
	    filteredList = $.grep(self.restaurantList(), function(restaurant) {
		var filter = self.searchFilter().toLowerCase();
		return (restaurant.name().toLowerCase().indexOf(filter) != -1);
	    });
	    /*
	     * There may be a more elegant way, but for each filtered item
	     * set property show to true in observed restaurant array
	     */
	    for (i = 0; i < filteredList.length; i++) {
		console.log(filteredList[i].name());
		for (var j = 0; j < self.restaurantList().length; j++) {
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
	    for (var i = 0; i < self.restaurantList().length; i++) {
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
};
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
	var miles = 3;		// Look in 3 mile radius
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
		//console.log("name: "+foursquareRestaurant.name);
	    };
	    model.restaurantList.forEach(function(restaurantItem) {
		listViewModel.restaurantList.push(new Restaurant(restaurantItem));
	    });
	}).error(function(e) {
	    listViewModel.errorMessage('FourSquare search could not be executed');
	});
    }
};
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
};
/*
 * Initialize map when page loads.
 */
function loadMapScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'http://maps.googleapis.com/maps/api/js?libraries=places' +
      '&callback=initializeMap';
  document.body.appendChild(script);
}
/*
 * Credentials for FourSquare
 * Latitude and longitude for office of Online Computing, Inc.
 */
    var client_id = 'CNAQFLPKZSX0NZN4QKPR2XZPSGDHSA4AQ5DI5IGUC4SQUDIP';
    var client_secret = 'FQ45PW4C3XOMAODSES544LFDU5H3MTF1KMLUQLRTKGHYP40X';
    var latitude = '36.035443';
    var longitude = '-86.80515';
/*
 * Initialize mode
 */
    model.initialize(client_id,client_secret,latitude,longitude);
    var listViewModel = new ViewModel();
    ko.applyBindings(listViewModel);

/*
 * Load map script
 */
    window.onload = loadMapScript;
    //window.addEventListener('load', initializeMap);
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
