import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Typography, message, Skeleton, Empty, Modal, Select, Image, Form, Divider, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import api from '../service/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'tailwindcss/tailwind.css';

const { Text, Title } = Typography;
const { Option } = Select;

const TodoList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deletingTodoId, setDeletingTodoId] = useState(null);
  const [newTodo, setNewTodo] = useState({
    title: { en: '', ru: '', uz: '' },
    text: { en: '', ru: '', uz: '' },
    label: { en: '', ru: '', uz: '' },
    date: moment().format(),
    file_link: '',
    image_link: '',
    imageFile: null,
    file: null,
  });
  const [editForm, setEditForm] = useState({
    title: { en: '', ru: '', uz: '' },
    text: { en: '', ru: '', uz: '' },
    label: { en: '', ru: '', uz: '' },
    date: '',
    file_link: '',
    image_link: '',
    imageFile: null,
    file: null,
  });
  const [language, setLanguage] = useState('en');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchTodos();
  }, [navigate, user]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await api.getTodos();
      if (!response || !response.data || response.data.length === 0) {
        setTodos([]);
        message.info("Ma'lumot yo'q");
      } else {
        const todos = response.data.map(todo => ({
          ...todo,
          image_link: todo.img_url,
        }));
        setTodos(todos);
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error.message, error.response?.data);
      setTodos([]);
      message.info("Ma'lumot yo'q");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (file) => {
    if (!file) return null;
    try {
      setUploading(true);
      const response = await api.uploadImage(file);
      // Properly access the Url property from the response
      const url = response?.data?.Url || response?.Url;
      if (!url) {
        throw new Error('No URL returned from server');
      }
      return url;
    } catch (error) {
      console.error('Image upload error:', error.message, error.response?.data);
      message.error('Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  const handleUploadFile = async (file) => {
    if (!file) return null;
    try {
      setUploading(true);
      const response = await api.uploadFile(file);
      // Properly access the Url property from the response
      const url = response?.data?.Url || response?.Url;
      if (!url) {
        throw new Error('No URL returned from server');
      }
      return url;
    } catch (error) {
      console.error('File upload error:', error.message, error.response?.data);
      message.error('Failed to upload file. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleCreateImageChange = async ({ file }) => {
    if (file.status === 'removed') {
      setNewTodo({ ...newTodo, imageFile: null, image_link: '' });
      return;
    }
    
    if (!beforeUploadImage(file)) {
      return;
    }
    
    try {
      setNewTodo({ ...newTodo, imageFile: file });
      const imageLink = await handleUploadImage(file);
      if (imageLink) {
        setNewTodo(prev => ({
          ...prev,
          image_link: imageLink.toString()
        }));
        message.success('Image uploaded successfully');
      }
    } catch (error) {
      message.error('Image upload failed');
      setNewTodo(prev => ({
        ...prev,
        imageFile: null,
        image_link: ''
      }));
    }
  };
  const handleEditImageChange = async ({ file }) => {
    if (file.status === 'removed') {
      setEditForm({ ...editForm, imageFile: null, image_link: '' });
      return;
    }
    if (!beforeUploadImage(file)) {
      return;
    }
    setEditForm({ ...editForm, imageFile: file });
    const imageLink = await handleUploadImage(file);
    if (imageLink) {
      setEditForm({ ...editForm, image_link: imageLink.toString() }); // URL ni string sifatida saqlash
      message.success('Image uploaded successfully');
    }
  };

  const handleCreateFileChange = async ({ file }) => {
    if (file.status === 'removed') {
      setNewTodo({ ...newTodo, file: null, file_link: '' });
      return;
    }
    if (!beforeUploadFile(file)) {
      return;
    }
    setNewTodo({ ...newTodo, file });
    const fileLink = await handleUploadFile(file);
    if (fileLink) {
      setNewTodo({ ...newTodo, file_link: fileLink });
      message.success('File uploaded successfully');
    }
  };

  const handleEditFileChange = async ({ file }) => {
    if (file.status === 'removed') {
      setEditForm({ ...editForm, file: null, file_link: '' });
      return;
    }
    if (!beforeUploadFile(file)) {
      return;
    }
    setEditForm({ ...editForm, file });
    const fileLink = await handleUploadFile(file);
    if (fileLink) {
      setEditForm({ ...editForm, file_link: fileLink });
      message.success('File uploaded successfully');
    }
  };

  const handleCreate = async () => {
    if (!newTodo.title.en.trim() && !newTodo.title.ru.trim() && !newTodo.title.uz.trim()) {
      message.warning('Please enter a title in at least one language');
      return;
    }

    try {
      await api.createTodo(newTodo);
      setNewTodo({
        title: { en: '', ru: '', uz: '' },
        text: { en: '', ru: '', uz: '' },
        label: { en: '', ru: '', uz: '' },
        date: moment().format(),
        file_link: '',
        image_link: '',
        imageFile: null,
        file: null,
      });
      setIsCreateModalVisible(false);
      message.success('Todo created successfully');
      await fetchTodos();
    } catch (error) {
      console.error('Failed to create todo:', error.message, error.response?.data);
      message.error('Failed to create todo');
    }
  };
  const isValidUploadResponse = (response) => {
    return response && 
           (response.data?.Url || response.Url) && 
           typeof (response.data?.Url || response.Url) === 'string';
  };
  const handleUpdate = async () => {
    try {
      await api.updateTodo(editingTodo.id, editForm);
      setIsEditModalVisible(false);
      setEditingTodo(null);
      message.success('Todo edited successfully');
      await fetchTodos();
    } catch (error) {
      console.error('Failed to update todo:', error.message, error.response?.data);
      message.error('Failed to update todo');
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteTodo(deletingTodoId);
      setIsDeleteModalVisible(false);
      setDeletingTodoId(null);
      message.success('Todo deleted successfully');
      await fetchTodos();
    } catch (error) {
      console.error('Failed to delete todo:', error.message, error.response?.data);
      message.error('Failed to delete todo');
    }
  };

  const openCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setEditForm({
      title: { ...todo.title },
      text: { ...todo.text },
      label: { ...todo.label },
      date: todo.date,
      file_link: todo.file_link,
      image_link: todo.image_link,
      imageFile: null,
      file: null,
    });
    setIsEditModalVisible(true);
  };

  const openDeleteModal = (id) => {
    setDeletingTodoId(id);
    setIsDeleteModalVisible(true);
  };

  const closeModals = () => {
    setIsCreateModalVisible(false);
    setIsEditModalVisible(false);
    setIsDeleteModalVisible(false);
    setEditingTodo(null);
    setDeletingTodoId(null);
  };

  const beforeUploadImage = (file) => {
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isImage) {
      message.error('You can only upload JPG, JPEG, or PNG files!');
      return false;
    }
    return true;
  };

  const beforeUploadFile = (file) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('File must be smaller than 5MB!');
      return false;
    }
    return true;
  };

  if (loading && todos.length === 0) {
    return (
      <div className="mx-auto mt-8 px-4 max-w-5xl">
        <Card className="bg-white shadow-xl rounded-xl">
          <Skeleton active paragraph={{ rows: 4 }} />
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 px-4 max-w-5xl">
      <Card
        title={<Title level={2} className="font-bold text-gray-800 text-3xl">CCenter News</Title>}
        className="bg-white shadow-xl rounded-xl"
        extra={
          <div className="flex items-center space-x-4">
            <Select
              defaultValue="en"
              style={{ width: 120 }}
              onChange={setLanguage}
              className="rounded-lg w-full sm:w-auto"
              aria-label="Select language"
            >
              <Option value="en">English</Option>
              <Option value="ru">Русский</Option>
              <Option value="uz">Uzbek</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
              className="bg-gradient-to-r from-blue-600 hover:from-blue-700 to-blue-800 hover:to-blue-900 shadow-md rounded-lg font-semibold text-white"
              aria-label="Add new todo"
            >
              Add Todo
            </Button>
          </div>
        }
      >
        {todos.length === 0 ? (
          <Empty
            description="No todos found. Create your first todo!"
            className="py-8"
          />
        ) : (
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="relative bg-white shadow-lg hover:shadow-xl p-5 border-t-4 border-l-4 rounded-xl transition-all hover:-translate-y-1 duration-300 transform"
                style={{ borderImage: 'linear-gradient(to right, #60A5FA, #A78BFA) 1' }}
              >
                <div className="space-y-3">
                  <Text className="block font-semibold text-gray-900 text-xl line-clamp-1">
                    {todo.title[language] || 'No title'}
                  </Text>
                  <Text className="text-gray-600 line-clamp-2">
                    {todo.text[language] || 'No description'}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    <span className="font-medium">Label:</span> {todo.label[language] || 'No label'}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    <span className="font-medium">Date:</span> {moment(todo.date).format('YYYY-MM-DD HH:mm')}
                  </Text>
                  {todo.image_link && todo.image_link.match(/\.(jpg|jpeg|png)$/i) && (
                    <div className="mt-2">
                      <Image
                        src={todo.image_link}
                        alt={todo.title[language] || 'Image'}
                        width={150}
                        height={150}
                        className="shadow-md rounded-lg object-cover"
                        preview={{ mask: <Button type="primary">View Full Image</Button> }}
                        onError={(e) => { e.target.style.display = 'none'; }} // Agar yuklanmasa yashirish
                      />
                    </div>
                  )}
                  {todo.file_link && (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-gray-600 text-sm">
                        {getFileIcon(todo.file_link)} {todo.file_link.split('/').pop() || 'Attached File'}
                      </span>
                      <Button
                        type="link"
                        href={todo.file_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        icon={<DownloadOutlined />}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label="Download file"
                      >
                        Download
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => openEditModal(todo)}
                    className="border-blue-600 hover:border-blue-800 rounded-lg font-medium text-blue-600 hover:text-blue-800"
                    aria-label="Edit todo"
                  >
                    Edit
                  </Button>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => openDeleteModal(todo.id)}
                    className="border-red-600 hover:border-red-800 rounded-lg font-medium text-red-600 hover:text-red-800"
                    aria-label="Delete todo"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        title={<Title level={3} className="font-semibold text-gray-800 text-xl">Create New</Title>}
        open={isCreateModalVisible}
        onOk={handleCreate}
        onCancel={closeModals}
        okText="Create"
        cancelText="Cancel"
        okButtonProps={{ className: 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-lg', disabled: uploading }}
        cancelButtonProps={{ className: 'bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg' }}
        className="rounded-xl"
      >
        <Form layout="vertical" className="space-y-4">
          <Divider orientation="left" className="font-semibold text-gray-700">
            Title
          </Divider>
          <Form.Item label="English" name="title.en">
            <Input
              placeholder="Title (English)"
              value={newTodo.title.en}
              onChange={(e) => setNewTodo({ ...newTodo, title: { ...newTodo.title, en: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo title English"
            />
          </Form.Item>
          <Form.Item label="Русский" name="title.ru">
            <Input
              placeholder="Title (Русский)"
              value={newTodo.title.ru}
              onChange={(e) => setNewTodo({ ...newTodo, title: { ...newTodo.title, ru: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo title Russian"
            />
          </Form.Item>
          <Form.Item label="Uzbek" name="title.uz">
            <Input
              placeholder="Title (Uzbek)"
              value={newTodo.title.uz}
              onChange={(e) => setNewTodo({ ...newTodo, title: { ...newTodo.title, uz: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo title Uzbek"
            />
          </Form.Item>

          <Divider orientation="left" className="font-semibold text-gray-700">
            Description
          </Divider>
          <Form.Item label="English" name="text.en">
            <Input
              placeholder="Text (English)"
              value={newTodo.text.en}
              onChange={(e) => setNewTodo({ ...newTodo, text: { ...newTodo.text, en: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo text English"
            />
          </Form.Item>
          <Form.Item label="Русский" name="text.ru">
            <Input
              placeholder="Text (Русский)"
              value={newTodo.text.ru}
              onChange={(e) => setNewTodo({ ...newTodo, text: { ...newTodo.text, ru: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo text Russian"
            />
          </Form.Item>
          <Form.Item label="Uzbek" name="text.uz">
            <Input
              placeholder="Text (Uzbek)"
              value={newTodo.text.uz}
              onChange={(e) => setNewTodo({ ...newTodo, text: { ...newTodo.text, uz: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo text Uzbek"
            />
          </Form.Item>

          <Divider orientation="left" className="font-semibold text-gray-700">
            Label
          </Divider>
          <Form.Item label="English" name="label.en">
            <Input
              placeholder="Label (English)"
              value={newTodo.label.en}
              onChange={(e) => setNewTodo({ ...newTodo, label: { ...newTodo.label, en: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo label English"
            />
          </Form.Item>
          <Form.Item label="Русский" name="label.ru">
            <Input
              placeholder="Label (Русский)"
              value={newTodo.label.ru}
              onChange={(e) => setNewTodo({ ...newTodo, label: { ...newTodo.label, ru: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo label Russian"
            />
          </Form.Item>
          <Form.Item label="Uzbek" name="label.uz">
            <Input
              placeholder="Label (Uzbek)"
              value={newTodo.label.uz}
              onChange={(e) => setNewTodo({ ...newTodo, label: { ...newTodo.label, uz: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo label Uzbek"
            />
          </Form.Item>

          <Divider orientation="left" className="font-semibold text-gray-700">
            Additional Details
          </Divider>
          <Form.Item label="Date" name="date">
            <Input
              placeholder="Date (e.g., 2025-06-13)"
              value={newTodo.date}
              onChange={(e) => setNewTodo({ ...newTodo, date: e.target.value })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo date"
            />
          </Form.Item>
          <Form.Item label="File Link (Manual)" name="file_link">
            <Input
              placeholder="File Link (if not uploading)"
              value={newTodo.file_link}
              onChange={(e) => setNewTodo({ ...newTodo, file_link: e.target.value })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo file link"
            />
          </Form.Item>
          <Form.Item label="Upload Image" name="image">
            <Upload
              beforeUpload={() => false}
              onChange={handleCreateImageChange}
              accept=".jpg,.jpeg,.png"
              showUploadList={true}
              maxCount={1}
              disabled={uploading}
            >
              <Button icon={<UploadOutlined />} className="border-gray-300 rounded-lg" disabled={uploading}>
                Select Image
              </Button>
            </Upload>
            {newTodo.image_link && (
              <div className="mt-2">
                <Text type="success" className="block">
                  Image uploaded: <a href={newTodo.image_link} target="_blank" rel="noopener noreferrer">{newTodo.image_link}</a>
                </Text>
                <Image
                  src={newTodo.image_link}
                  alt="Uploaded image"
                  width={100}
                  height={100}
                  className="mt-2 rounded-lg object-cover"
                  preview
                />
              </div>
            )}
          </Form.Item>
          <Form.Item label="Upload File" name="file">
            <Upload
              beforeUpload={() => false}
              onChange={handleCreateFileChange}
              accept=".pdf,.doc,.docx,.txt"
              showUploadList={true}
              maxCount={1}
              disabled={uploading}
            >
              <Button icon={<UploadOutlined />} className="border-gray-300 rounded-lg" disabled={uploading}>
                Select File (Max: 5MB)
              </Button>
            </Upload>
            {newTodo.file_link && (
              <div className="mt-2">
                <Text type="success" className="block">
                  File uploaded: <a href={newTodo.file_link} target="_blank" rel="noopener noreferrer">{newTodo.file_link}</a>
                </Text>
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<Title level={3} className="font-semibold text-gray-800 text-xl">Edit</Title>}
        open={isEditModalVisible}
        onOk={handleUpdate}
        onCancel={closeModals}
        okText="Save"
        cancelText="Cancel"
        okButtonProps={{ className: 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-lg', disabled: uploading }}
        cancelButtonProps={{ className: 'bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg' }}
        className="rounded-xl"
      >
        <Form layout="vertical" className="space-y-4">
          <Divider orientation="left" className="font-semibold text-gray-700">
            Title
          </Divider>
          <Form.Item label="English" name="title.en">
            <Input
              placeholder="Title (English)"
              value={editForm.title.en}
              onChange={(e) => setEditForm({ ...editForm, title: { ...editForm.title, en: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo title English"
            />
          </Form.Item>
          <Form.Item label="Русский" name="title.ru">
            <Input
              placeholder="Title (Русский)"
              value={editForm.title.ru}
              onChange={(e) => setEditForm({ ...editForm, title: { ...editForm.title, ru: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo title Russian"
            />
          </Form.Item>
          <Form.Item label="Uzbek" name="title.uz">
            <Input
              placeholder="Title (Uzbek)"
              value={editForm.title.uz}
              onChange={(e) => setEditForm({ ...editForm, title: { ...editForm.title, uz: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo title Uzbek"
            />
          </Form.Item>

          <Divider orientation="left" className="font-semibold text-gray-700">
            Description
          </Divider>
          <Form.Item label="English" name="text.en">
            <Input
              placeholder="Text (English)"
              value={editForm.text.en}
              onChange={(e) => setEditForm({ ...editForm, text: { ...editForm.text, en: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo text English"
            />
          </Form.Item>
          <Form.Item label="Русский" name="text.ru">
            <Input
              placeholder="Text (Русский)"
              value={editForm.text.ru}
              onChange={(e) => setEditForm({ ...editForm, text: { ...editForm.text, ru: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo text Russian"
            />
          </Form.Item>
          <Form.Item label="Uzbek" name="text.uz">
            <Input
              placeholder="Text (Uzbek)"
              value={editForm.text.uz}
              onChange={(e) => setEditForm({ ...editForm, text: { ...editForm.text, uz: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo text Uzbek"
            />
          </Form.Item>

          <Divider orientation="left" className="font-semibold text-gray-700">
            Label
          </Divider>
          <Form.Item label="English" name="label.en">
            <Input
              placeholder="Label (English)"
              value={editForm.label.en}
              onChange={(e) => setEditForm({ ...editForm, label: { ...editForm.label, en: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo label English"
            />
          </Form.Item>
          <Form.Item label="Русский" name="label.ru">
            <Input
              placeholder="Label (Русский)"
              value={editForm.label.ru}
              onChange={(e) => setEditForm({ ...editForm, label: { ...editForm.label, ru: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo label Russian"
            />
          </Form.Item>
          <Form.Item label="Uzbek" name="label.uz">
            <Input
              placeholder="Label (Uzbek)"
              value={editForm.label.uz}
              onChange={(e) => setEditForm({ ...editForm, label: { ...editForm.label, uz: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo label Uzbek"
            />
          </Form.Item>

          <Divider orientation="left" className="font-semibold text-gray-700">
            Additional Details
          </Divider>
          <Form.Item label="Date" name="date">
            <Input
              placeholder="Date (e.g., 2025-06-13)"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo date"
            />
          </Form.Item>
          <Form.Item label="File Link (Manual)" name="file_link">
            <Input
              placeholder="File Link (if not uploading)"
              value={editForm.file_link}
              onChange={(e) => setEditForm({ ...editForm, file_link: e.target.value })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo file link"
            />
          </Form.Item>
          <Form.Item label="Upload Image" name="image">
            <Upload
              beforeUpload={() => false}
              onChange={handleEditImageChange}
              accept=".jpg,.jpeg,.png"
              showUploadList={true}
              maxCount={1}
              disabled={uploading}
            >
              <Button icon={<UploadOutlined />} className="border-gray-300 rounded-lg" disabled={uploading}>
                Select Image
              </Button>
            </Upload>
            {editForm.image_link && (
              <div className="mt-2">
                <Image
                  src={editForm.image_link}
                  alt="Uploaded image"
                  width={100}
                  height={100}
                  className="mt-2 rounded-lg object-cover"
                  preview
                />
              </div>
            )}
          </Form.Item>
          <Form.Item label="Upload File" name="file">
            <Upload
              beforeUpload={() => false}
              onChange={handleEditFileChange}
              accept=".pdf,.doc,.docx,.txt"
              showUploadList={true}
              maxCount={1}
              disabled={uploading}
            >
              <Button icon={<UploadOutlined />} className="border-gray-300 rounded-lg" disabled={uploading}>
                Select File (Max: 5MB)
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<Title level={3} className="font-semibold text-red-600 text-xl">Delete Todo</Title>}
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={closeModals}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ className: 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-lg' }}
        cancelButtonProps={{ className: 'bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg' }}
        className="rounded-xl"
      >
        <p className="text-gray-700">Are you sure you want to delete this todo?</p>
      </Modal>
    </div>
  );
};

export default TodoList;