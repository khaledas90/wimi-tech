'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import logo from '../../../../public/asset/images/ويمي تك.jpg';

export default function LogoImageAnimation() {
  const logoRef = useRef(null);
  const containerRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const runAnimation = () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            setTimeout(() => setShowLoader(false), 300);
          },
        });

        // دخول اللوجو
        tl.fromTo(
          logoRef.current,
          {
            opacity: 0,
            scale: 0.7,
            rotateY: 90,
            filter: 'blur(8px)',
          },
          {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            filter: 'blur(0)',
            duration: 1,
            ease: 'expo.out',
          }
        );

        // ظهور النص
        tl.fromTo(
          textRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.5'
        );

        // اختفاء كل شيء
        tl.to(containerRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          ease: 'power2.inOut',
          delay: 0.8,
        });
      }, containerRef);

      return () => ctx.revert();
    };

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(runAnimation);
      } else {
        setTimeout(runAnimation, 1);
      }
    }
  }, []);

  if (!showLoader) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_#0d1b1e,_#121417)] text-white"
    >
      {/* دائرة لودينج */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <div
          ref={circleRef}
          className="absolute w-full h-full rounded-full border-[6px] border-t-[#f0a136] border-l-transparent border-b-transparent animate-spin-slow"
        />
        {/* اللوجو */}
        <Image
          ref={logoRef}
          src={logo}
          alt="ويمى تك"
          width={160}
          height={160}
          className="rounded-full border-[5px] border-[#f0a136] shadow-[0_0_60px_#2ecc71]"
          unoptimized
        />
      </div>

    </div>
  );
}
