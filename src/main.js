import Vue from 'vue'
import VueMeta from 'vue-meta'
import Router from 'vue-router'
import moment from 'moment';
import VueMoment from 'vue-moment';
import Vuelidate from 'vuelidate'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import App from './App.vue'
import Home from './components/Home.vue'
import Payment from './components/Payment.vue'
import Payments from './components/Payments.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'

import store from './store'

require('moment/locale/ru');

Vue.use(VueMoment, {
    moment
});
Vue.use(Vuelidate);
Vue.use(VueMaterial);
Vue.use(Router);
Vue.use(VueMeta, {
    refreshOnceOnNavigation: true
});



// Vue.prototype.$http = Axios;
// Vue.prototype.$http.defaults.headers.common['Accept'] = 'application/json';

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/Register',
            name: 'Register',
            component: Register
        },
        {
            path: '/payment',
            name: 'Payment',
            component: Payment,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/payments',
            name: 'Payments',
            component: Payments,
            meta: {
                requiresAuth: true
            }
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isLoggedIn) {
            next();
            return
        }
        next('/login')
    } else {
        next()
    }
});

new Vue({
    el: '#app',
    render: h => h(App),
    store,
    router,
    moment,
});