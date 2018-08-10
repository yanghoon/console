<template>
  <v-container fluid>
    <v-layout row wrap align-center justify-center>
      <v-flex xs11>

        <file-container 
          :media="media"
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
