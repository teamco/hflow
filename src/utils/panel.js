import React from 'react';
import { logger } from '@/utils/console';

/**
 * @export
 * @constant
 * @param {string} type
 * @param props
 */
export const handleUpdatePanel = (type, props = {}) => {
  const {
    component,
    model,
    header,
    loading,
    onUpdateSider,
    onReload,
    visible = false,
    render,
    position
  } = props;

  const name = `${component}.${type}`;

  visible && onUpdateSider({
    currentPanel: name,
    [name]: {
      loading,
      visible,
      name,
      model,
      onReload,
      position,
      render,
      header: (<h1>{header}</h1>)
    }
  });
};

/**
 * @export
 * @param siderPanels
 * @param {boolean} [visible]
 * @return {boolean}
 */
export const isPanelVisible = (siderPanels, visible = false) => {
  if (!visible && siderPanels.currentPanel) {
    const _panel = siderPanels[siderPanels.currentPanel];
    return !!_panel?.visible;
  }

  return visible;
};

/**
 * @export
 * @constant
 * @param siderPanels
 * @param payload
 * @returns {{currentPanel: *}|{currentPanel: *, panel: *}|{}}
 * @private
 */
export const getSiderPanel = (siderPanels, payload) => {
  const { currentPanel = siderPanels.currentPanel } = payload;
  const panel = payload[currentPanel] || siderPanels[currentPanel];

  if (currentPanel && panel) {
    DEBUG && logger({ type: 'info', log: panel });
    return { currentPanel, panel };
  }

  return {};
};