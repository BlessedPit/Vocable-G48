// store.js
import { createStore } from "vuex";
import auth from "./auth";
import email from "../../../../vocable_app_1/FrontEnd/src/store/email";

const store = createStore({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        auth,
        email
    }
});

export default store;
