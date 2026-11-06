import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

const components: Components = {
  h1: ({ children }) => <h2 className="text-lg font-semibold leading-tight text-stone-900">{children}</h2>,
  h2: ({ children }) => <h3 className="text-base font-semibold leading-tight text-stone-900">{children}</h3>,
  h3: ({ children }) => <h4 className="text-sm font-semibold leading-tight text-stone-900">{children}</h4>,
  ul: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5">{children}</ol>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-teal-700 underline underline-offset-2 hover:text-teal-900"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="rounded-r-lg border-l-4 border-amber-400 bg-amber-50 py-2 pl-4 pr-3 text-stone-700">
      {children}
    </blockquote>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-lg bg-stone-900 p-3 text-sm text-stone-100 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-stone-100">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[0.85em] text-teal-800">{children}</code>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-stone-200 bg-stone-50 px-3 py-2 font-semibold text-stone-900">{children}</th>
  ),
  td: ({ children }) => <td className="border border-stone-200 px-3 py-2 align-top">{children}</td>,
};

export function Markdown({ content }: { content: string }) {
  return (
    <div className="space-y-4 break-words text-[15px] leading-normal text-stone-800">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
