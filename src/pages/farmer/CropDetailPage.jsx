import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Leaf, Droplets, Bug, ShieldAlert } from 'lucide-react';
import { RiskBadge, HealthScore, Button } from '../../components/ui/index';
import { CROPS, CROP_ASSESSMENTS } from '../../data/mockData';

export default function CropDetailPage() {
  const { id } = useParams();
  const crop = CROPS.find(c => c.id === id);
  const assessments = CROP_ASSESSMENTS.filter(a => a.cropId === id);

  if (!crop) return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">🌱</p>
      <h3 className="text-xl font-bold text-gray-700">Crop not found</h3>
      <Link to="/farmer/crops" className="text-green-600 text-sm hover:underline mt-2 block">← Back to Crops</Link>
    </div>
  );

  const daysToHarvest = Math.ceil((new Date(crop.expectedHarvest) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="animate-fade-in space-y-6">
      {/* Back + Header */}
      <div>
        <Link to="/farmer/crops" className="flex items-center gap-1.5 text-green-600 text-sm hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Crops
        </Link>
        <div className="bg-gradient-to-r from-green-800 to-emerald-700 text-white rounded-2xl p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-5 h-5 text-green-300" />
                <span className="text-green-300 text-sm font-medium">{crop.stage}</span>
              </div>
              <h1 className="text-3xl font-bold font-display">{crop.name}</h1>
              <p className="text-green-200 text-sm mt-1">{crop.variety}</p>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="w-3.5 h-3.5 text-green-300" />
                <span className="text-green-200 text-xs">{crop.location}</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <HealthScore score={crop.healthScore} size={80} />
              <RiskBadge level={crop.riskLevel} />
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Sowing Date', value: crop.sowingDate, icon: Calendar },
          { label: 'Expected Harvest', value: crop.expectedHarvest, icon: Calendar },
          { label: 'Area', value: crop.area, icon: Leaf },
          { label: 'Days to Harvest', value: `${daysToHarvest} days`, icon: Calendar },
        ].map((info) => (
          <div key={info.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <info.icon className="w-4 h-4 text-green-600" />
              <p className="text-xs text-gray-400">{info.label}</p>
            </div>
            <p className="font-bold text-gray-800">{info.value}</p>
          </div>
        ))}
      </div>

      {/* Details Row */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Soil & Irrigation */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Soil & Irrigation</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Soil Type</span>
              <span className="text-sm font-medium text-gray-800">{crop.soilType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Irrigation</span>
              <span className="text-sm font-medium text-gray-800">{crop.irrigationSchedule}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Nutrient N</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${crop.nutrientStatus.N === 'Good' ? 'bg-green-100 text-green-700' : crop.nutrientStatus.N === 'Adequate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{crop.nutrientStatus.N}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Nutrient P</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${crop.nutrientStatus.P === 'Good' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{crop.nutrientStatus.P}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Nutrient K</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${crop.nutrientStatus.K === 'Good' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{crop.nutrientStatus.K}</span>
            </div>
          </div>
        </div>

        {/* Pest History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Bug className="w-4 h-4 text-amber-500" /> Pest & Disease History
          </h3>
          {crop.pestHistory.length > 0 ? (
            <div className="space-y-2">
              {crop.pestHistory.map((h, i) => (
                <div key={i} className="flex items-center gap-2 bg-amber-50 rounded-xl px-3 py-2">
                  <span className="text-amber-500 text-sm">⚠️</span>
                  <span className="text-sm text-amber-800">{h}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <p className="text-3xl mb-2">✅</p>
              <p className="text-sm">No disease/pest history recorded</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Actions</h3>
          <div className="space-y-3">
            <Link to="/farmer/assessment" className="flex items-center gap-3 bg-green-50 text-green-700 rounded-xl px-4 py-3 text-sm font-medium hover:bg-green-100 transition-colors">
              <ShieldAlert className="w-4 h-4" /> Start AI Assessment
            </Link>
            <Link to="/farmer/risk" className="flex items-center gap-3 bg-blue-50 text-blue-700 rounded-xl px-4 py-3 text-sm font-medium hover:bg-blue-100 transition-colors">
              <span>📊</span> View Risk Forecast
            </Link>
            <Link to="/farmer/advisory" className="flex items-center gap-3 bg-amber-50 text-amber-700 rounded-xl px-4 py-3 text-sm font-medium hover:bg-amber-100 transition-colors">
              <span>📋</span> View Advisory
            </Link>
            <Link to="/farmer/expert-support" className="flex items-center gap-3 bg-purple-50 text-purple-700 rounded-xl px-4 py-3 text-sm font-medium hover:bg-purple-100 transition-colors">
              <span>👨‍🔬</span> Request Expert Help
            </Link>
          </div>
        </div>
      </div>

      {/* Assessment History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Assessment History</h3>
        {assessments.length > 0 ? (
          <div className="space-y-4">
            {assessments.map((a) => (
              <div key={a.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                {a.imageUrl && (
                  <img src={a.imageUrl} alt="Assessment" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h4 className="font-semibold text-gray-800 text-sm">{a.disease}</h4>
                    <RiskBadge level={a.riskLevel} />
                    {a.expertVerified && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">✓ Expert Verified</span>}
                  </div>
                  <p className="text-xs text-gray-500 mb-1">Date: {a.date} · Confidence: {a.confidence}%</p>
                  {a.expertNote && <p className="text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-2">🔬 {a.expertNote}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p className="text-4xl mb-2">📷</p>
            <p className="text-sm">No assessments yet. Start an AI scan to analyze this crop.</p>
            <Link to="/farmer/assessment" className="text-green-600 text-sm hover:underline mt-2 block">Start Assessment →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
