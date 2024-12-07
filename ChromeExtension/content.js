// content.js

// Run when the page loads
//document.addEventListener('DOMContentLoaded', createBanner);

// Start the insertion process immediately

var elements = document.querySelectorAll('.review-text span');
var reviewTexts = [];
elements.forEach(element => {
  reviewTexts.push(element.innerHTML);
});
//sendResponse({ reviewTexts: reviewTexts });
callApiAndDisplay(reviewTexts);    


function createBanner(data) {
  const banner = document.createElement('div');
  if (data.reviewSentiment == "Strongly Positive") {
    banner.className = 'custom-banner-green';
  }
  else if (data.reviewSentiment == "Positive") {
    banner.className = 'custom-banner-light-green';
  }
  else if (data.reviewSentiment == "Neutral") {
    banner.className = 'custom-banner-yellow';
  }
  else if (data.reviewSentiment == "Negative") {
    banner.className = 'custom-banner-light-red';
  }
  else if (data.reviewSentiment == "Strongly Negative") {
    banner.className = 'custom-banner-red';
  }
  else {
    banner.className = 'custom-banner';
  }
  banner.textContent = `Review Sentiment: ${data.reviewSentiment}`;

  const targetNode = document.getElementById('nav-main') || document.getElementById('navbar');
  if (targetNode) {
    targetNode.parentNode.insertBefore(banner, targetNode.nextSibling);
    console.log('Banner inserted successfully');
  }
}

// Try to insert the banner multiple times
function attemptBannerInsertion(data) {
  let attempts = 0;
  const maxAttempts = 10;
  
  const tryInsert = () => {
    if (attempts >= maxAttempts) {
      console.log('Max attempts reached, banner insertion failed');
      return;
    }
    
    if (!document.getElementById('nav-main') && !document.getElementById('navbar')) {
      attempts++;
      console.log('Attempt ' + attempts + ': Amazon header not found yet, retrying...');
      setTimeout(tryInsert, 500);
    } else {

      createBanner(data);
    }
  };
  
  tryInsert();
}

// content.js
//chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //if (request.action === "getReviewTexts") {
   
  //}
//});

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
    attemptBannerInsertion(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

