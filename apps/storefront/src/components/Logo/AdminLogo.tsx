export default function AdminLogo() {
  const loading = 'lazy';
  const priority = 'low';

  return (
    <img
      alt="ecommerce Logo"
      width={164}
      height={64}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={'h-[4rem] w-[22rem]'}
      src={'/favicon/favicon.ico'}
    />
  );
}
