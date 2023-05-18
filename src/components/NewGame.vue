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
                <v-alert v-if="error" dense type="info" class="my-3">
                    {{ error }}
                </v-alert>
                <v-form @submit.prevent class="my-3">
                    <v-text-field v-model="store.name" :rules="nameRules" label="Character Name"></v-text-field>
                    <v-text-field v-model="store.tags" :rules="tagRules" label="Tags"></v-text-field>
                    <v-btn type="submit" block class="mt-2" @click="create_game">Create</v-btn>
                </v-form>
                {{ game_data }}
            </v-sheet>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/app';
import { ref } from 'vue';
import { get_chat } from '@/utils/chatgpt'
import { ChatCompletionRequestMessageRoleEnum } from 'openai'
import json from '@/utils/json';
import { fillTemplate } from '@/utils/template';

const dialog = ref(false)
const error = ref("")
const game_data = ref("")
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
    const prompt = fillTemplate(store.templates.new_game, store)
    console.log(prompt)
    const messages = [
        { role: ChatCompletionRequestMessageRoleEnum.System, content: "You're an experienced game designer and game master." },
        { role: ChatCompletionRequestMessageRoleEnum.User, content: prompt }
    ];

    await get_chat(messages, game_data)

    const response: any = json.parse(game_data.value || "{}")
    console.log(game_data.value)
    if (!response.game_name) {
        dialog.value = true
        error.value = "Something went wrong. Have you entered your OpenAI API key? Do you have credits on your OpenAI account?"
        return
    }
    store.game_name = response.game_name
    store.world = response.world
    store.currency = response.currency
    store.currencyAmount = response.currencyAmount
    store.inventory = response.inventory
    store.locations = []
    store.locations.push(response.location)
    store.currentLocationIndex = 0
    store.location.messages = [{
        role: ChatCompletionRequestMessageRoleEnum.Assistant,
        content: response.intro as string
    }]
    store.location.npcs = response.npcs
    store.quests = response.quests
    store.artStyle = response.artStyle

    dialog.value = false
}
</script>