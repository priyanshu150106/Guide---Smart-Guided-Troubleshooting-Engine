'use client';

import React, { useState } from 'react';
import { guideApi, TroubleshootingResponse } from '../../lib/guideApi';

export function TroubleshootingInterface() {
  const [model, setModel] = useState('Galaxy S24');
  const [os, setOs] = useState('Android 15');
  const [complaint, setComplaint] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TroubleshootingResponse | null>(null);
  const [error, setError] = useState<boolean>(false);
  
  const isDemo = process.env.NEXT_PUBLIC_GUIDE_DEMO_MODE === 'true';

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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-200">
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
            GUIDE
          </h1>
          <h2 className="text-xl font-medium text-blue-600 mb-4">
            Smart Guided Troubleshooting Engine
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Turn vague device complaints into guided, one-tap troubleshooting.
          </p>
          {isDemo && (
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
              DEVELOPMENT DEMO MODE ACTIVE
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Input Section */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Device Details</h3>
              <form onSubmit={handleDiagnose} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device Model</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OS Version</label>
                  <input
                    type="text"
                    value={os}
                    onChange={(e) => setOs(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Describe your problem</label>
                  <textarea
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    placeholder="My screen flickers and my battery dies fast"
                    rows={4}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !complaint.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  Diagnose Problem
                </button>
              </form>
            </div>
          </div>

          {/* Results / Loading Section */}
          <div className="md:col-span-7">
            
            {/* Initial empty state */}
            {!loading && !result && !error && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center h-full flex flex-col items-center justify-center text-gray-400">
                <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>Enter a complaint to generate a troubleshooting plan.</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 h-full flex flex-col justify-center">
                <h3 className="text-lg font-bold mb-2">GUIDE backend is unavailable.</h3>
                <p>Start the GUIDE API and try again.</p>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 h-full">
                <h3 className="text-lg font-semibold mb-6 text-gray-800">Processing Request</h3>
                <div className="space-y-4 text-sm font-medium text-gray-500">
                  <div className="flex items-center space-x-3 text-blue-600">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing complaint</span>
                  </div>
                  <div className="flex items-center space-x-3 pl-2 border-l-2 border-gray-100 ml-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <span>Normalizing technical intent</span>
                  </div>
                  <div className="flex items-center space-x-3 pl-2 border-l-2 border-gray-100 ml-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <span>Generating troubleshooting plan</span>
                  </div>
                  <div className="flex items-center space-x-3 pl-2 border-l-2 border-gray-100 ml-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <span>Resolving Settings actions</span>
                  </div>
                  <div className="flex items-center space-x-3 pl-2 ml-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <span>Validating response</span>
                  </div>
                </div>
              </div>
            )}

            {/* Result state */}
            {result && !loading && (
              <div className="space-y-6">
                
                {/* Detected Issues */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Detected Issues</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.query.normalized_intents.map((intent, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 rounded-md font-medium text-sm border border-red-100">
                        {intent.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Troubleshooting */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Recommended Troubleshooting</h3>
                  <div className="space-y-6">
                    {result.actions.map((action, idx) => (
                      <div key={idx} className="border border-gray-100 rounded-xl p-5 bg-gray-50/50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold text-gray-900">{action.title}</h4>
                          <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Priority {action.priority}
                          </span>
                        </div>
                        {action.rationale && (
                          <p className="text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                            <span className="font-semibold text-gray-700">Reason:</span> {action.rationale}
                          </p>
                        )}
                        
                        <div className="space-y-3">
                          {action.steps.map((step, sIdx) => (
                            <div key={sIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                              <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Step {step.step}</span>
                                <span className="text-sm font-medium text-gray-800">{step.instruction}</span>
                              </div>
                              <div className="shrink-0">
                                {step.deeplink_valid ? (
                                  <a href={`intent://${step.deeplink}#Intent;scheme=android-app;end`} 
                                     onClick={(e) => {
                                       e.preventDefault();
                                       alert(`In a real Android app, this would trigger:\n${step.deeplink}`);
                                     }}
                                     className="inline-block px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors text-center w-full sm:w-auto">
                                    Open Settings
                                  </a>
                                ) : (
                                  <span className="inline-block px-4 py-2 bg-gray-100 text-gray-500 text-sm font-medium rounded-lg text-center w-full sm:w-auto cursor-not-allowed">
                                    Settings shortcut unavailable
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Metrics */}
                <div className="bg-gray-900 rounded-2xl shadow-sm p-4 text-gray-300 text-xs font-mono grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="block text-gray-500 mb-1">Response time</span>
                    <span className="text-white">{result.metadata.latency_ms.toFixed(1)} ms</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 mb-1">Cache</span>
                    <span className={result.metadata.cache_hit ? "text-green-400" : "text-amber-400"}>
                      {result.metadata.cache_hit ? "HIT" : "MISS"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500 mb-1">Estimated cost</span>
                    <span className="text-white">
                      ${result.metadata.estimated_cost_usd?.toFixed(4) ?? '0.0000'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500 mb-1">Validation</span>
                    <span className="text-green-400 uppercase">{result.metadata.validation}</span>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
