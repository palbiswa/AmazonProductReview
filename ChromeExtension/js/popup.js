document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getReviewTexts" }, (response) => {
      console.log("Response from content script:", response);
      if (response && response.reviewTexts && response.reviewDates) {
        console.log('Review Texts:', response.reviewTexts); // Log to check if we got data
        console.log('Review Dates:', response.reviewDates);
        callApiAndDisplay(response.reviewTexts, response.reviewDates);
      }
    });
  });
  const modelRadios = document.querySelectorAll('input[name="model"]');
  modelRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      // Clear the existing content of rootContainer before making a new API call
      document.getElementById('rootContainer').innerHTML = '';

      // When the radio button changes, call API with selected model
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getReviewTexts" }, (response) => {
          console.log("Response from content script:", response);
          if (response && response.reviewTexts  && response.reviewDates ) {
            callApiAndDisplay(response.reviewTexts, response.reviewDates );  // Recalling with the updated model selection
          }
        });
      });
      displaySelectedModel();
    });
  });
});

function callApiAndDisplay(reviewTexts, reviewDates) {
  console.log("REST API called ...");

  // Get the selected model from the radio buttons
  const selectedModel = document.querySelector('input[name="model"]:checked').value;
  // Convert the array to a JSON string
  console.log("Selected Model:", selectedModel);
console.log("Review Texts:", reviewTexts);
console.log("Review Dates:", reviewDates);

  var jsonReviewTexts = JSON.stringify({ reviews: reviewTexts, model: selectedModel, reviewDates: reviewDates });

  fetch('http://127.0.0.1:5001/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: selectedModel,
      reviews: reviewTexts,
      reviewDates: reviewDates
    })
  })
  .then(response => response.json())
  .then(data => {
    showRecommendation(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}


function showRecommendation(data) {
  var rootContainer = document.getElementById('rootContainer');

  var sentimentElement = document.createElement('p');
  sentimentElement.textContent = `Review Sentiment: ${data.reviewSentiment} (Model used: ${data.modelUsed})`;
  sentimentElement.classList.add('highlight');

  var keywordsElement = document.createElement('p');
  keywordsElement.innerHTML = `<span class="key">Popular Review Keywords:</span> <span class="value">${data.popularReviewKeywords.join(', ')}</span>`;
  keywordsElement.classList.add('highlight-black');

  rootContainer.appendChild(sentimentElement);
  rootContainer.appendChild(keywordsElement);

  createBarChart(data.sentimentChartData, rootContainer);
}

function createBarChart(data, container) {
  // Create the bar chart
  var margin = {top: 30, right: 60, bottom: 60, left: 100},
      width = 700 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom;

  var svg = d3.select(container).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleBand()
    .domain(data.map((d, i) => i))
    .range([0, width])
    .padding(0.1);

  var y = d3.scaleLinear()
      .domain([0, d3.max(data)]).nice()
      .range([height, 0]);

  svg.append("g")
      .selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => x(i))
      .attr("y", height) // Start from the bottom
      .attr("width", x.bandwidth())
      .attr("height", 0) // Start with height 0
      .attr("fill", "steelblue")
      .transition() // Add transition
      .duration(3000) // Duration of the transition
      .attr("y", d => y(d))
      .attr("height", d => height - y(d));

  svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(i => i + 1));

  svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));

  // Add X axis label
  svg.append("text")
      .attr("class", "x-axis-label")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .text("Review Comments")
      .style("fill", "red");

  // Add Y axis label
  svg.append("text")
      .attr("class", "y-axis-label")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .text("Sentiment Levels")
      .style("fill", "red");
}

function displaySelectedModel() {
  var selectedModel = document.querySelector('input[name="model"]:checked').value;
  var modelLabel = document.getElementById('modelLabel');

  if (modelLabel) {
    modelLabel.textContent = `Selected Sentiment Analysis Model: ${selectedModel.charAt(0).toUpperCase() + selectedModel.slice(1)}`;
  }
}
