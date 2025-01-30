import { FormEvent } from 'react';
import { FormField } from './FormField';
import { PasswordField } from './PasswordField';


interface FormData {
  name: string;
  email: string;
  password1: string;
  password2: string;
  address: string;
}

interface SettingsFormProps {
  formData: FormData;
  onSubmit: (e: FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  errorMessage?: string;
  successMessage?: string;
  passwordError?: string;
  showPassword1: boolean;
  showPassword2: boolean;
  onTogglePassword1: () => void;
  onTogglePassword2: () => void;
}

export const SettingsForm = ({
  formData,
  onSubmit,
  onChange,
  isLoading,
  errorMessage,
  successMessage,
  passwordError,
  showPassword1,
  showPassword2,
  onTogglePassword1,
  onTogglePassword2,
}: SettingsFormProps) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="space-y-4">
      <FormField
        label="Name"
        name="name"
        value={formData.name}
        onChange={onChange}
        placeholder="Enter your name"
      />

      <FormField
        label="Email"
        name="email"
        value={formData.email}
        onChange={onChange}
        type="email"
        placeholder="Enter your email"
      />

      <PasswordField
        label="New Password (leave blank to keep current)"
        name="password1"
        value={formData.password1}
        onChange={onChange}
        placeholder="Enter new password"
        showPassword={showPassword1}
        onTogglePassword={onTogglePassword1}
      />

      <PasswordField
        label="Confirm New Password"
        name="password2"
        value={formData.password2}
        onChange={onChange}
        placeholder="Confirm new password"
        showPassword={showPassword2}
        onTogglePassword={onTogglePassword2}
      />

      {passwordError && (
        <div className="text-red-400 text-sm">
          {passwordError}
        </div>
      )}

      <FormField
        label="Address"
        name="address"
        value={formData.address}
        onChange={onChange}
        placeholder="Enter your address"
      />
    </div>

    {errorMessage && (
      <div className="text-red-400 text-sm mt-2">
        {errorMessage}
      </div>
    )}

    {successMessage && (
      <div className="text-green-400 text-sm mt-2">
        {successMessage}
      </div>
    )}

    <div className="flex justify-end">
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                 focus:ring-offset-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors duration-200"
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  </form>
);