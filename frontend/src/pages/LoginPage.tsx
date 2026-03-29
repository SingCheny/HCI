import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, EyeOff, Globe } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login, register } = useAuth();
  const { t, toggleLocale, locale } = useI18n();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(username, email, password, displayName);
      } else {
        await login(username, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || t('loginError'));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Language toggle */}
      <button
        onClick={toggleLocale}
        className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm text-gray-300 hover:text-white transition-all"
      >
        <Globe className="w-4 h-4" />
        {locale === 'en' ? '中文' : 'English'}
      </button>
      {/* Animated background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(${99 + Math.random() * 140}, ${102 + Math.random() * 100}, 241, ${0.15 + Math.random() * 0.25})`,
              animation: `float ${10 + Math.random() * 20}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md sm:max-w-lg mx-6"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center glow-primary"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text">{t('appName')}</h1>
          <p className="text-gray-400 mt-3">{t('loginSubtitle')}</p>
        </div>

        {/* Form */}
        <div className="glass-strong rounded-3xl px-7 py-9 sm:px-12 sm:py-11">
          <h2 className="text-xl font-semibold text-white mb-7 text-center">
            {isRegister ? t('loginCreateAccount') : t('loginWelcome')}
          </h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">{t('loginUsername')}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition text-sm"
                placeholder={t('loginPlaceholderUsername')}
                required
              />
            </div>

            {isRegister && (
              <>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">{t('loginEmail')}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition text-sm"
                    placeholder={t('loginPlaceholderEmail')}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">{t('loginDisplayName')}</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition text-sm"
                    placeholder={t('loginPlaceholderDisplayName')}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm text-gray-300 mb-2">{t('loginPassword')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition pr-14 text-sm"
                  placeholder={t('loginPlaceholderPassword')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-sm hover:from-primary-600 hover:to-accent-600 transition-all duration-300 disabled:opacity-50 glow-primary mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full spinner mx-auto" />
              ) : isRegister ? (
                t('loginCreateAccount')
              ) : (
                t('loginSignIn')
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-sm text-primary-400 hover:text-primary-300 transition"
            >
              {isRegister ? t('loginSwitchToLogin') : t('loginSwitchToRegister')}
            </button>
          </div>

          {!isRegister && (
            <div className="mt-5 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
              <p className="text-xs text-primary-300 text-center">
                <strong>{t('loginDemoAccount')}:</strong> username: <code className="bg-white/10 px-1.5 py-0.5 rounded">demo</code> / password: <code className="bg-white/10 px-1.5 py-0.5 rounded">demo123</code>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
