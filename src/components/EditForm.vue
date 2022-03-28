<template>
  <b-form>
    <b-row>
      <h4 class="text-secondary">Details</h4>
    </b-row>
    <b-row class="mt-2">
      <b-col>
        <b-form-group
          label="First Name"
        >
          <b-form-input
            id="first_name"
            type="text"
            v-model="contact.first_name"
            @keypress="isAlfa"
          ></b-form-input>
          <div
          v-if="errorFirstName"
          class="error"
          >
            {{ errorFirstName }}
          </div>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col>
        <b-form-group
          label="Last Name"
        >
          <b-form-input
            id="last_name"
            type="text"
            v-model="contact.last_name"
            @keypress="isAlfa"
          ></b-form-input>
          <div
          v-if="errorLastName"
          class="error"
          >
            {{ errorLastName }}
          </div>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col>
        <b-form-group
          label="Phone Number"
        >
          <b-form-input
            id="phone_number"
            type="text"
            :formatter="formatNumber"
            v-model="contact.phone_number"
            placeholder="9xxxxxxxxx"
            @keypress="onlyNumber"
          ></b-form-input>
          <div
            v-if="errorPhoneNumber"
            class="error"
          >
            {{ errorPhoneNumber }}
          </div>
          <div
            v-if="errorNumber"
            class="error"
          >
            {{ errorNumber }}
          </div>     
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-form-checkbox
        id="favorite"
        v-model="contact.favorite"
        name="Favorite"
        value="1"
        unchecked-value="0"
      >
        Contact is Favorite
      </b-form-checkbox>
    </b-row>
    <div v-if="error" class="error">{{ error }}</div>
    <b-row class="mt-4">
      <b-col cols="6">
        <b-button variant="primary" @click="updateContact"
          >Update Contact</b-button
        >
      </b-col>
      <b-col cols="6">
        <b-button variant="warning" @click="triggerClose">Close</b-button>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>

export default {
  name: "EditModal",
  props: {
    contactId: Number,
  },
  data() {
    return {
      contact: {},
      error: '',
      errorNumber: ''
    };
  },
  computed: {
    errorFirstName () {
      if(this.contact.first_name) {
        return this.contact.first_name.trim().length < 3
          ? 'Please enter a longer first name '
          : ''
      }
      return ''
    },
    errorLastName () {
      if(this.contact.last_name) {
        return this.contact.last_name.trim().length < 3
          ? 'Please enter a longer last name '
          : ''
      }
      return ''
    },
    errorPhoneNumber () {
      if(this.contact.phone_number) {
        return this.contact.phone_number.trim().length < 10
          ? 'Please enter phone number with at least 10 numbers.'
          : ''
      }
      return ''
    }
  },
  mounted() {
    this.getContactsByID();
  },
  methods: {
    formatNumber(e){
     return String(e).substring(0,10);
    },
    onlyNumber($event) {
      let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
      if(keyCode < 48 || keyCode > 57) {
        $event.preventDefault();
      }
      this.errorNumber = '';
    },
    isAlfa($event) {
        let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
        if(keyCode == 45 || keyCode == 189 || keyCode == 46 || keyCode == 190 || keyCode == 32 || keyCode == 37 || keyCode == 39) {
          return true;
        } else  {
          if(keyCode > 31 && (keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 122)) {
            event.preventDefault();
          }
        }
    },
    triggerClose() {
      this.$emit("closeEditModal");
    },
    getContactsByID() {
      let contacts = JSON.parse(localStorage.getItem('contacts'));
      this.contact = contacts.find(item => item.id === this.contactId);
      this.contact.phone_number = this.contact.phone_number.replace("+63", "");
    },
    updateContact() {
      if (localStorage.getItem("contacts") !== null && localStorage.getItem("contacts") !== '[]') {
        let contacts = JSON.parse(localStorage.getItem('contacts'));
        let phone_number = '+63'+this.contact.phone_number
        if(contacts.find(item => item.phone_number === phone_number))
          this.errorNumber = 'Phone Number already exists.'
        else
          this.errorNumber = ''
      }    

      if(this.errorNumber != '' || this.errorFirstName !== '' || this.errorLastName || '' && this.errorPhoneNumber || '') {
        this.error = 'Please complete all the errors.';
      } else {
        // Require `PhoneNumberFormat`.
        const PNF = require('google-libphonenumber').PhoneNumberFormat;

        // Get an instance of `PhoneNumberUtil`.
        const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

        // Parse number with country code and keep raw input.
        const number = phoneUtil.parseAndKeepRawInput(this.contact.phone_number, 'PH');

        const phone_number = phoneUtil.format(number, PNF.E164);

        let contacts = JSON.parse(localStorage.getItem('contacts'));
        let newArr = contacts.map(obj => {
          if (obj.id === this.contactId) {
            return {...obj, first_name: this.contact.first_name,
                            last_name: this.contact.last_name,
                            phone_number: phone_number,
                            favorite: this.contact.favorite };
          }
          return obj;
        });
        this.$store.dispatch('updateContacts', newArr)
          .then(() => {
            this.$emit("closeEditModal");
            this.$emit("reloadDataTable");
            this.$emit("showSuccessAlert");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
};
</script>

<style scss="scoped">
.error {
  color: red;
}
#favorite {
  margin-right: 10px;
}
</style>