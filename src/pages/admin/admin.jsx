import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import axios from 'axios';
import './admin.css'; // Tailwind CSS va Ant Design uchun stil fayli

const { Option } = Select;

const AdminPanel = () => {
  const [questions, setQuestions] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
    fetchChallenges();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://10.15.0.133:7676/v1/questions/list');
      const questionsWithChallenges = await Promise.all(
        response.data.questions.map(async (question) => {
          try {
            const challengeResponse = await axios.get(
              `http://10.15.0.133:7676/v1/challenges/${question.challenge_id}?id=${question.challenge_id}`
            );
            return {
              ...question,
              challenge_name: challengeResponse.data.name, // challenge nomini qo'shamiz
            };
          } catch (error) {
            console.error('Failed to fetch challenge:', error);
            return {
              ...question,
              challenge_name: 'Unknown', // Agar xato bo'lsa, "Unknown" deb ko'rsatamiz
            };
          }
        })
      );
      setQuestions(questionsWithChallenges);
    } catch (error) {
      message.error('Failed to fetch questions');
      console.error('Fetch error:', error);
    }
  };

  const fetchChallenges = async () => {
    try {
      const response = await axios.get('http://10.15.0.133:7676/v1/challenges/list');
      setChallenges(response.data.challenges);
    } catch (error) {
      message.error('Failed to fetch challenges');
      console.error('Fetch challenges error:', error);
    }
  };

  const showModal = (question = null) => {
    setEditingQuestion(question);
    form.setFieldsValue(question || {});
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingQuestion(null);
  };

  const onFinish = async (values) => {
    try {
      // point ni integer ga o'zgartirish
      const payload = {
        ...values,
        point: parseInt(values.point, 10), // stringni integerga aylantiramiz
      };

      if (editingQuestion) {
        await axios.put(
          `http://10.15.0.133:7676/v1/questions/${editingQuestion.id}?id=${editingQuestion.id}`,
          payload
        );
        message.success('Question updated successfully');
      } else {
        await axios.post('http://10.15.0.133:7676/v1/questions', payload);
        message.success('Question added successfully');
      }
      fetchQuestions();
      handleCancel();
    } catch (error) {
      message.error('Failed to save question');
      console.error('Save error:', error);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await axios.delete(`http://10.15.0.133:7676/v1/questions/${id}?id=${id}`);
      message.success('Question deleted successfully');
      fetchQuestions();
    } catch (error) {
      message.error('Failed to delete question');
      console.error('Delete error:', error);
    }
  };

  const columns = [
    {
      title: 'Text',
      dataIndex: 'text',
      key: 'text',
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      key: 'answer',
    },
    {
      title: 'Point',
      dataIndex: 'point',
      key: 'point',
    },
    {
      title: 'Challenge Name',
      dataIndex: 'challenge_name', // challenge_name ni ko'rsatamiz
      key: 'challenge_name',
    },
    {
      title: 'File URL',
      dataIndex: 'file_url',
      key: 'file_url',
    },
    {
      title: 'Image URL',
      dataIndex: 'img_url',
      key: 'img_url',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className='flex justify-start'>
          <span className='flex'>
            <Button type="link" onClick={() => showModal(record)}>Edit</Button>
            <Button type="link" danger onClick={() => deleteQuestion(record.id)}>Delete</Button>
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Button type="primary" onClick={() => showModal()} className="mb-4">
        Add Question
      </Button>
      <Table dataSource={questions} columns={columns} rowKey="id" />

      <Modal
        title={editingQuestion ? 'Edit Question' : 'Add Question'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="text" label="Text" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="answer" label="Answer" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="point"
            label="Point"
            rules={[
              { required: true, message: 'Please enter a point!' },
              {
                validator: (_, value) => {
                  if (typeof value === 'number' || !isNaN(Number(value))) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Point must be a number!'));
                },
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="challenge_id" label="Challenge" rules={[{ required: true }]}>
            <Select placeholder="Select a challenge">
              {challenges.map((challenge) => (
                <Option key={challenge.id} value={challenge.id}>
                  {challenge.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="file_url" label="File URL">
            <Input />
          </Form.Item>
          <Form.Item name="img_url" label="Image URL">
            <Input />
          </Form.Item>
          <Form.Item name="video_url" label="Video URL">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingQuestion ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPanel;