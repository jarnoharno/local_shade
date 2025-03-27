document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const dropdown = document.querySelector('.dropdown');
    
    // Sample agent types
    const agentTypes = [
        'Software Engineer',
        'Data Scientist',
        'Product Manager',
        'UX Designer',
        'DevOps Engineer'
    ];
    
    // Current agent type
    let currentAgentType = 'Software Engineer';
    dropdown.textContent = currentAgentType;
    
    // Sample planned actions
    const sampleActions = [
        {
            id: 1,
            title: 'Install required dependencies',
            description: 'Installing numpy, pandas, and matplotlib packages using pip',
            status: 'planned',
            code: 'pip install numpy pandas matplotlib'
        },
        {
            id: 2,
            title: 'Create data processing script',
            description: 'Writing a Python script to process CSV data files',
            status: 'planned',
            code: 'import pandas as pd\nimport numpy as np\n\ndef process_data(file_path):\n    df = pd.read_csv(file_path)\n    # Clean data\n    df = df.dropna()\n    # Process data\n    df["processed_column"] = df["raw_column"] * 100\n    return df'
        }
    ];
    
    // Sample executing actions
    const sampleExecutingActions = [
        {
            id: 3,
            title: 'Analyzing data patterns',
            description: 'Running statistical analysis on the processed data',
            status: 'executing',
            progress: 45
        }
    ];
    
    // Sample completed actions
    const sampleCompletedActions = [
        {
            id: 4,
            title: 'Set up project structure',
            description: 'Created directories and initialized git repository',
            status: 'completed',
            result: 'Successfully created project structure with src, data, and docs directories'
        }
    ];
    
    // Initialize UI
    function initUI() {
        // Add sample messages
        addBotMessage('Hello! I\'m your AI assistant. How can I help you today?');
        
        // Add sample actions to tabs
        renderActions('planned-content', sampleActions);
        renderActions('executing-content', sampleExecutingActions);
        renderActions('completed-content', sampleCompletedActions);
        
        // Set up event listeners
        setupEventListeners();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Send message on button click
        sendButton.addEventListener('click', sendMessage);
        
        // Send message on Enter key (but allow Shift+Enter for new lines)
        userInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Auto-resize textarea as user types
        userInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
        
        // Tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                this.classList.add('active');
                document.getElementById(tabId + '-content').classList.add('active');
            });
        });
        
        // Agent type dropdown
        dropdown.addEventListener('click', function() {
            showAgentTypeDropdown();
        });
        
        // Footer items
        document.querySelectorAll('.footer-item').forEach(item => {
            item.addEventListener('click', function() {
                const toolName = this.querySelector('span').textContent;
                addBotMessage(`The ${toolName} tool is now active.`);
            });
        });
    }
    
    // Show agent type dropdown
    function showAgentTypeDropdown() {
        // Create dropdown element if it doesn't exist
        let dropdownMenu = document.querySelector('.agent-type-dropdown');
        
        if (dropdownMenu) {
            dropdownMenu.remove();
            return;
        }
        
        dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'agent-type-dropdown';
        
        // Add agent types to dropdown
        agentTypes.forEach(type => {
            const option = document.createElement('div');
            option.className = 'agent-type-option';
            if (type === currentAgentType) {
                option.classList.add('selected');
            }
            option.textContent = type;
            
            option.addEventListener('click', function() {
                currentAgentType = type;
                dropdown.textContent = type;
                dropdownMenu.remove();
                addBotMessage(`I'm now acting as a ${type}.`);
            });
            
            dropdownMenu.appendChild(option);
        });
        
        // Position and show dropdown
        const rect = dropdown.getBoundingClientRect();
        dropdownMenu.style.top = (rect.bottom + 5) + 'px';
        dropdownMenu.style.left = rect.left + 'px';
        
        document.body.appendChild(dropdownMenu);
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function closeDropdown(e) {
            if (!dropdown.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }
    
    // Send message
    function sendMessage() {
        const message = userInput.value.trim();
        
        if (message) {
            // Add user message to chat
            addUserMessage(message);
            
            // Clear input
            userInput.value = '';
            userInput.style.height = 'auto';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Process message (simulate AI response after delay)
            setTimeout(() => {
                processMessage(message);
            }, 1000);
        }
    }
    
    // Add user message to chat
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.textContent = message;
        
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    // Add bot message to chat
    function addBotMessage(message) {
        // Remove typing indicator if present
        removeTypingIndicator();
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot-message';
        
        // Check if message contains code (for demo purposes, we'll assume code blocks are marked with ```python, ```javascript, etc.)
        if (message.includes('```')) {
            const parts = message.split(/```(\w*)\n([\s\S]*?)```/g);
            
            for (let i = 0; i < parts.length; i++) {
                if (i % 3 === 0) {
                    // Regular text
                    if (parts[i].trim()) {
                        const textNode = document.createElement('div');
                        textNode.textContent = parts[i];
                        messageElement.appendChild(textNode);
                    }
                } else if (i % 3 === 1) {
                    // Language identifier (python, javascript, etc.)
                    // We'll use this in the next iteration
                } else if (i % 3 === 2) {
                    // Code block
                    const language = parts[i-1] || '';
                    const codeBlock = document.createElement('pre');
                    const code = document.createElement('code');
                    code.className = language ? `language-${language}` : '';
                    code.textContent = parts[i];
                    codeBlock.appendChild(code);
                    
                    // Add copy button
                    const copyButton = document.createElement('button');
                    copyButton.className = 'copy-button';
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    copyButton.addEventListener('click', function() {
                        navigator.clipboard.writeText(parts[i]);
                        copyButton.innerHTML = '<i class="fas fa-check"></i>';
                        setTimeout(() => {
                            copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                        }, 2000);
                    });
                    
                    codeBlock.appendChild(copyButton);
                    messageElement.appendChild(codeBlock);
                    
                    // Apply syntax highlighting
                    if (window.hljs) {
                        hljs.highlightElement(code);
                    }
                }
            }
        } else {
            // Regular message
            messageElement.textContent = message;
        }
        
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        removeTypingIndicator(); // Remove existing indicator if any
        
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        
        chatMessages.appendChild(indicator);
        scrollToBottom();
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    // Process message (simulate AI response)
    function processMessage(message) {
        // Simple keyword-based responses for demo
        if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
            addBotMessage(`Hello! I'm your AI assistant, currently acting as a ${currentAgentType}. How can I help you today?`);
        } else if (message.toLowerCase().includes('help')) {
            addBotMessage('I can help you with various tasks. Just tell me what you need, and I\'ll assist you!');
        } else if (message.toLowerCase().includes('code') || message.toLowerCase().includes('example')) {
            addBotMessage('Here\'s a simple Python code example:\n\n```python\ndef hello_world():\n    print("Hello, world!")\n    \n# Call the function\nhello_world()\n```\n\nYou can copy this code and run it in your Python environment.');
        } else if (message.toLowerCase().includes('plan') || message.toLowerCase().includes('task')) {
            // Add a new planned action
            const newAction = {
                id: sampleActions.length + 5,
                title: 'Analyze user requirements',
                description: 'Review the requirements document and create a summary of key points',
                status: 'planned'
            };
            
            sampleActions.push(newAction);
            renderActions('planned-content', sampleActions);
            
            addBotMessage('I\'ve added a new task to the planned actions. You can view it in the "Planned" tab.');
            
            // Highlight the planned tab
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            document.querySelector('[data-tab="planned"]').classList.add('active');
            document.getElementById('planned-content').classList.add('active');
        } else if (message.toLowerCase().includes('execute') || message.toLowerCase().includes('run')) {
            // Move first planned action to executing
            if (sampleActions.length > 0) {
                const actionToExecute = sampleActions.shift();
                actionToExecute.status = 'executing';
                actionToExecute.progress = 0;
                
                sampleExecutingActions.push(actionToExecute);
                
                renderActions('planned-content', sampleActions);
                renderActions('executing-content', sampleExecutingActions);
                
                addBotMessage(`I'm now executing the "${actionToExecute.title}" action. You can track its progress in the "Executing" tab.`);
                
                // Simulate progress updates
                let progress = 0;
                const progressInterval = setInterval(() => {
                    progress += 10;
                    actionToExecute.progress = progress;
                    
                    renderActions('executing-content', sampleExecutingActions);
                    
                    if (progress >= 100) {
                        clearInterval(progressInterval);
                        
                        // Move to completed
                        setTimeout(() => {
                            const index = sampleExecutingActions.findIndex(a => a.id === actionToExecute.id);
                            if (index !== -1) {
                                const completedAction = sampleExecutingActions.splice(index, 1)[0];
                                completedAction.status = 'completed';
                                completedAction.result = 'Task completed successfully';
                                
                                sampleCompletedActions.push(completedAction);
                                
                                renderActions('executing-content', sampleExecutingActions);
                                renderActions('completed-content', sampleCompletedActions);
                                
                                addBotMessage(`The "${completedAction.title}" action has been completed successfully.`);
                            }
                        }, 1000);
                    }
                }, 1000);
                
                // Highlight the executing tab
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                document.querySelector('[data-tab="executing"]').classList.add('active');
                document.getElementById('executing-content').classList.add('active');
            } else {
                addBotMessage('There are no planned actions to execute. You can add new tasks by mentioning "plan" or "task".');
            }
        } else {
            // Generic response
            addBotMessage('I understand you want to discuss "' + message + '". How can I assist you with this topic?');
        }
    }
    
    // Render actions in a tab
    function renderActions(containerId, actions) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        if (actions.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            
            const emptyText = document.createElement('p');
            
            if (containerId === 'planned-content') {
                emptyText.textContent = 'No planned actions yet';
            } else if (containerId === 'executing-content') {
                emptyText.textContent = 'No executing actions';
            } else {
                emptyText.textContent = 'No completed actions';
            }
            
            emptyState.appendChild(emptyText);
            container.appendChild(emptyState);
            return;
        }
        
        actions.forEach(action => {
            const actionElement = document.createElement('div');
            actionElement.className = 'action-item';
            
            const titleElement = document.createElement('div');
            titleElement.className = 'action-title';
            titleElement.textContent = action.title;
            
            const descriptionElement = document.createElement('div');
            descriptionElement.className = 'action-description';
            descriptionElement.textContent = action.description;
            
            actionElement.appendChild(titleElement);
            actionElement.appendChild(descriptionElement);
            
            // Add status-specific elements
            if (action.status === 'planned') {
                const statusElement = document.createElement('div');
                statusElement.className = 'action-status';
                statusElement.innerHTML = '<i class="fas fa-clock"></i> Planned';
                
                actionElement.appendChild(statusElement);
                
                // Add code block if present
                if (action.code) {
                    const codeBlock = document.createElement('pre');
                    const code = document.createElement('code');
                    code.className = 'language-python'; // Assuming Python for demo
                    code.textContent = action.code;
                    codeBlock.appendChild(code);
                    
                    // Add copy button
                    const copyButton = document.createElement('button');
                    copyButton.className = 'copy-button';
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    copyButton.addEventListener('click', function() {
                        navigator.clipboard.writeText(action.code);
                        copyButton.innerHTML = '<i class="fas fa-check"></i>';
                        setTimeout(() => {
                            copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                        }, 2000);
                    });
                    
                    codeBlock.appendChild(copyButton);
                    actionElement.appendChild(codeBlock);
                    
                    // Apply syntax highlighting
                    if (window.hljs) {
                        hljs.highlightElement(code);
                    }
                }
            } else if (action.status === 'executing') {
                const progressContainer = document.createElement('div');
                progressContainer.className = 'progress-container';
                
                const progressBar = document.createElement('div');
                progressBar.className = 'progress-bar';
                progressBar.style.width = `${action.progress}%`;
                
                const progressText = document.createElement('div');
                progressText.className = 'progress-text';
                progressText.textContent = `${action.progress}%`;
                
                progressContainer.appendChild(progressBar);
                progressContainer.appendChild(progressText);
                
                actionElement.appendChild(progressContainer);
            } else if (action.status === 'completed') {
                const statusElement = document.createElement('div');
                statusElement.className = 'action-status';
                statusElement.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
                
                const resultElement = document.createElement('div');
                resultElement.className = 'action-result';
                resultElement.textContent = action.result;
                
                actionElement.appendChild(statusElement);
                actionElement.appendChild(resultElement);
            }
            
            container.appendChild(actionElement);
        });
    }
    
    // Scroll chat to bottom
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Initialize UI
    initUI();
    
    // API Connection (commented out for demo)
    /*
    // Connect to Local Operator API
    async function connectToAPI() {
        try {
            const response = await fetch('http://localhost:8080/api/status');
            const data = await response.json();
            
            if (data.status === 'running') {
                console.log('Connected to Local Operator API');
                return true;
            } else {
                console.error('Local Operator API is not running');
                return false;
            }
        } catch (error) {
            console.error('Failed to connect to Local Operator API:', error);
            return false;
        }
    }
    
    // Send message to API
    async function sendMessageToAPI(message) {
        try {
            const response = await fetch('http://localhost:8080/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message
                })
            });
            
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Failed to send message to API:', error);
            return 'Sorry, I encountered an error while processing your request.';
        }
    }
    
    // Get planned actions from API
    async function getPlannedActionsFromAPI() {
        try {
            const response = await fetch('http://localhost:8080/api/actions/planned');
            const data = await response.json();
            return data.actions;
        } catch (error) {
            console.error('Failed to get planned actions from API:', error);
            return [];
        }
    }
    
    // Initialize API connection
    connectToAPI().then(connected => {
        if (connected) {
            addBotMessage('Connected to Local Operator API. Ready to assist you!');
        } else {
            addBotMessage('Failed to connect to Local Operator API. Running in demo mode.');
        }
    });
    */
});