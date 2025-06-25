import { AddNewsButton } from 'features/add-news-button';
import { Pagination } from 'features/pagination';
import { DashboardTable } from 'widgets/dashboard-table';

export const DashboardPage = () => {
  return (
    <main className="min-h-full rounded-xl shadow-md max-w-7xl mx-auto mt-24 p-8 bg-white flex flex-col items-center">
      <div className="flex flex-col items-center mb-8">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">Dashboard</h3>
        <p className="text-center text-gray-600">
          Welcome to the dashboard! Here you can manage your news and other content.
        </p>
      </div>
      <AddNewsButton />
      <DashboardTable />
      <Pagination total={0}/>
    </main>
  );
};
