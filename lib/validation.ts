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

// ── Yurtdışı siparişler için esnek kurallar ─────────────────────────────────
// TR formatları (telefon 10 hane, posta kodu 5 rakam, isimde Türkçe harf seti)
// yabancı müşteride form doldurmayı imkansızlaştırır; ülke TR değilse
// uluslararası desenler kullanılır.

// Uluslararası telefon: 7-15 hane (E.164 esnek; +, boşluk, tire, parantez ayıklanır)
export const isValidInternationalPhone = (phone: string): boolean => {
  const digits = phone.replace(/[\s\-().+]/g, '');
  return /^\d{7,15}$/.test(digits);
};

// Uluslararası posta kodu: 3-10 alfanumerik (UK/CA/NL harfli kodlar için)
export const isValidInternationalPostalCode = (postalCode: string): boolean => {
  return /^[A-Za-z0-9\s-]{3,10}$/.test(postalCode.trim());
};

// Unicode harflerle isim/şehir (São Paulo, Kraków, Zürich...)
export const isValidInternationalName = (name: string): boolean => {
  return /^[\p{L}\s'.-]{2,50}$/u.test(name.trim());
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
  country?: string; // ISO-2; verilmezse TR varsayılır
}

export const validateCustomerData = (
  data: CustomerData,
  countryCode?: string
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const isTR = ((countryCode ?? data.country ?? 'TR').toUpperCase()) === 'TR';

  const nameOk = isTR ? isValidName : isValidInternationalName;
  if (!nameOk(data.firstName)) {
    errors.push('Geçerli bir ad girin (2-50 karakter)');
  }

  if (!nameOk(data.lastName)) {
    errors.push('Geçerli bir soyad girin (2-50 karakter)');
  }

  if (!isValidEmail(data.email)) {
    errors.push('Geçerli bir e-posta adresi girin');
  }

  if (isTR ? !isValidPhone(data.phone) : !isValidInternationalPhone(data.phone)) {
    errors.push(isTR ? 'Geçerli bir telefon numarası girin (Türkiye formatı)' : 'Geçerli bir telefon numarası girin');
  }

  if (!isValidAddress(data.address)) {
    errors.push('Geçerli bir adres girin (5-200 karakter)');
  }

  if (isTR ? !isValidCity(data.city) : !isValidInternationalName(data.city)) {
    errors.push('Geçerli bir şehir adı girin');
  }

  if (isTR ? !isValidPostalCode(data.postalCode) : !isValidInternationalPostalCode(data.postalCode)) {
    errors.push(isTR ? 'Geçerli bir posta kodu girin (5 rakam)' : 'Geçerli bir posta kodu girin');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
