import { Typography } from "@material-ui/core";
import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { setPatient, useStateValue } from "../state";
import { Patient } from "../types";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import EntryDetails from "./EntryDetails";

const PatientPage = () => {
  const id = useParams<{id: string}>().id;
  const [{patient}, dispatch] = useStateValue();

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
        console.log(e);
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
      {patient.entries?.length > 0 && 
        <div>
        <Typography variant="h6" style={{ marginTop: "1em", marginBottom: "1em" }}>
          entries
        </Typography>
        {patient.entries.map(entry => 
          <EntryDetails key={entry.id} entry={entry} />
        )}
        </div>
      }
    </div>
  );
};

export default PatientPage;