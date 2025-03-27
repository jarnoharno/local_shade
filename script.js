document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const profileBox = document.querySelector('.profile-box');
    const footerItems = document.querySelectorAll('.footer-item');
    
    // Agent types for dropdown
    const agentTypes = [
        'Software Engineer',
        'Data Scientist',
        'DevOps Engineer',
        'Security Analyst',
        'Product Manager'
    ];
    
    let currentAgentType = 0;
    
    // Initialize with a welcome message
    addBotMessage('Hello! I am your AI assistant. How can I help you today?');
    
    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    profileBox.addEventListener('click', function() {
        currentAgentType = (currentAgentType + 1) % agentTypes.length;
        document.querySelector('.profile-label').textContent = `You are a ${agentTypes[currentAgentType]}`;
        
        // Notify the user about the role change
        addBotMessage(`I've switched to ${agentTypes[currentAgentType]} mode. How can I assist you with ${agentTypes[currentAgentType].toLowerCase()} tasks?`);
    });
    
    // Add click events to footer items
    footerItems.forEach(item => {
        item.addEventListener('click', function() {
            const toolName = this.querySelector('span').textContent;
            addBotMessage(`You've activated the ${toolName} tool. What would you like to do with it?`);
        });
    });
    
    // Functions
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addUserMessage(message);
            chatInput.value = '';
            
            // Simulate AI response (in a real app, this would call an API)
            setTimeout(() => {
                processUserMessage(message);
            }, 1000);
        }
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
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function processUserMessage(message) {
        // Simple response logic based on keywords
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            addBotMessage(`Hello! I'm your ${agentTypes[currentAgentType]} assistant. How can I help you today?`);
        } 
        else if (lowerMessage.includes('help')) {
            addBotMessage(`As a ${agentTypes[currentAgentType]}, I can help you with various tasks. Just let me know what you need!`);
        }
        else if (lowerMessage.includes('api') || lowerMessage.includes('unified')) {
            addBotMessage('The unified API allows you to connect to various services and data sources. What would you like to connect to?');
        }
        else if (lowerMessage.includes('memory')) {
            addBotMessage('The memory system allows me to remember our conversation context and important information. Is there something specific you want me to remember?');
        }
        else if (lowerMessage.includes('llm')) {
            addBotMessage('The language model can be configured to use different AI models with various capabilities. Would you like to change the current model?');
        }
        else if (lowerMessage.includes('tool')) {
            addBotMessage('I have various tools available for different tasks. These include code analysis, data visualization, and more. Which tool would you like to use?');
        }
        else if (lowerMessage.includes('code') || lowerMessage.includes('program')) {
            const codeResponse = `Here's a simple example based on your ${agentTypes[currentAgentType]} role:\n\n` +
                `function calculateMetrics(data) {\n` +
                `  const result = data.map(item => {\n` +
                `    return {\n` +
                `      id: item.id,\n` +
                `      score: item.value * 1.5\n` +
                `    };\n` +
                `  });\n` +
                `  return result;\n` +
                `}`;
            addBotMessage(codeResponse);
        }
        else {
            // Default response
            addBotMessage(`I understand you're asking about "${message}". As your ${agentTypes[currentAgentType]} assistant, I'll help you with that. What specific information do you need?`);
        }
    }
    
    // Add some visual effects
    document.querySelectorAll('svg').forEach(svg => {
        svg.addEventListener('mouseover', function() {
            const paths = this.querySelectorAll('path');
            paths.forEach(path => {
                const originalStroke = path.getAttribute('stroke');
                path.setAttribute('data-original-stroke', originalStroke);
                path.setAttribute('stroke', '#FFFFFF');
            });
        });
        
        svg.addEventListener('mouseout', function() {
            const paths = this.querySelectorAll('path');
            paths.forEach(path => {
                const originalStroke = path.getAttribute('data-original-stroke');
                path.setAttribute('stroke', originalStroke);
            });
        });
    });
});