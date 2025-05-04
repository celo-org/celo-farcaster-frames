'use client';
import React, { useState } from 'react';
import '../app/globals.css'; // Ensure it's imported in layout.js too

export default function ProjectCard() {
  const [endorsement, setEndorsement] = useState('');

  const handleEndorse = () => {
    alert(`Endorsed with message: ${endorsement}`);
    // call your API to post endorsement
  };

  return (
    <div className="container">
      <h2>[Project Name]</h2>
      <img src="https://via.placeholder.com/500x200" alt="Banner" className="project-image" />
      <p>[Mission Statement]</p>

      <div className="project-buttons">
        <button className="button tip">Tip</button>
        <button className="button">Learn More</button>
        <button className="button endorse" onClick={handleEndorse}>Endorse</button>
        <button className="button secondary">Next</button>
      </div>

      <div className="input-box">
        <textarea
          rows={3}
          placeholder="Add your endorsement message"
          value={endorsement}
          onChange={(e) => setEndorsement(e.target.value)}
        />
        <button className="button endorse" onClick={handleEndorse}>Submit Endorsement</button>
      </div>
    </div>
  );
}
