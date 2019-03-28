<template>
  <div>
    <div id="form">
      <br>Название:
      <br>
      <input v-model= "changedPointName" placeholder="Нажмите на точку">
      <br>Количество товара:
      <br>
      <input v-validate="'between:0,1000'" name ="changedPointAmount" type="number" min="0" v-model="changedPointAmount" placeholder="Нажмите на точку">
      <br>
      <button v-on:click="localPointChangesConfirm()">Подтвердить изменения</button>
      <br>
      <button v-on:click="currentPointRemove()">Удалить точку</button>
    </div>
  </div>
</template>
 <script>
import Vue from "vue";
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

export default {
  name: "pointform",
  props: ["currentPointDate", "pointChangesConfirm", "pointRemove"],
  methods: {
    localPointChangesConfirm: function() {
      this.pointChangesConfirm(this.currentPointDate.id, this.changedPointName, this.changedPointAmount);
    },
    currentPointRemove: function(){
        this.pointRemove(this.localPointId)
    }
  },
  data: function() {
    return {
      changedPointName: '',
      changedPointAmount: '',
      localPointId:''
    }
  },
  watch:{
      currentPointDate: function(newValue){
          this.changedPointName = newValue.name;
          this.changedPointAmount = newValue.amount;
          this.localPointId = newValue.id
      },
  }
};
</script>
 <style>
#form {
  position: fixed;
  color: rgb(0, 0, 0);
  background: #b5d0d0;
  margin: 5px;
  border: 1px groove black;
  padding: 5px;
  left: 1020px;
}
</style>

 
