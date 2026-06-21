/**
 * @file Validation rules
 * @description Centralised validation rule objects for React Hook Form, covering auth, booking, passenger, and payment forms
 * @module lib
 */

/**
 * validationRules
 * @description Pre-defined validation rule sets for React Hook Form's `register` function.
 *   Each key maps to an object compatible with RHF's validation options.
 * @example <Input {...register('email', validationRules.email)} />
 */
export const validationRules = {
  /** Full name: required, 2+ chars, letters/spaces only */
  name: {
    required: 'Name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' },
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message: 'Special characters and numbers are not allowed',
    },
  },

  /** Email: required, standard email pattern */
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address',
    },
  },

  /** Password: required, minimum 6 characters */
  password: {
    required: 'Password is required',
    minLength: { value: 6, message: 'Password must be at least 6 characters' },
  },

  /** Confirm password: required, must match the password field */
  confirmPassword: (watch: any) => ({
    required: 'Confirm password is required',
    validate: (value: string) => value === watch('password') || 'Passwords do not match',
  }),

  /** Phone: required, exactly 10 digits */
  phone: {
    required: 'Phone number is required',
    pattern: {
      value: /^[0-9]{10}$/,
      message: 'Phone number must be 10 digits',
    },
  },

  /** Station code: required */
  stationCode: {
    required: 'Please select a station',
  },

  /** Travel date: required, cannot be in the past */
  travelDate: {
    required: 'Travel date is required',
    validate: (value: string) =>
      new Date(value) >= new Date(new Date().toDateString()) || 'Date cannot be in the past',
  },

  /** Passenger count: required, between 1 and 6 */
  passengerCount: {
    required: 'Number of passengers is required',
    min: { value: 1, message: 'At least 1 passenger is required' },
    max: { value: 6, message: 'Maximum 6 passengers per booking' },
  },

  /** Travel class: required */
  seatClass: {
    required: 'Please select a travel class',
  },

  /** Passenger name: required, 2+ chars, letters/spaces only */
  passengerName: {
    required: 'Passenger name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' },
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message: 'Special characters and numbers are not allowed',
    },
  },

  /** Age: required, valid range 1-120 */
  age: {
    required: 'Age is required',
    min: { value: 1, message: 'Age must be at least 1' },
    max: { value: 120, message: 'Age must be at most 120' },
    validate: (value: string | number) =>
      (Number(value) >= 1 && Number(value) <= 120) || 'Enter a valid age (1-120)',
  },

  /** Gender: required */
  gender: {
    required: 'Gender is required',
  },

  /** ID number: required, minimum 4 characters */
  idNumber: {
    required: 'ID number is required',
    minLength: { value: 4, message: 'ID number looks too short' },
  },

  /** ID card type: required */
  idCardType: {
    required: 'Please select an ID card type',
  },

  /** Berth preference: required */
  berthPreference: {
    required: 'Please select berth preference',
  },

  /** Card number: required, 13-19 digits (with optional spaces) */
  cardNumber: {
    required: 'Card number is required',
    pattern: { value: /^[0-9\s]{13,19}$/, message: 'Invalid card number' },
  },

  /** CVV: required, 3-4 digits */
  cvv: {
    required: 'CVV is required',
    pattern: { value: /^[0-9]{3,4}$/, message: 'Invalid CVV' },
  },

  /** PNR number: required, exactly 10 digits */
  pnrNumber: {
    required: 'PNR number is required',
    pattern: {
      value: /^[0-9]{10}$/,
      message: 'PNR must be 10 digits',
    },
  },

  /** Train number: required, 4-5 digits */
  trainNumber: {
    required: 'Train number is required',
    pattern: {
      value: /^[0-9]{4,5}$/,
      message: 'Train number is 4-5 digits',
    },
  },

  /** Agency name: required, minimum 2 characters */
  agencyName: {
    required: 'Agency name is required',
    minLength: { value: 2, message: 'Agency name must be at least 2 characters' },
  },

  /** Fallback for any required field without custom rules */
  default: { required: 'This field is required' },
};

/** Login form field values */
export interface LoginFormValues {
  email: string;
  password: string;
}

/** Signup/registration form field values */
export interface SignupFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

/** Forgot password form field values */
export interface ForgotPasswordFormValues {
  email: string;
}

/** Reset password form field values */
export interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

/** Trip search form field values */
export interface TripSearchFormValues {
  fromStationCode: string;
  toStationCode: string;
  travelDate: string;
  passengerCount: number;
  seatClass: string;
}

/** Passenger details form field values */
export interface PassengerDetailsFormValues {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  berthPreference?: string;
  idType?: string;
  idNumber?: string;
}

/** Payment form field values */
export interface PaymentFormValues {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardholderName: string;
}

/** Change password form field values */
export interface ChangePasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
