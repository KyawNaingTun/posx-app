<template>
  <div class="pdf transparent text-grey-10 text-xl" id="printView">
    <div class="frame">
      <div class="name">
        <p class="text-h5"><b>မြကန်သာ(အုန်း) မြန်မာထမင်းဆိုင်</b></p>
        <p>09-5157525, 09-5071055, 09-5096377</p>
      </div>
      <!-- section of name field -->
      <!-- data list  -->
      <div class="box my-3">
        <div class="info_box_left">
          <p>Table No: {{ tableNo }}</p>
          <p>Sales Person : {{ casher }}</p>
          <!-- <p>Cust: Table-02</p> -->
          <p>ODNO-{{ orderNo }}</p>
        </div>
        <div class="info_box_right text-right">
          <p>Date : {{ date.date }}</p>
          <p>Time : {{ date.time }}</p>
        </div>
        <div class="clear_fix"></div>
      </div>
      <!-- start table -->
      <div class="experience">
        <table class="sold_list">
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Price</th>
            <th class="text-right">Amount</th>
          </tr>
          <tr v-for="(item, index) in items" :key="index">
            <td>{{ item.name }}</td>
            <td>{{ item.qty }}</td>
            <td>{{ item.unit_price }}</td>
            <td class="text-right">{{ item.total_price }}</td>
          </tr>
        </table>
      </div>
      <hr style="border:1px solid #212121;">
      <div class="total_list">
        <!-- section of total table -->
        <table class="total_table">
          <tr class="w-full row">
            <td class="col">Total</td>
            <td class="col-2">{{ subTotal }}</td>
          </tr>
          <tr class="w-full row">
            <td class="col">Tax( {{ tax * 100 }}%)</td>
            <td class="col-2">{{ taxAmount }}</td>
          </tr>
          <tr class="w-full row">
            <td class="col">Service charged</td>
            <td class="col-2">0</td>
          </tr>
          <tr class="w-full row">
            <td class="col text-2xl text-weight-bolder text-md">Grand Total</td>
            <td class="col-2 text-2xl text-weight-bolder text-md">{{ grandTotal }}</td>
          </tr>
        </table>
      </div>
      <br>
      <p class="mark">*******************</p>
      <!-- section of footer -->
      <div class="footer">
          <p>Love what you eat.Eat what you love.</p>
      </div>
      <!-- end of the experience -->
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'PrintView',
  data () {
    return {
      date: {
        date: null,
        time: null
      }
    }
  },
  mounted () {
    this.dateInterval()
  },
  beforeDestroy () {
    console.log('before destroy')
    clearInterval(this.dateInterval)
  },
  computed: {
    ...mapState({
      tax: state => state.cart.tax,
      casher: state => state.auth.currentUser.name,
      orderNo: state => state.cart.currentOrderNo,
      tableNo: state => state.cart.tableNo
    }),
    ...mapGetters('cart', {
      items: 'cartProducts',
      grandTotal: 'grandTotal',
      subTotal: 'subTotal',
      taxAmount: 'taxAmount'
    })
  },
  methods: {
    dateInterval () {
      setInterval(() => {
        const dateObj = new Date()
        const d = dateObj.getDate()
        const m = dateObj.getMonth() + 1
        const year = dateObj.getFullYear()
        const HH = dateObj.getHours()
        const MN = dateObj.getMinutes()
        const timeUnit = HH > 12 ? 'PM' : 'AM'
        const HO = HH > 12 ? HH - 12 : HH

        const day = d.toString().length < 2 ? '0' + d : d
        const month = m.toString().length < 2 ? '0' + m : m
        const minute = MN.toString().length < 2 ? '0' + MN : MN
        const hour = HO.toString().length < 2 ? '0' + HO : HO

        this.date = {
          date: day + '-' + month + '-' + year,
          time: hour + ':' + minute + ' ' + timeUnit,
          unique_no: '00001'
        }
      }, 1000)
    }
  }
}
</script>
<style>
.pdf {height: auto;}
.name {text-align: center;}
.frame {height: auto;}
ul {list-style: none;}
.clear_fix{clear: both;}
.box {width: 100%;text-align: left;}
.info_box_left{width:280px;float:left;}
.info_box_right{width:200px;float:right;}
.sold_list {width: 100%;text-align: left;border-collapse: collapse;}
.sold_list th {border-bottom: 2px dotted #212121;border-top: 2px dotted #212121;}
.sold_list th,td {padding: 8px 0 8px 0;}
.mark,.footer {text-align: center;}
.total_list {text-align: right;border-collapse: collapse;}
.total_table{width:100%;}
.footer { width: 100%;}
</style>
