import type { MouseEventHandler, MouseEvent } from 'react';
import type { CommonProps } from '@m-cafe-app/frontend-logic/types';
import { useInitLC, useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { Image } from './Image';
import { apiBaseUrl } from '@m-cafe-app/shared-constants';
import { collapseExpanded } from '@m-cafe-app/frontend-logic/utils';
import { Scrollable } from './Scrollable';

interface DropboxProps extends CommonProps {
  options: string[];
  currentOption: string;
  onChoose: MouseEventHandler;
  label: string;
  tNode?: string;
}

export const Dropbox = ({
  classNameOverride,
  classNameAddon,
  id,
  options,
  currentOption,
  onChoose,
  tNode,
  label
}: DropboxProps) => {

  const { t } = useTranslation();

  const { className, style, specific } = useInitLC({
    componentType: 'dropbox',
    componentName: 'dropbox',
    classNameAddon,
    classNameOverride,
  });

  const handleDropboxClick = (e: MouseEvent<HTMLDivElement>) => {
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
      <div className='chosen-wrapper' onClick={handleDropboxClick}>
        <div className='chosen-option'>{tNode ? t(`${tNode}.${currentOption}`) : currentOption}</div>
        <>
          {!!label && <label htmlFor={id}>{label}</label>}
          <Image src={`${apiBaseUrl}/public/pictures/svg/arrow.svg`} classNameAddon='svg'/>
          {specific?.useBarBelow &&
            <div className='bar'/>
          }
        </>
      </div>
      <div className='dropdown-wrapper'>
        <Scrollable classNameAddon='options-wrapper' heightTweak={4} highlightScrollbarOnContentHover={false}>
          {options.map(option => 
            <div key={option} onClick={onChoose} id={option} className='option'>
              { tNode ? t(`${tNode}.${option}`) : option }
            </div>)
          }
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