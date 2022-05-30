<script>
import OpenStreetMap from './components/OpenStreetMap.vue'

const defaultCoords = '55.751769, 37.617597';

export default {
  components: {OpenStreetMap},
  methods: {
    parseCoords(latLon) { 
      return latLon.split(',').map(c => parseFloat(c.trim()));
    },
    async fetchCoords() {
      var response = await fetch('/getcoords?lat=1&lon=2', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          lat: this.parseCoords(this.latLon)[0],
          lon: this.parseCoords(this.latLon)[1]
        })
      })
      var json = await response.json();
      this.random = [json.lat, json.lon];
    }
  },
  data() {
    return {
      latLon: defaultCoords,
      random: [0,0]
    }
  }
}

</script>

<template>
  <div class="w-1/2 bg-saker-900 flex flex-col pb-4">
    <div class="flex py-4 items-center">
      <input type="text" v-model="latLon" class="flex-grow px-4 py-2 text-lg h-14 border-saker-200 border-4 outline-none rounded-full"/>
      <button class="px-4 py-2 m-3 bg-saker-500 border-saker-200 border-4 h-14 rounded-full text-gray-200" @click="fetchCoords()">Random</button>
    </div>
    <OpenStreetMap :latLon="parseCoords(latLon)" :randomPoint="random" :key="`${latLon}`"/>
  </div>
</template>