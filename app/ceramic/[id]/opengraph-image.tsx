import { ImageResponse } from 'next/og';
import { fetchProductById, getCeramicProductById } from '@/data/ceramicProducts';

export const runtime = 'nodejs';
export const alt = 'El\'s Dream Factory ürün görseli';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function ProductOGImage({ params }: { params: { id: string } }) {
  const product = (await fetchProductById(params.id)) ?? getCeramicProductById(params.id);

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FAF5EE',
            fontSize: 48,
            color: '#2C2C2C',
            fontFamily: 'serif',
          }}
        >
          El&apos;s Dream Factory
        </div>
      ),
      { ...size },
    );
  }

  const productImage = product.images[0]?.startsWith('http')
    ? product.images[0]
    : `https://elsdreamfactory.com${product.images[0]}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          background: '#FAF5EE',
          fontFamily: 'serif',
        }}
      >
        {/* Sol: Ürün görseli */}
        <div
          style={{
            width: '55%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#E8DDD4',
            overflow: 'hidden',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={productImage}
            alt={product.name}
            width={660}
            height={630}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Sağ: Metin */}
        <div
          style={{
            width: '45%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 50px',
            gap: '20px',
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: '#8B7355',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            {product.category}
          </div>
          <div
            style={{
              fontSize: 56,
              color: '#2C2C2C',
              fontWeight: 'bold',
              lineHeight: 1.1,
            }}
          >
            {product.name}
          </div>
          <div style={{ width: 60, height: 2, background: '#B8860B' }} />
          <div
            style={{
              fontSize: 36,
              color: '#5C0A1A',
              fontWeight: 'bold',
            }}
          >
            ₺{product.price}
          </div>
          <div
            style={{
              marginTop: 'auto',
              fontSize: 20,
              color: '#8B7355',
              letterSpacing: '0.15em',
            }}
          >
            elsdreamfactory.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
