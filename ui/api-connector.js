/**
 * API Connector for Local Operator
 * Handles communication with the Local Operator backend API
 */
class ApiConnector {
    constructor() {
        this.apiUrl = localStorage.getItem('apiUrl') || 'http://localhost:8080';
        this.apiKey = localStorage.getItem('apiKey') || '';
        this.model = localStorage.getItem('model') || 'gpt-4o';
        this.hosting = localStorage.getItem('hosting') || 'openai';
        this.conversationId = null;
        this.messageQueue = [];
        this.isProcessing = false;
    }

    /**
     * Initialize the API connector
     */
    async initialize() {
        try {
            // Check if the API is available
            const response = await this.checkApiStatus();
            if (response.status === 'ok') {
                console.log('API connection successful');
                return true;
            } else {
                console.error('API connection failed');
                return false;
            }
        } catch (error) {
            console.error('API connection error:', error);
            return false;
        }
    }

    /**
     * Check the status of the API
     */
    async checkApiStatus() {
        try {
            const response = await fetch(`${this.apiUrl}/status`, {
                method: 'GET',
                headers: this.getHeaders(),
            });
            
            if (!response.ok) {
                throw new Error(`API status check failed: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API status check error:', error);
            return { status: 'error', message: error.message };
        }
    }

    /**
     * Get the headers for API requests
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (this.apiKey) {
            headers['Authorization'] = `Bearer ${this.apiKey}`;
        }
        
        return headers;
    }

    /**
     * Send a message to the API
     * @param {string} message - The message to send
     * @param {function} onResponse - Callback for when a response is received
     * @param {function} onError - Callback for when an error occurs
     * @param {function} onTyping - Callback for when the agent is typing
     */
    async sendMessage(message, onResponse, onError, onTyping) {
        try {
            onTyping(true);
            
            const payload = {
                message: message,
                model: this.model,
                hosting: this.hosting,
            };
            
            if (this.conversationId) {
                payload.conversation_id = this.conversationId;
            }
            
            const response = await fetch(`${this.apiUrl}/chat`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(payload),
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            const data = await response.json();
            this.conversationId = data.conversation_id;
            
            onTyping(false);
            onResponse(data);
        } catch (error) {
            onTyping(false);
            onError(error.message);
        }
    }

    /**
     * Get the planning status from the API
     * @param {function} onSuccess - Callback for when the request is successful
     * @param {function} onError - Callback for when an error occurs
     */
    async getPlanningStatus(onSuccess, onError) {
        if (!this.conversationId) {
            onError('No active conversation');
            return;
        }
        
        try {
            const response = await fetch(`${this.apiUrl}/planning/${this.conversationId}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            const data = await response.json();
            onSuccess(data);
        } catch (error) {
            onError(error.message);
        }
    }

    /**
     * Update the API configuration
     * @param {object} config - The new configuration
     */
    updateConfig(config) {
        if (config.apiUrl) {
            this.apiUrl = config.apiUrl;
            localStorage.setItem('apiUrl', config.apiUrl);
        }
        
        if (config.apiKey !== undefined) {
            this.apiKey = config.apiKey;
            localStorage.setItem('apiKey', config.apiKey);
        }
        
        if (config.model) {
            this.model = config.model;
            localStorage.setItem('model', config.model);
        }
        
        if (config.hosting) {
            this.hosting = config.hosting;
            localStorage.setItem('hosting', config.hosting);
        }
    }

    /**
     * Get the current API configuration
     */
    getConfig() {
        return {
            apiUrl: this.apiUrl,
            apiKey: this.apiKey,
            model: this.model,
            hosting: this.hosting,
        };
    }
}

// Create a global instance of the API connector
const apiConnector = new ApiConnector();