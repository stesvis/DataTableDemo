// import "./App.css";

import { useEffect, useState } from "react";

function App() {
  const $ = window.$;

  //********************************************** */
  const ajax = true;
  //********************************************** */

  const [users, setUsers] = useState([]);

  useEffect(() => {
    let dataTableOptions = {
      searching: true,
      processing: true,
      paging: true,
      // pageLength: 10,
      // stateSave: true,
    };

    if (!ajax) {
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
    console.log("data", data);
  }

  const handleRowClick = (user) => {
    alert(`You clicked on ${user.email}`);
  };

  return (
    <div className="App">
      <div className="container">
        <table
          id="users-table"
          className="table table-no-more table-striped table-hover mb-0">
          <thead>
            <tr>
              <th>Id</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {!ajax &&
              users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => handleRowClick(user)}
                  role="button">
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
