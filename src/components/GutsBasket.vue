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
                <div style="text-align: justify;">
                    <em>
                        Please complete the following information to create a data request
                        (currently only GUTS researchers can request data). After submission,
                        the GUTS Steering Committee will evaluate the request, which should
                        take no longer than three weeks. Once approved, the data manager will
                        make the data available to you via Yoda.
                    </em>
                </div>
                <br /><br />
                    <v-select
                        v-model="requested_for"
                        label="Data requested for"
                        :items="['Myself (researcher)', 'A student']"
                        required
                        density="compact"
                    ></v-select>
                    <div v-if="requested_for" style="padding-left: 1em;">
                        <v-text-field
                            v-model="name"
                            label="First and last name (researcher)"
                            required
                            density="compact"
                        ></v-text-field>
                        <v-text-field
                            v-if="requested_for == 'A student'"
                            v-model="name_student"
                            label="First and last name (student)"
                            required
                            density="compact"
                        ></v-text-field>
                        <v-select
                            v-model="work_package"
                            label="Work package (researcher)"
                            :items="['WP1-R', 'WP1-A', 'WP2', 'WP3', 'WP4', 'WP']"
                            required
                            density="compact"
                        ></v-select>
                        <v-text-field
                            v-model="affiliation"
                            label="Affiliation (researcher)"
                            required
                            density="compact"
                        ></v-text-field>
                        <v-text-field
                            v-model="email"
                            label="Email address (researcher)"
                            required
                            type="email"
                            density="compact"
                        ></v-text-field>

                    </div>
                    <v-select
                        v-model="purpose"
                        label="Purpose"
                        :items="['Publication', 'Non-publication', 'Thesis writing']"
                        required
                        density="compact"
                    ></v-select>
                    <div v-if="purpose" style="padding-left: 1em;">
                        <span v-if="purpose == 'Publication'">
                            <v-select
                                v-model="publication_proposal"
                                label="Publication proposal seen and approved by a work package lead?"
                                :items="['Yes', 'No']"
                                required
                                density="compact"
                            ></v-select>
                            <v-select
                                v-if="publication_proposal == 'Yes'"
                                v-model="approved_by"
                                label="Approved by"
                                :items="['Eveline Crone, Erasmus University Rotterdam (WP1-R)',
                                    'Lydia Krabbendam, VU-Amsterdam (WP1-A)',
                                    'Anna van Duijvenvoorde, Leiden University (WP2)',
                                    'René Veenstra, Groningen University (WP2)',
                                    'Lucres Nauta-Jansen, AmsterdamUMC (WP3)',
                                    'Hilleke Hulshoff Pol, Utrecht University (WP4)',
                                ]"
                                required
                                density="compact"
                            ></v-select>
                        </span>
                        <span v-else-if="purpose == 'Thesis writing'">
                            <v-select
                                v-model="research_proposal"
                                label="Student research proposal seen and approved by supervisor?"
                                :items="['Yes', 'No']"
                                required
                                density="compact"
                            ></v-select>
                        </span>
                        <span v-else>
                            <v-textarea
                                v-model="purpose_description"
                                label="Describe why access is needed"
                                required
                                rows="3"
                                density="compact"
                            ></v-textarea>
                        </span>
                    </div>

                    <v-text-field
                        v-model="title"
                        label="Project title"
                        required
                        density="compact"
                    ></v-text-field>
                    <div style="padding-left: 1em; padding-right: 1em; margin-bottom: 1em; text-align: justify;">
                        <small><em>* The project title will be used to generate the workspace name on Yoda, where the data package will be placed once the data request is approved - please keep it short (e.g., the project title "Developmental Patterns of Delay Discounting" becomes the workspace name "developmental-patterns-dd").</em></small>
                    </div>
                    <v-textarea
                        v-model="members"
                        label="Project members / co-authors"
                        required
                        rows="3"
                        density="compact"
                    ></v-textarea>
                    <v-textarea
                        v-model="description"
                        label="Project description"
                        required
                        rows="3"
                        density="compact"
                    ></v-textarea>
                    <v-textarea
                        v-model="comments"
                        label="Additional comments"
                        rows="3"
                        density="compact"
                    ></v-textarea>
                    <v-checkbox
                        v-model="data_use_policy"
                        label="I am aware of and accept the data use policy"
                        :true-value="'accepted'"
                        :false-value="'not_accepted'"
                        required
                        density="compact"
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
        :persistent="true"
        >
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
    import { inject, computed, ref, onMounted, onUpdated } from 'vue'
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
    const emptyBasket = inject('emptyBasket')
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

    const affiliation = ref(null)
    const approved_by = ref(null)
    const comments = ref(null)
    const data_use_policy = ref(false)
    const description = ref(null)
    const email = ref(null)
    const members = ref(null)
    const name = ref(null)
    const name_student = ref(null)
    const publication_proposal = ref(null)
    const purpose = ref(null)
    const purpose_description = ref(null)
    const requested_for = ref(null)
    const research_proposal = ref(null)
    const title = ref(null)
    const work_package = ref(null)

    const item_index_to_delete = ref(null)

    onMounted(() => {
        basketStats.value = getBasketStats(participant_measures.value, file_metadata.value)
        updateDemoFiles()
    });
    onUpdated(() => {
        console.log("Updating basket stats...")
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
        affiliation.value = null
        approved_by.value = null
        comments.value = null
        data_use_policy.value = false
        description.value = null
        email.value = null
        members.value = null
        name.value = null
        name_student.value = null
        publication_proposal.value = null
        purpose.value = null
        purpose_description.value = null
        requested_for.value = null
        research_proposal.value = null
        title.value = null
        work_package.value = null
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
                affiliation: affiliation.value,
                approved_by: approved_by.value,
                comments: comments.value,
                data_use_policy: data_use_policy.value ,
                description: description.value,
                email: email.value,
                members: members.value,
                name: name.value,
                name_student: name_student.value,
                publication_proposal: publication_proposal.value,
                purpose: purpose.value,
                purpose_description: purpose_description.value,
                requested_for: requested_for.value,
                research_proposal: research_proposal.value,
                title: title.value,
                work_package: work_package.value,
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
        emptyBasket()
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





