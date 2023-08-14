// Get the base URL of the extension directory
const baseUrl = chrome.extension.getURL('');

// Create a new <style> element containing CSS to replace the original icon with our custom icon
const style = document.createElement('style');
style.innerHTML = `
  .logo-hive:before {
    content: url(https://raw.githubusercontent.com/Hamodebu50/Hive-To-Dollar-Sign-Addon/a28dbe56b1fcfd2c189ae0dcc53f229648731b20/CustomIcon.svg) !important;
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

 // Define the function to parse the numerical value from text
function parseNumericalValue(text) {
  const match = text.match(/\b\d+\.\d{3}\b|\d+\.\d{3}(?![\d.])/); // Match numbers with exactly 3 decimal places
  if (match) {
    return parseFloat(match[0]);
  }
  return null;
}
// Calculate the breakdown of the parsed dollar value
function calculateBreakdown(dollarValue, hivePrice) {
  const hbdValue = dollarValue / 2;
  const hiveValue = hbdValue / hivePrice;

  return { hbdValue, hiveValue };
}

let cachedHivePrice = null;
let lastFetchedTime = 0;
const cacheDuration = 600000; // Cache duration in milliseconds (10 minutes)

// Fetch the latest HIVE price from CoinGecko's API or return cached value
async function fetchHivePrice() {
  const currentTime = new Date().getTime();

  if (cachedHivePrice !== null && currentTime - lastFetchedTime <= cacheDuration) {
    return cachedHivePrice;
  }

  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=hive&vs_currencies=usd');
    const data = await response.json();
    cachedHivePrice = data.hive.usd;
    lastFetchedTime = currentTime;
    return cachedHivePrice;
  } catch (error) {
    console.error('Error fetching HIVE price:', error);
    return null;
  }
}

// Check for hoverbox appearance periodically
const checkInterval = setInterval(async () => {
  const hivePrice = await fetchHivePrice();

  if (hivePrice !== null) {
    // Find all elements with class .tippy-content
    const tippyContentElements = document.querySelectorAll('.tippy-content');

    // Parse, calculate breakdown, and modify the content of each tippy-content element
    tippyContentElements.forEach(element => {
      if (!element.hasAttribute('data-added-breakdown')) {
        const contentText = element.textContent;

        // Check if the content contains "Dollars"
        if (contentText.includes("Dollars")) {
          const dollarValue = parseNumericalValue(contentText);

          if (dollarValue !== null) {
            const { hbdValue, hiveValue } = calculateBreakdown(dollarValue, hivePrice);

            const hbdLine = document.createElement('div');
            hbdLine.textContent = `${hbdValue.toFixed(2)} HBD`;
            hbdLine.classList.add('left-aligned'); // Add CSS class for left alignment
            element.appendChild(hbdLine);

            const hiveLine = document.createElement('div');
            hiveLine.textContent = `${hiveValue.toFixed(2)} HIVE`;
            hiveLine.classList.add('left-aligned'); // Add CSS class for left alignment
            element.appendChild(hiveLine);

            element.setAttribute('data-added-breakdown', 'true');
          }
        }
      }
    });
  }
}, 100); // Check every 100 milliseconds
