import React, { useState, useEffect } from 'react';
import './App.css';
import Papa from 'papaparse';

function App() {
  const [city, setCity] = useState('');
  const [count, setCount] = useState(null);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState('');
  const [ufoReports, setUfoReports] = useState([]);

  // Load CSV file automatically when the app starts
  useEffect(() => {
    fetch('/ufoData.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true, // Assumes the first row contains column names
          skipEmptyLines: true,
          complete: (result) => {
            setData(result.data);
          }
        });
      })
      .catch(error => console.error("Error loading CSV:", error));
  }, []);

  // Function to count occurrences of the entered city and set messages
  const handleSearch = () => {
    if (!data.length) {
      alert("CSV file not loaded.");
      return;
    }

    const citySightings = data.filter(entry => entry.city?.toLowerCase() === city.toLowerCase());
    const cityCount = citySightings.length;
    setCount(cityCount);

    // Determine the custom message
    let newMessage = '';
    if (cityCount === 0) {
      newMessage = "No alien activity. Your city is safe... for now. 👽";
    } else if (cityCount > 0 && cityCount <= 10) {
      newMessage = "Low paranormal activity in area. Keep an eye on the skies. 🛸🛸🛸";
    } else if (cityCount > 10 && cityCount <= 100) {
      newMessage = "UFO activity detected! Stay alert. 🚨🚨🚨";
    } else {
      newMessage = "ALIEN HOTSPOT! GET OUT NOW! RUN!!! 👽👽👽";
    }
    setMessage(newMessage);

    // Get top three UFO reports if sightings exist
    const topReports = citySightings.slice(0, 3).map(sighting => ({
      shape: sighting.shape || "Unknown",
      description: sighting.comments || "No description available.",
      duration: sighting["duration (hours/min)"] || "Unknown duration",
      color: sighting.color || "Unknown color"
    }));

    setUfoReports(topReports);
  };

  return (
    <div className="App">
      {/* Big Glowing Title */}
      <div className="title-container">
        <h1 className="big-title">ARE YOU SAFE FROM ALIENS?</h1>
        <h2 className="subtitle">CHECK THE RISK OF YOUR CITY BELOW</h2>
      </div>

      <div className="content-container">
        {/* UFO Report Box (Top 3 Sightings) */}
        <div className="ufo-box">
          <h3>Top UFO Reports</h3>
          {count > 0 ? (
            ufoReports.map((report, index) => (
              <div key={index} className="ufo-report">
                <p><strong>Shape:</strong> {report.shape}</p>
                <p><strong>Duration:</strong> {report.duration}</p>
                <p><strong>Description:</strong> {report.description}</p>
                <hr />
              </div>
            ))
          ) : (
            <p>No reports found for this city.</p>
          )}
        </div>

        {/* Search Box Section */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          {count !== null && (
            <div className="result">
              <p>Instances of {city}: {count}</p>
              <p className="message">{message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Alien Image */}
      <img src="/images/Green_Alien_Waving.png" alt="Alien" className="alien-image" />
    </div>
  );
}

export default App;
