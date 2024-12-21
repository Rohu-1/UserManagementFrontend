<script>
    import { onMount } from 'svelte';
    import axios from 'axios';
  
    let user = null;
    let activities = [];
    let view = 'auth';
    let authMode = 'signup';
    let email = '';
    let password = '';
    let name = '';
    let error = '';
    let currentAction = '';
  
    onMount(async () => {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        user = JSON.parse(userJson);
        view = 'dashboard';
        currentAction = 'LOGIN';
        await fetchActivities();
      }
    });
  
    async function fetchActivities() {
      try {
        const response = await axios.get('https://usermanagementsystem-z2sv.onrender.com/api/activities', {
          headers: { Authorization: `Bearer ${user.id}` }
        });
        activities = response.data;
      } catch (err) {
        console.error('Error fetching activities:', err);
        error = 'Failed to fetch activities';
      }
    }
    async function handleAuth() {
  try {
    let response;
    if (authMode === 'signup') {
      // Client-side password validation
      if (password.length < 8) {
        error = 'Password must be at least 8 characters long';
        return; // Exit the function to prevent the API call
      }

      try {
        response = await axios.post('https://usermanagementsystem-z2sv.onrender.com/api/auth/signup', { email, password, name });
        currentAction = 'SIGNUP';
        view = 'signupSuccess';
      } catch (error) {
        if (error.response && error.response.status === 409) {
          error = 'User with this email already exists. Please login instead.';
        } else {
          error = error.response?.data?.error || 'An error occurred during signup';
        }
        console.error('Signup error:', error);
      }
    } else {
      // Login logic
      response = await axios.post('https://usermanagementsystem-z2sv.onrender.com/api/auth/login', { email, password });
      currentAction = 'LOGIN';
      user = response.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      view = 'dashboard';
      await fetchActivities();
    }
  } catch (err) {
    error = err.response?.data?.error || `An error occurred during ${authMode}`;
  }
}
    
    async function handleLogout() {
      try {
        await axios.post('https://usermanagementsystem-z2sv.onrender.com/api/auth/logout', { email: user.email });
        localStorage.removeItem('user');
        user = null;
        activities = [];
        view = 'auth';
        authMode = 'signup';
        currentAction = '';
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
  
    function toggleAuthMode() {
      authMode = authMode === 'signup' ? 'login' : 'signup';
      error = '';
    }
  </script>
  
  <main>
    <h1 class="app-title">User Management System</h1>
    
    {#if view === 'auth'}
      <div class="auth-container">
        <div class="auth-form">
          <h2>{authMode === 'signup' ? 'Sign Up' : 'Login'}</h2>
          <form on:submit|preventDefault={handleAuth}>
            {#if authMode === 'signup'}
              <input type="text" placeholder="Name" bind:value={name} required>
            {/if}
            <input type="email" placeholder="Email" bind:value={email} required>
            <input type="password" placeholder="Password" bind:value={password} required>
             <!-- Add the error message display here -->
          {#if error}
          <p class="error">{error}</p>
        {/if}
            <button type="submit">{authMode === 'signup' ? 'Sign Up' : 'Login'}</button>
          </form>
          <p>
            {authMode === 'signup' ? 'Already have an account?' : 'Don\'t have an account?'}
            <button class="toggle-auth" on:click={toggleAuthMode}>
              {authMode === 'signup' ? 'Login' : 'Sign Up'}
            </button>
          </p>
          {#if error}
            <p class="error">{error}</p>
          {/if}
        </div>
      </div>
    {:else if view === 'signupSuccess'}
      <div class="success-container">
        <h2>Sign Up Successful!</h2>
        <p>Please log in to check user activities.</p>
        <button on:click={() => { view = 'auth'; authMode = 'login'; }}>Go to Login</button>
      </div>
    {:else if view === 'dashboard'}
      <div class="dashboard-container">
        <h1>Welcome, {user.name}!</h1>
        <button on:click={handleLogout} class="logout-btn">Logout</button>
        <h2>Your Activities</h2>
        {#if activities.length > 0}
          <ul class="activity-list">
            {#each activities as activity}
              <li>
                <span>{new Date(activity.created_at).toLocaleString()}</span>
                <span>{activity.action}</span>
                <span>{activity.ip_address}</span>
              </li>
            {/each}
          </ul>
        {:else}
          <p>No activities recorded yet.</p>
        {/if}
      </div>
    {/if}
  </main>
  
  <style>
    main {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }
    .app-title {
      color:rgb(87, 70, 161);
      margin-bottom: 30px;
    }
    .auth-container, .dashboard-container, .success-container {
      background-color: #f0f0f0;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .auth-form {
      max-width: 300px;
      margin: 0 auto;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    input {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      padding: 10px;
      background-color: rgb(72, 88, 167);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #5b439e;
    }
    .toggle-auth {
      background: none;
      color: #654caf;
      padding: 0;
      font-size: 1em;
    }
    .toggle-auth:hover {
      text-decoration: underline;
      background: none;
    }
    .logout-btn {
      background-color: #f44336;
    }
    .logout-btn:hover {
      background-color: #da190b;
    }
    .error {
      color: red;
      margin-top: 10px;
    }
    .activity-list {
      list-style-type: none;
      padding: 0;
    }
    .activity-list li {
      background-color: #fff;
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
    }
    .success-container {
      text-align: center;
    }
  </style>