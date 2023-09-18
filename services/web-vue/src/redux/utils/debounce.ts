export const debounceResizeObserver = (callback: ResizeObserverCallback, delay: number) => {

  let timer: ReturnType<typeof setTimeout> | undefined;

  return (entries: ResizeObserverEntry[], observer: ResizeObserver) => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
    timer = setTimeout(() => callback(entries, observer), delay);
  };
};

export const throttleResizeObserver = (callback: ResizeObserverCallback, delay: number) => {

  let enableCall = true;

  return (entries: ResizeObserverEntry[], observer: ResizeObserver) => {

    if (!enableCall) return;

    enableCall = false;
    callback(entries, observer);

    setTimeout(() => enableCall = true, delay);
  };
};

export const debounceMouseEvent = (callback: (e: MouseEvent) => void, delay: number, preventExecution = false) => {

  let timer: ReturnType<typeof setTimeout> | undefined;

  return (e: MouseEvent) => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
    if (preventExecution) return;
    timer = setTimeout(() => callback(e), delay);
  };
};