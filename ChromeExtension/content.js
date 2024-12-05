// content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getReviewTexts") {
    var elements = document.querySelectorAll('.review-text span');
    var reviewDateElements = document.querySelectorAll('span[data-hook="review-date"]');

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
