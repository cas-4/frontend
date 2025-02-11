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

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper to check if centroids have converged
function centroidsConverged(oldCentroids: Point[], newCentroids: Point[], tolerance: number): boolean {
  return oldCentroids.every((oldCentroid, i) => {
    const newCentroid = newCentroids[i];
    const distance = calculateDistance(oldCentroid, newCentroid);
    return distance < tolerance;
  });
}

// Calculate weighted centroid for better precision
function calculateWeightedCentroid(points: Point[]): Point {
  if (points.length === 0) throw new Error("Cannot calculate centroid of empty cluster");
  
  const n = points.length;
  const sum = points.reduce((acc, point) => ({
    latitudeSum: acc.latitudeSum + point.latitude,
    longitudeSum: acc.longitudeSum + point.longitude,
    latitudeWeightedSum: acc.latitudeWeightedSum + (point.latitude * Math.cos(point.latitude * Math.PI / 180)),
    longitudeWeightedSum: acc.longitudeWeightedSum + (point.longitude * Math.cos(point.latitude * Math.PI / 180)),
    cosLatSum: acc.cosLatSum + Math.cos(point.latitude * Math.PI / 180)
  }), {
    latitudeSum: 0,
    longitudeSum: 0,
    latitudeWeightedSum: 0,
    longitudeWeightedSum: 0,
    cosLatSum: 0
  });

  // Use weighted average for better precision with geographical coordinates
  return {
    latitude: sum.latitudeSum / n,
    longitude: sum.longitudeWeightedSum / sum.cosLatSum
  };
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
  if (speed >= 1.5 && speed < 8) return 'RUNNING';
  return 'IN_VEHICLE';
}

// Generate movement based on activity
export function generateMovement(activity: Point['movingActivity']): { dx: number, dy: number } {
  const baseMovement = {
    'STILL': 0,
    'WALKING': 0.0001,     // Approx 11 meters
    'RUNNING': 0.001,      // Approx 110 meters
    'IN_VEHICLE': 0.005    // Approx 550 meters
  };

  const randomFactor = () => (Math.random() - 0.5) * 2;
  const movement = baseMovement[activity || 'STILL'];

  return {
    dx: movement * randomFactor(),
    dy: movement * randomFactor()
  };
}

// Initialize centroids using k-means++ method
function initializeCentroids(points: Point[], k: number): Point[] {
  const centroids: Point[] = [];
  const n = points.length;
  
  // Choose first centroid uniformly at random
  const firstIndex = Math.floor(Math.random() * n);
  centroids.push({ ...points[firstIndex] });
  
  // Array to store minimum distances
  const minDistances = new Array(n).fill(Infinity);
  
  // Choose remaining centroids
  for (let i = 1; i < k; i++) {
    let sumSquaredDistances = 0;
    
    // Update minimum distances for each point
    for (let j = 0; j < n; j++) {
      const point = points[j];
      const distToCentroid = calculateDistance(point, centroids[i - 1]);
      minDistances[j] = Math.min(minDistances[j], distToCentroid);
      sumSquaredDistances += minDistances[j] * minDistances[j];
    }
    
    // Choose next centroid with probability proportional to D²
    let rand = Math.random() * sumSquaredDistances;
    let nextCentroidIndex = 0;
    
    for (let j = 0; j < n && rand > 0; j++) {
      rand -= minDistances[j] * minDistances[j];
      nextCentroidIndex = j;
    }
    
    centroids.push({ ...points[nextCentroidIndex] });
  }
  
  return centroids;
}


export function kMeansClustering(
  points: Point[], 
  k: number, 
  maxIterations = 300,
  tolerance = 0.0001
): Cluster[] {
  if (!points?.length || k <= 0) return [];
  if (points.length <= k) {
    return points.map(point => ({
      centroid: { ...point },
      points: [point]
    }));
  }

  // Initialize using k-means++
  let centroids = initializeCentroids(points, k);
  let clusters: Cluster[] = [];
  let iteration = 0;
  let hasConverged = false;
  
  while (iteration < maxIterations && !hasConverged) {
    // Store old centroids for convergence check
    const oldCentroids = centroids.map(c => ({ ...c }));
    
    // Reset clusters
    clusters = centroids.map(centroid => ({
      centroid,
      points: []
    }));
    
    // Assign points to nearest centroid
    for (const point of points) {
      let minDistance = Infinity;
      let nearestClusterIndex = 0;
      
      for (let i = 0; i < centroids.length; i++) {
        const distance = calculateDistance(point, centroids[i]);
        if (distance < minDistance) {
          minDistance = distance;
          nearestClusterIndex = i;
        }
      }
      
      clusters[nearestClusterIndex].points.push(point);
    }
    
    // Remove empty clusters
    clusters = clusters.filter(cluster => cluster.points.length > 0);
    
    // Update centroids
    try {
      centroids = clusters.map(cluster => calculateWeightedCentroid(cluster.points));
    } catch (error) {
      console.error('Error calculating centroids:', error);
      break;
    }
    
    // Check for convergence
    hasConverged = centroidsConverged(oldCentroids, centroids, tolerance);
    
    // Update cluster centroids
    clusters.forEach((cluster, i) => {
      cluster.centroid = centroids[i];
    });
    
    iteration++;
  }

  // Sort clusters by size for consistency
  clusters.sort((a, b) => b.points.length - a.points.length);
  
  console.log(`K-means converged after ${iteration} iterations`);
  console.log('Final clusters:', clusters.map(c => ({
    size: c.points.length,
    centroid: c.centroid
  })));
  
  return clusters;
}

// Calculate cluster quality metrics
export function calculateClusterMetrics(clusters: Cluster[]) {
  const metrics = {
    totalPoints: 0,
    averageClusterSize: 0,
    silhouetteScore: 0,
    clusterSizes: [] as number[],
    averageDistanceToCentroid: 0
  };
  
  metrics.clusterSizes = clusters.map(c => c.points.length);
  metrics.totalPoints = metrics.clusterSizes.reduce((a, b) => a + b, 0);
  metrics.averageClusterSize = metrics.totalPoints / clusters.length;
  
  let totalDistance = 0;
  for (const cluster of clusters) {
    for (const point of cluster.points) {
      totalDistance += calculateDistance(point, cluster.centroid);
    }
  }
  metrics.averageDistanceToCentroid = totalDistance / metrics.totalPoints;
  
  return metrics;
}

// Export the findOptimalClusters function
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