<template>
  <div class="" v-on="listeners">
    <div class="row items-center w-full">
      <div class="col">
        <button :disabled="removeBtnDisable" @click="decrement()" class="w-full  q-py-xs q-px-sm bg-red text-white">
          <q-icon name="remove"></q-icon>
        </button>
      </div>
      <div class="col">
        <input type="number" readonly ref="input" @change="change" :value="currentValue" autocomplete="off" :class="[height]" class="w-full q-py-xs q-px-sm text-center border border-grey-light" />
      </div>
      <div class="col">
        <button @click="increment()" class="w-full q-py-xs q-px-sm bg-green text-white">
          <q-icon name="add"></q-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
const isNaN = Number.isNaN || window.isNaN
// const REGEXP_NUMBER = /^-?(?:\d+|\d+\.\d+|\.\d+)(?:[eE][-+]?\d+)?$/
const REGEXP_DECIMALS = /\.\d*(?:0|9){10}\d*$/
const normalizeDecimalNumber = (value, times = 100000000000) => (
  REGEXP_DECIMALS.test(value) ? (Math.round(value * times) / times) : value
)

export default {
  name: 'QtyBtn',
  model: {
    event: 'change'
  },
  props: {
    value: {
      type: Number,
      default: 1
    },
    height: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      removeBtnDisable: false,
      currentValue: NaN
    }
  },
  computed: {
    listeners () {
      const listeners = { ...this.$listeners }
      delete listeners.change
      return listeners
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (newValue, oldValue) {
        if (
          // Avoid triggering change event when created
          !(isNaN(newValue) && typeof oldValue === 'undefined') && newValue !== this.currentValue
        ) {
          this.setValue(newValue)
        }
      }
    }
  },
  methods: {
    change (event) {
      this.setValue(event.target.value)
    },
    increment () {
      let { currentValue } = this
      if (isNaN(currentValue)) {
        currentValue = 0
      }
      if (this.currentValue > 1) {
        this.removeBtnDisable = false
      }
      this.setValue(normalizeDecimalNumber(currentValue + 1))
    },
    decrement () {
      let { currentValue } = this
      if (isNaN(currentValue)) {
        currentValue = 0
      }
      if (currentValue <= 1) {
        this.removeBtnDisable = true
      } else {
        this.setValue(normalizeDecimalNumber(currentValue - 1))
      }
    },
    setValue (value) {
      const oldValue = this.currentValue
      const newValue = value
      this.currentValue = newValue
      if (newValue === oldValue) {
        // Force to override the number in the input box (#13).
        this.$refs.input.value = newValue
      }
      this.$emit('change', newValue, oldValue)
      this.$emit('updated', newValue, oldValue)
    }
  }
}
</script>

<style>
</style>
