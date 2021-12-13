// import "./App.css";

import { useEffect, useState } from "react";

function App() {
  const $ = window.$;

  //********************************************** */
  const AJAX = false;
  //********************************************** */

  const [users, setUsers] = useState([]);

  useEffect(() => {
    let dataTableOptions = {
      searching: true,
      processing: true,
      paging: true,
      pageLength: 5,
      // stateSave: true,
    };

    if (!AJAX) {
      fetchUsers();
    } else {
      dataTableOptions = {
        ...dataTableOptions,
        serverSide: true,
        ajax: {
          type: "GET",
          url: "https://gorest.co.in/public/v1/users",
          dataSrc: (response) => {
            console.log(response?.data);
            setUsers(response?.data);
            return response?.data;
          },
          error: (xhr, status, error) => {
            console.error(error);
          },
        },
        columns: [
          {
            data: "id",
            render: (id, type, row) => {
              // console.log(row);
              return '<button class="btn btn-link text-danger" onclick="handleDelete(id)">Delete</button>'; // NOT WORKING
            },
          },
          {
            data: "id",
          },
          {
            data: "email",
          },
          {
            data: "gender",
          },
          {
            data: "status",
          },
        ],
      };
    }

    $("#users-table").DataTable(dataTableOptions);
    return () => {
      $("#users-table").DataTable().destroy();
    };
  }, []);

  async function fetchUsers() {
    const response = await fetch("https://gorest.co.in/public/v1/users");
    const data = await response.json();
    setUsers(data.data);
    // console.log("data", data);
  }

  const handleRowClick = (event, user) => {
    event.preventDefault();
    alert(`You clicked on ${user.email}`);
  };

  const handleDelete = (event, id) => {
    event.stopPropagation();
    console.log("Deleting user " + id);
    const newUsers = users.filter((x) => x.id !== id);
    setUsers(newUsers);
  };

  return (
    <div className="App">
      <div className="container">
        <table
          id="users-table"
          className="table table-no-more table-striped table-hover mb-0">
          <thead>
            <tr>
              <th>Actions</th>
              <th>Id</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {!AJAX &&
              users.map((user) => (
                <tr
                  key={user.id}
                  onClick={(event) => handleRowClick(event, user)}
                  role="button">
                  <td>
                    <button
                      className="btn btn-link text-danger"
                      onClick={(event) => handleDelete(event, user.id)}>
                      Delete
                    </button>
                  </td>
                  <td>{user.id}</td>
                  <td>
                    <span
                      style={{
                        backgroundColor:
                          user.email.includes("@gmail.com") ||
                          user.email.includes("@hotmail.com")
                            ? "yellow"
                            : "unset",
                      }}>
                      {user.email}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        color: user.gender === "male" ? "blue" : "pink",
                      }}>
                      {user.gender}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        backgroundColor:
                          user.status === "active" ? "unset" : "red",
                        color: user.status === "active" ? "unset" : "white",
                      }}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
