/**
 * API Connector for Local Operator
 * This module handles communication with the Local Operator backend
 */

class ApiConnector {
    constructor(baseUrl = 'http://localhost:5000/api') {
        this.baseUrl = baseUrl;
        this.headers = {
            'Content-Type': 'application/json'
        };
    }

    /**
     * Set authentication token for API requests
     * @param {string} token - Authentication token
     */
    setAuthToken(token) {
        this.headers['Authorization'] = `Bearer ${token}`;
    }

    /**
     * Send a message to the AI agent
     * @param {string} message - User message
     * @param {string} agentType - Type of agent (e.g., 'Software Engineer')
     * @returns {Promise} - Promise with response data
     */
    async sendMessage(message, agentType) {
        try {
            const response = await fetch(`${this.baseUrl}/chat`, {
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
     * Get available agent types
     * @returns {Promise} - Promise with agent types data
     */
    async getAgentTypes() {
        try {
            const response = await fetch(`${this.baseUrl}/agent-types`, {
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
     * Activate a specific tool
     * @param {string} toolName - Name of the tool to activate
     * @param {Object} params - Tool parameters
     * @returns {Promise} - Promise with tool response data
     */
    async activateTool(toolName, params = {}) {
        try {
            const response = await fetch(`${this.baseUrl}/tools/${toolName}`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(params)
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error activating tool ${toolName}:`, error);
            throw error;
        }
    }

    /**
     * Get conversation history
     * @param {number} limit - Maximum number of messages to retrieve
     * @returns {Promise} - Promise with conversation history data
     */
    async getConversationHistory(limit = 50) {
        try {
            const response = await fetch(`${this.baseUrl}/history?limit=${limit}`, {
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
     * Clear conversation history
     * @returns {Promise} - Promise with response data
     */
    async clearConversationHistory() {
        try {
            const response = await fetch(`${this.baseUrl}/history`, {
                method: 'DELETE',
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error clearing conversation history:', error);
            throw error;
        }
    }
}