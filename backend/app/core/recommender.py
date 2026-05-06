from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class Recommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.is_fitted = False
        
    def fit(self, corpus: list[str]):
        """Fit the TF-IDF vectorizer on the corpus of program descriptions."""
        if not corpus:
            return
        self.vectorizer.fit(corpus)
        self.is_fitted = True
        
    def calculate_similarities(self, user_text: str, programs_text: list[str]) -> list[float]:
        """Calculate cosine similarity between user profile and programs."""
        if not self.is_fitted or not programs_text:
            return [0.0] * len(programs_text)
            
        # Transform user text and program texts
        all_texts = [user_text] + programs_text
        tfidf_matrix = self.vectorizer.transform(all_texts)
        
        # Calculate cosine similarity between user (index 0) and programs (index 1 to end)
        user_vector = tfidf_matrix[0:1]
        program_vectors = tfidf_matrix[1:]
        
        similarities = cosine_similarity(user_vector, program_vectors).flatten()
        return similarities.tolist()

# Singleton recommender instance
ml_recommender = Recommender()
