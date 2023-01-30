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
          uppercase: (value: any) => {
            //For non-latin letters also
            return (value && value.toLowerCase() !== value) || 'At least 1 letter'
          },
          uppercaseEn: (value: any) => {
            //For latin letters only
            return /[A-Z]/.test(value) || 'At least 1 uppercase letter (A-Z only)'
          },
          lowercaseEn: (value: any) => {
            //For latin letters only
            return /[a-z]/.test(value) || 'At least 1 lowercase letter (a-z only)'
          },
          number: (value: any) => {
            return /\d/.test(value) || 'At least 1 number'
          },
          special: (value: any) => {
            return /[!@#\$%\^&\*]/.test(value) || 'At least 1 special symbol'
          },
          length: (value: any) => {
            return (value && value.length >= 8) || 'Min password length: 8 symbols'
          }
        },
        emailRules: [
        (v: any) => !!v || 'E-mail is required as username',
        (v: any) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
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
        (this.$refs.userinput as any).focus()
      },
      is_number(v: any){
        if(/^\d+$/.test(v)) return true
      },
      onlyleters(v: any){
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
            const user = JSON.stringify(res.data)
            sessionStorage.setItem('user-info', user)
            
            setTimeout(()=>{
              this.login_success=false
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
      let user= sessionStorage.getItem('user-info')
      if(user){
        this.$router.push({name: 'home'})
      }
    }
})
</script>