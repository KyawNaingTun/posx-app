<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          POS
        </q-toolbar-title>

        <q-btn :to="{ name: 'dashboard' }" v-show="currentUser" outline rounded color="white" label="Dashboard" />
        <q-btn :to="{ name: 'login' }" v-if="!currentUser" outline rounded color="white" label="Login" />
        <q-btn-dropdown
          v-else
          class="glossy"
          color="purple"
          label="Account Settings"
        >
          <div class="row no-wrap q-pa-md">
            <div class="column items-center">
              <q-avatar size="72px">
                <img src="https://cdn.quasar-framework.org/img/boy-avatar.png">
              </q-avatar>

              <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

              <q-btn
                @click.prevent="logout"
                color="primary"
                label="Logout"
                push
                size="sm"
              />
            </div>
          </div>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated="">
      <q-tabs
        dense
        indicator-color="transparent"
        active-color="blue"
        class="bg-grey-light text-grey"
      >
        <q-route-tab :to="{ name: 'table' }" name="mails" icon="view_module" label="tables" />
        <!-- <q-route-tab name="alarms" icon="alarm" label="Alarms" />
        <q-route-tab name="movies" icon="movie" label="Movies" /> -->
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { mapGetters } from 'vuex'
export default {
  name: 'Main',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      rDrawer: false
    }
  },
  computed: {
    ...mapGetters('auth', {
      currentUser: 'currentUser'
    })
  },
  methods: {
    openURL,
    logout () {
      this.$store.commit('auth/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style>
</style>
