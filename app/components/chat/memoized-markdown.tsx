"use client";

/**
 * Streaming-safe memoized markdown renderer.
 *
 * Strategy (per Vercel AI SDK cookbook):
 *  1. `marked.lexer` splits the raw markdown string into top-level blocks.
 *  2. Each block is wrapped in a `React.memo` component keyed by its content,
 *     so only newly-changed blocks re-render during streaming.
 *  3. `react-markdown` + `remark-gfm` render each block to styled HTML.
 *
 * Using `react-markdown` in a "use client" component avoids the Next.js 15
 * server-component SSR issue (document-is-not-defined).
 */

import { marked } from "marked";
import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function parseMarkdownIntoBlocks(markdown: string): string[] {
  try {
    const tokens = marked.lexer(markdown);
    return tokens.map((token) => token.raw);
  } catch {
    return [markdown];
  }
}

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    try {
      return (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="mb-2 mt-5 text-xl font-semibold leading-snug text-gray-900 first:mt-0">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="mb-2 mt-4 text-lg font-semibold leading-snug text-gray-900 first:mt-0">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="mb-1 mt-3 font-semibold leading-snug text-gray-900 first:mt-0">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-2 leading-relaxed last:mb-0">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="mb-2 ml-5 list-disc space-y-0.5 last:mb-0">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-2 ml-5 list-decimal space-y-0.5 last:mb-0">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="my-2 border-l-4 border-gray-300 pl-4 italic text-gray-600">
                {children}
              </blockquote>
            ),
            code: ({ children, className }) => {
              const isBlock = Boolean(className);
              if (isBlock) {
                return (
                  <code className={`${className ?? ""} text-sm`}>
                    {children}
                  </code>
                );
              }
              return (
                <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800">
                  {children}
                </code>
              );
            },
            pre: ({ children }) => (
              <pre className="my-2 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-sm text-gray-800">
                {children}
              </pre>
            ),
            table: ({ children }) => (
              <div className="my-2 overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 text-sm">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-50">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-200 px-3 py-2 text-gray-700">
                {children}
              </td>
            ),
            hr: () => <hr className="my-4 border-gray-200" />,
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 underline underline-offset-2 hover:text-green-900"
              >
                {children}
              </a>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900">{children}</strong>
            ),
            em: ({ children }) => <em className="italic">{children}</em>,
          }}
        >
          {content}
        </ReactMarkdown>
      );
    } catch (err) {
      console.error("[memoized-markdown] ReactMarkdown render error:", err);
      return <span className="whitespace-pre-wrap">{content}</span>;
    }
  },
  (prev, next) => prev.content === next.content,
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);
    return (
      <>
        {blocks.map((block, index) => (
          <MemoizedMarkdownBlock
            content={block}
            key={`${id}-block_${index}`}
          />
        ))}
      </>
    );
  },
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";
