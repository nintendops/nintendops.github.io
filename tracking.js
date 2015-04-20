(function () {

    function OpticalTracker() {
        // zoneSize affects the sensitivity of flow detection
        this.zoneSize = 8;
        this.tracking = false;
        this.videoElement = null;
        this.webCamFlow = new oflow.WebCamFlow(null, this.zoneSize);
        this.dx = 0;
        this.dy = 0;
    }

    OpticalTracker.prototype.start = function () {
        if (!this.tracking) {
            var _this = this;
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
                    _this.dx = direction.u;
                    _this.dy = direction.v;
                }
            );
            this.webCamFlow.startCapture();
            this.tracking = true;
            return this.webCamFlow;
        }
    };
    window.OpticalTracker = OpticalTracker;

})
();
