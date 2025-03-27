document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    
    // Sample agent types for the dropdown
    const agentTypes = [
        'Software Developer',
        'Data Scientist',
        'Research Assistant',
        'Creative Writer',
        'Math Tutor',
        'Language Translator'
    ];
    
    // API endpoint (replace with actual endpoint when connecting to backend)
    const API_ENDPOINT = 'http://localhost:8080/api/chat';
    
    // Initialize with a welcome message
    addBotMessage('Hello! I am your Local Operator assistant. How can I help you today?');
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Setup profile dropdown
    const profileDropdown = document.querySelector('.profile-dropdown');
    profileDropdown.addEventListener('click', toggleAgentTypeMenu);
    
    // Setup footer items
    const footerItems = document.querySelectorAll('.footer-item');
    footerItems.forEach(item => {
        item.addEventListener('click', function() {
            const toolType = this.querySelector('span').textContent;
            handleToolSelection(toolType);
        });
    });
    
    // Functions
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addUserMessage(message);
            chatInput.value = '';
            
            // Simulate typing indicator
            const typingIndicator = addTypingIndicator();
            
            // Simulate API call (replace with actual API call)
            setTimeout(() => {
                removeTypingIndicator(typingIndicator);
                processUserMessage(message);
            }, 1000);
        }
    }
    
    function processUserMessage(message) {
        // In a real implementation, this would call the backend API
        // For now, we'll simulate responses
        
        if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
            addBotMessage('Hello! How can I assist you today?');
        } else if (message.toLowerCase().includes('help')) {
            addBotMessage('I can help you with various tasks. Just tell me what you need!');
        } else if (message.toLowerCase().includes('code') || message.toLowerCase().includes('python')) {
            addBotMessage('Here\'s a sample Python code snippet:\n```python\ndef hello_world():\n    print("Hello, world!")\n\nhello_world()\n```\nYou can run this code on your local machine through me.');
        } else if (message.toLowerCase().includes('tool')) {
            addBotMessage('I have several tools available:\n- Web search\n- Code execution\n- File management\n- Image generation\n\nWhich one would you like to use?');
        } else {
            // In a real implementation, this would call the API
            callChatAPI(message);
        }
    }
    
    function callChatAPI(message) {
        // Simulate API response for now
        // In a real implementation, this would be an actual fetch call
        
        /*
        fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            addBotMessage(data.response);
        })
        .catch(error => {
            console.error('Error:', error);
            addBotMessage('Sorry, there was an error processing your request.');
        });
        */
        
        // For demo purposes, simulate a response
        const responses = [
            'I understand your request. Let me think about how to approach this...',
            'That\'s an interesting question. Based on my knowledge, I would suggest...',
            'I can help with that. First, we need to break this down into steps...',
            'Let me execute some code to solve this problem for you.',
            'I\'ve analyzed your request and here\'s what I found...'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addBotMessage(randomResponse);
    }
    
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'user-message');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'bot-message');
        
        // Check if message contains code block
        if (message.includes('```')) {
            const parts = message.split(/```(?:(\w+)\n)?/);
            let html = '';
            
            for (let i = 0; i < parts.length; i++) {
                if (i % 2 === 0) {
                    // Regular text
                    html += parts[i].replace(/\n/g, '<br>');
                } else {
                    // Code block
                    const language = parts[i-1] || '';
                    const code = parts[i+1] || '';
                    html += `<pre><code class="language-${language}">${code}</code></pre>`;
                    i++; // Skip the code content as we've already processed it
                }
            }
            
            messageElement.innerHTML = html;
        } else {
            messageElement.textContent = message;
        }
        
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    function addTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.classList.add('message', 'bot-message', 'typing-indicator');
        typingElement.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typingElement);
        scrollToBottom();
        return typingElement;
    }
    
    function removeTypingIndicator(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }
    
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function toggleAgentTypeMenu() {
        // Check if menu already exists
        let menu = document.querySelector('.agent-type-menu');
        
        if (menu) {
            menu.remove();
            return;
        }
        
        // Create menu
        menu = document.createElement('div');
        menu.classList.add('agent-type-menu');
        menu.style.position = 'absolute';
        menu.style.top = '60px';
        menu.style.right = '20px';
        menu.style.backgroundColor = 'var(--bg-secondary)';
        menu.style.border = '1px solid var(--border-color)';
        menu.style.borderRadius = '5px';
        menu.style.zIndex = '100';
        menu.style.width = '200px';
        
        // Add agent types
        agentTypes.forEach(type => {
            const item = document.createElement('div');
            item.textContent = type;
            item.style.padding = '10px 15px';
            item.style.cursor = 'pointer';
            item.style.transition = 'background-color 0.3s';
            
            item.addEventListener('mouseover', function() {
                this.style.backgroundColor = 'var(--accent-color-transparent)';
            });
            
            item.addEventListener('mouseout', function() {
                this.style.backgroundColor = '';
            });
            
            item.addEventListener('click', function() {
                selectAgentType(type);
                menu.remove();
            });
            
            menu.appendChild(item);
        });
        
        document.querySelector('.app-container').appendChild(menu);
        
        // Close menu when clicking outside
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !profileDropdown.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }
    
    function selectAgentType(type) {
        document.querySelector('.profile-dropdown span').textContent = `You are a ${type}`;
        addBotMessage(`I'm now operating as a ${type}. How can I assist you in this role?`);
    }
    
    function handleToolSelection(toolType) {
        switch(toolType.toLowerCase()) {
            case 'unified api':
                addBotMessage('Unified API tools are now active. You can interact with various APIs through me.');
                break;
            case 'memory':
                addBotMessage('Memory tools are now active. I can help you store and retrieve information across sessions.');
                break;
            case 'llm':
                addBotMessage('Language Model tools are now active. You can customize my behavior or use different models.');
                break;
            case 'tools':
                addBotMessage('Tool selection is now active. Available tools include:\n- Web search\n- Code execution\n- File management\n- Image generation');
                break;
            default:
                addBotMessage(`${toolType} tools are now active.`);
        }
    }
});