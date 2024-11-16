// notificationStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
    const message = ref('');
    const show = ref(false);
    const type = ref('success');

    const notify = (msg, notificationType = 'success') => {
        message.value = msg;
        type.value = notificationType;
        show.value = true;
    };

    const close = () => {
        show.value = false;
        message.value = '';
    };

    return {
        message,
        show,
        type,
        notify,
        close
    };
});
