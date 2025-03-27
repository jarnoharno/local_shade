# Local Operator UI

A modern, futuristic UI for the Local Operator project. This UI provides a clean, dark-themed interface with neon green accents for interacting with the Local Operator AI assistant.

## Features

- **Modern Dark Theme**: Sleek dark interface with neon green accents (#00FF66)
- **Agent Type Selection**: Choose from different agent personas
- **Chat Interface**: Interactive chat with support for code blocks and markdown
- **Tool Selection**: Quick access to different tool categories
- **Responsive Design**: Works on desktop and mobile devices

## Files

- `index.html` - Main HTML structure
- `styles.css` - CSS styling with dark theme
- `script.js` - JavaScript for UI interactions and API communication

## Usage

1. Clone this repository
2. Open `index.html` in a web browser to use the standalone UI
3. To connect to a Local Operator backend:
   - Uncomment the API fetch code in `script.js`
   - Update the `API_ENDPOINT` variable to point to your Local Operator server

## Connecting to Local Operator Backend

To connect this UI to a running Local Operator backend:

1. Start the Local Operator server:
   ```
   local-operator server
   ```

2. Update the API endpoint in `script.js`:
   ```javascript
   const API_ENDPOINT = 'http://localhost:8080/api/chat';
   ```

3. Uncomment the fetch API code in the `callChatAPI` function

## Customization

You can customize the UI by modifying the CSS variables in `styles.css`:

```css
:root {
    --bg-color: #121212;
    --bg-secondary: #1e1e1e;
    --text-color: #ffffff;
    --accent-color: #00FF66;
    --accent-color-transparent: rgba(0, 255, 102, 0.1);
    --border-color: #333333;
    --header-height: 60px;
    --footer-height: 60px;
}
```

## Screenshots

![Local Operator UI](screenshot.png)

## License

This UI is released under the GPL 3.0 license, matching the Local Operator project.