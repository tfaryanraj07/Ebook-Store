import { ALL_PRODUCTS, COUPONS } from '../data/products';

const rawEnvUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const cleanUrl = rawEnvUrl.replace(/\/+$/, '');
const API_BASE_URL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

// Helper for fetch with JSON and auth header
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('hengyi_auth_token') || localStorage.getItem('hengyi_admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Server request failed');
    }
    return data;
  } catch (err) {
    console.warn(`API request to ${endpoint} failed:`, err.message);
    throw err;
  }
}

// Background server warm-up to mitigate Render cold starts
export async function apiWakeupServer() {
  try {
    const rawUrl = API_BASE_URL.replace(/\/api$/, '');
    await fetch(`${rawUrl}/health`, { mode: 'cors' });
  } catch (e) {
    // Ignore warm-up notices
  }
}

// 1. PRODUCTS API
export async function apiFetchProducts() {
  try {
    return await request('/products');
  } catch (e) {
    const local = localStorage.getItem('hengyi_products');
    return local ? JSON.parse(local) : ALL_PRODUCTS;
  }
}

export async function apiUpdateProductPrice(id, price) {
  try {
    const res = await request(`/products/${id}/price`, {
      method: 'PUT',
      body: JSON.stringify({ price }),
    });
    return res.product;
  } catch (e) {
    return null;
  }
}

export async function apiBulkUpdatePrice(price) {
  try {
    const res = await request('/products/bulk-price', {
      method: 'POST',
      body: JSON.stringify({ price }),
    });
    return res.products;
  } catch (e) {
    return null;
  }
}

export async function apiCreateProduct(productData) {
  try {
    return await request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  } catch (e) {
    return productData;
  }
}

export async function apiDeleteProduct(id) {
  try {
    return await request(`/products/${id}`, { method: 'DELETE' });
  } catch (e) {
    return { id };
  }
}

// 2. COUPONS API
export async function apiFetchCoupons() {
  try {
    return await request('/coupons');
  } catch (e) {
    const local = localStorage.getItem('hengyi_coupons');
    return local ? JSON.parse(local) : COUPONS;
  }
}

export async function apiApplyCoupon(code, cartAmount) {
  try {
    return await request('/coupons/apply', {
      method: 'POST',
      body: JSON.stringify({ code, cartAmount }),
    });
  } catch (e) {
    return null;
  }
}

export async function apiCreateCoupon(couponData) {
  try {
    return await request('/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData),
    });
  } catch (e) {
    return couponData;
  }
}

export async function apiDeleteCoupon(code) {
  try {
    return await request(`/coupons/${code}`, { method: 'DELETE' });
  } catch (e) {
    return { code };
  }
}

// 3. AUTH API
export async function apiRegisterUser(name, email, password) {
  const res = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  if (res.token) {
    localStorage.setItem('hengyi_auth_token', res.token);
  }
  return res.user;
}

export async function apiLoginUser(email, password) {
  const res = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (res.token) {
    localStorage.setItem('hengyi_auth_token', res.token);
  }
  return res.user;
}

export async function apiAdminLogin(email, passcode) {
  const res = await request('/auth/admin-login', {
    method: 'POST',
    body: JSON.stringify({ email, passcode }),
  });
  if (res.token) {
    localStorage.setItem('hengyi_admin_token', res.token);
  }
  return res.user;
}

// 4. PAYMENTS & ORDERS API
export async function apiCreateRazorpayOrder(orderData) {
  try {
    return await request('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  } catch (e) {
    return null;
  }
}

export async function apiVerifyRazorpayPayment(paymentData) {
  try {
    return await request('/payments/verify-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  } catch (e) {
    return null;
  }
}

export async function apiFetchOrders() {
  try {
    return await request('/orders');
  } catch (e) {
    const local = localStorage.getItem('hengyi_orders');
    return local ? JSON.parse(local) : [];
  }
}
