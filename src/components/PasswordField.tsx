import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { FormField, FormFieldProps } from './FormField';

interface PasswordFieldProps extends Omit<FormFieldProps, 'type'> {
  showPassword: boolean;
  onTogglePassword: () => void;
}

export const PasswordField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  showPassword,
  onTogglePassword,
}: PasswordFieldProps) => (
  <FormField
    label={label}
    name={name}
    value={value}
    onChange={onChange}
    type={showPassword ? "text" : "password"}
    placeholder={placeholder}
  >
    <button
      type="button"
      onClick={onTogglePassword}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 
                hover:text-gray-300 focus:outline-none"
    >
      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
    </button>
  </FormField>
);