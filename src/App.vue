<template>
  <a-layout id="app">
    <a-layout-header class="a-header">
      <span>version: {{ version }}</span>
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
    return {
      version: process.env.TAG,
    };
  },
  computed: {},
};
</script>
<style scoped>

.a-header {
  color: white;
}
</style>
