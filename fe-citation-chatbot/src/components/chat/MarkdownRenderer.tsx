import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Destination } from '../../types';

interface MarkdownRendererProps {
  content: string;
  sources: Destination[];
  onCitationClick: (destination: Destination) => void;
}

export function MarkdownRenderer({ content, sources, onCitationClick }: MarkdownRendererProps) {
  const sourceMap = React.useMemo(() => {
    const map = new Map<string, Destination>();
    sources.forEach(source => {
      map.set(source.id, source);
    });
    return map;
  }, [sources]);

  return (
    <div className="prose prose-gray max-w-none">
      <ReactMarkdown
        urlTransform={(url) => url}
        components={{
          a: ({ href, children }) => {
            if (href?.startsWith('#')) {
              const id = href.slice(1);
              const destination = sourceMap.get(id);

              if (destination) {
                return (
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      onCitationClick(destination);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium underline decoration-dotted underline-offset-2 hover:decoration-solid transition-all cursor-pointer"
                  >
                    {children}
                  </a>
                );
              }
            }

            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
