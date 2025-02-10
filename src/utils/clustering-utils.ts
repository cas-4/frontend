export interface Point {
  latitude: number;
  longitude: number;
  speed?: number;
  movingActivity?: 'STILL' | 'WALKING' | 'RUNNING' | 'IN_VEHICLE';
}

export interface Cluster {
  centroid: Point;
  points: Point[];
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(point1: Point, point2: Point): number {
  const R = 6371; // Earth's radius in kilometers
  const lat1 = point1.latitude * Math.PI / 180;
  const lat2 = point2.latitude * Math.PI / 180;
  const deltaLat = (point2.latitude - point1.latitude) * Math.PI / 180;
  const deltaLon = (point2.longitude - point1.longitude) * Math.PI / 180;
  
  const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Calculate centroid of a cluster
export function calculateCentroid(points: Point[]): Point {
  const sum = points.reduce((acc, point) => ({
    latitude: acc.latitude + point.latitude,
    longitude: acc.longitude + point.longitude
  }), { latitude: 0, longitude: 0 });

  return {
    latitude: sum.latitude / points.length,
    longitude: sum.longitude / points.length
  };
}

// Calculate Sum of Squared Errors for a set of clusters
export function calculateSSE(clusters: Cluster[]): number {
  return clusters.reduce((total, cluster) => {
    return total + cluster.points.reduce((sum, point) => {
      return sum + Math.pow(calculateDistance(point, cluster.centroid), 2);
    }, 0);
  }, 0);
}

// Determine moving activity based on speed
export function determineMovingActivity(speed: number): Point['movingActivity'] {
  if (speed === 0) return 'STILL';
  if (speed < 1.5) return 'WALKING';
  if (speed >= 1.5 && speed < 8) return 'RUNNING';  // Increased upper bound for running
  return 'IN_VEHICLE';
}

// Generate movement based on activity
export function generateMovement(activity: Point['movingActivity']): { dx: number, dy: number } {
  const baseMovement = {
    'STILL': 0,
    'WALKING': 0.0001,     // Approx 11 meters
    'RUNNING': 0.001,      // Approx 110 meters (doubled from original)
    'IN_VEHICLE': 0.005    // Approx 550 meters (2.5x faster than original)
  };

  const randomFactor = () => (Math.random() - 0.5) * 2;
  const movement = baseMovement[activity || 'STILL'];

  return {
    dx: movement * randomFactor(),
    dy: movement * randomFactor()
  };
}

// Perform k-means clustering
export function kMeansClustering(points: Point[], k: number, maxIterations = 100): Cluster[] {
  if (points.length === 0) return [];
  if (points.length <= k) {
    return points.map(point => ({
      centroid: point,
      points: [point]
    }));
  }

  // Initialize centroids randomly
  let centroids = [...points]
    .sort(() => Math.random() - 0.5)
    .slice(0, k)
    .map(point => ({ ...point }));
  
  let clusters: Cluster[] = [];
  let iteration = 0;
  let previousSSE = Infinity;

  while (iteration < maxIterations) {
    // Assign points to nearest centroid
    clusters = centroids.map(centroid => ({
      centroid,
      points: []
    }));

    points.forEach(point => {
      let minDistance = Infinity;
      let closestClusterIndex = 0;
      
      centroids.forEach((centroid, index) => {
        const distance = calculateDistance(point, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          closestClusterIndex = index;
        }
      });
      
      clusters[closestClusterIndex].points.push(point);
    });

    // Recalculate centroids
    const newCentroids = clusters.map(cluster =>
      cluster.points.length > 0 ? calculateCentroid(cluster.points) : cluster.centroid
    );

    // Calculate SSE
    const currentSSE = calculateSSE(clusters);

    // Check for convergence
    if (Math.abs(previousSSE - currentSSE) < 0.0001) {
      break;
    }
    
    previousSSE = currentSSE;
    centroids = newCentroids;
    iteration++;
  }

  return clusters;
}

// Find optimal number of clusters using elbow method
export function findOptimalClusters(points: Point[], maxK = 10): number {
  if (points.length <= 2) return points.length;
  
  const sseValues: number[] = [];
  
  // Calculate SSE for different k values
  for (let k = 1; k <= Math.min(maxK, points.length); k++) {
    const clusters = kMeansClustering(points, k);
    sseValues.push(calculateSSE(clusters));
  }

  // Find elbow point using the maximum curvature method
  let optimalK = 1;
  let maxCurvature = 0;
  
  for (let i = 1; i < sseValues.length - 1; i++) {
    const angle = Math.atan2(sseValues[i] - sseValues[i + 1], 1) -
      Math.atan2(sseValues[i - 1] - sseValues[i], 1);
    
    if (angle > maxCurvature) {
      maxCurvature = angle;
      optimalK = i + 1;
    }
  }

  return optimalK;
}