const API_URL = 'https://your-vercel-app.vercel.app';

const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const obfuscateBtn = document.getElementById('obfuscateBtn');
const copyBtn = document.getElementById('copyBtn');
const copyUrlBtn = document.getElementById('copyUrlBtn');
const statusEl = document.getElementById('status');
const urlDisplayEl = document.getElementById('urlDisplay');

let currentUrl = '';

obfuscateBtn.addEventListener('click', async () => {
  const code = inputEl.value.trim();
  if (!code) {
    showStatus('Please enter some Lua code', 'error');
    return;
  }

  obfuscateBtn.disabled = true;
  obfuscateBtn.textContent = 'Processing...';
  showStatus('Compiling to custom bytecode...', '');

  try {
    const response = await fetch(`${API_URL}/api/obfuscate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Obfuscation failed');
    }

    outputEl.value = data.script;
    currentUrl = data.url;

    copyBtn.disabled = false;
    copyUrlBtn.disabled = false;

    urlDisplayEl.innerHTML = `<a href="${data.url}" target="_blank">${data.url}</a>`;
    showStatus(`Obfuscated successfully | ${data.script.length} chars | ID: ${data.id}`, 'success');
  } catch (err) {
    showStatus(`Error: ${err.message}`, 'error');
  } finally {
    obfuscateBtn.disabled = false;
    obfuscateBtn.textContent = 'Obfuscate';
  }
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(outputEl.value);
  showStatus('Output copied to clipboard', 'success');
});

copyUrlBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(currentUrl);
  showStatus('URL copied to clipboard', 'success');
});

function showStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = type;
}
