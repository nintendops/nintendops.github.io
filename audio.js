var MML_DATA, app, scales, isPlaying, ins, countscale;

window.addEventListener('load', audio_init, false);


var load_url = function (url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = reject;
        xhr.send();
    });
};

function audio_init() {

    load_url("data/invention.mml").then(function (data) {
        MML_DATA = data;
        app = new ScalableSequencer(MML_DATA);
        scales = ScalableSequencer.scales;
        isPlaying = false;
        ins = 1;
        countscale = 0;
    });


}

function seq_play(callback) {
    if (MML_DATA && app) {
        if (!isPlaying) {
            app.start(callback);
            isPlaying = true;
            $("#seq-play").html("Stop!");
        }
        else {
            app.stop();
            isPlaying = false;
            $("#seq-play").html("Play!");
        }
    }
};


function seq_ton() {
    if (app && isPlaying) {
        app.messinst(ins++);
        if (ins > 2) {
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
        app.messrhythm(-0.5);
    }
}

function seq_slower() {
    if (app && isPlaying) {
        app.messrhythm(0.5);
    }
}