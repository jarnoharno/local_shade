/**
 * API Connector for Local Operator
 * 
 * This module provides a clean interface for communicating with the Local Operator API.
 * It handles all the API calls and error handling.
 */
class ApiConnector {
    /**
     * Create a new API connector
     * @param {string} baseUrl - The base URL of the Local Operator API
     */
    constructor(baseUrl = 'http://localhost:8080') {
        this.baseUrl = baseUrl;
    }

    /**
     * Send a message to the Local Operator API
     * @param {string} message - The message to send
     * @returns {Promise<Object>} - The response from the API
     */
    async sendMessage(message) {
        try {
            const response = await fetch(`${this.baseUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
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
     * Get the current actions from the Local Operator API
     * @returns {Promise<Object>} - The actions from the API
     */
    async getActions() {
        try {
            const response = await fetch(`${this.baseUrl}/actions`);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error getting actions:', error);
            throw error;
        }
    }

    /**
     * Get the available agent types from the Local Operator API
     * @returns {Promise<Array>} - The available agent types
     */
    async getAgentTypes() {
        try {
            const response = await fetch(`${this.baseUrl}/agent-types`);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error getting agent types:', error);
            throw error;
        }
    }

    /**
     * Set the agent type for the current session
     * @param {string} agentType - The agent type to set
     * @returns {Promise<Object>} - The response from the API
     */
    async setAgentType(agentType) {
        try {
            const response = await fetch(`${this.baseUrl}/agent-type`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ agentType })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error setting agent type:', error);
            throw error;
        }
    }

    /**
     * Get the conversation history from the Local Operator API
     * @returns {Promise<Array>} - The conversation history
     */
    async getConversationHistory() {
        try {
            const response = await fetch(`${this.baseUrl}/conversation`);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error getting conversation history:', error);
            throw error;
        }
    }

    /**
     * Clear the conversation history
     * @returns {Promise<Object>} - The response from the API
     */
    async clearConversation() {
        try {
            const response = await fetch(`${this.baseUrl}/conversation`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error clearing conversation:', error);
            throw error;
        }
    }
}

// Export the API connector
export default ApiConnector;