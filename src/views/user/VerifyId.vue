<template>
  <div style="padding: 0 50px">
  </div>
</template>

<script>

export default {
  name: 'VerifyId',
  mounted() {
    const { verifyId } = this.$route.params;
    this.$axios.get(`/user/verify/${verifyId}/`).then(() => {
      this.$notification.open({
        message: 'Verify Success',
        description: 'Verify success.We weill redirect you.',
      });
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000);
    }).catch(() => {
      this.$notification.open({
        message: 'Verify Error',
        description: 'Not found',
      });
    });
  },
};
</script>
