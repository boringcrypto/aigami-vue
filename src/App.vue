<template>
  <v-app>
    <v-app-bar
      color="primary"
      prominent
    >
      <v-toolbar-title>Aigami - {{ store.game_name }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn prepend-icon="mdi-restart">
        New Game
        <NewGame />
      </v-btn>
      <v-btn prepend-icon="mdi-cog">
        Settings
        <Settings />
      </v-btn>
    </v-app-bar>
    <v-main>
      <Home />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Home from './views/Home.vue';
import NewGame from './components/NewGame.vue';
import Settings from './components/Settings.vue';
import { useAppStore } from './store/app';
import json from '@/utils/json'

const store = useAppStore();

const game = localStorage.getItem("game")
if (game) {
  try {
    store.$state = JSON.parse(game)
  } catch (e) {
    console.error("Error loading game", e)
  }
}

store.$subscribe((mutation, state) => {
  console.log("state", state);

  localStorage.setItem("game", JSON.stringify(store.$state))
});

</script>
