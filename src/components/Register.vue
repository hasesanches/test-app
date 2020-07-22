<template>
    <div class="md-content register">
        <form novalidate class="md-layout md-alignment-center-center" @submit.prevent="register">
            <md-card class="md-layout-item md-size-50 md-small-size-100">
                <md-card-header>
                    <div class="md-title">Register Users</div>
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
                        <span class="md-error" v-else-if="!$v.form.password.minLength">Password must have at least {{ $v.form.password.$params.minLength.min }} letters</span>
                    </md-field>
                    <md-field>
                        <label for="password">Confirm Password</label>
                        <md-input type="password" name="password" id="password_confirmation" v-model="form.password_confirmation"/>
                        <span class="md-error" v-if="!$v.form.password_confirmation.required">The password is required</span>
                        <span class="md-error" v-else-if="!$v.form.password_confirmation.sameAs">Passwords must be identical</span>
                    </md-field>
                    <md-field>
                        <label for="name">Name</label>
                        <md-input type="text" name="name" id="name" v-model="form.name"/>
                        <span class="md-error" v-if="!$v.form.name.required">The name is required</span>
                        <span class="md-error" v-else-if="!$v.form.name.maxLength">The name cannot have more {{ $v.form.name.$params.minLength.min }} letters</span>
                        <span class="md-error" v-else-if="!$v.form.name.minLength">Passwords must be identical</span>
                    </md-field>
                </md-card-content>

                <md-card-actions>
                    <md-button type="submit" class="md-primary" :disabled="$v.$invalid">Register</md-button>
                </md-card-actions>
            </md-card>
        </form>
    </div>
</template>
<script>
    import {email, maxLength, minLength, required, sameAs} from 'vuelidate/lib/validators'

    export default {
        name: 'payment',
        metaInfo: {
            title: 'NORDCLAN',
            titleTemplate: '%s - Register',
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
                    password_confirmation: null,
                    name: null,
                    is_admin: false
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
                },
                password_confirmation: {
                    required,
                    sameAs: sameAs(function () {
                        return this.form.password
                    })
                },
                name: {
                    required,
                    minLength: minLength(4),
                    maxLength: maxLength(30),
                },
            }

        },
        methods: {
            clearForm() {
                this.$v.$reset();
                this.form.email = null;
                this.form.password = null;
                this.form.password_confirmation = null;
                this.form.name = null;
            },
            register: function () {
                this.$v.$touch();

                if (!this.$v.$invalid) {
                    this.$store.dispatch('register', Object.assign({}, this.form))
                        .then(function () {
                            this.clearForm();
                            this.$router.push('/')
                            this.$store.dispatch('load_data');
                        }.bind(this))
                        .catch(err => console.log(err))
                }
            }
        }
    }
</script>

<style scoped>
</style>