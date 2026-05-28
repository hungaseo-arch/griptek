// ─── CV GRIPTEK Solusi — 회사 / 정적 데이터 ─────────────────────────────────
// React 원본 App.tsx 의 CO / BANK / TC 상수를 그대로 이관.

export const CO = {
  name:  'CV GRIPTEK SOLUSI',
  a1:    'Kantorkuu Agro Plaza, Jl. H. R. Rasuna Said 7',
  a2:    'RT.7/RW.4, Kel. Kuningan Timur., Kec. Setiabudi',
  a3:    'Jakarta Selatan, DKI Jakarta 12950',
  phone: '+62 813-1534-0361',
  email: 'gripteksolusi@gmail.com',
  pic:   'Maria Panjaitan',
} as const;

// Quotation — 은행 / 결제 정보
export const BANK: { label: string; value: string }[] = [
  { label: 'Bank Name',    value: '' },
  { label: 'Account No.',  value: '' },
  { label: 'Account Name', value: 'CV GRIPTEK Solusi' },
  { label: 'Branch',       value: '' },
  { label: 'Swift Code',   value: '' },
];

// Quotation — 이용 약관 (Terms & Conditions, Bahasa Indonesia)
export const TC: string[] = [
  '1. Harga berlaku selama masa penawaran yang tertera.',
  '2. Pengiriman sesuai jadwal dan ketentuan yang disepakati.',
  '3. Pembayaran sesuai termin yang tertera pada dokumen ini.',
  '4. Garansi produk sesuai ketentuan pabrik / distributor resmi.',
  '5. Segala perubahan harus dalam bentuk tertulis dan disetujui kedua pihak.',
];

// Proforma Invoice — 이용 약관 (Terms & Conditions, English)
export const PI_TERMS: string[] = [
  '1. This proforma invoice is not a final tax invoice.',
  '2. Prices are subject to change without prior notice.',
  '3. Delivery time stated above is an estimate only.',
  '4. Payment must be received before shipment is arranged.',
  '5. Goods remain property of seller until full payment received.',
];
