// Utilities
import { ChatCompletionRequestMessage } from 'openai'
import { type } from 'os'
import { defineStore } from 'pinia'
import { ref } from 'vue'

type NPC = {
  name: string,
  description: string,
  imagePrompt: string,
  image: string
}

type Location = {
  name: string,
  description: string,
  messages: ChatCompletionRequestMessage[],
  npcs: NPC[],
  imagePrompt: string,
  image: string
}

type InventoryItem = {
  name: string,
  description: string,
  imagePrompt: string,
  image: string
}

type Quest = {
  name: string,
  description: string,
  item_name: string,
  item_description: string,
  location_name: string,
  npc_name: string
}

export const useAppStore = defineStore('app', {
  state: () => ({
    keys: {
      openai: "",
      brainpet: ""
    },
    templates: {
      new_game: ""
    },

    // Add your state here
    name: "Alex",
    tags: "wonderland, unicorns",
    game_name: "",
    world: "",
    currency: "",
    currencyAmount: 0,
    locations: [] as Location[],
    currentLocation: 0,
    inventory: [] as InventoryItem[],
    quests: [] as Quest[],
    artStyle: ""
  }),
  getters: {
    location: (state): Location => {
      if (state.currentLocation >= state.locations.length || !state.locations[state.currentLocation]) {
        return { name : "", description: "", messages: [], npcs: [], imagePrompt: "", image: "" }
      }
      return state.locations[state.currentLocation]
    }
  }
})


