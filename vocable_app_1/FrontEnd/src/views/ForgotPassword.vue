<template>
    <div class="wrapper">
        <v-sheet class="pa-12 mx-auto elevation-2" rounded width="400">
            <v-form ref="form">
                <img src="/logoVuoto.png" alt="Vocable Logo" />
                <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Vocable</span>

                <v-text-field class="required" type="email" :rules="emailRules" v-model="email"
                    label="Email" variant="underlined"></v-text-field>

                <div class="d-flex flex-column">
                    <v-btn class="mt-4" color="blue" size="large" variant="elevated" block @click="sendResetLink">
                        Invia link di reset
                    </v-btn>

                </div>
            </v-form>
        </v-sheet>
    </div>
</template>

<script>
import axios from 'axios';
import emailjs from 'emailjs-com'
export default {
    data: () => ({
        email: '',
        emailRules: [
            v => !!v || 'Obbligatorio',
            v => v && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email non valida'
        ],
    }),

    methods: {
    async sendResetLink() {
        const { valid } = await this.$refs.form.validate();
        if (valid) {
            try {
                // Chiamata API per generare il token
                const response = await axios.post('https://vocable-g48-production-a10a.up.railway.app/api/utente/forgot-password', { email: this.email });
                const resetToken = response.data.resetToken;
                
                // Costruisci il link di reset
                const resetLink = `https://vocable-g48-production-a10a.up.railway.app/reset-password?token=${resetToken}`;
                
                // Invia il link tramite email
                const serviceID = 'default_service';
                const templateID = 'template_o30m3uc';
                emailjs.init("LxMUIwv2KBoQWjQDz");

                const templateParams = {
                    email: this.email,
                    message: `Clicca qui per resettare la tua password: ${resetLink}`,
                };

                await emailjs.send(serviceID, templateID, templateParams);
                alert('Link di reset inviato con successo');
            } catch (error) {
                console.error(error);
                alert('Errore durante l\'invio del link di reset');
            }
        }
    }
}
}
</script>
