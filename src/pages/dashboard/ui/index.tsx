import { AddNewsButton } from 'features/add-news-button';
import { Pagination } from 'features/pagination';
import { useState } from 'react';
import { DashboardTable } from 'widgets/dashboard-table';

const data = [
  { id: 1, title: 'Sample Title', type: 'Sample Type', date: '2023-01-01' },
  { id: 2, title: 'Sample Title', type: 'Sample Type', date: '2023-01-01' },
  { id: 3, title: 'Sample Title', type: 'Sample Type', date: '2023-01-01' },
];
export const DashboardPage = () => {
  const [limit,setLimit]=useState<number>(10)

  const onLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
  }

  return (
    <main className="min-h-full rounded-xl shadow-md max-w-7xl mx-auto mt-24 p-8 bg-white flex flex-col items-center">
      <div className="flex flex-col items-center mb-8">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">Dashboard</h3>
        <p className="text-center text-gray-600">
          Welcome to the dashboard! Here you can manage your news and other content.
        </p>
      </div>
      <AddNewsButton />
      <DashboardTable rows={data}/>
      <Pagination total={0} limit={limit} onChange={onLimitChange}/>
    </main>
  );
};
