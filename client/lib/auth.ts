// client/lib/auth.ts
import { createAuthClient } from 'better-auth/react';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const authClient = createAuthClient({
  baseURL: `${API_BASE_URL}/api/auth`, // `API_BASE_URL/
});
export interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  profilePictureUrl: string;
}

export interface AuthResponse {
  data?: {
    user: User;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: any;
  };
  error?: string;
}


export const authAPI = {
   signInSocial: (provider: "google" | "github") => {
       authClient.signIn.social({provider,
      callbackURL: process.env.NEXT_PUBLIC_APP_URL
    });
  },

  signUp: async (email: string, password: string, name: string, username: string, ) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, username }),
      credentials: 'include', // Important for cookies
    });
    console.log("response signup" ,response);
    
    return await response.json() ;
  },

  signIn: async (email: string, password: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/sign-in/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });
        console.log("Sign-in response status:", response.status);
      console.log("Sign-in response cookies:", response.headers.get('set-cookie'));
      console.log("Document cookies after sign-in:", document.cookie);
        console.log("signIn response data" ,response);
        return  response.json();
      
    } catch (error) {
        console.log("signIn error" ,error);
        throw error;
        
    }
  },
  getSession: async () => {
  try {
      console.log("Document cookies:", document.cookie);
      console.log("API_BASE_URL:", API_BASE_URL);
      
      const response = await fetch(`${API_BASE_URL}/api/me`, {
        credentials: 'include',
      });
      
      console.log("response status", response.status);
      console.log("response headers", Object.fromEntries(response.headers.entries()));
      console.log("response cookies", response)
      
      const data = await response.json();
      console.log("session data", data);
      return data;
  } catch (error) {
      console.error('Error fetching session:', error);
      return null;
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