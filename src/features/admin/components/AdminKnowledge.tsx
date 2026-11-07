import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { FileText, Send, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Markdown } from '@/features/chat/components/Markdown';
import {
  useAskGeminiAboutFile,
  useDeleteLesson,
  useListLessons,
  useUploadLesson,
} from '@/features/admin/hooks/useAdmin';

const ANALYSIS_MAX_FILE_SIZE = 10 * 1024 * 1024;
const KNOWLEDGE_MAX_FILE_SIZE = 30 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
const formatSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;

function isSupportedDocument(file: File): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return (
    ['pdf', 'txt', 'docx'].includes(extension ?? '') &&
    (!file.type || ACCEPTED_TYPES.has(file.type))
  );
}

export function AdminKnowledge() {
  const askFileInput = useRef<HTMLInputElement>(null);
  const knowledgeFileInput = useRef<HTMLInputElement>(null);
  const [askFile, setAskFile] = useState<File | null>(null);
  const [knowledgeFile, setKnowledgeFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [askValidationError, setAskValidationError] = useState('');
  const [knowledgeValidationError, setKnowledgeValidationError] = useState('');
  const lessonsQuery = useListLessons();
  const askGemini = useAskGeminiAboutFile();
  const upload = useUploadLesson();
  const remove = useDeleteLesson();

  const chooseFile = (
    event: ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    setValidationError: (message: string) => void,
    maxFileSize: number,
  ) => {
    const selected = event.target.files?.[0] ?? null;
    event.target.value = '';
    setValidationError('');
    if (!selected) return;
    if (!isSupportedDocument(selected)) {
      setValidationError('Choisissez un fichier PDF, TXT ou DOCX.');
      setFile(null);
      return;
    }
    if (selected.size > maxFileSize) {
      setValidationError(`La taille maximale par fichier est de ${maxFileSize / (1024 * 1024)} Mo.`);
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const submitQuestion = (event: FormEvent) => {
    event.preventDefault();
    if (!askFile || !question.trim()) return;
    askGemini.mutate({ file: askFile, question: question.trim() });
  };

  const submitKnowledge = (event: FormEvent) => {
    event.preventDefault();
    if (!knowledgeFile) return;
    upload.mutate(knowledgeFile, { onSuccess: () => setKnowledgeFile(null) });
  };

  return (
    <div className="space-y-5">
      <Card>
        <div>
          <h2 className="text-lg font-semibold">Poser une question sur un fichier</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Envoyez un document à Gemini pour obtenir une réponse ponctuelle. Il ne sera pas ajouté aux connaissances de l’assistant.
          </p>
        </div>
        <form onSubmit={submitQuestion} className="mt-5 space-y-4">
          <div>
            <label htmlFor="gemini-question-file" className="mb-1.5 block text-sm font-medium">
              Document à analyser (PDF, TXT ou DOCX, 10 Mo max.)
            </label>
            <input
              ref={askFileInput}
              id="gemini-question-file"
              type="file"
              accept=".pdf,.txt,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(event) => {
                askGemini.reset();
                chooseFile(event, setAskFile, setAskValidationError, ANALYSIS_MAX_FILE_SIZE);
              }}
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              className="w-full justify-start truncate sm:w-auto sm:max-w-full"
              onClick={() => askFileInput.current?.click()}
            >
              <FileText size={16} />
              <span className="truncate">{askFile ? `${askFile.name} · ${formatSize(askFile.size)}` : 'Choisir un fichier à analyser'}</span>
            </Button>
          </div>
          <div>
            <label htmlFor="gemini-file-question" className="mb-1.5 block text-sm font-medium">
              Votre question
            </label>
            <textarea
              id="gemini-file-question"
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
                askGemini.reset();
              }}
              maxLength={2000}
              rows={3}
              placeholder="Ex. : Résume les règles de priorité décrites dans ce document."
              className="w-full resize-y rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          {(askValidationError || askGemini.error) && (
            <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {askValidationError || askGemini.error?.message}
            </p>
          )}
          <Button type="submit" disabled={!askFile || !question.trim()} loading={askGemini.isPending}>
            <Send size={16} />
            Envoyer à Gemini
          </Button>
        </form>
        {askGemini.data && (
          <div className="mt-5 rounded-lg border border-border p-4" aria-live="polite">
            <h3 className="mb-3 text-sm font-semibold">Réponse de Gemini</h3>
            <Markdown content={askGemini.data} />
          </div>
        )}
      </Card>

      <Card>
        <div>
          <h2 className="text-lg font-semibold">Enrichir les connaissances de Gemini</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ajoutez des documents de référence sur le code de la route à Madagascar. Après vérification, leur contenu pourra aider Gemini à répondre aux futures questions des utilisateurs.
          </p>
        </div>
        <form onSubmit={submitKnowledge} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label htmlFor="lesson-file" className="mb-1.5 block text-sm font-medium">
              Document de référence (PDF, TXT ou DOCX, 30 Mo max.)
            </label>
            <input
              ref={knowledgeFileInput}
              id="lesson-file"
              type="file"
              accept=".pdf,.txt,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(event) => {
                upload.reset();
                chooseFile(event, setKnowledgeFile, setKnowledgeValidationError, KNOWLEDGE_MAX_FILE_SIZE);
              }}
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              className="w-full justify-start truncate"
              onClick={() => knowledgeFileInput.current?.click()}
            >
              <FileText size={16} />
              <span className="truncate">{knowledgeFile ? `${knowledgeFile.name} · ${formatSize(knowledgeFile.size)}` : 'Choisir un document de référence'}</span>
            </Button>
          </div>
          <Button type="submit" disabled={!knowledgeFile} loading={upload.isPending}>
            <Upload size={16} />
            Vérifier et ajouter aux connaissances
          </Button>
        </form>
        {(knowledgeValidationError || upload.error) && (
          <p role="alert" className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {knowledgeValidationError || upload.error?.message}
          </p>
        )}
        {upload.isSuccess && (
          <p role="status" className="mt-3 rounded-md bg-primary/10 px-3 py-2 text-sm text-foreground">
            Document vérifié et ajouté. Il pourra désormais aider Gemini à répondre aux utilisateurs.
          </p>
        )}

        <div className="mt-6 border-t border-border pt-4">
          <h3 className="text-sm font-semibold">Documents de référence disponibles</h3>
          {lessonsQuery.isPending ? (
            <p className="mt-3 text-sm text-muted-foreground">Chargement…</p>
          ) : lessonsQuery.isError ? (
            <p role="alert" className="mt-3 text-sm text-red-700">{lessonsQuery.error.message}</p>
          ) : lessonsQuery.data.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Aucun document de référence ajouté.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
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
    </div>
  );
}
