import { Canvas, loadImage } from 'canvas';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	try {
		// Get parameters from URL
		const title = url.searchParams.get('title') || 'AI Contract Review';
		const description = url.searchParams.get('description') || 'Analyze legal documents with AI';

		// Create canvas (1200x630 is the recommended size for OG images)
		const canvas = new Canvas(1200, 630);
		const ctx = canvas.getContext('2d');

		// Load background image
		try {
			const bgImage = await loadImage('static/og-background.jpg');
			ctx.drawImage(bgImage, 0, 0, 1200, 630);
		} catch (e) {
			// If background image fails to load, use a gradient
			const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
			gradient.addColorStop(0, '#4285f4');
			gradient.addColorStop(1, '#34a853');
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, 1200, 630);
		}

		// Add semi-transparent overlay for better text readability
		ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
		ctx.fillRect(0, 0, 1200, 630);

		// Add title
		ctx.font = 'bold 60px Inter, sans-serif';
		ctx.fillStyle = '#ffffff';
		ctx.textAlign = 'center';
		ctx.fillText(title, 600, 300);

		// Add description
		ctx.font = '30px Inter, sans-serif';
		ctx.fillText(description, 600, 380);

		// Add logo or branding
		ctx.font = 'bold 24px Inter, sans-serif';
		ctx.fillText('AI Contract Review & Legal Assistant', 600, 550);

		// Convert canvas to buffer
		const buffer = canvas.toBuffer('image/jpeg');

		// Return the image
		return new Response(buffer, {
			headers: {
				'Content-Type': 'image/jpeg',
				'Cache-Control': 'public, max-age=31536000, immutable'
			}
		});
	} catch (e) {
		console.error('Error generating OG image:', e);
		throw error(500, 'Failed to generate image');
	}
}
