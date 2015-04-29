var MML_DATA, app, scales, isPlaying, ins, countscale;

//window.addEventListener('load', audio_init, false);


var load_url = function (url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.send();
    });
};

function audio_init(callback, url, tempo) {

    load_url(url).then(function (data) {
        MML_DATA = data;
        var new_app = new ScalableSequencer(MML_DATA, tempo);
        app = new_app;
        scales = ScalableSequencer.scales;
        isPlaying = false;
        ins = 2;
        countscale = 0;
        callback(new_app);
    });
}

function seq_play() {
    if (MML_DATA && app) {
        if (!isPlaying) {
            app.start();
            isPlaying = true;
        }
        else {
            app.stop();
            isPlaying = false;
        }
    }
};


function seq_ton() {
    if (app && isPlaying) {
        app.messinst(ins++);
        if (ins > 1) {
            ins = 0;
        }
    }
};

function seq_tone(e) {
    if (app && isPlaying && e <= 2) {
        app.messinst(e);
    }
    return e;
};

function seq_scale(e) {

    if (app && isPlaying) {
        if (e) {
            app.setScale("major");
        } else {
            app.setScale(scales[countscale]);
            countscale++;
            if (countscale >= scales.length) {
                countscale = 0;
            }
        }
    }
}

function seq_faster() {
    if (app && isPlaying) {

    }
}

function seq_slower() {
    if (app && isPlaying) {
        var once = true;
        var offset;
        var slower = function (e) {
            if (e.type !== "note") {
                return;
            }
            var t = e.playbackTime;
            if (once) {
                offset = t;
                once = false;
                return t;
            } else {
                return 1.2 * t - 0.2 * offset;
            }
            console.log(offset);
        };

        app.convert_rhythm(slower);
    }
}