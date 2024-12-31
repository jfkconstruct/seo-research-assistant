const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/webmasters',
];

class AuthService {
  constructor() {
    this.accessToken = localStorage.getItem('gsc_access_token');
    this.tokenExpiry = localStorage.getItem('gsc_token_expiry');
    this.auth2Instance = null;
  }

  async initGoogleAuth() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('auth2', async () => {
          try {
            this.auth2Instance = await window.gapi.auth2.init({
              client_id: GOOGLE_CLIENT_ID,
              scope: SCOPES.join(' ')
            });
            
            // Check if user is already signed in
            if (this.auth2Instance.isSignedIn.get()) {
              const googleUser = this.auth2Instance.currentUser.get();
              const authResponse = googleUser.getAuthResponse();
              this.setSession(authResponse);
            }
            
            resolve(this.auth2Instance);
          } catch (error) {
            reject(error);
          }
        });
      };
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });
  }

  setSession(authResponse) {
    this.accessToken = authResponse.access_token;
    this.tokenExpiry = new Date().getTime() + authResponse.expires_in * 1000;
    
    localStorage.setItem('gsc_access_token', this.accessToken);
    localStorage.setItem('gsc_token_expiry', this.tokenExpiry);
  }

  async signIn() {
    try {
      if (!this.auth2Instance) {
        throw new Error('Google Auth not initialized');
      }

      const googleUser = await this.auth2Instance.signIn();
      const authResponse = googleUser.getAuthResponse();
      this.setSession(authResponse);

      return {
        accessToken: this.accessToken,
        expiresAt: this.tokenExpiry
      };
    } catch (error) {
      console.error('Error signing in:', error);
      throw new Error('Failed to sign in with Google');
    }
  }

  async signOut() {
    try {
      if (this.auth2Instance) {
        await this.auth2Instance.signOut();
      }
      
      localStorage.removeItem('gsc_access_token');
      localStorage.removeItem('gsc_token_expiry');
      
      this.accessToken = null;
      this.tokenExpiry = null;
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('Failed to sign out');
    }
  }

  async getAccessToken() {
    if (!this.accessToken) {
      return null;
    }

    const now = new Date().getTime();
    if (now >= this.tokenExpiry - 5 * 60 * 1000) { // Refresh if within 5 minutes of expiry
      try {
        if (!this.auth2Instance) {
          throw new Error('Google Auth not initialized');
        }

        const googleUser = this.auth2Instance.currentUser.get();
        const authResponse = await googleUser.reloadAuthResponse();
        this.setSession(authResponse);
      } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
      }
    }

    return this.accessToken;
  }

  isAuthenticated() {
    return !!this.accessToken && new Date().getTime() < this.tokenExpiry;
  }
}

export const authService = new AuthService();
