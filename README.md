# Local Operator UI

A modern, futuristic user interface for the [Local Operator](https://github.com/damianvtran/local-operator) project. This UI allows you to chat with the Local Operator AI assistant and view planned actions in real-time.

## Features

- **Chat Interface**: Communicate with the Local Operator AI assistant through a clean, modern chat interface
- **Planning & Execution View**: See planned, executing, and completed actions in real-time
- **Agent Type Selection**: Choose from different agent types to customize your assistant's behavior
- **Code Block Support**: View and copy code snippets with syntax highlighting
- **Dark Theme**: Sleek dark theme with neon green accents for a futuristic look
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- [Local Operator](https://github.com/damianvtran/local-operator) installed and running in server mode
- Web browser (Chrome, Firefox, Safari, or Edge)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/local-operator-ui.git
   cd local-operator-ui
   ```

2. Open `index.html` in your web browser or serve it using a local web server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

3. Configure the API connection:
   - By default, the UI connects to `http://localhost:8080`
   - To change the API URL, modify the `API_URL` constant in `script.js`

## Usage

### Chat Interface

- Type your message in the input box at the bottom of the chat area
- Press Enter or click the send button to send your message
- The AI assistant will respond and show any planned actions in the right panel

### Planning & Execution View

- The right panel shows actions in three tabs:
  - **Planned**: Actions that the AI is planning to execute
  - **Executing**: Actions currently being executed
  - **Completed**: Actions that have been completed

### Agent Type Selection

- Click on the "..." next to "You are a" in the header
- Select an agent type from the dropdown menu
- The AI assistant will adapt its behavior based on the selected agent type

## Connecting to Local Operator

This UI is designed to work with the Local Operator server. To connect:

1. Start the Local Operator in server mode:
   ```bash
   local-operator server
   ```

2. The UI will automatically connect to the server at `http://localhost:8080`

3. If your server is running on a different address, update the `API_URL` constant in `script.js`

## Customization

### Changing Colors

You can customize the UI colors by modifying the CSS variables in `styles.css`:

```css
:root {
    --bg-color: #121212;
    --bg-secondary: #1e1e1e;
    --bg-tertiary: #252525;
    --text-color: #e0e0e0;
    --text-secondary: #a0a0a0;
    --accent-color: #00FF66;
    --accent-hover: #00cc52;
    --border-color: #333333;
    --shadow-color: rgba(0, 0, 0, 0.5);
    --success-color: #00FF66;
    --warning-color: #FFC107;
    --error-color: #FF5252;
    --info-color: #2196F3;
}
```

### Adding Custom Agent Types

To add custom agent types, modify the `agentTypes` array in `script.js`:

```javascript
const agentTypes = [
    'Software Developer',
    'Data Scientist',
    'Research Assistant',
    'Creative Writer',
    'Task Manager',
    'Custom Agent...',
    // Add your custom agent types here
];
```

## License

This project is licensed under the GPL 3.0 License - see the LICENSE file for details.

## Acknowledgments

- [Local Operator](https://github.com/damianvtran/local-operator) for the amazing AI assistant framework
- [Font Awesome](https://fontawesome.com/) for the icons
- [Inter](https://fonts.google.com/specimen/Inter) font by Google Fonts
