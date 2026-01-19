import { User, Bot } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MarkdownRenderer } from './MarkdownRenderer';
import type { ChatMessage as ChatMessageType, Destination } from '../../types';

interface ChatMessageProps {
  message: ChatMessageType;
  onCitationClick: (destination: Destination) => void;
}

export function ChatMessage({ message, onCitationClick }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        "flex gap-3 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "bg-white" : "bg-gray-50"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-blue-600" : "bg-gradient-to-br from-purple-500 to-pink-500"
        )}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-900">
            {isUser ? 'You' : 'Travel Assistant'}
          </span>
          <span className="text-xs text-gray-400">
            {formatTime(message.timestamp)}
          </span>
        </div>

        <div className="prose prose-sm max-w-none">
          {isUser ? (
            <p className="text-gray-700">{message.content}</p>
          ) : (
            <MarkdownRenderer
              content={message.content}
              sources={message.sources || []}
              onCitationClick={onCitationClick}
            />
          )}
        </div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
              Sources ({message.sources.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => onCitationClick(source)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  {source.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
