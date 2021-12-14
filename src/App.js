import "./App.css";

import { useEffect, useState } from "react";

import DataTable from "react-data-table-component";

// https://github.com/jbetancur/react-data-table-component
// https://react-data-table-component.netlify.app/

function App() {
  const $ = window.$;

  //********************************************** */
  const AJAX = true;
  //********************************************** */

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
    return () => {};
  }, []);

  const columns = [
    {
      name: "Actions",
      cell: (row, index, column, id) => {
        return (
          <button
            className="btn btn-link text-danger"
            onClick={(event) => handleDelete(event, row.id)}>
            Delete
          </button>
        );
      },
      button: true,
    },
    {
      name: "Id",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Email",
      cell: (row, index, column, id) => {
        return (
          <span
            style={{
              backgroundColor:
                row.email.includes("@gmail.com") ||
                row.email.includes("@hotmail.com")
                  ? "yellow"
                  : "unset",
            }}>
            {row.email}
          </span>
        );
      },
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Created",
      selector: (row) => row.created_at,
    },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: "Users per page",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Show All",
  };

  async function fetchUsers() {
    const response = await fetch("http://127.0.0.1:8000/api/v1.0/users-test");
    const data = await response.json();
    setUsers(data);
    console.log("data", data);
  }

  const handlePageChange = (page) => {
    console.log("Current page:", page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    console.log("Rows per page:", newPerPage);
  };

  const handleRowClick = (row) => {
    // event.preventDefault();
    console.log(row);
  };

  const handleDelete = (event, id) => {
    // event.stopPropagation();
    console.log("Deleting user " + id);
    const newUsers = users.filter((x) => x.id !== id);
    setUsers(newUsers);
  };

  return (
    <div className="App">
      <div className="container pt-2">
        <button
          className="btn btn-primary mb-3"
          onClick={() => {
            console.log("Users state:", users);
          }}>
          Check Users
        </button>

        <DataTable
          columns={columns}
          data={users}
          pagination
          // paginationComponentOptions={paginationComponentOptions}
          onChangeRowsPerPage={() => handlePerRowsChange()}
          onChangePage={() => handlePageChange()}
          onRowClicked={(row) => handleRowClick(row)}
        />
      </div>
    </div>
  );
}

export default App;
