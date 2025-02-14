import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

import { useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { Avatar, Divider, Heading, Input, Stack, Tag } from "@chakra-ui/react";
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
UserDataTable.propTypes = {
  data: PropTypes.any.isRequired,
};

export default function UserDataTable({ data }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const StatusTemplate = (rowData) =>
    rowData.status === "1" ? <Tag colorScheme="green">Active</Tag> : <Tag colorScheme="red">Inactive</Tag>;

  const CredentialTemplate = (rowData) => <Button size="sm">View Credential</Button>

  const ImageTemplate = (rowData) => <Avatar src={rowData.avatar} />

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
        <Column field="avatar" header="Image" body={ImageTemplate}></Column>
        <Column
          field="name"
          header="Name"
          sortable
        ></Column>
        <Column field="type" header="Type" filter sortable></Column>
        <Column
          field="assigned_subject"
          header="Assigned Subject"
          sortable
        ></Column>
        <Column header="Credential" body={CredentialTemplate}></Column>
        <Column
          field="status"
          header="Status"
          body={StatusTemplate}
        ></Column>
      </DataTable>
    </PrimeReactProvider>
  );
}
