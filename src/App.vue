<template>
    <div id="app">
        <md-toolbar class="md-accent" md-elevation="1">
            <h3 class="md-title" style="flex: 1">NORDCLAN Test App</h3>
            <span v-if="isLoggedIn">All prise {{getUser.prise}} $</span>

            <router-link to="/">
                <md-button class="md-primary">Home</md-button>
            </router-link>

            <router-link v-if="!isLoggedIn" to="/login">
                <md-button class="md-primary">login</md-button>
            </router-link>
            <router-link v-if="!isLoggedIn" to="/register">
                <md-button class="md-primary">Register</md-button>
            </router-link>

            <a v-if="isLoggedIn" @click="clear_payment">
                <md-button class="md-primary">Create Payment</md-button>
            </a>
            <router-link v-if="isLoggedIn" to="/payments">
                <md-button>Payments</md-button>
            </router-link>
            <a v-if="isLoggedIn" @click="logout">
                <md-button>Logout</md-button>
            </a>
        </md-toolbar>

        <router-view/>
    </div>

</template>
<div></div>
<script>
    export default {
        created: function () {
            if (this.$store.getters.isLoggedIn) {
                this.$store.dispatch('load_data')
            }
        },
        computed: {
            console: () => console,
            window: () => window,
            getUser: function () {
                return this.$store.getters.getUser;
            },
            isLoggedIn: function () {
                return this.$store.getters.isLoggedIn;
            }
        },
        methods: {
            clear_payment: function () {
                this.$store.dispatch('clear_payment_edit')
                    .then(function () {
                        if (this.$router.history.current.path !== '/payment') this.$router.push('/payment')
                    }.bind(this));
            },
            logout: function () {
                this.$store.dispatch('logout')
                    .then(function () {
                        this.$router.push('/login')
                    }.bind(this));
            }
        },
    }
</script>
<style>
    .md-field .md-error {
        opacity: 1;
        bottom: -25px;
        color: red;
    }

    .md-display-1 {
        text-align: center;
    }

    .md-content {
        /*text-align: center;*/
        min-height: 86px;
        padding: 16px;
        position: relative;
        border-top: 0;
    }
</style>