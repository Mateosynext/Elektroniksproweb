import React, { useState } from 'react';
import Icon from '../../../components/appIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox'; // ✅ CORREGIDO

const LoginForm = ({ onLogin, isLoading, error }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '',
    rememberDevice: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');

  const roleOptions = [
    { value: 'administrator', label: 'Administrador' },
    { value: 'technician', label: 'Técnico' },
    { value: 'director', label: 'Director' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!formData?.username || !formData?.password || !formData?.role) {
      return;
    }

    if (showCaptcha && !captchaValue) {
      return;
    }

    try {
      await onLogin(formData);
    } catch (error) {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      
      if (newFailedAttempts >= 3) {
        setShowCaptcha(true);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const generateCaptcha = () => {
    return Math.random()?.toString(36)?.substring(2, 8)?.toUpperCase();
  };

  const [captchaCode] = useState(generateCaptcha());

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Username Field */}
      <Input
        label="Usuario"
        type="text"
        placeholder="Ingrese su nombre de usuario"
        value={formData?.username}
        onChange={(e) => handleInputChange('username', e?.target?.value)}
        required
        disabled={isLoading}
        className="w-full"
      />

      {/* Password Field */}
      <div className="relative">
        <Input
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          placeholder="Ingrese su contraseña"
          value={formData?.password}
          onChange={(e) => handleInputChange('password', e?.target?.value)}
          required
          disabled={isLoading}
          className="w-full pr-12"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors duration-200"
          disabled={isLoading}
        >
          <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
        </button>
      </div>

      {/* Role Selection */}
      <Select
        label="Rol de Usuario"
        placeholder="Seleccione su rol"
        options={roleOptions}
        value={formData?.role}
        onChange={(value) => handleInputChange('role', value)}
        required
        disabled={isLoading}
        className="w-full"
      />

      {/* CAPTCHA (shown after failed attempts) */}
      {showCaptcha && (
        <div className="space-y-3">
          <div className="flex items-center space-x-4 p-4 bg-card border border-border rounded-lg">
            <div className="bg-muted px-4 py-2 rounded font-mono text-lg tracking-wider select-none">
              {captchaCode}
            </div>
            <button
              type="button"
              onClick={() => window.location?.reload()}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="RefreshCw" size={20} />
            </button>
          </div>
          <Input
            label="Código de Verificación"
            type="text"
            placeholder="Ingrese el código mostrado"
            value={captchaValue}
            onChange={(e) => setCaptchaValue(e?.target?.value)}
            required
            disabled={isLoading}
            className="w-full"
          />
        </div>
      )}

      {/* Remember Device - ✅ AHORA FUNCIONA */}
      <Checkbox
        label="Recordar este dispositivo"
        checked={formData?.rememberDevice}
        onChange={(e) => handleInputChange('rememberDevice', e?.target?.checked)}
        disabled={isLoading}
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-error/10 border border-error/20 rounded-lg">
          <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0" />
          <span className="text-sm text-error">{error}</span>
        </div>
      )}

      {/* Failed Attempts Warning */}
      {failedAttempts > 0 && failedAttempts < 3 && (
        <div className="flex items-center space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0" />
          <span className="text-sm text-warning">
            Intento fallido {failedAttempts}/3. {3 - failedAttempts} intentos restantes.
          </span>
        </div>
      )}

      {/* Login Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading || (!formData?.username || !formData?.password || !formData?.role)}
        iconName="LogIn"
        iconPosition="left"
      >
        {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
      </Button>

      {/* Forgot Password Link */}
      <div className="text-center">
        <button
          type="button"
          className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
          disabled={isLoading}
        >
          ¿Olvidó su contraseña?
        </button>
      </div>
    </form>
  );
};

export default LoginForm;