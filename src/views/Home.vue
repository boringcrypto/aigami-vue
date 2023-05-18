<template>
  <image-fetcher></image-fetcher>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-list density="compact">
          <v-list-subheader>Locations</v-list-subheader>

          <v-list-item
            v-for="(item, i) in store.locations"
            :key="i"
            :value="item"
            active-color="primary"
            @click="store.currentLocationIndex = i"
          >
            <template v-slot:prepend>
              <v-avatar color="surface-variant" :image="item.image ? 'data:image/png;base64,' + item.image : ''"></v-avatar>
            </template>

            <v-list-item-title v-text="item.name"></v-list-item-title>
            <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>
          </v-list-item> 
        </v-list>

        <v-list density="compact">
          <v-list-subheader>Characters</v-list-subheader>

          <v-list-item
            v-for="(item, i) in store.location.npcs"
            :key="i"
            :value="item"
            active-color="primary"
          >
            <template v-slot:prepend>
              <v-avatar color="surface-variant" :image="item.image ? 'data:image/png;base64,' + item.image : ''"></v-avatar>
            </template>

            <v-list-item-title v-text="item.name"></v-list-item-title>
            <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>
          </v-list-item> 
        </v-list>

        <v-list density="compact">
          <v-list-subheader>Inventory</v-list-subheader>

          <v-list-item
            v-for="(item, i) in store.inventory"
            :key="i"
            :value="item"
            active-color="primary"
          >
            <template v-slot:prepend>
              <v-avatar color="surface-variant" :image="item.image ? 'data:image/png;base64,' + item.image : ''"></v-avatar>
            </template>

            <v-list-item-title v-text="item.name"></v-list-item-title>
            <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>
          </v-list-item> 
        </v-list>
        {{ store.currencyAmount }} {{ store.currency }}
      </v-col>
      <v-col cols="8">
        <v-card
          class="mb-2"
          :title="store.location.name"
          :text="store.location.description"
        >
          <img v-if="store.location.image" :src="'data:image/png;base64,' + store.location.image" style="width: 100%" />
        </v-card>

        <v-container
          class="pa-0"
        >
          <v-row class="no-gutters elevation-4">
            <v-col
              cols="auto"
              class="flex-grow-1 flex-shrink-0"
            >
              <v-responsive
                class="overflow-y-scroll fill-height"
              >
                <v-card
                  flat
                  class="d-flex flex-column fill-height"
                >
                  <v-card-text class="flex-grow-1 overflow-y-auto">
                    <template v-for="(msg, i) in store.location.messages">
                      <div
                        :color="msg.role === ChatCompletionRequestMessageRoleEnum.User ? 'white' : 'grey'"
                        :style="'height:auto;white-space: normal;'
                          + (msg.role === ChatCompletionRequestMessageRoleEnum.User ? 'color: grey; text-align: right' : '')
                        "
                        class="mb-2"
                      >
                        {{ msg.content }}
                      </div>
                    </template>
                    <div style="height:auto;white-space: normal;" class="mb-2">
                      {{ incoming_message_response }}
                    </div>
                  </v-card-text>
                  <v-card-text class="flex-shrink-1">
                    <v-text-field
                      v-model="message"
                      type="text"
                      no-details
                      outlined
                      append-icon="mdi-send"
                      hide-details
                      @keyup.enter="sendMessage()"
                    />
                  </v-card-text>
                </v-card>
              </v-responsive>
            </v-col>
          </v-row>
        </v-container>

      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import ImageFetcher from '@/components/ImageFetcher.vue';
import { useAppStore } from '@/store/app';
import { get_chat } from '@/utils/chatgpt';
import json from '@/utils/json';
import { fillTemplate } from '@/utils/template';
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from 'openai';
import { computed } from 'vue';
import { ref } from 'vue';

const store = useAppStore();
const message = ref("")
const incoming_message = ref("")
let last_response = ""
const incoming_message_response = computed(() => {
  try { last_response = json.parse(incoming_message.value || "{}").response; return last_response } catch (e) {}
  try { last_response = json.parse(incoming_message.value + '}').response; return last_response } catch (e) {}
  try { last_response = json.parse(incoming_message.value + '"}').response; return last_response } catch (e) {}
  try { last_response = json.parse(incoming_message.value + '""}').response; return last_response } catch (e) {}
  try { last_response = json.parse(incoming_message.value + ': ""}').response; return last_response } catch (e) {}
  try { last_response = json.parse(incoming_message.value + '": ""}').response; return last_response } catch (e) {}
  try { last_response = json.parse(incoming_message.value + ']}').response; return last_response } catch (e) {}
  try { last_response = json.parse(incoming_message.value + '"]}').response; return last_response } catch (e) {}
  try { last_response = json.parse(incoming_message.value + '}]}').response; return last_response } catch (e) {}
  try { last_response = json.parse(incoming_message.value + '"}]}').response; return last_response } catch (e) {}
  try { last_response = json.parse(incoming_message.value + '""}]}').response; return last_response } catch (e) {}
  try { last_response = json.parse(incoming_message.value + ': ""}]}').response; return last_response } catch (e) {}
  try { last_response = json.parse(incoming_message.value + '": ""}]}').response; return last_response } catch (e) {}
  console.log("FAILED TO PARSE", incoming_message.value)
  return last_response
})
const sendMessage = async () => {
  const prompt = fillTemplate(store.templates.game_step_prompt, store, { message: message.value })
  const last_message = message.value
  message.value = ""

  if (!store.location.messages) {
    store.location.messages = []
  }

  const messages: ChatCompletionRequestMessage[] = [{
    role: ChatCompletionRequestMessageRoleEnum.System,
    content: "You're an experienced game designer and game master."
  }]
  
  if (store.location.messages) {
    messages.push(...store.location.messages)
  }

  messages.push({
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: prompt
  })

  let maxTries = 3
  let success = false
  while (!success && maxTries > 0) {
    try {
      await get_chat(messages, incoming_message)
      console.log("response", incoming_message.value)
      const response = json.parse(incoming_message.value || "{}")
      if (response.response) {
        // TODO: Add checks that things look ok

        if (response.new_locations) {
          store.locations.push(...response.new_locations.filter((location: any) => {
            return !store.locations.find((l: any) => l.name === location.name)
          }))
        }

        if (response.inventory) {
          store.inventory = response.inventory
        }

        store.location.messages.push({
          content: last_message,
          role: ChatCompletionRequestMessageRoleEnum.User
        })

        store.location.messages.push({
          content: response.response,
          role: ChatCompletionRequestMessageRoleEnum.Assistant
        })

        if (response.current_location_name) {
          const new_location = store.locations.find((l: any) => l.name === response.current_location_name)
          if (new_location) {
            store.currentLocationIndex = store.locations.indexOf(new_location)
          }
        }

        console.log(store.location.messages, store)

        success = true
      }
    } catch (e) {
      console.log(e)
    }
    incoming_message.value = ""
    maxTries--
  }

  if (!success) {
    message.value = last_message
  }
}
</script>
