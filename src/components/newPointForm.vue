<template>
    <transition name="fade">
      <div id="newPointForm" v-if="newPointformShow">
        <br>Название новой точки:
        <br>
        <input v-validate="'required'" v-model="newPointName" v-on:keyup ="formDataCheck(newPointName, newPointAmount)" placeholder="Введите название">
        <br>Количество товара:
        <br>
        <input type="number" min="0" v-model="newPointAmount" placeholder="Введите количество" v-on:keyup ="formDataCheck(newPointName, newPointAmount)">
        <br>Введите расположение по вертикали
        <br>(Или кликните курсором на карте):
        <br>
        <input type="number" min="0" max="100" v-model="newPointX">
        <br>Введите расположение по вертикали
        <br>(Или кликните курсором на карте):
        <br>
        <input type="number" min="0" max="100" v-model="newPointY">
        <br>
        <button v-if= "buttonShow"
          v-on:click="localCreateNewPoint()"
        >Подтвердить</button>
        <button v-on:click="formShowCheck()">Скрыть</button>
      </div>
    </transition>
</template>

<script>
import Vue from "vue";
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

export default {
    name: "newPointForm",
    props: ["newPointformShow", "pointGettedCoord", "createNewPoint", "newPointformShowCheck"],
    data: function(){
        return{
            newPointX: 0,
            newPointY: 0,
            newPointName: '',
            newPointAmount: '',
            buttonShow: false
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
            this.newPointName = '';
            this.newPointAmount = '';
            this.buttonShow = false;
        },
        formShowCheck: function(){
            this.newPointformShowCheck()
        },
        formDataCheck (form1, form2) {
          const form1Check = form1 != '';
          const form2Check = form2 != '';
          return this.buttonShow = form1Check && form2Check;
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

