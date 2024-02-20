<script setup lang="ts">
import { useSocket } from "./lib/utils";

const toast = useToast()

interface Chat {
  name: string;
  content: string;
  system: boolean;
  timestamp: number;
}
const username = ref("")
const usernameTemp = ref("")
const input = ref("")

const io = useSocket();

const { data: { value: messages }, refresh: refreshMessages } = useFetch("/api/messages")

const chats = ref([]) as Ref<Chat[]>

console.log(messages)

const { user, updateName } = useUser();

io.once('username_accept', () => username.value = user.value!.name);

io.on('message', (m) => {
  chats.value.push(m);
})

io.on('join', (m) => {
  chats.value.push(m)
})

function messageSubmit() {
  if (input.value.length > 24) {
    toast.add({
      'description': 'Only 24 Characters'
    })

    input.value = ""

    return;
  } else if (input.value.length > 0 && input.value.length < 25) {
    // chats.value.push({
    //   name: username.value,
    //   message: input.value,
    //   timestamp: Date.now()
    // })
    
    // useSend(input.value);

    io.emit('message', input.value);

    input.value = ""
  }
}

function usernameSubmit() {
  if (usernameTemp.value.length > 12) {
    toast.add({
      'description': 'Username can only be 12 Characters or less'
    })

    usernameTemp.value = ""
  } else {
    // username.value = usernameTemp.value;

    refreshMessages()

    user.value.name = usernameTemp.value as any;
    io.emit('join', user.value);
  }
}
</script>

<style lang="css">
  body {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #181818;
  }

  .web-title {
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .chat-area {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
  }

  .welcome {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
  }

  .system {
    color: gray;
  }

  .welcome input[type="text"] {
    height: 2rem;
    width: 15rem;
    color: dimgray;
  }

  .chat-input {
    display: flex;
    float: bottom;
    margin-top: 30%;
    bottom: 0;
    margin-bottom: 0;
  }

  .chat-input input[type="text"] {
    height: 2rem;
    width: 15rem;
    color: dimgray;
  }

  .chat-input button {
    width: 2.5rem;
  }
</style>

<template>
  <div class="container">
    <h1 class="web-title">(e2e) chat</h1>

    <div class="chat-area" v-if="username.length > 0">
      <div class="chat-box">
        <div class="messages">
          <div v-for="chat of chats" v-bind:key="chat.timestamp">
            <p v-if="chat.system !== true">
              {{ chat.name }}: {{ chat.content }}
            </p>

            <p v-if="chat.system === true" class="system message">
              System: {{ chat.content }}
            </p>
          </div>

          <p v-if="chats.length == 0">No messages yet...</p>
        </div>
      </div>
      <form class="chat-input" @submit.stop.prevent="messageSubmit">
        <input type="text" placeholder="Enter a message" :value="input" @change="e => input = e.target!.value" />
        <button @click="messageSubmit"></button>
      </form>
    </div>

    <div class="welcome" v-if="!(username.length > 0)">
      <h1>Welcome!</h1>
      <form @submit.stop.prevent="usernameSubmit">
        <p>Please enter a username to use: <input type="text" placeholder="e.g. j2" :value="usernameTemp" @change="e => usernameTemp = e.target!.value" /> </p>
        <p>You can click enter to automatically submit your username!</p>
      </form>
    </div>
  </div>
  
  <UNotifications />
</template>
