import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4 text-center">
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-screen-md flex" style={{ margin: 'auto', maxWidth: '500px' }}>  
        <div className="w-full p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong...</h1>
          <p className="text-lg text-gray-700 mb-6">
            "The server is currently on vacation. <br />It’ll be back before you even know it!"
          </p>
          <button
            onClick={handleBackToHome}
            className="bg-yellow-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}