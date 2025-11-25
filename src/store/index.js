import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from '@/store/modules/user'
import router from '@/store/modules/router'
 
Vue.use(Vuex)
 
const store = new Vuex.Store({
    modules: {
        user,
        router
    },
    getters
})
 
export default store;