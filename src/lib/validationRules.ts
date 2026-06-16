/**
 * Centralized validation rules for React Hook Form
 *
 * @example
 * import { validationRules } from '@/lib/validationRules';
 *
 * const { register, formState: { errors } } = useForm();
 *
 * <Input {...register('email', validationRules.email)} />
 */

import { INDUSTRIES } from "@/constants/industries.constant";

export const validationRules = {
  /**
   * @type {Object} name
   * @description Validation rules for name fields
   */
  name: {
    required: "Name is required",
    minLength: { value: 2, message: "Name must be at least 2 characters" },
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message: "Special characters and numbers are not allowed",
    },
  },

  /**
   * @type {Object} industry
   * @description Validation rules for industry selection fields
   */
  industry: {
    required: "Industry is required",
  },

  /**
   * @type {Object} templateName
   * @description Validation rules for template name fields
   */
  templateName: {
    required: "Template name is required",
    minLength: { value: 2, message: "Name must be at least 2 characters" },
  },

  /**
   * @type {Object} leadListName
   * @description Validation rules for lead list name fields
   */
  leadListName: {
    required: "Lead list name is required",
    minLength: { value: 2, message: "Name must be at least 2 characters" },
  },

  /**
   * @type {Object} email
   * @description Validation rules for email fields
   */
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  },

  /**
   * @type {Object} password
   * @description Validation rules for password fields
   */
  password: {
    required: "Password is required",
    minLength: { value: 8, message: "Password must be at least 8 characters" },
  },

  /**
   * @type {Function} confirmPassword
   * @description Validation rules for confirm password fields
   * @param {Function} watch - React Hook Form watch function
   */
  confirmPassword: (watch: any) => ({
    required: "Confirm password is required",
    validate: (value: string) => value === watch("password") || "Passwords do not match",
  }),

  /**
   * @type {Object} subject
   * @description Validation rules for email subject fields
   */
  subject: {
    required: "Subject is required",
    minLength: { value: 2, message: "Subject must be at least 2 characters" },
  },

  /**
   * @type {Object} body
   * @description Validation rules for message body fields
   */
  body: {
    required: "Body is required",
    minLength: { value: 10, message: "Body must be at least 10 characters" },
  },

  /**
   * @type {Object} channel
   * @description Validation rules for channel selection
   */
  channel: {
    required: "Channel is required",
  },

  /**
   * @type {Object} file
   * @description Validation rules for file upload fields
   */
  file: {
    // required: "File is required",
    validate: {
      required: (value: FileList | File) => {
        if (value instanceof FileList) {
          return value.length > 0 || "Please select a file";
        }
        return !!value || "Please select a file";
      },
      fileType: (value: FileList | File) => {
        const file = value instanceof FileList ? value[0] : value;
        if (!file) return true;

        const allowedTypes = [
          "text/csv",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];
        const allowedExtensions = [".csv", ".xlsx"];

        const fileTypeValid = allowedTypes.includes(file.type);
        const fileExtensionValid = allowedExtensions.some((ext) =>
          file.name.toLowerCase().endsWith(ext)
        );

        return fileTypeValid || fileExtensionValid || "Only CSV and XLSX files are allowed";
      },
      fileSize: (value: FileList | File) => {
        const file = value instanceof FileList ? value[0] : value;
        if (!file) return true;

        const maxSize = 10 * 1024 * 1024; // 10MB
        return file.size <= maxSize || "File size must be under 10MB";
      },
    },
  },

  /**
   * @type {Object} leadRequestId
   * @description Validation rules for lead request selection
   */
  leadRequestId: {
    required: "Please select a lead list",
    minLength: { value: 1, message: "Please select a lead list" },
  },

  /**
   * @type {Object} default
   * @description Default validation rules for generic required fields
   */
  default: {
    required: "This field is required",
  },
};

/**
 * Type definitions for form values
 */
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  corporationName: string;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export interface CreateTemplateFormValues {
  name: string;
  subject: string;
  body: string;
  channel: "EMAIL" | "WHATSAPP";
}

export interface LaunchTemplateFormValues {
  leadRequestId: string;
}

export interface UploadLeadFormValues {
  listName: string;
  file: File;
  industry: string;
  description?: string;
}

export interface CreateLeadFormValues {
  name: string;
  leadListId: string;
}
