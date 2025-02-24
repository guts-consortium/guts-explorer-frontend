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
                        <span v-if="['include_data_state', 'added_from'].indexOf(key) < 0">
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
                <v-card-text>Total size: {{ formatBytes(basketSize) }}</v-card-text>
                
                <v-btn outlined color="dark" class="option-button push" @click="checkoutBasket">
                <v-icon class="fas fa-cart-arrow-down"></v-icon>
                Checkout Basket
                </v-btn>
            </v-card>
            </v-col>
            
        </v-row>
        <!-- <v-row>
            <br>
            <span v-for="f in basketStats.filenames">{{ f }} <br></span>
        </v-row> -->
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

    <v-dialog
        v-model="showLoginModal"
        max-width="500px"
        @click:outside="resetLoginModal">
        <RegisterLogin @close-dialog="resetLoginModal" :key="`input-${Date.now()}`"</RegisterLogin>
    </v-dialog>

    <v-dialog
        v-model="showCheckoutSuccess"
        max-width="500px"
        @click:outside="resetCheckoutSuccess">
        <v-card>
            <v-card-title>Data Access Requested!</v-card-title>
            <v-card-text>
                Your data access request has been submitted and will be
                reviewed by GUTS Data Management Team. Please monitor your inbox
                for further communication.
            </v-card-text>
            <v-card-actions>
                <v-btn text="OK" @click="resetCheckoutSuccess"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>


</template>

<script setup>
    import { inject, computed, ref } from 'vue'
    import { downloadArrayAsFormat, formatBytes} from '@/modules/utils.js'
    const backendUrl = import.meta.env.VITE_BACKEND_API_URL;
    const submit_endpoint = `${backendUrl}/api/submit`
    const userInfo = inject('userInfo')

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
    const showLoginModal = ref(false)
    const showDeleteItemModal = ref(false)
    const showCheckoutSuccess = ref(false)

    const all_arrays = inject('all_arrays')
    const participant_measures = inject('participant_measures')
    const getBasketStats = inject('getBasketStats')
    const deleteBasketItem = inject('deleteBasketItem')
    const file_metadata = inject('file_metadata')
    const basket = inject('basket')
    const isAuthenticated = inject('isAuthenticated')

    const name = ref("Stephan Heunis")
    const affiliation = ref("Some place")
    const email = ref("s@h.com")
    const members = ref("Me, you, everyone")
    const title = ref("Joyful jester")
    const description = ref("Some analysis")
    const comments = ref("fml")
    const status = ref(true)

    const item_index_to_delete = ref(null)

    const basketStats = computed(() => {
        return getBasketStats(participant_measures.value, file_metadata.value)
    });

    const basketSize = computed(() => {
        var sizes = basketStats.value.files.map((m) => (m["file_size"]));
        return sizes.reduce((partialSum, a) => partialSum + a, 0);
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
        comments.value = null
        status.value = false
    }
    
    function handleCheckoutSubmit() {
        createDataRequests()
        showCheckout.value = false
    }

    function createDataRequests() {
        console.log(`All providers:`)
        console.log(basketStats.value.providers)

        var payload = {
            provider_friendly: "",
            file_paths: [],
            user_data: userInfo.value,
            form_data: {
                name: name.value,
                affiliation: affiliation.value,
                email: email.value,
                members: members.value,
                title: title.value,
                description: description.value,
                comments: comments.value,
                status: status.value
            },
        }
        for (var i=0; i<basketStats.value.providers.length; i++) {
            var provider = basketStats.value.providers[i]
            console.log(`Making POST for provider: ${provider}`)
            var provider_file_names = basketStats.value.files.filter((f) => {
                return f["explorer_provider"] == provider
            }).map((m) => (m["file_path"]));
            payload.provider_friendly = provider;
            payload.file_paths = provider_file_names;
            fetch(submit_endpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                credentials: 'include'
            })
            .then((response) => {
                if (response.ok) {
                    showCheckoutSuccess.value = true
                    return response.json();
                } else {
                    console.error(
                        "ERROR: data request POST to Neptune server failed"
                    );
                }
            })
            .then((responseJson) => {
                console.log(responseJson)
            })
        }
    }

    function checkoutBasket() {
        if (!isAuthenticated.value) {
            showLoginModal.value = true
        } else {
            showCheckout.value = true
        }
    }

    function resetLoginModal() {
        console.log("resetLoginModal")
        showLoginModal.value = false
    }


    function resetCheckoutSuccess() {
        showCheckoutSuccess.value = false
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

<style scoped>

 .register-link {
    color: #ff00fb;
    text-decoration: underline;
    cursor: pointer;
 }

</style>





