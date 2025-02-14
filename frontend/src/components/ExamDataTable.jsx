import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

import { useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { Divider, Heading, Input, Stack, Tag } from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import PropTypes from "prop-types";
ExamDataTable.propTypes = {
  data: PropTypes.any.isRequired,
};

export default function ExamDataTable({ data }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const StatusTemplate = (rowData) =>
    rowData.status === "1" ? <Tag colorScheme="green">Active</Tag> : <Tag colorScheme="red">Inactive</Tag>;

  const openDrawer = (rowData) => {
    setSelectedQuestion(rowData);
    onOpen();
  };

  return (
    <PrimeReactProvider>
      <Stack>
        <Heading size="md">SEARCH</Heading>
        <Input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          mb={4}
        />
      </Stack>
      <Divider mb={4} />
      <DataTable
        value={data}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 15, 30]}
        showGridlines
        size="small"
        globalFilter={globalFilter} // 🔍 Enable global search
      >
        <Column field="id" header="ID" sortable></Column>
        <Column
          field="exam_name"
          header="Exam Name"
          filter
          sortable
        ></Column>
        <Column field="subject" header="Subject" filter sortable></Column>
        <Column
          field="access_code"
          header="Access Code"
          sortable
        ></Column>
        <Column field="created_by" header="Created By" sortable></Column>
        <Column
          field="approval_status"
          header="Is Approved?"
          body={StatusTemplate}
        ></Column>
        <Column
          field="status"
          header="Status"
          body={StatusTemplate}
        ></Column>
      </DataTable>
    </PrimeReactProvider>
  );
}
