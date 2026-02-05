import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const IdleTimer = () => {
  const { logout, user } = useAuth();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!user) return; // Only run when user is logged in

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        // console.log('User idle for 1 minute, logging out...');
        logout();
        window.location.href = '/login'; // Ensure redirect to login
      }, 60000); // 1 minute = 60000 ms
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    
    // Throttle the event listener slightly if needed, but for idle timer raw events are usually fine unless high frequency
    const handleActivity = () => resetTimer();

    // Initial start
    resetTimer();

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [user, logout]);

  return null;
};

export default IdleTimer;
