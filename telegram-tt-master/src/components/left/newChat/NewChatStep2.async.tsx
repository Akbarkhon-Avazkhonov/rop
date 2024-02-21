import type { FC } from '../../../lib/teact/teact';
import React from '../../../lib/teact/teact';

import type { OwnProps } from './NewChatStep2';

import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';

import Loading from '../../ui/Loading';

const NewChatStep2Async: FC<OwnProps> = (props) => {
  const NewChatStep2 = useModuleLoader(Bundles.Extra, 'NewChatStep2');

  // eslint-disable-next-line react/jsx-props-no-spreading
  return NewChatStep2 ? <NewChatStep2 {...props} /> : <Loading />;
};

export default NewChatStep2Async;
