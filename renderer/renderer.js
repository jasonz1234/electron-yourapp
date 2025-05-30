//updater stuff self-expantory
window.electronAPI.onUpdateAvailable(() => {
  //change this to a better popup
  alert('Update available. Downloading...');
});
document.getElementById('check-updates-btn').addEventListener('click', () => {
  window.electronAPI.checkForUpdates();
});

window.electronAPI.onUpdateAvailable(() => {
  //change this to a better popup
  alert('Update available. Downloading...');
});

window.electronAPI.onUpdateDownloaded(() => {
  //change this to a better popup
  if (confirm('Update downloaded. Restart now?')) {
    window.electronAPI.sendRestart();
  }
});


window.electronAPI.onUpdateDownloaded(() => {
  //change this to a better popup
  const shouldRestart = confirm('Update downloaded. Restart now?');
  if (shouldRestart) {
    window.electronAPI.sendRestart();
  }
});

document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDark = await window.darkMode.toggle();
  document.getElementById('theme-source').innerText = isDark ? 'Dark' : 'Light';
});


document.getElementById('nav-info').innerText = navigator.userAgent;

document.getElementById('icon').addEventListener('click', () => {
  location.reload();
});
