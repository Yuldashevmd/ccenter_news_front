import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

function Teams() {
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

export default Teams;