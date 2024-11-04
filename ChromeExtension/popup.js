// popup.js

document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getReviewTexts" }, (response) => {
      if (response && response.reviewTexts) {
        callApiAndDisplay(response.reviewTexts);
      }
    });
  });
});

function callApiAndDisplay(reviewTexts) {
  console.log("REST API called ...");

  // Convert the array to a JSON string
  var jsonReviewTexts = JSON.stringify(reviewTexts);

  fetch('http://127.0.0.1:5001/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: jsonReviewTexts
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    showRecommendation(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function showRecommendation(data) {
  // Create a div
  var rootContainer = document.createElement('div');
  rootContainer.id = 'rootContainer';

  var sentimentElement = document.createElement('p');
  sentimentElement.textContent = `Review Sentiment: ${data.reviewSentiment}`;

  var keywordsElement = document.createElement('p');
  keywordsElement.textContent = `Popular Review Keywords: ${data.popularReviewKeywords.join(', ')}`;

  rootContainer.appendChild(sentimentElement);
  rootContainer.appendChild(keywordsElement);

  // Append the response in container
  document.body.appendChild(rootContainer);
}
