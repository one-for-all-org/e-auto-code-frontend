import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Clipboard, Edit, FileText, Save, Send, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Markdown } from '@/features/chat/components/Markdown';
import {
  useAskGeminiAboutFile,
  useDeleteLesson,
  useListLessons,
  useUploadLesson,
  useUpdateLesson,
} from '@/features/admin/hooks/useAdmin';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const askFileInput = useRef<HTMLInputElement>(null);
  const knowledgeFileInput = useRef<HTMLInputElement>(null);
  const [askFile, setAskFile] = useState<File | null>(null);
  const [knowledgeFile, setKnowledgeFile] = useState<File | null>(null);
  const [resourceUrl, setResourceUrl] = useState('');
  const [question, setQuestion] = useState('');
  const [askValidationError, setAskValidationError] = useState('');
  const [knowledgeValidationError, setKnowledgeValidationError] = useState('');
  const lessonsQuery = useListLessons();
  const askGemini = useAskGeminiAboutFile();
  const upload = useUploadLesson();
  const update = useUpdateLesson();
  const remove = useDeleteLesson();

  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const editFileInput = useRef<HTMLInputElement>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editResourceUrl, setEditResourceUrl] = useState('');
  const [editValidationError, setEditValidationError] = useState('');

  const chooseEditFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    event.target.value = '';
    setEditValidationError('');
    if (!selected) return;
    if (!isSupportedDocument(selected)) {
      setEditValidationError(t('common.admin.knowledge.fileTypes'));
      setEditFile(null);
      return;
    }
    if (selected.size > KNOWLEDGE_MAX_FILE_SIZE) {
      setEditValidationError(t('common.admin.knowledge.fileSize', { size: KNOWLEDGE_MAX_FILE_SIZE / (1024 * 1024) }));
      setEditFile(null);
      return;
    }
    setEditFile(selected);
  };

  const startEdit = (lesson: NonNullable<typeof lessonsQuery.data>[number]) => {
    setEditFile(null);
    setEditResourceUrl(lesson.resourceUrl ?? '');
    setEditValidationError('');
    setEditingLessonId(lesson.id);
  };

  const cancelEdit = () => {
    setEditingLessonId(null);
    setEditFile(null);
    setEditResourceUrl('');
    setEditValidationError('');
  };

  const submitEdit = (event: FormEvent) => {
    event.preventDefault();
    if (!editFile && !editResourceUrl.trim()) {
      setEditValidationError(t('common.admin.knowledge.resourceRequired'));
      return;
    }
    if (!editingLessonId) return;
    update.mutate(
      { lessonId: editingLessonId, file: editFile ?? undefined, resourceUrl: editResourceUrl.trim() || undefined },
      {
        onSuccess: () => {
          setEditingLessonId(null);
          setEditFile(null);
          setEditResourceUrl('');
          setEditValidationError('');
        },
        onError: (error: Error) => {
          setEditValidationError(error.message);
        },
      },
    );
  };

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
      setValidationError(t('common.admin.knowledge.fileTypes'));
      setFile(null);
      return;
    }
    if (selected.size > maxFileSize) {
      setValidationError(t('common.admin.knowledge.fileSize', { size: maxFileSize / (1024 * 1024) }));
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
    upload.mutate({ file: knowledgeFile, resourceUrl: resourceUrl.trim() || undefined }, { onSuccess: () => { setKnowledgeFile(null); setResourceUrl(''); } });
  };

  const copyResource = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="space-y-5">
      <Card>
        <div>
          <h2 className="text-lg font-semibold">{t('common.admin.knowledge.askTitle')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('common.admin.knowledge.askSubtitle')}
          </p>
        </div>
        <form onSubmit={submitQuestion} className="mt-5 space-y-4">
          <div>
            <label htmlFor="gemini-question-file" className="mb-1.5 block text-sm font-medium">
              {t('common.admin.knowledge.analyzeLabel')}
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
              <span className="truncate">{askFile ? `${askFile.name} · ${formatSize(askFile.size)}` : t('common.admin.knowledge.chooseAnalyze')}</span>
            </Button>
          </div>
          <div>
            <label htmlFor="gemini-file-question" className="mb-1.5 block text-sm font-medium">
              {t('common.admin.knowledge.question')}
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
              placeholder={t('common.admin.knowledge.questionPlaceholder')}
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
            {t('common.admin.knowledge.sendGemini')}
          </Button>
        </form>
        {askGemini.data && (
          <div className="mt-5 rounded-lg border border-border p-4" aria-live="polite">
            <h3 className="mb-3 text-sm font-semibold">{t('common.admin.knowledge.geminiAnswer')}</h3>
            <Markdown content={askGemini.data} />
          </div>
        )}
      </Card>

      <Card>
        <div>
          <h2 className="text-lg font-semibold">{t('common.admin.knowledge.addTitle')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('common.admin.knowledge.addSubtitle')}
          </p>
        </div>
        <form onSubmit={submitKnowledge} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label htmlFor="lesson-file" className="mb-1.5 block text-sm font-medium">
              {t('common.admin.knowledge.referenceLabel')}
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
              <span className="truncate">{knowledgeFile ? `${knowledgeFile.name} · ${formatSize(knowledgeFile.size)}` : t('common.admin.knowledge.chooseReference')}</span>
            </Button>
          </div>
          <div className="min-w-0 flex-1">
            <label htmlFor="lesson-resource-url" className="mb-1.5 block text-sm font-medium">
              {t('common.admin.knowledge.resourceUrlLabel')}
            </label>
            <input
              id="lesson-resource-url"
              type="url"
              value={resourceUrl}
              onChange={(event) => setResourceUrl(event.target.value)}
              placeholder={t('common.admin.knowledge.resourceUrlPlaceholder')}
              className="w-full resize-none rounded-md border border-input bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button type="submit" disabled={!knowledgeFile} loading={upload.isPending}>
            <Upload size={16} />
            {t('common.admin.knowledge.addKnowledge')}
          </Button>
        </form>
        {(knowledgeValidationError || upload.error) && (
          <p role="alert" className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {knowledgeValidationError || upload.error?.message}
          </p>
        )}
        {upload.isSuccess && (
          <p role="status" className="mt-3 rounded-md bg-primary/10 px-3 py-2 text-sm text-foreground">
            {t('common.admin.knowledge.added')}
          </p>
        )}

        <div className="mt-6 border-t border-border pt-4">
          <h3 className="text-sm font-semibold">{t('common.admin.knowledge.available')}</h3>
          {lessonsQuery.isPending ? (
            <p className="mt-3 text-sm text-muted-foreground">{t('common.actions.loading')}</p>
          ) : lessonsQuery.isError ? (
            <p role="alert" className="mt-3 text-sm text-red-700">{lessonsQuery.error.message}</p>
          ) : lessonsQuery.data.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">{t('common.admin.knowledge.empty')}</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {lessonsQuery.data.map((lesson) => {
                const isEditing = editingLessonId === lesson.id;
                if (isEditing) {
                  return (
                    <li key={lesson.id} className="flex flex-col sm:flex-row sm:items-start gap-3 py-3">
                      <FileText size={17} className="shrink-0 text-primary mt-0.5" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">
                            {t('common.admin.knowledge.replaceFileLabel')}
                          </label>
                          <input
                            ref={editFileInput}
                            type="file"
                            accept=".pdf,.txt,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={chooseEditFile}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => editFileInput.current?.click()}
                          >
                            {editFile ? `${editFile.name} · ${formatSize(editFile.size)}` : t('common.actions.edit')}
                          </Button>
                        </div>
                        <div>
                          <label htmlFor={`edit-resource-url-${lesson.id}`} className="mb-1 block text-xs font-medium text-muted-foreground">
                            {t('common.admin.knowledge.resourceUrlLabel')}
                          </label>
                          <input
                            id={`edit-resource-url-${lesson.id}`}
                            type="url"
                            value={editResourceUrl}
                            onChange={(event) => setEditResourceUrl(event.target.value)}
                            placeholder={t('common.admin.knowledge.resourceUrlPlaceholder')}
                            className="w-full resize-none rounded-md border border-input bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          />
                        </div>
                        {editValidationError && (
                          <p role="alert" className="text-xs text-red-700">{editValidationError}</p>
                        )}
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={(event) => submitEdit(event as unknown as FormEvent)}
                            disabled={update.isPending}
                            loading={update.isPending}
                          >
                            <Save size={14} />
                            {t('common.actions.save')}
                          </Button>
                          <Button type="button" variant="ghost" onClick={cancelEdit} size="sm">
                            {t('common.actions.cancel')}
                          </Button>
                        </div>
                      </div>
                    </li>
                  );
                }
                return (
                  <li key={lesson.id} className="flex flex-col sm:flex-row sm:items-center gap-3 py-3">
                    <FileText size={17} className="shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{lesson.originalName}</span>
                      {lesson.resourceUrl ? (
                        <div className="mt-1 flex items-center gap-2">
                          <span className="shrink-0 truncate text-xs text-muted-foreground">{lesson.resourceUrl}</span>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => copyResource(lesson.resourceUrl as string)}
                            title={t('common.actions.copy')}
                          >
                            <Clipboard size={14} />
                          </Button>
                        </div>
                      ) : null}
                      {!lesson.resourceUrl && (
                        <span className="text-xs text-muted-foreground">{t('common.admin.knowledge.noResourceUrl')}</span>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatSize(lesson.fileSize)}</span>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => startEdit(lesson)}
                        title={t('common.actions.edit')}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label={t('common.admin.knowledge.deleteDocument', { name: lesson.originalName })}
                        disabled={remove.isPending}
                        onClick={() => remove.mutate(lesson.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {remove.error && <p role="alert" className="mt-2 text-sm text-red-700">{remove.error.message}</p>}
        </div>
      </Card>
    </div>
  );
}
