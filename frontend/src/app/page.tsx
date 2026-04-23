'use client';

import { useState, useEffect } from 'react';

export default function OpenVistaStudio() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    setStatus('Dispatching to GPU cluster...');
    setResultImage(null);

    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '');
      console.log('Fetching from:', `${apiUrl}/generate`);
      
      const response = await fetch(`${apiUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setJobId(data.job_id);
    } catch (error: any) {
      console.error('Generation failed:', error);
      setStatus(`Error: ${error.message || 'Connection failed'}. Check backend status.`);
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (jobId && isGenerating) {
      interval = setInterval(async () => {
        try {
          const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '');
          const response = await fetch(`${apiUrl}/status/${jobId}`);
          const data = await response.json();
          
          if (data.status === 'completed') {
            const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '');
            setResultImage(`${apiUrl}${data.url}`);
            setIsGenerating(false);
            setJobId(null);
            setStatus('');
          } else if (data.status === 'failed') {
            setStatus('Generation failed on worker.');
            setIsGenerating(false);
            setJobId(null);
          } else {
            setStatus('Rendering cinematic latent... (Flux Schnell)');
          }
        } catch (error) {
          console.error('Polling failed:', error);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [jobId, isGenerating]);

  return (
    <main style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <header style={{ width: '100%', maxWidth: '1200px', marginBottom: '3rem', animation: 'fadeIn 0.8s ease-out' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.05em', marginBottom: '0.5rem' }}>OpenVista</h1>
        <p style={{ opacity: 0.6, fontSize: '1.1rem' }}>Generative Intelligence for Cinematic Realism</p>
      </header>

      <section style={{ width: '100%', maxWidth: '1000px', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
        {/* Controls Panel */}
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prompt</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cinematic shot of a futuristic metropolis..."
              style={{ 
                width: '100%', 
                height: '120px', 
                background: 'rgba(0,0,0,0.3)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '8px', 
                padding: '0.8rem', 
                color: 'white', 
                fontFamily: 'inherit',
                resize: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', opacity: 0.5, marginBottom: '0.2rem' }}>Steps</label>
              <select style={{ width: '100%', background: '#222', color: 'white', border: '1px solid #333', padding: '0.5rem', borderRadius: '4px' }}>
                <option>4 (Schnell)</option>
                <option>20 (Dev)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', opacity: 0.5, marginBottom: '0.2rem' }}>Ratio</label>
              <select style={{ width: '100%', background: '#222', color: 'white', border: '1px solid #333', padding: '0.5rem', borderRadius: '4px' }}>
                <option>1:1</option>
                <option>16:9</option>
                <option>9:16</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            style={{ 
              marginTop: '1rem',
              padding: '1rem', 
              background: isGenerating ? '#333' : 'white', 
              color: isGenerating ? '#666' : 'black', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 700, 
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isGenerating ? 'Generating...' : 'GENERATE CINEMATIC'}
          </button>

          {status && <p style={{ fontSize: '0.8rem', opacity: 0.8, textAlign: 'center', marginTop: '0.5rem' }}>{status}</p>}
        </div>

        {/* Canvas Display */}
        <div className="glass" style={{ minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
          {!resultImage && !isGenerating && (
            <div style={{ textAlign: 'center', opacity: 0.3 }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</div>
              <p>Generation output will appear here</p>
            </div>
          )}

          {isGenerating && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
               <div className="shimmer" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)', transform: 'skewX(-20deg)', animation: 'shimmer 2s infinite' }}></div>
               <p style={{ zIndex: 1, letterSpacing: '0.1em', fontSize: '0.7rem' }}>COMPUTING LATENT SPACE...</p>
            </div>
          )}

          {resultImage && (
            <img 
              src={resultImage} 
              alt="Generated" 
              className="animate-fade-in"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
            />
          )}

          <style jsx>{`
            @keyframes shimmer {
              0% { left: -100%; }
              100% { left: 100%; }
            }
            .shimmer {
              position: absolute;
              top: 0;
              height: 100%;
              width: 50%;
            }
          `}</style>
        </div>
      </section>
    </main>
  );
}
