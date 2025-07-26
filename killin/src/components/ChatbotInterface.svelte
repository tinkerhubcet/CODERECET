<script>
    import { onMount, tick } from 'svelte';

    // API Endpoints for your padbot_api backend
    // IMPORTANT: Replace these with the actual URLs of your running padbot_api endpoints.
    // Example: const UPLOAD_API = 'http://localhost:5000/upload';
    // Example: const ASK_API = 'http://localhost:5000/ask';
    const UPLOAD_API = 'http://localhost:5000/upload';
    const ASK_API = 'http://localhost:5000/ask';

    let messages = []; // Array to store chat messages
    let currentMessage = ''; // Binds to the message input field
    let selectedFile = null; // Stores the selected file object
    let fileUploaded = false; // Flag to check if a file has been successfully uploaded
    let loading = false; // To show a loading indicator for API calls
    let error = null; // To display any API errors

    onMount(async () => {
        console.log('Chatbot interface mounted.');
        // Initial welcome message from the bot
        messages = [{ sender: 'bot', text: "Hello! I'm your friendly chatbot. Please upload a PDF to begin.", showActions: false }];
        await tick(); // Wait for DOM update
        scrollToBottom();
    });

    // Function to scroll chat messages to the bottom
    async function scrollToBottom() {
        await tick(); // Ensure DOM has updated before scrolling
        const chatMessagesDiv = document.getElementById('chat-messages');
        if (chatMessagesDiv) {
            chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
        }
    }

    // Handles file selection
    function handleFileSelect(event) {
        selectedFile = event.target.files[0];
        if (selectedFile) {
            // Display a message in chat that file is selected
            messages = [...messages, { sender: 'system', text: `File selected: ${selectedFile.name}` }];
            scrollToBottom();
        }
    }

    // Upload PDF file to the backend
    async function uploadFile() {
        if (!selectedFile) {
            messages = [...messages, { sender: 'system', text: 'Please select a PDF file to upload.', isError: true }];
            scrollToBottom();
            return;
        }

        loading = true; // Show loading indicator
        error = null; // Clear previous errors
        messages = [...messages, { sender: 'system', text: `Uploading ${selectedFile.name}...` }];
        scrollToBottom();

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch(UPLOAD_API, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                fileUploaded = true;
                messages = [...messages, { sender: 'bot', text: 'File uploaded successfully! You can now ask questions about it.', showActions: false }];
            } else {
                error = data.error || 'Upload failed.';
                messages = [...messages, { sender: 'bot', text: `Upload failed: ${error}`, isError: true }];
            }
        } catch (err) {
            console.error('Upload Error:', err);
            error = 'Error uploading file: ' + err.message;
            messages = [...messages, { sender: 'bot', text: `Error uploading file: ${err.message}`, isError: true }];
        } finally {
            loading = false; // Hide loading indicator
            selectedFile = null; // Clear selected file after upload attempt
            // Reset file input value to allow re-uploading the same file if needed
            document.getElementById('pdf-upload-input').value = '';
            scrollToBottom();
        }
    }

    // Ask question to backend
    async function sendMessage() {
        const trimmedMessage = currentMessage.trim();

        if (!fileUploaded) {
            messages = [...messages, { sender: 'system', text: 'Please upload a PDF first before asking questions.', isError: true }];
            scrollToBottom();
            return;
        }
        if (!trimmedMessage) return; // Don't send empty messages

        messages = [...messages, { sender: 'user', text: trimmedMessage }];
        currentMessage = ''; // Clear input field
        scrollToBottom();

        loading = true; // Show loading indicator
        error = null; // Clear previous errors

        try {
            const response = await fetch(ASK_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: trimmedMessage })
            });

            const data = await response.json();

            if (response.ok) {
                messages = [...messages, { sender: 'bot', text: data.answer, showActions: true }];
            } else {
                error = data.error || 'Something went wrong.';
                messages = [...messages, { sender: 'bot', text: `Error: ${error}`, isError: true }];
            }
        } catch (err) {
            console.error('API Error:', err);
            error = 'Error: Could not connect to the chatbot. Please try again.';
            messages = [...messages, { sender: 'bot', text: `Error: ${err.message}`, isError: true }];
        } finally {
            loading = false; // Hide loading indicator
            scrollToBottom();
        }
    }

    // Function to handle copy action
    function handleCopy(event, msgText) {
        event.stopPropagation();
        const el = document.createElement('textarea');
        el.value = msgText;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        messages = [...messages, { sender: 'system', text: 'Message copied to clipboard!' }];
        scrollToBottom();
    }

    // Function to handle like action
    function handleLike(event, msgText) {
        event.stopPropagation();
        console.log('Liked message:', msgText);
        messages = [...messages, { sender: 'system', text: 'You liked this message!' }];
        scrollToBottom();
        // Implement your like logic here (e.g., send feedback to backend)
    }

    // Function to handle dislike action
    function handleDislike(event, msgText) {
        event.stopPropagation();
        console.log('Disliked message:', msgText);
        messages = [...messages, { sender: 'system', text: 'You disliked this message!' }];
        scrollToBottom();
        // Implement your dislike logic here (e.g., send feedback to backend)
    }
</script>

<div class="relative flex flex-col w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden h-[90vh] md:h-[80vh]">
    <!-- Chatbot Header -->
    <div class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md rounded-t-2xl">
        <div class="flex items-center space-x-3">
            <a href="./exam">
            <button class="text-white focus:outline-none">
                <!-- Back Arrow Icon (SVG) -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
            </button>
            </a>
            <h1 class="text-xl font-semibold">Chatbot</h1>
        </div>
        <div class="flex items-center space-x-4">
            <button class="text-white focus:outline-none">
                <!-- Search Icon (SVG) -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </button>
            <button class="text-white focus:outline-none">
                <!-- Three Dots Icon (SVG) -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                </svg>
            </button>
        </div>
    </div>

    <!-- Chat Messages Area -->
    <div id="chat-messages" class="flex-1 p-4 overflow-y-auto chat-messages space-y-4">
        {#each messages as msg}
            {#if msg.sender === 'bot'}
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-white text-xl">
                        🤖
                    </div>
                    <div class="flex flex-col">
                        <div class="bg-blue-100 text-blue-900 p-3 rounded-xl rounded-bl-none shadow-sm max-w-[80%]">
                            <p>{msg.text}</p>
                        </div>
                        {#if msg.showActions}
                            <!-- Action buttons for bot response -->
                            <div class="flex items-center space-x-3 mt-2 ml-1 text-gray-500">
                                <button on:click={(e) => handleCopy(e, msg.text)} class="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200">
                                    <!-- Copy Icon (SVG) -->
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125H9.375A1.125 1.125 0 018.25 20.625V6.625a1.125 1.125 0 011.125-1.125h3.375c.621 0 1.125.504 1.125 1.125V17.25z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M18.75 8.25h-2.25m0 0a1.5 1.5 0 01-1.5-1.5V5.25A1.5 1.5 0 0117.25 3h2.25A1.5 1.5 0 0121 4.5v2.25A1.5 1.5 0 0119.5 8.25z" />
                                    </svg>
                                    <span class="text-xs">Copy</span>
                                </button>
                                <button on:click={(e) => handleLike(e, msg.text)} class="flex items-center space-x-1 hover:text-green-600 transition-colors duration-200">
                                    <!-- Like Icon (SVG) -->
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5v1.5c0 .866.57 1.607 1.334 1.848 1.41.424 2.521 1.074 3.463 1.848A3.375 3.375 0 0022.5 12c0 .812-.975 1.45-2.25 1.45H15c-.966 0-1.89-.42-2.38-1.125l-.03-.045m-6.316-5.698l1.049-1.049m-9.152 2.102a48.487 48.487 0 006.157 2.1c1.173.19 2.396.074 3.483-.364F 15 15.75H9.438a48.406 48.406 0 01-1.516-.298 48.498 48.498 0 00-4.022-.878A7.5 7.5 0 01.75 12c0-.789.306-1.553.842-2.162z" />
                                    </svg>
                                    <span class="text-xs">Like</span>
                                </button>
                                <button on:click={(e) => handleDislike(e, msg.text)} class="flex items-center space-x-1 hover:text-red-600 transition-colors duration-200">
                                    <!-- Dislike Icon (SVG) -->
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 10.5h.75m-7.5 3h7.5m-7.5 3h7.5M12 10.5h2.25m-2.25 3h2.25m-2.25 3h2.25M18.75 10.5h.008v.008h-.008V10.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 3h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 3h.008v.008h-.008V16.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                    <span class="text-xs">Dislike</span>
                                </button>
                            </div>
                        {/if}
                    </div>
                </div>
            {:else if msg.sender === 'user'}
                <div class="flex justify-end">
                    <div class="bg-blue-600 text-white p-3 rounded-xl rounded-br-none shadow-sm max-w-[80%]">
                        <p>{msg.text}</p>
                    </div>
                </div>
            {:else if msg.sender === 'system'}
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center {msg.isError ? 'bg-red-500' : 'bg-gray-400'} rounded-full text-white text-xl">
                        {msg.isError ? '⚠️' : 'ℹ️'}
                    </div>
                    <div class="bg-gray-100 text-gray-800 p-3 rounded-xl rounded-bl-none shadow-sm max-w-[80%]">
                        <p>{msg.text}</p>
                    </div>
                </div>
            {/if}
        {/each}
        {#if loading}
            <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full text-white text-xl">
                    🤖
                </div>
                <div class="bg-blue-100 text-blue-900 p-3 rounded-xl rounded-bl-none shadow-sm max-w-[80%]">
                    <p>Typing...</p>
                </div>
            </div>
        {/if}
    </div>

    <!-- Message Input Area -->
    <div class="p-4 bg-gray-50 border-t border-gray-200 flex flex-col space-y-3 rounded-b-2xl">
        <!-- File Upload Section -->
        <div class="flex items-center space-x-3">
            <label for="pdf-upload-input" class="cursor-pointer bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition-colors duration-200">
                <!-- Upload Icon (SVG) -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <input type="file" id="pdf-upload-input" accept=".pdf" class="hidden" on:change={handleFileSelect} disabled={loading}>
            </label>
            <button on:click={uploadFile} class="flex-1 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200" disabled={loading || !selectedFile}>
                Upload PDF
            </button>
        </div>

        <!-- Chat Input Section -->
        <div class="flex items-center space-x-3">
            <input
                type="text"
                placeholder={fileUploaded ? "Type your message..." : "Upload a PDF to enable chat..."}
                class="flex-1 p-3 rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                bind:value={currentMessage}
                on:keypress={(e) => { if (e.key === 'Enter') sendMessage(); }}
                disabled={loading || !fileUploaded}
            >
            <button on:click={sendMessage} class="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200" disabled={loading || !fileUploaded || !currentMessage.trim()}>
                <!-- Send Icon (SVG) -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 rotate-90">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
            </button>
        </div>
    </div>
</div>

<style>
    /* Custom scrollbar for chat messages */
    .chat-messages::-webkit-scrollbar {
        width: 8px;
    }
    .chat-messages::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }
    .chat-messages::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
    }
    .chat-messages::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
</style>
