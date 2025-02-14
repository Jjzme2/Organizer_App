// Contact store module
import { ref } from 'vue';
import { useAuthStore } from './auth';

const contactInfo = ref(null);

// Fetch contact information from the API
const fetchContactInfo = async () => {
    try {
        const response = await fetch('/api/contact-ilytat');
        const data = await response.json();
        contactInfo.value = data;
        return data;
    } catch (error) {
        console.error('Error fetching contact information:', error);
        throw error;
    }
};

const sendContactForm = async (formData) => {
    try {
        const authStore = useAuthStore();
        const user = await authStore.fetchCurrentUser();
        
        const response = await fetch('/api/contact-submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user,
                data: formData
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error sending contact form:', error);
        throw error;
    }
};

// Get current contact information
const getContactInfo = () => {
    if(!contactInfo.value)
    fetchContactInfo();

    return contactInfo.value;
};

export const useContactStore = () => {
    return {
        contactInfo,
        fetchContactInfo,
        getContactInfo,
        sendContactForm
    };
};