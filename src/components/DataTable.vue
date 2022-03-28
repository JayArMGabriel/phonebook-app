<template>
  <div>
    <b-row>
      <b-alert v-model="showSuccessAlert" variant="success" dismissible>
        {{ alertMessage }}
      </b-alert>
    </b-row>
    <b-row>
      <overview
        :totalContacts="numberOfContacts"
        :favoriteContacts="favoriteContacts"
        @totalContactsIsActive="setFilterTotalIsActive"
        @favoriteContactsIsActive="setFilterFavoriteIsActive"
      ></overview>
    </b-row>
    <b-row class="mt-3">
      <b-card>
        <b-row align-h="between">
          <b-col cols="4">
            <h3>{{ tableHeader }}</h3>
          </b-col>
          <b-col cols="4">
            <b-row>
              <b-col>
                <b-form-input
                  v-model="filter"
                  type="search"
                  placeholder="Search..."
                ></b-form-input>
              </b-col>
              <b-col>
                <b-button
                  variant="primary"
                  id="show-btn"
                  @click="showCreateModal"
                >
                  <b-icon-plus class="text-white"></b-icon-plus>
                  <span class="h6 text-white">New Contact</span>
                </b-button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-table
            striped
            hover
            :items="items"
            :fields="fields"
            :filter="filter"
            :per-page="perPage"
            :current-page="currentPage"
            @filtered="onFiltered"
            sort-by="created_at"
            :sort-desc="true"
            label-sort-asc=""
            label-sort-desc=""
            label-sort-clear=""
            sort-icon-left
            class="text-center"
          >
            <template #cell(favorite)="data">
              <b-icon-bookmark-check-fill
                variant="success"
                v-if="data.item.favorite === '1'"
              ></b-icon-bookmark-check-fill>
              <b-icon-bookmark-x-fill
                variant="danger"
                v-else
              ></b-icon-bookmark-x-fill>
            </template>
            <template #cell(actions)="data">
              <b-row>
                <b-col cols="7">
                  <b-icon-pencil-square
                    class="action-item"
                    variant="primary"
                    @click="getRowData(data.item.id)"
                  ></b-icon-pencil-square>
                </b-col>
                <b-col cols="1">
                  <b-icon-trash-fill
                    class="action-item"
                    variant="danger"
                    @click="showDeleteModal(data.item.id)"
                  ></b-icon-trash-fill>
                </b-col>
              </b-row>
            </template>
          </b-table>
        </b-row>
        <b-row>
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
          ></b-pagination>
        </b-row>
      </b-card>
    </b-row>

    <!-- Modal for adding new contact -->
    <b-modal
      ref="create-modal"
      size="sm"
      hide-footer
      title="New Contact"
    >
      <create-form
        @closeCreateModal="closeCreateModal"
        @reloadDataTable="getContactsData"
        @showSuccessAlert="showAlertCreate"
      ></create-form>
    </b-modal>

    <!-- Modal for updating contact -->
    <b-modal
      ref="edit-modal"
      size="sm"
      hide-footer
      title="Edit Contact"
    >
      <edit-form
        @closeEditModal="closeEditModal"
        @reloadDataTable="getContactsData"
        @showSuccessAlert="showAlertUpdate"
        :contactId="contactId"
      ></edit-form>
    </b-modal>

    <!-- Delete contact Modal -->
    <b-modal
      ref="delete-modal"
      size="md"
      hide-footer
      title="Confirm Deletion"
    >
      <delete-modal
        @closeDeleteModal="closeDeleteModal"
        @reloadDataTable="getContactsData"
        @showDeleteAlert="showDeleteSuccessModal"
        :contactId="contactId"
      ></delete-modal>
    </b-modal>
  </div>
</template>

<script>
import Overview from "@/components/Overview.vue";
import CreateForm from "@/components/CreateForm.vue";
import EditForm from "@/components/EditForm.vue";
import DeleteModal from "@/components/DeleteModal.vue";
import { mapGetters } from 'vuex'

export default {
  components: {
    Overview,
    CreateForm,
    EditForm,
    DeleteModal,
  },
  data() {
    return {
      fields: [
        {
          key: "first_name",
          sortable: true,
        },
        {
          key: "last_name",
          sortable: true,
        },
        {
          key: "phone_number",
          sortable: false,
        },
        {
          key: "favorite",
          sortable: false,
        },
        {
          key: "created_at",
          sortable: true,
        },
        "actions",
      ],
      items: [],
      numberOfContacts: 0,
      favoriteContacts: 0,
      favoriteContactsData: [],
      contactId: 0,
      tableHeader: "",
      showSuccessAlert: false,
      alertMessage: "",
      perPage: 10,
      currentPage: 1,
      rows: 1,
      filter: null,
    };
  },
  mounted() {
    this.getContactsData();
    this.rows = this.items.length;
  },
  computed: {
    ...mapGetters({
      contactsData: 'getContacts'  
    })
  },
  methods: {
    onFiltered(filteredItems) {
      this.rows = filteredItems.length
      this.currentPage = 1
    },
    showCreateModal() {
      this.$refs["create-modal"].show();
    },
    closeCreateModal() {
      this.$refs["create-modal"].hide();
    },
    getContactsData() {
      this.tableHeader = "Total Contacts";
      if (localStorage.getItem("contacts") !== null) {
        let contacts = JSON.parse(localStorage.getItem('contacts'));
        this.items = contacts;
      } else {
        this.items = this.contactsData
      }

      this.numberOfContacts = this.items.length;
      this.favoriteContactsData = this.items.filter(
        (item) => item.favorite === "1"
      );
      this.favoriteContacts = this.favoriteContactsData.length;
    },
    getRowData(id) {
      this.$refs["edit-modal"].show();
      this.contactId = id;
    },
    closeEditModal() {
      this.$refs["edit-modal"].hide();
    },
    setFilterTotalIsActive() {
      this.tableHeader = "Total Contacts";
      this.getContactsData();
    },
    setFilterFavoriteIsActive() {
      this.tableHeader = "Favorites";
      this.items = this.favoriteContactsData;
    },
    showAlertCreate() {
      this.showSuccessAlert = true;
      this.alertMessage = "Contact was created successfully!";
    },
    showAlertUpdate() {
      this.showSuccessAlert = true;
      this.alertMessage = "Contact was updated successfully";
    },
    showDeleteModal(id) {
      this.$refs["delete-modal"].show();
      this.contactId = id;
    },
    closeDeleteModal() {
      this.$refs["delete-modal"].hide();
    },
    showDeleteSuccessModal() {
      this.showSuccessAlert = true;
      this.alertMessage = "Contact was deleted successfully!";
    },
  },
};
</script>

<style scss="scoped">
.action-item:hover {
  cursor: pointer;
}
</style>