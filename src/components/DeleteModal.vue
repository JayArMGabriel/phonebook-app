<template>
  <div>
    <b-row class="mt-2 mb-3">
      <h6 class="text-secondary">
        Are you sure you want to delete this contact?
      </h6>
    </b-row>
    <b-row class="mt-2 mb-3">
      <p class="text-danger">
        This action is not reversible and may result in the loss if important
        data.
      </p>
    </b-row>
    <b-row class="mt-4">
      <b-col>
        <b-button variant="danger" @click="removeContactFromData"
          >Delete Contact</b-button
        >
      </b-col>
      <b-col>
        <b-button variant="warning" @click="triggerClose">Close</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>

export default {
  name: "DeleteModal",
  props: {
    contactId: Number,
  },
  methods: {
    triggerClose() {
      this.$emit("closeDeleteModal");
    },
    removeContactFromData() {
      let contacts = JSON.parse(localStorage.getItem('contacts'));
      let newArr = contacts.filter((item) => item.id !== this.contactId);
      this.$store.dispatch('updateContacts', newArr)
        .then(() => {
          this.$emit("reloadDataTable");
          this.$emit("showDeleteAlert");
          this.$emit("closeDeleteModal");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>