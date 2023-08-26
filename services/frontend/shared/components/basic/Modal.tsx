import Container from "./Container";
import TextComp from "./TextComp";

interface ModalProps {
  className?: string;
  id?: string;
  children: JSX.Element[] | JSX.Element;
  title: string;
  subtitle?: string;
  active: boolean;
  wrapper?: boolean;
}

const Modal = ({ className, id, children, title, subtitle, active, wrapper = true }: ModalProps) => {

  const classNameSum = className
    ? `modal ${className}`
    : `modal`;

  if (active && wrapper) {
    return (
      <Container className='modal-blur-wrapper'>
        <Container className={classNameSum} id={id}>
          <Container className='modal-title'>
            <TextComp text={title} className='text-title'/>
            <TextComp text={subtitle} className='text-subtitle'/>
          </Container>
          <Container className='modal-main'>
            {children}
          </Container>
        </Container>
      </Container>
    );
  } else if (active) {
    return (
      <Container className={classNameSum} id={id}>
        <Container className='modal-title'>
          <TextComp text={title} className='text-title'/>
          <TextComp text={subtitle} className='text-subtitle'/>
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

export default Modal;