<template>
      <div no-body class="">
        <b-row header-tag="header" role="tab">
          <b-button block v-b-toggle.accordion-users >Users</b-button>
        </b-row>
        <b-collapse id="accordion-users" visible role="tabpanel">
              <div class="inbox_chat">
                  <div v-for="user in users" class="chat_list active_chat">
                          <div class="chat_people">
                            <div class="chat_img"> <img src="../assets/user-profile.png" alt="sunil"> </div>
                            <div class="chat_ib">
                              <h5> {{ user.name }} </h5>
                            </div>
                          </div>
                  </div>
              </div>
        </b-collapse>
      </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {

  sockets: {

       userJoinedToRoom : function(  { users, username } ) {
          this.$store
            this.updateUsers( users.map( e => {
              return {
                  name: e.username,
                  private : e.privateChat
              }
            })  );


          this.submitMessage( { msg :  `${username} is joined to room.`, type: 'system' } )
      },

      leaveChat : function( {users, username} ) {
          this.removeUser(username)
          this.submitMessage( { msg :  `${username} is leaving the chat.`, type: 'system' } )
      }

  },

  computed : {
      ...mapGetters( { users : 'getUsers' } ),
  },



  data: () => ({
  }),

  methods : {
        ...mapActions({
          updateUsers : 'updateUsers',
          submitMessage : 'addMessage',
          removeUser : 'removeUser'

        }),

  }
}
</script>
