<template>
    <div class="row">
        <b-container class="bv-example-row">
          <b-row>
            <b-col>Profile image:</b-col>
          </b-row>
          <b-row>
            <b-col>
               <img ref="profilePicture" :src="`${url}/user/image/${username}`" class="fluid responsive" :style="{maxWidth: '100px'}" alt="Profile image"/>
               <b-form-file
                  @change="profileFileChanged($event)"
                  placeholder="Choose a file or drop it here..."
                  drop-placeholder="Drop file here..."
                ></b-form-file>
           </b-col>
          </b-row>
        </b-container>
    </div>
</template>
<script>
import SettingsStoreVue from './SettingsStore.vue'

export default {

  mixins: [SettingsStoreVue],

  components: {
  },

  data () {
    return {
      profilePictureData: null
    }
  },

  computed: {
    username () {
      return this.$store.state.username
    }
  },

  mounted () {

  },

  methods: {

    profileFileChanged (evt) {
      const files = evt.target.files
      const f = files[0]
      const reader = new FileReader()
      reader.onload = this.onFileLoaded
      reader.readAsDataURL(f)
    },

    onFileLoaded (e) {
      this.profilePictureData = e.target.result
      this.$refs.profilePicture.src = this.profilePictureData
      this.upload()
    },

    upload () {
      this.$store.dispatch('user/uploadImage', { image: this.profilePictureData })
    }
  }

}
</script>
