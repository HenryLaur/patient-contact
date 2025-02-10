import { ListPatientDto, QueryPatientsDto } from '@contact-patient/dtos';
import { Button, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { PatientUrl } from '../urls';

export function PatientOverviewPage() {
  // Get the history object for navigation
  const history = useHistory();

  // State for holding patients from the API
  const [patients, setPatients] = React.useState<ListPatientDto[]>();

  // State for loading patients from the API
  const [loadingPatients, setLoadingPatients] = React.useState(false);

  // State of the contacted filter
  const [filterContacted, setFilterContacted] = React.useState(false);

  /**
   * Function for fetching patients from the API.
   * Handles updating loading state and settings patient data state.
   * @param contacted Filter by contacted or not contacted.
   */
  const getPatientData = (contacted: boolean) => {
    setLoadingPatients(true);

    const params: QueryPatientsDto = {
      contacted: contacted,
    };

    axios
      .get('http://localhost:3333/patients', { params: params })
      .then((response) => {
        if (response?.data) {
          setPatients(response.data);
        }
        setLoadingPatients(false);
      });
  };

  /**
   * Fetch patients from the API when the filterContacted state changes
   */
  useEffect(() => {
    getPatientData(filterContacted);
  }, [filterContacted]);

  const columns: ColumnsType<ListPatientDto> = [
    {
      title: 'Name',
      render: (text: string, record: any) =>
        `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Contacted',
      render: (text: string, record: any) => (record.contacted ? 'Yes' : 'No'),
    },
    {
      title: '',
      render: (text: string, record: any) => (
        <Button
          type="link"
          onClick={() =>
            history.push(PatientUrl.replace(':patientId', record.id))
          }
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100px',
        }}
      >
        <h1>Patient overview</h1>

        <Switch
          checkedChildren="Contacted"
          unCheckedChildren="Not contacted"
          defaultChecked={filterContacted}
          onChange={(checked: boolean) => setFilterContacted(checked)}
        />
      </div>

      <Table
        dataSource={patients ?? []}
        columns={columns}
        rowKey="id"
        loading={loadingPatients}
      />

      <Button
        onClick={() => {
          axios.post('http://localhost:3333/seed').then((response) => {
            console.log('Data seeded');
            getPatientData(filterContacted);
          });
        }}
      >
        Seed data
      </Button>
    </div>
  );
}
