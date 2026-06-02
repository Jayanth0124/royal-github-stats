import { themes } from '../themes';

export function generateCardSvg(stats, themeName = 'royal') {
  // Fallback to 'royal' if the user types a theme that doesn't exist
  const theme = themes[themeName] || themes.royal; 

  const langs = stats.topLanguages || [];
  const lang1 = langs[0] || { name: 'TypeScript', percent: 90, color: '#f1e05a' };
  const lang2 = langs[1] || { name: 'JavaScript', percent: 60, color: '#e34c26' };
  const lang3 = langs[2] || { name: 'HTML', percent: 50, color: '#563d7c' };

  // Fixed: Scale bars proportionally, max 100px to prevent overlap
  const getBarHeight = (percent) => {
    const maxHeight = 100;
    const maxPercent = Math.max(lang1.percent, lang2.percent, lang3.percent);
    return Math.max((percent / maxPercent) * maxHeight, 5);
  };

  return `
    <svg width="850" height="480" viewBox="0 0 850 480" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-grad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="${theme.bg.start}"/>
          <stop offset="100%" stop-color="${theme.bg.end}"/>
        </radialGradient>

        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        <linearGradient id="primary-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="${theme.bars.primary[0]}"/><stop offset="50%" stop-color="${theme.bars.primary[1]}"/><stop offset="100%" stop-color="${theme.bars.primary[2]}"/>
        </linearGradient>
        <linearGradient id="secondary-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="${theme.bars.secondary[0]}"/><stop offset="50%" stop-color="${theme.bars.secondary[1]}"/><stop offset="100%" stop-color="${theme.bars.secondary[2]}"/>
        </linearGradient>
        <linearGradient id="tertiary-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="${theme.bars.tertiary[0]}"/><stop offset="50%" stop-color="${theme.bars.tertiary[1]}"/><stop offset="100%" stop-color="${theme.bars.tertiary[2]}"/>
        </linearGradient>
      </defs>

      <style>
        .serif-text { font-family: "Georgia", "Times New Roman", serif; fill: ${theme.text.main}; }
        .accent-text { font-family: "Georgia", "Times New Roman", serif; fill: ${theme.accent}; }
        .muted-mono { font-family: "Courier New", monospace; fill: ${theme.text.muted}; }
        .glass-panel { fill: ${theme.glass.panel}; stroke: ${theme.glass.border}; stroke-width: 1px; }
        .glass-badge { fill: ${theme.glass.badgeFill}; stroke: ${theme.glass.badgeBorder}; stroke-width: 1px; }
        .bar { animation: rise 1.5s ease-out forwards; transform-origin: bottom; }
        @keyframes rise { 0% { transform: scaleY(0); } 100% { transform: scaleY(1); } }
      </style>

      <rect width="850" height="480" fill="url(#bg-grad)" />

      <ellipse cx="425" cy="40" rx="250" ry="4" fill="${theme.text.main}" filter="url(#glow)" opacity="0.4"/>
      <ellipse cx="425" cy="450" rx="200" ry="4" fill="${theme.accent}" filter="url(#glow)" opacity="0.3"/>
      <line x1="20" y1="240" x2="830" y2="240" stroke="${theme.accent}" stroke-width="1" filter="url(#glow)" opacity="0.1" />

      <rect x="40" y="80" width="230" height="340" rx="16" class="glass-panel" />
      <rect x="290" y="80" width="270" height="340" rx="16" class="glass-panel" />
      <rect x="580" y="80" width="230" height="340" rx="16" class="glass-panel" />

      <g transform="translate(155, 120)">
        <text x="0" y="0" text-anchor="middle" class="accent-text" font-size="14" letter-spacing="3">LEGACY</text>
        <line x1="-35" y1="12" x2="35" y2="12" stroke="${theme.accent}" stroke-width="0.5" opacity="0.5"/>

        <text x="0" y="45" text-anchor="middle" class="serif-text" font-size="16">Total</text>
        <text x="0" y="65" text-anchor="middle" class="serif-text" font-size="16">Contributions</text>

        <text x="0" y="150" text-anchor="middle" class="serif-text" font-size="70" filter="url(#glow)">${stats.totalContributions}</text>
        <text x="0" y="150" text-anchor="middle" class="serif-text" font-size="70">${stats.totalContributions}</text>

        <g transform="translate(0, 205)">
          <rect x="-85" y="-18" width="170" height="26" rx="13" class="glass-badge" />
          <text x="0" y="0" text-anchor="middle" class="muted-mono" font-size="10">${stats.period}</text>
        </g>
      </g>

      <g transform="translate(425, 120)">
        <g transform="translate(-15, -15)" fill="${theme.text.main}" filter="url(#glow)">
          <path d="M4 16 L0 4 L8 10 L15 0 L22 10 L30 4 L26 16 Z" />
        </g>

        <g transform="translate(0, 95)">
          <circle cx="0" cy="0" r="70" fill="none" stroke="url(#primary-grad)" stroke-width="4" filter="url(#glow)" />
          <circle cx="0" cy="0" r="70" fill="none" stroke="${theme.bars.primary[2]}" stroke-width="1.5" />
          
          <g>
             <circle cx="0" cy="0" r="62" fill="none" stroke="${theme.accent}" stroke-width="1.5" stroke-dasharray="6 8" opacity="0.8"/>
             <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="20s" repeatCount="indefinite" />
          </g>

          <g>
             <circle cx="0" cy="0" r="80" fill="none" stroke="${theme.text.main}" stroke-width="1" stroke-dasharray="1 15" opacity="0.5"/>
             <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="30s" repeatCount="indefinite" />
          </g>

          <text x="0" y="18" text-anchor="middle" class="serif-text" font-size="55">${stats.currentStreak}</text>
        </g>

        <g transform="translate(0, 205)">
          <text x="0" y="0" text-anchor="middle" class="accent-text" font-size="12" letter-spacing="2">CURRENT STREAK</text>
          <rect x="-85" y="10" width="170" height="22" rx="11" class="glass-badge" />
          <text x="0" y="25" text-anchor="middle" class="muted-mono" font-size="10">${stats.currentStreakRange}</text>
        </g>

        <g transform="translate(0, 260)">
          <rect x="-115" y="0" width="230" height="55" rx="10" class="glass-badge" fill="${theme.glass.badgeFill}"/>
          <text x="-100" y="22" text-anchor="start" class="serif-text" font-size="11" letter-spacing="1">LONGEST STREAK</text>
          <text x="100" y="25" text-anchor="end" class="accent-text" font-size="22">${stats.longestStreak}</text>
          <line x1="-100" y1="32" x2="100" y2="32" stroke="${theme.glass.border}" stroke-width="1" />
          <text x="0" y="47" text-anchor="middle" class="muted-mono" font-size="10">${stats.longestStreakRange}</text>
        </g>
      </g>

      <g transform="translate(695, 120)">
        <text x="0" y="0" text-anchor="middle" class="accent-text" font-size="14" letter-spacing="2">THE ARSENAL</text>
        <line x1="-35" y1="12" x2="35" y2="12" stroke="${theme.accent}" stroke-width="0.5" opacity="0.5"/>
        
        <g transform="translate(-65, 55)">
          <text x="0" y="0" text-anchor="middle" class="serif-text" font-size="12">${lang1.percent}%</text>
          <rect x="-10" y="${130 - getBarHeight(lang1.percent)}" width="20" height="${getBarHeight(lang1.percent)}" fill="url(#primary-grad)" class="bar" />
          <g transform="translate(0, 150)">
             <circle cx="0" cy="0" r="8" fill="none" stroke="${theme.accent}" stroke-width="1"/>
             <rect x="-3" y="-3" width="6" height="6" fill="${theme.accent}" />
          </g>
          <text x="0" y="175" text-anchor="middle" class="serif-text" font-size="10">${lang1.name.substring(0,10)}</text>
        </g>

        <g transform="translate(0, 55)">
          <text x="0" y="0" text-anchor="middle" class="serif-text" font-size="12">${lang2.percent}%</text>
          <rect x="-10" y="${130 - getBarHeight(lang2.percent)}" width="20" height="${getBarHeight(lang2.percent)}" fill="url(#secondary-grad)" class="bar" />
          <g transform="translate(0, 150)">
             <circle cx="0" cy="0" r="8" fill="none" stroke="${theme.bars.secondary[1]}" stroke-width="1"/>
             <circle cx="0" cy="0" r="3" fill="${theme.bars.secondary[1]}" />
          </g>
          <text x="0" y="175" text-anchor="middle" class="serif-text" font-size="10">${lang2.name.substring(0,10)}</text>
        </g>

        <g transform="translate(65, 55)">
          <text x="0" y="0" text-anchor="middle" class="serif-text" font-size="12">${lang3.percent}%</text>
          <rect x="-10" y="${130 - getBarHeight(lang3.percent)}" width="20" height="${getBarHeight(lang3.percent)}" fill="url(#tertiary-grad)" class="bar" />
          <g transform="translate(0, 150)">
             <circle cx="0" cy="0" r="8" fill="none" stroke="${theme.bars.tertiary[1]}" stroke-width="1"/>
             <polygon points="0,-4 4,3 -4,3" fill="${theme.bars.tertiary[1]}" />
          </g>
          <text x="0" y="175" text-anchor="middle" class="serif-text" font-size="10">${lang3.name.substring(0,10)}</text>
        </g>
      </g>
    </svg>
  `;
}
