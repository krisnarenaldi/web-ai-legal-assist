<script>
  export let data;
  const { creditValue } = data;
  
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/user.js';
  import { credit, fetchCredit } from '$lib/stores/credit.js';
  import { supabase } from '$lib/supabaseClient.js';
  import { parseRisks } from './result/parseRisks.js';
  
  let file = null;
  let loading = false;
  let bullets = [];
  let error = '';
  let chatMessages = [
    { role: 'assistant', content: 'Hi! Upload a PDF and submit for analysis.' }
  ];
  let chatInput = '';
  let chatLoading = false;
  let copySuccess = false;

  // List of available images in /static (excluding favicon.png)
  const bgImages = [
    '/pexels-carlos-oliva-1966452-3586966.jpg',
    '/pexels-karoldach-409696.jpg',
    '/pexels-lastly-937782.jpg',
    '/pexels-nikitapishchugin-32055930.jpg',
    '/pexels-goumbik-317385.jpg',
  ];
  let bgImage = bgImages[0];

  onMount(() => {
    // Pick a random image on each mount (refresh)
    bgImage = bgImages[Math.floor(Math.random() * bgImages.length)];
  });

  async function handleUpload(event) {
    file = event.target.files[0];
    error = '';
  }

  async function handleSubmit() {
    if (!file) {
      error = 'Please select a PDF file.';
      return;
    }
    
    // Check credit before submitting
    if (creditValue === 0) {
      error = 'You have no credits left. Please top up to submit a document.';
      return;
    }
    
    // Check if API key is available
    if (!$user.api_key) {
      error = 'API key not found. Please sign in again.';
      return;
    }
    
    loading = true;
    bullets = [];
    error = '';
    try {
      // First upload the file to our server
      let formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.error || 'Upload failed');
      }
      
      // Get the file data from the upload response
      const uploadData = await uploadRes.json();
      
      // Now call the analyze endpoint with the API key
      console.log('Calling analyze endpoint with API key:', $user.api_key);
      
      // For debugging
      console.log('File being sent:', file.name, file.type, file.size);
      
      formData = new FormData();
      formData.append('file_pdf', file); // 'file_pdf' must match the name expected in FastAPI
      
      // const analyzeRes = await fetch('http://localhost:8000/analyze', {
      const analyzeRes = await fetch('https://api-ai-contract-review.onrender.com/analyze', {
        method: 'POST',
        headers: {
          'x-api-key': $user.api_key
          // Do NOT set 'Content-Type' here — fetch will set it automatically for FormData
        },
        body: formData
      });
      
      if (!analyzeRes.ok) {
        const errorText = await analyzeRes.text();
        console.error('API Error:', analyzeRes.status, errorText);
        throw new Error(`API Error: ${analyzeRes.status} - ${errorText}`);
      }
      
      const analyzeData = await analyzeRes.json();
      console.log('API Response:', analyzeData);
      
      // After successful API call, refresh the credit value from the database
      if ($user.uuid) {
        console.log('Refreshing credit for user:', $user.uuid);
        await fetchCredit($user.uuid);
      }
      
      // Use the parseRisks function to process the API response
      // Since parseRisks expects a file path, we'll adapt it to work with our API response
      const processedData = processApiResponse(analyzeData);
      console.log('Processed data:', processedData);
      
      // Convert the processed data into bullets for display
      bullets = [];
      
      // Add clauses to bullets
      if (processedData.clauses && processedData.clauses.length > 0) {
        bullets.push('📄 Contract Clauses:');
        processedData.clauses.forEach(clause => {
          bullets.push(`• ${clause.title || 'Clause'}`);
          if (Array.isArray(clause.content)) {
            clause.content.forEach(item => {
              // Check if item starts with a number followed by a period
              if (/^\d+\./.test(item)) {
                // Remove the dash and add proper indentation
                const [number, ...rest] = item.split('.');
                bullets.push(`  ${number}.   ${rest.join('.').trim()}`);
              } else {
                bullets.push(`  - ${item}`);
              }
            });
          } else if (clause.content) {
            // Check if content starts with a number followed by a period
            if (typeof clause.content === 'string' && /^\d+\./.test(clause.content)) {
              // Remove the dash and add proper indentation
              const [number, ...rest] = clause.content.split('.');
              bullets.push(`  ${number}.   ${rest.join('.').trim()}`);
            } else {
              bullets.push(`  - ${clause.content}`);
            }
          }
        });
      }
      
      // Add risks to bullets
      if (processedData.risks && processedData.risks.length > 0) {
        bullets.push('\n⚠️ Potential Risks:');
        processedData.risks.forEach(risk => {
          bullets.push(`• ${risk.title || 'Risk'}`);
          if (Array.isArray(risk.content)) {
            risk.content.forEach(item => {
              // Check if item starts with a number followed by a period
              if (/^\d+\./.test(item)) {
                // Remove the dash and add proper indentation
                const [number, ...rest] = item.split('.');
                bullets.push(`  ${number}.   ${rest.join('.').trim()}`);
              } else {
                bullets.push(`  - ${item}`);
              }
            });
          } else if (risk.content) {
            bullets.push(`  - ${risk.content}`);
          }
        });
      }
      
      // If no data was processed, use any available data from the upload response
      if (bullets.length === 0) {
        bullets = uploadData.bullets || ['No analysis results were returned from the API.'];
      }
      
      chatMessages.push({ role: 'assistant', content: 'Analysis complete. See results above.' });
    } catch (e) {
      console.error('Error during submission:', e);
      error = e.message || 'Upload or analysis failed.';
    } finally {
      loading = false;
    }
  }

  // Helper function to process API response similar to parseRisks
  function processApiResponse(data) {
    const result = {};
    
    // Process clauses
    if (Array.isArray(data.clauses)) {
      result.clauses = data.clauses.map(item => {
        // Check for different possible structures based on the API response
        const title = item.Klausa || item.category || item.title || 'Clause';
        const content = item.Isi || item.text || item.content || JSON.stringify(item);
        
        return {
          title,
          content: splitNumberedList(content)
        };
      });
    }
    
    // Process risks
    if (typeof data.risks === 'object' && !Array.isArray(data.risks)) {
      result.risks = Object.entries(data.risks).map(([riskTitle, riskValue]) => ({
        title: riskTitle,
        content: splitNumberedList(riskValue)
      }));
    } else if (Array.isArray(data.risks)) {
      result.risks = data.risks.map(risk => {
        if (typeof risk === 'string') {
          return { title: 'Risk', content: risk };
        } else {
          return { 
            title: risk.title || 'Risk', 
            content: risk.content || JSON.stringify(risk)
          };
        }
      });
    }
    
    return result;
  }
  
  // Split numbered lists, similar to the function in parseRisks.js
  function splitNumberedList(text) {
    if (typeof text !== 'string') return text;
    
    // Check if the text contains numbered items
    if (text.match(/\n\d+\./) || text.match(/\n\d+[^\.]/) || text.match(/^\d+\./)) {
      // First, handle the case where the text starts with a number
      let items = [];
      
      // Split on '\n1.', '\n2.', etc., but keep the first part
      const numberedWithDot = text.split(/\n(?=\d+\.)/g);
      
      // If we found numbered items with dots
      if (numberedWithDot.length > 1) {
        // Format each item for proper rendering
        return numberedWithDot.map(item => {
          item = item.trim();
          // If item starts with a number and period, format it for proper indentation
          if (/^\d+\./.test(item)) {
            const [number, ...rest] = item.split('.');
            return `${number}.   ${rest.join('.').trim()}`;
          }
          return item;
        });
      }
      
      // Try '\n1', '\n2', etc. (without the dot)
      const simpleNum = text.split(/\n(?=\d+[^\.])/g);
      if (simpleNum.length > 1) {
        // Format each item for proper rendering
        return simpleNum.map(item => {
          item = item.trim();
          // If item starts with just a number, format it as a numbered list item
          if (/^\d+[^\.]/.test(item)) {
            const match = item.match(/^(\d+)(.*)/);
            if (match) {
              const [_, number, content] = match;
              return `${number}.   ${content.trim()}`;
            }
          }
          return item;
        });
      }
    }
    
    return text;
  }
  
  async function sendChat() {
    if (!chatInput.trim()) return;
    chatMessages.push({ role: 'user', content: chatInput });
    chatLoading = true;
    // Mock response
    setTimeout(() => {
      chatMessages.push({ role: 'assistant', content: 'This is a mock response. Integrate with backend for real chat.' });
      chatLoading = false;
    }, 1200);
    chatInput = '';
  }
  
  // Function to copy analysis results to clipboard
  function copyResults() {
    if (bullets.length === 0) return;
    
    // Format the bullets into a clean text format
    const formattedText = bullets.map(bullet => {
      // Format section headers
      if (bullet.startsWith('📄') || bullet.startsWith('⚠️')) {
        return `\n${bullet.replace(/[📄⚠️]/g, '')}\n${'='.repeat(bullet.length)}\n`;
      }
      // Format main bullet points
      else if (bullet.startsWith('•')) {
        return bullet;
      }
      // Format sub-bullet points and numbered items
      else {
        return bullet;
      }
    }).join('\n');
    
    // Copy to clipboard
    navigator.clipboard.writeText(formattedText)
      .then(() => {
        copySuccess = true;
        setTimeout(() => {
          copySuccess = false;
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy to clipboard');
      });
  }
</script>

<style>
  .bg-random {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: -10;
    object-fit: cover;
    object-position: center;
    transition: background-image 0.5s;
  }
  .bg-overlay {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255,255,255,0.2);
    z-index: -5;
    pointer-events: none;
  }
  
  /* Custom bullet styling from result page */
  .value-text {
    font-size: 1.04rem;
    color: #e0e7ff;
    line-height: 1.7;
    margin-bottom: 0.5rem;
  }
  
  .custom-bullet {
    display: flex;
    align-items: flex-start;
    margin-bottom: 0.8rem;
  }
  
  .bullet-number {
    min-width: 2.5em;
    font-weight: 600;
    color: #93c5fd;
    display: inline-block;
    text-align: right;
    padding-right: 0.8em;
    font-family: inherit;
    font-size: 1.03rem;
    margin-top: 1px;
  }
  
  .bullet-dash {
    min-width: 1.5em;
    font-weight: 600;
    color: #93c5fd;
    display: inline-block;
    text-align: right;
    padding-right: 0.8em;
    font-family: inherit;
    font-size: 1.03rem;
    margin-top: 1px;
  }
  
  .bullet-content {
    flex: 1;
    padding-left: 0.4em;
  }
</style>

<!-- Full page random background -->
<img class="bg-random" src={bgImage} alt="background" />
<div class="bg-overlay"></div>
<div class="w-full min-h-[80vh] flex flex-col items-center justify-center">
  <div class="w-full max-w-3xl bg-gray-900 rounded-3xl shadow-xl p-8 mt-8 mb-4 flex flex-col items-center border-2 border-gray-700">
    <h2 class="text-3xl font-extrabold mb-4 text-center text-blue-200 drop-shadow">Content Review App</h2>
    <label class="w-full flex flex-col items-center px-4 py-6 bg-gray-900 rounded-xl shadow tracking-wide border-2 border-gray-700 cursor-pointer hover:bg-gray-900 transition mb-4">
      <svg class="w-10 h-10 text-blue-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16v-4a4 4 0 018 0v4m1 4H6a2 2 0 01-2-2V7a2 2 0 012-2h2m8 0h2a2 2 0 012 2v11a2 2 0 01-2 2z" /></svg>
      <span class="text-base leading-normal text-blue-200 font-semibold">Select a PDF file</span>
      <input type="file" accept="application/pdf" class="hidden" on:change={handleUpload} />
    </label>
    <button 
      on:click={handleSubmit} 
      disabled={loading || !file || creditValue === 0 || !$user.isLoggedIn} 
      class="w-full mt-2 bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-xl shadow-lg border-2 border-white transition disabled:bg-gray-900 disabled:cursor-not-allowed"
    >
      Submit
    </button>

    {#if creditValue === 0}
      <div class="w-full text-center text-yellow-400 font-semibold mt-2 animate-pulse">
        You have no credits left. Please top up to submit a document.
      </div>
    {/if}
    {#if error}
      <div class="w-full text-center text-red-500 font-semibold mt-3 animate-pulse">{error}</div>
    {/if}
    {#if loading}
      <div class="flex justify-center items-center w-full mt-6 mb-4">
        <svg class="animate-spin h-10 w-10 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </div>
    {/if}
    {#if bullets.length}
      <div class="w-full mt-6 bg-gray-900 border-2 border-gray-700 rounded-2xl p-6 shadow">
        <h3 class="font-bold text-xl mb-3 text-blue-200">✨ Analysis Result:</h3>
        <ul class="list-none pl-2 space-y-2 text-blue-100">
          {#each bullets as bullet}
            {#if bullet.startsWith('📄') || bullet.startsWith('⚠️')}
              <!-- Section header -->
              <li class="font-bold text-lg text-blue-300 mt-4">{bullet}</li>
            {:else if bullet.startsWith('•')}
              <!-- Main bullet point -->
              <li class="font-semibold ml-2">{bullet}</li>
            {:else if bullet.startsWith('  -')}
              <!-- Sub-bullet point with dash -->
              <li class="value-text custom-bullet ml-6">
                <!--span class="bullet-dash">-</span -->
                <span class="bullet-content">{bullet.replace(/^\s*-\s*/, '')}</span>
              </li>
            {:else if /^\s*\d+\.\s+/.test(bullet)}
              <!-- Numbered list item with proper indentation -->
              <li class="value-text custom-bullet ml-6">
                <span class="bullet-number">{bullet.match(/^\s*(\d+\.)/)[1]}</span>
                <span class="bullet-content">{bullet.replace(/^\s*\d+\.\s+/, '')}</span>
              </li>
            {:else}
              <!-- Regular text -->
              <li>{bullet}</li>
            {/if}
          {/each}
        </ul>
        
        <!-- Copy button at the bottom center -->
        <div class="flex justify-center mt-6">
          <button 
            on:click={copyResults} 
            class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-xl shadow-lg border border-blue-400 transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            {copySuccess ? 'Copied!' : 'Copy Results'}
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<!-- <div class="fixed bottom-0 left-0 w-full bg-gray-900 border-t-2 border-gray-700 shadow-lg z-50">
  <div class="max-w-2xl mx-auto px-4 py-3">
    <div class="flex flex-col space-y-2 mb-2 min-h-[60px]">
      {#each chatMessages as msg}
        <div class="flex" class:justify-end={msg.role === 'user'}>
          <div class={
            `inline-block px-4 py-2 rounded-2xl max-w-[80%] text-base break-words shadow ` +
            (msg.role === 'user' ? 'bg-blue-700 text-white self-end' : 'bg-gray-900 text-blue-100 border-2 border-gray-700 self-start')
          }>
            {msg.content}
          </div>
        </div>
      {/each}
      {#if chatLoading}
        <div class="flex"><div class="inline-block px-4 py-2 rounded-2xl bg-gray-900 text-blue-300 animate-pulse border-2 border-gray-700">...</div></div>
      {/if}
    </div>
    <form class="flex gap-2" on:submit|preventDefault={sendChat}>
      <input class="flex-1 px-4 py-2 rounded-2xl border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-700 transition text-base bg-gray-900 text-blue-100 placeholder-blue-300" bind:value={chatInput} placeholder="Type a message..." autocomplete="off" />
      <button class="bg-blue-700 hover:bg-blue-600 text-white font-bold px-5 py-2 rounded-2xl shadow transition disabled:bg-gray-900 disabled:cursor-not-allowed" type="submit" disabled={chatLoading || !chatInput.trim()}>Send</button>
    </form>
  </div>
</div> -->
