import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/user';

export function VerifyLoginPage() {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useUserStore();

  useEffect(() => {
    const verifyToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google/callback?code=${code}`
          );
          const { user, token } = response.data;
          setUser(user, user.is_active);
          setIsLoggedIn(true);
          localStorage.setItem('access_token', token.access_token);

          navigate('/dashboard');
        } catch (error) {
          throw new Error(
            `Error verifying login: ${error instanceof Error ? error.message : error}`
          );
        }
      } else {
        throw new Error(`No authorization code found in the URL`);
      }
    };

    verifyToken();
  }, [navigate, setUser, setIsLoggedIn]);

  return <div>Verifying login...</div>;
}
