import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiShield } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PasswordField } from "@/components/forms/PasswordField";
import { useAuth } from "@/hooks/useAuth";
import { changePasswordSchema, type ChangePasswordFormData } from "@/lib/validations";

export default function ChangePassword() {
  const { changePassword, isChangingPassword } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const requirements = [
    { label: "8–16 characters", met: newPassword.length >= 8 && newPassword.length <= 16 },
    { label: "At least one uppercase letter", met: /[A-Z]/.test(newPassword) },
    { label: "At least one special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
    { label: "Passwords match", met: !!newPassword && newPassword === confirmPassword },
  ];

  const onSubmit = async (data: ChangePasswordFormData) => {
    await changePassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
    reset();
  };

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Security Settings</h1>
        <p className="text-muted-foreground mt-1">Update your password to keep your account secure</p>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <FiShield className="text-primary text-lg" />
            </div>
            <div>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Secure your account with a strong password</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <PasswordField
              label="Current Password"
              placeholder="Enter current password"
              error={errors.oldPassword?.message}
              required
              {...register("oldPassword")}
            />
            <PasswordField
              label="New Password"
              placeholder="Enter new password"
              error={errors.newPassword?.message}
              showStrength
              required
              {...register("newPassword")}
            />
            <PasswordField
              label="Confirm New Password"
              placeholder="Confirm new password"
              error={errors.confirmPassword?.message}
              required
              {...register("confirmPassword")}
            />

            {newPassword && (
              <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider">Password Requirements</p>
                {requirements.map(({ label, met }) => (
                  <div key={label} className="flex items-center gap-2 text-sm">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${met ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                      {met ? "✓" : "○"}
                    </span>
                    <span className={met ? "text-emerald-700" : "text-muted-foreground"}>{label}</span>
                  </div>
                ))}
              </div>
            )}

            <Button type="submit" className="w-full" loading={isChangingPassword} disabled={isChangingPassword}>
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
