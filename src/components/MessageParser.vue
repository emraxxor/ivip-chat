<template>
   <div>
     <span v-for="(e, ix) in data" :key="'smiley_'+ix" :style=" { fontSize: settings.fontSize + 'px' } ">
        <span v-if="e.type === 'text' && e.data !== null"> {{e.data}} </span>
        <span v-else-if="e.type === 'smiley' && e.data !== null"><Emoji :size="chatType === walltype.TYPE_WALL ? 16 : 24" set="messenger" :emoji="e.data"></Emoji></span>
        <span v-else-if="e.type === 'youtube' && e.data !== null" @click="onToogleYoutubeLink" style="cursor: pointer;">
             <dialog-window :data="data" title="Youtube" :open='open' :onClose="onCloseYoutubeLink" @validate="onToogleYoutubeLink($event)" @invalidate="onToogleYoutubeLink($event)">
                <div slot="dialogBody" style="text-align:center">
                  <youtube :player-width="width" :player-height="height" :video-id="e.data"></youtube>
                </div>
            </dialog-window>
            Youtube: {{e.orig}}
        </span>
        <span v-else-if="e.type === 'image' && e.data !== null"><a style="text-decoration:none;" :href="e.data" target="_blank"><img class="fluid resposinve" style="max-width: 200px" :src="e.data"/></a></span>
        <span v-else-if="e.type === 'link' && e.data !== null"><a style="text-decoration:none;" :href="e.data" target="_blank">{{e.data}}</a></span>
     </span>

   </div>
</template>
<script>
import { Emoji, NimbleEmojiIndex } from 'emoji-mart-vue'
import data from 'emoji-mart-vue/data/messenger'
import { mapGetters } from 'vuex';
import { CHAT_TYPE } from '../config';
import DialogWindow from './DialogWindow.vue';

export default {

  data : () => ({
     data : [],
     open: false
  }),

   computed : {
        ...mapGetters( {
              chatType : 'getChatType',
              settings: 'user/getSettings'
        }),

       width() {
          if ( window.innerWidth < 480 )
            return 320;

          return 480;
       },

       height() {
          if ( window.innerHeight < 320 )
            return 280;

          return 320;
       },


       walltype() {
          return CHAT_TYPE
       }
  },

  props: {
      msg : {
        required: true
      }
  },

  mounted() {
     this.parseMessage()
  },


  components : {
    Emoji,
    DialogWindow
  },

  methods : {

      onCloseYoutubeLink() {
        this.open = false
      },

      onToogleYoutubeLink() {
        this.open = !this.open
      },


      parseMessage() {
        const words = this.msg.split(" ")
        const emojiIndex = new NimbleEmojiIndex(data)
        const extension = /(?:\.([^.]+))?$/
        let res = this.msg.match(new RegExp(/:[^:\s]*(?:::[^:\s]*)*:/g))
        let urls = this.msg.match(new RegExp(
          "(^|[ \t\r\n])((http|https):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))"
         ,"g"
        ));

        const yt = (url) => {
              const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
              const match = url.match(regExp);
              return (match&&match[7].length==11)? match[7] : false;
        }

        if ( res === null )
          res = []

        if ( urls === null )
          urls = []

        for(let i=0; i<words.length; ++i) {
           if ( res.indexOf(words[i]) != -1 &&
            emojiIndex.search(words[i].replaceAll(':','')).flatMap(e => e.colons).filter(e => e == words[i]).length == 1
           ) {
                this.data.push({type:'smiley', data: words[i]})
           } else if ( urls.indexOf(words[i]) != -1 ) {
               const word = words[i]
               if ( word.indexOf('youtube') != -1  || word.indexOf('youtu.be') != -1 ) {
                  const yid = yt(word)
                   if ( yid ) {
                       this.data.push({type:'youtube', data: yid, orig: word})
                   }
               } else {
                 const ext = extension.exec(word)
                 console.log(ext)
                 if ( ext && (ext[1] === 'gif' || ext[1] === 'jpg' || ext[1] === 'jpeg' || ext[1] === 'webp')  ) {
                    this.data.push({type:'image', data: word})
                 } else {
                    this.data.push({type:'link', data: word})
                 }
               }
           } else {
               this.data.push({type:'text', data: words[i]})
           }
        }

      }
  }

};
</script>
