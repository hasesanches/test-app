<template>
    <div class="md-content payments">
        <md-progress-spinner v-if="!paymentsSuccess" md-mode="indeterminate"></md-progress-spinner>
        <div class="md-title" v-if="paymentsError">Error load payments</div>
        <md-table v-if="paymentsSuccess" md-height="100%" :value="payments" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                    <h1 class="md-title">Payments</h1>
                </div>

                <md-field md-clearable class="md-toolbar-section-end">
                    <md-input placeholder="Search by title, prise, comment, invoice, bank" v-model="search"/>
                </md-field>
                <md-field class="md-toolbar-section-end">
                    <label>Show payments with status only</label>
                    <md-select v-model="status" name="status" id="status" placeholder="Status">
                        <md-option value="all">all</md-option>
                        <md-option value="progress">progress</md-option>
                        <md-option value="complete">complete</md-option>
                        <md-option value="abort">abort</md-option>
                    </md-select>
                </md-field>
                <md-field class="md-toolbar-section-end">
                    <label>Show payments with an amount higher</label>
                    <md-select v-model="prise" name="prise" id="prise" placeholder="Prise">
                        <md-option value="0">All</md-option>
                        <md-option value="500">500</md-option>
                        <md-option value="1000">1000</md-option>
                        <md-option value="1500">1500</md-option>
                        <md-option value="2000">2000</md-option>
                    </md-select>
                </md-field>
            </md-table-toolbar>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <!--<md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>-->
                <md-table-cell md-label="Date created" md-sort-by="createdAt">{{ item.createdAt | moment("dddd, MMMM Do YYYY, h:mm:ss") }}</md-table-cell>
                <md-table-cell md-label="Title" md-sort-by="title">{{ item.title }}</md-table-cell>
                <md-table-cell md-label="Prise" md-sort-by="prise">{{ item.prise }}</md-table-cell>
                <md-table-cell md-label="Comment" md-sort-by="comment">{{ item.comment }}</md-table-cell>
                <md-table-cell md-label="Invoice" md-sort-by="invoice">{{ item.invoice }}</md-table-cell>
                <md-table-cell md-label="Bank" md-sort-by="bank">{{ item.bank }}</md-table-cell>
                <md-table-cell md-label="Status" md-sort-by="status">{{ item.status }}</md-table-cell>
                <md-table-cell md-label="Action">
                    <md-button type="submit" class="md-primary" v-on:click="editPayment(item)">Edit</md-button>
                    <md-button type="submit" class="md-primary" v-on:click="deletePayment(item)">Delete</md-button>
                </md-table-cell>
            </md-table-row>
        </md-table>
    </div>
</template>
<script>
    const toLower = text => {
        return text.toString().toLowerCase()
    };

    const search = (items, text, status, prise) => {
        if (status !== 'all') {
            items = items.filter(function (element) {
                return element.status === status;
            });
        }

        if (+prise !== 0) {
            items = items.filter(function (element) {
                return +element.prise >= +prise;
            });
        }

        if (text) {
            return items.filter(function (element) {
                let search = [element.title, element.prise, element.comment, element.invoice, element.bank];

                return !!search.filter(function (item) {
                    return toLower(item).includes(toLower(text));
                }).length
            });
        }

        return items
    };

    export default {
        name: 'payments',
        metaInfo: {
            title: 'NORDCLAN',
            titleTemplate: '%s - List Payments',
            htmlAttrs: {
                lang: 'en',
                amp: true
            }
        },
        data: () => ({
            search: null,
            status: 'all',
            prise: 0
        }),
        computed: {
            paymentsSuccess: function () {
                return this.$store.getters.paymentsStatus === 'success';
            },
            paymentsError: function () {
                return this.$store.getters.paymentsStatus === 'error';
            },
            payment() {
                return this.$store.getters.getPayment
            },
            payments() {
                return search(this.$store.getters.getPayments, this.search, this.status, this.prise);
            }
        },
        methods: {
            deletePayment(item) {
                this.$store.dispatch('delete_payments', item);
            },
            editPayment(payment) {
                this.$store.commit('set_payment_edit', payment);
                this.$router.push('/payment')
            },
        }
    }
</script>

<style scoped>
</style>