var Speech = function() {
		return {
        sdk: null,
    		recognizer: null,
        subscriptionKey: "1ff3693d61ac48128d0dd6bc941bd506",
        init: function(cbk) {
            require(["Speech.Browser.Sdk"], (SDK) => {
                this.sdk = SDK;
    						this.doInit();
    						if(cbk) cbk();
            });
        },
        
        // Setup the recongizer
        doInit: function() {
            var recognizerConfig = new this.sdk.RecognizerConfig(
                new this.sdk.SpeechConfig(
                    new this.sdk.Context(
                        new this.sdk.OS(navigator.userAgent, "Browser", null),
                        new this.sdk.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
                this.sdk.RecognitionMode.Interactive, // this.sdk.RecognitionMode.Interactive  (Options - Interactive/Conversation/Dictation>)
                "fr-FR", 
                this.sdk.SpeechResultFormat.Simple); // Simple/Detailed
        
            var authentication = new this.sdk.CognitiveSubscriptionKeyAuthentication(this.subscriptionKey);
        
            this.recognizer = this.sdk.CreateRecognizer(recognizerConfig, authentication);
        },
        
        // Start the recognition
        listen: function(cbk) {
            this.recognizer.Recognize((event) => {
                switch (event.Name) {
                    case "RecognitionTriggeredEvent" :
                        // console.log("Initializing");
                        break;
                    case "ListeningStartedEvent" :
                        // console.log("Listening");
                        break;
                    case "RecognitionStartedEvent" :
                        // console.log("Listening_Recognizing");
                        break;
                    case "SpeechStartDetectedEvent" :
                        // console.log("Listening_DetectedSpeech_Recognizing");
                        // console.log(JSON.stringify(event.Result)); 
                        break;
                    case "SpeechHypothesisEvent" :
                        // console.log(JSON.stringify(event.Result)); 
                        break;
                    case "SpeechEndDetectedEvent" :
                        // console.log("Processing_Adding_Final_Touches");
                        // console.log(JSON.stringify(event.Result)); 
                        restart();
                        break;
                    case "SpeechSimplePhraseEvent" :
                        // console.log("SpeechSimplePhraseEvent", JSON.stringify(event.Result, null, 3));
												if(cbk) cbk(event.Result);
                        break;
                    case "SpeechDetailedPhraseEvent" :
                        // console.log("SpeechSimplePhraseEvent", JSON.stringify(event.Result, null, 3));
                        break;
                    case "RecognitionEndedEvent" :
                        console.log('RecognitionEndedEvent', event); 
                        this.listen();
                        break;
                }
            })
            .On(() => {
                // The request succeeded. Nothing to do here.
            },
            (error) => {
                console.error('Error in ms-speech', error);
            });
        },
        
        // Stop the Recognition.
        stop: function() {
            // this.recognizer.AudioSource.Detach(audioNodeId) can be also used here. (audioNodeId is part of ListeningStartedEvent)
            this.recognizer.AudioSource.TurnOff();
        }
    };
};

