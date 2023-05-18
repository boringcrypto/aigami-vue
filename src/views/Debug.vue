<template>
  <v-form class="mx-3 my-3">
    <v-text-field v-model="store.name" label="Player Name"></v-text-field>
    <v-text-field v-model="store.tags" label="Tags"></v-text-field>
    <v-text-field v-model="store.game_name" label="Game Name"></v-text-field>
    <v-textarea v-model="store.world" label="World"></v-textarea>
    <v-text-field v-model="store.artStyle" label="Art Style"></v-text-field>
    <h2>Locations</h2>
    <template v-for="location in store.locations">
      <v-text-field v-model="location.name" label="Location Name"></v-text-field>
      <v-row>
        <v-col cols="4">
          <v-img v-if="location.image" :src="'data:image/png;base64,' + location.image"></v-img>
        </v-col>
        <v-col cols="8">
          <v-textarea v-model="location.description" label="Location Description"></v-textarea>
          <v-textarea v-model="location.imagePrompt" label="Location Image Prompt"></v-textarea>
        </v-col>
      </v-row>
      <div class="ml-5">
        <h3>Characters in {{ location.name }}</h3>
        <template v-for="npc in location.npcs">
          <v-text-field v-model="npc.name" label="Character Name"></v-text-field>
          <v-row>
            <v-col cols="4">
              <v-img v-if="npc.image" :src="'data:image/png;base64,' + npc.image"></v-img>
            </v-col>
            <v-col cols="8">
              <v-textarea v-model="npc.description" label="Character Description"></v-textarea>
              <v-textarea v-model="npc.imagePrompt" label="Character Image Prompt"></v-textarea>
            </v-col>
          </v-row>
        </template>
      </div>
    </template>
    <h2>Inventory</h2>
    <template v-for="item in store.inventory">
      <v-text-field v-model="item.name" label="Item Name"></v-text-field>
      <v-row>
        <v-col cols="4">
          <v-img v-if="item.image" :src="'data:image/png;base64,' + item.image"></v-img>
        </v-col>
        <v-col cols="8">
          <v-textarea v-model="item.description" label="Item Description"></v-textarea>
          <v-textarea v-model="item.imagePrompt" label="Item Image Prompt"></v-textarea>
        </v-col>
      </v-row>
    </template>

  </v-form>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app';

const store = useAppStore();
</script>
