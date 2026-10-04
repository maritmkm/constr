import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Mail, Building } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@example.com',
      password: 'admin123',
      rememberMe: true,
    },
  });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setSubmitting(true);
    setAuthError(null);
    try {
      await login(data.email, data.password);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setAuthError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Accent Shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#CBDDE9]/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#2872A1]/10 blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-3">
          <div className="h-14 w-14 rounded-2xl bg-[#2872A1] text-white flex items-center justify-center shadow-lg shadow-[#2872A1]/20">
            <Building className="h-8 w-8" />
          </div>
        </div>
        <h2 className="text-center text-2xl font-extrabold text-[#172B3A] tracking-tight">
          Workforce & Company Portal
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 font-medium">
          Sign in to access the Enterprise Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200/80 sm:px-10">
          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
              {authError}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label required>Email Address</Label>
              <Input
                type="email"
                placeholder="admin@example.com"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div>
              <Label required>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#2872A1] focus:ring-[#2872A1] border-slate-300 rounded"
                  {...register('rememberMe')}
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-semibold text-slate-600">
                  Remember me
                </label>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full h-11 text-sm font-bold shadow-md"
                isLoading={submitting}
              >
                Sign In to Dashboard
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-3">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#2872A1] hover:text-[#172B3A] hover:underline"
            >
              Are you a worker? Register as Employee here →
            </Link>
            <p className="text-[11px] text-slate-400">
              Default Admin: <span className="font-semibold text-slate-700">admin@example.com</span> /{' '}
              <span className="font-semibold text-slate-700">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
