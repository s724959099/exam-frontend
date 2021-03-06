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
      Signup time: {{ user.created_at ? user.created_at.replace('T', ' ').split('.')[0] : '' }}
    </div>
    <div>
      Last login:
      {{ user.last_login_time ? user.last_login_time.replace('T', ' ').split('.')[0] : '' }}
    </div>
    <a-divider/>
    <a-form :form="formUpdateUser" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }"
            @submit="submitUpdateName">
      <a-form-item label="Name"
      >
        <a-input
          v-decorator="
          ['name', { rules: [
            { required: true, message: 'Please update name' },
            ] }]"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit"
        >
          Update
        </a-button>
      </a-form-item>
    </a-form>
    <a-divider/>
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }"
            @submit="handleSubmit">
      <a-form-item label="Old Password"
      >
        <a-input
          v-decorator="
          ['oldPassword', { rules: [
            { required: true, message: 'Please input your password' },
            {
              validator: validatePassword,
            },
            ] }]"
          type="password"
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

      <a-form-item>
        <a-button type="primary" html-type="submit"
        >
          Reset Password
        </a-button>
      </a-form-item>
    </a-form>
    <a-divider/>
    <h2>Statistics</h2>
    <div>
      Sign up count: {{ statistics.sign_up_count }}
    </div>
    <div>
      Today active count: {{ statistics.today_active_count }}
    </div>
    <div>
      Last 7 days average: {{ statistics.last_7days_active_avg }}
    </div>
    <a-divider/>
    <a-table :columns="columns" :dataSource="items"
             :loading="loading"
             :pagination="pagination"
             @change="handleChangePage"
             :rowKey="record => record.id"
    >
      <div slot="register_from" slot-scope="text">
        {{ text === 1 ? 'web' : text === 2 ? 'facebook' : text === 3 ? 'google' : 'unknow' }}
      </div>
      <div slot="verify" slot-scope="text">
        <a-badge :status="text?'success':'error'"/>
      </div>
      <div slot="created_at" slot-scope="text">
        {{ text.replace('T', ' ').split('.')[0] }}
      </div>
      <div slot="last_login_time" slot-scope="text">
        {{ text.replace('T', ' ').split('.')[0] }}
      </div>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'From',
    dataIndex: 'register_from',
    scopedSlots: { customRender: 'register_from' },
  },
  {
    title: 'Verify',
    dataIndex: 'verify',
    scopedSlots: { customRender: 'verify' },
  },
  {
    title: 'Login count',
    dataIndex: 'login_count',
  },
  {
    title: 'Last login time',
    dataIndex: 'last_login_time',
    scopedSlots: { customRender: 'last_login_time' },
  },
  {
    title: 'Sign up time',
    dataIndex: 'created_at',
    scopedSlots: { customRender: 'created_at' },
  },
];
export default {
  name: 'Dashboard',
  data() {
    return {
      columns,
      items: [],
      params: {
        limit: 5,
        offset: 0,
      },
      user: {},
      statistics: {},
      loading: true,
      form: this.$form.createForm(this, { name: 'resetPassword' }),
      formUpdateUser: this.$form.createForm(this, { name: 'updateUser' }),
    };
  },
  computed: {
    pagination() {
      return {
        current: (this.params.offset / this.params.limit) + 1,
        pageSize: this.params.limit,
        total: this.raw_data ? this.raw_data.count : 0,
      };
    },
  },
  methods: {
    handleChangePage(pagination) {
      this.params.offset = (pagination.current - 1) * this.params.limit;
      this.initData();
    },
    getParams() {
      return this.params;
    },
    initData() {
      this.loading = true;
      // store action get data
      this.$axios.get('/user/', this.getParams()).then((res) => {
        this.loading = false;
        this.items = res.data.data;
      });
    },
    logout() {
      this.$axios.delete('/auth/logout/').then(() => {
        window.location.href = '/';
      });
    },
    validateField(fieldName) {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched(fieldName) && getFieldError(fieldName);
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
          this.$axios.post('/user/reset-password/', {
            old_password: values.oldPassword,
            new_password: values.password,
          }).then((res) => {
            console.log(res.data);
          }).catch((err_) => {
            this.$notification.open({
              message: 'Reset password error',
              description: err_.response.data.detail,
            });
          });
        }
      });
    },
    submitUpdateName(e) {
      e.preventDefault();
      this.formUpdateUser.validateFields((err, values) => {
        if (!err) {
          this.$axios.put('/user/', {
            name: values.name,
          }).then(() => {
            window.location.reload();
          }).catch((err_) => {
            this.$notification.open({
              message: 'Update error',
              description: err_.response.data.detail,
            });
          });
        }
      });
    },
  },
  mounted() {
    this.$axios.get('/user/profile/').then((res) => {
      this.user = res.data;
      this.loading = false;
    });
    this.$axios.get('/user/statistics/').then((res) => {
      this.statistics = res.data;
      this.loading = false;
    });
    this.initData();
  },
};
</script>
