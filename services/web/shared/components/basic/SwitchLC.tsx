import { SwitchLCProps } from '@m-cafe-app/frontend-logic/src/shared/components';


export const SwitchLC = ({
  className,
  textLeft,
  textRight,
  checked,
  id
}: SwitchLCProps) => (
  <div className={className}>
    <input
      type="checkbox"
      className="switch-checkbox"
      name={id}
      id={id}
      checked={checked}
      readOnly={true}
    />
    <label className="switch-label" htmlFor={id}>
      <span className="switch-inner" data-textleft={textLeft} data-textright={textRight} />
      <span className="switch-switch" />
    </label>
  </div>
);