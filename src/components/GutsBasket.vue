<template>
    <h3 class="page-heading"> &nbsp;&nbsp; Metadata Basket</h3>

    <span v-if="basket.length == 0">
        <em>There are no items in your basket</em>
    </span>
    <b-container v-if="basket.length > 0">
        <b-row>
            <b-col cols="9">
                <b-card v-for="(item, index) in basket" :key="index" border-variant="dark" header-bg-variant="transparent" no-body class="mb-2 pt-1">
                    <template v-slot:header>
                    <b-row no-gutters>
                        <b-col align-h="center" align-v="center" md="1">
                        <span class="xxlfont"><i :class="'fas fa-' + String(index+1)"></i></span>
                        </b-col>
                        <b-col class="text-muted" md="6">
                            <h6 v-for="(value, key, idx) in item">
                                <span v-if="key != 'include_data_state'">
                                {{text_keys_multiple[key]}}:
                                <em>
                                    <span v-if="value.length == 0 || value === all_arrays[key]">
                                        all
                                    </span>
                                    <span v-else>
                                        <span v-for="val in value">{{val}}, </span>
                                    </span>
                                </em>
                                </span>
                            </h6>
                        </b-col>
                        <b-col md="4">
                            

                        </b-col>
                        <b-col md="1">
                            <b-button size="sm" variant="dark" @click="deleteBasketItemCheck(index)"><i class="fas fa-trash-can"></i></b-button>
                        </b-col>
                    </b-row>
                    </template>
                </b-card>

            </b-col>
            <b-col>
                <b-card style="border: 1px solid black; position: sticky; top: 20px;">
                    <b-card-title>Summary</b-card-title>
                    <b-card-text>Number of samples: {{basket_stats.samples.length}}</b-card-text>
                    <b-card-text>Number of participants: {{basket_stats.participants.length}}</b-card-text>
                    <b-card-text>Number of files: {{basket_stats.files.length}}</b-card-text>
                    <b-button variant="outline-dark" class="option-button push" v-b-modal.basket-checkout-modal><i class="fas fa-cart-arrow-down"></i> Checkout Basket</b-button>
                </b-card>

            </b-col>
        </b-row>
    </b-container>
</template>

<script setup>
    import { inject, computed } from 'vue'
</script>





