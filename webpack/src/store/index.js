import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { getField, updateField } from 'vuex-map-fields' // https://github.com/maoberlehner/vuex-map-fields

Vue.use(Vuex)

const state = {
  menus: [
    {
      title: 'Resources',
      link: '/resources',
      icon: 'widgets',
      sub: [
        {title: 'Workloads', link: '/resources/workloads'},
        {title: 'Network', link: '/resources/network'},
        {title: 'Volume', link: '/resources/volume'}
      ]
    },
    {title: 'Web SSH', link: '/wsh', icon: 'web_asset'},
    {title: 'Github', link: 'https://github.com/yanghoon/console', icon: 'info', external: true}
  ],
  toolbar: [
    {title: 'Profile', link: '/wsh'},
    {title: 'Change Password', link: '/code'},
    {title: 'Configure', link: '/conf', dvider: true},
    {title: 'Logout', link: '/logout'}
  ],
  select: [
    {label: 'Cluster', items: [], selected: 'cloudzcp-pou-dev'},
    {label: 'Namespace', items: [], selected: 'zcp-system'},
    {label: 'Kind', items: [], selected: ''}
  ],
  ns: '',
  kind: '',
  profile: {},
  config: {
    layout: process.env.layout
  }
}

const mutations = {
  changeCluster (state, cluster) {
    state.select[0].selected = cluster
  },
  changeNamespace (state, namespace) {
    state.select[1].selected = namespace
  },
  setNamespaceItem (state, items) {
    state.select[1].items = items
    if (!state.ns) { state.ns = items[0].metadata.name }
  },
  setKindItem (state, items) {
    state.select[2].items = items
    if (!state.kind) { state.kind = items[0].value }
  },
  setProfile (state, profile) {
    state.profile = profile
  },
  updateField
}

const actions = {
  getNamespace (store) {
    axios
      .get(`/api/cluster/${state.select[0].selected}/namespace/list`)
      .then((res) => {
        store.commit('setNamespaceItem', res.data.items)
      })
  },
  getProfile (store) {
    axios
      .get('/api/user/id')
      .then((res) => {
        store.commit('setProfile', res.data.data)
      })
  }
}

const getters = { getField }

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

Vue.prototype.$store = store

export default store
