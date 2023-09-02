import type { MouseEventHandler } from "react";
import type { CommonProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC, useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { Container } from "./Container";
import { TextComp } from "./TextComp";
import { Image } from "./Image";
import { Switch } from "./Switch";


interface FiltersboxProps extends CommonProps {
  options: Array<{
    name: string,
    checked: boolean
  }>;
  onClick: MouseEventHandler;
  onChoose: MouseEventHandler;
  svgUrl?: string;
  label: string;
  tNode?: string
}


export const Filtersbox = ({
  classNameOverride,
  classNameAddon,
  id,
  options,
  onClick,
  onChoose,
  tNode,
  svgUrl,
  label
}: FiltersboxProps) => {

  const { t } = useTranslation();

  const { className, style, specific } = useInitLC({
    componentType: 'input',
    componentName: 'filtersbox',
    classNameAddon,
    classNameOverride,
  });

  const translatedOptions = tNode
    ? options.map(option => {
      return {
        checked: option.checked,
        name: t(`${tNode}.${option.name}`)
      };
    })
    : options;

  return (
    <Container className={className} id={id} style={style}>
      <Container className='chosen-wrapper' onClick={onClick}>
        <TextComp text={label}/>
        <>
          {svgUrl && <Image src={svgUrl}/>}
          {specific?.useBarBelow &&
          <div className='bar'/>
          }
        </>
      </Container>
      <Container className='dropdown-wrapper'>
        <Container className='options-wrapper filters'>
          {translatedOptions.map(option =>
            <Container key={`${option.name} filter-option`} onClick={onChoose} className='option' id={option.name}>
              <Container text={option.name}/>
              <Switch checked={option.checked} id={option.name}/>
            </Container>
          )}
        </Container>
        <>
          {translatedOptions.length > 0 && specific?.useBarBelow &&
          <div className='bar-after'/>
          }
        </>
      </Container>
    </Container>
  );
};