'use client';

import React, { useState } from 'react';
import { guideApi, TroubleshootingResponse } from '../../lib/guideApi';
import Image from 'next/image';

export function TroubleshootingInterface() {
  const [model, setModel] = useState('Galaxy S24');
  const [os, setOs] = useState('Android 15');
  const [complaint, setComplaint] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TroubleshootingResponse | null>(null);
  const [error, setError] = useState<boolean>(false);
  
  const [showForm, setShowForm] = useState(false);

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint.trim()) return;

    setLoading(true);
    setError(false);
    setResult(null);

    try {
      const response = await guideApi.troubleshoot({
        complaint,
        device_model: model,
        os_version: os
      });
      setResult(response);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F4F6F6] rounded-[2.5rem] min-h-[90vh] shadow-2xl overflow-hidden relative font-[family-name:var(--font-inter)] max-w-[1400px] mx-auto w-full flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-8 lg:px-16 pt-10 pb-4">
        <div className="text-[#F18E79] font-[family-name:var(--font-playfair)] italic text-4xl tracking-tight">Guide</div>
        <nav className="hidden md:flex gap-10 text-[#1C5955] text-[11px] font-semibold tracking-[0.2em] uppercase">
          <a href="#" className="hover:text-[#F18E79] transition-colors">Services</a>
          <a href="#" className="hover:text-[#F18E79] transition-colors">About</a>
          <a href="#" className="hover:text-[#F18E79] transition-colors">Contact</a>
          <a href="#" className="hover:text-[#F18E79] transition-colors" onClick={(e) => { e.preventDefault(); setShowForm(true); }}>Start Diagnosis</a>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4 pb-20 flex-1">
        
        {/* Left Column (Text & Form) */}
        <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left z-10">
          <h2 className="text-[#1C5955] font-[family-name:var(--font-playfair)] italic text-5xl lg:text-6xl mb-4 lg:mb-2 lowercase tracking-wide">
            smart guided
          </h2>
          <h1 className="text-[#1C5955] text-[2.5rem] lg:text-[3.2rem] leading-[1.1] tracking-[0.1em] mb-8 font-light uppercase">
            Troubleshooting<br/>Engine
          </h1>
          <p className="text-[#1C5955]/70 text-[13px] leading-relaxed max-w-sm mb-12">
            Instantly translate vague device complaints into a precise, step-by-step diagnostic plan linking directly to your exact hardware settings.
          </p>

          {!showForm && !result && !loading ? (
            <button 
              onClick={() => setShowForm(true)} 
              className="text-[#1C5955] uppercase tracking-[0.2em] text-xs font-semibold border-b-[2px] border-[#F18E79] pb-2 hover:text-[#1C5955]/70 transition-colors"
            >
              START DIAGNOSIS
            </button>
          ) : (
            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Form State */}
              {showForm && !result && !loading && (
                <form onSubmit={handleDiagnose} className="space-y-6">
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Device Model"
                      className="w-full bg-transparent border-b border-[#1C5955]/30 py-2 text-[#1C5955] focus:outline-none focus:border-[#F18E79] text-sm placeholder:text-[#1C5955]/50 transition-colors"
                    />
                    <input
                      type="text"
                      value={os}
                      onChange={(e) => setOs(e.target.value)}
                      placeholder="OS Version"
                      className="w-full bg-transparent border-b border-[#1C5955]/30 py-2 text-[#1C5955] focus:outline-none focus:border-[#F18E79] text-sm placeholder:text-[#1C5955]/50 transition-colors"
                    />
                    <textarea
                      value={complaint}
                      onChange={(e) => setComplaint(e.target.value)}
                      placeholder="Describe your device issue..."
                      rows={3}
                      className="w-full bg-transparent border-b border-[#1C5955]/30 py-2 text-[#1C5955] focus:outline-none focus:border-[#F18E79] text-sm placeholder:text-[#1C5955]/50 transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!complaint.trim()}
                    className="text-[#1C5955] uppercase tracking-[0.2em] text-xs font-semibold border-b-[2px] border-[#F18E79] pb-2 hover:text-[#1C5955]/70 transition-colors disabled:opacity-50"
                  >
                    SUBMIT DIAGNOSIS
                  </button>
                  {error && <p className="text-red-500 text-xs mt-4">Backend unavailable. Start the API.</p>}
                </form>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex flex-col items-center justify-center space-y-6 py-12">
                  <div className="w-8 h-8 border-2 border-[#1C5955] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[#1C5955] text-xs tracking-widest uppercase font-semibold">Processing Query</p>
                </div>
              )}

              {/* Result State */}
              {result && !loading && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  <div className="flex justify-between items-end border-b border-[#1C5955]/20 pb-4">
                     <h3 className="text-lg font-[family-name:var(--font-playfair)] italic text-[#1C5955]">Diagnostic Results</h3>
                     <button onClick={() => {setResult(null); setShowForm(true); setComplaint('');}} className="text-[10px] uppercase tracking-widest text-[#F18E79] font-bold">New Query</button>
                  </div>
                  
                  <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                    {result.actions.map((action, idx) => (
                      <div key={idx} className="space-y-3">
                        <h4 className="text-sm font-semibold tracking-wide text-[#1C5955] uppercase">{action.title}</h4>
                        {action.rationale && <p className="text-xs text-[#1C5955]/70 leading-relaxed">{action.rationale}</p>}
                        
                        <div className="space-y-2 pt-2">
                          {action.steps.map((step, sIdx) => (
                            <div key={sIdx} className="flex justify-between items-center bg-white/50 p-4 rounded-lg">
                              <span className="text-sm text-[#1C5955]">{step.step}. {step.instruction}</span>
                              {step.deeplink_valid ? (
                                <a href={`intent://${step.deeplink}#Intent;scheme=android-app;end`}
                                   className="text-[10px] font-bold uppercase tracking-wider bg-[#1C5955] text-white px-3 py-1.5 rounded hover:bg-[#1C5955]/80 transition-colors">
                                  Resolve
                                </a>
                              ) : (
                                <span className="text-[10px] uppercase tracking-wider text-[#1C5955]/40">N/A</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column (Hero Image) */}
        <div className="hidden lg:flex justify-end items-start h-full">
          <div className="relative w-full max-w-[500px] aspect-[4/5] rounded-3xl overflow-hidden shadow-sm">
            <Image 
              src="/hero.jpg" 
              alt="Editorial aesthetics"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </main>

      {/* Footer Area with links imitating the design */}
      <footer className="mt-auto px-8 lg:px-16 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* Bottom left image block matching the design */}
         <div className="hidden lg:block relative w-[80%] max-w-[400px] aspect-[21/9] rounded-3xl overflow-hidden mt-8">
            <Image 
              src="/hero.jpg" 
              alt="Decorative"
              fill
              className="object-cover object-bottom opacity-80 mix-blend-multiply"
            />
         </div>
         {/* Bottom right links */}
         <div className="flex flex-col justify-end space-y-6 text-[#1C5955] font-light text-4xl">
            <div className="flex items-center gap-4 hover:text-[#F18E79] transition-colors cursor-pointer">
              <span className="text-3xl font-light">{'>'}</span>
              <span>Hardware Diagnostics</span>
            </div>
            <div className="flex items-center gap-4 hover:text-[#F18E79] transition-colors cursor-pointer">
              <span className="text-3xl font-light">{'>'}</span>
              <span>Software & Apps</span>
            </div>
         </div>
      </footer>
    </div>
  );
}

