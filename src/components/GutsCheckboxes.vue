<template>
    <h3 class="page-heading">
        &nbsp;&nbsp; <v-icon>mdi-magnify</v-icon>&nbsp;Find samples by specific keys
      </h3>
    <v-container style="padding-left: 0; padding-right: 0;" >
      
      
      <v-card class="pa-4" dark>

        <!-- AGE -->
        <v-col>
          <v-row>
              <label class="filter-label"><v-icon>mdi-numeric-9-plus-box-multiple-outline</v-icon>&nbsp;Ages:&nbsp;&nbsp;</label>
              <v-checkbox v-model="age_all" label="All" @update:modelValue="toggleChecks('age')" class="my-0" density="compact" hide-details></v-checkbox>
              <span v-for="opt in all_arrays['age']">
                <v-checkbox v-model="filter_arrays['age']" :label="String(opt)" :value="opt" class="my-0" density="compact" hide-details></v-checkbox>
              </span>
          </v-row>
          <v-row>
              <label class="filter-label"><v-icon>mdi-gender-male-female</v-icon>&nbsp;Sex:&nbsp;&nbsp;</label>
              <v-checkbox v-model="sex_all" label="All" @update:modelValue="toggleChecks('sex')" class="my-0" density="compact" hide-details></v-checkbox>
              <span v-for="opt in all_arrays['sex']">
                <v-checkbox v-model="filter_arrays['sex']" :label="String(opt)" :value="opt" class="my-0" density="compact" hide-details></v-checkbox>
              </span>
          </v-row>
        </v-col>
        <br>
        <v-divider></v-divider>
        <br>
        

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
          <v-col cols="3">
              <label class="filter-label"><v-icon>mdi-chart-pie</v-icon>&nbsp;Categories</label>
              <br>
              <v-checkbox v-model="category_all" label="All" @update:modelValue="toggleChecks('data_category')" class="my-0" density="compact" hide-details></v-checkbox>
              <span v-for="opt in all_arrays['data_category']">
                    <v-checkbox v-model="filter_arrays['data_category']" :value="opt" class="my-0" density="compact" hide-details>
                      <template v-slot:label>
                        {{ makeReadable(String(opt))}}
                        <sup>
                          <small>
                            <v-tooltip location="bottom" max-width="400px">
                              <template v-slot:activator="{ props }">
                                <v-icon v-bind="props">mdi-information-outline</v-icon>
                              </template>

                              {{ data_descriptions['data_categories'][opt]['description'] }}
                            </v-tooltip>
                          </small>
                        </sup>
                      </template>
                    </v-checkbox>
              </span>
          </v-col>
          
          <!-- TYPE -->
          <v-col cols="3">
              <label class="filter-label"><v-icon>mdi-ruler</v-icon>&nbsp;Types</label>
              <br>
              <v-checkbox v-model="type_all" label="All" @update:modelValue="toggleChecks('data_type')" class="my-0" density="compact" hide-details></v-checkbox>
              <span v-for="datype in all_arrays['data_type']">
                <v-checkbox v-model="filter_arrays['data_type']" :value="datype" class="my-0" density="compact" hide-details @update:modelValue="selectType(datype)">
                  <template v-slot:label>
                    {{ makeReadable(String(datype))}}
                    <sup>
                      <small>
                        <v-tooltip location="bottom" max-width="400px">
                          <template v-slot:activator="{ props }">
                            <v-icon v-bind="props">mdi-information-outline</v-icon>
                          </template>
                          {{ data_descriptions['data_types'][datype]['description'] }}
                        </v-tooltip>
                      </small>
                    </sup>
                  </template>
                </v-checkbox>
                <!-- SUBTYPES -->
                <!-- Only show the following if the current datatype has subtypes -->
                <span v-if="all_types_and_subs[datype] && Object.keys(all_types_and_subs[datype]).length > 0">
                  <span v-for="dtsub in Object.keys(all_types_and_subs[datype])" :key="dtsub">
                    <!-- now check if the dtsub is actually used, i.e. is in all_arrays['data_type_sub']  -->
                    <v-row no-gutters v-if="all_arrays['data_type_sub'].indexOf(dtsub) >= 0" style="margin-top: 0;">
                      <v-col cols="1">
                      </v-col>
                      <v-col>
                        <v-checkbox
                          v-model="filter_arrays['data_type_sub']"
                          :value="dtsub"
                          :label="dtsub"
                          class="my-0"
                          density="compact"
                          @update:modelValue="selectSubType(dtsub)"
                          hide-details>
                        </v-checkbox>
                      </v-col>
                    </v-row>
                  </span>
                </span>
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
                    <v-checkbox v-model="filter_arrays['cohort']" :value="opt" class="my-0" density="compact" hide-details>
                      <template v-slot:label>
                        {{ String(opt).toLocaleUpperCase() }}
                        <sup>
                          <small>
                            <v-tooltip location="bottom" max-width="400px">
                              <template v-slot:activator="{ props }">
                                <v-icon v-bind="props">mdi-information-outline</v-icon>
                              </template>

                              {{ data_descriptions['cohorts'][opt]['long-name'] }}
                            </v-tooltip>
                          </small>
                        </sup>
                      </template>
                    </v-checkbox>
                  </span>
                  
              </v-col>
              
              <!-- STATES -->
              <v-col>
                  <label class="filter-label"><v-icon>mdi-state-machine</v-icon>&nbsp;States</label>
                  <br>
                  <v-checkbox v-model="state_all" label="All" @update:modelValue="toggleChecks('state')" class="my-0" density="compact" hide-details></v-checkbox>
                  <span v-for="opt in all_arrays['state']">
                    <v-checkbox v-model="filter_arrays['state']" :label="makeReadable(String(opt))" :value="opt" class="my-0" density="compact" hide-details></v-checkbox>
                  </span>
                  
              </v-col>
            </v-row>
            
            <br>
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
            <br>
            <v-row>
              <v-col>
                <div class="samples-div">
                  <div class="samples-count">{{filtered_measures_count}}</div>
                  <div class="samples-count-text">measures</div>
                </div>
              </v-col>
            </v-row>
            <br>
        <v-row>
          <v-col class="text-right">
            <v-btn small outlined class="option-button" @click="resetCheckboxes()">
              <v-icon>mdi-rotate-left</v-icon> Reset Selection
            </v-btn>
            <br>
            <br>
            <v-btn small outlined @click="addToBasket(toRaw(filter_arrays), 'checkboxes', included_measures); showModal('addedItemModal')">
              <v-icon>mdi-cart-plus</v-icon> Add Selection to Basket
            </v-btn>
          </v-col>
        </v-row>
          </v-col>
        </v-row>
        
        
      </v-card>
    </v-container>


    <v-container style="padding-left: 0; padding-right: 0;">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        
        <span>Measures:</span>
          <v-btn small outlined @click="addSubselectionToBasket()">
              <v-icon>mdi-cart-plus</v-icon> Add Subselected Measures to Basket
          </v-btn>

      </v-card-title>
        <v-table class="lcid-info-table">
          <template v-slot:default>
            <thead>
              <tr>
                <th
                  v-for="field in measure_headings"
                  :key="field.key"
                  :style="{ width: field.key === 'description' ? '50%' : (field.key === 'long_name' ? '20%' : (field.key === 'data_category' ? '20%' : (field.key === 'select' ? '6%' : '15%'))) }"
                >
                  <span v-if="field.key === 'select'">
                    <v-checkbox v-model="select_all"  @update:modelValue="toggleCurrentMeasures()" class="my-0" density="compact" hide-details></v-checkbox>
                  </span>
                  <span v-else>
                    {{ field.label }}
                  </span>
                  
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in included_measures" >
                <td v-for="field in measure_headings" >
                  <span v-if="Array.isArray(item[field.key])" style="line-height: 1.5em;">
                    <span v-for="el of item[field.key]" class="element-pill">{{el}} <br></span>
                  </span>
                  <span v-else-if="field.key === 'select'">
                    <v-checkbox v-model="selected_measures_boxes" :value="item['short_name']" @update:modelValue="" class="my-0" density="compact" hide-details></v-checkbox>
                  </span>
                  <span v-else>
                    {{ item[field.key] }}
                  </span>
                  
                </td>
              </tr>
            </tbody>
          </template>
        </v-table>
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

    <v-dialog v-model="noMeasuresSelectedModal" max-width="500px">
        <v-card>
        <v-card-title>No measures selected</v-card-title>
        <v-card-text class="text-left">
            Please select measures before adding them to your basket.
        </v-card-text>
        <v-card-actions>
            <v-btn text="Ok" @click="noMeasuresSelectedModal = false"></v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>

  </template>



<script setup>
    import { inject, reactive, computed, ref, onMounted, toRaw, watch } from 'vue'
    import { makeReadable, removeElementFromArray, getArrayIntersection, arrayIncludesAny, arrayIncludesNone} from '@/modules/utils.js'

    const all_arrays = inject('all_arrays')
    const filter_arrays = inject('filter_arrays')
    const participant_measures = inject('participant_measures')
    const basket = inject('basket')
    const addToBasket = inject('addToBasket')
    const selected_component = inject('selected_component')
    const data_descriptions = inject('data_descriptions')
    const all_types_and_subs = inject('all_types_and_subs')
    const all_subtypes = inject('all_subtypes')
    const measure_data = inject('measure_data')
    const measure_headings = [
      {
        key: "select",
        label: "Select"
      },
      {
          key: "short_name",
          label: "Code",
      },
      {
          key: "long_name",
          label: "Name",
      },
      {
          key: "description",
          label: "Description",
      },
      {
          key: "data_type",
          label: "Type",
      },
      {
          key: "data_category",
          label: "Category",
      }
    ]
    const select_all = ref(false)
    const selected_measures_boxes = ref([])
    const session_all = ref(true)
    const category_all = ref(true)
    const type_all = ref(true)
    const state_all = ref(true)
    const age_all = ref(true)
    const cohort_all = ref(true)
    const sex_all = ref(true)

    const filter_toggles = reactive({
        "cohort": true,
        "data_category": true,
        "session": true,
        "data_type": true,
        "age": true,
        "state": true,
        "sex": true,
    })
    const showAddedItemModal = ref(false);
    const noMeasuresSelectedModal = ref(false)

    function toggleChecks(name) {
        filter_toggles[name] = !filter_toggles[name]
        if (filter_toggles[name]) {
            filter_arrays[name].splice(0, filter_arrays[name].length, ...all_arrays[name])
            if (name == 'data_type') {
              filter_arrays['data_type_sub'].splice(0, filter_arrays['data_type_sub'].length, ...all_arrays['data_type_sub'])
            }
        }
        else {
            filter_arrays[name] = []
            filter_arrays[name].splice(0)
            if (name == 'data_type') {
              filter_arrays['data_type_sub'].splice(0)

            }
        }
    }

    function resetCheckboxes() {
      var all_opts = ["cohort", "data_category", "session", "data_type", "data_type_sub", "age", "state", "sex"]

      for (var o of all_opts) {
        filter_arrays[o].splice(0, filter_arrays[o].length, ...all_arrays[o])
      }

      session_all.value = true
      category_all.value = true
      type_all.value = true
      state_all.value = true
      age_all.value = true
      cohort_all.value = true
      sex_all.value = true

      select_all.value = false
      selected_measures_boxes.value = []

    }

    function addSubselectionToBasket() {
      if (selected_measures.value.length == 0) {
        noMeasuresSelectedModal.value = true
      } else {
        console.log("going to add basket item from checkboxes, with subselection:")
        console.log(selected_measures.value)
        addToBasket(toRaw(filter_arrays),'checkboxes', selected_measures.value)
        showAddedItemModal.value = true
      }
    }

    const selected_measures = computed(() => {
      return measure_data.value.filter((m) => {
        return selected_measures_boxes.value.includes(m.short_name)
      })        
    });

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

    function toggleCurrentMeasures() {
      if (select_all.value) {
        var allSnames = included_measures.value.map((m) => {
          return m["short_name"]
        })
        selected_measures_boxes.value = allSnames
      } else {
        selected_measures_boxes.value = []
      }
    }

    function selectType(datype) {
      toggleSubtypes(datype)
    }

    function selectSubType(dtsub) {
      updateParentType(dtsub)
    }

    function updateParentType(dtsub) {
      var parentType = all_subtypes[dtsub]
      var allSubsOfParent = Object.keys(all_types_and_subs[parentType])
      var usedSubsOfParent = getArrayIntersection([all_arrays['data_type_sub'], allSubsOfParent])

      if (arrayIncludesAny(filter_arrays['data_type_sub'], usedSubsOfParent)) {
        if (!filter_arrays['data_type'].includes(parentType)) {
            filter_arrays['data_type'].push(parentType)
        }
      }
      if (arrayIncludesNone(filter_arrays['data_type_sub'], usedSubsOfParent)) {
        if (filter_arrays['data_type'].includes(parentType)) {
          removeElementFromArray(filter_arrays['data_type'], parentType)
        }
      }
    }

    function toggleSubtypes(datype) {
      // If the type/parent is checked, check all subtypes
      // If the type/parent is unchecked, uncheck all subtypes
      if (filter_arrays['data_type'].includes(datype)) {
        for (var st of Object.keys(all_types_and_subs[datype])) {
          // Only check the subtype if it is actually part of the used data
          if (all_arrays['data_type_sub'].includes(st)) {
            filter_arrays['data_type_sub'].push(st)
          }
        }
      } else {
        for (var st of Object.keys(all_types_and_subs[datype])) {
          removeElementFromArray(filter_arrays['data_type_sub'], st)
        }
      }
    }

    onMounted( () => {

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
    const filtered_samples_subtype = computed(() => {
        return filtered_samples_type.value.filter((sample) => {
            if (filter_arrays["data_type_sub"].length == all_arrays["data_type_sub"].length) return true;
            return filter_arrays["data_type_sub"].indexOf(sample["data_type_sub"] ) >= 0
        });
    });
    const filtered_samples_age = computed(() => {
        return filtered_samples_subtype.value.filter((sample) => {
            if (filter_arrays["age"].length == all_arrays["age"].length) return true;
            return filter_arrays["age"].indexOf(sample["age"] ) >= 0
        });
    });
    const filtered_samples_sex = computed(() => {
        return filtered_samples_age.value.filter((sample) => {
            if (filter_arrays["sex"].length == all_arrays["sex"].length) return true;
            return filter_arrays["sex"].indexOf(sample["sex"] ) >= 0
        });
    });
    const filtered_samples_state = computed(() => {
        // sample["state"] is an array with ["primary", "derivative"]
        return filtered_samples_sex.value.filter((sample) => {
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

    // Let's compute all measures from all the filtered down samples:
    const filtered_measure_shortnames = computed(() => {
        var filtered_measures = filtered_samples_state.value.map((m) => (m["short_name"]));
        return [...new Set(filtered_measures)]
    });

    const filtered_measures_count = computed(() => {
        return filtered_measure_shortnames.value.length
    });

    const included_measures = computed(() => {
      return measure_data.value.filter((c) => {
        return filtered_measure_shortnames.value.includes(c["short_name"])
      })
    });

    // Synchronize selected_measures_boxes when included_measures changes
    watch(included_measures, (newIncluded) => {
      const currentShortNames = newIncluded.map(m => m.short_name);
      selected_measures_boxes.value = selected_measures_boxes.value.filter(s => currentShortNames.includes(s));
    });

    



</script>

<style scoped>

  .element-pill {
    padding: 0.1em 0.3em;
    border-radius: 1em;
    border: 1px solid black ;
    margin-bottom:0.5em;
  }

</style>





