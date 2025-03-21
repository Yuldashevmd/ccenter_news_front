import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const Challenges = ({ role }) => {
  const [challenges, setChallenges] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  console.log(currentQuestionIndex);
  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get('http://10.15.0.133:7676/v1/challenges/list');
      setChallenges(response.data.challenges);
    } catch (error) {
      message.error('Failed to fetch challenges');
      console.error('Fetch error:', error);
    }
  };

  const fetchQuestions = async (challengeId) => {
    try {
      const response = await axios.get(`http://10.15.0.133:7676/v1/questions/list?challenge_id=${challengeId}`);
      setQuestions(response.data.questions);
      setIsQuizModalVisible(true);
      setCurrentQuestionIndex(0);
    } catch (error) {
      message.error('Failed to fetch questions');
      console.error('Fetch error:', error);
    }
  };

  const handleSaveChallenge = async (values) => {
    try {
      if (editingChallenge) {
        await axios.put(`http://10.15.0.133:7676/v1/challenges/${editingChallenge.id}?id=${editingChallenge.id}`, values);
        message.success('Challenge updated successfully');
      } else {
        await axios.post('http://10.15.0.133:7676/v1/challenges', values);
        message.success('Challenge created successfully');
      }
      fetchChallenges();
      setIsModalVisible(false);
      form.resetFields();
      setEditingChallenge(null);
    } catch (error) {
      message.error('Failed to save challenge');
      console.error('Save error:', error);
    }
  };

  const handleDeleteChallenge = async (id) => {
    try {
      await axios.delete(`http://10.15.0.133:7676/v1/challenges/${id}?id=${id}`);
      message.success('Challenge deleted successfully');
      fetchChallenges();
    } catch (error) {
      message.error('Failed to delete challenge');
      console.error('Delete error:', error);
    }
  };

  const showModal = (challenge = null) => {
    setEditingChallenge(challenge);
    form.setFieldsValue(challenge || {});
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingChallenge(null);
  };

  const handleQuizCancel = () => {
    setIsQuizModalVisible(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswer('');
  };

  const handleAnswerSubmit = (values) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (values.answer === currentQuestion.answer) {
      message.success('Correct answer!');
    } else {
      message.error('Incorrect answer!');
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer('');
    } else {
      message.success('You have completed the quiz!');
      setIsQuizModalVisible(false);
      setQuestions([]);
      setCurrentQuestionIndex(0);
      setAnswer('');
    }
  };

  return (
    <div className='p-[50px]'>
      {role === 'admin' && (
        <Button type="primary" onClick={() => showModal()} style={{ marginBottom: '20px' }}>
          Create Challenge
        </Button>
      )}

      <Title level={2}>Challenges</Title>
      <Row gutter={[16, 16]}>
        {challenges.map((challenge) => (
          <Col xs={24} sm={12} md={8} lg={6} key={challenge.id}>
            <Card
              hoverable
              style={{ background: '#1e2124', color: 'white' }}
              actions={
                role === 'admin'
                  ? [
                      <Button type="link" onClick={() => showModal(challenge)} style={{ color: 'black' }}>
                        Edit
                      </Button>,
                      <Button type="link" danger onClick={() => handleDeleteChallenge(challenge.id)}>
                        Delete
                      </Button>,
                    ]
                  : []
              }
            >
              <Title level={4} onClick={() => fetchQuestions(challenge.id)} style={{ color: 'white', margin: 0 }}>
                {challenge.name}
              </Title>
              <div style={{ color: 'white' }}>Status: {challenge.status ? 'Active' : 'Inactive'}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={editingChallenge ? 'Edit Challenge' : 'Create Challenge'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSaveChallenge} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" valuePropName="checked">
            <Input type="checkbox" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingChallenge ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
        visible={isQuizModalVisible}
        onCancel={handleQuizCancel}
        footer={null}
      >
        {questions.length > 0 && (
          <Form onFinish={handleAnswerSubmit} className="w-full">
            <div className="flex items-center mb-4">
              <div className="flex justify-center items-center mr-2 rounded-md w-6 h-6">
                <span className="font-medium text-green-500 text-xs">+{questions[currentQuestionIndex].point}</span>
              </div>
              <h3 className="font-medium text-xl">{questions[currentQuestionIndex].text}</h3>
            </div>

            <Form.Item name="answer" rules={[{ required: true, message: 'Please input your answer!' }]}>
              <Input
                placeholder="Submit your answer here..."
                className="px-4 py-3 border-0 rounded focus:outline-none w-full text-white"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Answer
            </Button>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Challenges;