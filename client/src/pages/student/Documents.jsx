import { useEffect, useState } from 'react';
import { Download, FileText, Award, Mail } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Documents = () => {
  const [docs, setDocs] = useState({ offerLetters: [], certificates: [], recommendationLetters: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/documents/my').then(({ data }) => setDocs(data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const sections = [
    { key: 'offerLetters', title: 'Offer Letters', icon: FileText, items: docs.offerLetters, label: (i) => i.courseName },
    { key: 'certificates', title: 'Certificates', icon: Award, items: docs.certificates, label: (i) => i.courseName },
    { key: 'recommendationLetters', title: 'Recommendation Letters', icon: Mail, items: docs.recommendationLetters, label: (i) => i.courseName },
  ];

  const hasAny = sections.some((s) => s.items?.length > 0);

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">My Documents</h2>
      {!hasAny ? (
        <div className="glass-card p-12 text-center text-slate-500">
          No documents available yet. Documents appear after enrollment approval.
        </div>
      ) : (
        <div className="space-y-8">
          {sections.map((section) => section.items?.length > 0 && (
            <div key={section.key}>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <section.icon className="w-5 h-5 text-brand-600" /> {section.title}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {section.items.map((item, idx) => (
                  <div key={idx} className="glass-card p-5 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{section.label(item)}</p>
                      {item.certificateId && <p className="text-xs text-slate-500">{item.certificateId}</p>}
                      {item.internshipId && <p className="text-xs text-slate-500">{item.internshipId}</p>}
                    </div>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noreferrer" className="btn-primary text-sm py-2">
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;
