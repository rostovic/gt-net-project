$(function () {
  const dataSource = new DevExpress.data.DataSource({
    load: function () {
      return sendRequest("/users", "GET", null);
    },
    insert: function (values) {
      return sendRequest(`/users`, "POST", {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        telephone: values.telephone,
      });
    },
    update: function (key, values) {
      return sendRequest(`/users/${key.id}`, "PUT", values);
    },
    remove: function (key) {
      return sendRequest(`/users/${key.id}`, "DELETE", null);
    },
  });

  async function sendRequest(url, method = "GET", data) {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body:
        method !== "GET" && method !== "DELETE" ? JSON.stringify(data) : null,
    };

    const response = await fetch(`http://localhost:3000${url}`, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An unknown error occurred.");
    }

    return response.json();
  }

  const grid = $("#gridContainer")
    .dxDataGrid({
      dataSource: dataSource,
      columns: [
        {
          dataField: "id",
          caption: "ID",
          allowEditing: false,
          dataType: "string",
          width: "30%",
          alignment: "center",
        },
        {
          dataField: "first_name",
          caption: "First name",
          validationRules: [
            { type: "required", message: "First name is required" },
          ],
          width: "15%",
          alignment: "center",
        },
        {
          dataField: "last_name",
          caption: "Last name",
          validationRules: [
            { type: "required", message: "Last name is required" },
          ],
          width: "15%",
          alignment: "center",
        },
        {
          dataField: "email",
          caption: "Email",
          validationRules: [
            { type: "required", message: "Email is required" },
            { type: "email", message: "Email is invalid" },
          ],
          width: "20%",
          alignment: "center",
        },
        {
          dataField: "telephone",
          caption: "Telephone",
          validationRules: [
            { type: "required", message: "Telephone is required." },
          ],
          width: "15%",
          alignment: "center",
        },
        {
          caption: "Actions",
          cellTemplate: function (container, options) {
            const button = createDeleteButton(options, dataSource, grid);
            container.append(button);
          },
          width: 100,
          alignment: "center",
        },
      ],
      repaintChangesOnly: true,
      showBorders: true,
      editing: {
        refreshMode: "reshape",
        mode: "cell",
        allowAdding: true,
        allowUpdating: true,
        allowDeleting: false,
      },
      paging: {
        pageSize: 5,
      },
      pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [5, 10, 20],
        showInfo: true,
        showNavigationButtons: true,
      },
      scrolling: {
        mode: "standard",
      },
      filterRow: { visible: true },
      searchPanel: {
        visible: true,
        highlightSearchText: true,
        placeholder: "Search by name or email...",
      },
      headerFilter: { visible: true },
      onRowUpdated: function (e) {
        grid.refresh();
      },
      onRowInserted: function (e) {
        grid.refresh();
      },
      onRowRemoved: function (e) {
        grid.refresh();
      },
      onDataErrorOccurred: function (e) {
        alert("Error: " + e.error.message);
      },
    })
    .dxDataGrid("instance");

  function createDeleteButton(options, dataSource, grid) {
    return $("<button>")
      .addClass("delete-button")
      .text("Delete")
      .on("click", function () {
        const shouldDelete = confirm(
          `Are you sure you want to delete ${options.data.first_name} ${options.data.last_name}?`
        );
        if (shouldDelete) {
          dataSource
            .store()
            .remove(options.data)
            .then(() => grid.refresh())
            .catch((error) => alert("Delete failed: " + error));
        }
      });
  }
});
