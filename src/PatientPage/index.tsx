import { Button, Typography } from "@material-ui/core";
import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { addEntry, setPatient, useStateValue } from "../state";
import { Entry, Patient } from "../types";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import EntryDetails from "./EntryDetails";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";
import AddEntryModal from "../AddEntryModal";

const PatientPage = () => {
  const id = useParams<{id: string}>().id;
  const [{patient}, dispatch] = useStateValue();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = React.useState<string>();

  const openModal = (): void => setModalOpen(true);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      if (!id) {
        throw new Error('Invalid patient id');
      }

      const entryToCreate = {
        type: values.type,
        description: values.description,
        date: values.date,
        specialist: values.specialist,
        diagnosisCodes: values.diagnosisCodes.length === 0 ? undefined : values.diagnosisCodes,
        healthCheckRating: values.healthCheckRating,
        employerName: values.employerName,
        sickLeave: values.sickLeaveStartDate === "" || values.sickLeaveEndDate === "" ? undefined : {
          startDate: values.sickLeaveStartDate,
          endDate: values.sickLeaveEndDate
        },
        discharge: values.dischargeDate === "" || values.dischargeCriteria === "" ? undefined : {
          date: values.dischargeDate,
          criteria: values.dischargeCriteria
        }
      };

      const {data: newEntry} = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        entryToCreate
      );

      dispatch(addEntry(newEntry));
      closeModal();
    } catch(e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || 'Unrecognised axios error');
        setError(String(e?.response?.data) || "Unrecognised axios error");
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  React.useEffect(() => {
    const fetchPatient = async() => {
      try {
        if (!id || patient?.id === id) {
          return;
        }

        const {data: patientFromApi} = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(setPatient(patientFromApi));
      } catch (e) {
        console.error(e);
      }
    };

    void fetchPatient();
  }, [id]);

  if (!patient || patient.id !== id) {
    return null;
  }

  return(
    <div className="PatientPage">
      <Typography variant="h4" style={{ marginTop: "1em", marginBottom: "1em" }}>
        {patient.name}
        {patient.gender === "male" && <MaleIcon />}
        {patient.gender === "female" && <FemaleIcon />}
        {patient.gender === "other" && <TransgenderIcon />}
      </Typography>
      {patient.occupation && <p>Occupation: {patient.occupation}</p>}
      {patient.dateOfBirth && <p>DOB: {patient.dateOfBirth}</p>}
      {patient.ssn && <p>SSN: {patient.ssn}</p>}
      <Typography variant="h6" style={{ marginTop: "1em", marginBottom: "1em" }}>
          entries
          <AddEntryModal
            modalOpen={modalOpen}
            onSubmit={submitNewEntry}
            error={error}
            onClose={closeModal}
          />
          <Button variant="contained" onClick={() => openModal()}>
            Add New Entry
          </Button>
      </Typography>
      {patient.entries?.length === 0 &&
        <p>No entries...</p>
      }
      {patient.entries?.length > 0 && 
        <div>
        {patient.entries.map(entry => 
          <EntryDetails key={entry.id} entry={entry} />
        )}
        </div>
      }
    </div>
  );
};

export default PatientPage;