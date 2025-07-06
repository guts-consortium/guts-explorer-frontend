<template>
    <h3 class="page-heading">
        &nbsp;&nbsp; <v-icon>mdi-information</v-icon>&nbsp;Frequently Asked Questions
    </h3>
    <v-container style="padding-left: 0; padding-right: 0;">
        <span v-for="(faq, index) in faqs">
            <v-card>
                <v-card-title><em>{{ (index + 1) + ". " +  faq.question }}</em></v-card-title>
                <v-card-text>
                    {{ faq.answer }}
                </v-card-text>
            </v-card>
            <br>
        </span>
    </v-container>

</template>

<script setup>

const faqs = [
    {
        question: "Who can request data from GUTS?",
        answer: "Only researchers affiliated with GUTS can submit data requests.Login is required to enable basket checkout. If not yet registered as part of the GUTS collaboration, registration is possible by clicking the login button and following the prompts to register using your institutional email address."
    },
    {
        question: "What happens after I submit my data request?",
        answer: "After submission, the GUTS Steering Committee reviews the request. This evaluation should take no longer than three weeks on average. Once approved, the data manager will make the data available via Yoda."
    },
    {
        question: "How long does a data request take?",
        answer: "The review process generally takes up to three weeks. Data availability depends on approval."
    },
    {
        question: "How can I contact the GUTS Data Team?",
        answer: "For questions or support, contact the GUTS Data Management Team at: gutsdata@eur.nl"
    },
    {
        question: "How do I use the GUTS explorer?",
        answer: "(instructions to be added...)"
    }
]
</script>



