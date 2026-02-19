import { fetchGitHubData } from '../../api/github';
import { processStats } from '../../utils';
import { generateCardSvg } from '../../components/Card';

export default async function handler(req, res) {
  // Grab BOTH username and theme from the URL
  const { username, theme = 'royal' } = req.query; 

  if (!username) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: "Missing ?username= parameter" });
  }

  try {
    const rawData = await fetchGitHubData(username);
    const stats = processStats(rawData);
    
    // Pass the theme string to the generator
    const svg = generateCardSvg(stats, theme);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=7200, s-maxage=7200, stale-while-revalidate=86400');
    
    return res.status(200).send(svg);
    
  } catch (error) {
    console.error("API Error:", error);
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.status(500).send(`
      <svg width="850" height="350" viewBox="0 0 850 350" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="850" height="350" rx="16" fill="#0d0d0f" stroke="#ff4444" stroke-width="2"/>
        <text x="425" y="175" fill="#ff4444" font-family="monospace" font-size="24" text-anchor="middle">Error generating card: ${error.message}</text>
      </svg>
    `);
  }
}