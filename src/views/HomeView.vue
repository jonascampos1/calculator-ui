<template>
  <v-app :theme="themeColor" id="inspire">
    <v-app-bar app
      flat
      color="grey-darken-3"
    >
      <v-container class="py-0 fill-height">
        <v-col justify="stretch">
          <v-avatar
            class="mr-2"
            color="grey-darken-1"
            size="40"
          ></v-avatar>
          <span>{{ userinfo.username }}</span>
        </v-col>
        <v-spacer></v-spacer>

        <v-responsive  max-width="120">
          <v-btn :loading="loading" @click="logout" prepend-icon="mdi-logout">Logout</v-btn>
        </v-responsive>
      </v-container>
    </v-app-bar>

    <v-main class="bg-main">
      <v-container fluid>
        <v-row>
          <v-col cols="12" lg="2" md="2" sm="3" class="py-0">
            <v-sheet rounded="xl">
              <v-list rounded="xl" density="compact">
                
                  <v-list-subheader>Operations</v-list-subheader>
                    <v-list-item value="records" @click="handleFunc('records')" active-color="red">
                      <template v-slot:prepend>
                        <v-icon size="xs" class="mr-2">mdi-view-list</v-icon>
                      </template>
                      <v-list-item-title>Records</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-for="(item, i) in menu_items"
                      :key="i"
                      :value="item.type"
                      active-color="red"
                      @click="handleFunc(item.type)"
                    >
                      <template v-slot:prepend>
                        <v-icon :icon="item.icon" size="xs" class="mr-2"></v-icon>
                      </template>

                    <v-list-item-title v-text="item.type"></v-list-item-title>
                  </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-col>
            <v-sheet
              rounded="xl"
            >
            
            <v-table fixed-header height="400" density="compact">
                <thead>
                  <tr>
                    <th width="10" class="text-left ma-0 pa-0">
                    </th>
                    <th width="30" class="text-left">
                      id
                    </th>
                    <th width="120" class="text-center">
                      Operation id
                    </th>
                    <th width="80" class="text-right">
                      User id
                    </th>
                    <th width="80" class="text-right">
                      Amount
                    </th>
                    <th width="100" class="text-right">
                      User balance
                    </th>
                    <th width="100" class="text-right">
                      Response
                    </th>
                    <th width="250" class="text-right">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in records"
                  >
                    
                    <td class="text-left ma-0 pa-1"><v-icon @click="deleteItem(index)" color="red">mdi-delete</v-icon></td>
                    <td>{{ item.id }}</td>
                    <td class="text-center">{{ item.operation_id }}</td>
                    <td class="text-right">{{ item.user_id }}</td>
                    <td class="text-right">{{ item.amount }}</td>
                    <td class="text-right">{{ item.user_balance }}</td>
                    <td class="text-right">{{ item.operation_response }}</td>
                    <td class="text-right">{{ item.date }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-sheet>
            <v-col> 
                <v-row justify="space-between" class="mt-1">
                  <v-btn color="red" @click="getRecords(`${userinfo.user_id}`)">Actualizar</v-btn>
                </v-row>
              </v-col>
            <v-footer color="transparent"  
              class="mt-3 pa-0" 
              rounded="xl">
                
            </v-footer>
          </v-col>
        </v-row>
        <v-snackbar
        v-model="snackbar"
        :timeout="snackbar_timeout"
        >
        {{ snackbar_msg }}

        <template v-slot:actions>
          <v-btn
            color="pink"
            variant="text"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
      </v-container>
    </v-main>
    <v-dialog width="450"
      v-model="msgWindow.show"
      transition="dialog-bottom-transition"
    >
      

      <v-card>
        <v-toolbar
              color="red"
              :title="msgWindow.title"
            ></v-toolbar>
        <v-card-text class="text-center">
          {{ msgWindow.msg }}
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="msgWindow.show = false">Entendido</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent } from 'vue'


export default defineComponent({
  name: 'test',
  
  data () {
      return {
        sel: 1,
        records: [{id: '', operation_id: '', user_id: '', amount: '', user_balance: '', operation_response: '', date: '' }],
        themeColor: 'light',
        msgWindow: {
          show: false,
          title: '',
          msg: ''
        },
        metodo_pago: 'efectivo',
        finded: false,
        snackbar: false,
        snackbar_msg: '',
        snackbar_timeout: 2000,
        userinfo: {username: '', user_id: ''},
        loader: null,
        loading: false,
        menu_items: [
          { type: 'addition', icon: 'mdi-plus-circle' },
          { type: 'substraction', icon: 'mdi-minus-circle' },
          { type: 'multiplication', icon: 'mdi-close-circle' },
          { type: 'division', icon: 'mdi-division-box' },
          { type: 'square_root', icon: 'mdi-square-root-box' },
          { type: 'random_string', icon: 'mdi-code-string' },
        ],
      
     }
  },
  methods:{
    logout(){
      this.loader = 'loading'
      localStorage.removeItem('user-info')
      setTimeout(()=>{
        this.$router.push({name: 'login'})
      },1000)
      
    },
    handleFunc(action: string){
      this.snackbar_msg=action
      this.snackbar=true
      switch(action){
        case 'records':{
          this.$router.push({name: 'home'})
          break
        }
        case 'addition':{
          this.$router.push({name: 'addition'})
          break
        }
        case 'substraction':{
          this.$router.push({name: 'substraction'})
          break
        }
        case 'multiplication':{
          this.$router.push({name: 'multiplication'})
          break
        }
        case 'division':{
          this.$router.push({name: 'division'})
          break
        }
        case 'square_root':{
          this.$router.push({name: 'square_root'})
          break
        }
        case 'random_string':{
          this.$router.push({name: 'random_string'})
          break
        }
        default:{
          this.$router.push({name: 'home'})
        }
      }
      
    },
    
    deleteItem(index: any) {
      alert(index)
    },
    check_scheme(){
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.themeColor = 'dark'
      }
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        const newColorScheme = event.matches ? "dark" : "light";
          this.themeColor = newColorScheme
      })
    },
    
    async getRecords(user_id: any){
      this.records = []
      await axios.post(import.meta.env.VITE_API_URL+'operations/'+user_id)
      .then(res => {
        res.data.forEach(item => {
          this.records.push(item)
        })
      })
      .catch(err => { 
            alert(err)
          })
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
  mounted(){
    this.check_scheme()
    let user = localStorage.getItem('user-info')
    if(user){
      this.userinfo = JSON.parse(user)
      this.getRecords(this.userinfo.user_id)
    }
  },
  beforeCreate(){
    let usercheck = localStorage.getItem('user-info')
    if(!usercheck){
      this.$router.push({ name: 'login' })
    }else{
      this.userinfo = JSON.parse(usercheck)
    }
  }
})
</script>
<style>
.bg-main{
  background: var(--color-background-mute);
}
.v-table thead tr {
    font-size: 11px !important;
}
</style>