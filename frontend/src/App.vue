<script>
import OpenStreetMap from './components/OpenStreetMap.vue'

const randomCoords = (rect) => {
  if (!rect) return [0,0];

  var maxLat = rect[0][0];
  var minLat = rect[1][0];
  var minLon = rect[0][1];
  var maxLon = rect[3][1];

  var randomLat = minLat + Math.random() * (maxLat - minLat);
  var randomLon = minLon + Math.random() * (maxLon - minLon);

  return [randomLat, randomLon];
}

const defaultCoords = '55.751769, 37.617597';

export default {
  components: {OpenStreetMap},
  methods: {
    parseCoords(latLon) { 
      return latLon.split(',').map(c => parseFloat(c.trim()));
    },
    getRect(latLon, sizeKm) {
      var parsedLatLon = this.parseCoords(latLon);
      var lat = parsedLatLon[0];
      var lon = parsedLatLon[1];
      var sizeLat = sizeKm / 111.111;
      var sizeLon = sizeKm / (111.111 * Math.cos((lat * Math.PI) / 180));
      return [
        [lat + sizeLat/2, lon - sizeLon/2],
        [lat - sizeLat/2, lon - sizeLon/2],
        [lat - sizeLat/2, lon + sizeLon/2],
        [lat + sizeLat/2, lon + sizeLon/2]
      ]
    },
    async fetchCoords() {
      var response = await fetch('http://localhost:8888/getcoords?lat=1&lon=2', {
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
  watch: {
    latLon: function() {
      this.rect = this.getRect(this.latLon, 2)
    }
  },
  data() {
    return {
      latLon: defaultCoords,
      rect: this.getRect(defaultCoords, 2),
      random: [55,37]
    }
  },
  mounted() {
    // setInterval(() => {
      this.random = randomCoords(this.rect);
      // console.log(this.random);
    // }, 500)
  }
}

</script>

<template>
  <div class="w-1/2 bg-green-200 flex flex-col">
    <h1>TEST</h1>
    <div class="flex">
      <input type="text" v-model="latLon" class="flex-grow"/>
      <button class="px-4 py-2 m-3 bg-gray-200" @click="fetchCoords()">Random</button>
    </div>
    <OpenStreetMap :latLon="parseCoords(latLon)" :rect="rect" :randomPoint="random" :key="`${latLon}`"/>
  </div>
</template>