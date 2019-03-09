<template>
  <div class="map">
    <header>
      <button v-on:click="logOut">Выход</button>
      <button v-on:click="newPointformShow = !newPointformShow">Создать новую точку</button>
      <button v-on:click="allChangesCancel()">Отменить все изменения</button>
    </header>

    <div id="form">
      <br>Название:
      <br>
      <input v-model="pointName" placeholder="Нажмите на точку">
      <br>Количество товара:
      <br>
      <input type="number" min="0" v-model="pointAmount" placeholder="Нажмите на точку">
      <br>
      <button
        v-on:click="pointChangesConfirm(currentPointId, pointName, pointAmount)"
      >Подтвердить изменения</button>
      <br>
      <button v-on:click="pointRemove(currentPointId)">Удалить точку</button>
    </div>

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
          v-on:click="createNewPoint(points, newPointName, newPointAmount, newPointX, newPointY)"
        >Подтвердить</button>
        <button v-on:click="newPointformShow = !newPointformShow">Скрыть</button>
      </div>
    </transition>

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

#form {
  position: fixed;
  color: rgb(0, 0, 0);
  background: #b5d0d0;
  margin: 5px;
  border: 1px groove black;
  padding: 5px;
  left: 1020px;
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
      if (confirm("Удалить данную точку?")) {
        this.points.splice(pointId, 1);
        this.pointName = "";
        this.pointAmount = "";
        this.localStoragePush();
      }
    },

    createNewPoint(array, newName, newAmount, gettedX, gettedY) {
      if (newName == "") {
        alert("Введите название точки!");
      } else {
        if (newAmount == "") {
          alert("Введите количество товара!");
        } else {
          this.points.push({
            id: array[array.length - 1].id + 1,
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
  }
};
</script>