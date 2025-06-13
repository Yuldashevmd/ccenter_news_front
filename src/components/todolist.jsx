import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Typography, message, Skeleton, Empty, Modal, Select, Image, Form, Divider, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import api from '../service/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'tailwindcss/tailwind.css';
import { UploadIcon } from 'lucide-react';

const { Text, Title } = Typography;
const { Option } = Select;

const TodoList = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
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
    img_url: '',
  });
  const [editForm, setEditForm] = useState({
    title: { en: '', ru: '', uz: '' },
    text: { en: '', ru: '', uz: '' },
    label: { en: '', ru: '', uz: '' },
    date: '',
    file_link: '',
    img_url: '',
  });
  const [language, setLanguage] = useState('en');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    fetchTodos();
  }, [navigate, token]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await api.getTodos();
      setTodos(response.data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      message.error('Failed to load todos');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file, isEdit = false) => {
    if (!file) return null;
    try {
      setUploading(true);
      const imgUrl = await api.uploadImage(file);
      return imgUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      message.error('Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTodo.title.en.trim() && !newTodo.title.ru.trim() && !newTodo.title.uz.trim()) {
      message.warning('Please enter a title in at least one language');
      return;
    }

    try {
      let imgUrl = newTodo.img_url;
      if (newTodo.imageFile) {
        imgUrl = await handleImageUpload(newTodo.imageFile);
        if (!imgUrl) throw new Error('Image upload failed');
      }

      await api.createTodo({ ...newTodo, img_url: imgUrl });
      setNewTodo({
        title: { en: '', ru: '', uz: '' },
        text: { en: '', ru: '', uz: '' },
        label: { en: '', ru: '', uz: '' },
        date: moment().format(),
        file_link: '',
        img_url: '',
        imageFile: null,
      });
      setIsCreateModalVisible(false);
      message.success('Todo created successfully');
      await fetchTodos();
    } catch (error) {
      console.error('Failed to create todo:', error);
      message.error('Failed to create todo');
    }
  };

  const handleUpdate = async () => {
    try {
      let imgUrl = editForm.img_url;
      if (editForm.imageFile) {
        imgUrl = await handleImageUpload(editForm.imageFile, true);
        if (!imgUrl) throw new Error('Image upload failed');
      }

      await api.updateTodo(editingTodo.id, { ...editForm, img_url: imgUrl });
      await fetchTodos();
      setIsEditModalVisible(false);
      setEditingTodo(null);
      message.success('Todo edited successfully');
    } catch (error) {
      console.error('Failed to update todo:', error);
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
      console.error('Failed to delete todo:', error);
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
      img_url: todo.img_url,
      imageFile: null,
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

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
    }
    return isImage && isLt5M;
  };

  if (loading && todos.length === 0) {
    return (
      <div className="mx-auto mt-8 px-4 max-w-5xl">
        <Card className="bg-white shadow-xl rounded-xl">
          <Skeleton active paragraph={{ rows: 3 }} />
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 px-4 max-w-4xl">
      <Card
        title={<Title level={2} className="font-bold text-gray-800 text-2xl">CCenter News</Title>}
        className="bg-white shadow-xl rounded-xl"
        >
        <div className="flex items-center space-x-4 mb-6">
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
                className="relative bg-white from-blue-400 to-purple-400 shadow-lg hover:shadow-xl p-5 border-gradient-to-r border-t-4 border-l-4 rounded-xl transition-all hover:-translate-y-1 duration-300 transform"
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
                  {todo.file_link && (
                    <a
                      href={todo.file_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800 text-sm hover:underline"
                    >
                      File Link
                    </a>
                  )}
                  {todo.img_url && (
                    <Image
                      src={todo.img_url}
                      alt={todo.title[language]}
                      width={100}
                      height={100}
                      className="shadow-sm rounded-lg object-cover"
                      preview
                    />
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

      {/* Create Todo Modal */}
      <Modal
        title={<Title level={3} className="font-semibold text-gray-800 text-xl">Create New Todo</Title>}
        visible={isCreateModalVisible}
        onOk={handleCreate}
        onCancel={closeModals}
        okText="Create"
        cancelText="Cancel"
        okButtonProps={{ className: 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-lg', disabled: uploading }}
        cancelButtonProps={{ className: 'bg-gray-100 hover:bg-gray-200 text-gray-800', disabled: uploading }}
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
              aria-label="Todo label Edit"
            />
          </Form.Item>

          <Divider orientation="left" className="font-semibold text-gray-700">
            Additional Details
          </Divider>
          <Form.Item label="Date" name="date">
            <Input
              placeholder="Date (e.g., 2025-06-15)"
              value={newTodo.date}
              onChange={(e) => setNewTodo({ ...newTodo, date: e.target.value })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo date"
            />
          </Form.Item>
          <Form.Item label="File Link" name="file_link">
            <Input
              placeholder="File Link"
              value={newTodo.file_link}
              onChange={(e) => setNewTodo({ ...newTodo, file_link: e.target.value })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo file link"
            />
          </Form.Item>
          <Form.Item label="Upload Image" name="image">
            <Upload
              beforeUpload={(file) => {
                setNewTodo({ ...newTodo, imageFile: file });
                return false; // Prevent automatic upload
              }}
              onRemove={() => setNewTodo({ ...newTodo, imageFile: null, img_url: '' })}
              accept=".jpg,.png,.jpeg"
              showUploadList={true}
              maxCount={1}
            >
              <Button icon={<UploadIcon />} className="border-gray-300 rounded-lg">
                Select Image (Max: 5MB)
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Image URL (Manual)" name="img_url">
            <Input
              placeholder="Image URL (if not uploading)"
              value={newTodo.img_url}
              onChange={(e) => setNewTodo({ ...newTodo, img_url: e.target.value }) }
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Todo image URL"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Todo Modal */}
      <Modal
        title={<Title level={3} className="font-semibold text-gray-800 text-xl">Edit Todo </Title>}
        visible={isEditModalVisible}
        onOk={handleUpdate}
        onCancel={closeModals}
        okText="Save"
        cancelText="Cancel"
        okButtonProps={{ className: 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-lg', disabled: uploading }}
        cancelButtonProps={{ className: 'bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg', disabled: uploading }}
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
              aria-label="Edit title English"
            />
          </Form.Item>
          <Form.Item label="Русский" name="title.ru">
            <Input
              placeholder="Title (Русский)"
              value={editForm.title.ru}
              onChange={(e) => setEditForm({ ...editForm, title: { ...editForm.title, ru: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Edit title Russian"
            />
          </Form.Item>
          <Form.Item label="Uzbek" name="title.uz">
            <Input
              placeholder="Title (Uzbek)"
              value={editForm.title.uz}
              onChange={(e) => setEditForm({ ...editForm, title: { ...editForm.title, uz: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Edit title Uzbek"
            />
          </Form.Item>

          <Divider orientation="left" className="font-semibold text-gray-700">
            Description
          </Divider>
          <Form.Item label="English" name="description.en">
            <Input
              placeholder="Text (English)"
              value={editForm.text.en}
              onChange={(e) => setEditForm({ ...editForm, text: { ...editForm.text, en: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Edit description English"
            />
          </Form.Item>
          <Form.Item label="Русский" name="description.ru">
            <Input
              placeholder="Text (Русский)"
              value={editForm.text.ru}
              onChange={(e) => setEditForm({ ...editForm, text: { ...editForm.text, ru: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Edit description Russian"
            />
          </Form.Item>
          <Form.Item label="Uzbek" name="description.uz">
            <Input
              placeholder="Text (Uzbek)"
              value={editForm.text.uz}
              onChange={(e) => setEditForm({ ...editForm, text: { ...editForm.text, uz: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Edit description Uzbek"
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
              aria-label="Edit label English"
            />
          </Form.Item>
          <Form.Item label="Русский" name="label.ru">
            <Input
              placeholder="Label (Русский)"
              value={editForm.label.ru}
              onChange={(e) => setEditForm({ ...editForm, label: { ...editForm.label, ru: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Edit label Russian"
            />
          </Form.Item>
          <Form.Item label="Uzbek" name="label.uz">
            <Input
              placeholder="Label (Uzbek)"
              value={editForm.label.uz}
              onChange={(e) => setEditForm({ ...editForm, label: { ...editForm.label, uz: e.target.value } })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Edit label Uzbek"
            />
          </Form.Item>

          <Divider orientation="left" className="font-semibold text-gray-700">
            Additional Details
          </Divider>
          <Form.Item label="Date" name="date">
            <Input
              placeholder="Date (e.g., 2025-06-15)"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Edit date"
            />
          </Form.Item>
          <Form.Item label="File Link" name="file_link">
            <Input
              placeholder="File Link"
              value={editForm.file_link}
              onChange={(e) => setEditForm({ ...editForm, file_link: e.target.value })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Edit file link"
            />
          </Form.Item>
          <Form.Item label="Upload Image" name="image">
            <Upload
              beforeUpload={(file) => {
                setEditForm({ ...editForm, imageFile: file });
                return false; // Prevent automatic upload
              }}
              onRemove={() => setEditForm({ ...editForm, imageFile: null, img_url: '' })}
              accept=".jpg,.png,.jpeg"
              showUploadList={true}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />} className="border-gray-300 rounded-lg">
                Select Image (Max: 5MB)
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Image URL (Manual)" name="img_url">
            <Input
              placeholder="Image URL (if not uploading)"
              value={editForm.img_url}
              onChange={(e) => setEditForm({ ...editForm, img_url: e.target.value })}
              className="border-gray-300 focus:border-blue-500 rounded-lg"
              aria-label="Edit image URL"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title={<Title level={3} className="font-semibold text-red-600 text-xl">Delete Todo</Title>}
        visible={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={closeModals}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ className: 'bg-gradient-to-r from-red-600 to-red-800 rounded-lg', disabled: false }}
        cancelButtonProps={{ className: 'bg-gray-100 hover:bg-gray-200 rounded-lg' }}
        className="modal"
      >
        <p className="text-gray-600">Are you sure you want to delete this task?</p>
      </Modal>
    </div>
  );
};

export default TodoList;