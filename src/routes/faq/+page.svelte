<script>
  let openIndex = null;
  const faqs = [
    {
      icon: '❓',
      question: 'Apa itu Asisten Hukum AI?',
      answer: 'Asisten Hukum AI adalah aplikasi berbasis kecerdasan buatan yang membantu Anda meninjau surat kontrak secara otomatis, mengekstrak klausul, dan mengidentifikasi potensi risiko. Versi beta ini hanya satu arah, pengembangan ke depan akan dibuat interaktif seperti chatbox.'
    },
    {
      icon: '📄',
      question: 'Bagaimana cara kerja aplikasi ini dalam meninjau kontrak?',
      answer: 'Anda dapat mengunggah dokumen kontrak dalam format PDF di halaman utama. Kemudian aplikasi akan menganalisis dokumen kontrak yang Anda unggah, mengekstrak klausul-klausul penting, dan memberikan ringkasan serta potensi risiko yang teridentifikasi.'
    },
    {
      icon: '🔒',
      question: 'Apakah data kontrak saya aman?',
      answer: 'Ya, data kontrak Anda diproses secara aman dan hanya digunakan untuk analisis. Kami tidak membagikan data Anda kepada pihak ketiga.'
    },
    {
      icon: '📋',
      question: 'Apa saja informasi yang diberikan setelah analisis?',
      answer: 'Setelah analisis, Anda akan menerima daftar klausul kontrak serta potensi risiko yang ditemukan dalam dokumen tersebut.'
    },
    {
      icon: '💸',
      question: 'Apakah layanan ini gratis?',
      answer: 'Untuk saat ini, Anda dapat menggunakan layanan ini secara gratis untuk dua kali analisis. Setelah itu, Anda dapat berdonasi minimal <strong>Rp 15.000</strong> untuk satu kali analisis (berlaku kelipatan) melalui <a href="https://saweria.co/papaloni" class="text-[#00A67E] hover:text-[#008F6B] text-xl">Saweria</a>. Donasi akan digunakan untuk pengembangan fitur baru dan peningkatan kualitas layanan.'
    }
  ];

  function toggle(idx) {
    openIndex = openIndex === idx ? null : idx;
  }
</script>

<div class="faq-bg-alt">    
    <div class="shadow-dance-container">
        <h1 class="shadow-dance-text">FAQ Asisten Hukum AI</h1>
      </div>
  <div class="faq-container-alt">
    
    <div class="faq-list-alt">
      {#each faqs as faq, i}
        <div class="faq-card-alt {openIndex === i ? 'open' : ''}">
          <button class="faq-question-alt" aria-expanded={openIndex === i} aria-controls={`faq-answer-${i}`} on:click={() => toggle(i)}>
            <span class="faq-icon-alt">{faq.icon}</span>
            <span class="faq-qtext-alt">{faq.question}</span>
            <span class="faq-arrow-alt {openIndex === i ? 'open' : ''}">{openIndex === i ? '▲' : '▼'}</span>
          </button>
          <div class="faq-answer-alt" id={`faq-answer-${i}`} style="max-height: {openIndex === i ? '400px' : '0'}; opacity: {openIndex === i ? 1 : 0};">
            {@html faq.answer}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
.faq-bg-alt {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #e3f0fc 0%, #b5d8f7 100%);
  display: block;
  margin: 0;
  padding: 0;
}
.faq-container-alt {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.10);
  width: 100%;
  max-width: 650px;
  margin: 6px auto 4px auto; /* Even tighter above and below */
  padding: 14px 10px 10px 10px; /* Even tighter padding */
  display: block;
}

.shadow-dance-container {
  margin-bottom: 8px;
  margin-top: 0;
}

.faq-bg-alt {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #e3f0fc 0%, #b5d8f7 100%);
  display: block;
  margin: 0;
  padding: 0;
}

.faq-list-alt {
  margin-bottom: 0;
  padding-bottom: 0;
}
.faq-title-alt {
  font-size: 2.2rem;
  font-weight: 800;
  color: #2886c8;
  margin-bottom: 32px;
  text-align: center;
  letter-spacing: 0.01em;
}
.faq-list-alt {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.faq-card-alt {
  background: #f6fafd;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(42,157,244,0.08);
  overflow: hidden;
  transition: box-shadow 0.2s, border 0.2s;
  border: 1.5px solid #e3f0fc;
}
.faq-card-alt.open {
  box-shadow: 0 6px 24px rgba(42,157,244,0.14);
  /* border: 1.5px solid #2a9df4; */
}
.faq-question-alt {
  width: 100%;
  background: none;
  border: none;
  font-size: 1.13rem;
  font-weight: 600;
  color: #155a8a;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  padding: 20px 22px 18px 20px;
  transition: color 0.2s;
}
.faq-question-alt:focus {
  outline: 2px solid #2a9df4;
}
.faq-icon-alt {
  font-size: 1.5rem;
  margin-right: 0.2rem;
}
.faq-qtext-alt {
  flex: 1 1 auto;
}
.faq-arrow-alt {
  font-size: 1.1rem;
  color: #2a9df4;
  margin-left: 1rem;
  transition: transform 0.3s;
}
.faq-arrow-alt.open {
  transform: rotate(180deg);
}
.faq-answer-alt {
  font-size: 1rem;
  color: #333;
  padding: 0 22px 18px 62px;
  background: #fafdff;
  transition: max-height 0.35s cubic-bezier(.4,0,.2,1), opacity 0.25s;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  /* border-left: 3px solid #b8e0fa; */
}
.faq-card-alt.open .faq-answer-alt {
  opacity: 1;
}
@media (max-width: 700px) {
  .faq-container-alt {
    padding: 16px 2vw 18px 2vw;
  }
  .faq-title-alt {
    font-size: 1.2rem;
  }
  .faq-answer-alt {
    padding-left: 38px;
    font-size: 0.97rem;
  }
}


.shadow-dance-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 30vh;
    background: transparent;
    margin-bottom: 1rem;
}

.shadow-dance-text {
    font-family: 'Arial', sans-serif;
    font-size: 2.5rem;
    color: #fff;
    text-shadow: 5px 5px 0 #ff005e, 10px 10px 0 #00d4ff;
    animation: shadow-dance 2s infinite;
    background: #121212;
    padding: 1rem 2rem;
    border-radius: 1rem;
    margin: 0;
    display: inline-block;
}

@keyframes shadow-dance {
    0%, 100% {
        text-shadow: 5px 5px 0 #ff005e, 10px 10px 0 #00d4ff;
    }
    50% {
        text-shadow: -5px -5px 0 #00d4ff, -10px -10px 0 #ff005e;
    }
}
</style>
