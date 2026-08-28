const form = document.getElementById('builder-form');
const promptInput = document.getElementById('prompt');
const count = document.getElementById('character-count');
const generateButton = document.getElementById('generate-button');
const loadingPanel = document.getElementById('loading-panel');
const previewSection = document.getElementById('preview-section');
const preview = document.getElementById('website-preview');
const errorMessage = document.getElementById('error-message');
const downloadButton = document.getElementById('download-button');
const fullscreenButton = document.getElementById('fullscreen-button');
let generatedHtml = '';

promptInput.addEventListener('input', () => {
  count.textContent = `${promptInput.value.length.toLocaleString()} / 2,000`;
});

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('visible');
}

function clearError() {
  errorMessage.textContent = '';
  errorMessage.classList.remove('visible');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const prompt = promptInput.value.trim();
  if (!prompt) {
    showError('Tell us what kind of website you want to build first.');
    promptInput.focus();
    return;
  }

  clearError();
  generateButton.disabled = true;
  loadingPanel.hidden = false;
  previewSection.hidden = true;

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'We could not build your website. Please try again.');
    if (typeof data.html !== 'string' || !data.html.toLowerCase().includes('<html')) throw new Error('The AI returned an invalid website. Please try again.');

    generatedHtml = data.html;
    preview.srcdoc = generatedHtml;
    previewSection.hidden = false;
    previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    showError(error.message || 'A network error occurred. Please try again.');
  } finally {
    loadingPanel.hidden = true;
    generateButton.disabled = false;
  }
});

downloadButton.addEventListener('click', () => {
  if (!generatedHtml) return;
  const blob = new Blob([generatedHtml], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'website.html';
  link.click();
  URL.revokeObjectURL(link.href);
});

fullscreenButton.addEventListener('click', () => {
  if (!generatedHtml) return;
  const url = URL.createObjectURL(new Blob([generatedHtml], { type: 'text/html' }));
  window.open(url, '_blank', 'noopener,noreferrer');
  setTimeout(() => URL.revokeObjectURL(url), 60000);
});
