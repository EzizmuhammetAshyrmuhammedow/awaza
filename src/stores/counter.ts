import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from '../../pocketbase-types.ts'

const pb = new PocketBase('http://127.0.0.1:8090') as TypedPocketBase// Replace with your PocketBase URL


export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
