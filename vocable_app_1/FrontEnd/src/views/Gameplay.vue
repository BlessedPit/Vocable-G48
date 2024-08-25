<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import axios from 'axios';
import SimpleKeyboard from '../components/SimpleKeyboard.vue';
import WordRow from '../components/WordRow.vue';
import { getRandomWord } from '../components/Words.vue';


const state = reactive({
  solution: getRandomWord(),
  guesses: ["", "", "", "", "", ""],
  currentGuessIndex: 0,
  guessedLetters: {
    miss: [],
    found: [],
    hint: [],
  },
  statsSaved: false,
  gameFinished: false,
});

const wonGame = computed(() =>
  state.guesses[state.currentGuessIndex - 1] === state.solution.word
);

const lostGame = computed(() => !wonGame.value && state.currentGuessIndex >= 6);


const keyboardReset = ref(false);

const refreshPage = () => {
  state.solution = getRandomWord(); // Genera una nuova parola casuale
  state.guesses = ["", "", "", "", "", ""]; // Resetta le ipotesi
  state.currentGuessIndex = 0; // Resetta l'indice delle ipotesi
  state.guessedLetters = { miss: [], found: [], hint: [] }; // Resetta guessedLetters
  state.statsSaved = false; // Imposta il salvataggio delle statistiche su false
  state.gameFinished = false; // Imposta lo stato del gioco come non finito
  keyboardReset.value = true; // Imposta il flag per resettare la tastiera
  setTimeout(() => {
    keyboardReset.value = false; // Reimposta il flag per evitare che si resetti continuamente
  }, 0); 
};

// Funzione per gestire l'input da tastiera
const handleInput = (key) => {
  console.log('Handling input:', key); // Log per monitorare la chiave che viene gestita
  if (!state.statsSaved) {
    if ((wonGame.value || lostGame.value) && !state.statsSaved) {
      console.log('Il gioco è terminato. Aggiorno le statistiche...');
      updateUserStats(wonGame.value, state.currentGuessIndex); // Aggiorna le statistiche
      state.statsSaved = true;
      state.gameFinished = true; // Imposta lo stato del gioco come finito
      return;
    }

    const currentGuess = state.guesses[state.currentGuessIndex];
    if (key == "{enter}") {
      if (currentGuess.length == state.solution.word.length) {
        for (let i = 0; i < currentGuess.length; i++) {
          let c = currentGuess.charAt(i);
          if (c == state.solution.word.charAt(i)) {
            state.guessedLetters.found.push(c.toUpperCase());
          } else if (state.solution.word.indexOf(c) != -1) {
            state.guessedLetters.hint.push(c.toUpperCase());
          } else {
            state.guessedLetters.miss.push(c.toUpperCase());
          }
        }
        state.currentGuessIndex++;
        if ((wonGame.value || lostGame.value) && !state.statsSaved) {
          console.log('Il gioco è terminato. Aggiorno le statistiche...');
          updateUserStats(wonGame.value, state.currentGuessIndex); // Aggiorna le statistiche
          state.statsSaved = true;
          state.gameFinished = true; // Imposta lo stato del gioco come finito
        }
      }
    } else if (key == "{bksp}") {
      state.guesses[state.currentGuessIndex] = currentGuess.slice(0, -1);
    } else if (currentGuess.length < state.solution.word.length) {
      const alphaRegex = /[A-Za-z]/;
      if (alphaRegex.test(key)) {
        state.guesses[state.currentGuessIndex] += key.toLowerCase();
      }
    }
  }
};


// Funzione per aggiornare le statistiche dell'utente
const updateUserStats = async (won, attempts) => {
  try {
    console.log(`Updating stats: won=${won}, attempts=${attempts}`);
    await axios.post('/api/utente/update-stats', { won, attempts });
    console.log('Statistiche aggiornate con successo');
  } catch (error) {
    console.error('Errore durante l\'aggiornamento delle statistiche:', error);
  }
};

// Aggiunge il listener per la tastiera una volta montato il componente
onMounted(() => {
  window.addEventListener("keyup", (e) => {
    e.preventDefault();
    let key =
      e.code == "Enter"
        ? "{enter}"
        : e.code == "Backspace"
          ? "{bksp}"
          : e.code == "Tab"
            ? ""
            : e.code == "ControlLeft"
              ? ""
              : e.code == "ControlRight"
                ? ""
                : e.code == "ShiftLeft"
                  ? ""
                  : e.code == "CapsLock"
                    ? ""
                    : e.code == "AltRight"
                      ? ""
                      : e.key;
    handleInput(key);
  });
});
</script>

<template>
  <v-sheet class="content-wrapper">
    <div class="wrapperwords">
      <div>
        <!-- Mostra le righe delle parole -->
        <word-row v-for="(guess, i) in state.guesses" :key="i + state.solution.word" :value="guess"
          :solution="state.solution.word" :submitted="i < state.currentGuessIndex" />
      </div>

      <!-- Messaggio di vittoria o sconfitta -->
      <template v-if="wonGame && state.gameFinished" class="text-center">
        <p class="win-message">
          Congratulazioni! Hai trovato la soluzione!
        </p>
      </template>

      <template v-else-if="lostGame && state.gameFinished" class="lose-wrapper">
        <p class="lose-message-warn">
          Peccato, hai perso!
        </p>
        <span class="lose-message">
          <p class="lose-message-word">La parola era: </p>
          <p class="lose-message-solution"> {{ state.solution.word }}</p>
        </span>
      </template>

      <!-- Definizione della parola -->
      <div class="definition-container">
        <span>
          <p class="definition-title">Definizione:</p>
          <p class="definition-text">
            {{ state.solution.definition }}
          </p>
        </span>
      </div>

      <!-- Componente della tastiera -->
      <simple-keyboard @onKeyPress="handleInput" :guessedLetters="state.guessedLetters"
        :resetKeyboard="keyboardReset" />

      <!-- Bottone per ricaricare la pagina e iniziare un nuovo gioco -->
      <div class="button-wrapper">
        <v-btn rounded="xl" size="x-large" elevation="8" v-ripple color="blue" class="refresh-button"
          v-if="state.gameFinished" @click="refreshPage">
          Prossima parola
        </v-btn>
      </div>
    </div>
  </v-sheet>
</template>

<style scoped>
/* Importa Google Fonts (esempio con "Roboto") */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.content-wrapper {
  margin-top: 20px;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  font-family: 'Roboto', sans-serif;
  /* Applica il font importato */
}

.wrapperwords {
  flex: 1;
}

/* Bottone per ricaricare la pagina */
.button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.refresh-button {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Stile per il messaggio di vittoria */
.win-message {
  font-size: 1.5rem;
  font-weight: 700;
  color: #28a745;
  /* Verde per la vittoria */
  text-align: center;
  /* Centro del testo */
}

/* Stile per il messaggio di sconfitta */
.lose-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Centra orizzontalmente */
  justify-content: center;
  /* Centra verticalmente */
  margin: 40px 0;
  /* Spazio superiore e inferiore */
}

.lose-message-warn {
  font-size: 1.5rem;
  font-weight: 700;
  color: #dc3545;
  /* Rosso per la sconfitta */
  margin-bottom: 10px;
  /* Spazio sotto il messaggio di sconfitta */
  text-align: center;
  /* Centro del testo */
}

.lose-message {
  display: flex;
  flex-direction: column;
  /* Disporre i paragrafi in colonna */
  align-items: center;
  /* Centra orizzontalmente */
  gap: 10px;
  /* Spazio tra i paragrafi */
}

.lose-message-word,
.lose-message-solution {
  font-size: 1.25rem;
}

.lose-message-solution {
  font-weight: 700;
  color: #dc3545;
}

/* Stile per la definizione */
.definition-container {
  text-align: center;
  margin: 20px 0;
}

.definition-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #007bff;
  /* Blu per il titolo della definizione */
}

.definition-text {
  font-size: 1.125rem;
  font-weight: 400;
  color: #212529;
  /* Nero per il testo della definizione */
}
</style>
