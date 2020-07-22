<template>
    <div class="md-content login">
        <form novalidate class="md-layout md-alignment-center-center" @submit.prevent="login">
            <md-card class="md-layout-item md-size-50 md-small-size-100">
                <md-card-header>
                    <div class="md-title">Users</div>
                </md-card-header>
                <md-card-content>
                    <md-field>
                        <label for="email">Email</label>
                        <md-input type="email" name="email" id="email" v-model="form.email"/>
                        <span class="md-error" v-if="!$v.form.email.required">The email is required</span>
                        <span class="md-error" v-else-if="!$v.form.email.email">Invalid email</span>
                    </md-field>
                    <md-field>
                        <label for="password">Password</label>
                        <md-input type="password" name="password" id="password" v-model="form.password"/>
                        <span class="md-error" v-if="!$v.form.password.required">The password is required</span>
                        <span class="md-error" v-else-if="!$v.form.password.minLength">minLength password</span>
                    </md-field>
                </md-card-content>

                <md-card-actions>
                    <md-button type="submit" class="md-primary" :disabled="$v.$invalid">Login</md-button>
                </md-card-actions>
            </md-card>
        </form>
    </div>
</template>
<script>
    import {email, minLength, required} from 'vuelidate/lib/validators'

    export default {
        name: 'payment',
        metaInfo: {
            title: 'NORDCLAN',
            titleTemplate: '%s - login',
            htmlAttrs: {
                lang: 'en',
                amp: true
            }
        },
        data() {
            return {
                form: {
                    email: null,
                    password: null,
                    name: null,
                }
            }
        },
        validations: {
            form: {
                email: {
                    required,
                    email
                },
                password: {
                    required,
                    minLength: minLength(8),
                }
            }

        },
        methods: {
            clearForm() {
                this.$v.$reset();
                this.form.email = null;
                this.form.password = null;
                this.form.name = null;
            },
            login() {
                this.$v.$touch();

                if (!this.$v.$invalid) {
                    this.$store.dispatch('login', Object.assign({}, this.form))
                        .then(function () {
                            this.clearForm();
                            this.$router.push('/');
                            this.$store.dispatch('load_data');
                        }.bind(this))
                        .catch(err => console.log(err))
                }
            }
        },
    }
</script>

<style scoped>

</style>