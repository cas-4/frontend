import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  const handleNavigation = (navigation: string) => {
    navigate('/' + navigation);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4 text-center">
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-screen-md flex" style={{ margin: 'auto', maxWidth: '500px' }}>
        <div className="w-full p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong...</h1>
          <p className="text-lg text-gray-700 mb-6">
            The server is currently on vacation. <br />It’ll be back before you even know it!
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Please try again now, or disconnect temporarily and check back later to see if the system is working.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleNavigation.bind(null, 'logout')}
              className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              style={{ minWidth: '120px' }}
            >
              Disconnect
            </button>
            <button
              onClick={handleNavigation.bind(null, 'dashboard')}
              className="flex-1 bg-yellow-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              style={{ minWidth: '120px' }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}