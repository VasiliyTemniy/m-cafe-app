import Container from '../basic/Container';
// import TextComp from '../basic/TextComp';
import SVGImage from '../basic/SVGImage';

interface UnderConstructionProps {
  svgUrl: string;
}

const UnderConstruction = ({ svgUrl }: UnderConstructionProps) => {

  return (
    <Container className='page-under-construction'>
      <Container className='under-construction'>
        <Container className='container-title'>
          {/* <TextComp text={t('underConstruction.title')} className='text-title'/>
          <TextComp text={t('underConstruction.info')} className='text-info'/> */}
        </Container>
        <Container className='container-svg'>
          <SVGImage svgUrl={svgUrl} altText='Under construction' className='construction-svg'/>
        </Container>
      </Container>
    </Container>
  );
};

export default UnderConstruction;