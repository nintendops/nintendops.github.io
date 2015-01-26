var audio_context;
var isPlaying = false;
var source = null;
var audio_response = null;
var audiobuffer = null;
var p_time = 0;
var url = "./Myke_Ptyson.mp3";
window.addEventListener('load',audio_init,false);

function audio_init(){
	try{
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		audio_context = new AudioContext();
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';

		// Decode asynchronously
		request.onload = function() {
			audio_context.decodeAudioData(request.response, function(buffer) {		
				audiobuffer = buffer;			
			});
		}
		request.send();
	}
	catch(e){
		alert('Web Audio API not supported in this stupid browser');
	}
}


function pause_audio(isStop){
	if(!audiobuffer || !audio_context){
		alert('error in retrieving the audio');
		return;
	}
	
	if(!source || p_time == 0){
		alert("no audio is playing");
		return;
	}
	
	source.stop();
	if(isStop){
		p_time = 0;
	}else{
	// audio play next time will continue from where it paused
	p_time = audio_context.currentTime - p_time;	
	}
	
	isPlaying = false;
}

function play(){
	if(!audiobuffer || !audio_context){
		alert('error in retrieving the audio');
		return;
	}
	source = audio_context.createBufferSource();
	source.buffer = audiobuffer;
	source.connect(audio_context.destination);
	
	if(p_time == 0){
		p_time = audio_context.currentTime;
		console.log("p_time: " + p_time + ";");
		source.start(0);
	}else{
		console.log("p_time: " + p_time + ";");
		source.start(0,p_time);
		p_time = audio_context.currentTime - p_time;
	}
	
	isPlaying = true;
}
