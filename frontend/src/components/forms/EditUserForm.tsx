import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiUser, FiMail, FiMapPin } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { FormField } from "./FormField";
import { updateUserSchema, type UpdateUserFormData } from "@/lib/validations";
import { VALIDATION } from "@/config/constants";
import type { User } from "@/types";

interface EditUserFormProps {
  user: User;
  onSubmit: (data: UpdateUserFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EditUserForm({ user, onSubmit, onCancel, isLoading }: EditUserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      address: user.address || "",
      role: user.role,
    },
  });

  const nameValue = watch("name");
  const addressValue = watch("address");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        label="Full Name"
        placeholder="Enter full name"
        startIcon={<FiUser className="h-4 w-4" />}
        error={errors.name?.message}
        showCharCount
        maxLength={VALIDATION.NAME_MAX}
        value={nameValue}
        required
        {...register("name")}
      />

      <FormField
        label="Email Address"
        type="email"
        placeholder="Enter email address"
        startIcon={<FiMail className="h-4 w-4" />}
        error={errors.email?.message}
        required
        {...register("email")}
      />

      <FormField
        label="Address"
        placeholder="Enter address (optional)"
        startIcon={<FiMapPin className="h-4 w-4" />}
        error={errors.address?.message}
        showCharCount
        maxLength={VALIDATION.ADDRESS_MAX}
        value={addressValue}
        {...register("address")}
      />

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Role <span className="text-destructive">*</span>
        </label>
        <select className="input" {...register("role")}>
          <option value="user">User</option>
          <option value="admin">Administrator</option>
          <option value="store_owner">Store Owner</option>
        </select>
        {errors.role && (
          <p className="text-xs text-destructive mt-1">{errors.role.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" loading={isLoading} disabled={isLoading} className="flex-1">
          Save Changes
        </Button>
      </div>
    </form>
  );
}
