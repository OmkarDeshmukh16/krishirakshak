import { PageHeader, RiskBadge } from '../../components/ui/index';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

const ADVISORY_SECTIONS = [
  {
    title: 'Why This May Be Happening',
    icon: '🔍',
    color: 'bg-blue-50 border-blue-200',
    items: [
      'Extended high humidity levels (80%+) create ideal conditions for fungal pathogens',
      'Recent heavy rainfall (45mm in 3 days) has spread spores across the field',
      'The flowering stage makes tomato plants especially vulnerable to Early Blight infection',
      'Previous Early Blight history in 2025 means pathogen spores may persist in soil',
      'Dense canopy growth reduces air circulation and maintains moisture on leaves',
    ],
  },
  {
    title: 'What To Monitor',
    icon: '👁️',
    color: 'bg-amber-50 border-amber-200',
    items: [
      'Dark brown spots with concentric rings (target-board pattern) on lower/older leaves',
      'Yellow halos around dark spots — a key sign of Early Blight',
      'Defoliation starting from the base of the plant moving upward',
      'Stem lesions (dark, elongated) at plant collar region',
      'Fruit symptoms — dark, sunken lesions with concentric rings near stem attachment',
      'Rate of spread — monitor daily to assess if symptoms are increasing',
    ],
  },
  {
    title: 'Recommended Actions',
    icon: '✅',
    color: 'bg-green-50 border-green-200',
    items: [
      'Remove and destroy (burn or bury) all affected leaves — do not compost',
      'Avoid overhead irrigation; use drip or ground-level watering',
      'Ensure proper plant spacing to improve airflow between plants',
      'Clean and sanitize farm tools between plants to prevent spread',
      'Stake or trellis plants to keep foliage off the ground',
      'Mulch around base of plants to reduce soil splash onto leaves',
    ],
  },
  {
    title: 'Prevention for Future',
    icon: '🛡️',
    color: 'bg-purple-50 border-purple-200',
    items: [
      'Practice crop rotation — avoid tomato in the same field for 2–3 seasons',
      'Use certified, disease-resistant tomato varieties in the next season',
      'Improve field drainage to prevent waterlogging after heavy rain',
      'Regularly scout plants for early symptoms — early detection saves crops',
      'Maintain proper NPK balance — nitrogen-deficient plants are more susceptible',
      'Use clean, disease-free seeds and transplants',
    ],
  },
  {
    title: 'When To Contact An Expert',
    icon: '👨‍🔬',
    color: 'bg-red-50 border-red-200',
    items: [
      'If symptoms spread to more than 20% of the field within 3–5 days',
      'If you are unsure about the identification of the disease',
      'Before applying any chemical treatment — expert guidance ensures safe, effective use',
      'If the crop stage is critical (flowering/fruiting) and risk of loss is high',
      'If you observe new or unusual symptoms not matching known diseases',
    ],
  },
];

export default function AdvisoryPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Crop Advisory"
        subtitle="Detailed guidance for Early Blight risk on Tomato — Dindori, Nashik"
        breadcrumb="Advisory"
      />

      {/* Risk Summary */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-2xl p-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold font-display">Early Blight Risk Advisory</h2>
              <span className="bg-white/20 border border-white/30 text-white text-xs font-bold px-2.5 py-1 rounded-full">High Risk</span>
            </div>
            <p className="text-red-100 text-sm">Tomato · Green Valley Farm · Dindori, Nashik</p>
            <p className="text-red-200 text-xs mt-1">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="text-red-200 text-xs">AI Confidence</p>
            <p className="text-4xl font-bold font-display">87%</p>
          </div>
        </div>
        <div className="mt-4 bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-red-100">
          ⚠️ This advisory is based on AI assessment and environmental data. It is guidance only — not a confirmed diagnosis. Please consult an agriculture expert before making treatment decisions.
        </div>
      </div>

      {/* Advisory Sections */}
      <div className="space-y-4">
        {ADVISORY_SECTIONS.map((section) => (
          <div key={section.title} className={`${section.color} border rounded-2xl p-5`}>
            <h3 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
              <span className="text-xl">{section.icon}</span>
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-gray-200/80 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
        <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">⚖️ Important Disclaimer</h3>
        <p className="text-sm text-gray-500">
          This advisory provides general agricultural guidance based on AI analysis and environmental data. It does NOT provide specific pesticide dosage instructions. Any chemical or biological treatment decisions must be made in consultation with a certified Agriculture Expert or Krishi Vigyan Kendra (KVK). The platform is a decision-support tool — not a replacement for professional agricultural advice.
        </p>
      </div>

      {/* Contact */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
        <h3 className="font-semibold text-green-800 mb-3">📞 Need Expert Help?</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: 'Kisan Call Center', number: '1800-180-1551', tag: 'Free, 24×7' },
            { label: 'KVK Nashik', number: '0253-2320600', tag: 'Mon–Sat 9AM–5PM' },
            { label: 'Agriculture Department', number: '1551', tag: 'Maharashtra' },
          ].map((c) => (
            <div key={c.label} className="bg-white rounded-xl p-3 border border-green-200">
              <p className="text-xs text-gray-400 mb-0.5">{c.label}</p>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-green-600" />
                <p className="font-bold text-green-800 text-sm">{c.number}</p>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{c.tag}</p>
            </div>
          ))}
        </div>
        <Link to="/farmer/expert-support" className="inline-flex items-center gap-2 mt-3 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-md">
          Request Expert Through Platform →
        </Link>
      </div>
    </div>
  );
}
