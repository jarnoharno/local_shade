// LocalShade API Connector

class LocalShadeAPI {
    constructor(baseUrl = '/api') {
        this.baseUrl = baseUrl;
    }

    /**
     * Get events within a geographic boundary
     * @param {Object} bounds - Geographic boundaries
     * @param {Object} bounds.topRight - Top right coordinates
     * @param {Object} bounds.bottomLeft - Bottom left coordinates
     * @returns {Promise<Array>} - Array of events
     */
    async getEvents(bounds) {
        try {
            const response = await fetch(`${this.baseUrl}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bounds),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            return this.formatEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    }

    /**
     * Format events from API response to frontend format
     * @param {Array} data - Raw API response
     * @returns {Array} - Formatted events
     */
    formatEvents(data) {
        // The backend returns data in a specific format that needs to be transformed
        // for the frontend to use
        try {
            const categories = data[0];
            const dataPoints = data[1];
            
            // Create a map of category indices to names
            const categoryMap = {};
            categories.forEach(category => {
                categoryMap[category[1]] = category[0];
            });
            
            // Transform data points to event objects
            return dataPoints.map(point => {
                return {
                    latitude: point[0],
                    longitude: point[1],
                    category_name: categoryMap[point[2]],
                    // These fields would come from additional API calls in a real implementation
                    event_name: `Event at ${point[0]}, ${point[1]}`,
                    venue: 'Unknown Venue',
                    venue_id: 0
                };
            });
        } catch (error) {
            console.error('Error formatting events:', error);
            return [];
        }
    }

    /**
     * Get event details by ID
     * @param {number} eventId - Event ID
     * @returns {Promise<Object>} - Event details
     */
    async getEventDetails(eventId) {
        try {
            const response = await fetch(`${this.baseUrl}/events/${eventId}`);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching event details:', error);
            return null;
        }
    }

    /**
     * Get venue details by ID
     * @param {number} venueId - Venue ID
     * @returns {Promise<Object>} - Venue details
     */
    async getVenueDetails(venueId) {
        try {
            const response = await fetch(`${this.baseUrl}/venues/${venueId}`);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching venue details:', error);
            return null;
        }
    }

    /**
     * Get all event categories
     * @returns {Promise<Array>} - Array of categories
     */
    async getCategories() {
        try {
            const response = await fetch(`${this.baseUrl}/categories`);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }
}

// Export the API class
window.LocalShadeAPI = LocalShadeAPI;