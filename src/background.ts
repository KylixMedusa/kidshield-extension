// Define the type for the request object
interface Request {
  action: string;
}

// Define the type for the sender object (optional, based on use case)
// interface Sender { ... }

let processedTabs: Record<number, boolean> = {};
let enabled: boolean = false;

const processTab = (tabId: number) => {
  chrome.tabs.sendMessage(
    tabId,
    { action: "filterWords" },
    (response: { status: string }) => {
      if (chrome.runtime.lastError) {
        console.log(`Error: ${chrome.runtime.lastError.message}`);
      } else {
        // Handle the response
        console.log(response?.status);
      }
    }
  );

  processedTabs[tabId] = true;
};

// whenever a tab is visited check if it has been processed
chrome.tabs.onActivated.addListener((activeInfo) => {
  if (enabled) {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      if (tab.id && !processedTabs[tab.id]) {
        // The tab hasn't been processed yet
        processTab(tab.id);
      }
    });
  }
});

// whenever a new tab is opened or a tab is updated check if it has been processed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (enabled) {
    if (changeInfo.status === "complete") {
      // The tab has finished loading and hasn't been processed yet
      processTab(tabId);
    }
  }
});

// whenever a tab is reloaded check if it has been processed
chrome.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
  if (enabled) {
    // The tab hasn't been processed yet
    processTab(addedTabId);
  }
});

// whenever a tab is closed remove it from the list of processed tabs
chrome.tabs.onRemoved.addListener((tabId) => {
  // Clean up when the tab is closed
  delete processedTabs[tabId];
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(
  (
    request: Request,
    sender,
    sendResponse: (response: { status: string }) => void
  ) => {
    if (request.action === "statusChange") {
      chrome.storage.local.get(["enabled"], function (result) {
        console.log("Value currently is " + result.enabled);
        enabled = result.enabled;

        // process all tabs
        if (enabled) {
          chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
              if (tab.id && !processedTabs[tab.id]) {
                // The tab hasn't been processed yet
                processTab(tab.id);
              }
            });
          });
        } else {
          // Clean up when the extension is disabled
          processedTabs = {};
        }
      });
    }
  }
);

// on install set the default value for the enabled flag
chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ enabled: false }, function () {
    console.log("Enabled set to false");
  });
});
