import { FC } from 'react';

interface IProps {
  limit: number;
  total: number;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
export const Pagination: FC<IProps> = (props) => {
  const { total = 0, limit, onChange } = props;
  const options = [10, 20, 50, 100, 200];

  return (
    <div className="w-full flex items-center justify-end gap-3">
      <p className="text-gray-600">Total: {total}</p>
      <p className="text-gray-600">Limit:</p>
      <select value={limit} onChange={onChange} className="w-fit border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 my-2">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
