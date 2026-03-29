import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { GlobalOutlined } from '@ant-design/icons';
import { Card, Form, Input, Button, Alert, Typography, Space, Divider } from 'antd';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export default function LoginPage() {
  const { login, register } = useAuth();
  const { t, toggleLocale, locale } = useI18n();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: {
    username: string;
    email?: string;
    password: string;
    displayName?: string;
  }) => {
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(values.username, values.email || '', values.password, values.displayName || '');
      } else {
        await login(values.username, values.password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || t('loginError'));
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Language toggle */}
      <Button
        type="text"
        icon={<GlobalOutlined />}
        onClick={toggleLocale}
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          zIndex: 20,
          color: '#a8a29e',
          fontSize: 13,
        }}
      >
        {locale === 'en' ? '中文' : 'English'}
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 420, margin: '0 24px' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            style={{
              width: 48,
              height: 48,
              margin: '0 auto 24px',
              borderRadius: 12,
              background: '#1c1917',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles style={{ width: 20, height: 20, color: '#fff' }} />
          </motion.div>
          <Title level={3} style={{ margin: 0, fontWeight: 600, letterSpacing: '-0.025em' }}>
            {t('appName')}
          </Title>
          <Text type="secondary" style={{ fontSize: 14, marginTop: 8, display: 'block' }}>
            {t('loginSubtitle')}
          </Text>
        </div>

        {/* Form Card */}
        <Card
          bordered
          style={{
            borderRadius: 16,
            borderColor: '#f5f5f4',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
          styles={{
            body: { padding: '44px 36px' },
          }}
        >
          <Title
            level={5}
            style={{ textAlign: 'center', marginBottom: 32, fontWeight: 500 }}
          >
            {isRegister ? t('loginCreateAccount') : t('loginWelcome')}
          </Title>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert
                type="error"
                message={error}
                showIcon
                style={{ marginBottom: 20, borderRadius: 8 }}
              />
            </motion.div>
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="username"
              label={
                <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#78716c', fontWeight: 500 }}>
                  {t('loginUsername')}
                </Text>
              }
              rules={[{ required: true, message: t('loginPlaceholderUsername') }]}
            >
              <Input
                placeholder={t('loginPlaceholderUsername')}
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            {isRegister && (
              <>
                <Form.Item
                  name="email"
                  label={
                    <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#78716c', fontWeight: 500 }}>
                      {t('loginEmail')}
                    </Text>
                  }
                  rules={[{ required: true, type: 'email', message: t('loginPlaceholderEmail') }]}
                >
                  <Input
                    placeholder={t('loginPlaceholderEmail')}
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
                <Form.Item
                  name="displayName"
                  label={
                    <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#78716c', fontWeight: 500 }}>
                      {t('loginDisplayName')}
                    </Text>
                  }
                >
                  <Input
                    placeholder={t('loginPlaceholderDisplayName')}
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </>
            )}

            <Form.Item
              name="password"
              label={
                <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#78716c', fontWeight: 500 }}>
                  {t('loginPassword')}
                </Text>
              }
              rules={[{ required: true, message: t('loginPlaceholderPassword') }]}
            >
              <Input.Password
                placeholder={t('loginPlaceholderPassword')}
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: 44,
                  borderRadius: 8,
                  background: '#1c1917',
                  fontWeight: 500,
                  fontSize: 14,
                }}
              >
                {isRegister ? t('loginCreateAccount') : t('loginSignIn')}
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin: '24px 0 16px' }} />

          <div style={{ textAlign: 'center' }}>
            <Button
              type="link"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                form.resetFields();
              }}
              style={{ color: '#a8a29e', fontWeight: 500, fontSize: 14 }}
            >
              {isRegister ? t('loginSwitchToLogin') : t('loginSwitchToRegister')}
            </Button>
          </div>

          {!isRegister && (
            <div
              style={{
                marginTop: 20,
                padding: 14,
                borderRadius: 8,
                background: '#fafaf9',
                border: '1px solid #f5f5f4',
                textAlign: 'center',
              }}
            >
              <Text style={{ fontSize: 12, color: '#a8a29e' }}>
                <Text strong style={{ fontSize: 12, color: '#78716c' }}>
                  {t('loginDemoAccount')}:
                </Text>{' '}
                <code
                  style={{
                    background: '#fff',
                    padding: '2px 6px',
                    borderRadius: 4,
                    border: '1px solid #f5f5f4',
                    color: '#57534e',
                    fontSize: 11,
                  }}
                >
                  demo
                </code>
                {' / '}
                <code
                  style={{
                    background: '#fff',
                    padding: '2px 6px',
                    borderRadius: 4,
                    border: '1px solid #f5f5f4',
                    color: '#57534e',
                    fontSize: 11,
                  }}
                >
                  demo123
                </code>
              </Text>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
