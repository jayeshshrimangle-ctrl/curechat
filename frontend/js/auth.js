// ============================================
// VECTORAX HEALTH CARE - Auth Utilities
// ============================================

const API_URL = window.location.origin + '/api';

// ---- Token Management ----
function setToken(token) {
  localStorage.setItem('vectorax_token', token);
}

function getToken() {
  return localStorage.getItem('vectorax_token');
}

function removeToken() {
  localStorage.removeItem('vectorax_token');
  localStorage.removeItem('vectorax_user');
}

function setUser(user) {
  localStorage.setItem('vectorax_user', JSON.stringify(user));
}

function getUser() {
  const user = localStorage.getItem('vectorax_user');
  return user ? JSON.parse(user) : null;
}

function isLoggedIn() {
  return !!getToken();
}

function logout() {
  removeToken();
  window.location.href = '/login';
}

// ---- API Request Helper ----
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        removeToken();
        if (!window.location.pathname.includes('login')) {
          window.location.href = '/login';
        }
      }
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please check if the server is running.');
    }
    throw error;
  }
}

// ---- Toast Notifications ----
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${icons[type] || 'ℹ'}</span>
    <span>${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ---- Navbar Auth State ----
function updateNavbarAuth() {
  const authContainer = document.getElementById('nav-auth');
  if (!authContainer) return;

  if (isLoggedIn()) {
    const user = getUser();
    authContainer.innerHTML = `
      <a href="/dashboard" class="nav-btn" style="background: rgba(14,165,233,0.15); color: var(--primary-light); border: 1px solid rgba(14,165,233,0.3);">
        <span>👤</span> ${user?.fullName?.split(' ')[0] || 'Dashboard'}
      </a>
      <button onclick="logout()" class="nav-btn" style="background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.2);">
        Logout
      </button>
    `;
  } else {
    authContainer.innerHTML = `
      <a href="/login" class="nav-btn" style="background: rgba(14,165,233,0.1); color: var(--primary-light); border: 1px solid rgba(14,165,233,0.2);">Login</a>
      <a href="/register" class="nav-btn">Get Started</a>
    `;
  }
}

// ---- Mobile Menu ----
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks?.classList.toggle('active');
}

// ---- Auth Guard ----
function requireAuth() {
  if (!isLoggedIn()) {
    showToast('Please login to continue', 'warning');
    setTimeout(() => window.location.href = '/login', 1000);
    return false;
  }
  return true;
}

// ---- Init on DOM Load ----
document.addEventListener('DOMContentLoaded', () => {
  updateNavbarAuth();

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }
  });
});
