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
        background: '#F8F4EF',
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
          color: '#A08F84',
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
              background: '#B88A72',
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
            borderColor: '#F1E7DC',
            boxShadow: '0 1px 3px rgba(76,64,56,0.06)',
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
                <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7A6A60', fontWeight: 500 }}>
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
                    <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7A6A60', fontWeight: 500 }}>
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
                    <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7A6A60', fontWeight: 500 }}>
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
                <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7A6A60', fontWeight: 500 }}>
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
                  background: '#B88A72',
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
              style={{ color: '#A08F84', fontWeight: 500, fontSize: 14 }}
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
                background: '#F8F4EF',
                border: '1px solid #F1E7DC',
                textAlign: 'center',
              }}
            >
              <Text style={{ fontSize: 12, color: '#A08F84' }}>
                <Text strong style={{ fontSize: 12, color: '#7A6A60' }}>
                  {t('loginDemoAccount')}:
                </Text>{' '}
                <code
                  style={{
                    background: '#FFFDF9',
                    padding: '2px 6px',
                    borderRadius: 4,
                    border: '1px solid #F1E7DC',
                    color: '#4C4038',
                    fontSize: 11,
                  }}
                >
                  demo
                </code>
                {' / '}
                <code
                  style={{
                    background: '#FFFDF9',
                    padding: '2px 6px',
                    borderRadius: 4,
                    border: '1px solid #F1E7DC',
                    color: '#4C4038',
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
