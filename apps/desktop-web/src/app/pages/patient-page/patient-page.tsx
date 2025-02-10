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

  const [totalPatients, setTotalPatients] = useState(0);
  const [currentPatientIndex, setCurrentPatientIndex] = useState(0);
  const [prevPatientId, setPrevPatientId] = useState<string | null>(null);
  const [nextPatientId, setNextPatientId] = useState<string | null>(null);

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
          return axios.get(
            `http://localhost:3333/patients/${patientId}/index`,
            { params: { contacted: response?.data?.contacted } }
          );
        }
      })
      .then((response) => {
        if (response?.data) {
          setTotalPatients(response.data.total);
          setCurrentPatientIndex(response.data.currentIndex);
          setPrevPatientId(response.data.prevId);
          setNextPatientId(response.data.nextId);
        }
      })
      .finally(() => {
        setLoadingPatient(false);
      });
  }, [patientId]);

  /**
   * Function for marking a patient as contacted or not contacted.
   * @param newContactedValue
   */
  const markContacted = (newContactedValue: boolean) => {
    axios
      .patch(`http://localhost:3333/patients/${patientId}`, {
        contacted: newContactedValue,
      })
      .then((response) => {
        if (response?.data) {
          setPatient({ ...patient, ...response.data });

          // Handle case when contacted has changed

          // We can increase/decrease total count
          setTotalPatients(totalPatients + (newContactedValue ? -1 : 1));

          // or just navigate to the previous/next patient
          // if (nextPatientId) {
          //   history.push(`/patient/${nextPatientId}`);
          // } else if (prevPatientId) {
          //   history.push(`/patient/${prevPatientId}`);
          // } else {
          //   history.push(PatientOverviewUrl);
          // }
        }
      })
      .finally(() => {
        setLoadingPatient(false);
      });
  };

  /**
   * Function for going to the previous patient.
   */
  const goToPreviousPatient = () => {
    if (prevPatientId) {
      history.push(`/patient/${prevPatientId}`);
    }
  };

  /**
   * Function for going to the next patient.
   */
  const goToNextPatient = () => {
    if (nextPatientId) {
      history.push(`/patient/${nextPatientId}`);
    }
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
          <h1>
            ({currentPatientIndex} / {totalPatients}) Patient: {patient.ssn}
          </h1>
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
            disabled={!prevPatientId}
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
            disabled={!nextPatientId}
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
