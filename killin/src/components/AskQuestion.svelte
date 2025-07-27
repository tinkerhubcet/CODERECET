<script>
  let question = '';
  let answer = '';
  let loading = false;

  async function handleAsk() {
    if (!question.trim()) return;

    loading = true;
    answer = '';

    try {
      const res = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      const data = await res.json();
      answer = res.ok ? data.answer : '❌ ' + data.error;
    } catch (err) {
      answer = '❌ Failed to get response';
    } finally {
      loading = false;
    }
  }
</script>

<div class="bg-white text-black p-6 rounded-2xl shadow-lg space-y-4">
  <h2 class="text-xl font-semibold">2️⃣ Ask a Question</h2>
  <input type="text" placeholder="What would you like to know?" bind:value={question} class="w-full p-3 border rounded-md" />
  <button on:click={handleAsk} class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl" disabled={loading}>
    {loading ? 'Searching...' : 'Ask'}
  </button>

  {#if answer}
    <div class="bg-gray-100 p-4 rounded mt-4">
      <strong>Answer:</strong>
      <p>{answer}</p>
    </div>
  {/if}
</div>
