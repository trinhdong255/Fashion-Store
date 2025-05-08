/* eslint-disable import/order */
/* eslint-disable react/prop-types */

import Paper from "@mui/material/Paper";
import { columns, customLocaleText } from "./until";
import { DataGrid } from "@mui/x-data-grid";

const paginationModel = { page: 0, pageSize: 5 };

export default function TableProduct({ data }) {
  return (
    <Paper sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        localeText={customLocaleText}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
