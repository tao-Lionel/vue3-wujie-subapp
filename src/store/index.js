import { defineStore } from 'pinia'

// 定义store
export const useAppStore = defineStore('app', {
  state: () => ({
    isMainAppTriggered: false
  }),
  actions: {
    setMainAppTriggered(value) {
      this.isMainAppTriggered = value
    }
  }
})