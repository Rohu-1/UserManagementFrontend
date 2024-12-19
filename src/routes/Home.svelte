<script>
    import { navigate } from "svelte-routing";
    import { onMount } from "svelte";
  
    let user = null;
  
    onMount(async () => {
      // Check if user is logged in (you might want to implement this on your backend)
      const token = localStorage.getItem("token");
      if (token) {
        // Fetch user data
        // user = await fetchUserData(token);
      }
    });
  
    function handleLogout() {
      localStorage.removeItem("token");
      navigate("/login");
    }
  </script>
  
  <h1>Welcome to the Auth App</h1>
  {#if user}
    <p>Hello, {user.name}!</p>
    <button on:click={handleLogout}>Logout</button>
  {:else}
    <p>Please <a href="/login">login</a> or <a href="/signup">sign up</a>.</p>
  {/if}