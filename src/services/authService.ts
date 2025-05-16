import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to requests if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (email: string, password: string): Promise<string> => {
  try {
    // Check localStorage for registered users
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const found = users.find((u: any) => u.email === email && u.password === password);

    if (found) {
      // Generate JWT for this user
      const header = { alg: "HS256", typ: "JWT" };
      const payload = {
        sub: found.id,
        email: found.email,
        name: found.name,
        iat: Math.floor(Date.now() / 1000)
      };

      function base64url(source: string) {
        let encodedSource = btoa(unescape(encodeURIComponent(source)));
        encodedSource = encodedSource.replace(/=+$/, '');
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');
        return encodedSource;
      }

      const encodedHeader = base64url(JSON.stringify(header));
      const encodedPayload = base64url(JSON.stringify(payload));
      const signature = "mock-signature";
      const token = `${encodedHeader}.${encodedPayload}.${signature}`;
      return token;
    }

    // Fallback to hardcoded demo users
    if (email === 'admin@library.edu' && password === 'admin123') {
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMSIsImVtYWlsIjoiYWRtaW5AbGlicmFyeS5lZHUiLCJuYW1lIjoiQWRtaW4gTGlicmFyaWFuIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    } else if (email === 'john@student.edu' && password === 'john123') {
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMiIsImVtYWlsIjoiam9obkBzdHVkZW50LmVkdSIsIm5hbWUiOiJKb2huIFN0dWRlbnQiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    } else if (email === 'sarah@student.edu' && password === 'sarah123') {
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMyIsImVtYWlsIjoic2FyYWhAc3R1ZGVudC5lZHUiLCJuYW1lIjoiU2FyYWggU3R1ZGVudCIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    }

    throw new Error('Invalid email or password');
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const register = async (name: string, email: string, password: string): Promise<string> => {
  try {
    // For demo purposes we'll simulate a successful registration
    console.log('Registering with:', name, email, password);

    // Generate a unique user ID for the new user
    const userId = `user${Date.now()}`;

    // Save user to localStorage
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    users.push({ id: userId, email, name, password });
    localStorage.setItem('mock_users', JSON.stringify(users));

    // Create JWT parts
    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
      sub: userId,
      email,
      name,
      iat: Math.floor(Date.now() / 1000)
    };

    function base64url(source: string) {
      let encodedSource = btoa(unescape(encodeURIComponent(source)));
      encodedSource = encodedSource.replace(/=+$/, '');
      encodedSource = encodedSource.replace(/\+/g, '-');
      encodedSource = encodedSource.replace(/\//g, '_');
      return encodedSource;
    }

    const encodedHeader = base64url(JSON.stringify(header));
    const encodedPayload = base64url(JSON.stringify(payload));
    const signature = "mock-signature"; // Not validated in frontend

    const token = `${encodedHeader}.${encodedPayload}.${signature}`;
    return token;

    // Real implementation:
    // const response = await axiosInstance.post('/auth/register', { name, email, password });
    // return response.data.token;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    // For demo purposes we'll simulate a successful password reset request
    console.log('Password reset requested for:', email);
    
    // Real implementation:
    // await axiosInstance.post('/auth/forgot-password', { email });
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Password reset failed');
    }
    throw new Error('Network error. Please try again later.');
  }
};