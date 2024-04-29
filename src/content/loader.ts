function createLoader() {
  // Get the current page's URL
  const currentUrl = window.location.href;

  // Check if the current URL starts with "chrome-extension://"
  // Adjust the condition based on your needs, e.g., specific paths for your extension's pages
  if (currentUrl.startsWith('chrome-extension://')) {
    console.log('Extension page detected, not showing the loader.');
    return; // Do not create the loader for extension pages
  }

  const loader = document.createElement('div');
  loader.setAttribute('id', 'myExtensionLoader');
  loader.style.position = 'fixed';
  loader.style.left = '0';
  loader.style.top = '0';
  loader.style.width = '100%';
  loader.style.height = '100%';
  loader.style.zIndex = '999999999';
  loader.style.backgroundColor = '#ffffff';
  loader.style.display = 'flex';
  loader.style.justifyContent = 'center';
  loader.style.alignItems = 'center';
  loader.innerHTML = `
        <div class="loader"></div>
    `;

  const loaderElement = loader.querySelector('.loader') as HTMLElement;

  if (loaderElement) {
    loaderElement.style.border = '16px solid #f9e9f1';
    loaderElement.style.borderRadius = '50%';
    loaderElement.style.borderTop = '16px solid #dc2b6b';
    loaderElement.style.width = '120px';
    loaderElement.style.height = '120px';
    loaderElement.style.animation = 'spin 2s linear infinite';
  }

  const style = document.createElement('style');
  style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
  document.head.appendChild(style);

  document.body.appendChild(loader);
}

function removeLoader() {
  const loader = document.getElementById('myExtensionLoader');
  if (loader) {
    loader.remove();
  }
}

const Loader = {
  createLoader,
  removeLoader,
};

export default Loader;
