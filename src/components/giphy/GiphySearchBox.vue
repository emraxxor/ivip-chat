<template>
  <div class="giphy-search-container">
    <div @keyup.enter="search()" v-if="searchBar" style="display: flex; justify-content: center; align-items: center">
      <input type="text" v-model="searchText" :placeholder="placeholder" class="search-gif-input" />
      <button @click="search()" class="button-search-gif">
        {{ searchButtonText }}
      </button>
    </div>
    <div v-if="this.result" style="display: flex; justify-content:center">
      <div class="container">
        <img :key="image.index" v-for="image in this.result" :src="image" :style="imgStyle" :class="['fluid', 'responsive']"
             @click="onClickImage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    apiKey: {
      type: String,
    },

    searchBar: {
      type: Boolean,
      default: true,
    },

    imgStyle: {
      default: () =>  ({  paddingTop: '10px', margin: '0 10px', cursor: 'pointer' })
    },

    placeholder: {
      type: String,
      default: "Gif search...",
    },

    searchButtonText: {
      type: String,
      default: "Go!",
    },

    resultNumbers: {
      type: Number,
      default: 35,
    },

    clearSearchBar: {
      type: Boolean,
      default: true,
    },

    clearResultOnClick: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      searchText: "",
      result: [],
    };
  },


  methods: {
    async search() {
      this.result = [];
      await axios
        .get(
          "https://api.giphy.com/v1/gifs/search?api_key=" +
            this.apiKey +
            "&q=" +
            this.searchText
        )
        .then((response) => {
          this.searchText = "";
          let count = 0;
          for (let el of response.data.data) {
            this.result.push(el.images.original.url);
            if ((count += 1) >= this.resultNumbers) break;
          }
        });
      if (this.clearSearchBar) this.searchText = "";
    },
    onClickImage(image) {
      this.$emit("clicked", image.srcElement.currentSrc);
      if (this.clearResultOnClick) this.result = [];
    },
  },
};
</script>

<style scoped>

.giphy-search-container {
  position: absolute;
  bottom: 50px;
  right: 10px;
  width:352px;
  max-width: 352px;
  overflow: auto;
  height:  300px;
  max-height: 300px;
  color: #222427;
  border: 2px solid #d9d9d9;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.36);

}

.container {
  margin-top: 15px;
  display: inline-block;
  overflow: auto;
}

img {
  width: 100%;
  max-width: 50px;
  float: left;
}


.search-gif-input {
  width: 25rem;
  height: 26px;
  padding:0px;
  margin:5px;
  padding-left: 1%;
  margin-right: 10px;
  border-radius: 0.25rem;
  font-size: 12px;
  line-height: 12px;
  border-width: 0;
  background-color: #f0f0f0;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  min-height: 26px !important;
}

.button-search-gif {
  --bg-opacity: 1;
  background-color: #48bb78;
  background-color: rgba(72, 187, 120, var(--bg-opacity));
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --text-opacity: 1;
  color: #fff;
  color: rgba(255, 255, 255, var(--text-opacity));
  font-size: 1.25rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  cursor: pointer;
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: #e2e8f0;
}

.button-search-gif:hover {
  background-color: #68d391;
}

</style>
