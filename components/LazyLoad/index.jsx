"use client";
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

export default function LazyImage ({ src, alt, ...props }) {
  const [ref, inView] = useInView({
    triggerOnce: true, // Load image only once when it becomes visible
  });

  return (
    <div ref={ref} >
      {inView && (
        <Image src={src} alt={alt} {...props} />
      )}
    </div>
  );
};