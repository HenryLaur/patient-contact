import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { DetailedPatientDto } from '@contact-patient/dtos';
import { Button, Descriptions, Skeleton } from 'antd';
import axios from 'axios';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { PatientOverviewUrl } from '../urls';

export type PatientPageProps = RouteComponentProps<{ patientId: string }>;

export function PatientPage(props: PatientPageProps) {
  // Get the history object for navigation
  const history = useHistory();

  // Get the patient ID from the URL
  const patientId = props?.match?.params?.patientId;

  // Detailed patient state
  const [patient, setPatient] = useState<DetailedPatientDto>();

  // State for loading detailed patient
  const [loadingPatient, setLoadingPatient] = useState(false);

  // TODO - implement
  const currentPatientIndex = 0;
  const totalPatients = 0;

  /**
   * Fetch patient details when ID changes.
   */
  useEffect(() => {
    if (!patientId) {
      return;
    }

    setLoadingPatient(true);

    axios
      .get(`http://localhost:3333/patients/${patientId}`)
      .then((response) => {
        if (response?.data) {
          setPatient(response.data);
        }
        setLoadingPatient(false);
      });
  }, [patientId]);

  /**
   * Function for marking a patient as contacted or not contacted.
   * @param newContactedValue
   */
  const markContacted = (newContactedValue: boolean) => {
    // TODO - implement
    console.log('TODO - implement');
  };

  /**
   * Function for going to the previous patient.
   */
  const goToPreviousPatient = () => {
    // TODO - implement
    console.log('TODO - implement');
  };

  /**
   * Function for going to the next patient.
   */
  const goToNextPatient = () => {
    // TODO - implement
    console.log('TODO - implement');
  };

  // If loading patient, show loading animation
  if (loadingPatient) {
    return <Skeleton />;
  }

  // If no patient found for id, show error message
  if (!patient) {
    return <p>No patient found for id: "{patientId}"</p>;
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '50px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <Button
            icon={<LeftOutlined />}
            onClick={() => history.push(PatientOverviewUrl)}
          />
          <h1>({currentPatientIndex} / {totalPatients}) Patient: {patient.ssn}</h1>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <Button
            type="primary"
            onClick={() => goToPreviousPatient()}
            icon={<LeftOutlined />}
            // TODO - maybe update the disabled state?
            disabled={currentPatientIndex === 0}
          />
          <Button
            type="primary"
            onClick={() => markContacted(!patient.contacted)}
          >
            {patient.contacted ? 'Mark not contacted' : 'Mark contacted'}
          </Button>
          <Button
            type="primary"
            onClick={() => goToNextPatient()}
            icon={<RightOutlined />}
            // TODO - maybe update the disabled state?
            disabled={currentPatientIndex === totalPatients - 1}
          />
        </div>
      </div>

      <Descriptions>
        <Descriptions.Item label="First name">
          {patient.firstName}
        </Descriptions.Item>
        <Descriptions.Item label="Last name">
          {patient.lastName}
        </Descriptions.Item>
        <Descriptions.Item label="Contacted">
          {patient.contacted ? 'Yes' : 'No'}
        </Descriptions.Item>
        <Descriptions.Item label="Gender">
          {patient.gender?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Patient created">
          {format(new Date(patient.created), 'dd-MM-yyyy')}
        </Descriptions.Item>
        <Descriptions.Item label="Patient updated">
          {format(new Date(patient.updated), 'dd-MM-yyyy')}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
