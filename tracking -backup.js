	 var isTracking = true;
	 var trackertask = null;
	 
	 function start_tracking(){ 
	
	 // init
		console.log("starting tracker...")
		var video = document.getElementById('video');
		var canvas = document.getElementById('canvas');
		var x_avg = 0, y_avg = 0, count = 0;
		var time;
		var tracker = new tracking.ObjectTracker('face');
		tracker.setInitialScale(2);
		tracker.setStepSize(2);
		tracker.setEdgesDensity(0.14);
		trackertask = tracking.track('#video', tracker, { camera: true });
		tracker.on('track', function(event) {	
			
		  event.data.forEach(function(rect) {
		 // console.log("rect x: " + rect.x + "; rect y: " + rect.y);
		  if(count == 0){
			x_avg = rect.x;
			y_avg = rect.y;
			time = new Date().getTime();
		  }
		  
		  count++;
		  
		  if(count >= 5){
			count = 0;
			x_avg = Math.abs(x_avg - rect.x)/ (new Date().getTime() - time);
			y_avg = Math.abs(y_avg - rect.y)/ (new Date().getTime() - time);
			audioControl(x_avg,y_avg);
		  }
		  
         		 
        });
	});
		
	}
	
	function audioControl(x_avg,y_avg){
		var threshold = 5.0;
		var measure = (x_avg + y_avg) * 150;
		console.log("measure: " + measure + ";");
			
		if(!isPlaying){
			if( measure > threshold){
				play();
			}
		}
	}