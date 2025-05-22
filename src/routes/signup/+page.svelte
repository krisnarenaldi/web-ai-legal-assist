<script>
  import { supabase } from '$lib/supabaseClient';
  import { user } from '$lib/stores/user.js';
  import { onMount } from 'svelte';

  let apiKeyInfo = { loading: false, key: null, error: null };
  let debugMode = true;

  async function signUpWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/signup'
      }
    });
    if (error) {
      alert('Error signing up: ' + error.message);
    }
  }

  // Optionally handle user state after redirect
  onMount(async () => {
    const { data, error } = await supabase.auth.getUser();
    if (data?.user) {
      let firstName = '';
      if (data.user.user_metadata && data.user.user_metadata.full_name) {
        firstName = data.user.user_metadata.full_name.split(' ')[0];
      } else if (data.user.email) {
        firstName = data.user.email.split('@')[0];
      }
      // Set user store
      user.set({
        isLoggedIn: true,
        firstName,
        uuid: data.user.id,
        api_key: null
      });
      // Optionally redirect or show a message
      if (!debugMode) {
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    }
  });
</script>

<div class="bg"></div>
<div class="bg bg2"></div>
<div class="bg bg3"></div>

<h1 class="signup-title">Sign Up</h1>
<div class="signup-container">
  <button class="google-btn" on:click={signUpWithGoogle}>
    <span class="google-icon">
      <svg width="24" height="24" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.37 1.53 7.83 2.81l5.77-5.62C34.45 3.62 29.64 1.5 24 1.5 14.82 1.5 6.98 7.98 3.84 16.09l6.91 5.37C12.34 15.36 17.7 9.5 24 9.5z"/><path fill="#34A853" d="M46.15 24.55c0-1.55-.14-3.09-.41-4.55H24v9.09h12.42c-.54 2.9-2.17 5.36-4.6 7.02l7.07 5.5C43.98 37.53 46.15 31.53 46.15 24.55z"/><path fill="#FBBC05" d="M10.75 28.04a14.5 14.5 0 0 1 0-8.08l-6.91-5.37A23.94 23.94 0 0 0 1.85 24c0 3.73.89 7.27 2.49 10.41l6.91-5.37z"/><path fill="#EA4335" d="M24 46.5c6.48 0 11.92-2.14 15.89-5.84l-7.07-5.5c-2.01 1.35-4.58 2.22-8.82 2.22-6.3 0-11.66-5.86-13.25-13.04l-6.91 5.37C6.98 40.02 14.82 46.5 24 46.5z"/><path fill="none" d="M1.5 1.5h45v45h-45z"/></g></svg>
    </span>
    <span class="google-btn-text">Sign up with Google</span>
  </button>
  <p class="text-center text-sm text-gray-600" style="margin-top: 1.25rem;">Already have an account? <a class="font-medium text-[#187bcd] hover:text-[#03254c]" href="/signin">Sign in</a></p>
</div>

<style>
.signup-title {
  text-align: center;
  margin-top: 3rem;
  font-size: 2.2rem;
  font-weight: 700;
}
.signup-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2.5rem;
}
.google-btn {
  display: flex;
  align-items: center;
  background: #fff;
  color: #444;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s;
  outline: none;
}
.google-btn:hover {
  box-shadow: 0 4px 12px rgba(66,133,244,0.18);
  border-color: #4285F4;
}
.google-icon {
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
}
.google-btn-text {
  letter-spacing: 0.02em;
}

.bg {
animation:slide 3s ease-in-out infinite alternate;
  background-image: linear-gradient(-60deg, #6c3 50%, #09f 50%);
  bottom:0;
  left:-50%;
  opacity:.5;
  position:fixed;
  right:-50%;
  top:0;
  z-index:-1;
}

.bg2 {
  animation-direction:alternate-reverse;
  animation-duration:4s;
}

.bg3 {
  animation-duration:5s;
}

.content {
  background-color:rgba(255,255,255,.8);
  border-radius:.25em;
  box-shadow:0 0 .25em rgba(0,0,0,.25);
  box-sizing:border-box;
  left:50%;
  padding:10vmin;
  position:fixed;
  text-align:center;
  top:50%;
  transform:translate(-50%, -50%);
}

h1 {
  font-family:monospace;
}

@keyframes slide {
  0% {
    transform:translateX(-25%);
  }
  100% {
    transform:translateX(25%);
  }
}
</style>
