<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h3 class="page-heading">
            &nbsp;&nbsp; <v-icon>mdi-magnify</v-icon>&nbsp;Find samples by measure code, name or description
          </h3>
        </v-col>
      </v-row>
      
      <v-row id="search-options" class="search-options">
        <!-- SEARCH TEXT -->
        <v-col cols="6">
          <v-text-field
            id="search_text_input"
            variant="outlined"
            density="compact"
            placeholder="Enter text (hit enter to add search tag)"
            v-model="search_text"
            @keyup.enter="addSearchTextTag"
          ></v-text-field>
        </v-col>
  
        <v-col cols="1"></v-col>
        
        <v-col>
          <div class="d-inline-block" style="font-size: 1.5rem;">
            <v-chip
              v-for="tag in search_text_tags"
              :key="tag"
              class="ma-1"
              @click="removeSearchTextTag(tag)"
              close
              outlined
            >
              {{ tag }}
              <v-icon right>mdi-close-circle</v-icon>
            </v-chip>
          </div>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col class="text-left">
          <v-btn small outlined color="dark" @click="resetTable">
            <v-icon left>mdi-rotate-left</v-icon> Reset Table
          </v-btn>
          <v-btn small outlined color="dark" @click="addToBasket('table', included_measures); showModal('addedItemModal')">
            <v-icon left>mdi-cart-plus</v-icon> Add Table to Basket
          </v-btn>
        </v-col>
      </v-row>
  
      <v-card>
        <v-table class="lcid-info-table">
          <template v-slot:default>
            <thead>
              <tr>
                <th
                  v-for="field in measure_headings"
                  :key="field.key"
                  :style="{ width: field.key === 'description' ? '50%' : (field.key === 'long_name' ? '20%' : '15%') }"
                >
                  {{ field.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in included_measures" >
                <td v-for="field in measure_headings" >{{ item[field.key] }}</td>
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


</template>

<script setup>
    import { ref, inject, computed } from 'vue'

    const addToBasket = inject('addToBasket')
    const basket = inject('basket')
    const showAddedItemModal = ref(false);
    const measure_headings = [
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
    var search_text = ref("");
    var search_text_tags = ref([]);

    const measure_data = inject('measure_data')
    const selected_component = inject('selected_component')

    const included_measures = computed(() => {
        return measure_data.value.filter((c) => {
            if (search_text_tags.value.length == 0) {
                // console.log("true")
                return true;
            }
            return search_text_tags.value.some((v) =>
                c["short_name"].toLowerCase().indexOf(v.toLowerCase()) >= 0 ||
                c["long_name"].toLowerCase().indexOf(v.toLowerCase()) >= 0 ||
                c["description"].toLowerCase().indexOf(v.toLowerCase()) >= 0
            );
        });
    });

    function resetTable() {
        search_text.value = ""
        search_text_tags.value = []
    }

    function addSearchTextTag(option) {
        if (search_text_tags.value.indexOf(search_text.value) < 0) {
            search_text_tags.value.push(search_text.value);
        }
        search_text.value = "";
    }

    function removeSearchTextTag(tag) {
        var idx = search_text_tags.value.indexOf(tag);
        if (idx > -1) {
            search_text_tags.value.splice(idx, 1);
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

    
    // function exportTable(format) {
    //     downloadArrayAsFormat(this.included_measures, format, "guts_metadata")
    // }
</script>





