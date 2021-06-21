<script>
import { mapActions, mapGetters } from 'vuex'
import { URL } from '../../../config/index'

export default {

  computed: {
    ...mapGetters({
      settings: 'user/getSettings'
    }),

    url () {
      return URL
    }
  },

  methods: {
    ...mapActions({
      update: 'user/updateSettings'
    }),

    updateSettings (settings) {
      this.update({ ...this.settings, ...settings })
    }
  }
}
</script>
