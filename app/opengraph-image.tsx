import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = "El's Dream Factory - El Yapımı Seramik Ürünler";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f5f0eb 0%, #e8ddd4 50%, #d4c5b5 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '60px',
          fontFamily: 'serif',
          padding: '60px',
        }}
      >
        {/* Logo */}
        <img
          src="https://elsdreamfactory.com/images/logo.png"
          alt="El's Dream Factory Logo"
          width={220}
          height={220}
          style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
        />

        {/* Metin */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '16px',
          }}
        >
          <div
            style={{
              fontSize: '22px',
              color: '#8B7355',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}
          >
            El Yapımı Seramik
          </div>
          <div
            style={{
              fontSize: '64px',
              color: '#2C2C2C',
              fontWeight: 'bold',
              lineHeight: 1.1,
            }}
          >
            {"El's Dream\nFactory"}
          </div>
          <div
            style={{
              width: '60px',
              height: '2px',
              backgroundColor: '#B8860B',
            }}
          />
          <div
            style={{
              fontSize: '22px',
              color: '#5C5C5C',
            }}
          >
            Seramik Kupalar · Dekoratif Objeler · Hediyeler
          </div>
          <div
            style={{
              fontSize: '18px',
              color: '#8B7355',
              letterSpacing: '0.15em',
            }}
          >
            elsdreamfactory.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
