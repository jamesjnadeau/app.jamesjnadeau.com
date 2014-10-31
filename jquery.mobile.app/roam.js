default_url = 'https://'+site_domain+'/internal-admin/';

if(device.platform == 'iOS')
{
	function getPhoneGapPath() 
	{
		var path = window.location.pathname;
		path = path.substr( 0, path.length - 10 );
		return 'file://' + path;   
	};
	
	default_offline_url = getPhoneGapPath()+'offline.html';
	default_resume_url = getPhoneGapPath()+'index.html';
}
else
{
	default_offline_url = 'file:///android_asset/www/offline.html';
	default_offline_pdf_viewer = 'file:///android_asset/www/pdf_viewer.html';
}


login_tries = 0;
function autoLogin()
{
	console.log('autologin started');
	
	$.mobile.loading('show');
	
	//pull in staved passwords
	var username = window.localStorage.getItem("username");
	var password = window.localStorage.getItem("password");
	
	console.log('found username '+username);
	console.log('found password '+password);
	
	//start idp first saml login
	
	var relay_url = default_url;
	var url = 'https://'+site_domain+'/saml/saml2/idp/SSOService.php?spentityid='+site_domain+'&RelayState='+encodeURIComponent(relay_url);
	
	/*if(device.platform == 'iOS')
	{
		var last_visited_page = window.localStorage.getItem("last_visited_page");
		console.log('last_visited_page = '+last_visited_page);
		if(last_visited_page)
		{
			relay_url=last_visited_page;
		}
	}*/
	
	//get login form to inject in page
	$.ajax
	({
		type: 'GET',
		url: url,
		success: 
			function( msg )
			{
				//console.log(msg);
				var loginForm = $(msg).find('#login').html();

				//remove current pages login form
				$('#loginForm').empty();
				
				if(loginForm != null)
				{
					//add login form to current page
					$('#loginForm').append(loginForm);
					//add theme b to submit button
					$('#loginForm :submit').attr('data-theme', 'b');
					//trigger jquery mobile to process new html
					$('#loginForm').trigger('create');
					
					//show help button
					$('#loginHelp').removeClass('hidden');
					
					//set forms action 
					$('form').attr('action', 'https://'+site_domain+'/saml/module.php/core/loginuserpass.php');
					
					//make sure form is submitted via ajax
					$("form").submit(function()
					{
						$('#loginHelp').addClass('hidden');
						
						//save entered username/password
						window.localStorage.setItem("username", $("#username").val());
						window.localStorage.setItem("password", $("#password").val());
						
						//save the time this was done
						var current_date = new Date();
						window.localStorage.setItem("login_date", current_date);
						
						//post the form so we are logged in
						$.post($(this).attr('action'), $(this).serialize(),
							function(data) 
							{
								$.mobile.loading('show',
								{
									text: 'Authenticating',
									textVisible: true
								});
								//get saml login response
								var loginResponse = $(msg).find('form');
								
								//see if there was an error
								var error_found = $(data).find('.error').html();
								
								if(error_found != null)
								{//there was an error with login credentials
									//add to error count
									login_tries++;
									//remove any previous error messages
									$('#loginError').empty();
									//add it to the page
									$('#loginError').append(error_found);
									//remove the image that doesn't exist in this context
									$('#loginError img').remove();
									//add class error to it to style
									$('#loginError').addClass('error');
								}
								else
								{//no error found
									console.log('submitting response');
									//submit the respose form to finish login
									loginResponse.submit();
								}
							}
						);
						//don't submit the form normally
						return false;
					});
					
					if(username != null)
					{
						//prefill username/password
						$("#username").val(username);
						$("#password").val(password);
						
						if(!login_tries)
						{
							$.mobile.loading('show', 
							{
								text: 'Authenticating',
								textVisible: true
							});
							console.log('subitting form');
							
							//try submitting the form
							$("form").submit();
						}
						
					}
					else
					{
						$.mobile.loading('hide');
					}
				}
				else
				{//already logged in, go to home page
					$.mobile.loading('hide');
					console.log('logged in, going to '+relay_url);
					$.mobile.changePage(relay_url);
				}
			},
		error: 
			function(XMLHttpRequest, textStatus, errorThrown) 
			{
				console.log(textStatus);
				//remove current pages login form
				$('#loginForm').empty();
				//interject error
				$('#loginForm').append('<p class="error">There was an error logging in</p><a href="#" onclick="autologin();">Try again</a>');
			}
	});
}


/*
 * Popup images
 * taken from
 * http://view.jquerymobile.com/swipe/docs/pages/popup/popup-images.html
 */
$( document ).on( "pageinit", function() 
{
	$( ".photopopup" ).on(
	{
		popupbeforeposition: function() 
		{
			var maxHeight = $( window ).height() - 60 + "px";
			$( ".photopopup img" ).css( "max-height", maxHeight );
		}
	});
});


function open_menu(panel_selector)
{
	if ($(window).width() >= 880) 
	{
		$.mobile.activePage.find(panel_selector).panel( "open" );
		//$.mobile.activePage.find(panel_selector+'_button').hide();
	}
	else  
	{
		$.mobile.activePage.find(panel_selector).panel( "close" );
		//$.mobile.activePage.find(panel_selector+'_button').show();
	}
}

$(window).resize(function() 
{
	open_menu('#panel_left');
});

$(document).live("pageshow", function() 
{
	open_menu('#panel_left');
});

$(document).live("pageshow", function() 
{
	$( ".panel_right_mobile" ).on( "panelclose", 
		function( event, ui ) 
		{
			open_menu('#panel_left');
		} 
	);
});


/*
 * Google analytics
 */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-33251993-3']);
// from: http://blog.mojotech.com/post/29501319906/google-analytics-within-jquery-mobile
_gaq.push(['_setDomainName', 'none']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); 
	ga.type = 'text/javascript'; 
	ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function ga_roam_track_page()
{
	console.log('tracking page');
	hash = location.hash;
	try
	{
		if (hash)
			_gaq.push(['_trackPageview', hash.substr(1)]);
		else
			_gaq.push(['_trackPageview', location.pathname]);
	}
	catch(err)
	{
		onError(err);
	}
}
//fire off tracker on pageshow
$($(document).on('pageshow', ga_roam_track_page));

/*
 * Picture functions
 */
//expenses
function expense_image_capture()
{
	navigator.camera.getPicture(function (imageURI)
		{//success
			console.log(imageURI);
			
			var options = new FileUploadOptions();
			options.fileKey='file';
			options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
			options.mimeType= 'image/jpeg';
			
			var params = new Object();
			params.type = 'expense_image';
			
			options.params = params;
			
			var ft = new FileTransfer();
			ft.upload(imageURI, 'https://'+site_domain+'/global_ajax/phonegap_uploader.php',
			function(r)
			//success
			{
				console.log('Code = ' + r.responseCode);
				console.log('Response = ' + r.response);
				console.log('Sent = ' + r.bytesSent);
				
				console.log('success imageURI='+imageURI);
				
				//add image into page
				var new_html = '<img class="thumbnail" src="'+imageURI+'" />';
				new_html += '<input type="hidden" name="expense_file_ids[]" value="'+ r.response + '" />';
				$('#expense_images').prepend(new_html);
			},
			function(r)
			//failure
			{
				console.log('Code = ' + r.responseCode);
				console.log('Response = ' + r.response);
				console.log('Sent = ' + r.bytesSent);
			}, options);
		}, 
		function (message)
		{//failure
			alert('Failed because: ' + message);
		}, 
		{ 
			destinationType: Camera.DestinationType.FILE_URI,
			//3 megapixels ~ 1mb
			targetWidth: 2000,
			targetHeight: 1504
		}
	);
}
