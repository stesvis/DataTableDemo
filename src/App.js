import "./App.css";

import { useEffect, useState } from "react";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DataTable from "react-data-table-component";
import DataTablePagination from "./DataTablePagination";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// https://github.com/jbetancur/react-data-table-component
// https://react-data-table-component.netlify.app/

function App() {
  const [usersResponse, setUsersResponse] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isBusy, setIsBusy] = useState(false);
  const [sortOptions, setSortOptions] = useState({
    column: "id",
    direction: "asc",
  });

  useEffect(() => {
    fetchUsers(
      `http://127.0.0.1:8000/api/v1.0/users?paginate=${pageSize}&page=${currentPage}&sortColumn=${sortOptions.column}&sortDirection=${sortOptions.direction}`
    );
    return () => {};
  }, [pageSize, currentPage, sortOptions]);

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
      sortable: true,
      sortField: "id",
      selector: (row) => row.id,
    },
    {
      name: "Email",
      sortable: true,
      sortField: "email",
      cell: (row, index, column, id) => {
        return (
          <span
            style={{
              backgroundColor:
                row.email.includes("@levitica.ca") ||
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
      sortable: true,
      sortField: "name",
      selector: (row) => row.name,
    },
    {
      name: "Created",
      sortable: true,
      sortField: "created_at",
      selector: (row) => new Date(row.created_at).toDateString(),
    },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: "Users per page",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Show All",
  };

  async function fetchUsers(
    url = `http://127.0.0.1:8000/api/v1.0/users?paginate=${pageSize}`
  ) {
    try {
      setIsBusy(true);
      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer 15|vDsnCbQAUVhfWE4nfjYXRcUfYPYJmOBUxjTqkg0f",
        },
      });
      const data = await response.json();
      const links = data?.meta?.links.slice(1, -1);
      setUsersResponse({ ...data, meta: { ...data.meta, links: links } });
      setIsBusy(false);
    } catch (err) {
      setIsBusy(false);
    }
  }

  const handlePageChange = (page) => {
    console.log("Current page:", page);
    setCurrentPage(page);
  };

  const handleDataTablePageChange = async (urlParams) => {
    await fetchUsers(urlParams);
  };

  const handleRowsPerPageChange = async (newPerPage, page) => {
    console.log("Rows per page:", newPerPage);
    setPageSize(newPerPage);
  };

  const handleRowClick = (row) => {
    // event.preventDefault();
    console.log(row);
  };

  const handleSort = (column, sortDirection) => {
    setSortOptions({ column: column.sortField, direction: sortDirection });
  };

  const handleDelete = (event, id) => {
    // event.stopPropagation();
    console.log("Deleting user " + id);
    const newUsers = usersResponse?.data?.filter((x) => x.id !== id);
    setUsersResponse(newUsers);
  };

  return (
    <div className="App">
      <div className="container pt-2">
        <button
          className="btn btn-primary mb-3"
          onClick={() => {
            console.log("Users state:", usersResponse);
          }}>
          Check Users
        </button>

        <DataTable
          title="Users"
          columns={columns}
          data={usersResponse?.data}
          responsive
          highlightOnHover
          // pagination
          // paginationServer
          // paginationTotalRows={usersResponse?.meta?.total}
          // paginationPerPage={pageSize}
          // paginationRowsPerPageOptions={[5, 15, 25, 50]}
          // progressPending={isBusy}
          // paginationComponentOptions={paginationComponentOptions}
          onChangeRowsPerPage={(newPerPage, page) =>
            handleRowsPerPageChange(newPerPage, page)
          }
          onChangePage={(page) => handlePageChange(page)}
          onRowClicked={(row) => handleRowClick(row)}
          sortIcon={<KeyboardArrowDownIcon />}
          onSort={(column, sortDirection) => handleSort(column, sortDirection)}
        />
        <DataTablePagination
          totalSize={usersResponse?.meta?.total}
          pageSize={pageSize}
          links={usersResponse?.meta?.links}
          prevLink={usersResponse?.links?.prev}
          nextLink={usersResponse?.links?.next}
          onPageChange={(url) => handleDataTablePageChange(url)}
        />
      </div>
    </div>
  );
}

export default App;
