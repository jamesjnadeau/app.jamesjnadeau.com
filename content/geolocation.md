/*
Title: Location
Description: This description will go in the meta description tag
*/

How to come see me

<!-- 
<div data-role="collapsible">
	<h3>Directions</h3>
	<div id="id="directions-panel"" ></div>
</div>

<div style="height:300px; position: relative;" id="map-canvas" ></div>
-->

<script>
	var geo_location_content = $('<div style="height:300px; position: relative;" id="map-canvas" ></div>');
	
	var directionsDisplay = new google.maps.DirectionsRenderer();
	var directionsService = new google.maps.DirectionsService();
	var map;
	
	function location_accepted(position)
	{
		console.log(JSON.stringify(position));
		$.mobile.loading( 'hide');
		var you = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		
		calcRoute(you, new google.maps.LatLng(44.1663, -73.2513));
		var maps_domain,
			maps_onclick = '';
		if(typeof device !== 'undefined')
		{
			maps_domain = 'geo:0,0';
			maps_onclick = "onclick=\"launch_maps_intent($(this).attr('href')); return false;\"";
		}
		else
		{
			maps_domain = 'http://maps.google.com/';
		}
		
		var maps_link = '<a href="'+maps_domain+'?saddr='
			+position.coords.latitude+','+position.coords.longitude
			+'&daddr=44.1663,-73.2513&mode=driving" target="_blank" rel="external" data-role="button" '
			+maps_onclick+' >Launch Maps App</a>';
		
		$.mobile.activePage
			.find("div:jqmData(role='content')")
			.append(maps_link)
			.trigger('create');
	}
	
	function launch_maps_intent(maps_url)
	{
		if(typeof window.plugins !== 'undefined')
		{
			window.plugins.webintent.startActivity({
				action: WebIntent.ACTION_VIEW,
				url: maps_url},  
				function() {}, 
				function() {alert('Failed to open '+maps_url+' via Android Intent')});
		}
	}
	
	function initialize_map() 
	{
		console.log('initializing map');
		
		var mapOptions = 
		{
			zoom:7,
			center: new google.maps.LatLng(44.1663, -73.2513)
		}
		console.log(geo_location_content);
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		directionsDisplay.setMap(map);
		
	}
	
	function calcRoute( start, end ) 
	{
		console.log(start);
		console.log(end);
		var request = 
		{
			origin: start.toString(),
			destination: end.toString(),
			travelMode: google.maps.TravelMode.DRIVING
		};
		
		directionsService.route(request, function(response, status) 
		{
			if (status == google.maps.DirectionsStatus.OK) 
			{
				directionsDisplay.setDirections(response);
			}
		});
	}
	
	$(document).one("pageshow", function() 
	{
		$.mobile.activePage
			.find("div:jqmData(role='content')")
			.append(geo_location_content)
			.trigger('create');
		initialize_map();
		$.mobile.loading('show',
			{
				text: 'Getting Your Location',
				textVisible: true,
			});
		
		if(typeof navigator.geolocation !== 'undefined')
		{
			navigator.geolocation.getAccurateCurrentPosition
			(
				location_accepted, 
				location_declined
			);
		}
		else
		{
			alert(gps_disabled_message);
		}
	});
	
</script>
