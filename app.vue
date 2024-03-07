<script setup lang="ts">
import { useSocket } from "./lib/utils";
import { useEventListener } from '@vueuse/core'

const toast = useToast()

interface Chat {
  name: string;
  content: string;
  system: boolean;
  timestamp: number;
}

const input = ref("")
const username = ref("")
const usernameTemp = ref("")

const bottomOfChatRef = ref(null);

const io = useSocket();

const { data: { value: u2 }, refresh: refreshUsers  } = useFetch('/api/online');
const { data: { value: messages }, refresh: refreshMessages } = useFetch("/api/messages")

const users = ref([...new Set(u2?.users)]) as unknown as Ref<string[]>;
const chats = ref(messages?.messages) as unknown as Ref<Chat[]>

const { user } = useUser();

io.on('username_accept', () => {
  username.value = user.value!.name
  if (!users.value.some(u=>u === username.value)) users.value.push(username.value);
});

io.on('message', (m) => {
  chats.value.push(m);

  (bottomOfChatRef.value as any)?.scrollIntoView({ behavior: "smooth" })
})

io.on('join', (m) => {
  chats.value.push(m)
})

io.on('get_users', (us: string[]) => {
  users.value = [...new Set(...us, ...users.value)]
})

io.on('new_user', (m) => {
  if (m !== usernameTemp.value) users.value.push(m)
});

onMounted(() => {
  io.emit('get_messages')
  // setInterval(() => refreshUsers(), 30000);
  // setInterval(() => io.emit('get_users'), 5000);
  setInterval(() => io.emit('check_whats_up', (user.value as any).id), 5000);
  useEventListener(window, 'beforeunload', () => io.disconnect()); // this not working rn, but init disconnect when page closes
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

    io.emit('message', { content: input.value, id: (user.value as any)!.id });

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

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  
  .web-title {
    color: white;
    display: flex;
    align-items: center;
    font-weight: 900;
    /* justify-content: center; */
    /* text-align: center; */
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
  <img src="/lelouch2.jpg" class="h-screen w-screen absolute" />

  <div class="container w-screen h-screen z-10 absolute p-10 left-0 m-auto ml-0">
    <h1 class="web-title">(e2e) chat</h1>

    <div class="flex right-0 items-center space-y-5">
      <div class="flex flex-col space-y-5">
        <div class="chat-area bg-slate-950 rounded-xl p-5" v-if="username.length > 0">
          <div class="chat-box w-full h-full">
            <ul class="messages overflow-y-scroll h-[600px] no-scrollbar -mb-16">
              <li v-for="chat of chats" v-bind:key="chat.timestamp">
                <p v-if="chat.system !== true && chat.name !== username" class="text-slate-400 font-medium text-left">
                  {{ chat.name }}: {{ chat.content }}
                </p>

                <p v-if="chat.system !== true && chat.name === username" class="text-slate-200 font-semibold text-left">
                  {{ chat.name }}: {{ chat.content }}
                </p>

                <p v-if="chat.system === true" class="system message text-center italic">
                  System: {{ chat.content }}
                </p>
              </li>

              <span ref="bottomOfChatRef"></span>

              <li v-if="chats.length == 0">No messages yet...</li>
            </ul>
          </div>
          <form class="chat-input space-x-2 -mt-10 pt-0" @submit.stop.prevent="messageSubmit">
            <input type="text" placeholder="Enter a message" class="px-2 rounded-md" :value="input" @change="e => input = e.target!.value" />
            <button @click="messageSubmit" class="bg-green-500 rounded-md">></button>
          </form>
        </div>

        <ul class="users-online h-fit w-full bg-gray-950 rounded-md" v-if="username.length > 0">
          <p class="text-white">{{ users.length.toLocaleString() }} {{ users.length > 1 ? 'users' : 'user' }} online</p>
          <li v-for="user of users" v-bind:key="user">
            <p class="text-green-200">{{ user }}</p>
          </li>
        </ul>
      </div>
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
