/** Lightweight test double for MemoizedMarkdown — renders plain text, no ESM deps. */
export const MemoizedMarkdown = ({
  content,
}: {
  content: string;
  id: string;
}) => <span data-testid="memoized-markdown">{content}</span>;
