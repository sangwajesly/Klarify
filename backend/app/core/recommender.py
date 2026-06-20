from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class Recommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.program_vectors = None
        self.is_fitted = False
        
    def fit(self, corpus: list[str]):
        """Fit the TF-IDF vectorizer on the corpus of program descriptions and precompute vectors."""
        if not corpus:
            return
        self.vectorizer.fit(corpus)
        self.program_vectors = self.vectorizer.transform(corpus)
        self.is_fitted = True
        
    def calculate_similarities(self, user_text: str) -> list[float]:
        """Calculate cosine similarity between user profile and precomputed programs."""
        if not self.is_fitted or self.program_vectors is None:
            return []
            
        # Transform user text
        user_vector = self.vectorizer.transform([user_text])
        
        # Calculate cosine similarity between user_vector and precomputed program_vectors
        similarities = cosine_similarity(user_vector, self.program_vectors).flatten()
        return similarities.tolist()

# Singleton recommender instance
ml_recommender = Recommender()
