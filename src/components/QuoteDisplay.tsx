import { useEffect, useState } from 'react';
import { Quote } from '../types/quote';
import { Quote as QuoteIcon } from 'lucide-react';

export function QuoteDisplay() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('/src/data/quotes.json');
        const data = await response.json();
        const latestQuote = data.quotes[data.quotes.length - 1];
        setQuote(latestQuote);
      } catch (err) {
        setError('Failed to load quote');
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
    // Refresh quote every minute
    const interval = setInterval(fetchQuote, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
      <QuoteIcon className="absolute -top-4 -left-4 h-8 w-8 text-blue-500" />
      <blockquote className="text-xl font-serif italic text-gray-800 mb-4">
        {quote?.text}
      </blockquote>
      <div className="text-sm text-gray-500">
        Last updated: {new Date(quote?.timestamp || '').toLocaleString()}
      </div>
    </div>
  );
}