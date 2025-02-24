<template>
    <v-container>
      <h3 class="page-heading">
        &nbsp;&nbsp; <v-icon>mdi-magnify</v-icon>&nbsp;Find samples by specific keys
      </h3>
      
      <v-card class="pa-4" color="var(--guts-pink)" dark>
        <v-row>
          <!-- SESSIONS -->
          <v-col cols="2">
              <label class="filter-label"><v-icon>mdi-view-list</v-icon>&nbsp;Sessions</label>
              <br>
              <v-checkbox v-model="session_all" label="All" @update:modelValue="toggleChecks('session')" class="my-0" density="compact" hide-details></v-checkbox>
              <span v-for="opt in all_arrays['session']" class="my-0">
                <v-checkbox v-model="filter_arrays['session']" :label="String(opt)" :value="opt" class="my-0" density="compact" hide-details></v-checkbox>
              </span>
          </v-col>
          
          <!-- CATEGORY -->
          <v-col cols="2">
              <label class="filter-label"><v-icon>mdi-chart-pie</v-icon>&nbsp;Categories</label>
              <br>
              <v-checkbox v-model="category_all" label="All" @update:modelValue="toggleChecks('data_category')" class="my-0" density="compact" hide-details></v-checkbox>
              <span v-for="opt in all_arrays['data_category']">
                <v-checkbox v-model="filter_arrays['data_category']" :label="String(opt)" :value="opt" class="my-0" density="compact" hide-details></v-checkbox>
              </span>
              
          </v-col>
          
          <!-- TYPE -->
          <v-col cols="2">
              <label class="filter-label"><v-icon>mdi-ruler</v-icon>&nbsp;Types</label>
              <br>
              <v-checkbox v-model="type_all" label="All" @update:modelValue="toggleChecks('data_type')" class="my-0" density="compact" hide-details></v-checkbox>
              <span v-for="opt in all_arrays['data_type']">
                <v-checkbox v-model="filter_arrays['data_type']" :label="String(opt)" :value="opt" class="my-0" density="compact" hide-details></v-checkbox>
              </span>
              
          </v-col>
          
          <!-- AGE -->
          <v-col>
              <label class="filter-label"><v-icon>mdi-numeric-9-plus-box-multiple-outline</v-icon>&nbsp;Ages</label>
              <br>
              <v-checkbox v-model="age_all" label="All" @update:modelValue="toggleChecks('age')" class="my-0" density="compact" hide-details></v-checkbox>
              <span v-for="opt in all_arrays['age']">
                <v-checkbox v-model="filter_arrays['age']" :label="String(opt)" :value="opt" class="my-0" density="compact" hide-details></v-checkbox>
              </span>
              
          </v-col>
          
          <!-- COHORTS & STATES -->
          <v-col cols="4">
            <v-row>
              <!-- COHORTS -->
              <v-col>
                  <label class="filter-label"><v-icon>mdi-table</v-icon>&nbsp;Cohorts</label>
                  <br>
                  <v-checkbox v-model="cohort_all" label="All" @update:modelValue="toggleChecks('cohort')" class="my-0" density="compact" hide-details></v-checkbox>
                  <span v-for="opt in all_arrays['cohort']">
                    <v-checkbox v-model="filter_arrays['cohort']" :label="String(opt)" :value="opt" class="my-0" density="compact" hide-details></v-checkbox>
                  </span>
                  
              </v-col>
              
              <!-- STATES -->
              <v-col>
                  <label class="filter-label"><v-icon>mdi-state-machine</v-icon>&nbsp;States</label>
                  <br>
                  <v-checkbox v-model="state_all" label="All" @update:modelValue="toggleChecks('state')" class="my-0" density="compact" hide-details></v-checkbox>
                  <span v-for="opt in all_arrays['state']">
                    <v-checkbox v-model="filter_arrays['state']" :label="String(opt)" :value="opt" class="my-0" density="compact" hide-details></v-checkbox>
                  </span>
                  
              </v-col>
            </v-row>
            
            <br><br>
            <h3>Current selection:</h3>
            <v-row>
              <v-col>
                <div class="samples-div">
                  <div class="samples-count">{{filtered_samples_count}}</div>
                  <div class="samples-count-text">samples</div>
                </div>
              </v-col>
            </v-row>
            <br>
            <v-row>
              <v-col>
                <div class="samples-div">
                  <div class="samples-count">{{filtered_participants_count}}</div>
                  <div class="samples-count-text">participants</div>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        
        <br><br>
        <v-row>
          <v-col class="text-left">
            <v-btn small outlined class="option-button" @click="resetTable()">
              <v-icon>mdi-rotate-left</v-icon> Reset Selection
            </v-btn>
            <v-btn small outlined @click="addToBasket('checkboxes'); showModal('addedItemModal')">
              <v-icon>mdi-cart-plus</v-icon> Add Selection to Basket
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-container>

    <v-dialog v-model="showAddedItemModal" max-width="500px">
        <v-card>
        <v-card-title>Added to basket!</v-card-title>
        <v-card-text class="text-center">
            <h3>You now have {{ basket.length }} {{ basket.length > 1 ? 'items' : 'item' }} in your basket</h3>
        </v-card-text>
        <v-card-actions>
            <v-btn text="Continue Browsing" @click="hideModal('addedItemModal')"></v-btn>
            <v-btn text="View Basket" @click="viewBasket"></v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>

  </template>



<script setup>
    import { inject, reactive, computed, ref, onMounted, toRaw } from 'vue'

    const all_arrays = inject('all_arrays')
    const filter_arrays = inject('filter_arrays')
    const participant_measures = inject('participant_measures')
    const basket = inject('basket')
    const addToBasket = inject('addToBasket')
    const selected_component = inject('selected_component')

    const session_all = ref(true)
    const category_all = ref(true)
    const type_all = ref(true)
    const state_all = ref(true)
    const age_all = ref(true)
    const cohort_all = ref(true)

    const filter_toggles = reactive({
        "cohort": true,
        "data_category": true,
        "session": true,
        "data_type": true,
        "age": true,
        "state": true,
    })
    const showAddedItemModal = ref(false);

    function toggleChecks(name) {
        filter_toggles[name] = !filter_toggles[name]
        if (filter_toggles[name]) {
            filter_arrays[name] = all_arrays[name]
        }
        else {
            filter_arrays[name] = []
        }
    }

    function viewBasket() {
        showAddedItemModal.value = false;
        selected_component.value = 'basket'
    }

    const showModal = (modalRef) => {
      showAddedItemModal.value = true;
    };

    const hideModal = (modalRef) => {
      showAddedItemModal.value = false;
    };

    onMounted( () => {
      // console.log("Checkbox view mounted")
      // globalThis.myvar = toRaw(participant_measures.value)

      // console.log(toRaw(participant_measures.value))

    })

    const filtered_samples_cohort = computed(() => {
        return participant_measures.value.filter((sample) => {
            if (filter_arrays["cohort"].length == all_arrays["cohort"].length) return true;
            return filter_arrays["cohort"].indexOf(sample["cohort"] ) >= 0
        });
    });
    const filtered_samples_session = computed(() => {
        return filtered_samples_cohort.value.filter((sample) => {
            if (filter_arrays["session"].length == all_arrays["session"].length) return true;
            return filter_arrays["session"].indexOf(sample["session"] ) >= 0
        });
    });
    const filtered_samples_category = computed(() => {
      // sample["data_category"] is an array
        return filtered_samples_session.value.filter((sample) => {
            if (filter_arrays["data_category"].length == all_arrays["data_category"].length) return true;
            return  filter_arrays["data_category"].filter(value => sample['data_category'].includes(value)).length > 0
        });
    });
    const filtered_samples_type = computed(() => {
        return filtered_samples_category.value.filter((sample) => {
            if (filter_arrays["data_type"].length == all_arrays["data_type"].length) return true;
            return filter_arrays["data_type"].indexOf(sample["data_type"] ) >= 0
        });
    });
    const filtered_samples_age = computed(() => {
        return filtered_samples_type.value.filter((sample) => {
            if (filter_arrays["age"].length == all_arrays["age"].length) return true;
            return filter_arrays["age"].indexOf(sample["age"] ) >= 0
        });
    });
    const filtered_samples_state = computed(() => {
        // sample["state"] is an array with ["primary", "derivative"]
        return filtered_samples_age.value.filter((sample) => {
            if (filter_arrays["state"].length == all_arrays["state"].length) return true;
            return  filter_arrays["state"].filter(value => sample['state'].includes(value)).length > 0
        });
    });
    const filtered_samples_count = computed(() => {
        return filtered_samples_state.value.length
    });
    const filtered_participants_count = computed(() => {
        var filtered_participants = filtered_samples_state.value.map((m) => (m["subject"]));
        var filtered_participants_list = [...new Set(filtered_participants)]
        return filtered_participants_list.length
    });

</script>





