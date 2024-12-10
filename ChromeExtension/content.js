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
    banner.className = 'custom-banner-orange';
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

function callApiAndDisplay(reviewTexts) {
  console.log("REST API called ...");

  // Convert the array to a JSON string
  var jsonReviewTexts = JSON.stringify(reviewTexts);

  fetch('http://127.0.0.1:5001/bannerTone', {
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request.action);
   if (request.action === "getReviewTexts") {
    var elements = document.querySelectorAll('.review-text span');
    var reviewDateElements = document.querySelectorAll('span[data-hook="review-date"]');
    if(reviewDateElements.length === 0) {
      reviewDateElements = document.querySelectorAll('h6[data-hook="review-date"]');
    }


    var reviewTexts = [];
    var reviewDates = [];


    elements.forEach((element, index) => {
        reviewTexts.push(element.innerHTML);
    });

    reviewDateElements.forEach((dateElement) => {
      // Extract and trim the date text
      var reviewDate = dateElement.textContent.trim();

      if (reviewDate) {
        // Remove the "Reviewed in the United States on " part of the string
        var cleanedDate = reviewDate.replace(/Reviewed in the United States on\s+/i, '');

        // Log the cleaned date string for debugging purposes
        console.log('Cleaned Date String:', cleanedDate);

        // Convert the cleaned-up date string into a JavaScript Date object
        var dateObj = new Date(cleanedDate);

        // If the date is valid (check if `dateObj` is a valid Date object)
        if (!isNaN(dateObj)) {
          reviewDates.push(dateObj.toLocaleDateString());
        } else {
          console.log('Invalid date format:', reviewDate);
        }
      }
    });

    // Log the final arrays
    console.log('Final Review Texts:', reviewTexts);
    console.log('Final Review Dates:', reviewDates);

    sendResponse({ reviewTexts: reviewTexts, reviewDates: reviewDates });
  }
});