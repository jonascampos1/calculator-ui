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
          <span> - Balance: <v-icon icon="mdi-credit-card"></v-icon> ${{ balance }}</span>
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
            <v-sheet rounded="xl">
              <v-row justify="center">
                <h1 class="ml-5">Multiplication</h1>
              </v-row>
              <v-row justify="center"><h5 class="ml-5">Cost: {{ cost }} </h5></v-row>
              <v-row justify="center">
                <v-card width="300" variant="flat">
                  <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="check_Balance" id="opForm">
                    <v-row class="ma-1">
                      <v-text-field width="100"
                        class="mr-1" 
                        ref="v1" 
                        variant="outlined" 
                        v-model="v1" 
                        :rules="[rules.number, rules.required]" 
                        hint="Valid number">
                      </v-text-field>
                      <h1>*</h1>
                      <v-text-field 
                        class="ml-1" 
                        variant="outlined" 
                        v-model="v2" 
                        :rules="[rules.number, rules.required]" 
                        hint="Valid number">
                      </v-text-field>
                      
                    </v-row>
                    <v-col>
                        <h1>Result: {{ result }}</h1>
                      </v-col>
                  </v-form>
                </v-card>
              </v-row>
            </v-sheet>
            
            <v-footer color="transparent"  
              class="mt-3 pa-0" 
              rounded="xl">
              <v-col> 
              <v-row justify="space-between" class="mt-2">
                <v-btn form="opForm" :disabled="!valid" :loading="loadingOp" color="red" @click="check_Balance">Make operation</v-btn>
              </v-row>
            </v-col>
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
          <v-btn color="primary" block @click="msgWindow.show = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent } from 'vue'


export default defineComponent({
    name: "test",
    data() {
        return {
            cost: 0,
            balance: "0",
            result: "0",
            valid: false,
            v1: 0,
            v2: 0,
            themeColor: "light",
            msgWindow: {
                show: false,
                title: "",
                msg: ""
            },
            snackbar: false,
            snackbar_msg: "",
            snackbar_timeout: 2000,
            userinfo: { username: "", user_id: "" },
            loader: null,
            loading: false,
            loadingOp: false,
            menu_items: [
                { type: "addition", icon: "mdi-plus-circle" },
                { type: "substraction", icon: "mdi-minus-circle" },
                { type: "multiplication", icon: "mdi-close-circle" },
                { type: "division", icon: "mdi-division-box" },
                { type: "square_root", icon: "mdi-square-root-box" },
                { type: "random_string", icon: "mdi-code-string" },
            ],
            rules: {
                number: (value: any) => {
                    return /^[0-9]*$/.test(value) || "Only numbers";
                },
                required: (v: any) => !!v || "Number is required",
            }
        };
    },
    methods: {
      async getCost(operation: any) {
        await axios.post(import.meta.env.VITE_API_URL + "operations/cost/" + operation)
            .then(res => {
              this.cost=res.data.cost
        })
        .catch(err => {
          console.log('No cost')
        })
      },
      async check_Balance(){
        const data = {
            operation: 'multiplication',
            user_id: this.userinfo.user_id
        }
        await axios.post(import.meta.env.VITE_API_URL + "checkbalance", data)
          .then(res => {
            if(res.data.check){
              this.getResult()
            }else{
              this.msgWindow.msg="Credit not enough for this operation"
              this.msgWindow.title="Error"
              this.msgWindow.show= true
            }
        })
        .catch(err => {
          this.msgWindow.msg="Error trying to get the operation cost"+err
          this.msgWindow.title="Error"
          this.msgWindow.show= true
        })
      },
      async getResult() {
          (this.loader as any) = "loadingOp";
          const data = {
              v1: Number(this.v1),
              v2: Number(this.v2),
              user_id: Number(this.userinfo.user_id)
          }
          await axios.post(import.meta.env.VITE_API_URL + "mult", data)
              .then(res => {
              this.result = res.data.result;
              this.snackbar_msg = res.data.result;
              this.snackbar = true;
              this.balance = res.data.user_balance;
              sessionStorage.setItem('balance',this.balance)
          })
              .catch(err => {
          });
      },
      focusInit() {
          (this.$refs.v1 as any).focus();
      },
      logout() {
          (this.loader as any) = "loading";
          sessionStorage.removeItem("user-info");
          setTimeout(() => {
              this.$router.push({ name: "login" });
          }, 1000);
      },
      handleFunc(action: string) {
        this.snackbar_msg = action;
        this.snackbar = true;
        switch (action) {
          case "records": {
              this.$router.push({ name: "home" });
              break;
          }
          case "addition": {
              this.$router.push({ name: "addition" });
              break;
          }
          case "substraction": {
              this.$router.push({ name: "substraction" });
              break;
          }
          case "multiplication": {
              this.$router.push({ name: "multiplication" });
              break;
          }
          case "division": {
              this.$router.push({ name: "division" });
              break;
          }
          case "square_root": {
              this.$router.push({ name: "square_root" });
              break;
          }
          case "random_string": {
              this.$router.push({ name: "random_string" });
              break;
          }
          default: {
              this.$router.push({ name: "home" });
          }
        }
      },
      check_scheme() {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            this.themeColor = "dark";
        }
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => {
          const newColorScheme = event.matches ? "dark" : "light";
          this.themeColor = newColorScheme;
        });
      }
    },
    watch: {
        loader() {
            const l = this.loader;
            this[l] = !this[l];
            setTimeout(() => (this[l] = false), 1000);
            this.loader = null;
        },
    },
    mounted() {
        this.focusInit();
        this.check_scheme();
        let user = sessionStorage.getItem("user-info");
        if (user) {
            this.userinfo = JSON.parse(user);
        }
        let balance = sessionStorage.getItem("balance");
        if (balance) {
            this.balance = balance;
        }
    },
    beforeCreate() {
        let usercheck = sessionStorage.getItem("user-info");
        if (!usercheck) {
            this.$router.push({ name: "login" });
        }
        else {
            this.userinfo = JSON.parse(usercheck);
        }
    },
    created(){
      this.getCost('multiplication')
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