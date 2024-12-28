// telegram.ts
const DEFAULT_MESSAGE = {
  text: "Please configure your Telegram bot token to see live messages",
  timestamp: new Date().toISOString()
};

export async function fetchLatestMessage() {
  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  
  if (!botToken) {
    console.warn('Telegram bot token not configured');
    return DEFAULT_MESSAGE;
  }

  try {
    // Add limit=1 and offset=-1 to get only the most recent message
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?limit=1&offset=-1`);
    const data = await response.json();
    
    if (!data.ok || !data.result?.length) {
      return DEFAULT_MESSAGE;
    }

    // Get the latest message
    const latestMessage = data.result[0];
    const messageContent = latestMessage.message || latestMessage.channel_post;

    // If no valid message is found, try clearing old updates
    if (!messageContent || !messageContent.text) {
      // Get the latest update_id and clear all updates up to that point
      const clearResponse = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${latestMessage.update_id + 1}`);
      return DEFAULT_MESSAGE;
    }

    return {
      text: messageContent.text,
      timestamp: new Date(messageContent.date * 1000).toISOString()
    };
  } catch (error) {
    console.error('Error fetching Telegram message:', error);
    return DEFAULT_MESSAGE;
  }
}