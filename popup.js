// Get references to the elements in the popup
const bookmarkBtn = document.getElementById('bookmarkBtn');
const timestampList = document.getElementById('timestampList');

// Add a bookmark when the button is clicked
bookmarkBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: saveTimestamp
    });
  });
});

// Function to save the timestamp
function saveTimestamp() {
  const video = document.querySelector('video');
  const timestamp = video.currentTime;
  const videoId = new URL(window.location.href).searchParams.get('v');
  
  chrome.storage.sync.get([videoId], (data) => {
    let timestamps = data[videoId] || [];
    timestamps.push(timestamp);

    chrome.storage.sync.set({ [videoId]: timestamps }, () => {
      console.log('Timestamp saved:', timestamp);
    });
  });
}

// Load and display saved timestamps when the popup opens
// Load and display saved timestamps when the popup opens
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = new URL(tabs[0].url);
    const videoId = url.searchParams.get('v');
  
    chrome.storage.sync.get(videoId ? [videoId] : null, (data) => {
      const timestamps = data[videoId] || [];
      timestampList.innerHTML = '';
      
      timestamps.forEach((timestamp) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = formatTimestamp(timestamp);
        link.href = '#';
        link.addEventListener('click', () => {
          chrome.tabs.update(tabs[0].id, { url: `${tabs[0].url}&t=${Math.floor(timestamp)}s` });
        });
        li.appendChild(link);
        timestampList.appendChild(li);
      });
    });
  });
  

// Helper function to format the timestamp
function formatTimestamp(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}
