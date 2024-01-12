import type { ContainerProps } from './Container';
import type { MouseEvent as ReactMouseEvent, RefObject, CSSProperties } from 'react';
import {
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react';
import { useInitLC } from '@m-market-app/frontend-logic/shared/hooks';
import { debounceResizeObserver } from '@m-market-app/frontend-logic/utils';

interface ScrollableProps extends ContainerProps {
  wrapperClassNameAddon?: string;
  wrapperId?: string;
  wrapperRef?: RefObject<HTMLDivElement>;
  wrapperStyle?: CSSProperties;
  highlightScrollbarOnContentHover?: boolean;
  heightTweak?: number;
}

export const Scrollable = ({
  classNameOverride,
  classNameAddon,
  wrapperClassNameAddon,
  id,
  wrapperId,
  wrapperRef,
  wrapperStyle,
  children,
  onClick,
  onMouseEnter,
  onMouseMove,
  onMouseDown,
  onMouseLeave,
  onMouseUp,
  text,
  style,
  highlightScrollbarOnContentHover = true,
  heightTweak = 0
}: ScrollableProps) => {

  const contentRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const scrollThumbRef = useRef<HTMLDivElement>(null);
  const scrollbarWrapperTrackRef = useRef<HTMLDivElement>(null);
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

  const { className: contentClassName, style: contentSettingsStyle } = useInitLC({
    componentType: 'wrapper',
    componentName: 'scrollable',
    classNameAddon,
    classNameOverride,
  });

  const handleResize = (ref: HTMLDivElement, scrollbarOffsetTop: number) => {
    const { clientHeight, scrollHeight, offsetTop: contentOffsetTop } = ref;
    /** 
     * Below is result of hand-picked params, offsets are usually not in calculations for scrollbars,
     * But in this case - contentOffsetTop is a result of content's css margin, if margin is zero, contentOffsetTop is zero
     * scrollbarOffsetTop is result of scrollbar's css 'top' parameter for position: absolute
     * heightTweak is a correction workaround for some edge-cases
     * Please, do not ask me why there is division and multiplication by two. It works
     */
    setThumbHeight(
      Math.max(
        ((clientHeight - scrollbarOffsetTop - heightTweak + (contentOffsetTop / 2)) / scrollHeight) *
        (clientHeight - scrollbarOffsetTop - heightTweak + (contentOffsetTop / 2)),
        20
      )
    );
    setTrackHeight(clientHeight - 2 * scrollbarOffsetTop - 2 * heightTweak + contentOffsetTop);
    setScrollbarVisible((clientHeight < scrollHeight) && (clientHeight > 20));
  };

  const handleTrackClick = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
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
  }, [thumbHeight]);

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
    if (scrollThumbRef.current && !scrollThumbRef.current.classList.contains('clicked')) {
      scrollThumbRef.current.classList.add('clicked');
    }
    setIsDragging(true);
  }, []);

  const handleThumbMouseup = useCallback((e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      if (scrollThumbRef.current && scrollThumbRef.current.classList.contains('clicked')) {
        scrollThumbRef.current.classList.remove('clicked');
      }
      setIsDragging(false);
    }
  }, [isDragging]);

  const handleThumbMousemove = useCallback((e: MouseEvent) => {
    if (isDragging && contentRef.current && scrollStartPosition) {
      e.preventDefault();
      e.stopPropagation();
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
  }, [isDragging, scrollStartPosition, thumbHeight]);

  // If the content and the scrollbar track exist, use a ResizeObserver to adjust height of thumb and listen for scroll event to move the thumb
  useEffect(() => {
    if (contentRef.current && scrollTrackRef.current && scrollbarWrapperTrackRef.current) {
      const ref = contentRef.current;
      const scrollbarOffsetTop = scrollbarWrapperTrackRef.current.offsetTop;
      observer.current = new ResizeObserver(debounceResizeObserver(() => {
        handleResize(ref, scrollbarOffsetTop);
      }, 30));
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

  const handleWrapperMouseEnter = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (scrollbarWrapperTrackRef.current) {
      if (!scrollbarWrapperTrackRef.current.classList.contains('hovered'))
        scrollbarWrapperTrackRef.current.classList.add('hovered');
    }
  };

  const handleWrapperMouseLeave = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (scrollbarWrapperTrackRef.current) {
      if (scrollbarWrapperTrackRef.current.classList.contains('hovered'))
        scrollbarWrapperTrackRef.current.classList.remove('hovered');
    }
  };

  let wrapperClassNameSum = 'scrollable-wrapper';
  wrapperClassNameSum += wrapperClassNameAddon ? ' ' + wrapperClassNameAddon : '';
  wrapperClassNameSum += !highlightScrollbarOnContentHover ? ' without-before' : '';

  return (
    <div
      ref={wrapperRef}
      className={wrapperClassNameSum}
      id={wrapperId}
      onMouseEnter={highlightScrollbarOnContentHover ? handleWrapperMouseEnter : () => null}
      onMouseLeave={highlightScrollbarOnContentHover ? handleWrapperMouseLeave : () => null}
      style={wrapperStyle}
    >
      <div
        ref={contentRef}
        className={contentClassName}
        id={id}
        style={{ ...style, ...contentSettingsStyle }}
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
        ref={scrollbarWrapperTrackRef}
        style={scrollbarStyle}
        onMouseEnter={highlightScrollbarOnContentHover ? () => null : handleWrapperMouseEnter}
        onMouseLeave={highlightScrollbarOnContentHover ? () => null : handleWrapperMouseLeave}
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