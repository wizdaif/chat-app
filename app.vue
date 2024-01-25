<script setup lang="ts">
const chats = ref([
  {
    name: 'jayyyz',
    message: 'Yo',
    timestamp: 0,
  },
  {
    name: 'j2',
    message: 'wsp',
    timestamp: 1,
  }
])

const input = ref("")

function messageSubmit() {
  console.log(input.value)

  if (input.value.length > 24) {
    alert('Only 24 Characters')

    input.value = ""
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

    <div class="chat-area">
      <div class="chat-box">
        <div class="messages">
          <div v-for="chat of chats">
            <p>
              {{ chat.name }}: {{ chat.message  }}
            </p>
          </div>
        </div>
      </div>
      <form class="chat-input" @submit.stop.prevent="messageSubmit">
        <input type="text" placeholder="Enter a message" :value="input" @change="e => input = e.target!.value" />
        <button @click="messageSubmit"></button>
      </form>
    </div>
  </div>
</template>
