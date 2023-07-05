// Get the base URL of the extension directory
const baseUrl = chrome.extension.getURL('');

// Create a new <style> element containing CSS to replace the original icon with our custom icon
const style = document.createElement('style');
style.innerHTML = `
  .logo-hive:before {
    content: url(https://i.imgur.com/g9QSkQf.png) !important;
  }
`;

// Add the <style> element to the <head> of the document
document.head.appendChild(style);

function replaceText() {
    const hoverBoxes = document.querySelectorAll('.tippy-popper');
    hoverBoxes.forEach(hoverBox => {
      const walker = document.createTreeWalker(hoverBox, NodeFilter.SHOW_TEXT);
  
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const text = node.textContent;
        if (text.includes('Hive Rewards')) {
          const replacedText = text.replace(/Hive Rewards/g, 'Dollars');
          node.textContent = replacedText;
        }
      }
  
      const tippyContent = hoverBox.querySelector('.tippy-content');
      if (tippyContent) {
        tippyContent.innerHTML = tippyContent.innerHTML.replace(/Hive Rewards/g, 'Dollars');
      }
    });
  }
  
  // Define the observer options
  const observerOptions = {
    childList: true,
    subtree: true
  };
  
  // Define the callback function for the observer
  function observerCallback(mutationsList, observer) {
    mutationsList.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('tippy-popper')) {
            setTimeout(replaceText, 1);
          }
        });
      }
    });
  }
  
  // Create the observer and start observing the document
  const observer = new MutationObserver(observerCallback);
  observer.observe(document.documentElement, observerOptions);
  
  // Call the replaceText function initially
  replaceText();