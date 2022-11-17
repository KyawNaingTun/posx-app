<template>
  <div>
    <div class="bg-black text-white" style="height: 100vh">
      <!-- <q-img class="" :src="selectedProduct.thumbnail" style="height: 250px">
        <div class="absolute-bottom">
          <div class="text-weight-bold text-lg py-2 pl-4">{{ selectedProduct.dish }}</div>
        </div>
      </q-img> -->
      <div class="row pl-2 pr-4">
        <div class="w-full q-ma-lg">
          <p class="text-grey mb-5">ပြင်ဆင်လိုသည့်ဟင်းနာမည်</p>
          <h5>{{ form.name }} <small>( {{form.label}} )</small></h5>
          <br>
          <p class="text-grey mb-5">ပြင်ဆင်လိုသည့်ဟင်းပွဲအရေအတွက်</p>
          <qty-btn v-model="form.qty" :height="'h-10'" class="pt-1"></qty-btn>
        </div>
        <div class="q-pa-md">
          <p class="text-grey mb-5 q-ml-sm">မှတ်ချက်ရှိလျှင်ရွေးပေးပါ</p>
          <q-option-group
            :options="comments"
            label="Notifications"
            type="checkbox"
            :dark="true"
            color="primary"
            v-model="form.comment"
          />
        </div>
      </div>
    </div>
    <div class="absolute-bottom-left row w-full q-px-sm py-2">
      <div class="col-2 pr-2">
        <button @click="noAdd()" class="w-full focus:outline-none bg-grey text-white font-semibold q-pa-md">
          <q-icon name="arrow_back_ios"></q-icon>
        </button>
      </div>
      <div class="col-4 pr-2">
        <button @click="removeCartItem(form.dish_price_id)" class="w-full rounded-sm focus:outline-none bg-red text-white font-semibold q-pa-md">
          ဖျက်မည်
        </button>
      </div>
      <div class="col-6">
        <button @click="updateCartItem(form)" class="w-full rounded-sm focus:outline-none bg-green hover:bg-green-dark text-white font-semibold q-pa-md">
          အတည်ပြုမည်
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import QtyBtn from './quantity-input.vue'

export default {
  name: 'CartItemDetail',
  components: {
    QtyBtn
  },
  data () {
    return {
      non: {}
    }
  },
  watch: {
    qtyChange: function (newValue, oldValue) {
      this.form.total_price = this.form.unit_price * newValue
    }
  },
  computed: {
    ...mapState({
      comments: state => state.app.comments
    }),
    ...mapGetters('cart', {
      form: 'cartItemDetailForm'
    }),
    // detailForm () {
    //   return this.$set(this, 'form', this.$store.state.cart.cartItemDetailForm)
    // },
    qtyChange () {
      return this.form.qty
    }
  },
  mounted () {

  },
  created () {

  },
  methods: {
    updateCartItem (form) {
      this.$store.dispatch('cart/updateCartItem', form)
      this.$store.dispatch('app/setRightDrawerMenu', false)
      this.$store.dispatch('app/changeRightDrawerView', 'product-menu')
      this.$store.dispatch('cart/updateCarItemHoverIndex', null)
    },
    removeCartItem (id) {
      this.$store.dispatch('cart/deleteCartItem', id)
      this.$store.dispatch('app/changeRightDrawerView', 'product-menu')
      this.$store.dispatch('cart/updateCarItemHoverIndex', null)
    },
    noAdd () {
      this.$store.dispatch('app/changeRightDrawerView', 'product-menu')
      this.$store.dispatch('cart/updateCarItemHoverIndex', null)
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
