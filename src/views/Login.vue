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
      <div>Or</div>
      <div>
        <a :href="GOOGLE_LOGIN">Google</a>
      </div>
      <div>
        <a :href="FACEBOOK_LOGIN">Facebook</a>
      </div>
    </a-form>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    const BASE_API = process.env.VUE_APP_API_URL;
    const FACEBOOK_LOGIN = `${BASE_API}auth/login/facebook/`;
    const GOOGLE_LOGIN = `${BASE_API}auth/login/google/`;
    return {
      FACEBOOK_LOGIN,
      GOOGLE_LOGIN,
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
          this.$axios.post('/auth/login/', values).then(() => {
            this.$router.push('/dashboard');
          }).catch((err_) => {
            this.$notification.open({
              message: 'Login Error',
              description: err_.response.data.detail,
            });
          });
        }
      });
    },
  },
};
</script>
