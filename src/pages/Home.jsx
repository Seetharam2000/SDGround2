import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="max-w-4xl w-full px-6">
        <h1 className="text-5xl font-black text-center mb-10">
          SDGround
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/map"
            className="bg-gray-900 p-8 rounded-2xl text-center hover:bg-gray-800"
          >
            <h2 className="text-xl font-bold">Map</h2>
            <p className="text-gray-400 mt-2">
              View ward status and SDG indicators
            </p>
          </Link>

          <Link
            to="/report"
            className="bg-gray-900 p-8 rounded-2xl text-center hover:bg-gray-800"
          >
            <h2 className="text-xl font-bold">Report Issue</h2>
            <p className="text-gray-400 mt-2">
              Submit a complaint
            </p>
          </Link>

          <Link
            to="/dashboard"
            className="bg-gray-900 p-8 rounded-2xl text-center hover:bg-gray-800"
          >
            <h2 className="text-xl font-bold">
              Authority Dashboard
            </h2>
            <p className="text-gray-400 mt-2">
              View complaints and analytics
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}