# Local Operator UI

A modern, futuristic UI for the [Local Operator](https://github.com/damianvtran/local-operator) project. This UI allows you to interact with the Local Operator AI assistant through a clean, intuitive interface.

## Features

- **Chat Interface**: Communicate with the AI assistant through a modern chat interface
- **Planning View**: See planned, executing, and completed actions in real-time
- **Agent Type Selection**: Choose different agent types for different tasks
- **Code Block Support**: Syntax highlighting and copy functionality for code blocks
- **Dark Theme**: Sleek dark theme with neon green accents
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- A running Local Operator server (see [Local Operator repository](https://github.com/damianvtran/local-operator))
- A modern web browser

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/local-operator-ui.git
   cd local-operator-ui
   ```

2. Open `index.html` in your web browser or serve it using a simple HTTP server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

3. Navigate to the UI in your browser (e.g., `http://localhost:8000`).

### Connecting to the Local Operator API

By default, the UI is configured to connect to a Local Operator server running at `http://localhost:8080`. If your server is running at a different address, you can modify the `baseUrl` in the `api_connector.js` file.

## Usage

### Chat Interface

- Type your message in the input box at the bottom of the chat interface
- Press Enter or click the send button to send your message
- The AI assistant will respond with text, code blocks, or other content

### Planning View

- Click on the "Planning" tab to view the current actions
- See planned actions that the AI assistant is going to execute
- Monitor currently executing actions
- Review completed actions

### Agent Type Selection

- Click on the "..." next to "You are a" to select a different agent type
- Choose from Developer, Data Scientist, Researcher, or Assistant

## Customization

### Changing the Theme

You can customize the theme by modifying the CSS variables in the `styles.css` file:

```css
:root {
    --bg-color: #121212;
    --bg-secondary: #1e1e1e;
    --bg-tertiary: #2a2a2a;
    --text-color: #e0e0e0;
    --text-secondary: #a0a0a0;
    --accent-color: #00FF66;
    --accent-color-dark: #00cc52;
    --accent-color-light: #66ffaa;
    --border-color: #333333;
    --shadow-color: rgba(0, 0, 0, 0.3);
    --message-user-bg: #2a2a2a;
    --message-system-bg: #1e1e1e;
    --message-error-bg: #3a1c1c;
}
```

### Adding New Agent Types

To add new agent types, modify the dropdown items in the `index.html` file:

```html
<div class="dropdown-content">
    <div class="dropdown-item" data-value="developer">Developer</div>
    <div class="dropdown-item" data-value="data-scientist">Data Scientist</div>
    <div class="dropdown-item" data-value="researcher">Researcher</div>
    <div class="dropdown-item" data-value="assistant">Assistant</div>
    <!-- Add your new agent type here -->
    <div class="dropdown-item" data-value="your-agent-type">Your Agent Type</div>
</div>
```

## API Integration

The UI is designed to work with the Local Operator API. The API connector is implemented in the `api_connector.js` file and provides methods for:

- Sending messages to the AI assistant
- Getting the current actions
- Getting and setting the agent type
- Managing the conversation history

To use the API connector, uncomment the relevant code in the `script.js` file and modify it to fit your needs.

## License

This project is licensed under the GPL 3.0 License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Local Operator](https://github.com/damianvtran/local-operator) - The AI agent assistant that powers this UI
- [Font Awesome](https://fontawesome.com/) - Icons used in the UI
- [highlight.js](https://highlightjs.org/) - Syntax highlighting for code blocks
