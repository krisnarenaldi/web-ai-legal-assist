import { page } from '$app/stores';
import { derived } from 'svelte/store';

/** @type {import('./$types').LayoutLoad} */
export function load({ url }) {
	// Get the current URL for OG tags
	const currentUrl = url.origin + url.pathname;

	// Set default OG values
	const ogTitle = 'AI Contract Review & Legal Assistant';
	const ogDescription =
		'AI-powered contract review and legal assistant that helps you analyze, understand, and manage legal documents quickly and securely.';

	// Generate dynamic OG image URL
	const ogImageUrl = `${url.origin}/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDescription.substring(0, 50) + '...')}`;

	// Return values to be used in the layout
	return {
		ogTags: {
			title: ogTitle,
			description: ogDescription,
			url: currentUrl,
			image: ogImageUrl
		}
	};
}
