import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const getRecommendations = async (data) => {
  try {
    // In a real scenario:
    // const response = await axios.post(`${API_URL}/recommend/al-student`, data);
    // return response.data;

    // Simulating API call for UI development:
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          programs: [
            {
              id: 1,
              name: 'BSc. Computer Science',
              university: 'University of Colombo',
              duration: '4 Years',
              requiresConcours: true,
              examDetails: {
                name: 'UCSC Aptitude Test',
                month: 'August',
                deadline: '2026-07-15',
                fee: 'LKR 1,500'
              },
              portalUrl: '#'
            },
            {
              id: 2,
              name: 'BSc. Information Systems',
              university: 'University of Moratuwa',
              duration: '3 Years',
              requiresConcours: false,
              portalUrl: '#'
            },
            {
              id: 3,
              name: 'Software Engineering',
              university: 'SLIIT',
              duration: '4 Years',
              requiresConcours: false,
              portalUrl: '#'
            }
          ],
          certifications: [
            { id: 1, title: 'AWS Certified Solutions Architect', provider: 'Amazon Web Services', url: '#' },
            { id: 2, title: 'Google Data Analytics Certificate', provider: 'Coursera', url: '#' },
          ],
          books: [
            { id: 1, title: 'Clean Code', author: 'Robert C. Martin', url: '#' },
            { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', url: '#' },
          ]
        });
      }, 2000); // 2-second mock delay
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};
