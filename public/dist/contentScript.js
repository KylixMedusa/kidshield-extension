"use strict";
// Function to replace vulgar words in the page
function filterVulgarWords() {
    var VULGAR_WORDS = ["the", "is"]; // Add your list of words
    var REPLACEMENT_TEXT = "random";
    var bodyText = document.body.innerHTML;
    VULGAR_WORDS.forEach(function (word) {
        var regExp = new RegExp(word, "gi");
        bodyText = bodyText.replace(regExp, REPLACEMENT_TEXT);
    });
    document.body.innerHTML = bodyText;
}
// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("request", request);
    if (request.action === "filterWords") {
        filterVulgarWords();
        sendResponse({ status: "wordsFiltered" });
    }
});
