const API_URL = 'https://mebelmir-production.up.railway.app/api';

export async function getProducts() {
  const response = await fetch(`${API_URL}/products/`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export async function getCategories() {
  const response = await fetch(`${API_URL}/categories/`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

export async function getReviews(productId) {
  const response = await fetch(`${API_URL}/reviews/?product=${productId}`);
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
}

export async function createReview(reviewData, token) {
  const response = await fetch(`${API_URL}/reviews/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(reviewData)
  });
  if (!response.ok) throw new Error('Failed to create review');
  return response.json();
}

export async function canReview(productId, token) {
  const response = await fetch(`${API_URL}/can-review/${productId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to check review permission');
  return response.json();
}