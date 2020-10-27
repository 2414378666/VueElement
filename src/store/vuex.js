import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export function store() {
  return new Vuex.Store({
  state: {
    count: 'chalk'
  },
  mutations: {
    increment (state, data) {
      state.count = data
    }
  }
})}