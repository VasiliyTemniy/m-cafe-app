import {
  useState,
  useEffect,
  useRef,
  useCallback,
  MouseEvent as ReactMouseEvent
} from 'react';
import { useInitLC } from '@m-cafe-app/frontend-logic/shared/hooks';
import { ContainerProps } from './Container';

export const Scrollable = ({
  className,
  id,
  style,
  children,
  onClick,
  onMouseEnter,
  onMouseMove,
  onMouseDown,
  onMouseLeave,
  onMouseUp,
  text
}: ContainerProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const scrollThumbRef = useRef<HTMLDivElement>(null);
  const observer = useRef<ResizeObserver | null>(null);
  const [thumbHeight, setThumbHeight] = useState(20);
  const [trackHeight, setTrackHeight] = useState(20);
  const [scrollStartPosition, setScrollStartPosition] = useState<number | null>(null);
  const [initialScrollTop, setInitialScrollTop] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollbarVisible, setScrollbarVisible] = useState(false);

  const { className: scrollbarClassName, style: scrollbarStyle } = useInitLC({
    componentType: 'scrollbar',
    componentName: 'scrollbar'
  });

  function handleResize(ref: HTMLDivElement) {
    const { clientHeight, scrollHeight, offsetTop } = ref;
    setThumbHeight(Math.max(((clientHeight + (offsetTop / 2)) / scrollHeight) * (clientHeight + (offsetTop / 2)), 20));
    setTrackHeight(clientHeight + offsetTop);
    setScrollbarVisible(ref.clientHeight < ref.scrollHeight);
  }

  const handleTrackClick = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const { current: trackCurrent } = scrollTrackRef;
      const { current: contentCurrent } = contentRef;
      if (trackCurrent && contentCurrent) {
        const { clientY } = e;
        const target = e.target as HTMLDivElement;
        const rect = target.getBoundingClientRect();
        const trackTop = rect.top;
        const thumbOffset = -(thumbHeight / 2);
        const clickRatio =
          (clientY - trackTop + thumbOffset) / trackCurrent.clientHeight;
        const scrollAmount = Math.floor(
          clickRatio * contentCurrent.scrollHeight
        );
        contentCurrent.scrollTo({
          top: scrollAmount,
          behavior: 'smooth',
        });
      }
    },
    [thumbHeight]
  );

  const handleThumbPosition = useCallback(() => {
    if (
      !contentRef.current ||
      !scrollTrackRef.current ||
      !scrollThumbRef.current
    ) {
      return;
    }
    const { scrollTop: contentTop, scrollHeight: contentHeight } =
      contentRef.current;
    const { clientHeight: trackHeight } = scrollTrackRef.current;
    let newTop = (+contentTop / +contentHeight) * trackHeight; 
    newTop = Math.min(newTop, trackHeight - thumbHeight);
    const thumb = scrollThumbRef.current;
    thumb.style.top = `${newTop}px`;
  }, []);

  const handleThumbMousedown = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setScrollStartPosition(e.clientY);
    if (contentRef.current) setInitialScrollTop(contentRef.current.scrollTop);
    setIsDragging(true);
  }, []);

  const handleThumbMouseup = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isDragging) {
        setIsDragging(false);
      }
    },
    [isDragging]
  );

  const handleThumbMousemove = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isDragging && contentRef.current && scrollStartPosition) {
        const {
          scrollHeight: contentScrollHeight,
          clientHeight: contentClientHeight,
        } = contentRef.current;

        const deltaY =
          (e.clientY - scrollStartPosition) *
          (contentClientHeight / thumbHeight);
        const newScrollTop = Math.min(
          initialScrollTop + deltaY,
          contentScrollHeight - contentClientHeight
        );

        contentRef.current.scrollTop = newScrollTop;
      }
    },
    [isDragging, scrollStartPosition, thumbHeight]
  );

  // If the content and the scrollbar track exist, use a ResizeObserver to adjust height of thumb and listen for scroll event to move the thumb
  useEffect(() => {
    if (contentRef.current && scrollTrackRef.current) {
      const ref = contentRef.current;
      observer.current = new ResizeObserver(() => {
        handleResize(ref);
      });
      observer.current.observe(ref);
      ref.addEventListener('scroll', handleThumbPosition);
      return () => {
        observer.current?.unobserve(ref);
        ref.removeEventListener('scroll', handleThumbPosition);
      };
    }
  }, []);

  // Listen for mouse events to handle scrolling by dragging the thumb
  useEffect(() => {
    document.addEventListener('mousemove', handleThumbMousemove);
    document.addEventListener('mouseup', handleThumbMouseup);
    document.addEventListener('mouseleave', handleThumbMouseup);
    return () => {
      document.removeEventListener('mousemove', handleThumbMousemove);
      document.removeEventListener('mouseup', handleThumbMouseup);
      document.removeEventListener('mouseleave', handleThumbMouseup);
    };
  }, [handleThumbMousemove, handleThumbMouseup]);

  // console.log(scrollbarVisible ? `scrollbar` : `scrollbar invisible`);

  return (
    <div className={`scrollable-wrapper`}>
      <div
        ref={contentRef}
        className={`${className} scrollable`}
        id={id}
        style={style}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
      >
        {text}
        {children}
      </div>
      <div
        className={scrollbarVisible
          ? `${scrollbarClassName}`
          : `${scrollbarClassName} invisible`}
        style={scrollbarStyle}
      >
        <div
          className="scrollbar-track"
          ref={scrollTrackRef}
          onClick={handleTrackClick}
          style={{ height: `${trackHeight}px` }}
        ></div>
        <div
          className="scrollbar-thumb"
          ref={scrollThumbRef}
          onMouseDown={handleThumbMousedown}
          style={{ height: `${thumbHeight}px` }}
        ></div>
      </div>
    </div>
  );
};