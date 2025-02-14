# CAS4 frontend
A React frontend application for the Alert CAS project

<img src="https://avatars.githubusercontent.com/u/175958109?s=100&v=4" alt="Logo" align="right"/>

This repository contains the frontend application for the Geo-Fencing-Based Emergency Advertising system. 
The project provides a web-based dashboard to visualize and manage geo-fencing alerts based on user mobility and location.

## Features

- **Interactive Map**: Displays real-time user locations and alerts.
- **Geo-Fencing Alerts**: Allows managers to create alerts based on user proximity.
- **Transport Mode Filtering**: Users can filter displayed data based on detected mobility modes (e.g., walking, car).
- **Cluster Visualization**: Implements k-means clustering for user distribution.
- **Responsive UI**: Designed with React and Leaflet for seamless interaction.

## Installation

### Prerequisites
- Node.js (>= 20.x)
- pnpm

### Setup

```sh
# Clone the repository
git clone https://github.com/cas-4/frontend.git
cd frontend

# Install dependencies
pnpm install
```

The application will be available at `http://localhost:5173`.

## Configuration

- The application interacts with the backend via Apollo Client.
- Ensure that the backend is running and the API URL is correctly set in `.env`.

## Deployment

To build the project for production:

```sh
pnpm run build
```

Serve the `build/` directory using a web server such as Nginx or Vercel.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`feature/new-feature`).
3. Commit your changes.
4. Submit a pull request.
