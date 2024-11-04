from textblob import TextBlob


class TextBlobSentimentAnalyzer:
    def __init__(self, text):
        if isinstance(text, list):
            text = ' '.join(text)  # Join the list into a single string
        self.text = text
        self.analysis = TextBlob(text)

    def get_sentiment(self):
        # Determine the sentiment polarity
        polarity = self.analysis.sentiment.polarity

        # Classify the sentiment as positive or negative
        if polarity > 0:
            return "Positive"
        elif polarity < 0:
            return "Negative"
        else:
            return "Neutral"



