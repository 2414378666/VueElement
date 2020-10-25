<template>
  <div id="DataReport">
    <!-- <seller-page/> -->
    <!-- <trend-page class="trend" /> -->
    <!-- <map-page/> -->
    <rank-page/>
  </div>
</template>

<script>
import sellerPage from './SellerPage'
import trendPage from './trendPage'
import mapPage from './mapPage'
import rankPage from './rankPage'
export default	{
  name:	'DataReport',
  data() {
    return {
     
    }
  },
  mounted() {
  },
  components: {
    sellerPage,
    trendPage,
    mapPage,
    rankPage
  },

}
</script>

<style scoped>
</style>