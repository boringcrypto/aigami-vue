import { useAppStore } from "@/store/app";
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, CreateChatCompletionResponse, CreateCompletionResponse, OpenAIApi } from "openai";
import { Ref } from "vue";
import { AxiosResponse } from "axios";
import { OpenAIExt } from "openai-ext";

let openai: OpenAIApi;

export async function get_chat(messages: ChatCompletionRequestMessage[], response: Ref<string>) {
  const store = useAppStore();
  console.log(store.keys.openai)
  const configuration = new Configuration({
    apiKey: store.keys.openai,
  });
  openai = new OpenAIApi(configuration);

  console.log(messages)

  // Configure the stream (use type ClientStreamChatCompletionConfig for TypeScript users)
  const streamConfig = {
    apiKey: store.keys.openai,
    handler: {
      // Content contains the string draft, which may be partial. When isFinal is true, the completion is done.
      onContent(content: string) {
        response.value = content;
      },
      onDone() {
        console.log("Done!");
      },
      onError(error: Error, status: number) {
        console.error(error, status);
      },
    },
  };

  // Make the call and store a reference to the XMLHttpRequest
  const xhr = OpenAIExt.streamClientChatCompletion(
    {
      model: "gpt-3.5-turbo",
      messages: messages
    },
    streamConfig
  );

  while (xhr.readyState !== XMLHttpRequest.DONE) {
    // Do something while waiting for the stream to complete
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

export async function get_response(message: string, response: Ref<string>) {
  await get_chat([
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: "You are a kind and helpful assistant"
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: message
    }
  ], response)
}

export default {
  install() {
  },
  get_chat,
  get_response
}

