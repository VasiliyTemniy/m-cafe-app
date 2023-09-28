import type { CommonProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { TextComp } from './TextComp';
import { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Scrollable } from './Scrollable';


interface ModalProps extends CommonProps {
  children: JSX.Element[] | JSX.Element;
  title?: string;
  subtitle?: string;
  active: boolean;
  withBlur?: boolean;
  wrapperExcludeTop?: number;
  wrapperExcludeRight?: number;
  wrapperExcludeBottom?: number;
  wrapperExcludeLeft?: number;
}

export const Modal = ({
  classNameOverride,
  classNameAddon,
  id,
  children,
  title,
  subtitle,
  active,
  withBlur = true,
  wrapperExcludeTop = 0,
  wrapperExcludeRight = 0,
  wrapperExcludeBottom = 0,
  wrapperExcludeLeft = 0
}: ModalProps) => {

  const modalRef = useRef<HTMLDivElement>(null);
  const parentObserver = useRef<ResizeObserver | null>(null);
  const modalObserver = useRef<ResizeObserver | null>(null);
  const [wrapperHeight, setWrapperHeight] = useState(0);
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [wrapperTop, setWrapperTop] = useState(0);
  const [wrapperLeft, setWrapperLeft] = useState(0);
  const [modalTop, setModalTop] = useState(10);

  const { className, style } = useInitLC({
    componentType: 'modal',
    componentName: 'modal',
    classNameAddon,
    classNameOverride,
  });

  const handleResize = (parent: HTMLElement, modal: HTMLDivElement) => {
    const newWrapperHeight = parent.clientHeight - wrapperExcludeTop - wrapperExcludeBottom;
    setWrapperHeight(newWrapperHeight);
    setWrapperTop(wrapperExcludeTop);
    const newWrapperWidth = parent.clientWidth - wrapperExcludeLeft - wrapperExcludeRight;
    setWrapperWidth(newWrapperWidth);
    setWrapperLeft(wrapperExcludeLeft);
    const newModalTop = Math.max((newWrapperHeight - modal.clientHeight) / 2 , 0);
    setModalTop(newModalTop);
  };

  useEffect(() => {
    if (!modalRef.current) return;
    const parent = document.body;
    const modal = modalRef.current;
    parentObserver.current = new ResizeObserver(() => {
      handleResize(parent, modal);
    });
    parentObserver.current.observe(parent);
    modalObserver.current = new ResizeObserver(() => {
      handleResize(parent, modal);
    });
    modalObserver.current.observe(modal);
    return () => {
      parentObserver.current?.unobserve(parent);
      modalObserver.current?.unobserve(modal);
    };
  }, [wrapperExcludeTop, wrapperExcludeRight, wrapperExcludeBottom, wrapperExcludeLeft, active]);

  if (active) {
    return ReactDOM.createPortal(
      <Scrollable
        wrapperClassNameAddon={`modal-wrapper${withBlur ? ' blur' : ''}`}
        wrapperStyle={{
          height: `${wrapperHeight}px`,
          top: `${wrapperTop}px`,
          width: `${wrapperWidth}px`,
          left: `${wrapperLeft}px`
        }}
        highlightScrollbarOnContentHover={false}
      >
        <div
          className={className}
          ref={modalRef}
          style={{ ...style, top: `${modalTop}px` }}
          id={id}
        >
          {(title || subtitle) &&
            <div className='modal-title'>
              <TextComp text={title} classNameAddon='title' htmlEl='h3'/>
              <TextComp text={subtitle} classNameAddon='subtitle' htmlEl='h4'/>
            </div>
          }
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