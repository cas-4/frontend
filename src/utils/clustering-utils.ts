import * as turf from '@turf/clusters-kmeans';
import { point, featureCollection, Units } from '@turf/helpers';
import distance from '@turf/distance';

export interface Point {
  latitude: number;
  longitude: number;
  speed?: number;
  movingActivity?: 'STILL' | 'WALKING' | 'RUNNING' | 'IN_VEHICLE';
  originalData?: any;
}

export interface Cluster {
  centroid: Point;
  points: Point[];
  radius?: number;
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

// Helper function to convert our points to GeoJSON format
function convertToGeoJSON(points: Point[]) {
  return featureCollection(
    points.map(p => point([p.longitude, p.latitude], { 
      originalData: p 
    }))
  );
}

// Calculate distance between two points using Turf
export function calculateDistance(point1: Point, point2: Point): number {
  const from = point([point1.longitude, point1.latitude]);
  const to = point([point2.longitude, point2.latitude]);
  const options: { units: Units } = { units: 'kilometers' };
  return distance(from, to, options);
}

export function kMeansClustering(
  points: Point[], 
  k: number
): Cluster[] {
  if (!points?.length || k <= 0) return [];
  if (points.length <= k) {
    return points.map(point => ({
      centroid: { ...point },
      points: [point]
    }));
  }

  // Convert points to GeoJSON format
  const geojsonPoints = convertToGeoJSON(points);

  // Perform k-means clustering using Turf
  const clustered = turf.default(geojsonPoints, {
    numberOfClusters: k,
    mutate: true
  });

  // Group points by cluster
  const clusters: Map<number, Point[]> = new Map();
  clustered.features.forEach(feature => {
    const cluster = feature.properties?.cluster;
    const point = feature.properties?.originalData as Point;
    
    if (typeof cluster === 'number' && !clusters.has(cluster)) {
      clusters.set(cluster, []);
    }
    if (typeof cluster === 'number') {
      clusters.get(cluster)?.push(point);
    }
  });

  // Convert clusters to our format
  return Array.from(clusters.entries()).map(([_, clusterPoints]) => {
    // Calculate centroid
    const sumLat = clusterPoints.reduce((sum, p) => sum + p.latitude, 0);
    const sumLng = clusterPoints.reduce((sum, p) => sum + p.longitude, 0);
    const centroid = {
      latitude: sumLat / clusterPoints.length,
      longitude: sumLng / clusterPoints.length
    };

    // Calculate radius (maximum distance from centroid to any point)
    const maxDistance = Math.max(
      ...clusterPoints.map(point => calculateDistance(centroid, point))
    );

    return {
      centroid,
      points: clusterPoints,
      radius: maxDistance * 1.1 // Add 10% buffer
    };
  });
}

// Calculate cluster quality metrics
export function calculateClusterMetrics(clusters: Cluster[]) {
  const metrics = {
    totalPoints: 0,
    averageClusterSize: 0,
    clusterSizes: [] as number[],
    averageDistanceToCentroid: 0,
    silhouetteScore: 0
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

// Find optimal number of clusters using silhouette score
export function findOptimalClusters(points: Point[], maxK = 10): number {
  if (points.length <= 2) return points.length;
  
  // For simplicity, we'll use a reasonable default based on data size
  const suggestedK = Math.max(2, Math.min(
    Math.floor(Math.sqrt(points.length / 2)),
    maxK
  ));
  
  return suggestedK;
}