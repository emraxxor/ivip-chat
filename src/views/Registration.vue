<template>

  <b-container>
    <div v-if="error">
      <dialog-window title="Error" open='true' :data="{}" @validate="handleDialog" @invalidate="handleDialog">
        <div slot="dialogBody" v-html="errorMessage"></div>
      </dialog-window>
    </div>

    <div v-if="success">
      <dialog-window title="Registration completed successfully" open='true' :data="{}" @validate="handleDialog"
                     @invalidate="handleDialog">
        <div slot="dialogBody">
          Registration completed successfully.
        </div>
      </dialog-window>
    </div>

    <div class="card">
      <b-card-header>
        <h3>Registration</h3>
      </b-card-header>
      <b-card-body>

        <b-form-group
          label="Enter your nickname:"
          label-for="input-name"
        >
          <b-form-input placeholder="Your nickname" id="input-name" v-model="name" :state="validName"
                        trim></b-form-input>
        </b-form-group>

        <b-form-group
          label="Enter your email:"
          label-for="input-email"
        >

          <b-form-input placeholder="Email address" id="input-email" v-model="email" :state="validEmail"
                        trim></b-form-input>
        </b-form-group>

        <b-form-group
          label="Confirm your email:"
          label-for="input-email-confirm"
        >

          <b-form-input placeholder="Confirm email address" id="input-email-confirm" v-model="emailAgain"
                        :state="validEmail" trim></b-form-input>
        </b-form-group>

        <b-form-group
          label="Enter your password:"
          label-for="input-password"
        >

          <b-form-input type="password" placeholder="Your password" id="input-password" v-model="password"
                        :state="validPassword" trim></b-form-input>
        </b-form-group>

        <b-form-group
          label="Confirm your password:"
          label-for="input-password-confirm"
        >

          <b-form-input type="password" placeholder="Confirm your password" id="input-password-confirm"
                        v-model="passwordConfirm" :state="validPassword" trim></b-form-input>
        </b-form-group>

        <b-button @click="registration($event)" class="primary">Registration</b-button>
        <router-link to="/">
          <b-button>Cancel</b-button>
        </router-link>

      </b-card-body>
    </div>
  </b-container>

</template>
<script>
import DialogWindow from '../components/DialogWindow.vue'

// eslint-disable-next-line no-useless-escape
const emailExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
const nameExpression = /^([a-zA-Z0-9]*)$/

export default {
  components: {DialogWindow},

  computed: {
    validName () {
      return this.name.length > 4 && nameExpression.test(this.name) && this.name.length < 16
    },

    validEmail () {
      return emailExpression.test(this.email) && this.email === this.emailAgain
    },

    validPassword () {
      return this.password.length > 5 && this.password === this.passwordConfirm
    }
  },

  data () {
    return {
      name: '',
      email: '',
      emailAgain: '',
      password: '',
      passwordConfirm: '',
      success: false,
      error: false,
      errorMessage: ''
    }
  },

  methods: {
    async registration () {
      if (this.validName && this.validEmail && this.validPassword) {
        try {
          const data = await this.$store.dispatch('user/registration', {
            name: this.name,
            email: this.email,
            password: this.password
          })

          if (data.length === 1 && data[0].type === 'success') {
            this.success = true
          } else {
            this.error = true
            this.errorMessage = ''
            data.forEach(e => {
              if (e.type === 'error') {
                this.errorMessage += e.message + '<br/>'
              }
            })
          }
        } catch (e) {
          this.error = true
          this.errorMessage = 'Something went wrong'
        }
      }
    },

    handleDialog () {
      this.error = false
      this.success = false
      this.errorMessage = ''
    }
  }

}
</script>
<style lang="scss" scoped>
.card {
  width: initial;
  max-width: initial;
  text-align: left;
  max-height: initial;
}

.card-body {
  .card-title {
    color: white;
  }
}
</style>
