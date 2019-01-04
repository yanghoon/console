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
  ],
  select: [
    {label: 'Cluster', items: [], selected: 'cloudzcp-pou-dev'},
    {label: 'Namespace', items: [], selected: 'zcp-system'}
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
  },
  changeCluster (state, cluster) {
    state.select[0].selected = cluster
  },
  changeNamespace (state, namespace) {
    state.select[1].selected = namespace
  },
  setNamespaceItem (state, items) {
    state.select[1].items = items
  }
}

const actions = {
  getNamespace (store) {
    this.$http
      .get(`/api/cluster/${state.select[0].selected}/namespace/list`)
      .then((res) => {
        store.commit('setNamespaceItem', res.data.items)
      })
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions
})

Vue.prototype.$store = store

export default store
