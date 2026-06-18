import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiShoppingBag, FiMail, FiMapPin } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { FormField } from "./FormField";
import { createStoreSchema, type CreateStoreFormData } from "@/lib/validations";
import { VALIDATION } from "@/config/constants";
import { useStoreOwners } from "@/hooks/useStores";

interface CreateStoreFormProps {
  onSubmit: (data: CreateStoreFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CreateStoreForm({ onSubmit, onCancel, isLoading }: CreateStoreFormProps) {
  const { data: ownersData } = useStoreOwners();
  const owners = ownersData?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateStoreFormData>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
    },
  });

  const nameValue = watch("name");
  const addressValue = watch("address");

  const handleFormSubmit = (data: CreateStoreFormData) => {
    onSubmit({
      ...data,
      owner_id: data.owner_id ? Number(data.owner_id) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <FormField
        label="Store Name"
        placeholder="Minimum 20 characters"
        startIcon={<FiShoppingBag className="h-4 w-4" />}
        error={errors.name?.message}
        showCharCount
        maxLength={VALIDATION.NAME_MAX}
        value={nameValue}
        required
        {...register("name")}
      />

      <FormField
        label="Store Email"
        type="email"
        placeholder="store@example.com"
        startIcon={<FiMail className="h-4 w-4" />}
        error={errors.email?.message}
        required
        {...register("email")}
      />

      <FormField
        label="Address"
        placeholder="Store address (optional)"
        startIcon={<FiMapPin className="h-4 w-4" />}
        error={errors.address?.message}
        showCharCount
        maxLength={VALIDATION.ADDRESS_MAX}
        value={addressValue}
        {...register("address")}
      />

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Assign Owner (optional)
        </label>
        <select className="input" {...register("owner_id")}>
          <option value="">— No owner yet —</option>
          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.name} ({owner.email})
            </option>
          ))}
        </select>
        {owners.length === 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            No store owners found. Create a store_owner user first.
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" loading={isLoading} disabled={isLoading} className="flex-1">
          Create Store
        </Button>
      </div>
    </form>
  );
}
