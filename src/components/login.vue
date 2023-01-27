<template>
  <v-container fluid fill-height>
    <v-layout fill-height>
    <v-col class="text-xl-caption text-xs-body-2">
      <v-row justify="center">
        <v-img
          contain
          lazy-src="src/assets/images/pos.png"
          max-height="45"
          max-width="74"
          src="src/assets/images/pos.png">
        </v-img>
        <h1>Punto de venta</h1>
      </v-row>
      
      <v-row justify="center">
        
      <v-card max-width="350" title="Login" class="v-col-sm-6  bg-grey-lighten-4" elevation="2">
        <v-col justify="center" class="mt-0 pl-2 pr-2">

          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit" id="loginForm">
            <v-text-field ref="userinput"
              v-model="username"
              label="Email"
              :rules="emailRules">
            </v-text-field>
            
            <v-text-field
              v-model="password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.lowercaseEn, rules.uppercaseEn, rules.special, rules.number, rules.length]"
              :type="show1 ? 'text' : 'password'"
              name="password"
              label="Password"
              
              counter
              @click:append="show1 = !show1">
            </v-text-field>
            <v-row justify="end" class="mr-10 mt-6">
              <v-btn 
                type="submit" 
                form="loginForm" 
                class="mb-4"
                :disabled="!valid" 
                elevation="2" 
                @cklick="submit" 
                :loading="loading">Login</v-btn>
            </v-row>
          </v-form>
        </v-col>
      </v-card>
      </v-row>

      <v-row justify="center">
        <v-col cols="3" justify="center">
          <v-alert v-model="login_success" transition="fade-transition" class="mt-5"
            density="comfortable"
            type="success"
            variant="tonal">
            Access Granted
          </v-alert>
          <v-alert v-model="login_error" transition="fade-transition" class="mt-5"
            density="comfortable"
            type="warning"
            variant="tonal">
            Access Denied
          </v-alert>
        </v-col>
      </v-row>

    </v-col>

  </v-layout>
  </v-container>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import axios from 'axios'

export default defineComponent({
  name: 'login',
  

  data () {
      return {
        loader: null,
        loading: false,
        username: '',
        valid: false,
        otp: '',
        show1: false,
        password: '',
        login_success: false,
        login_error: false,
        rules: {
          uppercase: value => {
            //For non-latin letters also
            return (value && value.toLowerCase() !== value) || 'At least 1 letter'
          },
          uppercaseEn: value => {
            //For latin letters only
            return /[A-Z]/.test(value) || 'At least 1 uppercase letter (A-Z only)'
          },
          lowercaseEn: value => {
            //For latin letters only
            return /[a-z]/.test(value) || 'At least 1 lowercase letter (a-z only)'
          },
          number: value => {
            return /\d/.test(value) || 'At least 1 number'
          },
          special: value => {
            return /[!@#\$%\^&\*]/.test(value) || 'At least 1 special symbol'
          },
          length: value => {
            return (value && value.length >= 8) || 'Min password length: 8 symbols'
          }
        },
        emailRules: [
        v => !!v || 'E-mail is required as username',
        v => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
      ],
      }
    },
    watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]
        setTimeout(() => (this[l] = false), 1000)
        this.loader = null
      },
    },
    methods:{
      focusInit(){
        this.$refs.userinput.focus()
      },
      is_number(v){
        if(/^\d+$/.test(v)) return true
      },
      onlyleters(v){
        if(/^[A-Za-z]+$/.test(v)) return true
      },
      async submit(){
        this.loader = 'loading'
        const userdata = { username : this.username , password: this.password }
          await axios.post(import.meta.env.VITE_API_URL+'login', userdata)
          .then(res => {
            setTimeout(()=> {
              this.login_success=true
            },1000)

            localStorage.setItem('user-info', JSON.stringify(res.data))
            
            setTimeout(()=>{
              this.login_success=false
              let user = JSON.stringify(res.data)
              this.$router.push({name: 'home'})
            },2000)
          })
          .catch(err => { 
            
            setTimeout(()=>{
              this.login_error=false
              this.login_error=true
            },1000)
          })
      }
    },
    mounted(){
      
      this.focusInit()
      let user= localStorage.getItem('user-info')
      if(user){
        this.$router.push({name: 'home'})
      }
    }
})
</script>
