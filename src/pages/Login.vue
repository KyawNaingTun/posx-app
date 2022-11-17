<template>
  <q-layout class="bg-light">
    <q-page-container>
      <q-page :style-fn="myTweak" class="">
        <div class="fixed-center" style="min-width:350px">
          <h3 class="text-h3 text-center text-weight-bolder q-mb-lg">Login</h3>
          <form @submit.prevent.stop="authenticate">
            <q-input ref="username" outlined v-model="formLogin.username" label="Username" :rules="[val => !!val || 'Field is required']"/>
            <q-input ref="password" outlined v-model="formLogin.password" :type="isPwd ? 'password' : 'text'" hint="Password" :rules="[val => !!val || 'Field is required']">
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <div class="text-center q-mt-lg">
              <q-btn type="submit" filled color="primary" label="Login" />
            </div>
          </form>
        </div>
        <div class="absolute pin-t pin-r">
          <q-btn flat round :size="'lg'" color="primary" @click="settingDialog = true"  icon="settings" />
        </div>

        <q-dialog v-model="settingDialog" :content-class="fontClass">
          <q-card style="width: 100%">
            <q-card-section>
              <div class="text-h6">ဆာဗာလိပ်စာကိုဖြည့်စွက်ပါ</div>
            </q-card-section>

            <q-card-section>
              <q-input dense v-model="serverApiUrl" autofocus @keyup.enter="prompt = false" />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn @click="setServerApiUrl(serverApiUrl)" fill color="green" label="ထည့်မည်" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
// outside of the default export,
// we need to listen to the event for ourselves:
document.addEventListener('deviceready', () => {
  // it's only now that we are sure
  // the event has triggered
  console.log('deviceReady')
}, false)
import AuthApi from '../api/AuthApi.js'
import { mapState, mapGetters } from 'vuex'
// import { axiosInstance } from 'boot/axios'
// import axios from 'axios'

export default {
  name: 'LoginPage',
  data () {
    return {
      isPwd: true,
      formLogin: {
        username: '',
        password: ''
      },
      error: null,
      settingDialog: false,
      serverApiUrl: this.$q.localStorage.getItem('serverApiUrl'),
      selectedPrinter: {
        portName: 'TCP:192.168.1.4',
        macAddress: '00:11:62:08:21:a5',
        modelName: 'BSC10 (ESP-001)'
      }
    }
  },
  computed: {
    ...mapState({
      fontClass: state => state.app.fontClass
    }),
    ...mapGetters('auth', {
      authError: 'authError',
      registeredUser: 'registeredUser'
    })
  },
  created () {
    // this.discoverPrinter()
  },
  methods: {
    discoverPrinter () {
      window.starprnt.portDiscovery('All', function (result) {
        console.log(result)
      },
      function (error) {
        console.log(error)
      })
    },
    myTweak (offset) {
      // "offset" is a Number (pixels) that refers to the total
      // height of header + footer that occupies on screen,
      // based on the QLayout "view" prop configuration

      // this is actually what the default style-fn does in Quasar
      return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' }
    },
    setServerApiUrl (url) {
      // eslint-disable-next-line no-unused-vars
      // var rasterObj = {
      //   text: '        မြန်ကန်သာ\n' +
      //   '             123 Star Road\n' +
      //   '           City, State 12345\n' +
      //   '\n' +
      //   'Date:MM/DD/YYYY          Time:HH:MM PM\n' +
      //   '--------------------------------------\n' +
      //   'SALE\n' +
      //   'SKU            Description       Total\n' +
      //   '300678566      PLAIN T-SHIRT     10.99\n' +
      //   '300692003      BLACK DENIM       29.99\n' +
      //   '300651148      BLUE DENIM        29.99\n' +
      //   '300642980      STRIPED DRESS     49.99\n' +
      //   '30063847       BLACK BOOTS       35.99\n' +
      //   '\n' +
      //   'Subtotal                        156.95\n' +
      //   'Tax                               0.00\n' +
      //   '--------------------------------------\n' +
      //   'Total                          $156.95\n' +
      //   '--------------------------------------\n' +
      //   '\n' +
      //   'Charge\n' +
      //   '156.95\n' +
      //   'Visa XXXX-XXXX-XXXX-0123\n' +
      //   'Refunds and Exchanges\n' +
      //   'Within 30 days with receipt\n' +
      //   'And tags attached\n',
      //   fontSize: 25, // Defaults to 25
      //   paperWidth: 576, // options: 384 = 2", 576 = 3", 832 = 4"
      //   cutReceipt: true, // Defaults to true
      //   openCashDrawer: true // Defaults to true
      // }

      // window.starprnt.printRasterReceipt('TCP:192.168.1.4', 'EscPos', rasterObj, function (result) {
      //   console.log(result)
      // },
      // function (error) {
      //   console.log(error)
      // })
      this.$q.localStorage.set('serverApiUrl', url)
      this.settingDialog = false

      // axios.defaults.baseUrl = url
      // axiosInstance.defaults.baseUrl = url
      // console.log('axios', axios.defaults.baseUrl)
      window.location.reload()
    },
    authenticate () {
      // clear validation message
      this.$refs.username.validate()
      this.$refs.password.validate()

      if (this.$refs.username.hasError || this.$refs.password.hasError) {
        this.formHasError = true
      } else {
        // dispatch store action
        this.$store.dispatch('auth/login')
        // call api
        AuthApi.login(this.$data.formLogin)
          .then(response => {
            // commit store mutation
            this.$store.commit('auth/loginSuccess', response)
            // console.log('auth response', response)
            window.location.reload()
            this.$router.push({
              path: '/'
            })
          })
          .catch(error => {
            // show notification
            this.$q.notify({
              icon: 'notifications',
              message: 'Something went wrong!',
              color: 'red'
            })
            // commit store mutation
            this.$store.commit('auth/loginFailed', {
              error
            })
          })
      }
    }
  }
}

</script>

<style scoped>
  .error {
    text-align: center;
    color: red;
  }

</style>
