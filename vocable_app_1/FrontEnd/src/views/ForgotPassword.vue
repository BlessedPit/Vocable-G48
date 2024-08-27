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
                try{
                const serviceID = 'default_service';
                const templateID = 'template_o30m3uc';
                emailjs.init("LxMUIwv2KBoQWjQDz");

                const templateparams = {
                   email: this.email,
                   message: 'pallw',
              };

                emailjs.send(serviceID, templateID, templateparams)
            }catch(error){
                console.log(error)
                alert('error')
            }
        }
    }
    },
}
</script>
