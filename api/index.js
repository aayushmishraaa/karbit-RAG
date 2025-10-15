const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Webhook URLs
const WEBHOOK_URL_PRODUCTION = 'https://aayushmishra.app.n8n.cloud/webhook/44405750-c847-47f7-8cba-91c9e923ffc3';
const WEBHOOK_URL_TEST = 'https://aayushmishra.app.n8n.cloud/webhook-test/44405750-c847-47f7-8cba-91c9e923ffc3';

// Try production first, fallback to test
let CURRENT_WEBHOOK_URL = WEBHOOK_URL_PRODUCTION;

// Proxy endpoint for webhook
app.post('/api/chat', async (req, res) => {
    try {
        console.log('Received chat request:', req.body);
        
        const response = await fetch(CURRENT_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });

        console.log('Webhook response status:', response.status);
        console.log('Using webhook URL:', CURRENT_WEBHOOK_URL);
        
        // If production webhook returns 404, try test webhook
        if (response.status === 404 && CURRENT_WEBHOOK_URL === WEBHOOK_URL_PRODUCTION) {
            console.log('Production webhook not found, trying test webhook...');
            CURRENT_WEBHOOK_URL = WEBHOOK_URL_TEST;
            
            const testResponse = await fetch(CURRENT_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body)
            });
            
            console.log('Test webhook response status:', testResponse.status);
            
            if (!testResponse.ok) {
                const errorText = await testResponse.text();
                console.error('Test webhook error:', errorText);
                return res.status(testResponse.status).json({ 
                    error: `Both webhooks failed. Status: ${testResponse.status}`,
                    details: errorText,
                    suggestion: "Please check if the workflow is active in n8n"
                });
            }
            
            // Process successful test response
            let data;
            const contentType = testResponse.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                data = await testResponse.json();
            } else {
                data = await testResponse.text();
            }

            console.log('Test webhook response data:', data);
            
            // Enhanced response parsing and formatting for test webhook
            let formattedResponse = data;
            
            // If data is an object, extract the actual message
            if (typeof data === 'object' && data !== null) {
                if (data.output) {
                    formattedResponse = data.output;
                } else if (data.response) {
                    formattedResponse = data.response;
                } else if (data.message) {
                    formattedResponse = data.message;
                } else if (data.text) {
                    formattedResponse = data.text;
                } else if (data.result) {
                    formattedResponse = data.result;
                } else {
                    // If none of the expected fields, stringify the whole object nicely
                    formattedResponse = JSON.stringify(data, null, 2);
                }
            }
            
            // Clean up the response text
            if (typeof formattedResponse === 'string') {
                formattedResponse = formattedResponse
                    .trim()
                    .replace(/^\"|\"$/g, '') // Remove surrounding quotes if any
                    .replace(/\\n/g, '\n')   // Convert literal \n to actual newlines
                    .replace(/\\"/g, '"');   // Convert escaped quotes
            }
            
            res.json({ 
                success: true, 
                data: formattedResponse, 
                webhook_used: 'test',
                raw_data: data // Keep original data for debugging
            });
            return;
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Webhook error:', errorText);
            
            // Parse the error to provide helpful suggestions
            let suggestion = "Please check the webhook URL and try again.";
            try {
                const errorData = JSON.parse(errorText);
                if (errorData.message && errorData.message.includes('not registered')) {
                    suggestion = "The workflow needs to be activated in n8n. Go to your n8n workflow and click the toggle to activate it.";
                }
            } catch (e) {
                // Error text is not JSON, use default suggestion
            }
            
            return res.status(response.status).json({ 
                error: `Webhook error: ${response.status}`,
                details: errorText,
                suggestion: suggestion
            });
        }

        // Try to parse as JSON, fallback to text
        let data;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        console.log('Webhook response data:', data);
        
        // Enhanced response parsing and formatting
        let formattedResponse = data;
        
        // If data is an object, extract the actual message
        if (typeof data === 'object' && data !== null) {
            if (data.output) {
                formattedResponse = data.output;
            } else if (data.response) {
                formattedResponse = data.response;
            } else if (data.message) {
                formattedResponse = data.message;
            } else if (data.text) {
                formattedResponse = data.text;
            } else if (data.result) {
                formattedResponse = data.result;
            } else {
                // If none of the expected fields, stringify the whole object nicely
                formattedResponse = JSON.stringify(data, null, 2);
            }
        }
        
        // Clean up the response text
        if (typeof formattedResponse === 'string') {
            formattedResponse = formattedResponse
                .trim()
                .replace(/^\"|\"$/g, '') // Remove surrounding quotes if any
                .replace(/\\n/g, '\n')   // Convert literal \n to actual newlines
                .replace(/\\"/g, '"');   // Convert escaped quotes
        }
        
        res.json({ 
            success: true, 
            data: formattedResponse, 
            webhook_used: 'production',
            raw_data: data // Keep original data for debugging
        });

    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ 
            error: 'Failed to communicate with webhook',
            details: error.message,
            suggestion: 'Check your internet connection and ensure the n8n workflow is active.'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = app;