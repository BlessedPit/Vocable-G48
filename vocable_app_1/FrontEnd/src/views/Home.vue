<template>
    <div id="home">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />
      </head>
      <img src="/logoVuoto.png" class="h-6" alt="Vocable Logo" />
      <span class="vocableText">Vocable</span>
      <div class="descrizione">
        <span class="desc">Leggi la definizione, indovina la parola!</span>
      </div>
      <v-btn :to="{ path: '/Gameplay' }" class="button" size="x-large" color="primary" rounded="xl">
        Gioca!
      </v-btn>
      <!-- Pulsante Regole -->
      <v-btn @click="showRules" class="rules-button text-white" size="x-large"  rounded="xl" outlined color="blue-400">
        How to play
      </v-btn>
      <!-- Componente Rules -->
      <Rules ref="rulesComponent" />
    </div>
  </template>
  
  <script>
  import Rules from '@/components/Rules.vue';
  
  export default {
    name: 'Home',
    components: {
      Rules
    },
    methods: {
      showRules() {
        this.$refs.rulesComponent.openRules();
      }
    }
  }
  </script>
  
  <style scoped>

  #home {
    width: 100vw; /* Larghezza del viewport */
    height: 100vh; /* Altezza del viewport */
    margin: 0;
    padding: 10px;
    text-align: center;
    background: linear-gradient(rgba(0, 0, 255, 0.5), rgba(0, 0, 255, 0.5)), url('@/assets/home_background.jpg') no-repeat center center;
    background-size: cover; /* Copre l'intero contenitore */
    position: relative; /* Posizionamento relativo per gestire contenuti sovrapposti */
    display: flex; /* Usa flexbox per centrare il contenuto */
    flex-direction: column; /* Dispone gli elementi verticalmente */
    align-items: center; /* Centra orizzontalmente il contenuto */
    justify-content: center; /* Centra verticalmente il contenuto */
  }

  /* Assicurati che l'immagine di logo si adatti bene */
  img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 20%;
    height: auto;
  }

  .descrizione {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: auto;
    margin: 0 auto;
  }

  .desc {
    padding: 12px 22px;
    text-align: center;
    text-decoration: none;
    display: block;
    color: white; /* Cambia il colore del testo a bianco */
  }

  .vocableText {
    font-size: 3rem; /* 48px */
    line-height: 1;
    font-weight: 600;
    white-space: nowrap;
    color: #ffffff;
  }

  .button {
    width: 30%;
    border-radius: 8px;
    background-image: linear-gradient(to right, hsl(242, 100%, 50%), hsl(203, 100%, 59%));
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: block;
    font-size: 20px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 3%;
    height: auto;
    cursor: pointer;
    transition: background-image 0.4s ease, transform 0.4s ease;
  }

  .button:hover {
    background-image: linear-gradient(to left, rgb(4, 0, 255), rgb(0, 157, 255));
    color: rgb(255, 255, 255);
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    transform: translateY(-4px); /* Move button up */
  }

  .button:active {
    transform: translateY(-2px); /* Slightly less movement when clicked */
  }

  .rules-button {
    width: 30%;
    border-radius: 8px;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: block;
    font-size: 20px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    height: auto;
    cursor: pointer;
    transition: transform 0.4s ease;
  }

  .rules-button:hover {
    transform: translateY(-4px); /* Move button up on hover */
  }

  .rules-button:active {
    transform: translateY(-2px); /* Slightly less movement when clicked */
  }
  </style>
  