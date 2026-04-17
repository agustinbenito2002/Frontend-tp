# Sistema de Token Temporal con Inactividad

## ¿Cómo funciona?

El sistema de autenticación ahora incluye expiración automática del token después de **30 minutos de inactividad**.

### Características:

1. **Token Temporal**: El token se guarda con un timestamp en localStorage
2. **Detección de Inactividad**: Se monitorean eventos del usuario:
   - Click del ratón
   - Pulsación de teclas
   - Scroll
   - Touch (dispositivos móviles)
   
3. **Reset Automático**: Cada actividad del usuario resetea el timer de 30 minutos

4. **Expiración**: Después de 30 minutos sin actividad, la sesión se cierra automáticamente

### Archivos Creados/Modificados:

- **`src/utils/tokenManager.js`**: Gestiona almacenamiento y expiración del token
- **`src/utils/useInactivityLogout.js`**: Hook React que detecta inactividad
- **`src/App.jsx`**: Integra el sistema de token temporal

### Cómo usarlo:

El sistema funciona automáticamente. Solo debes saber que:

- El token expira después de 30 minutos de inactividad
- Si haces cualquier actividad, el contador se resetea
- Cuando expira, se cierra la sesión automáticamente
- Para cambiar el tiempo de inactividad, edita `INACTIVITY_TIMEOUT` en los archivos de utilidad (actualmente 30 minutos)

### Seguridad:

- El token se almacena en localStorage (debe usarse HTTPS en producción)
- La expiración se verifica cada 10 segundos
- Al cerrar sesión, se limpian todos los datos del token
