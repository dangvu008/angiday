import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import StandardLayout from '@/components/layout/StandardLayout';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <StandardLayout className="bg-gray-100">
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
          <a href="/" className="text-blue-500 hover:text-blue-700 underline">
            Return to Home
          </a>
          <div className="mt-8 text-sm text-gray-500">
            <p>Attempted to access: {location.pathname}</p>
            <p>This route does not exist in the application.</p>
            <p>Please check the URL or navigate back to the home page.</p>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
};

export default NotFound;
