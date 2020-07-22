import Vuex from "vuex";
import Axios from 'axios'
import Vue from "vue";
import moment from 'moment';

Vue.use(Vuex);

let payment = {
    id: null,
    createdAt: null,
    id_user: null,
    title: null,
    prise: null,
    comment: null,
    invoice: null,
    bank: null,
    status: null
};

export default new Vuex.Store({
    state: {
        status: '',
        status_payments: '',
        token: localStorage.getItem('token') || '',
        user: {},
        payments: [],
        payment: payment
    },
    mutations: {
        auth_request(state) {
            state.status = 'loading'
        },
        auth_success(state, user) {
            console.log('auth_success', user);
            state.status = 'success';
            state.token = user.token;
            state.user = user;
            state.user.prise = 0;
        },
        auth_error(state) {
            state.status = 'error';
        },
        logout(state) {
            state.status = '';
            state.token = '';
        },
        set_users(state, users) {
            state.users = users;
        },
        set_payments_request(state) {
            state.status_payments = 'loading'
        },
        set_payments(state, payments) {
            state.status_payments = 'success';
            state.payments = payments;

            state.user.prise = 0;
            state.payments.forEach(function (item, index, array) {
                if (item.id_user === state.user.id) {
                    state.user.prise += +item.prise;
                }
                item.user = state.users.filter(function (user) {
                    return item.id_user === user.id
                })[0]
            });
        },
        set_payments_error(state) {
            state.status_payments = 'error';
        },
        set_payment_edit(state, payment) {
            state.payment = payment;
        },
        clear_payment_edit(state) {
            state.payment = payment;
        },
        add_payment(state, payment) {
            state.payments.push(payment);

            state.user.prise = 0;
            state.payments.forEach(function (item, index, array) {
                if (item.id_user === state.user.id) state.user.prise += +item.prise;
                item.user = state.users.filter(function (user) {
                    return item.id_user === user.id
                })[0]
            });
        },
        delete_payments(state, payment) {
            let index = state.payments.map(item => item.id).indexOf(payment.id);
            if (index !== -1) state.payments.splice(index, 1);

            state.user.prise = 0;
            state.payments.forEach(function (item, index, array) {
                if (item.id_user === state.user.id) {
                    state.user.prise += +item.prise;
                }
                item.user = state.users.filter(function (user) {
                    return item.id_user === user.id
                })[0]
            });
        },
        edit_payments(state, payment) {
            let index = state.payments.map(item => item.id).indexOf(payment.id);
            if (index !== -1) state.payments[index] = payment;

            state.user.prise = 0;
            state.payments.forEach(function (item, index, array) {
                if (item.id_user === state.user.id) state.user.prise += +item.prise;
                item.user = state.users.filter(function (user) {
                    return item.id_user === user.id
                })[0]
            });
        }
    },
    actions: {
        load_data({commit, state}) {
            return new Promise((resolve, reject) => {
                Axios({url: 'https://5f1046a700d4ab0016134b25.mockapi.io/user', method: 'GET'})
                    .then(resp => {
                        let users = resp.data;
                        let user = users.find(u => u.token === state.token);

                        Axios({url: 'https://5f1046a700d4ab0016134b25.mockapi.io/payments', method: 'GET'})
                            .then(resp => {
                                let payments = resp.data;

                                commit('auth_success', user);
                                commit('set_users', users);
                                commit('set_payments', payments);
                                resolve()
                            })
                            .catch(err => {
                                commit('set_payments_error', err);
                                reject(err)
                            })
                    })
                    .catch(err => {
                        commit('auth_error');
                        reject(err)
                    });
            })
        },
        add_payments({commit, state}, payment) {
            return new Promise((resolve, reject) => {
                payment.createdAt = moment().valueOf();
                payment.status = 'progress';
                payment.id_user = state.user.id;
                Axios({url: 'https://5f1046a700d4ab0016134b25.mockapi.io/payments', data: payment, method: 'POST'})
                    .then(resp => {
                        console.log('add_payment', resp.data);
                        commit('add_payment', resp.data);
                        resolve(resp)
                    })
                    .catch(err => {
                        commit('set_payments_error', err);
                        reject(err)
                    })
            })
        },
        delete_payments({commit, state}, payment) {
            return new Promise((resolve, reject) => {

                Axios({url: 'https://5f1046a700d4ab0016134b25.mockapi.io/payments/' + payment.id, method: 'DELETE'})
                    .then(resp => {
                        commit('delete_payments', payment);
                        resolve(resp)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        edit_payments({commit, state}, payment) {
            return new Promise((resolve, reject) => {

                Axios({url: 'https://5f1046a700d4ab0016134b25.mockapi.io/payments/' + payment.id, data: payment, method: 'PUT'})
                    .then(resp => {
                        commit('edit_payments', payment);
                        resolve(resp)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        clear_payment_edit({commit}) {
            return new Promise((resolve, reject) => {
                commit('clear_payment_edit', payment);
                resolve()
            })
        },
        login({commit}, data) {
            return new Promise((resolve, reject) => {
                commit('auth_request');

                Axios({url: 'https://5f1046a700d4ab0016134b25.mockapi.io/user', method: 'GET'})
                    .then(resp => {

                        commit('set_users', resp.data);

                        let user = resp.data.find(function (item) {
                            // console.log(CryptoJS.AES.encrypt(data.password, "42709472039").toString(), item.password, CryptoJS.AES.decrypt(item.password, "42709472039").toString());

                            return item.email === data.email && item.password === data.password
                        });
                        if (!user) {
                            commit('auth_error');
                            return reject();
                        }
                        localStorage.setItem('token', user.token);
                        commit('auth_success', user);
                        resolve(resp)
                    })
                    .catch(err => {
                        commit('auth_error');
                        localStorage.removeItem('token');
                        reject(err)
                    })
            })
        },
        register({commit}, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request');

                user.token = Math.random(0).toString(16).substr(2);
                // user.password = CryptoJS.AES.encrypt(user.password, "42709472039").toString();
                delete user.password_confirmation;

                Axios({url: 'https://5f1046a700d4ab0016134b25.mockapi.io/user', data: user, method: 'POST'})
                    .then(resp => {
                        localStorage.setItem('token', resp.data.token);
                        commit('auth_success', resp.data);
                        resolve(resp)
                    })
                    .catch(err => {
                        commit('auth_error', err);
                        localStorage.removeItem('token');
                        reject(err)
                    })
            })
        },
        logout({commit}) {
            return new Promise((resolve, reject) => {
                commit('logout');
                localStorage.removeItem('token');
                resolve()
            })
        }
    },
    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
        paymentsStatus: state => state.status_payments,
        getUser: state => state.user,
        getPayments: state => state.payments,
        getPayment: state => state.payment,
    }
});