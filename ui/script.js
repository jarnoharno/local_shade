/**
 * Local Operator UI
 * Main script file for the Local Operator UI
 */

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const currentAgentType = document.getElementById('current-agent-type');
const agentOptions = document.querySelectorAll('.agent-option');
const settingsBtn = document.querySelector('.settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeModal = document.querySelector('.close-modal');
const saveSettings = document.getElementById('save-settings');
const apiUrlInput = document.getElementById('api-url');
const apiKeyInput = document.getElementById('api-key');
const modelSelect = document.getElementById('model-select');
const hostingSelect = document.getElementById('hosting-select');
const themeSelect = document.getElementById('theme-select');
const accentColorInput = document.getElementById('accent-color');
const tabs = document.querySelectorAll('.tab');
const tabPanes = document.querySelectorAll('.tab-pane');
const plannedActions = document.getElementById('planned-actions');
const executingActions = document.getElementById('executing-actions');
const completedActions = document.getElementById('completed-actions');

// Sample data for demonstration
const sampleMessages = [
    {
        role: 'agent',
        content: 'Hello! I\'m your Local Operator assistant. How can I help you today?',
        timestamp: new Date().toISOString()
    }
];

const sampleActions = {
    planned: [
        {
            id: 'action-1',
            title: 'Create project structure',
            description: 'Setting up the basic folder structure for the project',
            status: 'planned'
        },
        {
            id: 'action-2',
            title: 'Initialize git repository',
            description: 'Creating a new git repository and adding initial files',
            status: 'planned'
        }
    ],
    executing: [
        {
            id: 'action-3',
            title: 'Install dependencies',
            description: 'Installing required npm packages for the project',
            status: 'executing'
        }
    ],
    completed: [
        {
            id: 'action-4',
            title: 'Create package.json',
            description: 'Generated package.json file with project configuration',
            status: 'completed'
        }
    ]
};

// State
let isTyping = false;
let planningInterval = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    loadSettings();
    renderMessages(sampleMessages);
    renderActions();
    
    // Initialize API connection
    apiConnector.initialize().then(success => {
        if (!success) {
            showApiConnectionError();
        }
    });
});

/**
 * Initialize the UI
 */
function initializeUI() {
    // Set up event listeners
    sendButton.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    
    agentOptions.forEach(option => {
        option.addEventListener('click', () => {
            currentAgentType.textContent = option.dataset.type;
        });
    });
    
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'block';
    });
    
    closeModal.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });
    
    saveSettings.addEventListener('click', saveSettingsHandler);
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active tab pane
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(`${tabName}-tab`).classList.add('active');
            
            // Start polling for planning status if on planning tab
            if (tabName === 'planning') {
                startPlanningPolling();
            } else {
                stopPlanningPolling();
            }
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
    
    // Set initial agent type
    currentAgentType.textContent = 'developer';
}

/**
 * Load settings from localStorage
 */
function loadSettings() {
    const config = apiConnector.getConfig();
    
    apiUrlInput.value = config.apiUrl;
    apiKeyInput.value = config.apiKey;
    modelSelect.value = config.model;
    hostingSelect.value = config.hosting;
    
    // Load theme settings
    const theme = localStorage.getItem('theme') || 'dark';
    themeSelect.value = theme;
    
    const accentColor = localStorage.getItem('accentColor') || '#00FF66';
    accentColorInput.value = accentColor;
    
    // Apply theme
    applyTheme(theme, accentColor);
}

/**
 * Save settings to localStorage
 */
function saveSettingsHandler() {
    const config = {
        apiUrl: apiUrlInput.value,
        apiKey: apiKeyInput.value,
        model: modelSelect.value,
        hosting: hostingSelect.value
    };
    
    apiConnector.updateConfig(config);
    
    // Save theme settings
    const theme = themeSelect.value;
    localStorage.setItem('theme', theme);
    
    const accentColor = accentColorInput.value;
    localStorage.setItem('accentColor', accentColor);
    
    // Apply theme
    applyTheme(theme, accentColor);
    
    // Close modal
    settingsModal.style.display = 'none';
}

/**
 * Apply theme to the UI
 * @param {string} theme - The theme to apply (dark or light)
 * @param {string} accentColor - The accent color to apply
 */
function applyTheme(theme, accentColor) {
    const root = document.documentElement;
    
    if (theme === 'dark') {
        root.style.setProperty('--bg-color', '#121212');
        root.style.setProperty('--bg-color-secondary', '#1e1e1e');
        root.style.setProperty('--bg-color-tertiary', '#2a2a2a');
        root.style.setProperty('--text-color', '#e0e0e0');
        root.style.setProperty('--text-color-secondary', '#a0a0a0');
        root.style.setProperty('--border-color', '#333333');
    } else {
        root.style.setProperty('--bg-color', '#f5f5f5');
        root.style.setProperty('--bg-color-secondary', '#e5e5e5');
        root.style.setProperty('--bg-color-tertiary', '#d5d5d5');
        root.style.setProperty('--text-color', '#333333');
        root.style.setProperty('--text-color-secondary', '#666666');
        root.style.setProperty('--border-color', '#cccccc');
    }
    
    root.style.setProperty('--accent-color', accentColor);
    root.style.setProperty('--accent-color-transparent', `${accentColor}1a`); // 10% opacity
    root.style.setProperty('--accent-color-hover', `${accentColor}33`); // 20% opacity
    root.style.setProperty('--accent-color-active', `${accentColor}4d`); // 30% opacity
}

/**
 * Handle sending a message
 */
function handleSendMessage() {
    const message = chatInput.value.trim();
    
    if (!message || isTyping) {
        return;
    }
    
    // Add user message to UI
    const userMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
    };
    
    addMessage(userMessage);
    chatInput.value = '';
    
    // Send message to API
    apiConnector.sendMessage(
        message,
        handleApiResponse,
        handleApiError,
        setTypingIndicator
    );
}

/**
 * Handle API response
 * @param {object} data - The response data
 */
function handleApiResponse(data) {
    // Add agent message to UI
    const agentMessage = {
        role: 'agent',
        content: data.response,
        timestamp: new Date().toISOString()
    };
    
    addMessage(agentMessage);
    
    // Update planning status if available
    if (data.planning) {
        updatePlanningStatus(data.planning);
    }
}

/**
 * Handle API error
 * @param {string} error - The error message
 */
function handleApiError(error) {
    // Add error message to UI
    const errorMessage = {
        role: 'error',
        content: `Error: ${error}`,
        timestamp: new Date().toISOString()
    };
    
    addMessage(errorMessage);
}

/**
 * Show API connection error
 */
function showApiConnectionError() {
    const errorMessage = {
        role: 'error',
        content: 'Could not connect to the Local Operator API. Please check your settings and make sure the server is running.',
        timestamp: new Date().toISOString()
    };
    
    addMessage(errorMessage);
}

/**
 * Set typing indicator
 * @param {boolean} typing - Whether the agent is typing
 */
function setTypingIndicator(typing) {
    isTyping = typing;
    
    const typingIndicator = document.querySelector('.typing-indicator');
    
    if (typing) {
        if (!typingIndicator) {
            const indicator = document.createElement('div');
            indicator.className = 'typing-indicator';
            indicator.innerHTML = '<span></span><span></span><span></span>';
            chatMessages.appendChild(indicator);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    } else {
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}

/**
 * Add a message to the chat
 * @param {object} message - The message to add
 */
function addMessage(message) {
    const messageElement = createMessageElement(message);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Create a message element
 * @param {object} message - The message data
 * @returns {HTMLElement} The message element
 */
function createMessageElement(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.role}`;
    
    const contentElement = document.createElement('div');
    contentElement.className = 'message-content';
    
    // Process markdown and code blocks
    contentElement.innerHTML = processMessageContent(message.content);
    
    const timeElement = document.createElement('div');
    timeElement.className = 'message-time';
    timeElement.textContent = formatTimestamp(message.timestamp);
    
    messageElement.appendChild(contentElement);
    messageElement.appendChild(timeElement);
    
    // Add copy buttons to code blocks
    setTimeout(() => {
        messageElement.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
            addCopyButton(block.parentElement);
        });
    }, 0);
    
    return messageElement;
}

/**
 * Process message content (markdown and code blocks)
 * @param {string} content - The message content
 * @returns {string} The processed content
 */
function processMessageContent(content) {
    // Configure marked.js
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true
    });
    
    return marked.parse(content);
}

/**
 * Add a copy button to a code block
 * @param {HTMLElement} pre - The pre element containing the code block
 */
function addCopyButton(pre) {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'Copy';
    
    button.addEventListener('click', () => {
        const code = pre.querySelector('code');
        navigator.clipboard.writeText(code.textContent).then(() => {
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        });
    });
    
    pre.appendChild(button);
}

/**
 * Format a timestamp
 * @param {string} timestamp - The timestamp to format
 * @returns {string} The formatted timestamp
 */
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Render messages
 * @param {array} messages - The messages to render
 */
function renderMessages(messages) {
    chatMessages.innerHTML = '';
    messages.forEach(message => {
        addMessage(message);
    });
}

/**
 * Render actions
 */
function renderActions() {
    renderActionList(plannedActions, sampleActions.planned);
    renderActionList(executingActions, sampleActions.executing);
    renderActionList(completedActions, sampleActions.completed);
}

/**
 * Render an action list
 * @param {HTMLElement} container - The container element
 * @param {array} actions - The actions to render
 */
function renderActionList(container, actions) {
    container.innerHTML = '';
    
    if (actions.length === 0) {
        const emptyElement = document.createElement('div');
        emptyElement.className = 'empty-message';
        emptyElement.textContent = 'No actions';
        container.appendChild(emptyElement);
        return;
    }
    
    actions.forEach(action => {
        const actionElement = createActionElement(action);
        container.appendChild(actionElement);
    });
}

/**
 * Create an action element
 * @param {object} action - The action data
 * @returns {HTMLElement} The action element
 */
function createActionElement(action) {
    const actionElement = document.createElement('div');
    actionElement.className = 'action-item';
    actionElement.id = action.id;
    
    const headerElement = document.createElement('div');
    headerElement.className = 'action-header';
    
    const titleElement = document.createElement('div');
    titleElement.className = 'action-title';
    titleElement.textContent = action.title;
    
    const statusElement = document.createElement('div');
    statusElement.className = 'action-status';
    statusElement.textContent = action.status;
    
    headerElement.appendChild(titleElement);
    headerElement.appendChild(statusElement);
    
    const descriptionElement = document.createElement('div');
    descriptionElement.className = 'action-description';
    descriptionElement.textContent = action.description;
    
    actionElement.appendChild(headerElement);
    actionElement.appendChild(descriptionElement);
    
    return actionElement;
}

/**
 * Start polling for planning status
 */
function startPlanningPolling() {
    if (planningInterval) {
        clearInterval(planningInterval);
    }
    
    // Poll immediately
    updatePlanningFromApi();
    
    // Then poll every 5 seconds
    planningInterval = setInterval(updatePlanningFromApi, 5000);
}

/**
 * Stop polling for planning status
 */
function stopPlanningPolling() {
    if (planningInterval) {
        clearInterval(planningInterval);
        planningInterval = null;
    }
}

/**
 * Update planning from API
 */
function updatePlanningFromApi() {
    apiConnector.getPlanningStatus(
        updatePlanningStatus,
        error => console.error('Planning status error:', error)
    );
}

/**
 * Update planning status
 * @param {object} planning - The planning data
 */
function updatePlanningStatus(planning) {
    if (!planning) {
        return;
    }
    
    renderActionList(plannedActions, planning.planned || []);
    renderActionList(executingActions, planning.executing || []);
    renderActionList(completedActions, planning.completed || []);
}