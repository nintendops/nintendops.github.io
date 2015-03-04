2/25
8char drum: great example from mohayonao 

2/18
new option for js synthesizer?
	- http://mohayonao.github.io/timbre.js/

2/10 - 2/18
integrate sonantX into tracker
 - changes to sythesizer parameter are made every 32 beats now
 - regions of the screen dedicated to different transfomrations
 - response delay is still a problem

an alternative:
 - concurrently play different layers. Switching volumn to reach crossfading effect
	
2/10
results from code study of sonantX:
 - key point: synthesizer should create music nodes of which length is short enough so that music can be generated on the fly
 - what we can control on the fly: oscillator parameters (Vol, Oct, Semi, Det), envelope, LFO, FX
 

2/5
 - what attributes of audio could we change on the fly? volumn? pitch? rhythm? 
 - if we can't flexibly manipulate pitch and speed, what sound effects could we have?

reference:
http://sonantlive.bitsnbites.eu/#gettingStarted
http://dashersw.github.io/pedalboard.js/
https://github.com/goldfire/howler.js
http://chimera.labs.oreilly.com/books/1234000001552/index.html
http://webaudiodemos.appspot.com/
http://middleearmedia.com/web-audio-api-oscillators/

2/1-2/2
 - optical flow controls volumn of soundtrack and direction of starfield

1/29-30
- testing oflow vectors
- implementing audio GainNode
- integrating starfield code

1/28
 - graphics example: http://www.chromeexperiments.com/detail/optical-flow-effects/?f=
	- https://github.com/anvaka/oflow (most important)
	- http://threejs.org/
	- http://www.html5rocks.com/en/tutorials/webrtc/basics/
	- http://www.html5rocks.com/en/tutorials/getusermedia/intro/
 - audio channel generators: http://sonantlive.bitsnbites.eu/tool/?song=synth4k

1/25 
- integrating audio, animation and tracker
- working on 1 degree of freedom: tracker plays music when threshold is reached


1/21 -22
dealing with audio (2-4h). References:
 - http://chimera.labs.oreilly.com/books/1234000001552/ch02.html
 - http://www.html5rocks.com/en/tutorials/webaudio/intro/
 - https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode
 - http://stackoverflow.com/questions/2839844/best-practice-for-inserting-large-chunks-of-html-into-elements-with-javascript 

audio.js
	implemented play, pause, stop function


1/20

references
 - integrating tracking api to a flashcanvas example
 - http://taligarsiel.com/Projects/howbrowserswork1.htm
 - http://www.html5rocks.com/en/tutorials/async/deferred/

1/15

tracking.js
    - simple code to track face moving speed with trackingjs 1h
    - looking into more tools 1h

potential tools to use
- motion detection library: https://github.com/ReallyGood/js-motion-detection
- html5 audio tool: http://www.html5rocks.com/en/tutorials/webaudio/intro/
- interactive graphics: https://code.google.com/p/flashcanvas/wiki/Examples
- more graphics: http://threejs.org/examples/#webgl_lines_colors

a good example of interactive webcam motion detection here:
http://www.soundstep.com/blog/2012/03/22/javascript-motion-detection/


1/10 - 1/13	overview of facetacker tools, audio tools and graphic tools
	- web development decided to be the best platform for this project
	- facetracking: trackingjs.com
	- audio control: HTML5 <audio> element

problem with facetracking
- motion detection is weak
- only track faces, but users are likely to move other parts of body instead of head


