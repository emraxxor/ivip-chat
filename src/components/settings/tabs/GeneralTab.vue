<template>
    <div class="row">
        <b-container class="bv-example-row">
          <b-row>
            <b-col>Font size:</b-col>
            <b-col> <b-form-input ref="fontSize" @change="changeFontSize($event)" :value="settings.fontSize" type="range" min="10" max="24"></b-form-input> </b-col>
          </b-row>
        </b-container>
    </div>
</template>
<script>
import BaseTabVue from './BaseTab.vue'

export default {

  mixins: [BaseTabVue],

  data() {
    return {

    }
  },

  mounted () {

  },

  methods: {

     changeFontSize(e) {
        this.updateSettings({ fontSize: e })
     }

  },

}
</script>
