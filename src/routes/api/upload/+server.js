// SvelteKit endpoint for handling PDF upload and mock analysis
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const data = await request.formData();
    const file = data.get('file');
    if (!file) {
        return json({ error: 'No file uploaded' }, { status: 400 });
    }
    // Mock analysis: return bullet points after a delay
    await new Promise(r => setTimeout(r, 2000));
    return json({
        bullets: [
            'Document uploaded successfully.',
            'This is a mock analysis result.',
            'Add your PDF analysis logic here.'
        ]
    });
}
