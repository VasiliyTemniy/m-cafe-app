import type { MouseEvent } from 'react';
import type { EditFixedLocFormValues } from './EditFixedLocForm';
import type { FixedLocDT } from '@m-cafe-app/utils';
import { useState, useDeferredValue } from 'react';
import { useAppDispatch, useAppSelector } from '@m-cafe-app/frontend-logic/admin/hooks';
import { useTranslation } from '@m-cafe-app/frontend-logic/shared/hooks';
import { Button, ButtonGroup, Container, Dropbox, Input, Modal, Table, TextComp } from 'shared/components';
import { EditFixedLocForm } from './EditFixedLocForm';
import {
  parseFixedLocs,
  sendReserveFixedLoc,
  sendResetFixedLocs,
  sendUpdFixedLocs,
  updParsedFixedLoc
} from '@m-cafe-app/frontend-logic/admin/reducers';
import { parseFixedLoc } from '@m-cafe-app/frontend-logic/utils';

export const FixedLocsPage = () => {

  const { t } = useTranslation();
  const tNode = 'fixedLocsPage';

  const dispatch = useAppDispatch();

  const [fixedLocFilter, setFixedLocFilter] = useState('');
  const deferredFilter = useDeferredValue(fixedLocFilter);
  const [chosenNamespace, setChosenNamespace] = useState('all');
  const [editFixedLocModalOpen, setEditFixedLocModalOpen] = useState(false);
  const [chosenFixedLoc, setChosenFixedLoc] = useState<FixedLocDT>({
    id: 0, name: '', locString: { id: 0, mainStr: '', secStr: '', altStr: '' }
  });

  const parsedFixedLocs = useAppSelector(state => state.fixedLocs.parsedFixedLocs);
  const dbFixedLocs = useAppSelector(state => state.fixedLocs.dbFixedLocs);
  const fixedLocsNamespaces = Object.keys(parsedFixedLocs);

  const handleChooseNamespace = (e: MouseEvent<HTMLDivElement>) => {
    setChosenNamespace(e.currentTarget.id);
  };

  const handleTableItemClick = (e: MouseEvent) => {
    // if (chosenNamespace === 'all') return;
    // const fixedLocToEdit = parsedFixedLocs[chosenNamespace].find(loc => loc.id === Number(e.currentTarget.id));
    // if (!fixedLocToEdit) return;

    const foundFixedLoc = chosenNamespace === 'all'
      ? dbFixedLocs.find(loc => loc.id === Number(e.currentTarget.id))
      : parsedFixedLocs[chosenNamespace].find(loc => loc.id === Number(e.currentTarget.id));
    if (!foundFixedLoc) return;

    if (chosenNamespace === 'all') {
      const { parsedFixedLoc, namespace } = parseFixedLoc(foundFixedLoc);
      setChosenNamespace(namespace);
      setChosenFixedLoc(parsedFixedLoc);
    } else {
      setChosenFixedLoc(foundFixedLoc);
    }
    setEditFixedLocModalOpen(true);
  };

  const handleUpdateFixedLoc = (values: EditFixedLocFormValues) => {
    const fixedLocToUpdate: FixedLocDT = {
      id: chosenFixedLoc.id,
      name: chosenFixedLoc.name,
      locString: {
        id: chosenFixedLoc.locString.id,
        ...values
      }
    };
    dispatch(updParsedFixedLoc({ fixedLoc: fixedLocToUpdate, namespace: chosenNamespace}));
    setEditFixedLocModalOpen(false);
  };

  const handleReserveFixedLoc = () => {
    void dispatch(sendReserveFixedLoc(chosenFixedLoc.id, t));
    setEditFixedLocModalOpen(false);
  };

  const handleApplyChanges = () => {
    void dispatch(sendUpdFixedLocs(parsedFixedLocs, t));
  };

  const handleRevertChanges = () => {
    dispatch(parseFixedLocs({ fixedLocs: dbFixedLocs }));
  };

  const handleResetFixedLocs = () => {
    const confirmReset = confirm(t('alert.reset'));
    if (!confirmReset) return;
    void dispatch(sendResetFixedLocs(t));
  };

  const namespacesFixedLocs = chosenNamespace === 'all'
    ? dbFixedLocs
    : parsedFixedLocs[chosenNamespace];

  const filteredFixedLocs = deferredFilter === ''
    ? namespacesFixedLocs
    : namespacesFixedLocs.filter(loc => loc.name.toLowerCase().includes(deferredFilter.toLowerCase()));

  const tableColumns = [
    'id',
    // t(`${tNode}.namespace`),
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
            <div className='inputs'>
              <Dropbox
                options={[ ...fixedLocsNamespaces, 'all' ]}
                label={t(`${tNode}.namespacesBox`)}
                currentOption={chosenNamespace}
                onChoose={handleChooseNamespace}
                id='namespaces-box'
              />
              <Input
                onChange={e => setFixedLocFilter(e.target.value)}
                value={fixedLocFilter}
                placeholder={t(`${tNode}.placeholder.filter`)}
                label={t(`${tNode}.label.filter`)}
                id='fixed-locs-filter-box'
                type='text'
                name='fixed-locs-filter'
              />
            </div>
            <div className='buttons'>
              <ButtonGroup>
                <Button
                  label={t('main.buttonLabel.applyChanges')}
                  onClick={handleApplyChanges}
                  variant='primary'
                />
                <Button
                  label={t('main.buttonLabel.revertChanges')}
                  onClick={handleRevertChanges}
                  variant='secondary'
                />
              </ButtonGroup>
              <Button
                label={t('main.buttonLabel.resetAll')}
                onClick={handleResetFixedLocs}
                variant='delete'
              />
            </div>
          </div>
        </div>
        <Container classNameAddon='second-layer'>
          <Table
            tableName='fixed-locs'
            columns={tableColumns}
            items={tableItems}
            onItemClick={handleTableItemClick}
            // classNameAddon={chosenNamespace === 'all' ? 'no-pointer' : undefined}
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
          <TextComp text={`id`} htmlEl='span' classNameAddon='bold'/>
          <TextComp text={`${chosenFixedLoc.id}`} htmlEl='span'/>
          <TextComp text={t(`${tNode}.namespace`)} htmlEl='span' classNameAddon='bold'/>
          <TextComp text={chosenNamespace} htmlEl='span'/>
          <TextComp text={t(`${tNode}.name`)} htmlEl='span' classNameAddon='bold'/>
          <TextComp text={chosenFixedLoc.name} htmlEl='span'/>
        </div>
        <EditFixedLocForm
          fixedLoc={chosenFixedLoc}
          onSubmit={handleUpdateFixedLoc}
          onDelete={handleReserveFixedLoc}
          onCancel={() => setEditFixedLocModalOpen(false)}
        />
      </Modal>
    </>
  );

};