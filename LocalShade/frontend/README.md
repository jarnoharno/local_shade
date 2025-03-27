# LocalShade Frontend

A modern, futuristic UI for the LocalShade event discovery application.

## Features

- Modern, dark-themed UI with neon green accents
- Interactive map with event markers
- Event filtering by category
- Responsive design for all screen sizes
- Animated UI elements
- User profile visualization

## Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Open `index.html` in your browser

## Development

### Structure

- `index.html` - Main HTML structure
- `css/styles.css` - Styling for the application
- `js/app.js` - JavaScript functionality

### Google Maps Integration

To use the Google Maps functionality:

1. Get a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/)
2. Replace `YOUR_API_KEY` in the `index.html` file with your actual API key

### Connecting to Backend

The frontend is designed to connect to the LocalShade backend API. To connect:

1. Modify the `loadEvents()` function in `app.js` to fetch data from your backend API
2. Update the event data structure to match your backend response

## Design

The UI is designed with a futuristic, dark theme featuring:

- Dark background (#0D0D0D)
- Neon green accents (#00FF66)
- Subtle borders and shadows
- Clean typography with the Inter font family
- Minimalist icons and controls

## Customization

You can customize the UI by modifying the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #00FF66;
    --background-color: #0D0D0D;
    --card-background: #1A1A1A;
    --text-color: #FFFFFF;
    --text-secondary: rgba(255, 255, 255, 0.7);
    --border-color: rgba(0, 255, 102, 0.3);
    --hover-color: rgba(0, 255, 102, 0.1);
    --shadow-color: rgba(0, 255, 102, 0.2);
}
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.