<template>
  <div class="map">
    <header>
      <button v-on:click="logOut">Выход</button>
      <button v-on:click="newPointformShow = !newPointformShow">Создать новую точку</button>
      <button v-on:click="allChangesCancel()">Отменить все изменения</button>
    </header>
    <pointForm 
    :pointRemove = pointRemove 
    :currentPointDate = this.currentPointDate  
    :pointChangesConfirm = pointChangesConfirm 
    />

    <newPointForm 
    :newPointformShow = newPointformShow
    :pointGettedCoord = pointGettedCoord
    :createNewPoint = createNewPoint
    :newPointformShowCheck = newPointformShowCheck
    />

    <div id="content">
      <img draggable="false" src="../assets/tutzing.svg" v-on:click="coordsGetter($event)">
      <div
        draggable="true"
        v-for="point in points"
        :key="point.id"
        v-on:click="getPointValues(point.name, point.amount, point.id)"
        v-on:dragend="onDragEnd($event, point.id)"
        class="circle"
        v-bind:style="{top: point.x+'%', left:point.y+'%'}"
      ></div>
    </div>
  </div>
</template>



<style>
.map {
  display: block;
  position: relative;
}
input {
  margin: 5px;
}
button {
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
  background: rgba(255, 0, 0, 0.644);
  border-radius: 20px;
  cursor: -webkit-grab;
}
.circle:active {
  position: absolute;
  width: 10px;
  height: 10px;
  background: rgb(255, 0, 0);
  border-radius: 20px;
  cursor: -webkit-grab;
}

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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
</style>


<script>
import cookies from "js-cookie";
import model from "../model/model";
import pointForm from "./pointInfoForm.vue";
import newPointForm from "./newPointForm.vue";
export default {
  methods: {
    getPointValues: function(name, amount, id) {
      this.pointName = name;
      this.pointAmount = parseInt(amount);
      this.currentPointId = id;
    },

    logOut: function() {
      cookies.remove("aut");
      this.$router.push({ name: "loginForm" });
    },

    amountValidate(num) {
      return num > 0 ? num : (num = 0);
    },

    coordsValidate(num) {
      num = this.amountValidate(num);
      return num > 100 ? (num = 100) : num;
    },

    coordsGetter: function(event) {
      this.newPointX = ((event.layerX - 5) / 1000) * 100;
      this.newPointY = ((event.layerY - 5) / 1000) * 100;
    },

    cookiesCheck: function() {
      if (cookies.get("aut") === undefined) return this.$router.push("/");
    },

    allChangesCancel: function() {
      if (confirm("Отменить все внесённые изменения?")) {
        localStorage.removeItem("changedPoints");
        this.defaultPointsPositionPush();
      }
    },

    pointChangesConfirm(pointId, pointChangedName, pointChangedAmount) {
      const pointIndex = this.points.findIndex(item => {
        return item.id === pointId;
      });
      const changedPoint = this.points[pointIndex];
      changedPoint.name = pointChangedName;
      changedPoint.amount = this.amountValidate(pointChangedAmount);
      this.points.splice(pointIndex, 1, changedPoint);
      this.localStoragePush();
    },

    pointRemove(pointId) {
       const pointIndex = this.points.findIndex(item => {
        return item.id === pointId;
      });
      if (confirm("Удалить данную точку?")) {
        this.points.splice(pointIndex, 1);
        this.pointName = "";
        this.pointAmount = "";
        this.localStoragePush();
      }
    },
    newPointformShowCheck: function(){
      this.newPointformShow = !this.newPointformShow
    },

    createNewPoint(newName, newAmount, gettedX, gettedY) {
      if (newName == "") {
        alert("Введите название точки!");
      } else {
        if (newAmount == "") {
          alert("Введите количество товара!");
        } else {
          this.points.push({
            id: this.points[this.points.length - 1].id + 1,
            name: newName,
            amount: newAmount,
            x: this.coordsValidate(gettedY),
            y: this.coordsValidate(gettedX)
          });
          this.newPointName = "";
          this.newPointAmount = "";
          this.newPointX = "";
          this.newPointY = "";
          this.localStoragePush();
          this.newPointformShow = !this.newPointformShow;
        }
      }
    },

    onDragEnd(event, pointId) {
      const x = event.layerX;
      const y = event.layerY;
      const pointIndex = this.points.findIndex(item => {
        return item.id === pointId;
      });
      const changedPoint = this.points[pointIndex];
      changedPoint.x = this.coordsValidate(
        changedPoint.x + ((y - 5) / 1000) * 100
      );
      changedPoint.y = this.coordsValidate(
        changedPoint.y + ((x - 5) / 1000) * 100
      );
      this.points.splice(pointIndex, 1, changedPoint);
      this.localStoragePush();
    },

    localStoragePush() {
      const parsed = JSON.stringify(this.points);
      localStorage.setItem("changedPoints", parsed);
    },

    defaultPointsPositionPush() {
      this.points = model.map((item, index) => ({
        ...item,
        id: index + 1
      }));
    }
  },

  created: function() {
    if (localStorage.getItem("changedPoints") != null) {
      this.points = JSON.parse(localStorage.getItem("changedPoints"));
    } else {
      this.defaultPointsPositionPush();
    }
  },
  components: {
    pointForm,
    newPointForm
  },

  data: function() {
    return {
      points: [],
      pointName: "",
      pointAmount: "",
      newPointName: "",
      newPointAmount: "",
      currentPointId: 0,
      newPointX: 0,
      newPointY: 0,
      newPointformShow: false
    };
  },
  computed:{
    currentPointDate: function(){
      return {
        name: this.pointName,
        amount: this.pointAmount,
        id: this.currentPointId
      }
    },
    pointGettedCoord:function(){
      return{
        x: this.newPointX,
        y: this.newPointY,
      }
    }

  }
};
</script>