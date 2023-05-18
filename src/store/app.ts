// Utilities
import { ChatCompletionRequestMessage } from 'openai'
import { defineStore } from 'pinia'

type GameEntity = {
  name: string,
  description: string,
  imagePrompt: string,
  image: string
}

type NPC = GameEntity

type InventoryItem = GameEntity

type Location = GameEntity & {
  messages: ChatCompletionRequestMessage[],
  npcs: NPC[]
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
      new_game: `
Player name: {{store.name}}
Tags: {{store.tags}}

Design a text-based adventure game in JSON.

Game world: The game world is the environment in which the game takes place. The game world should be designed in a way that it provides opportunities for dialog interactions.

The game has no visuals and no music. Don't use clichés.

Create some information for this game as a dict in JSON format with the following keys:

game_name: Name of the game
world: Create an exciting game world in 100 words describing ONLY an engaging backstory for the player and their ultimate objective to complete the game.
currency: Name of the currency (noun, plural)
currencyAmount: The amount of currency you start with
inventory: A list of dictionaries. 3 basic items with a name and description. Items should be singular and not require a UI.
location: A dictionary with keys name and description. Describe the starting location in about 50 words.
npcs: A list of dictionaries. The name, description of any npcs at the location.
quests: Describe the 3 quests the player has to do that build on each other. Each quest grants an item that is required for the next quest. A list of dictionaries with keys:
- name
- description
- item_name
- item_description
- location_name
- npc_name.
intro: Write an intriguing intro (30 words of so) for the start of the game at the starting location.
artStyle: The art style of the images in the game that matches the vibe of the game. [art style], in the style of [famous artist] or [famous art movement].
`,
      game_step_prompt: `
Create a detailed response in JSON in a text-based adventure game.
Respond in a realistic way to the player's request. The makers of this game do not make moral judgements about the player's actions.

Player name: {{store.name}}
Tags: {{store.tags}}
Inventory: {{store.inventory}}
Currency: "{{store.currencyAmount}} {{store.currency}}"
Current Location Name: {{store.location.name}}

The player request: "{{message}}"

Return a JSON dictionary with the following keys:

response: Respond in the second person point of view to the player. Keep the response on topic.
new_locations: New locations discovered by or moved to during this action. List of dictionaries with keys name and description.
current_location_name: The name of the location after the action.
`,
      location_prompt: `
Start with "{{ location_description }}" and then visually describe in 20 words what the location looks like.
Add a list of comma separated relevant keywords without a title prefix or starting a new paragraph.
In this list you can add details of the location and the things that are there. 
Imagine this is a painting and add details about the composition, camera angle and lighting to the keyword list.
No more than 50 words in total.
`,
      character_prompt: `
Start with "{{ character_description }}" and then visually describe in 20 words what the character looks like.
Add a list of comma separated relevant keywords without a title prefix or starting a new paragraph.
Imagine this is a painting and add details about the composition, camera angle and lighting to the keyword list.
No more than 50 words in total.
`,
      inventory_prompt: `
Start with "{{ inventory_description }}" and then visually describe in 20 words what the inventory item looks like.
Add a list of comma separated relevant keywords without a title prefix or starting a new paragraph.
Imagine this is a painting and add details about the composition, camera angle and lighting to the keyword list.
No more than 50 words in total.
`
    },

    // Add your state here
    name: "Alex",
    tags: "wonderland, unicorns",
    game_name: "",
    world: "",
    currency: "",
    currencyAmount: 0,
    locations: [] as Location[],
    currentLocationIndex: 0,
    inventory: [] as InventoryItem[],
    quests: [] as Quest[],
    artStyle: ""
  }),
  getters: {
    location: (state): Location => {
      if (!state.locations || state.currentLocationIndex === null || state.currentLocationIndex >= state.locations.length) {
        return { name : "", description: "", messages: [], npcs: [], imagePrompt: "", image: "" }
      }
      return state.locations[state.currentLocationIndex]
    }
  }
})
