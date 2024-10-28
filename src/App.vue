<template>
  <v-app>
    <v-main>
      <!-- ****** -->
      <!-- HEADER -->
      <!-- ****** -->
      <div class="header">
          <a href="/"><img src="/src/assets/img/logo_guts.svg" alt="" height="90"></a>
          &nbsp;&nbsp;
          <div class="push">
              <h1><strong>GUTS Metadata Explorer</strong></h1>
              <div class="menu-container">
                  <ul class="menu push">
                      <li @click="selected_component = 'home'" :class="{active: selected_component == 'home'}"><i class="fas fa-home"></i></li>
                      <li @click="selected_component = 'table'" :class="{active: selected_component == 'table'}"><i class="fas fa-bars"></i></li>
                      <li @click="selected_component = 'checkboxes'" :class="{active: selected_component == 'checkboxes'}"><i class="fas fa-list-check"></i></li>
                      <li @click="selected_component = 'basket'" :class="{active: selected_component == 'basket', hasitems: basket.length > 0 }">
                          <i class="fas fa-cart-shopping"></i>
                      </li>
                  </ul>
                  <auth-menu></auth-menu>
              </div>
          </div>
      </div>
      <!-- ****************** -->
      <!-- SELECTED COMPONENT -->
      <!-- ****************** -->
      <span v-if="all_options_loaded">
        <div v-if="selected_component=='home'" style="text-align: center;">
          <div class="home-header">
              <h1 class="home-heading-1"><em>How do young people successfully grow up in an increasingly complex society?</em></h1>
              <h1 class="home-heading-2"><em><a href="https://www.gutsproject.com/"> <i class="fas fa-arrow-up-right-from-square"></i> gutsproject.com</a></em></h1>
          </div>
          <br>
          <div style="text-align:center"><h2><em> ... PAGE UNDER CONSTRUCTION ... </em></h2></div>
        </div>
        <div v-if="selected_component=='table'">
          <GutsTable></GutsTable>
        </div>
        <div v-if="selected_component=='checkboxes'">
          <GutsCheckboxes></GutsCheckboxes>
        </div>
        <div v-if="selected_component=='basket'">
          <GutsBasket></GutsBasket>
        </div>
      </span>
      <!-- ****** -->
      <!-- FOOTER -->
      <!-- ****** -->
      <div class="footer">
        <div class="footer-funding">
            <h4>Funding</h4>
            <a href=""><img src="/src/assets/img/logo_funding.webp" alt="" height="90"></a>
            <p><small>
                GUTS is funded by the Dutch Ministry of Education, Culture and Science (OCW).
                <br>Research programme: Gravitation
                <br>File number: 024.005.011
            </small>
            </p>
        </div>
        <div>
            <h4>Partners</h4>
            <div class="partner-logos">
                <a href=""><img src="/src/assets/img/logo_eur.png" alt="" height="50"></a>
                <a href=""><img src="/src/assets/img/logo_unileiden.webp" alt="" height="50"></a>
                <a href=""><img src="/src/assets/img/logo_groningen.webp" alt="" height="50"></a>
                <a href=""><img src="/src/assets/img/logo_vrije.png" alt="" height="50"></a>
                <a href=""><img src="/src/assets/img/logo_utrechtuni.webp" alt="" height="50"></a>
                <a href=""><img src="/src/assets/img/logo_Amsterdam_UMC.webp" alt="" height="50"></a>
                <a href=""><img src="/src/assets/img/logo_NIFN.webp" alt="" height="50"></a>
                <a href=""><img src="/src/assets/img/logo_RADBOUDMC.webp" alt="" height="50"></a>
                <a href=""><img src="/src/assets/img/logo_uva.webp" alt="" height="50"></a>
            </div>
        </div>
    </div>
    </v-main>
  </v-app>
</template>

<script setup>
  import { provide } from 'vue';
  import { ref, onBeforeMount, reactive } from 'vue'
  import { useBasket } from '@/composables/basket.js'
  import { makeReadable } from '@/modules/utils.js'
  import AuthMenu from '@/components/AuthMenu';

  const backendUrl = import.meta.env.VITE_BACKEND_API_URL;
  console.log(backendUrl)
  const measure_data_file = `${backendUrl}/api/measures`
  const participant_data_file = `${backendUrl}/api/subjects`
  const file_metadata_file = `${backendUrl}/api/files`

  // Data
  var selected_component = ref("home"); // must be one of: home, table, checkboxes, basket
  var measure_data = ref([])
  var measure_shortnames = ref([])
  var measure_data_loaded = ref(false)
  var participant_data = ref([])
  var participant_measures = ref([])
  var participant_measures_loaded = ref(false)
  var all_arrays = reactive({})
  var filter_arrays = reactive({})
  var all_ages = ref(null)
  var age_list = ref(null)
  var age_min = ref(null)
  var age_max = ref(null)
  var filter_age_min = ref(null)
  var filter_age_max = ref(null)
  var all_states = ref(null)
  var state_list = ref(null)
  var state_options = ref(null)
  var file_metadata = ref([])
  var all_options_loaded = ref(false)
  const userInfo = ref(null)
  const isAuthenticated = ref(false)

  const {
    basket,
    addToBasket,
    deleteBasketItem,
    getBasketStats
  } = useBasket(all_arrays, filter_arrays)

  provide('measure_data', measure_data)
  provide('all_arrays', all_arrays)
  provide('filter_arrays', filter_arrays)
  provide('participant_measures', participant_measures)
  provide('basket', basket)
  provide('addToBasket', addToBasket)
  provide('getBasketStats', getBasketStats)
  provide('selected_component', selected_component)
  provide('file_metadata', file_metadata)
  provide('deleteBasketItem', deleteBasketItem)
  provide('userInfo', userInfo)
  provide('isAuthenticated', isAuthenticated)

  onBeforeMount( () => {
    fetch(measure_data_file)
      .then((response) => {
          if (response.ok) {
              return response.json();
          } else {
              console.error(
                  "ERROR: measure_data.json file could not be loaded"
              );
          }
      })
      .then((responseJson) => {
          measure_data.value = responseJson;
          measure_shortnames.value = measure_data.value.map((m) => (m["short_name"]));
          measure_data_loaded.value = true;
          console.log(`Measures:\n${measure_shortnames.value}`)
          return fetch(participant_data_file)
      })
      .then((response) => {
          if (response.ok) {
              return response.json();
          } else {
              console.error(
                  "ERROR: participant_data.json file could not be loaded"
              );
          }
      })
      .then((responseJson) => {
          participant_data.value = responseJson;
          console.log("NUMBER OF PARTICIPANTS:")
          console.log(participant_data.value.length)
          var part, m_code
          // Loop through all participants and create sample data
          var p = 0
          for (var i=0; i<participant_data.value.length; i++) {
              part = participant_data.value[i]
              if (part["cohort"] == null) {
                  console.log(`Participant without cohort: ${part['subject']}`)
                  continue;
              }
              // Loop through all measure shortnames
              for (var m=0; m<measure_shortnames.value.length; m++) {
                  m_code = measure_shortnames.value[m]
                  // skip measure if it is not collected for the participant
                  // need to check for both primary and derivative state, only skip if both are 0
                  if (!part.hasOwnProperty(m_code) || (!part[m_code]["primary"] && !part[m_code]["derivative"]) ) {
                      continue

                  }
                  // construct participant_measure object
                  // get data states:
                  var states = []
                  if (part[m_code]["primary"]) {
                      states.push("primary")
                  }
                  if (part[m_code]["derivative"]) {
                      states.push("derivative")
                  }
                  
                  var part_measure = {
                      "subject": part["subject"],
                      "cohort": part["cohort"] ,
                      "session": part["session"] ,
                      "age": part["age"],
                      "short_name": m_code,
                      "state": states,
                  }
                  // get corresponding measure from short_name
                  var measure = measure_data.value.find(x => x["short_name"] === m_code);
                  // complete short_name associated fields
                  if (measure) {
                      part_measure["data_type"] = measure["data_type"]
                      part_measure["data_category"] = measure["data_category"]
                  } else {
                      part_measure["data_type"] = null
                      part_measure["data_category"] = null
                  }
                  p+=1
                  participant_measures.value.push(part_measure)
              }
          }
          participant_measures_loaded.value = true;

          // Now we need to load all user input options
          var all_options = ["cohort", "session", "data_type", "data_category", "age", "short_name"]
          var all_options_obj = {}
          for (var x=0; x<all_options.length; x++) {
              var option = all_options[x]
              var all_opt = "all-" + option
              var opt_list = option + "-list"
              var opt_options = option + "-options"

              all_options_obj[all_opt] = participant_measures.value.map(function(pm) {
                  return pm[option];
              });
              all_options_obj[opt_list] = [...new Set(all_options_obj[all_opt])].sort()
              all_options_obj[opt_options] = all_options_obj[opt_list].map((item, idx) => (
                  {'value': item, 'text': makeReadable(item)}
              ))
              all_options_obj[opt_options].unshift({value: 'all', text: 'All'})
              all_arrays[option] = all_options_obj[opt_list]
              filter_arrays[option] = all_arrays[option]
          }
          // age min and max
          all_ages.value = participant_measures.value.map(function(pm) {
              return pm["age"];
          });
          age_list.value = [...new Set(all_ages.value)].sort()
          age_min.value = Math.min.apply(null, age_list.value)
          age_max.value = Math.max.apply(null, age_list.value)
          filter_age_min.value = age_min.value
          filter_age_max.value = age_max.value

          // states
          all_states.value = ["primary", "derivative"]
          state_list.value = ["primary", "derivative"]
          state_options.value = [
              {value: 'all', text: 'All'},
              {value: "primary", text: "Primary"},
              {value: "derivative", text: "Derivative"}
          ]
          all_arrays["state"] = state_list.value
          filter_arrays["state"] = all_arrays["state"]
          console.log(`All arrays from files:`)

          for (const [key, value] of Object.entries(all_arrays)) {
            console.log(key, value);
            }

          return fetch(file_metadata_file)
      })
      .then((response) => {
          if (response.ok) {
              return response.json();
          } else {
              console.error(
                  "ERROR: file_metadata.json file could not be loaded"
              );
          }
      })
      .then((responseJson) => {
          file_metadata.value = responseJson;
          console.log("NUMBER OF FILES:")
          console.log(file_metadata.value.length)
          all_options_loaded.value = true;
      })
  })

  

</script>
