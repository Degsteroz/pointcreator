<template>
  <div class="login">
    <img alt="SO MUCH SOBAKA" src="../assets/logo.png">
    <div>
      <form class="login" @submit.prevent="login">
        <h1>Авторизация</h1>
        <label>Логин</label>
        <input required v-model="username" type="text" placeholder="Введите логин">
        <br>
        <br>
        <label>Пароль</label>
        <input
          required
          v-model="password"
          autocomplete="password"
          type="password"
          placeholder="Введите пароль"
        >
        <p>
          <button type="submit">Login</button>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import cookies from "js-cookie";
export default {
  name: "login",
  methods: {
    login: function() {
      const { username, password } = this;
      if (username === "test" && password === "test") {
        cookies.set("aut", true);
        this.$router.push({ name: "map" });
      } else {
        alert("Неверные логин или пароль");
      }
    }
  },

  data: function() {
    return {
      username: "",
      password: ""
    };
  },
  
  beforeCreate() {
    this.$router.push({ name: "map" });
  }
};
</script>
