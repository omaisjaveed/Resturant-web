'use client';

import Toast from '@/components/Toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toast />
    </>
  );
}
