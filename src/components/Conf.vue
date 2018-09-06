<template>
  <v-container fluid>
    <v-layout row wrap align-center justify-center>
      <v-flex xs11>

        <!--
        <v-alert :value="true" color="info" outline style="background-color: white;">
        -->
        <v-card>
          <v-card-text>
          <h2 class="headline mb-3">
            <v-icon>info</v-icon> Configure
          </h2>
          <p>
            For connect your Kube cluster, just upload a YAML file that contains information of cluster. <br>
            If you already work with <code>kubectl</code> command. You can get by below.
          </p>
          <p>
            <code>$ kubectl config view > kube.conf</code>
          </p>
          <p>
            If your config contains a cert file(<code>.pem</code>) for security, you must upload it ALSO.
          </p>
          <p>
            <code>$ cat kube.conf | grep .pem</code>
          </p>
          </v-card-text>
        </v-card>
        <!--
        </v-alert>
        -->

        <file-container 
          :media="media" label="Click to upload config files."
          hideLabel
          @uploaded="onUploaded"
          @deleted="onFileDeleted"></file-container>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import FileContainer from '@/components/FileContainer'

export default {
  name: 'Conf',
  components:{ FileContainer },
  computed:{
    media(){
      return [] // => here you can map the media and send it to the container 
    }
  },
  methods:{
    onFileDeleted(fileId){
      console.log(fileId) // => this fileId got deleted
    },
    onUploaded(payload){
      console.log(payload) // => here is the file information (either array or object of uploaded files
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
input[type=file] {
  position: absolute;
  left: -99999px;
}
</style>
