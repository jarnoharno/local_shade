/**
 * API Connector for Local Operator
 * This module handles communication with the Local Operator backend API
 */

class LocalOperatorAPI {
    constructor(baseUrl = 'http://localhost:8080') {
        this.baseUrl = baseUrl;
        this.connected = false;
        this.connectionError = null;
    }

    /**
     * Initialize connection to the API
     * @returns {Promise<boolean>} True if connection successful, false otherwise
     */
    async initialize() {
        try {
            const response = await this.checkStatus();
            this.connected = response.status === 'running';
            return this.connected;
        } catch (error) {
            this.connectionError = error.message;
            this.connected = false;
            return false;
        }
    }

    /**
     * Check the status of the Local Operator API
     * @returns {Promise<Object>} Status object
     */
    async checkStatus() {
        try {
            const response = await fetch(`${this.baseUrl}/api/status`);
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to check API status:', error);
            throw error;
        }
    }

    /**
     * Send a message to the Local Operator API
     * @param {string} message - The message to send
     * @returns {Promise<Object>} Response object
     */
    async sendMessage(message) {
        try {
            const response = await fetch(`${this.baseUrl}/api/chat`, {
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
            console.error('Failed to send message:', error);
            throw error;
        }
    }

    /**
     * Get planned actions from the Local Operator API
     * @returns {Promise<Array>} Array of planned actions
     */
    async getPlannedActions() {
        try {
            const response = await fetch(`${this.baseUrl}/api/actions/planned`);
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.actions || [];
        } catch (error) {
            console.error('Failed to get planned actions:', error);
            throw error;
        }
    }

    /**
     * Get executing actions from the Local Operator API
     * @returns {Promise<Array>} Array of executing actions
     */
    async getExecutingActions() {
        try {
            const response = await fetch(`${this.baseUrl}/api/actions/executing`);
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.actions || [];
        } catch (error) {
            console.error('Failed to get executing actions:', error);
            throw error;
        }
    }

    /**
     * Get completed actions from the Local Operator API
     * @returns {Promise<Array>} Array of completed actions
     */
    async getCompletedActions() {
        try {
            const response = await fetch(`${this.baseUrl}/api/actions/completed`);
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.actions || [];
        } catch (error) {
            console.error('Failed to get completed actions:', error);
            throw error;
        }
    }

    /**
     * Execute a planned action
     * @param {number} actionId - The ID of the action to execute
     * @returns {Promise<Object>} Response object
     */
    async executeAction(actionId) {
        try {
            const response = await fetch(`${this.baseUrl}/api/actions/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ actionId })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to execute action:', error);
            throw error;
        }
    }

    /**
     * Cancel an executing action
     * @param {number} actionId - The ID of the action to cancel
     * @returns {Promise<Object>} Response object
     */
    async cancelAction(actionId) {
        try {
            const response = await fetch(`${this.baseUrl}/api/actions/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ actionId })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to cancel action:', error);
            throw error;
        }
    }

    /**
     * Get the conversation history
     * @returns {Promise<Array>} Array of conversation messages
     */
    async getConversationHistory() {
        try {
            const response = await fetch(`${this.baseUrl}/api/conversation/history`);
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.messages || [];
        } catch (error) {
            console.error('Failed to get conversation history:', error);
            throw error;
        }
    }

    /**
     * Clear the conversation history
     * @returns {Promise<Object>} Response object
     */
    async clearConversationHistory() {
        try {
            const response = await fetch(`${this.baseUrl}/api/conversation/clear`, {
                method: 'POST'
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to clear conversation history:', error);
            throw error;
        }
    }

    /**
     * Get available agent types
     * @returns {Promise<Array>} Array of agent types
     */
    async getAgentTypes() {
        try {
            const response = await fetch(`${this.baseUrl}/api/agents/types`);
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.types || [];
        } catch (error) {
            console.error('Failed to get agent types:', error);
            throw error;
        }
    }

    /**
     * Set the current agent type
     * @param {string} agentType - The agent type to set
     * @returns {Promise<Object>} Response object
     */
    async setAgentType(agentType) {
        try {
            const response = await fetch(`${this.baseUrl}/api/agents/set-type`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ type: agentType })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to set agent type:', error);
            throw error;
        }
    }
}

// Export the API connector
window.LocalOperatorAPI = LocalOperatorAPI;