<script>
    import { navigate } from "svelte-routing";
    import axios from "axios";
  
    let email = "";
    let password = "";
    let name = "";
    let error = "";
  
    async function handleSignup() {
      try {
        const response = await axios.post("/api/auth/signup", { email, password, name });
        console.log("Signup successful", response.data);
        navigate("/login");
      } catch (err) {
        error = err.response?.data?.error || "An error occurred during signup";
      }
    }
  </script>
  
  <h1>Sign Up</h1>
  <form on:submit|preventDefault={handleSignup}>
    <div>
      <label for="name">Name:</label>
      <input id="name" type="text" bind:value={name} required>
    </div>
    <div>
      <label for="email">Email:</label>
      <input id="email" type="email" bind:value={email} required>
    </div>
    <div>
      <label for="password">Password:</label>
      <input id="password" type="password" bind:value={password} required>
    </div>
    <button type="submit">Sign Up</button>
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