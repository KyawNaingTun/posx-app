<template>
  <q-page class="bg-grey-10 relative overflow-hidden">
    <!-- Print Image -->
    <div id="imgOut" class="w-full h-auto"></div>
    <!-- Print View -->
    <div class="mx-auto absolute" style="width:500px;z-index:-1;">
      <print-view></print-view>
    </div>
    <!-- Content box -->
    <div class="column items-stretch" style="height:92vh;">
      <!-- Head line -->
      <div class="col row q-px-sm q-pt-sm">
        <div class="col-8">
          <div class="q-px-md">
            <span class="block text-grey-6">ယခုရွေးချယ်ထားသော စားပွဲနံပါတ်</span>
            <span class="block text-green font-extrabold text-h6">Table #{{ selectedTableNo }}</span>
          </div>
        </div>
        <div class="col-4">
          <q-btn v-if="$q.platform.is.mobile" @click="rightDrawerMenuShow = !rightDrawerMenuShow" flat class="float-right" color="primary" :size="'md'" icon="add"/>
        </div>
      </div>
      <!-- Order table/contents -->
      <div class="col-7 q-pa-sm">
        <q-markup-table dark class="bg-black">
          <thead class="bg-grey-10">
            <tr>
              <th class="text-bold text-left">Item</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Price</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(old, ind) in oldItems" :key="ind" class="hover:bg-red-light bg-grey-darkest text-grey" @click="selectedItemForDelete(ind, old)">
              <td class="text-left">
                {{ old.name }}({{ old.label }})
                <p class="text-grey pl-2" v-for="(commt, ky) in old.comment" :key="ky">- {{ commt }}</p>
              </td>
              <td class="text-right">{{ old.qty }}</td>
              <td class="text-right">{{ old.unit_price }}</td>
              <td class="text-right">{{ old.total_price }}</td>
            </tr>
            <tr v-for="(item, index) in items" :key="`${index}-${item.dish_price_id}`" :class="{'bg-blue':cartItemHoverIndex === index}" @click="getCartItemDetail(item.dish_price_id, index)">
              <td class="text-left">
                {{ item.name }}({{ item.label }})
                <p class="text-amber-2 pl-2" v-for="(com, k) in item.comment" :key="k" v-show="com !== '[' || com !== ']'">- {{ com }}</p>
              </td>
              <td class="text-right">{{ item.qty }}</td>
              <td class="text-right">{{ item.unit_price }}</td>
              <td class="text-right">{{ item.total_price }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
      <!-- Cart/Order Info -->
      <div class="col-3 q-py-sm q-px-lg">
        <div class="flex row w-full" v-show="buttonStatus !== 'add'">
          <div class="col-8 text-left text-grey-4">
            <p>Subtotal</p>
            <p>Tax( {{ tax * 100 }}%)</p>
          </div>
          <div class="col-4 text-right text-grey-4">
            <p>{{ subTotal }}</p>
            <p>{{ taxAmount }}</p>
            <p class="text-gery-1 font-bold text-h5 pt-2">{{ grandTotal | numFormat }}</p>
          </div>
        </div>
      </div>
      <!-- Action btns -->
      <div class="col row w-full q-px-sm pb-2">
        <div class="col-4">
          <button @click="goBack()" class="w-full bg-grey text-white font-semibold q-pa-md">
            ပြန်ထွက်မည်
          </button>
        </div>
        <div class="col pl-2" v-if="buttonStatus === 'cash'">
          <button @click="print()" class="w-full bg-green text-white font-semibold q-pa-md">
            ငွေရှင်းမှုအတည်ပြုမည်
          </button>
        </div>
        <div class="col pl-2" v-if="buttonStatus === 'new'">
          <button @click="createOrder()" class="w-full bg-green text-white font-semibold q-pa-md">
            အော်ဒါမှာမည်
          </button>
        </div>
        <div class="col pl-2" v-if="buttonStatus === 'add'">
          <button @click="updateOrder()" class="w-full bg-green text-white font-semibold q-pa-md">
            အော်ဒါအတည်ပြုမည်
          </button>
        </div>
      </div>
    </div>
    <!-- Dialog -->
    <q-dialog v-model="deleteConfirmDialog" persistent :content-class="fontClass">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete_forever" color="negative" text-color="white" />
          <span class="q-ml-sm">ဖယ်ရှားမည့်လုပ်ဆောင်ချက် အတည်ပြုရန်</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="မလုပ်ပါ" color="primary" @click="deleteOldItemCancel()" />
          <q-btn flat label="ဖယ်ရှားမည်" color="primary" @click="deleteOldItemConfirm()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import domtoimage from 'dom-to-image'
import OrderApi from '../api/OrderApi.js'
// import PrintApi from '../api/PrintApi.js'
import PrintView from '../components/PrintView'
import * as Notification from '../helpers/notification'
export default {
  name: 'OrderPage',
  components: {
    PrintView
  },
  data () {
    return {
      printShow: false,
      hoverIndex: null,
      dishDetailDrawer: false,
      buttonStatus: {},
      oldItems: [],
      selectedItem: {},
      selectedItemIndex: null,
      deletedItems: [],
      addBtn: true,
      deleteConfirmDialog: false,
      scrollTableHigh: {
        height: 'calc(100vh - 400px)'
      }
    }
  },
  computed: {
    ...mapState({
      tax: state => state.cart.tax,
      cartItemHoverIndex: state => state.cart.cartItemHoverIndex,
      selectedTableNo: state => state.cart.tableNo,
      rightDrawerView: state => state.app.rightDrawerView,
      fontClass: state => state.app.fontClass
    }),
    ...mapGetters('cart', {
      items: 'cartProducts',
      grandTotal: 'grandTotal',
      subTotal: 'subTotal',
      taxAmount: 'taxAmount'
    }),
    rightDrawerMenuShow: {
      set (status) {
        this.$store.dispatch('app/setRightDrawerMenu', status)
      },
      get () {
        return this.$store.state.app.rightDrawerMenuShow
      }
    },
    thumbStyle () {
      return {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#bdbdbd',
        width: '5px',
        opacity: 0.75,
        currentOrderForm: {
          id: null
        }
      }
    }
  },
  created () {
    this.checkParam(this.$route.params)
    this.buttonStatus = this.$route.params.status
  },
  mounted () {
    this.$store.dispatch('cart/resetState')
    this.$store.dispatch('cart/setTableInfoForCart', this.$route.params)
  },
  methods: {
    goBack () {
      this.$router.push('/table')
    },
    selectedItemForDelete (index, oldItem) {
      Object.assign(this.selectedItem, oldItem)
      this.selectedItemIndex = index
      this.deleteConfirmDialog = true
    },
    deleteOldItemConfirm () {
      this.oldItems.splice(this.selectedItemIndex, 1)
      this.deletedItems.push(this.selectedItem)
      this.deleteConfirmDialog = false
    },
    deleteOldItemCancel () {
      this.deleteConfirmDialog = false
      this.selectedItemIndex = null
      this.selectedItem = {}
    },
    checkParam (params) {
      switch (params.status) {
        case 'new':
          this.$store.dispatch('app/setRightDrawerMenu', true)
          break

        case 'add':
          this.$store.dispatch('app/setRightDrawerMenu', true)
          this.fetchOrderDetailForAdd(params.orderId)
          this.scrollTableHigh = {
            height: 'calc(100vh - 210px)'
          }
          break

        default:
          this.$store.dispatch('app/setRightDrawerMenu', false)
          this.fetchOrderDetail(params.orderId)
          this.addBtn = false
          break
      }
    },
    doPaid () {
      this.$q.loading.show()
      OrderApi
        .postPaid(this.currentOrderForm)
        .then(response => {
          this.$store.dispatch('table/getAllTables')// get table update
          this.print()// print receipt image
        })
        .catch(error => {
          console.log(error)
          this.$q.loading.hide()
          Notification.errorNoti(error.data.message)
        })
    },
    fetchOrderDetailForAdd (id) {
      this.$q.loading.show()
      this.$store.commit('cart/setCartItems', { items: [] })
      OrderApi
        .getDetail(id)
        .then(response => {
          this.currentOrderForm = response.data.data
          const items = response.data.data.details.map((detail, index) => ({
            thumbnail: '',
            old: true,
            name: detail.dish.dish,
            label: detail.dish_price.dish_type,
            comment: detail.comment,
            dish_id: detail.dish_id,
            dish_price_id: detail.dish_price_id,
            unit_price: detail.unit_price,
            total_price: detail.total_price,
            qty: detail.qty
          }))
          this.oldItems = items
          this.$q.loading.hide()
          this.$store.dispatch('app/setRightDrawerMenu', true)
        })
        .catch(error => {
          this.$q.loading.hide()
          Notification.errorNoti('Server Error')
          console.log(error)
        })
    },
    fetchOrderDetail (id) {
      this.$q.loading.show()
      this.$store.commit('cart/setCartItems', { items: [] })
      OrderApi
        .getDetail(id)
        .then(response => {
          console.log('detail order', response.data)
          const orderDetail = response.data.data
          this.currentOrderForm = response.data.data
          // add order no
          this.$store.commit('cart/setOrderNumber', orderDetail.order_no)

          const items = orderDetail.details.map((detail, index) => ({
            thumbnail: '',
            old: true,
            name: detail.dish.dish,
            label: detail.dish_price.dish_type,
            comment: detail.comment,
            dish_id: detail.dish_id,
            dish_price_id: detail.dish_price_id,
            unit_price: detail.unit_price,
            total_price: detail.total_price,
            qty: detail.qty
          }))
          this.$store.commit('cart/setCartItems', { items: items })
          this.$q.loading.hide()
        })
        .catch(error => {
          this.$q.loading.hide()
          Notification.errorNoti('Server Error')
          console.log(error)
        })
    },
    printToServer (formData) {
      // console.log('ImageData', formData)

      var imageObj = {
        base64Image: formData.image,
        width: 576,
        cutReceipt: true
      }

      window.starprnt.printBase64Image('TCP:192.168.1.1', 'EscPos', imageObj, function (result) {
        console.log(result)
      },
      function (error) {
        console.log(error)
      })
      // var header = '            မြန်ကန်သာ\n' +
      //   '           123 Star Road\n' +
      //   '         City, State 12345\n' +
      //   '\n' +
      //   'SALE\n' +
      //   'Date:MM/DD/YYYY     Time:HH:MM PM\n' +
      //   '----------------------------------\n' +
      //   'SKU          Description     Total\n' +
      //   '----------------------------------\n'

      // var footer = '\n' +
      //   'Subtotal                    156.95\n' +
      //   'Tax                           0.00\n' +
      //   '----------------------------------\n' +
      //   'Total                      $156.95\n' +
      //   '----------------------------------\n' +
      //   '\n' +
      //   'Charge\n' +
      //   '156.95\n' +
      //   'Visa XXXX-XXXX-XXXX-0123\n' +
      //   'Refunds and Exchanges\n' +
      //   'Within 30 days with receipt\n' +
      //   'And tags attached\n'

      // var content = ''
      // this.items.forEach(element => {
      //   content +=
      //     element.name + '          ' + element.qty + '            29.99\n'
      // })

      // var rasterObj = {
      //   text: header + content + footer,
      //   fontSize: 25, // Defaults to 25
      //   paperWidth: 576, // options: 384 = 2", 576 = 3", 832 = 4"
      //   cutReceipt: true, // Defaults to true
      //   openCashDrawer: true // Defaults to true
      // }

      // window.starprnt.printRasterReceipt('TCP:192.168.8.105', 'EscPos', rasterObj, function (result) {
      //   console.log(result)
      // },
      // function (error) {
      //   console.log(error)
      // })
      // var printObj = {
      //   text: 'Star Clothing Bouting\n123 မြလမ်း\nရန်ကုန်, State 1234\n\n',
      //   cutReceipt: true
      // }
      // window.starprnt.printRawText('TCP:192.168.1.1', 'EscPos', printObj, function (result) {
      //   console.log(result)
      // },
      // function (error) {
      //   console.log(error)
      // })

      // var commandsArray = []
      // commandsArray.push({ appendEncoding: 'UTF-8' })
      // commandsArray.push({ appendCodePage: 'UTF8' })
      // commandsArray.push({
      //   appendLogo: 1,
      //   logoSize: 'Normal'
      // })
      // commandsArray.push({ appendAlignment: 'Center' })
      // commandsArray.push({ append: 'မြကန်သာ ရိပ်အောင်က တက္ကသိုလ်ကျောင်း' })
      // commandsArray.push({ appendCutPaper: 'PartialCutWithFeed' })

      // window.starprnt.print('TCP:192.168.1.1', 'EscPos', commandsArray, function (result) {
      //   console.log(result)
      // },
      // function (error) {
      //   console.log(error)
      // })
      // PrintApi
      //   .postPrint(formData)
      //   .then(response => {
      //     console.log(response.data)
      //     this.$q.loading.hide()
      //     this.$store.commit('cart/setCartItems', { items: [] })
      //     this.goBack()
      //   })
      //   .catch(error => {
      //     console.log(error)
      //     this.$q.loading.hide()
      //     Notification.errorNoti(error.data.message)
      //   })
      this.$q.loading.hide()
    },
    print () {
      this.$q.loading.show()
      var node = document.getElementById('printView')
      // var imgOut = document.getElementById('imgOut')
      const { printToServer } = this
      domtoimage.toPng(node, { quality: 0.50 })
        .then(function (dataUrl) {
          var img = new Image()
          img = dataUrl
          // imgOut.appendChild(img)
          const formData = { image: img }
          printToServer(formData)
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error)
        })
      this.$q.loading.hide()
    },
    resetHoverIndex () {
      this.$store.dispatch('cart/updateCarItemHoverIndex', null)
    },
    getCartItemDetail (id, index) {
      if (this.$route.params.status !== 'cash') { // ငွေရှင်းမည်မဟုတ်လျှင်
        this.$store.dispatch('cart/updateCarItemHoverIndex', index)
        this.$store.dispatch('cart/getCartItemDetail', id)
        this.$store.dispatch('app/changeRightDrawerView', 'cart-item-detail')
        this.$store.dispatch('app/setRightDrawerMenu', true)
      }
    },
    createOrder () {
      this.$store.commit('cart/setCheckoutStatus', null)

      this.$q.loading.show()
      const formData = {
        table_id: this.$store.state.cart.tableId,
        payment_method: this.$store.state.cart.paymentMethod,
        change_amount: this.$store.state.cart.changeAmount,
        status: this.$store.state.cart.status,
        type: this.$store.state.cart.type,
        tax_amount: this.taxAmount,
        sub_total: this.subTotal,
        grand_total: this.grandTotal,
        items: this.items
      }

      OrderApi
        .postCreate(formData)
        .then(response => {
          this.$store.commit('cart/setCheckoutStatus', 'successful')
          this.$store.dispatch('table/getAllTables')// get table update
          this.$store.dispatch('product/getAllProducts')
          Notification.successNoti(response.data.message)
          this.$q.loading.hide()
          this.goBack()
        })
        .catch(error => {
          this.$store.commit('cart/setCheckoutStatus', 'failed')
          console.log(error)
          this.$q.loading.hide()
          Notification.errorNoti(error.data.message)
        })
    },
    updateOrder () {
      this.$store.commit('cart/setCheckoutStatus', null)

      this.$q.loading.show()
      const formData = {
        order_id: this.currentOrderForm.id,
        table_id: this.$store.state.cart.tableId,
        payment_method: this.$store.state.cart.paymentMethod,
        change_amount: this.$store.state.cart.changeAmount,
        status: this.$store.state.cart.status,
        type: this.$store.state.cart.type,
        tax_amount: this.taxAmount,
        sub_total: this.subTotal,
        grand_total: this.grandTotal,
        items: this.items,
        deletedItems: this.deletedItems
      }

      OrderApi
        .postUpdate(formData)
        .then(response => {
          // console.log('delete status', response.data)
          this.$store.commit('cart/setCheckoutStatus', 'successful')
          // clear for cache(delete)
          this.deletedItems = []// clear
          this.selectedItemIndex = null
          this.selectedItem = {}

          Notification.successNoti(response.data.message)
          this.$q.loading.hide()
          this.goBack()
        })
        .catch(error => {
          this.$store.commit('cart/setCheckoutStatus', 'failed')
          console.log(error)
          this.$q.loading.hide()
          Notification.errorNoti(error.data.message)
        })
    },
    qtyChange (qty, id) {
      this.$store.dispatch('cart/quantityChange', {
        id: id,
        qty: qty
      })
    }
  }
}
</script>

<style>
.q-img__content > div{
  padding:2px;
}
.q-tab-panel {
  padding: 0;
}
</style>
