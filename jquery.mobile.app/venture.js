
site_domain = 'dev.mypointnow.com';
default_url = 'https://'+site_domain+'/dealer-access/index.php';
default_offline_url = 'file:///android_asset/www/offline.html';
default_offline_pdf_viewer = 'file:///android_asset/www/pdf_viewer.html';

document.addEventListener("deviceready", function()
{
	console.log('venture device ready');
}, false);

login_tries = 0;
function autoLogin()
{
	$.mobile.loading('show');
	
	//pull in staved passwords
	var username = window.localStorage.getItem("username");
	var password = window.localStorage.getItem("password");
	
	
	console.log('found username '+username);
	console.log('found password '+password);
	
	//start idp first saml login
	//console.log('autologin started by '+arguments.callee.caller.toString());
	
	var relay_url = default_url;
	var url = 'https://'+site_domain+'/saml/saml2/idp/SSOService.php?spentityid='+site_domain+'&RelayState='+relay_url;
	//var url = 'https://'+site_domain+'/info.php';
	console.log('url = '+url);
	
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
					console.log('already logged in, going to '+relay_url);
					$.mobile.changePage(relay_url);
				}
			},
		error: function(XMLHttpRequest, textStatus, errorThrown) 
			{
				console.log(textStatus);
				onError(errorThrown);
				onError(XMLHttpRequest);
				//remove current pages login form
				$('#loginForm').empty();
				//interject error
				$('#loginForm').append('<p class="error">There was an error logging in</p><a href="#" onclick="autologin();">Try again</a>');
				console.log('ajax error');
				
			}
	});
	console.log('auto login ending, ajax still going');
}
console.log('autologin loaded');


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

$(document).on("pageshow", function() 
{
	open_menu('#panel_left');
});

$(document).on("pageshow", function() 
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
 * Bar code scanner

console.log('app_venture_prefill_from_barcode start');
function app_venture_prefill_from_barcode(fill_selector)
{
	window.plugins.barcodeScanner.scan
	( 
		function(result) 
		{
			alert("We got a barcode\n" +
				"Result: " + result.text + "\n" +
				"Format: " + result.format + "\n" +
				"Cancelled: " + result.cancelled);*
				
			console.log(JSON.stringify(result));
			$(fill_selector).val(result.text);
		}, 
		function(error) 
		{
			alert("Scanning failed: " + error);
		}
	);
}
console.log('app_venture_prefill_from_barcode defined');
 */
