import type { CommonProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { TextComp } from './TextComp';

interface ModalProps extends CommonProps {
  children: JSX.Element[] | JSX.Element;
  title: string;
  subtitle?: string;
  active: boolean;
  wrapper?: boolean;
}

export const Modal = ({
  classNameOverride,
  classNameAddon,
  id,
  children,
  title,
  subtitle,
  active,
  wrapper = true
}: ModalProps) => {

  const { className, style } = useInitLC({
    componentType: 'modal',
    componentName: 'modal',
    classNameAddon,
    classNameOverride,
  });

  if (active && wrapper) {
    return (
      <div className='modal-blur-wrapper'>
        <div className={className} style={style} id={id}>
          <div className='modal-title'>
            <TextComp text={title} classNameAddon='title' htmlEl='h3'/>
            <TextComp text={subtitle} classNameAddon='subtitle' htmlEl='h4'/>
          </div>
          <div className='modal-main'>
            {children}
          </div>
        </div>
      </div>
    );
  } else if (active) {
    return (
      <div className={className} style={style} id={id}>
        <div className='modal-title'>
          <TextComp text={title} classNameAddon='title' htmlEl='h3'/>
          <TextComp text={subtitle} classNameAddon='subtitle' htmlEl='h4'/>
        </div>
        <div className='modal-main'>
          {children}
        </div>
      </div>
    );
  } else {
    return null;
  }
};