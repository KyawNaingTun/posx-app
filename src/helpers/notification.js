import { Notify } from 'quasar'

export function errorNoti (message) {
  Notify.create({
    icon: 'error',
    message: message,
    color: 'red',
    timeout: 1000,
    position: 'top'
  })
}

export function successNoti (message) {
  Notify.create({
    icon: 'check_circle',
    message: message,
    color: 'green',
    timeout: 2000,
    position: 'top'
  })
}
