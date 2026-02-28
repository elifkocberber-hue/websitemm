// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Phone validation (Turkish format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+90|0)?[1-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ''));
};

// Postal code validation (Turkish format)
export const isValidPostalCode = (postalCode: string): boolean => {
  const postalRegex = /^\d{5}$/;
  return postalRegex.test(postalCode);
};

// Name validation (min 2 chars, no special characters)
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZçğıöşüÇĞİÖŞÜ\s]{2,50}$/;
  return nameRegex.test(name.trim());
};

// Address validation
export const isValidAddress = (address: string): boolean => {
  return address.trim().length >= 5 && address.trim().length <= 200;
};

// City validation
export const isValidCity = (city: string): boolean => {
  const cityRegex = /^[a-zA-ZçğıöşüÇĞİÖŞÜ\s]{2,50}$/;
  return cityRegex.test(city.trim());
};

// Password strength validation
export const isValidPassword = (password: string): boolean => {
  // Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Validate customer data
export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export const validateCustomerData = (data: CustomerData): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!isValidName(data.firstName)) {
    errors.push('Geçerli bir ad girin (2-50 karakter)');
  }

  if (!isValidName(data.lastName)) {
    errors.push('Geçerli bir soyad girin (2-50 karakter)');
  }

  if (!isValidEmail(data.email)) {
    errors.push('Geçerli bir e-posta adresi girin');
  }

  if (!isValidPhone(data.phone)) {
    errors.push('Geçerli bir telefon numarası girin (Türkiye formatı)');
  }

  if (!isValidAddress(data.address)) {
    errors.push('Geçerli bir adres girin (5-200 karakter)');
  }

  if (!isValidCity(data.city)) {
    errors.push('Geçerli bir şehir adı girin');
  }

  if (!isValidPostalCode(data.postalCode)) {
    errors.push('Geçerli bir posta kodu girin (5 rakam)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
