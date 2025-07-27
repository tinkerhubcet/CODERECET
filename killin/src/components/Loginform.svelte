<script>
  let email = '';
  let password = '';

  function handleSubmit() {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    // Simulate login, then redirect
    console.log('Login:', { email, password });
    window.location.href = '/main'; // change to '/index' if needed
  }
</script>

<div class="modal">
  <div class="popup shadow-lg">
    <h2 class="text-2xl font-bold text-center mb-4 text-purple-700">Welcome Back! to Padhek</h2>

    <input
      type="email"
      placeholder="Email"
      bind:value={email}
      class="input-field"
    />
    <input
      type="password"
      placeholder="Password"
      bind:value={password}
      class="input-field"
    />

    <button on:click={handleSubmit} class="btn-login">Login</button>
  </div>
</div>

<style>
  .modal {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .popup {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    width: 100%;
    max-width: 350px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(8px);
  }

  .input-field {
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    outline: none;
  }

  .input-field:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.3);
  }

  .btn-login {
    background-color: #8b5cf6;
    color: white;
    padding: 0.75rem;
    border: none;
    border-radius: 9999px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .btn-login:hover {
    background-color: #7c3aed;
  }
</style>
