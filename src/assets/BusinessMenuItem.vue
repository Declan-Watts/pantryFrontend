<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12">
        <v-card :loading="businessLoading">
          <v-toolbar color="primary" dark dense>Your Menu</v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <h2 style="color: black;">Menu Category</h2>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="selectedCategoryID"
                  :items="business.menuCategory"
                  item-text="name"
                  item-value="id"
                  label="Category"
                  hide-details
                  class="mb-1"
                  v-on:change="selectedCategory()"
                ></v-select>
              </v-col>
              <v-col v-if="formData.id" cols="6">
                <v-text-field v-model="formData.name" label="Category Name"></v-text-field>
              </v-col>
              <v-col v-if="formData.id" cols="6">
                <v-select
                  v-model="formData.status"
                  :items="categoryStatusOptions"
                  label="Status"
                  hide-details
                  class="mb-1"
                ></v-select>
              </v-col>
              <v-col cols="12" style="text-align: center">
                <v-btn
                  style="margin: 5px"
                  color="primary"
                  @click="newCategoryDialog = !newCategoryDialog"
                >New Category</v-btn>
                <v-btn v-if="formData.id" @click="save()" color="primary btnMargin">Save</v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row v-if="formData.menuItems">
              <v-col cols="12">
                <h2 style="color: black;">{{ formData.name }}: Menu Items</h2>
              </v-col>
              <v-divider></v-divider>
              <v-col v-for="(item, i) in formData.menuItems" :key="`b_${item.id}`" cols="12">
                <v-row>
                  <v-img v-if="formData.menuItems[i].imageUrl == null" src="../assets/default.jpg"></v-img>
                  <v-img v-else :src="formData.menuItems[i].imageUrl"></v-img>
                  <v-col cols="12" style="text-align: right;">
                    <v-file-input
                      v-if="changeImage"
                      v-model="files"
                      accept="image/png, image/jpeg"
                      placeholder="Change Image"
                      prepend-icon="mdi-camera"
                      label="Menu Image"
                      type="file"
                    ></v-file-input>
                    <v-btn
                      v-if="!changeImage"
                      color="blue"
                      @click="changeImage = !changeImage"
                      dark
                    >Change Image</v-btn>
                    <v-btn
                      v-if="changeImage"
                      color="blue"
                      @click="changeImageMethod(i)"
                      dark
                    >Upload Image</v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="formData.menuItems[i].name" label="Name"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="formData.menuItems[i].price" label="Price" type="number"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="formData.menuItems[i].description" label="Description"></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      class="btnMargin"
                      dark
                      @click="
                        selectedMenuItemIndex = i;
                        notesDialog = !notesDialog;
                      "
                      color="blue"
                    >Notes</v-btn>
                    <v-btn
                      class="btnMargin"
                      dark
                      @click="
                        selectedMenuItemIndex = i;
                        optionsDialog = !optionsDialog;
                      "
                      color="blue"
                    >Options</v-btn>
                    <v-btn
                      class="btnMargin"
                      dark
                      @click="
                        selectedMenuItemIndex = i;
                        extrasDialog = !extrasDialog;
                      "
                      color="blue"
                    >Extras</v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions v-if="formData.menuItems">
            <v-spacer></v-spacer>
            <v-btn class="primary" @click="newMenuItem = !newMenuItem">
              <v-icon left>mdi-plus</v-icon>Add
            </v-btn>
            <v-btn v-if="formData.menuItems.length > 0" @click="save()" class="primary">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-dialog v-model="newCategoryDialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">New Menu Category</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="formData.name" label="Category Name"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" dark @click="newCategoryDialog = !newCategoryDialog">Close</v-btn>
            <v-btn color="primary" dark @click="newMenuCategory()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="newMenuItem" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">New Menu Item</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="formDataNewMenuItem.name" label="Name"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="formDataNewMenuItem.price" label="Price" type="number"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="formDataNewMenuItem.description" label="Description"></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" dark @click="newMenuItem = !newMenuItem">Close</v-btn>
            <v-btn
              color="primary"
              dark
              @click="
                formData.menuItems.push(formDataNewMenuItem);
                formDataNewMenuItem = {};
                save();
                newMenuItem = !newMenuItem;
              "
            >Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="notesDialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Notes & Dietry Options</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row v-if="selectedMenuItemIndex != null">
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.menuItems[selectedMenuItemIndex].notes"
                    label="Notes"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="
                      formData.menuItems[selectedMenuItemIndex].dietryOptions
                    "
                    label="Dietry Options"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" dark @click="notesDialog = !notesDialog">Close</v-btn>
            <v-btn
              color="primary"
              dark
              @click="
                save();
                notesDialog = !notesDialog;
              "
            >Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="optionsDialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Options</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row v-if="selectedMenuItemIndex != null"></v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" dark @click="optionsDialog = !optionsDialog">Close</v-btn>
            <v-btn
              color="primary"
              dark
              @click="
                save();
                optionsDialog = !optionsDialog;
              "
            >Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="extrasDialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Extras</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row v-if="selectedMenuItemIndex != null"></v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" dark @click="extrasDialog = !extrasDialog">Close</v-btn>
            <v-btn
              color="primary"
              dark
              @click="
                save();
                extrasDialog = !extrasDialog;
              "
            >Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    computed: {
      ...mapGetters(["currentUser", "business", "businessLoading"])
    },
    mounted() {
      this.$store.dispatch("loadBusiness");
    },
    data: () => ({
      newCategoryDialog: false,
      newMenuItem: false,
      changeImage: false,
      notesDialog: false,
      optionsDialog: false,
      extrasDialog: false,
      files: null,
      formData: {},
      formDataNewMenuItem: {},
      categoryStatusOptions: ["Pending", "Suspended", "Approved"],
      selectedCategoryID: null,
      changeImageDialog: false,
      selectedMenuItemIndex: null
    }),
    methods: {
      newMenuCategory() {
        let payload = {
          name: this.formData.name
        };
        this.$store.dispatch("newMenuCategory", payload).then(result => {
          this.newCategoryDialog = !this.newCategoryDialog;
          this.formData = {};
          if (result.Status === "Error") {
            this.$swal({
              title: "Failed!",
              text: "There was an error with the Filled out Data",
              type: "error",
              cancelButtonText: "Close"
            });
          } else if (result.Status === "Success") {
            this.$swal({
              title: "Success!",
              text: "Thanks your Category has been Created",
              type: "success",
              confirmButtonText: "Ok"
            });
          }
        });
      },
      save() {
        this.$store.dispatch("saveMenuCategory", this.formData).then(result => {
          if (result.Status === "Error") {
            this.$swal({
              title: "Failed!",
              text: "There was an error with the Filled out Data",
              type: "error",
              cancelButtonText: "Close"
            });
          } else if (result.Status === "Success") {
            this.$swal({
              title: "Success!",
              text: "Thanks your Category has been Saved",
              type: "success",
              confirmButtonText: "Ok"
            });
          }
        });
      },
      selectedCategory() {
        let category = this.business.menuCategory.filter(
          cat => cat.id === this.selectedCategoryID
        );
        this.formData = category[0];
      },
      changeImageMethod(i) {}
    }
  };
</script>

<style scoped>
  .new {
    color: black;
    font-weight: bold;
  }

  .dispatched {
    color: blue;
    font-weight: bold;
  }

  .picked {
    color: orange;
    font-weight: bold;
  }

  .delivered {
    color: green;
    font-weight: bold;
  }
  .col p {
    margin: 0;
  }
  .highlight {
    background: #b7e4ff !important;
  }

  .btnMargin {
    margin: 5px;
  }
</style>
