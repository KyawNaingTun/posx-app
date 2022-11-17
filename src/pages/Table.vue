<template>
  <q-page class="bg-grey-10">
      <div style="height:60px">
        <p class="q-px-lg py-3 text-subtitle1 text-grey">စားပွဲခုံများ</p>
      </div>
      <q-pull-to-refresh @refresh="fetch">
        <div class="q-pa-sm row">
          <div class="col-lg-1 col-md-2 col-sm-3 col-xs-6 q-m-sm" v-for="table in tables" :key="table.id">
            <a v-if="!table.available" class="block bg-orange rounded text-center q-py-lg q-ma-xs text-white text-h6 no-underline" @click="openDialog(table)">{{ table.table_no }}</a>
            <router-link v-else class="block bg-green rounded text-center q-py-lg q-ma-xs text-white text-h6 no-underline" :to="{ name: 'order', params: { id: table.id, no: table.table_no, status: 'new', orderId: 0 }}">{{ table.table_no }}</router-link>
          </div>
        </div>
      </q-pull-to-refresh>
    <!-- Action dialog -->
    <q-dialog v-model="dialog" :content-class="fontClass">
      <q-card style="width: 350px">
        <div class="w-full bg-primary text-white">
          <span class="block q-py-md q-px-md text-weight-bolder text-h5">စားပွဲနံပါတ် - {{ selectedTable.no }}</span>
          <span class="block q-pb-md q-px-md text-grey-12">အတွက်လုပ်ဆောင်ချက်တစ်ခုကို ရွေးချယ်ပါ</span>
        </div>
        <q-list bordered padding class="rounded-borders text-primary">
          <q-item clickable v-ripple :to="{ name: 'order', params: { id: selectedTable.id, no: selectedTable.no, status: 'cash', orderId: selectedTable.orderId }}">
            <q-item-section avatar>
              <q-icon name="money" />
            </q-item-section>
            <q-item-section>ငွေရှင်းမည်</q-item-section>
          </q-item>

          <q-item clickable v-ripple :to="{ name: 'order', params: { id: selectedTable.id, no: selectedTable.no, status: 'add', orderId: selectedTable.orderId }}">
            <q-item-section avatar>
              <q-icon name="add" />
            </q-item-section>
            <q-item-section>ဟင်းအမယ်အတိုး/အလျှော့လုပ်မည်</q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="openTableChangeDialog()">
            <q-item-section avatar>
              <q-icon name="cached"/>
            </q-item-section>
            <q-item-section>စားပွဲနံပါတ်ပြောင်းမည်</q-item-section>
          </q-item>

        </q-list>
      </q-card>
    </q-dialog>
    <!-- Table change dialog -->
    <q-dialog v-model="tableChangeDialog" :content-class="fontClass">
      <q-card class="w-full md:w-1/2">
        <div class="w-full bg-primary text-white">
          <span class="block q-py-md q-px-md text-weight-bolder text-h5">စားပွဲနံပါတ် - {{ selectedTable.no }}</span>
          <span class="block q-pb-md q-px-md text-grey-12">မည်သည့်စားပွဲသို့ပြောင်းမှာလဲ</span>
        </div>
        <q-scroll-area
          :thumb-style="thumbStyle"
          style="height: calc(100vh - 200px);"
        >
          <div class="q-pa-sm row">
            <div class="col-lg-1 col-md-2 col-sm-3 col-xs-6 q-pa-xs" v-for="table in tables" :key="table.id">
                <a v-show="!table.eating_order" @click="doChangeTable(table.id)" class="block bg-green rounded text-center text-white q-pa-md no-underline text-h5">{{ table.id }}</a>
            </div>
          </div>
        </q-scroll-area>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style>
</style>

<script>
import { mapState } from 'vuex'
import OrderApi from '../api/OrderApi.js'
import * as Notification from '../helpers/notification'

export default {
  name: 'TablePage',
  data () {
    return {
      mytables: [],
      dialog: false,
      selectedTable: {},
      changeTableForm: {},
      tableChangeDialog: false
    }
  },
  computed: {
    ...mapState({
      tables: state => state.table.tables,
      fontClass: state => state.app.fontClass
    }),
    tableChangeDialogWidth () {
      return this.$q.screen.lt.md
        ? 300
        : 450
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
  created () {
    this.$store.dispatch('app/setRightDrawerMenu', false)
  },
  methods: {
    fetch (done) {
      this.$store.dispatch('table/getAllTables')
      console.log(this.$i18n.locale)
      done()
    },
    doChangeTable (id) {
      const formData = {
        order_id: this.selectedTable.orderId,
        table_id: id
      }
      OrderApi
        .changeTable(formData)
        .then(response => {
          this.$store.dispatch('table/getAllTables')
          this.tableChangeDialog = false
          this.dialog = false
          Notification.successNoti(response.data.message)
        })
        .catch(error => {
          console.log(error)
          Notification.errorNoti(error.data.message)
        })
    },
    openDialog (table) {
      this.selectedTable = { id: table.id, no: table.table_no, orderId: table.eating_order.id }
      this.dialog = true
    },
    openTableChangeDialog () {
      this.tableChangeDialog = true
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
