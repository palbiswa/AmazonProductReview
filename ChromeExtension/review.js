// Call the function
callApiAndDisplay();

function callApiAndDisplay() {
  console.log("REST API called ...");
  var elements = document.querySelectorAll('.review-text span');
  var reviewTexts = [];

  elements.forEach(element => {
        reviewTexts.push(element.innerHTML);
    });


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


// This function will display the result in the extension popup window
function showRecommendation(data){

    // Create a div
    var responseContainer = document.createElement('div');
    responseContainer.id = 'responseContainer';

    var sentimentElement = document.createElement('p');
    sentimentElement.textContent = `Review Sentiment: ${data.reviewSentiment}`;

    var keywordsElement = document.createElement('p');
    keywordsElement.textContent = `Popular Review Keywords: ${data.popularReviewKeywords.join(', ')}`;

    responseContainer.appendChild(sentimentElement);
    responseContainer.appendChild(keywordsElement);

    // Append the response in container
    document.body.appendChild(responseContainer);
}



