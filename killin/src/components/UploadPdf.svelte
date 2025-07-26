<script>
  let file = null;
  let message = '';
  let uploading = false;

  async function handleUpload() {
    if (!file) {
      message = 'Please choose a file';
      return;
    }

    uploading = true;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      message = res.ok ? '✅ ' + data.message : '❌ ' + data.error;
    } catch (err) {
      message = '❌ Upload failed';
    } finally {
      uploading = false;
    }
  }
</script>

<div class="bg-white text-black p-6 rounded-2xl shadow-lg space-y-4">
  <h2 class="text-xl font-semibold">1️⃣ Upload Your PDF</h2>
  <input type="file" accept="application/pdf" on:change={(e) => file = e.target.files[0]} class="file:mr-4 file:py-2 file:px-4 file:border file:rounded-full file:bg-slate-800 file:text-white file:cursor-pointer"/>
  <button on:click={handleUpload} class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl" disabled={uploading}>
    {uploading ? 'Uploading...' : 'Upload'}
  </button>
  {#if message}
    <p class="text-sm mt-2">{message}</p>
  {/if}
</div>
