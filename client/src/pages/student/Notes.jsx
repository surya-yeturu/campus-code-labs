import { useEffect, useState } from 'react';
import { Download, ExternalLink, BookOpen } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notes/my').then(({ data }) => setNotes(data.data || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Learning Notes</h2>
      {notes.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No notes assigned yet for your internship program.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note._id} className="glass-card p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">{note.title}</h3>
                <p className="text-sm text-slate-500">{note.course?.title}</p>
              </div>
              <div className="flex gap-2">
                {note.fileUrl && (
                  <a href={note.fileUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm py-2">
                    <Download className="w-4 h-4" /> Download
                  </a>
                )}
                {note.linkUrl && (
                  <a href={note.linkUrl} target="_blank" rel="noreferrer" className="btn-outline text-sm py-2">
                    <ExternalLink className="w-4 h-4" /> Open Link
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
