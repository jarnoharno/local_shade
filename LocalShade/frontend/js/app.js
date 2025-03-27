// LocalShade Frontend Application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

// Global variables
let map;
let markers = [];
let eventData = [];
let activeFilters = new Set();

// Initialize the application
function initApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Fetch mock data for development
    fetchMockData();
}

// Initialize Google Maps
function initMap() {
    // Default center (Berlin)
    const center = { lat: 52.520008, lng: 13.404954 };
    
    // Create map instance
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 13,
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: false,
    });
    
    // Add event listeners for map controls
    document.querySelector('.zoom-in').addEventListener('click', () => {
        map.setZoom(map.getZoom() + 1);
    });
    
    document.querySelector('.zoom-out').addEventListener('click', () => {
        map.setZoom(map.getZoom() - 1);
    });
    
    // When map is ready, load events
    google.maps.event.addListenerOnce(map, 'idle', () => {
        loadEvents();
    });
}

// Set up event listeners
function setupEventListeners() {
    // Filter items click event
    document.querySelectorAll('.filter-item').forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            toggleFilter(category, this);
        });
    });
    
    // Footer items click event
    document.querySelectorAll('.footer-item').forEach(item => {
        item.addEventListener('click', function() {
            // Add pulse animation
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 2000);
        });
    });
}

// Toggle filter
function toggleFilter(category, element) {
    if (activeFilters.has(category)) {
        activeFilters.delete(category);
        element.classList.remove('active');
    } else {
        activeFilters.add(category);
        element.classList.add('active');
    }
    
    // Update displayed events
    filterEvents();
}

// Filter events based on active filters
function filterEvents() {
    // If no filters active, show all events
    if (activeFilters.size === 0) {
        showAllEvents();
        return;
    }
    
    // Filter markers on map
    markers.forEach(marker => {
        const category = marker.category;
        if (activeFilters.has(category)) {
            marker.setVisible(true);
        } else {
            marker.setVisible(false);
        }
    });
    
    // Filter event list
    const eventItems = document.querySelectorAll('.event-item');
    eventItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (activeFilters.has(category)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Show all events
function showAllEvents() {
    // Show all markers
    markers.forEach(marker => {
        marker.setVisible(true);
    });
    
    // Show all event items
    const eventItems = document.querySelectorAll('.event-item');
    eventItems.forEach(item => {
        item.style.display = 'block';
    });
}

// Load events from API
function loadEvents() {
    // In a real application, this would fetch from the backend API
    // For now, we'll use the mock data
    displayEvents(eventData);
}

// Display events on map and in list
function displayEvents(events) {
    // Clear existing markers
    clearMarkers();
    
    // Clear event list
    const eventList = document.querySelector('.event-items');
    eventList.innerHTML = '';
    
    // Add events to map and list
    events.forEach(event => {
        // Add marker to map
        addMarker(event);
        
        // Add event to list
        addEventToList(event);
    });
}

// Add marker to map
function addMarker(event) {
    const marker = new google.maps.Marker({
        position: { lat: parseFloat(event.latitude), lng: parseFloat(event.longitude) },
        map: map,
        title: event.event_name,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: getCategoryColor(event.category_name),
            fillOpacity: 0.8,
            strokeWeight: 0,
            scale: 8
        },
        category: event.category_name
    });
    
    // Add click event to marker
    marker.addListener('click', () => {
        showEventDetails(event);
    });
    
    // Store marker reference
    markers.push(marker);
}

// Add event to list
function addEventToList(event) {
    const eventList = document.querySelector('.event-items');
    
    const eventItem = document.createElement('div');
    eventItem.className = 'event-item';
    eventItem.setAttribute('data-category', event.category_name);
    
    eventItem.innerHTML = `
        <div class="event-title">${event.event_name}</div>
        <div class="event-category">
            <span class="color-dot" style="background-color: ${getCategoryColor(event.category_name)};"></span>
            ${event.category_name}
        </div>
        <div class="event-location">${event.venue}</div>
    `;
    
    // Add click event to show details
    eventItem.addEventListener('click', () => {
        showEventDetails(event);
    });
    
    eventList.appendChild(eventItem);
}

// Show event details
function showEventDetails(event) {
    // In a real application, this would show a modal with event details
    console.log('Event details:', event);
    
    // Center map on event
    map.setCenter({ lat: parseFloat(event.latitude), lng: parseFloat(event.longitude) });
    map.setZoom(15);
}

// Clear all markers from map
function clearMarkers() {
    markers.forEach(marker => {
        marker.setMap(null);
    });
    markers = [];
}

// Get color for category
function getCategoryColor(category) {
    const colors = {
        "Music": "#02B1E1",
        "Business & Professional": "#DE0F30",
        "Food & Drink": "#738847",
        "Community & Culture": "#F8E83A",
        "Performing & Visual Arts": "#D0BEFB",
        "Film, Media & Entertainment": "#4E2F83",
        "Sports & Fitness": "#AC3634",
        "Health & Wellness": "#D0C59D",
        "Science & Technology": "#393B4E",
        "Travel & Outdoor": "#3D7A5F",
        "Charity & Causes": "#7D166E",
        "Religion & Spirituality": "#974522",
        "Family & Education": "#DEC1C8",
        "Seasonal & Holiday": "#BF0A4E",
        "Government & Politics": "#FF591D",
        "Fashion & Beauty": "#F04B83",
        "Home & Lifestyle": "#1AF206",
        "Auto, Boat & Air": "#020540",
        "Hobbies & Special Interest": "#F8CD75",
        "Arts": "#D0BEFB",
        "Other": "#FB3214"
    };
    
    return colors[category] || "#FB3214";
}

// Fetch mock data for development
function fetchMockData() {
    // In a real application, this would be fetched from the backend API
    eventData = [
        {
            event_name: "Berlin Tech Meetup",
            category_name: "Science & Technology",
            venue: "Factory Berlin",
            latitude: "52.5308",
            longitude: "13.3847",
            venue_id: 1
        },
        {
            event_name: "Summer Jazz Festival",
            category_name: "Music",
            venue: "Tiergarten Park",
            latitude: "52.5163",
            longitude: "13.3777",
            venue_id: 2
        },
        {
            event_name: "Food & Wine Expo",
            category_name: "Food & Drink",
            venue: "Messe Berlin",
            latitude: "52.5015",
            longitude: "13.2726",
            venue_id: 3
        },
        {
            event_name: "Berlin Marathon",
            category_name: "Sports & Fitness",
            venue: "Brandenburg Gate",
            latitude: "52.5163",
            longitude: "13.3777",
            venue_id: 4
        },
        {
            event_name: "Art Exhibition",
            category_name: "Arts",
            venue: "Hamburger Bahnhof",
            latitude: "52.5287",
            longitude: "13.3726",
            venue_id: 5
        },
        {
            event_name: "Startup Pitch Night",
            category_name: "Business & Professional",
            venue: "Betahaus",
            latitude: "52.5025",
            longitude: "13.4121",
            venue_id: 6
        },
        {
            event_name: "Community Garden Day",
            category_name: "Community & Culture",
            venue: "Prinzessinnengarten",
            latitude: "52.5038",
            longitude: "13.4199",
            venue_id: 7
        },
        {
            event_name: "Yoga in the Park",
            category_name: "Health & Wellness",
            venue: "Mauerpark",
            latitude: "52.5408",
            longitude: "13.4021",
            venue_id: 8
        }
    ];
}

// Custom map styles for dark theme
const mapStyles = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#757575"
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#181818"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1b1b1b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#2c2c2c"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8a8a8a"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#373737"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3c3c3c"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#3d3d3d"
            }
        ]
    }
];