import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Upload, X, Zap, AlertTriangle, CheckCircle, Info, ChevronRight } from 'lucide-react';
import { PageHeader, RiskBadge, Button } from '../../components/ui/index';
import { useToast } from '../../context/ToastContext';

const AI_RESULT = {
  disease: 'Possible Early Blight',
  confidence: 87,
  riskLevel: 'high',
  disclaimer: 'This is a preliminary AI assessment, not a confirmed diagnosis. Expert verification is recommended.',
  contributingFactors: [
    { icon: '💧', label: 'High Humidity', value: '82%', impact: 'high' },
    { icon: '🌧️', label: 'Recent Rainfall', value: '45mm / 3 days', impact: 'high' },
    { icon: '🌱', label: 'Crop Growth Stage', value: 'Flowering (high susceptibility)', impact: 'moderate' },
    { icon: '📋', label: 'Previous Disease History', value: 'Early Blight (2025)', impact: 'moderate' },
  ],
  recommendedActions: [
    'Inspect all leaves carefully for dark brown spots with yellow halos',
    'Remove and destroy severely affected leaves immediately to prevent spread',
    'Ensure adequate plant spacing for proper air circulation',
    'Avoid overhead irrigation when disease pressure is high',
    'Monitor all nearby plants for signs of spread',
    'Contact an agriculture expert for professional validation',
  ],
  similarCases: 42,
  regionAlert: 'Early Blight reports are high in Nashik district this season.',
};

export default function AssessmentPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const fileRef = useRef();
  const { addToast } = useToast();

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file (JPG, PNG, etc.)', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      addToast('Image size must be less than 10MB', 'error');
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  const handleAnalyze = () => {
    if (!image) {
      addToast('Please upload a crop image first', 'error');
      return;
    }
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      setResult(AI_RESULT);
      addToast('AI analysis complete!', 'success');
    }, 3500);
  };

  const handleRemove = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const impactColors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    moderate: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-green-100 text-green-700 border-green-200',
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="AI Crop Health Assessment"
        subtitle="Upload a crop image to get an AI-powered disease and pest analysis"
        breadcrumb="Assessment"
      />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Upload Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Upload Crop Image</h3>

            {/* Crop Selector */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">Select Crop</label>
              <select
                value={selectedCrop}
                onChange={e => setSelectedCrop(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                {['Tomato', 'Onion', 'Grapes', 'Wheat', 'Potato', 'Sugarcane', 'Cotton'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Drop zone */}
            {!preview ? (
              <div
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${dragOver ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-400 hover:bg-green-50/50'}`}
              >
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <Upload className="w-7 h-7 text-green-600" />
                </div>
                <p className="font-semibold text-gray-700 text-sm">Drag & drop image here</p>
                <p className="text-gray-400 text-xs mt-1">or click to browse</p>
                <p className="text-gray-300 text-xs mt-3">JPG, PNG, WEBP · Max 10MB</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
              </div>
            ) : (
              <div className="relative">
                <img src={preview} alt="Crop preview" className="w-full h-52 object-cover rounded-2xl" />
                {scanning && (
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-3">
                      <div className="relative w-full">
                        <div className="animate-scan" />
                      </div>
                      <div className="bg-black/60 text-green-400 text-sm px-4 py-2 rounded-full font-medium animate-pulse">
                        🔍 Analyzing image...
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleRemove}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                  {selectedCrop} · {(image.size / 1024).toFixed(0)} KB
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-blue-700 mb-1">📸 Photo Tips</p>
              <ul className="text-xs text-blue-600 space-y-0.5">
                <li>• Take close-up shots of affected leaves</li>
                <li>• Use natural daylight for best results</li>
                <li>• Include both healthy and affected leaves</li>
              </ul>
            </div>

            <Button
              className="w-full mt-4"
              size="lg"
              onClick={handleAnalyze}
              loading={scanning}
              disabled={!image || scanning}
            >
              <Zap className="w-5 h-5" />
              {scanning ? 'Analyzing...' : 'Analyze Crop'}
            </Button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-3 space-y-4">
          {!result && !scanning && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center justify-center text-center h-full min-h-64">
              <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">Ready for Analysis</h3>
              <p className="text-gray-400 text-sm max-w-xs">Upload a crop photo and click "Analyze Crop" to get an AI-powered health assessment.</p>
            </div>
          )}

          {scanning && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center justify-center text-center">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-spin-slow" />
                <div className="absolute inset-2 rounded-full border-4 border-green-400 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                <div className="absolute inset-4 rounded-full bg-green-50 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-green-600 animate-pulse" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">AI Analysis in Progress...</h3>
              <p className="text-gray-400 text-sm">Detecting disease patterns, analyzing symptoms and cross-referencing regional data</p>
              <div className="flex gap-1 mt-4">
                {['Processing image...', 'Detecting patterns...', 'Generating report...'].map((s, i) => (
                  <span key={s} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-4 animate-fade-in">
              {/* Main Result */}
              <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="text-xl font-bold text-gray-800 font-display">{result.disease}</h3>
                      <RiskBadge level={result.riskLevel} />
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-400">AI Confidence</p>
                        <p className="text-2xl font-bold text-red-600">{result.confidence}%</p>
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-red-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
                      <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800">{result.disclaimer}</p>
                    </div>
                  </div>
                </div>

                {result.regionAlert && (
                  <div className="mt-3 bg-orange-50 border border-orange-200 rounded-xl p-3 flex gap-2">
                    <span className="text-orange-500 text-sm">📍</span>
                    <p className="text-xs text-orange-800 font-medium">{result.regionAlert} ({result.similarCases} reports)</p>
                  </div>
                )}
              </div>

              {/* Contributing Factors */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Contributing Factors</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {result.contributingFactors.map((f) => (
                    <div key={f.label} className={`flex items-center gap-3 p-3 rounded-xl border ${impactColors[f.impact]}`}>
                      <span className="text-xl">{f.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold">{f.label}</p>
                        <p className="text-xs opacity-80 truncate">{f.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Recommended Actions</h3>
                <div className="space-y-2">
                  {result.recommendedActions.map((action, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-700">{action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link to="/farmer/expert-support" className="flex-1">
                  <Button className="w-full" size="lg">
                    <span>👨‍🔬</span> Request Expert Verification
                  </Button>
                </Link>
                <Button variant="secondary" size="lg" onClick={() => addToast('Assessment saved to history!', 'success')}>
                  <span>💾</span> Save Assessment
                </Button>
                <Link to="/farmer/crops/c1">
                  <Button variant="outline" size="lg">
                    <span>📊</span> View Crop History
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const impactColors = {
  high: 'bg-red-100 text-red-700 border-red-200',
  moderate: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-green-100 text-green-700 border-green-200',
};
