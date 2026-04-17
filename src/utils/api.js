// Utility para hacer fetch con manejo de CORS
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

export const apiFetch = async (url, options = {}) => {
  try {
    // Intentar sin proxy primero
    const response = await fetch(url, options);
    
    if (!response.ok && response.status === 0) {
      // Error de CORS, intentar con proxy
      throw new Error('CORS Error');
    }
    
    return response;
  } catch (error) {
    // Si falla por CORS, intentar con proxy
    if (error.message === 'CORS Error' || error.message.includes('CORS')) {
      console.warn('Usando CORS proxy para:', url);
      return fetch(CORS_PROXY + url, options);
    }
    throw error;
  }
};
