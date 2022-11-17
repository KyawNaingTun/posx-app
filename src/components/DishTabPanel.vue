<template>
  <div>
    <q-tab-panels v-model="panel" :animated="false" class="bg-black text-white overflow-hidden">
      <q-tab-panel name="show_all_dish" swipeable="true">
        <div class="q-px-sm" style="height:75px">
          <q-select class="pt-" filled color="green" dark v-model="filter" :options="filterOptions" emit-value map-options label="အမျိုးအစား">
            <template v-slot:prepend>
              <q-icon name="filter_list" />
            </template>
          </q-select>
        </div>
        <q-scroll-area
          :thumb-style="thumbStyle"
          class=""
          style="height: calc(100vh - 90px);"
        >
          <div class="row q-pa-sm mb-10">
            <div class="col-xs-6 col-sm-4 col-md-4 q-pa-xs" v-for="dish in filteredProducts" :key="dish.id" @click="getProductDetail(dish.id)">
              <div class="rounded text-center">
                <q-img
                  :src="dish.thumbnail"
                  spinner-color="grey"
                  :basic="true"
                  spinnner-size="1em"
                  style="height: 140px; max-width: 150px"
                >
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-negative text-white">
                      Cannot load image
                    </div>
                  </template>
                  <div class="absolute-bottom text-caption text-subtitle1 text-center px-auto q-py-md">
                    {{ dish.dish }}
                  </div>
                </q-img>
              </div>
            </div>
          </div>
        </q-scroll-area>
      </q-tab-panel>

      <q-tab-panel name="dish_detail" v-if="selectedProduct">
        <q-img class="" :src="selectedProduct.thumbnail" :basic="true" style="height: 250px">
          <template v-slot:error>
            <div class="absolute-full flex flex-center bg-negative text-white">
              Cannot load image
            </div>
          </template>
          <div class="absolute-bottom">
            <div class="text-weight-bold text-lg py-2 pl-4">{{ selectedProduct.dish }}</div>
          </div>
        </q-img>
        <q-scroll-area
          :thumb-style="thumbStyle"
          class="relative"
          style="height: calc(100vh - 250px);"
        >
          <div class="row q-py-md q-pr-sm mt-10">
            <div class="row w-full q-col-gutter my-2" v-for="form in selectedProduct.dish_prices" :key="form.value">
              <div class="col-7 pr-2">
                <div class="row">
                  <div class="col-xs-3 col-sm-3 col-md-2">
                    <q-checkbox keep-color v-model="form.check" color="green" />
                  </div>
                  <div class="col-xs-9 col-ms-9 col-md-10">
                    <p class="pt-2 text-white font-bold text-md leading-none mb-1">{{ form.label }}</p>
                    <p class="text-grey-dark">{{ form.price }}</p>
                  </div>
                </div>
              </div>
              <div class="col-5">
                <qty-btn v-if="form.check" v-model="form.qty" :height="'h-10'" class="pt-1"></qty-btn>
              </div>
            </div>
          </div>
          <!-- <div class="q-px-sm q-mt-sm">
              <pre>{{ dishTypeForm }}</pre>
          </div> -->
        </q-scroll-area>
        <div class="w-full absolute-bottom-left row q-px-sm q-py-sm">
          <div class="col-5 q-pr-xs">
            <button @click="noAdd()" class="w-full bg-grey text-white font-semibold q-pa-md">
              ထွက်မည်
            </button>
          </div>
          <div class="col-7">
            <button @click="addProduct(selectedProduct)" class="w-full bg-green text-white font-semibold q-pa-md">
              ထည့်မည်
            </button>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import QtyBtn from './quantity-input.vue'
// import ProductApi from '../api/ProductApi.js'

export default {
  name: 'DishTabPanel',
  components: {
    QtyBtn
  },
  data () {
    return {
      color: ['cyan'],
      url: 'https://placeimg.com/500/300/nature',
      dishTypeForm: {},
      dishDetail: {},
      panel: 'show_all_dish',
      filter: 'All'
    }
  },
  computed: {
    ...mapState({
      dishes: state => state.product.all,
      filterOptions: state => state.product.categories
    }),
    ...mapGetters('product', {
      selectedProduct: 'getProductDetail'
    }),
    filteredProducts: function () {
      var vm = this
      var category = vm.filter

      if (category === 'All') {
        return vm.dishes
      } else {
        return vm.dishes.filter(product => {
          return product.category_id === category
        })
      }
    },
    thumbStyle () {
      return {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#bdbdbd',
        width: '5px',
        opacity: 0.75
      }
    }
  },
  watch: {
    filter: function (value) {
      this.filterByCategory(value)
    }
  },
  methods: {
    filterByCategory (id) {
      // ProductApi
      //   .getProductByCategory(id)
      //   .then(response => {
      //     this.$store.commit('product/setProducts', response.data.data)
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })
    },
    getProductDetail (itemId) {
      console.log('get product detail from list', itemId)
      this.$store.dispatch('product/getProductDetail', itemId)
      // show panel
      this.panel = 'dish_detail'
    },
    addProduct (selectedProduct) {
      // add to cart
      this.$store.dispatch('cart/addProductToCart', selectedProduct)

      this.panel = 'show_all_dish'

      console.log('all dishes after add', this.dishes)
    },
    noAdd () {
      this.panel = 'show_all_dish'
    }
  }
}
</script>

<style>
.q-img__content > div{
  padding:2px;
}
.q-panel-parent {
    position: unset;
}
.q-tab-panel {
  padding: 0;
}
</style>
