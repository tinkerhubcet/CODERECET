// import { useEffect } from 'react';
// import '@n8n/chat/style.css';
// import { createChat } from '@n8n/chat';

// export default function Chat() {
// 	useEffect(() => {
		

// 		createChat({
// 			webhookUrl: 'https://roshin2005.app.n8n.cloud/webhook/339ff846-b04e-4ad9-99f2-9d5c97517cdb/chat',
// 			mode: 'embedded',
// 			showWelcomeScreen: true,
// 			initialMessages: ['Hi there! 👋',
// 		'I am Vitalis. How can I assist you today?'],
// 			i18n: {
// 				en: {
// 					title: 'Vitalis Chat',
// 					subtitle: 'Your AI Health Assistant',
// 					footer: '',
// 					getStarted: 'Get Started',
// 					inputPlaceholder: 'Type your message...',
// 				}
// 			}
// 		});
// 	}, []);

// 	return (
// 		<div >
// 			{/* Chat will be rendered here by n8n */}
// 		</div>
// 	);
// }



// import { useEffect, useState, useRef } from 'react';
// import { Mic, MicOff, Send } from 'lucide-react';
// import '@n8n/chat/style.css';
// import { createChat } from '@n8n/chat';

// export default function Chat() {
//   const [isListening, setIsListening] = useState(false);
//   const [transcript, setTranscript] = useState('');
//   const [isSupported, setIsSupported] = useState(false);
//   const recognitionRef = useRef(null);
//   const chatInitialized = useRef(false);

//   useEffect(() => {
//     // Check if speech recognition is supported
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     setIsSupported(!!SpeechRecognition);

//     if (SpeechRecognition && !chatInitialized.current) {
//       // Initialize n8n chat
//       createChat({
//         webhookUrl: 'https://roshin2005.app.n8n.cloud/webhook/339ff846-b04e-4ad9-99f2-9d5c97517cdb/chat',
//         mode: 'embedded',
//         showWelcomeScreen: true,
//         initialMessages: [
//           'Hi there! 👋',
//           'I am Vitalis. How can I assist you today?'
//         ],
//         i18n: {
//           en: {
//             title: 'Vitalis Chat',
//             subtitle: 'Your AI Health Assistant',
//             footer: '',
//             getStarted: 'Get Started',
//             inputPlaceholder: 'Type your message...',
//           }
//         }
//       });
//       chatInitialized.current = true;

//       // Setup speech recognition
//       const recognition = new SpeechRecognition();
//       recognition.continuous = true;
//       recognition.interimResults = true;
//       recognition.lang = 'en-US';

//       recognition.onstart = () => {
//         setIsListening(true);
//       };

//       recognition.onresult = (event) => {
//         let finalTranscript = '';
//         let interimTranscript = '';

//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           const transcript = event.results[i][0].transcript;
//           if (event.results[i].isFinal) {
//             finalTranscript += transcript;
//           } else {
//             interimTranscript += transcript;
//           }
//         }

//         setTranscript(finalTranscript + interimTranscript);
//       };

//       recognition.onerror = (event) => {
//         console.error('Speech recognition error:', event.error);
//         setIsListening(false);
//       };

//       recognition.onend = () => {
//         setIsListening(false);
//       };

//       recognitionRef.current = recognition;
//     }
//   }, []);

//   const startListening = () => {
//     if (recognitionRef.current && !isListening) {
//       setTranscript('');
//       recognitionRef.current.start();
//     }
//   };

//   const stopListening = () => {
//     if (recognitionRef.current && isListening) {
//       recognitionRef.current.stop();
//     }
//   };

//   const sendToChat = (text) => {
//     if (!text.trim()) return;

//     // Wait a bit for chat to be fully loaded
//     setTimeout(() => {
//       // Find the chat input textarea
//       const chatInput = document.querySelector('[data-test-id="chat-input"], .chat-inputs textarea, textarea[placeholder*="message"]');
      
//       if (chatInput) {
//         // Set the value
//         chatInput.value = text;
        
//         // Trigger input event to update the component state
//         const inputEvent = new Event('input', { bubbles: true });
//         chatInput.dispatchEvent(inputEvent);
        
//         // Find and click the send button
//         setTimeout(() => {
//           const sendButton = document.querySelector('.chat-input-send-button, button[type="submit"], .chat-inputs-controls button');
//           if (sendButton && !sendButton.disabled) {
//             sendButton.click();
//           }
//         }, 100);
//       }
//     }, 500);
//   };

//   const handleSendVoiceMessage = () => {
//     if (transcript.trim()) {
//       sendToChat(transcript);
//       setTranscript('');
//     }
//   };

//   if (!isSupported) {
//     return (
//       <div className="p-4">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.
//         </div>
//         <div id="n8n-chat"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative">
//       {/* Voice Control Panel */}
//       <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 border z-50 max-w-sm">
//         <h3 className="text-lg font-semibold mb-3 text-gray-800">Voice Input</h3>
        
//         {/* Voice Controls */}
//         <div className="flex gap-2 mb-3">
//           <button
//             onClick={startListening}
//             disabled={isListening}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
//               isListening 
//                 ? 'bg-red-500 text-white cursor-not-allowed' 
//                 : 'bg-blue-500 hover:bg-blue-600 text-white'
//             }`}
//           >
//             <Mic size={16} />
//             {isListening ? 'Listening...' : 'Start'}
//           </button>
          
//           <button
//             onClick={stopListening}
//             disabled={!isListening}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
//               !isListening 
//                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
//                 : 'bg-red-500 hover:bg-red-600 text-white'
//             }`}
//           >
//             <MicOff size={16} />
//             Stop
//           </button>
//         </div>

//         {/* Transcript Display */}
//         {transcript && (
//           <div className="mb-3">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Transcript:
//             </label>
//             <div className="bg-gray-50 border rounded-lg p-3 text-sm max-h-32 overflow-y-auto">
//               {transcript || 'Start speaking...'}
//             </div>
//           </div>
//         )}

//         {/* Send Button */}
//         <button
//           onClick={handleSendVoiceMessage}
//           disabled={!transcript.trim()}
//           className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
//             !transcript.trim()
//               ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//               : 'bg-green-500 hover:bg-green-600 text-white'
//           }`}
//         >
//           <Send size={16} />
//           Send to Chat
//         </button>

//         {/* Status Indicator */}
//         <div className="mt-2 text-xs text-center">
//           {isListening && (
//             <span className="text-red-500 animate-pulse">🔴 Recording...</span>
//           )}
//         </div>
//       </div>

//       {/* Chat Container */}
//       <div>
//         {/* Chat will be rendered here by n8n */}
//       </div>
//     </div>
//   );
// }



import { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, Send, Minimize2, Maximize2 } from 'lucide-react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

export default function Chat() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const recognitionRef = useRef(null);
  const chatInitialized = useRef(false);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition && !chatInitialized.current) {
      // Initialize n8n chat
      createChat({
        webhookUrl: 'https://roshin2005.app.n8n.cloud/webhook/339ff846-b04e-4ad9-99f2-9d5c97517cdb/chat',
        mode: 'embedded',
        showWelcomeScreen: true,
        initialMessages: [
          'Hi there! 👋',
          'I am Vitalis. How can I assist you today?'
        ],
        i18n: {
          en: {
            title: 'Vitalis Chat',
            subtitle: 'Your AI Health Assistant',
            footer: '',
            getStarted: 'Get Started',
            inputPlaceholder: 'Type your message...',
          }
        }
      });
      chatInitialized.current = true;

      // Setup speech recognition
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const sendToChat = (text) => {
    if (!text.trim()) return;

    // Wait a bit for chat to be fully loaded
    setTimeout(() => {
      // Find the chat input textarea
      const chatInput = document.querySelector('[data-test-id="chat-input"], .chat-inputs textarea, textarea[placeholder*="message"]');
      
      if (chatInput) {
        // Set the value
        chatInput.value = text;
        
        // Trigger input event to update the component state
        const inputEvent = new Event('input', { bubbles: true });
        chatInput.dispatchEvent(inputEvent);
        
        // Find and click the send button
        setTimeout(() => {
          const sendButton = document.querySelector('.chat-input-send-button, button[type="submit"], .chat-inputs-controls button');
          if (sendButton && !sendButton.disabled) {
            sendButton.click();
          }
        }, 100);
      }
    }, 500);
  };

  const handleSendVoiceMessage = () => {
    if (transcript.trim()) {
      sendToChat(transcript);
      setTranscript('');
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.
        </div>
        <div id="n8n-chat"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Voice Control Panel */}
      <div className={`fixed top-4 right-4 bg-white shadow-lg rounded-lg border z-50 transition-all duration-300 ${
        isMinimized ? 'w-12 h-12' : 'w-80 p-4'
      }`}>
        
        {/* Header with Title and Minimize/Maximize Button */}
        <div className="flex justify-between items-center mb-3">
          {!isMinimized && (
            <h3 className="text-lg font-semibold text-gray-800">Voice Input</h3>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className={`flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100 ${
              isMinimized ? 'w-12 h-12 absolute top-0 left-0' : 'w-8 h-8'
            }`}
            title={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 size={20} /> : <Minimize2 size={16} />}
          </button>
        </div>

        {/* Main Content - Hidden when minimized */}
        {!isMinimized && (
          <>
            {/* Voice Controls */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={startListening}
                disabled={isListening}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <Mic size={16} />
                {isListening ? 'Listening...' : 'Start'}
              </button>
              
              <button
                onClick={stopListening}
                disabled={!isListening}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  !isListening 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                <MicOff size={16} />
                Stop
              </button>
            </div>

            {/* Transcript Display */}
            {transcript && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transcript:
                </label>
                <div className="bg-gray-50 border rounded-lg p-3 text-sm max-h-32 overflow-y-auto">
                  {transcript || 'Start speaking...'}
                </div>
              </div>
            )}

            {/* Send Button */}
            <button
              onClick={handleSendVoiceMessage}
              disabled={!transcript.trim()}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                !transcript.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <Send size={16} />
              Send to Chat
            </button>

            {/* Status Indicator */}
            <div className="mt-2 text-xs text-center">
              {isListening && (
                <span className="text-red-500 animate-pulse">🔴 Recording...</span>
              )}
            </div>
          </>
        )}
        
        {/* Minimized Status Indicator */}
        {isMinimized && isListening && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </div>

      {/* Chat Container */}
      <div>
        {/* Chat will be rendered here by n8n */}
      </div>
    </div>
  );
}