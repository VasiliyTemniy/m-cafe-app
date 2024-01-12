import type { MouseEvent } from 'react';
// import type { UiSettingDT } from '@m-market-app/utils';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@m-market-app/frontend-logic/admin/hooks';
import { useTranslation } from '@m-market-app/frontend-logic/shared/hooks';
import { Button, ButtonGroup, Container, Dropbox, Table, TextComp } from 'shared/components';
import {
  parseUiSettings,
  // sendReserveUiSetting,
  // sendResetUiSettings,
  sendUpdUiSettings,
  // updParsedUiSetting
} from '@m-market-app/frontend-logic/admin/reducers';

export const UiSettingsPage = () => {

  const { t } = useTranslation();
  const tNode = 'uiSettingsPage';

  const dispatch = useAppDispatch();

  const [chosenUiNode, setChosenUiNode] = useState('all');
  // const [editUiSettingModalOpen, setEditUiSettingModalOpen] = useState(false);
  // const [chosenUiSetting, setChosenUiSetting] = useState<UiSettingDT>({ id: 0, name: '', value: '' });

  const parsedUiSettings = useAppSelector(state => state.settings.parsedUiSettings);
  const dbUiSettings = useAppSelector(state => state.settings.dbUiSettings);
  const uiSettingsUiNodes = Object.keys(parsedUiSettings);

  const handleChooseUiNode = (e: MouseEvent<HTMLDivElement>) => {
    setChosenUiNode(e.currentTarget.id);
  };

  const handleTableItemClick = (e: MouseEvent) => {
    if (chosenUiNode === 'all') return;
    const uiSettingToEdit = parsedUiSettings[chosenUiNode].find(loc => loc.id === Number(e.currentTarget.id));
    if (!uiSettingToEdit) return;

    // setChosenUiSetting(uiSettingToEdit);
    // setEditUiSettingModalOpen(true);
  };

  // const handleUpdateUiSetting = (values: EditUiSettingFormValues) => {
  //   const uiSettingToUpdate: UiSettingDT = {
  //     id: chosenUiSetting.id,
  //     name: chosenUiSetting.name,
  //     ...values
  //   };
  //   dispatch(updParsedUiSetting({ uiSetting: uiSettingToUpdate, uiNode: chosenUiNode}));
  //   setEditUiSettingModalOpen(false);
  // };

  // const handleReserveUiSetting = () => {
  //   void dispatch(sendReserveUiSetting(chosenUiSetting.id, t));
  //   setEditUiSettingModalOpen(false);
  // };

  const handleApplyChanges = () => {
    void dispatch(sendUpdUiSettings(parsedUiSettings, t));
  };

  const handleRevertChanges = () => {
    dispatch(parseUiSettings({ uiSettings: dbUiSettings }));
  };

  const handleResetUiSettings = () => {
    const confirmReset = confirm(t('alert.reset'));
    if (!confirmReset) return;
    // void dispatch(sendResetUiSettings(t));
  };

  const filteredUiSettings = chosenUiNode === 'all'
    ? dbUiSettings
    : parsedUiSettings[chosenUiNode];

  const tableColumns = [
    'id',
    t(`${tNode}.name`),
    t(`${tNode}.main`),
    t(`${tNode}.sec`),
    t(`${tNode}.alt`)
  ];

  const tableItems = filteredUiSettings.map(uiSetting => {
    return {
      id: uiSetting.id,
      name: uiSetting.name,
      value: uiSetting.value
    };
  });

  return (
    <>
      <Container classNameAddon='first-layer'>
        <div className='ui-settings-header'>
          <TextComp text={t(`${tNode}.title`)} classNameAddon='title'/>
          <div className='ui-settings-header-tools'>
            <Dropbox
              options={[ ...uiSettingsUiNodes, 'all' ]}
              label={t(`${tNode}.uiNodesBox`)}
              currentOption={chosenUiNode}
              onChoose={handleChooseUiNode}
              id='uiNodes-box'
            />
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
                onClick={handleResetUiSettings}
                variant='delete'
              />
            </div>
          </div>
        </div>
        <Container classNameAddon='second-layer'>
          <Table
            tableName='ui-settings'
            columns={tableColumns}
            items={tableItems}
            onItemClick={handleTableItemClick}
            classNameAddon={chosenUiNode === 'all' ? 'no-pointer' : undefined}
          />
        </Container>
      </Container>
      {/* <Modal
        id='edit-fixed-loc'
        active={editUiSettingModalOpen}
        title={t(`${tNode}.editUiSettingModal.title`)}
        withBlur={true}
      >
        <div className='item-info'>
          <TextComp text={`id`} htmlEl='span' classNameAddon='bold'/>
          <TextComp text={`${chosenUiSetting.id}`} htmlEl='span'/>
          <TextComp text={t(`${tNode}.uiNode`)} htmlEl='span' classNameAddon='bold'/>
          <TextComp text={chosenUiNode} htmlEl='span'/>
          <TextComp text={t(`${tNode}.name`)} htmlEl='span' classNameAddon='bold'/>
          <TextComp text={chosenUiSetting.name} htmlEl='span'/>
        </div>
        <EditUiSettingForm
          uiSetting={chosenUiSetting}
          onSubmit={handleUpdateUiSetting}
          onDelete={handleReserveUiSetting}
          onCancel={() => setEditUiSettingModalOpen(false)}
        />
      </Modal> */}
    </>
  );
};