interface ClusteringControlsProps {
  clusteringEnabled: boolean;
  setClusteringEnabled: (enabled: boolean) => void;
  manualClustering: boolean;
  setManualClustering: (manual: boolean) => void;
  numberOfClusters: number;
  setNumberOfClusters: (clusters: number) => void;
}

export const ClusteringControls = ({
  clusteringEnabled,
  setClusteringEnabled,
  manualClustering,
  setManualClustering,
  numberOfClusters,
  setNumberOfClusters,
}: ClusteringControlsProps) => {
  return (
    <div className="absolute bottom-24 right-4 z-50 bg-white p-4 rounded-lg shadow-md w-64">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Enable Clustering</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={clusteringEnabled}
              onChange={(e) => setClusteringEnabled(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        {clusteringEnabled && (
          <>
            <div className="flex items-center justify-between">
              <span className="font-medium">Manual Clustering</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={manualClustering}
                  onChange={(e) => setManualClustering(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {manualClustering && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Number of Clusters:</span>
                  <span className="font-medium">{numberOfClusters}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={numberOfClusters}
                  onChange={(e) => setNumberOfClusters(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};