import { CSSProperties, MouseEventHandler } from "react";
// import { useTranslation } from "react-i18next";
import Container from "./Container";
import SVGImage from "./SVGImage";
import TextComp from "./TextComp";

interface DropboxProps {
  className?: string;
  id: string;
  style?: CSSProperties;
  options: string[];
  currentOption: string;
  onClick: MouseEventHandler;
  onChoose: MouseEventHandler;
  tNode?: string;
  labelText: string;
  svgUrl?: string;
}

const Dropbox = ({
  className,
  id,
  style,
  options,
  currentOption,
  onClick,
  onChoose,
  // tNode,
  labelText,
  svgUrl
}: DropboxProps) => {

  // const { t } = useTranslation();

  const classNameSum = className
    ? `dropbox-wrapper ${className}`
    : `dropbox-wrapper`;

  return (
    <Container className={classNameSum} id={id} style={style}>
      <Container className='chosen-wrapper' onClick={onClick}>
        {/* <TextComp text={tNode ? t(`${tNode}.${currentOption}`) : currentOption}/> */}
        <TextComp text={currentOption}/>
        <label htmlFor={id}>{labelText}</label>
        <>
          {svgUrl && <SVGImage svgUrl={svgUrl} className='svg-image'/>}
        </>
        <div className='bar'/>
      </Container>
      <Container className='dropdown-wrapper'>
        <Container className='options-wrapper'>
          {options.map(option => 
            <div key={option} onClick={onChoose} id={option} className='option'>{
              // tNode ? t(`${tNode}.${option}`) : option
              option
            }</div>)
          }
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

export default Dropbox;