const Legend: React.FC<{ 
  visible: boolean; 
  onToggle: () => void;
  showZoomInfo?: boolean;
  zoom: number;
}> = ({ visible, onToggle, showZoomInfo, zoom }) => {
  
  const colorScale = [
    '#b22222', // Dark Red
    '#ff8c00', // Dark Orange
    '#3cb371', // Dark Green
    '#008080', // Teal
    '#4b0082'  // Indigo
  ];  

  if (!visible) {
      return (
      <button
          onClick={onToggle}
          className="absolute top-4 right-4 z-50 bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200"
          aria-label="Show Legend"
      >
          <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-6 h-6"
          >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
      </button>
      );
  }

  return (
      <div className="absolute top-4 right-4 z-50 bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">Cluster Size</h3>
              <button
                  onClick={onToggle}
                  className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                  aria-label="Hide Legend"
              >
                  <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={1.5} 
                      stroke="currentColor" 
                      className="w-5 h-5"
                  >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
          </div>
          <div className="space-y-2">
              {colorScale.map((color, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                      <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: color }}
                      />
                      <span className="text-sm">
                          {idx === 0 ? 'Very Small' : 
                           idx === 1 ? 'Small' :
                           idx === 2 ? 'Medium' :
                           idx === 3 ? 'Large' : 'Very Large'}
                      </span>
                  </div>
              ))}
          </div>
          {showZoomInfo && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Current zoom: {zoom}</span>
              </div>
          )}
      </div>
  );
};

export default Legend;