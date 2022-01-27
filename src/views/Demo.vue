<template>
  <div style="padding: 0 50px">
    <a-button @click="login">Login</a-button>
    <a-button @click="protect">Protect</a-button>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  data() {
    return {
      user: {},
    };
  },
  methods: {
    login() {
      this.$axios.post('/login', {
        username: 'test',
        password: 'test',
      }).then((res) => {
        console.log(res);
      });
    },
    protect() {
      this.$axios.post('/protected').then((res) => {
        console.log(res);
      });
    },
  },
  mounted() {
  },
};
</script>
