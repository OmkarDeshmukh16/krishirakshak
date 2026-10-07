import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Leaf, Eye, Edit, ChevronRight, Droplets } from 'lucide-react';
import { PageHeader, RiskBadge, Modal, Button, HealthScore } from '../../components/ui/index';
import { FARMS, CROPS } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export default function FarmsPage() {
  const [farms, setFarms] = useState(FARMS);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', area: '', soilType: '', irrigationType: '' });
  const { addToast } = useToast();
  const { t } = useLanguage();

  const handleAdd = () => {
    if (!form.name || !form.location || !form.area) {
      addToast('Please fill all required fields', 'error');
      return;
    }
    const newFarm = {
      id: `f${Date.now()}`,
      ownerId: 'u1',
      name: form.name,
      location: form.location,
      area: `${form.area} acres`,
      soilType: form.soilType || 'Unknown',
      irrigationType: form.irrigationType || 'Unknown',
      crops: [],
      healthScore: 85,
      status: 'good',
      lastAssessed: new Date().toISOString().split('T')[0],
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
    };
    setFarms([...farms, newFarm]);
    setForm({ name: '', location: '', area: '', soilType: '', irrigationType: '' });
    setShowAdd(false);
    addToast('Farm added successfully!', 'success');
  };

  const getFarmCrops = (farmId) => CROPS.filter(c => c.farmId === farmId);
  const getStatusColor = (s) => s === 'good' ? 'bg-green-100 text-green-700' : s === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title={t('farms')}
        subtitle="Manage and monitor all your registered farms"
        breadcrumb="My Farms"
        actions={
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" /> {t('addFarm')}
          </Button>
        }
      />

      <div className="grid md:grid-cols-2 gap-6">
        {farms.map((farm) => {
          const crops = getFarmCrops(farm.id);
          return (
            <div key={farm.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden card-hover group">
              {/* Farm Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={farm.image}
                  alt={farm.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg font-display">{farm.name}</h3>
                  <div className="flex items-center gap-1.5 text-white/80 text-xs mt-0.5">
                    <MapPin className="w-3 h-3" /> {farm.location}
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${getStatusColor(farm.status)}`}>
                    {farm.status === 'good' ? '✓ Good' : farm.status === 'moderate' ? '⚠ Moderate' : '✗ At Risk'}
                  </span>
                </div>
              </div>

              {/* Farm Info */}
              <div className="p-5">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <HealthScore score={farm.healthScore} size={56} />
                    <p className="text-xs text-gray-400 mt-1">Health</p>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-xs text-gray-400">Area</p>
                      <p className="text-sm font-bold text-gray-700">{farm.area}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-xs text-gray-400">Crops</p>
                      <p className="text-sm font-bold text-gray-700">{crops.length}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-xs text-gray-400">Soil</p>
                      <p className="text-xs font-semibold text-gray-700 truncate">{farm.soilType}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5">
                      <Droplets className="w-3 h-3 text-blue-500 mb-0.5" />
                      <p className="text-xs font-semibold text-gray-700 truncate">{farm.irrigationType}</p>
                    </div>
                  </div>
                </div>

                {/* Crops */}
                {crops.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {crops.map((c) => (
                      <span key={c.id} className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                        <Leaf className="w-3 h-3" /> {c.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Link to="/farmer/crops" className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 text-green-700 rounded-xl py-2.5 text-xs font-semibold hover:bg-green-100 transition-colors">
                    <Eye className="w-3.5 h-3.5" /> View Crops
                  </Link>
                  <button className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 rounded-xl px-3 py-2.5 text-xs font-semibold hover:bg-gray-50 transition-colors">
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-2">Last assessed: {farm.lastAssessed}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Farm Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Farm">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">Farm Name *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="e.g., North Field Farm"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">Location *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="e.g., Sinnar, Nashik"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">Area (acres) *</label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="2.5"
                value={form.area}
                onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">Soil Type</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                value={form.soilType}
                onChange={e => setForm(f => ({ ...f, soilType: e.target.value }))}
              >
                <option value="">Select</option>
                <option>Black Cotton Soil</option>
                <option>Alluvial Soil</option>
                <option>Red Loam</option>
                <option>Sandy Loam</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">Irrigation Type</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.irrigationType}
              onChange={e => setForm(f => ({ ...f, irrigationType: e.target.value }))}
            >
              <option value="">Select</option>
              <option>Drip Irrigation</option>
              <option>Sprinkler Irrigation</option>
              <option>Flood Irrigation</option>
              <option>Rainfed</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleAdd}>Add Farm</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
