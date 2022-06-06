import { Button, Grid } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { DiagnosisSelection, HealthCheckRatingOption, SelectField, TextField, TypeOption } from "../components/FormField";
import { useStateValue } from "../state";
import { HealthCheckRating } from "../types";

export type EntryFormValues = {
  type: string,
  description: string,
  date: string,
  specialist: string,
  diagnosisCodes: string[],
  healthCheckRating: HealthCheckRating,
  employerName: string,
  sickLeaveStartDate: string,
  sickLeaveEndDate: string,
  dischargeDate: string,
  dischargeCriteria: string
};

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void
}

const entryTypeOptions: TypeOption[] = [
  {label: "Health Check", value: "HealthCheck"},
  {label: "Occupational Healthcare", value: "OccupationalHealthcare"}, 
  {label: "Hospital", value: "Hospital"}
];

const healthCheckRatingOptions: HealthCheckRatingOption[] = [
  {label: 'Healthy', value: HealthCheckRating.Healthy},
  {label: 'Low Risk', value: HealthCheckRating.LowRisk},
  {label: 'High Risk', value: HealthCheckRating.HighRisk},
  {label: 'Critical Risk', value: HealthCheckRating.CriticalRisk}
];

export const AddEntryForm = ({onSubmit, onCancel}: Props) => {
  const [{diagnoses}] = useStateValue();
  
  return (
    <Formik
      initialValues={{
        type: "",
        description: "",
        date: "",
        specialist: "",
        diagnosisCodes: [],
        healthCheckRating: HealthCheckRating.Healthy,
        employerName: "",
        sickLeaveStartDate: "",
        sickLeaveEndDate: "",
        dischargeDate: "",
        dischargeCriteria: ""
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = 'Field is required';
        const dateFormatError = 'Date must be in the format YYYY-MM-DD';
        const errors: { [field: string]: string } = {};

        const isDate = (date: string): boolean => {
          return Boolean(Date.parse(date));
        };
    
        if (!values.type) {
          errors.type = requiredError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!isDate(values.date)) {
          errors.date = dateFormatError;
        }

        switch (values.type) {
          case "HealthCheck": 
            if (!Object.values(HealthCheckRating).includes(values.healthCheckRating)) {
              errors.healthCheckRating = requiredError;
            }
            break;

          case "OccupationalHealthcare":
            if (!values.employerName) {
              errors.employerName = requiredError;
            }
            if (values.sickLeaveStartDate && !values.sickLeaveEndDate) {
              errors.sickLeaveEndDate = requiredError;
            }
            if (!values.sickLeaveStartDate && values.sickLeaveEndDate) {
              errors.sickLeaveStartDate = requiredError;
            }
            if (values.sickLeaveStartDate && !isDate(values.sickLeaveStartDate)) {
              errors.sickLeaveStartDate = dateFormatError;
            }
            if (values.sickLeaveEndDate && !isDate(values.sickLeaveEndDate)) {
              errors.sickLeaveEndDate = dateFormatError;
            }
            break;

          case "Hospital":
            if (!values.dischargeDate) {
              errors.dischargeDate = requiredError;
            }
            if (!isDate(values.dischargeDate)) {
              errors.dischargeDate = dateFormatError;
            }
            if (!values.dischargeCriteria) {
              errors.dischargeCriteria = requiredError;
            }
            break;
        }

        return errors;
      }}
    >
      {({isValid, dirty, setFieldValue, setFieldTouched, values}) => {
        return (
          <Form>
            <SelectField label="Type" name="type" options={entryTypeOptions} />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="Date YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            {values.type === "HealthCheck" && 
              <SelectField
                label="Health Check Rating"
                name="healthCheckRating"
                options={healthCheckRatingOptions}
              />}
            {values.type === "OccupationalHealthcare" &&
              <>
                <Field
                  label="Employer Name"
                  placeholder="Employer Name"
                  name="employerName"
                  component={TextField}
                />
                <Field
                  label="Sick Leave Start Date"
                  placeholder="Date YYYY-MM-DD"
                  name="sickLeaveStartDate"
                  component={TextField}
                />
                <Field
                  label="Sick Leave End Date"
                  placeholder="Date YYYY-MM-DD"
                  name="sickLeaveEndDate"
                  component={TextField}
                />
              </>  
            }
            {values.type === "Hospital" &&
              <>
                <Field
                  label="Discharge Date"
                  placeholder="Date YYYY-MM-DD"
                  name="dischargeDate"
                  component={TextField}
                />
                <Field
                  label="Discharge Criteria"
                  placeholder="Discharge Criteria"
                  name="dischargeCriteria"
                  component={TextField}
                />
              </>
            }
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{float: "left"}}
                  type="button"
                  onClick={onCancel}
                  >
                    Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{float: "right"}}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}

    </Formik>
  );
};

export default AddEntryForm;