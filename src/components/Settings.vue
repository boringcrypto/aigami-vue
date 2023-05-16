<template>
    <v-dialog v-model="dialog" activator="parent" width="auto">
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Settings</v-toolbar-title>
            </v-toolbar>

            <v-sheet width="800" class="mx-3">
                <v-form @submit.prevent class="my-3">
                    <v-text-field 
                        density="compact"
                        v-model="store.keys.openai" 
                        hint="To create a game and have conversations you need an OpenAI API key. Click the button to go to the OpenAI website. If you don't have any trial credits, you will need to add payment details."
                        label="OpenAI API key">
                        <template v-slot:append>
                            <v-btn v-slot:append
                                v-if="!store.keys.openai"
                                href="https://platform.openai.com/account/api-keys"
                                target="_blank"
                                variant="tonal"
                                class="mb-2 outline float-end">Create OpenAI API key</v-btn>
                        </template>

                    </v-text-field>

                    <v-text-field 
                        density="compact"
                        v-model="store.keys.brainpet"
                        label="BrainPet API key"
                        hint="To create images for location, characters, etc. you need a BrainPet API key. Click the button to connect to BrainPet. You will get 100 free credits."
                    >
                        <template v-slot:append>
                            <v-btn v-if="!store.keys.brainpet" @click="connectBrainPet" class="mb-2" hint="Test">Connect BrainPet</v-btn>
                            <v-btn v-if="!store.keys.brainpet && session" @click="checkBrainPet" class="mb-2">Check BrainPet</v-btn>
                        </template>
                    </v-text-field>

                    <v-textarea v-model="store.templates.new_game" label="New Game Template"></v-textarea>
                </v-form>
            </v-sheet>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/app';
import { ref } from 'vue';

const dialog = ref(false)
const store = useAppStore();
if (!store.keys) {
    store.keys = {
        openai: "",
        brainpet: ""
    }
}

const session = ref("")
let interval: any = null
const connectBrainPet = async () => {
    const response = await fetch("https://app.brain.pet/GetSession")
    session.value = await response.text()
    // Open a new tab with the BrainPet session
    window.open(`https://app.brain.pet/?session=${session.value}`)
    interval = setInterval(checkBrainPet, 1000)
    setTimeout(() => {
        clearInterval(interval)
    }, 1000 * 60 * 5)
}
const checkBrainPet = async () => {
    const url = "https://app.brain.pet/pollSession?session_id=" + session.value + "&psVersion=Aigami&pixelPetVersion=Aigami"
    const response = await fetch(url)
    if (response.status === 200) {
        const user = await response.json()
        store.keys.brainpet = user.token
        clearInterval(interval)
    }
}
</script>