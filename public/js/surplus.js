
     
     //var theWavDataInFloat32;


   /*function floatTo16Bit(inputArray, startIndex){
       var output = new Uint16Array(inputArray.length-startIndex);
       for (var i = 0; i < inputArray.length; i++){
           var s = Math.max(-1, Math.min(1, inputArray[i]));
           output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
       }
       return output;
   }
   
   // This is passed in an unsigned 16-bit integer array. It is converted to a 32-bit float array.
   // The first startIndex items are skipped, and only 'length' number of items is converted.
   function int16ToFloat32(inputArray, startIndex, length) {
       var output = new Float32Array(inputArray.length-startIndex);
       for (var i = startIndex; i < length; i++) {
           var int = inputArray[i];
           // If the high bit is on, then it is a negative number, and actually counts backwards.
           var float = (int >= 0x8000) ? -(0x10000 - int) / 0x8000 : int / 0x7FFF;
           output[i] = float;
       }
       return output;
   }*/


  
         /*window.onload = function init() {
          try {
            // webkit shim
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
            window.URL = window.URL || window.webkitURL;
            
            audio_context = new AudioContext;
            console.log('Audio context set up.');
            console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
          } catch (e) {
            console.log(e);
            alert('No web audio support in this browser!');
          }
          
          navigator.getUserMedia(
                        {
                           "audio": {
                       "mandatory": {
                           "googEchoCancellation": "false",
                           "googAutoGainControl": "false",
                           "googNoiseSuppression": "false",
                           "googHighpassFilter": "false"
                       },
                       "optional": []
                   },
                  },
                     startUserMedia, function(e) {
            console.log('No live audio input: ' + e);
          });
   
              
        };
        
        
         var audio_context;
         var recorder;
         
         function startUserMedia(stream) {
           var input = audio_context.createMediaStreamSource(stream);
           console.log('Media stream created.');
           // Uncomment if you want the audio to feedback directly
           //input.connect(audio_context.destination);
           //console.log('Input connected to audio context destination.');
           
           recorder = new Recorder(input);
           console.log('Recorder initialised.');
         }
         
         function startRecording() {
            
           recorder && recorder.record();
           recorder && recorder.getBuffer(function(buffer) {
               console.log(buffer);
           });
           
           console.log('Recording...');
         }
         
         function stopRecording() {
           recorder && recorder.stop();
           console.log('Stopped recording.');
           
           // create WAV download link using audio data blob
           createDownloadLink();
           
           recorder.clear();
         }
         
         function createDownloadLink() {
           recorder && recorder.exportWAV(function(blob) {
             var url = URL.createObjectURL(blob);
             var li = document.createElement('li');
             var au = document.createElement('audio');
             var hf = document.createElement('a');
             
             au.controls = true;
             au.src = url;
             hf.href = url;
             hf.download = new Date().toISOString() + '.wav';
             hf.innerHTML = hf.download;
             li.appendChild(au);
             li.appendChild(hf);
             recordingslist.appendChild(li);
           });
         }
         
         
    $('#start-recording').on('click', function(e) {
         startRecording();
    
    });
    
    
   $('#stop-recording').on('click', function(e) { 
      stopRecording();
      
   });*/
      