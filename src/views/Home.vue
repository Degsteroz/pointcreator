<template v-on:>
  <div class="login">
    <img alt="SO MUCH SOBAKA" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <div>
   <p v-if ="seen">
   <form  class="login" @submit.prevent="login">
     <h1>Авторизация </h1>
     <label>Логин </label>
     <input required v-model="username" type="text" placeholder="Login"/>
     <p></p>
     <label>Пароль </label>
  <input required v-model="password" type="password" placeholder="Password"/>     
  <p><button type="submit">Login</button></p>
   </form>
 </div>
  </div>
  
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import cookies from 'js-cookie';
export default {
  name: 'home',
  components: {
    HelloWorld
  },
   methods: {
 login: function () {
   const { username, password } = this
   if(username === 'test'&&password === 'test'){
     cookies.set('aut', `${username}+${password}`);
      return this.$router.push('/map');
   }
  alert('Неверные логин или пароль');
    },
    authorization : function() {
 if(cookies.get('aut') === 'test+test') return this.$router.push('/map'); 
 console.log(cookies.isKey('aut'));
    }

  },
  beforeMount(){
    this.authorization()
 },
}
</script>
