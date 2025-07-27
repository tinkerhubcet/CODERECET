<script>
  import { onMount } from 'svelte';

  onMount(() => {
    // Clear any authentication tokens (customize as needed)
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    document.cookie = 'authToken=; Max-Age=0; path=/'; // clear cookie

    // Simulate logout
    console.log('User logged out.');

    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  });
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
  <div class="bg-white p-8 rounded-lg shadow-lg text-center">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">Logging Out...</h1>
    <p class="text-gray-600">You are being safely logged out. Redirecting to login page...</p>
    <div class="mt-6">
      <a href="/login" class="text-blue-600 hover:underline">Click here if you are not redirected automatically</a>
    </div>
  </div>
</div>
