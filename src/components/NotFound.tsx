import { useNavigate } from 'react-router-dom';

export default function NotFound () {
  const navigate = useNavigate();

  const handleGoBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-6">Oops! The page you're looking for doesn't exist.</p>
        <button
          onClick={handleGoBackToDashboard}
          className="bg-yellow-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};