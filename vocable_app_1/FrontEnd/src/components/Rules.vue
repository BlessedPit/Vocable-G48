<template>
    <div v-if="isVisible" class="rules-overlay">
      <div class="rules-modal">
        <!-- Pulsante di chiusura -->
        <button @click="closeRules" class="close-button">X</button>
        <p class="text-h4 font-bold mb-4">How to play!</p>
        <p class="mb-6">
          Hai <span class="font-bold text-red-600 ml-2 mr-2">6</span> tentativi per indovinare la parola in base alla definizione
        </p>
        <div class="text-left mb-6">
        <p class="font-semibold">Raccomandazioni:</p>
        <ul class="indented-list">
            <li>
                <p>Prima di poter confermare la tua "guess", tutte le caselle devono contenere una lettera!</p>
            </li>
            <li>
                <p>Le caselle ti aiutano a capire come stai andando!</p>
            </li>
            </ul>
        </div>
        <p class="text-left font-semibold mb-4">Spiegazione caselle:</p>
        <div class="color-explanation">
          <div class="color-box green"></div>
          <div class="color-description">
            <span class="font-bold green-text">Casella verde</span>
            <p>La lettera è corretta e nella posizione giusta.</p>
          </div>
        </div>
        <div class="color-explanation">
          <div class="color-box yellow"></div>
          <div class="color-description">
            <span class="font-bold yellow-text">Casella gialla</span>
            <p>La lettera è corretta ma nella posizione sbagliata.</p>
          </div>
        </div>
        <div class="color-explanation">
          <div class="color-box gray"></div>
          <div class="color-description">
            <span class="font-bold gray-text">Casella grigia</span>
            <p>La lettera non è presente nella parola.</p>
          </div>
        </div>
        <p class="font-semibold mt-10 mb-4 text-blue-600">Buona fortuna!</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isVisible: false
      };
    },
    methods: {
      openRules() {
        this.isVisible = true;
      },
      closeRules() {
        this.isVisible = false;
      }
    }
  };
  </script>
  
  <style scoped>

.indented-list {
  margin-left: 30px; 
  padding-left: 20px;
  margin-right: 30px; 
  padding-right: 20px;
  list-style-position: inside; 
}

.indented-list li {
  margin-bottom: 8px; /* Spazio tra gli elementi della lista */
}

.indented-list p {
  margin: 0; /* Rimuove margini extra dal paragrafo */
}
  .rules-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .rules-modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
    position: relative;
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    background: transparent;
    font-size: 18px;
    cursor: pointer;
  }
  
  .color-explanation {
    display: flex;
    align-items: flex-start; 
    margin-bottom: 16px;
  }
  
  .color-box {
    width: 50px;
    height: 50px; 
    border-radius: 5px;
    border: 2px solid rgb(74, 74, 74); 
    margin-right: 16px;
  }
  
  .color-box.green {
    background-color: #4caf50; /* Verde */
  }
  
  .color-box.yellow {
    background-color: #ffeb3b; /* Giallo */
  }
  
  .color-box.gray {
    background-color: #9e9e9e; /* Grigio */
  }
  
  .color-description {
    display: flex;
    flex-direction: column; /* Disposizione verticale del testo */
    justify-content: center;
  }
  
  .color-description span {
    font-weight: bold;
  }
  
  .color-description p {
    margin: 0; 
  }
  
  .green-text {
    color: #4caf50;
    text-align: left;
  }
  
  .yellow-text {
    color: #efc000;
    text-align: left;
  }
  
  .gray-text {
    color: #9e9e9e; 
    text-align: left;
  }
  
  </style>
  