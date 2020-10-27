<template>
  <div id="app">
    <router-view>
      
    </router-view>
  </div>
</template>

<script>
import { store } from './store/vuex'
export default {
  name: 'app',
  store
}
</script>

<style>
#app {

}
</style>
