# Karbit Chat Interface

A stylish chat interface that sends messages to an N8N webhook and displays responses.

## 🚀 Live Demo
Deploy this to GitHub Pages for the best experience!

## 🔧 Setup Instructions

### Option 1: Fix N8N Webhook CORS (Recommended)
1. Go to your N8N workflow editor
2. Find your webhook node
3. Add a "Set Headers" node before your response
4. Add these headers:
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: POST, GET, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Accept
   ```

### Option 2: Deploy to a Server with Backend Proxy
Create a simple backend proxy that forwards requests to your N8N webhook.

### Option 3: Use the Built-in CORS Proxy (Current Implementation)
The code now automatically tries multiple methods:
1. Direct request to your webhook
2. Fallback to CORS proxy if direct request fails

## 📁 Files
- `index.html` - Main chat interface
- `styles.css` - Styling and animations
- `script.js` - Main functionality
- `config.js` - Configuration settings

## 🛠️ Configuration
Edit `config.js` to:
- Update your webhook URL
- Set your GitHub Pages URL
- Enable/disable debug mode
- Configure retry settings

## 🎨 Features
- Modern, responsive design
- Real-time message display
- Typing indicators
- Error handling with helpful messages
- Session management
- Character counting
- Auto-resizing text input

## 🌐 Deployment
1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. Visit your GitHub Pages URL
4. The chat interface will automatically handle CORS issues

## 🐛 Troubleshooting
- Check browser console (F12) for detailed error logs
- Verify your webhook URL is correct in `config.js`
- Test your webhook directly with curl/Postman
- Ensure your N8N workflow is active and accessible

## 📝 Webhook Response Format
Your N8N webhook can return:
- Plain text: `"Hello there!"`
- JSON with message field: `{"message": "Hello there!"}`
- JSON with other fields: `{"output": "Hello there!"}`, `{"text": "Hello there!"}`, etc.

