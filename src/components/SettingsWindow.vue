<template>
    <dialog-window title="Settings" :open="display" :onClose="close" @validate="validate" @invalidate="invalidate">

      <div slot="dialogBody">
        <button
            v-for="tab in tabs"
            v-bind:key="tab.name"
            v-bind:class="['tab-button', { active: currentTab === tab }]"
            v-on:click="currentTab = tab.name"
          >
            {{ tab.value }}
          </button>

        <component :is="currentTabComponent" class="tab"></component>
      </div>
    </dialog-window>
</template>
<script>
import DialogWindow from './DialogWindow.vue'
import ChatTabVue from './settings/tabs/ChatTab.vue'
import GeneralTabVue from './settings/tabs/GeneralTab.vue'
import ProfileTabVue from './settings/tabs/ProfileTab.vue'

export default {

  data () {
    return {
      display: false,
      tabs: [{ value: 'General', name: 'general' }, { value: 'Chat', name: 'chat' }, { value: 'Profile', name: 'profile' }],
      currentTab: 'General'
    }
  },

  components: {
    'tab-general': GeneralTabVue,
    'tab-profile': ProfileTabVue,
    'tab-chat': ChatTabVue,
    DialogWindow
  },

  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.currentTab.toLowerCase()
    }
  },

  mounted () {

  },

  methods: {

    close (e) {
      this.display = false
    },

    show () {
      this.display = true
    },

    toggle () {
      this.display = !this.display
    },

    validate (e) {
      this.toggle()
    },

    invalidate (e) {
      this.toggle()
    }

  }

}
</script>
<style scoped>
  .tab-button {
    padding: 6px 10px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border: 1px solid #ccc;
    cursor: pointer;
    background: #f0f0f0;
    margin-bottom: -1px;
    margin-right: -1px;
  }
  .tab-button:hover {
    background: #e0e0e0;
  }
  .tab-button.active {
    background: #e0e0e0;
  }
  .tab {
    border: 1px solid #ccc;
    padding: 10px;
  }
</style>
