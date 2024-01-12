import type { CommonProps } from '@m-market-app/frontend-logic/types';
import { useInitLC } from '@m-market-app/frontend-logic/shared/hooks';

interface ImageProps extends CommonProps {
  altText?: string;
  src: string;
}

export const Image = ({
  classNameOverride,
  classNameAddon,
  id,
  altText,
  src
}: ImageProps) => {

  const { className, style } = useInitLC({
    componentType: 'image',
    componentName: 'image',
    classNameAddon,
    classNameOverride,
  });

  return (
    <img src={src} className={className} id={id} style={style} alt={altText}/>
  );

};