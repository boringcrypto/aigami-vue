<template>
    <v-dialog v-model="dialog" activator="parent" width="auto">
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>New Game</v-toolbar-title>
            </v-toolbar>

            <v-sheet width="500" class="mx-3">
                <v-form @submit.prevent class="my-3">
                    <v-text-field v-model="store.name" :rules="nameRules" label="Character Name"></v-text-field>
                    <v-text-field v-model="store.tags" :rules="tagRules" label="Tags"></v-text-field>
                    <v-btn type="submit" block class="mt-2" @click="create_game">Create</v-btn>
                </v-form>
            </v-sheet>
        </v-card>
    </v-dialog>

    <template ref="newGamePrompt">
        <pre>
Player name: {{store.name}}
Tags: {{store.tags}}

Design a text-based adventure game in JSON.

Game world: The game world is the environment in which the game takes place. The game world should be designed in a way that it provides opportunities for dialog interactions.

The game has no visuals and no music. Don't use clichés.

Create some information for this game as a dict in JSON format with the following keys:

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
        </pre>
    </template>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/app';
import { ref } from 'vue';
import { get_chat } from '@/utils/chatgpt'
import { ChatCompletionRequestMessageRoleEnum } from 'openai'
import json from '@/utils/json';

const newGamePrompt = ref(null)
const dialog = ref(false)
const store = useAppStore();
const nameRules = [
    (value: string) => {
        if (value) return true

        return 'You must enter a character name.'
    }]
const tagRules = [
    (value: string) => {
        if (value) return true

        return 'You must enter at least one tag.'
    }]

const create_game = async () => {
    dialog.value = false
    console.log(newGamePrompt.value)
    ChatCompletionRequestMessageRoleEnum
    if (newGamePrompt.value) {
        const prompt = (newGamePrompt.value as HTMLTemplateElement).innerText
        console.log(prompt)
        const messages = [
            { role: ChatCompletionRequestMessageRoleEnum.System, content: "You're an experienced game designer and game master." },
            { role: ChatCompletionRequestMessageRoleEnum.User, content: prompt }
        ];

        const response: any = json.parse(await get_chat(messages) || "{}")
        console.log(response)
        store.world = response.world
        store.currency = response.currency
        store.currencyAmount = response.currencyAmount
        store.inventory = response.inventory
        store.locations = []
        store.locations.push(response.location)
        store.currentLocation = 0
        store.location.messages = [{
            role: ChatCompletionRequestMessageRoleEnum.Assistant,
            content: response.intro as string
        }]
        store.npcs = response.npcs
        store.quests = response.quests
        store.artStyle = response.artStyle
    }
}
</script>