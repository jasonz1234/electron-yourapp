const icon = document.getElementById('icon');

// updater button
document.getElementById('check-updates-btn').addEventListener('click', () => {
  window.electronAPI.checkForUpdates();
});

//devmode stuff turns on devtools for cef
document.getElementById('devmode').addEventListener('click', () => {
  window.electronAPI.devmode();
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
  document.getElementById('version').innerHTML = '<i class="fa-solid fa-tablet-button"></i> ' + appinfo;
});
// app updates
window.electronAPI.onUpdateNotAvailable(() => {
  document.getElementById('update-status').innerHTML = '<i class="fa-solid fa-ban"></i> No updates right now!!';
});

// theme btn
document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDark = await window.electronAPI.themeToggle();
  document.getElementById('theme-source').innerHTML = isDark ? '<i class="fa-solid fa-moon"></i> Dark' : '<i class="fa-solid fa-sun"></i> Light';
});

// nav info
document.getElementById('nav-info').innerHTML = navigator.userAgent;

// icon stuff
icon.addEventListener('click', () => {
  location.reload();
});
// macos icon thing
if (window.electronAPI.mac === false) { icon.style.right = "4px"; icon.style.left = "auto"; icon.style.textAlign = 'right'; }
