<template>
   <div>
     <span v-for="(e, ix) in data" :key="'smiley_'+ix">
        <span v-if="e.type === 'text' && e.data !== null"> {{e.data}} </span>
        <span v-else-if="e.type === 'smiley' && e.data !== null"><Emoji set="messenger" :emoji="e.data"></Emoji></span>
        <span v-else-if="e.type === 'youtube' && e.data !== null"><youtube player-width=320 player-height=240 :video-id="e.data"></youtube></span>
        <span v-else-if="e.type === 'link' && e.data !== null"><a style="text-decoration:none;" :href="e.data" target="_blank">{{e.data}}</a></span>
     </span>

   </div>
</template>
<script>
import { Emoji, NimbleEmojiIndex } from 'emoji-mart-vue'
import data from 'emoji-mart-vue/data/messenger'

export default {

  data : () => ({
     data : []
  }),

  props: {
      msg : {
        required: true
      }
  },

  mounted() {
     this.parseMessage()
  },


  components : {
    Emoji
  },

  methods : {

      parseMessage() {

        const words = this.msg.split(" ")
        const emojiIndex = new NimbleEmojiIndex(data)
        let res = this.msg.match(new RegExp(/:[^:\s]*(?:::[^:\s]*)*:/g));
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
               //if ( word.indexOf('youtube') != -1  || word.indexOf('youtu.be') != -1 ) {
               //   const yid = yt(word)
               //    if ( yid ) {
               //        this.data.push({type:'youtube', data: yid})
               //    }
               //} else {
                 this.data.push({type:'link', data: word})
               //}
           } else {
               this.data.push({type:'text', data: words[i]})
           }
        }

      }
  }

};
</script>
