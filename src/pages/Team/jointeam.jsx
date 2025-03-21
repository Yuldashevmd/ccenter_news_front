import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Select } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

function JoinTeam() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://10.15.0.133:7676/v1/team/list');
        const data = await response.json();
        setTeams(data.users); // Set the list of teams
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const decodeAccessToken = (token) => {
    try {
      // JWT tokenning payload qismini olish (ikkinchi qism)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64)); // Base64 ni decode qilish
      return payload;
    } catch (error) {
      console.error('Error decoding access token:', error);
      return null;
    }
  };

  const onFinish = async (values) => {
    console.log('Joining team with:', values);

    // Extract accessToken from localStorage
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      console.error('Access token not found in localStorage');
      return;
    }

    // Decode the accessToken to get user_id
    const payload = decodeAccessToken(accessToken);
    const user_id = payload?.id;

    if (!user_id) {
      console.error('User ID not found in access token');
      return;
    }

    // Prepare payload for the API request
    const payloadForAPI = {
      key: values.teamPassword,
      team_id: values.teamName, // teamName is the team ID
      user_id: user_id,
    };

    try {
      const response = await fetch('http://10.15.0.133:7676/v1/team/add/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadForAPI),
      });

      if (response.ok) {
        console.log('User joined team successfully');
        navigate('/'); // Navigate to the home page after joining
      } else {
        console.error('Error joining team:', response.statusText);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <Card className="shadow-lg w-full max-w-md text-center">
        <Title level={2} className="mb-4">
          Join Team
        </Title>
        <Form name="join-team" onFinish={onFinish}>
          <Form.Item
            name="teamName"
            rules={[{ required: true, message: 'Please select a team!' }]}
          >
            <Select
              placeholder="Select a team"
              loading={loading}
              className="w-full"
            >
              {teams.map((team) => (
                <Option key={team.id} value={team.id}>
                  {team.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="teamPassword"
            rules={[{ required: true, message: 'Please input the team password!' }]}
          >
            <Input.Password autoComplete="off" placeholder="Team Password" className="w-full" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="bg-blue-500 hover:bg-blue-600 transition duration-300"
            >
              Join
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default JoinTeam;