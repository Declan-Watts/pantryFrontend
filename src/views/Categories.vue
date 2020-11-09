<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card :loading="categoriesLoading">
          <v-toolbar color="primary" dark>
            Category List
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon dark v-bind="attrs" v-on="on">
                  mdi-information-variant
                </v-icon>
              </template>
              <div class="helperToolTip">
                <h1 class="mt-2 mb-2">What are Categories?</h1>
                <p>
                  Categories are pre-defined categories for Pantries items to
                  use. For Example, Milk with have the Dairy Category applied to
                  it.
                </p>
                <h1 class="mt-2 mb-2">Creating a New Category</h1>
                <p>
                  To create a New Category, you first must click the NEW button.
                  This will open up a Dialog with a Form in it, fill out this
                  form and then submit it.
                </p>
                <h1 class="mt-2 mb-2">Viewing and Editing a Category</h1>
                <p>
                  To View a Category, you can either Double click on the row in
                  the Table, or click on the Action menu to the left, then
                  select View Details.
                </p>
                <p class="mt-2">
                  To Edit a Category, once viewing the Category, click on the
                  pencil button at the top of the Dialog, then once Eddited,
                  Save the form
                </p>
                <h1 class="mt-2 mb-2">Deleting a Category</h1>
                <p>
                  To Delete a Category, you need to open the Action Menu by
                  clicking the three lines to the right. Once the action menu is
                  opened, you will need to click the delete option.
                  <span style="color: orange"
                    >WARNING: Deleting a Category is Irreversable and will
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
            @newButtonClick="newCategoryDialog = true"
          />
          <v-card-text v-if="categories">
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
          Category
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
          <v-form ref="editCategoryForm">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="viewFormData.name"
                  label="Name"
                  :readonly="!editMode"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="viewFormData.status"
                  label="Status"
                  :items="['Disabled', 'Pending', 'Approved']"
                  :readonly="!editMode"
                >
                </v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="editMode"
            @click="saveCategory()"
            :loading="saveCategoryLoading"
            text
            color="primary"
          >
            <v-icon class="pr-2">mdi-content-save-all</v-icon>
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="newCategoryDialog" persistent max-width="600px">
      <v-card tile>
        <v-toolbar color="primary" dark>
          New Category
          <v-spacer></v-spacer>
          <v-btn color="white" icon dark @click="newCategoryDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="newCategoryForm">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="newCategoryFormData.Name"
                  label="Name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="newCategoryFormData.Status"
                  label="Status"
                  :items="['Disabled', 'Pending', 'Approved']"
                >
                </v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="addNewCategory()"
            :loading="addNewCategoryLoading"
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
        "categories",
        "categoriesLoading",
        "categories",
        "categoriesLoading",
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

      //Dialogs
      viewDetailsDialog: false,
      newCategoryDialog: false,

      //New Category Item
      newCategoryFormData: {},
      addNewCategoryLoading: false,

      //Edit Category
      editMode: false,
      saveCategoryLoading: false,
      viewFormData: {},

      //Delete Category
      deleteItemLoading: false,
    }),
    watch: {
      categories: function (oldPI, newPI) {
        if (this.categories != null) {
          this.setGridData();
        }
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
          field: "categoriesID",
        },
        {
          headerName: "Name",
          field: "name",
        },
        {
          headerName: "Staus",
          field: "status",
        },
      ];
      this.$store.dispatch("loadCategories", false).then(() => {
        this.setGridData();
      });

      if (this.aGGridActionMenu == true) {
        this.$store.dispatch("setAGGridActionMenuState", {});
      }
    },
    methods: {
      setGridData() {
        const rowData = this.categories;
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
        }, 100);
      },
      onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        if (this.categories.length != 0) {
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
      addNewCategory() {
        this.newCategoryLoading = true;
        this.$store
          .dispatch("newCategory", this.newCategoryFormData)
          .then((result) => {
            this.newCategoryLoading = false;
            if (result.Result == "Success") {
              this.newCategoryDialog = false;
              this.$swal({
                title: "Success!",
                text: "The Category Successfully Added",
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
      saveCategory() {
        this.saveCategoryLoading = true;
        this.$store.dispatch("saveCategory", this.viewFormData).then((result) => {
          this.saveCategoryLoading = false;
          this.editMode = false;
          if (result.Result == "Success") {
            this.$swal({
              title: "Success!",
              text: "The Category Successfully Saved",
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
          text: "Deleting this Category will delete all of its Children",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.value) {
            this.$store
              .dispatch("deleteCategory", this.selectedRowData.categoriesID)
              .then((result) => {
                this.deleteItemLoading = false;
                this.updateAGGridActionMenu();
                if (result.Result == "Success") {
                  this.$swal({
                    title: "Success!",
                    text: "The Category Successfully Deleted",
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
