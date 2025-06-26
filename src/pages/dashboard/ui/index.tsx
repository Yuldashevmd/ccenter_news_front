import { AddNewsButton } from 'features/add-news-button';
import { Pagination } from 'features/pagination';
import { useEffect, useState } from 'react';
import { baseApi } from 'shared/api';
import { ModalData, Todo, useDisclosure, usePaginate } from 'shared/services';
import { DashboardTable } from 'widgets/dashboard-table';
import { Modal } from 'widgets/modal';

export const DashboardPage = () => {
  const { isOpen, open, close } = useDisclosure();
  const { limit, setLimit, total, setTotal } = usePaginate();
  const [isLoading, setIsLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState<string | undefined>(undefined);
  const [data, setData] = useState<[] | any>([]);
  const [editedData, setEditedData] = useState<undefined | Todo>();
  const { createTodo, getTodos, deleteTodo, updateTodo } = baseApi;

  const GET_ALL = async (params: { limit: number }) => {
    try {
      setIsLoading(true);
      const res = await getTodos(params);
      if (res.status === 200) {
        setData(res.data?.banners);
        setTotal(res.data?.count);
      }
    } catch (e) {
      console.log(e, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const onLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
  };

  const onDelete = async (id: number) => {
    try {
      const res = await deleteTodo(id);
      if (res.status === 200) {
        setResponseMsg('News deleted successfully');
        await GET_ALL({ limit });
      }
    } catch (e) {
      console.log(e, 'error');
      setResponseMsg(`Something went wrong-${e}`);
    } finally {
      setTimeout(() => setResponseMsg(undefined), 3000);
    }
  };

  const handleSubmit = async (data: ModalData) => {
    try {
      if (editedData) {
        const res = await updateTodo(editedData.id, data);
        if (res.status === 200) {
          close();
          setEditedData(undefined);
          setResponseMsg('News edited successfully');
          await GET_ALL({ limit });
        }
      } else {
        const res = await createTodo(data);
        if (res.status === 200) {
          close();
          setResponseMsg('News created successfully');
          await GET_ALL({ limit });
        }
      }
    } catch (e) {
      console.log(e);
      setResponseMsg(`Something went wrong-${e}`);
    } finally {
      setTimeout(() => setResponseMsg(undefined), 3000);
    }
  };

  useEffect(() => {
    GET_ALL({ limit });
  }, [limit]);

  return (
    <main className="min-h-full rounded-xl shadow-md max-w-7xl mx-auto mt-24 p-8 bg-white flex flex-col items-center">
      <div className="flex flex-col items-center mb-8">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">Dashboard</h3>
        <p className="text-center text-gray-600">
          Welcome to the dashboard! Here you can manage your news and other content.
        </p>
      </div>
      <AddNewsButton open={open} />
      <DashboardTable
        rows={data}
        onDelete={onDelete}
        loading={isLoading}
        setEditedData={setEditedData}
        open={open}
      />
      <Pagination total={total} limit={limit} onChange={onLimitChange} />

      <Modal
        isOpen={isOpen}
        onClose={close}
        onSubmit={handleSubmit}
        loading={isLoading}
        data={editedData}
      />

      {responseMsg &&
        (responseMsg.includes('successfully') ? (
          <p className="fixed bottom-4 right-5 text-green-600 bg-green-100 border border-green-400 rounded-md px-4 py-2">
            {responseMsg}
          </p>
        ) : (
          <p className="fixed bottom-4 right-5 text-red-600 bg-red-100 border border-red-400 rounded-md px-4 py-2">
            {responseMsg}
          </p>
        ))}
    </main>
  );
};
