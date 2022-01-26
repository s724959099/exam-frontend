<template>
  <div style="padding: 0 50px">
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
  mounted() {
    this.$axios.get('/user/profile').then((res) => {
      this.user = res.data;
    });
  },
};
</script>
