import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useAppSelector } from '@m-cafe-app/frontend-logic/admin/hooks';
import { useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { Container, Dropbox, Table, TextComp } from 'shared/components';

export const FixedLocsPage = () => {

  const { t } = useTranslation();
  const tNode = 'fixedLocsPage';

  const [chosenNamespace, setChosenNamespace] = useState('all');

  const parsedFixedLocs = useAppSelector(state => state.fixedLocs.parsedFixedLocs);
  const dbFixedLocs = useAppSelector(state => state.fixedLocs.dbFixedLocs);
  const fixedLocsNamespaces = Object.keys(parsedFixedLocs);

  const handleChooseNamespace = (e: MouseEvent<HTMLDivElement>) => {
    setChosenNamespace(e.currentTarget.id);
  };

  const filteredFixedLocs = chosenNamespace === 'all'
    ? dbFixedLocs
    : parsedFixedLocs[chosenNamespace];

  const tableColumns = [
    'id',
    t(`${tNode}.fixedLocsTable.name`),
    t(`${tNode}.fixedLocsTable.main`),
    t(`${tNode}.fixedLocsTable.sec`),
    t(`${tNode}.fixedLocsTable.alt`)
  ];

  const tableItems = filteredFixedLocs.map(fixedLoc => {
    return {
      id: fixedLoc.id,
      name: fixedLoc.name,
      main: fixedLoc.locString.mainStr,
      sec: fixedLoc.locString.secStr,
      alt: fixedLoc.locString.altStr,
    };
  });

  return (
    <Container classNameAddon='first-layer'>
      <div className='fixed-locs-header'>
        <TextComp text={t(`${tNode}.title`)} classNameAddon='title'/>
        <div className='fixed-locs-header-tools'>
          <Dropbox
            options={[ ...fixedLocsNamespaces, 'all' ]}
            label={t(`${tNode}.namespacesBox`)}
            currentOption={chosenNamespace}
            onChoose={handleChooseNamespace}
            id='namespaces-box'
          />
        </div>
      </div>
      <Container classNameAddon='second-layer'>
        {/* {filteredFixedLocs.map(fixedLoc => <div key={`loc-${fixedLoc.id}`}>{fixedLoc.name}</div>)} */}
        <Table
          tableName='fixed-locs'
          columns={tableColumns}
          items={tableItems}
        />
      </Container>
    </Container>
  );

};