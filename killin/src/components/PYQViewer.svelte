<script>
  import { onMount } from 'svelte';

  let pyqs = [];
  let loading = true;
  let error = null;
  let selectedSemester = 'S1';
  let selectedSubject = '';

  const API_URL =
    'https://script.google.com/macros/s/AKfycbytUM9IzkiTFk0FOzEvpifMqOGqW1nzZnvIX8z9AM8t0BIGVWDeDRcs5vWN7OQds-e8/exec';

  onMount(async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      pyqs = data;
    } catch (err) {
      error = 'Failed to fetch PYQs';
      console.error(err);
    } finally {
      loading = false;
    }
  });

  function getSubjectsBySemester(sem) {
    const subjects = pyqs
      .filter((qp) => qp.Semester === sem)
      .map((qp) => qp.Subject);
    return [...new Set(subjects)];
  }

  function getQPsForSubject(subject) {
    return pyqs.filter(
      (qp) => qp.Subject === subject && qp.Semester === selectedSemester
    );
  }

  function groupByYear(qps) {
    return qps.reduce((acc, curr) => {
      const year = curr.Year;
      if (!acc[year]) acc[year] = [];
      acc[year].push(curr);
      return acc;
    }, {});
  }
</script>

<!-- Page Container with grid background -->
<div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10"
     style="background-image: 
       linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
       linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
       background-size: 40px 40px;">
  
  <!-- Welcome Heading & Image -->
  <div class="text-center mb-8">
    
    <h1 class="text-4xl font-extrabold text-purple-700 flex justify-center items-center gap-2">
      📘 KTU PYQ Explorer
    </h1>
  </div>

  <!-- Semester Filter -->
  <div class="flex justify-center gap-4 mb-6">
    {#each ['S1', 'S2'] as sem}
      <button
        class="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border-2 border-purple-500 
                {selectedSemester === sem
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-purple-600 hover:bg-purple-100'}"
        on:click={() => {
          selectedSemester = sem;
          selectedSubject = '';
        }}
      >
        Semester {sem[1]}
      </button>
    {/each}
  </div>

  <!-- Subject Filter -->
  <div class="flex flex-wrap justify-center gap-4 mb-10 max-w-4xl">
    {#each getSubjectsBySemester(selectedSemester) as subject}
      <button
        on:click={() => (selectedSubject = subject)}
        class="px-6 py-2 text-sm rounded-full font-semibold border-2 transition-all duration-200
                {selectedSubject === subject
                  ? 'bg-purple-500 text-white border-purple-500'
                  : 'bg-white text-purple-600 border-purple-300 hover:bg-purple-100'}"
      >
        {subject}
      </button>
    {/each}
  </div>

  <!-- Loader or Content -->
  {#if loading}
    <p class="text-gray-600 text-center">Loading...</p>
  {:else if error}
    <p class="text-red-500 text-center">{error}</p>
  {:else if selectedSubject}
    <!-- Grouped Question Papers by Year -->
    <div class="space-y-8 max-w-6xl w-full">
      {#each Object.entries(groupByYear(getQPsForSubject(selectedSubject))) as [year, qps]}
        <div>
          <h3 class="text-lg font-bold mb-3 text-purple-700">{year}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {#each qps as qp}
              <div class="bg-white border border-gray-200 rounded-xl shadow-md p-4 text-center transition transform hover:scale-105 hover:shadow-lg">
                <p class="font-medium text-sm text-gray-800 mb-1">{qp["Exam Type"]}</p>
                <a
                  href={qp["PDF Link"]}
                  class="text-purple-600 hover:underline text-sm font-semibold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View PDF
                </a>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-gray-500 text-sm mt-6">Select a subject to view question papers.</p>
  {/if}
</div>
