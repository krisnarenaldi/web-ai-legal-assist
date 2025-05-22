<script>
  export let data;
  const { clauses = [], risks = [] } = data.parsed || {};

  // Helper to render content as bullet points if it's an array
  function renderContent(content) {
    if (Array.isArray(content)) {
      return content;
    }
    return [content];
  }
</script>

<div class="result-page">
  <div class="content-container">
    <h1>Hasil Analisis Kontrak</h1>
    
    <div class="main-section">
      <div class="section-header">
        <div class="section-accent"></div>
        <h2 class="section-title">Klausul</h2>
      </div>
      
      {#if clauses.length === 0}
        <p class="empty-notice">Tidak ada data klausul ditemukan.</p>
      {/if}
      
      <div class="cards-container">
        {#each clauses as clause}
          <div class="card clause-block">
            <div class="key-header-wrapper">
              <div class="accent-bar"></div>
              <h3 class="key-header">{clause.title}</h3>
            </div>
            
            {#if Array.isArray(clause.content)}
              <ul class="value-list custom-bullets">
                {#each clause.content as item}
                  <li class="value-text">
                    <span class="bullet-number">{#if item.match(/^\d+/)}{item.match(/^\d+/)[0]}.{/if}</span>
                    <span class="bullet-content">{item.replace(/^\d+\.?\s*/, '')}</span>
                  </li>
                {/each}
              </ul>
            {:else}
              <p class="value-text">{clause.content}</p>
            {/if}
          </div>
        {/each}
      </div>
    </div>
    
    <div class="main-section">
      <div class="section-header">
        <div class="section-accent risk"></div>
        <h2 class="section-title">Risiko</h2>
      </div>
      
      {#if risks.length === 0}
        <p class="empty-notice">Tidak ada data risiko ditemukan.</p>
      {/if}
      
      <div class="cards-container">
        {#each risks as risk}
          <div class="card risk-block">
            <div class="key-header-wrapper">
              <div class="accent-bar risk"></div>
              <h3 class="key-header">{risk.title}</h3>
            </div>
            {#if Array.isArray(risk.content)}
              <ul class="value-list custom-bullets">
                {#each risk.content as item}
                  <li class="value-text">
                    <span class="bullet-number">{#if item.match(/^\d+/)}{item.match(/^\d+/)[0]}.{/if}</span>
                    <span class="bullet-content">{item.replace(/^\d+\.?\s*/, '')}</span>
                  </li>
                {/each}
              </ul>
            {:else}
              <p class="value-text">{risk.content}</p>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  
  .result-page {
    font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    min-height: 100vh;
    width: 100%;
    background: #f4f7fa;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 2rem;
  }
  
  .content-container {
    max-width: 900px;
    width: 100%;
    margin-top: 2rem;
    text-align: justify;
  }
  
  h1 {
    color: #2a2253;
    font-size: 2.2rem;
    margin-bottom: 3rem;
    text-align: center;
    font-weight: 800;
    letter-spacing: 0.03em;
  }
  
  /* Main section styling */
  .main-section {
    margin-bottom: 3.5rem;
  }
  
  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 1.8rem;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid rgba(104, 59, 171, 0.15);
  }
  
  .section-accent {
    width: 10px;
    height: 38px;
    border-radius: 5px;
    background: #683bab;
    margin-right: 18px;
  }
  
  .section-accent.risk {
    background: #ff7e5f;
  }
  
  .section-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #2a2253;
    margin: 0;
    letter-spacing: 0.02em;
  }
  
  .empty-notice {
    font-style: italic;
    color: #777;
    margin: 1rem 0;
  }
  
  /* Cards container */
  .cards-container {
    display: grid;
    gap: 1.8rem;
  }
  
  /* Card styling */
  .card {
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 1px 6px rgba(60, 60, 100, 0.12);
    padding: 1.5rem 2rem 1.2rem 2rem;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  
  .card:hover {
    box-shadow: 0 4px 18px rgba(60, 60, 100, 0.19);
    transform: translateY(-2px);
  }
  
  /* Card header */
  .key-header-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 1.2rem;
  }
  
  .accent-bar {
    width: 6px;
    height: 28px;
    border-radius: 3px;
    background: #683bab;
    margin-right: 16px;
  }
  
  .accent-bar.risk {
    background: #ff7e5f;
  }
  
  .key-header {
    font-size: 1.23rem;
    font-weight: 700;
    color: #2a2253;
    margin: 0;
    letter-spacing: 0.01em;
  }
  
  /* List styling */
  .value-list {
    list-style: none;
    padding-left: 0;
    margin-bottom: 0.5rem;
  }
  
  .custom-bullets .value-text {
    display: flex;
    align-items: flex-start;
    margin-bottom: 0.8rem;
    font-size: 1.04rem;
    color: #444;
    line-height: 1.7;
  }
  
  .bullet-number {
    min-width: 2.5em;
    font-weight: 600;
    color: #683bab;
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
  
  .value-text {
    font-size: 1.04rem;
    color: #555;
    line-height: 1.7;
    margin-bottom: 0.5rem;
  }
  
  p.value-text {
    margin-bottom: 0.8rem;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .content-container {
      padding: 0 1rem;
    }
    
    .card {
      padding: 1.2rem 1.5rem 1rem;
    }
    
    .section-title {
      font-size: 1.5rem;
    }
  }
</style>