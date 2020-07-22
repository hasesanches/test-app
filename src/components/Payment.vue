<template>
    <div class="md-content create-payment">
        <form novalidate class="md-layout md-alignment-center-center" @submit.prevent="validatePayment">
            <md-card class="md-layout-item md-size-50 md-small-size-100">
                <md-card-header>
                    <div v-if="!form.id" class="md-title">Create payment</div>
                    <div v-if="form.id" class="md-title">Edit payment</div>
                </md-card-header>
                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div v-if="form.id" class="md-layout-item">
                            <md-datepicker v-model="form.createdAt">
                                <label>Select date</label>
                            </md-datepicker>
                        </div>
                        <div class="md-layout-item">
                            <md-field>
                                <label for="title">Title</label>
                                <md-input type="text" name="text" id="title" v-model="form.title"/>
                                <span class="md-error" v-if="!$v.form.title.required">The title is required</span>
                            </md-field>
                        </div>
                        <div class="md-layout-item">
                            <md-field>
                                <label for="prise">Prise</label>
                                <md-input type="number" name="number" id="prise" v-model="form.prise"/>
                                <span class="md-error" v-if="!$v.form.prise.required">The prise is required</span>
                            </md-field>
                        </div>
                    </div>
                    <div class="md-layout">
                        <md-field class="md-layout-item">
                            <label for="comment">Comment</label>
                            <md-textarea id="comment" v-model="form.comment"></md-textarea>
                            <span class="md-error" v-if="!$v.form.comment.required">The comment is required</span>
                        </md-field>
                    </div>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item">
                            <md-field>
                                <label for="invoice">invoice</label>
                                <md-input type="number" name="number" id="invoice" v-model="form.invoice"/>
                                <span class="md-error" v-if="!$v.form.invoice.required">The invoice is required</span>
                            </md-field>
                        </div>
                        <div class="md-layout-item">
                            <md-field>
                                <label for="bank">bank</label>
                                <md-input type="text" name="text" id="bank" v-model="form.bank"/>
                                <span class="md-error" v-if="!$v.form.bank.required">The bank is required</span>
                            </md-field>
                        </div>
                        <div v-if="form.id" class="md-layout-item">
                            <md-field>
                                <md-select v-model="form.status" name="status" id="status" placeholder="Status">
                                    <md-option value="progress">progress</md-option>
                                    <md-option value="complete">complete</md-option>
                                    <md-option value="abort">abort</md-option>
                                </md-select>
                            </md-field>
                        </div>
                    </div>
                </md-card-content>
                <md-card-actions>
                    <md-button type="submit" class="md-primary" :disabled="$v.$invalid">Отправить форму</md-button>
                </md-card-actions>
            </md-card>
        </form>
    </div>
</template>
<script>
    import {required} from 'vuelidate/lib/validators'

    export default {
        name: 'payment',
        metaInfo: {
            title: 'NORDCLAN',
            titleTemplate: '%s - Payment',
            htmlAttrs: {
                lang: 'en',
                amp: true
            }
        },
        data() {
            return {
                form: {
                    id: null,
                    createdAt: null,
                    id_user: null,
                    title: null,
                    prise: null,
                    comment: null,
                    invoice: null,
                    bank: null,
                    status: null
                }
            }
        },
        validations: {
            form: {
                title: {
                    required
                },
                prise: {
                    required
                },
                comment: {
                    required
                },
                invoice: {
                    required
                },
                bank: {
                    required
                }
            }
        },
        created: function () {
           this.form = this.$store.getters.getPayment;
        },
        methods: {
            clearForm() {
                this.$v.$reset();
                this.form = {
                    id: null,
                    id_user: null,
                    createdAt: null,
                    title: null,
                    prise: null,
                    comment: null,
                    invoice: null,
                    bank: null,
                    status: null
                }
            },
            validatePayment() {
                this.$v.$touch();

                if (!this.$v.$invalid) {
                    if (this.form.id) {
                        this.$store.dispatch('edit_payments', this.form)
                            .then(function () {
                                this.clearForm();
                                this.$router.push('/payments')
                            }.bind(this))
                            .catch(err => console.log(err))
                    } else {
                        this.$store.dispatch('add_payments', this.form)
                            .then(function () {
                                this.clearForm();
                                this.$router.push('/payments')
                            }.bind(this))
                            .catch(err => console.log(err))
                    }
                }
            }
        },
    }
</script>

<style scoped>
</style>