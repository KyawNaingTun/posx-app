<template>
  <q-layout class="bg-grey-10">
    <q-page-container>
      <q-page :style-fn="myTweak" class="">
        <q-inner-loading :showing="loading" :dark="true">
          <q-spinner-gears size="50px" color="green" />
          <p class="text-grey-2 text-center pt-3">Please wait...</p>
        </q-inner-loading>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'StarterPage',
  data () {
    return {
      loading: true
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    myTweak (offset) {
      // "offset" is a Number (pixels) that refers to the total
      // height of header + footer that occupies on screen,
      // based on the QLayout "view" prop configuration

      // this is actually what the default style-fn does in Quasar
      return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' }
    },
    fetch () {
      this.$store.dispatch('table/getAllTables')
      this.$store.dispatch('product/getAllProducts')
      this.$store.dispatch('product/getAllCategories')
      setTimeout(() => {
        this.loading = false
        this.$router.push({ path: '/table' })
      }, 5000)
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
