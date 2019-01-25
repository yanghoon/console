<template>
  <layout-content>
    <ssh :info="ssh"/>
  </layout-content>
</template>

<script>
export default {
  name: 'WebSsh',
  data () {
    return {
      endpoint: '/api/v1/namespaces/default/pods/mypod',
      cmd: '',
      ws: undefined,
      terminal: {
        term: null,
        terminalSocket: null
      },
      select: [ {selected: false}, {selected: false} ],
      ssh: { show: false, cs: undefined, ns: undefined, pod: undefined, con: {items: []}, full: false }
    }
  },
  methods: {
    changeSelect (changed) {
      this.select = changed

      this.ssh.cs = this.select[0].selected
      this.ssh.ns = this.select[1].selected
    }
  },
  mounted () {
    this.ssh.show = true
    this.ssh.selected = {}

    this.ssh.api = '/api/wsh'
    this.ssh.pod = '-'
    this.ssh.con.items = ['alpine']
  }
}
</script>
