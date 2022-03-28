<template>
  <div>
    <b-row class="text-center">
      <b-col>
        <div
          class="filter-card p-3"
          :class="{
            'bg-active-filter': totalIsActive,
            'bg-light': !totalIsActive,
          }"
          @click="totalContactsIsActiveFilter"
        >
          <h6>Total Contacts</h6>
          <h4>
            <strong>{{ totalContacts }}</strong>
          </h4>
        </div>
      </b-col>
      <b-col>
        <div
          class="filter-card p-3"
          :class="{
            'bg-active-filter': favoriteIsActive,
            'bg-light': !favoriteIsActive,
          }"
          @click="favoriteContactsIsActiveFilter"
        >
          <h6 class="text-secondary">Favorites</h6>
          <h4>
            <strong>{{ favoriteContacts }}</strong>
          </h4>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "Overview",
  props: {
    totalContacts: Number,
    favoriteContacts: Number,
  },
  data() {
    return {
      totalIsActive: true,
      favoriteIsActive: false,
    };
  },
  methods: {
    totalContactsIsActiveFilter() {
      this.totalIsActive = true;
      this.favoriteIsActive = false;
      this.$emit("totalContactsIsActive");
    },
    favoriteContactsIsActiveFilter() {
      this.totalIsActive = false;
      this.favoriteIsActive = true;
      this.$emit("favoriteContactsIsActive");
    },
  },
};
</script>

<style>
.filter-card:hover {
  cursor: pointer;
  text-decoration: underline;
}

.bg-active-filter {
  background-color: #e9f1fe;
  color: #074297;
}
</style>