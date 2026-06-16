// utils/validation.ts

export const emailDomainDenyListValidator = (email: string) => {
    const denyList = [
      'gmail.com',
      'yahoo.com',
      'outlook.com',
      'hotmail.com',
      'icloud.com',
      'aol.com',
      'live.com',
      'mail.com',
      'protonmail.com',
      'yandex.com',
      // Add more personal email domains you want to block
    ];
  
    if (!email) return true; // Skip validation for empty email
  
    const domain = email.substring(email.lastIndexOf('@') + 1);
  
    // Return false if email domain is in deny list
    return !denyList.includes(domain);
  };
  