// Add copy buttons to code blocks
function addCopyButtons() {
  document.querySelectorAll('pre').forEach((pre) => {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.innerHTML = 'Copy';
    
    pre.appendChild(button);

    button.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      const text = code?.innerText || '';

      try {
        await navigator.clipboard.writeText(text);
        button.innerHTML = 'Copied!';
        button.classList.add('copied');

        setTimeout(() => {
          button.innerHTML = 'Copy';
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
        button.innerHTML = 'Failed to copy';
      }
    });
  });
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', addCopyButtons); 