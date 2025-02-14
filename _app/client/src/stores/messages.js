// Message store for managing global notifications
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMessageStore = defineStore('messages', () => {
  const banner = ref(null);
  const toasts = ref([]);
  let toastId = 0;

  // Default configurations
  const defaultConfig = {
    duration: 5000, // 5 seconds
    position: 'top-right',
  };

  // Message types
  const messageTypes = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning',
  };

  // Helper to create a message object
  const createMessage = (type, message, title = '', options = {}) => ({
    id: toastId++,
    type,
    message,
    title,
    position: options.position || defaultConfig.position,
    duration: options.duration || defaultConfig.duration,
    timestamp: Date.now(),
  });

  // Banner methods
  const setBanner = (type, message, title = '', autoClose = null) => {
    banner.value = {
      type,
      message,
      title,
      autoClose,
      timestamp: Date.now(),
    };
  };

  const clearBanner = () => {
    banner.value = null;
  };

  // Toast methods
  const addToast = (type, message, title = '', options = {}) => {
    const toast = createMessage(type, message, title, options);
    toasts.value.push(toast);

    if (options.duration !== 0) {
      setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration);
    }

    return toast.id;
  };

  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  const clearToasts = () => {
    toasts.value = [];
  };

  // Convenience methods for different message types
  const success = (message, title = '', options = {}) => {
    return addToast(messageTypes.SUCCESS, message, title, options);
  };

  const error = (message, title = '', options = {}) => {
    return addToast(messageTypes.ERROR, message, title, options);
  };

  const info = (message, title = '', options = {}) => {
    return addToast(messageTypes.INFO, message, title, options);
  };

  const warning = (message, title = '', options = {}) => {
    return addToast(messageTypes.WARNING, message, title, options);
  };

  // Banner convenience methods
  const successBanner = (message, title = '', autoClose = null) => {
    setBanner(messageTypes.SUCCESS, message, title, autoClose);
  };

  const errorBanner = (message, title = '', autoClose = null) => {
    setBanner(messageTypes.ERROR, message, title, autoClose);
  };

  const infoBanner = (message, title = '', autoClose = null) => {
    setBanner(messageTypes.INFO, message, title, autoClose);
  };

  const warningBanner = (message, title = '', autoClose = null) => {
    setBanner(messageTypes.WARNING, message, title, autoClose);
  };

  return {
    // State
    banner,
    toasts,

    // Actions
    setBanner,
    clearBanner,
    addToast,
    removeToast,
    clearToasts,

    // Toast convenience methods
    success,
    error,
    info,
    warning,

    // Banner convenience methods
    successBanner,
    errorBanner,
    infoBanner,
    warningBanner,
  };
});
