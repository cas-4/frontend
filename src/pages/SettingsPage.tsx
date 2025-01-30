import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { SettingsForm } from '../components/SettingsForm';

const USER_NAME_QUERY = gql`
  query getUserInfos($userId: Int!) {
    user(id: $userId) {
      email
      name
      address
    }
  }
`;

const USER_EDIT_MUTATION = gql`
  mutation UserEdit($input: UserEdit!, $userId: Int!) {
    userEdit(input: $input, id: $userId) {
      id
      email
      name
      address
      isAdmin
    }
  }
`;

const USER_PASSWORD_EDIT_MUTATION = gql`
  mutation UserPasswordEdit($input: UserPasswordEdit!) {
    userPasswordEdit(input: $input) {
      id
      email
      name
      address
      isAdmin
    }
  }
`;

export interface UserInput {
    email: string;
    name: string;
    address: string;
}

export interface UserPasswordInput {
    password1: string;
    password2: string;
}

export interface FormData extends UserInput {
    password1: string;
    password2: string;
}

export interface User {
    id: number;
    email: string;
    password: string;
    name: string;
    address: string;
    isAdmin: boolean;
}

export interface UserEditResponse {
    userEdit: User;
}

export interface UserQueryResponse {
    user: User;
}

export interface UserPasswordEditResponse {
    userPasswordEdit: User;
}

export default function SettingsPage() {
  const userId = localStorage.getItem('userId');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    password1: '',
    password2: '',
    address: ''
  });

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { loading: queryLoading, error: queryError } = useQuery<UserQueryResponse>(USER_NAME_QUERY, {
    variables: { userId: parseInt(userId || "0") },
    skip: !userId,
    onCompleted: (data) => {
      if (data?.user) {
        setFormData({
          email: data.user.email,
          name: data.user.name,
          address: data.user.address,
          password1: '',
          password2: ''
        });
      }
    },
    onError: (error) => {
      console.error('Query error:', error);
    }
  });

  const [updateUser, { loading: updateLoading }] = useMutation<UserEditResponse>(USER_EDIT_MUTATION);
  const [updatePassword, { loading: passwordUpdateLoading }] = useMutation<UserPasswordEditResponse>(USER_PASSWORD_EDIT_MUTATION);


  if (queryLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-red-400">Error loading user data. Please try again later.</div>
      </div>
    );
  }

  const getErrorMessage = (error: Error): string => {
    const message = error.message.toLowerCase();
    
    // Map of backend error messages to user-friendly messages
    const errorMessages: Record<string, string> = {
      '`password1` length must be >= 8': 'Password must be at least 8 characters long',
      '`password1` and `password2` must be equals': 'Passwords do not match',
    };
  
    // Check if the error message matches any known error
    for (const [backendError, userMessage] of Object.entries(errorMessages)) {
      if (message.includes(backendError.toLowerCase())) {
        return userMessage;
      }
    }
  
    // Default error message for unknown errors
    return 'An error occurred. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setPasswordError('');

    if (!userId) {
      setErrorMessage('No user ID found');
      return;
    }

    // Check if only one password field is filled
    if ((formData.password1 && !formData.password2) || (!formData.password1 && formData.password2)) {
      setPasswordError('Both password fields must be filled');
      return;
    }

    try {
      // First update password if provided
      if (formData.password1 && formData.password2) {
        await updatePassword({
          variables: {
            input: {
              password1: formData.password1,
              password2: formData.password2
            }
          }
        });
      }

      // Then update user data
      const userInput: UserInput = {
        email: formData.email,
        name: formData.name,
        address: formData.address
      };

      await updateUser({
        variables: {
          input: userInput,
          userId: parseInt(userId),
        },
      });

      setSuccessMessage('Settings updated successfully');
      setFormData(prev => ({ ...prev, password1: '', password2: '' }));
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      console.error('Error updating user:', err);
      const userFriendlyMessage = err instanceof Error ? getErrorMessage(err) : 'Error updating settings. Please try again.';
      setErrorMessage(userFriendlyMessage);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear password error when user starts typing
    if (name === 'password1' || name === 'password2') {
      setPasswordError('');
    }
  };

  if (queryLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-red-400">Error loading user data. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="p-4 lg:p-8 max-w-2xl mx-auto">
        <div className="bg-gray-700 text-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Settings</h1>
            <SettingsForm
              formData={formData}
              onSubmit={handleSubmit}
              onChange={handleInputChange}
              isLoading={updateLoading || passwordUpdateLoading}
              errorMessage={errorMessage}
              successMessage={successMessage}
              passwordError={passwordError}
              showPassword1={showPassword1}
              showPassword2={showPassword2}
              onTogglePassword1={() => setShowPassword1(!showPassword1)}
              onTogglePassword2={() => setShowPassword2(!showPassword2)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}