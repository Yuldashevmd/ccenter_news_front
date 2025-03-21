import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

function CreateTeam() {
  const [teamCreated, setTeamCreated] = useState(false);
  const [teamName, setTeamName] = useState('');

  const onFinish = async (values) => {
    console.log('Creating team with:', values);

    const payload = {
      name: values.teamName,
      key: values.teamPassword,
    };

    try {
      const response = await fetch('http://10.15.0.133:7676/v1/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Team created successfully:', data);
        setTeamCreated(true); // Set teamCreated to true
        setTeamName(values.teamName); // Save the team name
      } else {
        console.error('Error creating team:', response.statusText);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <Card className="shadow-lg w-full max-w-md text-center">
        {teamCreated ? (
          <UserTeam teamName={teamName} />
        ) : (
          <>
            <Title level={2} className="mb-4">
              Create Team
            </Title>
            <Form name="create-team" onFinish={onFinish}>
              <Form.Item
                name="teamName"
                rules={[{ required: true, message: 'Please input the team name!' }]}
              >
                <Input autoComplete="off" placeholder="Team Name" className="w-full" />
              </Form.Item>
              <Form.Item
                name="teamPassword"
                rules={[{ required: true, message: 'Please input the team password!' }]}
              >
                <Input.Password autoComplete="off" placeholder="Team Password" className="w-full" />
              </Form.Item>
              <Paragraph className="mb-6 text-gray-600">
                After creating your team, share the team name and password with your teammates so they can join your team.
              </Paragraph>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="bg-blue-500 hover:bg-blue-600 transition duration-300"
                >
                  Create
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Card>
    </div>
  );
}

// UserTeam Component (to be displayed after team creation)
function UserTeam({ teamName }) {
  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <Card className="shadow-lg w-full max-w-md text-center">
        <Title level={2} className="mb-4">
          Boburjon
        </Title>
        <Paragraph className="text-left">
          <strong>Members</strong>
          <div>User Name</div>
          <div>dsadasdas</div>
        </Paragraph>
        <Paragraph className="text-left">
          <strong>Screen</strong>
        </Paragraph>
        <Paragraph className="text-left">
          <strong>No solves yet</strong>
        </Paragraph>
      </Card>
    </div>
  );
}

export default CreateTeam;