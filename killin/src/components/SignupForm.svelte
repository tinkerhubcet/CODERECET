<script>
  import { onMount } from 'svelte';
  let name = '';
  let email = '';
  let password = '';
  let confirmPassword = '';

  function handleSubmit(event) {
    event.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Simulate signup success
    console.log('Signup successful:', { name, email });
    alert('Signup successful! Redirecting to login...');

    // Redirect to login page
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  }

  function handleSocialSignup(provider) {
    console.log(`Attempting to sign up with ${provider}`);
    alert(`Sign up with ${provider} not implemented.`);
  }
</script>

<div class="flex flex-col items-center justify-center p-8 bg-white bg-opacity-90 backdrop-blur-xl rounded-xl shadow-lg max-w-4xl w-full">
  <h2 class="text-3xl font-bold mb-8 text-gray-800 text-center">Sign Up</h2>

  <form class="flex flex-col md:flex-row w-full gap-8" on:submit={handleSubmit}>
    <!-- Left: Input Fields -->
    <div class="flex-1 space-y-4">
      <input
        type="text"
        bind:value={name}
        placeholder="Full Name"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="email"
        bind:value={email}
        placeholder="Email Address"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="password"
        bind:value={password}
        placeholder="Password"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="password"
        bind:value={confirmPassword}
        placeholder="Confirm Password"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
      >
        Sign Up
      </button>
    </div>

    <!-- Right: Social Logins -->
    <div class="flex-1 flex flex-col items-center justify-center space-y-4 md:border-l md:border-gray-200 md:pl-8 pt-8 md:pt-0">
      <div class="text-gray-500 text-lg">Or</div>
      <div class="w-full space-y-3">
        <button
          type="button"
          on:click={() => handleSocialSignup('Google')}
          class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" class="w-5 h-5 mr-2" />
          Sign up with Google
        </button>
        <button
          type="button"
          on:click={() => handleSocialSignup('GitHub')}
          class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
        >
          <img src="https://www.svgrepo.com/show/349424/github.svg" alt="GitHub" class="w-5 h-5 mr-2" />
          Sign up with GitHub
        </button>
        <button
          type="button"
          on:click={() => handleSocialSignup('Microsoft')}
          class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
        >
          <img src="https://www.svgrepo.com/show/353874/microsoft.svg" alt="Microsoft" class="w-5 h-5 mr-2" />
          Sign up with Microsoft
        </button>
      </div>
    </div>
  </form>

  <div class="mt-8 text-gray-500 text-md">
    Already have an account?
    <a href="/login" class="text-blue-600 hover:underline font-medium">Log In</a>
  </div>
</div>
