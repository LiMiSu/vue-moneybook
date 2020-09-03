import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class TagHelper extends Vue {
  createTag() {
    this.$store.commit('createTag', name)
  }
}