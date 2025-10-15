// Configuration file for the chat interface
const CONFIG = {
    // Your original webhook URL
    WEBHOOK_URL: 'https://aayushmishra.app.n8n.cloud/webhook-test/44405750-c847-47f7-8cba-91c9e923ffc3',
    
    // Alternative CORS proxy URLs (try these if the main webhook doesn't work)
    CORS_PROXIES: [
        'https://api.allorigins.win/raw?url=',
        'https://cors-anywhere.herokuapp.com/',
        'https://thingproxy.freeboard.io/fetch/'
    ],
    
    // Retry settings
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // milliseconds
    
    // GitHub Pages URL (update this with your actual GitHub Pages URL)
    GITHUB_PAGES_URL: 'https://aayushmishraaa.github.io/karbit-RAG',
    
    // Debug mode
    DEBUG: true
};

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}