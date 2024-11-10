from textblob import TextBlob

class TextBlobSentimentTrends:

    def __init__(self, text_list):
        self.text_list = text_list

    def calculate_sentiment(self):
        sentiment_data = []
        for text in self.text_list:
            blob = TextBlob(text)
            sentiment_data.append(round(blob.sentiment.polarity, 2))
        return list(set(sentiment_data))

# Example usage:
text_list = ["I love this!", "This is terrible.", "I'm feeling great today."]
analyzer = TextBlobSentimentTrends(text_list)
sentiment_scores = analyzer.calculate_sentiment()
print(sentiment_scores)
