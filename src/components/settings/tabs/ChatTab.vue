<template>
    <div class="row">
        <b-container class="bv-example-row">
          <b-row>
            <b-col>Away message:</b-col>
          </b-row>
          <b-row>
            <b-col>   <b-form-input ref="textfieldAway" v-model="awayMessage" @change="updateAway($event)" placeholder="Enter your name"></b-form-input>  </b-col>
          </b-row>
          <b-row>
            <b-col>Away active:</b-col>
          </b-row>
          <b-row>
            <b-col> <b-form-checkbox ref="checkboxAway" @change="updateAway($event)" v-model="awayEnabled" :value="true" :unchecked-value="false">
                      Enable away
                    </b-form-checkbox>
            </b-col>
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
       awayMessage : '',
       awayEnabled: false,
    }
  },

  computed: {
  },

  mounted () {
      this.awayMessage = this.settings.awayMessage
      this.awayEnabled = this.settings.awayEnabled
  },

  methods: {
      updateAway() {
           this.updateSettings({
              awayMessage: this.awayMessage,
              awayEnabled: !this.awayEnabled
           })
      }
  },

}
</script>
