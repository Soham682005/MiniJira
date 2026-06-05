import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/common/Button';
import { authService } from '../services/auth';

const schema = z.object({
  fullName: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

type AuthForm = z.infer<typeof schema>;

export function AuthPage({ mode }: { mode: 'login' | 'register' | 'forgot' | 'reset' }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<AuthForm>({ resolver: zodResolver(schema) });
  const title = mode === 'register' ? 'Create your TaskFlow account' : mode === 'forgot' ? 'Reset your password' : mode === 'reset' ? 'Choose a new password' : 'Welcome back';

  async function onSubmit(values: AuthForm) {
    setLoading(true);
    try {
      if (mode === 'register') {
        const { error } = await authService.signUp(values.email, values.password, values.fullName ?? '');
        if (error) throw error;
        toast.success('Check your email to verify your account.');
      } else if (mode === 'forgot') {
        const { error } = await authService.forgotPassword(values.email);
        if (error) throw error;
        toast.success('Password reset email sent.');
      } else if (mode === 'reset') {
        const { error } = await authService.resetPassword(values.password);
        if (error) throw error;
        toast.success('Password updated.');
        navigate('/login');
      } else {
        const { error } = await authService.signIn(values.email, values.password);
        if (error) throw error;
        navigate('/');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-lg font-bold text-slate-950">TaskFlow</p>
          <h1 className="mt-6 text-2xl font-semibold text-slate-950">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">Secure Supabase authentication with protected workspace routes.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {mode === 'register' && (
            <label className="grid gap-1 text-sm font-medium text-slate-700">Full name<input className="h-10 rounded-md border border-slate-200 px-3 font-normal outline-none focus:border-teal-600" {...register('fullName')} /></label>
          )}
          {mode !== 'reset' && (
            <label className="grid gap-1 text-sm font-medium text-slate-700">Email<input className="h-10 rounded-md border border-slate-200 px-3 font-normal outline-none focus:border-teal-600" {...register('email')} />{errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}</label>
          )}
          {mode !== 'forgot' && (
            <label className="grid gap-1 text-sm font-medium text-slate-700">Password<input className="h-10 rounded-md border border-slate-200 px-3 font-normal outline-none focus:border-teal-600" type="password" {...register('password')} />{errors.password && <span className="text-xs text-red-600">{errors.password.message}</span>}</label>
          )}
          <Button className="w-full" disabled={loading} icon={<LogIn className="h-4 w-4" />}>{loading ? 'Please wait' : 'Continue'}</Button>
        </form>
        <div className="mt-5 flex justify-between text-sm">
          <Link className="font-medium text-emerald-700 hover:text-emerald-800" to={mode === 'login' ? '/register' : '/login'}>{mode === 'login' ? 'Create account' : 'Back to login'}</Link>
          <Link className="text-slate-500 hover:text-slate-700" to="/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </main>
  );
}
