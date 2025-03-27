/**
 * API Connector for Local Operator
 * 
 * This module handles communication with the Local Operator backend API.
 * It provides methods for sending messages, managing agent types, and
 * accessing various tools.
 */

class LocalOperatorAPI {
    constructor(baseUrl = 'http://localhost:8080') {
        this.baseUrl = baseUrl;
        this.endpoints = {
            chat: '/api/chat',
            agents: '/api/agents',
            tools: '/api/tools',
            memory: '/api/memory',
            models: '/api/models'
        };
        this.currentAgent = null;
    }

    /**
     * Send a message to the Local Operator API
     * @param {string} message - The message to send
     * @param {Object} options - Additional options (agent, tools, etc.)
     * @returns {Promise} - Promise resolving to the API response
     */
    async sendMessage(message, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.chat}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message,
                    agent: options.agent || this.currentAgent,
                    tools: options.tools || [],
                    context: options.context || {}
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
     * @returns {Promise} - Promise resolving to array of agent types
     */
    async getAgentTypes() {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.agents}`);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching agent types:', error);
            return [
                'Software Developer',
                'Data Scientist',
                'Research Assistant',
                'Creative Writer',
                'Math Tutor',
                'Language Translator'
            ]; // Fallback to default types
        }
    }

    /**
     * Set the current agent type
     * @param {string} agentType - The agent type to set
     */
    setAgentType(agentType) {
        this.currentAgent = agentType;
    }

    /**
     * Get available tools
     * @returns {Promise} - Promise resolving to array of available tools
     */
    async getTools() {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.tools}`);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching tools:', error);
            return []; // Return empty array on error
        }
    }

    /**
     * Execute a specific tool
     * @param {string} toolName - The name of the tool to execute
     * @param {Object} params - Parameters for the tool
     * @returns {Promise} - Promise resolving to the tool execution result
     */
    async executeTool(toolName, params = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.tools}/${toolName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error executing tool ${toolName}:`, error);
            throw error;
        }
    }

    /**
     * Get available language models
     * @returns {Promise} - Promise resolving to array of available models
     */
    async getModels() {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoints.models}`);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching models:', error);
            return [
                { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai' },
                { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'anthropic' },
                { id: 'llama3:70b', name: 'Llama 3 70B', provider: 'ollama' },
                { id: 'qwen2.5:14b', name: 'Qwen 2.5 14B', provider: 'ollama' }
            ]; // Fallback to default models
        }
    }

    /**
     * Check if the API is available
     * @returns {Promise<boolean>} - Promise resolving to true if API is available
     */
    async checkConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/api/health`);
            return response.ok;
        } catch (error) {
            console.error('API connection error:', error);
            return false;
        }
    }
}

// Export the API class
window.LocalOperatorAPI = LocalOperatorAPI;