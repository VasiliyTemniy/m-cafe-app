import type { MouseEventHandler } from "react";
import type { CommonProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC, useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { Container } from "./Container";
import { TextComp } from "./TextComp";
import { Image } from "./Image";
import { apiBaseUrl } from "@m-cafe-app/shared-constants";

interface DropboxProps extends CommonProps {
  options: string[];
  currentOption: string;
  onClick: MouseEventHandler;
  onChoose: MouseEventHandler;
  label: string;
  tNode?: string;
}


export const Dropbox = ({
  classNameOverride,
  classNameAddon,
  id,
  options,
  currentOption,
  onClick,
  onChoose,
  tNode,
  label
}: DropboxProps) => {

  const { t } = useTranslation();

  const { className, style, specific } = useInitLC({
    componentType: 'dropbox',
    componentName: 'dropbox',
    classNameAddon,
    classNameOverride,
  });

  const translatedOptions = tNode
    ? options.map(option => t(`${tNode}.${option}`))
    : options;
  
  const translatedCurrentOption = tNode
    ? t(`${tNode}.${currentOption}`)
    : currentOption;

  return (
    <Container classNameAddon={className} id={id} style={style}>
      <Container classNameAddon='chosen-wrapper' onClick={onClick}>
        <TextComp text={translatedCurrentOption}/>
        <label htmlFor={id}>{label}</label>
        <Image src={`${apiBaseUrl}/public/pictures/svg/notificationdown.svg`}/>
        <>
          {specific?.useBarBelow &&
            <div className='bar'/>
          }
        </>
      </Container>
      <Container classNameAddon='dropdown-wrapper'>
        <Container classNameAddon='options-wrapper'>
          {translatedOptions.map(option => 
            <Container key={option} onClick={onChoose} id={option} className='option' text={option}/>)
          }
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