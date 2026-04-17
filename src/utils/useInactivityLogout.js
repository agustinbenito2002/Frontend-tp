// Hook para detectar inactividad del usuario
import { useEffect, useRef, useCallback } from "react";
import { tokenManager } from "./tokenManager";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos

export const useInactivityLogout = (onLogout) => {
  const checkExpiryRef = useRef(null);
  const onLogoutRef = useRef(onLogout);

  // Actualizar referencia de onLogout cuando cambia
  useEffect(() => {
    onLogoutRef.current = onLogout;
  }, [onLogout]);

  useEffect(() => {
    // Solo activar si hay un token
    const token = localStorage.getItem("token");
    if (!token) return;

    const resetInactivityTimer = () => {
      // Renovar el timestamp del token
      tokenManager.refreshTimeout();
    };

    // Eventos que detectan actividad del usuario
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];

    // Agregar listeners
    events.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    // Timer independiente para verificar expiración
    checkExpiryRef.current = setInterval(() => {
      const token = localStorage.getItem("token");
      const timestamp = localStorage.getItem("tokenTimestamp");

      if (!token || !timestamp) return;

      const elapsedTime = Date.now() - parseInt(timestamp);

      if (elapsedTime > INACTIVITY_TIMEOUT) {
        // Token expirado
        clearInterval(checkExpiryRef.current);
        events.forEach((event) => {
          window.removeEventListener(event, resetInactivityTimer);
        });
        onLogoutRef.current();
      }
    }, 10000); // Verificar cada 10 segundos

    // Limpiar listeners al desmontar
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (checkExpiryRef.current) {
        clearInterval(checkExpiryRef.current);
      }
    };
  }, []);
};
