import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { FileText, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useDeleteLesson, useListLessons, useUploadLesson } from '@/features/admin/hooks/useAdmin';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const formatSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;

export function AdminKnowledge() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState('');
  const lessonsQuery = useListLessons();
  const upload = useUploadLesson();
  const remove = useDeleteLesson();

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    event.target.value = '';
    setValidationError('');
    if (!selected) return;
    if (!/\.(pdf|txt)$/i.test(selected.name) || !['application/pdf', 'text/plain'].includes(selected.type)) {
      setValidationError('Seuls les fichiers PDF et TXT sont acceptés.');
      setFile(null);
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setValidationError('La taille maximale par fichier est de 10 Mo.');
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!file) return;
    upload.mutate(file, { onSuccess: () => setFile(null) });
  };

  return (
    <Card>
      <div>
        <h2 className="text-lg font-semibold">Base de connaissances</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajoutez des leçons de code de la route à Madagascar. Gemini vérifie le sujet avant de les rendre accessibles aux réponses.
        </p>
      </div>

      <form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="lesson-file" className="mb-1.5 block text-sm font-medium">Leçon PDF ou TXT (10 Mo max.)</label>
          <input
            ref={fileInput}
            id="lesson-file"
            type="file"
            accept=".pdf,.txt,application/pdf,text/plain"
            onChange={handleFile}
            className="hidden"
          />
          <Button type="button" variant="secondary" className="w-full justify-start truncate" onClick={() => fileInput.current?.click()}>
            <FileText size={16} />
            <span className="truncate">{file ? `${file.name} · ${formatSize(file.size)}` : 'Choisir un fichier'}</span>
          </Button>
        </div>
        <Button type="submit" disabled={!file} loading={upload.isPending}>
          <Upload size={16} />
          Vérifier et ajouter
        </Button>
      </form>

      {(validationError || upload.error) && (
        <p role="alert" className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {validationError || upload.error?.message}
        </p>
      )}
      {upload.isSuccess && (
        <p role="status" className="mt-3 rounded-md bg-primary/10 px-3 py-2 text-sm text-foreground">
          Leçon vérifiée et ajoutée à la base de connaissances.
        </p>
      )}

      <div className="mt-6 border-t pt-4">
        <h3 className="text-sm font-semibold">Leçons disponibles</h3>
        {lessonsQuery.isPending ? (
          <p className="mt-3 text-sm text-muted-foreground">Chargement…</p>
        ) : lessonsQuery.isError ? (
          <p role="alert" className="mt-3 text-sm text-red-700">{lessonsQuery.error.message}</p>
        ) : lessonsQuery.data.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Aucune leçon téléversée.</p>
        ) : (
          <ul className="mt-3 divide-y">
            {lessonsQuery.data.map((lesson) => (
              <li key={lesson.id} className="flex items-center gap-3 py-3">
                <FileText size={17} className="shrink-0 text-primary" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{lesson.originalName}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{formatSize(lesson.fileSize)}</span>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label={`Supprimer ${lesson.originalName}`}
                  disabled={remove.isPending}
                  onClick={() => remove.mutate(lesson.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </li>
            ))}
          </ul>
        )}
        {remove.error && <p role="alert" className="mt-2 text-sm text-red-700">{remove.error.message}</p>}
      </div>
    </Card>
  );
}
