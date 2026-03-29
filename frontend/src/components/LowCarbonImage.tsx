import { usePreferences } from '@/hooks/usePreferences';

type LowCarbonImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function LowCarbonImage({ alt, className, ...rest }: LowCarbonImageProps) {
  const { lowCarbon } = usePreferences();

  if (lowCarbon) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={[
          'flex items-center justify-center border-2 border-dashed border-border',
          'text-xs text-muted-foreground p-2 text-center',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {alt}
      </div>
    );
  }

  return <img alt={alt} className={className} {...rest} />;
}
