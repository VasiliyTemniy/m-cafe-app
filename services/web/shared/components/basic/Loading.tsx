interface LoadingProps {
  text?: string,
  size?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large'
}

export const Loading = ({
  text,
  size = 'small'
}: LoadingProps) => (
  <div className='loading-wrapper'>
    <div className={`loading ${size}`}>
      <div className='loading-spinner'></div>
      {text && <div className="text" id='loading-text'>{text}</div>}
    </div>
  </div>
);