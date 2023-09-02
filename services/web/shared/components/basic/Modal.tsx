import type { CommonProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { Container } from './Container';
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
      <Container className='modal-blur-wrapper'>
        <Container className={className} style={style} id={id}>
          <Container className='modal-title'>
            <TextComp text={title} classNameAddon='title'/>
            <TextComp text={subtitle} classNameAddon='subtitle'/>
          </Container>
          <Container className='modal-main'>
            {children}
          </Container>
        </Container>
      </Container>
    );
  } else if (active) {
    return (
      <Container className={className} style={style} id={id}>
        <Container className='modal-title'>
          <TextComp text={title} classNameAddon='title'/>
          <TextComp text={subtitle} classNameAddon='subtitle'/>
        </Container>
        <Container className='modal-main'>
          {children}
        </Container>
      </Container>
    );
  } else {
    return null;
  }
};