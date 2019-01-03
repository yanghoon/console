import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'underscore'

Vue.use(Vuex)

const state = {
  menus: [
    {title: 'Resources', link: '/', icon: 'widgets'},
    {title: 'Web SSH', link: '/ssh', icon: 'web_asset'},
    {title: 'Editor', link: '/code', icon: 'create'},
    {title: 'Configure', link: '/conf', icon: 'settings'}
  ]
}

const mutations = {
  applyMenu (state, menu) {
    var index = _.findIndex(state.menus, {title: menu.title})
    if (index === -1) {
      state.menus.push(menu)
    } else {
      state.menus[index] = menu
    }
  }
}

const store = new Vuex.Store({
  state,
  mutations
})

export default store
