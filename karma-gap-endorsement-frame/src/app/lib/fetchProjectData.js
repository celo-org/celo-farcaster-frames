export async function fetchProjectData(projectUrl) {
    const res = await fetch(`https://api.karmagap.dev/projects?url=${encodeURIComponent(projectUrl)}`);
  
    if (!res.ok) {
      throw new Error('Failed to fetch project data');
    }
  
    return await res.json();
  }
  