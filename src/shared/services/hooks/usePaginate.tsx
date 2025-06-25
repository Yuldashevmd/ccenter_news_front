import { useState } from 'react';

export const usePaginate = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  return { page, setPage, limit, setLimit, total, setTotal };
};
