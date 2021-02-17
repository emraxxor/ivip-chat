<template>
<!-- basic template from https://bootsnipp.com/ -->
<div :class="darktheme ? 'dark' : ''" class="container-fluid">

<div class="messaging">
      <div class="inbox_msg">
        <div class="inbox_people">
          <div class="headind_srch">
            <div class="recent_heading">
              <h4>Online</h4>
            </div>
            <div class="srch_bar">
              <div class="stylish-input-group">
                <input type="text" class="search-bar" @keyup="onChangeSearchBar" @change="onChangeSearchBar" placeholder="Search" >
                <span class="input-group-addon">
                <button @click="onChangeSearchBar" type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
                </span> </div>
            </div>
          </div>
          <div ref="accordion" class="accordion" role="tablist">
             <UserList ref="userlist" @clickOnItem="onClickUserItem"></UserList>
          </div>
        </div>
        <div class="mesgs">
          <div class="msg_history" ref="messagePanel" @click="displaySmileyPicker ? toogleSmiley() : {} ">
             <MessageVue
                @onChange="onChangeMessagePanel"
                @clickOnUserName="onClickUserName"
             ></MessageVue>
          </div>
          <div class="type_msg">
            <div class="input_msg_write">
              <div v-if="displaySmileyPicker">
                <Picker :include="['people']" set='messenger'  title="Pick your emoji…" emoji="point_up"  @select="addSmiley"
                        :style="{ position: 'absolute', bottom: '20px', right: '20px' }"
                />
              </div>
              <input maxlength="256" type="text" ref="inputMessage" class="write_msg" v-model="msg" v-on:keyup.enter="submit" placeholder="Type a message" />
              <div v-if="chatType === 'WALL'" class="color-picker">
                    <v-swatches :swatch-style="{width: '20px', height: '20px'}" popover-x="left" swatches="text-advanced" v-model="swatchColor"></v-swatches>
              </div>
              <button class="msg_chat_btn" style="right:105px" @click="toogleChatType" type="button"><i class="fa fa-th" aria-hidden="true"></i></button>
              <button class="msg_chat_btn" style="right:70px" @click="toogleDarkTheme" type="button"><i class="fa fa-eye" aria-hidden="true"></i></button>
              <button class="msg_chat_btn" style="right:35px" @click="toogleSmiley" type="button"><i class="fa fa-smile" aria-hidden="true"></i></button>
              <button class="msg_chat_btn" @click="submit" type="button"><i class="fa fa-share" aria-hidden="true"></i></button>
            </div>
          </div>
        </div>
      </div>

    </div>

  <div v-for="notice in notices" :key="notice.username">
      <Dialog :data="notice" title="Private chat" open='true' @validate="onNoticeAccept" @invalidate="onNoticeDecline">
          <div slot="dialogBody">
             <div v-if="notice.type == 'ask_private'">
                   {{ notice.username }} wants to make a private chat with you.
             </div>
             <div v-if="notice.type == 'ask_camera'">
                   {{ notice.username }} wants to request access to your camera.
             </div>
             <div v-else-if="notice.type == 'accept_private'">
                   {{ notice.username }} is accepted your request.
             </div>
            <div v-else-if="notice.type == 'accept_camera'">
                   {{ notice.username }} is accepted your request.
             </div>
             <div v-else-if="notice.type == 'decline_private'">
                   {{ notice.username }} is declined your request.
             </div>
             <div v-else-if="notice.type == 'decline_camera'">
                   {{ notice.username }} is declined your request.
             </div>
          </div>
      </Dialog>
  </div>

  <PrivateChat ref="privs"
               v-for="priv in accepted"
               @close="privateWindowOnClose"
               :key="priv.username"
               :data="priv"
               title="Private chat">
  </PrivateChat>

</div>

</template>
<script>

import '../styles/chat.scss';
import { CHAT_TYPE, EVENTS } from "../config"
import { mapActions, mapGetters } from 'vuex'
import MessageVue from '@/components/Message.vue'
import UserList from '@/components/UserList.vue'
import Dialog from '@/components/DialogWindow.vue'
import PrivateChat from '@/components/PrivateChat.vue'
import { Picker } from 'emoji-mart-vue'
import VSwatches from 'vue-swatches'



/**
 * @author Attila Barna
 */
export default {

  data : () => ({
      msg : '',
      notices : [],
      accepted : [],
      webcams : [],
      swatchColor: '#000000',
      displaySmileyPicker : false,
  }),

  computed : {
      ...mapGetters( {
              public  : 'getPublic',
              room : 'getRoom',
              userName : 'getUserName',
              userStatus : 'getUserStatus',
              isAuthenticated : 'getAuthenticated',
              darktheme : 'getDarktheme',
              chatType : 'getChatType',
              chatFontColor: 'getChatFontColor'
      } ),
  },

  components : {
    MessageVue,
    Dialog,
    UserList,
    PrivateChat,
    Picker,
    VSwatches
  },

  sockets: {

      notice : function( data ) {
          const exists = this.notices.filter(e => e.username === data.username && e.type == data.type ).length > 0
          if ( !exists ) {
            this.notices.push({...data})
          }
      },

  },

  beforeCreate: function() {
      this.$socket.emit(EVENTS.JOIN_ROOM, this.$store.state)
  },

  watch : {
     swatchColor() {
       this.$store.commit('setChatFontColor', this.swatchColor)
     }
  },

  mounted() {
  },

  methods :  {
    ...mapActions({
                    submitMessage: 'addMessage',
                    setDarkTheme: 'updateDark'
    }),

    toogleDarkTheme() {
        this.setDarkTheme(!this.darktheme)

        if ( this.darktheme ) {
           document.body.classList.add('dark')
        } else {
           document.body.classList.remove('dark')
        }
    },

    toogleChatType() {
        if ( this.chatType === CHAT_TYPE.TYPE_MESSENGER ) {
           this.$store.commit('setChatType',  CHAT_TYPE.TYPE_WALL )
        } else {
           this.$store.commit('setChatType',  CHAT_TYPE.TYPE_MESSENGER )
        }
    },

    onChangeSearchBar(e) {
        const val = e.target.value
        this.$refs.userlist.setFilterValue(val)
    },

    addSmiley(smile) {
      this.msg = `${this.msg} ${smile.colons}`
    },

    toogleSmiley() {
        this.displaySmileyPicker = !this.displaySmileyPicker;
    },

    privateWindowOnClose(item) {
        this.accepted = this.accepted.filter(e => e.username !== item.username)
    },

    onClickUserItem(item) {
       this.msg = `${item.name}: `
    },

    onClickUserName(name) {
        this.msg = `${name}: `
        this.$refs.inputMessage.focus()
    },

    onChangeMessagePanel(newv,oldv) {
      setTimeout(() => {
        this.$refs.messagePanel.scrollTop = this.$refs.messagePanel.scrollHeight
      },100)
    },

    onNoticeAccept : function(item) {
      if ( item.type == 'ask_private' ) {
         this.$socket.emit(EVENTS.ACCEPT_PRIVATE ,  { to : item.username , from : item.to , type : 'accept_private' }  )
         this.accepted.push({...item, callee : true})
      } else if ( item.type == 'ask_camera' ) {
         console.log(`Usercamera offer to ${item.username}`)
         this.$refs.usercamera.offer(item.username)
         this.$socket.emit(EVENTS.ACCEPT_CAMERA ,   { to : item.username , from : item.to , type : 'accept_camera' }  )
      } else if ( item.type == 'accept_private' ) {
         this.accepted.push({...item, callee: false})
      }  else if ( item.type == 'accept_camera' ) {
         this.notices.push(item)
      }

      this.notices = this.notices.filter(e => e.username !== item.username)
    },

    onNoticeDecline : function(item) {
      if ( item.type == 'ask_private' ) {
         this.$socket.emit(EVENTS.DECLINE_PRIVATE, { to : item.username , from : item.to, type : 'decline_private' }  )
      } else if ( item.type == 'ask_camera' ) {
         this.$socket.emit(EVENTS.DECLINE_CAMERA,  { to : item.username , from : item.to, type : 'decline_camera' }  )
      }
      this.notices = this.notices.filter(e => e.username !== item.username)
    },

    submit() {
      if ( this.msg.length > 0 ) {

        if ( this.displaySmileyPicker  )
          this.toogleSmiley()

        this.$socket.emit(EVENTS.SUBMIT_MESSAGE , {
          room: this.$store.getters.getRoom,
          username : this.$store.getters.getUserName,
          message: this.msg,
          color: this.chatFontColor
        })

        this.submitMessage({
                  type : 'sent',
                  message : this.msg,
                  username: this.$store.getters.getUserName,
                  time: new Date(),
                  color: this.chatFontColor
        })
        this.msg = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .video-panel {
    display: flex;
  }
</style>
