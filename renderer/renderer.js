//updater stuff self-expantory

document.getElementById('check-updates-btn').addEventListener('click', () => {
  window.electronAPI.checkForUpdates();
});

document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDark = await window.darkMode.toggle();
  document.getElementById('theme-source').innerText = isDark ? 'Dark' : 'Light';
});


document.getElementById('nav-info').innerText = navigator.userAgent;

document.getElementById('icon').addEventListener('click', () => {
  location.reload();
});
