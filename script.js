class ChatInterface {
    constructor() {
        this.webhookUrl = 'https://aayushmishra.app.n8n.cloud/webhook/44405750-c847-47f7-8cba-91c9e923ffc3';
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.characterCount = document.getElementById('characterCount');
        
        this.isWaiting = false;
        this.init();
    }

    init() {
        // Event listeners
        this.messageInput.addEventListener('input', this.handleInputChange.bind(this));
        this.messageInput.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.sendButton.addEventListener('click', this.sendMessage.bind(this));
        
        // Auto-resize textarea
        this.messageInput.addEventListener('input', this.autoResizeTextarea.bind(this));
        
        // Focus on input when page loads
        this.messageInput.focus();
        
        // Remove welcome message when first message is sent
        this.firstMessage = true;
    }

    handleInputChange() {
        const message = this.messageInput.value.trim();
        const length = this.messageInput.value.length;
        
        // Update character count
        this.characterCount.textContent = `${length}/2000`;
        
        // Enable/disable send button
        this.sendButton.disabled = !message || this.isWaiting;
        
        // Update character count color
        if (length > 1800) {
            this.characterCount.style.color = '#ef4444';
        } else if (length > 1500) {
            this.characterCount.style.color = '#f59e0b';
        } else {
            this.characterCount.style.color = '#64748b';
        }
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!this.sendButton.disabled) {
                this.sendMessage();
            }
        }
    }

    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isWaiting) return;

        // Remove welcome message on first send
        if (this.firstMessage) {
            const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
            if (welcomeMessage) {
                welcomeMessage.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => welcomeMessage.remove(), 300);
            }
            this.firstMessage = false;
        }

        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input and disable send button
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        this.handleInputChange();
        this.isWaiting = true;
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Send message to webhook
            const response = await this.sendToWebhook(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add assistant response
            console.log('Processing response:', response);
            
            let messageToDisplay = '';
            
            if (response && typeof response === 'object') {
                // Handle JSON response formats
                if (response.message) {
                    messageToDisplay = response.message;
                } else if (response.output) {
                    messageToDisplay = response.output;
                } else if (response.text) {
                    messageToDisplay = response.text;
                } else if (response.content) {
                    messageToDisplay = response.content;
                } else if (response.response) {
                    messageToDisplay = response.response;
                } else {
                    // If it's an object but no recognized fields, stringify it
                    messageToDisplay = JSON.stringify(response, null, 2);
                }
            } else if (response && typeof response === 'string') {
                // Handle string response
                messageToDisplay = response;
            } else {
                messageToDisplay = 'I received your message but got an unexpected response format.';
            }
            
            console.log('Message to display:', messageToDisplay);
            this.addMessage(messageToDisplay, 'assistant');
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            
            let errorMessage = 'Sorry, I encountered an error while processing your message. Please try again.';
            
            if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
                errorMessage = 'Network error: Unable to connect to the webhook. This could be due to CORS restrictions or network issues. Check your webhook configuration in N8N to allow requests from your domain.';
            } else if (error.message.includes('CORS')) {
                errorMessage = 'CORS error: Your N8N webhook needs to be configured to allow requests from this domain. Please check your N8N webhook settings.';
            } else if (error.message.includes('HTTP error')) {
                errorMessage = `Server error: ${error.message}`;
            } else if (error.message.includes('Proxy')) {
                errorMessage = 'Both direct and proxy requests failed. Please check your webhook URL and N8N configuration.';
            }
            
            this.addMessage(errorMessage, 'assistant', true);
        } finally {
            this.isWaiting = false;
            this.handleInputChange();
            this.messageInput.focus();
        }
    }

    async sendToWebhook(message) {
        console.log('Sending message to webhook:', message);
        console.log('Webhook URL:', this.webhookUrl);
        
        const payload = {
            message: message,
            timestamp: new Date().toISOString(),
            sessionId: this.getSessionId()
        };
        
        console.log('Payload:', payload);
        
        // Try direct request first
        try {
            const response = await this.tryDirectRequest(payload);
            return response;
        } catch (error) {
            console.log('Direct request failed, trying CORS proxy...', error);
            
            // If direct request fails due to CORS, try with CORS proxy
            try {
                const response = await this.tryWithCorsProxy(payload);
                return response;
            } catch (proxyError) {
                console.error('Both direct and proxy requests failed:', proxyError);
                throw proxyError;
            }
        }
    }

    async tryDirectRequest(payload) {
        const response = await fetch(this.webhookUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*'
            },
            body: JSON.stringify(payload)
        });

        console.log('Direct response received:', response);
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
            const jsonResponse = await response.json();
            console.log('JSON response:', jsonResponse);
            return jsonResponse;
        } else {
            const textResponse = await response.text();
            console.log('Text response:', textResponse);
            return textResponse;
        }
    }

    async tryWithCorsProxy(payload) {
        // Using a public CORS proxy as fallback
        const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(this.webhookUrl);
        
        console.log('Trying CORS proxy:', proxyUrl);
        
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*'
            },
            body: JSON.stringify(payload)
        });

        console.log('Proxy response received:', response);
        console.log('Proxy response status:', response.status);

        if (!response.ok) {
            throw new Error(`Proxy HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        console.log('Proxy Content-Type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
            const jsonResponse = await response.json();
            console.log('Proxy JSON response:', jsonResponse);
            return jsonResponse;
        } else {
            const textResponse = await response.text();
            console.log('Proxy text response:', textResponse);
            return textResponse;
        }
    }

    addMessage(content, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        if (sender === 'user') {
            avatar.innerHTML = '<i class="fas fa-user"></i>';
        } else {
            avatar.innerHTML = '<i class="fas fa-robot"></i>';
            if (isError) {
                avatar.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            }
        }
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageBubble = document.createElement('div');
        messageBubble.className = 'message-bubble';
        messageBubble.textContent = content;
        
        if (isError) {
            messageBubble.style.background = '#fee2e2';
            messageBubble.style.borderColor = '#fecaca';
            messageBubble.style.color = '#dc2626';
        }
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = this.formatTime(new Date());
        
        messageContent.appendChild(messageBubble);
        messageContent.appendChild(messageTime);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    formatTime(date) {
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('chatSessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('chatSessionId', sessionId);
        }
        return sessionId;
    }
}

// Add fadeOut animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
`;
document.head.appendChild(style);

// Initialize chat interface when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatInterface();
});

// Add some visual feedback for connection status
window.addEventListener('online', () => {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    if (statusDot && statusText) {
        statusDot.style.background = '#4ade80';
        statusText.textContent = 'Online';
    }
});

window.addEventListener('offline', () => {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    if (statusDot && statusText) {
        statusDot.style.background = '#ef4444';
        statusText.textContent = 'Offline';
    }
});