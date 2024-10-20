function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function getPreferredTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme() {
  const theme = getPreferredTheme();
  setTheme(theme);
}

// Apply theme on page load
applyTheme();

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);