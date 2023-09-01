import { ImageLCProps } from '../scBasic';


export const ImageLC = ({
  className,
  id,
  style,
  altText,
  src
}: ImageLCProps) => {

  return (
    <img src={src} className={className} id={id} style={style} alt={altText} />
  );

};