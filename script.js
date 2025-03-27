document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const profileRole = document.querySelector('.profile-role');
    
    // Set initial profile role
    profileRole.textContent = 'software engineer';
    
    // Sample agent roles for demonstration
    const agentRoles = [
        'software engineer',
        'data scientist',
        'product manager',
        'UX designer',
        'AI assistant'
    ];
    
    // Function to add a message to the chat
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        messageDiv.textContent = text;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to handle sending a message
    function sendMessage() {
        const message = chatInput.value.trim();
        
        if (message) {
            // Add user message to chat
            addMessage(message, true);
            
            // Clear input
            chatInput.value = '';
            
            // Simulate agent response (in a real app, this would call an API)
            setTimeout(() => {
                const responses = [
                    "I'm analyzing your request...",
                    "Let me think about that for a moment.",
                    "I can help you with that. Here's what I found...",
                    "That's an interesting question. Based on my knowledge...",
                    "I've processed your request and here's my response..."
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse);
            }, 1000);
        }
    }
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Profile box click handler to change roles
    const profileBox = document.querySelector('.profile-box');
    profileBox.addEventListener('click', function() {
        const currentRole = profileRole.textContent;
        const currentIndex = agentRoles.indexOf(currentRole);
        const nextIndex = (currentIndex + 1) % agentRoles.length;
        
        profileRole.textContent = agentRoles[nextIndex];
    });
    
    // Add initial welcome message
    setTimeout(() => {
        addMessage("Hello! I'm your AI assistant. How can I help you today?");
    }, 500);
    
    // Footer item click handlers
    const footerItems = document.querySelectorAll('.footer-item');
    footerItems.forEach(item => {
        item.addEventListener('click', function() {
            const toolName = this.querySelector('span').textContent;
            addMessage(`You've activated the ${toolName} tool. What would you like to do?`);
        });
    });
    
    // Make the UI elements glow on hover for a futuristic effect
    const glowElements = document.querySelectorAll('.profile-box, .footer-item, #send-button');
    glowElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 10px var(--primary-color)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });
});