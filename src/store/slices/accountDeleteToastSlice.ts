import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

export const accountDeleteToastSlice = createSlice({
  name: 'accountDeleteToast',
  initialState: {},
  reducers: {
    onAccountDeleteToast: () => {
      toast.success('正常にアカウントが削除されました。', {
        style: {
          border: '1px solid #ffffff',
          padding: '16px',
          color: 'rgb(55, 65, 81)',
          background: '#ffffff',
        },
        iconTheme: {
          primary: '#ff9800',
          secondary: '#ffffff',
        },
      });
    },
  },
});

export const { onAccountDeleteToast } = accountDeleteToastSlice.actions;
export default accountDeleteToastSlice.reducer;
