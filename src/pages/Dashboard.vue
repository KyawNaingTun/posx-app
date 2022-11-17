<template>
  <div class="container">
    <p>Hello Dashboard</p>
    <h1>Hallo {{ currentUser.name }} . . . welcome to your work space.</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'DashboardPage',
  computed: {
    ...mapGetters('auth', {
      currentUser: 'currentUser'
    })
  }
}
</script>
