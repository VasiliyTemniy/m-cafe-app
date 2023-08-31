import { CommonSCProps } from '../../../types';
import { useInitLC } from "../../hooks";
import { TextCompSC } from "./TextCompSC";
import { ContainerLCProps } from "./ContainerSC";

interface ModalProps {
  children: JSX.Element[] | JSX.Element;
  title: string;
  subtitle?: string;
  active: boolean;
  wrapper?: boolean;
}

interface ModalSCProps extends ModalProps, CommonSCProps {
  ContainerLC: React.FC<ContainerLCProps>,
}

export const ModalSC = ({
  classNameOverride,
  classNameAddon,
  id,
  children,
  title,
  subtitle,
  active,
  wrapper = true,
  ContainerLC
}: ModalSCProps) => {

  const { className, style } = useInitLC({
    componentType: 'modal',
    componentName: 'modal',
    classNameAddon,
    classNameOverride,
  });

  if (active && wrapper) {
    return (
      <ContainerLC className='modal-blur-wrapper'>
        <ContainerLC className={className} style={style} id={id}>
          <ContainerLC className='modal-title'>
            <TextCompSC text={title} classNameAddon='title' ContainerLC={ContainerLC}/>
            <TextCompSC text={subtitle} classNameAddon='subtitle' ContainerLC={ContainerLC}/>
          </ContainerLC>
          <ContainerLC className='modal-main'>
            {children}
          </ContainerLC>
        </ContainerLC>
      </ContainerLC>
    );
  } else if (active) {
    return (
      <ContainerLC className={className} style={style} id={id}>
        <ContainerLC className='modal-title'>
          <TextCompSC text={title} classNameAddon='title' ContainerLC={ContainerLC}/>
          <TextCompSC text={subtitle} classNameAddon='subtitle' ContainerLC={ContainerLC}/>
        </ContainerLC>
        <ContainerLC className='modal-main'>
          {children}
        </ContainerLC>
      </ContainerLC>
    );
  } else {
    return null;
  }
};