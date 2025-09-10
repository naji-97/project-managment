export const dataGridClassNames =
  "border border-gray-200 bg-white shadow dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200";

export const dataGridSxStyles = (isDarkMode: boolean) => {
  return {
    // Table header
    "& .MuiDataGrid-columnHeaders": {
      color: `${isDarkMode ? "#e5e7eb" : ""}`,
      '& [role="row"] > *': {
        backgroundColor: `${isDarkMode ? "#1d1f21" : "white"}`,
        borderColor: `${isDarkMode ? "#2d3135" : ""}`,
      },
    },
        // Table body background + text
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: isDarkMode ? "#181a1b" : "#ffffff", // main body background
    },
    "& .MuiDataGrid-row": {
      color: isDarkMode ? "#d1d5db" : "#111827", // text color
      borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
    },
    "& .MuiDataGrid-cell": {
      border: "none",
      color: isDarkMode ? "#d1d5db" : "#111827",
    },
    // Selected row
    "& .MuiDataGrid-row.Mui-selected": {
      backgroundColor: isDarkMode ? "#0070c9" : "#e5f1fb", // dark vs light
      color: isDarkMode ? "#000" : "#111827",
    },
    "& .MuiDataGrid-row:hover": {
      backgroundColor: isDarkMode ? "#547b9a" : "#d0e7f9", // hover state
      color: isDarkMode ? "#000" : "#111827",

    },
    "& .MuiDataGrid-row.Mui-selected:hover": {
      backgroundColor: isDarkMode ? "#547b9a" : "#e5f1fb", // hover state
      color: isDarkMode ? "#000" : "#111827",
    },

    // Table pagination
    "& .MuiIconbutton-root": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
    },
    "& .MuiTablePagination-root": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
      backgroundColor: `${isDarkMode ? "#1d1f21" : ""}`,
    },
    "& .MuiTablePagination-selectIcon": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
    },
    "& .MuiDataGrid-withBorderColor": {
      borderColor: `${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
    },
    "& .MuiDataGrid-toolbar": {
      color: `${isDarkMode ? "#fff" : ""}`,
      backgroundColor: `${isDarkMode ? "#1d1f21" : ""}`,
    },
    "& .MuiButtonBase-root-MuiIconButton-root .MuiSvgIcon-root": {
      color: `${isDarkMode ? "#fff" : ""}`,
    },
    "& .MuiSvgIcon-root": {
      color: `${isDarkMode ? "#fff" : ""}`,

    },



  };
};     