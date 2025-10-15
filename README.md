# Karbit RAG Chat Interface

A modern, responsive chat interface for the Karbit RAG (Retrieval-Augmented Generation) system. This application provides a beautiful, real-time chat experience that connects to your n8n webhook for NDIS-related queries and assistance.

![Chat Interface Preview](https://img.shields.io/badge/Status-Active-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-v14+-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🎨 **Modern Design**
- Beautiful gradient backgrounds with glassmorphism effects
- Responsive design that works on desktop, tablet, and mobile
- Smooth animations and transitions
- Professional color scheme with purple/blue gradients

### 💬 **Chat Experience**
- Real-time typing indicators with animated dots
- Message timestamps for conversation tracking
- Distinct user and bot avatars
- Typing animation effects for bot responses
- Rich text formatting support (bold, italic, code, links)

### 🔧 **Technical Features**
- **Webhook Integration**: Direct connection to n8n workflows
- **CORS Handling**: Built-in proxy server to handle cross-origin requests
- **Automatic Fallback**: Production → Test webhook fallback system
- **Error Handling**: Comprehensive error messages with helpful suggestions
- **Session Tracking**: Unique user IDs for conversation continuity

### 🛡️ **Reliability**
- Robust error handling for network issues
- Automatic retry mechanisms
- Clear status indicators and connection testing
- Detailed logging for debugging

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Active n8n workflow with webhook

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aayushmishraaa/karbit-RAG.git
   cd karbit-RAG
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your webhook**
   - Update the webhook URL in `server.js` if needed
   - Ensure your n8n workflow is active

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
karbit-RAG/
├── index.html          # Main HTML structure
├── styles.css          # Modern CSS styling with animations
├── script.js           # Client-side JavaScript functionality
├── server.js           # Node.js proxy server
├── package.json        # Node.js dependencies and scripts
├── .gitignore          # Git ignore rules
└── README.md           # Project documentation
```

## 🔧 Configuration

### Webhook URLs
The application supports both production and test webhooks:

- **Production**: `https://aayushmishra.app.n8n.cloud/webhook/[webhook-id]`
- **Test**: `https://aayushmishra.app.n8n.cloud/webhook-test/[webhook-id]`

### Environment Setup
Update the webhook URLs in `server.js`:

```javascript
const WEBHOOK_URL_PRODUCTION = 'your-production-webhook-url';
const WEBHOOK_URL_TEST = 'your-test-webhook-url';
```

## 🎯 Usage

### Basic Chat
1. Type your message in the input field
2. Press Enter or click the send button
3. Wait for the AI response with typing animation

### Test Connection
- Click the "Test Connection" button to verify webhook connectivity
- The system will automatically try different webhook endpoints
- Clear error messages guide you to fix any issues

### Keyboard Shortcuts
- **Enter**: Send message
- **Escape**: Clear input field
- **Click anywhere**: Focus input (for better UX)

## 🔗 API Integration

### Webhook Payload Format
```json
{
  "message": "User's question or input",
  "timestamp": "2025-10-15T10:30:00.000Z",
  "user_id": "unique_user_identifier"
}
```

### Expected Response Format
The webhook can return responses in various formats:

```json
{
  "output": "AI response text"
}
```

Or:
```json
{
  "response": "AI response text",
  "message": "Alternative response field",
  "text": "Another supported field"
}
```

## 🛠️ Development

### Running in Development Mode
```bash
npm start
```

### Project Dependencies
- **express**: Web server framework
- **cors**: Cross-origin resource sharing
- **node-fetch**: HTTP request library

### Adding Features
1. **Client-side**: Edit `script.js` for frontend functionality
2. **Styling**: Modify `styles.css` for visual changes
3. **Server-side**: Update `server.js` for backend logic

## 🔍 Troubleshooting

### Common Issues

**"Failed to send message" Error**
- Ensure your n8n workflow is active
- Check webhook URLs are correct
- Verify internet connectivity

**Webhook 404 Error**
- Activate your n8n workflow using the toggle switch
- Check if webhook URL is correctly configured
- Use test webhook for development

**CORS Issues**
- The built-in proxy server handles CORS automatically
- Ensure server is running on the correct port

### Debug Mode
Open browser console (F12) to see detailed logs:
- Request/response details
- Webhook URL being used
- Error messages and suggestions

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Look at browser console for error details
3. Ensure your n8n workflow is properly configured and active
4. Open an issue on GitHub with detailed information

## 🙏 Acknowledgments

- Built with modern web technologies
- Integrated with n8n workflow automation
- Designed for NDIS assistance and support

---

**Made with ❤️ for better NDIS assistance**