export interface Destination {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  bestTime: string;
  imageUrl: string;
  country: string;
  averageCost?: string;
  language?: string;
  currency?: string;
}

export interface ChatResponse {
  message: string;
  sources: Destination[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Destination[];
  timestamp: Date;
}
