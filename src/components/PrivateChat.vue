<template>
    <DialogDrag :title="title"  :options="{ width: width,top:20, height: height }" @close="close">
        TODOHERE... {{ data.username }}
    </DialogDrag>
</template>
<script>
import DialogDrag from 'vue-dialog-drag'
import 'vue-dialog-drag/dist/vue-dialog-drag.css'

/**
 *
 * @author Attila Barna
 */
export default {

  data : () => ({}),

  mounted() {

  },

  computed : {

  },

  props : {
      title: {
            default: 'Title'
      },
      width: {
            default : 500,
      },
      height: {
            default: 500
      },
      data : {
            default : {}
      },
  },

  sockets: {

  },

  methods : {

      close: function() {
        this.$emit('close', this.data)
      }

  },


  components : {
    DialogDrag
  }
}
</script>
