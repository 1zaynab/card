import { useEffect, useState } from 'react';
import { Quote } from '../types/quote';
import { fetchLatestMessage } from '../utils/telegram';

export function Card() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const message = await fetchLatestMessage();
        if (message) {
          setQuote({
            id: Date.now(),
            text: message.text,
            timestamp: message.timestamp
          });
        }
      } catch (err) {
        console.error('Failed to load quote');
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
    const interval = setInterval(fetchQuote, 60000); // Check for new messages every minute
    return () => clearInterval(interval);
  }, []);

  const toggleCard = () => {
    setIsOpened(!isOpened);
  };

  return (
    <div className="card-container" onClick={toggleCard}>
      <div className={`card ${isOpened ? 'is-opened' : ''}`}>
        <div className="card-page cart-page-front">
          <div className="card-page cart-page-outside"></div>
          <div className="card-page cart-page-inside">
            <span className="cards">
              <img alt="" src="../flo1.png" />
            </span>
          </div>
        </div>
        <div className="card-page cart-page-bottom">
          {loading ? 'Loading...' : quote?.text}
        </div>
      </div>
    </div>
  );
}