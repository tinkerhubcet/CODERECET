<script>
  let role = '';
  let company = '';
  let githubLink = '';
  let resumeFile = null;
  let resumePreviewUrl = '';
  let resumeFileName = '';
  let resumeFileSize = '';
  let analysisResult = '';
  let fileError = '';
  let isUploading = false;

  function handleFileChange(event) {
    const file = event.target.files[0];
    fileError = '';

    if (!file) {
      resumeFile = null;
      resumeFileName = '';
      resumeFileSize = '';
      return;
    }

    if (resumePreviewUrl) {
      URL.revokeObjectURL(resumePreviewUrl);
      resumePreviewUrl = '';
    }

    const isValidPDF = file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith('.pdf') ||
      (file.type === "application/octet-stream" && file.name.toLowerCase().endsWith('.pdf'));

    if (isValidPDF) {
      resumeFile = file;
      resumeFileName = file.name;
      resumeFileSize = `${(file.size / 1024).toFixed(2)} KB`;

      try {
        resumePreviewUrl = URL.createObjectURL(file);
      } catch (error) {
        console.error('Error creating preview URL:', error);
        fileError = 'Error creating file preview';
      }
    } else {
      fileError = "Please upload a valid PDF file.";
      resumeFile = null;
      resumeFileName = '';
      resumeFileSize = '';
      event.target.value = '';
    }
  }

async function handleSubmit() {
  if (!resumeFile || !role || !company || !githubLink) {
    alert("Please complete all fields and upload the resume.");
    return;
  }

  isUploading = true;
  analysisResult = '';

  const formData = new FormData();
  formData.append('role', role);
  formData.append('company', company);
  formData.append('githubLink', githubLink);  // ✅ exact match
  formData.append('resumeFile', resumeFile);   // ✅ exact match

  try {
    const response = await fetch('http://localhost:5000/submit_preferences', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Unknown error');
    }

    const result = await response.json();
    console.log('Analysis result:', result);
    analysisResult = result.analysis || '✅ Analysis complete!';
  } catch (error) {
    console.error('❌ Error:', error);
    analysisResult = `❌ ${error.message}`;
  } finally {
    isUploading = false;
  }
}


</script>

<!-- HEADER -->
<header class="bg-gray-900 text-white py-5 px-8 flex justify-between items-center">
  <div class="text-xl font-bold">CareerNav</div>
  <nav class="space-x-6 text-sm">
    <a href="/" class="hover:text-pink-300">Home</a>
    <a href="/logout" class="hover:text-pink-300">Logout</a>
  </nav>
</header>

<!-- FORM BACKGROUND -->
<div class="w-full h-[calc(100vh-80px)] bg-gradient-to-br from-pink-50 to-blue-100 overflow-auto">
  <div class="w-full h-full p-8">
    <div class="w-full h-full rounded-lg p-8">
      <h2 class="text-3xl font-bold text-center text-purple-700 mb-2">Welcome to Career Nav</h2>
      <p class="text-center text-gray-600 mb-4">Let's achieve your career dreams 🚀</p>
      <div class="text-center mb-6">
        <span class="inline-block bg-yellow-200 text-yellow-800 text-sm px-4 py-1 rounded-full">Backend: Checking...</span>
      </div>

      <!-- FORM FIELDS -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-center text-gray-700 font-medium mb-0.5">Awaited Role</label>
          <input
            type="text"
            bind:value={role}
            placeholder="e.g. Frontend Developer"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label class="block text-center text-gray-700 font-medium mb-0.5">Dream Company</label>
          <input
            type="text"
            bind:value={company}
            placeholder="e.g. Google"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label class="block text-center text-gray-700 font-medium mb-0.5">Upload Resume (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            on:change={handleFileChange}
            class="w-full h-40 border border-dashed border-purple-400 p-3 text-center flex items-center justify-center rounded-lg shadow-sm"
          />
          {#if fileError}
            <p class="text-red-500 text-sm mt-1">{fileError}</p>
          {/if}
          {#if resumeFileName}
            <p class="text-gray-600 text-sm mt-1">📄 {resumeFileName} ({resumeFileSize})</p>
          {/if}
        </div>

        <div>
          <label class="block text-center text-gray-700 font-medium mb-0.5">GitHub Profile Link</label>
          <input
            type="url"
            bind:value={githubLink}
            placeholder="https://github.com/yourname"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <!-- PDF Preview -->
     
      <!-- Submit Button (Centered & Small) -->
      <div class="mt-6 flex justify-center">
        <button
          on:click={handleSubmit}
          class="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {isUploading ? 'Analyzing...' : 'Submit'}
        </button>
      </div>

      <!-- Result -->
      {#if analysisResult}
        <h1 class="text-2xl font-bold text-center text-purple-700 mt-6">Analysis Result</h1>
        <div class="mt-4 text-green-600 font-medium text-center">{analysisResult}</div>
      {/if}
    </div>
  </div>
</div>
