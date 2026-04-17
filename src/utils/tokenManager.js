// Token Manager - Gestiona expiración por inactividad
const TOKEN_KEY = "token";
const TOKEN_TIMESTAMP_KEY = "tokenTimestamp";
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos

export const tokenManager = {
  // Guardar token con timestamp
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());
  },

  // Obtener token si es válido
  getToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    const timestamp = localStorage.getItem(TOKEN_TIMESTAMP_KEY);

    if (!token || !timestamp) return null;

    const elapsedTime = Date.now() - parseInt(timestamp);

    if (elapsedTime > INACTIVITY_TIMEOUT) {
      // Token expirado
      this.clearToken();
      return null;
    }

    return token;
  },

  // Renovar timestamp (resetea el timer de inactividad)
  refreshTimeout() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      localStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());
    }
  },

  // Limpiar token
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
  },

  // Obtener tiempo restante en ms
  getTimeRemaining() {
    const timestamp = localStorage.getItem(TOKEN_TIMESTAMP_KEY);
    if (!timestamp) return 0;

    const elapsedTime = Date.now() - parseInt(timestamp);
    const remaining = Math.max(0, INACTIVITY_TIMEOUT - elapsedTime);
    return remaining;
  },
};
