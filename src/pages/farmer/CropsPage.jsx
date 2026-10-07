import { Link } from 'react-router-dom';
import { ChevronRight, Leaf, Calendar, MapPin } from 'lucide-react';
import { PageHeader, RiskBadge, HealthScore } from '../../components/ui/index';
import { CROPS } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';

const STAGE_COLORS = {
  'Germination': 'bg-blue-100 text-blue-700',
  'Vegetative': 'bg-cyan-100 text-cyan-700',
  'Flowering': 'bg-purple-100 text-purple-700',
  'Bulb Development': 'bg-amber-100 text-amber-700',
  'Berry Growth': 'bg-green-100 text-green-700',
};

export default function CropsPage() {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title={t('crops')}
        subtitle="Monitor health and status of all active crops"
        breadcrumb="My Crops"
      />

      <div className="grid md:grid-cols-2 gap-5">
        {CROPS.map((crop) => (
          <Link
            key={crop.id}
            to={`/farmer/crops/${crop.id}`}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover group"
          >
            <div className="flex items-start gap-4">
              <HealthScore score={crop.healthScore} size={70} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg font-display flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-green-600" />
                      {crop.name}
                    </h3>
                    <p className="text-xs text-gray-400">{crop.variety}</p>
                  </div>
                  <RiskBadge level={crop.riskLevel} />
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STAGE_COLORS[crop.stage] || 'bg-gray-100 text-gray-600'}`}>
                    {crop.stage}
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">{crop.area}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {crop.location.split(',')[0]}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Sown: {crop.sowingDate}
                  </div>
                </div>
              </div>
            </div>

            {/* NPK */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {Object.entries(crop.nutrientStatus).map(([k, v]) => (
                <div key={k} className={`rounded-xl p-2 text-center ${v === 'Good' ? 'bg-green-50' : v === 'Adequate' ? 'bg-amber-50' : 'bg-red-50'}`}>
                  <p className={`text-xs font-bold ${v === 'Good' ? 'text-green-700' : v === 'Adequate' ? 'text-amber-700' : 'text-red-700'}`}>{k}</p>
                  <p className={`text-xs ${v === 'Good' ? 'text-green-600' : v === 'Adequate' ? 'text-amber-600' : 'text-red-600'}`}>{v}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-400">Last assessed: {crop.lastAssessed}</p>
              <span className="text-green-600 text-xs font-medium flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                View Details <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
