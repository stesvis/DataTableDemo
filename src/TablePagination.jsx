import React, { useEffect, useState } from "react";

import Pagination from "react-bootstrap/Pagination";

const TablePagination = ({
  // properties
  currentPage = 1,
  firstPage = 1,
  lastPage,
  pageSize,
  totalSize,
  prevLink,
  links,
  nextLink,
  // events
  onPageChange,
  ...props
}) => {
  return (
    <div className="dataTables_paginate paging_simple_numbers" {...props}>
      <Pagination>
        <Pagination.Prev
          className="paginate_button"
          disabled={!prevLink}
          onClick={() => onPageChange(prevLink)}>
          Previous
        </Pagination.Prev>
        {links?.map((item, index) => {
          if (item.label === "...") {
            return <Pagination.Ellipsis key={index} disabled />;
          }

          const itemLabel = item.label
            .replace("&laquo;", "")
            .replace("&raquo;", "")
            .trim();

          return (
            <Pagination.Item
              key={index}
              className="paginate_button"
              active={item.active}
              onClick={() => onPageChange(item.url)}>
              {itemLabel}
            </Pagination.Item>
          );
        })}
        <Pagination.Next
          className="paginate_button"
          disabled={!nextLink}
          onClick={() => onPageChange(nextLink)}>
          Next
        </Pagination.Next>
      </Pagination>
    </div>
  );
};

export default TablePagination;
