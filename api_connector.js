/**
 * API Connector for Local Operator
 * This module handles communication with the Local Operator backend API
 */

class LocalOperatorAPI {
    constructor(baseUrl = 'http://localhost:8080') {
        this.baseUrl = baseUrl;
        this.headers = {
            'Content-Type': 'application/json'
        };
    }

    /**
     * Set the API base URL
     * @param {string} url - The base URL for the API
     */
    setBaseUrl(url) {
        this.baseUrl = url;
    }

    /**
     * Set an API key if required
     * @param {string} apiKey - The API key
     */
    setApiKey(apiKey) {
        if (apiKey) {
            this.headers['Authorization'] = `Bearer ${apiKey}`;
        } else {
            delete this.headers['Authorization'];
        }
    }

    /**
     * Send a message to the Local Operator
     * @param {string} message - The message to send
     * @param {string} agentType - The type of agent to use
     * @returns {Promise} - Promise with the response
     */
    async sendMessage(message, agentType = 'default') {
        try {
            const response = await fetch(`${this.baseUrl}/api/chat`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    message,
                    agent_type: agentType
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    /**
     * Get the current actions (planned, executing, completed)
     * @returns {Promise} - Promise with the actions
     */
    async getActions() {
        try {
            const response = await fetch(`${this.baseUrl}/api/actions`, {
                method: 'GET',
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching actions:', error);
            throw error;
        }
    }

    /**
     * Get the conversation history
     * @returns {Promise} - Promise with the conversation history
     */
    async getConversationHistory() {
        try {
            const response = await fetch(`${this.baseUrl}/api/conversation`, {
                method: 'GET',
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching conversation history:', error);
            throw error;
        }
    }

    /**
     * Get available agent types
     * @returns {Promise} - Promise with the available agent types
     */
    async getAgentTypes() {
        try {
            const response = await fetch(`${this.baseUrl}/api/agents`, {
                method: 'GET',
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching agent types:', error);
            throw error;
        }
    }

    /**
     * Get server status and configuration
     * @returns {Promise} - Promise with the server status
     */
    async getServerStatus() {
        try {
            const response = await fetch(`${this.baseUrl}/api/status`, {
                method: 'GET',
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching server status:', error);
            throw error;
        }
    }

    /**
     * Cancel the current operation
     * @returns {Promise} - Promise with the cancellation result
     */
    async cancelOperation() {
        try {
            const response = await fetch(`${this.baseUrl}/api/cancel`, {
                method: 'POST',
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error cancelling operation:', error);
            throw error;
        }
    }
}

// Create a singleton instance
const apiConnector = new LocalOperatorAPI();

// Export the instance
export default apiConnector;