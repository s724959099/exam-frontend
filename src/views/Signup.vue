<template>
  <div style="padding: 0 50px">
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }"
            @submit="handleSubmit">
      <a-form-item label="Email"
                   :validate-status="emailError() ? 'error' : ''" :help="emailError() || ''"
      >
        <a-input
          v-decorator="
          ['email', { rules: [
            { required: true, message: 'Please input your email!' },
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            ] }]"
        />
      </a-form-item>
      <a-form-item label="Password"
                   :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''"
      >
        <a-input
          v-decorator="
          ['password', { rules: [
            { required: true, message: 'Please input your password' },
            {
              validator: validatePassword,
            },
            ] }]"
          type="password"
        />
      </a-form-item>
      <a-form-item label="Password Again"
                   :validate-status="passwordAgainError() ? 'error' : ''"
                   :help="passwordAgainError() || ''"
      >
        <a-input
          v-decorator="
          ['passwordAgain', { rules: [
            { required: true, message: 'Please input your email!' },
            {
              validator: compareToFirstPassword,
            },
            ] }]"
          type="password"
        />
      </a-form-item>
      <a-form-item label="Name" :validate-status="userNameError() ? 'error' : ''"
                   :help="userNameError() || ''">
        <a-input
          v-decorator="
          ['userName', { rules: [{ required: true, message: 'Please input your username!' }] }]"
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit"
        >
          Sign up
        </a-button>
      </a-form-item>
    </a-form>
    <div>Or</div>
    <div>
      <a :href="GOOGLE_LOGIN">Google</a>
    </div>
    <div>
      <a :href="FACEBOOK_LOGIN">Facebook</a>
    </div>
  </div>
</template>

<script>
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
}

export default {
  name: 'Signup',
  data() {
    const BASE_API = process.env.VUE_APP_API_URL;
    const FACEBOOK_LOGIN = `${BASE_API}auth/login/facebook/`;
    const GOOGLE_LOGIN = `${BASE_API}auth/login/google/`;
    return {
      FACEBOOK_LOGIN,
      GOOGLE_LOGIN,
      hasErrors,
      form: this.$form.createForm(this, { name: 'signup' }),
    };
  },
  methods: {
    validateField(fieldName) {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched(fieldName) && getFieldError(fieldName);
    },
    userNameError() {
      return this.validateField('userName');
    },
    emailError() {
      return this.validateField('email');
    },
    passwordError() {
      return this.validateField('password');
    },
    passwordAgainError() {
      return this.validateField('passwordAgain');
    },
    compareToFirstPassword(rule, value, callback) {
      const { form } = this;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    },
    validatePassword(rule, value, callback) {
      if (!value) {
        callback();
        return;
      }
      if (!/[a-z]/.test(value)) {
        callback('Contains at least one lower character');
      } else if (!/[A-Z]/.test(value)) {
        callback('Contains at least one upper character');
      } else if (!/[0-9]/.test(value)) {
        callback('Contains at least one digit character');
      } else if (!/[^\w\s]/.test(value)) {
        callback('Contains at least one special character');
      } else if (!/.{8,}/.test(value)) {
        callback('Contains at least 8 characters');
      } else {
        callback();
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$axios.post('/user/signup/', {
            email: values.email,
            password: values.password,
            name: values.userName,
          }).then((res) => {
            console.log(res.data);
          }).catch((err_) => {
            const msgs = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const el of err_.response.data.detail.errors) {
              msgs.push(el.msg);
            }
            this.$notification.open({
              message: 'Sign Up Error',
              description: msgs.join('\n'),
            });
          });
        }
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      // To disabled submit button at the beginning.
      this.form.validateFields();
    });
  },
};
</script>
