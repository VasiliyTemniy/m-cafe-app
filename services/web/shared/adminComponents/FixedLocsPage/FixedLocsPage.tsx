import type { MouseEvent } from 'react';
import type { EditFixedLocFormValues } from './EditFixedLocForm';
import { useState } from 'react';
import { useAppSelector } from '@m-cafe-app/frontend-logic/admin/hooks';
import { useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { Container, Dropbox, Modal, Table, TextComp } from 'shared/components';
import { EditFixedLocForm } from './EditFixedLocForm';

export const FixedLocsPage = () => {

  const { t } = useTranslation();
  const tNode = 'fixedLocsPage';

  const [chosenNamespace, setChosenNamespace] = useState('all');
  const [editFixedLocModalOpen, setEditFixedLocModalOpen] = useState(false);
  const [chosenFixedLoc, setChosenFixedLoc] = useState<EditFixedLocFormValues & {id: number, name: string}>({
    id: 0, name: '', mainStr: '', secStr: '', altStr: ''
  });

  const parsedFixedLocs = useAppSelector(state => state.fixedLocs.parsedFixedLocs);
  const dbFixedLocs = useAppSelector(state => state.fixedLocs.dbFixedLocs);
  const fixedLocsNamespaces = Object.keys(parsedFixedLocs);

  const handleChooseNamespace = (e: MouseEvent<HTMLDivElement>) => {
    setChosenNamespace(e.currentTarget.id);
  };

  const handleTableItemClick = (e: MouseEvent) => {
    const fixedLocToEdit = tableItems.find(item => item.id === Number(e.currentTarget.id));
    if (!fixedLocToEdit) return;

    setChosenFixedLoc(fixedLocToEdit);
    setEditFixedLocModalOpen(true);
  };

  const handleUpdateFixedLoc = () => {

  };

  const filteredFixedLocs = chosenNamespace === 'all'
    ? dbFixedLocs
    : parsedFixedLocs[chosenNamespace];

  const tableColumns = [
    'id',
    t(`${tNode}.name`),
    t(`${tNode}.main`),
    t(`${tNode}.sec`),
    t(`${tNode}.alt`)
  ];

  const tableItems = filteredFixedLocs.map(fixedLoc => {
    return {
      id: fixedLoc.id,
      name: fixedLoc.name,
      mainStr: fixedLoc.locString.mainStr,
      secStr: fixedLoc.locString.secStr,
      altStr: fixedLoc.locString.altStr,
    };
  });

  return (
    <>
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
          <Table
            tableName='fixed-locs'
            columns={tableColumns}
            items={tableItems}
            onItemClick={handleTableItemClick}
          />
        </Container>
      </Container>
      <Modal
        id='edit-fixed-loc'
        active={editFixedLocModalOpen}
        title={t(`${tNode}.editFixedLocModal.title`)}
        withBlur={true}
      >
        <div className='item-info'>
          {/* <div className='item-info-group'> */}
          <TextComp text={`id`} htmlEl='span' classNameAddon='bold'/>
          <TextComp text={`${chosenFixedLoc.id}`} htmlEl='span'/>
          {/* </div>
          <div className='item-info-group'> */}
          <TextComp text={t(`${tNode}.name`)} htmlEl='span' classNameAddon='bold'/>
          <TextComp text={chosenFixedLoc.name} htmlEl='span'/>
          {/* </div> */}
        </div>
        <EditFixedLocForm
          initialValues={chosenFixedLoc}
          onSubmit={handleUpdateFixedLoc}
          onDelete={() => null}
          onCancel={() => setEditFixedLocModalOpen(false)}
        />
      </Modal>
    </>
  );

};