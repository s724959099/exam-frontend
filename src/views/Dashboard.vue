<template>
  <div style="padding: 0 50px">
    <a-button @click="logout">Logout</a-button>
    <div>
      Name: {{ user.name }}
    </div>
    <div>
      Email: {{ user.email }}
    </div>
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
    logout() {
      this.$ls.remove('access_token');
      this.$ls.remove('refresh_token');
      window.location.href = '/';
    },
  },
  mounted() {
    this.$axios.get('/user/profile/').then((res) => {
      this.user = res.data;
    });
  },
};
</script>
