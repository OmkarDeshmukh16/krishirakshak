import { useState } from 'react';
import {
  MapPin, ShieldAlert, Filter, Search, ArrowUpRight, Megaphone,
  Layers, Users, Activity, ExternalLink, Info, CheckCircle
} from 'lucide-react';
import { PageHeader, RiskBadge, Button, Modal } from '../../components/ui/index';
import { HOTSPOTS } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function HotspotsPage() {
  const { addToast } = useToast();
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedHotspot, setSelectedHotspot] = useState(HOTSPOTS[0]);
  const [advisoryModalOpen, setAdvisoryModalOpen] = useState(false);
  const [advisoryMessage, setAdvisoryMessage] = useState('');

  const crops = ['all', ...new Set(HOTSPOTS.map(h => h.crop))];

  const filteredHotspots = HOTSPOTS.filter(h => {
    const matchesCrop = selectedCrop === 'all' || h.crop.toLowerCase() === selectedCrop.toLowerCase();
    const matchesRisk = selectedRisk === 'all' || h.riskLevel.toLowerCase() === selectedRisk.toLowerCase();
    return matchesCrop && matchesRisk;
  });

  const getMarkerColor = (level) => {
    if (level === 'high') return '#ef4444';
    if (level === 'moderate') return '#f59e0b';
    return '#22c55e';
  };

  const handleSendTargetedAdvisory = () => {
    if (!advisoryMessage.trim()) {
      addToast('Please enter advisory instructions', 'warning');
      return;
    }
    addToast(`Targeted advisory dispatched to ${selectedHotspot.name} (${selectedHotspot.reports} farmers notified)!`, 'success');
    setAdvisoryModalOpen(false);
    setAdvisoryMessage('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Regional Disease Hotspots & GIS Surveillance"
          subtitle="Real-time geographic clusters of crop infestations across Maharashtra districts."
        />
        <div className="flex items-center gap-2">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setAdvisoryMessage(`Urgent Pest Alert for ${selectedHotspot.name}: Increased cases of ${selectedHotspot.disease} on ${selectedHotspot.crop}. Take immediate preventive measures.`);
              setAdvisoryModalOpen(true);
            }}
            className="flex items-center gap-1.5"
          >
            <Megaphone className="w-3.5 h-3.5" /> Dispatch Alert to Selected Zone
          </Button>
        </div>
      </div>

      {/* Filter Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </div>
          {/* Crop Filter */}
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Crops</option>
            {crops.filter(c => c !== 'all').map(crop => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>

          {/* Severity Filter */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Severity Only</option>
            <option value="moderate">Moderate Severity</option>
            <option value="low">Low Severity</option>
          </select>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block animate-pulse" />
            <span>High Risk Cluster</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span>Moderate Watch</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            <span>Low Risk</span>
          </div>
        </div>
      </div>

      {/* Main Map & Detail Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-4 overflow-hidden flex flex-col min-h-[480px]">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-600" /> Interactive Geospatial Surveillance Map
            </span>
            <span className="text-xs text-gray-400">Centered on Maharashtra Agricultural Belt</span>
          </div>

          <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200 relative z-0">
            <MapContainer
              center={[19.7515, 75.7139]}
              zoom={7}
              scrollWheelZoom={false}
              className="h-full w-full min-h-[420px]"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredHotspots.map(hotspot => (
                <CircleMarker
                  key={hotspot.id}
                  center={[hotspot.lat, hotspot.lng]}
                  radius={hotspot.riskLevel === 'high' ? 18 : 13}
                  pathOptions={{
                    color: getMarkerColor(hotspot.riskLevel),
                    fillColor: getMarkerColor(hotspot.riskLevel),
                    fillOpacity: 0.6,
                    weight: 3,
                  }}
                  eventHandlers={{
                    click: () => setSelectedHotspot(hotspot),
                  }}
                >
                  <Popup>
                    <div className="p-1">
                      <p className="font-bold text-sm text-gray-900">{hotspot.name}</p>
                      <p className="text-xs text-gray-600 mt-0.5">Crop: <strong>{hotspot.crop}</strong></p>
                      <p className="text-xs text-red-600 font-semibold">{hotspot.disease}</p>
                      <p className="text-[11px] text-gray-500 mt-1">{hotspot.reports} incidents reported ({hotspot.affectedArea})</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Selected Hotspot Deep Dive Panel */}
        <div className="space-y-4">
          {selectedHotspot ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xl text-gray-900">{selectedHotspot.name}</h3>
                    <RiskBadge level={selectedHotspot.riskLevel} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Cluster ID: {selectedHotspot.id.toUpperCase()}</p>
                </div>
              </div>

              {/* Key cluster metrics */}
              <div className="space-y-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Major Pathogen:</span>
                  <span className="font-bold text-red-700">{selectedHotspot.disease}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Target Crop:</span>
                  <span className="font-semibold text-gray-800">{selectedHotspot.crop}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Verified Reports:</span>
                  <span className="font-semibold text-gray-800">{selectedHotspot.reports} farmer cases</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Contagion Area:</span>
                  <span className="font-semibold text-gray-800">{selectedHotspot.affectedArea}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Spread Trajectory:</span>
                  <span className={`font-semibold capitalize ${selectedHotspot.trend === 'increasing' ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedHotspot.trend} {selectedHotspot.trend === 'increasing' ? '↑' : '↓'}
                  </span>
                </div>
              </div>

              {/* Prescribed Action Plan for Officers */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Recommended Intervention Protocol</label>
                <div className="text-xs text-gray-600 bg-purple-50/60 p-3 rounded-xl border border-purple-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-purple-900 font-semibold">
                    <Info className="w-3.5 h-3.5" /> Containment Steps
                  </div>
                  <p>1. Dispatch SMS advisory to all {selectedHotspot.crop} growers in {selectedHotspot.name} district.</p>
                  <p>2. Alert the local Krishi Vigyan Kendra (KVK) for ground inspection.</p>
                  <p>3. Restrict transport of untreated seedling batches from high-infection plots.</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full justify-center flex items-center gap-2"
                  onClick={() => {
                    setAdvisoryMessage(`Urgent Pest Advisory for ${selectedHotspot.name} District: Elevated threat of ${selectedHotspot.disease} on ${selectedHotspot.crop}. Inspect field undersides and apply certified biocontrols immediately.`);
                    setAdvisoryModalOpen(true);
                  }}
                >
                  <Megaphone className="w-4 h-4" /> Broadcast Advisory to Cluster
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => addToast(`Field Inspection Task assigned to ${selectedHotspot.name} KVK agronomy team`, 'success')}
                >
                  Mobilize Ground Squad
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 text-gray-400 text-sm">
              Select a hotspot pin on the map to inspect surveillance metrics.
            </div>
          )}

          {/* Quick Hotspot Directory List */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
            <span className="text-xs font-bold text-gray-700 block mb-2">All Monitored Clusters</span>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {filteredHotspots.map(h => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHotspot(h)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                    selectedHotspot?.id === h.id
                      ? 'bg-purple-50 border border-purple-200 text-purple-900 font-semibold'
                      : 'hover:bg-gray-50 border border-transparent text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: getMarkerColor(h.riskLevel) }}
                    />
                    <span>{h.name}</span>
                    <span className="text-gray-400">({h.crop})</span>
                  </div>
                  <span className="text-gray-500 font-medium">{h.reports} cases</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Targeted Advisory Dispatch Modal */}
      {advisoryModalOpen && (
        <Modal
          isOpen={advisoryModalOpen}
          onClose={() => setAdvisoryModalOpen(false)}
          title={`Broadcast Emergency Advisory: ${selectedHotspot.name} District`}
        >
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
              This message will be dispatched via automated <strong>SMS Gateway</strong>, <strong>WhatsApp Kisan Bot</strong>, and <strong>KrishiRakshak App Push</strong> to {selectedHotspot.reports * 12} registered farmers in {selectedHotspot.name}.
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">Advisory Message Content</label>
              <textarea
                rows={4}
                value={advisoryMessage}
                onChange={(e) => setAdvisoryMessage(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span>Target Crop: <strong>{selectedHotspot.crop}</strong></span>
              <span>Estimated Reach: <strong>~{selectedHotspot.reports * 12} farmers</strong></span>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <Button variant="outline" size="sm" onClick={() => setAdvisoryModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleSendTargetedAdvisory} className="flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5" /> Dispatch Alert Now
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
