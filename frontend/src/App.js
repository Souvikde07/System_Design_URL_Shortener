import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [clickCount, setClickCount] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setClickCount(null);

    try {
      const response = await axios.post('http://localhost:5000/api/shorten', { url: longUrl });
      setShortUrl(response.data.shortUrl);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`http://${shortUrl}`);
    alert('Copied to clipboard!');
  };

  const fetchAnalytics = async () => {
    if (!shortUrl) return;
    const shortId = shortUrl.split('/').pop();
    try {
      const response = await axios.get(`http://localhost:5000/api/analytics/${shortId}`);
      setClickCount(response.data.clickCount);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch analytics');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">URL Shortener</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="Enter long URL"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Shorten URL
          </button>
        </form>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {shortUrl && (
          <div className="mt-4">
            <p className="text-gray-700">
              Shortened URL:{' '}
              <a href={`http://${shortUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                {shortUrl}
              </a>
            </p>
            <button
              onClick={copyToClipboard}
              className="mt-2 w-full bg-gray-200 p-2 rounded hover:bg-gray-300"
            >
              Copy URL
            </button>
            <button
              onClick={fetchAnalytics}
              className="mt-2 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              View Analytics
            </button>
            {clickCount !== null && (
              <p className="mt-2 text-gray-700">Clicks: {clickCount}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;