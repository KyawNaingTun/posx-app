<template>
  <q-layout view="hHh LpR fFf">

    <q-header elevated class="bg-black text-white">
      <q-toolbar>
        <q-toolbar-title>
          POSX <small class="text-weight-lighter text-sm">Restaurant</small>
        </q-toolbar-title>
        <q-btn :to="{ name: 'login' }" v-if="!currentUser" outline rounded color="white" label="Login" />
        <q-btn-dropdown
          outline
          v-else
          color="white"
          icon="person"
        >
          <q-list>
            <q-item clickable>
              <q-item-section>
                <q-item-label @click.prevent="logout">Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <!-- <q-drawer v-model="left" side="left" bordered>
      <h3>table lists here</h3>
    </q-drawer> -->

    <q-drawer v-model="rightDrawerMenuShow" @hide="hideRightDrawer()" :width="dishDrawerWidth" side="right" content-class="bg-black text-white" dark>
      <dish-tab-panel v-show="rightDrawerView === 'product-menu'"></dish-tab-panel>
      <cart-item-detail v-show="rightDrawerView === 'cart-item-detail'"></cart-item-detail>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { mapState, mapGetters } from 'vuex'
import DishTabPanel from '../components/DishTabPanel.vue'
import CartItemDetail from '../components/CartItemDetail'

export default {
  components: {
    DishTabPanel,
    CartItemDetail
  },
  data () {
    return {
      currentRouteName: null,
      left: false,
      menuBtn: true
    }
  },
  created () {
    this.right = false
  },
  watch: {
    '$route' (to, from) {
      this.right = to.name !== 'table'
    }
  },
  computed: {
    ...mapState({
      rightDrawerView: state => state.app.rightDrawerView
    }),
    ...mapGetters('auth', {
      currentUser: 'currentUser'
    }),
    rightDrawerMenuShow: {
      set (status) {
        this.$store.dispatch('app/setRightDrawerMenu', status)
      },
      get () {
        return this.$store.state.app.rightDrawerMenuShow
      }
    },
    dishDrawerWidth () {
      return this.$q.screen.lt.md
        ? 300
        : 450
    }
  },
  methods: {
    openURL,
    logout () {
      this.$store.commit('auth/logout')
      this.$store.dispatch('app/resetState')
      this.$store.dispatch('cart/resetState')
      this.$store.dispatch('product/resetState')
      this.$router.push('/login')
    },
    routeTo (routeName) {
      this.$router.push(routeName)
    },
    hideRightDrawer () {
      this.$store.dispatch('app/changeRightDrawerView', 'product-menu')
      this.$store.dispatch('cart/updateCarItemHoverIndex', null)
    }
  }
}
</script>
