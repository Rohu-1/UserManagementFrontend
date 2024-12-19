<script>
    import { navigate } from "svelte-routing";
    import axios from "axios";
  
    let email = "";
    let password = "";
    let error = "";
  
    async function handleLogin() {
      try {
        const response = await axios.post("/api/auth/login", { email, password });
        console.log("Login successful", response.data);
        localStorage.setItem("token", response.data.token); // Assuming the backend returns a token
        navigate("/");
      } catch (err) {
        error = err.response?.data?.error || "An error occurred during login";
      }
    }
  </script>
  
  <h1>Login</h1>
  <form on:submit|preventDefault={handleLogin}>
    <div>
      <label for="email">Email:</label>
      <input id="email" type="email" bind:value={email} required>
    </div>
    <div>
      <label for="password">Password:</label>
      <input id="password" type="password" bind:value={password} required>
    </div>
    <button type="submit">Login</button>
  </form>
  {#if error}
    <p class="error">{error}</p>
  {/if}
  
  <style>
    form {
      display: flex;
      flex-direction: column;
      gap: 1em;
      max-width: 300px;
    }
    .error {
      color: red;
    }
  </style>