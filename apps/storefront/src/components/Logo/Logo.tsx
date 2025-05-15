import clsx from 'clsx';

interface Props {
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: 'auto' | 'high' | 'low';
  url?: string;
}

export default function Logo(props: Props) {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    url: urlFromProps,
    className,
  } = props;

  const loading = loadingFromProps || 'lazy';
  const priority = priorityFromProps || 'low';

  return (
    <img
      alt="Holmena Logo"
      width={142}
      height={42}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('h-[28px] w-full max-w-[13rem]', className)}
      src={urlFromProps ?? '/logo.png'}
    />
  );
}
