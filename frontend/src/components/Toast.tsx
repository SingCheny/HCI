import { message, notification } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';

interface ToastParams {
  type: 'success' | 'error' | 'achievement';
  title: string;
  message?: string;
}

export function toast(t: ToastParams) {
  if (t.type === 'achievement') {
    notification.success({
      message: t.title,
      description: t.message,
      icon: <TrophyOutlined style={{ color: '#B88A72' }} />,
      placement: 'topRight',
      duration: 4,
    });
  } else if (t.type === 'error') {
    if (t.message) {
      notification.error({
        message: t.title,
        description: t.message,
        placement: 'topRight',
        duration: 4,
      });
    } else {
      message.error(t.title, 4);
    }
  } else {
    if (t.message) {
      notification.success({
        message: t.title,
        description: t.message,
        placement: 'topRight',
        duration: 4,
      });
    } else {
      message.success(t.title, 4);
    }
  }
}
