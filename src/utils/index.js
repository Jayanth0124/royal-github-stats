export function processStats(userData) {
  const calendar = userData.contributionsCollection.contributionCalendar;
  const totalContributions = calendar.totalContributions;
  
  // Format the "Member Since" date
  const joinDate = new Date(userData.createdAt);
  const formattedDate = `${joinDate.toLocaleString('default', { month: 'short' })} ${joinDate.getDate()}, ${joinDate.getFullYear()} - Present`;

  // --- 1. THE STREAK CALCULATOR (FIXED) ---
  let currentStreak = 0;
  let longestStreak = 0;
  let currentStreakStart = null;
  let currentStreakEnd = null;
  let longestStreakStart = null;
  let longestStreakEnd = null;
  let tempStreakStart = null;

  // Flatten the weeks array into a single array of 365 days
  const days = calendar.weeks.flatMap(week => week.contributionDays);

  days.forEach(day => {
    if (day.contributionCount > 0) {
      // If we are starting a fresh streak, record the start date
      if (currentStreak === 0) {
        tempStreakStart = day.date;
      }
      
      currentStreak++;
      currentStreakStart = tempStreakStart; // Keep updating the current active start date
      currentStreakEnd = day.date;

      // Check if this new addition makes it the longest streak
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
        longestStreakStart = currentStreakStart;
        longestStreakEnd = currentStreakEnd;
      }
    } else {
      // The chain is broken, reset current streak count
      currentStreak = 0;
    }
  });

  // Check if the current streak is still alive (user committed today or yesterday)
  const todayIndex = days.length - 1;
  const todayCount = days[todayIndex]?.contributionCount || 0;
  const yesterdayCount = days[todayIndex - 1]?.contributionCount || 0;

  if (todayCount === 0 && yesterdayCount === 0) {
    // Streak is dead
    currentStreak = 0;
    currentStreakStart = null;
    currentStreakEnd = null;
  }

  // Timezone-safe date formatting
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    // Split the string manually to prevent JavaScript from applying UTC offsets
    const [year, month, day] = dateString.split('-');
    const d = new Date(year, month - 1, day);
    return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()}`;
  };

  // --- 2. LANGUAGE CALCULATOR ---
  const languageMap = {};
  let totalSize = 0;

  userData.repositories.nodes.forEach(repo => {
    repo.languages.edges.forEach(edge => {
      const { size, node: { name, color } } = edge;
      if (!languageMap[name]) languageMap[name] = { name, color: color || '#cccccc', size: 0 };
      languageMap[name].size += size;
      totalSize += size;
    });
  });

  // Convert to percentages and sort
  const topLanguages = Object.values(languageMap)
    .map(lang => ({ ...lang, percent: Math.round((lang.size / totalSize) * 100) }))
    .filter(lang => lang.percent > 0)
    .sort((a, b) => b.size - a.size)
    .slice(0, 3);

  return {
    totalContributions,
    period: formattedDate,
    currentStreak,
    currentStreakRange: currentStreak > 0 ? `${formatDate(currentStreakStart)} - Present` : "No active streak",
    longestStreak,
    longestStreakRange: longestStreak > 0 ? `${formatDate(longestStreakStart)} - ${formatDate(longestStreakEnd)}` : "No recorded streak",
    topLanguages,
  };
}