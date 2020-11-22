<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card :loading="pantryItemsStockLoading">
          <v-toolbar color="primary" dark>
            Pantry Stock List
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon dark v-bind="attrs" v-on="on"
                  >mdi-information-variant</v-icon
                >
              </template>
              <div class="helperToolTip">
                <h1 class="mt-2 mb-2">What are Pantry Stock?</h1>
                <p>
                  Pantry Stock is the stock that the user currently has of the
                  Pantry Items.
                </p>
                <h1 class="mt-2 mb-2">Creating a New Pantry Stock</h1>
                <p>
                  To create a New Pantry Stock, you first must click the NEW
                  button. This will open up a Dialog with a Form in it, fill out
                  this form and then submit it.
                </p>
                <h1 class="mt-2 mb-2">Viewing and Editing a Pantry Stock</h1>
                <p>
                  To View a Pantry Stock, you can either Double click on the row
                  in the Table, or click on the Action menu to the left, then
                  select View Details.
                </p>
                <p class="mt-2">
                  To Edit a Pantry Stock, once viewing the Pantry Stock, click
                  on the pencil button at the top of the Dialog, then once
                  Eddited, Save the form
                </p>
                <h1 class="mt-2 mb-2">Deleting a Pantry Stock</h1>
                <p>
                  To Delete a Pantry Stock, you need to open the Action Menu by
                  clicking the three lines to the right. Once the action menu is
                  opened, you will need to click the delete option.
                  <span style="color: orange"
                    >WARNING: Deleting a Pantry Stock is Irreversable and will
                    delete all of its Children.</span
                  >
                </p>
              </div>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              label="Search"
              single-line
              hide-details
              prepend-icon="mdi-magnify"
              clearable
              v-on:input="onQuickFilterChanged()"
            ></v-text-field>
          </v-toolbar>
          <expandedToolbar
            :newButton="true"
            @newButtonClick="newPantryItemsStockDialog = true"
          />
          <v-card-text v-if="pantryItemsStock">
            <v-row>
              <v-col style="height: calc(100vh - 190px) !important" cols="12">
                <ag-grid-vue
                  :style="{ width, height }"
                  class="ag-theme-alpine"
                  :defaultColDef="defaultColDef"
                  :columnDefs="columnDefs"
                  :rowData="rowData"
                  :animateRows="true"
                  :rowBuffer="1"
                  :paginationAutoPageSize="true"
                  :pagination="true"
                  rowSelection="multiple"
                  @grid-ready="onGridReady"
                  @cellDoubleClicked="onCellDoubleClick"
                ></ag-grid-vue>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="aGGridActionMenu" persistent max-width="300px">
      <v-card tile>
        <v-toolbar color="primary" dark>
          Action Menu
          <v-spacer></v-spacer>
          <v-btn color="white" icon dark @click="updateAGGridActionMenu()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-list v-if="selectedRowData" dense>
                  <v-list-item @click="viewStockDetails()">
                    <v-list-item-action>
                      <v-icon>mdi-information-variant</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>View Details</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    @click="
                      viewStockDetails();
                      editMode = true;
                    "
                  >
                    <v-list-item-action>
                      <v-icon>mdi-pencil</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    :loading="deleteItemLoading"
                    @click="deleteItem()"
                  >
                    <v-list-item-action>
                      <v-icon>mdi-delete</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="viewDetailsDialog" persistent max-width="600px">
      <v-card tile>
        <v-toolbar color="primary" dark>
          Pantry Stock
          <v-btn
            class="editDialogButton ml-1"
            color="white"
            icon
            dark
            @click="toggleEditMode()"
          >
            <v-icon v-if="!editMode" class="editDialogIcon">mdi-pencil</v-icon>
            <v-icon v-else class="editDialogIcon">mdi-close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="white"
            icon
            dark
            @click="
              viewDetailsDialog = false;
              revertUnsavedChanged();
            "
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="editpantryItemsStockForm">
            <v-row>
              <v-col v-if="viewFormData.pantryItems" cols="12" sm="6">
                <v-text-field
                  v-model="viewFormData.pantryItems.name"
                  label="Name"
                  :readonly="!editMode"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="viewFormData.qty"
                  label="Quantity"
                  type="number"
                  min="0"
                  :readonly="!editMode"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="viewFormData.expirationDate"
                  label="Expiration Date"
                  :readonly="true"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="viewFormData.dateBought"
                  label="Date Bought"
                  :readonly="true"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="editMode"
            @click="savePantryItemsStock()"
            :loading="savePantryItemsStockLoading"
            text
            color="primary"
          >
            <v-icon class="pr-2">mdi-content-save-all</v-icon>
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="newPantryItemsStockDialog" persistent max-width="600px">
      <v-card tile>
        <v-toolbar color="primary" dark>
          Item #{{ selectedRowData.id }}
          <v-spacer></v-spacer>
          <v-btn
            color="white"
            icon
            dark
            @click="newPantryItemsStockDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="newpantryItemsStockForm">
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="newPantryItemsStockFormData.PantryItemsID"
                  label="Pantry Item"
                  :items="pantryItems"
                  item-text="name"
                  item-value="pantryItemsID"
                  auto-select-first
                  clearable
                  solo
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="newPantryItemsStockFormData.Qty"
                  label="Quantity"
                  type="number"
                  min="0"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-dialog
                  ref="dialog"
                  v-model="modal"
                  :return-value.sync="
                    newPantryItemsStockFormData.ExpirationDate
                  "
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="newPantryItemsStockFormData.ExpirationDate"
                      label="Expiration Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="date" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog.save(date)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="addNewpantryItemsStock()"
            :loading="addNewPantryItemsStockLoading"
            text
            color="primary"
          >
            <v-icon>mdi-plus</v-icon>
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { mapGetters } from "vuex";
  import AppBar from "@/components/AppBar";
  import agGridActionButton from "@/components/agGridActionButton";
  import expandedToolbar from "@/components/expandedToolbar.vue";
  import { AgGridVue } from "ag-grid-vue";
  import moment from "moment";

  export default {
    components: {
      AppBar,
      AgGridVue,
      agGridActionButton,
      expandedToolbar,
    },
    computed: {
      ...mapGetters([
        "currentUser",
        "currentUserData",
        "aGGridActionMenu",
        "selectedRowData",
        "pantryItemsStock",
        "pantryItemsStockLoading",
        "categories",
        "categoriesLoading",
        "pantryItems",
        "pantryItemsLoading",
      ]),
    },
    props: {
      source: String,
    },
    data: () => ({
      // AG-Grid
      columnDefs: null,
      rowData: null,
      columnApi: null,
      gridApi: null,
      defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true,
        autoHeight: true,
      },
      width: "100%",
      height: "100%",
      search: "",
      searchDebounce: null,

      //ExpirationDatePicker
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,

      //Dialogs
      viewDetailsDialog: false,
      newPantryItemsStockDialog: false,

      //New Pantry Item
      newPantryItemsStockFormData: {},
      addNewPantryItemsStockLoading: false,

      //Edit Category
      editMode: false,
      savePantryItemsStockLoading: false,
      viewFormData: {},

      //Delete Category
      deleteItemLoading: false,
    }),
    watch: {
      pantryItemsStock: function (oldPI, newPI) {
        this.setGridData();
      },
    },
    mounted() {
      this.columnDefs = [
        {
          headerName: "Actions",
          field: "actions",
          cellRendererFramework: "agGridActionButton",
        },
        {
          headerName: "ID",
          field: "stockID",
        },
        {
          headerName: "Name",
          field: "pantryItems.name",
        },
        {
          headerName: "Quantity",
          field: "qty",
        },
        {
          headerName: "Expiration Date",
          field: "expirationDate",
        },
        {
          headerName: "Date Bought",
          field: "dateBought",
        },
      ];
      this.$store.dispatch("loadPantryItemsStock", false).then(() => {
        this.setGridData();
      });

      if (this.aGGridActionMenu == true) {
        this.$store.dispatch("setAGGridActionMenuState", {});
      }
      this.$store.dispatch("loadCategories");
      this.$store.dispatch("loadPantryItems");
    },
    methods: {
      setGridData() {
        const rowData = this.pantryItemsStock;
        this.gridApi.setRowData(rowData);
        setTimeout(() => {
          var allColumnIds = [];
          this.columnApi.getAllColumns().forEach(function (column) {
            allColumnIds.push(column.colId);
          });
          this.columnApi.autoSizeColumns(allColumnIds, false);
        }, 50);
      },
      onQuickFilterChanged() {
        clearTimeout(this.searchDebounce);
        this.searchDebounce = setTimeout(() => {
          this.gridApi.setQuickFilter(this.search);
        }, 500);
      },
      onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        if (this.pantryItemsStock.length != 0) {
          setTimeout(() => {
            this.setGridData();
          }, 200);
        }
      },
      autoSizeColumnsAGGRID() {
        // this.gridApi.sizeColumnsToFit();
        var allColumnIds = [];
        this.columnApi.getAllColumns().forEach(function (column) {
          allColumnIds.push(column.colId);
        });
        this.columnApi.autoSizeColumns(allColumnIds, false);
      },
      onCellDoubleClick(cell) {
        this.$store.dispatch("setSelectedRowData", cell.data);
        this.viewStockDetails();
      },
      updateAGGridActionMenu() {
        this.$store.dispatch("setAGGridActionMenuState", {});
      },
      viewStockDetails() {
        this.viewFormData = this.selectedRowData;

        this.viewDetailsDialog = true;
      },
      addNewpantryItemsStock() {
        this.newPantryItemsStockLoading = true;
        this.$store
          .dispatch("newPantryItemsStock", this.newPantryItemsStockFormData)
          .then((result) => {
            this.newPantryItemsStockLoading = false;
            if (result.Result == "Success") {
              this.newPantryItemsStockDialog = false;
              this.$swal({
                title: "Success!",
                text: "Pantry Stock Successfully Added",
                type: "success",
                confirmButtonText: "Ok",
              });
            } else {
              this.$swal({
                title: "Error!",
                text: "There was an Error, Please try again later",
                type: "error",
                confirmButtonText: "Ok",
              });
            }
          });
      },
      revertUnsavedChanged() {
        this.editMode = false;
      },
      toggleEditMode() {
        this.editMode = !this.editMode;
      },
      savePantryItemsStock() {
        this.newPantryItemsStockLoading = true;
        this.$store
          .dispatch("savePantryItemsStock", this.viewFormData)
          .then((result) => {
            this.newPantryItemsStockLoading = false;
            this.editMode = false;
            if (result.Result == "Success") {
              this.$swal({
                title: "Success!",
                text: "The Pantry Stock Successfully Saved",
                type: "success",
                confirmButtonText: "Ok",
              });
            } else {
              this.$swal({
                title: "Error!",
                text: "There was an Error, Please try again later",
                type: "error",
                confirmButtonText: "Ok",
              });
            }
          });
      },
      deleteItem() {
        this.deleteItemLoading = true;
        this.$swal({
          title: "Are you Sure?",
          text: "Deleting this Pantry Stock will delete all of its Children",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.value) {
            this.$store
              .dispatch("deletePantryItemsStock", this.selectedRowData.stockID)
              .then((result) => {
                this.deleteItemLoading = false;
                this.updateAGGridActionMenu();
                if (result.Result == "Success") {
                  this.$swal({
                    title: "Success!",
                    text: "The Pantry Stock Successfully Deleted",
                    type: "success",
                    confirmButtonText: "Ok",
                  });
                } else {
                  this.$swal({
                    title: "Error!",
                    text: "There was an Error, Please try again later",
                    type: "error",
                    confirmButtonText: "Ok",
                  });
                }
              });
          }
        });
      },
    },
  };
  window.categoryNameFormatter = function categoryNameFormatter(params) {
    return params.data.categories.name;
  };
</script>

<style>
  .croppa-container {
    margin-left: auto;
    margin-right: auto;
    position: relative;
  }

  .croppa-container canvas {
    border: 1px solid;
  }
</style>
