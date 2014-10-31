js_version = 1;
console.log('js_version '+js_version);

basket.require({ url: site_protocal+"://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js", key: 'jquery', expire: 72, unique: js_version})
	.then(function()
	{
		$(document).bind("mobileinit", function()
		{
			$.mobile.defaultPageTransition = 'none';
			$.mobile.defaultDialogTransition = 'pop';
			$.mobile.useFastClick = true;
			
			//from http://jquerymobile.com/demos/1.2.0/docs/pages/phonegap.html
			$.mobile.phonegapNavigationEnabled = true
			$.mobile.allowCrossDomainPages = true;
			$.support.cors = true;
		});
		console.log('jQuery loaded');
		
		basket.require({ url: site_protocal+'://'+site_domain+'/jquery.mobile.app/jquery.mobile-1.4.0-rc.1.min.js', key: 'jquery.mobile', expire: 72, unique: js_version})
			.then(function()
			{
				console.log('jqm loaded');
				
				
				basket.require(
					{ url: site_protocal+'://'+site_domain+'/jquery.mobile.app/location.js', key: 'location', expire: 72, unique: js_version}
				).then(function()
				{
					console.log('everything is loaded');
					
					$('#index-content').empty()
						//.append('<p>Everything is loaded</p>')
						.append('<h4>Hi!</h4>')
						.append('<p>This is an example app I made to showcase what I can do with Cordova and jQuery Mobile</p>')
						.append('<a href="'+site_protocal+'://'+site_domain+'/" data-role="button" >Load Apps Site</a>')
						.append('<p>Click the above link to see how an external page can be loaded and used within this app. This allows a website to function inside of an app as if it was native.</p>')
						//trigger jqm to process this
						.trigger('create');
				});
				
			});
		
	});
console.log('basket_loader is loaded');

