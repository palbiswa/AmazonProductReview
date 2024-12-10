# How to use the Software

---
# Amazon Product Review Chrome Extension

Welcome to **Amazon Product Review**, a Chrome extension that performs sentiment analysis on Amazon product reviews. This tool integrates a browser extension with a backend server to provide real-time insights into customer feedback.

---

## 🛠️ Features
- Analyze sentiment of Amazon product reviews (positive, negative, neutral).
- Intuitive Chrome extension interface.
- Powered by backend TextMining for advanced sentiment analysis with key phrases from review comments, charts and review trends.

---

## 📂 Repository Structure
1. **ChromeExtension**: Contains the source code for the Chrome extension.
2. **TextMining**: Backend server code that processes sentiment analysis.

GitHub Repository: [Amazon Product Review](https://github.com/palbiswa/AmazonProductReview)

---

## 🚀 Installation Guide

### Step 1: Clone the Repository
1. Clone this repository using Git:
   ```bash
   git clone https://github.com/palbiswa/AmazonProductReview.git

Navigate to the project directory:
```bash
    cd AmazonProductReview
```

### Step 2: Set Up the Chrome Extension
1. Open Google Chrome and go to chrome://extensions/.
2. Enable Developer mode by toggling the switch at the top-right.
3. Click Load unpacked and select the ChromeExtension folder from the cloned repository.
4. The extension will now appear in your browser toolbar as Amazon Product Review.

### Step 3: Set Up the Backend Server
1. Navigate to the TextMining directory:
```bash
   cd TextMining
```   
2. Install required dependencies. 
   For example install the corresponding packages like nltk,flask, CORS,TextBlob, VaderSentiment and related packages mentioned in python code.
3. Start the backend server using ProductAnalyserApp.py. This is the flask class which will run the server to receive REST API request from Chrome extension
4. Ensure the server is running and accessible. If it runs properly it will show the following like in console.
 INFO:werkzeug:WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5001
 * Running on http://192.168.0.11:5001
INFO:werkzeug:Press CTRL+C to quit


### Step 4: Configure the Chrome Extension
Open the Chrome extension settings by clicking the extension icon.

## Usage Guide
Analyze Amazon Product Reviews
1. Open Amazon home page page.
2. Navigate to any one specific product page where user have some reviews. Here in the example I searched SONY TV and went to a product page where I can see user reviews.
Here is screen for an example.
![Sony TV Amazon Product Page](assets/amazon_product_page.png)
3. If you scroll up you will see a green banner on the top of this same page, which is showing
review sentiment for this product based on user reviews mentioned in this page. This triggers the extension on page load to show upfront feedback.
Here is the example screen shot.
![Green Sentiment Banner on Top of the page](assets/sentiment_banner.png).
4. If Sentiment is different it will show accordingly based on following logic.
```bash
   if polarity < -0.5:
            return "Strongly Negative"
        elif polarity > -0.5 and polarity < 0:
            return "Negative"
        elif polarity == 0:
            return "Neutral"
        elif polarity > 0 and polarity < 0.5:
            return "Positive"
        else:
            return "Strongly Positive" # polarity > 0.5
```
4. If want to see details review about the product then click on the extension Amazon Product Review as mentioned in bellow screenshot to open the extension pop up.
![Load Extension pop up](assets/invikeExtension.png).
5. It will open a pop up and show Product Review insights.
![Extension Pop Up Page](assets/pop-up_page.png).
6. Here user can select two different model to generate sentiment level bar chart and date wise sentiment trends based on available data present in amazon real LIVE page
and able to get key phrases based on the review comments posted on Amazon page for this product.

### 🔧 Troubleshooting
1. Issue: Extension not loading
      1. Ensure you loaded the ChromeExtension folder. 
      2. Check for a valid manifest.json file.
2. Issue: Backend server not working
      1. Ensure Python dependencies are installed.
      2. Verify the server is running at http://127.0.0.1:5001


## How the software is implemented.

---

## Overview
**Amazon Product Review** is a Chrome extension integrated with a backend server for performing sentiment analysis on Amazon product reviews. The project is designed to extract review data from Amazon's product pages and process it through natural language processing (NLP) techniques to provide users with actionable insights.

---

## Features
- Extracts customer reviews directly from Amazon product pages.
- Performs sentiment analysis to classify reviews as Positive, Negative, or Neutral.
- Displays summarized results in the browser.

---
## Project Structure
The repository contains two primary components:

1. **ChromeExtension**
   - A browser extension written in JavaScript, HTML, and CSS.
   - Responsible for interacting with Amazon's webpage to collect review data.
   - Sends review data to the backend for processing.

2. **TextMining**
   - A backend service implemented to process reviews using NLP techniques.
   - Classifies sentiments and returns results to the extension.
   - Built using Python and uses libraries such as `NLTK`, `TextBlob`, or `Vader Sentiment`.

---

## Implementation Details

### 1. Chrome Extension
- **Technologies Used**: JavaScript, HTML, CSS
- **Key Functionalities**:
  - Scrapes review data from the product page using DOM manipulation.
  - Sends HTTP requests to the backend server with the extracted data.
  - Displays the sentiment analysis results directly in the browser main page and extension pop up.
  - D3.JS is used for charts

### 2. Backend (TextMining)
- **Technologies Used**: Python
- **Key Functionalities**:
  - Implements RESTful APIs to communicate with the Chrome extension.
  - Processes the review data using sentiment analysis algorithms.
  - Returns JSON responses with sentiment classification.

## How It Works
1. The Chrome extension scrapes reviews from the active Amazon product page.
2. The extension sends the extracted data to the backend server via a POST request.
3. The backend processes the reviews and performs sentiment analysis.
4. The analysis results are sent back to the extension and displayed in the browser.
5. You can look into the implementation from the github code. Here is the quick snapshots of the file structure.

- UI Code Files

![UI Code Files](assets/UI_Code.png).

- Python Text Mining Backend Code Files

![Backend Python Text Mining Files](assets/Python_Code.png).
   

---
## Evaluation