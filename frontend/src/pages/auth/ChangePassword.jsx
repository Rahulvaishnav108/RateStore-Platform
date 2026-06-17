import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';

const ChangePassword = () => {
  const { changePassword } = useAuth();
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.oldPassword) errs.oldPassword = 'Current password is required.';
    if (form.newPassword.length < 8 || form.newPassword.length > 16) errs.newPassword = 'Must be 8–16 characters.';
    else if (!/[A-Z]/.test(form.newPassword)) errs.newPassword = 'Must contain at least one uppercase letter.';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword)) errs.newPassword = 'Must contain at least one special character.';
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await changePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword });
      toast.success('Password updated successfully!');
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update password.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'oldPassword', label: 'Current Password', key: 'old' },
    { name: 'newPassword', label: 'New Password', key: 'new' },
    { name: 'confirmPassword', label: 'Confirm New Password', key: 'confirm' },
  ];

  const requirements = [
    { label: '8–16 characters', met: form.newPassword.length >= 8 && form.newPassword.length <= 16 },
    { label: 'At least one uppercase letter', met: /[A-Z]/.test(form.newPassword) },
    { label: 'At least one special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword) },
    { label: 'Passwords match', met: form.newPassword && form.newPassword === form.confirmPassword },
  ];

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Security Settings</h1>
        <p className="text-slate-500 mt-1">Update your password to keep your account secure</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-surface-100">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <FiShield className="text-primary-600 text-lg" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Change Password</h2>
            <p className="text-sm text-slate-500">Secure your account with a strong password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ name, label, key }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name={name}
                  type={show[key] ? 'text' : 'password'}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`input-field pl-10 pr-10 ${errors[name] ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
                <button type="button" onClick={() => setShow({ ...show, [key]: !show[key] })}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show[key] ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
            </div>
          ))}

          {form.newPassword && (
            <div className="bg-surface-50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Password Requirements</p>
              {requirements.map(({ label, met }) => (
                <div key={label} className="flex items-center gap-2 text-sm">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${met ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {met ? '✓' : '○'}
                  </span>
                  <span className={met ? 'text-emerald-700' : 'text-slate-500'}>{label}</span>
                </div>
              ))}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating...</span> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
