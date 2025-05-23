export default function AdminIcon() {
  const loading = 'lazy';
  const priority = 'low';

  return (
    <img
      alt="ecommerce Logo"
      width={32}
      height={32}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={'h-[18px] w-[18px]'}
      src={'/favicon.ico'}
    />
  );
}
