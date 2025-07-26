<script>
    let role = '';
    let company = '';
    let githubLink = '';
    let resumeFile = null;
  
    function handleFileChange(event) {
      resumeFile = event.target.files[0];
    }
  
    function handleSubmit() {
      alert("Your preferences were submitted!");
      console.log({
        role,
        company,
        githubLink,
        resumeFile,
      });
    }
  </script>
  
  
  <div class="bg-gradient-to-br from-rose-50 via-indigo-50 to-purple-50 min-h-screen">
    
    <header class="bg-gray-900 text-white py-5 px-8 flex justify-between items-center">
      <div class="text-xl font-bold">CareerNav</div>
      <nav class="space-x-6 text-sm">
        <a href="./main" class="hover:text-pink-300">Home</a>
        <a href="/logout" class="hover:text-pink-300">Logout</a>
      </nav>
    </header>
  
    
    <main class="max-w-4xl mx-auto px-6 py-12 text-center">
      <h2 class="text-3xl font-extrabold text-purple-700 mb-4">Welcome to Career Nav</h2>
      <p class="text-lg text-gray-700 mb-10">Let’s achieve your career dreams 🚀</p>
  
      
      <div class="grid gap-8 md:grid-cols-2 text-left">
        
        <div>
          <label class="block text-sm font-semibold text-gray-600 mb-1">Awaited Role</label>
          <input
            type="text"
            bind:value={role}
            placeholder="e.g. Frontend Developer"
            class="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 shadow focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
  
        
        <div>
          <label class="block text-sm font-semibold text-gray-600 mb-1">Dream Company</label>
          <input
            type="text"
            bind:value={company}
            placeholder="e.g. Google"
            class="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 shadow focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
  
        
        <div>
          <label class="block text-sm font-semibold text-gray-600 mb-1">Upload Resume</label>
          <label class="flex items-center justify-center border-2 border-dashed border-purple-300 bg-white rounded-xl h-32 cursor-pointer hover:bg-purple-50">
            <input type="file" class="hidden" on:change={handleFileChange} />
            <span class="text-purple-600">Click to Upload PDF</span>
          </label>
        </div>
  
        
        <div>
          <label class="block text-sm font-semibold text-gray-600 mb-1">GitHub Profile Link</label>
          <input
            type="url"
            bind:value={githubLink}
            placeholder="https://github.com/yourname"
            class="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 shadow focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
      </div>
  
      
      <div class="mt-12 text-center">
        <button
          on:click={handleSubmit}
          class="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow hover:bg-purple-700 transition duration-200"
        >
          Submit
        </button>
      </div>
    </main>
  </div>