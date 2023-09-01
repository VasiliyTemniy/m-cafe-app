import type { CommonLCProps, CommonSCProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { ImageLC } from '../lcWeb';

interface ImageProps {
  altText?: string;
  src: string;
}

interface ImageSCProps extends ImageProps, CommonSCProps {
}

export interface ImageLCProps extends ImageProps, CommonLCProps {
}

export const ImageSC = ({
  classNameOverride,
  classNameAddon,
  id,
  altText,
  src
}: ImageSCProps) => {

  const { className, style } = useInitLC({
    componentType: 'svg-image',
    componentName: 'svg-image',
    classNameAddon,
    classNameOverride,
  });

  return (
    <ImageLC
      src={src}
      className={className}
      id={id}
      style={style}
      altText={altText}
    />
  );

};