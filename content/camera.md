/*
Title: Camera
Description: Test Camera Functionality
Author: James Nadeau
Date: 01/01/2014
*/
Use the buttons below to test Camera and Image functionality
<script>
	// Called when a photo is successfully retrieved
	if(typeof navigator.camera !== 'undefined')
	{
	
		pictureSource=navigator.camera.PictureSourceType;
		destinationType=navigator.camera.DestinationType;
		
		var camera_buttons = '<button onclick="capturePhoto();">Capture Photo</button>'
			+'<button onclick="capturePhotoEdit();">Capture Editable Photo</button>'
			+'<button onclick="getPhoto(pictureSource.PHOTOLIBRARY);">From Photo Library</button>'
			+'<button onclick="getPhoto(pictureSource.SAVEDPHOTOALBUM);">From Photo Album</button>'
			+'<img style="display:none;width:60px;height:60px;" id="smallImage" src="" />'
			+'<img style="display:none;" id="largeImage" src="" />';
		
		function onPhotoDataSuccess(imageData) 
		{
			// Uncomment to view the base64-encoded image data
			// console.log(imageData);
			
			// Get image handle
			//
			var smallImage = document.getElementById('smallImage');
			
			// Unhide image elements
			//
			smallImage.style.display = 'block';
			
			// Show the captured photo
			// The inline CSS rules are used to resize the image
			//
			smallImage.src = "data:image/jpeg;base64," + imageData;
		}
		
		// Called when a photo is successfully retrieved
		function onPhotoURISuccess(imageURI) 
		{
			// Uncomment to view the image file URI
			// console.log(imageURI);
		
			// Get image handle
			//
			var largeImage = document.getElementById('largeImage');
		
			// Unhide image elements
			//
			largeImage.style.display = 'block';
			
			// Show the captured photo
			// The inline CSS rules are used to resize the image
			//
			largeImage.src = imageURI;
		}
		
		// A button will call this function
		function capturePhoto() 
		{
			// Take picture using device camera and retrieve image as base64-encoded string
			navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
			destinationType: destinationType.DATA_URL });
		}
		
		// A button will call this function
		function capturePhotoEdit() 
		{
			// Take picture using device camera, allow edit, and retrieve image as base64-encoded string
			navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
			destinationType: destinationType.DATA_URL });
		}
		
		// A button will call this function
		function getPhoto(source) 
		{
			// Retrieve image file location from specified source
			navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
			destinationType: destinationType.FILE_URI,
			sourceType: source });
		}
		
		// Called if something bad happens.
		//
		function onFail(message) 
		{
			alert('Failed because: ' + message);
		}
	}
	else
	{
		var camera_buttons = '<p>This feature is not availble yet for your platform, try using the app...</p>';
	}
	
	$(document).one("pageshow", function() 
	{
		$.mobile.activePage
			.find("div:jqmData(role='content')")
			.append(camera_buttons)
			.trigger('create');
	});
</script>
	
	
