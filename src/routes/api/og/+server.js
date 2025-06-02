import { ImageResponse } from '@vercel/og';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	try {
		// Get parameters from URL
		const title = url.searchParams.get('title') || 'AI Contract Review';
		const description = url.searchParams.get('description') || 'Analyze legal documents with AI';
		
		// Create an HTML template for the OG image
		const html = `
			<div style="
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 100%;
				background: linear-gradient(to bottom right, #4285f4, #34a853);
				padding: 40px;
				text-align: center;
				color: white;
				font-family: 'Inter', sans-serif;
			">
				<div style="
					background: rgba(0, 0, 0, 0.5);
					border-radius: 16px;
					padding: 32px;
					width: 90%;
					height: 90%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
				">
					<h1 style="
						font-size: 60px;
						font-weight: bold;
						margin: 0 0 20px;
						line-height: 1.2;
					">${title}</h1>
					
					<p style="
						font-size: 30px;
						margin: 0 0 40px;
						opacity: 0.9;
					">${description}</p>
					
					<div style="
						font-size: 24px;
						font-weight: bold;
						margin-top: auto;
					">AI Contract Review & Legal Assistant</div>
				</div>
			</div>
		`;
		
		// Generate the image response
		return new ImageResponse(html, {
			width: 1200,
			height: 630,
		});
	} catch (e) {
		console.error('Error generating OG image:', e);
		throw error(500, 'Failed to generate image');
	}
}
