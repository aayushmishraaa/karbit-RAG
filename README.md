# Karbit Chat Interface 

A modern, responsive chat interface that communicates with the Karbit RAG system via webhook.

## Features

- 🎨 Beautiful, modern UI design
- 📱 Fully responsive (mobile-friendly)
- ⚡ Real-time webhook communication
- 💬 Typing indicators and status updates
- 🔄 Automatic response parsing
- 📊 Character count and input validation
- 🚨 Error handling with user-friendly messages
- 💾 Session and user ID management
- 🌐 Online/offline status detection

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Modern web browser

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Option 1: Using http-server (recommended)
```bash
npm start
```

#### Option 2: Using live-server (with hot reload)
```bash
npm run dev
```

The application will open automatically in your default browser at `http://localhost:3000`.

### Manual Setup

If you prefer not to use Node.js, you can simply open `index.html` in your web browser directly.

## Usage

1. Open the chat interface in your browser
2. Type a message in the input field at the bottom
3. Press Enter or click the send button
4. Wait for the AI assistant to respond via the webhook
5. Continue the conversation!

## Webhook Configuration

The chat interface is configured to send messages to:
```
https://aayushmishra.app.n8n.cloud/webhook/44405750-c847-47f7-8cba-91c9e923ffc3
```

### Request Format

The application sends POST requests with the following JSON structure:
```json
{
  "message": "User's message here",
  "timestamp": "2025-10-15T10:30:00.000Z",
  "user_id": "user_abc123def",
  "session_id": "session_1697368200000_xyz789"
}
```

### Response Handling

The interface can handle various response formats:
- Simple string responses
- JSON objects with `message`, `response`, `text`, or `content` fields
- Complex nested objects (automatically extracts meaningful content)

## Customization

### Styling
- Modify `styles.css` to change colors, fonts, or layout
- Update CSS variables for quick theme changes

### Webhook URL
- Change the webhook URL in `script.js` (line 4) to point to your endpoint

### Branding
- Update the title and branding in `index.html`
- Modify the header content and colors in the CSS

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Structure

```
karbit-RAG/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── package.json        # Node.js configuration
└── README.md          # This file
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: If you encounter CORS issues, make sure your webhook endpoint supports cross-origin requests.

2. **Network Errors**: Check your internet connection and verify the webhook URL is accessible.

3. **Empty Responses**: The interface handles various response formats, but if responses appear empty, check the webhook's response structure.

4. **Styling Issues**: Clear your browser cache or try a hard refresh (Ctrl+F5).

### Error Messages

The interface provides user-friendly error messages for:
- Network connection issues
- Server errors (4xx, 5xx)
- Invalid response formats
- Timeout issues

## Development

### Adding New Features

1. Modify the HTML structure in `index.html`
2. Add corresponding styles in `styles.css`
3. Implement functionality in `script.js`

### Testing

Test the interface with different:
- Message lengths
- Response formats
- Network conditions
- Device sizes

## Deployment

### Static Hosting
Deploy the files to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Azure Static Web Apps

### Local Network
Share on your local network:
```bash
npm start
```
Then access from other devices using your local IP address.

## License

MIT License - feel free to modify and distribute as needed.

## Support

For issues or questions, please check the troubleshooting section or create an issue in the repository.

---

**Powered by Karbit RAG System**