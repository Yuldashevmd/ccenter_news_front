import { AddNewsButton } from 'features/add-news-button';
import { Pagination } from 'features/pagination';
import { useEffect, useState } from 'react';
import { baseApi } from 'shared/api';
import { ModalData, useDisclosure, usePaginate } from 'shared/services';
import { DashboardTable } from 'widgets/dashboard-table';
import { Modal } from 'widgets/modal';

export const DashboardPage = () => {
  const { isOpen, open, close } = useDisclosure();
  const { limit, setLimit, total, setTotal } = usePaginate();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<[] | any>([]);
  const { createTodo, getTodos, deleteTodo } = baseApi;

  const GET_ALL = async (params: { limit: number }) => {
    const res = await getTodos(params);
    if (res.status === 200) {
      setData(res.data?.banners);
      setTotal(res.data?.count);
    }
  };

  const onLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
  };

  const onDelete = async (id: number) => {
    const res =await deleteTodo(id);
    if (res.status === 200){
      await GET_ALL({ limit });
    }
  };

  const handleSubmit = async (data: ModalData) => {
    setIsLoading(true);
    const res = await createTodo(data);
    if (res.status === 200) {
      setIsLoading(false);
      close();
      await GET_ALL({ limit });
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
      <DashboardTable rows={data} onDelete={onDelete} />
      <Pagination total={total} limit={limit} onChange={onLimitChange} />

      <Modal isOpen={isOpen} onClose={close} onSubmit={handleSubmit} loading={isLoading} />
    </main>
  );
};
