class ChatInterface {
    constructor() {
        this.webhookUrl = 'https://aayushmishra.app.n8n.cloud/webhook/44405750-c847-47f7-8cba-91c9e923ffc3';
        this.corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
        this.localProxyUrl = '/api/chat'; // Use local proxy when available
        this.useCorsProxy = false; // Toggle this if CORS issues occur
        this.useLocalProxy = true; // Prefer local proxy
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.errorToast = document.getElementById('errorToast');
        
        this.init();
    }

    init() {
        // Event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        document.getElementById('testButton').addEventListener('click', () => this.testConnection());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize input on content change
        this.messageInput.addEventListener('input', () => {
            this.adjustInputHeight();
        });

        // Focus input on load
        this.messageInput.focus();
    }

    adjustInputHeight() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    async testConnection() {
        const testButton = document.getElementById('testButton');
        const originalText = testButton.innerHTML;
        
        testButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
        testButton.disabled = true;

        try {
            console.log('Testing webhook connection...');
            const response = await this.sendToWebhook('Connection test');
            this.addMessage('✅ Webhook connection successful! Response: ' + response, 'bot');
            testButton.innerHTML = '<i class="fas fa-check"></i> Connected';
            testButton.style.background = '#10b981';
        } catch (error) {
            console.error('Connection test failed:', error);
            this.addMessage('❌ Connection failed: ' + error.message, 'bot');
            testButton.innerHTML = '<i class="fas fa-times"></i> Failed';
            testButton.style.background = '#ef4444';
        }

        setTimeout(() => {
            testButton.innerHTML = originalText;
            testButton.disabled = false;
            testButton.style.background = '#f59e0b';
        }, 3000);
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        
        if (!message) {
            this.showError('Please enter a message');
            return;
        }

        // Disable input while sending
        this.setInputState(false);
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.messageInput.value = '';
        this.adjustInputHeight();
        
        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Send message to webhook
            const response = await this.sendToWebhook(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add bot response to chat
            this.addMessage(response, 'bot');
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            this.showError('Failed to send message. Please try again.');
        } finally {
            // Re-enable input
            this.setInputState(true);
            this.messageInput.focus();
        }
    }

    async sendToWebhook(message) {
        const payload = {
            message: message,
            timestamp: new Date().toISOString(),
            user_id: this.getUserId()
        };

        console.log('Sending payload to webhook:', payload);
        console.log('Webhook URL:', this.webhookUrl);

        try {
            let finalUrl, requestOptions;
            
            if (this.useLocalProxy) {
                // Use local proxy server
                finalUrl = this.localProxyUrl;
                requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(payload),
                };
            } else if (this.useCorsProxy) {
                // Use CORS proxy
                finalUrl = this.corsProxyUrl + this.webhookUrl;
                requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(payload),
                    mode: 'cors',
                };
            } else {
                // Direct webhook call
                finalUrl = this.webhookUrl;
                requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(payload),
                    mode: 'cors',
                };
            }
            
            console.log('Final URL:', finalUrl);
            console.log('Request options:', requestOptions);
            
            const response = await fetch(finalUrl, requestOptions);

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            // Try to parse as JSON first
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                // If not JSON, treat as text
                data = await response.text();
            }

            console.log('Response data:', data);
            
            // Handle local proxy response format
            if (this.useLocalProxy && data.success) {
                data = data.data;
            } else if (this.useLocalProxy && data.error) {
                // Handle error response from local proxy
                let errorMessage = data.error;
                if (data.suggestion) {
                    errorMessage += '\n\nSuggestion: ' + data.suggestion;
                }
                throw new Error(errorMessage);
            }
            
            // Extract response text from various possible response formats
            if (typeof data === 'object') {
                if (data.response) {
                    return data.response;
                } else if (data.message) {
                    return data.message;
                } else if (data.text) {
                    return data.text;
                } else if (data.data) {
                    return data.data;
                } else {
                    return JSON.stringify(data);
                }
            } else if (typeof data === 'string') {
                return data;
            } else {
                return 'I received your message, but I\'m not sure how to respond right now.';
            }
        } catch (error) {
            console.error('Fetch error:', error);
            
            // Check if it's a CORS error
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                if (this.useLocalProxy) {
                    // Try direct webhook if local proxy fails
                    console.log('Local proxy failed, trying direct webhook...');
                    this.useLocalProxy = false;
                    return this.sendToWebhook(message);
                } else if (!this.useCorsProxy) {
                    // Try again with CORS proxy
                    console.log('Retrying with CORS proxy...');
                    this.useCorsProxy = true;
                    return this.sendToWebhook(message);
                }
                throw new Error('Connection failed. The webhook might not be accessible or CORS is blocking the request.');
            }
            
            throw error;
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = text;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = this.formatTime(new Date());
        
        contentDiv.appendChild(textDiv);
        contentDiv.appendChild(timeDiv);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        this.typingIndicator.classList.add('show');
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.classList.remove('show');
    }

    setInputState(enabled) {
        this.messageInput.disabled = !enabled;
        this.sendButton.disabled = !enabled;
        
        if (enabled) {
            this.messageInput.placeholder = 'Type your message here...';
        } else {
            this.messageInput.placeholder = 'Sending message...';
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    showError(message) {
        const errorMessage = this.errorToast.querySelector('.error-message');
        errorMessage.textContent = message;
        this.errorToast.classList.add('show');
        
        setTimeout(() => {
            this.errorToast.classList.remove('show');
        }, 5000);
    }

    formatTime(date) {
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    getUserId() {
        // Generate or retrieve a simple user ID for session tracking
        let userId = localStorage.getItem('chat_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chat_user_id', userId);
        }
        return userId;
    }
}

// Enhanced message formatting for better display
class MessageFormatter {
    static format(text) {
        if (!text) return '';
        
        // Convert to string if not already
        text = String(text);
        
        // Handle basic markdown-like formatting
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        text = text.replace(/`(.*?)`/g, '<code>$1</code>');
        
        // Handle line breaks
        text = text.replace(/\n/g, '<br>');
        
        // Handle URLs (make them clickable)
        text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
        
        // Handle email addresses
        text = text.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1">$1</a>');
        
        return text;
    }
    
    static addTypingEffect(element, text, speed = 30) {
        element.innerHTML = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                // Add formatted content after typing is complete
                element.innerHTML = MessageFormatter.format(text);
            }
        };
        
        typeWriter();
    }
}

// Enhanced version of addMessage with formatting and animations
ChatInterface.prototype.addMessage = function(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = this.formatTime(new Date());
    
    contentDiv.appendChild(textDiv);
    contentDiv.appendChild(timeDiv);
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    this.chatMessages.appendChild(messageDiv);
    
    // Add typing effect for bot messages, instant for user messages
    if (sender === 'bot') {
        // Add a subtle fade-in and typing effect for bot responses
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease-out';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
            
            // Start typing effect after fade-in
            setTimeout(() => {
                MessageFormatter.addTypingEffect(textDiv, text, 20);
            }, 300);
        }, 100);
    } else {
        // Instant display for user messages
        textDiv.innerHTML = MessageFormatter.format(text);
    }
    
    this.scrollToBottom();
};

// Initialize the chat interface when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatInterface();
});

// Add some utility functions for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Add click to focus functionality
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.chat-input-wrapper') && !e.target.closest('.send-button')) {
            const messageInput = document.getElementById('messageInput');
            if (messageInput && !messageInput.disabled) {
                messageInput.focus();
            }
        }
    });

    // Add escape key to clear input
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const messageInput = document.getElementById('messageInput');
            if (messageInput) {
                messageInput.value = '';
                messageInput.style.height = 'auto';
            }
        }
    });
});