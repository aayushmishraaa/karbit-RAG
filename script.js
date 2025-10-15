// Chat Interface JavaScript
class ChatInterface {
    constructor() {
        this.webhookUrl = 'https://aayushmishra.app.n8n.cloud/webhook/44405750-c847-47f7-8cba-91c9e923ffc3';
        this.initializeElements();
        this.bindEvents();
        this.initializeChat();
    }

    initializeElements() {
        this.messagesContainer = document.getElementById('messages-container');
        this.messageInput = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-button');
        this.typingIndicator = document.getElementById('typing-indicator');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.errorToast = document.getElementById('error-toast');
        this.errorMessage = document.getElementById('error-message');
        this.charCount = document.getElementById('char-count');
    }

    bindEvents() {
        // Send message on button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Send message on Enter key press
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Update character count and send button state
        this.messageInput.addEventListener('input', () => {
            this.updateCharCount();
            this.updateSendButtonState();
        });

        // Focus input on page load
        this.messageInput.addEventListener('focus', () => {
            this.scrollToBottom();
        });
    }

    initializeChat() {
        this.messageInput.focus();
        this.updateSendButtonState();
        console.log('Chat interface initialized');
    }

    updateCharCount() {
        const length = this.messageInput.value.length;
        this.charCount.textContent = `${length} / 1000`;
        
        if (length > 800) {
            this.charCount.style.color = '#ef4444';
        } else if (length > 600) {
            this.charCount.style.color = '#f59e0b';
        } else {
            this.charCount.style.color = '#94a3b8';
        }
    }

    updateSendButtonState() {
        const message = this.messageInput.value.trim();
        this.sendButton.disabled = !message || message.length === 0;
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        try {
            // Clear input and disable send button
            this.messageInput.value = '';
            this.updateCharCount();
            this.updateSendButtonState();

            // Remove welcome message if it exists
            this.removeWelcomeMessage();

            // Add user message to chat
            this.addMessage(message, 'user');

            // Show typing indicator
            this.showTypingIndicator();

            // Send message to webhook
            const response = await this.sendToWebhook(message);

            // Hide typing indicator
            this.hideTypingIndicator();

            // Process and display response
            this.handleWebhookResponse(response);

        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            this.showError('Failed to send message. Please check your connection and try again.');
        } finally {
            this.messageInput.focus();
        }
    }

    async sendToWebhook(message) {
        const requestBody = {
            message: message,
            timestamp: new Date().toISOString(),
            user_id: this.generateUserId(),
            session_id: this.getSessionId()
        };

        const response = await fetch(this.webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    }

    handleWebhookResponse(response) {
        try {
            let assistantMessage = '';

            // Handle different response formats
            if (typeof response === 'string') {
                assistantMessage = response;
            } else if (response.message) {
                assistantMessage = response.message;
            } else if (response.response) {
                assistantMessage = response.response;
            } else if (response.text) {
                assistantMessage = response.text;
            } else if (response.content) {
                assistantMessage = response.content;
            } else {
                // If response is an object, try to extract meaningful content
                assistantMessage = this.extractMessageFromObject(response);
            }

            // Clean and format the message
            assistantMessage = this.cleanMessage(assistantMessage);

            if (assistantMessage) {
                this.addMessage(assistantMessage, 'assistant');
            } else {
                this.showError('Received an empty response from the server.');
            }

        } catch (error) {
            console.error('Error processing response:', error);
            this.showError('Failed to process the response. Please try again.');
        }
    }

    extractMessageFromObject(obj) {
        // Try to find a message in nested objects
        const possibleKeys = ['message', 'response', 'text', 'content', 'data', 'result', 'output'];
        
        for (const key of possibleKeys) {
            if (obj[key] && typeof obj[key] === 'string') {
                return obj[key];
            }
        }

        // If no string found, stringify the object (last resort)
        return JSON.stringify(obj, null, 2);
    }

    cleanMessage(message) {
        if (typeof message !== 'string') {
            return String(message);
        }

        // Remove excessive whitespace
        return message.trim().replace(/\s+/g, ' ');
    }

    addMessage(content, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);

        const bubble = document.createElement('div');
        bubble.classList.add('message-bubble');
        bubble.textContent = content;

        const time = document.createElement('div');
        time.classList.add('message-time');
        time.textContent = this.getCurrentTime();

        messageElement.appendChild(bubble);
        messageElement.appendChild(time);

        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    removeWelcomeMessage() {
        const welcomeMessage = this.messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorToast.style.display = 'flex';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideErrorToast();
        }, 5000);
    }

    hideErrorToast() {
        this.errorToast.style.display = 'none';
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    generateUserId() {
        // Generate a simple user ID for this session
        if (!localStorage.getItem('chat_user_id')) {
            const userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chat_user_id', userId);
        }
        return localStorage.getItem('chat_user_id');
    }

    getSessionId() {
        // Generate a session ID for this chat session
        if (!this.sessionId) {
            this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        return this.sessionId;
    }
}

// Global function for closing error toast
function hideErrorToast() {
    document.getElementById('error-toast').style.display = 'none';
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Karbit Chat Interface...');
    window.chatInterface = new ChatInterface();
});

// Handle online/offline status
window.addEventListener('online', () => {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    statusDot.className = 'status-dot online';
    statusText.textContent = 'Online';
});

window.addEventListener('offline', () => {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    statusDot.className = 'status-dot offline';
    statusText.textContent = 'Offline';
});

// Add offline status styles
const style = document.createElement('style');
style.textContent = `
    .status-dot.offline {
        background: #ef4444;
    }
`;
document.head.appendChild(style);