// Function to replace vulgar words in the page
function filterVulgarWords(): void {
  const VULGAR_WORDS: string[] = ["the", "is"]; // Add your list of words
  const REPLACEMENT_TEXT: string = "random";

  let bodyText: string = document.body.innerHTML;

  VULGAR_WORDS.forEach((word: string) => {
    const regExp: RegExp = new RegExp(word, "gi");
    bodyText = bodyText.replace(regExp, REPLACEMENT_TEXT);
  });

  document.body.innerHTML = bodyText;
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(
  (
    request: { action: string },
    sender,
    sendResponse: (response: { status: string }) => void
  ) => {
    console.log("request", request);
    if (request.action === "filterWords") {
      filterVulgarWords();
      sendResponse({ status: "wordsFiltered" });
    }
  }
);
