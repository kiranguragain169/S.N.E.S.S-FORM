import React, { useState, useCallback } from 'react';
import type { Student } from '../types';
import { generateStudentBio } from '../services/geminiService';

interface StudentFormProps {
  onSubmit: (student: Student) => void;
}

const MAJORS = [
  "Computer Science",
  "Mechanical Engineering",
  "Fine Arts",
  "Psychology",
  "Business Administration",
  "Biology",
  "English Literature",
  "History",
  "Physics"
];

const SpinnerIcon: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const StudentForm: React.FC<StudentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    major: '',
    bio: '',
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  // FIX: Replace alert with state for better UX and to fix 'alert is not defined' error.
  const [bioGenerationError, setBioGenerationError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    // FIX: Use e.currentTarget to fix typing errors with e.target properties like 'name' and 'value'.
    const { name, value } = e.currentTarget;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({...prev, [name]: undefined}));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // FIX: Use e.currentTarget to fix typing error with e.target property 'files'.
    const file = e.currentTarget.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = useCallback(() => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required.";
    if (!formData.major) newErrors.major = "Major is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleGenerateBio = async () => {
    setBioGenerationError(null);
    if (!formData.firstName || !formData.lastName || !formData.major) {
      // FIX: Use state to show error message instead of alert.
      setBioGenerationError("Please fill in First Name, Last Name, and Major to generate a bio.");
      return;
    }
    setIsGeneratingBio(true);
    try {
      const bioText = await generateStudentBio(formData.firstName, formData.lastName, formData.major);
      setFormData(prev => ({ ...prev, bio: bioText }));
    } catch (error) {
      console.error(error);
      // FIX: Use state to show error message instead of alert.
      setBioGenerationError("There was an error generating the bio. Please check your API key and network connection.");
    } finally {
      setIsGeneratingBio(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newStudent: Student = {
      id: crypto.randomUUID(),
      ...formData,
      profilePictureUrl: profilePicturePreview,
    };
    onSubmit(newStudent);
    
    // FIX: Removed manual form reset logic. This is now handled by re-mounting the component via a 'key' prop in App.tsx.
    // This resolves errors with 'querySelector' and setting input 'value'.
  };
  
  const InputField: React.FC<{ name: string, label: string, type?: string, error?: string }> = ({ name, label, type = "text", error }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name as keyof typeof formData]}
        onChange={handleInputChange}
        className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Student Enrollment</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField name="firstName" label="First Name" error={errors.firstName} />
          <InputField name="lastName" label="Last Name" error={errors.lastName} />
        </div>
        <InputField name="email" label="Email Address" type="email" error={errors.email} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField name="dateOfBirth" label="Date of Birth" type="date" error={errors.dateOfBirth} />
          <div>
            <label htmlFor="major" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Major</label>
            <select
              id="major"
              name="major"
              value={formData.major}
              onChange={handleInputChange}
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.major ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
            >
              <option value="">Select a major</option>
              {MAJORS.map(major => <option key={major} value={major}>{major}</option>)}
            </select>
            {errors.major && <p className="mt-1 text-sm text-red-500">{errors.major}</p>}
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
            <div className="mt-2 flex items-center gap-4">
                <span className="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {profilePicturePreview ? (
                        <img className="h-full w-full object-cover" src={profilePicturePreview} alt="Profile preview" />
                    ) : (
                        <svg className="h-full w-full text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.997A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    )}
                </span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-900/50 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900"/>
            </div>
        </div>

        <div>
            <div className="flex justify-between items-center mb-1">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">AI Generated Bio</label>
                <button
                    type="button"
                    onClick={handleGenerateBio}
                    disabled={isGeneratingBio}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                    {isGeneratingBio && <SpinnerIcon />}
                    {isGeneratingBio ? 'Generating...' : '✨ Generate with Gemini'}
                </button>
            </div>
            {/* FIX: Display bio generation error message. */}
            {bioGenerationError && <p className="mt-1 text-sm text-red-500">{bioGenerationError}</p>}
            <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
                placeholder="Click 'Generate with Gemini' or write a bio here."
            />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full md:w-auto inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Enroll Student
          </button>
        </div>
      </form>
    </div>
  );
};
