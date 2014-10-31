/*
Title: Noise
Description: This description will go in the meta description tag
*/

Test notification and vibrates noises

<script>
	
	if(typeof navigator.notification !== 'undefined')
	{
		var noise_buttons = '<a href="#" data-role="button" onclick="showAlert(); return false;">Show Alert</a>'
			+'<a href="#" data-role="button" onclick="playBeep(); return false;">Play Beep</a>'
			+'<a href="#" data-role="button" onclick="vibrate(); return false;">Vibrate</a>';
		function showAlert() 
		{
			navigator.notification.alert(
				'Thanks for checking this out!',  // message
				'Hi There',            // title
				'All Done'                  // buttonName
			);
		}
	
		// Beep three times
		//
		function playBeep() 
		{
			navigator.notification.beep(3);
		}
	
		// Vibrate for 2 seconds
		//
		function vibrate() 
		{
			navigator.notification.vibrate(2000);
		}
	}
	else
	{
		var noise_buttons = '<p>This feature is not availble yet for your platform, try using the app...</p>';
	}
	
	$(document).one("pageshow", function() 
	{
		$.mobile.activePage
			.find("div:jqmData(role='content')")
			.append(noise_buttons)
			.trigger('create');
	});
</script>
