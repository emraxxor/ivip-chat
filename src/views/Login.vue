<template>
<!-- basic template from https://bootsnipp.com/ -->
<div class="container">
  <div v-if="error">
     <dialog-window title="Invalid username or password" open='true' :data="{}" @validate="onDialog" @invalidate="onDialog">
        <div slot="dialogBody">
           Invalid username or password or the remote server is unavailable.
        </div>
     </dialog-window>
  </div>

	<div class="d-flex justify-content-center h-100">
		<div class="card">
			<div class="card-header">
				<h3>Sign In</h3>
				<div class="d-flex justify-content-end social_icon">
					<span><i class="fab fa-facebook-square"></i></span>
					<span><i class="fab fa-google-plus-square"></i></span>
					<span><i class="fab fa-twitter-square"></i></span>
				</div>
			</div>
			<div class="card-body">
				<form @submit.prevent="login">
					<div class="input-group form-group">
						<div class="input-group-prepend">
							<span class="input-group-text"><i class="fas fa-user"></i></span>
						</div>
						<input type="text" class="form-control" maxlength="30"  v-model="username" placeholder="username">
					</div>
					<div class="input-group form-group">
						<div class="input-group-prepend">
							<span class="input-group-text"><i class="fas fa-key"></i></span>
						</div>
						<input type="password" class="form-control" v-model="userpassword" placeholder="password">
					</div>

          <div class="input-group form-group">
						<div class="input-group-prepend">
							<span class="input-group-text">Room:</span>
						</div>
            <select class="form-control" v-model="room">
              <option v-for="r in rooms" :key="r.id" :value="r.id">{{ r.name }}</option>
            </select>
					</div>


					<div class="row align-items-center remember">
						<input type="checkbox">Remember Me
					</div>
					<div class="form-group">
						<input type="submit" value="Login" class="btn float-right login_btn">
					</div>
				</form>
			</div>
			<div class="card-footer">
				<div class="d-flex justify-content-center links">
					Don't have an account?<a href="#">Sign Up</a>
				</div>
				<div class="d-flex justify-content-center">
					<a href="#">Forgot your password?</a>
				</div>
			</div>
		</div>
	</div>
</div>
</template>
<script>
import { ACTIONS } from "../config"
import { mapGetters } from 'vuex'
import DialogWindow from '../components/DialogWindow.vue'

/**
 * @author Attila Barna
 */
export default {
  components: { DialogWindow },


  sockets: {
     connect() {
       this.$router.push("/chat")
    }
  },

  data: () => ({
    username : undefined,
    userpassword : undefined,
    room : undefined,
    error: undefined,
    defaultError: 'Something went wrong'
  }),


  computed : {
      ...mapGetters( {
           rooms : 'getRooms',
           authenticated : 'getAuthenticated'
      } ),
  },

  watch : {
      rooms() {
        this.room = this.rooms[0].id
      },
  },

  async created() {
    try {
      await this.$store.dispatch(ACTIONS.ROOMS_LIST)
    } catch (error) {
      this.error = this.defaultError
    }
  },


  methods: {

    onDialog(data) {
        this.error = null
    },

    async login() {

      if(!(this.username && this.room)) return
      this.error = undefined

      try {
        await this.$store.dispatch(ACTIONS.AUTHENTICATE, {
          room: this.room,
          username: this.username,
          password: this.userpassword
        })

        this.$store.dispatch( ACTIONS.UPDATE_ROOM, this.room )

        this.$socket.open()

      } catch (error) {
        this.error = error.message ? error.message : this.defaultError
      }
    }
  }

}

</script>

