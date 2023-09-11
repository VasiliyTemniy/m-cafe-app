import { Image, Container } from '../basic';

interface UnderConstructionProps {
  svgUrl: string;
}

export const UnderConstruction = ({ svgUrl }: UnderConstructionProps) => {

  return (
    <Container className='page-under-construction'>
      <Container className='under-construction'>
        <Container className='container-title'>
          {/* <TextComp text={t('underConstruction.title')} className='text-title'/>
          <TextComp text={t('underConstruction.info')} className='text-info'/> */}
        </Container>
        <Container className='container-svg'>
          <Image src={svgUrl} altText='Under construction' className='construction-svg'/>
        </Container>
      </Container>
    </Container>
  );
};