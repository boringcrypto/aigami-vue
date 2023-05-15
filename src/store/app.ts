// Utilities
import { ChatCompletionRequestMessage } from 'openai'
import { type } from 'os'
import { defineStore } from 'pinia'
import { ref } from 'vue'

type Location = {
  name: string,
  description: string,
  messages: ChatCompletionRequestMessage[],
  imagePrompt: string,
  image: string
}

type NPC = {
  name: string,
  description: string
}

type InventoryItem = {
  name: string,
  description: string
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
    name: "Martijn",
    tags: "pirates, pirating, upgrade-able ships, trading, exploring, treasure",
    world: "",
    currency: "",
    currencyAmount: 0,
    locations: [] as Location[],
    currentLocation: 0,
    inventory: [] as InventoryItem[],
    npcs: [] as NPC[],
    quests: [] as Quest[],
    artStyle: ""
  }),
  getters: {
    location: (state) => {
      if (state.currentLocation >= state.locations.length || !state.locations[state.currentLocation]) {
        return { name : "", description: "", messages: [], imagePrompt: "", image: "" }
      }
      return state.locations[state.currentLocation]
    }
  }
})


