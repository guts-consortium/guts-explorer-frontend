<template>
    <h3 class="page-heading"> &nbsp;&nbsp; Metadata Basket</h3>

    <span v-if="basket.length == 0">
        <em>There are no items in your basket</em>
    </span>
    <v-container v-if="basket.length > 0">
        <v-row>
            <v-col cols="9">
            <v-card
                v-for="(item, index) in basket"
                :key="index"
                class="mb-2 pt-1"
                outlined
            >
                <v-card-title>
                <v-row no-gutters>
                    <v-col align="center" cols="1">
                    <v-icon class="xxlfont">{{ 'mdi-numeric-' + String(index + 1) + '-box-multiple-outline' }}</v-icon>
                    </v-col>
                    <v-col class="text-muted" cols="6">
                    <h6 v-for="(val, key) in item" :key="key">
                        <span v-if="key != 'include_data_state'">
                        {{ textKeysMultiple[key] }}:
                        <em>
                            <span v-if="val.length == 0 || val === all_arrays[key]">
                            all
                            </span>
                            <span v-else>
                            <span v-for="(v, idx) in val" :key="idx">{{ v }}, </span>
                            </span>
                        </em>
                        </span>
                    </h6>
                    </v-col>
                    <v-col cols="4"></v-col>
                    <v-col cols="1">
                    <v-btn
                        small
                        color="dark"
                        @click="deleteBasketItemCheck(index)"
                    >
                        <v-icon class="xxlfont">mdi-trash-can</v-icon>
                    </v-btn>
                    </v-col>
                </v-row>
                </v-card-title>
            </v-card>
            </v-col>
            <v-col>
            <v-card style="border: 1px solid black; position: sticky; top: 20px;">
                <v-card-title>Summary</v-card-title>
                <v-card-text>
                Number of samples: {{ basketStats.samples.length }}
                </v-card-text>
                <v-card-text>
                Number of participants: {{ basketStats.participants.length }}
                </v-card-text>
                <v-card-text>Number of files: {{ basketStats.files.length }}</v-card-text>
                <v-btn outlined color="dark" class="option-button push" @click="checkoutBasket">
                <v-icon class="fas fa-cart-arrow-down"></v-icon>
                Checkout Basket
                </v-btn>
            </v-card>
            </v-col>
        </v-row>
    </v-container>

    <v-dialog
        v-model="showCheckout"
        max-width="600px"
        @click:outside="resetCheckoutModal"
    >
        <v-card>
        <v-card-title class="headline">Basket Checkout</v-card-title>
        <form @submit.prevent="handleCheckoutSubmit">
            <v-card-text>
                <em>
                Please complete the following information to create a data request
                (currently only GUTS researchers can request data). This information
                will be attached to the metadata file. Once you have downloaded the file,
                please send it via email to <a href="mailto:guts@example.com">guts@example.com</a>.
                The GUTS Steering Committee will evaluate your request. Once approved,
                the data manager will make the data available to you via YODA.
                <br /><br />
                Note that in future, we plan to include functionality to directly request
                data via this form.
                </em>
                <br /><br />
                
                    <v-text-field
                        v-model="name"
                        label="Name"
                        :rules="[v => !!v || 'Name is required']"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="affiliation"
                        label="Affiliation"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="email"
                        label="Email address"
                        required
                        type="email"
                    ></v-text-field>
                    <v-text-field
                        v-model="members"
                        label="Project members"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="title"
                        label="Project title"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="description"
                        label="Project description"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="date"
                        label="Access data until"
                        required
                        type="date"
                    ></v-text-field>
                    <v-textarea
                        v-model="comments"
                        label="Additional comments"
                        rows="3"
                        required
                    ></v-textarea>
                    <v-checkbox
                        v-model="status"
                        label="I am aware of and accept the data use policy"
                        :true-value="'accepted'"
                        :false-value="'not_accepted'"
                        required
                    ></v-checkbox>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" color="primary">OK</v-btn>
                <v-btn color="secondary" @click="cancelCheckout">Cancel</v-btn>
            </v-card-actions>
        </form>
        </v-card>
    </v-dialog>

    <v-dialog v-model="showDeleteItemModal" max-width="500px">
        <v-card>
        <v-card-title>Delete basket item?</v-card-title>
        <v-card-text class="text-center">
            <h3>Are you sure you want to delete this item from your basket?</h3>
        </v-card-text>
        <v-card-actions>
            <v-btn text="Cancel" @click="hideDeleteItemModal"></v-btn>
            <v-btn text="Delete Item" @click="deleteBasketItemLocal"></v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { inject, computed, ref } from 'vue'
    import { downloadArrayAsFormat } from '@/modules/utils.js'

    const textKeysMultiple =  {
        "cohort": "Cohorts",
        "data_category": "Data categories",
        "session": "Sessions",
        "data_type": "Data types",
        "age": "Ages",
        "short_name": "Short names",
        "state": "Data states",
    }

    const showCheckout = ref(false)
    const showDeleteItemModal = ref(false)

    const all_arrays = inject('all_arrays')
    const participant_measures = inject('participant_measures')
    const getBasketStats = inject('getBasketStats')
    const deleteBasketItem = inject('deleteBasketItem')
    const file_metadata = inject('file_metadata')
    const basket = inject('basket')

    const name = ref(null)
    const affiliation = ref(null)
    const email = ref(null)
    const members = ref(null)
    const title = ref(null)
    const description = ref(null)
    const date = ref(null)
    const comments = ref(null)
    const status = ref(false)

    const item_index_to_delete = ref(null)

    

    const basketStats = computed(() => {
        return getBasketStats(participant_measures.value, file_metadata.value)
    });

    function cancelCheckout() {
        resetCheckoutModal()
        showCheckout.value = false
    }

    function resetCheckoutModal() {
        name.value = null
        affiliation.value = null
        email.value = null
        members.value = null
        title.value = null
        description.value = null
        date.value = null
        comments.value = null
        status.value = false
    }
    
    function handleCheckoutSubmit() {
        // Push the name to submitted names
        var dl_object = {
            person: {
                name: name.value,
                affiliation: affiliation.value,
                email: email.value,
                members: members.value,
                title: title.value,
                description: description.value,
                date: date.value,
                comments: comments.value,
                status: status.value
            },
            files: basketStats.value.files
        }
        downloadArrayAsFormat(dl_object, "json", "my_guts_basket")
        // Hide the modal manually
        // this.$nextTick(() => {
        //     this.$bvModal.hide('basket-checkout-modal')
        // })

        showCheckout.value = false

    }

    function checkoutBasket() {
        showCheckout.value = true
    }

    function hideDeleteItemModal() {
        item_index_to_delete.value = null
        showDeleteItemModal.value = false
    }

    function deleteBasketItemCheck(index) {
        item_index_to_delete.value = index;
        showDeleteItemModal.value = true
    }

    function deleteBasketItemLocal() {
        deleteBasketItem(item_index_to_delete.value)
        showDeleteItemModal.value = false
    }

</script>





