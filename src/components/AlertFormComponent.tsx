interface AlertFormProps {
    alertTexts: {
      text1: string;
      text2: string;
      text3: string;
    };
    onTextChange: (key: string, value: string) => void;
    onSubmit: () => void;
  }
  
export const AlertFormComponent  = ({ 
    alertTexts, 
    onTextChange, 
    onSubmit 
}: AlertFormProps) => {
    return (
        <div className="p-4 bg-gray-100 h-full overflow-y-auto">
        <h2 className="text-xl mb-4">Create Alert</h2>
        
        <div className="mb-4">
            <label className="block mb-2">Alert Level 1</label>
            <textarea 
            value={alertTexts.text1}
            onChange={(e) => onTextChange('text1', e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter first level alert text"
            />
        </div>

        <div className="mb-4">
            <label className="block mb-2">Alert Level 2</label>
            <textarea 
            value={alertTexts.text2}
            onChange={(e) => onTextChange('text2', e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter second level alert text"
            />
        </div>

        <div className="mb-4">
            <label className="block mb-2">Alert Level 3</label>
            <textarea 
            value={alertTexts.text3}
            onChange={(e) => onTextChange('text3', e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter third level alert text"
            />
        </div>

        <button 
            onClick={onSubmit}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
            Create Alert
        </button>
        </div>
    );
};