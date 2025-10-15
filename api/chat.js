const fetch = require('node-fetch');

// Webhook URLs
const WEBHOOK_URL_PRODUCTION = 'https://aayushmishra.app.n8n.cloud/webhook/44405750-c847-47f7-8cba-91c9e923ffc3';
const WEBHOOK_URL_TEST = 'https://aayushmishra.app.n8n.cloud/webhook-test/44405750-c847-47f7-8cba-91c9e923ffc3';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('Received chat request:', req.body);
        
        // Try production webhook first
        let webhookUrl = WEBHOOK_URL_PRODUCTION;
        let response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });

        console.log('Webhook response status:', response.status);
        console.log('Using webhook URL:', webhookUrl);
        
        // If production webhook returns 404, try test webhook
        if (response.status === 404) {
            console.log('Production webhook not found, trying test webhook...');
            webhookUrl = WEBHOOK_URL_TEST;
            
            response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body)
            });
            
            console.log('Test webhook response status:', response.status);
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
            webhook_used: webhookUrl === WEBHOOK_URL_PRODUCTION ? 'production' : 'test',
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
}