import type { MouseEventHandler, MouseEvent } from "react";
import type { CommonProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC, useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { TextComp } from "./TextComp";
import { Image } from "./Image";
import { Switch } from "./Switch";
import { apiBaseUrl } from "@m-cafe-app/shared-constants";
import { collapseExpanded } from "@m-cafe-app/frontend-logic/utils";
import { Scrollable } from "./Scrollable";


interface FiltersboxProps extends CommonProps {
  options: Array<{
    name: string,
    checked: boolean
  }>;
  onChoose: MouseEventHandler;
  label: string;
  tNode?: string
}


export const Filtersbox = ({
  classNameOverride,
  classNameAddon,
  id,
  options,
  onChoose,
  tNode,
  label
}: FiltersboxProps) => {

  const { t } = useTranslation();

  const { className, style, specific } = useInitLC({
    componentType: 'dropbox',
    componentName: 'filtersbox',
    classNameAddon,
    classNameOverride,
  });

  const handleFiltersboxClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.parentElement)
      if (!e.currentTarget.parentElement.classList.contains('expanded')) {
        e.stopPropagation();
        collapseExpanded();
        e.currentTarget.parentElement.classList.add('expanded');
      } else {
        e.stopPropagation();
        e.currentTarget.parentElement.classList.remove('expanded');
      }
  };

  return (
    <div className={className} id={id} style={style}>
      <div className='chosen-wrapper' onClick={handleFiltersboxClick}>
        <TextComp text={label}/>
        <Image src={`${apiBaseUrl}/public/pictures/svg/notificationdown.svg`}/>
        <>
          {specific?.useBarBelow &&
            <div className='bar'/>
          }
        </>
      </div>
      <div className='dropdown-wrapper'>
        <Scrollable classNameOverride='options-wrapper filters'>
          {options.map(option =>
            <div key={`${option.name} filter-option`} onClick={onChoose} className='option' id={option.name}>
              <div>
                { tNode ? t(`${tNode}.${option.name}`) : option.name }
              </div>
              <Switch checked={option.checked} id={`${option.name}-switch`} onClick={() => null}/>
            </div>
          )}
        </Scrollable>
        <>
          {options.length > 0 && specific?.useBarBelow &&
          <div className='bar-after'/>
          }
        </>
      </div>
    </div>
  );
};