/*
Title: Welcome
Description: This description will go in the meta description tag
*/

## Welcome to My Example App!

Right below this is an example of reading device information within a Cordova App!

<div>
	<div data-role="collapsible" >
		<h3>View js</h3>
		<div style="overflow-x: auto;" >
			<pre>
var device_info_listview = $('&lt;ul data-role=&quot;listview&quot; data-inset=&quot;true&quot; &gt;&lt;/ul&gt;');
if(typeof device !== 'undefined')
{
	device_info_listview.append('&lt;li&gt;&lt;h3&gt;Platform/Model&lt;/h3&gt;&lt;p&gt;'+device.platform+' | '+device.model+'&lt;/p&gt;&lt;/li&gt;');
	device_info_listview.append('&lt;li&gt;&lt;h3&gt;Version&lt;/h3&gt;&lt;p&gt;'+device.version+'&lt;/p&gt;&lt;/li&gt;');
	device_info_listview.append('&lt;li&gt;&lt;h3&gt;Cordova Version&lt;/h3&gt;&lt;p&gt;'+device.cordova+'&lt;/p&gt;&lt;/li&gt;');
	device_info_listview.append('&lt;li&gt;&lt;h3&gt;UUID&lt;/h3&gt;&lt;p&gt;'+device.uuid+'&lt;/p&gt;&lt;/li&gt;');
}
else
{
	device_info_listview.append('&lt;li&gt;&lt;h3&gt;Unable To Lookup&lt;/h3&gt;&lt;p&gt;Please access this from the app&lt;/p&gt;&lt;/li&gt;');
}

$(document).one(&quot;pageshow&quot;, function() 
{
	$.mobile.activePage
		.find(&quot;div:jqmData(role='content')&quot;)
		.append(device_info_listview)
		.trigger('create');
});
			</pre>
		</div>
	</div>
</div>

<script>
	var device_info_listview = $('<ul data-role="listview" data-inset="true" ></ul>');
	if(typeof device !== 'undefined')
	{
		device_info_listview.append('<li><h3>jQuery Mobile Version</h3><p>'+jQuery.mobile.version+'</p></li>');
		device_info_listview.append('<li><h3>Platform/Model</h3><p>'+device.platform+' | '+device.model+'</p></li>');
		device_info_listview.append('<li><h3>Version</h3><p>'+device.version+'</p></li>');
		device_info_listview.append('<li><h3>Cordova Version</h3><p>'+device.cordova+'</p></li>');
		device_info_listview.append('<li><h3>UUID</h3><p>'+device.uuid+'</p></li>');
		
	}
	else
	{
		device_info_listview.append('<li><h3>jQuery Mobile Version</h3><p>'+jQuery.mobile.version+'</p></li>');
		device_info_listview.append('<li><h3>Unable To Lookup</h3><p>Please access this from the app to see this information.</p></li>');
	}
	
	$(document).one("pageshow", function() 
	{
		$.mobile.activePage
			.find("div:jqmData(role='content')")
			.append(device_info_listview)
			.trigger('create');
	});
</script>


