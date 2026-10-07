import { useState } from 'react';
import { PageHeader, Button } from '../../components/ui/index';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { User, MapPin, Phone, Globe, Leaf, Edit3, Save, X } from 'lucide-react';

const LANG_LABELS = { en: 'English', mr: 'मराठी', hi: 'हिन्दी' };

export default function ProfilePage() {
  const { user } = useAuth();
  const { lang, changeLanguage } = useLanguage();
  const { addToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ mobile: user?.mobile || '', village: user?.village || '', preferredLanguage: lang });

  const handleSave = () => {
    changeLanguage(form.preferredLanguage);
    setEditing(false);
    addToast('Profile updated successfully!', 'success');
  };

  const isExpert = user?.role === 'expert';
  const isOfficer = user?.role === 'officer';
  const isFarmer = user?.role === 'farmer';

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Profile" subtitle="Manage your account information" breadcrumb="Profile" />

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-green-800 to-emerald-700 relative">
          <div className="absolute bottom-0 left-6 transform translate-y-1/2">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 border-4 border-white flex items-center justify-center shadow-xl">
              <span className="text-white text-3xl font-bold">{user?.name?.[0]}</span>
            </div>
          </div>
        </div>
        <div className="pt-14 pb-6 px-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 font-display">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className={`inline-flex items-center mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
                isFarmer ? 'bg-green-100 text-green-700' : isExpert ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {isFarmer ? '🌾 Farmer' : isExpert ? '🔬 Agriculture Expert' : '🏛️ Agriculture Officer'}
              </span>
            </div>
            {!editing ? (
              <Button variant="secondary" onClick={() => setEditing(true)}>
                <Edit3 className="w-4 h-4" /> Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave}><Save className="w-4 h-4" /> Save</Button>
                <Button variant="outline" onClick={() => setEditing(false)}><X className="w-4 h-4" /> Cancel</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Personal Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-green-600" /> Personal Information
          </h3>
          <div className="space-y-3">
            {isFarmer && (
              <>
                <InfoRow label="Kisan ID" value={user.kisan_id} />
                {editing ? (
                  <div>
                    <label className="text-xs text-gray-400">Mobile</label>
                    <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-green-400" value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} />
                  </div>
                ) : (
                  <InfoRow label="Mobile" value={user.mobile} icon={<Phone className="w-3.5 h-3.5 text-green-500" />} />
                )}
                {editing ? (
                  <div>
                    <label className="text-xs text-gray-400">Village</label>
                    <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-green-400" value={form.village} onChange={e => setForm(f => ({ ...f, village: e.target.value }))} />
                  </div>
                ) : (
                  <InfoRow label="Village" value={user.village} />
                )}
                <InfoRow label="Taluka" value={user.taluka} icon={<MapPin className="w-3.5 h-3.5 text-green-500" />} />
                <InfoRow label="District" value={user.district} />
                <InfoRow label="State" value={user.state} />
              </>
            )}
            {isExpert && (
              <>
                <InfoRow label="Expert ID" value={user.expertId} />
                <InfoRow label="Specialization" value={user.specialization} />
                <InfoRow label="Institution" value={user.institution} />
                <InfoRow label="Experience" value={user.experience} />
                <InfoRow label="District" value={user.district} icon={<MapPin className="w-3.5 h-3.5 text-green-500" />} />
              </>
            )}
            {isOfficer && (
              <>
                <InfoRow label="Officer ID" value={user.officerId} />
                <InfoRow label="Department" value={user.department} />
                <InfoRow label="Designation" value={user.designation} />
                <InfoRow label="Region" value={user.region} />
                <InfoRow label="Jurisdiction" value={user.jurisdiction} />
              </>
            )}
          </div>
        </div>

        {/* Preferences + Stats */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-green-600" /> Language Preference
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(LANG_LABELS).map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => { setForm(f => ({ ...f, preferredLanguage: code })); if (!editing) changeLanguage(code); }}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${(editing ? form.preferredLanguage : lang) === code ? 'bg-green-600 text-white border-green-600 shadow-md' : 'border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {isFarmer && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-600" /> Farm Summary
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Farms', value: user.farmCount },
                  { label: 'Total Area', value: user.totalArea },
                  { label: 'Active Crops', value: 4 },
                  { label: 'Avg Health', value: '78%' },
                ].map(s => (
                  <div key={s.label} className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-green-700">{s.value}</p>
                    <p className="text-xs text-green-600 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isExpert && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Expert Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-blue-700">{user.casesHandled}</p>
                  <p className="text-xs text-blue-600">Cases Handled</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-green-700">{user.successRate}</p>
                  <p className="text-xs text-green-600">Success Rate</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-400 flex items-center gap-1.5">{icon}{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}
