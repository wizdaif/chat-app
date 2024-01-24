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
</script>

<template>
  <div class="container">
    <h1 class="web-title">(e2e) chat</h1>

    <div class="chat-area">
      <div class="chat-box">
        <ul class="messages">
          <li v-for="chat of chats">
            <p>
              {{ chat.message  }}
            </p>
          </li>
        </ul>
      </div>
      <div class="chat-input">
        <input type="text" placeholder="Enter a message" />
        <button>></button>
      </div>
    </div>
  </div>
</template>
