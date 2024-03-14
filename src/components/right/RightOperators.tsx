import type { FC } from '../../lib/teact/teact';
import React, {
  memo,
  useEffect,
} from '../../lib/teact/teact';
import { getActions, withGlobal } from '../../global';

import type { ApiMessage } from '../../api/types';

import { disableDirectTextInput, enableDirectTextInput } from '../../util/directInputManager';

import useHistoryBack from '../../hooks/useHistoryBack';

import './RightSearch.scss';

export type OwnProps = {
  onClose: NoneToVoidFunction;
  isActive: boolean;
};

type StateProps = {
  messagesById?: Record<number, ApiMessage>;
  query?: string;
  totalCount?: number;
  foundIds?: number[];
  isSavedMessages?: boolean;
};

const RightOperators: FC<OwnProps & StateProps> = ({

  isActive,
  onClose,
}) => {
  const {

  } = getActions();

  // eslint-disable-next-line no-null/no-null

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    disableDirectTextInput();

    return enableDirectTextInput;
  }, [isActive]);

  return (
    <div>hiiiii</div>
  );
};

export default memo(withGlobal<OwnProps>()(RightOperators));
