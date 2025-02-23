import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

import { useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { Divider, Heading, Input, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Tag } from "@chakra-ui/react";
import {
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import PropTypes from "prop-types";
import QuestionDetail from "./QuestionDetail";
QuestionDataTable.propTypes = {
  data: PropTypes.any.isRequired,
};

export default function QuestionDataTable({ data }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const QuestionTemplate = (rowData) => (
    <Button
      variant="link"
      onClick={() => openDrawer(rowData)}
    >
      {rowData.question}
    </Button>
  );

  const StatusTemplate = (rowData) =>
    rowData.status === 1 || rowData.status === "1" ? <Tag colorScheme="green">Active</Tag> : <Tag colorScheme="red">Inactive</Tag>;

  const openDrawer = (rowData) => {
    setSelectedQuestion(rowData);
    onOpen();
  };

  return (
    <PrimeReactProvider>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalCloseButton />

        <ModalContent>
        <ModalCloseButton />
          <ModalHeader>
            <Heading size="lg">Question</Heading>
          </ModalHeader>
          <QuestionDetail QuestionData={selectedQuestion} />
        </ModalContent>
      </Modal>
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
          field="question"
          header="Question"
          filter
          body={QuestionTemplate}
          sortable
        ></Column>
        <Column field="category" header="Type" filter sortable></Column>
        <Column
          showFilterMenu={true}
          field="subject"
          filter
          header="Subject"
          sortable
        ></Column>
        <Column field="created_by" header="Created By" sortable></Column>
        <Column
          field="status"
          header="Status"
          body={StatusTemplate}
          filter
        ></Column>
      </DataTable>
    </PrimeReactProvider>
  );
}
