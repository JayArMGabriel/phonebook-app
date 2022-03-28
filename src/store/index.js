import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    contacts: []
  },
  mutations: {
    setContacts (state, payload) {
      localStorage.setItem('contacts', JSON.stringify(payload))
      state.contacts = payload
    }
  },
  getters: {
    getContacts (state) {
      return state.contacts
    }
  },
  actions: {
    updateContacts (context, payload) {
      context.commit('setContacts', payload)
    }
  }
})
