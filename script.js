document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const dropdownText = document.querySelector('.dropdown-text');
    const plannedActionsList = document.getElementById('planned-actions');
    const executingActionsList = document.getElementById('executing-actions');
    const completedActionsList = document.getElementById('completed-actions');

    // State
    let isWaitingForResponse = false;
    let selectedAgentType = '';
    let actions = {
        planned: [],
        executing: [],
        completed: []
    };

    // Initialize with sample data
    initializeSampleData();

    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const text = this.textContent;
            selectAgentType(value, text);
        });
    });

    // Functions
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '' || isWaitingForResponse) return;

        // Add user message to chat
        addMessageToChat('user', message);
        
        // Clear input
        chatInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Set waiting state
        isWaitingForResponse = true;
        
        // Simulate API call
        setTimeout(() => {
            // Remove typing indicator
            removeTypingIndicator();
            
            // Process the message and get a response
            const response = processMessage(message);
            
            // Add system response to chat
            addMessageToChat('system', response);
            
            // Update actions based on the message
            updateActions(message);
            
            // Reset waiting state
            isWaitingForResponse = false;
        }, 1500);
    }

    function addMessageToChat(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Process content for code blocks
        const processedContent = processCodeBlocks(content);
        messageContent.innerHTML = processedContent;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Highlight code blocks
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }

    function processCodeBlocks(content) {
        // Replace markdown-style code blocks with HTML
        let processedContent = content.replace(/```(\w+)?\n([\s\S]*?)```/g, function(match, language, code) {
            const lang = language || 'plaintext';
            return `<div class="code-block">
                        <div class="code-block-header">
                            <span class="code-block-language">${lang}</span>
                            <button class="code-block-copy" onclick="copyCode(this)">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                        </div>
                        <pre><code class="${lang}">${code}</code></pre>
                    </div>`;
        });
        
        // Replace inline code with HTML
        processedContent = processedContent.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Replace newlines with <br> tags
        processedContent = processedContent.replace(/\n/g, '<br>');
        
        return processedContent;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingDiv.appendChild(dot);
        }
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function switchTab(tabName) {
        tabs.forEach(tab => {
            if (tab.getAttribute('data-tab') === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        tabPanes.forEach(pane => {
            if (pane.id === tabName) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });
    }

    function selectAgentType(value, text) {
        selectedAgentType = value;
        dropdownText.textContent = text;
        
        // Add system message about agent type change
        addMessageToChat('system', `Agent type changed to ${text}.`);
    }

    function processMessage(message) {
        // Simple response logic - in a real app, this would call the API
        if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
            return "Hello! How can I assist you today?";
        } else if (message.toLowerCase().includes('help')) {
            return "I can help you with various tasks. Just tell me what you need!";
        } else if (message.toLowerCase().includes('code')) {
            return "Here's an example of Python code:\n```python\ndef hello_world():\n    print('Hello, world!')\n\n# Call the function\nhello_world()\n```";
        } else if (message.toLowerCase().includes('plan')) {
            return "I'll create a plan for this task. Check the Planning tab to see the steps.";
        } else {
            return "I understand your request. Let me work on that for you.";
        }
    }

    function updateActions(message) {
        // Simple logic to update actions based on the message
        if (message.toLowerCase().includes('plan')) {
            // Add new planned actions
            const newAction = {
                id: generateId(),
                title: `Plan for: ${message.substring(0, 30)}...`,
                description: `Created plan based on user request: "${message}"`
            };
            
            actions.planned.push(newAction);
            
            // Update the UI
            renderActions();
        } else if (message.toLowerCase().includes('execute') || message.toLowerCase().includes('run')) {
            // Move first planned action to executing if available
            if (actions.planned.length > 0) {
                const actionToExecute = actions.planned.shift();
                actions.executing.push(actionToExecute);
                
                // Simulate completion after a delay
                setTimeout(() => {
                    const completedAction = actions.executing.shift();
                    actions.completed.push(completedAction);
                    renderActions();
                }, 3000);
                
                // Update the UI
                renderActions();
            }
        }
    }

    function renderActions() {
        // Clear current lists
        plannedActionsList.innerHTML = '';
        executingActionsList.innerHTML = '';
        completedActionsList.innerHTML = '';
        
        // Render planned actions
        actions.planned.forEach(action => {
            const actionElement = createActionElement(action);
            plannedActionsList.appendChild(actionElement);
        });
        
        // Render executing actions
        actions.executing.forEach(action => {
            const actionElement = createActionElement(action, 'executing');
            executingActionsList.appendChild(actionElement);
        });
        
        // Render completed actions
        actions.completed.forEach(action => {
            const actionElement = createActionElement(action, 'completed');
            completedActionsList.appendChild(actionElement);
        });
    }

    function createActionElement(action, status = '') {
        const actionElement = document.createElement('div');
        actionElement.className = `action-item ${status}`;
        actionElement.id = `action-${action.id}`;
        
        const title = document.createElement('h4');
        title.textContent = action.title;
        
        const description = document.createElement('p');
        description.textContent = action.description;
        
        actionElement.appendChild(title);
        actionElement.appendChild(description);
        
        return actionElement;
    }

    function generateId() {
        return Math.random().toString(36).substring(2, 15);
    }

    function initializeSampleData() {
        // Add sample actions
        actions.planned = [
            {
                id: generateId(),
                title: 'Analyze user requirements',
                description: 'Review the user request and identify key requirements'
            },
            {
                id: generateId(),
                title: 'Research potential solutions',
                description: 'Search for relevant libraries and approaches'
            }
        ];
        
        actions.executing = [
            {
                id: generateId(),
                title: 'Setting up development environment',
                description: 'Installing necessary dependencies and configuring tools'
            }
        ];
        
        actions.completed = [
            {
                id: generateId(),
                title: 'Initial project setup',
                description: 'Created project structure and configuration files'
            }
        ];
        
        // Render the actions
        renderActions();
    }
});

// Global function for copying code
function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        // Change button text temporarily
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code: ', err);
    });
}

// API Connector (commented out for now, uncomment and modify to connect to the actual API)
/*
class ApiConnector {
    constructor(baseUrl = 'http://localhost:8080') {
        this.baseUrl = baseUrl;
    }
    
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
}

// Initialize API connector
const api = new ApiConnector();
*/