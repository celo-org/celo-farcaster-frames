'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import '../../globals.css';

export default function ProjectPage() {
  const [project, setProject] = useState<any>(null);
  const pathname = usePathname();
  const slug = pathname?.split('/').pop();
  const [showEndorseForm, setShowEndorseForm] = useState(false);
  const [endorsement, setEndorsement] = useState('');

  useEffect(() => {
    if (!slug) return;

    async function fetchProject() {
      try {
        const res = await fetch(`https://gapapi.karmahq.xyz/projects/${slug}`);
        const data = await res.json();
        setProject(data);
      } catch (error) {
        console.error('Failed to fetch project:', error);
      }
    }

    fetchProject();
  }, [slug]);

  console.log("project is:", project)
  // const projectDetails = project.details.data;
  if (!project || !project.details || !project.details.data) {
    return <p className="loading">Loading project...</p>;
  }
  
  const projectDetails = project.details.data;
  

  const title = projectDetails?.title || slug || 'Untitled Project';
  const description = projectDetails?.description || 'No mission statement provided.';
  const projectLink = `https://gap.karmahq.xyz/project/${slug}`;
  const imageUrl = '/default-image.png'; 

  function handleEndorse() {
    if (!endorsement.trim()) {
      alert('Please write something to endorse.');
      return;
    }
    alert(`Submitted endorsement: "${endorsement}"`);
    setEndorsement('');
  }


  return (
    <div className="project-container">
  <h1 className="project-title">{title}</h1>
  <img src="https://via.placeholder.com/300" alt="Project visual" className="project-image" />
  <p className="project-description">{description}</p>

  <div className="button-row">
    <button className="button tip">💸 Tip</button>
    <a href={projectLink} target="_blank" rel="noopener noreferrer" className="button secondary">
      🔗 Learn More
    </a>
  </div>
  <div className="button-row">
    <button className="button endorse" onClick={() => setShowEndorseForm(!showEndorseForm)}>
      📝 Endorse
    </button>

    <button className="button">➡️ Next Project</button>
  </div>

  {showEndorseForm && (
  <div className="input-box">
    <label htmlFor="endorsement">Endorse this project:</label>
    <textarea
      id="endorsement"
      rows={3}
      placeholder="Write a short endorsement..."
      value={endorsement}
      onChange={(e) => setEndorsement(e.target.value)}
    />
    <button className="button endorse" onClick={handleEndorse}>
      ✅ Submit Endorsement
    </button>
  </div>
)}


</div>

  );
}
