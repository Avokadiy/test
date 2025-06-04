'use client';
import Image from 'next/image';

export default function DriveImage({ driveUrl, alt, ...props }) {
  const match = driveUrl?.match(/\/file\/d\/(.+?)\//);
  const fileId = match?.[1];
  const finalUrl = fileId
    ? `https://drive.google.com/uc?export=view&id=${fileId}`
    : '/images/placeholder.jpg';

  return (
    <Image
      src={finalUrl}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 33vw"
      className="object-cover rounded-md"
      {...props}
    />
  );
}