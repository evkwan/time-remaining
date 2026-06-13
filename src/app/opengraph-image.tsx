import { ImageResponse } from 'next/og';

export const alt = 'Year Left — a live countdown to the end of the year';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          backgroundColor: '#0a0a0a',
          padding: 80,
          backgroundImage:
            'radial-gradient(circle at 18% 20%, rgba(56,189,248,0.20), transparent 45%), radial-gradient(circle at 88% 88%, rgba(52,211,153,0.20), transparent 45%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            color: '#9ca3af',
            letterSpacing: 8,
            textTransform: 'uppercase',
          }}
        >
          Year Left
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 78,
            fontWeight: 700,
            color: '#fafafa',
            marginTop: 24,
            lineHeight: 1.1,
            maxWidth: 1000,
          }}
        >
          How many days are left in the year?
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 44,
            height: 14,
            width: 300,
            borderRadius: 999,
            backgroundImage: 'linear-gradient(to right, #38bdf8, #34d399)',
          }}
        />
        <div
          style={{
            display: 'flex',
            marginTop: 44,
            fontSize: 30,
            color: '#9ca3af',
          }}
        >
          Live countdown · day of year · week number · yearleft.app
        </div>
      </div>
    ),
    { ...size },
  );
}
