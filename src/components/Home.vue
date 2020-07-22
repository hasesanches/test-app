<template>
    <div class="md-content home">
        <h1>{{title}}</h1>
        <p>{{description}}</p>
    </div>
</template>
<script>
    export default {
        name: 'home',
        metaInfo: {
            title: 'NORDCLAN',
            titleTemplate: '%s - Home',
            htmlAttrs: {
                lang: 'en',
                amp: true
            }
        },

        data () {
            return {
                title: 'Welcome to Home page',
                description: 'Is project NORDCLAN test app'
            }
        }
    }
</script>

<style scoped>
    .md-content.home{
        text-align: center;
        margin: 100px auto;
    }
</style>