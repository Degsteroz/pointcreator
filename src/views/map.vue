<template>
  <div class="map">
    <header><button v-on:click="logOut" >Выход</button>
    <button v-on:click="formShow = !formShow" >Создать новую точку</button>
    <button v-on:click="allChangesCancel()">Отменить все изменения</button></header>
    
    <div id="content">
    
      <img src="../assets/tutzing.svg" v-on:click="coordsGetter($event)">
      <div 
        draggable ="true" 
        v-for="point in points" :key ="point.id"
        v-on:click="onClick(point.name, point.amount, point.id)"
        v-on:dragend="onDragEnd($event, point.id)"
        class="circle" v-bind:style="{top: point.x+'%', left:point.y+'%'}"
      >
      </div>
    </div>
    <div id ="form">
      <br>Название: 
      <br><input v-model="pointName">
      <br>Количество товара: 
      <br><input type="number" v-model="pointAmount">
      <br><button v-on:click="pointChangesConfirm(currentPointId, pointName, pointAmount)">Подтвердить изменения</button>
      <br><button v-on:click="pointRemove(currentPointId)">Удалить точку</button>
      
    </div>
    <transition name = "fade">
      <div id = "newPointForm" v-if="formShow">
        <br>Введите название:
        <br><input v-model="newPointName">
        <br>Введите количество:
        <br><input type="number" v-model="newPointAmount"  >
        <br>Введите расположение по вертикали
        <br>(Или кликните курсором на карте):
        <br><input type="number" v-model="newPointX">
        <br>Введите расположение по вертикали
        <br>(Или кликните курсором на карте):
        <br><input type="number" v-model="newPointY">
        <br><button v-on:click="createNewPoint(points, newPointName, newPointAmount, newPointX, newPointY), formShow = !formShow" >Подтвердить</button>
        <button v-on:click="formShow = !formShow" >Скрыть</button>
     </div>  
   </transition>
  </div>
</template>



<style>
.map{
  display: block;
  position: relative;
}
input{
  margin: 5px;
}
button{
  margin: 5px;
}
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
	background: red;
	border-radius: 20px;
  cursor: -webkit-grab;
}
.strike {
    background: #aaa;
}
#form {
  position: relative;
  background: gray;
  float: right;
  margin: 5px;
  padding: 5px; 
}
#newPointForm {
  position: relative;
  padding: 20px;
  float: right;
  background: gray;
  margin: 5px;
  font-size: 10px
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}

</style>


<script>
import cookies from 'js-cookie';
import  model from '../model/model';
export default {


  methods:{
    onClick: function (name, amount, id) {
      this.pointName = name;
      this.pointAmount = parseInt(amount);
      this.currentPointId = id;
    },
    logOut: function(){
      cookies.remove('aut');
      this.$router.push('/');
    },
    amountValidate(num){
     return num > 0? num = num: num = 0
    },
    coordsValidate(num){
    num = this.amountValidate(num);
     return num > 100 ? num = 100 : num = num;
    },
    coordsGetter: function(event){
      this.newPointX = (event.layerX - 5) / 1000 * 100;
      this.newPointY = (event.layerY - 5) / 1000 * 100;
    },
    cookiesCheck: function(){
      if(cookies.get('aut') === undefined) return this.$router.push('/');
    },
    allChangesCancel: function(){
      if(confirm('Отменить все внесённые изменения?')){
      this.points = JSON.parse(localStorage.getItem('defaultPoints'))}
      localStorage.removeItem('changedPoints');
    },
    
    pointChangesConfirm(pointId, pointChangedName, pointChangedAmount) {
      const pointIndex = this.points.findIndex(item => {
        return item.id === pointId; 
      });
      const changedPoint = this.points[pointIndex];
      changedPoint.name = pointChangedName;
      changedPoint.amount = this.amountValidate(pointChangedAmount);
      this.points.splice(pointIndex, 1, changedPoint);
      console.log('POINTS', this.points);
      this.localStoragePusher();
    }
,

    pointRemove(pointId) {
      if(confirm('Удалить данную точку?')){
      const pointIndex = this.points.findIndex(item => {
        return item.id === pointId; 
      });
      this.points.splice(pointIndex, 1);
      console.log('POINTS', this.points);
      this.pointName = 'Нажмите на точку';
      this.pointAmount = 'Нажмите на точку';
      this.localStoragePusher();
      }
    },
    
    createNewPoint(array, newName, newAmount, gettedX, gettedY) {
      this.points.push({ id: array[array.length-1].id + 1,
      name: newName, 
      amount: this.amountValidate(newAmount),
      x: this.coordsValidate(gettedY),
      y: this.coordsValidate(gettedX) });
       console.log('POINTS', this.points);
       this.newPointName = '';
       this.newPointAmount = '';
       this.newPointX = '';
       this.newPointY = '';
       this.localStoragePusher()
    },
    onDragEnd(event, pointId) {
      console.log('DRAGEND_EVENT', event, pointId);
      const x = event.layerX;
      const y = event.layerY;
      const pointIndex = this.points.findIndex(item => {
        return item.id === pointId; 
      });
      const changedPoint = this.points[pointIndex];
      changedPoint.x = this.coordsValidate(changedPoint.x + (y - 5) / 1000 * 100);
      console.log(changedPoint.x);
      changedPoint.y = this.coordsValidate(changedPoint.y + (x - 5) / 1000 * 100);
      this.points.splice(pointIndex, 1, changedPoint);
      console.log('POINTS', this.points);
      this.localStoragePusher();
    },
    localStoragePusher(){
      const parsed = JSON.stringify(this.points);
      localStorage.setItem('changedPoints', parsed);
    }
  },
  created: function () {
    const defaultPointState = model.map((item, index) => ({ ...item, id: index + 1 }));
    const parsed = JSON.stringify(defaultPointState);
    localStorage.setItem('defaultPoints', parsed);

   if (localStorage.getItem('changedPoints') != null) {
    this.points = JSON.parse(localStorage.getItem('changedPoints'))
   } else {
      this.points = JSON.parse(localStorage.getItem('defaultPoints')); 
   }
  },

  beforeMount(){
    this.cookiesCheck();
 },


 data: function() {
   return{
    points: [],
    pointName: 'Нажмите на точку',
    pointAmount: 'Нажмите на точку',
    newPointName: '',
    newPointAmount: 0,
    currentPointId: 0,
    newPointX: 0,
    newPointY: 0,
    formShow: false,
    }
 },
}

</script>







    




