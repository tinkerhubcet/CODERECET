<script>
  let userInput = '';
  let password = '';
  let rememberMe = false;
  let showPassword = false;
  let loading = false;

  function handleSubmit() {
    loading = true;
    console.log('Login attempt:', { userInput, password, rememberMe });

    // Simulate network delay
    setTimeout(() => {
      alert('Login not implemented. This is a mock.');
      loading = false;
    }, 1000);
  }

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }
</script>

<div class="flex flex-col items-center p-8 bg-white rounded-t-3xl shadow-lg w-full max-w-md md:rounded-3xl">
  <h2 class="text-4xl font-bold mb-2 text-gray-800 self-start">Welcome Back,</h2>
  <h1 class="text-5xl font-bold mb-8 text-gray-800 self-start">Log In!</h1>

  <form on:submit|preventDefault={handleSubmit} class="w-full space-y-6">
    <!-- Username/Email -->
    <div>
      <label for="userInput" class="sr-only">Username or Email</label>
      <input
        type="text"
        id="userInput"
        bind:value={userInput}
        placeholder="Enter your username or email"
        class="w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 text-lg"
        required
      />
    </div>

    <!-- Password -->
    <div>
      <label for="password" class="sr-only">Password</label>
      <div class="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          bind:value={password}
          placeholder="Password"
          class="w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 text-lg pr-10"
          required
        />
        <button
          type="button"
          on:click={togglePasswordVisibility}
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {#if showPassword}
            <!-- Eye Icon (Visible) -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          {:else}
            <!-- Eye Icon (Hidden) -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
            </svg>
          {/if}
        </button>
      </div>
    </div>

    <!-- Remember Me / Forgot -->
    <div class="flex items-center justify-between text-gray-600 text-sm">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" bind:checked={rememberMe} class="form-checkbox h-4 w-4 text-blue-600 rounded" />
        <span class="ml-2">Remember me</span>
      </label>
      <a href="/forgot-password" class="text-blue-600 hover:underline">Forgot password?</a>
    </div>

    <!-- Submit Button -->
    <a href="./main">
    <button
      type="submit"
      class="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition duration-200 shadow-lg disabled:opacity-50"
      disabled={loading}
    >
      {loading ? 'Logging in...' : 'Log in'}
    </button>
    </a>
  </form>

  <!-- Signup link -->
  <div class="mt-8 text-gray-500 text-md">
    Don't have an account? <a href="/signup" class="text-blue-600 font-bold hover:underline">Sign Up</a>
  </div>
</div>
