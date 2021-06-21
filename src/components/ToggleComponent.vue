<script>
export default {

  data: () => ({
    display: true
  }),

  methods: {

    toggle () {
      this.display = !this.display
    },

    onButtonClick (event) {
      Array.from(this.parent.accordion.children[0].children).filter(e => e.__vue__ !== this).forEach(e => e.__vue__.hide())
      this.show()
    },

    show () {
      this.display = true
      setTimeout(() => {
        document.querySelector('.inbox_chat').style.height = document.querySelector('.mesgs').clientHeight - 125 + 'px'
      }, 200)
    },

    hide () {
      this.display = false
    }
  }
}
</script>
