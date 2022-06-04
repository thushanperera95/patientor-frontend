import { useStateValue } from "../state";
import { Entry, HealthCheckEntry, HealthCheckRating, HospitalEntry, OccupationalHealthcareEntry } from "../types";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WorkIcon from '@mui/icons-material/Work';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React from "react";
import assertNever from "assert-never";
import { Box, Card } from "@material-ui/core";

const DiagnosesDetails: React.FC<{diagnosisCodes: string[]}> = ({diagnosisCodes}) => {
  const [{diagnoses}] = useStateValue();
  if (Array.of(diagnoses).length === 0) {
    return null;
  }

  return (
    <ul>
      {diagnosisCodes.map(code => 
        <li key={code}>{code} {diagnoses[code].name}</li>
      )}
    </ul> 
  );
};

const EntryDetailsTemplate: React.FC<{entry: Entry, icon: JSX.Element, details: JSX.Element | undefined}> = ({entry, icon, details}) => {
  return (
    <Card variant="outlined">
      <Box m={2}>
        {entry.date} {icon}<br/>
        <i>{entry.description}</i><br/>
        {entry.diagnosisCodes && 
          <DiagnosesDetails diagnosisCodes={entry.diagnosisCodes} />
        }
        {details}<br/>
        Diagnose by {entry.specialist}
      </Box>
    </Card>
  );
};

const HealthCheckEntryDetails: React.FC<{entry: HealthCheckEntry}> = ({entry}) => {
  const getHealthRatingIcon = () => {
    switch(entry.healthCheckRating) {
      case HealthCheckRating.Healthy:
        return <FavoriteIcon sx={{color: 'green'}} />;
      case HealthCheckRating.LowRisk:
        return <FavoriteIcon sx={{color: 'yellow'}} />;
      case HealthCheckRating.HighRisk:
        return <FavoriteIcon sx={{color: 'orange'}} />;
      case HealthCheckRating.CriticalRisk:
        return <FavoriteIcon sx={{color: 'red'}} />;
      default:
        assertNever(entry.healthCheckRating);
    }
  };

  return (
    <div>
      <EntryDetailsTemplate 
        entry={entry} 
        icon={<LocalHospitalIcon />} 
        details={getHealthRatingIcon()} />
    </div>
  );
};

const OccupationalHealthcaseEntryDetails: React.FC<{entry: OccupationalHealthcareEntry}> = ({entry}) => {
  return (
    <div>
      <EntryDetailsTemplate 
        entry={entry} 
        icon={<>
          <WorkIcon /> {entry.employerName}
        </>}
        details={entry.sickLeave && 
          <>
            Sick Leave: from {entry.sickLeave.startDate} to {entry.sickLeave.endDate}
          </>} />
    </div>
  );
};

const HospitalEntryDetails: React.FC<{entry: HospitalEntry}> = ({entry}) => {
  return (
    <div>
      <EntryDetailsTemplate 
        entry={entry} 
        icon={<MedicalServicesIcon />}
        details={<>
          Discharged on {entry.discharge.date}<br />
          Reason for discharge: <i>{entry.discharge.criteria}</i>
        </>} />
    </div>
  );
};

const EntryDetails: React.FC<{entry: Entry}> = ({entry}) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryDetails entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcaseEntryDetails entry={entry} />;
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;