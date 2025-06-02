<script>
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	const currentPath = derived(page, ($page) => $page.url.pathname);
	import '../app.css';
	import { user } from '$lib/stores/user.js';
	import { credit, fetchCredit } from '$lib/stores/credit.js';
	import { supabase } from '$lib/supabaseClient.js';
	import { onMount } from 'svelte';
	
	// Get the data from the load function
	export let data;
	const { ogTags } = data;
	
	let { children } = $props();

	async function logout() {
		await supabase.auth.signOut();
		user.set({ isLoggedIn: false, firstName: '', uuid: null, api_key: null });
		credit.set(null);
	}

	// Fetch user's API key from profiles table
	async function fetchApiKey(userId) {
		console.log('Fetching API key for user ID:', userId);

		try {
			// First, check if the profiles table exists and has the user's profile
			const { data, error } = await supabase
				.from('profiles')
				.select('api_key')
				.eq('id', userId)
				.single();

			console.log('API key query result:', { data, error });

			if (error) {
				// If there's an error (like no profile found), log it
				console.error('Error fetching API key:', error);

				// Based on the memory, for testing we use a hardcoded API key
				console.log('Using test API key as fallback');
				return 'test-api-key-for-development';
			}

			// If we have data but no API key, use the test key
			if (!data?.api_key) {
				console.log('No API key found in profile, using test API key');
				return 'test-api-key-for-development';
			}

			console.log('API key found in profiles table:', data.api_key);
			return data.api_key;
		} catch (err) {
			console.error('Unexpected error fetching API key:', err);
			// Fallback to test API key
			return 'test-api-key-for-development';
		}
	}

	onMount(async () => {
		const { data, error } = await supabase.auth.getUser();
		console.log('data', data);
		if (data?.user) {
			let firstName = '';
			if (data.user.user_metadata && data.user.user_metadata.full_name) {
				firstName = data.user.user_metadata.full_name.split(' ')[0];
			} else if (data.user.email) {
				firstName = data.user.email.split('@')[0];
			}

			// Fetch API key from profiles table
			const api_key = await fetchApiKey(data.user.id);
			console.log('Retrieved API key in layout:', api_key);

			// Set user store with API key
			user.set({
				isLoggedIn: true,
				firstName,
				uuid: data.user.id,
				api_key
			});

			// Fetch credit after setting user
			fetchCredit(data.user.id);
		} else {
			user.set({ isLoggedIn: false, firstName: '', uuid: null, api_key: null });
			credit.set(null);
		}
	});
</script>

<svelte:head>
	<title>{ogTags.title}</title>
	<meta name="description" content={ogTags.description} />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={ogTags.url} />
	<meta property="og:title" content={ogTags.title} />
	<meta property="og:description" content={ogTags.description} />
	<meta property="og:image" content={ogTags.image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	
	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={ogTags.url} />
	<meta property="twitter:title" content={ogTags.title} />
	<meta property="twitter:description" content={ogTags.description} />
	<meta property="twitter:image" content={ogTags.image} />
	
	<!-- Google Tag Manager -->
	<script>
		(function (w, d, s, l, i) {
			w[l] = w[l] || [];
			w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
			var f = d.getElementsByTagName(s)[0],
				j = d.createElement(s),
				dl = l != 'dataLayer' ? '&l=' + l : '';
			j.async = true;
			j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
			f.parentNode.insertBefore(j, f);
		})(window, document, 'script', 'dataLayer', 'GTM-6QTHY8DL9S');
	</script>
	<!-- End Google Tag Manager -->
</svelte:head>

<!-- Google Tag Manager (noscript) -->
<noscript
	><iframe
		src="https://www.googletagmanager.com/ns.html?id=GTM-6QTHY8DL9S"
		height="0"
		width="0"
		style="display:none;visibility:hidden"
		title="Google Tag Manager"
	></iframe></noscript
>
<!-- End Google Tag Manager (noscript) -->
<div class="layout-wrapper">
	<nav class="navbar">
		<div class="nav-left">
			<a href="/" class="nav-link {$currentPath === '/' ? 'active' : ''}">Home</a>
			<!--a href="/result" class="nav-link {currentPath === '/result' ? 'active' : ''}">Results</a-->
			<!--a href="/about" class="nav-link {currentPath === '/about' ? 'active' : ''}">About us</a-->
			<a href="/faq" class="nav-link {$currentPath === '/faq' ? 'active' : ''}">FAQ</a>
		</div>
		<div class="nav-right">
			{#if $user.isLoggedIn}
				<span class="welcome-user">
					Welcome, {$user.firstName}&nbsp;|&nbsp;
					{#if $credit !== null}
						<span
							class="credit-value"
							style="color: {$credit > 1 ? '#0f9200' : '#ff0000'};font-weight: 600;"
						>
							Credit: {$credit}
						</span>
					{:else}
						<span style="margin-left: 1.2em; color: #888; font-size: 0.8em;"
							>(Loading credit...)</span
						>
					{/if}
				</span>
				<button onclick={logout} class="logout-btn nav-btn">Logout</button>
			{:else}
				<a href="/signin" class="nav-btn">Sign In</a>
			{/if}
		</div>
	</nav>

	<main>
		{@render children({ credit: $credit })}
	</main>

	<footer class="footer">
		<div class="footer-left">&copy; 2025</div>
		<div class="footer-right">
			<a
				href="https://twitter.com"
				target="_blank"
				rel="noopener"
				aria-label="Twitter"
				class="icon-link"
			>
				<svg height="24" width="24" viewBox="0 0 24 24" fill="currentColor"
					><path
						d="M22.46 5.924c-.793.352-1.646.59-2.542.698a4.48 4.48 0 0 0 1.965-2.475 8.94 8.94 0 0 1-2.828 1.08 4.48 4.48 0 0 0-7.633 4.084C7.09 9.13 4.13 7.674 2.01 5.36a4.48 4.48 0 0 0 1.388 5.978 4.45 4.45 0 0 1-2.03-.561v.057a4.48 4.48 0 0 0 3.59 4.393 4.51 4.51 0 0 1-2.025.077 4.48 4.48 0 0 0 4.18 3.11A8.98 8.98 0 0 1 2 19.54a12.69 12.69 0 0 0 6.88 2.017c8.26 0 12.78-6.84 12.78-12.77 0-.194-.004-.388-.013-.58A9.13 9.13 0 0 0 24 4.59a8.98 8.98 0 0 1-2.54.697z"
					/></svg
				>
			</a>
			<a
				href="https://instagram.com"
				target="_blank"
				rel="noopener"
				aria-label="Instagram"
				class="icon-link"
			>
				<svg height="24" width="24" viewBox="0 0 24 24" fill="currentColor"
					><path
						d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm6 1.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z"
					/></svg
				>
			</a>
		</div>
	</footer>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
	.layout-wrapper {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		padding-top: 56px; /* navbar height only, less spacing */
	}
	main {
		flex: 1 0 auto;
		padding: 0;
		margin: 0;
	}
	.footer {
		flex-shrink: 0;
		margin-bottom: 0;
	}
	main {
		flex: 1;
		padding: 0;
		margin: 0;
	}

	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 1000;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		background: transparent; /* Changed from #f8f9fa to transparent */
		backdrop-filter: blur(8px); /* Add blur effect for better readability */
		border-bottom: 1px solid rgba(238, 238, 238, 0.3); /* Made border semi-transparent */
		transition: background 0.3s ease;
	}
	.nav-link {
		color: #fff; /* Changed from #333 to white for better visibility on transparent bg */
		text-decoration: none;
		padding: 0.3em 1em;
		border-radius: 6px;
		transition:
			background 0.2s,
			color 0.2s;
		font-weight: 500;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); /* Add text shadow for better readability */
	}
	.nav-link.active {
		background: rgba(66, 133, 244, 0.8); /* Made active background semi-transparent */
		color: #fff !important;
	}
	.nav-left a,
	.nav-right a {
		margin-right: 1.5rem;
		text-decoration: none;
		color: #fff; /* Changed from #333 to white */
		font-weight: 500;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); /* Add text shadow */
	}
	.nav-left a:last-child {
		margin-right: 0;
	}
	.nav-right a {
		margin-right: 0;
		margin-left: 1.5rem;
	}
	.navbar a:hover {
		color: #4285f4; /* Changed from #0070f3 to Google blue */
	}

	.welcome-user {
		font-size: 0.8rem; /* 2px smaller than default (assume default is 1.125rem) */
		color: #fff; /* Changed from #b4b4b4 to white */
		margin-right: 1rem;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); /* Add text shadow */
	}

	.nav-btn {
		border: 1px solid rgba(255, 255, 255, 0.5); /* Made border semi-transparent white */
		border-radius: 4px;
		padding: 0.4em 1em;
		background: rgba(255, 255, 255, 0.1); /* Semi-transparent white background */
		color: #fff; /* Changed to white */
		font: inherit;
		cursor: pointer;
		transition:
			border-color 0.2s,
			box-shadow 0.2s,
			background 0.2s;
		outline: none;
		text-decoration: none;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); /* Add text shadow */
	}

	.nav-btn:hover,
	.nav-btn:focus {
		border-color: #4285f4;
		background: rgba(66, 133, 244, 0.2); /* Semi-transparent blue on hover */
		box-shadow: 0 2px 8px rgba(66, 133, 244, 0.3);
	}

	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		background: transparent; /* Changed from #f8f9fa to transparent */
		backdrop-filter: blur(8px); /* Add blur effect */
		border-top: 1px solid rgba(238, 238, 238, 0.3); /* Made border semi-transparent */
		font-size: 1rem;
		margin-top: 0px;
	}

	.footer-left {
		color: #fff; /* Changed from #777 to white */
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); /* Add text shadow */
	}
	.footer-right {
		display: flex;
		gap: 1rem;
	}
	.icon-link {
		color: #fff; /* Changed from #333 to white */
		display: flex;
		align-items: center;
		transition: color 0.2s;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); /* Add text shadow */
	}
	.icon-link:hover {
		color: #4285f4; /* Changed from #0070f3 to Google blue */
	}

	/* Add a media query for smaller screens */
	@media (max-width: 768px) {
		.navbar,
		.footer {
			padding: 0.8rem 1rem;
		}

		.nav-left a,
		.nav-right a {
			margin-right: 0.8rem;
		}
	}
</style>
