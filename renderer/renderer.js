// updater stuff self-expantory
document.getElementById('check-updates-btn').addEventListener('click', () => {
  window.electronAPI.checkForUpdates();
});

// Settings box stuff
document.getElementById('settings-box-exit').addEventListener('click', () => {
  document.getElementById('settings-container').style.display = 'none';
});
document.getElementById('Settings').addEventListener('click', () => {
  document.getElementById('settings-container').style.display = 'block';
});

// app info
window.appInfo.getVersion().then(appinfo => {
  console.log("App version:", appinfo);
  document.getElementById('version').innerText = appinfo;
});
// app updates
window.electronAPI.onUpdateNotAvailable(() => {
  document.getElementById('update-status').innerText = 'No updates right now';
});

// theme btn
document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDark = await window.darkMode.toggle();
  document.getElementById('theme-source').innerText = isDark ? 'Dark' : 'Light';
});

// nav info
document.getElementById('nav-info').innerText = navigator.userAgent;

// icon stuff
document.getElementById('icon').addEventListener('click', () => {
  location.reload();
});
if (window.mac.yes === true) { document.getElementById('icon').style.right = "4px"; document.getElementById('icon').style.left = "auto"; }