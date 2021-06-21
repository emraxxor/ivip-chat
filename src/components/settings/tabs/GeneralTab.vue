<template>
    <div class="row">
        <b-container class="bv-example-row">
          <b-row>
            <b-col>Font size:</b-col>
            <b-col> <b-form-input ref="fontSize" @change="changeFontSize($event)" :value="settings.fontSize" type="range" min="10" max="24"></b-form-input> </b-col>
          </b-row>
          <b-row>
            <b-col>Notify sound:</b-col>
            <b-col>
                <b-form-checkbox ref="checkboxNotify" @change="changeNotify($event)" v-model="notify" :value="true" :unchecked-value="false"></b-form-checkbox>
            </b-col>
          </b-row>
        </b-container>
    </div>
</template>
<script>
import SettingsStoreVue from './SettingsStore.vue'

export default {

  mixins: [SettingsStoreVue],

  data () {
    return {
      notify: false
    }
  },

  mounted () {
    this.notify = this.settings.notifySound
  },

  methods: {

    changeNotify (e) {
      this.updateSettings({
        notifySound: !this.notify
      })
    },

    changeFontSize (e) {
      this.updateSettings({ fontSize: e })
    }

  }

}
</script>
