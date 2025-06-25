import { AddNewsButton } from 'features/add-news-button';
import { Pagination } from 'features/pagination';
import { useEffect, useState } from 'react';
import { baseApi } from 'shared/api';
import { ModalData, useDisclosure } from 'shared/services';
import { DashboardTable } from 'widgets/dashboard-table';
import { Modal } from 'widgets/modal';

// const data = [
//   { id: 1, title: 'Sample Title', type: 'Sample Type', date: '2023-01-01' },
//   { id: 2, title: 'Sample Title', type: 'Sample Type', date: '2023-01-01' },
//   { id: 3, title: 'Sample Title', type: 'Sample Type', date: '2023-01-01' },
// ];
export const DashboardPage = () => {
  const { isOpen, open, close } = useDisclosure();
  const [limit, setLimit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);
  const [data,setData]=useState<[] | any>([])
  const { createTodo, getTodos } = baseApi;

  const onLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
  };

  const handleSubmit = async (data: ModalData) => {
    console.log(data, 'data');

    await createTodo(data);
  };

  useEffect(() => {
    getTodos().then(res =>setData(res));
  },[])

  return (
    <main className="min-h-full rounded-xl shadow-md max-w-7xl mx-auto mt-24 p-8 bg-white flex flex-col items-center">
      <div className="flex flex-col items-center mb-8">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">Dashboard</h3>
        <p className="text-center text-gray-600">
          Welcome to the dashboard! Here you can manage your news and other content.
        </p>
      </div>
      <AddNewsButton open={open} />
      <DashboardTable rows={data} />
      <Pagination total={0} limit={limit} onChange={onLimitChange} />

      <Modal isOpen={isOpen} onClose={close} onSubmit={handleSubmit} loading={isLoading} />
    </main>
  );
};
