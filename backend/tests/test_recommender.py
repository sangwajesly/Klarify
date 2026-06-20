"""
Unit tests for the Recommender class.
Verifies that TF-IDF vectorization and precomputation work correctly.
"""

import pytest
import numpy as np
from app.core.recommender import Recommender


class TestRecommender:
    """Test the Recommender class with precomputed vectors."""

    def setup_method(self):
        """Create a fresh recommender instance for each test."""
        self.recommender = Recommender()
        self.sample_programs = [
            "Machine Learning and Artificial Intelligence",
            "Data Science and Analytics",
            "Web Development and JavaScript",
            "Mobile Application Development",
            "Cloud Computing and DevOps"
        ]

    def test_fit_precomputes_vectors(self):
        """Verify that fit() correctly precomputes program vectors."""
        assert not self.recommender.is_fitted
        assert self.recommender.program_vectors is None
        
        self.recommender.fit(self.sample_programs)
        
        assert self.recommender.is_fitted
        assert self.recommender.program_vectors is not None
        assert self.recommender.program_vectors.shape[0] == len(self.sample_programs)

    def test_calculate_similarities_after_fit(self):
        """Verify similarities are calculated correctly after fitting."""
        self.recommender.fit(self.sample_programs)
        
        user_text = "I like programming and data analysis"
        similarities = self.recommender.calculate_similarities(user_text)
        
        assert len(similarities) == len(self.sample_programs)
        assert all(isinstance(s, float) for s in similarities)
        assert all(0 <= s <= 1 for s in similarities)  # Cosine similarity is normalized

    def test_calculate_similarities_without_fit(self):
        """Verify that calculate_similarities returns empty list before fitting."""
        user_text = "test query"
        similarities = self.recommender.calculate_similarities(user_text)
        
        assert similarities == []

    def test_fit_with_empty_corpus(self):
        """Verify fit handles empty corpus gracefully."""
        self.recommender.fit([])
        
        assert not self.recommender.is_fitted
        assert self.recommender.program_vectors is None

    def test_similarity_ranking(self):
        """Verify that similar queries return higher similarities for related programs."""
        self.recommender.fit(self.sample_programs)
        
        # Query related to machine learning
        ml_query = "machine learning artificial intelligence neural networks"
        ml_similarities = self.recommender.calculate_similarities(ml_query)
        
        # Query related to web development
        web_query = "web development JavaScript React frontend"
        web_similarities = self.recommender.calculate_similarities(web_query)
        
        # ML query should score ML program higher than web query does
        ml_score = ml_similarities[0]  # "Machine Learning and Artificial Intelligence"
        web_ml_score = web_similarities[0]
        
        assert ml_score > web_ml_score


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
