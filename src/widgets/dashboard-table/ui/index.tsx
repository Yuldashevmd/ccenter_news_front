import { Pencil, Trash } from 'lucide-react';
import { FC } from 'react';
import {  Todo } from 'shared/services';

const columns = [
  { title: 'Title', field: 'title' },
  { title: 'Type', field: 'type' },
  { title: 'Date', field: 'date' },
  { title: 'Actions', field: 'actions' },
];

interface IProps {
  rows: any[];
  onDelete: (id: number) => void;
  loading?: boolean;
  setEditedData: React.Dispatch<React.SetStateAction<undefined | Todo>>;
  open: () => void;
}

export const DashboardTable: FC<IProps> = (props) => {
  const { rows, onDelete, loading, setEditedData, open } = props;

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
        {loading ? (
          <tr>
            <td colSpan={100} className="py-6 text-center">
              <div className="inline-block w-8 h-8 border-4 border-t-transparent border-black rounded-full animate-spin"></div>
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 cursor-pointer">
              <td className="px-4 py-2">{row?.title?.uz}</td>
              <td className="px-4 py-2">{row?.type}</td>
              <td className="px-4 py-2">{row?.date}</td>
              <td className="px-4 py-2">
                <span className="text-blue-600 hover:underline" title="Edit">
                  <Pencil
                    className="inline w-5 h-5 text-orange-400 cursor-table"
                    onClick={() => {
                      open();
                      setEditedData(row);
                    }}
                  />
                </span>
                <span className="text-red-600 hover:underline ml-2" title="Delete">
                  <Trash
                    className="inline w-5 h-5 text-red-400 cursor-table"
                    onClick={() => onDelete(row.id)}
                  />
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
