import { AddFilesButton } from 'features/add-files-button';
import { List } from './list';
import { baseApi } from 'shared/api';
import { useEffect, useState } from 'react';
import { Notification } from 'shared/ui';

export const FileList = () => {
  const { uploadFile, getFileList, deleteFile } = baseApi;
  const [list, setList] = useState<{ url: string }[]>([]);
  const [message, setMessage] = useState<null | string>(null);

  const getList =async ()=>{
    const res = await getFileList();
    if (res.status === 200) {
      setList(res.data);
    }
  }

  useEffect(() => {
    getList();
  }, []);

  const onUploadFiles = async (files: FileList) => {
    if (files.length > 0) {
     const res = await uploadFile(files[0]);
     res.Message && (setMessage((res.Message).toLocaleLowerCase()),getList());
    }
  };
  const onDelete = async (url: string) => {
    if (!url) return;
    try {
      const res = await deleteFile(url);
      res.status === 200 && (setMessage('File deleted successfully'),getList());
    } catch (e) {
      setMessage(`Something went wrong-${e}`);
    }
  };

  return (
    <div className="w-full border-t-1 border-gray-200">
      <h3 className="text-2xl font-semibold text-center text-gray-800 my-6">FileList</h3>
      <p className="text-center text-gray-600">Here is the list of files</p>
      <AddFilesButton onChange={onUploadFiles} />
      <List list={list} onDelete={onDelete} />
      {/* Notification */}
      <Notification message={message} />
    </div>
  );
};
