import { Pencil, Trash, View } from 'lucide-react';

const columns = [
  { title: 'Title', field: 'title' },
  { title: 'Type', field: 'type' },
  { title: 'Date', field: 'date' },
  { title: 'Actions', field: 'actions' },
];

const rows = [
  { id: 1, title: 'Sample Title', type: 'Sample Type', date: '2023-01-01' },
  { id: 2, title: 'Sample Title', type: 'Sample Type', date: '2023-01-01' },
  { id: 3, title: 'Sample Title', type: 'Sample Type', date: '2023-01-01' },
];

export const DashboardTable = () => {
  return (
    <table className="table w-full border border-gray-200">
      <thead className="bg-gray-100 border-b border-gray-200">
        <tr>
          {columns.map((column) => (
            <th key={column.field} className="px-4 py-2 text-left text-gray-600 font-medium">
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {/* Example row, replace with dynamic data */}
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 cursor-pointer">
            <td className="px-4 py-2">{row.title}</td>
            <td className="px-4 py-2">{row.type}</td>
            <td className="px-4 py-2">{row.date}</td>
            <td className="px-4 py-2">
              <span className="text-blue-600 hover:underline" title='Edit'>
                <Pencil className="inline w-5 h-5 text-orange-400 cursor-table" />
              </span>
              <span className="text-red-600 hover:underline ml-2" title='Delete'>
                <Trash className="inline w-5 h-5 text-red-400 cursor-table" />
              </span>
              <span className="text-green-600 hover:underline ml-2" title='View'>
                <View className="inline w-5 h-5 text-blue-400 cursor-table" />
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
