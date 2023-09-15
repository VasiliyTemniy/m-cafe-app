import type { CommonProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { TextComp } from './TextComp';
import { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Scrollable } from './Scrollable';


interface ModalProps extends CommonProps {
  children: JSX.Element[] | JSX.Element;
  title: string;
  subtitle?: string;
  active: boolean;
  withBlur?: boolean;
}

export const Modal = ({
  classNameOverride,
  classNameAddon,
  id,
  children,
  title,
  subtitle,
  active,
  withBlur = true
}: ModalProps) => {

  const modalRef = useRef<HTMLDivElement>(null);
  const observer = useRef<ResizeObserver | null>(null);
  const [wrapperHeight, setWrapperHeight] = useState(0);
  const [wrapperTop, setWrapperTop] = useState(0);
  const [modalTop, setModalTop] = useState(10);

  const { className, style } = useInitLC({
    componentType: 'modal',
    componentName: 'modal',
    classNameAddon,
    classNameOverride,
  });

  const handleResize = (parent: HTMLElement, modal: HTMLDivElement, header: HTMLElement) => {
    const newWrapperHeight = (parent.clientHeight - header.clientHeight) < modal.clientHeight
      ? parent.scrollHeight - header.clientHeight
      : parent.clientHeight - header.clientHeight;
    setWrapperHeight(newWrapperHeight);
    setWrapperTop(header.clientHeight);
    const newModalTop = Math.max((newWrapperHeight - modal.clientHeight) / 2 , 0);
    setModalTop(newModalTop);
  };

  useEffect(() => {
    const header = document.getElementById('app-header');
    if (modalRef.current && header) {
      const parent = document.body;
      const modal = modalRef.current;
      observer.current = new ResizeObserver(() => {
        handleResize(parent, modal, header);
      });
      observer.current.observe(parent);
      return () => {
        observer.current?.unobserve(parent);
      };
    }
  }, []);

  if (active) {
    return ReactDOM.createPortal(
      <Scrollable
        wrapperClassNameAddon={`modal-wrapper${withBlur ? ' blur' : ''}`}
        wrapperStyle={{ height: `${wrapperHeight}px`, top: `${wrapperTop}px` }}
        highlightScrollbarOnContentHover={false}
      >
        <div
          className={className}
          ref={modalRef}
          style={{ ...style, top: `${modalTop}px` }}
          id={id}
        >
          <div className='modal-title'>
            <TextComp text={title} classNameAddon='title' htmlEl='h3'/>
            <TextComp text={subtitle} classNameAddon='subtitle' htmlEl='h4'/>
          </div>
          <div className='modal-main'>
            {children}
          </div>
        </div>
      </Scrollable>
      , document.body
    );
  } else {
    return null;
  }
};