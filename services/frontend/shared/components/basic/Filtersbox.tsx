import { CSSProperties, MouseEventHandler } from "react";
// import { useTranslation } from "react-i18next";
import Container from "./Container";
import SVGImage from "./SVGImage";
import TextComp from "./TextComp";
import ToggleSwitch from "./ToggleSwitch";

interface FiltersboxProps {
  className?: string;
  id: string;
  style?: CSSProperties;
  options: Array<{
    name: string,
    checked: boolean
  }>;
  onClick: MouseEventHandler;
  onChoose: MouseEventHandler;
  tNode?: string;
  svgUrl?: string;
}

const Filtersbox = ({
  className,
  id,
  style,
  options,
  onClick,
  onChoose,
  // tNode,
  svgUrl
}: FiltersboxProps) => {

  // const { t } = useTranslation();

  const classNameSum = className
    ? `dropbox-wrapper ${className}`
    : `dropbox-wrapper`;

  return (
    <Container className={classNameSum} id={id} style={style}>
      <Container className='chosen-wrapper' onClick={onClick}>
        <TextComp text={'CHANGE ME'}/>
        <>
          {svgUrl && <SVGImage svgUrl={svgUrl} className='svg-image'/>}
        </>
        <div className='bar'/>
      </Container>
      <Container className='dropdown-wrapper'>
        <Container className='options-wrapper filters'>
          {options.map(option =>
            <Container key={`${option.name} filter-option`} onClick={onChoose} className='option' id={option.name}>
              <div>{
                // tNode ? t(`${tNode}.${option.name}`) : option.name
                option.name
              }</div>
              <ToggleSwitch checked={option.checked}/>
            </Container>
          )}
        </Container>
        <>
          {options.length > 0 &&
            <div className='bar-after'/>
          }
        </>
      </Container>
    </Container>
  );
};

export default Filtersbox;