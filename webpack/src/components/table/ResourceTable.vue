<template>
  <div>

  <v-data-table class="elevation-1"
      :headers="header"
      :items="data" item-key="id"
      :loading="loading"
      :search="keyword">
    <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>

    <v-alert slot="no-results" :value="true" color="error" icon="warning">
      Your search found no results.
    </v-alert>

    <!--
      - FINAL -
      https://github.com/vuejs/vue/pull/7765
      https://github.com/vuejs/vue/pull/7765#issuecomment-431553973

      - OTHERS -
      https://github.com/vuejs/vue/issues/7464
      https://gist.github.com/elpete/7068308c5a1bf4f1a0f44f8d0259a9a2#file-managelists-vue-L4
    -->
    <template slot="items" slot-scope="scope">
      <!-- replace all tbody -->
      <slot name="items" v-bind="scope" v-if="!!$scopedSlots.items"/>

      <!-- replace each cell -->
      <template v-else>
        <tr>
          <td v-for="h in header" :key="h.text">
            <!-- customized cell by header.id -->
            <slot :name="h.id" v-if="!!$scopedSlots[h.id]"
              v-bind="scope" :header="h" :val="_.property(h.value.split('.'))(scope.item)">
            </slot>

            <!-- for name link -->
            <slot v-else-if="h.id === 'name'" v-bind="scope">
              <router-link :to="`/resources/${kind}/${scope.item.metadata.name}?cs=-&ns=${ns}`">
                {{ _.property(h.value.split('.'))(scope.item) || '-' }}
              </router-link>
            </slot>

            <!-- for actions -->
            <slot v-else-if="h.id === 'action'" v-bind="scope">
              <v-tooltip right :open-delay="0.3" :close-delay="0.3">
                <v-btn slot="activator" color="primary" flat icon @click="showDialog('editor', scope.item)">
                  <v-icon>create</v-icon>
                </v-btn>
                <span>Edit Yaml</span>
              </v-tooltip>

              <v-tooltip right :open-delay="0.3" :close-delay="0.3" v-if="kind === 'pod'">
                <v-btn slot="activator" color="primary" flat icon @click="showDialog('ssh', scope.item)">
                  <v-icon>web_asset</v-icon>
                </v-btn>
                <span>Open Shell</span>
              </v-tooltip>

              <v-tooltip right :open-delay="0.3" :close-delay="0.3" v-if="kind === 'pod'">
                <v-btn slot="activator" color="primary" flat icon @click="showDialog('log', scope.item)">
                  <v-icon>notes</v-icon>
                </v-btn>
                <span>Logs</span>
              </v-tooltip>
            </slot>

            <!-- DEFAULT : just print values -->
            <slot v-else>
              {{ _.property(h.value.split('.'))(scope.item) || '-' }}
            </slot>
          </td>
        </tr>
      </template>
    </template>

  </v-data-table>

  <!-- dialogs for actions -->
  <editor-dialog v-bind="dialog.editor" v-model="dialog.editor.open"/>
  <ssh-dialog v-bind="dialog.ssh" v-model="dialog.ssh.open"/>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'underscore'

function expand (expr, name) {
  var opt = {id: name.toLowerCase(), text: name, align: 'center', sortable: false, value: ''}
  expr.split(/ ?\| ?/).forEach(token => {
    // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    var [op1, op2] = token.split('=')
    switch (op1) {
      case 'sortable': opt.sortable = true; break
      case 'value':
      case 'align':
      default: opt[op1] = op2; break
    }
  })
  return opt
}

const HEADER = _.mapObject({
  // Pod
  'Name': 'value=metadata.name | sortable | align=left',
  'Namespace': 'value=metadata.namespace | align=left',
  'Node': 'value=spec.nodeName',
  'Status': 'sortable | value=status.phase',
  'Restarts': 'value=status.containerStatuses',
  'Age': 'sortable | value=metadata.creationTimestamp | align=left',
  'Action': 'text= | value=none',
  // Service
  'ClusterIP': 'align=left | value=spec.clusterIP',
  'Selector': 'align=left | value=spec.selector',
  'Service-Endpoint': 'text=Endpoint | value=spec',
  // ConfigMap
  'Labels': 'value=metadata.labels | align=left',
  'Data-Key': 'text=Data | value=data | align=left',
  // Secrets
  'Secret-Type': 'text=Type | value=type | align=left',
  // PVC
  'Pvc-Status': 'text=Status | value=status.phase',
  'Volume': 'value=spec.volumeName',
  // 'Capacity': 'value=spec.resources.requests.storage.number',
  'Capacity': 'value=status.capacity.storage.number',
  'Access-Modes': 'text=Access Modes | value=spec.accessModes',
  'Storage-Class': 'text=Storage Class | value=spec.storageClassName'
}, expand)

export default {
  props: 'data, headers, loading, keyword'.split(/, ?/),
  data () {
    return {
      dialog: {
        editor: { open: false, item: {} },
        ssh: { open: false, item: {} }
      }
    }
  },
  computed: {
    ...mapState(['select', 'ns', 'kind']),
    header () {
      var header = this.headers[this.kind]
      header = _.map(header, (e) => {
        if (_.isString(e)) {
          return HEADER[e]
        }
      })
      return header
    }
  },
  methods: {
    showDialog (name, item) {
      this.dialog[name].open = true
      this.dialog[name].item = item
    }
  }
}
</script>
