<template>
   <div no-body>
       <b-row header-tag="header" role="tab">
          <b-button block @click="onButtonClick($event)">Private</b-button>
        </b-row>
        <b-collapse v-if="display" visible role="tabpanel">
              <div class="inbox_chat">
                  <div v-for="priv in items" class="chat_list active_chat" :key="priv.username"
                       @click.prevent.stop="handleClick($event, priv)"
                  >
                          <div class="chat_people">
                            <div class="chat_img"> <img src="../assets/user-profile.png" alt="sunil"> </div>
                            <div class="chat_ib">
                              <h5> {{ priv.username }} <span v-if="priv.msgcnt">({{priv.msgcnt}})</span></h5>
                            </div>
                          </div>
                  </div>
              </div>
        </b-collapse>
   </div>
</template>
<script>
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css'
import ToggleComponentVue from './ToggleComponent.vue'


export default {
   props : {

      items: {
        required: true
      },

      parent : {
        required: true
      }
   },

   mixins: [ ToggleComponentVue ],

   methods : {

        handleClick (event, item) {
            item.minimized = false
            item.__ob__.dep.notify()
        }
   }
}
</script>
