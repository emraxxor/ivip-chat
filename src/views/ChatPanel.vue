<script>
export default {

  mounted () {
    this.resize()
    window.addEventListener('resize', (e) => this.resize())
  },

  methods: {

    resize () {
      document.querySelector('.inbox_people').style.height = document.querySelector('.mesgs').clientHeight + 'px'
      document.querySelector('.inbox_chat').style.height = document.querySelector('.mesgs').clientHeight - 125 + 'px'
    }
  }

}
</script>
