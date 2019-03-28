<template>
    <div id="content">
      <img draggable="false" src="../assets/tutzing.svg" v-on:click="localCoordsGetter($event)">
      <div
        draggable="true"
        v-for="point in points"
        :key="point.id"
        v-on:click="localGetPointValues(point.name, point.amount, point.id)"
        v-on:dragend="localonDragEnd($event, point.id)"
        class="circle"
        v-bind:style="{top: point.x+'%', left:point.y+'%'}"
      ></div>
    </div>
</template>

<style>
#content {
  position: absolute;
  float: left;
  width: 990px;
  height: 990px;
  margin: 5px;
}
.circle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: rgba(255, 0, 0, 0.644);
  border-radius: 20px;
  cursor: -webkit-grab;
}
.circle:active {
  position: absolute;
  width: 12px;
  height: 12px;
  background: rgb(255, 0, 0, 0.644);
  border-radius: 20px;
  cursor: -webkit-grab;
}
</style>

<script>
export default {
    name: "poinstForm",
    props: ["points", "getPointValues", "coordsGetter", "onDragEnd"],
    methods:{
        localGetPointValues(name, amount, id) {
            this.getPointValues(name, amount, id);
        },
        localCoordsGetter(event) {
            this.coordsGetter(event);
        },
        localonDragEnd(event, pointId){
            this.onDragEnd(event, pointId)
        }
    }
}
</script>


