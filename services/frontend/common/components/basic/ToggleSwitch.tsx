interface ToggleSwitchProps {
  textLeft?: string;
  textRight?: string;
  checked: boolean;
  id?: string;
}

const ToggleSwitch = ({ textLeft, textRight, checked, id }: ToggleSwitchProps) => (
  <div className="toggle-switch">
    <input
      type="checkbox"
      className="toggle-switch-checkbox"
      name={id}
      id={id}
      checked={checked}
      readOnly={true}
    />
    <label className="toggle-switch-label" htmlFor={id}>
      <span className="toggle-switch-inner" data-textleft={textLeft} data-textright={textRight} />
      <span className="toggle-switch-switch" />
    </label>
  </div>
);

export default ToggleSwitch;