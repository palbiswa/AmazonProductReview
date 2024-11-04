// content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getReviewTexts") {
    var elements = document.querySelectorAll('.review-text span');
    var reviewTexts = [];

    elements.forEach(element => {
      reviewTexts.push(element.innerHTML);
    });

    sendResponse({ reviewTexts: reviewTexts });
  }
});
