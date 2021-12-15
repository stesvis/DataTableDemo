// import "./App.css";

import { useEffect, useState } from "react";

import Enumerable from "linq";
import TablePagination from "./TablePagination";

function App() {
  const [usersResponse, setUsersResponse] = useState();
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchUsers(
    url = `http://127.0.0.1:8000/api/v1.0/users?paginate=${pageSize}`
  ) {
    const response = await fetch(url, {
      headers: {
        Authorization: "Bearer 15|vDsnCbQAUVhfWE4nfjYXRcUfYPYJmOBUxjTqkg0f",
      },
    });
    const data = await response.json();
    const links = data?.meta?.links.slice(1, -1);
    setUsersResponse({ ...data, meta: { ...data.meta, links: links } });
  }

  const handleRowClick = (event, user) => {
    event.preventDefault();
    alert(`You clicked on ${user.email}`);
  };

  const handleDelete = (event, id) => {
    event.stopPropagation();
    console.log("Deleting user " + id);
    const newUsers = usersResponse?.data?.filter((x) => x.id !== id);
    setUsersResponse({ ...usersResponse, data: newUsers });
  };

  const handlePageChange = async (url) => {
    console.log("Current page:", url);
    await fetchUsers(url);
  };

  const handlePageSizeChange = async (newPerPage, page) => {
    console.log("Rows per page:", newPerPage);
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
            {usersResponse?.data?.map((user) => (
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

        <TablePagination
          firstPage={usersResponse?.meta?.from}
          lastPage={usersResponse?.meta?.last_page}
          totalSize={usersResponse?.meta?.total}
          pageSize={pageSize}
          links={usersResponse?.meta?.links}
          prevLink={usersResponse?.links?.prev}
          nextLink={usersResponse?.links?.next}
          onPageChange={(url) => handlePageChange(url)}
        />
      </div>
    </div>
  );
}

export default App;
