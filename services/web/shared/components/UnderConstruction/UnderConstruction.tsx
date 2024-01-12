import { useTranslation } from '@m-market-app/frontend-logic/shared/hooks';
import { Image, Container, TextComp } from '../basic';

interface UnderConstructionProps {
  svgUrl: string;
}

export const UnderConstruction = ({ svgUrl }: UnderConstructionProps) => {

  const { t } = useTranslation();

  return (
    <Container classNameAddon='first-layer' id='under-construction'>
      <Container classNameAddon='second-layer' id='under-construction-title'>
        <TextComp text={t('main.underConstruction.title')} htmlEl='h3'/>
        <TextComp text={t('main.underConstruction.info')} htmlEl='h4'/>
      </Container>
      <Image src={svgUrl} altText='Under construction' classNameAddon='svg'/>
    </Container>
  );
};