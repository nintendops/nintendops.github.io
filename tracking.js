(function () {


    var counter = 0;
    var tracker_started = false;
    // variables for starfield
    var url_a = document.location.href;
    var n = parseInt((url_a.indexOf('n=') != -1) ? url_a.substring(url_a.indexOf('n=') + 2, ((url_a.substring(url_a.indexOf('n=') + 2, url_a.length)).indexOf('&') != -1) ? url_a.indexOf('n=') + 2 + (url_a.substring(url_a.indexOf('n=') + 2, url_a.length)).indexOf('&') : url_a.length) : 512);
    var flag = true;
    var test = true;
    var w = 0;
    var h = 0;
    var x = 0;
    var y = 0;
    var z = 0;
    var x_threshold = 800;
    var y_threshold = 400;
    var star_color_ratio = 0;
    var star_x_save, star_y_save;
    var star_ratio = 256;
    var star_speed = 4;
    var star_speed_save = 0;
    var star = new Array(n);
    var color;
    var opacity = 0.1;
    var cursor_x = 0;
    var cursor_y = 0;
    var mouse_x = 0;
    var mouse_y = 0;
    var canvas_x = 0;
    var canvas_y = 0;
    var canvas_w = 0;
    var canvas_h = 0;
    var tracker_context;
    var key;
    var ctrl;
    var timeout;
    var fps = 2;

//document.onmousemove=move;
    document.onkeypress = key_manager;
    window.addEventListener('load', tracker_init, false);

    function $i(id) {
        return document.getElementById(id);
    }

    function $r(parent, child) {
        (document.getElementById(parent)).removeChild(document.getElementById(child));
    }

    function $t(name) {
        return document.getElementsByTagName(name);
    }

    function $c(code) {
        return String.fromCharCode(code);
    }

    function $h(value) {
        return ('0' + Math.max(0, Math.min(255, Math.round(value))).toString(16)).slice(-2);
    }

    function _i(id, value) {
        $t('div')[id].innerHTML += value;
    }

    function _h(value) {
        return !hires ? value : Math.round(value / 2);
    }

    // singleton implementation
    function StarField() {
        if (!tracker_context) {
            tracker_resize();
        }
        this.context = tracker_context;

    }

    function tracker_init() {
        console.log("starfield initializing...");
        var a = 0;
        for (var i = 0; i < n; i++) {
            star[i] = new Array(5);
            star[i][0] = Math.random() * w * 2 - x * 2;
            star[i][1] = Math.random() * h * 2 - y * 2;
            star[i][2] = Math.round(Math.random() * z);
            star[i][3] = 0;
            star[i][4] = 0;
        }
        var starfield = $i('starfield');
        starfield.style.position = 'absolute';
        starfield.width = w;
        starfield.height = h;
        tracker_context = starfield.getContext('2d');
        //tracker_context.lineCap='round';
        tracker_context.fillStyle = 'rgb(0,0,0)';
        tracker_context.strokeStyle = 'rgb(255,255,255)';
    }

    function animate() {
        if (tracker_started) {
            mouse_x = cursor_x - x;
            mouse_y = cursor_y - y;

           /* // monitor directions for synthesizer/sequencer
            if (mouse_x < -250) {
                //play_syn("preload2.json");
                seq_tone(1);
            }
            else if (mouse_x > 250) {
                //play_syn("preload.json");
                seq_tone(2);
            } else {
                seq_tone(0);
            }*/

            tracker_context.fillRect(0, 0, w, h);
            for (var i = 0; i < n; i++) {
                test = true;
                star_x_save = star[i][3];
                star_y_save = star[i][4];
                star[i][0] += mouse_x >> 4;
                if (star[i][0] > x << 1) {
                    star[i][0] -= w << 1;
                    test = false;
                }
                if (star[i][0] < -x << 1) {
                    star[i][0] += w << 1;
                    test = false;
                }
                star[i][1] += mouse_y >> 4;
                if (star[i][1] > y << 1) {
                    star[i][1] -= h << 1;
                    test = false;
                }
                if (star[i][1] < -y << 1) {
                    star[i][1] += h << 1;
                    test = false;
                }
                star[i][2] -= star_speed;
                if (star[i][2] > z) {
                    star[i][2] -= z;
                    test = false;
                }
                if (star[i][2] < 0) {
                    star[i][2] += z;
                    test = false;
                }
                star[i][3] = x + (star[i][0] / star[i][2]) * star_ratio;
                star[i][4] = y + (star[i][1] / star[i][2]) * star_ratio;
                if (star_x_save > 0 && star_x_save < w && star_y_save > 0 && star_y_save < h && test) {
                    tracker_context.lineWidth = (1 - star_color_ratio * star[i][2]) * 2;
                    tracker_context.beginPath();
                    tracker_context.moveTo(star_x_save, star_y_save);
                    tracker_context.lineTo(star[i][3], star[i][4]);
                    tracker_context.stroke();
                    tracker_context.closePath();
                }
            }
            timeout = setTimeout(animate, fps);
        }
    }

    StarField.move = function (evt) {
        evt = evt || event;
        cursor_x = evt.pageX - canvas_x;
        cursor_y = evt.pageY - canvas_y;
    }

    StarField.flow_move = function (u, v) {
        w = parseInt((url_a.indexOf('w=') != -1) ? url_a.substring(url_a.indexOf('w=') + 2, ((url_a.substring(url_a.indexOf('w=') + 2, url_a.length)).indexOf('&') != -1) ? url_a.indexOf('w=') + 2 + (url_a.substring(url_a.indexOf('w=') + 2, url_a.length)).indexOf('&') : url_a.length) : get_screen_size()[0]);
        h = parseInt((url_a.indexOf('h=') != -1) ? url_a.substring(url_a.indexOf('h=') + 2, ((url_a.substring(url_a.indexOf('h=') + 2, url_a.length)).indexOf('&') != -1) ? url_a.indexOf('h=') + 2 + (url_a.substring(url_a.indexOf('h=') + 2, url_a.length)).indexOf('&') : url_a.length) : get_screen_size()[1]);
        var x_offset = u * w / 32;
        var y_offset = v * h / 32;
        if ((x_offset < 0 && cursor_x > x_threshold + w / 2) ||
            (x_offset > 0 && cursor_x < (x_threshold * -1) + w / 2)) {
            x_offset = 0;
        }
        if ((y_offset < 0 && cursor_y > y_threshold + h / 2) ||
            (y_offset > 0 && cursor_y < (y_threshold * -1) + h / 2)) {
            y_offset = 0;
        }
        cursor_x -= x_offset;
        cursor_y -= y_offset;
        //console.log("x = " + cursor_x);
        //console.log("y = " + cursor_y);

    }

    StarField.tracking_blink = function (sec) {

        tracker_context.fillStyle = 'rgba(0,0,0,' + opacity + ')';
        setTimeout(function () {
            tracker_context.fillStyle = 'rgba(0,0,0,1)';
        }, sec);

    }

    StarField.start = function () {
        if (!tracker_started) {
            tracker_started = true;
            tracker_resize();
            animate();
        }
        else
            tracker_started = false;
    }

    function tracker_resize() {
        if (tracker_started) {
            w = parseInt((url_a.indexOf('w=') != -1) ? url_a.substring(url_a.indexOf('w=') + 2, ((url_a.substring(url_a.indexOf('w=') + 2, url_a.length)).indexOf('&') != -1) ? url_a.indexOf('w=') + 2 + (url_a.substring(url_a.indexOf('w=') + 2, url_a.length)).indexOf('&') : url_a.length) : get_screen_size()[0]);
            h = parseInt((url_a.indexOf('h=') != -1) ? url_a.substring(url_a.indexOf('h=') + 2, ((url_a.substring(url_a.indexOf('h=') + 2, url_a.length)).indexOf('&') != -1) ? url_a.indexOf('h=') + 2 + (url_a.substring(url_a.indexOf('h=') + 2, url_a.length)).indexOf('&') : url_a.length) : get_screen_size()[1]);
            x = Math.round(w / 2);
            y = Math.round(h / 2);
            z = (w + h) / 2;
            star_color_ratio = 1 / z;
            cursor_x = x;
            cursor_y = y;
            tracker_init();
        }
    }

    function key_manager(evt) {
        evt = evt || event;
        key = evt.which || evt.keyCode;
        //ctrl=evt.ctrlKey;
        switch (key) {
            case 32:
                star_speed_save = (star_speed != 0) ? star_speed : star_speed_save;
                star_speed = (star_speed != 0) ? 0 : star_speed_save;
                break;
            case 65:
                tracker_context.fillStyle = 'rgba(0,0,0,' + opacity + ')';
                break;
        }
        top.status = 'key=' + ((key < 100) ? '0' : '') + ((key < 10) ? '0' : '') + key;
    }


    function OpticalTracker() {
        this.zoneSize = 8;
        this.tracking = false;
        this.videoElement = null;
        this.webCamFlow = new oflow.WebCamFlow(null, this.zoneSize);
    }

    OpticalTracker.prototype.start = function (callback, once) {
        if (!this.tracking) {

            // zoneSize affects the sensitivity of flow detection
            this.videoElement = document.getElementById('videoOut');
            if (!this.videoElement) {
                alert("no video element is found");
                return;
            }
            /*
             var videoWidth = this.videoElement.videoWidth;
             var videoHeight = this.videoElement.videoHeight;
             */

            this.webCamFlow.onCalculated(function (direction) {
                    if (!t) {
                        once();
                        t = true;
                    }
                    callback(direction.u, direction.v,mouse_x,mouse_y);
                }
            );
            this.webCamFlow.startCapture();
            this.tracking = true;
            var t = false;
            return this.webCamFlow;
        }
    };
    window.StarField = StarField;
    window.OpticalTracker = OpticalTracker;

})
();
