// Location data for Indonesia regions
// Format: "id|name"

export interface LocationOption {
  value: string;
  label: string;
}

export const provinces: LocationOption[] = [
  { value: '1|ACEH', label: 'ACEH' },
  { value: '2|SUMATERA UTARA', label: 'SUMATERA UTARA' },
  { value: '3|SUMATERA BARAT', label: 'SUMATERA BARAT' },
  { value: '4|RIAU', label: 'RIAU' },
  { value: '5|JAMBI', label: 'JAMBI' },
  { value: '6|SUMATERA SELATAN', label: 'SUMATERA SELATAN' },
  { value: '7|BENGKULU', label: 'BENGKULU' },
  { value: '8|LAMPUNG', label: 'LAMPUNG' },
  { value: '9|KEPULAUAN BANGKA BELITUNG', label: 'KEPULAUAN BANGKA BELITUNG' },
  { value: '10|KEPULAUAN RIAU', label: 'KEPULAUAN RIAU' },
  { value: '11|DKI JAKARTA', label: 'DKI JAKARTA' },
  { value: '12|JAWA BARAT', label: 'JAWA BARAT' },
  { value: '13|JAWA TENGAH', label: 'JAWA TENGAH' },
  { value: '14|DI YOGYAKARTA', label: 'DI YOGYAKARTA' },
  { value: '15|JAWA TIMUR', label: 'JAWA TIMUR' },
  { value: '16|SUMATERA UTARA', label: 'SUMATERA UTARA' },
  { value: '17|BANTEN', label: 'BANTEN' },
  { value: '18|BALI', label: 'BALI' },
  { value: '19|NUSA TENGGARA BARAT', label: 'NUSA TENGGARA BARAT' },
  { value: '20|NUSA TENGGARA TIMUR', label: 'NUSA TENGGARA TIMUR' },
  { value: '21|KALIMANTAN BARAT', label: 'KALIMANTAN BARAT' },
  { value: '22|KALIMANTAN TENGAH', label: 'KALIMANTAN TENGAH' },
  { value: '23|KALIMANTAN SELATAN', label: 'KALIMANTAN SELATAN' },
  { value: '24|KALIMANTAN TIMUR', label: 'KALIMANTAN TIMUR' },
  { value: '25|KALIMANTAN UTARA', label: 'KALIMANTAN UTARA' },
  { value: '26|SULAWESI UTARA', label: 'SULAWESI UTARA' },
  { value: '27|SULAWESI TENGAH', label: 'SULAWESI TENGAH' },
  { value: '28|SULAWESI SELATAN', label: 'SULAWESI SELATAN' },
  { value: '29|SULAWESI TENGGARA', label: 'SULAWESI TENGGARA' },
  { value: '30|GORONTALO', label: 'GORONTALO' },
  { value: '31|SULAWESI BARAT', label: 'SULAWESI BARAT' },
  { value: '32|MALUKU', label: 'MALUKU' },
  { value: '33|MALUKU UTARA', label: 'MALUKU UTARA' },
  { value: '34|PAPUA', label: 'PAPUA' },
  { value: '35|PAPUA BARAT', label: 'PAPUA BARAT' },
];

// Sample cities for Sumatera Utara
export const cities: Record<string, LocationOption[]> = {
  '16|SUMATERA UTARA': [
    { value: '361|MEDAN', label: 'MEDAN' },
    { value: '362|BINJAI', label: 'BINJAI' },
    { value: '363|TEBING TINGGI', label: 'TEBING TINGGI' },
    { value: '364|PEMATANG SIANTAR', label: 'PEMATANG SIANTAR' },
    { value: '365|TANJUNG BALAI', label: 'TANJUNG BALAI' },
  ],
  // Add more cities for other provinces as needed
};

// Sample districts for Medan
export const districts: Record<string, LocationOption[]> = {
  '361|MEDAN': [
    { value: '3501|MEDAN PETISAH', label: 'MEDAN PETISAH' },
    { value: '3502|MEDAN BARU', label: 'MEDAN BARU' },
    { value: '3503|MEDAN POLONIA', label: 'MEDAN POLONIA' },
    { value: '3504|MEDAN MAIMUN', label: 'MEDAN MAIMUN' },
    { value: '3505|MEDAN KOTA', label: 'MEDAN KOTA' },
    { value: '3506|MEDAN SELAYANG', label: 'MEDAN SELAYANG' },
  ],
  // Add more districts for other cities as needed
};
