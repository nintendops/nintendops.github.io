var audio_context;
var isPlaying = false;
var gainNode = null;
var audio_response = null;
var audiobuffer = null;
var audiobuffer2 = null;
var as1 = null;
var as2 = null;
var p_time = 0;
var url = "./cross1.wav";
var url2 = "./cross2.wav";
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

        var another_request = new XMLHttpRequest();
        another_request.open('GET', url2, true);
        another_request.responseType = 'arraybuffer';

        // Decode asynchronously
        another_request.onload = function() {
            audio_context.decodeAudioData(another_request.response, function(buffer) {
                audiobuffer2 = buffer;
            });
        }
        another_request.send();
	}
	catch(e){
		alert('Web Audio API not supported in this stupid browser');
	}
}


function pause_audio(isStop){
	if(!audio_context){
		alert('error in retrieving the audio');
		return;
	}
	
	if(!as1 || !as2 || p_time == 0){
		alert("no audio is playing");
		return;
	}
	
	as1.source.stop();
    as2.source.stop();

	if(isStop){
		p_time = 0;
	}else{
	// audio play next time will continue from where it paused
	p_time = audio_context.currentTime - p_time;	
	}
	
	isPlaying = false;
}

function createSource(buffer) {
    var source = audio_context.createBufferSource();
    var gainNode = audio_context.createGain ? audio_context.createGain() : audio_context.createGainNode();
    source.buffer = buffer;
    // Turn on looping
    source.loop = true;
    // Connect source to gain.
    source.connect(gainNode);
    // Connect gain to destination.
    gainNode.connect(audio_context.destination);

    return {
        source: source,
        gainNode: gainNode
    };
}



function play(){
	if(!audiobuffer || !audio_context){
		alert('error in retrieving the audio');
		return;
	}

    as1 = createSource(audiobuffer);
    as2 = createSource(audiobuffer2);
    as2.gainNode.gain.value = 0;
	if(p_time == 0){
		p_time = audio_context.currentTime;
		console.log("p_time: " + p_time + ";");
		as1.source.start(0);
        as2.source.start(0);
	}else{
		console.log("p_time: " + p_time + ";");
		as1.source.start(0,p_time);
        as2.source.start(0,p_time);
		p_time = audio_context.currentTime - p_time;
	}
	
	isPlaying = true;
}

function change_volumn(element){
 if(!as1.gainNode){
	 return;
 }
  var volume = element.value;
  var fraction = parseInt(volume) / parseInt(element.max);
  as1.gainNode.gain.value = fraction;
  as2.gainNode.gain.value = 1 - fraction;
}
