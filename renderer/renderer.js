//updater stuff self-expantory
document.getElementById('check-updates-btn').addEventListener('click', () => {
  window.electronAPI.checkForUpdates();
});

//theme btn
document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDark = await window.darkMode.toggle();
  document.getElementById('theme-source').innerText = isDark ? 'Dark' : 'Light';
});

//nav info
document.getElementById('nav-info').innerText = navigator.userAgent;

//icon stuff
document.getElementById('icon').addEventListener('click', () => {
  location.reload();
});
if (window.mac.yes === true) { document.getElementById('icon').style.right = "4px"; document.getElementById('icon').style.left = "auto"; }