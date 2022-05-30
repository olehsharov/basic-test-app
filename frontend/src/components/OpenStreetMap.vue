<script>

export default {
  props: ['latLon', 'randomPoint'],
  data() {
    return {
      zoom: 15,
      map: null,
      marker: null,
      random: null
    }
  },
  methods: {
    updateView() {
      this.map.setView(this.latLon, this.zoom);
    },
    updateMarker() {
      if (!this.marker) {
        this.marker = L.marker([0,0]);
        this.marker.addTo(this.map);
      };
      this.marker.setLatLng(this.latLon);
    },
    updateRandom() {
      if (!this.random) {
        this.random = L.circle([0,0], {radius: 20, color: 'red', weight: 20});
        this.random.addTo(this.map);
      };
      this.random.setLatLng(this.randomPoint);
    },
  },
  watch: {
    latLon() {
      this.updateView(this.zoom);
      this.updateMarker();
    },
    randomPoint() {
      this.updateRandom();
    }
  },
  mounted() {
    this.map = L.map('map');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 30,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
    this.updateView();
    this.updateMarker();
    this.updateRandom();
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div id="map" class="h-full w-full"></div>
  </div>
</template>
