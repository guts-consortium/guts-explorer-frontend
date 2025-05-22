<template>
    <h3 class="page-heading">
            &nbsp;&nbsp; <v-icon>mdi-cart</v-icon>&nbsp;Metadata Basket
          </h3>
    <!-- <h3 class="page-heading"> &nbsp;&nbsp; Metadata Basket</h3> -->

    <span v-if="basket.length == 0">
        <em>There are no items in your basket</em>
    </span>
    <v-container v-if="basket.length > 0">
        <v-row>
            <v-col cols="9">
            <v-card
                key="demographics"
                class="mb-2 pt-1"
                outlined
            >
                <v-card-title class="d-flex justify-space-between align-center">
                    <small>Demographic variables to include:</small><v-checkbox v-model="select_all" label="All"  @update:modelValue="toggleDemographics()" class="my-0" density="compact" hide-details></v-checkbox>
                </v-card-title>

                <v-col style="margin-left: 1em;">
                    <v-row>
                        
                        <span v-for="d in Object.keys(data_descriptions['demographics'])">
                            <v-checkbox v-model="selected_demographics" :value="d" @update:modelValue="updateDemoFiles" class="my-0 mx-2" density="compact" hide-details>
                                <template v-slot:label>
                                    {{ data_descriptions['demographics'][d]['long_name'] }}
                                    <sup>
                                    <small>
                                        <v-tooltip location="bottom" max-width="400px">
                                        <template v-slot:activator="{ props }">
                                            <v-icon v-bind="props">mdi-information-outline</v-icon>
                                        </template>
                                        {{ data_descriptions['demographics'][d]['description'] }}
                                        </v-tooltip>
                                    </small>
                                    </sup>
                                </template>
                            </v-checkbox>
                        </span>
                    </v-row>
                </v-col>

            </v-card>
            <br>
            <h3>Basket Items</h3>
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
                            <span v-if="val.length == 0 || val.sort().join(',') === [...new Set(all_arrays[key])].sort().join(',')">
                            all
                            </span>
                            <span v-else>
                                <span v-for="(v, idx) in val" :key="idx">{{ v }}<span v-if="idx + 1 != val.length">, </span> </span>
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
                <v-card-text>Number of files: {{ basketStats.files.length + demographicFiles.length }}</v-card-text>
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
                        :rules="[v => !!v || 'Affiliation is required']"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="email"
                        label="Email address"
                        :rules="[v => !!v || 'Email is required']"
                        required
                        type="email"
                    ></v-text-field>
                    <v-text-field
                        v-model="members"
                        label="Project members"
                    ></v-text-field>
                    <v-text-field
                        v-model="title"
                        label="Project title"
                        :rules="[v => !!v || 'Project title is required']"
                        required
                    ></v-text-field>
                    <v-textarea
                        v-model="description"
                        label="Project description"
                        :rules="[v => !!v || 'Project description is required']"
                        required
                        rows="3"
                    ></v-textarea>
                    <v-textarea
                        v-model="comments"
                        label="Additional comments"
                        rows="3"
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
        <RegisterLogin @close-dialog="resetLoginModal" :key="`input-${Date.now()}`"></RegisterLogin>
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
    import { inject, computed, ref, onMounted } from 'vue'
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
        "sex": "Sex",
        "data_type_sub": "Data subtypes",
    }

    const showCheckout = ref(false)
    const showLoginModal = ref(false)
    const showDeleteItemModal = ref(false)
    const showCheckoutSuccess = ref(false)
    const select_all = ref(false)

    const all_arrays = inject('all_arrays')
    const participant_measures = inject('participant_measures')
    const getBasketStats = inject('getBasketStats')
    const getDemographicsFiles = inject('getDemographicsFiles')
    const deleteBasketItem = inject('deleteBasketItem')
    const file_metadata = inject('file_metadata')
    const basket = inject('basket')
    const isAuthenticated = inject('isAuthenticated')
    const data_descriptions = inject('data_descriptions')
    const selected_demographics = ref([])
    const basketStats = ref({
        samples: [],
        participants: [],
        files: [],
        filenames: [],
        providers: []
    })
    const demographicFiles = ref([])
    

    const name = ref(null)
    const affiliation = ref(null)
    const email = ref(null)
    const members = ref(null)
    const title = ref(null)
    const description = ref(null)
    const comments = ref(null)
    const status = ref(true)

    const item_index_to_delete = ref(null)

    onMounted(() => {
        basketStats.value = getBasketStats(participant_measures.value, file_metadata.value)
        updateDemoFiles()
    });

    function toggleDemographics() {
      if (select_all.value) {
        selected_demographics.value = Object.keys(data_descriptions['demographics'])
      } else {
        selected_demographics.value = []
      }
      updateDemoFiles()
    }

    // const basketStats = computed(() => {
    //     return getBasketStats(participant_measures.value, file_metadata.value)
    // });

    function updateDemoFiles() {
        var demoFiles = getDemographicsFiles(
            basketStats.value.participants,
            selected_demographics.value,
            file_metadata.value
        )
        demographicFiles.value = demoFiles.filter((file) => {
            return !basketStats.value.filenames.includes(file["file_path"])
        })
    }

    const basketSize = computed(() => {
        var sizesBasketItems = basketStats.value.files.map((m) => (m["file_size"]));
        var sizesDemographItems = demographicFiles.value.map((m) => (m["file_size"]));
        var sizes = sizesBasketItems.concat(sizesDemographItems)

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

        const files_to_request = [].concat(basketStats.value.files).concat(demographicFiles.value)

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
            var provider_file_names = files_to_request.filter((f) => {
                return f["explorer_provider"] == provider
            }).map((m) => (m["file_path"]));
            
            payload.provider_friendly = provider;
            payload.file_paths = provider_file_names;
            console.log(`Making a data request to endpoint: ${submit_endpoint}`)
            console.log(`Payload:`)
            console.log(payload)
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
        basketStats.value = getBasketStats(participant_measures.value, file_metadata.value)
        updateDemoFiles()
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





