# Local Operator UI

A modern, futuristic user interface for the [Local Operator](https://github.com/damianvtran/local-operator) project. This UI allows users to chat with the Local Operator AI assistant and view planned actions in real-time.

![Local Operator UI](https://i.imgur.com/example.png)

## Features

- **Modern Dark Theme**: Sleek dark theme with neon green accents for a futuristic look
- **Chat Interface**: Clean, intuitive chat interface for communicating with the AI
- **Planning View**: See planned, executing, and completed actions in real-time
- **Agent Type Selection**: Choose different agent types (developer, researcher, etc.)
- **Code Block Support**: Syntax highlighting and copy functionality for code blocks
- **Responsive Design**: Works on desktop and mobile devices
- **Settings Panel**: Configure API connection, model selection, and UI preferences
- **Theme Customization**: Choose between dark and light themes with customizable accent colors

## Getting Started

### Prerequisites

- Local Operator server running (see [Local Operator repository](https://github.com/damianvtran/local-operator))
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/local-operator-ui.git
   cd local-operator-ui
   ```

2. Open the UI in your browser:
   ```bash
   # If you have Python installed
   python -m http.server 8000
   # Then open http://localhost:8000 in your browser
   
   # Or simply open the index.html file directly in your browser
   ```

3. Configure the API connection in the settings panel (gear icon)

## Usage

### Chat Interface

1. Type your message in the input box at the bottom of the chat
2. Press Enter or click the send button to send your message
3. View the AI's response in the chat window

### Planning View

1. Click the "Planning" tab to view the planning interface
2. See actions categorized as "Planned", "Executing", or "Completed"
3. The planning view automatically updates as actions progress

### Settings

1. Click the gear icon next to "You are a..." to open the settings panel
2. Configure API connection details (URL, API key)
3. Select model and hosting options
4. Customize UI theme and accent color

## API Integration

The UI connects to the Local Operator API running at `http://localhost:8080` by default. You can change this in the settings panel.

### API Endpoints Used

- `/chat` - Send and receive messages
- `/planning/{conversation_id}` - Get planning status
- `/status` - Check API status

## Customization

### Changing the Theme

1. Open the settings panel (gear icon)
2. Select "Light" or "Dark" theme
3. Choose a custom accent color
4. Click "Save Settings"

### Adding New Agent Types

Edit the `index.html` file to add new agent types:

```html
<div class="agent-dropdown-content">
    <div class="agent-option" data-type="developer">developer</div>
    <div class="agent-option" data-type="researcher">researcher</div>
    <div class="agent-option" data-type="assistant">assistant</div>
    <div class="agent-option" data-type="data analyst">data analyst</div>
    <!-- Add your new agent type here -->
    <div class="agent-option" data-type="your-agent-type">your agent type</div>
</div>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the GPL-3.0 License - see the LICENSE file for details.

## Acknowledgements

- [Local Operator](https://github.com/damianvtran/local-operator) by Damian Tran
- [Highlight.js](https://highlightjs.org/) for code syntax highlighting
- [Marked.js](https://marked.js.org/) for Markdown parsing