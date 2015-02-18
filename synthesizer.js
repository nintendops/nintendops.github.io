/**
 * Created by nintendops on 2/12/2015.
 */

var mContext = null;
var mAudioGenerator = null;
var audio_track = null;
var mAudio = null;
var mLength = null;
var timer1 = null;
var mreset = true;

var play_syn = function (reset, url) {
    mreset = reset;
    if (audio_track) {
        // do something if tracker is on
    } else {
        $(function () {
            $.getJSON(url, function (data) {
                var d1 = new Date();
                var mSong = data;
                convertSong(mSong);
                var opts = {
                    firstCol: 0,
                    lastCol: 0,
                    numSeconds: (32) * mSong.rowLen / 44100
                };
                generateWave(mSong, opts);
                var d2 = new Date();
                console.log("generation time is " + (d2.getTime() - d1.getTime()) / 1000 + "s");
            })
        });
    }
};


// initilization here
function run_syn() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    mContext = new AudioContext();
    play_syn("preload.json");
}


var convertSong = function (song) {
    var i, j, k;
    for (i = 0; i < 8; i++) {
        var instr = song.songData[i];
        if (instr === undefined) {
            instr = {};
            // Oscillator 1
            instr.osc1_oct = 7;
            instr.osc1_det = 0;
            instr.osc1_detune = 0;
            instr.osc1_xenv = 0;
            instr.osc1_vol = 192;
            instr.osc1_waveform = 0;
            // Oscillator 2
            instr.osc2_oct = 7;
            instr.osc2_det = 0;
            instr.osc2_detune = 0;
            instr.osc2_xenv = 0;
            instr.osc2_vol = 192;
            instr.osc2_waveform = 0;
            // Noise oscillator
            instr.noise_fader = 0;
            // Envelope
            instr.env_attack = 200;
            instr.env_sustain = 2000;
            instr.env_release = 20000;
            instr.env_master = 192;
            // Effects
            instr.fx_filter = 0;
            instr.fx_freq = 11025;
            instr.fx_resonance = 255;
            instr.fx_delay_time = 0;
            instr.fx_delay_amt = 0;
            instr.fx_pan_freq = 0;
            instr.fx_pan_amt = 0;
            // LFO
            instr.lfo_osc1_freq = 0;
            instr.lfo_fx_freq = 0;
            instr.lfo_freq = 0;
            instr.lfo_amt = 0;
            instr.lfo_waveform = 0;
            //patterns
            instr.p = [];
            //column
            instr.c = [];
            song.songData[i] = instr;
        }

        // Columns
        for (j = 0; j < 10; j++) {
            var col = instr.c[j];
            if (col === undefined) {
                var col = {};
                col.n = [];
                for (k = 0; k < 32; k++) {
                    col.n[k] = 0;
                }
                instr.c[j] = col;
            }
        }
        song.songData[i] = instr;
    }

};

var compressSong = function (song) {
    song = _.clone(song);
    song.songData = _.map(song.songData, function (d) {
        d = _.clone(d);
        var lastNotZero = -1;
        var used = [];
        var usedIndex = {};
        // search the last pattern and listing all patterns
        _.each(d.p, function (p, i) {
            if (p !== 0)
                lastNotZero = i;
            if (usedIndex[p] === undefined) {
                used.push(p);
                usedIndex[p] = true;
            }
        });
        // remove useless end of pattern list
        d.p = d.p.slice(0, lastNotZero + 1);
        // remove unused patterns
        var lastPattern = _.max(used);
        d.c = d.c.slice(0, lastPattern);
        return d;
    });
    song.songData = _.filter(song.songData, function (d) {
        return d.p.length > 0;
    });
    console.log(song);
    return song;
};

// check audio status and initialize new buffersource node
var generateAudio = function (wave) {
    try {
        var uri = "data:audio/wav;base64," + btoa(wave);
        // Load the data into the audio element (it will start playing as soon as
        // the data has been loaded)
        var request = new XMLHttpRequest();
        request.open('GET', uri, true);
        request.responseType = 'arraybuffer';

        // Decode asynchronously
        request.onload = function () {
            mContext.decodeAudioData(request.response, function (buffer) {
                PlayIfReady(buffer);
            });
        }
        request.send();
    }
    catch (e) {
        alert("Error playing: " + err.message);
    }
}


var stopPlaying = function (e) {
    if (mAudio === null) {
        alert("Audio element unavailable.");
        return;
    }
    mAudio.stop();
    return false;
};

var generateWave = function (mSong, opts) {
    console.log(mSong);
    // TODO: handle correctly opts
    var oSong = _.clone(mSong);
    if (opts) {
        oSong.songData = mSong.songData.slice(opts.firstCol, opts.lastCol + 1);
        oSong.songLen = opts.numSeconds;
    }
    var mPlayer = new sonantx.MusicGenerator(compressSong(oSong));
    mPlayer.getAudioGenerator(function (ag) {
        mAudioGenerator = ag;
        var wave = ag.getWave();
        // Call the callback function
        generateAudio(wave);
    });
};


function PlayIfReady(mBuffer) {

    if (!mBuffer || !mContext) {
        alert('error in retrieving the audio');
        return;
    }
    if (mAudio && timer1 && mLength) {
        var timer2 = audio_context.currentTime;
        var offset = mLength - ((timer2 - timer1) % mLength);
       setTimeout(function () {
            timer1 = audio_context.currentTime;
            console.log(offset);
           if(mreset){
                stopPlaying();
            }
            mAudio = mContext.createBufferSource();
           mAudio.buffer = mBuffer;
           mLength = mBuffer.duration;
           if (!mContext.createGain) {
               mContext.createGain = mContext.createGainNode;
           }
           this.gainNode = mContext.createGain();
           // Connect source to a gain node
           mAudio.connect(this.gainNode);
           // Connect gain node to destination
           this.gainNode.connect(mContext.destination);
           // Start playback in a loop
           mAudio.loop = true;
           mAudio.start();
           timer1 = audio_context.currentTime;
       }, offset * 1000);
    } else {
        mAudio = mContext.createBufferSource();
        mAudio.buffer = mBuffer;
        mLength = mBuffer.duration;
        if (!mContext.createGain) {
            mContext.createGain = mContext.createGainNode;
        }
        this.gainNode = mContext.createGain();
        // Connect source to a gain node
        mAudio.connect(this.gainNode);
        // Connect gain node to destination
        this.gainNode.connect(mContext.destination);
        // Start playback in a loop
        mAudio.loop = true;
        mAudio.start();
        timer1 = audio_context.currentTime;
    }
}

