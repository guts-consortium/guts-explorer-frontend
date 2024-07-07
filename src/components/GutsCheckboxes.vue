<template>
    <h3 class="page-heading"> &nbsp;&nbsp; <i class="fas fa-magnifying-glass"></i>&nbsp;Find samples by specific keys</h3>
            
    <b-card style="background-color: var(--guts-pink); color: white">
        <b-row>
            <b-col cols="2">
                <!-- SESSIONS -->
                <b-form-group v-slot="{ ariaDescribedbySes }">
                <label for="session_checkbox" class="filter-label"><i class="fas fa-list"></i>&nbsp;Sessions</label>
                <br>
                <span><b-button variant="outline-light" size="sm" style="padding: 1px;" @click="toggleChecks('session')"><i :class="session_check_icon"></i></b-button> <em>All</em></span>
                    <b-form-checkbox-group
                        id="session_checkbox"
                        v-model="filter_arrays['session']"
                        :options="all_arrays['session']"
                        :aria-describedby="ariaDescribedbySes"
                        name="flavour-2"
                    ></b-form-checkbox-group>
                </b-form-group>
            </b-col>
            <b-col cols="2">
                <!-- CATEGORY -->
                <b-form-group v-slot="{ ariaDescribedbyCat }">
                <label for="category_checkbox" class="filter-label"><i class="fas fa-pie-chart"></i>&nbsp;Categories</label>
                <br>
                <span><b-button variant="outline-light" size="sm" style="padding: 1px;" @click="toggleChecks('data_category')"><i :class="category_check_icon"></i></b-button> <em>All</em></span>
                    <b-form-checkbox-group
                        id="category_checkbox"
                        v-model="filter_arrays['data_category']"
                        :options="all_arrays['data_category']"
                        :aria-describedby="ariaDescribedbyCat"
                        name="flavour-1"
                    ></b-form-checkbox-group>
                </b-form-group>
            </b-col>
            <!-- <b-col cols="1"></b-col> -->
            <b-col cols="2">
                <!-- TYPE -->
                <b-form-group v-slot="{ ariaDescribedbyType }">
                <label for="type_checkbox" class="filter-label"><i class="fas fa-ruler"></i>&nbsp;Types</label>
                <br>
                <span><b-button variant="outline-light" size="sm" style="padding: 1px;" @click="toggleChecks('data_type')"><i :class="type_check_icon"></i></b-button> <em>All</em></span>
                    <b-form-checkbox-group
                        id="type_checkbox"
                        v-model="filter_arrays['data_type']"
                        :options="all_arrays['data_type']"
                        :aria-describedby="ariaDescribedbyType"
                        name="flavour-2"
                    ></b-form-checkbox-group>
                </b-form-group>
            </b-col>
            <b-col>
                <!-- AGE -->
                <b-form-group v-slot="{ ariaDescribedbyAge }">
                    <label for="age_checkbox" class="filter-label"><i class="fas fa-ruler"></i>&nbsp;Ages</label>
                    <br>
                    <span><b-button variant="outline-light" size="sm" style="padding: 1px;" @click="toggleChecks('age')"><i :class="age_check_icon"></i></b-button> <em>All</em></span>
                        <b-form-checkbox-group
                            id="age_checkbox"
                            v-model="filter_arrays['age']"
                            :options="all_arrays['age']"
                            :aria-describedby="ariaDescribedbyAge"
                            name="flavour-2"
                        ></b-form-checkbox-group>
                    </b-form-group>
            </b-col>
            <b-col cols="4">
                <b-row>
                    <b-col>
                        <b-form-group v-slot="{ ariaDescribedbyCohort }">
                            <label for="cohorts_checkbox" class="filter-label"><i class="fas fa-table-columns"></i>&nbsp;Cohorts</label>
                            <br>
                            <span><b-button variant="outline-light" size="sm" style="padding: 1px;" @click="toggleChecks('cohort')"><i :class="cohort_check_icon"></i></b-button> <em>All</em></span>
                            <b-form-checkbox-group
                                id="cohorts_checkbox"
                                v-model="filter_arrays['cohort']"
                                :options="all_arrays['cohort']"
                                :aria-describedby="ariaDescribedbyCohort"
                                name="flavour-0"
                            ></b-form-checkbox-group>
                        </b-form-group>
                        
                    </b-col>
                    <b-col>
                        <b-form-group v-slot="{ ariaDescribedbyState }">
                            <label for="state_checkbox" class="filter-label"><i class="fas fa-diagram-project"></i>&nbsp;States</label>
                            <br>
                            <span><b-button variant="outline-light" size="sm" style="padding: 1px;" @click="toggleChecks('state')"><i :class="state_check_icon"></i></b-button> <em>All</em></span>
                            <b-form-checkbox-group
                                id="state_checkbox"
                                v-model="filter_arrays['state']"
                                :options="all_arrays['state']"
                                :aria-describedby="ariaDescribedbyState"
                                name="flavour-0"
                            ></b-form-checkbox-group>
                        </b-form-group>

                    </b-col>
                    
                </b-row>
                <br><br>
                <h3>Current selection:</h3>
                <b-row>
                    <div class="samples-div">
                        <div class="samples-count">{{filtered_samples_count}}</div>
                        <div class="samples-count-text">samples</div>
                    </div>
                </b-row>
                <br>
                <b-row>
                    <div class="samples-div">
                        <div class="samples-count">{{filtered_participants_count}}</div>
                        <div class="samples-count-text">participants</div>
                    </div>
                </b-row>
            </b-col>
        </b-row>
        <br><br>
        <b-row>
            <b-col style="text-align: left;">
                <b-button size="sm" variant="outline-light" class="option-button" @click="resetTable()"><i class="fas fa-rotate-left"></i> Reset Selection</b-button>
                <b-button size="sm" variant="outline-light" @click="addToBasket('checkboxes')"><i class="fas fa-cart-plus"></i> Add Selection to Basket</b-button>
            </b-col>
        </b-row>
    </b-card>

</template>

<script setup>
    import { inject, computed } from 'vue'
</script>





