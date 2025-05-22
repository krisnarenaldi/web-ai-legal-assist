<script>
  import { supabase } from '$lib/supabaseClient.js';
  let errorMsg = '';

  async function signInWithGoogle() {
    errorMsg = '';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/signin'
      }
    });
    if (error) {
      errorMsg = 'Gagal masuk dengan Google. Silakan coba lagi.';
    }
  }
</script>

<section>
  <div class="wave">
    <span></span>
    <span></span>
    <span></span>
  </div>
  <div class="content">
   <h1 class="signin-title">Sign In</h1>
  <div class="signin-container">
    <button class="google-btn" on:click={signInWithGoogle}>
      <span class="google-icon">
        <svg width="24" height="24" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.37 1.53 7.83 2.81l5.77-5.62C34.45 3.62 29.64 1.5 24 1.5 14.82 1.5 6.98 7.98 3.84 16.09l6.91 5.37C12.34 15.36 17.7 9.5 24 9.5z"/><path fill="#34A853" d="M46.15 24.55c0-1.55-.14-3.09-.41-4.55H24v9.09h12.42c-.54 2.9-2.17 5.36-4.6 7.02l7.07 5.5C43.98 37.53 46.15 31.53 46.15 24.55z"/><path fill="#FBBC05" d="M10.75 28.04a14.5 14.5 0 0 1 0-8.08l-6.91-5.37A23.94 23.94 0 0 0 1.85 24c0 3.73.89 7.27 2.49 10.41l6.91-5.37z"/><path fill="#EA4335" d="M24 46.5c6.48 0 11.92-2.14 15.89-5.84l-7.07-5.5c-2.01 1.35-4.58 2.22-8.82 2.22-6.3 0-11.66-5.86-13.25-13.04l-6.91 5.37C6.98 40.02 14.82 46.5 24 46.5z"/><path fill="none" d="M1.5 1.5h45v45h-45z"/></g></svg>
      </span>
      <span class="google-btn-text" >Sign in with Google</span>
    </button>
    {#if errorMsg}
      <div class="text-red-500 mt-2">{errorMsg}</div>
    {/if}
    <p class="text-center text-sm text-white" style="margin-top: 1.25rem;">Don't have an account? <a class="font-medium text-[#005A9C] hover:text-[#0000FF]" href="/signup">Sign up</a></p>
  </div>
</div>
</section>

<style>
.signin-title {
  text-align: center;
  margin-top: 3rem;
  font-size: 2.2rem;
  font-weight: 700;
}
.signin-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* margin-top: 2.5rem; */
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

section {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
section .wave {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  background: #174ea6;
  box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.5);
  transition: 0.5s;
}
section .wave span {
  content: "";
  position: absolute;
  width: 325vh;
  height: 325vh;
  top: 0;
  left: 50%;
  transform: translate(-50%, -75%);
  background: #34a853;
}
.content {
  position: relative;
  z-index: 1;
  /* font-size: 4em; */
  letter-spacing: 2px;
  color: #fff;
}
section .wave span:nth-child(1) {
  border-radius: 45%;
  background: rgba(227, 116, 0, 1);
  animation: animate 5s linear infinite;
}

section .wave span:nth-child(2) {
  border-radius: 40%;
  background: rgba(52, 168, 83, 0.5);
  animation: animate 10s linear infinite;
}
section .wave span:nth-child(3) {
  border-radius: 42.5%;
  background: rgba(224, 67, 53, 0.5);
  animation: animate 15s linear infinite;
}
@keyframes animate {
  0% {
    transform: translate(-50%, -75%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -75%) rotate(360deg);
  }
}

</style>
