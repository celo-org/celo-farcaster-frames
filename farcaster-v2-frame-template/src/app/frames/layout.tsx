import { metadata as frameMeta } from './metadata';

export const metadata = frameMeta;

export default function FramesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}