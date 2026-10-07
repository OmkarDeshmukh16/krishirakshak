import { useState } from 'react';
import {
  Megaphone, Send, ShieldAlert, Users, CheckCircle2,
  Clock, Plus, Filter, MessageSquare, Smartphone, Radio, FileText
} from 'lucide-react';
import { PageHeader, RiskBadge, Button, Modal } from '../../components/ui/index';
import { useToast } from '../../context/ToastContext';

const INITIAL_ALERTS = [
  {
    id: 'alt-1',
    title: 'Urgent: Early Blight Spore Outbreak Advisory',
    district: 'Nashik (Dindori, Niphad)',
    crop: 'Tomato',
    severity: 'high',
    channels: ['SMS', 'WhatsApp', 'App Push'],
    recipients: 4320,
    deliveryRate: '99.2%',
    date: '2026-10-05 09:30',
    content: 'Continuous high humidity (82%) detected across Nashik. Tomato crops at flowering stage are at critical risk of Early Blight. Apply preventive copper-based spray immediately and inspect lower leaf canopies.',
    status: 'Dispatched',
  },
  {
    id: 'alt-2',
    title: 'Pre-Monsoon Drainage & Fungicide Advisory',
    district: 'All Districts (Nashik Division)',
    crop: 'All Crops',
    severity: 'moderate',
    channels: ['App Push', 'SMS'],
    recipients: 11840,
    deliveryRate: '98.5%',
    date: '2026-10-03 14:15',
    content: 'IMD forecasts 65mm+ heavy rainfall in the next 48 hours. Ensure farm drainage furrows are cleared to avoid root rotting and fungal spore propagation.',
    status: 'Dispatched',
  },
  {
    id: 'alt-3',
    title: 'Whitefly Surveillance & Yellow Trap Deployment Alert',
    district: 'Ahmednagar (Sangamner, Rahuri)',
    crop: 'Tomato, Cotton',
    severity: 'moderate',
    channels: ['WhatsApp', 'App Push'],
    recipients: 3600,
    deliveryRate: '97.8%',
    date: '2026-09-30 11:00',
    content: 'Elevated whitefly density observed in border fields. Install 15-20 yellow sticky traps per acre immediately to monitor and check spread.',
    status: 'Dispatched',
  },
];

const TEMPLATES = [
  {
    title: 'Fungal Spore Risk After Rain',
    crop: 'Tomato / Potato',
    severity: 'high',
    content: 'Heavy rains have elevated humidity above 85%. High risk of Early/Late Blight. Inspect lower leaves for circular brown spots and ensure proper field drainage.',
  },
  {
    title: 'Pest Flare-up Heatwave Warning',
    crop: 'Onion / Vegetables',
    severity: 'moderate',
    content: 'Rising temperatures create favorable conditions for Thrips and Mites. Inspect leaf sheaths and underside of foliage. Spray neem-based formulation if early signs appear.',
  },
  {
    title: 'Hailstorm Post-Damage Protective Spray',
    crop: 'Grapes / Pomegranate',
    severity: 'high',
    content: 'Following physical crop hail damage, immediately spray systemic bactericide/fungicide within 24 hours to prevent secondary pathogen entry.',
  },
];

export default function AlertsPage() {
  const { addToast } = useToast();
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('krishi_officer_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDistrict, setFormDistrict] = useState('Nashik Division (All Districts)');
  const [formCrop, setFormCrop] = useState('Tomato');
  const [formSeverity, setFormSeverity] = useState('high');
  const [formContent, setFormContent] = useState('');
  const [selectedChannels, setSelectedChannels] = useState(['SMS', 'WhatsApp', 'App Push']);

  const toggleChannel = (ch) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter(c => c !== ch));
      }
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  const applyTemplate = (tmpl) => {
    setFormTitle(tmpl.title);
    setFormCrop(tmpl.crop);
    setFormSeverity(tmpl.severity);
    setFormContent(tmpl.content);
  };

  const handleDispatchAlert = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      addToast('Please fill in title and advisory content', 'warning');
      return;
    }

    const newAlert = {
      id: `alt-${Date.now()}`,
      title: formTitle,
      district: formDistrict,
      crop: formCrop,
      severity: formSeverity,
      channels: selectedChannels,
      recipients: Math.floor(Math.random() * 3000) + 4000,
      deliveryRate: '99.4%',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      content: formContent,
      status: 'Dispatched',
    };

    const updated = [newAlert, ...alerts];
    setAlerts(updated);
    localStorage.setItem('krishi_officer_alerts', JSON.stringify(updated));
    addToast(`Emergency Advisory broadcasted successfully to ${newAlert.recipients} farmers!`, 'success');

    setModalOpen(false);
    setFormTitle('');
    setFormContent('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Regional Advisory & Emergency Broadcasts"
          subtitle="Direct dissemination of validated alerts to thousands of farmers via SMS, WhatsApp, and App push."
        />
        <Button
          variant="danger"
          size="md"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 shadow-md shadow-red-900/20"
        >
          <Megaphone className="w-4 h-4" /> Issue New Regional Advisory
        </Button>
      </div>

      {/* Broadcast Quick Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 font-medium">Total Alerts Issued</p>
          <p className="text-2xl font-bold text-gray-900 font-display mt-1">{alerts.length}</p>
          <p className="text-[11px] text-green-600 mt-1">Surveillance season 2026</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 font-medium">Total Reach</p>
          <p className="text-2xl font-bold text-purple-700 font-display mt-1">
            {alerts.reduce((acc, a) => acc + a.recipients, 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Verified kisan mobile numbers</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 font-medium">Avg SMS Delivery Rate</p>
          <p className="text-2xl font-bold text-green-600 font-display mt-1">98.6%</p>
          <p className="text-[11px] text-gray-500 mt-1">Telecom telecom gateway</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 font-medium">Available Dissemination Channels</p>
          <div className="flex gap-2 mt-2">
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold">SMS</span>
            <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-semibold">WhatsApp</span>
            <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-semibold">Push</span>
          </div>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 text-sm">Official Broadcast Log</h3>

        {alerts.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <RiskBadge level={item.severity} />
                <h4 className="font-bold text-gray-900 text-base">{item.title}</h4>
              </div>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {item.date}
              </span>
            </div>

            <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">
              {item.content}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 pt-1">
              <div className="flex flex-wrap items-center gap-3">
                <span>District: <strong className="text-gray-800">{item.district}</strong></span>
                <span>•</span>
                <span>Crop: <strong className="text-gray-800">{item.crop}</strong></span>
                <span>•</span>
                <span>Reach: <strong className="text-purple-700 font-semibold">{item.recipients.toLocaleString()} farmers</strong></span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.channels.map(ch => (
                  <span key={ch} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                    {ch}
                  </span>
                ))}
                <span className="text-green-600 font-semibold text-[11px] ml-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {item.deliveryRate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dispatch Broadcast Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Compose Regional Agriculture Advisory"
        >
          <form onSubmit={handleDispatchAlert} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {/* Quick Templates */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">Quick Fill from Standard Templates</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyTemplate(tmpl)}
                    className="text-left text-xs p-2 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-xl border border-purple-200 transition-all whitespace-nowrap flex-shrink-0"
                  >
                    <span className="font-semibold block">{tmpl.title}</span>
                    <span className="text-[10px] text-purple-600">{tmpl.crop}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">Advisory Title *</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Urgent: Early Blight Spore Outbreak Advisory"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">Target District/Region</label>
                <select
                  value={formDistrict}
                  onChange={(e) => setFormDistrict(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Nashik Division (All Districts)">Nashik Division (All Districts)</option>
                  <option value="Nashik (Dindori, Niphad, Sinnar)">Nashik (Dindori, Niphad, Sinnar)</option>
                  <option value="Ahmednagar (Sangamner, Rahuri)">Ahmednagar (Sangamner, Rahuri)</option>
                  <option value="Pune (Baramati, Junnar)">Pune (Baramati, Junnar)</option>
                  <option value="Dhule & Nandurbar">Dhule & Nandurbar</option>
                  <option value="Jalgaon District">Jalgaon District</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">Affected Crop</label>
                <select
                  value={formCrop}
                  onChange={(e) => setFormCrop(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="All Crops">All Crops</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Onion">Onion</option>
                  <option value="Grapes">Grapes</option>
                  <option value="Potato">Potato</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Sugarcane">Sugarcane</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">Alert Severity Level</label>
              <div className="flex gap-3">
                {[
                  { id: 'high', label: 'High Risk (Emergency)', color: 'border-red-500 text-red-700 bg-red-50' },
                  { id: 'moderate', label: 'Moderate Watch', color: 'border-amber-500 text-amber-700 bg-amber-50' },
                  { id: 'low', label: 'Informative Advisory', color: 'border-green-500 text-green-700 bg-green-50' },
                ].map(sev => (
                  <button
                    key={sev.id}
                    type="button"
                    onClick={() => setFormSeverity(sev.id)}
                    className={`flex-1 p-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                      formSeverity === sev.id ? sev.color : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {sev.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Channels */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">Distribution Channels</label>
              <div className="flex gap-2">
                {['SMS', 'WhatsApp', 'App Push'].map(ch => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => toggleChannel(ch)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedChannels.includes(ch)
                        ? 'bg-purple-100 border-purple-400 text-purple-800'
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                    }`}
                  >
                    ✓ {ch}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">Advisory Instructions & Advice *</label>
              <textarea
                rows={4}
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Specify precise actionable guidance: symptoms to look for, authorized spray doses, water drainage instructions, helpline numbers..."
                className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
            </div>

            {/* Dispatch Footer */}
            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" type="submit" className="flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> Broadcast to Registered Farmers
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
