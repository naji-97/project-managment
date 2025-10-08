// client/lib/auth.ts
const API_BASE_URL = 'http://localhost:8000'; // Your backend URL

export interface User {
  id: number;
  email: string;
  name: string;
  username: string;
}

export interface AuthResponse {
  data?: {
    user: User;
    session: any;
  };
  error?: string;
}

export const authAPI = {
  signUp: async (email: string, password: string, name: string, username: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, username }),
      credentials: 'include', // Important for cookies
    });
    return await response.json();
  },

  signIn: async (email: string, password: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/sign-in/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });
        console.log("signIn response status" ,response.status);
        console.log("signIn response headers" ,Object.fromEntries(response.headers.entries()));
        const data= await response.json();
        console.log("signIn response data" ,data);
        return await data;
      
    } catch (error) {
        console.log("signIn error" ,error);
        throw error;
        
    }
  },
  getSession: async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/me`, {
          credentials: 'include',
        });
        console.log("response status" ,response.status);
        console.log("response headers" ,Object.fromEntries(response.headers.entries()));
        
        
        const data= await response.json();
        console.log("session data" ,data);
        return data;
    } catch (error) {
        console.error('Error fetching session:', error);
        
    }
  },

  signOut: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-out`, {
      method: 'POST',
      credentials: 'include',
    });
    return await response.json();
  },
};