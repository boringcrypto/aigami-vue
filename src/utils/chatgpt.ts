import { useAppStore } from "@/store/app";
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";

let openai: OpenAIApi;

export async function get_chat(messages: ChatCompletionRequestMessage[]): Promise<string> {
  const store = useAppStore();
  console.log(store.keys.openai)
  const configuration = new Configuration({
    apiKey: store.keys.openai,
  });
  openai = new OpenAIApi(configuration);

  console.log(messages)
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages
  });

  console.log(completion)

  return completion.data.choices[0].message?.content || "";
}

export async function get_response(message: string): Promise<string> {
  return await get_chat([
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: "You are a kind and helpful assistant"
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: message
    }
  ])
}

export default {
  install() {
  },
  get_chat,
  get_response
}

