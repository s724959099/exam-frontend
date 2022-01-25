<template>
  <a-layout id="app">
    <a-layout-header class="a-header">
      <a href="/login">Login</a>
      <a href="/signup" style="margin-left: 50px">Sign Up</a>
    </a-layout-header>
    <a-layout-content>
      <router-view/>
    </a-layout-content>
    <a-layout-footer>Footer</a-layout-footer>
  </a-layout>

</template>

<script>

export default {
  data() {
    return {};
  },
  computed: {},
};
</script>
<style scoped>
#app {
  height: 100%;
}

.a-header {
  color: white;
}
</style>
