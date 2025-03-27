document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const plannedActions = document.getElementById('plannedActions');
    const executingActions = document.getElementById('executingActions');
    const completedActions = document.getElementById('completedActions');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    
    // API Configuration
    const API_URL = 'http://localhost:8080'; // Default Local Operator API URL
    
    // Agent Types
    const agentTypes = [
        'Software Developer',
        'Data Scientist',
        'Research Assistant',
        'Creative Writer',
        'Task Manager',
        'Custom Agent...'
    ];
    
    // Initialize the UI
    initializeUI();
    
    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    dropdownToggle.addEventListener('click', showAgentTypeDropdown);
    
    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Functions
    function initializeUI() {
        // Set default agent type
        dropdownToggle.textContent = agentTypes[0];
        
        // Load sample data for demonstration
        loadSampleData();
        
        // Add typing indicator
        addTypingIndicator();
        
        // Simulate initial message from agent
        setTimeout(() => {
            removeTypingIndicator();
            addMessage('Hello! I\'m your Local Operator assistant. How can I help you today?', 'agent');
        }, 1500);
    }
    
    function loadSampleData() {
        // Sample planned actions
        const plannedActionsData = [
            {
                id: 1,
                title: 'Analyze user requirements',
                description: 'Review the provided specifications and identify key requirements for implementation.',
                status: 'planned',
                time: '2 min ago'
            },
            {
                id: 2,
                title: 'Research API documentation',
                description: 'Look up the necessary API endpoints and parameters for the integration.',
                status: 'planned',
                time: '5 min ago'
            }
        ];
        
        // Sample executing actions
        const executingActionsData = [
            {
                id: 3,
                title: 'Setting up development environment',
                description: 'Installing required dependencies and configuring the project structure.',
                status: 'executing',
                time: '1 min ago'
            }
        ];
        
        // Sample completed actions
        const completedActionsData = [
            {
                id: 4,
                title: 'Initialize project',
                description: 'Created basic project structure and configuration files.',
                status: 'completed',
                time: '10 min ago'
            },
            {
                id: 5,
                title: 'Install dependencies',
                description: 'Installed required packages using pip: requests, fastapi, uvicorn.',
                status: 'completed',
                time: '8 min ago'
            }
        ];
        
        // Render actions
        plannedActionsData.forEach(action => addAction(action, plannedActions));
        executingActionsData.forEach(action => addAction(action, executingActions));
        completedActionsData.forEach(action => addAction(action, completedActions));
    }
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, 'user');
        
        // Clear input
        chatInput.value = '';
        chatInput.style.height = 'auto';
        
        // Show typing indicator
        addTypingIndicator();
        
        // Simulate API call to Local Operator
        setTimeout(() => {
            processMessage(message);
        }, 1000);
    }
    
    function processMessage(message) {
        // This function would normally call the Local Operator API
        // For demo purposes, we'll simulate responses
        
        // Check for specific commands
        if (message.toLowerCase().includes('create file') || message.toLowerCase().includes('make file')) {
            simulateFileCreation(message);
        } else if (message.toLowerCase().includes('search') || message.toLowerCase().includes('find')) {
            simulateSearch(message);
        } else if (message.toLowerCase().includes('install') || message.toLowerCase().includes('download')) {
            simulateInstallation(message);
        } else {
            // Generic response
            simulateGenericResponse(message);
        }
    }
    
    function simulateFileCreation(message) {
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add agent response
        addMessage('I\'ll create that file for you. Let me plan the steps:', 'agent');
        
        // Add planned action
        const action = {
            id: Date.now(),
            title: 'Create new file',
            description: 'Creating a new file based on your request: "' + message + '"',
            status: 'planned',
            time: 'just now'
        };
        
        addAction(action, plannedActions);
        
        // Simulate execution
        setTimeout(() => {
            // Update action status to executing
            updateActionStatus(action.id, 'executing');
            
            // Add code block message
            const codeContent = 'def main():\n    print("Hello, world!")\n\nif __name__ == "__main__":\n    main()';
            addCodeBlockMessage('Here\'s the code I\'ll use:', codeContent, 'python', 'agent');
            
            // Simulate completion
            setTimeout(() => {
                // Update action status to completed
                updateActionStatus(action.id, 'completed');
                
                // Add completion message
                addMessage('✅ File created successfully!', 'agent');
            }, 2000);
        }, 1500);
    }
    
    function simulateSearch(message) {
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add agent response
        addMessage('I\'ll search for that information. Let me plan the steps:', 'agent');
        
        // Add planned action
        const action = {
            id: Date.now(),
            title: 'Web search',
            description: 'Searching for information based on your query: "' + message + '"',
            status: 'planned',
            time: 'just now'
        };
        
        addAction(action, plannedActions);
        
        // Simulate execution
        setTimeout(() => {
            // Update action status to executing
            updateActionStatus(action.id, 'executing');
            
            // Add searching message
            addMessage('Searching the web for relevant information...', 'agent');
            
            // Simulate completion
            setTimeout(() => {
                // Update action status to completed
                updateActionStatus(action.id, 'completed');
                
                // Add results message
                addMessage('I found some information that might help. Here are the key points:\n\n1. The Local Operator project provides a Python environment for AI agents\n2. It allows for executing code safely through a chat interface\n3. It supports both local models via Ollama and cloud providers\n4. It includes features like web search and image generation', 'agent');
            }, 2500);
        }, 1500);
    }
    
    function simulateInstallation(message) {
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add agent response
        addMessage('I\'ll help you install that. Let me plan the steps:', 'agent');
        
        // Add planned actions
        const actions = [
            {
                id: Date.now(),
                title: 'Check dependencies',
                description: 'Verifying system requirements and dependencies',
                status: 'planned',
                time: 'just now'
            },
            {
                id: Date.now() + 1,
                title: 'Download package',
                description: 'Downloading the required package from the repository',
                status: 'planned',
                time: 'just now'
            },
            {
                id: Date.now() + 2,
                title: 'Install package',
                description: 'Installing the package and configuring settings',
                status: 'planned',
                time: 'just now'
            }
        ];
        
        actions.forEach(action => addAction(action, plannedActions));
        
        // Simulate execution sequence
        setTimeout(() => {
            // Update first action status to executing
            updateActionStatus(actions[0].id, 'executing');
            addMessage('Checking dependencies...', 'agent');
            
            setTimeout(() => {
                // Complete first action and start second
                updateActionStatus(actions[0].id, 'completed');
                updateActionStatus(actions[1].id, 'executing');
                addMessage('Dependencies verified. Downloading package...', 'agent');
                
                setTimeout(() => {
                    // Complete second action and start third
                    updateActionStatus(actions[1].id, 'completed');
                    updateActionStatus(actions[2].id, 'executing');
                    addMessage('Download complete. Installing...', 'agent');
                    
                    // Add code block for installation command
                    const codeContent = 'pip install package-name\n# or\npython -m pip install package-name';
                    addCodeBlockMessage('Running installation commands:', codeContent, 'bash', 'agent');
                    
                    setTimeout(() => {
                        // Complete third action
                        updateActionStatus(actions[2].id, 'completed');
                        addMessage('✅ Installation completed successfully!', 'agent');
                    }, 2000);
                }, 2000);
            }, 1500);
        }, 1000);
    }
    
    function simulateGenericResponse(message) {
        // Remove typing indicator
        removeTypingIndicator();
        
        // Generate a generic response
        const responses = [
            'I understand you want to ' + message.toLowerCase() + '. Let me help you with that.',
            'I\'ll assist you with that request. Let me think about the best approach.',
            'I can help you with that. Let me break this down into steps.',
            'I\'ll work on that for you. Let me plan how to approach this task.'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, 'agent');
        
        // Add a generic planned action
        const action = {
            id: Date.now(),
            title: 'Process request',
            description: 'Analyzing and processing your request: "' + message + '"',
            status: 'planned',
            time: 'just now'
        };
        
        addAction(action, plannedActions);
        
        // Simulate thinking
        setTimeout(() => {
            updateActionStatus(action.id, 'executing');
            addMessage('Thinking about the best way to help you...', 'agent');
            
            setTimeout(() => {
                updateActionStatus(action.id, 'completed');
                addMessage('Based on your request, I would recommend starting with a simple approach. Would you like me to explain more or help you implement a solution?', 'agent');
            }, 2000);
        }, 1500);
    }
    
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `message-${sender}`);
        
        // Process content for markdown-like formatting
        content = processMessageContent(content);
        
        messageDiv.innerHTML = content;
        
        const timeDiv = document.createElement('div');
        timeDiv.classList.add('message-time');
        timeDiv.textContent = getCurrentTime();
        messageDiv.appendChild(timeDiv);
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function addCodeBlockMessage(intro, code, language, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `message-${sender}`);
        
        // Create message content with code block
        let content = `
            <p>${intro}</p>
            <div class="code-block">
                <div class="code-header">
                    <span>${language}</span>
                    <button class="copy-button" onclick="copyToClipboard(this)">Copy</button>
                </div>
                <div class="code-content">${escapeHtml(code)}</div>
            </div>
        `;
        
        messageDiv.innerHTML = content;
        
        const timeDiv = document.createElement('div');
        timeDiv.classList.add('message-time');
        timeDiv.textContent = getCurrentTime();
        messageDiv.appendChild(timeDiv);
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function processMessageContent(content) {
        // Replace newlines with <br>
        content = content.replace(/\n/g, '<br>');
        
        // Simple markdown-like processing
        // Bold
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Code
        content = content.replace(/`(.*?)`/g, '<code>$1</code>');
        
        return content;
    }
    
    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    function addAction(action, container) {
        const actionDiv = document.createElement('div');
        actionDiv.classList.add('action-item');
        actionDiv.setAttribute('data-id', action.id);
        
        actionDiv.innerHTML = `
            <div class="action-header">
                <div class="action-title">${action.title}</div>
                <div class="action-status status-${action.status}">${action.status}</div>
            </div>
            <div class="action-description">${action.description}</div>
            <div class="action-meta">
                <div class="action-time">${action.time}</div>
                <div class="action-id">#${action.id}</div>
            </div>
        `;
        
        container.appendChild(actionDiv);
    }
    
    function updateActionStatus(id, newStatus) {
        // Find the action in all containers
        const containers = [plannedActions, executingActions, completedActions];
        let actionElement = null;
        let currentContainer = null;
        
        for (const container of containers) {
            const element = container.querySelector(`[data-id="${id}"]`);
            if (element) {
                actionElement = element;
                currentContainer = container;
                break;
            }
        }
        
        if (!actionElement) return;
        
        // Update the status text
        const statusElement = actionElement.querySelector('.action-status');
        statusElement.textContent = newStatus;
        statusElement.className = `action-status status-${newStatus}`;
        
        // Move to appropriate container
        let targetContainer;
        switch (newStatus) {
            case 'planned':
                targetContainer = plannedActions;
                break;
            case 'executing':
                targetContainer = executingActions;
                break;
            case 'completed':
                targetContainer = completedActions;
                break;
            default:
                targetContainer = currentContainer;
        }
        
        if (targetContainer !== currentContainer) {
            currentContainer.removeChild(actionElement);
            targetContainer.appendChild(actionElement);
        }
        
        // Switch to the tab if not already active
        let tabName;
        switch (newStatus) {
            case 'planned':
                tabName = 'planned';
                break;
            case 'executing':
                tabName = 'executing';
                break;
            case 'completed':
                tabName = 'completed';
                break;
        }
        
        // Highlight the tab but don't switch to it
        highlightTab(tabName);
    }
    
    function switchTab(tabName) {
        // Update active tab button
        tabButtons.forEach(button => {
            if (button.getAttribute('data-tab') === tabName) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update active tab content
        tabContents.forEach(content => {
            if (content.id === `${tabName}Tab`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }
    
    function highlightTab(tabName) {
        // Find the tab button
        const tabButton = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
        if (!tabButton) return;
        
        // Add a temporary highlight class
        tabButton.classList.add('highlight');
        
        // Remove it after animation
        setTimeout(() => {
            tabButton.classList.remove('highlight');
        }, 1000);
    }
    
    function addTypingIndicator() {
        // Check if typing indicator already exists
        if (document.querySelector('.typing-indicator')) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('typing-indicator');
        
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        chatMessages.appendChild(typingDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        return `${hours}:${minutes} ${ampm}`;
    }
    
    function showAgentTypeDropdown() {
        // Create dropdown if it doesn't exist
        let dropdown = document.querySelector('.agent-type-dropdown');
        
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.classList.add('agent-type-dropdown');
            
            // Add agent types
            agentTypes.forEach(type => {
                const option = document.createElement('div');
                option.classList.add('agent-type-option');
                option.textContent = type;
                
                option.addEventListener('click', () => {
                    dropdownToggle.textContent = type;
                    dropdown.remove();
                    
                    // Add a message about changing agent type
                    addMessage(`I've updated my role to be a ${type}. How can I assist you with that perspective?`, 'agent');
                });
                
                dropdown.appendChild(option);
            });
            
            // Position the dropdown
            const rect = dropdownToggle.getBoundingClientRect();
            dropdown.style.position = 'absolute';
            dropdown.style.top = `${rect.bottom + 5}px`;
            dropdown.style.left = `${rect.left}px`;
            dropdown.style.backgroundColor = 'var(--bg-tertiary)';
            dropdown.style.border = '1px solid var(--border-color)';
            dropdown.style.borderRadius = '4px';
            dropdown.style.padding = '5px 0';
            dropdown.style.zIndex = '1000';
            dropdown.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            dropdown.style.minWidth = '150px';
            
            // Style the options
            const style = document.createElement('style');
            style.textContent = `
                .agent-type-option {
                    padding: 8px 15px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    color: var(--text-color);
                    font-size: 14px;
                }
                
                .agent-type-option:hover {
                    background-color: var(--bg-color);
                    color: var(--accent-color);
                }
            `;
            
            document.head.appendChild(style);
            document.body.appendChild(dropdown);
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function closeDropdown(e) {
                if (!dropdown.contains(e.target) && e.target !== dropdownToggle) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            });
        }
    }
    
    // Helper function to copy code to clipboard
    window.copyToClipboard = function(button) {
        const codeBlock = button.closest('.code-block');
        const codeContent = codeBlock.querySelector('.code-content');
        const text = codeContent.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            // Change button text temporarily
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.style.color = 'var(--accent-color)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.color = '';
            }, 2000);
        });
    };
});