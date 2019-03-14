<template>
    <transition name="fade">
      <div id="newPointForm" v-if="newPointformShow">
        <br>Название новой точки:
        <br>
        <input v-model="newPointName" placeholder="Введите название">
        <br>Количество товара:
        <br>
        <input type="number" min="0" v-model="newPointAmount" placeholder="Введите количество">
        <br>Введите расположение по вертикали
        <br>(Или кликните курсором на карте):
        <br>
        <input type="number" min="0" max="100" v-model="newPointX">
        <br>Введите расположение по вертикали
        <br>(Или кликните курсором на карте):
        <br>
        <input type="number" min="0" max="100" v-model="newPointY">
        <br>
        <button
          v-on:click="localCreateNewPoint()"
        >Подтвердить</button>
        <button v-on:click="formShowCheck()">Скрыть</button>
      </div>
    </transition>
</template>

<script>
export default {
    name: "newPointForm",
    props: ["newPointformShow", "pointGettedCoord", "createNewPoint", "newPointformShowCheck"],
    data: function(){
        return{
            newPointX: 0,
            newPointY: 0,
            newPointName: '',
            newPointAmount: ''
        }
    },
    watch:{
      pointGettedCoord: function(newValue){
          this.newPointX = newValue.x;
          this.newPointY = newValue.y;
      }
    },
    methods:{
        localCreateNewPoint: function(){
            this.createNewPoint(this.newPointName, this.newPointAmount, this.newPointX, this.newPointY)
        },
        formShowCheck: function(){
            this.newPointformShowCheck()
        }
    }

}
</script>
<style>
#newPointForm {
  font: bold;
  color: rgb(0, 0, 0);
  position: fixed;
  border: 1px groove black;
  background: #b5d0d0;
  font-size: 10px;
  margin: 5px;
  padding: 5px;
  left: 1020px;
  top: 300px;
}
</style>

