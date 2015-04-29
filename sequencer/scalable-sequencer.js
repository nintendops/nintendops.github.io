(function () {
    "use strict";

    var neu = null;
    var sc_context = null;
    var sc_gain_node = null;
    var baserhythm = 1;
    var baseRoot = 60;
    var GL_TEMPO;
    var GL_TEMPOSC = 2;
    var baseScale = sc.Scale.major();
    var baseInstr = Piano;
    var rootFreq = baseRoot.midicps();


    function SynthTone($, freq) {
        return $("square", { freq: freq })
            .$("xline", { start: 0.1, end: 0.001, dur: 0.25 }).on("end", $.stop)
            .$("out", { bus: 1 });
    }

    function LittleSeren($, freq, dur) {

        return $("tri", {freq: freq})
            .$("xline", {start: 0.25, end: 0.001, dur: dur}).on("end", $.stop)
            .$("out", {bus: 1});
    }

    function Piano($, freq, dur) {
        return $([1, 5, 13, 0.5].map(function (x, i) {
            return $("sin", {freq: freq * x});
        })).mul(0.75)
            .$("shaper", {curve: 0.75})
            .$("lpf", {freq: $("line", {start: freq * 3, end: freq * 0.75, dur: 3.5}), Q: 6})
            .$("xline", {start: 0.5, end: 0.01, dur: dur * 5}).on("end", $.stop)
            .$("out", {bus: 1});
    }

    function Master($, freq, dur) {
        return $([1, 3, 9, 0.5].map(function (x, i) {
            return $("tri", {freq: freq * x});
        })).$("lpf", {freq: $("line", {start: freq * 2, end: freq * 0.75, dur: 1.5}), Q: 6})
            .$("xline", {start: 3.2, end: 0.01, dur: dur * 2}).on("end", $.stop)
            .$("out", {bus: 1});
    }

    function Destination($) {
        return $([
            $("in", {bus: 1}),
            $("in", {bus: 1}).$("delay", {delay: "16n", mul: 0.25})
        ]);
    }

    function neu_init(){
        sc_context = new AudioContext();
        sc_gain_node = sc_context.createGain();
        sc_gain_node.connect(sc_context.destination);
        neu = new neume(sc_gain_node);
    }

    function ScalableSequencer(mmlData, tempo) {
        var _this = this;
        this._mmlData = mmlData;
        this._mml = null;
        this._dst = null;
        GL_TEMPO = tempo;
        neu_init();

        this._syn = function (freq, e, t) {
            neu.Synth(baseInstr, freq, e.duration).start(t).fadeOut("+" + _this._outVal,0.4);
        };
        this.convert_r = function (e) {
            return e.playbackTime;
        };

        // vars for run time
        this._e = null;
        this._switchtime = null;
        this._outVal = 1;
        this._gain = sc_gain_node;
        this._instr = baseInstr;
        this._scale = sc.Scale.major();
        this.currentTime = 0;
    }

    ScalableSequencer.scales = (function () {
        var scales = new Array();

        sc.ScaleInfo.names().forEach(function (key, index) {
            if (index > 5) {
                return;
            }
            var scale = sc.ScaleInfo.at(key);

            if (scale.pitchesPerOctave() !== 12) {
                return;
            }
            // console.log("pushing " + key);
            scales.push(key);
        });
        scales.push("major");

        return scales;
    })();

    ScalableSequencer.tunings = (function () {
        var tunings = {};

        sc.TuningInfo.names().forEach(function (key) {
            var tuning = sc.TuningInfo.at(key);

            if (tuning.size() !== 12) {
                return;
            }

            tunings[key] = tuning;
        });

        return tunings;
    })();

    ScalableSequencer.prototype.start = function () {
        var _this = this;
        neu.start();

        if (this._dst) {
            this._dst.stop();
        }
        if (this._mml) {
            this._mml.stop();
        }
        var start = new Date().getTime();
        this._dst = neu.Synth(Destination).start();
        this._mml = new MMLEmitter(neu.context, this._mmlData, GL_TEMPO);
        this._mml.tracks.forEach(function (track) {
            track.on("note", function (e) {
                if (e.type !== "note") {
                    return;
                }
                _this.currentTime = neu.context.currentTime;


                var t = _this.convert_r(e);
                _this._e = e;
                var key = e.midi - baseRoot;
                var deg = baseScale.performKeyToDegree(key);
                var freq = _this._scale.degreeToFreq2(deg, rootFreq, 0);
                _this._syn(freq,e,t);
            });
        });
        var app = this;
        // loop until stop
        this._mml.on("end", function () {
            // do something
            app.start();
        });
        this._mml.start();
    };

    ScalableSequencer.prototype.stop = function () {
        if (this._dst) {
            this._dst.stop();
        }
        if (this._mml) {
            this._mml.stop();
        }
        this._dst = null;
        this._mml = null;

        neu.stop();
    };

    ScalableSequencer.prototype.setScale = function (name) {
        console.log("setting scale to " + name);
        var tuning = this._scale.tuning();
        this._scale = sc.ScaleInfo.at(name);
        this._scale.tuning(tuning);
    };

    ScalableSequencer.prototype.messup = function (e) {
        var ndegree = new Array();
        this._scale._degrees.forEach(function (elements, index, array) {
            ndegree[index] = elements + e;
        });
        var tuning = this._scale.tuning();
        this._scale = new sc.Scale(ndegree, 12, "Haiwei");
        this._scale.tuning(tuning);
    }


    ScalableSequencer.prototype.messinst = function (e) {
        switch (e) {
            case 1:
                baseInstr = LittleSeren;
                break;
            case 2:
                baseInstr = SynthTone;
                break;
            case 0:
                baseInstr = Piano;
                break;
            case 3:
                baseInstr = Master;
                break;
        }
    }

    ScalableSequencer.prototype.setTuning = function (name) {
        this._scale.tuning(sc.TuningInfo.at(name));
    };

    ScalableSequencer.prototype.convert_rhythm = function (converter) {
        this.convert_r = converter;
    };

    /*ScalableSequencer.prototype.slower = function () {
     var onceS = true;
     this._switchtime = neu.context.currentTime;
     var offsetS;
     this.convert_r = function (e) {
     if (e.type !== "note") {
     return;
     }
     var t = e.playbackTime;
     if (onceS) {
     offsetS = t;
     onceS = false;
     return t;
     } else {
     return 1.5 * t - 0.5 * offsetS;
     }
     };
     };*/

    ScalableSequencer.prototype.slower = function (val) {
        if (isPlaying && val > 0 && val < 3) {
            this._mml.tracks.forEach(function (track) {
                track._ttempo = GL_TEMPO/val;
            });
        }
    };

    ScalableSequencer.prototype.faster = function (val) {
        if (isPlaying && val > 0 && val < 3) {
            this._mml.tracks.forEach(function (track) {
                track._ttempo = GL_TEMPO*val;
            });
        }
    };

    ScalableSequencer.prototype.ChangeSyn = function(syn){
        this._syn = syn;
    };

    /*ScalableSequencer.prototype.normal = function () {
     var delay = null;
     var _this = this;
     if (_this._switchtime) {
     _this.convert_r = function(e){
     return 0;
     };
     delay = (1-1/1.5)*(neu.context.currentTime - _this._switchtime);
     console.log("delay: " + delay);
     setTimeout(function(){
     _this.convert_r = function (e) {
     return e.playbackTime;
     };
     }, delay*1000);
     }

     };*/


    window.ScalableSequencer = ScalableSequencer;

})();
