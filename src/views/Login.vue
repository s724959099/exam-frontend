<template>
  <div style="padding: 0 50px">
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }"
            @submit="handleSubmit">
      <a-form-item label="Email"
      >
        <a-input
          v-decorator="
          ['email', { rules: [
            { required: true, message: 'Please input your email!' },
          ] }]"
        />
      </a-form-item>
      <a-form-item label="Password"
      >
        <a-input
          v-decorator="
          ['password', { rules: [
            { required: true, message: 'Please input your password' },
            ] }]"
          type="password"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">
          Login
        </a-button>
      </a-form-item>
    </a-form>
    <!--    todo-->
    <!--    <a-button @click="callLogin">login</a-button>-->
    <a-button @click="callProtected">protect</a-button>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      form: this.$form.createForm(this, { name: 'login' }),
    };
  },
  methods: {
    validateField(fieldName) {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched(fieldName) && getFieldError(fieldName);
    },
    emailError() {
      return this.validateField('email');
    },
    passwordError() {
      return this.validateField('password');
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$axios.post('/auth/login/', values).then((res) => {
            this.$ls.set('access_token', res.data.access_token);
            this.$ls.set('refresh_token', res.data.refresh_token);
          }).catch((err_) => {
            this.$notification.open({
              message: 'Login Error',
              description: err_.response.data.detail,
            });
          });
        }
      });
    },
    callProtected() {
      this.$axios.get('/auth/demo/').then((res) => {
        console.log('protected:', res);
      });
    },
  },
};
</script>
