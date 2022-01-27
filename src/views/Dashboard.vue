<template>
  <div style="padding: 0 50px" v-if="!loading">
    <a-button @click="logout">Logout</a-button>
    <div>
      Name: {{ user.name }}
    </div>
    <div>
      Email: {{ user.email }}
    </div>
    <div>
      Signup time: {{ user.created_at }}
    </div>
    <div>
      Last login: {{ user.last_login_time }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  data() {
    return {
      user: {},
      loading: true,
    };
  },
  methods: {
    logout() {
      this.$axios.delete('/auth/logout/').then(() => {
        window.location.href = '/';
      });
    },
  },
  mounted() {
    this.$axios.get('/user/profile/').then((res) => {
      this.user = res.data;
      this.loading = false;
    });
  },
};
</script>
